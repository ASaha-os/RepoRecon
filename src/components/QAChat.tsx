/**
 * QAChat — sticky bottom input + chat history (spec §4)
 * Starter question chips. Markdown-lite rendering. Copy per response.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Copy, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { askAboutRepo } from "@/lib/puterAI";
import { LoadingDots } from "./LoadingDots";
import type { AnalysisData } from "@/lib/puterAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface QAChatProps {
  repoUrl: string;
  analysisData: AnalysisData;
}

const STARTERS = [
  "Where is auth handled?",
  "What does the main service do?",
  "Are there any security concerns?",
  "What dependencies should be updated?",
];

/** Very light markdown: bold, inline code, line breaks */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    // Split on **bold** and `code`
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pi}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={pi}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9em",
              background: "var(--bg-hover)",
              padding: "1px 5px",
              borderRadius: 3,
              color: "var(--text-primary)",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
    return (
      <React.Fragment key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export const QAChat: React.FC<QAChatProps> = ({ repoUrl, analysisData }) => {
  const repoName = repoUrl.split("/").slice(-2).join("/");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Ask me anything about **${repoName}** — architecture, security, data flow, or what to fix first.`,
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || loading) return;

      setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: q }]);
      setInput("");
      setLoading(true);

      try {
        const answer = await askAboutRepo(q, analysisData, repoUrl);
        setMessages((p) => [
          ...p,
          { id: `a-${Date.now()}`, role: "assistant", content: answer },
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Request failed";
        toast.error(msg.includes("timed out") ? "Analysis taking longer than usual. Retrying…" : msg);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, analysisData, repoUrl]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Ask about this repository
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              gap: 10,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Bot size={14} color="var(--text-secondary)" />
              </div>
            )}

            <div
              style={{
                maxWidth: "78%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)"
                      : "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
                  background:
                    msg.role === "user" ? "var(--accent)" : "var(--bg-tertiary)",
                  color:
                    msg.role === "user" ? "var(--bg-primary)" : "var(--text-primary)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  border:
                    msg.role === "assistant" ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                {renderMarkdown(msg.content)}
              </div>

              {/* Copy button for assistant messages */}
              {msg.role === "assistant" && msg.id !== "welcome" && (
                <button
                  onClick={() => handleCopy(msg.content)}
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 8px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-tertiary)",
                    fontSize: "var(--text-xs)",
                    cursor: "pointer",
                    fontFamily: "var(--font-ui)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
                  }}
                >
                  <Copy size={10} />
                  Copy
                </button>
              )}
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <User size={14} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={14} color="var(--text-secondary)" />
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <LoadingDots size={5} color="var(--text-tertiary)" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Starter chips — shown only before first user message */}
      {messages.length === 1 && (
        <div
          style={{
            padding: "0 16px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {STARTERS.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={loading}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-ui)",
                transition: "border-color var(--transition-fast), color var(--transition-fast)",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row — sticky bottom */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          flexShrink: 0,
          background: "var(--bg-secondary)",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask a question… (Enter to send, Shift+Enter for newline)"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            fontSize: "var(--text-sm)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            outline: "none",
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: "auto",
            transition: "border-color var(--transition-fast)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        <button
          onClick={() => ask(input)}
          disabled={loading || !input.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: loading || !input.trim() ? "var(--bg-tertiary)" : "var(--accent)",
            border: "1px solid var(--border)",
            color: loading || !input.trim() ? "var(--text-tertiary)" : "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "background var(--transition-fast), color var(--transition-fast)",
          }}
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

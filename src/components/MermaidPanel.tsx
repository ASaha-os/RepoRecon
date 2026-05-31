/**
 * MermaidPanel — diagram renderer with type selector + action buttons (spec §4)
 * Lazy-loads mermaid. Shows raw code + "Try to fix" on render failure.
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Copy, Download, Save, RefreshCw, ChevronDown } from "lucide-react";
import { LoadingDots } from "./LoadingDots";
import { toast } from "sonner";

export type DiagramType = "flowchart" | "sequence" | "er" | "class";

interface MermaidPanelProps {
  code: string;
  onFixRequest?: () => void;
  onSaveToPuter?: (svg: string) => void;
  defaultType?: DiagramType;
}

const TYPE_LABELS: Record<DiagramType, string> = {
  flowchart: "Flowchart",
  sequence:  "Sequence",
  er:        "ER",
  class:     "Class",
};

export const MermaidPanel: React.FC<MermaidPanelProps> = ({
  code,
  onFixRequest,
  onSaveToPuter,
  defaultType = "flowchart",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg]           = useState<string>("");
  const [renderError, setRenderError] = useState<string>("");
  const [isRendering, setIsRendering] = useState(true);
  const [typeOpen, setTypeOpen] = useState(false);
  const [activeType, setActiveType] = useState<DiagramType>(defaultType);

  /** Sanitize AI-generated mermaid code to fix common issues */
  const sanitizeMermaidCode = useCallback((rawCode: string): string => {
    let code = rawCode;

    // 1. Strip markdown fences if wrapped in ```mermaid ... ```
    const fenced = code.match(/```(?:mermaid)?\s*\n?([\s\S]*?)```/);
    if (fenced) code = fenced[1];

    // 2. Unescape string-escaped newlines & tabs (AI returns \\n as literal backslash-n)
    code = code
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "  ");

    // 3. Remove BOM, zero-width chars, and carriage returns
    code = code
      .replace(/\uFEFF/g, "")
      .replace(/[\u200B\u200C\u200D]/g, "")
      .replace(/\r/g, "");

    // 4. Fix common arrow syntax issues from AI
    code = code
      .replace(/—>/g, "-->")          // em-dash arrow
      .replace(/<—/g, "<--")          // reverse em-dash
      .replace(/=>/g, "-->")          // fat arrow
      .replace(/─>/g, "-->");         // horizontal line arrow

    // 5. Ensure diagram starts with a valid directive
    const trimmed = code.trim();
    const validStarts = [
      "flowchart", "graph", "sequenceDiagram", "classDiagram",
      "stateDiagram", "erDiagram", "gantt", "pie", "mindmap",
      "timeline", "gitGraph", "journey",
    ];
    const hasValidStart = validStarts.some((s) => trimmed.startsWith(s));
    if (!hasValidStart) {
      if (trimmed.includes("-->") || trimmed.includes("---") || trimmed.includes("[")) {
        code = "flowchart TD\n" + trimmed;
      }
    }

    // 6. Match open subgraphs and end statements to prevent syntax crash
    const subgraphCount = (code.match(/\bsubgraph\b/g) || []).length;
    const endCount = (code.match(/\bend\b/g) || []).length;
    if (subgraphCount > endCount) {
      code += "\n" + "end\n".repeat(subgraphCount - endCount);
    }

    // 7. Fix unescaped single quotes or single-quoted subgraphs from AI
    code = code.replace(/subgraph\s+'([^']+)'/g, 'subgraph "$1"');

    // 8. Clean up
    code = code.trim();
    return code;
  }, []);

  const renderDiagram = useCallback(async (rawCode: string) => {
    if (!rawCode?.trim()) return;
    setIsRendering(true);
    setRenderError("");
    setSvg("");

    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        darkMode: true,
        themeVariables: {
          background: "#0f0f12",
          primaryColor: "#1e293b",
          primaryTextColor: "#f0f0f5",
          primaryBorderColor: "#38bdf8",
          lineColor: "#6b6b80",
          secondaryColor: "#17171c",
          tertiaryColor: "#0f0f12",
          nodeTextColor: "#f0f0f5",
          edgeLabelBackground: "#17171c",
          clusterBkg: "#17171c",
          clusterBorder: "#27272f",
          titleColor: "#f0f0f5",
        },
      });

      const clean = sanitizeMermaidCode(rawCode);

      // Use unique ID for each render starting with a letter to be valid CSS selector
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const { svg: rendered } = await mermaid.render(id, clean);
      setSvg(rendered);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Render failed";
      // Provide a shorter, more user-friendly error
      const shortMsg = msg.length > 200 ? msg.slice(0, 200) + "…" : msg;
      setRenderError(shortMsg);
    } finally {
      setIsRendering(false);
    }
  }, [sanitizeMermaidCode]);

  useEffect(() => {
    renderDiagram(code);
  }, [code, renderDiagram]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Mermaid code copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  };

  const handleSaveToPuter = () => {
    if (!svg || !onSaveToPuter) return;
    onSaveToPuter(svg);
  };

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          gap: 8,
        }}
      >
        {/* Left: title */}
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Architecture Diagram
        </span>

        {/* Right: type selector + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Diagram type dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setTypeOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}
            >
              {TYPE_LABELS[activeType]}
              <ChevronDown size={11} />
            </button>
            {typeOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  zIndex: 20,
                  minWidth: 110,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                {(Object.keys(TYPE_LABELS) as DiagramType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setActiveType(t); setTypeOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 12px",
                      background: activeType === t ? "var(--bg-hover)" : "transparent",
                      border: "none",
                      color: activeType === t ? "var(--text-primary)" : "var(--text-secondary)",
                      fontSize: "var(--text-xs)",
                      cursor: "pointer",
                      fontFamily: "var(--font-ui)",
                    }}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <IconBtn onClick={handleCopyCode}    title="Copy Mermaid code" disabled={!code}>
            <Copy size={13} />
          </IconBtn>
          <IconBtn onClick={handleDownloadSvg} title="Download SVG"      disabled={!svg}>
            <Download size={13} />
          </IconBtn>
          {onSaveToPuter && (
            <IconBtn onClick={handleSaveToPuter} title="Save to Puter FS" disabled={!svg}>
              <Save size={13} />
            </IconBtn>
          )}
        </div>
      </div>

      {/* ── Diagram area ─────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          minHeight: 240,
          overflowX: "auto",
          overflowY: "hidden",
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        {isRendering && <LoadingDots />}

        {!isRendering && svg && (
          <div
            style={{ width: "100%", maxWidth: "100%" }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}

        {!isRendering && renderError && (
          <div style={{ width: "100%" }}>
            {/* Error banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: "var(--text-xs)", color: "var(--score-red)" }}>
                Diagram render failed — showing raw code
              </span>
              {onFixRequest && (
                <button
                  onClick={onFixRequest}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-xs)",
                    cursor: "pointer",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  <RefreshCw size={11} />
                  Try to fix
                </button>
              )}
            </div>
            {/* Raw code fallback */}
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
                padding: 12,
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Small icon button ────────────────────────────────────── */
const IconBtn: React.FC<{
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "var(--radius-sm)",
      background: "transparent",
      border: "1px solid var(--border)",
      color: disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background var(--transition-fast), color var(--transition-fast)",
      opacity: disabled ? 0.4 : 1,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      (e.currentTarget as HTMLButtonElement).style.color = disabled ? "var(--text-tertiary)" : "var(--text-secondary)";
    }}
  >
    {children}
  </button>
);

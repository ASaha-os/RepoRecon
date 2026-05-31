/**
 * RepoInput — large, focused GitHub URL input (spec §4, §5.1)
 * Shown when no analysis is active. Claude.ai home-screen energy.
 */
import React, { useState, useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LoadingDots } from "./LoadingDots";

interface RepoInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  recentRepos?: string[];
}

const EXAMPLE_REPOS = [
  "facebook/react",
  "vercel/next.js",
  "django/django",
  "microsoft/vscode",
];

export const RepoInput: React.FC<RepoInputProps> = ({
  onAnalyze,
  isLoading,
  recentRepos = [],
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return "Please enter a GitHub repository URL.";
    // Accept github.com/owner/repo or full https URL
    const hasGithub = trimmed.includes("github.com");
    const looksLikeSlug = /^[\w.-]+\/[\w.-]+$/.test(trimmed);
    if (!hasGithub && !looksLikeSlug) {
      return "Enter a GitHub URL (e.g. github.com/owner/repo).";
    }
    return "";
  };

  const normalise = (raw: string): string => {
    const t = raw.trim();
    if (t.startsWith("http")) return t;
    if (t.includes("github.com")) return `https://${t}`;
    // bare slug: owner/repo
    if (/^[\w.-]+\/[\w.-]+$/.test(t)) return `https://github.com/${t}`;
    return t;
  };

  const submit = useCallback(
    (raw: string) => {
      const err = validate(raw);
      if (err) { setError(err); return; }
      setError("");
      onAnalyze(normalise(raw));
    },
    [onAnalyze]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) submit(value);
  };

  const handleChip = (slug: string) => {
    const url = `https://github.com/${slug}`;
    setValue(url);
    setError("");
    if (!isLoading) onAnalyze(url);
  };

  const chips = recentRepos.length > 0 ? recentRepos.slice(0, 4) : EXAMPLE_REPOS;
  const chipLabel = recentRepos.length > 0 ? "Recent" : "Try";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "0 24px",
        maxWidth: "var(--panel-max-width)",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          marginBottom: 48,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "var(--accent-glow), 0 0 40px rgba(56, 189, 248, 0.15)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <img
            src="/RepoRecon-logo.png"
            alt="RepoRecon"
            style={{ width: 64, height: 64, objectFit: "contain" }}
          />
        </div>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          RepoRecon
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Paste a GitHub URL to get an instant architectural analysis.
        </p>
      </div>

      {/* Input row */}
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "var(--bg-secondary)",
            border: `1px solid ${error ? "var(--score-red)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "6px 6px 6px 16px",
            transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
            boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.12)" : "none",
          }}
          onFocus={() => {
            const el = document.getElementById("repo-input-wrap");
            if (el) el.style.borderColor = "var(--accent)";
          }}
          id="repo-input-wrap"
        >
          <input
            ref={inputRef}
            id="repo-url-input"
            type="url"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="github.com/owner/repository"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKey}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "var(--text-base)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              minWidth: 0,
              padding: "6px 0",
            }}
            aria-label="GitHub repository URL"
            aria-describedby={error ? "repo-input-error" : undefined}
          />
          <button
            onClick={() => submit(value)}
            disabled={isLoading || !value.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              background: isLoading || !value.trim() ? "var(--bg-tertiary)" : "var(--accent)",
              color: isLoading || !value.trim() ? "var(--text-tertiary)" : "var(--bg-primary)",
              border: "none",
              cursor: isLoading || !value.trim() ? "not-allowed" : "pointer",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              fontFamily: "var(--font-ui)",
              transition: "background var(--transition-fast), color var(--transition-fast)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            aria-label="Analyze repository"
            onMouseEnter={(e) => {
              if (!isLoading && value.trim()) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--accent-glow)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            {isLoading ? (
              <LoadingDots size={4} color="var(--text-tertiary)" />
            ) : (
              <>
                Analyze
                <ArrowRight size={14} strokeWidth={2} />
              </>
            )}
          </button>
        </div>

        {/* Inline error */}
        {error && (
          <p
            id="repo-input-error"
            role="alert"
            style={{
              marginTop: 8,
              fontSize: "var(--text-xs)",
              color: "var(--score-red)",
              paddingLeft: 4,
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Chips */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
          }}
        >
          {chipLabel}:
        </span>
        {chips.map((slug) => {
          const display = slug.includes("github.com")
            ? slug.replace("https://github.com/", "")
            : slug;
          return (
            <button
              key={slug}
              onClick={() => handleChip(display)}
              disabled={isLoading}
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "border-color var(--transition-fast), color var(--transition-fast)",
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }}
            >
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );
};

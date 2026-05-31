/**
 * HistoryList — past analysis cards (spec §5.2)
 */
import React from "react";
import { Clock, ExternalLink, Trash2 } from "lucide-react";
import type { ShareableAnalysis } from "@/lib/shareUtils";

interface HistoryListProps {
  entries: Array<{ id: string; analysis: ShareableAnalysis }>;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

function scoreColor(s: number) {
  return s >= 70 ? "var(--score-green)" : s >= 40 ? "var(--score-amber)" : "var(--score-red)";
}

function calcScore(issues: string[]): number {
  let sec = 85, perf = 80, maint = 75, doc = 70;
  issues.forEach((i) => {
    const l = i.toLowerCase();
    if (/security|vuln|auth/.test(l)) sec -= 10;
    if (/performance|slow|memory/.test(l)) perf -= 10;
    if (/complex|duplicate|refactor/.test(l)) maint -= 10;
    if (/doc|comment|readme/.test(l)) doc -= 10;
  });
  return Math.round(
    (Math.max(20, sec) + Math.max(20, perf) + Math.max(20, maint) + Math.max(20, doc)) / 4
  );
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onSelect, onRemove }) => {
  if (entries.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 12,
          color: "var(--text-tertiary)",
        }}
      >
        <Clock size={32} strokeWidth={1.5} />
        <p style={{ fontSize: "var(--text-sm)" }}>
          No analyses yet. Add a repository to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {entries.map(({ id, analysis }) => {
        const repoName = analysis.repoUrl.replace("https://github.com/", "");
        const score = calcScore(analysis.data.detected_issues);
        const date = new Date(analysis.timestamp).toLocaleDateString(undefined, {
          month: "short", day: "numeric", year: "numeric",
        });

        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-subtle)",
              cursor: "pointer",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
            onClick={() => onSelect(id)}
          >
            {/* Score badge */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: `${scoreColor(score)}18`,
                border: `1px solid ${scoreColor(score)}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: scoreColor(score),
              }}
            >
              {score}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginBottom: 2,
                }}
              >
                {repoName}
              </p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                {date} · {analysis.data.detected_issues.length} issues
              </p>
            </div>

            {/* Actions */}
            <div
              style={{ display: "flex", gap: 4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={analysis.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on GitHub"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-tertiary)",
                  border: "1px solid transparent",
                  transition: "color var(--transition-fast), border-color var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-tertiary)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                }}
              >
                <ExternalLink size={13} />
              </a>
              <button
                onClick={() => onRemove(id)}
                title="Remove"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "1px solid transparent",
                  color: "var(--text-tertiary)",
                  cursor: "pointer",
                  transition: "color var(--transition-fast), border-color var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--score-red)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

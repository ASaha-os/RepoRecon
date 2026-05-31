/**
 * HealthScoreCard — circular score badge + 4-cell breakdown (spec §4)
 * Score colours: red <40, amber 40–70, green >70
 */
import React, { useEffect, useState } from "react";
import { Shield, Zap, FileCode, BookOpen, Copy } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisData } from "@/lib/puterAI";

interface HealthScoreCardProps {
  data: AnalysisData;
  repoUrl: string;
}

interface Scores {
  overall: number;
  security: number;
  performance: number;
  maintainability: number;
  documentation: number;
}

const scoreColor = (s: number): string =>
  s >= 70 ? "var(--score-green)" : s >= 40 ? "var(--score-amber)" : "var(--score-red)";

const CELLS = [
  { key: "security"       as const, label: "Security",        Icon: Shield   },
  { key: "performance"    as const, label: "Performance",     Icon: Zap      },
  { key: "maintainability"as const, label: "Maintainability", Icon: FileCode },
  { key: "documentation"  as const, label: "Documentation",   Icon: BookOpen },
];

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ data, repoUrl }) => {
  const [scores, setScores] = useState<Scores>({
    overall: 0, security: 0, performance: 0, maintainability: 0, documentation: 0,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    let sec = 85, perf = 80, maint = 75, doc = 70;
    data.detected_issues.forEach((issue) => {
      const l = issue.toLowerCase();
      if (/security|vuln|auth|password|token|xss|sql|inject/.test(l)) sec   -= 10;
      if (/performance|slow|memory|leak|optim|cache|latency/.test(l))  perf  -= 10;
      if (/complex|duplicate|refactor|debt|coupling|smell/.test(l))    maint -= 10;
      if (/doc|comment|readme|undocumented|missing doc/.test(l))       doc   -= 10;
    });
    sec   = Math.max(20, Math.min(100, sec));
    perf  = Math.max(20, Math.min(100, perf));
    maint = Math.max(20, Math.min(100, maint));
    doc   = Math.max(20, Math.min(100, doc));
    const overall = Math.round((sec + perf + maint + doc) / 4);

    const t = setTimeout(() => {
      setScores({ overall, security: sec, performance: perf, maintainability: maint, documentation: doc });
      setAnimated(true);
    }, 150);
    return () => clearTimeout(t);
  }, [data]);

  const handleCopyBadge = async () => {
    const repoName = repoUrl.split("/").slice(-2).join("/");
    const color = scores.overall >= 70 ? "brightgreen" : scores.overall >= 40 ? "yellow" : "red";
    const badge = `![RepoRecon Health Score](https://img.shields.io/badge/Health%20Score-${scores.overall}%2F100-${color}?style=flat-square)`;
    try {
      await navigator.clipboard.writeText(badge);
      toast.success("Badge markdown copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  // SVG circle math
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const dash = animated ? (scores.overall / 100) * CIRC : 0;

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
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
          Health Score
        </span>
        <button
          onClick={handleCopyBadge}
          title="Copy README badge"
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
          <Copy size={11} />
          Copy badge
        </button>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Top: circle + cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 24,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {/* Circular badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* Track */}
                <circle
                  cx="60" cy="60" r={R}
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="10"
                />
                {/* Progress */}
                <circle
                  cx="60" cy="60" r={R}
                  fill="none"
                  stroke={scoreColor(scores.overall)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${CIRC}`}
                  style={{ transition: "stroke-dasharray 1s ease-out 0.2s" }}
                />
              </svg>
              {/* Number */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: scoreColor(scores.overall),
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    transition: "color 0.4s ease",
                  }}
                >
                  {scores.overall}
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                  / 100
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: scoreColor(scores.overall),
              }}
            >
              {scores.overall >= 70 ? "Healthy" : scores.overall >= 40 ? "Fair" : "Needs Work"}
            </span>
          </div>

          {/* 4-cell breakdown grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {CELLS.map(({ key, label, Icon }) => {
              const val = scores[key];
              return (
                <div
                  key={key}
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <Icon size={12} color="var(--text-tertiary)" />
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {/* Score bar */}
                  <div
                    style={{
                      height: 3,
                      background: "var(--bg-hover)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: animated ? `${val}%` : "0%",
                        background: scoreColor(val),
                        borderRadius: 2,
                        transition: "width 0.8s ease-out 0.3s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      color: scoreColor(val),
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {[
            { value: data.detected_issues.length,     label: "Issues",          color: "var(--score-red)"   },
            { value: data.fix_recommendations.length, label: "Fixes",           color: "var(--score-green)" },
            { value: `${Math.max(0, 100 - data.detected_issues.length * 5)}%`, label: "Potential", color: "var(--score-amber)" },
          ].map(({ value, label, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

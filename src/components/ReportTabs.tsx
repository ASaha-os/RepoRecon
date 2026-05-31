/**
 * ReportTabs — tabbed report sections (spec §4)
 * Tabs: Issues | Suggestions | Architecture Notes | Dependencies
 * Items expandable. "Copy all" per tab.
 */
import React, { useState } from "react";
import { ChevronDown, Copy, AlertTriangle, Lightbulb, GitBranch, Package } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisData } from "@/lib/puterAI";

interface ReportTabsProps {
  data: AnalysisData;
}

type TabId = "issues" | "suggestions" | "architecture" | "dependencies";

interface TabConfig {
  id: TabId;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  getItems: (data: AnalysisData) => string[];
  emptyText: string;
  accentColor: string;
}

const TABS: TabConfig[] = [
  {
    id: "issues",
    label: "Issues",
    Icon: AlertTriangle,
    getItems: (d) => d.detected_issues,
    emptyText: "No issues detected.",
    accentColor: "var(--score-red)",
  },
  {
    id: "suggestions",
    label: "Suggestions",
    Icon: Lightbulb,
    getItems: (d) => d.fix_recommendations,
    emptyText: "No suggestions.",
    accentColor: "var(--score-green)",
  },
  {
    id: "architecture",
    label: "Architecture",
    Icon: GitBranch,
    getItems: (d) => d.summary ? [d.summary] : [],
    emptyText: "No architecture notes.",
    accentColor: "var(--accent)",
  },
  {
    id: "dependencies",
    label: "Dependencies",
    Icon: Package,
    getItems: (d) => {
      // Extract dependency-related issues/recommendations
      const all = [...d.detected_issues, ...d.fix_recommendations];
      return all.filter((s) =>
        /depend|package|library|version|npm|pip|gem|cargo|upgrade|outdated/.test(s.toLowerCase())
      );
    },
    emptyText: "No dependency notes found.",
    accentColor: "var(--score-amber)",
  },
];

export const ReportTabs: React.FC<ReportTabsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabId>("issues");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const tab = TABS.find((t) => t.id === activeTab)!;
  const items = tab.getItems(data);

  const toggleExpand = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleCopyAll = async () => {
    if (!items.length) return;
    try {
      await navigator.clipboard.writeText(items.join("\n\n"));
      toast.success(`${tab.label} copied`);
    } catch {
      toast.error("Copy failed");
    }
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
      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--border-subtle)",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((t) => {
          const isActive = t.id === activeTab;
          const count = t.getItems(data).length;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setExpanded(new Set()); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? `2px solid ${t.accentColor}` : "2px solid transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                fontSize: "var(--text-xs)",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-ui)",
                transition: "color var(--transition-fast)",
                marginBottom: -1,
              }}
            >
              <t.Icon size={12} color={isActive ? t.accentColor : "var(--text-tertiary)"} />
              {t.label}
              {count > 0 && (
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: isActive ? `${t.accentColor}22` : "var(--bg-tertiary)",
                    color: isActive ? t.accentColor : "var(--text-tertiary)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Copy all — pushed right */}
        <div style={{ flex: 1 }} />
        <button
          onClick={handleCopyAll}
          disabled={!items.length}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 14px",
            margin: "4px 8px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            color: items.length ? "var(--text-secondary)" : "var(--text-tertiary)",
            fontSize: "var(--text-xs)",
            cursor: items.length ? "pointer" : "not-allowed",
            fontFamily: "var(--font-ui)",
            opacity: items.length ? 1 : 0.4,
          }}
        >
          <Copy size={11} />
          Copy all
        </button>
      </div>

      {/* Items list */}
      <div style={{ padding: "8px 0", minHeight: 80 }}>
        {items.length === 0 ? (
          <p
            style={{
              padding: "24px 20px",
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              textAlign: "center",
            }}
          >
            {tab.emptyText}
          </p>
        ) : (
          items.map((item, i) => {
            const isOpen = expanded.has(i);
            // Split into title (first sentence / first 80 chars) and detail
            const dotIdx = item.indexOf(". ");
            const dashIdx = item.indexOf(" — ");
            const splitAt = dashIdx > 0 && dashIdx < 80 ? dashIdx : dotIdx > 0 && dotIdx < 80 ? dotIdx + 1 : 80;
            const title  = item.slice(0, splitAt).trim();
            const detail = item.slice(splitAt).trim();

            return (
              <div
                key={i}
                style={{
                  borderBottom: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <button
                  onClick={() => toggleExpand(i)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    width: "100%",
                    padding: "12px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-ui)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {/* Number badge */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `${tab.accentColor}18`,
                      border: `1px solid ${tab.accentColor}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: tab.accentColor,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Title */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "var(--text-sm)",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {title}
                  </span>

                  {/* Chevron */}
                  {detail && (
                    <ChevronDown
                      size={14}
                      color="var(--text-tertiary)"
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform var(--transition-base)",
                      }}
                    />
                  )}
                </button>

                {/* Expanded detail */}
                {isOpen && detail && (
                  <div
                    style={{
                      padding: "0 20px 14px 52px",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {detail}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

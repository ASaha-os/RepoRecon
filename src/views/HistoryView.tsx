/**
 * HistoryView — task 15 (spec §5.2)
 * List of past analyses. Click to restore in AnalysisView.
 */
import React, { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { HistoryList } from "@/components/HistoryList";
import { useHistory }  from "@/hooks/useHistory";

// AnalysisView is the default view — we need a way to navigate to it and
// restore an analysis. We use a custom event so HistoryView stays decoupled.
function dispatchRestore(id: string) {
  window.dispatchEvent(new CustomEvent("rr:restore-analysis", { detail: id }));
}

const HistoryView: React.FC = () => {
  const { entries, clearAll, remove } = useHistory();

  const handleSelect = useCallback((id: string) => {
    dispatchRestore(id);
  }, []);

  return (
    <div
      className="fade-in"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
          background: "var(--bg-secondary)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          My Analyses
        </span>
        {entries.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "var(--score-red)",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Trash2 size={11} />
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <HistoryList
          entries={entries}
          onSelect={handleSelect}
          onRemove={remove}
        />
      </div>
    </div>
  );
};

export default HistoryView;

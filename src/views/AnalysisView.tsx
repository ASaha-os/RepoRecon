/**
 * AnalysisView — main analysis flow (spec §5.1, §4)
 * Phase 5: usePuter wired for notifications (task 21) and FS save (task 20).
 * Progressive reveal: diagram → score → reports → chat.
 */
import React, { useCallback, useEffect } from "react";
import { RotateCcw, AlertCircle } from "lucide-react";
import { RepoInput }       from "@/components/RepoInput";
import { MermaidPanel }    from "@/components/MermaidPanel";
import { HealthScoreCard } from "@/components/HealthScoreCard";
import { ReportTabs }      from "@/components/ReportTabs";
import { QAChat }          from "@/components/QAChat";
import { SectionReveal }   from "@/components/SectionReveal";
import { LoadingDots }     from "@/components/LoadingDots";
import { useAnalysis }     from "@/hooks/useAnalysis";
import { usePuter }        from "@/hooks/usePuter";
import { getRecentAnalyses } from "@/lib/shareUtils";
import { toast }           from "sonner";

const AnalysisView: React.FC<{ analysis: ReturnType<typeof useAnalysis> }> = ({ analysis }) => {
  const { state, run, restore, reset } = analysis;
  const { saveDiagram, notify }        = usePuter();

  const recentRepos = getRecentAnalyses(4).map((a) => a.repoUrl);

  /* ── Task 21: Puter notifications on analysis lifecycle ─────────── */
  const handleAnalyze = useCallback(async (url: string) => {
    // Notify start (non-blocking)
    notify("Analyzing repository…", "info").catch(() => {});

    await run(url);

    // run() updates state async — check via the returned promise completion
    // We read state after run resolves; use a small trick via the hook's state
  }, [run, notify]);

  // Watch for status transitions to fire completion/error notifications
  const prevStatusRef = React.useRef(state.status);
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = state.status;

    if (prev === "analyzing" && state.status === "done") {
      notify("Analysis complete", "success").catch(() => {});
    }
    if (prev === "analyzing" && state.status === "error") {
      notify("Analysis failed", "error").catch(() => {});
    }
  }, [state.status, notify]);

  /* ── Task 20: save diagram to Puter FS ──────────────────────────── */
  const handleSaveToPuter = useCallback(async (svg: string) => {
    const ok = await saveDiagram(svg);
    if (ok) {
      toast.success("Diagram saved to Puter FS");
    } else {
      toast.error("Save failed. Try again.");
    }
  }, [saveDiagram]);

  /* ── Fix request: re-run same URL ───────────────────────────────── */
  const handleFixRequest = useCallback(async () => {
    if (!state.repoUrl) return;
    await run(state.repoUrl);
  }, [state.repoUrl, run]);

  const isActive  = state.status !== "idle";
  const isDone    = state.status === "done";
  const isError   = state.status === "error";
  const isLoading = state.status === "fetching" || state.status === "analyzing";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      {isActive && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", flexShrink: 0 }}>
              {isLoading ? "Analyzing" : "Analyzed"}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {state.repoUrl.replace("https://github.com/", "")}
            </span>
            {isLoading && <LoadingDots size={4} color="var(--text-tertiary)" />}
          </div>

          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              flexShrink: 0,
              transition: "color var(--transition-fast), border-color var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
          >
            <RotateCcw size={11} />
            New Analysis
          </button>
        </div>
      )}

      {/* ── Scrollable content ──────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* IDLE */}
        {!isActive && (
          <RepoInput
            onAnalyze={handleAnalyze}
            isLoading={false}
            recentRepos={recentRepos}
          />
        )}

        {/* LOADING */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100% - 48px)",
              gap: 16,
            }}
          >
            <LoadingDots size={7} color="var(--text-secondary)" />
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              {state.status === "fetching"
                ? "Fetching repository…"
                : "Analyzing architecture with AI…"}
            </p>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100% - 48px)",
              gap: 16,
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <AlertCircle size={32} color="var(--score-red)" />
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                maxWidth: 420,
                lineHeight: 1.6,
              }}
            >
              {state.error}
            </p>
            <button
              onClick={reset}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* DONE — progressive sections */}
        {isDone && state.data && (
          <div
            style={{
              maxWidth: "var(--panel-max-width)",
              margin: "0 auto",
              padding: "24px 20px 80px",
            }}
          >
            {/* 1. Diagram */}
            <SectionReveal visible={state.sections.diagram} gap={0}>
              <MermaidPanel
                code={state.data.mermaid_code}
                onFixRequest={handleFixRequest}
                onSaveToPuter={handleSaveToPuter}
              />
            </SectionReveal>

            {/* 2. Health score */}
            <SectionReveal visible={state.sections.score}>
              <HealthScoreCard data={state.data} repoUrl={state.repoUrl} />
            </SectionReveal>

            {/* 3. Reports */}
            <SectionReveal visible={state.sections.reports}>
              <ReportTabs data={state.data} />
            </SectionReveal>

            {/* 4. Q&A chat */}
            <SectionReveal visible={state.sections.chat}>
              <div style={{ height: 480 }}>
                <QAChat repoUrl={state.repoUrl} analysisData={state.data} />
              </div>
            </SectionReveal>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;

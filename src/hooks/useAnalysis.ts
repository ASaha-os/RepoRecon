/**
 * useAnalysis — analysis state + Puter.js AI calls (spec §8)
 * Manages the full lifecycle: idle → loading → streaming sections → done → error
 */
import { useState, useCallback } from "react";
import { analyzeRepo, type AnalysisData } from "@/lib/puterAI";
import { saveAnalysis, getStoredAnalyses } from "@/lib/shareUtils";

export type AnalysisStatus = "idle" | "fetching" | "analyzing" | "done" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  repoUrl: string;
  data: AnalysisData | null;
  error: string;
  /** Sections revealed progressively */
  sections: {
    diagram: boolean;
    score: boolean;
    reports: boolean;
    chat: boolean;
  };
}

const INITIAL: AnalysisState = {
  status: "idle",
  repoUrl: "",
  data: null,
  error: "",
  sections: { diagram: false, score: false, reports: false, chat: false },
};

export function useAnalysis(onNavigateToHistory?: () => void) {
  const [state, setState] = useState<AnalysisState>(INITIAL);

  /** Reveal sections progressively with staggered delays */
  const revealSections = useCallback(() => {
    const delays = { diagram: 100, score: 600, reports: 1100, chat: 1600 };
    (Object.keys(delays) as Array<keyof typeof delays>).forEach((key) => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          sections: { ...prev.sections, [key]: true },
        }));
      }, delays[key]);
    });
  }, []);

  const run = useCallback(async (url: string) => {
    setState({
      ...INITIAL,
      status: "fetching",
      repoUrl: url,
    });

    try {
      // Step 1: fetching README (fast)
      setState((prev) => ({ ...prev, status: "analyzing" }));

      const data = await analyzeRepo(url);

      // Save to history
      try {
        saveAnalysis({ repoUrl: url, timestamp: Date.now(), data });
      } catch {
        // non-fatal
      }

      setState((prev) => ({
        ...prev,
        status: "done",
        data,
        error: "",
      }));

      revealSections();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setState((prev) => ({ ...prev, status: "error", error: msg }));
    }
  }, [revealSections]);

  /** Restore a saved analysis from history */
  const restore = useCallback((id: string) => {
    const analyses = getStoredAnalyses();
    const saved = analyses[id];
    if (!saved) return;
    setState({
      status: "done",
      repoUrl: saved.repoUrl,
      data: saved.data,
      error: "",
      sections: { diagram: true, score: true, reports: true, chat: true },
    });
  }, []);

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, run, restore, reset };
}

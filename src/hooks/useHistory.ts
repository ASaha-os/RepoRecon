/**
 * useHistory — localStorage analysis history (spec §5.2, §8)
 */
import { useState, useCallback, useEffect } from "react";
import {
  getStoredAnalyses,
  saveAnalysis,
  type ShareableAnalysis,
} from "@/lib/shareUtils";

const STORAGE_KEY = "reporecon_analyses";

export function useHistory() {
  const [entries, setEntries] = useState<Array<{ id: string; analysis: ShareableAnalysis }>>([]);

  const load = useCallback(() => {
    const stored = getStoredAnalyses();
    const sorted = Object.entries(stored)
      .map(([id, analysis]) => ({ id, analysis }))
      .sort((a, b) => b.analysis.timestamp - a.analysis.timestamp);
    setEntries(sorted);
  }, []);

  useEffect(() => { load(); }, [load]);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  }, []);

  const remove = useCallback((id: string) => {
    const stored = getStoredAnalyses();
    delete stored[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    load();
  }, [load]);

  return { entries, clearAll, remove, reload: load };
}

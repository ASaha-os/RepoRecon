/**
 * Utilities for sharing and persisting analysis results
 */

export interface ShareableAnalysis {
  repoUrl: string;
  timestamp: number;
  data: {
    summary: string;
    mermaid_code: string;
    detected_issues: string[];
    fix_recommendations: string[];
  };
}

const STORAGE_KEY = "reporecon_analyses";
const MAX_STORED_ANALYSES = 10;

/**
 * Save analysis to localStorage
 */
export const saveAnalysis = (analysis: ShareableAnalysis): string => {
  try {
    const analyses = getStoredAnalyses();
    const id = generateId();
    
    analyses[id] = analysis;
    
    // Keep only the most recent analyses
    const sortedIds = Object.keys(analyses).sort(
      (a, b) => analyses[b].timestamp - analyses[a].timestamp
    );
    
    if (sortedIds.length > MAX_STORED_ANALYSES) {
      sortedIds.slice(MAX_STORED_ANALYSES).forEach((oldId) => {
        delete analyses[oldId];
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    return id;
  } catch (error) {
    console.error("Failed to save analysis:", error);
    throw new Error("Failed to save analysis");
  }
};

/**
 * Load analysis from localStorage by ID
 */
export const loadAnalysis = (id: string): ShareableAnalysis | null => {
  try {
    const analyses = getStoredAnalyses();
    return analyses[id] || null;
  } catch (error) {
    console.error("Failed to load analysis:", error);
    return null;
  }
};

/**
 * Get all stored analyses
 */
export const getStoredAnalyses = (): Record<string, ShareableAnalysis> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to get stored analyses:", error);
    return {};
  }
};

/**
 * Generate shareable URL
 */
export const generateShareableUrl = (id: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?share=${id}`;
};

/**
 * Get share ID from URL
 */
export const getShareIdFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("share");
};

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Compress analysis data for URL sharing (base64 encoded)
 */
export const compressForUrl = (analysis: ShareableAnalysis): string => {
  try {
    const json = JSON.stringify(analysis);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error("Failed to compress analysis:", error);
    throw new Error("Failed to compress analysis");
  }
};

/**
 * Decompress analysis data from URL
 */
export const decompressFromUrl = (compressed: string): ShareableAnalysis | null => {
  try {
    const json = decodeURIComponent(atob(compressed));
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decompress analysis:", error);
    return null;
  }
};

/**
 * Clear old analyses (older than 30 days)
 */
export const clearOldAnalyses = (): void => {
  try {
    const analyses = getStoredAnalyses();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    Object.keys(analyses).forEach((id) => {
      if (analyses[id].timestamp < thirtyDaysAgo) {
        delete analyses[id];
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch (error) {
    console.error("Failed to clear old analyses:", error);
  }
};

/**
 * Get recent analyses for history
 */
export const getRecentAnalyses = (limit: number = 5): ShareableAnalysis[] => {
  try {
    const analyses = getStoredAnalyses();
    return Object.values(analyses)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    console.error("Failed to get recent analyses:", error);
    return [];
  }
};

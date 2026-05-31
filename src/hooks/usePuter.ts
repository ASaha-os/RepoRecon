/**
 * usePuter — Puter SDK wrapper hook (spec §7, task 19)
 * Handles auth state, FS operations, and notifications.
 * Gracefully degrades when Puter is not loaded.
 */
import { useState, useEffect, useCallback } from "react";

export interface PuterUser {
  username: string;
  email?: string;
}

export interface PuterState {
  ready: boolean;
  authenticated: boolean;
  user: PuterUser | null;
}

export function usePuter() {
  const [state, setState] = useState<PuterState>({
    ready: false,
    authenticated: false,
    user: null,
  });

  // Check Puter availability on mount
  useEffect(() => {
    const check = () => {
      if (!window.puter) return;
      const authed = window.puter.auth.isSignedIn?.() ?? false;
      setState((prev) => ({ ...prev, ready: true, authenticated: authed }));
      if (authed) {
        window.puter.auth.getUser().then((u) => {
          setState((prev) => ({ ...prev, user: u }));
        }).catch(() => {});
      }
    };

    // Puter may already be loaded (from index.html script tag)
    check();

    // Poll briefly in case it loads async
    const interval = setInterval(() => {
      if (window.puter) { check(); clearInterval(interval); }
    }, 500);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  /** Sign in with Puter */
  const signIn = useCallback(async () => {
    if (!window.puter) return;
    try {
      await window.puter.auth.signIn();
      const user = await window.puter.auth.getUser();
      setState((prev) => ({ ...prev, authenticated: true, user }));
    } catch { /* user cancelled */ }
  }, []);

  /** Sign out of Puter */
  const signOut = useCallback(async () => {
    if (!window.puter) return;
    try {
      await window.puter.auth.signOut();
      setState((prev) => ({ ...prev, authenticated: false, user: null }));
    } catch { /* ignore */ }
  }, []);

  /** Save SVG to /RepoRecon/ folder in Puter FS (task 20) */
  const saveDiagram = useCallback(async (svgContent: string): Promise<boolean> => {
    if (!window.puter?.fs) return false;
    try {
      // Ensure directory exists
      try {
        await window.puter.fs.mkdir("/RepoRecon", { createMissingParents: true });
      } catch { /* already exists */ }

      const filename = `/RepoRecon/diagram-${Date.now()}.svg`;
      await window.puter.fs.write(filename, svgContent);
      return true;
    } catch {
      return false;
    }
  }, []);

  /** Show a Puter native notification (task 21) */
  const notify = useCallback(async (
    message: string,
    icon: "success" | "error" | "info" = "info"
  ) => {
    if (!window.puter?.ui?.alert) return;
    try {
      await window.puter.ui.alert(message, { icon });
    } catch { /* non-fatal */ }
  }, []);

  /** List saved analyses from Puter FS */
  const listSavedDiagrams = useCallback(async () => {
    if (!window.puter?.fs) return [];
    try {
      return await window.puter.fs.readdir("/RepoRecon");
    } catch {
      return [];
    }
  }, []);

  return { state, signIn, signOut, saveDiagram, notify, listSavedDiagrams };
}

/**
 * App.tsx — Phase 5 final
 * Layout shell: Sidebar (48px) + main panel.
 * Bridges: theme events, restore-analysis navigation, Puter init.
 */
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar, type ViewId } from "@/components/Sidebar";
import { LoadingDots } from "@/components/LoadingDots";
import { useAnalysis } from "@/hooks/useAnalysis";

/* Lazy-load views */
const AnalysisView = lazy(() => import("@/views/AnalysisView"));
const HistoryView  = lazy(() => import("@/views/HistoryView"));
const SettingsView = lazy(() => import("@/views/SettingsView"));
const HelpView     = lazy(() => import("@/views/HelpView"));
const ProfileView  = lazy(() => import("@/views/ProfileView"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});

/* ── Theme ────────────────────────────────────────────────── */
function useAppTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("rr-theme") as "dark" | "light" | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rr-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

/* ── View panel ───────────────────────────────────────────── */
function ViewPanel({ activeView, analysis }: { activeView: ViewId; analysis: ReturnType<typeof useAnalysis> }) {
  const views: Record<ViewId, React.ReactNode> = {
    analysis: <AnalysisView analysis={analysis} />,
    history:  <HistoryView />,
    settings: <SettingsView />,
    help:     <HelpView />,
    profile:  <ProfileView />,
  };

  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <LoadingDots />
        </div>
      }
    >
      <div key={activeView} className="fade-in" style={{ height: "100%", width: "100%" }}>
        {views[activeView]}
      </div>
    </Suspense>
  );
}

/* ── Root ─────────────────────────────────────────────────── */
export default function App() {
  const [activeView, setActiveView] = useState<ViewId>("analysis");
  const { setTheme, toggleTheme }   = useAppTheme();
  const analysis = useAnalysis();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        <Sidebar activeView={activeView} onNavigate={setActiveView} />

        <main
          className="main-panel"
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ViewPanel activeView={activeView} analysis={analysis} />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-ui)",
          },
        }}
      />

      {/* Event bridges — decoupled cross-view communication */}
      <EventBridges
        setTheme={setTheme}
        toggleTheme={toggleTheme}
        navigateTo={setActiveView}
        restoreAnalysis={analysis.restore}
      />
    </QueryClientProvider>
  );
}

/* ── Event bridges ────────────────────────────────────────── */
function EventBridges({
  setTheme,
  toggleTheme,
  navigateTo,
  restoreAnalysis,
}: {
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;
  navigateTo: (v: ViewId) => void;
  restoreAnalysis: (id: string) => void;
}) {
  useEffect(() => {
    // Theme events (from SettingsView)
    const onToggle = () => toggleTheme();
    const onSet    = (e: Event) => setTheme((e as CustomEvent<"dark" | "light">).detail);

    // Restore analysis: HistoryView dispatches this → restore directly and navigate to analysis tab
    const onRestore = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      restoreAnalysis(id);
      navigateTo("analysis");
    };

    window.addEventListener("rr:toggle-theme",      onToggle);
    window.addEventListener("rr:set-theme",         onSet as EventListener);
    window.addEventListener("rr:restore-analysis",  onRestore);

    return () => {
      window.removeEventListener("rr:toggle-theme",     onToggle);
      window.removeEventListener("rr:set-theme",        onSet as EventListener);
      window.removeEventListener("rr:restore-analysis", onRestore);
    };
  }, [setTheme, toggleTheme, navigateTo, restoreAnalysis]);

  return null;
}

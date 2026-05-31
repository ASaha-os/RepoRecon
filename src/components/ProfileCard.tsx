/**
 * ProfileCard — Puter user info display (spec §5.5, task 22)
 * Shows avatar, username, email, saved files link, sign-in/out.
 */
import React from "react";
import { LogIn, LogOut, FolderOpen, User } from "lucide-react";
import { usePuter } from "@/hooks/usePuter";
import { LoadingDots } from "./LoadingDots";

export const ProfileCard: React.FC = () => {
  const { state, signIn, signOut, listSavedDiagrams } = usePuter();
  const [fileCount, setFileCount] = React.useState<number | null>(null);
  const [loadingFiles, setLoadingFiles] = React.useState(false);

  // Load saved file count when authenticated
  React.useEffect(() => {
    if (!state.authenticated) { setFileCount(null); return; }
    setLoadingFiles(true);
    listSavedDiagrams()
      .then((files) => setFileCount(files.length))
      .catch(() => setFileCount(0))
      .finally(() => setLoadingFiles(false));
  }, [state.authenticated, listSavedDiagrams]);

  // Avatar initials
  const initials = state.user?.username
    ? state.user.username.slice(0, 2).toUpperCase()
    : "?";

  if (!state.ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <LoadingDots />
      </div>
    );
  }

  /* ── Not signed in ─────────────────────────────── */
  if (!state.authenticated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={28} color="var(--text-tertiary)" />
        </div>
        <div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 500, marginBottom: 6 }}>
            Not signed in
          </p>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>
            Sign in with Puter to save diagrams to your personal file system.
          </p>
        </div>
        <button
          onClick={signIn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: "var(--radius-md)",
            background: "var(--accent)",
            color: "var(--bg-primary)",
            border: "none",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-ui)",
          }}
        >
          <LogIn size={15} />
          Sign in with Puter
        </button>
      </div>
    );
  }

  /* ── Signed in ─────────────────────────────────── */
  return (
    <div style={{ padding: "24px 20px" }}>
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--text-base)",
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {state.user?.username ?? "Puter User"}
          </p>
          {state.user?.email && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {state.user.email}
            </p>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {/* Saved diagrams */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FolderOpen size={14} color="var(--text-tertiary)" />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
              Saved diagrams
            </span>
          </div>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
            {loadingFiles ? <LoadingDots size={4} /> : fileCount !== null ? `${fileCount} files` : "—"}
          </span>
        </div>

        {/* Storage path */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
          }}
        >
          <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
            Storage path
          </span>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontFamily: "var(--font-mono)",
              color: "var(--text-tertiary)",
            }}
          >
            /RepoRecon/
          </span>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: "var(--radius-md)",
          background: "transparent",
          border: "1px solid rgba(239,68,68,0.35)",
          color: "var(--score-red)",
          fontSize: "var(--text-sm)",
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
        <LogOut size={14} />
        Sign out of Puter
      </button>
    </div>
  );
};

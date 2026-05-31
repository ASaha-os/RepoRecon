/**
 * SettingsView — task 16 (spec §5.3)
 * Theme toggle, default diagram type, auto-save toggle, clear history.
 * Theme wired via rr:set-theme event → App.tsx ThemeEventBridge.
 */
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

type DiagramType = "flowchart" | "sequence" | "er" | "class";

const DIAGRAM_OPTIONS: { value: DiagramType; label: string }[] = [
  { value: "flowchart", label: "Flowchart" },
  { value: "sequence",  label: "Sequence"  },
  { value: "er",        label: "ER"        },
  { value: "class",     label: "Class"     },
];

function getTheme(): "dark" | "light" {
  return (localStorage.getItem("rr-theme") as "dark" | "light") ?? "dark";
}

const SettingsView: React.FC = () => {
  const [theme,       setThemeLocal]  = useState<"dark" | "light">(getTheme);
  const [diagramType, setDiagramType] = useState<DiagramType>(
    () => (localStorage.getItem("rr-diagram-type") as DiagramType) ?? "flowchart"
  );
  const [autoSave, setAutoSave] = useState(
    () => localStorage.getItem("rr-auto-save") === "true"
  );
  const [cleared, setCleared] = useState(false);

  // Sync theme toggle → App.tsx
  const handleThemeToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeLocal(next);
    window.dispatchEvent(new CustomEvent("rr:set-theme", { detail: next }));
  };

  const handleDiagramType = (v: DiagramType) => {
    setDiagramType(v);
    localStorage.setItem("rr-diagram-type", v);
  };

  const handleAutoSave = () => {
    const next = !autoSave;
    setAutoSave(next);
    localStorage.setItem("rr-auto-save", String(next));
  };

  const handleClearHistory = () => {
    localStorage.removeItem("reporecon_analyses");
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div
      className="fade-in"
      style={{
        height: "100%",
        overflowY: "auto",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "32px 20px 64px",
        }}
      >
        {/* Page title */}
        <h2
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 32,
          }}
        >
          Settings
        </h2>

        {/* Settings rows */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Theme */}
          <SettingRow
            label="Theme"
            description="Switch between dark and light mode"
            last={false}
          >
            <Toggle
              checked={theme === "light"}
              onChange={handleThemeToggle}
              labelOn="Light"
              labelOff="Dark"
            />
          </SettingRow>

          {/* Default diagram type */}
          <SettingRow
            label="Default diagram type"
            description="Diagram style used for new analyses"
            last={false}
          >
            <select
              value={diagramType}
              onChange={(e) => handleDiagramType(e.target.value as DiagramType)}
              style={{
                padding: "5px 10px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-ui)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {DIAGRAM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </SettingRow>

          {/* Auto-save to Puter FS */}
          <SettingRow
            label="Auto-save to Puter FS"
            description="Automatically save diagrams to /RepoRecon/ after each analysis"
            last={false}
          >
            <Toggle
              checked={autoSave}
              onChange={handleAutoSave}
              labelOn="On"
              labelOff="Off"
            />
          </SettingRow>

          {/* Clear history */}
          <SettingRow
            label="Clear all history"
            description="Permanently delete all saved analyses from this device"
            last={true}
          >
            <button
              onClick={handleClearHistory}
              style={{
                padding: "5px 14px",
                borderRadius: "var(--radius-sm)",
                background: cleared ? "rgba(239,68,68,0.12)" : "transparent",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "var(--score-red)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "background var(--transition-fast)",
                whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={11} />
              {cleared ? "Cleared" : "Clear"}
            </button>
          </SettingRow>
        </div>
      </div>
    </div>
  );
};

/* ── SettingRow ───────────────────────────────────────────── */
const SettingRow: React.FC<{
  label: string;
  description: string;
  last: boolean;
  children: React.ReactNode;
}> = ({ label, description, last, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "16px 20px",
      borderBottom: last ? "none" : "1px solid var(--border-subtle)",
    }}
  >
    <div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 500, marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

/* ── Toggle ───────────────────────────────────────────────── */
const Toggle: React.FC<{
  checked: boolean;
  onChange: () => void;
  labelOn: string;
  labelOff: string;
}> = ({ checked, onChange, labelOn, labelOff }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-ui)",
    }}
  >
    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", minWidth: 28, textAlign: "right" }}>
      {checked ? labelOn : labelOff}
    </span>
    {/* Track */}
    <div
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? "var(--accent)" : "var(--bg-hover)",
        border: "1px solid var(--border)",
        position: "relative",
        transition: "background var(--transition-base)",
      }}
    >
      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 17 : 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: checked ? "var(--bg-primary)" : "var(--text-tertiary)",
          transition: "left var(--transition-base), background var(--transition-base)",
        }}
      />
    </div>
  </button>
);

export default SettingsView;

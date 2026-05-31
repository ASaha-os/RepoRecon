/**
 * Sidebar — icon-only nav strip, 48px wide (spec §3.1, §3.2)
 * Desktop: fixed left column
 * Mobile: bottom navigation bar (spec §10)
 */
import React from "react";
import { Plus, ClipboardList, Settings, HelpCircle, User } from "lucide-react";

export type ViewId = "analysis" | "history" | "settings" | "help" | "profile";

interface NavItem {
  id: ViewId;
  icon: React.FC<{ size?: number; strokeWidth?: number }>;
  label: string;
  position: "top" | "bottom";
}

const NAV_ITEMS: NavItem[] = [
  { id: "analysis", icon: Plus,          label: "Add Repository",  position: "top" },
  { id: "history",  icon: ClipboardList, label: "My Analyses",     position: "top" },
  { id: "settings", icon: Settings,      label: "Settings",        position: "top" },
  { id: "help",     icon: HelpCircle,    label: "Help & FAQ",      position: "bottom" },
  { id: "profile",  icon: User,          label: "Profile",         position: "bottom" },
];

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const topItems    = NAV_ITEMS.filter((i) => i.position === "top");
  const bottomItems = NAV_ITEMS.filter((i) => i.position === "bottom");

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside
        style={{
          width: "var(--sidebar-width)",
          minWidth: "var(--sidebar-width)",
          height: "100%",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "12px",
          paddingBottom: "12px",
          flexShrink: 0,
          zIndex: 50,
        }}
        className="hidden md:flex"
      >
        {/* Logo mark */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            flexShrink: 0,
            boxShadow: "var(--accent-glow)",
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
          }}
        >
          <img
            src="/RepoRecon-logo.png"
            alt="RepoRecon"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
        </div>

        {/* Top nav items */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flex: 1,
          }}
        >
          {topItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Divider */}
        <div
          style={{
            width: 28,
            height: 1,
            background: "var(--border)",
            margin: "12px 0",
            flexShrink: 0,
          }}
        />

        {/* Bottom nav items */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          {bottomItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </aside>

      {/* ── Mobile bottom nav (spec §10) ────────────── */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 68,
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 50,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        className="flex md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? "var(--accent)" : "var(--text-tertiary)",
                transition: "color var(--transition-fast)",
                minWidth: 54,
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1,
                }}
              >
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

/* ── Sidebar button (desktop) ─────────────────────────────── */
interface SidebarButtonProps {
  item: NavItem;
  isActive: boolean;
  onNavigate: (view: ViewId) => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ item, isActive, onNavigate }) => (
  <div className="sidebar-item" style={{ position: "relative" }}>
    <button
      onClick={() => onNavigate(item.id)}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      style={{
        width: 46,
        height: 46,
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isActive ? "var(--accent-muted, rgba(56,189,248,0.12))" : "transparent",
        border: "none",
        cursor: "pointer",
        color: isActive ? "var(--accent)" : "var(--text-tertiary)",
        transition: "background var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast)",
        position: "relative",
        boxShadow: isActive ? "var(--accent-glow)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
        }
      }}
    >
      {/* Active left-border accent */}
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: -8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 4,
            height: 20,
            borderRadius: "0 4px 4px 0",
            background: "var(--accent)",
          }}
        />
      )}
      <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
    </button>
    {/* Tooltip */}
    <span className="sidebar-tooltip">{item.label}</span>
  </div>
);

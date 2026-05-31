/**
 * ProfileView — task 22 (spec §5.5)
 * Puter auth integration: show user info, saved files, sign in/out.
 */
import React from "react";
import { ProfileCard } from "@/components/ProfileCard";

const ProfileView: React.FC = () => (
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
        Profile
      </span>
    </div>

    {/* Content */}
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        maxWidth: 480,
        width: "100%",
        margin: "0 auto",
        padding: "8px 0",
      }}
    >
      <ProfileCard />
    </div>
  </div>
);

export default ProfileView;

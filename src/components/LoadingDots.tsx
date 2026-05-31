/**
 * LoadingDots — minimal inline loading indicator (spec §6.6)
 * Three dots, no spinners.
 */
import React from "react";

interface LoadingDotsProps {
  size?: number;
  color?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 5,
  color = "var(--text-tertiary)",
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.8,
    }}
    aria-label="Loading"
    role="status"
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="dot-bounce"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          animationDelay: `${i * 0.16}s`,
        }}
      />
    ))}
  </span>
);

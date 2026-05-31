/**
 * SectionReveal — animates children in when `visible` becomes true (spec §6.6)
 * Uses CSS classes reveal-hidden / reveal-visible defined in index.css
 */
import React, { useEffect, useRef, useState } from "react";

interface SectionRevealProps {
  visible: boolean;
  children: React.ReactNode;
  /** Extra top margin before the section */
  gap?: number;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  visible,
  children,
  gap = 24,
}) => {
  const [cls, setCls] = useState("reveal-hidden");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      // Small rAF to ensure the hidden class is painted first
      requestAnimationFrame(() => setCls("reveal-visible"));
    }
  }, [visible]);

  if (!visible && cls === "reveal-hidden") {
    // Don't mount at all until triggered — keeps DOM clean
    return null;
  }

  return (
    <div
      ref={ref}
      className={cls}
      style={{ marginTop: gap }}
    >
      {children}
    </div>
  );
};

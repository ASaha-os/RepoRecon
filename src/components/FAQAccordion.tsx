/**
 * FAQAccordion — expandable FAQ list + contact form (spec §5.4)
 */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem { q: string; a: string; }

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is RepoRecon?",
    a: "RepoRecon is a developer tool that analyzes public GitHub repositories using AI. It generates architecture diagrams, health scores, issue reports, and lets you ask questions about any codebase — all without leaving the app.",
  },
  {
    q: "Which repositories are supported?",
    a: "Public GitHub repositories only. The app fetches the README and repository metadata directly from GitHub. Private repositories are not supported at this time.",
  },
  {
    q: "How is the health score calculated?",
    a: "The score (0–100) is derived from four dimensions: Security, Performance, Maintainability, and Documentation. Each starts at a baseline and is reduced when the AI detects relevant issues. The overall score is the average of all four.",
  },
  {
    q: "Is my repository data stored?",
    a: "Analysis results are stored locally in your browser (localStorage) for up to 30 days. Nothing is sent to a third-party server. If you use the 'Save to Puter' feature, diagrams are saved to your personal Puter.com file system.",
  },
  {
    q: "What AI powers the analysis?",
    a: "RepoRecon uses Puter.js AI — a free, browser-native AI layer that requires no API keys or accounts. It provides GPT-4o level analysis directly in your browser.",
  },
  {
    q: "How do I save my analysis?",
    a: "Click the 'Save to Puter' button (disk icon) in the diagram panel toolbar. This saves the SVG diagram to /RepoRecon/ in your Puter.com file system. You can also use 'Copy badge' to get a markdown health badge for your README.",
  },
  {
    q: "Why is my diagram not rendering?",
    a: "Mermaid.js occasionally produces syntax errors for complex repositories. When this happens, the raw Mermaid code is shown with a 'Try to fix' button — clicking it re-prompts the AI to generate corrected syntax. If the issue persists, try a different repository.",
  },
];

export const FAQAccordion: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px 0",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                gap: 12,
                fontFamily: "var(--font-ui)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                }}
              >
                {item.q}
              </span>
              <ChevronDown
                size={15}
                color="var(--text-tertiary)"
                style={{
                  flexShrink: 0,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform var(--transition-base)",
                }}
              />
            </button>
            {isOpen && (
              <div
                style={{
                  paddingBottom: 16,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

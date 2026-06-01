/**
 * MermaidPanel — diagram renderer with type selector + action buttons
 * Uses a hidden container div for mermaid.render() to avoid DOM conflicts.
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Copy, Download, Save, RefreshCw, ChevronDown } from "lucide-react";
import { LoadingDots } from "./LoadingDots";
import { toast } from "sonner";

export type DiagramType = "flowchart" | "sequence" | "er" | "class";

interface MermaidPanelProps {
  code: string;
  onFixRequest?: () => void;
  onSaveToPuter?: (svg: string) => void;
  defaultType?: DiagramType;
}

const TYPE_LABELS: Record<DiagramType, string> = {
  flowchart: "Flowchart",
  sequence:  "Sequence",
  er:        "ER",
  class:     "Class",
};

/** Sanitize AI-generated mermaid code to fix common issues */
function sanitizeMermaidCode(rawCode: string): string {
  let code = rawCode;

  // 1. Strip markdown fences
  const fenced = code.match(/```(?:mermaid)?\s*\n?([\s\S]*?)```/);
  if (fenced) code = fenced[1];

  // 2. Unescape string-escaped newlines & tabs
  code = code.replace(/\\n/g, "\n").replace(/\\t/g, "  ");

  // 3. Remove BOM, zero-width chars, carriage returns
  code = code
    .replace(/\uFEFF/g, "")
    .replace(/[\u200B\u200C\u200D]/g, "")
    .replace(/\r/g, "");

  // 4. Fix common arrow syntax issues from AI
  code = code
    .replace(/—>/g, "-->")
    .replace(/<—/g, "<--")
    .replace(/─>/g, "-->");

  // 5. Ensure diagram starts with a valid directive
  const trimmed = code.trim();
  const validStarts = [
    "flowchart", "graph", "sequenceDiagram", "classDiagram",
    "stateDiagram", "erDiagram", "gantt", "pie", "mindmap",
    "timeline", "gitGraph", "journey",
  ];
  const hasValidStart = validStarts.some((s) => trimmed.toLowerCase().startsWith(s.toLowerCase()));
  if (!hasValidStart) {
    code = "flowchart TD\n" + trimmed;
  }

  // 6. Balance subgraph / end
  const subgraphCount = (code.match(/\bsubgraph\b/gi) || []).length;
  const endCount = (code.match(/\bend\b/gi) || []).length;
  if (subgraphCount > endCount) {
    code += "\n" + "end\n".repeat(subgraphCount - endCount);
  }

  // 7. Fix single-quoted subgraph labels
  code = code.replace(/subgraph\s+'([^']+)'/g, 'subgraph "$1"');

  return code.trim();
}

let mermaidRenderCounter = 0;

export const MermaidPanel: React.FC<MermaidPanelProps> = ({
  code,
  onFixRequest,
  onSaveToPuter,
  defaultType = "flowchart",
}) => {
  const displayRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg]           = useState<string>("");
  const [renderError, setRenderError] = useState<string>("");
  const [isRendering, setIsRendering] = useState(true);
  const [typeOpen, setTypeOpen] = useState(false);
  const [activeType, setActiveType] = useState<DiagramType>(defaultType);

  const renderDiagram = useCallback(async (rawCode: string) => {
    if (!rawCode?.trim()) {
      setIsRendering(false);
      return;
    }
    setIsRendering(true);
    setRenderError("");
    setSvg("");

    try {
      const mermaid = (await import("mermaid")).default;

      // Re-initialize every time to avoid stale state
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        darkMode: true,
        themeVariables: {
          background: "#09090b",
          primaryColor: "#1e293b",
          primaryTextColor: "#f0f0f5",
          primaryBorderColor: "#38bdf8",
          lineColor: "#6b6b80",
          secondaryColor: "#17171c",
          tertiaryColor: "#0f0f12",
          nodeTextColor: "#f0f0f5",
          edgeLabelBackground: "#17171c",
          clusterBkg: "#17171c",
          clusterBorder: "#27272f",
          titleColor: "#f0f0f5",
        },
      });

      const clean = sanitizeMermaidCode(rawCode);

      // Use a unique ID that starts with a letter (required by mermaid)
      mermaidRenderCounter += 1;
      const id = `rr-mermaid-${mermaidRenderCounter}`;

      // Create a detached container for mermaid to render into
      // This avoids issues with mermaid trying to find/modify DOM nodes
      const container = document.createElement("div");
      container.id = id;
      container.style.visibility = "hidden";
      container.style.position = "absolute";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      try {
        const { svg: rendered } = await mermaid.render(id, clean);
        setSvg(rendered);
        setRenderError("");
      } finally {
        // Always clean up the temporary container
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        // Also clean up any leftover mermaid elements
        const leftover = document.getElementById(id);
        if (leftover) leftover.remove();
        const leftoverD = document.getElementById(`d${id}`);
        if (leftoverD) leftoverD.remove();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Render failed";
      setRenderError(msg.length > 300 ? msg.slice(0, 300) + "…" : msg);
    } finally {
      setIsRendering(false);
    }
  }, []);

  useEffect(() => {
    renderDiagram(code);
  }, [code, renderDiagram]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Mermaid code copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  };

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Architecture Diagram
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Type dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setTypeOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "5px 10px", borderRadius: "var(--radius-sm)",
                background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                color: "var(--text-secondary)", fontSize: "var(--text-xs)",
                cursor: "pointer", fontFamily: "var(--font-ui)",
              }}
            >
              {TYPE_LABELS[activeType]}
              <ChevronDown size={11} />
            </button>
            {typeOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0,
                  background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", overflow: "hidden",
                  zIndex: 20, minWidth: 110, boxShadow: "var(--shadow-lg)",
                }}
              >
                {(Object.keys(TYPE_LABELS) as DiagramType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setActiveType(t); setTypeOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "8px 12px",
                      background: activeType === t ? "var(--bg-hover)" : "transparent",
                      border: "none",
                      color: activeType === t ? "var(--text-primary)" : "var(--text-secondary)",
                      fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-ui)",
                    }}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconBtn onClick={handleCopyCode}    title="Copy Mermaid code" disabled={!code}>
            <Copy size={13} />
          </IconBtn>
          <IconBtn onClick={handleDownloadSvg} title="Download SVG"      disabled={!svg}>
            <Download size={13} />
          </IconBtn>
          {onSaveToPuter && (
            <IconBtn onClick={() => svg && onSaveToPuter(svg)} title="Save to Puter FS" disabled={!svg}>
              <Save size={13} />
            </IconBtn>
          )}
        </div>
      </div>

      {/* ── Diagram area ─────────────────────────────── */}
      <div
        style={{
          minHeight: 280,
          overflowX: "auto",
          overflowY: "hidden",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        {isRendering && <LoadingDots />}

        {!isRendering && svg && (
          <div
            ref={displayRef}
            style={{ width: "100%", maxWidth: "100%" }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}

        {!isRendering && !svg && renderError && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "var(--radius-sm)", marginBottom: 12,
              }}
            >
              <span style={{ fontSize: "var(--text-xs)", color: "var(--score-red)" }}>
                Diagram render failed — showing raw code
              </span>
              {onFixRequest && (
                <button
                  onClick={onFixRequest}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: "var(--radius-sm)",
                    background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                    color: "var(--text-secondary)", fontSize: "var(--text-xs)",
                    cursor: "pointer", fontFamily: "var(--font-ui)",
                  }}
                >
                  <RefreshCw size={11} />
                  Try to fix
                </button>
              )}
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
                color: "var(--text-secondary)", whiteSpace: "pre-wrap",
                wordBreak: "break-word", lineHeight: 1.6, padding: 14,
                background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)", maxHeight: 320, overflowY: "auto",
              }}
            >
              {code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const IconBtn: React.FC<{
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 30, height: 30, borderRadius: "var(--radius-sm)",
      background: "transparent", border: "1px solid var(--border)",
      color: disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background var(--transition-fast), color var(--transition-fast)",
      opacity: disabled ? 0.4 : 1,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      (e.currentTarget as HTMLButtonElement).style.color = disabled ? "var(--text-tertiary)" : "var(--text-secondary)";
    }}
  >
    {children}
  </button>
);

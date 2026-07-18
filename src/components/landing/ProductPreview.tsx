import { Activity, AlertTriangle, ArrowUpRight, GitBranch, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const findings = [
  ["01", "Dependency drift", "3 packages behind stable"],
  ["02", "Auth boundary", "Add a rate limit policy"],
  ["03", "Critical coverage", "82% of key paths"],
];

const navItems = ["Overview", "Architecture", "Health report", "Codebase Q&A"];

// Sample architecture diagram - clean and simple
const SAMPLE_MERMAID = `flowchart LR
    A[GitHub URL] --> B[RepoRecon]
    B --> C[Architecture Map]
    B --> D[Health Analysis]
    B --> E[AI Q&A]
    C --> F[Export Report]
    D --> F
    E --> F
    
    style A fill:#fff,stroke:#000,stroke-width:2px
    style B fill:#000,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#fff,stroke:#000,stroke-width:2px
    style D fill:#fff,stroke:#000,stroke-width:2px
    style E fill:#fff,stroke:#000,stroke-width:2px
    style F fill:#fff,stroke:#000,stroke-width:2px`;

export const ProductPreview = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [diagramSvg, setDiagramSvg] = useState("");

  useEffect(() => {
    (async () => {
      if (!mermaidRef.current) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#ffffff",
            primaryTextColor: "#000000",
            primaryBorderColor: "#000000",
            lineColor: "#000000",
            secondaryColor: "#f5f5f5",
            tertiaryColor: "#ffffff",
            background: "#ffffff",
            mainBkg: "#ffffff",
            secondBkg: "#f5f5f5",
            tertiaryBkg: "#ffffff",
            nodeBorder: "#000000",
            clusterBkg: "#ffffff",
            clusterBorder: "#000000",
            titleColor: "#000000",
            edgeLabelBackground: "#ffffff",
            nodeTextColor: "#000000",
          },
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
        });
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, SAMPLE_MERMAID);
        setDiagramSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    })();
  }, []);

  return (
  <section id="product" className="mono-product section-anchor" aria-labelledby="product-heading">
    <div className="mono-product-inner">
      <header className="mono-section-header">
        <span className="mono-section-eyebrow">Live analysis / workspace</span>
        <h2 id="product-heading" className="mono-section-title">
          One clear<br /><em>workspace.</em>
        </h2>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mono-product-shell"
      >
        {/* Vertical rail */}
        <div className="mono-product-rail" aria-hidden="true">
          <p>Live</p>
          <strong>40+</strong>
          <span>Users</span>
        </div>

        {/* Console */}
        <div className="mono-console">
          <div className="mono-console-topbar">
            <div className="flex items-center gap-2">
              <Activity size={14} strokeWidth={1.5} aria-hidden="true" />
              REPORECON / ANALYSIS
            </div>
            <span>
              <Activity size={12} strokeWidth={1.5} aria-hidden="true" />
              &nbsp;COMPLETE
            </span>
          </div>

          {/* Body: nav + main — nav hidden below lg via CSS */}
          <div className="mono-console-body">
            <aside className="mono-console-nav" aria-label="Console navigation">
              <div className="mono-console-nav-header">
                <Layers3 size={14} strokeWidth={1.5} aria-hidden="true" />
                Workspace
              </div>
              {navItems.map((item, i) => (
                <div
                  key={item}
                  className={`mono-console-nav-item${i === 0 ? " is-active" : ""}`}
                >
                  {item}
                </div>
              ))}
            </aside>

            <div className="mono-console-main">
              <div className="mono-console-heading">
                <div>
                  <p>Repository / Overview</p>
                  <h2>ASaha-os / RepoRecon</h2>
                </div>
                <button aria-label="Open full report">
                  Open report&nbsp;
                  <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <div className="mono-console-metrics">
                <Metric label="System health" value="84" detail="/100 stable" />
                <Metric label="Modules mapped" value="12" detail="in context" />
                <Metric label="Next actions" value="04" detail="needs review" />
              </div>

              <div className="mono-console-grid">
                <div className="mono-runtime-map">
                  <div className="mono-row">
                    <span className="mono-label">System Architecture</span>
                    <GitBranch size={14} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  
                  {/* Mermaid diagram */}
                  <div
                    ref={mermaidRef}
                    className="mono-mermaid-wrap"
                    aria-label="System architecture diagram"
                  >
                    {diagramSvg ? (
                      <div
                        className="mono-mermaid-svg"
                        dangerouslySetInnerHTML={{ __html: diagramSvg }}
                      />
                    ) : (
                      <div className="mono-mermaid-loading">
                        <span>Rendering architecture...</span>
                      </div>
                    )}
                  </div>
                  <span>Client → API Gateway → Services → Database</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
};

const Metric = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="mono-metric">
    <p>{label}</p>
    <strong>{value}</strong>
    <span>{detail}</span>
  </div>
);

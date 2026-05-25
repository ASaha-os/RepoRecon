import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, BarChart3, GitBranch, MessageSquare, Zap, Share2, FileDown } from "lucide-react";

const features = [
  {
    id: "health-score",
    icon: BarChart3,
    title: "Repository Health Score",
    tagline: "Security, performance, and maintainability — quantified at a glance.",
    detail:
      "Receive a composite health score card that breaks down your repository across security vulnerabilities, dependency freshness, code complexity, and documentation coverage. Each metric is scored independently, with clear benchmarks. Export as PNG for team reviews or stakeholder reports.",
  },
  {
    id: "architecture",
    icon: GitBranch,
    title: "Architecture Diagrams",
    tagline: "Auto-generated sequence diagrams from your actual data flow.",
    detail:
      "RepoRecon produces Mermaid sequence diagrams that map how data moves through your codebase — from API endpoints through service layers to data stores. No manual diagramming. The output reflects your real architecture, not assumptions.",
  },
  {
    id: "codebase-qa",
    icon: MessageSquare,
    title: "Codebase Q&A",
    tagline: "Ask precise questions. Get precise answers with full context.",
    detail:
      "Query your repository in natural language: \"Where is authentication handled?\" or \"What's the database schema?\" GPT-4o processes the entire project structure and README to deliver targeted, accurate answers — not generic guesses.",
  },
  {
    id: "instant-analysis",
    icon: Zap,
    title: "Sub-10s Analysis",
    tagline: "From URL to full architectural breakdown — no setup, no configuration.",
    detail:
      "Paste any public GitHub URL and receive a complete analysis in under 10 seconds. No tokens to configure, no OAuth flows, no CLI to install. The entire process runs in-browser via Puter AI with zero backend infrastructure on your end.",
  },
  {
    id: "shareable-links",
    icon: Share2,
    title: "Shareable Analysis Links",
    tagline: "Every analysis gets a unique, instantly-loadable URL.",
    detail:
      "Share your analysis with teammates, embed it in pull request descriptions, or post it in Slack. Each result is assigned a unique URL that loads the full analysis instantly — no re-computation required.",
  },
  {
    id: "pdf-export",
    icon: FileDown,
    title: "PDF Report Export",
    tagline: "Professional-grade reports ready for stakeholders.",
    detail:
      "Download a comprehensive PDF that includes architecture diagrams, health scores, detected issues, and prioritized recommendations. Formatted for executive reviews, architecture decision records, and technical audits.",
  },
];

export const FeatureGrid = () => (
  <section id="features" className="relative py-28 px-5 sm:px-8">
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="tag tag-navy mb-4">Capabilities</p>
        <h2 className="heading-xl mb-4">
          Precision tools for
          <br />
          <span className="accent-navy">engineering teams.</span>
        </h2>
        <p className="body-lg max-w-lg">
          Six analysis modules that deliver the architectural clarity usually
          requiring days of manual code review.
        </p>
      </motion.div>

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Accordion.Root type="single" collapsible className="border-t border-border">
          {features.map((feature, i) => (
            <Accordion.Item
              key={feature.id}
              value={feature.id}
              className="accordion-row group"
            >
              <Accordion.Trigger className="accordion-trigger">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors duration-200">
                    <feature.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-base font-semibold text-foreground tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
                      {feature.tagline}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center ml-4 shrink-0 group-hover:border-foreground/20 transition-colors duration-200">
                  <Plus className="w-4 h-4 text-muted-foreground accordion-chevron" />
                </div>
              </Accordion.Trigger>

              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="accordion-content-inner pl-14 pr-12">
                  <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl sm:hidden mb-3">
                    {feature.tagline}
                  </p>
                  <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                    {feature.detail}
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </motion.div>
    </div>
  </section>
);

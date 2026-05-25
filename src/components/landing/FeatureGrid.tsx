import { motion } from "framer-motion";
import { Zap, GitBranch, MessageSquare, BarChart3, Share2, FileDown } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Health Score Card",
    description: "Visual security, performance, and maintainability scores at a glance. Download as PNG and share anywhere.",
    accent: "violet",
  },
  {
    icon: GitBranch,
    title: "Architecture Diagrams",
    description: "Auto-generated Mermaid sequence diagrams that map your entire data flow — no manual diagramming needed.",
    accent: "sky",
  },
  {
    icon: MessageSquare,
    title: "AI Codebase Q&A",
    description: "Ask \"Where is auth handled?\" and get a precise answer in seconds. Powered by GPT-4o with full context.",
    accent: "emerald",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "From URL to full architectural breakdown in under 10 seconds. No setup, no configuration, no waiting.",
    accent: "violet",
  },
  {
    icon: Share2,
    title: "Shareable Links",
    description: "Every analysis gets a unique URL. Share with your team or post on social — results load instantly.",
    accent: "sky",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    description: "Download a professional report with diagrams, issues, and recommendations. Ready for stakeholders.",
    accent: "emerald",
  },
];

const accentMap = {
  violet:  { bg: "bg-violet-500/8 dark:bg-violet-500/12",  icon: "text-violet-600 dark:text-violet-400",  border: "border-violet-500/15" },
  sky:     { bg: "bg-sky-500/8 dark:bg-sky-500/12",        icon: "text-sky-600 dark:text-sky-400",        border: "border-sky-500/15" },
  emerald: { bg: "bg-emerald-500/8 dark:bg-emerald-500/12",icon: "text-emerald-600 dark:text-emerald-400",border: "border-emerald-500/15" },
};

export const FeatureGrid = () => (
  <section id="features" className="relative py-28 px-5 sm:px-8">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <motion.div
        className="max-w-2xl mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="tag tag-violet mb-4">Features</p>
        <h2 className="heading-xl text-foreground mb-4">
          Everything you need to
          <br />
          <span className="gradient-text">ship with confidence.</span>
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          RepoRecon gives you the architectural clarity that usually takes days of code reading — in seconds.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const a = accentMap[feature.accent as keyof typeof accentMap];
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group card-base p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-5 h-5 ${a.icon}`} />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

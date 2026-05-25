import { motion } from "framer-motion";
import { Link, Brain, LayoutDashboard, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link,
    title: "Paste a GitHub URL",
    description: "Any public repository. No tokens, no OAuth, no setup. Just the URL.",
    accent: "violet",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI reads the codebase",
    description: "GPT-4o fetches and processes the README and project structure in full context.",
    accent: "sky",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Get your dashboard",
    description: "Health score, architecture diagram, detected issues, and recommendations — all at once.",
    accent: "emerald",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Share or export",
    description: "Copy a shareable link, download a PNG scorecard, or export a full PDF report.",
    accent: "violet",
  },
];

const accentMap: Record<string, { num: string; line: string; icon: string }> = {
  violet:  { num: "text-violet-500",  line: "bg-violet-500/30",  icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20" },
  sky:     { num: "text-sky-500",     line: "bg-sky-500/30",     icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  emerald: { num: "text-emerald-500", line: "bg-emerald-500/30", icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
};

export const HowItWorks = () => (
  <section id="how-it-works" className="relative py-28 px-5 sm:px-8 bg-muted/30 dark:bg-muted/10">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="max-w-2xl mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="tag tag-sky mb-4">How it works</p>
        <h2 className="heading-xl text-foreground mb-4">
          From URL to insight
          <br />
          <span className="gradient-text">in four steps.</span>
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          No configuration. No sign-up. Just paste and go.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const a = accentMap[step.accent];
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card-base p-6 h-full"
            >
              <span className={`text-xs font-bold tracking-widest ${a.num} mb-4 block`}>
                {step.number}
              </span>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${a.icon}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

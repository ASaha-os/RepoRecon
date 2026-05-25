import { motion } from "framer-motion";
import { Link, Brain, LayoutDashboard, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link,
    title: "Paste a GitHub URL",
    description: "Any public repository. No tokens, no OAuth, no setup — just the URL.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI processes the codebase",
    description: "GPT-4o fetches the README and project structure, analyzing the full context in a single pass.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Receive your dashboard",
    description: "Health score, architecture diagram, detected issues, and prioritized recommendations — delivered instantly.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Share or export",
    description: "Copy a shareable link, download a PNG scorecard, or export a comprehensive PDF report.",
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="relative py-28 px-5 sm:px-8 bg-card">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="max-w-2xl mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="tag tag-navy mb-4">Process</p>
        <h2 className="heading-xl mb-4">
          From URL to insight
          <br />
          <span className="accent-navy">in four steps.</span>
        </h2>
        <p className="body-lg">
          No configuration. No sign-up. Paste and go.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="card-base p-6 h-full bg-background"
          >
            <span className="text-xs font-bold tracking-widest accent-navy mb-4 block">
              {step.number}
            </span>
            <div className="w-10 h-10 rounded-xl border border-border bg-muted flex items-center justify-center mb-4">
              <step.icon className="w-5 h-5 text-foreground/70" />
            </div>
            <h3 className="text-[15px] font-semibold text-foreground mb-2 tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

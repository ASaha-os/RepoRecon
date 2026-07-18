import { motion } from "framer-motion";
import { BrainCircuit, Github, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Drop the URL",
    text: "Start with the public repository. No installation, credentials, or project ceremony.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Read the Shape",
    text: "RepoRecon connects the structure, documentation, and dependencies into working context.",
  },
  {
    number: "03",
    icon: Send,
    title: "Make the Move",
    text: "Use the signal to orient a team, plan a change, or begin a focused review.",
  },
];

export const HowItWorks = () => (
  <section
    className="mono-workflow section-anchor"
    id="how-it-works"
    aria-labelledby="workflow-heading"
  >
    <div className="mono-workflow-inner">
      <header className="mono-section-header">
        <span className="mono-section-eyebrow">Workflow / fast by design</span>
        <h2 id="workflow-heading" className="mono-section-title">
          From URL<br /><em>to useful.</em>
        </h2>
      </header>

      <div className="mono-workflow-grid" role="list">
        {steps.map((step, i) => (
          <motion.article
            key={step.number}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
            className="mono-workflow-card"
          >
            {/* Background number */}
            <div className="mono-workflow-bg-num" aria-hidden="true">
              {step.number}
            </div>

            <span className="mono-workflow-step">{step.number}</span>

            <div className="mono-workflow-icon">
              <step.icon size={26} strokeWidth={1.5} aria-hidden="true" />
            </div>

            <h3 className="mono-workflow-title">{step.title}</h3>
            <p className="mono-workflow-desc">{step.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

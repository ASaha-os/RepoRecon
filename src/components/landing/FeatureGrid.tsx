import { motion } from "framer-motion";
import { FileOutput, GitBranch, MessageSquareText, ShieldAlert } from "lucide-react";

const features = [
  {
    number: "01",
    icon: GitBranch,
    title: "Map the System",
    description:
      "Make services, entry points, and runtime paths visible before you begin changing code.",
  },
  {
    number: "02",
    icon: ShieldAlert,
    title: "Find the Friction",
    description:
      "Surface dependency drift, fragile boundaries, and maintenance debt worth acting on.",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Ask Better Questions",
    description:
      "Query the repository in plain language and get answers tied to its actual structure.",
  },
  {
    number: "04",
    icon: FileOutput,
    title: "Send a Useful Brief",
    description:
      "Turn the review into a shared report for teammates, planning, and architecture decisions.",
  },
];

export const FeatureGrid = () => (
  <section className="mono-features section-anchor" id="features" aria-labelledby="features-heading">
    <div className="mono-features-inner">
      <header className="mono-section-header">
        <span className="mono-section-eyebrow">Capabilities / 01–04</span>
        <h2 id="features-heading" className="mono-section-title">
          Less guessing.<br /><em>More signal.</em>
        </h2>
      </header>

      <div className="mono-feature-grid" role="list">
        {features.map((feature, i) => (
          <motion.article
            key={feature.number}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            className="mono-feature-card group"
          >
            <div className="mono-feature-number" aria-hidden="true">
              {feature.number}
            </div>

            <div className="mono-feature-icon-wrap" aria-hidden="true">
              <feature.icon size={20} strokeWidth={1.5} />
            </div>

            <h3 className="mono-feature-title">{feature.title}</h3>
            <p className="mono-feature-desc">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

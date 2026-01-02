import { Cpu, Zap, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Cpu,
    title: "Gemini 1.5 Pro Context.",
    description: "We digest your entire repository in seconds, not pieces.",
    iconBg: "gradient-bg",
    iconColor: "text-white",
    glowColor: "shadow-purple/30",
  },
  {
    icon: Zap,
    title: "Lightning Fast Analysis.",
    description: "Get comprehensive code reviews and insights in seconds, completely free.",
    iconBg: "bg-cyan/20 border border-cyan/30",
    iconColor: "text-cyan",
    glowColor: "shadow-cyan/20",
  },
  {
    icon: GitBranch,
    title: "Mermaid.js Visualization.",
    description: "Turn spaghetti code into beautiful, interactive flowcharts instantly.",
    iconBg: "bg-teal/20 border border-teal/30",
    iconColor: "text-teal",
    glowColor: "shadow-teal/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export const FeatureGrid = () => {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            The power of{" "}
            <span className="gradient-text">2 million tokens.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the full context window advantage. No chunking, no loss of understanding.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  glowColor,
}: FeatureCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative p-8 rounded-3xl bg-card border border-border card-shadow hover:elevated-shadow transition-all duration-500"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-3xl gradient-bg opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500" />
      
      {/* Icon */}
      <motion.div 
        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${iconBg} mb-6 shadow-lg ${glowColor}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Decorative element */}
      <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full gradient-bg opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500" />
    </motion.div>
  );
};

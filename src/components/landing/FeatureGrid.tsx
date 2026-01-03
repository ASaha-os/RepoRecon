import { Zap, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

// Google Logo Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const features = [
  {
    icon: GoogleIcon,
    title: "Gemini 2.5 Flash-Latest.",
    description: "We digest your entire repository in seconds, not pieces.",
    iconBg: "bg-white",
    iconColor: "text-white",
    glowColor: "shadow-purple/30",
    isGoogle: true,
  },
  {
    icon: Zap,
    title: "Lightning Fast Analysis.",
    description: "Get comprehensive code reviews and insights in seconds, completely free.",
    iconBg: "bg-cyan/20 border border-cyan/30",
    iconColor: "text-cyan",
    glowColor: "shadow-cyan/20",
    isGoogle: false,
  },
  {
    icon: GitBranch,
    title: "Mermaid.js Visualization.",
    description: "Turn spaghetti code into beautiful, interactive flowcharts instantly.",
    iconBg: "bg-teal/20 border border-teal/30",
    iconColor: "text-teal",
    glowColor: "shadow-teal/20",
    isGoogle: false,
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
  isGoogle?: boolean;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  glowColor,
  isGoogle,
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
        {isGoogle ? (
          <Icon className="w-10 h-10" />
        ) : (
          <Icon className={`w-8 h-8 ${iconColor}`} />
        )}
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Decorative element */}
      <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full gradient-bg opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500" />
    </motion.div>
  );
};

import { Cpu, Zap, GitBranch } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Gemini 1.5 Pro Context.",
    description: "We digest your entire repository in seconds, not pieces.",
    gradient: "from-purple to-purple/50",
    iconBg: "bg-purple/10",
    iconColor: "text-purple",
  },
  {
    icon: Zap,
    title: "Solana Blinks.",
    description: "Micro-transactions right inside GitHub. Pay cents, not subscriptions.",
    gradient: "from-cyan to-cyan/50",
    iconBg: "bg-cyan/10",
    iconColor: "text-cyan",
  },
  {
    icon: GitBranch,
    title: "Mermaid.js Visualization.",
    description: "Turn spaghetti code into beautiful, interactive flowcharts instantly.",
    gradient: "from-teal to-teal/50",
    iconBg: "bg-teal/10",
    iconColor: "text-teal",
  },
];

export const FeatureGrid = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            The power of{" "}
            <span className="gradient-text">2 million tokens.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the full context window advantage. No chunking, no loss of understanding.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  index: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  index,
}: FeatureCardProps) => {
  return (
    <div
      className="group relative p-8 rounded-3xl bg-card border border-border card-shadow hover:elevated-shadow transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-3xl gradient-bg opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
      
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${iconBg} mb-6`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Decorative element */}
      <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full gradient-bg opacity-0 group-hover:opacity-5 blur-2xl transition-all duration-500" />
    </div>
  );
};

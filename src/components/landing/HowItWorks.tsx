import { ArrowRight, Sparkles, GitBranch, FileCode, Workflow, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  const steps = [
    { icon: GitBranch, label: "Paste Repo URL", color: "from-purple to-cyan" },
    { icon: FileCode, label: "AI Digests Code", color: "from-cyan to-teal" },
    { icon: Workflow, label: "Architecture Mapped", color: "from-teal to-purple" },
    { icon: Zap, label: "Insights Delivered", color: "from-purple to-cyan" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple/10 via-cyan/10 to-teal/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles className="w-4 h-4 text-purple" />
            <span className="text-sm font-medium text-muted-foreground">Simple & Powerful</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            From chaos to clarity
            <br />
            <span className="gradient-text">in one click.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Catchy dialogue */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple via-cyan to-teal rounded-full" />
              <div className="pl-8 space-y-6">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  Stop reading code.
                  <br />
                  <span className="gradient-text">Start understanding it.</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your codebase tells a story. We translate it into a visual masterpiece 
                  that even your non-technical stakeholders will love.
                </p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20">
                    <span className="w-2 h-2 rounded-full bg-purple animate-pulse" />
                    <span className="text-sm font-medium text-purple">2M Token Context</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                    <span className="text-sm font-medium text-cyan">Instant Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    <span className="text-sm font-medium text-teal">Free Forever</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Animated flowchart */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 gradient-bg rounded-3xl opacity-5 blur-xl" />
            <div className="relative p-8 rounded-3xl bg-card/50 border border-border backdrop-blur-sm">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {steps.map((step, index) => (
                  <motion.div key={index} className="relative" variants={stepVariants}>
                    {/* Step card */}
                    <motion.div 
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-background/80 border border-border hover:border-purple/30 transition-all duration-500 hover:shadow-lg hover:shadow-purple/10"
                      whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    >
                      {/* Icon container */}
                      <motion.div 
                        className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-[2px]`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-foreground" />
                        </div>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`} />
                      </motion.div>

                      {/* Step info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground">STEP {index + 1}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-foreground group-hover:gradient-text transition-all duration-300">
                          {step.label}
                        </h4>
                      </div>

                      {/* Status indicator */}
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.color} animate-pulse`} />
                    </motion.div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <motion.div 
                        className="absolute left-7 top-[72px] w-[2px] h-4 bg-gradient-to-b from-purple/50 to-cyan/50"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom result preview */}
              <motion.div 
                className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple/5 via-cyan/5 to-teal/5 border border-purple/20 cursor-pointer"
                onClick={scrollToTop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Ready to transform?</p>
                      <p className="text-xs text-muted-foreground">Click to get started</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple animate-pulse" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

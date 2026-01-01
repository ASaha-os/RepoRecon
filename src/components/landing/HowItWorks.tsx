import { ArrowRight, Sparkles, GitBranch, FileCode, Workflow, Zap } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    { icon: GitBranch, label: "Paste Repo URL", color: "from-purple to-cyan" },
    { icon: FileCode, label: "AI Digests Code", color: "from-cyan to-teal" },
    { icon: Workflow, label: "Architecture Mapped", color: "from-teal to-purple" },
    { icon: Zap, label: "Insights Delivered", color: "from-purple to-cyan" },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple/10 via-cyan/10 to-teal/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles className="w-4 h-4 text-purple" />
            <span className="text-sm font-medium text-muted-foreground">Simple & Powerful</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            From chaos to clarity
            <br />
            <span className="gradient-text">in one click.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Catchy dialogue */}
          <div className="space-y-8">
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
                <div className="flex flex-wrap gap-4">
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
                    <span className="text-sm font-medium text-teal">Pay Per Use</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Animated flowchart */}
          <div className="relative">
            <div className="absolute inset-0 gradient-bg rounded-3xl opacity-5 blur-xl" />
            <div className="relative p-8 rounded-3xl bg-card/50 border border-border backdrop-blur-sm">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step card */}
                    <div 
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-background/80 border border-border hover:border-purple/30 transition-all duration-500 hover:shadow-lg hover:shadow-purple/10"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Icon container */}
                      <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-foreground" />
                        </div>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`} />
                      </div>

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
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-7 top-[72px] w-[2px] h-4 bg-gradient-to-b from-purple/50 to-cyan/50" />
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom result preview */}
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple/5 via-cyan/5 to-teal/5 border border-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Ready to transform?</p>
                      <p className="text-xs text-muted-foreground">Your architecture awaits</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

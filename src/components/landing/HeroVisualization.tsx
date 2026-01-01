import { useEffect, useState } from "react";

export const HeroVisualization = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-center justify-center gap-8 p-8">
        {/* Left side - Chaotic code blocks */}
        <div className="flex-1 relative">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-lg bg-muted transition-all duration-1000 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{
                  width: `${60 + Math.random() * 40}%`,
                  transitionDelay: `${i * 100}ms`,
                  marginLeft: `${Math.random() * 20}%`,
                }}
              />
            ))}
          </div>
          {/* Floating code blocks */}
          <div 
            className={`absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center transition-all duration-1000 ${
              mounted ? "opacity-100 rotate-0" : "opacity-0 rotate-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-2xl">{"{ }"}</span>
          </div>
          <div 
            className={`absolute -bottom-4 -right-4 w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center transition-all duration-1000 ${
              mounted ? "opacity-100 rotate-0" : "opacity-0 -rotate-12"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="text-xl text-muted-foreground">fn()</span>
          </div>
        </div>

        {/* Center - Energy flow */}
        <div className="relative w-32 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-20">
            {/* Animated gradient arrow */}
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(270, 91%, 65%)" />
                <stop offset="50%" stopColor="hsl(186, 91%, 43%)" />
                <stop offset="100%" stopColor="hsl(168, 76%, 42%)" />
              </linearGradient>
            </defs>
            
            {/* Flow lines */}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M 10 ${25 + i * 5} Q 50 ${20 + i * 10} 90 ${25 + i * 5}`}
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: mounted ? 0 : 100,
                  transitionDelay: `${400 + i * 100}ms`,
                }}
              />
            ))}
            
            {/* Arrow head */}
            <polygon
              points="85,20 95,30 85,40"
              fill="url(#flowGradient)"
              className={`transition-all duration-700 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
              style={{ transitionDelay: "700ms" }}
            />
          </svg>
          
          {/* Glow effect */}
          <div className="absolute inset-0 gradient-bg opacity-20 blur-xl animate-pulse-glow" />
        </div>

        {/* Right side - Clean flowchart */}
        <div className="flex-1 relative">
          <div 
            className={`p-6 rounded-2xl bg-card border border-border card-shadow transition-all duration-1000 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Mini flowchart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">API</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-purple to-transparent" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan/20 border border-cyan/30 flex items-center justify-center">
                  <span className="text-cyan text-xs font-bold">DB</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan to-transparent" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/20 border border-teal/30 flex items-center justify-center">
                  <span className="text-teal text-xs font-bold">UI</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-teal to-transparent" />
              </div>
            </div>
          </div>
          
          {/* Glowing badge */}
          <div 
            className={`absolute -top-3 -right-3 px-3 py-1 rounded-full gradient-bg text-white text-xs font-semibold shadow-lg transition-all duration-1000 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            Analyzed ✓
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

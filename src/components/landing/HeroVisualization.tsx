import { useEffect, useState } from "react";

export const HeroVisualization = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative flex items-center justify-center gap-4 md:gap-8 p-4 md:p-8">
        {/* Left side - Chaotic code blocks */}
        <div className="flex-1 relative p-4 md:p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
          <div className="absolute -top-2 left-4 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-semibold">
            MESSY CODE
          </div>
          <div className="space-y-2 md:space-y-3 pt-4">
            {[
              { width: 85, offset: 0, color: "bg-destructive/20" },
              { width: 60, offset: 15, color: "bg-muted" },
              { width: 95, offset: 5, color: "bg-destructive/15" },
              { width: 45, offset: 25, color: "bg-muted" },
              { width: 75, offset: 10, color: "bg-destructive/20" },
              { width: 55, offset: 20, color: "bg-muted" },
            ].map((line, i) => (
              <div
                key={i}
                className={`h-6 md:h-8 rounded-lg ${line.color} transition-all duration-700 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{
                  width: `${line.width}%`,
                  marginLeft: `${line.offset}%`,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
          
          {/* Floating warning icons */}
          <div 
            className={`absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center transition-all duration-700 ${
              mounted ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-45"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-lg md:text-xl">⚠️</span>
          </div>
          <div 
            className={`absolute -bottom-2 -left-2 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted border border-border flex items-center justify-center transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="text-xs md:text-sm font-mono text-muted-foreground">{ }</span>
          </div>
        </div>

        {/* Center - Animated energy flow with particles */}
        <div className="relative w-20 md:w-40 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 120 80" className="w-full h-16 md:h-24">
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(270, 91%, 65%)">
                  <animate attributeName="stop-color" values="hsl(270, 91%, 65%);hsl(186, 91%, 43%);hsl(270, 91%, 65%)" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="hsl(186, 91%, 43%)">
                  <animate attributeName="stop-color" values="hsl(186, 91%, 43%);hsl(168, 76%, 42%);hsl(186, 91%, 43%)" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(168, 76%, 42%)">
                  <animate attributeName="stop-color" values="hsl(168, 76%, 42%);hsl(270, 91%, 65%);hsl(168, 76%, 42%)" dur="2s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main flow lines with animation */}
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M 5 ${30 + i * 5} Q 60 ${15 + i * 12} 115 ${30 + i * 5}`}
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth={3 - i * 0.3}
                strokeLinecap="round"
                filter="url(#glow)"
                className={`transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
                style={{
                  strokeDasharray: 200,
                  strokeDashoffset: mounted ? 0 : 200,
                  transitionDelay: `${400 + i * 80}ms`,
                }}
              />
            ))}
            
            {/* Animated particles along path */}
            {mounted && [0, 1, 2].map((i) => (
              <circle key={i} r="3" fill="url(#flowGradient)" filter="url(#glow)">
                <animateMotion
                  dur={`${1.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                  path="M 5 40 Q 60 40 115 40"
                />
              </circle>
            ))}
            
            {/* Arrow head */}
            <polygon
              points="105,25 120,40 105,55"
              fill="url(#flowGradient)"
              filter="url(#glow)"
              className={`transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: "900ms" }}
            />
          </svg>
          
          {/* Central AI processing indicator */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-xs md:text-sm font-bold">AI</span>
            </div>
          </div>
        </div>

        {/* Right side - Clean architecture diagram */}
        <div className="flex-1 relative">
          <div 
            className={`p-4 md:p-6 rounded-2xl bg-card border border-border card-shadow transition-all duration-700 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="absolute -top-2 left-4 px-3 py-1 rounded-full gradient-bg text-white text-[10px] font-semibold">
              CLEAN ARCHITECTURE
            </div>
            
            {/* Interactive flowchart */}
            <div className="space-y-3 pt-4">
              {/* API Layer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
                  <span className="text-white text-[10px] md:text-xs font-bold">API</span>
                </div>
                <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-purple via-cyan to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-purple/10 border border-purple/20 flex items-center justify-center">
                  <span className="text-[10px] text-purple">✓</span>
                </div>
              </div>
              
              {/* Connection line */}
              <div className="flex items-center pl-5 md:pl-6">
                <div className="w-0.5 h-4 rounded-full bg-gradient-to-b from-cyan to-teal" />
              </div>
              
              {/* Service Layer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan/20 border border-cyan/30 flex items-center justify-center shadow-lg shadow-cyan/10">
                  <span className="text-cyan text-[10px] md:text-xs font-bold">SVC</span>
                </div>
                <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-cyan via-teal to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <span className="text-[10px] text-cyan">✓</span>
                </div>
              </div>
              
              {/* Connection line */}
              <div className="flex items-center pl-5 md:pl-6">
                <div className="w-0.5 h-4 rounded-full bg-gradient-to-b from-teal to-teal/50" />
              </div>
              
              {/* Database Layer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal/20 border border-teal/30 flex items-center justify-center shadow-lg shadow-teal/10">
                  <span className="text-teal text-[10px] md:text-xs font-bold">DB</span>
                </div>
                <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-teal to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
                  <span className="text-[10px] text-teal">✓</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Success indicator */}
          <div 
            className={`absolute -top-4 -right-4 px-3 py-1.5 rounded-full gradient-bg text-white text-xs font-semibold shadow-lg shadow-purple/30 flex items-center gap-1.5 transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Analyzed ✓
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

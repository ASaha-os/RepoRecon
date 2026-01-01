import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { HeroVisualization } from "./HeroVisualization";

export const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full gradient-bg animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">Powered by Gemini 1.5 Pro & Solana</span>
        </div>

        {/* Main headline */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Your Senior AI Architect
          <br />
          <span className="gradient-text">is ready.</span>
        </h1>

        {/* Sub-headline */}
        <p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance opacity-0 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Instant GitHub repository analysis, architectural diagrams, and bug fixes powered by Gemini 1.5 Pro. Pay per insight with Solana.
        </p>

        {/* CTA Input Group */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-20 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="relative w-full sm:flex-1">
            <Input
              variant="glass"
              inputSize="xl"
              placeholder="Paste GitHub URL here..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="pr-4 w-full elevated-shadow"
            />
          </div>
          <Button variant="gradient" size="xl" className="w-full sm:w-auto group">
            Analyze Repo
            <span className="text-white/80 font-normal">(0.01 SOL)</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Hero Visualization */}
        <div 
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          <HeroVisualization />
        </div>
      </div>
    </section>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroVisualization } from "./HeroVisualization";
import { toast } from "sonner";

export const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleAnalyze = () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    toast.success(`Starting deep analysis for ${repoUrl}`, {
      description: "Generating comprehensive architecture review and diagrams...",
    });
    console.log("Analyzing:", repoUrl);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Enhanced background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[700px] h-[700px] bg-purple/20 dark:bg-purple/30 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-cyan/20 dark:bg-cyan/25 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal/10 dark:bg-teal/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple/20 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="w-4 h-4 text-purple animate-pulse" />
          <span className="text-sm font-medium text-foreground">Powered by Gemini 1.5 Pro</span>
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
          Instant GitHub repository analysis, architectural diagrams, and bug fixes powered by Gemini 1.5 Pro. Free, unlimited, in-depth.
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
              className="pr-4 w-full elevated-shadow border-purple/20 focus:border-purple/40"
            />
          </div>
          <Button 
            variant="gradient" 
            size="xl" 
            className="w-full sm:w-auto group shadow-lg shadow-purple/25"
            onClick={handleAnalyze}
          >
            Analyze Repo
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

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileText, GitBranch, Zap, Sparkles } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoUrl: string;
  onAnalyze: (tier: "basic" | "premium") => void;
}

export const PricingModal = ({ open, onOpenChange, repoUrl, onAnalyze }: PricingModalProps) => {
  const [selectedTier, setSelectedTier] = useState<"basic" | "premium" | null>(null);

  const handleAnalyze = () => {
    if (selectedTier) {
      onAnalyze(selectedTier);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold text-foreground">Choose Your Analysis</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Analyzing: <span className="font-mono text-sm gradient-text">{repoUrl || "your repository"}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {/* Basic Tier */}
          <div 
            onClick={() => setSelectedTier("basic")}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTier === "basic" 
                ? "border-purple bg-purple/5 shadow-lg shadow-purple/10" 
                : "border-border hover:border-muted-foreground/30 bg-card"
            }`}
          >
            {selectedTier === "basic" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple text-white text-xs font-semibold">
                Selected
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Basic</h3>
                <p className="text-muted-foreground text-sm">Quick review</p>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold gradient-text">0.01</span>
              <span className="text-muted-foreground font-medium">SOL</span>
            </div>
            
            <ul className="space-y-3">
              {[
                "Plain text analysis",
                "Code quality review",
                "Basic recommendations",
                "Security overview",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-purple flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Tier */}
          <div 
            onClick={() => setSelectedTier("premium")}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTier === "premium" 
                ? "border-cyan bg-cyan/5 shadow-lg shadow-cyan/10" 
                : "border-border hover:border-muted-foreground/30 bg-card"
            }`}
          >
            <div className="absolute -top-3 right-4 px-3 py-1 rounded-full gradient-bg text-white text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Popular
            </div>
            
            {selectedTier === "premium" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan text-white text-xs font-semibold">
                Selected
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Premium</h3>
                <p className="text-muted-foreground text-sm">Full architecture</p>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold gradient-text">0.05</span>
              <span className="text-muted-foreground font-medium">SOL</span>
            </div>
            
            <ul className="space-y-3">
              {[
                "Everything in Basic",
                "Mermaid.js diagrams",
                "Interactive flowcharts",
                "Architecture visualization",
                "Dependency graph",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-cyan flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            className="flex-1 gap-2"
            disabled={!selectedTier}
            onClick={handleAnalyze}
          >
            <Zap className="w-4 h-4" />
            Analyze ({selectedTier === "premium" ? "0.05" : "0.01"} SOL)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

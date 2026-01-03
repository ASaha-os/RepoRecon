import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { HeroVisualization } from "./HeroVisualization";
import { AnalysisResults } from "./AnalysisResults";
import { toast } from "sonner";

interface AnalysisData {
  summary: string;
  mermaid_code: string;
  detected_issues: string[];
  fix_recommendations: string[];
}

export const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when analysis completes
  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [analysisResult]);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(`Analyzing ${repoUrl}...`);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const analyzeEndpoint = `${apiUrl}/api/analyze/`;
      console.log("Making request to:", analyzeEndpoint);
      console.log("Request body:", { github_url: repoUrl });

      const response = await fetch(analyzeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ github_url: repoUrl }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Analysis failed`;
        try {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (responseData.success && responseData.data) {
        toast.dismiss(loadingToast);
        toast.success("Analysis complete!", {
          description: "Repository analyzed successfully",
        });
        console.log("Analysis result:", responseData.data);
        // Set results to display in UI
        setAnalysisResult(responseData.data);
      } else {
        throw new Error(responseData.error || "Analysis returned no data");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      let errorMessage = "Network error or backend server is not running on http://localhost:8000";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || 
            error.message.includes("NetworkError") ||
            error.message.includes("Network request failed") ||
            error.name === "TypeError") {
          errorMessage = "Cannot connect to backend server. Please ensure:\n1. Django server is running on http://localhost:8000\n2. CORS is properly configured\n3. No firewall is blocking the connection";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error("Fetch error details:", error);
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      toast.error("Analysis failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Enhanced background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[700px] h-[700px] bg-purple/20 dark:bg-purple/30 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-cyan/20 dark:bg-cyan/25 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal/10 dark:bg-teal/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge with Google & Gemini branding */}
        <div 
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-purple/20 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Google Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          
          {/* Gemini Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285F4"/>
                <stop offset="50%" stopColor="#9B72CB"/>
                <stop offset="100%" stopColor="#D96570"/>
              </linearGradient>
            </defs>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="url(#geminiGradient)"/>
          </svg>
          
          <span className="text-sm font-medium text-foreground">Powered by Gemini 2.5 Flash-Latest</span>
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
          Instant GitHub repository analysis, architectural diagrams, and bug fixes powered by Gemini 2.5 Flash-Latest. Free, unlimited, in-depth.
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
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Repo"}
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

        {/* Analysis Results */}
        {analysisResult && (
          <div ref={resultsRef}>
            <AnalysisResults 
              data={analysisResult} 
              repoUrl={repoUrl}
              onClose={() => setAnalysisResult(null)} 
            />
          </div>
        )}
      </div>
    </section>
  );
};

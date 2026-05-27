import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Share2, Github } from "lucide-react";
import { AnalysisResults } from "./AnalysisResults";
import { RepoHealthScore } from "./RepoHealthScore";
import { CodebaseQA } from "./CodebaseQA";
import { toast } from "sonner";
import { analyzeRepo, type AnalysisData } from "@/lib/puterAI";
import {
  saveAnalysis, loadAnalysis, generateShareableUrl,
  getShareIdFromUrl, clearOldAnalyses, type ShareableAnalysis,
} from "@/lib/shareUtils";

const EXAMPLE_REPOS = [
  "https://github.com/expressjs/express",
  "https://github.com/pallets/flask",
  "https://github.com/sindresorhus/awesome",
];

export const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [shareableId, setShareableId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shareId = getShareIdFromUrl();
    if (shareId) {
      const shared = loadAnalysis(shareId);
      if (shared) {
        setRepoUrl(shared.repoUrl);
        setAnalysisResult(shared.data);
        setShareableId(shareId);
        toast.success("Loaded shared analysis");
      }
    }
    clearOldAnalyses();
  }, []);

  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [analysisResult]);

  const handleAnalyze = async (url?: string) => {
    const target = (url ?? repoUrl).trim();
    if (!target) { toast.error("Please enter a GitHub repository URL"); return; }
    if (url) setRepoUrl(url);

    setIsLoading(true);
    const loadingToast = toast.loading("Analyzing repository…");

    try {
      const data = await analyzeRepo(target);
      toast.dismiss(loadingToast);
      toast.success("Analysis complete");

      const shareableAnalysis: ShareableAnalysis = { repoUrl: target, timestamp: Date.now(), data };
      const id = saveAnalysis(shareableAnalysis);
      setShareableId(id);
      window.history.pushState({}, "", `${window.location.pathname}?share=${id}`);
      setAnalysisResult(data);
    } catch (error) {
      toast.dismiss(loadingToast);
      const msg = error instanceof Error ? error.message : "Analysis failed";
      toast.error("Analysis failed", { description: msg, duration: 6000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareableId) return;
    const url = generateShareableUrl(shareableId);
    try {
      if (navigator.share) {
        await navigator.share({ title: `RepoRecon — ${repoUrl}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch { /* user cancelled */ }
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 pt-28 pb-20">

      {/* ── Video Background ─────────────────────────── */}
      <div className="video-overlay">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <source src="/static/home-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">

        {/* ── Eyebrow badge ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm mb-8 text-xs font-medium text-muted-foreground"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Powered by Puter AI · Free · No API Key Needed
        </motion.div>

        {/* ── Headline ────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="display mb-6"
        >
          Understand any codebase
          <br />
          <span className="accent-navy">in seconds.</span>
        </motion.h1>

        {/* ── Sub-headline ────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="body-lg max-w-xl mx-auto mb-12 text-pretty"
        >
          Paste a GitHub URL. Get an AI-generated architecture diagram, health
          score, detected issues, and actionable fixes — instantly.
        </motion.p>

        {/* ── Input row ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-5"
        >
          <div className="relative flex-1">
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAnalyze()}
              className="pl-10 h-12 w-full rounded-xl border-border bg-white dark:bg-card text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:ring-primary/15 shadow-sm"
            />
          </div>
          <Button
            size="lg"
            className="group shrink-0 h-12 px-7 font-semibold rounded-xl bg-navy text-white hover:bg-navy/90 shadow-lg transition-all duration-200"
            onClick={() => handleAnalyze()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* ── Example repos ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_REPOS.map((repo) => {
            const name = repo.split("/").slice(-2).join("/");
            return (
              <button
                key={repo}
                onClick={() => handleAnalyze(repo)}
                disabled={isLoading}
                className="tag hover:tag-navy transition-all duration-150 disabled:opacity-40"
              >
                {name}
              </button>
            );
          })}
        </motion.div>

        {/* ── Social proof strip ──────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          {[
            { icon: "⚡", text: "Instant analysis" },
            { icon: "🔒", text: "No sign-up required" },
            { icon: "🆓", text: "Always free" },
            { icon: "🤖", text: "GPT-4o powered" },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-1.5">
              <span>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Results ─────────────────────────────────── */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl mx-auto mt-20 space-y-6"
          >
            {/* Share bar */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-muted-foreground">
                Analysis for <span className="font-medium text-foreground">{repoUrl}</span>
              </p>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 h-8 text-xs">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
            </div>

            <RepoHealthScore data={analysisResult} repoUrl={repoUrl} />
            <CodebaseQA repoUrl={repoUrl} analysisData={analysisResult} />
            <AnalysisResults
              data={analysisResult}
              repoUrl={repoUrl}
              onClose={() => {
                setAnalysisResult(null);
                setShareableId(null);
                window.history.pushState({}, "", window.location.pathname);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, FileCode, BookOpen, AlertTriangle, CheckCircle2, TrendingUp, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HealthMetrics { overall: number; security: number; performance: number; maintainability: number; documentation: number; }
interface RepoHealthScoreProps {
  data: { summary: string; detected_issues: string[]; fix_recommendations: string[]; };
  repoUrl: string;
}

const scoreColor = (s: number) => s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-red-500";
const barColor   = (s: number) => s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500";
const scoreLabel = (s: number) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs work";

const metrics = [
  { key: "security",       label: "Security",        icon: Shield },
  { key: "performance",    label: "Performance",     icon: Zap },
  { key: "maintainability",label: "Maintainability", icon: FileCode },
  { key: "documentation",  label: "Documentation",   icon: BookOpen },
] as const;

export const RepoHealthScore = ({ data, repoUrl }: RepoHealthScoreProps) => {
  const [scores, setScores] = useState<HealthMetrics>({ overall: 0, security: 0, performance: 0, maintainability: 0, documentation: 0 });

  useEffect(() => {
    let security = 85, performance = 80, maintainability = 75, documentation = 70;
    data.detected_issues.forEach((issue) => {
      const l = issue.toLowerCase();
      if (/security|vulnerability|auth|password|token|xss|sql/.test(l)) security -= 10;
      if (/performance|slow|memory|leak|optim|cache/.test(l))           performance -= 10;
      if (/complex|duplicate|refactor|debt|coupling/.test(l))           maintainability -= 10;
      if (/doc|comment|readme|undocumented/.test(l))                    documentation -= 10;
    });
    security       = Math.max(30, Math.min(100, security));
    performance    = Math.max(30, Math.min(100, performance));
    maintainability= Math.max(30, Math.min(100, maintainability));
    documentation  = Math.max(30, Math.min(100, documentation));
    const overall  = Math.round((security + performance + maintainability + documentation) / 4);
    setTimeout(() => setScores({ overall, security, performance, maintainability, documentation }), 200);
  }, [data]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${repoUrl.split("/").pop()} — Score ${scores.overall}/100`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch { /* cancelled */ }
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = document.getElementById("health-score-card");
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
      const a = document.createElement("a");
      a.download = `${repoUrl.split("/").pop()}-health-score.png`;
      a.href = canvas.toDataURL();
      a.click();
      toast.success("Card downloaded");
    } catch { toast.error("Download failed"); }
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <div id="health-score-card" className="card-base p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground tracking-tight mb-0.5">Repository Health</h3>
          <p className="text-sm text-muted-foreground truncate max-w-xs">{repoUrl}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleShare} className="h-8 gap-1.5 text-xs">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> PNG
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-center">
        {/* Circular score */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 mx-auto sm:mx-0"
        >
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none"
                stroke={scores.overall >= 80 ? "#10b981" : scores.overall >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8" strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${(scores.overall / 100) * circumference} ${circumference}` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-4xl font-bold tabular-nums ${scoreColor(scores.overall)}`}
              >
                {scores.overall}
              </motion.span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <span className={`text-sm font-semibold ${scoreColor(scores.overall)}`}>
            {scoreLabel(scores.overall)}
          </span>
        </motion.div>

        {/* Metric bars */}
        <div className="space-y-4">
          {metrics.map(({ key, label, icon: Icon }, i) => {
            const val = scores[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${scoreColor(val)}`}>{val}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${barColor(val)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border">
        {[
          { icon: AlertTriangle, value: data.detected_issues.length,      label: "Issues",          color: "text-red-500" },
          { icon: CheckCircle2,  value: data.fix_recommendations.length,  label: "Recommendations", color: "text-emerald-500" },
          { icon: TrendingUp,    value: `${Math.max(0, 100 - data.detected_issues.length * 5)}%`, label: "Potential", color: "text-sky-500" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xl font-bold text-foreground tabular-nums">{value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { X, GitBranch, AlertTriangle, Lightbulb, Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisData { summary: string; mermaid_code: string; detected_issues: string[]; fix_recommendations: string[]; }
interface AnalysisResultsProps { data: AnalysisData; repoUrl?: string; onClose: () => void; }

export const AnalysisResults = ({ data, repoUrl, onClose }: AnalysisResultsProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [diagramSvg, setDiagramSvg] = useState("");
  const [diagramError, setDiagramError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!data.mermaid_code || !mermaidRef.current) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
        const clean = data.mermaid_code.replace(/\\n/g, "\n").replace(/\\t/g, "  ").trim();
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, clean);
        setDiagramSvg(svg);
      } catch {
        setDiagramError("Could not render diagram — showing raw code.");
      }
    })();
  }, [data.mermaid_code]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const m = 16, cw = W - m * 2;
      let y = 22;

      const addPage = () => { pdf.addPage(); y = 22; };
      const checkY = (need: number) => { if (y + need > H - 20) addPage(); };

      pdf.setFontSize(20); pdf.setTextColor(109, 40, 217);
      pdf.text("Repository Analysis Report", W / 2, y, { align: "center" }); y += 9;
      if (repoUrl) { pdf.setFontSize(9); pdf.setTextColor(120,120,120); pdf.text(repoUrl, W/2, y, { align:"center" }); y += 5; }
      pdf.setFontSize(8); pdf.setTextColor(150,150,150);
      pdf.text(`Generated ${new Date().toLocaleString()}`, W/2, y, { align:"center" }); y += 10;
      pdf.setDrawColor(200,200,200); pdf.setLineWidth(0.3); pdf.line(m, y, W-m, y); y += 8;

      const section = (title: string, r: number, g: number, b: number) => {
        checkY(14); pdf.setFontSize(13); pdf.setTextColor(r,g,b); pdf.text(title, m, y); y += 8;
        pdf.setFontSize(10); pdf.setTextColor(50,50,50);
      };

      section("Summary", 109, 40, 217);
      const sl = pdf.splitTextToSize(data.summary || "No summary", cw);
      checkY(sl.length * 5); pdf.text(sl, m, y); y += sl.length * 5 + 8;

      section(`Detected Issues (${data.detected_issues.length})`, 220, 38, 38);
      data.detected_issues.forEach((issue, i) => {
        const lines = pdf.splitTextToSize(`${i+1}. ${issue}`, cw - 4);
        checkY(lines.length * 5 + 3); pdf.text(lines, m+4, y); y += lines.length * 5 + 3;
      });
      y += 6;

      section(`Recommendations (${data.fix_recommendations.length})`, 5, 150, 105);
      data.fix_recommendations.forEach((rec, i) => {
        const lines = pdf.splitTextToSize(`${i+1}. ${rec}`, cw - 4);
        checkY(lines.length * 5 + 3); pdf.text(lines, m+4, y); y += lines.length * 5 + 3;
      });

      const pages = pdf.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        pdf.setPage(i); pdf.setFontSize(7); pdf.setTextColor(180,180,180);
        pdf.text(`Page ${i} of ${pages} · RepoRecon`, W/2, H-8, { align:"center" });
      }

      pdf.save(`reporecon-${repoUrl?.split("/").pop() ?? "analysis"}.pdf`);
      const { toast } = await import("sonner");
      toast.success("PDF downloaded");
    } catch {
      const { toast } = await import("sonner");
      toast.error("PDF generation failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Full Report</h3>
            <p className="text-xs text-muted-foreground">Architecture breakdown</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isDownloading} className="h-8 gap-1.5 text-xs">
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {isDownloading ? "Generating…" : "PDF"}
          </Button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-3.5 h-3.5 text-foreground/60" />
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Summary</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>

        {/* Diagram */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-3.5 h-3.5 text-foreground/60" />
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Architecture Diagram</span>
          </div>
          <div ref={mermaidRef} className="bg-background rounded-lg border border-border overflow-x-auto p-4 min-h-[120px] flex items-center justify-center">
            {diagramSvg ? (
              <div className="w-full" dangerouslySetInnerHTML={{ __html: diagramSvg }} />
            ) : diagramError ? (
              <div>
                <p className="text-xs text-amber-500 mb-2">{diagramError}</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{data.mermaid_code}</pre>
              </div>
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Issues + Recommendations */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                Issues ({data.detected_issues.length})
              </span>
            </div>
            {data.detected_issues.length > 0 ? (
              <ul className="space-y-2">
                {data.detected_issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-red-500">{i+1}</span>
                    <span className="leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No issues detected</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Recommendations ({data.fix_recommendations.length})
              </span>
            </div>
            {data.fix_recommendations.length > 0 ? (
              <ul className="space-y-2">
                {data.fix_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-emerald-500">✓</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recommendations</p>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Analysis generated by AI · Results may vary · Always verify critical findings manually
        </p>
      </div>
    </div>
  );
};

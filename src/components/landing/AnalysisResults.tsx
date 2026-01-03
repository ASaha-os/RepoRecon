import { useEffect, useRef, useState } from "react";
import { X, FileText, GitBranch, AlertTriangle, Lightbulb, Download, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisData {
  summary: string;
  mermaid_code: string;
  detected_issues: string[];
  fix_recommendations: string[];
}

interface AnalysisResultsProps {
  data: AnalysisData;
  repoUrl?: string;
  onClose: () => void;
}

export const AnalysisResults = ({ data, repoUrl, onClose }: AnalysisResultsProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [diagramSvg, setDiagramSvg] = useState<string>("");
  const [diagramError, setDiagramError] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!data.mermaid_code || !mermaidRef.current) return;

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default;
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
        });

        // Clean up mermaid code - remove extra escapes
        const cleanCode = data.mermaid_code
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "  ")
          .trim();

        // Generate unique ID for this render
        const id = `mermaid-${Date.now()}`;
        
        const { svg } = await mermaid.render(id, cleanCode);
        setDiagramSvg(svg);
        setDiagramError("");
      } catch (err) {
        console.error("Mermaid render error:", err);
        setDiagramError("Could not render diagram. Showing raw code.");
        setDiagramSvg("");
      }
    };

    renderDiagram();
  }, [data.mermaid_code]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const { jsPDF } = await import("jspdf");
      
      // Create PDF with A4 format
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;
      
      // Title
      pdf.setFontSize(22);
      pdf.setTextColor(139, 92, 246);
      pdf.text("Repository Analysis Report", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;
      
      // Repo URL
      if (repoUrl) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(repoUrl, pageWidth / 2, yPos, { align: "center" });
        yPos += 6;
      }
      
      // Date
      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      // Divider line
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Summary Section
      pdf.setFontSize(14);
      pdf.setTextColor(139, 92, 246);
      pdf.text("Summary", margin, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      const summaryLines = pdf.splitTextToSize(data.summary || "No summary available", contentWidth);
      pdf.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 10;
      
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Detected Issues Section
      pdf.setFontSize(14);
      pdf.setTextColor(220, 38, 38);
      pdf.text(`Detected Issues (${data.detected_issues.length})`, margin, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      if (data.detected_issues.length > 0) {
        data.detected_issues.forEach((issue, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          const issueLines = pdf.splitTextToSize(`${index + 1}. ${issue}`, contentWidth - 5);
          pdf.text(issueLines, margin + 5, yPos);
          yPos += issueLines.length * 5 + 3;
        });
      } else {
        pdf.text("No issues detected", margin + 5, yPos);
        yPos += 8;
      }
      yPos += 7;
      
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Recommendations Section
      pdf.setFontSize(14);
      pdf.setTextColor(20, 184, 166);
      pdf.text(`Recommendations (${data.fix_recommendations.length})`, margin, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      if (data.fix_recommendations.length > 0) {
        data.fix_recommendations.forEach((rec, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, contentWidth - 5);
          pdf.text(recLines, margin + 5, yPos);
          yPos += recLines.length * 5 + 3;
        });
      } else {
        pdf.text("No recommendations", margin + 5, yPos);
        yPos += 8;
      }
      yPos += 10;
      
      // Check if we need a new page for mermaid code
      if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Mermaid Code Section (as text)
      if (data.mermaid_code) {
        pdf.setFontSize(14);
        pdf.setTextColor(6, 182, 212);
        pdf.text("Architecture Diagram Code", margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        const cleanCode = data.mermaid_code.replace(/\\n/g, "\n").replace(/\\t/g, "  ");
        const codeLines = pdf.splitTextToSize(cleanCode, contentWidth);
        
        // Only include first 30 lines to avoid overflow
        const limitedLines = codeLines.slice(0, 30);
        limitedLines.forEach((line: string) => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, margin, yPos);
          yPos += 4;
        });
        
        if (codeLines.length > 30) {
          pdf.text("... (truncated)", margin, yPos);
        }
      }
      
      // Footer on last page
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${pageCount} | Generated by RepoRecon`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
      
      // Save PDF
      const fileName = repoUrl 
        ? `reporecon-${repoUrl.split("/").pop()}-${Date.now()}.pdf`
        : `reporecon-analysis-${Date.now()}.pdf`;
      pdf.save(fileName);
      
      const { toast } = await import("sonner");
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      const { toast } = await import("sonner");
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="relative p-6 md:p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm card-shadow">
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Analysis Complete</h3>
              <p className="text-sm text-muted-foreground">Repository architecture breakdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Report content for PDF capture */}
        <div ref={reportRef}>
          {/* Summary Section */}
          <div className="mb-6 p-4 rounded-xl bg-purple/5 border border-purple/20">
            <h4 className="text-sm font-semibold text-purple mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Summary
            </h4>
            <p className="text-foreground leading-relaxed">{data.summary}</p>
          </div>

          {/* Mermaid Diagram Section */}
          <div className="mb-6 p-4 rounded-xl bg-cyan/5 border border-cyan/20">
            <h4 className="text-sm font-semibold text-cyan mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Architecture Diagram
            </h4>
            <div 
              ref={mermaidRef}
              className="bg-card/80 p-4 rounded-lg border border-border/50 overflow-x-auto"
            >
              {diagramSvg ? (
                <div 
                  className="flex justify-center"
                  dangerouslySetInnerHTML={{ __html: diagramSvg }} 
                />
              ) : diagramError ? (
                <div>
                  <p className="text-sm text-amber-500 mb-2">{diagramError}</p>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    <code>{data.mermaid_code}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan" />
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Issues Section */}
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <h4 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Detected Issues ({data.detected_issues.length})
              </h4>
              {data.detected_issues.length > 0 ? (
                <ul className="space-y-2">
                  {data.detected_issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-destructive">{index + 1}</span>
                      </span>
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No issues detected</p>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="p-4 rounded-xl bg-teal/5 border border-teal/20">
              <h4 className="text-sm font-semibold text-teal mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Recommendations ({data.fix_recommendations.length})
              </h4>
              {data.fix_recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {data.fix_recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-teal">✓</span>
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recommendations</p>
              )}
            </div>
          </div>

          {/* Developer Note */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-500 mb-1 flex items-center gap-2">
                  Developer Note
                  {/* Google Logo */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This analysis is generated by AI (Gemini 2.5 Flash-Latest) and may occasionally produce inaccurate or incomplete results. 
                  If you encounter unexpected output, please refresh the page or try again after a brief interval. 
                  As this service operates on a free tier, intermittent errors or rate limiting may occur during high-traffic periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

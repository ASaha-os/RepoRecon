import { useEffect, useRef, useState } from "react";
import { X, FileText, GitBranch, AlertTriangle, Lightbulb, Download, Loader2 } from "lucide-react";
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
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Dynamically import to avoid build issues
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(139, 92, 246);
      pdf.text("Repository Analysis Report", pdfWidth / 2, 15, { align: "center" });
      
      if (repoUrl) {
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(repoUrl, pdfWidth / 2, 22, { align: "center" });
      }
      
      pdf.setFontSize(8);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth / 2, 28, { align: "center" });
      
      // Add the captured content
      pdf.addImage(imgData, "PNG", imgX, 35, imgWidth * ratio, imgHeight * ratio);
      
      // Save PDF
      const fileName = repoUrl 
        ? `analysis-${repoUrl.split("/").pop()}-${Date.now()}.pdf`
        : `analysis-report-${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation error:", err);
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
        </div>
      </div>
    </div>
  );
};

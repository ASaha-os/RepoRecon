import { Github, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA band */}
      <div className="py-24 px-5 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="tag tag-navy mx-auto mb-6 w-fit">Get started today</p>
          <h2 className="heading-xl mb-4">
            Ready to understand
            <br />
            <span className="accent-navy">your codebase?</span>
          </h2>
          <p className="body-lg mb-10 max-w-md mx-auto">
            Free, instant, no sign-up. Paste a GitHub URL and get a full
            architectural analysis in seconds.
          </p>
          <Button
            size="lg"
            className="group h-12 px-8 font-semibold rounded-xl bg-navy text-white hover:bg-navy/90 shadow-lg transition-all duration-200"
            onClick={scrollToTop}
          >
            Analyze a repo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border px-5 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={scrollToTop} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-sm text-foreground">RepoRecon</span>
          </button>

          <p className="text-xs text-muted-foreground order-last sm:order-none">
            © 2026 RepoRecon · Built by{" "}
            <a
              href="https://www.linkedin.com/in/akash-s-764359307/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Akash Saha
            </a>
          </p>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ASaha-os/RepoRecon"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/akash-s-764359307/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

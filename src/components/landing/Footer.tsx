import { Github, Linkedin, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-24 px-6 border-t border-border bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple animate-pulse" />
            <span className="text-sm font-medium text-foreground">Start your journey</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Ready to{" "}
            <span className="gradient-text">transform</span>
            <br />
            your codebase?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of developers who trust RepoRecon for instant, AI-powered code analysis.
          </p>
          
          <Button 
            variant="gradient" 
            size="xl" 
            className="group shadow-lg shadow-purple/25"
            onClick={scrollToTop}
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        <div className="flex flex-col items-center gap-8">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold gradient-text">RepoRecon</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/akash-s-764359307/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-foreground/5 hover:bg-purple/10 border border-border hover:border-purple/30 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-purple transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
            </a>
            <a
              href="https://github.com/ASaha-os"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-foreground/5 hover:bg-cyan/10 border border-border hover:border-cyan/30 transition-all duration-300"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-cyan transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
            </a>
          </div>

          {/* Credits - Big stylish text */}
          <div className="flex flex-col items-center gap-4 text-center mt-8">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-muted-foreground">Made with</span>
              <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-lg font-medium text-muted-foreground">by</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold gradient-text tracking-tight">AKASH SAHA</span>
            <span className="text-sm text-muted-foreground mt-4">© 2026 RepoRecon. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

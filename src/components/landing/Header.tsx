import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-foreground font-semibold text-lg">RepoRecon</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="gradient" size="sm" className="shadow-lg shadow-purple/20" onClick={scrollToTop}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

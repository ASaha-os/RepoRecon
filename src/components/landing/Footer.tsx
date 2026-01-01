import { Github, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple/20">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold gradient-text">RepoRecon</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-purple/10 border border-border hover:border-purple/30 transition-all duration-300"
            >
              <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-purple transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Twitter/X</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-cyan/10 border border-border hover:border-cyan/30 transition-all duration-300"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-cyan transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Credits */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-sm">by</span>
              <span className="font-semibold gradient-text">AKASH SAHA</span>
            </div>
            <span className="text-xs text-muted-foreground">© 2026 RepoRecon. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

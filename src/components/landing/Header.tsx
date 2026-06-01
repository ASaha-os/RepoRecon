import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LaunchAppButton } from "./LaunchAppButton";
import { SmoothAnchor } from "./SmoothAnchor";
import { scrollToTop } from "@/lib/smoothScroll";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

const navLinkClass =
  "px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 nav-link-smooth";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const goHome = () => {
    scrollToTop();
    closeMobile();
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ease-out ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button
          onClick={goHome}
          className="flex items-center gap-2.5 group nav-link-smooth"
          aria-label="RepoRecon home"
        >
          <img
            src="/RepoRecon-logo.png"
            alt="RepoRecon"
            className="w-8 h-8 rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-lg object-cover"
          />
          <span className="font-semibold text-[15px] tracking-tight text-foreground">
            RepoRecon
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <SmoothAnchor key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </SmoothAnchor>
          ))}
          <a
            href="https://github.com/ASaha-os/RepoRecon"
            target="_blank"
            rel="noopener noreferrer"
            className={`${navLinkClass} flex items-center gap-1.5`}
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <LaunchAppButton size="compact" />
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass border-t border-border/60 px-5 py-4 space-y-1 overflow-hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmoothAnchor
                  href={link.href}
                  onNavigate={closeMobile}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  {link.label}
                </SmoothAnchor>
              </motion.div>
            ))}
            <a
              href="https://github.com/ASaha-os/RepoRecon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 nav-link-smooth"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <div className="pt-3">
              <LaunchAppButton size="default" className="w-full [&_button]:w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

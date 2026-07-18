import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { LaunchAppButton } from "./LaunchAppButton";
import { SmoothAnchor } from "./SmoothAnchor";
import { scrollToTop } from "@/lib/smoothScroll";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Capabilities", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="mono-header">
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="mono-header-inner">
        <button
          onClick={() => { scrollToTop(); closeMobile(); }}
          className="mono-brand"
          aria-label="RepoRecon — back to top"
        >
          <img
            src="/RepoRecon-logo.png"
            alt="RepoRecon"
            className="h-8 w-auto"
          />
        </button>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <SmoothAnchor key={link.href} href={link.href} className="mono-nav-link">
              {link.label}
            </SmoothAnchor>
          ))}
          <a
            href="https://github.com/ASaha-os/RepoRecon"
            target="_blank"
            rel="noopener noreferrer"
            className="mono-nav-link inline-flex items-center gap-1.5"
          >
            <Github size={14} strokeWidth={1.5} aria-hidden="true" />
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LaunchAppButton size="compact" />
          </div>
          <button
            className="mono-menu-button md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen
              ? <X size={18} strokeWidth={1.5} aria-hidden="true" />
              : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="mono-mobile-nav md:hidden"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <SmoothAnchor
                key={link.href}
                href={link.href}
                onNavigate={closeMobile}
                className="mono-mobile-link"
              >
                {link.label}
              </SmoothAnchor>
            ))}
            <a
              href="https://github.com/ASaha-os/RepoRecon"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-mobile-link"
            >
              GitHub
            </a>
            <div className="p-4 border-t-2 border-black">
              <LaunchAppButton size="default" className="w-full [&_a]:w-full" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

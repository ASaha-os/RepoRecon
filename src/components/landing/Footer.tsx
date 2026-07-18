import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { LaunchAppButton } from "./LaunchAppButton";
import { DEVELOPER_PORTFOLIO_URL } from "@/constants/links";
import { scrollToTop } from "@/lib/smoothScroll";

export const Footer = () => (
  <footer className="mono-footer">
    {/* Final CTA block */}
    <section className="mono-cta" aria-labelledby="cta-heading">
      <div className="mono-cta-inner">
        <span className="mono-cta-eyebrow">Your daily repository utility</span>

        <h2 id="cta-heading" className="mono-cta-title">
          One URL.<br /><em>Instant clarity.</em>
        </h2>

        {/* Decorative rule */}
        <div className="mono-cta-rule-wrap" aria-hidden="true">
          <div className="mono-cta-rule" />
          <div className="mono-cta-rule-square" />
        </div>

        <p className="mono-cta-sub">
          Drop any public GitHub URL. Get architecture diagrams, health metrics, 
          AI-powered Q&A, and actionable insights — in under 60 seconds. Free forever.
        </p>

        <LaunchAppButton size="hero" label="Launch RepoRecon" />
      </div>
    </section>

    {/* Footer bar */}
    <div className="mono-footer-inner">
      <button
        onClick={scrollToTop}
        className="mono-brand"
        aria-label="Back to top"
      >
        <img
          src="/RepoRecon-logo.png"
          alt="RepoRecon"
          className="h-8 w-auto"
        />
      </button>

      <p className="mono-footer-copy">
        Independently built for engineers.<br />
        One clear workspace. No noise.
      </p>

      <nav className="mono-footer-links" aria-label="Social links">
        <a
          href="https://github.com/ASaha-os/RepoRecon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RepoRecon on GitHub"
        >
          <Github size={16} strokeWidth={1.5} aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/akash-s-764359307/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Creator on LinkedIn"
        >
          <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" />
        </a>
        <a
          href={DEVELOPER_PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Developer portfolio"
        >
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </nav>
    </div>
  </footer>
);

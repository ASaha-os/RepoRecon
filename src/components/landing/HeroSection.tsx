import { Github } from "lucide-react";
import { LaunchAppButton } from "./LaunchAppButton";
import { SmoothAnchor } from "./SmoothAnchor";

export const HeroSection = () => (
  <section className="mono-hero" aria-labelledby="hero-headline">
    <div className="mono-hero-inner">
      {/* Eyebrow */}
      <p className="mono-hero-eyebrow" aria-hidden="true">
        Repository intelligence&nbsp;/&nbsp;2026
      </p>

      {/* Headline */}
      <h1 id="hero-headline" className="mono-hero-title">
        Read the repo.<br />
        <em>Move with certainty.</em>
      </h1>

      {/* Decorative rule + accent square */}
      <div className="mono-hero-rule-wrap" aria-hidden="true">
        <div className="mono-hero-rule" />
        <div className="mono-hero-rule-square" />
      </div>

      {/* Description + CTAs */}
      <div className="mono-hero-bottom">
        <p className="mono-hero-description">
          <strong>Ship faster. Review smarter.</strong> RepoRecon turns unfamiliar 
          codebases into clear maps — architecture, health signals, and your next 
          engineering move. Your daily co-pilot for repository intelligence.
        </p>

        <div className="mono-hero-actions">
          <LaunchAppButton size="hero" label="Analyze a repository" />
          <SmoothAnchor
            href="#product"
            className="mono-button mono-button--outline mono-button--hero"
          >
            View the workspace
          </SmoothAnchor>
        </div>
      </div>

      {/* Social proof */}
      <div className="mono-hero-proof">
        <Github size={14} strokeWidth={1.5} aria-hidden="true" />
        <span>Public GitHub repositories</span>
        <span className="mono-proof-separator" aria-hidden="true" />
        <span>40+ active users</span>
        <span className="mono-proof-separator" aria-hidden="true" />
        <span>Free — no API key</span>
      </div>
    </div>
  </section>
);

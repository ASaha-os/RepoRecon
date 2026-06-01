import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { LaunchAppButton } from "./LaunchAppButton";
import { DEVELOPER_PORTFOLIO_URL } from "@/constants/links";
import { scrollToTop } from "@/lib/smoothScroll";

const socialClass =
  "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 ease-out";

export const Footer = () => (
  <footer className="border-t border-border bg-background">
    <motion.div
      className="py-24 px-5 sm:px-8 text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-2xl mx-auto">
        <p className="tag tag-navy mx-auto mb-6 w-fit">Ready when you are</p>
        <h2 className="heading-xl mb-4">
          Experience the full
          <br />
          <span className="accent-navy">RepoRecon workspace.</span>
        </h2>
        <p className="body-lg mb-10 max-w-md mx-auto">
          Analyze repositories, chat with your codebase, and export reports —
          all in our dedicated app. Free, instant, no sign-up.
        </p>
        <LaunchAppButton size="default" label="Launch RepoRecon" />
      </div>
    </motion.div>

    <div className="border-t border-border px-5 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => scrollToTop()}
          className="flex items-center gap-2 group nav-link-smooth"
        >
          <img
            src="/RepoRecon-logo.png"
            alt="RepoRecon"
            className="w-7 h-7 rounded-lg shadow-sm object-cover transition-shadow duration-300 group-hover:shadow-md"
          />
          <span className="font-semibold text-sm text-foreground">RepoRecon</span>
        </button>

        <p className="text-xs text-muted-foreground order-last sm:order-none text-center sm:text-left">
          © 2026 RepoRecon · Built by{" "}
          <a
            href="https://www.linkedin.com/in/akash-s-764359307/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            Akash Saha
          </a>
          {" · "}
          <a
            href={DEVELOPER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            Developer Portfolio
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ASaha-os/RepoRecon"
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/akash-s-764359307/"
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

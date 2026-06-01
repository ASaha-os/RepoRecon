import { motion } from "framer-motion";
import { LaunchAppButton } from "./LaunchAppButton";

const proofItems = [
  { icon: "⚡", text: "Instant analysis" },
  { icon: "🔒", text: "No sign-up required" },
  { icon: "🆓", text: "Always free" },
  { icon: "🤖", text: "GPT-4o powered" },
];

export const HeroSection = () => (
  <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 pt-28 pb-20 overflow-hidden">
    <div className="video-overlay">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <source src="/static/home-bg.mp4" type="video/mp4" />
      </video>
    </div>

    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-16 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ x: [0, -32, 0], y: [0, 28, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>

    <div className="relative z-10 w-full max-w-4xl mx-auto text-center min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm mb-8 text-xs font-medium text-muted-foreground"
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        Powered by Puter AI · Free · No API Key Needed
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="display mb-6"
      >
        Understand any codebase
        <br />
        <span className="accent-navy">in seconds.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="body-lg max-w-xl mx-auto mb-10 text-pretty"
      >
        Your senior AI architect for GitHub repos — architecture diagrams, health
        scores, and actionable fixes. Open the full app and start exploring.
      </motion.p>

      <LaunchAppButton size="hero" className="mb-4" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xs text-muted-foreground mb-14"
      >
        Opens in a new tab · Same free experience, full workspace
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.48 }}
        className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
      >
        {proofItems.map((item, i) => (
          <motion.span
            key={item.text}
            className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{item.icon}</span>
            {item.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  </section>
);

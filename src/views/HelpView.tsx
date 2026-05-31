/**
 * HelpView — task 17 (spec §5.4)
 * FAQ accordion + contact form (mailto fallback).
 */
import React, { useState } from "react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Send } from "lucide-react";

const HelpView: React.FC = () => {
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    // mailto fallback — no backend required
    const subject = encodeURIComponent("RepoRecon Feedback");
    const body    = encodeURIComponent(`From: ${email}\n\n${message}`);
    window.open(`mailto:support@reporecon.app?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(""); setMessage(""); }, 3000);
  };

  return (
    <div
      className="fade-in"
      style={{
        height: "100%",
        overflowY: "auto",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "32px 20px 64px",
        }}
      >
        {/* FAQ */}
        <h2
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 24,
          }}
        >
          Help &amp; FAQ
        </h2>

        <FAQAccordion />

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--border)",
            margin: "40px 0 32px",
          }}
        />

        {/* Contact */}
        <h3
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          Contact
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          <textarea
            placeholder="Your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          <button
            type="submit"
            disabled={sent}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              borderRadius: "var(--radius-md)",
              background: sent ? "var(--bg-tertiary)" : "var(--accent)",
              color: sent ? "var(--text-tertiary)" : "var(--bg-primary)",
              border: "none",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: sent ? "default" : "pointer",
              fontFamily: "var(--font-ui)",
              transition: "background var(--transition-fast)",
            }}
          >
            <Send size={13} />
            {sent ? "Sent!" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "var(--radius-md)",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-ui)",
  outline: "none",
  transition: "border-color var(--transition-fast)",
};

export default HelpView;

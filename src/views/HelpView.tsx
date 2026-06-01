/**
 * HelpView — FAQ accordion + contact form
 * Fix: mailto points to asgcp2025@gmail.com
 * Fix: Send icon visible, inputs have explicit text color
 */
import React, { useState } from "react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Send, Mail } from "lucide-react";

const CONTACT_EMAIL = "asgcp2025@gmail.com";

const HelpView: React.FC = () => {
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    const subject = encodeURIComponent("RepoRecon Feedback");
    const body    = encodeURIComponent(`From: ${email}\n\n${message}`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(""); setMessage(""); }, 3000);
  };

  return (
    <div
      className="fade-in"
      style={{ height: "100%", overflowY: "auto", background: "var(--bg-primary)" }}
    >
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* Title */}
        <h2
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 28,
            letterSpacing: "-0.02em",
          }}
        >
          Help &amp; FAQ
        </h2>

        <FAQAccordion />

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "44px 0 36px" }} />

        {/* Contact section */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "28px 24px",
          }}
        >
          {/* Contact header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: "var(--radius-md)",
                background: "var(--accent-muted)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Mail size={16} color="var(--accent)" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 2,
                }}
              >
                Contact
              </h3>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                Send us a message and we'll reply as soon as possible.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Email input */}
            <div>
              <label
                htmlFor="contact-email"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "var(--accent-glow)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Message textarea */}
            <div>
              <label
                htmlFor="contact-message"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="Describe your issue or feedback…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "var(--accent-glow)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={sent}
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: "var(--radius-md)",
                background: sent ? "var(--bg-tertiary)" : "var(--accent)",
                color: sent ? "var(--text-tertiary)" : "var(--accent-fg)",
                border: "none",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                cursor: sent ? "default" : "pointer",
                fontFamily: "var(--font-ui)",
                transition: "background var(--transition-fast), box-shadow var(--transition-fast)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                if (!sent) (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <Send size={15} />
              {sent ? "Opening mail client…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* Shared input style — explicit colors so they're always readable */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--radius-md)",
  background: "var(--bg-primary)",
  border: "1.5px solid var(--border)",
  color: "var(--text-primary)",
  caretColor: "var(--accent)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-ui)",
  outline: "none",
  transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
};

export default HelpView;

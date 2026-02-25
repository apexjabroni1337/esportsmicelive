"use client";
import { useState } from "react";
import Link from "next/link";

const I = {
  mouse: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="3" width="12" height="18" rx="6"/><line x1="12" y1="3" x2="12" y2="9"/></svg>,
  mail: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  bug: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6Z"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M6 17H2.5M17.47 9c1.93-.2 3.53-1.9 3.53-4M18 13h4M17.5 17H22"/></svg>,
  sparkle: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  handshake: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88"/><path d="m16 16-4-4"/><path d="m20 8-7 7"/><path d="M3.3 11 6 13l4-4-2.7-2.7a2.41 2.41 0 0 0-3.4 0c-.9 1-.9 2.5 0 3.4Z"/><path d="M20.7 5.3a2.41 2.41 0 0 0-3.4 0L15 7.6l4 4 2.3-2.3c.9-1 .9-2.5 0-3.4Z"/></svg>,
  check: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
};

// ── REPLACE THIS with your Formspree form ID ──
const FORMSPREE_ID = "xpqjolqr";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _subject: `[EsportsMice] ${form.subject === "correction" ? "Data Correction" : form.subject === "feature" ? "Feature Request" : form.subject === "partnership" ? "Partnership Inquiry" : "General"}: from ${form.name}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", subject: "general", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "#0a0a0a",
    border: "1px solid #ffffff0a",
    borderRadius: 10,
    color: "#fff",
    fontFamily: "inherit",
    fontSize: 13,
    outline: "none",
    transition: "border 0.2s",
  };

  const subjects = [
    { value: "general", label: "General Inquiry", icon: I.mail, desc: "Questions, feedback, or just saying hi" },
    { value: "correction", label: "Data Correction", icon: I.bug, desc: "Wrong mouse, player info, or stats" },
    { value: "feature", label: "Feature Request", icon: I.sparkle, desc: "Ideas for new tools or pages" },
    { value: "partnership", label: "Partnership", icon: I.handshake, desc: "Business, sponsorship, or collab" },
  ];

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', system-ui, sans-serif" }}>
      {/* Nav bar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ background: "#080808", borderBottom: "1px solid #ffffff06" }}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          {I.mouse(20)}
          <span style={{ fontFamily: "Orbitron, monospace", fontSize: 12, letterSpacing: 4, color: "#00ff6a" }}>ESPORTSMICE</span>
        </Link>
        <Link href="/" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff" }}>← Back to home</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ fontFamily: "Orbitron, monospace" }}>
            Get in <span style={{ color: "#00ff6a" }}>Touch</span>
          </h1>
          <p className="text-sm opacity-40 max-w-md mx-auto">
            Have a question, found incorrect data, or want to work together? We'd love to hear from you.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: "#00ff6a08", border: "1px solid #00ff6a20" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "#00ff6a15" }}>
              {I.check(32)}
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: "#00ff6a" }}>Message Sent!</h2>
            <p className="text-sm opacity-40 mb-6">Thanks for reaching out. We'll get back to you as soon as we can.</p>
            <button onClick={() => setStatus("idle")}
              className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105"
              style={{ background: "#00ff6a15", color: "#00ff6a", border: "1px solid #00ff6a30" }}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Subject chips */}
            <div className="mb-6">
              <label className="block mb-2" style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff40" }}>What's this about?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {subjects.map(s => (
                  <div key={s.value}
                    className="cursor-pointer rounded-xl p-3 transition-all"
                    style={{
                      background: form.subject === s.value ? "#00ff6a10" : "#0a0a0a",
                      border: `1px solid ${form.subject === s.value ? "#00ff6a40" : "#ffffff08"}`,
                      color: form.subject === s.value ? "#00ff6a" : "#ffffff60",
                    }}
                    onClick={() => setForm({ ...form, subject: s.value })}>
                    <div className="mb-1.5">{s.icon(16)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block mb-1.5" style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff40" }}>Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#00ff6a40"}
                  onBlur={e => e.target.style.borderColor = "#ffffff0a"} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff40" }}>Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#00ff6a40"}
                  onBlur={e => e.target.style.borderColor = "#ffffff0a"} />
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="block mb-1.5" style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff40" }}>Message</label>
              <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder={form.subject === "correction" ? "Which player/mouse has incorrect data? What should it be?" : form.subject === "feature" ? "Describe the feature or tool you'd like to see..." : form.subject === "partnership" ? "Tell us about your brand or organization and what you have in mind..." : "What's on your mind?"}
                style={{ ...inputStyle, resize: "vertical", minHeight: 140 }}
                onFocus={e => e.target.style.borderColor = "#00ff6a40"}
                onBlur={e => e.target.style.borderColor = "#ffffff0a"} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={status === "sending"}
              className="w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all hover:scale-[1.01] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #00ff6a, #00cc55)", color: "#000", fontSize: 13, border: "none", cursor: status === "sending" ? "wait" : "pointer" }}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "error" && (
              <div className="text-center mt-3" style={{ color: "#ff6b6b", fontSize: 12 }}>
                Something went wrong. Please try again or email us directly.
              </div>
            )}
          </form>
        )}

        {/* Extra info */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid #ffffff08" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff06" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff30", marginBottom: 6 }}>Response Time</div>
              <div className="text-sm font-bold opacity-60">Usually within 24h</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff06" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff30", marginBottom: 6 }}>Data Issues</div>
              <div className="text-sm font-bold opacity-60">Fixed same day</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff06" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff30", marginBottom: 6 }}>Partnerships</div>
              <div className="text-sm font-bold opacity-60">Always open</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

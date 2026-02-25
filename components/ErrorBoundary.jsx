"use client";
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("EsportsMice error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 40, fontFamily: "'Inter', system-ui, sans-serif", color: "#fff", background: "#050505" }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#00ff6a" }}>Something went wrong</h2>
          <p style={{ fontSize: 14, opacity: 0.5, maxWidth: 400, textAlign: "center" }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ padding: "10px 24px", borderRadius: 8, background: "#00ff6a", color: "#000", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            Refresh Page
          </button>
          <a href="/" style={{ fontSize: 12, color: "#00ff6a", opacity: 0.6, textDecoration: "none" }}>← Back to Home</a>
        </div>
      );
    }

    return this.props.children;
  }
}

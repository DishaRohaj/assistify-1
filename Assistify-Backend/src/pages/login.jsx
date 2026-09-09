import React, { useState } from "react";

/**
 * Assistify Login Page
 * Two-panel layout: purple brand/feature panel (left) + login form (right)
 */

const FEATURES = [
  {
    icon: "🧠",
    title: "AI-Powered Self Service",
    description: "Get instant help before raising a request.",
  },
  {
    icon: "📋",
    title: "Smart Request Management",
    description: "Track and manage IT support requests efficiently.",
  },
  {
    icon: "⚡",
    title: "Faster Issue Resolution",
    description: "Connect requests with the right support team.",
  },
];

function FeatureIcon({ icon }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  );
}

function FeatureRow({ icon, title, description }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28 }}>
      <FeatureIcon icon={icon} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e", marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13.5, color: "#e8e6f7", lineHeight: 1.4, maxWidth: 300 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

export default function AssistifyLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to POST /api/auth/login once the backend is ready.
    console.log("Login attempt:", { ...form, rememberMe });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        background: "#ffffff",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          flex: "0 0 42%",
          background: "linear-gradient(160deg, #8b8fd6 0%, #9b8fe0 100%)",
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative soft circle */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            top: 120,
            left: -140,
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56, zIndex: 1 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "linear-gradient(135deg, #4b3fb5, #6a5ce0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>
              ASSISTIFY
            </div>
            <div style={{ color: "#e8e6f7", fontSize: 12 }}>Intelligent IT Service Desk</div>
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#1a1a2e",
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1.25,
            maxWidth: 360,
            marginBottom: 44,
            zIndex: 1,
          }}
        >
          Smart, simple and efficient IT support.
        </h1>

        {/* Features */}
        <div style={{ zIndex: 1 }}>
          {FEATURES.map((f) => (
            <FeatureRow key={f.title} {...f} />
          ))}
        </div>

        {/* Arrow divider circle */}
        <div
          style={{
            position: "absolute",
            right: -34,
            top: "50%",
            transform: "translateY(-50%)",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "#8b8fd6",
            border: "3px solid #ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 26,
            zIndex: 2,
          }}
        >
          →
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ color: "#7c3aed", fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
            Welcome !
          </h2>
          <p style={{ color: "#4a4a5a", fontSize: 14.5, marginBottom: 32 }}>
            Sign in to your Assistify account
          </p>

          <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#1a1a2e", marginBottom: 8 }}>
            User ID / Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            value={form.identifier}
            onChange={handleChange("identifier")}
            style={inputStyle}
          />

          <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#1a1a2e", margin: "20px 0 8px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange("password")}
              style={{ ...inputStyle, paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                color: "#8a8a9a",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0 28px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#4a4a5a", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((r) => !r)}
                style={{ width: 16, height: 16, accentColor: "#7c3aed" }}
              />
              Remember me
            </label>
            <a href="#forgot" style={{ fontSize: 13.5, color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={loginButtonStyle}>
            Login
          </button>

          <div style={{ borderTop: "1px solid #eee", margin: "28px 0 20px" }} />

          <p style={{ textAlign: "center", fontSize: 13.5, color: "#4a4a5a" }}>
            Need help accessing your account?
            <br />
            <a href="#contact" style={{ color: "#8a8a9a", textDecoration: "none" }}>
              Contact Service Desk
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 16px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  color: "#1a1a2e",
};

const loginButtonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15.5,
  cursor: "pointer",
};
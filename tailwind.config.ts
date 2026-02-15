import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        soft: {
          base: "#F7F7F7",
          card: "#FFFFFF",
          ink: "#2B2B2B",
          "ink-muted": "#6B6B6B",
          "ink-faint": "#9A9A9A",
          accent: "#FF7A6C",
          "accent-light": "#FFB09C",
          border: "#E8E8E8",
          positive: "#5EEB84",
          negative: "#FF7A6C",
          warning: "#F9CE87",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "soft-card": "0 2px 8px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        "soft-card-hover": "0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
        "cta-glow": "0 0 24px rgba(255,122,108,0.35), 0 4px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "soft": "12px",
        "soft-lg": "16px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        revealLine: {
          "0%": { width: "0%", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 400ms ease-out",
        "fade-in-up": "fadeInUp 600ms ease-out forwards",
        "fade-in-scale": "fadeInScale 450ms ease-out forwards",
      },
      backdropBlur: {
        panel: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

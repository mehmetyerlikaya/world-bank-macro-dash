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
        ledger: {
          paper: "#f5f0e8",
          cream: "#ebe5db",
          ink: "#2c2822",
          "ink-muted": "#5c564d",
          "ink-faint": "#8a8479",
          accent: "#2d5a4a",
          "accent-light": "#3d7a65",
          sepia: "#6b5344",
          border: "#d4cfc4",
          positive: "#25634b",
          negative: "#8b3a3a",
        },
      },
      fontFamily: {
        display: ["Libre Baskerville", "Georgia", "serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
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
        "fade-in-up": "fadeInUp 500ms ease-out forwards",
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

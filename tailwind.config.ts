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
        primary: {
          DEFAULT: "#9966CC", // Amethyst
          hover: "#8752BE",
          active: "#7A4BC2",
          on: "#1F1730",
        },
        background: {
          DEFAULT: "#F8F8FF", // Ghost White
          subtle: "#F0EFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#FCFBFF",
        },
        copy: {
          DEFAULT: "#2E2438", // Main text
          muted: "#7A6F8C", // Secondary hints / captions
          onPrimary: "#1F1730",
        },
        accent: {
          DEFAULT: "#F5B700", // Gold - rewards / currency only!
          hover: "#E0A800",
          soft: "#FEF7DF",
        },
        success: {
          DEFAULT: "#4FCE6B", // XP gain / positive checkmark
          soft: "#E8F8EC",
        },
        danger: {
          DEFAULT: "#E5484D", // Penalties, HP loss
          soft: "#FDECEE",
        },
        lavender: {
          soft: "#EADFFF",
          muted: "#DCC7FF",
        },
        blush: {
          pink: "#F3C6E6",
        },
        lumi: {
          deep: "#3C2E63",
          purple: "#7A4BC2",
          amethyst: "#9966CC",
        },
      },
      spacing: {
        "2.5": "10px",
        "5": "20px",
        "7.5": "30px",
        "10": "40px",
      },
      borderRadius: {
        "lumi": "16px",
        "lumi-lg": "24px",
      },
      boxShadow: {
        "lumi": "0 4px 20px -2px rgba(153, 102, 204, 0.12)",
        "lumi-card": "0 2px 12px -1px rgba(60, 46, 99, 0.08)",
        "lumi-hover": "0 8px 30px -4px rgba(153, 102, 204, 0.2)",
        "gold-glow": "0 0 15px rgba(245, 183, 0, 0.4)",
        "amethyst-glow": "0 0 18px rgba(153, 102, 204, 0.45)",
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-3px) scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Strict 9 UI Tokens
        primary: {
          DEFAULT: "#9966CC", // Brand amethyst
          hover: "#8B54C2",
          active: "#7A4BC2",
          on: "#1F1730",
        },
        background: {
          DEFAULT: "#F8F8FF", // Ghost White canvas
          subtle: "#F0EFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#FCFBFF",
        },
        copy: {
          DEFAULT: "#2E2438", // Main text
          muted: "#7A6F8C",   // Secondary hints & timestamps
          onPrimary: "#1F1730",
        },
        accent: {
          DEFAULT: "#F5B700", // Gold currency ONLY
          hover: "#E0A800",
          dark: "#D49E00",
        },
        success: {
          DEFAULT: "#4FCE6B", // XP gain / positive feedback
          soft: "#E8F8EC",
          dark: "#3BA853",
        },
        danger: {
          DEFAULT: "#E5484D", // Negative deltas & boss damage
          soft: "#FDECEE",
          dark: "#B82D32",
        },
        lavender: {
          soft: "#EADFFF",
          muted: "#DCC7FF",
        },
      },
      spacing: {
        // 8pt Grid
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
      },
      borderRadius: {
        "lumi": "16px",
        "lumi-lg": "24px",
      },
    },
  },
  plugins: [],
};

export default config;

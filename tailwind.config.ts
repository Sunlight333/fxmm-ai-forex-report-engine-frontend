import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
        },
        demand: {
          DEFAULT: "var(--demand)",
          light: "rgba(16, 185, 129, 0.1)",
        },
        supply: {
          DEFAULT: "var(--supply)",
          light: "rgba(239, 68, 68, 0.1)",
        },
        dark: {
          bg: "var(--bg-primary)",
          card: "var(--bg-card)",
          border: "var(--color-border)",
          hover: "var(--bg-hover)",
          surface: "var(--bg-surface)",
        },
        elevated: "var(--bg-elevated)",
        foreground: "var(--text-primary)",
        "muted-fg": "var(--text-secondary)",
        subtle: "var(--text-muted)",
        success: "#4CAF50",
        warning: "#FFA726",
        info: "#29B6F6",
      },
      borderColor: {
        "dark-border-hover": "var(--color-border-hover)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        sidebar: "14rem",
        "sidebar-collapsed": "4rem",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      animation: {
        "skeleton-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.25s ease-out",
        "slide-out-left": "slideOutLeft 0.2s ease-in",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

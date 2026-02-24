import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E88E5",
          hover: "#1976D2",
          light: "rgba(30, 136, 229, 0.1)",
        },
        demand: {
          DEFAULT: "#26A69A",
          light: "rgba(38, 166, 154, 0.1)",
        },
        supply: {
          DEFAULT: "#EF5350",
          light: "rgba(239, 83, 80, 0.1)",
        },
        dark: {
          bg: "#1E1E2E",
          card: "#252538",
          border: "#2A2A3E",
          hover: "#2E2E48",
          surface: "#1A1A2A",
        },
        success: "#4CAF50",
        warning: "#FFA726",
        info: "#29B6F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "skeleton-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
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
      },
    },
  },
  plugins: [],
};
export default config;

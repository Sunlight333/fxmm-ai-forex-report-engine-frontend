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
        primary: "#1E88E5",
        demand: "#26A69A",
        supply: "#EF5350",
        dark: {
          bg: "#1E1E2E",
          card: "#252538",
          border: "#2A2A3E",
        },
      },
    },
  },
  plugins: [],
};
export default config;

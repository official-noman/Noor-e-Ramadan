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
        islamic: {
          green: {
            DEFAULT: "#0d5d31",
            light: "#1a7a4a",
            dark: "#0a4a25",
          },
          gold: {
            DEFAULT: "#d4af37",
            light: "#e5c866",
            dark: "#b8941f",
          },
          white: "#ffffff",
        },
      },
      fontFamily: {
        arabic: ["Amiri", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

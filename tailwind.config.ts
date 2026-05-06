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
        dash: {
          bg: "#0f1729",
          sidebar: "#0d1424",
          card: "#131f35",
          border: "#1e2d45",
          text: "#e2e8f0",
          muted: "#64748b",
          green: "#22c55e",
          blue: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
export default config;

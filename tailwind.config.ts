import type { Config } from "tailwindcss";

/**
 * Tailwind is only used for small utilities; the design lives in
 * src/components/home/home.css and src/components/page/page.css.
 * These colours mirror the tokens there.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#1f1d1c",
        accent: "#9b1d1b",
      },
    },
  },
  plugins: [],
};

export default config;

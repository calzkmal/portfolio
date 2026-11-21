import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { lg: "1080px" },
    },
    extend: {
      colors: {
        // Change these values to re-theme the whole site.
        // Palette: Ice Blue #C9DFEA, Midnight Ink #082E43, Vermillion #FF4F31.
        canvas: "#C9DFEA", // Ice Blue — page background
        surface: "#F7FBFD", // cards on top of Ice Blue
        ink: {
          DEFAULT: "#082E43", // Midnight Ink — headings and body text
          soft: "#1F4558",
          muted: "#3E5F72",
        },
        line: "#A9C6D4",
        accent: {
          DEFAULT: "#FF4F31", // Vermillion — buttons, dots, icons, highlights
          soft: "#FFE4DE",
          strong: "#A82A14", // darker Vermillion for small text (readable on Ice Blue and white)
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,46,67,0.04), 0 8px 24px -12px rgba(8,46,67,0.10)",
        lift: "0 2px 4px rgba(8,46,67,0.04), 0 18px 40px -16px rgba(8,46,67,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

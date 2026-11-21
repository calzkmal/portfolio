import type { Config } from "tailwindcss";

/**
 * Design tokens for the "Quietly Cinematic" redesign.
 * Source of truth: docs/portfolio-redesign/design-system.md
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        paper: "#F3F5F3", // page background: cool off-white
        ink: {
          DEFAULT: "#082E43", // Midnight Ink: headlines, body, dark scenes
          2: "#3E5F72", // secondary text
          3: "#546F7E", // metadata, captions (≥ 13px)
        },
        rule: "#D3DCDA", // hairlines and borders, never text
        ice: "#C9DFEA", // Ice Blue: gradient light
        sage: "#BCCFC2", // sage: gradient light, quiet surfaces
        signal: {
          DEFAULT: "#FF4F31", // Vermillion: graphics only on paper
          ink: "#A82A14", // Vermillion for text and thin marks on paper
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        meta: ["0.8125rem", { lineHeight: "1.5" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        lead: ["1.3125rem", { lineHeight: "1.5" }],
        h3: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h2: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05" }],
        h1: ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
        display: ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.015em" }],
      },
      maxWidth: {
        measure: "66ch",
        lead: "58ch",
      },
      borderRadius: {
        tag: "4px",
        plate: "6px",
      },
      boxShadow: {
        float: "0 1px 0 rgb(8 46 67 / 0.06), 0 12px 32px -20px rgb(8 46 67 / 0.25)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.215, 0.61, 0.355, 1)", // ≈ power3.out
      },
      transitionDuration: {
        instant: "120ms",
        quick: "240ms",
        settle: "480ms",
      },
    },
  },
  plugins: [],
};

export default config;

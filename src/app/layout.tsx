import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { profile } from "@/data/profile";

/** Expressive editorial headlines (one weight only). */
const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
/** Interface and body text. */
const sans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
/** Technical metadata: dates, stacks, figures. */
const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    title: `${profile.name} — ${profile.title}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F3F5F3",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Adds `motion` to <html> only when JavaScript works
 * and the visitor has not asked for reduced motion, so intro states can be
 * hidden without ever hiding content from anyone else.
 */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

/**
 * Development only: `localStorage.debugMotion = "1"` makes the page behave as if
 * the OS allowed motion, to test scenes on a machine with reduced motion on.
 */
const debugMotionScript =
  process.env.NODE_ENV === "development"
    ? `try{if(localStorage.debugMotion==='1'){var o=window.matchMedia.bind(window);window.matchMedia=function(q){return o(String(q).split('(prefers-reduced-motion: no-preference)').join('(min-width: 0px)').split('(prefers-reduced-motion: reduce)').join('(max-width: 0px)'))}}}catch(e){}`
    : "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: debugMotionScript + motionScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-small text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {/* The home page brings its own layout and Lenis setup; inner pages use app/(site)/layout.tsx. */}
        {children}
      </body>
    </html>
  );
}

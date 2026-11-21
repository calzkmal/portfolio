import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`,
  },
  keywords: siteConfig.keywords,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    title: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Adds `motion` to <html> only when JavaScript works
 * and the visitor has not asked for reduced motion; home.css keys its
 * scroll-staged states (sticky footer, statement) off it.
 */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

/**
 * Development only: `localStorage.debugMotion = "1"` makes the page behave as if
 * the OS allowed motion, to test the scroll effects on a machine with reduced motion on.
 */
const debugMotionScript =
  process.env.NODE_ENV === "development"
    ? `try{if(localStorage.debugMotion==='1'){var o=window.matchMedia.bind(window);window.matchMedia=function(q){return o(String(q).split('(prefers-reduced-motion: no-preference)').join('(min-width: 0px)').split('(prefers-reduced-motion: reduce)').join('(max-width: 0px)'))}}}catch(e){}`
    : "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: debugMotionScript + motionScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {/* Home brings its own layout; the works pages and 404 use components/page/PageShell. */}
        {children}
      </body>
    </html>
  );
}

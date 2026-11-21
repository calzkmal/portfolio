import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";

/**
 * Layout for the inner pages (Education, Experience, Projects, Achievements).
 * The home page has its own single-page layout and its own Lenis instance, so
 * MotionProvider (the inner pages' Lenis + GSAP setup) only runs here.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="relative flex-1">
        {children}
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}

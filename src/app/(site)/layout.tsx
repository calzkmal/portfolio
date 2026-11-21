import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Layout for the inner pages (Education, Experience, Projects, Achievements).
 * The home page has its own single-page layout and doesn't use this one.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <noscript>
        {/* Without JS the scroll-reveal observer never runs, so show everything. */}
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

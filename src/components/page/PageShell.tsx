import "@/components/home/home.css";
import "./page.css";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { Clock } from "@/components/home/Clock";
import { SiteFooter } from "@/components/home/SiteFooter";
import { bodyFont, displayFont } from "@/components/home/fonts";
import { profile } from "@/data/profile";
import { PageNav } from "./PageNav";

/**
 * Frame for every page other than home (project case studies, the works index, 404):
 * the same rail, clock, white column and dark contact footer as the home page.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <div className={`home ${bodyFont.variable} ${displayFont.variable}`}>
        <PageNav />
        <Clock city={profile.location.split(",")[0]} country="Indonesia" timeZone="Asia/Jakarta" />
        <main id="main">{children}</main>
        <div id="contact" aria-hidden="true" />
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}

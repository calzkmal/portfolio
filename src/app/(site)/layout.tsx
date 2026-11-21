import { PageShell } from "@/components/page/PageShell";

/** Layout for the works pages (/projects and each case study), in the same design as home. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <PageShell>{children}</PageShell>;
}

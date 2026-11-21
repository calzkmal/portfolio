import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page/PageShell";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageShell>
      <section className="page-missing">
        <h1>This page doesn&apos;t exist.</h1>
        <p>The link may be broken, or the page has moved.</p>
        <p className="case-links">
          <Link href="/">Back to home</Link>
          <Link href="/projects">See the works</Link>
        </p>
      </section>
    </PageShell>
  );
}

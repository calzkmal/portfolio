import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="relative flex-1">
        <section className="container flex min-h-[60vh] flex-col items-start justify-center py-24">
          <h1 className="font-serif text-h1 text-ink">This page doesn&apos;t exist.</h1>
          <p className="mt-6 max-w-lead text-lead text-ink-2">
            The link may be broken, or the page has moved. Go back to the homepage or browse the projects.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/">Go to the homepage</Button>
            <Button href="/projects" variant="text">
              Browse projects
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}

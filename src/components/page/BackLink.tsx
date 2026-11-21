"use client";

import Link from "next/link";
import { markReturn } from "@/components/home/ReturnPoint";

/** Back to home, landing on the spot the visitor opened this project from. */
export function BackLink() {
  return (
    <Link href="/" className="case-back" onClick={markReturn}>
      ← Back
    </Link>
  );
}

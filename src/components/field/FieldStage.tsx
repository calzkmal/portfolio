"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { detectTier, type TierInfo } from "./tier";

// three.js + R3F live in their own chunk, fetched only when the field will run.
const SignalField = dynamic(() => import("./SignalField"), { ssr: false });

/**
 * Fixed stage behind the home page scenes. Decides (after first paint, when
 * the browser is idle) whether to run the live field; otherwise renders
 * nothing and the server-rendered posters stay visible.
 */
export function FieldStage() {
  const stage = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<TierInfo | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decide = () => {
      const next = detectTier();
      if (next.tier !== "off") setInfo(next);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(decide, { timeout: 1500 })
      : window.setTimeout(decide, 300);

    // Re-check when the viewport or motion preference changes.
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const onChange = () => {
      if (!mq.matches) {
        setInfo(null);
        setVisible(false);
      } else decide();
    };
    mq.addEventListener("change", onChange);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // While live, posters step aside (see globals.css) and Contact lets the stage show through.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute("data-field", "live");
    else root.removeAttribute("data-field");
    return () => root.removeAttribute("data-field");
  }, [visible]);

  const onReady = useCallback(() => setVisible(true), []);
  const onFail = useCallback(() => {
    setVisible(false);
    setInfo(null);
  }, []);

  if (!info) return null;

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-paper transition-opacity duration-settle"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Scene light: a restrained ice/sage wash whose strength follows the story (--wash). */}
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--wash, 0)",
          background:
            "radial-gradient(55% 60% at 74% 45%, rgb(201 223 234 / 0.75), transparent 70%), radial-gradient(40% 45% at 85% 80%, rgb(188 207 194 / 0.55), transparent 70%)",
        }}
      />
      <SignalField points={info.points} maxDpr={info.maxDpr} stage={stage} onReady={onReady} onFail={onFail} />
    </div>
  );
}

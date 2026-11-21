/**
 * Decides whether the live 3D field runs, and at what quality
 * (motion-spec §5). Anything that fails a check gets the static posters.
 */
export type FieldTier = "off" | "default" | "high";

export interface TierInfo {
  tier: FieldTier;
  points: number;
  maxDpr: number;
}

export function detectTier(): TierInfo {
  const off: TierInfo = { tier: "off", points: 0, maxDpr: 1 };
  if (typeof window === "undefined") return off;

  // Live field only on large screens, with motion allowed.
  if (!window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return off;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return off;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return off;

  // WebGL must actually be available.
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return off;
  } catch {
    return off;
  }

  const strong = (nav.deviceMemory ?? 8) >= 8 && (navigator.hardwareConcurrency ?? 4) >= 8;
  return strong ? { tier: "high", points: 12000, maxDpr: 2 } : { tier: "default", points: 8000, maxDpr: 1.5 };
}

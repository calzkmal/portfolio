/**
 * Deterministic target layouts for the signal field.
 *
 * Pure TypeScript; drawn as static SVG posters by src/app/field/[state]/route.ts
 * and shown on the project pages. Every layout is illustrative; the only
 * numbers built into them come from the CV:
 *   - hiroop-classes: 5 respiratory sound classes
 *   - emodu: 112 marked evaluation examples; a scale from 0.6878 to 0.7238
 */

import { FIELD_STATES, type FieldState } from "@/data/scenes";

/** Tone per point: 0 = ink, 1 = dimmed (filtered out / background), 2 = signal. */
export type Tone = 0 | 1 | 2;

export interface FieldLayout {
  positions: Float32Array; // xyz per point
  tones: Float32Array; // one tone per point
}

/** Base view rotation (radians) per state. */
export const VIEW: Record<FieldState, { rx: number; ry: number }> = {
  seagis: { rx: -0.55, ry: 0.32 },
  "hiroop-classes": { rx: 0.15, ry: 0.35 },
  emodu: { rx: 0.18, ry: -0.3 },
};

// ---------------------------------------------------------------- helpers

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  // Box–Muller
  const u = Math.max(r(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

type Writer = (i: number, x: number, y: number, z: number, tone?: Tone) => void;

function make(count: number, fill: (put: Writer, r: () => number) => void, seed: number): FieldLayout {
  const positions = new Float32Array(count * 3);
  const tones = new Float32Array(count);
  const r = rng(seed);
  const put: Writer = (i, x, y, z, tone = 0) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    tones[i] = tone;
  };
  fill(put, r);
  return { positions, tones };
}

/** Split `count` into consecutive ranges by fractions. */
function ranges(count: number, fractions: number[]) {
  const out: [number, number][] = [];
  let start = 0;
  fractions.forEach((f, k) => {
    const end = k === fractions.length - 1 ? count : Math.min(count, start + Math.round(count * f));
    out.push([start, end]);
    start = end;
  });
  return out;
}

// ---------------------------------------------------------------- layouts

const layouts: Record<FieldState, (n: number) => FieldLayout> = {
  /** Seagis: hourly grid. Columns are hours, rows are data sources; one hour is highlighted. */
  seagis: (n) =>
    make(
      n,
      (put, r) => {
        const cols = 24;
        const rows = 6;
        const active = 17;
        for (let i = 0; i < n; i++) {
          const cell = i % (cols * rows);
          const c = cell % cols;
          const row = Math.floor(cell / cols);
          const x = -1.6 + (c / (cols - 1)) * 3.2;
          const y = -0.75 + (row / (rows - 1)) * 1.5 + (row >= 3 ? 0.12 : -0.12);
          put(i, x + gauss(r) * 0.018, y + gauss(r) * 0.018, gauss(r) * 0.05, c === active ? 2 : 0);
        }
      },
      37,
    ),
  /** Hiroop: the same features separated into 5 classes; one class is highlighted. */
  "hiroop-classes": (n) =>
    make(
      n,
      (put, r) => {
        const classes = 5;
        for (let i = 0; i < n; i++) {
          const k = i % classes;
          const a = (k / classes) * Math.PI * 2 + 0.3;
          const cx = Math.cos(a) * 1.05;
          const cy = Math.sin(a) * 0.8;
          put(i, cx + gauss(r) * 0.17, cy + gauss(r) * 0.14, gauss(r) * 0.2, k === 1 ? 2 : 0);
        }
      },
      53,
    ),
  /** Emodu: a token cloud with 112 marked evaluation examples, over a 0.60–0.80 score scale. */
  emodu: (n) =>
    make(
      n,
      (put, r) => {
        const marked = Math.min(112, n);
        const [cloud, scale, base, tuned] = ranges(n, [0.9, 0.07, 0.015, 0.015]);
        for (let i = cloud[0]; i < cloud[1]; i++) {
          const isMarked = i - cloud[0] < marked;
          const s = isMarked ? 0.55 : 1;
          put(i, gauss(r) * 0.85 * s, 0.25 + gauss(r) * 0.45 * s, gauss(r) * 0.5 * s, isMarked ? 0 : 1);
        }
        const toX = (score: number) => -1.2 + ((score - 0.6) / 0.2) * 2.4;
        for (let i = scale[0]; i < scale[1]; i++) put(i, -1.2 + r() * 2.4, -1.05 + gauss(r) * 0.006, 0, 1);
        for (let i = base[0]; i < base[1]; i++) put(i, toX(0.6878) + gauss(r) * 0.01, -1.05 + r() * 0.14, 0);
        for (let i = tuned[0]; i < tuned[1]; i++) put(i, toX(0.7238) + gauss(r) * 0.01, -1.05 + r() * 0.22, 0, 2);
      },
      67,
    ),
};

const cache = new Map<string, FieldLayout>();

/** Layout for one state at a given point count (memoised). */
export function getLayout(state: FieldState, count: number): FieldLayout {
  const key = `${state}:${count}`;
  let layout = cache.get(key);
  if (!layout) {
    layout = layouts[state](count);
    cache.set(key, layout);
  }
  return layout;
}

export { FIELD_STATES };

/**
 * Deterministic target layouts for the signal field.
 *
 * Pure TypeScript (no three.js) so the same layouts drive both the live
 * WebGL field and the static SVG posters used as fallbacks. Every layout is
 * illustrative; the only numbers built into them come from the CV:
 *   - pipeline: about half the incoming stream is filtered out (~50% lower
 *     scraping cost), 4 lanes (workflows), 20+ clusters (agents), 10+ review
 *     nodes (QA reviewers)
 *   - hiroop-classes: 5 respiratory sound classes
 *   - emodu: 112 marked evaluation examples; a scale from 0.6878 to 0.7238
 */

import { FIELD_STATES, type FieldState, trajectory } from "@/data/scenes";

/** Tone per point: 0 = ink, 1 = dimmed (filtered out / background), 2 = signal. */
export type Tone = 0 | 1 | 2;

export interface FieldLayout {
  positions: Float32Array; // xyz per point
  tones: Float32Array; // one tone per point
}

/** Base view rotation (radians) per state, shared by posters and the live field. */
export const VIEW: Record<FieldState, { rx: number; ry: number }> = {
  arrival: { rx: 0.25, ry: -0.2 },
  pipeline: { rx: -0.12, ry: 0.22 },
  seagis: { rx: -0.55, ry: 0.32 },
  hiroop: { rx: -0.62, ry: 0.45 },
  "hiroop-classes": { rx: 0.15, ry: 0.35 },
  emodu: { rx: 0.18, ry: -0.3 },
  trajectory: { rx: 0.05, ry: 0 },
  contact: { rx: 0.5, ry: 0.65 },
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
  /** Scene 0: a loose, noisy shell — signal before it has any structure. */
  arrival: (n) =>
    make(
      n,
      (put, r) => {
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
          const inner = r() < 0.12;
          const y = 1 - (i / (n - 1)) * 2;
          const radius = Math.sqrt(1 - y * y);
          const theta = golden * i;
          const rad = inner ? 0.35 + r() * 0.6 : 1.15 + gauss(r) * 0.09;
          const wobble = 1 + 0.12 * Math.sin(theta * 3 + y * 5);
          put(
            i,
            Math.cos(theta) * radius * rad * wobble,
            y * rad * 0.92,
            Math.sin(theta) * radius * rad * wobble,
            r() < 0.006 ? 2 : 0,
          );
        }
      },
      11,
    ),

  /** Scene 1: collect → filter (about half drops away) → 4 lanes with 22 agent clusters → review gate → output. */
  pipeline: (n) =>
    make(
      n,
      (put, r) => {
        const [band, dropped, lanes, gate, output] = ranges(n, [0.3, 0.2, 0.36, 0.03, 0.11]);
        for (let i = band[0]; i < band[1]; i++) {
          put(i, -1.9 + r() * 1.25, gauss(r) * 0.42, gauss(r) * 0.25);
        }
        for (let i = dropped[0]; i < dropped[1]; i++) {
          const x = -0.62 + r() * 0.75;
          put(i, x, -0.95 - r() * 0.75 - (x + 0.62) * 0.6, gauss(r) * 0.2, 1);
        }
        const laneY = [-0.48, -0.16, 0.16, 0.48];
        const agents = 22;
        for (let i = lanes[0]; i < lanes[1]; i++) {
          const k = (i - lanes[0]) % agents;
          const lane = k % 4;
          const slot = Math.floor(k / 4);
          const cx = -0.45 + (slot / 5) * 1.25;
          const t = r();
          const onAgent = t < 0.7;
          put(
            i,
            onAgent ? cx + gauss(r) * 0.035 : -0.5 + r() * 1.4,
            laneY[lane] + gauss(r) * (onAgent ? 0.03 : 0.012),
            gauss(r) * (onAgent ? 0.04 : 0.02),
          );
        }
        const reviewers = 11;
        for (let i = gate[0]; i < gate[1]; i++) {
          const k = (i - gate[0]) % reviewers;
          put(i, 1.08 + gauss(r) * 0.012, -0.62 + (k / (reviewers - 1)) * 1.24 + gauss(r) * 0.012, gauss(r) * 0.02, 2);
        }
        for (let i = output[0]; i < output[1]; i++) {
          const x = 1.2 + r() * 0.75;
          put(i, x, gauss(r) * 0.05 * (1 - (x - 1.2)), gauss(r) * 0.04);
        }
      },
      23,
    ),

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

  /** Hiroop: a spectrogram-like terrain (time × frequency × energy). */
  hiroop: (n) =>
    make(
      n,
      (put, r) => {
        for (let i = 0; i < n; i++) {
          const x = -1.6 + r() * 3.2; // time
          const z = -1 + r() * 2; // frequency
          const breath = Math.max(0, Math.sin(x * 2.6 + 0.4)); // inhale / exhale envelope
          const bands = Math.exp(-((z + 0.55) ** 2) / 0.03) + 0.7 * Math.exp(-((z - 0.05) ** 2) / 0.05) + 0.35 * Math.exp(-((z - 0.6) ** 2) / 0.04);
          const y = -0.45 + breath * bands * 0.85 + gauss(r) * 0.02;
          put(i, x, y, z);
        }
      },
      41,
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

  /** Scene 3: a single line with one node per role or study, placed by start year; the current role is highlighted. */
  trajectory: (n) =>
    make(
      n,
      (put, r) => {
        const years = trajectory.map((t) => Number(t.period.match(/\d{4}/)?.[0] ?? 0));
        const min = Math.min(...years);
        const max = Math.max(...years) + 1;
        const nodeX = trajectory.map((t, k) => -1.9 + ((years[k] - min + (k % 2) * 0.35) / (max - min)) * 3.8);
        const [line, nodes] = ranges(n, [0.7, 0.3]);
        for (let i = line[0]; i < line[1]; i++) put(i, -2 + r() * 4, gauss(r) * 0.012, gauss(r) * 0.02, 1);
        for (let i = nodes[0]; i < nodes[1]; i++) {
          const k = (i - nodes[0]) % trajectory.length;
          put(i, nodeX[k] + gauss(r) * 0.03, gauss(r) * 0.03, gauss(r) * 0.03, trajectory[k].current ? 2 : 0);
        }
      },
      71,
    ),

  /** Scene 5: a calm, regular lattice. */
  contact: (n) =>
    make(
      n,
      (put) => {
        const side = Math.ceil(Math.cbrt(n));
        const step = 2.2 / (side - 1);
        for (let i = 0; i < n; i++) {
          const x = i % side;
          const y = Math.floor(i / side) % side;
          const z = Math.floor(i / (side * side));
          put(i, -1.1 + x * step, -1.1 + y * step, -1.1 + z * step);
        }
      },
      79,
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

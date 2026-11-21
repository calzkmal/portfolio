/**
 * Shared, mutable scroll state for the 3D field. Written by ScrollTrigger
 * callbacks, read inside the field's frame step. Never React state, so a
 * scroll frame never causes a re-render.
 */

interface Segment {
  /** Field-state delta covered by this segment (e.g. 1 = one full morph). */
  delta: number;
  /** Returns 0–1 progress of the segment's ScrollTrigger. */
  progress: () => number;
}

export const scrollStore = {
  segments: [] as Segment[],
  darkProgress: () => 0,
  /** Pointer position in -1…1 (fine pointers only). */
  pointer: { x: 0, y: 0 },
  /** Set when anything changed so a demand-rendered frame is needed. */
  dirty: true,

  /** Continuous position along the field states (0 = arrival … 7 = contact). */
  fieldT() {
    let t = 0;
    for (const s of this.segments) t += s.delta * s.progress();
    return t;
  },
  reset() {
    this.segments = [];
    this.darkProgress = () => 0;
    this.dirty = true;
  },
};

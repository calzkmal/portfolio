"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { FIELD_STATES, type FieldState } from "@/data/scenes";
import { gsap } from "@/components/motion/gsap";
import { scrollStore } from "@/components/motion/scrollStore";
import { getLayout, VIEW } from "./targets";
import { fragmentShader, vertexShader } from "./shaders";

/**
 * The live signal field: one THREE.Points whose layout morphs between the
 * scene states as the page scrolls. Lazy-loaded, desktop only.
 *
 * Rendering is driven from GSAP's ticker (the same loop that drives Lenis and
 * ScrollTrigger), with R3F's own loop switched off: one animation loop total.
 */

/** Where each state sits on screen (fraction of the visible width from centre), and its scale. */
const FRAME: Record<FieldState, { x: number; y: number; scale: number; noise: number }> = {
  arrival: { x: 0.23, y: 0, scale: 0.92, noise: 1 },
  pipeline: { x: 0.24, y: 0.02, scale: 0.6, noise: 0.25 },
  seagis: { x: 0.24, y: 0, scale: 0.6, noise: 0.15 },
  hiroop: { x: 0.24, y: 0.05, scale: 0.66, noise: 0.15 },
  "hiroop-classes": { x: 0.24, y: 0, scale: 0.78, noise: 0.25 },
  emodu: { x: 0.24, y: 0.05, scale: 0.78, noise: 0.25 },
  trajectory: { x: 0, y: -0.3, scale: 0.78, noise: 0.1 },
  contact: { x: 0, y: 0, scale: 0.95, noise: 0.08 },
};

const COLORS = {
  ink: new THREE.Color("#082E43"),
  paper: new THREE.Color("#F3F5F3"),
  signal: new THREE.Color("#FF4F31"),
  ice: new THREE.Color("#C9DFEA"),
  sage: new THREE.Color("#BCCFC2"),
};

const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface FieldProps {
  points: number;
  maxDpr: number;
  stage: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onFail: () => void;
}

function Field({ points, stage, onReady, onFail }: Omit<FieldProps, "maxDpr">) {
  const { gl, camera, size, advance, setDpr } = useThree();
  const group = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(points);
    for (let i = 0; i < points; i++) {
      const v = Math.sin(i * 12.9898) * 43758.5453;
      seeds[i] = v - Math.floor(v); // deterministic 0–1 per point
    }
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points * 3), 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(new Float32Array(points * 3), 3));
    geo.setAttribute("aToneFrom", new THREE.BufferAttribute(new Float32Array(points), 1));
    geo.setAttribute("aToneTo", new THREE.BufferAttribute(new Float32Array(points), 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uNoise: { value: 1 },
        uSize: { value: 2.1 },
        uPixelRatio: { value: 1 },
        uDark: { value: 0 },
        uInk: { value: COLORS.ink },
        uPaper: { value: COLORS.paper },
        uSignal: { value: COLORS.signal },
        uIce: { value: COLORS.ice },
        uSage: { value: COLORS.sage },
      },
    });
    return { geometry: geo, material: mat };
  }, [points]);

  useEffect(() => {
    const layouts = FIELD_STATES.map((s) => getLayout(s, points));
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const to = geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const toneFrom = geometry.getAttribute("aToneFrom") as THREE.BufferAttribute;
    const toneTo = geometry.getAttribute("aToneTo") as THREE.BufferAttribute;
    let pair = -1;
    const setPair = (i: number) => {
      (pos.array as Float32Array).set(layouts[i].positions);
      (to.array as Float32Array).set(layouts[i + 1].positions);
      (toneFrom.array as Float32Array).set(layouts[i].tones);
      (toneTo.array as Float32Array).set(layouts[i + 1].tones);
      pos.needsUpdate = to.needsUpdate = toneFrom.needsUpdate = toneTo.needsUpdate = true;
      pair = i;
    };

    // Pointer: subtle parallax for fine pointers only.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

    const view = { rx: 0, ry: 0, px: 0, py: 0 };
    const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    let last = 0;
    let lastDark = -1;
    let lastWash = -1;
    let frames = 0;
    let slow = 0;
    let windowStart = performance.now();
    let quality = 2; // 2 = full, 1 = dpr 1, 0 = half the points
    let ready = false;

    const tick = (time: number) => {
      if (document.hidden) return;
      const now = performance.now();
      const t = Math.min(FIELD_STATES.length - 1, Math.max(0, scrollStore.fieldT()));
      const i = Math.min(FIELD_STATES.length - 2, Math.floor(t));
      const m = t - i;
      if (i !== pair) setPair(i);

      // Idle drift at ~30fps; full rate while scrolling or the pointer moves.
      const dirty = scrollStore.dirty;
      if (!dirty && now - last < 33) return;
      scrollStore.dirty = false;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      const a = FIELD_STATES[i];
      const b = FIELD_STATES[i + 1];
      const e = ease(m);
      const fa = FRAME[a];
      const fb = FRAME[b];
      const u = material.uniforms;
      u.uMix.value = m;
      u.uTime.value = time;
      u.uNoise.value = lerp(fa.noise, fb.noise, e);
      u.uPixelRatio.value = gl.getPixelRatio();
      const dark = scrollStore.darkProgress();
      u.uDark.value = dark;

      // Scroll-controlled framing: position, scale and rotation follow the morph,
      // with a half-turn of extra spin while points are in transit.
      const visibleH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const visibleW = visibleH * (size.width / size.height);
      const g = group.current!;
      g.position.x = lerp(fa.x, fb.x, e) * visibleW;
      g.position.y = lerp(fa.y, fb.y, e) * visibleH;
      g.scale.setScalar(lerp(fa.scale, fb.scale, e) * Math.min(1, size.width / 1280 + 0.15));
      const transit = Math.sin(m * Math.PI);
      view.rx = lerp(VIEW[a].rx, VIEW[b].rx, e);
      view.ry = lerp(VIEW[a].ry, VIEW[b].ry, e) + transit * 0.5 + (i === 0 ? time * 0.04 : 0);
      // Pointer parallax, eased.
      view.px += (scrollStore.pointer.y * 0.08 - view.px) * Math.min(1, dt * 4);
      view.py += (scrollStore.pointer.x * 0.12 - view.py) * Math.min(1, dt * 4);
      g.rotation.set(view.rx + view.px, view.ry + view.py, 0);
      // Camera dolly: drifts in slightly during a morph.
      camera.position.z = 5.2 - transit * 0.45;

      // Stage: paper → ink for Contact, and a soft ice/sage wash through the middle scenes.
      const st = stage.current;
      if (st) {
        if (Math.abs(dark - lastDark) > 0.001) {
          st.style.backgroundColor = `color-mix(in srgb, #082E43 ${(dark * 100).toFixed(1)}%, #F3F5F3)`;
          lastDark = dark;
        }
        const wash = Math.max(0, Math.min(1, t - 0.5, 6.2 - t)) * (1 - dark);
        if (Math.abs(wash - lastWash) > 0.005) {
          st.style.setProperty("--wash", wash.toFixed(3));
          lastWash = wash;
        }
      }

      advance(now);
      if (!ready) {
        ready = true;
        onReady();
      }

      // Adaptive quality: watch frame cadence over 2 s windows while rendering at full rate.
      frames++;
      if (dirty && dt > 0.024) slow++;
      if (now - windowStart > 2000) {
        if (frames > 30 && slow / frames > 0.5) {
          quality--;
          if (quality === 1) setDpr(1);
          else if (quality === 0) geometry.setDrawRange(0, Math.floor(points / 2));
          else if (quality < 0) onFail();
        }
        frames = 0;
        slow = 0;
        windowStart = now;
      }
    };

    setPair(0);
    gsap.ticker.add(tick);
    const onVisible = () => (scrollStore.dirty = true);
    document.addEventListener("visibilitychange", onVisible);

    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      onFail();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("visibilitychange", onVisible);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (fine) window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, points, gl, camera, size, advance, setDpr, stage, onReady, onFail]);

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function SignalField(props: FieldProps) {
  return (
    <Canvas
      frameloop="never"
      dpr={[1, props.maxDpr]}
      camera={{ fov: 35, position: [0, 0, 5.2], near: 0.1, far: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field points={props.points} stage={props.stage} onReady={props.onReady} onFail={props.onFail} />
    </Canvas>
  );
}

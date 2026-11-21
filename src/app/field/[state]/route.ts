import { FIELD_STATES, type FieldState } from "@/data/scenes";
import { getLayout, VIEW } from "@/components/field/targets";

/**
 * Static SVG posters of each field state, e.g. /field/hiroop.svg.
 * Generated at build time from the same layouts as the live WebGL field, so
 * the fallback (no JS, reduced motion, small screens, no WebGL) always matches.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return FIELD_STATES.map((state) => ({ state: `${state}.svg` }));
}

const POINTS = 1600;
const W = 800;
const H = 600;
const SCALE = 165;
const CAMERA = 5;

export async function GET(_req: Request, { params }: { params: Promise<{ state: string }> }) {
  const { state: file } = await params;
  const state = file.replace(/\.svg$/, "") as FieldState;
  if (!FIELD_STATES.includes(state)) return new Response("Not found", { status: 404 });

  const { positions, tones } = getLayout(state, POINTS);
  const { rx, ry } = VIEW[state];
  const [sx, cx, sy, cy] = [Math.sin(rx), Math.cos(rx), Math.sin(ry), Math.cos(ry)];
  const dark = state === "contact";
  const ink = dark ? "#F3F5F3" : "#082E43";

  const pts: { x: number; y: number; z: number; tone: number }[] = [];
  for (let i = 0; i < POINTS; i++) {
    const x0 = positions[i * 3];
    const y0 = positions[i * 3 + 1];
    const z0 = positions[i * 3 + 2];
    // rotate around Y, then X
    const x1 = x0 * cy + z0 * sy;
    const z1 = -x0 * sy + z0 * cy;
    const y2 = y0 * cx - z1 * sx;
    const z2 = y0 * sx + z1 * cx;
    const p = CAMERA / (CAMERA - z2);
    pts.push({ x: W / 2 + x1 * SCALE * p, y: H / 2 - y2 * SCALE * p, z: z2, tone: tones[i] });
  }
  pts.sort((a, b) => a.z - b.z);

  const circles = pts
    .map(({ x, y, z, tone }) => {
      const depth = Math.min(1, Math.max(0, (z + 1.5) / 3));
      const r = (1.3 + depth * 1.1).toFixed(2);
      const fill = tone === 2 ? "#FF4F31" : ink;
      const opacity = tone === 1 ? 0.16 : tone === 2 ? 0.95 : 0.35 + depth * 0.5;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" fill-opacity="${opacity.toFixed(2)}"/>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${circles}</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

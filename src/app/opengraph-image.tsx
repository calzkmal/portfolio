import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site";
import { displayName, focusAreas } from "@/data/home";

export const alt = siteConfig.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Same palette as the home page (components/home/home.css). */
const INK = "#1f1d1c";
const MUTED = "#8a8580";
const LINE = "#e6e2dd";
const ACCENT = "#9b1d1b";

/** Mona Sans (the home page display face) as TTF; falls back to the built-in font if offline. */
async function displayFont() {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400")).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/**
 * Link-preview image, built from the same data as the home page so it updates on every deploy:
 * the big two-line name on the left, the portrait and focus areas on the right.
 */
export default async function OpenGraphImage() {
  const [photo, font] = await Promise.all([
    readFile(path.join(process.cwd(), "public", profile.avatar)),
    displayFont(),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const [first, last] = displayName.split(" ");
  const fontFamily = font ? "Mona Sans" : "sans-serif";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", fontFamily }}>
        {/* Left half: the name, bottom-right, with a rule between the lines */}
        <div
          style={{
            width: 600,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            borderRight: `1px solid ${LINE}`,
            paddingBottom: 56,
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 28px 10px", fontSize: 76, color: INK, letterSpacing: -1.5 }}>
            {first}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop: `1px solid ${LINE}`,
              padding: "4px 72px 10px 0",
              fontSize: 76,
              color: INK,
              letterSpacing: -1.5,
            }}
          >
            {last}
          </div>
        </div>

        {/* Right half: portrait and focus areas */}
        <div style={{ width: 600, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", gap: 24 }}>
          <div style={{ display: "flex", padding: 10, border: `1px solid ${LINE}`, width: 200 }}>
            {/* Cropped like the page: zoomed in, subject centred */}
            <div style={{ display: "flex", position: "relative", width: 180, height: 225, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img src={src} width={270} height={338} style={{ position: "absolute", left: -64, top: -56 }} />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: 470 }}>
            {focusAreas.map((f) => (
              <div
                key={f}
                style={{ display: "flex", fontSize: 17, color: MUTED, border: `1px solid ${LINE}`, borderRadius: 999, padding: "6px 14px" }}
              >
                {f}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 18, color: ACCENT }}>{profile.location}</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Mona Sans", data: font, weight: 400, style: "normal" }] : undefined },
  );
}

/**
 * Cover art for the Works cards, drawn from each project's own subject.
 * Seagis and Hiroop are illustrations (labelled so); Emodu plots its real BERTScore results.
 * A project without its own art gets a plain title card.
 */

const FONT = "var(--home-body), system-ui, sans-serif";

export const artBackground: Record<string, string> = {
  seagis: "#d7e3e6",
  emodu: "#e8e1d6",
  hiroop: "#e9dcd8",
};

function Label({ x, y, fill, children }: { x: number; y: number; fill: string; children: string }) {
  return (
    <text x={x} y={y} fontSize={11} fill={fill} fontFamily={FONT} letterSpacing="1.5">
      {children}
    </text>
  );
}

function Seagis() {
  // 24 hourly temperature readings on one scale (26–31 °C) — an illustration of the hourly alignment.
  const ink = "#1f3b45";
  const [x0, x1, y0, y1, lo, hi] = [40, 370, 250, 110, 26, 31];
  const temps = Array.from(
    { length: 24 },
    (_, h) => 28.4 + 1.6 * Math.sin(((h - 9) / 24) * Math.PI * 2) + 0.25 * Math.sin(h * 1.7),
  );
  const X = (i: number) => x0 + ((x1 - x0) * i) / 23;
  const Y = (t: number) => y0 - ((y0 - y1) * (t - lo)) / (hi - lo);
  const d = temps.map((t, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(t).toFixed(1)}`).join(" ");
  const ticks = [26, 27, 28, 29, 30, 31];

  return (
    <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustration of hourly temperature readings">
      <Label x={x0} y={82} fill={ink}>HOURLY ALIGNMENT · ILLUSTRATIVE</Label>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0} x2={x1} y1={Y(t)} y2={Y(t)} stroke={ink} strokeOpacity={t === lo ? 0.5 : 0.12} />
          {(t - lo) % 2 === 1 && (
            <text x={x0 - 8} y={Y(t) + 3} textAnchor="end" fontSize={9} fill={ink} fillOpacity={0.6} fontFamily={FONT}>
              {t}°
            </text>
          )}
        </g>
      ))}
      {[0, 6, 12, 18, 23].map((h) => (
        <text key={h} x={X(h)} y={y0 + 16} textAnchor="middle" fontSize={9} fill={ink} fillOpacity={0.6} fontFamily={FONT}>
          {String(h).padStart(2, "0")}:00
        </text>
      ))}
      <path d={`${d} L${x1} ${y0} L${x0} ${y0} Z`} fill={ink} fillOpacity={0.08} />
      <path d={d} fill="none" stroke={ink} strokeWidth={1.6} />
      {temps.map((t, i) => (
        <circle key={i} cx={X(i)} cy={Y(t)} r={2} fill={i === 23 ? "#9b1d1b" : ink} />
      ))}
    </svg>
  );
}

function Emodu() {
  // BERTScore F1, base vs LoRA fine-tuned, on a 0–1 scale (values from the project data).
  const ink = "#3b2f22";
  const [x0, x1] = [60, 360];
  const W = (v: number) => (x1 - x0) * v;
  const bars = [
    { name: "Base", value: 0.6878, fill: ink, opacity: 0.35, y: 150 },
    { name: "LoRA", value: 0.7238, fill: "#9b1d1b", opacity: 1, y: 200 },
  ];

  return (
    <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label="BERTScore F1: base model 0.6878, fine-tuned 0.7238">
      <Label x={x0} y={96} fill={ink}>BERTSCORE F1 · LLAMA 3.2 1B</Label>
      <line x1={x0} x2={x0} y1={120} y2={230} stroke={ink} strokeOpacity={0.5} />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={x0 + W(v)} x2={x0 + W(v)} y1={120} y2={230} stroke={ink} strokeOpacity={0.1} />
          <text x={x0 + W(v)} y={248} textAnchor="middle" fontSize={9} fill={ink} fillOpacity={0.6} fontFamily={FONT}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {bars.map((b) => (
        <g key={b.name}>
          <rect x={x0} y={b.y - 14} width={W(b.value)} height={28} fill={b.fill} fillOpacity={b.opacity} />
          <text x={x0 - 8} y={b.y + 4} textAnchor="end" fontSize={10} fill={ink} fontFamily={FONT}>
            {b.name}
          </text>
          <text x={x0 + W(b.value) + 8} y={b.y + 4} fontSize={10} fill={ink} fontFamily={FONT}>
            {b.value.toFixed(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Hiroop() {
  // A breath cycle as a mirrored waveform, with the five output classes underneath (illustration).
  const ink = "#4a1f1a";
  const [n, x0, x1, mid] = [120, 30, 370, 160];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const bars = Array.from({ length: n }, (_, i) => {
    const p = i / n;
    const env = Math.pow(Math.sin(p * Math.PI * 2.2) ** 2, 0.7);
    const h = 6 + 70 * env * (0.45 + 0.55 * rnd());
    return { x: x0 + (x1 - x0) * p, h };
  });

  return (
    <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustration of an audio waveform sorted into five classes">
      <Label x={x0} y={70} fill={ink}>WAV → MFCC · MEL · CHROMA → 5 CLASSES</Label>
      {bars.map((b, i) => (
        <rect key={i} x={b.x.toFixed(1)} y={(mid - b.h / 2).toFixed(1)} width={1.6} height={b.h.toFixed(1)} fill={ink} fillOpacity={0.8} />
      ))}
      {[1, 2, 3, 4, 5].map((c, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / 5;
        return (
          <g key={c}>
            <circle cx={x} cy={252} r={3} fill={i === 2 ? "#9b1d1b" : "none"} stroke={ink} strokeOpacity={0.6} />
            <text x={x} y={272} textAnchor="middle" fontSize={9} fill={ink} fillOpacity={0.7} fontFamily={FONT}>
              class {c}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Plain({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}>
      <text x={40} y={190} fontSize={28} fill="#1f1d1c" fontFamily={FONT} fontWeight={300}>
        {title}
      </text>
    </svg>
  );
}

export function ProjectArt({ slug, title }: { slug: string; title: string }) {
  if (slug === "seagis") return <Seagis />;
  if (slug === "emodu") return <Emodu />;
  if (slug === "hiroop") return <Hiroop />;
  return <Plain title={title} />;
}

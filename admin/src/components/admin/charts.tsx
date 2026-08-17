/**
 * Small pure-SVG chart primitives for the dashboard. Server-safe (no hooks);
 * hover feedback is CSS, tooltips are native <title>, and every chart ships an
 * sr-only table so the numbers are readable without the picture.
 * Marks follow the house rules: thin, rounded data-ends anchored to the
 * baseline, 2px gaps, recessive grid, one accent hue for magnitude.
 */

const fmt = (n: number) => n.toLocaleString("en-US");

export function Sparkline({ points, width = 120, height = 32, label }: { points: number[]; width?: number; height?: number; label: string }) {
  if (points.length < 2) return <svg width={width} height={height} aria-hidden="true" />;
  const max = Math.max(1, ...points);
  const step = width / (points.length - 1);
  const y = (v: number) => height - 2 - (v / max) * (height - 4);
  const line = points.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="overflow-visible">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="chart-draw" />
    </svg>
  );
}

export function BarChart({
  data,
  height = 150,
  label,
  valueLabel = "views",
}: {
  data: { key: string; value: number; title?: string }[];
  height?: number;
  label: string;
  valueLabel?: string;
}) {
  const n = data.length;
  if (n === 0) return null;
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 600;
  const gap = 2;
  const bw = Math.max(2, (W - gap * (n - 1)) / n);
  const top = 6;
  const bottom = 18;
  const plotH = height - top - bottom;
  const gridY = [0.5, 1].map((f) => top + plotH - plotH * f);
  const showEvery = n > 14 ? Math.ceil(n / 6) : 1;

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label} className="h-auto w-full">
        {gridY.map((gy, i) => (
          <line key={i} x1={0} x2={W} y1={gy} y2={gy} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
        ))}
        {data.map((d, i) => {
          const h = Math.max(d.value > 0 ? 3 : 0, (d.value / max) * plotH);
          const x = i * (bw + gap);
          const y = top + plotH - h;
          const r = Math.min(4, bw / 2);
          return (
            <g key={d.key} className="chart-bar">
              <title>{`${d.title ?? d.key}: ${fmt(d.value)} ${valueLabel}`}</title>
              {/* hit target taller than the bar so hover works on tiny values */}
              <rect x={x} y={top} width={bw} height={plotH} fill="transparent" />
              {h > 0 ? (
                <path
                  d={`M${x},${top + plotH} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${top + plotH} Z`}
                  fill="var(--accent)"
                  className="chart-mark"
                />
              ) : null}
              {i % showEvery === 0 ? (
                <text x={x + bw / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.45)">
                  {d.key.slice(5)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.title ?? d.key}</th>
              <td>{fmt(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function HBars({ rows, label, empty = "Nothing yet" }: { rows: { label: string; value: number; hint?: string }[]; label: string; empty?: string }) {
  if (rows.length === 0) return <p className="text-sm text-white/45">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div role="img" aria-label={label}>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="chart-bar" title={`${r.label}: ${fmt(r.value)}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-white/85">{r.label}</span>
              <span className="tabular-nums text-white/60">{fmt(r.value)}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="chart-mark h-full rounded-full" style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: "var(--accent)" }} />
            </div>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{fmt(r.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0 && now === 0) return <span className="text-xs text-white/40">no change</span>;
  if (prev === 0) return <span className="text-xs text-green-400">new</span>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className={`text-xs ${up ? "text-green-400" : "text-amber-300"}`} title="vs previous period">
      {up ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

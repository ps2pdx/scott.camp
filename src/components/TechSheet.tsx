import type { TechSheetData } from '@/content/copy';
import s from './TechSheet.module.css';

type Layout = { w: number; h: number; frame: [number, number, number, number]; head: { x: number; y: number; dy: number; fs: number }; step: { x: number; fs: number; span?: [number, number] }; punches: number[] };

const WIDE: Layout = { w: 480, h: 300, frame: [24, 28, 104, 252], head: { x: 170, y: 42, dy: 13, fs: 10 }, step: { x: 176, fs: 11, span: [130, 276] }, punches: [80, 240, 400] };

export function TechSheet({ data }: { data: TechSheetData }) {
  const L = WIDE;
  const [fx, fy, fw, fh] = L.frame;
  const n = data.sections.length, inset = 6, gap = 6, bh = (fh - 2 * inset - gap * (n - 1)) / n;
  const rows = data.sections.map((sec, i) => {
    const y = fy + inset + i * (bh + gap), cy = y + bh / 2;
    const ty = L.step.span ? L.step.span[0] + (n > 1 ? (i * (L.step.span[1] - L.step.span[0])) / (n - 1) : 0) : cy + 4;
    return { sec, y, cy, ty };
  });
  const hdr = [['SHEET', data.sheet], ['VIEW', data.view], ['STACK', data.stack], ['SRC', data.src], ['DATE', data.date]];
  const ruleY = L.head.y + L.head.dy * (hdr.length - 1) + 10;
  return (
    <figure className={`grain tex-paper ${s.fig}`}>
      <svg role="img" aria-label={`Tech sheet: ${data.sheet}`} viewBox={`0 0 ${L.w} ${L.h}`} className={s.svg}>
        <rect width={L.w} height={L.h} fill="url(#gp)" />
        <g className={s.stroke} fill="none" strokeWidth="1.2">
          <rect x={fx} y={fy} width={fw} height={fh} />
          {rows.map((r) => <rect key={r.sec} data-part="box" className="box" x={fx + inset} y={r.y} width={fw - 2 * inset} height={bh} />)}
          <path d={rows.map((r) => `M${fx + fw} ${r.cy}L${L.step.x - 6} ${r.ty - 4}`).join('')} strokeDasharray="2 2" />
          <path d={`M${L.head.x} ${ruleY}H${L.w - 12}`} strokeWidth="0.6" />
        </g>
        <g fontSize={L.step.fs}>{rows.map((r, i) => <text key={r.sec} data-part="step" x={L.step.x} y={r.ty}>{`${i + 1}  ${r.sec}`}</text>)}</g>
        <g data-part="header" fontSize={L.head.fs}>{hdr.map(([k, v], i) => <text key={k} x={L.head.x} y={L.head.y + i * L.head.dy}>{`${k.padEnd(6)} ${v}`}</text>)}</g>
        {L.punches.map((cx) => <circle key={cx} className={`${s.stroke} ${s.punch}`} cx={cx} cy="12" r="4" strokeWidth="0.6" />)}
      </svg>
      <figcaption className="meta-sm muted">{data.sheet} · Tech sheet · Rendered</figcaption>
    </figure>
  );
}

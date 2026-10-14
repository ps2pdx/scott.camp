import type { TechSheetData } from '@/content/copy';
import s from './TechSheet.module.css';
export function TechSheet({ data }: { data: TechSheetData }) {
  const n = data.sections.length, top = 28, avail = 244, gap = 6, h = (avail - gap * (n - 1)) / n;
  const rows = data.sections.map((sec, i) => { const y = top + i * (h + gap); return { sec, y, cy: y + h / 2 }; });
  const hdr = [['SHEET', data.sheet], ['VIEW', data.view], ['STACK', data.stack], ['SRC', data.src], ['DATE', data.date]];
  return (
    <figure className={`grain tex-paper ${s.fig}`}>
      <svg role="img" aria-label={`Tech sheet: ${data.sheet}`} viewBox="0 0 480 300" className={s.svg}>
        <rect width="480" height="300" fill="url(#gp)" />
        <g className={s.stroke} stroke="#111" fill="none" strokeWidth="1.2">
          <rect x="40" y="22" width="110" height="256" />
          {rows.map((r) => <rect key={r.sec} data-part="box" className="box" x="46" y={r.y} width="98" height={h} />)}
          <path d={rows.map((r) => `M144 ${r.cy}H200`).join('')} strokeDasharray="2 2" />
        </g>
        <g fontSize="9" fill="#111">{rows.map((r, i) => <text key={r.sec} x="204" y={r.cy + 3}>{`${i + 1}  ${r.sec}`}</text>)}</g>
        <g fontSize="8" fill="#111">{hdr.map(([k, v], i) => <text key={k} x="300" y={38 + i * 12}>{`${k.padEnd(6)} ${v}`}</text>)}</g>
        {[72, 240, 408].map((cx) => <circle key={cx} className={s.stroke} cx={cx} cy="12" r="4" fill="#fff" stroke="#111" strokeWidth="0.6" />)}
      </svg>
      <figcaption className="meta-sm muted">{data.sheet} · Tech sheet · Rendered</figcaption>
    </figure>
  );
}

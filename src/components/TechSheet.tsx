import { useLayoutEffect, useRef, useState } from 'react';
import type { TechSheetData } from '@/content/copy';
import s from './TechSheet.module.css';

const W = 480, H = 300, FRAME: [number, number, number, number] = [24, 28, 104, 252], HEAD_X = 136, STEP_X = 176, PUNCHES = [80, 240, 400];
const LINE = 16;

function useWidth() {
  const ref = useRef<HTMLElement>(null);
  const [w, setW] = useState(W);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { if (e.contentRect.width) setW(e.contentRect.width); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function TechSheet({ data }: { data: TechSheetData }) {
  const [ref, width] = useWidth();
  const k = width / W, vw = width, vh = H * k;
  const [fx, fy, fw, fh] = FRAME.map((v) => v * k);
  const n = data.sections.length, inset = 6 * k, gap = 6 * k, bh = (fh - 2 * inset - gap * (n - 1)) / n;
  const hdr = [['SHEET', data.sheet], ['VIEW', data.view], ['STACK', data.stack], ['SRC', data.src], ['DATE', data.date]];
  const headY = fy + 12, ruleY = headY + LINE * (hdr.length - 1) + 8;
  const top = ruleY + 22, bottom = fy + fh - 6;
  const rows = data.sections.map((sec, i) => {
    const y = fy + inset + i * (bh + gap);
    return { sec, y, cy: y + bh / 2, ty: top + (n > 1 ? (i * (bottom - top)) / (n - 1) : 0) };
  });
  const stepX = STEP_X * k;
  return (
    <figure ref={ref} className={`grain tex-paper ${s.fig}`}>
      <svg role="img" aria-label={`Tech sheet: ${data.sheet}`} viewBox={`0 0 ${vw} ${vh}`} className={`meta ${s.svg}`}>
        <rect width={vw} height={vh} fill="url(#gp)" />
        <g className={s.stroke} fill="none" strokeWidth="1.2">
          <rect x={fx} y={fy} width={fw} height={fh} />
          {rows.map((r) => <rect key={r.sec} data-part="box" className="box" x={fx + inset} y={r.y} width={fw - 2 * inset} height={bh} />)}
          <path d={rows.map((r) => `M${fx + fw} ${r.cy}L${stepX - 6} ${r.ty - 4}`).join('')} strokeDasharray="2 2" />
          <path d={`M${HEAD_X * k} ${ruleY}H${vw - 4}`} strokeWidth="0.6" />
        </g>
        <g>{rows.map((r, i) => <text key={r.sec} data-part="step" x={stepX} y={r.ty}>{`${i + 1}  ${r.sec}`}</text>)}</g>
        <g data-part="header">{hdr.map(([key, v], i) => <text key={key} x={HEAD_X * k} y={headY + i * LINE}>{`${key.padEnd(6)} ${v}`}</text>)}</g>
        {PUNCHES.map((cx) => <circle key={cx} className={`${s.stroke} ${s.punch}`} cx={cx * k} cy="12" r="4" strokeWidth="0.6" />)}
      </svg>
      <figcaption className="meta muted">{data.sheet} · Tech sheet · Rendered</figcaption>
    </figure>
  );
}

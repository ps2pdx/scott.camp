import { useLayoutEffect, useRef, useState } from 'react';
import type { TechSheetData } from '@/content/copy';
import { drawFigure, type Pt } from './techFigures';
import s from './TechSheet.module.css';

const W = 360, PAD = 16, PUNCHES = [1 / 6, 1 / 2, 5 / 6], ASPECT = Math.SQRT2, CHAR = 0.64;

function useMetrics() {
  const ref = useRef<HTMLElement>(null);
  const [m, setM] = useState({ w: W, fs: 13 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const svg = el.querySelector('svg');
    const ro = new ResizeObserver(([e]) => {
      const fs = svg ? parseFloat(getComputedStyle(svg).fontSize) || 13 : 13;
      if (e.contentRect.width) setM({ w: e.contentRect.width, fs });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, m] as const;
}

export function sheetLayout(data: TechSheetData, vw: number, fs: number) {
  const vh = Math.round(vw * ASPECT), line = Math.round(fs * 1.55), cw = fs * CHAR, n = data.sections.length;
  const headY = 28 + fs, ruleY = headY + line * 4 + 10;
  const rowY = (i: number) => vh - PAD - (n - 1 - i) * line;
  const numX = PAD + 10 + n * 5, lane = (i: number) => numX - 8 - i * 5;
  const box = { x: PAD, y: ruleY + 18, w: vw - 2 * PAD, h: rowY(0) - fs - 18 - n * 5 - (ruleY + 18) };
  const fig = drawFigure(data.figure, { box, n, fs, cw, inset: numX - PAD, spare: n * 5, lanes: 6 + (n - 1) * 5 + 4 });
  const { right, top, left } = fig.extent;
  const knee = (i: number) => box.y + box.h + 8 + (n - 1 - i) * 5;
  const tops = fig.anchors.flatMap((a, i) => (a.side === 'top' ? [i] : []));
  const leaders: Pt[][] = fig.anchors.map(({ p: [ax, ay], side }, i) => {
    const s: Pt = [numX - 4, rowY(i) - fs * 0.35];
    if (side === 'left') return [s, [lane(i), s[1]], [lane(i), ay], [ax, ay]];
    if (side === 'bottom') return [s, [lane(i), s[1]], [lane(i), knee(i)], [ax, knee(i)], [ax, ay]];
    if (side === 'right') { const r = right + 6 + (n - 1 - i) * 5; return [s, [lane(i), s[1]], [lane(i), knee(i)], [r, knee(i)], [r, ay], [ax, ay]]; }
    const k = tops.indexOf(i), x = Math.min(lane(i), left - 6 - k * 5), y = top - 8 - k * 5;
    return [s, [x, s[1]], [x, y], [ax, y], [ax, ay]];
  });
  return { vh, line, n, headY, ruleY, rowY, numX, fig, leaders };
}

export function TechSheet({ data }: { data: TechSheetData }) {
  const [ref, { w: vw, fs }] = useMetrics();
  const hdr = [['SHEET', data.sheet], ['VIEW', data.view], ['STACK', data.stack], ['SRC', data.src], ['DATE', data.date]];
  const { vh, line, headY, ruleY, rowY, numX, fig, leaders: paths } = sheetLayout(data, vw, fs);
  const leaders = paths.map((pts) => pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x} ${y}`).join('')).join('');
  return (
    <figure ref={ref} className={`grain tex-paper ${s.fig}`} data-figure={data.figure}>
      <svg role="img" aria-label={`Tech sheet: ${data.sheet}`} viewBox={`0 0 ${vw} ${vh}`} className={`meta ${s.svg}`}>
        <rect width={vw} height={vh} fill="url(#gp)" />
        <g className={s.stroke} fill="none" strokeWidth="1.5" strokeLinejoin="miter">
          <path d={`M${PAD} ${ruleY}H${vw - PAD}`} strokeWidth="0.6" />
          <g data-part="figure">{fig.draw}</g>
          <path data-part="leaders" d={leaders} strokeWidth="1" strokeDasharray="2 2" />
          {fig.anchors.map(({ p: [ax, ay] }, i) => <circle key={i} className={s.paper} cx={ax} cy={ay} r="2.5" strokeWidth="1" />)}
        </g>
        <g>{data.sections.map((sec, i) => <text key={sec} data-part="step" x={numX} y={rowY(i)}>{`${i + 1}  ${sec}`}</text>)}</g>
        <g data-part="header">{hdr.map(([key, v], i) => <text key={key} x={PAD} y={headY + i * line}>{`${key.padEnd(6)} ${v}`}</text>)}</g>
        {PUNCHES.map((cx) => <circle key={cx} className={`${s.stroke} ${s.punch}`} cx={cx * vw} cy="12" r="4" strokeWidth="0.6" />)}
      </svg>
      <figcaption className="meta">{`${data.sheet}, ${data.src}, ${data.date}`}</figcaption>
    </figure>
  );
}

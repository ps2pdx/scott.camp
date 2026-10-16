import type { ReactNode } from 'react';
import type { TechFigure } from '@/content/copy';
import s from './TechSheet.module.css';

export type Box = { x: number; y: number; w: number; h: number };
export type Pt = [number, number];
export type Anchor = { p: Pt; side: 'left' | 'bottom' };
export type Figure = { draw: ReactNode; anchors: Anchor[] };
type Ctx = { box: Box; n: number; fs: number; cw: number; inset: number; spare: number };

const region = (key: string, r: Box, nums: number[]) => (
  <rect key={key} data-part="region" data-n={nums.join(' ')} x={r.x} y={r.y} width={r.w} height={r.h} />
);
const tag = (key: string, x: number, y: number, label: string, anchor: 'start' | 'middle' | 'end' = 'start') => (
  <text key={key} data-part="region-n" x={x} y={y} textAnchor={anchor}>{label}</text>
);
const below = (r: Box, k: number, of: number): Anchor => ({ p: [r.x + (r.w * (of - k)) / (of + 1), r.y + r.h], side: 'bottom' });
const left = (r: Box): Anchor => ({ p: [r.x, r.y + r.h / 2], side: 'left' });

function arrow(x1: number, x2: number, y: number) {
  return `M${x1} ${y}H${x2}M${x2 - 5} ${y - 4}L${x2} ${y}L${x2 - 5} ${y + 4}`;
}

function flow(c: Ctx, labels: string[][], targets: number[]): Figure {
  const { box, cw, fs } = c;
  const min = labels.map((l) => Math.max(...l.map((s) => s.length)) * cw + 10), total = min.reduce((a, b) => a + b, 0);
  const gap = Math.max(12, Math.min(22, (box.w - total) / (labels.length - 1)));
  const extra = Math.max(0, (box.w - total - gap * (labels.length - 1)) / labels.length);
  const h = Math.max(fs * 4, box.h * 0.3), y = box.y + (box.h - h) / 2;
  let x = box.x;
  const boxes = min.map((m) => { const r = { x, y, w: m + extra, h }; x += m + extra + gap; return r; });
  const per = boxes.map((_, b) => targets.filter((t) => t === b).length);
  const seen = boxes.map(() => 0);
  const anchors = targets.map((b) => below(boxes[b], seen[b]++, per[b]));
  const draw = (
    <>
      {boxes.map((r, b) => region(`r${b}`, r, targets.flatMap((t, i) => (t === b ? [i + 1] : []))))}
      <path d={boxes.slice(1).map((r, b) => arrow(boxes[b].x + boxes[b].w, r.x - 2, y + h / 2)).join('')} />
      {boxes.map((r, b) => labels[b].map((line, l) => tag(`t${b}${l}`, r.x + r.w / 2, y + h / 2 + fs * 0.35 + (l - (labels[b].length - 1) / 2) * fs * 1.3, line, 'middle')))}
    </>
  );
  return { draw, anchors };
}

function editor({ box, fs, inset }: Ctx): Figure {
  const w = Math.min(box.w - 2 * inset, box.h * 1.6), h = w / 1.6, x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
  const at = (u: number, v: number, uw: number, vh: number): Box => ({ x: x + u * w, y: y + v * h, w: uw * w, h: vh * h });
  const bar = at(0, 0, 1, 0.11), preview = at(0, 0.11, 0.76, 0.89), dock = at(0.025, 0.2, 0.06, 0.42), panel = at(0.76, 0.11, 0.24, 0.89), chat = at(0.47, 0.72, 0.26, 0.2);
  const base = (r: Box) => r.y + Math.min(r.h, fs * 1.6) / 2 + fs * 0.35;
  const draw = (
    <>
      {region('bar', bar, [1])}{region('preview', preview, [2])}{region('dock', dock, [3])}{region('panel', panel, [4])}{region('chat', chat, [5])}
      {tag('n1', bar.x + 6, base(bar), '1')}
      {tag('n2', preview.x + preview.w * 0.45, preview.y + preview.h * 0.4, '2', 'middle')}
      {tag('n3', dock.x + dock.w / 2, base(dock), '3', 'middle')}
      {tag('n4', panel.x + 6, base(panel), '4')}
      {tag('n5', chat.x + 6, base(chat), '5')}
    </>
  );
  return { draw, anchors: [left(bar), below(preview, 2, 3), left(dock), below(panel, 0, 1), below(chat, 0, 1)] };
}

function tokens({ box, n, fs, cw, inset }: Ctx): Figure {
  const gap = 6, x = box.x + inset, w = box.x + box.w - x, bh = (box.h - gap * (n - 1)) / n;
  const bands = Array.from({ length: n }, (_, i) => ({ x, y: box.y + i * (bh + gap), w, h: bh }));
  const g = Math.min(bh * 0.5, 16);
  const glyphs = bands.map((b, i) => {
    const gx = b.x + 12, cy = b.y + b.h / 2, top = cy - g / 2;
    switch (i) {
      case 0: return <rect key={i} x={gx} y={top} width={g} height={g} />;
      case 1: return <path key={i} d={[0.45, 0.35, 0.25].map((k, j) => `M${gx} ${top + (j * g) / 2}h${b.w * k}`).join('')} />;
      case 2: return (
        <g key={i}>
          <path d={`M${gx} ${top + g}V${top + g * 0.45}Q${gx} ${top} ${gx + g * 0.45} ${top}H${gx + g}`} />
          <rect x={gx + g * 1.9} y={top + 3} width={g - 3} height={g - 3} />
          <rect className={s.paper} x={gx + g * 1.9 - 3} y={top} width={g - 3} height={g - 3} />
          <path d={`M${gx + g * 3.4} ${top + g}A${g} ${g} 0 0 1 ${gx + g * 5} ${top + g * 0.2}`} />
        </g>
      );
      case 3: return [0.35, 0.6, 0.95].map((k, j) => <rect key={`${i}${j}`} x={gx + j * (g * 1.4)} y={top + g * (1 - k)} width={g} height={g * k} />);
      default: {
        const q = Math.min(g * 0.6, 9);
        return (
          <g key={i}>
            {Array.from({ length: 8 }, (_, k) => <rect key={k} x={gx + k * (q + 3)} y={cy - q / 2} width={q} height={q} />)}
            {tag('p26', gx + 8 * (q + 3) + 6, cy + fs * 0.35, '26')}
          </g>
        );
      }
    }
  });
  const draw = (
    <>
      {bands.map((b, i) => region(`b${i}`, b, [i + 1]))}
      {glyphs}
      {bands.map((b, i) => tag(`n${i}`, b.x + b.w - cw - 6, b.y + b.h / 2 + fs * 0.35, String(i + 1)))}
    </>
  );
  return { draw, anchors: bands.map(left) };
}

function phone({ box, n, fs, spare }: Ctx): Figure {
  const h = box.h + spare, w = (h * 9) / 19.5, x = box.x + (box.w - w) / 2, y = box.y;
  const inset = 5, top = y + 10, bottom = y + h - 10, gap = 3;
  const weights = Array.from({ length: n }, (_, i) => (i === 0 ? 0.7 : i === 1 ? 1.6 : 1));
  const avail = bottom - top - gap * (n - 1), sum = weights.reduce((a, b) => a + b, 0);
  const unit = avail / sum, inside = unit * weights[0] >= fs + 6;
  let cy = top;
  const blocks = weights.map((k) => { const r = { x: x + inset, y: cy, w: w - 2 * inset, h: k * unit }; cy += k * unit + gap; return r; });
  const draw = (
    <>
      <rect data-part="device" x={x} y={y} width={w} height={h} />
      {blocks.map((b, i) => region(`s${i}`, b, [i + 1]))}
      {blocks.map((b, i) => tag(`n${i}`, inside ? b.x + b.w / 2 : x + w + 8, b.y + b.h / 2 + fs * 0.35, String(i + 1), inside ? 'middle' : 'start'))}
    </>
  );
  return { draw, anchors: blocks.map(left) };
}

const RUNTIME_TARGETS = [2, 2, 2, 1, 3];

export function drawFigure(kind: TechFigure, c: Ctx): Figure {
  switch (kind) {
    case 'editor': return editor(c);
    case 'mcp': return flow(c, [['Claude'], ['MCP server'], ['Site']], Array.from({ length: c.n }, () => 1));
    case 'runtime': return flow(c, [['Request'], ['Worker'], ['Render'], ['Static', 'export']], RUNTIME_TARGETS.slice(0, c.n));
    case 'tokens': return tokens(c);
    case 'phone': return phone(c);
  }
}

import type { ReactNode } from 'react';
import type { TechFigure } from '@/content/copy';
import s from './TechSheet.module.css';

export type Box = { x: number; y: number; w: number; h: number };
export type Pt = [number, number];
export type Anchor = { p: Pt; side: 'left' | 'bottom' | 'right' | 'top' };
export type Extent = { left: number; right: number; top: number };
export type Figure = { draw: ReactNode; anchors: Anchor[]; extent: Extent };
type Ctx = { box: Box; n: number; fs: number; cw: number; inset: number; spare: number; lanes: number };

const region = (key: string, r: Box, nums: number[]) => (
  <rect key={key} data-part="region" data-n={nums.join(' ')} x={r.x} y={r.y} width={r.w} height={r.h} />
);
const tag = (key: string, x: number, y: number, label: string, anchor: 'start' | 'middle' | 'end' = 'start') => (
  <text key={key} data-part="region-n" x={x} y={y} textAnchor={anchor}>{label}</text>
);
const below = (r: Box, k: number, of: number): Anchor => ({ p: [r.x + (r.w * (of - k)) / (of + 1), r.y + r.h], side: 'bottom' });
const right = (r: Box, v = 0.5): Anchor => ({ p: [r.x + r.w, r.y + r.h * v], side: 'right' });

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
  const anchors = targets.map((b, i): Anchor => (targets.slice(0, i).some((t) => t < b) ? { p: [boxes[b].x + boxes[b].w / 2, y], side: 'top' } : below(boxes[b], seen[b]++, per[b])));
  const draw = (
    <>
      {boxes.map((r, b) => region(`r${b}`, r, targets.flatMap((t, i) => (t === b ? [i + 1] : []))))}
      <path d={boxes.slice(1).map((r, b) => arrow(boxes[b].x + boxes[b].w, r.x - 2, y + h / 2)).join('')} />
      {boxes.map((r, b) => labels[b].map((line, l) => tag(`t${b}${l}`, r.x + r.w / 2, y + h / 2 + fs * 0.35 + (l - (labels[b].length - 1) / 2) * fs * 1.3, line, 'middle')))}
    </>
  );
  const last = boxes[boxes.length - 1];
  return { draw, anchors, extent: { left: box.x, right: last.x + last.w, top: y } };
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
      {tag('n2', preview.x + preview.w * 0.45, y + h * 0.3 + fs * 0.35, '2', 'middle')}
      {tag('n3', dock.x + dock.w / 2, base(dock), '3', 'middle')}
      {tag('n4', panel.x + panel.w / 2, y + h * 0.8 + fs * 0.35, '4', 'middle')}
      {tag('n5', chat.x + 6, base(chat), '5')}
    </>
  );
  const into = { p: [preview.x + preview.w * 0.88, (bar.y + bar.h + dock.y) / 2] as Pt, side: 'right' as const };
  return { draw, anchors: [right(bar), into, right(dock, 0.6), right(panel, 0.6), below(chat, 0, 1)], extent: { left: x, right: x + w, top: y } };
}

function tokens({ box, n, fs, cw, lanes }: Ctx): Figure {
  const gap = 6, x = box.x, w = box.w - lanes, bh = (box.h - gap * (n - 1)) / n;
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
  return { draw, anchors: bands.map((b) => right(b)), extent: { left: x, right: x + w, top: box.y } };
}

function phone({ box, n, fs, cw, lanes }: Ctx): Figure {
  const h = box.h, w = (h * 9) / 19.5, y = box.y;
  const inset = 5, top = y + 10, bottom = y + h - 10, gap = 3;
  const weights = Array.from({ length: n }, (_, i) => (i === 0 ? 0.7 : i === 1 ? 1.6 : 1));
  const avail = bottom - top - gap * (n - 1), sum = weights.reduce((a, b) => a + b, 0);
  const unit = avail / sum, inside = unit * weights[0] >= fs + 6, tw = inside ? 0 : 8 + 2 * cw;
  const x = box.x + tw + (box.w - lanes - w - tw) / 2;
  let cy = top;
  const blocks = weights.map((k) => { const r = { x: x + inset, y: cy, w: w - 2 * inset, h: k * unit }; cy += k * unit + gap; return r; });
  const draw = (
    <>
      <rect data-part="device" x={x} y={y} width={w} height={h} />
      {blocks.map((b, i) => region(`s${i}`, b, [i + 1]))}
      {blocks.map((b, i) => tag(`n${i}`, inside ? b.x + b.w / 2 : x - 8, b.y + b.h / 2 + fs * 0.35, String(i + 1), inside ? 'middle' : 'end'))}
    </>
  );
  return { draw, anchors: blocks.map((b) => ({ p: [x + w, b.y + b.h / 2] as Pt, side: 'right' as const })), extent: { left: x - tw, right: x + w, top: y } };
}

function column({ box, fs, cw, lanes }: Ctx, labels: string[]): Figure {
  const k = labels.length, gap = Math.max(10, Math.min(18, box.h * 0.06));
  const h = Math.min(fs * 2.4, (box.h - gap * (k - 1)) / k), w = Math.max(...labels.map((l) => l.length)) * cw + 24;
  const x = box.x + (box.w - lanes - w) / 2, cx = x + w / 2;
  let y = box.y + (box.h - k * h - gap * (k - 1)) / 2;
  const boxes = labels.map(() => { const r = { x, y, w, h }; y += h + gap; return r; });
  const down = boxes.slice(1).map((r, b) => { const y1 = boxes[b].y + boxes[b].h, y2 = r.y - 2; return `M${cx} ${y1}V${y2}M${cx - 4} ${y2 - 5}L${cx} ${y2}L${cx + 4} ${y2 - 5}`; }).join('');
  const draw = (
    <>
      {boxes.map((r, b) => region(`c${b}`, r, [b + 1]))}
      <path d={down} />
      {boxes.map((r, b) => tag(`t${b}`, cx, r.y + r.h / 2 + fs * 0.35, labels[b], 'middle'))}
    </>
  );
  return { draw, anchors: boxes.map((r) => right(r)), extent: { left: x, right: x + w, top: boxes[0].y } };
}

const RUNTIME_TARGETS = [2, 2, 2, 1, 3];

export function drawFigure(kind: TechFigure, c: Ctx): Figure {
  switch (kind) {
    case 'editor': return editor(c);
    case 'mcp': return flow(c, [['Claude'], ['MCP server'], ['Site']], Array.from({ length: c.n }, () => 1));
    case 'runtime': return flow(c, [['Request'], ['Worker'], ['Render'], ['Static', 'export']], RUNTIME_TARGETS.slice(0, c.n));
    case 'tokens': return tokens(c);
    case 'phone': return phone(c);
    case 'pipeline': return column(c, ['Claude Code', 'Blender MCP', 'Blender', 'FFmpeg', 'YouTube'].slice(0, c.n));
  }
}

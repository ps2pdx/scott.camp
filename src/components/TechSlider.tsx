import { useCallback, useEffect, useRef, useState } from 'react';
import type { TechSheetData } from '@/content/copy';
import { Label } from './Label';
import { TechSheet } from './TechSheet';
import s from './TechSlider.module.css';

export function TechSlider({ label, sheets }: { label: string; sheets: TechSheetData[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEnds({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }, []);
  useEffect(sync, [sync]);
  const step = (dir: 1 | -1) => {
    const el = track.current;
    const slot = el?.firstElementChild as HTMLElement | null;
    if (!el || !slot) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (slot.offsetWidth + gap), behavior: still ? 'auto' : 'smooth' });
  };
  return (
    <div className={s.slider} data-part="tech-slider">
      <div className={s.bar}>
        <Label>{label}</Label>
        <div className={s.controls}>
          <button type="button" className={`meta ${s.ctl}`} disabled={ends.start} onClick={() => step(-1)}>Prev</button>
          <button type="button" className={`meta ${s.ctl}`} disabled={ends.end} onClick={() => step(1)}>Next</button>
        </div>
      </div>
      <div ref={track} className={s.track} data-part="tech-track" role="region" aria-label={`${label}, scrolls sideways`} tabIndex={0} onScroll={sync}>
        {sheets.map((t) => <div key={t.sheet} className={s.slot}><TechSheet data={t} /></div>)}
      </div>
    </div>
  );
}

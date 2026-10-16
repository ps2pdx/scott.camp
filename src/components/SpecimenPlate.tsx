import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { useStillOnly } from '@/lib/reducedMedia';
import type { SpecimenProps } from '@/lib/specimens/types';
import { AboutBox, type About } from './AboutBox';
import { width } from './Grid';
import s from './SpecimenPlate.module.css';

export type SpecimenLoader = () => Promise<{ default: ComponentType<SpecimenProps> }>;
const cache = new Map<SpecimenLoader, ComponentType<SpecimenProps>>();
const lazyOf = (load: SpecimenLoader) => { if (!cache.has(load)) cache.set(load, lazy(load)); return cache.get(load)!; };

export function SpecimenPlate({ load, label, about, part }: { load: SpecimenLoader; label: string; about: About; part: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const still = useStillOnly();
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const mount = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); mount.disconnect(); } }, { rootMargin: '300px 0px' });
    const view = new IntersectionObserver(([e]) => setSeen(e.isIntersecting));
    mount.observe(el); view.observe(el);
    const vis = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', vis);
    return () => { mount.disconnect(); view.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);
  const Specimen = lazyOf(load);
  const running = near && seen && !hidden;
  return (
    <div className={`${s.wrap} ${width.figure}`} data-part={part}>
      <div className={s.plate}>
        <div ref={ref} className={s.stage} role="img" aria-label={label} data-running={running ? '' : undefined} data-still={still ? '' : undefined}>
          {near ? <Suspense fallback={null}><Specimen running={running} still={still} /></Suspense> : null}
        </div>
      </div>
      <AboutBox about={about} />
    </div>
  );
}

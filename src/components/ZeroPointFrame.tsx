import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import s from './ZeroPointFrame.module.css';

const ZeroPointV1 = lazy(() => import('@/lib/zero-point-v1/ZeroPointV1'));

export function ZeroPointFrame({ caption }: { caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [on]);
  return (
    <figure ref={ref} className={s.fig} data-part="zero-point-frame">
      <div className={s.stage}>{on ? <Suspense fallback={null}><ZeroPointV1 /></Suspense> : null}</div>
      <figcaption className="meta">{caption}</figcaption>
    </figure>
  );
}

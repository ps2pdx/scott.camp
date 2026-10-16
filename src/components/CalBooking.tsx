import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { getTheme, type Theme } from '@/lib/theme';
import f from './ZeroPointFrame.module.css';
import s from './CalBooking.module.css';

const CalInline = lazy(() => import('./CalInline'));

function usePageTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => getTheme());
  useEffect(() => {
    const update = () => setTheme(getTheme());
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia?.('(prefers-color-scheme: light)');
    mq?.addEventListener?.('change', update);
    return () => { mo.disconnect(); mq?.removeEventListener?.('change', update); };
  }, []);
  return theme;
}

export function CalBooking({ slug, calLink, caption }: { slug: string; calLink: string; caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const theme = usePageTheme();
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [on]);
  return (
    <figure ref={ref} className={f.fig} data-part="cal-booking" data-slug={slug}>
      <div className={`${f.plate} ${s.stage}`}>
        {on ? <Suspense fallback={null}><CalInline key={theme} namespace={slug} calLink={calLink} theme={theme} /></Suspense> : null}
      </div>
      <figcaption className="meta">{caption}</figcaption>
    </figure>
  );
}

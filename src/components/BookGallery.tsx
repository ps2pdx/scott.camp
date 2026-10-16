import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { COPY } from '@/content/copy';
import FRAMES_JSON from '@/content/book-frames.json';
import { SIZES, frame } from './Evidence';
import g from './Grid.module.css';
import s from './BookGallery.module.css';

export type BookFrame = { frame: string; ratio: '1:1' | '2:3' | '3:2'; width: number; height: number; date: string };
export const FRAMES = FRAMES_JSON as BookFrame[];
export const ZOOM = 2.5;
export const ZOOM_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
export const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

const book = COPY.designSystem.book;
const cut = (f: BookFrame, px: number) => `/evidence/frames/${f.frame.toLowerCase()}-${px}.webp`;
export const caption = (f: BookFrame) => `${book.name}, ${f.frame}, ${book.camera}, ${f.date}`;
export const framesLine = () => `${FRAMES.length} frames, ${book.framesMeta}`;

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return match;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function BookGallery() {
  const start = Math.max(0, FRAMES.findIndex((f) => f.frame === book.initial));
  const [sel, setSel] = useState(start);
  const [focus, setFocus] = useState(start);
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState<string | null>(FRAMES[start].frame);
  const zoomable = useMedia(ZOOM_QUERY);
  const hoverable = useMedia(HOVER_QUERY);
  const root = useRef<HTMLDivElement>(null);
  const mainImg = useRef<HTMLImageElement>(null);
  const warmed = useRef(new Set<string>());
  const lens = useRef<HTMLSpanElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = FRAMES[sel];
  const alt = book.alts[f.frame] ?? `${book.fallbackAlt}, ${f.frame}`;

  useEffect(() => { if (!zoomable) setHover(false); }, [zoomable]);
  useLayoutEffect(() => {
    const img = mainImg.current;
    if (img?.complete && img.naturalWidth > 0) setReady(f.frame);
  }, [f.frame]);

  function warm(i: number) {
    for (const j of [i - 1, i, i + 1]) {
      const x = FRAMES[j];
      if (!x || warmed.current.has(x.frame)) continue;
      warmed.current.add(x.frame);
      const img = new Image();
      img.decoding = 'async';
      img.src = cut(x, 640);
    }
  }

  function pick(i: number) {
    warm(i);
    setSel(i);
    setFocus(i);
  }

  function peek(e: PointerEvent<HTMLButtonElement>, i: number) {
    if (!hoverable || e.pointerType === 'touch') return;
    pick(i);
  }

  function track(e: PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const r = f.width / f.height;
    const iw = r >= 1 ? box.width : box.height * r;
    const ih = r >= 1 ? box.width / r : box.height;
    const ox = (box.width - iw) / 2, oy = (box.height - ih) / 2;
    const L = lens.current?.offsetWidth ?? 0;
    if (!L || !root.current) return;
    const lx = clamp(e.clientX - box.left - ox - L / 2, 0, Math.max(0, iw - L));
    const ly = clamp(e.clientY - box.top - oy - L / 2, 0, Math.max(0, ih - L));
    const st = root.current.style;
    st.setProperty('--lens-x', `${ox + lx}px`);
    st.setProperty('--lens-y', `${oy + ly}px`);
    st.setProperty('--zoom-x', `${-lx * ZOOM}px`);
    st.setProperty('--zoom-y', `${-ly * ZOOM}px`);
    st.setProperty('--zoom-w', `${iw * ZOOM}px`);
    st.setProperty('--zoom-h', `${ih * ZOOM}px`);
  }

  function move(e: KeyboardEvent<HTMLDivElement>) {
    const n = FRAMES.length;
    const top = thumbs.current[0]?.offsetTop ?? 0;
    const cols = Math.max(1, thumbs.current.filter((b) => b && b.offsetTop === top).length);
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    let next = focus;
    if (e.key in step) next = clamp(focus + step[e.key], 0, n - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    pick(next);
    thumbs.current[next]?.focus();
  }

  return (
    <div ref={root} className={`${g.cols} ${s.gallery}`} data-part="ds-book">
      <figure className={`${g.figure} ${s.main}`} data-part="ds-book-main">
        <div className={`${frame} ${s.mainFrame}`}>
          <div
            className={s.view}
            data-zoom={zoomable ? '' : undefined}
            {...(zoomable ? { onPointerEnter: () => setHover(true), onPointerLeave: () => setHover(false), onPointerMove: track } : {})}
          >
            <img ref={mainImg} key={f.frame} className={s.mainImg} data-loading={ready === f.frame ? undefined : ''} onLoad={() => setReady(f.frame)} data-ratio={f.ratio} src={cut(f, 1280)} srcSet={`${cut(f, 640)} 640w, ${cut(f, 1280)} 1280w`} sizes={SIZES.figure} width={f.width} height={f.height} alt={alt} loading="lazy" decoding="async" />
            {ready === f.frame ? null : <img className={s.placeholder} src={cut(f, 192)} data-ratio="1:1" width={192} height={192} alt={alt} aria-hidden="true" loading="lazy" decoding="async" data-part="ds-book-placeholder" />}
            {zoomable && hover ? <span ref={lens} className={s.lens} data-part="ds-book-lens" aria-hidden="true" /> : null}
          </div>
        </div>
        <figcaption className="meta" aria-live="polite">{caption(f)}</figcaption>
      </figure>
      {zoomable && hover ? (
        <div className={`${frame} ${s.zoom}`} data-part="ds-book-zoom" aria-hidden="true">
          <div className={s.zoomView}><img className={s.zoomImg} src={cut(f, 1280)} width={f.width} height={f.height} alt="" decoding="async" /></div>
        </div>
      ) : null}
      <div className={`${g.figure} ${s.sheet}`}>
        <div className={`${frame} ${s.clumpTile}`}>
          <div className={s.clump} role="group" aria-label={`${book.name} frames`} data-part="ds-contact-sheet" onKeyDown={move}>
            {FRAMES.map((x, i) => (
              <button
                key={x.frame}
                ref={(b) => { thumbs.current[i] = b; }}
                type="button"
                className={s.thumb}
                tabIndex={i === focus ? 0 : -1}
                aria-pressed={i === sel}
                data-frame={x.frame}
                onClick={() => pick(i)}
                onPointerEnter={(e) => peek(e, i)}
                onFocus={() => setFocus(i)}
              >
                <img src={cut(x, 96)} srcSet={`${cut(x, 96)} 1x, ${cut(x, 192)} 2x`} data-ratio="1:1" width={96} height={96} alt={x.frame} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
        <p className="meta">{framesLine()}</p>
      </div>
    </div>
  );
}

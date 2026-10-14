import { render, screen } from '@testing-library/react';
import { readdirSync, statSync } from 'node:fs';
import { EvidenceVideo } from '@/components/EvidenceVideo';
import { App } from '@/App';
import { COPY } from '@/content/copy';

const clip = COPY.terpscout.evidence.spin;
const stubMatchMedia = (matches: boolean) => {
  window.matchMedia = ((query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
};

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });
afterEach(() => { delete (window as any).matchMedia; });

it('the spin is a muted, looping, inline video with a poster and no preload', () => {
  stubMatchMedia(false);
  const { container } = render(<EvidenceVideo clip={clip} />);
  const v = container.querySelector('video')!;
  expect(v).not.toBeNull();
  expect(v.getAttribute('poster')).toBe(clip.poster);
  expect(v.muted).toBe(true);
  expect(v.loop).toBe(true);
  expect(v.hasAttribute('playsinline')).toBe(true);
  expect(v.getAttribute('preload')).toBe('none');
  expect(v.hasAttribute('controls')).toBe(false);
  expect(v.hasAttribute('autoplay')).toBe(false);
});
it('reduced motion or reduced data renders the still only', () => {
  stubMatchMedia(true);
  const { container } = render(<EvidenceVideo clip={clip} />);
  expect(container.querySelector('video')).toBeNull();
  expect(container.querySelector('img')!.getAttribute('src')).toBe(clip.poster);
  expect(container.querySelector('img')!.getAttribute('alt')).toBe(clip.alt);
});
it('TerpScout carries the spin, two pairs and the mark, each captioned with alt text', () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const block = container.querySelector('#terpscout')!;
  const ev = COPY.terpscout.evidence;
  const caps = [ev.spin, ...ev.pairs.flat(), ev.mark].map((e) => e.caption);
  expect([...block.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual(caps);
  for (const img of block.querySelectorAll('img')) expect(img.getAttribute('alt')!.length).toBeGreaterThan(10);
  expect(block.querySelector('video')!.getAttribute('aria-label')).toBe(ev.spin.alt);
});
it('evidence files keep the budgets', () => {
  let total = 0;
  for (const f of readdirSync('public/evidence')) {
    const size = statSync(`public/evidence/${f}`).size;
    total += size;
    if (f.endsWith('.mp4')) expect(size, f).toBeLessThan(1.5 * 1024 * 1024);
    else if (f === 'terp-scouts-per-image-pricing.webp') expect(size, f).toBeLessThan(160 * 1024);
    else expect(size, f).toBeLessThan(120 * 1024);
  }
  expect(total).toBeLessThan(16 * 1024 * 1024);
});
it('the TerpScout index row spans the studio years', () => {
  expect(COPY.work.index.find((r) => r.no === '04')).toEqual({ no: '04', name: 'TerpScout, dba ScoutCamp', description: 'OLCC-regulated distribution consultancy, then a cannabis photography studio, $5M a year', year: '2019 to 2022', struck: true });
});

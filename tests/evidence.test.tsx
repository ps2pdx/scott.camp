import { fireEvent, render, waitFor } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { EvidenceVideo } from '@/components/EvidenceVideo';
import { App } from '@/App';
import { COPY } from '@/content/copy';

const clip = COPY.terpscout.evidence.gated.spin;
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
const open = async (details: HTMLDetailsElement, how: 'click' | 'key') => {
  const summary = details.querySelector('summary')!;
  if (how === 'click') fireEvent.click(summary);
  else { summary.focus(); fireEvent.keyDown(summary, { key: 'Enter' }); if (!details.open) fireEvent.click(summary); }
  await waitFor(() => expect(details.querySelector('video, img')).not.toBeNull());
};
it('TerpScout shows only the TS mark until the disclosure is opened', () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const block = container.querySelector('#terpscout')!;
  const ev = COPY.terpscout.evidence;
  expect(ev.shown.map((e) => e.src)).toEqual(['/evidence/terpscout-mark.webp']);
  expect([...block.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual(ev.shown.map((e) => e.src));
  expect([...block.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual(ev.shown.map((e) => e.caption));
  expect(block.querySelector('video')).toBeNull();
  const details = block.querySelector('details')!;
  expect(details.open).toBe(false);
  expect(details.parentElement!.lastElementChild).toBe(details);
  const summary = details.querySelector('summary')!;
  expect(summary.textContent).toContain(ev.gated.summary);
  expect(summary.querySelector('[aria-hidden="true"]')!.textContent).toBe('ShowHide');
});
it('the disclosure opens on click and carries the spin, the print and the pricing page', async () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const details = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  await open(details, 'click');
  expect(details.open).toBe(true);
  const g = COPY.terpscout.evidence.gated;
  expect([...details.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual([g.spin, g.reel, ...g.stills].map((e) => e.caption));
  for (const img of details.querySelectorAll('img')) { expect(img.getAttribute('loading')).toBe('lazy'); expect(img.getAttribute('alt')!.length).toBeGreaterThan(10); }
  const v = details.querySelector('video')!;
  expect(v.getAttribute('aria-label')).toBe(g.spin.alt);
  expect(details.querySelectorAll('video')[1].getAttribute('aria-label')).toBe(g.reel.alt);
  expect(v.getAttribute('preload')).toBe('none');
});
it('the disclosure opens from the keyboard: the summary is focusable and Enter toggles it', async () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const details = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  const summary = details.querySelector('summary')!;
  summary.focus();
  expect(document.activeElement).toBe(summary);
  await open(details, 'key');
  expect(details.open).toBe(true);
});
it('the video does not play while the disclosure is closed, and pauses when it closes', async () => {
  stubMatchMedia(false);
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  let fire: ((e: { isIntersecting: boolean }[]) => void) | null = null;
  (globalThis as any).IntersectionObserver = class { constructor(cb: any) { fire = cb; } observe() {} unobserve() {} disconnect() {} };
  const { container } = render(<App />);
  expect(play).not.toHaveBeenCalled();
  const details = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  await open(details, 'click');
  expect(play).not.toHaveBeenCalled();
  fire!([{ isIntersecting: true }]);
  expect(play).toHaveBeenCalledTimes(1);
  details.open = false;
  details.dispatchEvent(new Event('toggle'));
  expect(pause).toHaveBeenCalled();
  play.mockRestore(); pause.mockRestore();
  (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});
it('forced colors also renders the still only', () => {
  window.matchMedia = ((query: string) => ({ matches: query.includes('forced-colors'), media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  const { container } = render(<EvidenceVideo clip={clip} />);
  expect(container.querySelector('video')).toBeNull();
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
  expect(COPY.work.index.find((r) => r.no === '04')).toEqual({ no: '04', name: 'TerpScout, dba ScoutCamp', description: 'OLCC-regulated distribution consultancy, then a cannabis photography studio, $10M', year: '2020 to 2022', struck: true });
});
it('the spin and the print carry their 2022 dates, no bracket left', () => {
  const ev = COPY.terpscout.evidence;
  expect(ev.gated.spin.caption).toBe('Product turntable, TerpScout studio, 2022');
  expect(ev.gated.stills[0].caption).toBe('Strain print, Martian Fruit, for a TerpScout client, 2022');
  for (const e of [ev.gated.spin, ev.gated.reel, ...ev.gated.stills, ...ev.shown]) expect(e.caption).not.toContain('[YEAR]');
});
it('evidence stacks full width, one figure above the next, with no pair wrapper', async () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  for (const id of ['terpscout', 'practice']) {
    const stills = [...container.querySelectorAll(`#${id} img`)].map((i) => i.closest('figure')!);
    for (const f of stills) expect(f.parentElement!.className).toBe('stack');
  }
  const d = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  fireEvent.click(d.querySelector('summary')!);
  await waitFor(() => expect(d.querySelector('img')).not.toBeNull());
  for (const f of d.querySelectorAll('figure')) expect(f.parentElement!.className).toBe('body');
  expect(container.querySelector('.evidence')).toBeNull();
  const css = readFileSync('src/App.module.css', 'utf8');
  expect(css).toMatch(/\.stack\{[^}]*flex-direction:column/);
  expect(css).not.toMatch(/repeat\(2,minmax\(0,1fr\)\);gap:var\(--s-4\);align-items:start/);
});
it('the spin sits in a black figure no wider than 480 px, capped at 52vh, caption beneath', () => {
  const css = readFileSync('src/components/Evidence.module.css', 'utf8');
  expect(css).toMatch(/\.spinStage\{background:#000;/);
  expect(css).toMatch(/\.spinMedia\{[^}]*max-height:52vh/);
  expect(css).toMatch(/@media \(min-width:640px\)\{\.spin\{max-width:480px\}\}/);
  expect(css).not.toMatch(/70vh/);
});
it('the TS mark sits on a white square tile: 120 px on desktop, 96 px on phones, left-aligned, no radius, no shadow', () => {
  const css = readFileSync('src/components/Evidence.module.css', 'utf8');
  expect(css).toContain('.mark img{width:120px;height:120px;padding:12px;background:#fff;object-fit:contain}');
  expect(css).toContain('@media (max-width:639px){.mark img{width:96px;height:96px;padding:10px}}');
  expect(css).toContain('.mark{align-items:flex-start}');
  expect(css).not.toMatch(/border-radius|box-shadow/);
  expect(COPY.terpscout.evidence.shown).toEqual([expect.objectContaining({ src: '/evidence/terpscout-mark.webp', caption: 'TerpScout mark', mark: true })]);
});
it('the disclosure holds the spin, the rosin reel at full frame, the Martian Fruit print and the Per Image Pricing page, nothing else', async () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const details = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  await open(details, 'click');
  expect([...details.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual(['Product turntable, TerpScout studio, 2022', 'Rosin press reel, slow motion, 2024', 'Strain print, Martian Fruit, for a TerpScout client, 2022', 'Per image pricing, Terp-Scouts cannabis photography, summer 2022']);
  expect(container.innerHTML).not.toMatch(/trap-fuel|martian-fruit-detail/);
  expect(details.querySelector(`video[poster="${COPY.terpscout.evidence.gated.reel.poster}"]`)).not.toBeNull();
});
it('the Nertia block carries the Nertia mark on the same white tile, in the same place as the TS mark', () => {
  stubMatchMedia(false);
  const { container } = render(<App />);
  const fig = container.querySelector('#nertia figure img[src="/evidence/nertia-mark.svg"]')!.closest('figure')!;
  expect(fig.className).toContain('mark');
  expect(fig.parentElement!.className).toBe('stack');
  expect(fig.querySelector('figcaption')!.textContent).toBe('Nertia mark');
  expect(readFileSync('public/evidence/nertia-mark.svg', 'utf8')).toContain('fill="#000000"');
});

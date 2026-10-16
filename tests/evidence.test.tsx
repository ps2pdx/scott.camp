import { fireEvent, render, waitFor } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { EvidenceVideo } from '@/components/EvidenceVideo';
import { COPY } from '@/content/copy';
import { renderBook } from './pages';

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
it('TerpScout shows only its mark at the top until the disclosure is opened', () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  const block = container.querySelector('#terpscout')!;
  const ev = COPY.terpscout.evidence;
  expect([...block.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual(['/evidence/terpscout-mark-72.webp']);
  expect(block.querySelectorAll('figcaption').length).toBe(0);
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
  const { container } = renderBook();
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
  const { container } = renderBook();
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
  const { container } = renderBook();
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
  expect(COPY.work.index.find((r) => r.no === '03')).toEqual({ no: '03', name: 'TerpScout, dba ScoutCamp', description: 'OLCC-regulated distribution consultancy, then a cannabis photography studio, $10M', year: '2020 to 2022', struck: false });
});
it('the spin and the print carry their 2022 dates, no bracket left', () => {
  const ev = COPY.terpscout.evidence;
  expect(ev.gated.spin.caption).toBe('Product turntable, TerpScout studio, 2022');
  expect(ev.gated.stills[0].caption).toBe('Strain print, Martian Fruit, for a TerpScout client, 2022');
  for (const e of [ev.gated.spin, ev.gated.reel, ...ev.gated.stills]) expect(e.caption).not.toContain('[YEAR]');
});
it('evidence stacks full width, one figure above the next, with no pair wrapper', async () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  for (const id of ['terpscout', 'practice']) {
    const stills = [...container.querySelectorAll(`#${id} figure img`)].map((i) => i.closest('figure')!);
    for (const f of stills) expect(f.parentElement!.className).toContain('stack');
  }
  const d = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  fireEvent.click(d.querySelector('summary')!);
  await waitFor(() => expect(d.querySelector('img')).not.toBeNull());
  for (const f of d.querySelectorAll('figure')) expect(f.parentElement!.className).toBe('body');
  expect(container.querySelector('.evidence')).toBeNull();
  const css = readFileSync('src/sections/sections.module.css', 'utf8');
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
it('Vantage, Nertia and TerpScout open with their mark on a white tile beside the running head; Work and Practice carry none', () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  for (const [id, name, src] of [['vantage', 'Vantage Compute', '/evidence/vantage-mark.svg'], ['nertia', 'Nertia', '/evidence/nertia-mark.svg'], ['terpscout', 'TerpScout', '/evidence/terpscout-mark-72.webp']]) {
    const m = container.querySelector(`#${id} [data-part="mark"]`)!;
    const img = m.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(src);
    expect(img.getAttribute('alt')).toBe(name);
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(m.classList.contains('wide')).toBe(id === 'vantage');
    expect(m.previousElementSibling!.textContent).toContain(COPY[id as 'vantage'].runningHead);
    expect(m.compareDocumentPosition(container.querySelector(`#${id} p.text`)!) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  }
  expect(container.querySelector('#work [data-part="mark"], #practice [data-part="mark"]')).toBeNull();
  const css = readFileSync('src/components/Mark.module.css', 'utf8');
  expect(css).toContain('.tile{display:grid;place-items:center;flex:none;width:var(--mark-tile);height:var(--mark-tile);padding:var(--tile-pad);background:var(--tile);border:var(--strike) solid var(--line-strong)}');
  expect(css).toContain('.wide{width:calc(var(--mark-tile) * 2)}');
  expect(css).toContain('.mark{display:block;width:calc(var(--mark-tile) * var(--mark-fill))');
  expect(css).toContain('.wide .mark{width:calc(var(--mark-tile) * 2 * var(--mark-fill))}');
  const tokens = readFileSync('src/styles/tokens.css', 'utf8');
  expect(tokens).toContain('--tile:#ffffff;--tile-pad:12px;--mark-tile:120px;--mark-fill:0.6;');
  expect(tokens).not.toMatch(/--tile:#(?!ffffff)/);
  expect(readFileSync('public/evidence/nertia-mark.svg', 'utf8')).not.toContain('fill="white"');
  expect(css).not.toMatch(/border-radius|box-shadow/);
  expect(readFileSync('public/evidence/vantage-mark.svg', 'utf8')).not.toContain('fill="white"');
});
it('the disclosure holds the spin, the rosin reel at full frame, the Martian Fruit print and the Per Image Pricing page, nothing else', async () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  const details = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  await open(details, 'click');
  expect([...details.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual(['Product turntable, TerpScout studio, 2022', 'Rosin press reel, slow motion, 2024', 'Strain print, Martian Fruit, for a TerpScout client, 2022', 'Per image pricing, Terp-Scouts cannabis photography, summer 2022']);
  expect(container.innerHTML).not.toMatch(/trap-fuel|martian-fruit-detail/);
  expect(details.querySelector(`video[poster="${COPY.terpscout.evidence.gated.reel.poster}"]`)).not.toBeNull();
});

it('every image on the page carries width, height, alt, loading and decoding; rasters carry a 1x and 2x srcset at an allowed ratio', async () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  const d = container.querySelector<HTMLDetailsElement>('#terpscout details')!;
  fireEvent.click(d.querySelector('summary')!);
  await waitFor(() => expect(d.querySelector('img, video')).not.toBeNull());
  const imgs = [...container.querySelectorAll('img')];
  expect(imgs.length).toBeGreaterThan(15);
  const ratios: Record<string, number> = { '3:2': 3 / 2, '2:3': 2 / 3, '1:1': 1, '16:9': 16 / 9 };
  for (const img of imgs) {
    const src = img.getAttribute('src')!;
    for (const a of ['width', 'height', 'alt', 'loading']) expect(img.hasAttribute(a), `${src} ${a}`).toBe(true);
    expect(Number(img.getAttribute('width')), src).toBeGreaterThan(0);
    expect(Number(img.getAttribute('height')), src).toBeGreaterThan(0);
    expect(img.getAttribute('alt')!.length, src).toBeGreaterThan(3);
    expect(img.getAttribute('alt'), src).not.toMatch(/^(image|picture|photo) of/i);
    expect(img.getAttribute('loading'), src).toBe('lazy');
    expect(img.getAttribute('decoding'), src).toBe('async');
    if (src.endsWith('.svg')) continue;
    expect(src.endsWith('.webp'), src).toBe(true);
    expect(img.getAttribute('srcset')!.split(',').length, src).toBeGreaterThanOrEqual(2);
    if (img.closest('[data-part="mark"]')) continue;
    const r = img.getAttribute('data-ratio')!;
    expect(Object.keys(ratios), src).toContain(r);
    expect(Number(img.getAttribute('width')) / Number(img.getAttribute('height')), src).toBeCloseTo(ratios[r], 2);
  }
  const css = readFileSync('src/components/Evidence.module.css', 'utf8');
  expect(css).toContain('.shot{object-fit:cover;object-position:center}');
  for (const r of ['3/2', '2/3', '1/1', '16/9']) expect(css).toContain(`{aspect-ratio:${r}}`);
});
it('no evidence still outside the age gate is over 300 KB, and the series banner is re-cut to 16:9', () => {
  const gated = COPY.terpscout.evidence.gated.stills.map((e) => e.src.replace('/evidence/', '').replace('.webp', ''));
  for (const f of readdirSync('public/evidence').filter((x) => x.endsWith('.webp'))) {
    if (gated.some((g) => f.startsWith(g))) continue;
    expect(statSync(`public/evidence/${f}`).size, f).toBeLessThan(300 * 1024);
  }
  expect(COPY.practice.evidence[1]).toMatchObject({ width: 818, height: 460, ratio: '16:9' });
});
it('figures stack: one column, the caption under its frame, Designed then Built, no margin captions', () => {
  stubMatchMedia(false);
  const { container } = renderBook();
  for (const fig of container.querySelectorAll('figure')) {
    const cap = fig.querySelector(':scope > figcaption');
    if (!cap) continue;
    expect(fig.lastElementChild).toBe(cap);
    expect(cap.className).toBe('meta');
  }
  const pair = container.querySelector('[data-part="ds-figures"]')!;
  expect([...pair.children].map((f) => f.querySelector('figcaption')!.textContent!.split(',')[0])).toEqual(['Designed', 'Built']);
  expect(readFileSync('src/components/DesignStudy.module.css', 'utf8')).toContain('.pair{display:flex;flex-direction:column;gap:var(--r-item)}');
  expect(readFileSync('src/components/Evidence.tsx', 'utf8')).not.toMatch(/span\.note/);
});
it('the head carries a color-scheme meta and the og:image dimensions', () => {
  const html = readFileSync('bell/index.html', 'utf8');
  expect(html).toContain('<meta name="color-scheme" content="dark light">');
  expect(html).toContain('<meta property="og:image:width" content="1200">');
  expect(readFileSync('specimen/index.html', 'utf8')).toContain('<meta name="color-scheme" content="dark light">');
});
it('the punch nav spans the text columns, 1 to 7, on desktop', () => {
  const css = readFileSync('src/components/PunchNav.module.css', 'utf8');
  expect(css).toContain('* var(--sp-text) / var(--cols) - var(--col-gap))}.cells{max-width:var(--nav-w)}');
});

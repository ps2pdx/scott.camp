import { act, fireEvent, render } from '@testing-library/react';
import { readdirSync, statSync } from 'node:fs';
import { BookGallery, FRAMES, HOVER_QUERY, ZOOM_QUERY } from '@/components/BookGallery';

function mockMedia(matches: (q: string) => boolean) {
  window.matchMedia = ((q: string) => ({ matches: matches(q), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as any;
}
afterEach(() => { delete (window as any).matchMedia; });

const thumbs = (c: HTMLElement) => [...c.querySelectorAll<HTMLButtonElement>('[data-part="ds-contact-sheet"] button')];
const main = (c: HTMLElement) => c.querySelector<HTMLImageElement>('[data-part="ds-book-main"] img')!;
const cap = (c: HTMLElement) => c.querySelector('[data-part="ds-book-main"] figcaption')!.textContent;

it('renders one thumbnail per manifest frame, 89 frames, cuts on disk and under budget', () => {
  const { container } = render(<BookGallery />);
  expect(FRAMES.length).toBe(89);
  expect(thumbs(container)).toHaveLength(FRAMES.length);
  let total = 0;
  for (const f of FRAMES) {
    const b = `public/evidence/frames/${f.frame.toLowerCase()}`;
    for (const px of [96, 192]) { const n = statSync(`${b}-${px}.webp`).size; expect(n, `${f.frame} ${px}`).toBeLessThan(6 * 1024); if (px === 96) total += n; }
    for (const px of [640, 1280]) expect(statSync(`${b}-${px}.webp`).size, `${f.frame} ${px}`).toBeLessThan(120 * 1024);
    expect(['1:1', '2:3', '3:2']).toContain(f.ratio);
  }
  expect(total).toBeLessThan(500 * 1024);
  expect(readdirSync('public/evidence/frames')).toHaveLength(FRAMES.length * 4);
  for (const t of thumbs(container)) {
    const img = t.querySelector('img')!;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('srcset')).toMatch(/-96\.webp 1x, .*-192\.webp 2x$/);
  }
});

it('clicking a thumbnail swaps the main src and caption; IMG_2975 is selected at rest', () => {
  const { container } = render(<BookGallery />);
  const all = thumbs(container);
  expect(all.filter((t) => t.getAttribute('aria-pressed') === 'true').map((t) => t.dataset.frame)).toEqual(['IMG_2975']);
  const target = all.find((t) => t.dataset.frame === 'IMG_3027')!;
  fireEvent.click(target);
  expect(main(container).getAttribute('src')).toBe('/evidence/frames/img_3027-1280.webp');
  expect(cap(container)).toBe('ICONS, IMG_3027, iPhone, 14 October 2026');
  expect(target.getAttribute('aria-pressed')).toBe('true');
  expect(all.filter((t) => t.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
});

it('thumbnails are a roving tabindex: arrows move focus, Enter selects', () => {
  const { container } = render(<BookGallery />);
  const all = thumbs(container);
  const i = all.findIndex((t) => t.dataset.frame === 'IMG_2975');
  expect(all.filter((t) => t.tabIndex === 0)).toEqual([all[i]]);
  act(() => all[i].focus());
  fireEvent.keyDown(all[i], { key: 'ArrowRight' });
  expect(document.activeElement).toBe(all[i + 1]);
  expect(all[i + 1].tabIndex).toBe(0);
  expect(all[i].tabIndex).toBe(-1);
  fireEvent.keyDown(all[i + 1], { key: 'ArrowLeft' });
  fireEvent.keyDown(all[i], { key: 'ArrowLeft' });
  expect(document.activeElement).toBe(all[i - 1]);
  fireEvent.keyDown(all[i - 1], { key: 'Home' });
  expect(document.activeElement).toBe(all[0]);
  fireEvent.keyDown(all[0], { key: 'Enter' });
  fireEvent.click(all[0]);
  expect(cap(container)).toContain(FRAMES[0].frame);
  expect(all[0].getAttribute('aria-pressed')).toBe('true');
});

it('the zoom lens and panel render only on hover with a fine pointer at desktop width', () => {
  mockMedia((q) => q === ZOOM_QUERY);
  const { container } = render(<BookGallery />);
  const view = main(container).parentElement!;
  expect(container.querySelector('[data-part="ds-book-zoom"]')).toBeNull();
  fireEvent.pointerEnter(view);
  const zoom = container.querySelector('[data-part="ds-book-zoom"]')!;
  expect(zoom).not.toBeNull();
  expect(container.querySelector('[data-part="ds-book-lens"]')).not.toBeNull();
  expect(zoom.querySelector('img')!.getAttribute('src')).toBe('/evidence/frames/img_2975-1280.webp');
  fireEvent.pointerLeave(view);
  expect(container.querySelector('[data-part="ds-book-zoom"]')).toBeNull();
});

it('no zoom on touch or coarse pointers', () => {
  mockMedia(() => false);
  const { container } = render(<BookGallery />);
  fireEvent.pointerEnter(main(container).parentElement!);
  expect(container.querySelector('[data-part="ds-book-zoom"]')).toBeNull();
  expect(container.querySelector('[data-part="ds-book-lens"]')).toBeNull();
});

it('hovering a thumbnail with a fine pointer swaps the main src and caption, and leaving the grid keeps it', () => {
  mockMedia((q) => q === HOVER_QUERY);
  const { container } = render(<BookGallery />);
  const target = thumbs(container).find((t) => t.dataset.frame === 'IMG_3027')!;
  fireEvent.pointerEnter(target);
  expect(main(container).getAttribute('src')).toBe('/evidence/frames/img_3027-1280.webp');
  expect(cap(container)).toBe('ICONS, IMG_3027, iPhone, 14 October 2026');
  expect(target.getAttribute('aria-pressed')).toBe('true');
  expect(container.querySelector('[data-part="ds-book-placeholder"]')!.getAttribute('src')).toBe('/evidence/frames/img_3027-192.webp');
  fireEvent.pointerLeave(target);
  fireEvent.pointerLeave(container.querySelector('[data-part="ds-contact-sheet"]')!);
  expect(main(container).getAttribute('src')).toBe('/evidence/frames/img_3027-1280.webp');
  expect(cap(container)).toBe('ICONS, IMG_3027, iPhone, 14 October 2026');
  fireEvent.load(main(container));
  expect(container.querySelector('[data-part="ds-book-placeholder"]')).toBeNull();
});

it('a coarse pointer does not swap on hover, tap still swaps', () => {
  mockMedia(() => false);
  const { container } = render(<BookGallery />);
  const target = thumbs(container).find((t) => t.dataset.frame === 'IMG_3027')!;
  fireEvent.pointerEnter(target);
  expect(main(container).getAttribute('src')).toBe('/evidence/frames/img_2975-1280.webp');
  expect(cap(container)).toContain('IMG_2975');
  fireEvent.click(target);
  expect(cap(container)).toContain('IMG_3027');
});

it('arrow keys swap the main frame directly', () => {
  const { container } = render(<BookGallery />);
  const all = thumbs(container);
  const i = all.findIndex((t) => t.dataset.frame === 'IMG_2975');
  act(() => all[i].focus());
  fireEvent.keyDown(all[i], { key: 'ArrowRight' });
  expect(all[i + 1].getAttribute('aria-pressed')).toBe('true');
  expect(cap(container)).toContain(FRAMES[i + 1].frame);
});

it('on mount the rail scrolls itself to IMG_2975, never the page', () => {
  const rect = (top: number, h: number) => ({ top, bottom: top + h, left: 0, right: 128, width: 128, height: h, x: 0, y: top, toJSON() {} }) as DOMRect;
  const orig = Element.prototype.getBoundingClientRect;
  const into = vi.fn(), origInto = Element.prototype.scrollIntoView;
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  Element.prototype.scrollIntoView = into;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    if (this.getAttribute('data-part') === 'ds-contact-sheet') return rect(100, 400);
    const f = (this as HTMLElement).dataset?.frame;
    return f ? rect(100 + Math.floor(FRAMES.findIndex((x) => x.frame === f) / 2) * 66, 64) : orig.call(this);
  };
  try {
    const { container } = render(<BookGallery />);
    const rail = container.querySelector<HTMLDivElement>('[data-part="ds-contact-sheet"]')!;
    const i = FRAMES.findIndex((x) => x.frame === 'IMG_2975');
    expect(rail.scrollTop).toBe(100 + Math.floor(i / 2) * 66 + 64 - 500);
    expect(into).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  } finally {
    Element.prototype.getBoundingClientRect = orig;
    Element.prototype.scrollIntoView = origInto;
    scrollTo.mockRestore();
  }
});

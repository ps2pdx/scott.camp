import { act, render } from '@testing-library/react';
import { readFileSync, statSync } from 'node:fs';
import { SpecimenPlate } from '@/components/SpecimenPlate';
import DoubleSlit from '@/lib/specimens/DoubleSlit';
import ButterflyRing from '@/lib/specimens/ButterflyRing';
import type { SpecimenProps } from '@/lib/specimens/types';
import { COPY, SPECIMEN_ABOUT } from '@/content/copy';

type Cb = (e: { isIntersecting: boolean }[]) => void;
let observers: { cb: Cb; opts?: IntersectionObserverInit; on: boolean }[] = [];
const stubMedia = (still: boolean) => { window.matchMedia = ((q: string) => ({ matches: still && !q.includes('max-width') && !q.includes('color-scheme'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia; };

beforeEach(() => {
  observers = [];
  (globalThis as any).IntersectionObserver = class { cb: Cb; constructor(cb: Cb, opts?: IntersectionObserverInit) { this.cb = cb; observers.push({ cb, opts, on: true }); } observe() {} disconnect() { const o = observers.find((x) => x.cb === this.cb); if (o) o.on = false; } };
  (globalThis as any).ResizeObserver = class { observe() {} disconnect() {} };
  stubMedia(false);
});

const seen: SpecimenProps[] = [];
const Probe = (p: SpecimenProps) => { seen.push(p); return <i data-part="probe" />; };
const load = () => Promise.resolve({ default: Probe });
const about = SPECIMEN_ABOUT.butterfly;
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

it('a specimen plate mounts nothing until it is near the viewport, runs only while seen and the tab is visible', async () => {
  seen.length = 0;
  const { container } = render(<SpecimenPlate part="specimen-test" load={load} label="Test" about={about} />);
  expect(container.querySelector('[data-part="probe"]')).toBeNull();
  const [mount, view] = observers;
  expect(mount.opts?.rootMargin).toBe('300px 0px');
  act(() => mount.cb([{ isIntersecting: true }]));
  await flush();
  expect(container.querySelector('[data-part="probe"]')).not.toBeNull();
  expect(seen.at(-1)).toEqual({ running: false, still: false });
  act(() => view.cb([{ isIntersecting: true }]));
  expect(seen.at(-1)).toEqual({ running: true, still: false });
  act(() => view.cb([{ isIntersecting: false }]));
  expect(seen.at(-1)!.running).toBe(false);
  act(() => view.cb([{ isIntersecting: true }]));
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  act(() => { document.dispatchEvent(new Event('visibilitychange')); });
  expect(seen.at(-1)!.running).toBe(false);
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  act(() => { document.dispatchEvent(new Event('visibilitychange')); });
  expect(seen.at(-1)!.running).toBe(true);
  const box = container.querySelector('[data-part="about"]')!;
  expect([...box.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['Canvas', '2026', 'nertia homepage']);
  expect(container.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'Test');
});

it('under reduced motion the plate passes still, and the specimens draw one frame without a loop', async () => {
  stubMedia(true);
  seen.length = 0;
  render(<SpecimenPlate part="specimen-test" load={load} label="Test" about={about} />);
  act(() => { observers[0].cb([{ isIntersecting: true }]); observers[1].cb([{ isIntersecting: true }]); });
  await flush();
  expect(seen.at(-1)).toEqual({ running: true, still: true });
});

describe('the vendored loops', () => {
  const ctx = new Proxy({}, { get: (_, k) => (k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {}), set: () => true });
  let raf: ReturnType<typeof vi.fn>, caf: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = (() => ctx) as any;
    raf = vi.fn(() => 1); caf = vi.fn();
    vi.stubGlobal('requestAnimationFrame', raf); vi.stubGlobal('cancelAnimationFrame', caf);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('the double slit loops only while running, cancels its frame when paused, and never loops when still', () => {
    const { rerender } = render(<DoubleSlit running still={false} />);
    expect(raf).toHaveBeenCalled();
    rerender(<DoubleSlit running={false} still={false} />);
    expect(caf).toHaveBeenCalled();
    raf.mockClear();
    render(<DoubleSlit running still />);
    expect(raf).not.toHaveBeenCalled();
  });
  it('the butterfly ring cancels its frame when paused', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ arrayBuffer: () => Promise.resolve(new Float32Array([1, 0, 0]).buffer) })));
    const { rerender } = render(<ButterflyRing running still={false} />);
    await flush();
    expect(raf).toHaveBeenCalled();
    rerender(<ButterflyRing running={false} still={false} />);
    expect(caf).toHaveBeenCalled();
  });
});

it('the specimens are vendored with their source, use only react, and the Nertia evolution dates them between January and May', () => {
  for (const [f, src] of [['ButterflyRing', '58bd29ab (4fc06b12^)'], ['DoubleSlit', 'abdaf474 (main)']]) {
    const t = readFileSync(`src/lib/specimens/${f}.tsx`, 'utf8');
    expect(t).toContain(`ps2pdx/nertia at ${src}`);
    expect([...t.matchAll(/from '([^']+)'/g)].map((m) => m[1]).filter((m) => !m.startsWith('.') && !m.startsWith('@/'))).toEqual(['react']);
    expect(t).not.toMatch(/window\.addEventListener\('(wheel|mousemove)'/);
  }
  expect(statSync('public/specimens/butterfly-ring-vertices.bin').size).toBe(70000);
  expect(COPY.nertia.evolution.steps.slice(1, 3)).toEqual(['April 2026, the Butterfly Ring: the homepage hero, a particle ring that resolves into a butterfly.', 'May 2026, the double slit: the splash hero, particles from the cursor through two slits.']);
});

import { act, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';

vi.mock('three', () => {
  class V { x = 0; y = 0; z = 0; set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; return this; } copy() { return this; } applyMatrix4() { return this; } project() { return this; } normalize() { return this; } multiplyScalar() { return this; } sub() { return this; } }
  class Obj { rotation = { x: 0, y: 0 }; position = new V(); matrixWorld = {}; children: unknown[] = []; add(o: unknown) { this.children.push(o); } updateMatrixWorld() {} lookAt() {} updateProjectionMatrix() {} }
  class Geo { attributes: Record<string, unknown> = {}; setAttribute(k: string, v: unknown) { this.attributes[k] = v; } dispose() {} }
  class Mat { color = { copy() {} }; opacity = 1; blending = 0; needsUpdate = false; dispose() {} }
  class Renderer { domElement = document.createElement('canvas'); setClearColor() {} setPixelRatio() {} setSize() {} render() {} dispose() {} }
  class Color { setStyle() { return this; } set() { return this; } }
  class Attr { array: Float32Array; needsUpdate = false; constructor(a: Float32Array) { this.array = a; } }
  return { AdditiveBlending: 2, NormalBlending: 1, BufferAttribute: Attr, BufferGeometry: Geo, Color, Group: Obj, Matrix4: class { copy() { return this; } invert() { return this; } }, PerspectiveCamera: Obj, Points: Obj, PointsMaterial: Mat, Scene: Obj, Vector3: V, WebGLRenderer: Renderer };
});
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
const mounted = (c: HTMLElement) => act(() => vi.waitFor(() => { if (!c.querySelector('canvas')) throw new Error('no canvas yet'); }, { timeout: 5000 }));

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
  expect([...box.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['WebGL, three.js', '2026', 'nertia homepage']);
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
  it('the butterfly ring loops only while running, cancels its frame when paused, and never loops when still', async () => {
    const { rerender, container, unmount } = render(<ButterflyRing running still={false} />);
    await mounted(container);
    expect(raf).toHaveBeenCalled();
    rerender(<ButterflyRing running={false} still={false} />);
    expect(caf).toHaveBeenCalled();
    unmount();
    raf.mockClear();
    const still = render(<ButterflyRing running still />);
    await mounted(still.container);
    expect(raf).not.toHaveBeenCalled();
  });
  it('the wheel zooms only after a click into the plate while the pointer is over it, so the page scroll is never captured', async () => {
    const { container } = render(<ButterflyRing running={false} still={false} />);
    await mounted(container);
    const canvas = container.querySelector('canvas')!;
    const wheel = () => { const e = new WheelEvent('wheel', { deltaY: 100, cancelable: true }); canvas.dispatchEvent(e); return e.defaultPrevented; };
    expect(wheel()).toBe(false);
    canvas.dispatchEvent(new Event('pointerdown'));
    canvas.dispatchEvent(new Event('pointerup'));
    expect(wheel()).toBe(true);
    canvas.dispatchEvent(new Event('pointerleave'));
    expect(wheel()).toBe(false);
  });
});

it('the specimens are vendored with their source, the ring on three 0.182.0 with its vertices in a lazy module, and the Nertia evolution dates them between January and May', async () => {
  for (const [f, src, deps] of [['ButterflyRing', '58bd29ab (4fc06b12^)', ['react', 'three']], ['DoubleSlit', 'abdaf474 (main)', ['react']]] as const) {
    const t = readFileSync(`src/lib/specimens/${f}.tsx`, 'utf8');
    expect(t).toContain(`ps2pdx/nertia at ${src}`);
    expect([...t.matchAll(/from '([^']+)'/g)].map((m) => m[1]).filter((m) => !m.startsWith('.') && !m.startsWith('@/'))).toEqual(deps);
    expect(t).not.toMatch(/window\.addEventListener\(/);
  }
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(pkg.dependencies.three).toBe('0.182.0');
  expect(readFileSync('src/lib/specimens/ButterflyRing.tsx', 'utf8')).toContain("await import('./butterfly-ring-vertices')");
  const { VERTICES, VERTEX_COUNT, SCALE } = await import('@/lib/specimens/butterfly-ring-vertices');
  const q = new Int16Array(Uint8Array.from(atob(VERTICES), (c) => c.charCodeAt(0)).buffer);
  expect(VERTEX_COUNT).toBe(19121);
  expect(q.length).toBe(VERTEX_COUNT * 3);
  expect([q[0] * SCALE, q[1] * SCALE, q[2] * SCALE].map((v) => Number(v.toFixed(4)))).toEqual([-0.9474, -0.0883, 0.4153]);
  expect(COPY.nertia.evolution.steps.slice(2, 4)).toEqual(['April 2026, the Butterfly Ring: the homepage hero, a particle ring that resolves into a butterfly.', 'May 2026, the double slit: the splash hero, particles from the cursor through two slits.']);
});

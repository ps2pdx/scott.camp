/*
 * Vendored from ps2pdx/nertia at 58bd29ab (4fc06b12^), src/components/ButterflyRingParticles.tsx,
 * the nertia homepage hero, April 2026. Read-only specimen.
 * Ported from three.js to Canvas 2D so the site ships no 3D library: same mesh (public/specimens/
 * butterfly-ring-vertices.bin, the exported Blender vertices quantized to int16, duplicates dropped),
 * camera, rotation inertia, auto-rotation, pointer repulsion and spring-back. Colours come from
 * the --particle token; the wheel zoom is left out so the page scroll is never captured.
 */
import { useEffect, useRef } from 'react';
import { getTheme } from '@/lib/theme';
import type { SpecimenProps } from './types';
import s from './specimens.module.css';

const config = { scale: 8, rotationSpeed: 0.0003, mouseStrength: 0.15, returnSpeed: 0.04, size: 0.08, glow: 0.18 };
const FOV = (50 * Math.PI) / 180;
const EYE = [0, 6, 16] as const;

export default function ButterflyRing({ running, still }: SpecimenProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ frame: () => void; draw: () => void } | null>(null);
  const runRef = useRef({ running, still });
  runRef.current = { running, still };
  const rafRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;
    let dead = false;
    const mouse = { x: 10, y: 10 };
    const drag = { isDragging: false, lastX: 0, lastY: 0, rotationX: Math.PI - Math.PI / 6, rotationY: Math.PI, velocityX: 0, velocityY: 0 };
    let W = 0, H = 0, dpr = 1;
    let positions = new Float32Array(0), original = new Float32Array(0), velocities = new Float32Array(0), count = 0;
    let colour = '#2bf52b', dark = true;

    const f = [-EYE[0], -EYE[1], -EYE[2]]; const fl = Math.hypot(f[0], f[1], f[2]); f[0] /= fl; f[1] /= fl; f[2] /= fl;
    const r = [-f[2], 0, f[0]]; const rl = Math.hypot(r[0], r[1], r[2]); r[0] /= rl; r[1] /= rl; r[2] /= rl;
    const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    const tanHalf = Math.tan(FOV / 2);

    const readColour = () => { colour = getComputedStyle(wrap).getPropertyValue('--particle').trim() || colour; dark = getTheme() === 'dark'; };
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width; H = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let px = new Float32Array(0), py = new Float32Array(0), pz = new Float32Array(0);
    const project = (cx: number, cy: number, cz: number, sa: number, ca: number, sb: number, cb: number, i: number) => {
      const x1 = cx * cb + cz * sb, z1 = -cx * sb + cz * cb;
      const y2 = cy * ca - z1 * sa, z2 = cy * sa + z1 * ca;
      const dx = x1 - EYE[0], dy = y2 - EYE[1], dz = z2 - EYE[2];
      const xc = dx * r[0] + dy * r[1] + dz * r[2], yc = dx * u[0] + dy * u[1] + dz * u[2], zc = dx * f[0] + dy * f[1] + dz * f[2];
      pz[i] = zc;
      px[i] = xc / (zc * tanHalf * (W / H));
      py[i] = yc / (zc * tanHalf);
    };

    const step = () => {
      if (!drag.isDragging) {
        drag.rotationX += drag.velocityX; drag.rotationY += drag.velocityY;
        drag.velocityX *= 0.95; drag.velocityY *= 0.95;
        if (Math.abs(drag.velocityY) < 0.0001) drag.rotationY += config.rotationSpeed;
      }
      const sa = Math.sin(drag.rotationX), ca = Math.cos(drag.rotationX), sb = Math.sin(drag.rotationY), cb = Math.cos(drag.rotationY);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        project(positions[i3], positions[i3 + 1], positions[i3 + 2], sa, ca, sb, cb, i);
        const dx = px[i] - mouse.x, dy = py[i] - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (!drag.isDragging && dist < 0.3 && dist > 0.001) {
          const force = (1 - dist / 0.3) * config.mouseStrength;
          const wx = (dx / dist) * force * 0.02, wy = (dy / dist) * force * 0.02;
          velocities[i3] += wx * cb + wy * sa * sb;
          velocities[i3 + 1] += wy * ca;
          velocities[i3 + 2] += wx * sb - wy * sa * cb + (Math.random() - 0.5) * force * 0.01;
        }
        positions[i3] += velocities[i3]; positions[i3 + 1] += velocities[i3 + 1]; positions[i3 + 2] += velocities[i3 + 2];
        positions[i3] += (original[i3] - positions[i3]) * config.returnSpeed;
        positions[i3 + 1] += (original[i3 + 1] - positions[i3 + 1]) * config.returnSpeed;
        positions[i3 + 2] += (original[i3 + 2] - positions[i3 + 2]) * config.returnSpeed;
        velocities[i3] *= 0.94; velocities[i3 + 1] *= 0.94; velocities[i3 + 2] *= 0.94;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      ctx.fillStyle = colour;
      for (const [size, alpha] of [[config.glow, dark ? 0.1 : 0.05], [config.size, dark ? 0.85 : 0.95]] as const) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          if (pz[i] <= 0.1) continue;
          const d = Math.max(0.6, (size * H) / 2 / pz[i]);
          ctx.rect((px[i] + 1) * 0.5 * W - d / 2, (1 - py[i]) * 0.5 * H - d / 2, d, d);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    };

    const frame = () => {
      if (dead) return;
      step(); draw();
      if (runRef.current.running && !runRef.current.still) rafRef.current = requestAnimationFrame(frame);
      else rafRef.current = 0;
    };
    stateRef.current = { frame, draw: () => { step(); draw(); } };

    const ndc = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); mouse.x = ((e.clientX - b.left) / b.width) * 2 - 1; mouse.y = -((e.clientY - b.top) / b.height) * 2 + 1; };
    const onMove = (e: PointerEvent) => {
      ndc(e);
      if (drag.isDragging) {
        const deltaX = e.clientX - drag.lastX, deltaY = e.clientY - drag.lastY;
        drag.rotationY -= deltaX * 0.005; drag.rotationX += deltaY * 0.005;
        drag.velocityY = -deltaX * 0.005; drag.velocityX = deltaY * 0.005;
        drag.lastX = e.clientX; drag.lastY = e.clientY;
      }
    };
    const onDown = (e: PointerEvent) => { drag.isDragging = true; drag.lastX = e.clientX; drag.lastY = e.clientY; canvas.setPointerCapture?.(e.pointerId); };
    const onUp = (e: PointerEvent) => { drag.isDragging = false; canvas.releasePointerCapture?.(e.pointerId); };
    const onLeave = () => { if (!drag.isDragging) { mouse.x = 10; mouse.y = 10; } };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    const onTheme = () => { readColour(); if (!rafRef.current) draw(); };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const ro = new ResizeObserver(() => { resize(); if (!rafRef.current && count) draw(); });
    ro.observe(wrap);

    readColour(); resize();
    fetch('/specimens/butterfly-ring-vertices.bin').then((res) => res.arrayBuffer()).then((buf) => {
      if (dead) return;
      const k = (new DataView(buf).getFloat32(0, true) / 32767) * config.scale;
      const q = new Int16Array(buf, 4);
      count = q.length / 3;
      positions = new Float32Array(q.length); for (let i = 0; i < q.length; i++) positions[i] = q[i] * k;
      original = new Float32Array(positions); velocities = new Float32Array(q.length);
      px = new Float32Array(count); py = new Float32Array(count); pz = new Float32Array(count);
      if (runRef.current.running && !runRef.current.still) frame(); else { step(); draw(); }
    }).catch(() => {});

    return () => {
      dead = true; cancelAnimationFrame(rafRef.current); rafRef.current = 0;
      mo.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const st = stateRef.current;
    if (!st) return;
    if (running && !still) { if (!rafRef.current) rafRef.current = requestAnimationFrame(st.frame); }
    else if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, [running, still]);

  return <div ref={wrapRef} data-part="butterfly-ring" className={s.fill}><canvas ref={canvasRef} className={s.canvas} aria-hidden="true" /></div>;
}

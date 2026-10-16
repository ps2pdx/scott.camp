/*
 * Vendored from ps2pdx/nertia at abdaf474 (main), src/components/DoubleSlitField.tsx, last changed in
 * 4533cf57 (6 May 2026), the nertia splash hero. Read-only specimen; behaviour kept.
 * Changes for this site: it fills its plate instead of reading the homepage's .home-hero and .home-fork
 * (slit line at 55 percent, floor at the bottom); pointer events on the plate replace window mouse
 * events; colours come from --particle, --particle-wall and --bg on the plate; the loop runs only while
 * `running` (near the viewport, tab visible) and draws one still frame when `still`.
 */
import { useEffect, useRef } from 'react';
import type { SpecimenProps } from './types';
import s from './specimens.module.css';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    life: number;
    decay: number;
    phase: 'fall' | 'through' | 'blocked' | 'settled';
    bucket?: number;
    /** Which CTA the particle entered after passing a slit. */
    side?: 'left' | 'right';
    /** Stable phase offset for swishy lateral oscillation. */
    seed?: number;
};

type Peg = { x: number; y: number; r: number };

const SLIT_W = 36;
// Slits sit at fixed pixel offset from the centerline so they stay close
// together on wide screens (where a percentage-based offset would drift apart).
const SLIT_OFFSET_PX = 32;
const MAX_PARTICLES = 600;
const MOBILE_BREAKPOINT = 768;
const BUCKET_W = 4;
// Each settled particle adds this much to its bucket's pile height.
const PILE_INCREMENT = 1.6;

export default function DoubleSlitField({ running, still }: SpecimenProps) {
    const runRef = useRef({ running, still });
    runRef.current = { running, still };
    const kickRef = useRef<() => void>(() => {});
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const root = wrap;
        const mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

        let accentRgb = readAccentRgb();
        let throughRgb = computeThroughRgb(accentRgb);
        let WALL_RGB = readWallRgb();

        function readAccentRgb() {
            const accent = getComputedStyle(root)
                .getPropertyValue('--particle').trim() || '#2bf52b';
            return hexOrColorToRgb(accent);
        }

        function readWallRgb() {
            return hexOrColorToRgb(getComputedStyle(root).getPropertyValue('--particle-wall').trim() || '#ffffff');
        }

        function computeThroughRgb(rgb: string) {
            // On dark backgrounds, brighten toward white (post-slit "lit" effect).
            // On light backgrounds, darken slightly so particles remain visible.
            const bg = getComputedStyle(root)
                .getPropertyValue('--bg').trim();
            const bgLum = relativeLuminance(hexOrColorToRgb(bg || '#0a0a0a'));
            return bgLum < 0.5 ? brightenRgb(rgb, 0.35) : darkenRgb(rgb, 0.25);
        }

        let W = 0;
        let H = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let lineY = 0;
        let floorY = 0;
        let slit1cx = 0;
        let slit2cx = 0;
        let maxPileHeight = 0;
        const slitHw = SLIT_W / 2;
        let particles: Particle[] = [];
        let heightField = new Float32Array(0);
        let frameCount = 0;
        let raf = 0;
        let mouseX = -9999;
        let mouseY = -9999;
        let mouseInHero = false;
        let isMobile = false;
        let emitterX = 0;
        let emitterY = 0;
        let pegs: Peg[] = [];

        const resize = () => {
            const rect = root.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            lineY = H * 0.55;
            floorY = H;

            // Cap pile height at ~70% of the CTA panel height so piles stay
            // visually bounded and don't reach back up to the slit line.
            maxPileHeight = Math.max(60, (floorY - lineY) * 0.7);

            slit1cx = W / 2 - SLIT_OFFSET_PX;
            slit2cx = W / 2 + SLIT_OFFSET_PX;
            particles = [];
            heightField = new Float32Array(Math.ceil(W / BUCKET_W));

            isMobile = mobileMql.matches;
            if (isMobile) {
                emitterX = W * 0.5;
                emitterY = H * 0.12;
                generatePegs();
            } else {
                pegs = [];
            }
        };

        const generatePegs = () => {
            pegs = [];
            const startY = emitterY + 80;
            const endY = H - 60;
            if (endY <= startY) return;
            const rowSpacing = 90;
            const rows = Math.floor((endY - startY) / rowSpacing);
            const colsPerRow = 4;
            for (let row = 0; row < rows; row++) {
                const y = startY + row * rowSpacing;
                // Alternate row offsets for the classic Plinko interlock.
                const shift = row % 2 === 0 ? 0 : W / (colsPerRow * 2);
                for (let col = 0; col < colsPerRow; col++) {
                    const x = shift + W * (0.18 + col * 0.21);
                    if (x > 12 && x < W - 12) {
                        pegs.push({ x, y, r: 3 });
                    }
                }
            }
        };

        const onMove = (e: PointerEvent) => {
            const rootRect = root.getBoundingClientRect();
            const x = e.clientX - rootRect.left;
            const y = e.clientY - rootRect.top;
            const inside = x >= 0 && x <= W && y >= 0 && y <= lineY;
            mouseX = x;
            mouseY = y;
            mouseInHero = inside;
        };

        const onLeave = () => {
            mouseInHero = false;
        };

        const spawn = (x: number, y: number): Particle => {
            const spread = 0.45;
            const speed = 0.35 + Math.random() * 0.55;
            const angle = Math.PI / 2 + (Math.random() - 0.5) * spread;
            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 0.9 + Math.random() * 1.1,
                life: 1,
                decay: 0.0016 + Math.random() * 0.0025,
                phase: 'fall',
            };
        };

        const inSlit = (x: number) =>
            Math.abs(x - slit1cx) < slitHw || Math.abs(x - slit2cx) < slitHw;

        const updateDesktop = () => {
            if (mouseInHero && mouseY < lineY - 10 && particles.length < MAX_PARTICLES) {
                const n = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < n; i++) {
                    particles.push(
                        spawn(
                            mouseX + (Math.random() - 0.5) * 14,
                            mouseY + (Math.random() - 0.5) * 8,
                        ),
                    );
                }
            }

            // ambient idle drizzle when no mouse engagement
            if (!mouseInHero && frameCount % 8 === 0 && particles.length < 60) {
                particles.push(
                    spawn(W * (0.1 + Math.random() * 0.8), 60 + Math.random() * (lineY - 120)),
                );
            }

            const alive: Particle[] = [];
            for (const p of particles) {
                p.life -= p.decay;
                if (p.life <= 0.01 || p.y > H + 30) {
                    if (p.bucket !== undefined && heightField.length > p.bucket) {
                        heightField[p.bucket] = Math.max(
                            0,
                            heightField[p.bucket] - PILE_INCREMENT,
                        );
                    }
                    continue;
                }

                if (p.phase === 'fall') {
                    p.vy = Math.min(p.vy + 0.012, 2.0);
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y >= lineY) {
                        if (inSlit(p.x)) {
                            p.phase = 'through';
                            p.side = p.x < W / 2 ? 'left' : 'right';
                            p.seed = Math.random() * 1000;
                        } else {
                            p.y = lineY;
                            p.vx = 0;
                            p.vy = 0;
                            p.decay = 0.04;
                            p.phase = 'blocked';
                        }
                    }
                } else if (p.phase === 'through') {
                    // Gravity is biased toward the outer corner of the side
                    // the particle entered: bottom-left for left, bottom-right
                    // for right. The slit row is the only thing keeping each
                    // side in its own panel, so divider clamping is also done
                    // here.
                    const cornerPullX = p.side === 'left' ? -0.026 : 0.026;
                    const cornerPullY = 0.022;
                    p.vx += cornerPullX;
                    p.vy += cornerPullY;

                    if (p.side === 'left') {
                        // SWISHY, gentle sinusoidal lateral oscillation,
                        // light viscosity. Reads as a slow slosh.
                        const seed = p.seed ?? 0;
                        p.vx += Math.sin(frameCount * 0.045 + seed) * 0.035;
                        p.vx *= 0.985;
                        p.vy *= 0.99;
                    } else {
                        // SWASHY, chaotic jitter and heavier drag, like
                        // a turbulent splash.
                        p.vx += (Math.random() - 0.5) * 0.10;
                        p.vy += (Math.random() - 0.5) * 0.06;
                        p.vx *= 0.94;
                        p.vy *= 0.96;
                    }

                    // Velocity caps
                    const maxV = 3.2;
                    p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
                    p.vy = Math.max(-maxV, Math.min(maxV, p.vy));

                    p.x += p.vx;
                    p.y += p.vy;

                    // Keep each side on its panel (center divider barrier).
                    const dividerX = W / 2;
                    if (p.side === 'left' && p.x > dividerX - 3) {
                        p.x = dividerX - 3;
                        p.vx = -Math.abs(p.vx) * 0.4;
                    }
                    if (p.side === 'right' && p.x < dividerX + 3) {
                        p.x = dividerX + 3;
                        p.vx = Math.abs(p.vx) * 0.4;
                    }
                    // And on the outer canvas edges.
                    if (p.x < 2) { p.x = 2; p.vx = Math.abs(p.vx) * 0.3; }
                    if (p.x > W - 2) { p.x = W - 2; p.vx = -Math.abs(p.vx) * 0.3; }

                    // Pile settling, land on top of whatever's at this x.
                    const bucket = Math.max(
                        0,
                        Math.min(heightField.length - 1, Math.floor(p.x / BUCKET_W)),
                    );
                    const pileTopY = floorY - heightField[bucket];
                    if (p.y >= pileTopY) {
                        // Swashy side: chance of splash bounce before settling.
                        if (p.side === 'right' && p.vy > 0.6 && Math.random() < 0.45) {
                            p.y = pileTopY - 1;
                            p.vy = -Math.abs(p.vy) * 0.45;
                            p.vx += (Math.random() - 0.5) * 0.6;
                        } else {
                            p.y = pileTopY;
                            p.vx = 0;
                            p.vy = 0;
                            p.phase = 'settled';
                            p.bucket = bucket;
                            // Slow fade so the pile breathes rather than freezing.
                            p.decay = 0.0008 + Math.random() * 0.0008;
                            if (heightField[bucket] < maxPileHeight) {
                                heightField[bucket] += PILE_INCREMENT;
                            }
                        }
                    }
                }
                // 'blocked' and 'settled' particles hold position and fade.

                alive.push(p);
            }
            particles = alive;
        };

        const drawDesktop = () => {
            ctx.clearRect(0, 0, W, H);

            // Slit line: cyan wall with two gaps
            ctx.save();
            ctx.strokeStyle = `rgb(${WALL_RGB})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = `rgb(${WALL_RGB})`;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(slit1cx - slitHw, lineY);
            ctx.moveTo(slit1cx + slitHw, lineY);
            ctx.lineTo(slit2cx - slitHw, lineY);
            ctx.moveTo(slit2cx + slitHw, lineY);
            ctx.lineTo(W, lineY);
            ctx.stroke();
            ctx.restore();

            // Mouse cursor glow
            if (mouseInHero && mouseY < lineY) {
                const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 24);
                mg.addColorStop(0, `rgba(${accentRgb},0.18)`);
                mg.addColorStop(0.5, `rgba(${accentRgb},0.05)`);
                mg.addColorStop(1, `rgba(${accentRgb},0)`);
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 24, 0, Math.PI * 2);
                ctx.fillStyle = mg;
                ctx.fill();
            }

            // Particles
            for (const p of particles) {
                const a = Math.max(0, p.life);
                const colorRgb =
                    p.phase === 'through' ? throughRgb
                    : p.phase === 'blocked' ? WALL_RGB
                    : accentRgb;
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
                g.addColorStop(0, `rgba(${colorRgb},${a * 0.75})`);
                g.addColorStop(0.45, `rgba(${colorRgb},${a * 0.2})`);
                g.addColorStop(1, `rgba(${colorRgb},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRgb},${a})`;
                ctx.fill();
            }
        };

        const updateMobile = () => {
            // Permanent emitter at the period, no mouse on mobile.
            if (frameCount % 4 === 0 && particles.length < MAX_PARTICLES) {
                const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.55;
                const speed = 0.4 + Math.random() * 0.55;
                particles.push({
                    x: emitterX + (Math.random() - 0.5) * 4,
                    y: emitterY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: 0.9 + Math.random() * 1.0,
                    life: 1,
                    decay: 0.0009 + Math.random() * 0.001,
                    phase: 'fall',
                });
            }

            const alive: Particle[] = [];
            for (const p of particles) {
                p.life -= p.decay;
                if (p.life <= 0.01 || p.y > H + 30) continue;

                // Gravity + tiny lateral drift
                p.vy = Math.min(p.vy + 0.04, 4);
                p.vx *= 0.992;
                p.x += p.vx;
                p.y += p.vy;

                // Peg collisions, Plinko bounces
                for (const peg of pegs) {
                    const dx = p.x - peg.x;
                    const dy = p.y - peg.y;
                    const minDist = peg.r + p.r + 1;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < minDist * minDist) {
                        const dist = Math.sqrt(distSq) || 0.0001;
                        const nx = dx / dist;
                        const ny = dy / dist;
                        // Push particle out of peg
                        p.x = peg.x + nx * minDist;
                        p.y = peg.y + ny * minDist;
                        // Reflect velocity along the contact normal
                        const dot = p.vx * nx + p.vy * ny;
                        const bounciness = 0.65;
                        p.vx -= (1 + bounciness) * dot * nx;
                        p.vy -= (1 + bounciness) * dot * ny;
                        // Plinko randomness so columns don't channel
                        p.vx += (Math.random() - 0.5) * 0.7;
                    }
                }

                // Edge bounces
                if (p.x < 4) { p.x = 4; p.vx = Math.abs(p.vx) * 0.6; }
                if (p.x > W - 4) { p.x = W - 4; p.vx = -Math.abs(p.vx) * 0.6; }

                alive.push(p);
            }
            particles = alive;
        };

        const drawMobile = () => {
            ctx.clearRect(0, 0, W, H);

            // Pegs (faint cyan dots, same family as the desktop wall)
            for (const peg of pegs) {
                ctx.beginPath();
                ctx.arc(peg.x, peg.y, peg.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${WALL_RGB}, 0.45)`;
                ctx.fill();
            }

            // Emitter glow at the period
            const eg = ctx.createRadialGradient(emitterX, emitterY, 0, emitterX, emitterY, 18);
            eg.addColorStop(0, `rgba(${accentRgb}, 0.3)`);
            eg.addColorStop(0.5, `rgba(${accentRgb}, 0.08)`);
            eg.addColorStop(1, `rgba(${accentRgb}, 0)`);
            ctx.beginPath();
            ctx.arc(emitterX, emitterY, 18, 0, Math.PI * 2);
            ctx.fillStyle = eg;
            ctx.fill();

            // Particles
            for (const p of particles) {
                const a = Math.max(0, p.life);
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
                g.addColorStop(0, `rgba(${accentRgb}, ${a * 0.75})`);
                g.addColorStop(0.45, `rgba(${accentRgb}, ${a * 0.2})`);
                g.addColorStop(1, `rgba(${accentRgb}, 0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${accentRgb}, ${a})`;
                ctx.fill();
            }
        };

        const update = () => (isMobile ? updateMobile() : updateDesktop());
        const draw = () => (isMobile ? drawMobile() : drawDesktop());

        const drawStaticLine = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.strokeStyle = `rgb(${WALL_RGB})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = `rgb(${WALL_RGB})`;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(slit1cx - slitHw, lineY);
            ctx.moveTo(slit1cx + slitHw, lineY);
            ctx.lineTo(slit2cx - slitHw, lineY);
            ctx.moveTo(slit2cx + slitHw, lineY);
            ctx.lineTo(W, lineY);
            ctx.stroke();
            ctx.restore();
        };

        const loop = () => {
            frameCount++;
            update();
            draw();
            raf = runRef.current.running && !runRef.current.still ? requestAnimationFrame(loop) : 0;
        };
        kickRef.current = () => {
            if (runRef.current.still) return;
            if (runRef.current.running) { if (!raf) raf = requestAnimationFrame(loop); }
            else if (raf) { cancelAnimationFrame(raf); raf = 0; }
        };

        const stopAnimation = () => {
            if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
            particles = [];
        };

        const refreshMode = () => {
            stopAnimation();
            resize();
            canvas.style.display = 'block';
            if (runRef.current.still) {
                // Honor prefers-reduced-motion: draw the slit line as a static
                // graphic on desktop, blank on mobile (no Plinko cascade).
                if (!isMobile) drawStaticLine();
                else ctx.clearRect(0, 0, W, H);
                return;
            }
            if (runRef.current.running) loop();
            else draw();
        };

        const refreshAccent = () => {
            accentRgb = readAccentRgb();
            throughRgb = computeThroughRgb(accentRgb);
            WALL_RGB = readWallRgb();
            if (runRef.current.still) drawStaticLine();
        };

        const ro = new ResizeObserver(refreshMode);
        ro.observe(root);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);

        // Theme change reactivity: re-read --accent when html[data-theme]
        // toggles, or when prefers-color-scheme flips.
        const themeObserver = new MutationObserver(refreshAccent);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        const colorSchemeMql = window.matchMedia('(prefers-color-scheme: dark)');
        const onSchemeChange = () => refreshAccent();
        colorSchemeMql.addEventListener('change', onSchemeChange);

        const onMobileChange = () => refreshMode();
        mobileMql.addEventListener('change', onMobileChange);

        refreshMode();

        return () => {
            stopAnimation();
            ro.disconnect();
            themeObserver.disconnect();
            colorSchemeMql.removeEventListener('change', onSchemeChange);
            mobileMql.removeEventListener('change', onMobileChange);
            root.removeEventListener('pointermove', onMove);
            root.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    useEffect(() => { kickRef.current(); }, [running, still]);

    return (
        <div ref={wrapRef} className={s.fill} data-part="double-slit" aria-hidden>
            <canvas ref={canvasRef} className={s.canvas} />
        </div>
    );
}

function brightenRgb(rgb: string, amount: number): string {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return rgb;
    const lift = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n + (255 - n) * amount)));
    return `${lift(parts[0])},${lift(parts[1])},${lift(parts[2])}`;
}

function darkenRgb(rgb: string, amount: number): string {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return rgb;
    const drop = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n * (1 - amount))));
    return `${drop(parts[0])},${drop(parts[1])},${drop(parts[2])}`;
}

function relativeLuminance(rgb: string): number {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return 0;
    const [r, g, b] = parts.map((n) => {
        const c = n / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexOrColorToRgb(input: string): string {
    const trimmed = input.trim();
    if (trimmed.startsWith('#')) {
        const hex = trimmed.slice(1);
        const full = hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        if ([r, g, b].every((n) => Number.isFinite(n))) return `${r},${g},${b}`;
    }
    const m = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (m) {
        const parts = m[1].split(',').slice(0, 3).map((s) => s.trim());
        return parts.join(',');
    }
    return '34,197,94';
}

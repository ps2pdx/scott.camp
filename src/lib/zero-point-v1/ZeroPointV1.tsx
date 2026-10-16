import { useEffect, useRef, useState } from 'react';
import './zero-point-v1.css';

export default function ZeroPointV1() {
    const frameRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(true);

    // collapse the sidebar by default on small screens; respect persisted choice otherwise
    useEffect(() => {
        try {
            const saved = localStorage.getItem('n.ds.menu');
            if (saved === 'true' || saved === 'false') {
                setMenuOpen(saved === 'true');
                return;
            }
        } catch {}
        if ((frameRef.current?.clientWidth ?? 1024) < 768) {
            setMenuOpen(false);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen((v) => {
            const next = !v;
            try { localStorage.setItem('n.ds.menu', String(next)); } catch {}
            return next;
        });
    };

    useEffect(() => {
        const root = frameRef.current!;
        const scroller = scrollRef.current!;
        const byId = (id: string) => root.querySelector<HTMLElement>('#' + id);

        /* ---------- THEME TOGGLE ---------- */
        const tt = byId('themeToggle');
        const STORE = 'n.ds.theme';
        function applyTheme(mode: string) {
            if (mode === 'auto') root.removeAttribute('data-theme');
            else root.setAttribute('data-theme', mode);
            tt?.querySelectorAll<HTMLElement>('.theme-toggle__seg').forEach((s) => {
                s.dataset.active = s.dataset.mode === mode ? 'true' : 'false';
            });
            try { localStorage.setItem(STORE, mode); } catch {}
        }
        let saved = 'auto';
        try { saved = localStorage.getItem(STORE) || 'auto'; } catch {}
        applyTheme(saved);
        const themeHandler = (e: Event) => {
            const seg = (e.target as HTMLElement).closest<HTMLElement>('.theme-toggle__seg');
            if (!seg || !seg.dataset.mode) return;
            applyTheme(seg.dataset.mode);
        };
        tt?.addEventListener('click', themeHandler);

        /* ---------- TOKEN GROUPS ---------- */
        const TOKEN_GROUPS = [
            { name: 'INK',      kind: 'color',  vars: ['--ink-1000','--ink-900','--ink-800','--ink-700','--ink-600','--ink-500','--ink-400','--ink-300','--ink-200','--ink-100'] },
            { name: 'PAPER',    kind: 'color',  vars: ['--paper-1000','--paper-900','--paper-800','--paper-700','--paper-600'] },
            { name: 'SIGNAL',   kind: 'color',  vars: ['--signal-red','--signal-red-2','--signal-amber','--signal-green','--signal-blue','--signal-violet'] },
            { name: 'SEMANTIC', kind: 'mixed',  vars: ['--bg','--surface','--surface-2','--line','--line-soft','--fg','--fg-muted','--fg-quiet','--accent'] },
            { name: 'TYPE',     kind: 'font',   vars: ['--f-display','--f-body','--f-mono'] },
            { name: 'SPACING',  kind: 'size',   vars: ['--s-0','--s-1','--s-2','--s-3','--s-4','--s-6','--s-8','--s-12','--s-16','--s-24','--s-32'] },
            { name: 'RADIUS',   kind: 'size',   vars: ['--r-0','--r-1','--r-2'] },
            { name: 'STROKE',   kind: 'size',   vars: ['--w-hair','--w-struct','--w-loud'] },
            { name: 'MOTION',   kind: 'motion', vars: ['--e-linear','--e-out','--e-in-out','--d-1','--d-2','--d-3','--d-4'] },
        ];
        function tokenKind(v: string) {
            if (v.startsWith('--f-')) return 'font';
            if (v.startsWith('--d-')) return 'duration';
            if (v.startsWith('--e-')) return 'easing';
            if (v.startsWith('--s-') || v.startsWith('--r-') || v.startsWith('--w-')) return 'size';
            return 'color';
        }

        /* ---------- OVERRIDES ---------- */
        const STORE_OVR = 'n.ds.overrides';
        let overrides: Record<string, string> = {};
        try { overrides = JSON.parse(localStorage.getItem(STORE_OVR) || '{}'); } catch { overrides = {}; }
        function applyOverrides() {
            Object.entries(overrides).forEach(([k, v]) => root.style.setProperty(k, v));
        }
        function persistOverrides() {
            try { localStorage.setItem(STORE_OVR, JSON.stringify(overrides)); } catch {}
            updateEditedCount();
        }
        function updateEditedCount() {
            const n = Object.keys(overrides).length;
            const el = byId('tokenEditedCount');
            if (el) el.textContent = n ? `${n} EDITED` : 'DEFAULTS';
            const reset = byId('tokenReset') as HTMLButtonElement | null;
            if (reset) reset.disabled = !n;
        }
        applyOverrides();

        function isColor(val: string) { return /^(#|rgb|hsl|oklch|oklab|color\()/.test(val.trim()); }
        function readVar(name: string) {
            if (overrides[name] != null) return overrides[name];
            return getComputedStyle(root).getPropertyValue(name).trim();
        }
        function setVar(name: string, val: string) {
            overrides[name] = val;
            root.style.setProperty(name, val);
            persistOverrides();
            refreshRow(name);
            refreshLabels();
        }
        function clearVar(name: string) {
            delete overrides[name];
            root.style.removeProperty(name);
            persistOverrides();
            refreshRow(name);
            refreshLabels();
        }
        function refreshRow(name: string) {
            const row = root.querySelector<HTMLElement>(`.tk-row[data-var="${name}"]`);
            if (!row) return;
            const val = readVar(name);
            row.dataset.val = val;
            row.dataset.search = (name + ' ' + val).toLowerCase();
            row.dataset.edited = overrides[name] != null ? 'true' : 'false';
            const sw = row.querySelector<HTMLElement>('.tk-swatch');
            if (sw) {
                if (isColor(val)) { sw.className = 'tk-swatch'; sw.style.background = val; }
                else { sw.className = 'tk-swatch tk-swatch--empty'; sw.style.background = ''; }
            }
            const valEl = row.querySelector<HTMLElement>('.tk-val'); if (valEl) valEl.textContent = val;
        }

        function buildTokens() {
            const body = byId('tokenBody');
            if (!body) return;
            body.innerHTML = '';
            TOKEN_GROUPS.forEach((group) => {
                const sec = document.createElement('div');
                sec.className = 'tk-group';
                sec.dataset.group = group.name;
                sec.innerHTML = `<div class="tk-group__head"><span class="t-eyebrow fg-quiet">${group.name}</span><span class="t-mono fg-quiet">${group.vars.length}</span></div>`;
                const list = document.createElement('div');
                list.className = 'tk-list';
                group.vars.forEach((v) => {
                    const val = readVar(v);
                    const row = document.createElement('div');
                    row.className = 'tk-row';
                    row.dataset.var = v;
                    row.dataset.val = val;
                    row.dataset.search = (v + ' ' + val).toLowerCase();
                    row.dataset.edited = overrides[v] != null ? 'true' : 'false';
                    const swatch = isColor(val)
                        ? `<span class="tk-swatch" style="background:${val}"></span>`
                        : `<span class="tk-swatch tk-swatch--empty"></span>`;
                    row.innerHTML = `
                        ${swatch}
                        <span class="tk-key">${v}</span>
                        <span class="tk-val">${val}</span>
                        <button class="tk-act" data-act="edit" title="Edit">&#10000;</button>
                        <button class="tk-act" data-act="copy" title="Copy var()">&#9133;</button>
                        <button class="tk-act tk-act--reset" data-act="reset" title="Reset">&#8634;</button>
                    `;
                    row.addEventListener('click', (e) => {
                        const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
                        if (act === 'copy') return copyToken(v, readVar(v), row);
                        if (act === 'reset') return clearVar(v);
                        openEditor(v, row);
                    });
                    list.appendChild(row);
                });
                sec.appendChild(list);
                body.appendChild(sec);
            });
            updateEditedCount();
        }

        function copyToken(name: string, val: string, row: HTMLElement) {
            const text = `var(${name}) /* ${val} */`;
            navigator.clipboard?.writeText(text).then(() => {
                showToast(`COPIED · ${name}`);
                row.dataset.copied = 'true';
                setTimeout(() => { delete row.dataset.copied; }, 900);
            }).catch(() => showToast('COPY FAILED'));
        }

        let activeEditor: HTMLElement | null = null;
        function closeEditor() { if (activeEditor) { activeEditor.remove(); activeEditor = null; } }
        function openEditor(name: string, row: HTMLElement) {
            closeEditor();
            const kind = tokenKind(name);
            const val = readVar(name);
            const ed = document.createElement('div');
            ed.className = 'tk-editor';
            ed.innerHTML = renderEditor(kind, name, val);
            row.after(ed);
            activeEditor = ed;
            wireEditor(ed, kind, name);
        }

        function renderEditor(kind: string, name: string, val: string) {
            if (kind === 'color') {
                const hex = toHex(val);
                const ok = parseOklch(val);
                return `
                    <div class="tk-editor__head"><span class="t-eyebrow fg-quiet">EDIT &middot; ${name}</span><button class="tk-editor__x" data-act="close">&times;</button></div>
                    <div class="tk-editor__row"><label>HEX</label><input type="color" data-fld="hex" value="${hex}"><input type="text" class="input-ds" data-fld="hexText" value="${hex}"></div>
                    <div class="tk-editor__row"><label>L</label><input type="range" min="0" max="1" step="0.01" data-fld="L" value="${ok.l.toFixed(2)}"><span class="tk-num" data-out="L">${ok.l.toFixed(2)}</span></div>
                    <div class="tk-editor__row"><label>C</label><input type="range" min="0" max="0.4" step="0.005" data-fld="C" value="${ok.c.toFixed(3)}"><span class="tk-num" data-out="C">${ok.c.toFixed(3)}</span></div>
                    <div class="tk-editor__row"><label>H</label><input type="range" min="0" max="360" step="1" data-fld="H" value="${ok.h.toFixed(0)}"><span class="tk-num" data-out="H">${ok.h.toFixed(0)}</span></div>
                    <div class="tk-editor__row"><label>RAW</label><input type="text" class="input-ds" data-fld="raw" value="${val}"></div>
                `;
            }
            if (kind === 'font') {
                const fams = ['Archivo','Geist','Inter Tight','JetBrains Mono','SF Mono, ui-monospace, Menlo, monospace','IBM Plex Mono','IBM Plex Sans','Space Grotesk','Space Mono','Manrope','Fira Code','DM Mono','DM Sans','Roboto Mono','ui-sans-serif, system-ui, sans-serif','ui-monospace, Menlo, monospace'];
                const opts = fams.map((f) => `<option value='${f}' ${val.includes(f.split(',')[0].replace(/"/g, '')) ? 'selected' : ''}>${f}</option>`).join('');
                return `
                    <div class="tk-editor__head"><span class="t-eyebrow fg-quiet">EDIT &middot; ${name}</span><button class="tk-editor__x" data-act="close">&times;</button></div>
                    <div class="tk-editor__row"><label>STACK</label><input type="text" class="input-ds" data-fld="raw" value='${val.replace(/"/g, '&quot;')}'></div>
                    <div class="tk-editor__row"><label>PRESET</label><select class="input-ds" data-fld="preset">${opts}</select></div>
                    <div class="t-mono fg-quiet" style="padding:6px 12px;">System fonts only on this page: a family renders if it is installed.</div>
                `;
            }
            if (kind === 'size') {
                const px = parseFloat(val) || 0;
                const max = name.startsWith('--w-') ? 8 : (name.startsWith('--r-') ? 32 : 200);
                return `
                    <div class="tk-editor__head"><span class="t-eyebrow fg-quiet">EDIT &middot; ${name}</span><button class="tk-editor__x" data-act="close">&times;</button></div>
                    <div class="tk-editor__row"><label>PX</label><input type="range" min="0" max="${max}" step="${name.startsWith('--w-') ? 0.5 : 1}" data-fld="px" value="${px}"><input type="number" class="input-ds" data-fld="pxText" value="${px}" style="width:80px;"></div>
                    <div class="tk-editor__row"><label>RAW</label><input type="text" class="input-ds" data-fld="raw" value="${val}"></div>
                `;
            }
            if (kind === 'duration') {
                const ms = parseFloat(val) || 0;
                return `
                    <div class="tk-editor__head"><span class="t-eyebrow fg-quiet">EDIT &middot; ${name}</span><button class="tk-editor__x" data-act="close">&times;</button></div>
                    <div class="tk-editor__row"><label>MS</label><input type="range" min="0" max="1000" step="10" data-fld="ms" value="${ms}"><input type="number" class="input-ds" data-fld="msText" value="${ms}" style="width:80px;"></div>
                    <div class="tk-editor__row"><label>RAW</label><input type="text" class="input-ds" data-fld="raw" value="${val}"></div>
                `;
            }
            return `
                <div class="tk-editor__head"><span class="t-eyebrow fg-quiet">EDIT &middot; ${name}</span><button class="tk-editor__x" data-act="close">&times;</button></div>
                <div class="tk-editor__row"><label>RAW</label><input type="text" class="input-ds" data-fld="raw" value="${val}"></div>
                <div class="t-mono fg-quiet" style="padding:6px 12px;">e.g. linear &middot; cubic-bezier(0.2,0,0,1)</div>
            `;
        }

        function wireEditor(ed: HTMLElement, kind: string, name: string) {
            ed.querySelector<HTMLElement>('[data-act="close"]')?.addEventListener('click', () => {
                if (ed.classList.contains('edit-popover')) closePopover();
                else closeEditor();
            });
            const $ = <T extends HTMLElement = HTMLElement>(sel: string) => ed.querySelector<T>(sel)!;
            const raw = $<HTMLInputElement>('[data-fld="raw"]');
            const commitRaw = () => setVar(name, raw.value.trim());
            raw.addEventListener('change', commitRaw);

            if (kind === 'color') {
                const hex = $<HTMLInputElement>('[data-fld="hex"]');
                const hexText = $<HTMLInputElement>('[data-fld="hexText"]');
                const L = $<HTMLInputElement>('[data-fld="L"]');
                const C = $<HTMLInputElement>('[data-fld="C"]');
                const H = $<HTMLInputElement>('[data-fld="H"]');
                const outL = $('[data-out="L"]');
                const outC = $('[data-out="C"]');
                const outH = $('[data-out="H"]');
                hex.addEventListener('input', () => {
                    hexText.value = hex.value;
                    setVar(name, hex.value);
                    syncOklch(hex.value);
                    raw.value = readVar(name);
                });
                hexText.addEventListener('change', () => {
                    setVar(name, hexText.value);
                    hex.value = toHex(hexText.value);
                    syncOklch(hexText.value);
                    raw.value = readVar(name);
                });
                function syncOklch(v: string) {
                    const o = parseOklch(v);
                    L.value = o.l.toFixed(2);
                    C.value = o.c.toFixed(3);
                    H.value = o.h.toFixed(0);
                    outL.textContent = L.value;
                    outC.textContent = C.value;
                    outH.textContent = H.value;
                }
                const updateFromOklch = () => {
                    const v = `oklch(${(+L.value).toFixed(3)} ${(+C.value).toFixed(3)} ${(+H.value).toFixed(0)})`;
                    outL.textContent = (+L.value).toFixed(2);
                    outC.textContent = (+C.value).toFixed(3);
                    outH.textContent = (+H.value).toFixed(0);
                    setVar(name, v);
                    raw.value = v;
                    hexText.value = v;
                    hex.value = toHex(v);
                };
                [L, C, H].forEach((s) => s.addEventListener('input', updateFromOklch));
            } else if (kind === 'font') {
                $<HTMLSelectElement>('[data-fld="preset"]').addEventListener('change', (e) => {
                    const family = (e.target as HTMLSelectElement).value;
                    const stack = family.includes(',') ? family : `"${family}", ui-sans-serif, system-ui, sans-serif`;
                    raw.value = stack;
                    setVar(name, stack);
                });
            } else if (kind === 'size') {
                const px = $<HTMLInputElement>('[data-fld="px"]');
                const pxText = $<HTMLInputElement>('[data-fld="pxText"]');
                const sync = (val: string) => { const v = `${val}px`; raw.value = v; setVar(name, v); };
                px.addEventListener('input', () => { pxText.value = px.value; sync(px.value); });
                pxText.addEventListener('change', () => { px.value = pxText.value; sync(pxText.value); });
            } else if (kind === 'duration') {
                const ms = $<HTMLInputElement>('[data-fld="ms"]');
                const msText = $<HTMLInputElement>('[data-fld="msText"]');
                const sync = (val: string) => { const v = `${val}ms`; raw.value = v; setVar(name, v); };
                ms.addEventListener('input', () => { msText.value = ms.value; sync(ms.value); });
                msText.addEventListener('change', () => { ms.value = msText.value; sync(msText.value); });
            }
        }

        function toHex(val: string) {
            if (!val) return '#000000';
            val = val.trim();
            if (val.startsWith('#')) return val.length === 4 ? '#' + val.slice(1).split('').map((c) => c + c).join('') : val.slice(0, 7);
            try {
                const c = document.createElement('canvas').getContext('2d')!;
                c.fillStyle = '#000';
                c.fillStyle = val;
                const r = c.fillStyle as string;
                if (r.startsWith('#')) return r;
                const m = r.match(/rgba?\(([^)]+)\)/);
                if (m) {
                    const [r2, g2, b2] = m[1].split(',').map((x) => parseFloat(x));
                    return '#' + [r2, g2, b2].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
                }
            } catch {}
            return '#000000';
        }
        function parseOklch(val: string) {
            const m = val.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
            if (m) return { l: +m[1], c: +m[2], h: +m[3] };
            const hex = toHex(val).replace('#', '');
            if (hex.length < 6) return { l: 0.5, c: 0.1, h: 0 };
            const r = parseInt(hex.slice(0, 2), 16) / 255;
            const g = parseInt(hex.slice(2, 4), 16) / 255;
            const b = parseInt(hex.slice(4, 6), 16) / 255;
            const lin = (x: number) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
            const R = lin(r), G = lin(g), B = lin(b);
            const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
            const m2 = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
            const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
            const l_ = Math.cbrt(l), m_ = Math.cbrt(m2), s_ = Math.cbrt(s);
            const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
            const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
            const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
            const C = Math.sqrt(a * a + b2 * b2);
            let H = (Math.atan2(b2, a) * 180) / Math.PI;
            if (H < 0) H += 360;
            return { l: L, c: C, h: H };
        }

        let toastTimer: ReturnType<typeof setTimeout> | undefined;
        function showToast(msg: string) {
            const t = byId('tokenToast');
            if (!t) return;
            t.textContent = msg;
            t.dataset.show = 'true';
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => { t.dataset.show = 'false'; }, 1400);
        }

        const drawer = byId('tokenDrawer')!;
        const tab = byId('tokenTab')!;
        const closeBtn = byId('tokenClose')!;
        function setDrawer(open: boolean) {
            drawer.dataset.open = open ? 'true' : 'false';
            tab.dataset.open = open ? 'true' : 'false';
            drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (open) buildTokens();
        }
        const tabHandler = () => setDrawer(drawer.dataset.open !== 'true');
        const closeHandler = () => setDrawer(false);
        const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
        tab.addEventListener('click', tabHandler);
        closeBtn.addEventListener('click', closeHandler);
        document.addEventListener('keydown', escHandler);

        const themeMo = new MutationObserver(() => { if (drawer.dataset.open === 'true') buildTokens(); });
        themeMo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

        const filter = byId('tokenFilter') as HTMLInputElement | null;
        const filterHandler = () => {
            const q = filter?.value.trim().toLowerCase() || '';
            root.querySelectorAll<HTMLElement>('.tk-row').forEach((r) => {
                r.style.display = !q || (r.dataset.search || '').includes(q) ? '' : 'none';
            });
            root.querySelectorAll<HTMLElement>('.tk-group').forEach((g) => {
                const anyVisible = [...g.querySelectorAll<HTMLElement>('.tk-row')].some((r) => r.style.display !== 'none');
                g.style.display = anyVisible ? '' : 'none';
            });
        };
        filter?.addEventListener('input', filterHandler);

        const exportButtons = drawer.querySelectorAll<HTMLElement>('[data-export]');
        const exportHandlers: Array<() => void> = [];
        exportButtons.forEach((b) => {
            const handler = () => {
                const fmt = b.dataset.export;
                const all = TOKEN_GROUPS.flatMap((g) => g.vars.map((v) => [v, readVar(v)] as [string, string]));
                let text: string;
                if (fmt === 'css') {
                    text = ':root {\n' + all.map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}';
                } else {
                    const obj: Record<string, Record<string, string>> = {};
                    TOKEN_GROUPS.forEach((g) => { obj[g.name.toLowerCase()] = Object.fromEntries(g.vars.map((v) => [v, readVar(v)])); });
                    text = JSON.stringify(obj, null, 2);
                }
                navigator.clipboard?.writeText(text).then(() => showToast(`COPIED · ${(fmt || '').toUpperCase()} (${all.length} TOKENS)`));
            };
            exportHandlers.push(handler);
            b.addEventListener('click', handler);
        });

        const resetBtn = byId('tokenReset');
        const resetHandler = () => {
            Object.keys(overrides).forEach((k) => root.style.removeProperty(k));
            overrides = {};
            persistOverrides();
            closeEditor();
            buildTokens();
            refreshLabels();
            showToast('RESET · DEFAULTS RESTORED');
        };
        resetBtn?.addEventListener('click', resetHandler);

        const shareBtn = byId('tokenShare');
        const shareHandler = () => {
            const n = Object.keys(overrides).length;
            const hash = n ? '#t=' + encodeURIComponent(btoa(JSON.stringify(overrides))) : '';
            const url = location.origin + location.pathname + location.search + hash;
            navigator.clipboard?.writeText(url).then(() => showToast(`LINK COPIED · ${n} TOKENS`));
        };
        shareBtn?.addEventListener('click', shareHandler);

        /* ---------- INLINE PAGE EDITING ---------- */
        const STORE_EDIT = 'n.ds.editmode';
        let editMode = false;
        try { editMode = localStorage.getItem(STORE_EDIT) === 'true'; } catch {}
        const editToggleEl = byId('editToggle');
        let popover: HTMLElement | null = null;
        function closePopover() { if (popover) { popover.remove(); popover = null; } }
        function setEditMode(on: boolean) {
            editMode = on;
            root.dataset.editMode = on ? 'true' : 'false';
            if (editToggleEl) editToggleEl.dataset.active = on ? 'true' : 'false';
            try { localStorage.setItem(STORE_EDIT, String(on)); } catch {}
            if (!on) closePopover();
        }
        const editToggleHandler = () => setEditMode(!editMode);
        editToggleEl?.addEventListener('click', editToggleHandler);
        setEditMode(editMode);

        function openPopover(el: HTMLElement, name: string) {
            closePopover();
            const kind = tokenKind(name);
            const val = readVar(name);
            const pop = document.createElement('div');
            pop.className = 'edit-popover';
            pop.innerHTML = `<div class="edit-popover__arrow"></div>${renderEditor(kind, name, val)}`;
            root.appendChild(pop);
            const rect = el.getBoundingClientRect();
            const fr = root.getBoundingClientRect();
            const w = Math.min(320, fr.width - 16);
            let left = rect.left - fr.left + rect.width / 2 - w / 2;
            left = Math.max(8, Math.min(left, fr.width - w - 8));
            pop.style.left = left + 'px';
            pop.style.top = Math.min(rect.bottom - fr.top + 10, fr.height - 40) + 'px';
            pop.style.width = w + 'px';
            popover = pop;
            wireEditor(pop, kind, name);
            setTimeout(() => {
                const handler = (e: MouseEvent) => {
                    if (popover && !popover.contains(e.target as Node) && !el.contains(e.target as Node)) {
                        closePopover();
                        document.removeEventListener('mousedown', handler);
                    }
                };
                document.addEventListener('mousedown', handler);
            }, 0);
        }

        const inlineClickHandler = (e: MouseEvent) => {
            if (!editMode) return;
            const target = (e.target as HTMLElement).closest<HTMLElement>('[data-edit-var]');
            if (!target) return;
            if (target.closest('#tokenDrawer')) return;
            e.preventDefault();
            e.stopPropagation();
            const name = target.dataset.editVar!;
            openPopover(target, name);
        };
        root.addEventListener('click', inlineClickHandler);

        function refreshLabels() {
            root.querySelectorAll<HTMLElement>('[data-show-var]').forEach((el) => {
                const v = readVar(el.dataset.showVar!);
                el.textContent = v.toUpperCase();
            });
            root.querySelectorAll<HTMLElement>('[data-show-px]').forEach((el) => {
                el.textContent = readVar(el.dataset.showPx!);
            });
            root.querySelectorAll<HTMLElement>('[data-show-ms]').forEach((el) => {
                const v = readVar(el.dataset.showMs!);
                el.textContent = String(parseFloat(v) || v);
            });
            root.querySelectorAll<HTMLElement>('[data-show-font]').forEach((el) => {
                const stack = readVar(el.dataset.showFont!);
                // Skip CSS-var tokens (e.g. var(--font-archivo)) and pick the first
                // human-readable family name from the stack.
                const first = stack.split(',')
                    .map((p) => p.replace(/['"]/g, '').trim())
                    .find((p) => p && !p.startsWith('var(') && !p.startsWith('ui-') && !p.startsWith('-apple-system') && p !== 'system-ui' && p !== 'sans-serif' && p !== 'monospace') || stack.split(',')[0].replace(/['"]/g, '').trim();
                el.textContent = first;
            });
        }
        refreshLabels();

        /* ---------- LOGO COPY SVG ---------- */
        const logoCopyButtons = root.querySelectorAll<HTMLButtonElement>('.logo-copy');
        const logoCopyHandlers: Array<() => void> = [];
        logoCopyButtons.forEach((btn) => {
            const handler = () => {
                const svg = btn.dataset.copy;
                if (!svg) return;
                navigator.clipboard?.writeText(svg).then(() => {
                    const orig = btn.textContent;
                    btn.textContent = 'COPIED ✓';
                    setTimeout(() => { btn.textContent = orig; }, 1100);
                });
            };
            logoCopyHandlers.push(handler);
            btn.addEventListener('click', handler);
        });

        /* ---------- SIDEBAR SCROLL-SPY ---------- */
        const links = root.querySelectorAll<HTMLAnchorElement>('.ds-sidebar__link');
        const sections = root.querySelectorAll<HTMLElement>('.ds-section');
        function setActive(id: string) {
            links.forEach((l) => { l.dataset.active = l.getAttribute('href') === '#' + id ? 'true' : 'false'; });
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).id); });
        }, { root: scroller, rootMargin: '-30% 0px -60% 0px' });
        sections.forEach((s) => io.observe(s));
        const linkHandler = (e: Event) => {
            const a = e.currentTarget as HTMLAnchorElement;
            const target = root.querySelector<HTMLElement>(a.getAttribute('href') || '');
            if (!target) return;
            e.preventDefault();
            const bar = root.querySelector<HTMLElement>('.ds-topbar')?.offsetHeight || 0;
            scroller.scrollTo({ top: scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - bar, behavior: 'smooth' });
            setActive(target.id);
        };
        links.forEach((l) => l.addEventListener('click', linkHandler));

        return () => {
            tt?.removeEventListener('click', themeHandler);
            tab.removeEventListener('click', tabHandler);
            closeBtn.removeEventListener('click', closeHandler);
            document.removeEventListener('keydown', escHandler);
            filter?.removeEventListener('input', filterHandler);
            exportButtons.forEach((b, i) => b.removeEventListener('click', exportHandlers[i]));
            resetBtn?.removeEventListener('click', resetHandler);
            shareBtn?.removeEventListener('click', shareHandler);
            editToggleEl?.removeEventListener('click', editToggleHandler);
            root.removeEventListener('click', inlineClickHandler);
            logoCopyButtons.forEach((b, i) => b.removeEventListener('click', logoCopyHandlers[i]));
            themeMo.disconnect();
            io.disconnect();
            links.forEach((l) => l.removeEventListener('click', linkHandler));
            closeEditor();
            closePopover();
            root.dataset.editMode = 'false';
        };
    }, []);

    return (
        <div ref={frameRef} className="zp" data-part="zero-point-v1">
        <div ref={scrollRef} className="zp-scroll">
        <div className="ds-root" data-menu-open={menuOpen ? 'true' : 'false'}>
            {/* DS topbar, sits below the site header */}
            <div className="ds-topbar">
                <div className="ds-topbar__crumbs">
                    <span>n.[ds]</span><span>system</span><span>v1.0.0</span><span>2026.05.04</span>
                </div>
                <div className="ds-topbar__meta">
                    <span><span className="ds-topbar__pulse" />BUILDING · 1 OF 1</span>
                    <span>UNCLASSIFIED · INTERNAL</span>
                    <button className="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme">
                        <span className="theme-toggle__seg" data-mode="dark">DARK</span>
                        <span className="theme-toggle__seg" data-mode="light">LIGHT</span>
                        <span className="theme-toggle__seg" data-mode="auto">AUTO</span>
                    </button>
                    <button className="edit-toggle" id="editToggle" type="button" aria-label="Toggle inline editing">
                        <span className="edit-toggle__dot" />
                        <span className="edit-toggle__label">EDIT</span>
                    </button>
                </div>
            </div>

            <div className="ds-shell">
                <aside className="ds-sidebar">
                    <div className="ds-sidebar__brand">
                        <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
                            n<span style={{ color: 'var(--accent)' }}>.</span><span style={{ color: 'var(--fg-quiet)' }}>[</span>ds<span style={{ color: 'var(--fg-quiet)' }}>]</span>
                        </span>
                    </div>
                    <div className="ds-sidebar__nav">
                        <div className="ds-sidebar__nav-section">FOUNDATIONS</div>
                        <a className="ds-sidebar__link" href="#zp-color"  data-active="true"><span>00 / COLOR</span><span>11+5+6</span></a>
                        <a className="ds-sidebar__link" href="#zp-type"><span>01 / TYPE</span><span>3+10</span></a>
                        <a className="ds-sidebar__link" href="#zp-scale"><span>02 / SCALE</span><span>11</span></a>
                        <a className="ds-sidebar__link" href="#zp-radius"><span>03 / RADIUS</span><span>3</span></a>
                        <a className="ds-sidebar__link" href="#zp-stroke"><span>04 / STROKE</span><span>3</span></a>
                        <a className="ds-sidebar__link" href="#zp-motion"><span>05 / MOTION</span><span>3·4</span></a>
                        <a className="ds-sidebar__link" href="#zp-icons"><span>06 / ICONS</span><span>16</span></a>
                        <div className="ds-sidebar__nav-section">PRIMITIVES</div>
                        <a className="ds-sidebar__link" href="#zp-buttons"><span>07 / BUTTONS</span><span>4</span></a>
                        <a className="ds-sidebar__link" href="#zp-inputs"><span>08 / INPUTS</span><span>3</span></a>
                        <a className="ds-sidebar__link" href="#zp-tags"><span>09 / TAGS</span><span>5</span></a>
                        <a className="ds-sidebar__link" href="#zp-cards"><span>10 / CARDS</span><span>3</span></a>
                        <a className="ds-sidebar__link" href="#zp-alerts"><span>11 / ALERTS</span><span>4</span></a>
                        <div className="ds-sidebar__nav-section">DATA</div>
                        <a className="ds-sidebar__link" href="#zp-stats"><span>12 / STATS</span><span>3</span></a>
                        <a className="ds-sidebar__link" href="#zp-bars"><span>13 / BARS</span><span>5</span></a>
                        <div className="ds-sidebar__nav-section">BRAND</div>
                        <a className="ds-sidebar__link" href="#zp-voice"><span>14 / VOICE</span><span /></a>
                        <a className="ds-sidebar__link" href="#zp-logo"><span>15 / LOGO</span><span>2</span></a>
                    </div>
                </aside>

                <div className="ds-main">
                    <div className="ds-hero">
                        <div className="ds-hero__title">SYSTEMS<br />FOR<em>.</em><br />SCALE.</div>
                        <div className="ds-hero__meta">
                            <div className="ds-hero__meta-row"><span className="k">DOC</span><span className="v">n.[ds] / industrial v1.0.0</span></div>
                            <div className="ds-hero__meta-row"><span className="k">DATE</span><span className="v">2026.05.04 // PORTLAND</span></div>
                            <div className="ds-hero__meta-row"><span className="k">AUTHOR</span><span className="v">scott campbell</span></div>
                            <div className="ds-hero__meta-row"><span className="k">TONE</span><span className="v">propulsion · applied ai · declarative</span></div>
                            <div className="ds-hero__meta-row"><span className="k">SEED</span><span className="v">crusoe · vercel · o-p-e-n</span></div>
                            <div className="ds-hero__meta-row"><span className="k">STATUS</span><span className="v" style={{ color: 'var(--signal-green)' }}>● LIVE, TOKENS LOCKED</span></div>
                        </div>
                    </div>

                    {/* 00 COLOR */}
                    <div className="ds-section" id="zp-color">
                        <div className="ds-section__head">
                            <div><div className="num">00 / COLOR</div></div>
                            <div>
                                <div className="title">PALETTE.</div>
                                <div className="desc">Two ink scales, one signal accent, six semantic tones. Dark-mode primary. No saturation in greys (pure technical neutrals).</div>
                            </div>
                        </div>
                        <div className="t-eyebrow" style={{ marginBottom: 8 }}>INK · 11 STEPS</div>
                        <div className="swatch-row">
                            {[
                                ['--ink-1000', '#000000', 'paper-800'],
                                ['--ink-900',  '#0C0C0C', 'paper-800'],
                                ['--ink-800',  '#1A1A1A', 'paper-800'],
                                ['--ink-700',  '#262624', 'paper-800'],
                                ['--ink-600',  '#34332F', 'paper-800'],
                                ['--ink-500',  '#3D3D3A', 'paper-800'],
                                ['--ink-400',  '#5A5A55', 'ink-900'],
                                ['--ink-300',  '#80807A', 'ink-900'],
                                ['--ink-200',  '#A8A8A0', 'ink-900'],
                                ['--ink-100',  '#C8C5BC', 'ink-900'],
                                ['--paper-900','#F3F1EC', 'ink-900'],
                            ].map(([v, hex, fg], i) => (
                                <div key={v}
                                     className="swatch"
                                     data-edit-var={v}
                                     style={{ background: `var(${v})`, color: `var(--${fg})` }}>
                                    <span className="swatch__step">{i === 10 ? '0' : v.split('-')[2]}</span>
                                    <span className="swatch__hex" data-show-var={v}>{hex}</span>
                                </div>
                            ))}
                        </div>

                        <div className="t-eyebrow" style={{ margin: '24px 0 8px' }}>PAPER · 5 STEPS · LIGHT-MODE INK</div>
                        <div className="swatch-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                            {[
                                ['--paper-1000', '#F7F5F0', '1000'],
                                ['--paper-900',  '#F3F1EC', '900'],
                                ['--paper-800',  '#E8E5DD', '800'],
                                ['--paper-700',  '#D8D5CC', '700'],
                                ['--paper-600',  '#C0BDB4', '600'],
                            ].map(([v, hex, step]) => (
                                <div key={v}
                                     className="swatch"
                                     data-edit-var={v}
                                     style={{ background: `var(${v})`, color: 'var(--ink-900)' }}>
                                    <span className="swatch__step">{step}</span>
                                    <span className="swatch__hex" data-show-var={v}>{hex}</span>
                                </div>
                            ))}
                        </div>

                        <div className="t-eyebrow" style={{ margin: '24px 0 8px' }}>SIGNAL · 6 ACCENTS · USE SPARINGLY</div>
                        <div className="semantic-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                            {[
                                ['--signal-red',    'RED · PRIMARY'],
                                ['--signal-red-2',  'RED·2'],
                                ['--signal-amber',  'AMBER'],
                                ['--signal-green',  'GREEN'],
                                ['--signal-blue',   'BLUE'],
                                ['--signal-violet', 'VIOLET'],
                            ].map(([v, name]) => (
                                <div className="semantic" key={v}>
                                    <div className="semantic__chip" data-edit-var={v} style={{ background: `var(${v})` }} />
                                    <div className="semantic__name">{name}</div>
                                    <div className="semantic__token">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 01 TYPE */}
                    <div className="ds-section" id="zp-type">
                        <div className="ds-section__head">
                            <div><div className="num">01 / TYPE</div></div>
                            <div>
                                <div className="title">TYPOGRAPHY.</div>
                                <div className="desc">Archivo carries the loud headlines. Geist handles body. SF Mono is the technical chrome, labels, data, code, status. No serifs.</div>
                            </div>
                        </div>

                        <div className="type-pairing">
                            <div className="type-card" data-edit-var="--f-display">
                                <div className="role">DISPLAY</div>
                                <div className="name" style={{ fontFamily: 'var(--f-display)' }} data-show-font="--f-display">Archivo</div>
                                <div className="sample" style={{ fontFamily: 'var(--f-display)', fontWeight: 800 }}>Aa01</div>
                                <div className="t-mono fg-quiet">400 · 600 · 700 · 800 · 900</div>
                            </div>
                            <div className="type-card" data-edit-var="--f-body">
                                <div className="role">BODY</div>
                                <div className="name" style={{ fontFamily: 'var(--f-body)' }} data-show-font="--f-body">Geist</div>
                                <div className="sample" style={{ fontFamily: 'var(--f-body)', fontWeight: 500 }}>Aa01</div>
                                <div className="t-mono fg-quiet">400 · 500 · 600 · 700</div>
                            </div>
                            <div className="type-card" data-edit-var="--f-mono">
                                <div className="role">MONO</div>
                                <div className="name" style={{ fontFamily: 'var(--f-mono)' }} data-show-font="--f-mono">SF Mono</div>
                                <div className="sample" style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>Aa01</div>
                                <div className="t-mono fg-quiet">SYSTEM · ui-monospace fallback</div>
                            </div>
                        </div>

                        <div className="t-eyebrow" style={{ margin: '24px 0 0' }}>SCALE</div>
                        <div className="type-stack">
                            <div className="type-row"><span className="k">DISPLAY 1</span><span className="v t-display-1">PROPULSION.</span><span className="meta">96 / 0.92 / -3%</span></div>
                            <div className="type-row"><span className="k">DISPLAY 2</span><span className="v t-display-2">FOR SCALE.</span><span className="meta">72 / 0.94 / -2.5%</span></div>
                            <div className="type-row"><span className="k">DISPLAY 3</span><span className="v t-display-3">Built in Portland.</span><span className="meta">48 / 0.98 / -2%</span></div>
                            <div className="type-row"><span className="k">H1</span><span className="v t-h1">Industrial systems reference.</span><span className="meta">36 / 1.05 / -2%</span></div>
                            <div className="type-row"><span className="k">H2</span><span className="v t-h2">Tokens. Primitives. Patterns.</span><span className="meta">28 / 1.1 / -1.5%</span></div>
                            <div className="type-row"><span className="k">H3</span><span className="v t-h3">Technical neutrals · one signal.</span><span className="meta">20 / 1.2 / -1%</span></div>
                            <div className="type-row"><span className="k">BODY LG</span><span className="v t-body-lg">Built for dense data and long reads alike, Geist at 16/1.55 reads as confidently at hero scale as it does in column.</span><span className="meta">16 / 1.55</span></div>
                            <div className="type-row"><span className="k">BODY</span><span className="v t-body">Default body copy. Sentence rhythm tight, paragraphs disciplined. No ornament.</span><span className="meta">14 / 1.55</span></div>
                            <div className="type-row"><span className="k">MONO</span><span className="v t-mono">$ select tokens. → 11 ink steps. 6 signals. 11 spacing. 3 radii.</span><span className="meta">12 / 1.4 / +2%</span></div>
                            <div className="type-row"><span className="k">LABEL</span><span className="v t-label">SECTION · CHANNEL · TIMESTAMP</span><span className="meta">10 / +16% / UPPER</span></div>
                        </div>
                    </div>

                    {/* 02 SCALE */}
                    <div className="ds-section" id="zp-scale">
                        <div className="ds-section__head">
                            <div><div className="num">02 / SCALE</div></div>
                            <div>
                                <div className="title">SPACING.</div>
                                <div className="desc">4px base. Eleven steps. Used for padding, gaps, gutters. Larger jumps top-end (48 → 64 → 96 → 128) for editorial whitespace at section breaks.</div>
                            </div>
                        </div>
                        <div className="scale-table">
                            {[
                                ['--s-0',  '0px',   '0',      0],
                                ['--s-1',  '4px',   '0.25rem',4],
                                ['--s-2',  '8px',   '0.5rem', 8],
                                ['--s-3',  '12px',  '0.75rem',12],
                                ['--s-4',  '16px',  '1rem',   16],
                                ['--s-6',  '24px',  '1.5rem', 24],
                                ['--s-8',  '32px',  '2rem',   32],
                                ['--s-12', '48px',  '3rem',   48],
                                ['--s-16', '64px',  '4rem',   64],
                                ['--s-24', '96px',  '6rem',   96],
                                ['--s-32', '128px', '8rem',   128],
                            ].map(([v, px, rem, w]) => (
                                <div className="scale-row" data-edit-var={v} key={v as string}>
                                    <span className="label">{v}</span>
                                    <span className="px" data-show-px={v}>{px}</span>
                                    <span className="rem">{rem}</span>
                                    <span className="bar"><div style={{ width: `${w}px` }} /></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 03 RADIUS */}
                    <div className="ds-section" id="zp-radius">
                        <div className="ds-section__head">
                            <div><div className="num">03 / RADIUS</div></div>
                            <div>
                                <div className="title">RADII.</div>
                                <div className="desc">Sharp by default. 0 is the standard; 2 and 4 reserved for inputs and chips where edges feel too aggressive. Never above 4.</div>
                            </div>
                        </div>
                        <div className="radius-row">
                            <div className="radius-card" data-edit-var="--r-0"><div className="radius-demo" style={{ borderRadius: 'var(--r-0)' }} /><div className="t-mono">--r-0 · 0px · DEFAULT</div></div>
                            <div className="radius-card" data-edit-var="--r-1"><div className="radius-demo" style={{ borderRadius: 'var(--r-1)' }} /><div className="t-mono">--r-1 · 2px · INPUTS</div></div>
                            <div className="radius-card" data-edit-var="--r-2"><div className="radius-demo" style={{ borderRadius: 'var(--r-2)' }} /><div className="t-mono">--r-2 · 4px · CHIPS</div></div>
                        </div>
                    </div>

                    {/* 04 STROKE */}
                    <div className="ds-section" id="zp-stroke">
                        <div className="ds-section__head">
                            <div><div className="num">04 / STROKE</div></div>
                            <div>
                                <div className="title">STROKES.</div>
                                <div className="desc">Three weights. Hairlines for tables and dividers. Structural for buttons and frames. Loud, 2px in accent, for active states only.</div>
                            </div>
                        </div>
                        <div className="stroke-row">
                            <div className="stroke-card" data-edit-var="--w-hair"><div className="stroke-demo" data-w="hair" /><div className="t-mono">--w-hair · 1px · DIVIDERS</div></div>
                            <div className="stroke-card" data-edit-var="--w-struct"><div className="stroke-demo" data-w="struct" /><div className="t-mono">--w-struct · 1.5px · STRUCTURAL</div></div>
                            <div className="stroke-card" data-edit-var="--w-loud"><div className="stroke-demo" data-w="loud" /><div className="t-mono fg-accent">--w-loud · 2px · ACTIVE / ACCENT</div></div>
                        </div>
                    </div>

                    {/* 05 MOTION */}
                    <div className="ds-section" id="zp-motion">
                        <div className="ds-section__head">
                            <div><div className="num">05 / MOTION</div></div>
                            <div>
                                <div className="title">MOTION.</div>
                                <div className="desc">Three curves, four durations. Linear for industrial chrome (status, ticker). Out-curve for response to user. In-out for transports.</div>
                            </div>
                        </div>
                        <div className="motion-row">
                            <div className="motion-card" data-curve="linear" data-edit-var="--e-linear">
                                <div className="t-mono">--e-linear · linear</div>
                                <div className="motion-track"><div className="motion-dot" /></div>
                                <div className="t-eyebrow fg-quiet">USE: TICKER · STATUS BARS · MARQUEES</div>
                            </div>
                            <div className="motion-card" data-curve="out" data-edit-var="--e-out">
                                <div className="t-mono">--e-out · cubic(0.2,0,0,1)</div>
                                <div className="motion-track"><div className="motion-dot" /></div>
                                <div className="t-eyebrow fg-quiet">USE: HOVER · TAP · MICRO-FEEDBACK</div>
                            </div>
                            <div className="motion-card" data-curve="inout" data-edit-var="--e-in-out">
                                <div className="t-mono">--e-in-out · cubic(0.6,0,0.4,1)</div>
                                <div className="motion-track"><div className="motion-dot" /></div>
                                <div className="t-eyebrow fg-quiet">USE: PAGE · DRAWER · MODAL</div>
                            </div>
                        </div>
                        <div className="t-eyebrow" style={{ margin: '24px 0 8px' }}>DURATIONS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid var(--line)' }}>
                            {[
                                ['--d-1', 80,  'SNAP · TAP'],
                                ['--d-2', 160, 'DEFAULT'],
                                ['--d-3', 240, 'TRANSPORT'],
                                ['--d-4', 400, 'REVEAL'],
                            ].map(([v, ms, label], i, arr) => (
                                <div key={v as string}
                                     style={{ padding: 24, borderRight: i === arr.length - 1 ? 0 : '1px solid var(--line)' }}
                                     data-edit-var={v}>
                                    <div className="t-mono fg-quiet">{v}</div>
                                    <div className="t-h2" style={{ marginTop: 8 }}>
                                        <span data-show-ms={v}>{ms}</span>
                                        <span className="fg-quiet" style={{ fontSize: 14 }}> ms</span>
                                    </div>
                                    <div className="t-mono fg-quiet" style={{ marginTop: 4 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 06 ICONS */}
                    <div className="ds-section" id="zp-icons">
                        <div className="ds-section__head">
                            <div><div className="num">06 / ICONS</div></div>
                            <div>
                                <div className="title">ICONS.</div>
                                <div className="desc">20px nominal, 1.5px stroke, square caps + miter joins. Monoline. No fills. Built on a 24-grid with 2px optical padding.</div>
                            </div>
                        </div>
                        <div className="icon-grid">
                            {[
                                ['PLUS',     'M3 12h18M12 3v18'],
                                ['MINUS',    'M3 12h18'],
                                ['ARROW',    'M5 12h14M13 5l7 7-7 7'],
                                ['BACK',     'M19 12H5M11 5l-7 7 7 7'],
                                ['CHEVRON',  'M5 7l7 7 7-7'],
                                ['CLOSE',    'M5 5l14 14M19 5L5 19'],
                                ['MENU',     'M4 6h16M4 12h16M4 18h16'],
                            ].map(([name, d]) => (
                                <div className="icon-cell" key={name}>
                                    <svg viewBox="0 0 24 24"><path d={d} /></svg>
                                    <span className="name">{name}</span>
                                </div>
                            ))}
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></svg><span className="name">SEARCH</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" /><path d="M4 9h16" /></svg><span className="name">DOC</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><path d="M4 7l8 6 8-6M4 7v10h16V7" /></svg><span className="name">MAIL</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg><span className="name">CLOCK</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><path d="M12 4l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V8z" /></svg><span className="name">SHIELD</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><path d="M4 19l4-4 4 4 8-8M16 7h4v4" /></svg><span className="name">TREND</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /></svg><span className="name">TARGET</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z" /></svg><span className="name">FLAG</span></div>
                            <div className="icon-cell"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 7v6M12 17v.5" /></svg><span className="name">ALERT</span></div>
                        </div>
                    </div>

                    {/* 07 BUTTONS */}
                    <div className="ds-section" id="zp-buttons">
                        <div className="ds-section__head">
                            <div><div className="num">07 / BUTTONS</div></div>
                            <div>
                                <div className="title">BUTTONS.</div>
                                <div className="desc">Square edges, mono labels, uppercase. Press translates 1px. Accent variant inverts on hover. Ghost is for secondary action only.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                <button className="btn-ds">PRIMARY ACTION</button>
                                <button className="btn-ds" data-tone="accent">EMERGE NOW</button>
                                <button className="btn-ds" data-tone="ghost">SECONDARY</button>
                                <button className="btn-ds" data-size="sm">COMPACT</button>
                                <button className="btn-ds" data-size="lg" data-tone="accent">LARGE / CTA</button>
                                <button className="btn-ds" disabled>DISABLED</button>
                            </div>
                            <div className="t-eyebrow fg-quiet">SIZES · SM 28 · MD 36 · LG 48</div>
                        </div>
                    </div>

                    {/* 08 INPUTS */}
                    <div className="ds-section" id="zp-inputs">
                        <div className="ds-section__head">
                            <div><div className="num">08 / INPUTS</div></div>
                            <div>
                                <div className="title">INPUTS.</div>
                                <div className="desc">Bottom-rule only. No box. Mono input text, fields read like terminal prompts. Focus shifts the rule to accent.</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, maxWidth: 900 }}>
                            <label className="field">
                                <span className="field__label">SLUG</span>
                                <input className="input-ds" placeholder="propulsion-news" defaultValue="propulsion-news" />
                                <span className="field__hint">→ propulsion-news.nertia.ai</span>
                            </label>
                            <label className="field">
                                <span className="field__label">PURPOSE</span>
                                <input className="input-ds" placeholder="// describe in one line" />
                                <span className="field__hint">↵ to confirm · esc to skip</span>
                            </label>
                            <label className="field">
                                <span className="field__label" style={{ color: 'var(--signal-red)' }}>EMAIL · INVALID</span>
                                <input className="input-ds" defaultValue="not-an-email" style={{ borderBottomColor: 'var(--signal-red)' }} />
                                <span className="field__hint" style={{ color: 'var(--signal-red)' }}>missing @</span>
                            </label>
                        </div>
                    </div>

                    {/* 09 TAGS */}
                    <div className="ds-section" id="zp-tags">
                        <div className="ds-section__head">
                            <div><div className="num">09 / TAGS</div></div>
                            <div>
                                <div className="title">TAGS.</div>
                                <div className="desc">Inline status. Use color sparingly, most metadata reads in default outline. Reserve solid ink fill for emphasis, accent for &ldquo;this matters.&rdquo;</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="tag-ds">DEFAULT</span>
                            <span className="tag-ds" data-tone="ink">INK / EMPHATIC</span>
                            <span className="tag-ds" data-tone="accent">ACCENT / HOT</span>
                            <span className="tag-ds" data-tone="success">● LIVE</span>
                            <span className="tag-ds" data-tone="warn">▲ DRAFT</span>
                            <span className="tag-ds" data-tone="danger">■ FAILED</span>
                        </div>
                    </div>

                    {/* 10 CARDS */}
                    <div className="ds-section" id="zp-cards">
                        <div className="ds-section__head">
                            <div><div className="num">10 / CARDS</div></div>
                            <div>
                                <div className="title">CARDS.</div>
                                <div className="desc">Surface 800 fill, 1px line, no shadow. Numbered top-left for series. Cards never round.</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid var(--line)' }}>
                            <div className="card-ds" style={{ border: 0, borderRight: '1px solid var(--line)' }}>
                                <div className="card-ds__head"><span className="card-ds__num">01 / GENERATOR</span><span className="tag-ds" data-tone="success">● LIVE</span></div>
                                <div className="t-h3">ZERO·POINT.</div>
                                <div className="t-body fg-muted">Free websites that emerge from a brief. Hosted on .nertia.ai. Upgrade for a custom domain.</div>
                                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}><button className="btn-ds" data-size="sm">OPEN ↗</button></div>
                            </div>
                            <div className="card-ds" style={{ border: 0, borderRight: '1px solid var(--line)' }}>
                                <div className="card-ds__head"><span className="card-ds__num">02 / GENERATOR</span><span className="tag-ds">BETA</span></div>
                                <div className="t-h3">DESIGN·SYS.</div>
                                <div className="t-body fg-muted">Industrial token systems. Brief → emerge → tune → export. JSON, CSS, Tailwind, Figma.</div>
                                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}><button className="btn-ds" data-size="sm">OPEN ↗</button></div>
                            </div>
                            <div className="card-ds" style={{ border: 0 }}>
                                <div className="card-ds__head"><span className="card-ds__num">03 / LAB</span><span className="tag-ds" data-tone="warn">UNSTABLE</span></div>
                                <div className="t-h3">LAB / WIP.</div>
                                <div className="t-body fg-muted">Snippets, prototypes, asset starters. Nothing here ships. Raw material for future builds.</div>
                                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}><button className="btn-ds" data-size="sm" data-tone="ghost">PEEK</button></div>
                            </div>
                        </div>
                    </div>

                    {/* 11 ALERTS */}
                    <div className="ds-section" id="zp-alerts">
                        <div className="ds-section__head">
                            <div><div className="num">11 / ALERTS</div></div>
                            <div>
                                <div className="title">ALERTS.</div>
                                <div className="desc">Mono body. Color through a 4px left bar, the rest of the alert stays neutral. Never a tinted background.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div className="alert-ds" data-tone="info"><span className="alert-ds__bar" /><span><b>INFO</b> · build queued. position 2 of 4. ETA 12s.</span><button className="btn-ds" data-size="sm" data-tone="ghost">DISMISS</button></div>
                            <div className="alert-ds" data-tone="success"><span className="alert-ds__bar" /><span><b>OK</b> · system locked. tokens written to /sites/propulsion-news.</span><button className="btn-ds" data-size="sm" data-tone="ghost">VIEW</button></div>
                            <div className="alert-ds" data-tone="warn"><span className="alert-ds__bar" /><span><b>WARN</b> · slug exists. appended hash → propulsion-news-3a2f.</span><button className="btn-ds" data-size="sm" data-tone="ghost">CHANGE</button></div>
                            <div className="alert-ds" data-tone="danger"><span className="alert-ds__bar" /><span><b>FAIL</b> · generation timed out. retrying with fallback model.</span><button className="btn-ds" data-size="sm">RETRY</button></div>
                        </div>
                    </div>

                    {/* 12 STATS */}
                    <div className="ds-section" id="zp-stats">
                        <div className="ds-section__head">
                            <div><div className="num">12 / STATS</div></div>
                            <div>
                                <div className="title">STATS.</div>
                                <div className="desc">Display numbers, mono labels. Delta in green/red. For dashboards and case-study evidence rows. Always grouped, singular stats look anemic.</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid var(--line)' }}>
                            <div className="stat" style={{ border: 0, borderRight: '1px solid var(--line)' }}>
                                <span className="stat__k">SITES BUILT</span>
                                <span className="stat__v">2,841</span>
                                <span className="stat__d" data-tone="up">↑ 18.2% / 30D</span>
                            </div>
                            <div className="stat" style={{ border: 0, borderRight: '1px solid var(--line)' }}>
                                <span className="stat__k">UPGRADE RATE</span>
                                <span className="stat__v">3.4<span style={{ fontSize: 24, color: 'var(--fg-quiet)' }}>%</span></span>
                                <span className="stat__d" data-tone="up">↑ 0.6 / 30D</span>
                            </div>
                            <div className="stat" style={{ border: 0, borderRight: '1px solid var(--line)' }}>
                                <span className="stat__k">P50 EMERGE</span>
                                <span className="stat__v">8.2<span style={{ fontSize: 24, color: 'var(--fg-quiet)' }}>s</span></span>
                                <span className="stat__d" data-tone="down">↓ 1.1 / 30D</span>
                            </div>
                            <div className="stat" style={{ border: 0 }}>
                                <span className="stat__k">COST / GEN</span>
                                <span className="stat__v">$0.04</span>
                                <span className="stat__d fg-quiet">FLAT / 30D</span>
                            </div>
                        </div>
                    </div>

                    {/* 13 BARS */}
                    <div className="ds-section" id="zp-bars">
                        <div className="ds-section__head">
                            <div><div className="num">13 / BARS</div></div>
                            <div>
                                <div className="title">BARS.</div>
                                <div className="desc">Horizontal bars on hairlines. Reads like a console rank. Default unit is normalized 0-100; can also stand for raw counts.</div>
                            </div>
                        </div>
                        <div style={{ maxWidth: 680 }}>
                            <div className="bar-row"><span>ZERO·POINT</span><span className="bar"><div style={{ width: '78%' }} /></span><span className="v">78%</span></div>
                            <div className="bar-row"><span>EDITORIAL</span><span className="bar"><div style={{ width: '62%', background: 'var(--signal-amber)' }} /></span><span className="v">62%</span></div>
                            <div className="bar-row"><span>BRUTALIST</span><span className="bar"><div style={{ width: '54%', background: 'var(--signal-blue)' }} /></span><span className="v">54%</span></div>
                            <div className="bar-row"><span>ORGANIC</span><span className="bar"><div style={{ width: '31%', background: 'var(--signal-green)' }} /></span><span className="v">31%</span></div>
                            <div className="bar-row"><span>TECH</span><span className="bar"><div style={{ width: '18%', background: 'var(--signal-violet)' }} /></span><span className="v">18%</span></div>
                        </div>
                    </div>

                    {/* 14 VOICE */}
                    <div className="ds-section" id="zp-voice">
                        <div className="ds-section__head">
                            <div><div className="num">14 / VOICE</div></div>
                            <div>
                                <div className="title">VOICE.</div>
                                <div className="desc">Propulsion-driven. Declarative. Technical. Applied AI GTM, not generative buzzwords. Numbers when possible. Active voice. No SaaS clichés.</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--line)' }}>
                            <div style={{ padding: 32, borderRight: '1px solid var(--line)' }}>
                                <div className="t-eyebrow fg-quiet" style={{ marginBottom: 8 }}>DO ✓</div>
                                <div className="t-h3" style={{ marginBottom: 16 }}>&ldquo;Frameworks for propulsion.&rdquo;</div>
                                <div className="t-body fg-muted">Short. Confident. Implies motion. The reader fills the meaning in.</div>
                                <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '24px 0' }} />
                                <div className="t-h3" style={{ marginBottom: 16 }}>&ldquo;4 systems emerged. Pick one.&rdquo;</div>
                                <div className="t-body fg-muted">Imperative. Numbers. Trusts the user to act.</div>
                                <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '24px 0' }} />
                                <div className="t-h3" style={{ marginBottom: 16 }}>&ldquo;Applied AI GTM pipelines.&rdquo;</div>
                                <div className="t-body fg-muted">Names the work, not the trend. Pipelines, not motions.</div>
                            </div>
                            <div style={{ padding: 32 }}>
                                <div className="t-eyebrow fg-quiet" style={{ marginBottom: 8, color: 'var(--signal-red)' }}>DON&apos;T ✕</div>
                                <div className="t-h3 fg-quiet" style={{ marginBottom: 16, textDecoration: 'line-through' }}>&ldquo;Empower your brand journey.&rdquo;</div>
                                <div className="t-body fg-muted">Empty verbs. Buzz. Says nothing.</div>
                                <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '24px 0' }} />
                                <div className="t-h3 fg-quiet" style={{ marginBottom: 16, textDecoration: 'line-through' }}>&ldquo;We&apos;ve crafted a delightful experience.&rdquo;</div>
                                <div className="t-body fg-muted">Adjective stack. First-person plural. Marketing voice.</div>
                                <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '24px 0' }} />
                                <div className="t-h3 fg-quiet" style={{ marginBottom: 16, textDecoration: 'line-through' }}>&ldquo;Synergize your go-to-market motion.&rdquo;</div>
                                <div className="t-body fg-muted">SaaS speak. &ldquo;Motion&rdquo; is filler. Pretends activity equals output.</div>
                            </div>
                        </div>
                    </div>

                    {/* 15 LOGO */}
                    <div className="ds-section" id="zp-logo">
                        <div className="ds-section__head">
                            <div><div className="num">15 / LOGO</div></div>
                            <div>
                                <div className="title">LOGO.</div>
                                <div className="desc">SF Mono Regular 12. Square-bracketed n. The mark is small, technical, copy-pasteable. Wordmark is the same letterform extended. No custom drawing, the logo is a glyph, not an illustration.</div>
                            </div>
                        </div>

                        <div className="logo-row">
                            <div className="logo-card">
                                <div className="logo-card__head">
                                    <span className="t-eyebrow fg-quiet">MARK · n.<span className="fg-accent">[n]</span></span>
                                    <span className="t-mono fg-quiet">12 / regular</span>
                                </div>
                                <div className="logo-card__stage">
                                    <svg className="logo-svg" width="36" height="14" viewBox="0 0 36 14" xmlns="http://www.w3.org/2000/svg">
                                        <text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fontWeight="400" fill="currentColor" letterSpacing="0">[n]</text>
                                    </svg>
                                </div>
                                <div className="logo-card__foot">
                                    <span className="t-mono fg-quiet">3 GLYPHS · 36 × 14 PX</span>
                                    <button
                                        className="logo-copy"
                                        data-copy={`<svg width="36" height="14" viewBox="0 0 36 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" font-family="ui-monospace, SF Mono, Menlo, monospace" font-size="12" fill="currentColor">[n]</text></svg>`}
                                    >COPY SVG</button>
                                </div>
                            </div>

                            <div className="logo-card">
                                <div className="logo-card__head">
                                    <span className="t-eyebrow fg-quiet">WORDMARK · <span className="fg-accent">[n]</span>ertia</span>
                                    <span className="t-mono fg-quiet">12 / regular</span>
                                </div>
                                <div className="logo-card__stage">
                                    <svg className="logo-svg" width="64" height="14" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg">
                                        <text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fontWeight="400" fill="currentColor" letterSpacing="0">[n]ertia</text>
                                    </svg>
                                </div>
                                <div className="logo-card__foot">
                                    <span className="t-mono fg-quiet">7 GLYPHS · 64 × 14 PX</span>
                                    <button
                                        className="logo-copy"
                                        data-copy={`<svg width="64" height="14" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" font-family="ui-monospace, SF Mono, Menlo, monospace" font-size="12" fill="currentColor">[n]ertia</text></svg>`}
                                    >COPY SVG</button>
                                </div>
                            </div>
                        </div>

                        <div className="t-eyebrow" style={{ margin: '32px 0 8px' }}>SCALE · NATIVE × 1 · 2 · 4 · 8 · 16</div>
                        <div className="logo-scale">
                            {[
                                [14, '×1', '12 PT'],
                                [28, '×2', '24 PT'],
                                [56, '×4', '48 PT'],
                                [112, '×8', '96 PT'],
                                [224, '×16', '192 PT'],
                            ].map(([h, mul, pt]) => (
                                <div className="logo-scale__cell" key={mul as string}>
                                    <div className="logo-scale__stage">
                                        <svg height={h} viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg">
                                            <text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fontWeight="400" fill="currentColor">[n]ertia</text>
                                        </svg>
                                    </div>
                                    <div className="logo-scale__label">
                                        <span className="t-mono">{mul}</span>
                                        <span className="t-mono fg-quiet">{pt}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="t-eyebrow" style={{ margin: '32px 0 8px' }}>COLOR · 6 PERMITTED CONTEXTS</div>
                        <div className="logo-treat">
                            <div className="logo-treat__cell" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                <span className="t-mono fg-quiet">ON · BG</span>
                            </div>
                            <div className="logo-treat__cell" style={{ background: 'var(--surface)', color: 'var(--fg)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                <span className="t-mono fg-quiet">ON · SURFACE</span>
                            </div>
                            <div className="logo-treat__cell" style={{ background: 'var(--ink-1000)', color: 'var(--paper-900)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                <span className="t-mono" style={{ color: 'color-mix(in oklab, currentColor 40%, transparent)' }}>ON · INK·1000</span>
                            </div>
                            <div className="logo-treat__cell" style={{ background: 'var(--paper-900)', color: 'var(--ink-1000)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                <span className="t-mono" style={{ color: 'color-mix(in oklab, currentColor 40%, transparent)' }}>ON · PAPER·900</span>
                            </div>
                            <div className="logo-treat__cell" style={{ background: 'var(--accent)', color: 'var(--paper-900)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                <span className="t-mono" style={{ color: 'color-mix(in oklab, currentColor 50%, transparent)' }}>ON · ACCENT</span>
                            </div>
                            <div className="logo-treat__cell logo-treat__cell--bad" style={{ background: 'var(--surface)', color: 'var(--fg-quiet)' }}>
                                <svg height="16" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor" opacity="0.4">[n]ertia</text></svg>
                                <span className="t-mono" style={{ color: 'var(--signal-red)' }}>DO NOT · MUTE</span>
                            </div>
                        </div>

                        <div className="logo-rules">
                            <div className="logo-rules__cell">
                                <div className="t-eyebrow fg-quiet" style={{ marginBottom: 12 }}>CLEAR SPACE · 1 GLYPH ON ALL SIDES</div>
                                <div className="logo-clear">
                                    <div className="logo-clear__inner">
                                        <svg height="14" viewBox="0 0 64 14" xmlns="http://www.w3.org/2000/svg"><text x="0" y="11" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="12" fill="currentColor">[n]ertia</text></svg>
                                    </div>
                                </div>
                                <div className="t-mono fg-quiet" style={{ marginTop: 12 }}>MIN MARGIN = 7.2 PX (1 EM AT 12)</div>
                            </div>
                            <div className="logo-rules__cell">
                                <div className="t-eyebrow fg-quiet" style={{ marginBottom: 12 }}>MISUSE · 4 PROHIBITED</div>
                                <div className="logo-dont">
                                    <div className="logo-dont__cell"><span className="logo-dont__sample" style={{ fontStyle: 'italic' }}>[n]ertia</span><span className="t-mono fg-quiet">NO ITALIC</span></div>
                                    <div className="logo-dont__cell"><span className="logo-dont__sample" style={{ fontWeight: 700 }}>[n]ertia</span><span className="t-mono fg-quiet">NO BOLD</span></div>
                                    <div className="logo-dont__cell"><span className="logo-dont__sample" style={{ letterSpacing: '0.2em' }}>[n]ertia</span><span className="t-mono fg-quiet">NO TRACKING</span></div>
                                    <div className="logo-dont__cell"><span className="logo-dont__sample" style={{ fontFamily: 'var(--f-display)', fontWeight: 700 }}>[n]ertia</span><span className="t-mono fg-quiet">NO RESET FONT</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="t-eyebrow" style={{ margin: '32px 0 8px' }}>FILES · 4 SHIPPED</div>
                        <div className="logo-files">
                            <div className="logo-files__row"><span className="t-mono">nertia-mark.svg</span><span className="t-mono fg-quiet">36 × 14</span><span className="t-mono fg-quiet">[n]</span><span className="t-mono fg-quiet">currentColor</span></div>
                            <div className="logo-files__row"><span className="t-mono">nertia-wordmark.svg</span><span className="t-mono fg-quiet">64 × 14</span><span className="t-mono fg-quiet">[n]ertia</span><span className="t-mono fg-quiet">currentColor</span></div>
                            <div className="logo-files__row"><span className="t-mono">nertia-mark@dark.svg</span><span className="t-mono fg-quiet">36 × 14</span><span className="t-mono fg-quiet">[n]</span><span className="t-mono fg-quiet">paper-900</span></div>
                            <div className="logo-files__row"><span className="t-mono">nertia-wordmark@dark.svg</span><span className="t-mono fg-quiet">64 × 14</span><span className="t-mono fg-quiet">[n]ertia</span><span className="t-mono fg-quiet">paper-900</span></div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="ds-foot">
                        <div>
                            <div className="t-label">v1.0.0 · 2026.05.04</div>
                            <div className="ds-foot__mono" style={{ marginTop: 16 }}>
                                n<span style={{ color: 'var(--accent)' }}>.</span><span style={{ color: 'var(--fg-quiet)' }}>[</span>ds<span style={{ color: 'var(--fg-quiet)' }}>]</span>
                            </div>
                        </div>
                        <div>
                            <div className="t-label">CHANGELOG</div>
                            <div style={{ marginTop: 16, lineHeight: 1.8 }}>
                                <div>v1.0.0, initial industrial direction</div>
                                <div>v0.9, color &amp; type pairings locked</div>
                                <div>v0.8, scrapped Inter-only stack</div>
                            </div>
                        </div>
                        <div>
                            <div className="t-label">NEXT</div>
                            <div style={{ marginTop: 16, lineHeight: 1.8, color: 'var(--fg)' }}>
                                <div>16 / PATTERNS, page templates</div>
                                <div>17 / DARK / LIGHT MODE PARITY</div>
                                <div>18 / MOTION TOKENS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEFT EDGE, menu toggle */}
            <button
                className="ds-edge-tab menu-tab"
                type="button"
                aria-label={menuOpen ? 'Hide menu' : 'Show menu'}
                aria-pressed={menuOpen}
                data-open={menuOpen ? 'true' : 'false'}
                onClick={toggleMenu}
            >
                <span className="ds-edge-tab__glyph">{menuOpen ? '◀' : '▶'}</span>
                <span className="ds-edge-tab__label">MENU</span>
            </button>

            {/* RIGHT EDGE, tokens drawer toggle */}
            <button className="ds-edge-tab token-tab" id="tokenTab" type="button" aria-label="Open tokens panel">
                <span className="ds-edge-tab__glyph">{'{ }'}</span>
                <span className="ds-edge-tab__label">TOKENS</span>
            </button>
            <aside className="token-drawer" id="tokenDrawer" aria-hidden="true">
                <div className="token-drawer__head">
                    <div>
                        <div className="t-eyebrow fg-quiet">INSPECTOR · LIVE</div>
                        <div className="t-h3" style={{ marginTop: 4 }}>TOKENS</div>
                    </div>
                    <button className="token-drawer__close" id="tokenClose" type="button" aria-label="Close">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M5 5l14 14M19 5L5 19" /></svg>
                    </button>
                </div>
                <div className="token-drawer__filter">
                    <input className="input-ds" id="tokenFilter" placeholder="// filter, e.g. ink, signal, s-, mono" />
                </div>
                <div className="token-drawer__hint t-mono fg-quiet">click any value to copy</div>
                <div className="token-drawer__body" id="tokenBody" />
                <div className="token-drawer__foot">
                    <span className="t-mono fg-quiet" id="tokenEditedCount">DEFAULTS</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button className="btn-ds" data-size="sm" data-tone="ghost" id="tokenReset" disabled>RESET</button>
                        <button className="btn-ds" data-size="sm" data-tone="ghost" data-export="css">CSS</button>
                        <button className="btn-ds" data-size="sm" data-tone="ghost" data-export="json">JSON</button>
                    </div>
                </div>
                <div className="token-toast" id="tokenToast" />
            </aside>
        </div>
        </div>
        </div>
    );
}

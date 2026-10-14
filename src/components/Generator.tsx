import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CONTRACT_VARS, DEFAULT_SEED, asOklch, generateContract, type Scheme } from '@/lib/generator/generate';
import { getTheme } from '@/lib/theme';
import s from './Generator.module.css';

export const GENERATOR_CAPTION = 'The generator that started Nertia: one colour in, the whole contract out.';

const HEX = /^#[0-9a-f]{6}$/i;

export function Generator() {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [draft, setDraft] = useState(DEFAULT_SEED);
  const [scheme, setScheme] = useState<Scheme>(() => (getTheme() === 'light' ? 'light' : 'dark'));
  const tokens = useMemo(() => generateContract(seed, scheme), [seed, scheme]);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    for (const k of CONTRACT_VARS) if (tokens[k]) el.style.setProperty(k, tokens[k]!);
  }, [tokens]);

  const take = (v: string) => { setDraft(v); if (HEX.test(v)) setSeed(v.toLowerCase()); };

  return (
    <figure className={s.fig} data-part="generator">
      <div className={s.controls}>
        <label className={`meta ${s.field}`}>Colour
          <input type="color" className={s.swatch} value={seed} onChange={(e) => take(e.target.value)} />
        </label>
        <label className={`meta ${s.field}`}>Hex
          <input type="text" className={`meta ${s.hex}`} value={draft} maxLength={7} spellCheck={false} onChange={(e) => take(e.target.value.trim())} aria-invalid={!HEX.test(draft)} />
        </label>
        <button type="button" className={`meta ${s.mode}`} onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')} aria-label={`Show the ${scheme === 'light' ? 'dark' : 'light'} scheme`}>[{scheme.toUpperCase()}]</button>
      </div>
      <div className={s.body}>
        <div ref={root} className={s.sample} data-part="generator-sample" data-scheme={scheme}>
          <h3 className={s.h}>A site from one colour</h3>
          <p className={s.p}>Every surface, line and partner colour here comes from the generated contract.</p>
          <span className={`meta ${s.label}`}>Label</span>
          <div className={s.btns}><a className={s.primary} href="#design-system">Primary</a><a className={s.outline} href="#design-system">Outline</a></div>
          <div className={s.card}><strong>Card</strong><span>Card surface, card border, card text.</span></div>
          <table className={s.table}><tbody><tr><td>Row</td><td>Hairline in --border</td></tr></tbody></table>
        </div>
        <dl className={`meta ${s.readout}`} data-part="generator-readout">
          {CONTRACT_VARS.map((k) => <div key={k} className={s.row}><dt>{k}</dt><dd>{asOklch(tokens[k] ?? '')}</dd></div>)}
        </dl>
      </div>
      <figcaption className="meta">{GENERATOR_CAPTION}</figcaption>
    </figure>
  );
}

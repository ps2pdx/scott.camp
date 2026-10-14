import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { DiscoveryInputs, BrandSystem } from '@/lib/brand-generator/brand-system';
import { generateDemoBrandSystem } from '@/lib/brand-generator/demo-brand-system';
import { tokensToCssVariables } from '@/lib/brand-generator/tokens-to-css';
import { generateRandomInputs, COLOR_MOODS, COLOR_BRIGHTNESS, TYPOGRAPHY_STYLES, DENSITY_PREFERENCES } from '@/lib/brand-generator/random-inputs';
import { deriveDesignDecisions, generateDecisionSummary, INDUSTRY_PROFILES, AUDIENCE_PROFILES, PERSONALITY_MAPPINGS } from '@/lib/brand-generator/decision-rules';
import s from './BrandGenerator.module.css';

export const BRAND_GENERATOR_CAPTION = 'The Zero-Point generator that started Nertia, January 2026: nine answers in, a brand system out, no model in the loop. Deterministic rules, the same answers always give the same system.';

export const DEFAULT_INPUTS: DiscoveryInputs = {
  companyName: 'Halo Smash Burgers',
  industry: 'Consumer Apps',
  targetAudience: 'consumers',
  personalityAdjectives: ['playful', 'friendly', 'bold'],
  colorMood: 'warm',
  colorBrightness: 'vibrant',
  typographyStyle: 'playful',
  densityPreference: 'balanced',
};

const INDUSTRIES = Object.keys(INDUSTRY_PROFILES);
const PERSONALITIES = Object.keys(PERSONALITY_MAPPINGS);
const AUDIENCES = Object.entries(AUDIENCE_PROFILES).map(([value, p]) => ({ value, label: p.name }));
const HEX = /^#[0-9a-f]{6}$/i;

function Sample({ system, scheme }: { system: BrandSystem; scheme: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null);
  const vars = useMemo(() => tokensToCssVariables(system, scheme), [system, scheme]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  }, [vars]);
  const v = system.voiceAndTone.examples;
  return (
    <div ref={ref} className={s.sample} data-part="brand-sample" data-scheme={scheme}>
      <span className={`meta ${s.tag}`}>{scheme}</span>
      <h3 className={s.h}>{v.headlines[0]}</h3>
      <p className={s.p}>{v.descriptions[0]}</p>
      <span className={s.label}>Display: {system.typography.fontFamily.display}</span>
      <div className={s.btns}><a className={s.primary} href="#design-system">{v.cta[0]}</a><a className={s.outline} href="#design-system">{v.cta[1]}</a></div>
      <div className={s.card}><strong>{system.metadata.name}</strong><span>{v.descriptions[1]}</span></div>
    </div>
  );
}

export function BrandGenerator() {
  const [inputs, setInputs] = useState<DiscoveryInputs>(DEFAULT_INPUTS);
  const system = useMemo(() => generateDemoBrandSystem(inputs), [inputs]);
  const summary = useMemo(() => generateDecisionSummary(deriveDesignDecisions(inputs)), [inputs]);
  const set = <K extends keyof DiscoveryInputs>(k: K, v: DiscoveryInputs[K]) => setInputs((i) => ({ ...i, [k]: v }));
  const toggle = (p: string) => {
    const has = inputs.personalityAdjectives.includes(p);
    if (has && inputs.personalityAdjectives.length <= 3) return;
    if (!has && inputs.personalityAdjectives.length >= 5) return;
    set('personalityAdjectives', has ? inputs.personalityAdjectives.filter((x) => x !== p) : [...inputs.personalityAdjectives, p]);
  };
  const audiences = AUDIENCES.some((a) => a.value === inputs.targetAudience) ? AUDIENCES : [...AUDIENCES, { value: inputs.targetAudience, label: inputs.targetAudience }];
  const c = system.colors;
  const roles = (['background', 'foreground', 'muted', 'accent', 'accentHover', 'cardBackground', 'cardBorder', 'success', 'warning', 'error'] as const).map((k) => [k, `${c[k].light} / ${c[k].dark}`]);
  const scale = Object.entries(system.typography.scale ?? {}).map(([k, v]) => [k, `${v.size}, ${v.weight}`]);
  const spacing = Object.entries(system.spacing as unknown as Record<string, unknown>).filter(([, v]) => typeof v === 'string').slice(0, 10).map(([k, v]) => [k, String(v)]);
  const radii = Object.entries(system.borders.radius as unknown as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
  const motion = [['interactions', Object.keys(system.motion.interactions ?? {}).join(', ')], ['easing', Object.keys(system.motion.easing).join(', ')], ['duration', Object.keys(system.motion.duration).join(', ')]];

  return (
    <figure className={s.fig} data-part="brand-generator">
      <form className={s.form} onSubmit={(e) => e.preventDefault()} aria-label="Brand system intake">
        <label className={`meta ${s.field}`}>Company<input className={s.input} value={inputs.companyName} onChange={(e) => set('companyName', e.target.value)} /></label>
        <label className={`meta ${s.field}`}>Industry<select className={s.input} value={inputs.industry} onChange={(e) => set('industry', e.target.value)}>{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className={`meta ${s.field}`}>Audience<select className={s.input} value={inputs.targetAudience} onChange={(e) => set('targetAudience', e.target.value)}>{audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></label>
        <fieldset className={s.chips}><legend className="meta">Personality, 3 to 5</legend>{PERSONALITIES.map((p) => <button key={p} type="button" className={`meta ${s.chip}`} aria-pressed={inputs.personalityAdjectives.includes(p)} onClick={() => toggle(p)}>{p}</button>)}</fieldset>
        <label className={`meta ${s.field}`}>Colour mood<select className={s.input} value={inputs.colorMood} onChange={(e) => set('colorMood', e.target.value as DiscoveryInputs['colorMood'])}>{COLOR_MOODS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className={`meta ${s.field}`}>Brightness<select className={s.input} value={inputs.colorBrightness} onChange={(e) => set('colorBrightness', e.target.value as DiscoveryInputs['colorBrightness'])}>{COLOR_BRIGHTNESS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className={`meta ${s.field}`}>Type style<select className={s.input} value={inputs.typographyStyle} onChange={(e) => set('typographyStyle', e.target.value as DiscoveryInputs['typographyStyle'])}>{TYPOGRAPHY_STYLES.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className={`meta ${s.field}`}>Density<select className={s.input} value={inputs.densityPreference} onChange={(e) => set('densityPreference', e.target.value as DiscoveryInputs['densityPreference'])}>{DENSITY_PREFERENCES.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className={`meta ${s.field}`}>Brand hex, optional<input className={s.input} value={inputs.existingBrandColor ?? ''} maxLength={7} spellCheck={false} placeholder="#" aria-invalid={Boolean(inputs.existingBrandColor) && !HEX.test(inputs.existingBrandColor ?? '')} onChange={(e) => set('existingBrandColor', e.target.value.trim() || undefined)} /></label>
        <button type="button" className={`meta ${s.random}`} onClick={() => setInputs(generateRandomInputs())}>Random</button>
      </form>
      <pre className={`meta ${s.summary}`} data-part="brand-summary">{summary}</pre>
      <div className={s.samples}><Sample system={system} scheme="light" /><Sample system={system} scheme="dark" /></div>
      <p className={`transcript ${s.voice}`} data-part="brand-voice">{system.voiceAndTone.examples.headlines[0]}. {system.voiceAndTone.examples.cta[0]}.</p>
      <dl className={`transcript ${s.readout}`} data-part="brand-readout">
        {[['Colour roles, light / dark', roles], ['Type scale', scale], ['Spacing', spacing], ['Radii', radii], ['Animation presets', motion]].map(([group, rows]) => (
          <div key={group as string} className={s.group}>
            <dt className="meta">{group as string}</dt>
            {(rows as string[][]).map(([k, v]) => <dd key={k} className={s.row}><span>{k}</span><span>{v}</span></dd>)}
          </div>
        ))}
      </dl>
      <figcaption className="meta">{BRAND_GENERATOR_CAPTION}</figcaption>
    </figure>
  );
}

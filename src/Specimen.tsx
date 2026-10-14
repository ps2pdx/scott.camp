import type { ReactNode } from 'react';
import { COPY, SECTIONS } from '@/content/copy';
import { TEXTURES, provenance } from '@/content/textures';
import { PunchFilterDefs, Punches } from '@/components/Punches';
import { VolumeFace } from '@/components/VolumeFace';
import { Transcript } from '@/components/Transcript';
import { Index } from '@/components/Index';
import { Surface } from '@/components/Surface';
import { Button } from '@/components/Button';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSheet } from '@/components/TechSheet';
import { SpineBand } from '@/components/SpineRail';
import { Disclosure } from '@/components/Disclosure';
import { Plate, Spin } from '@/components/Evidence';
import s from './Specimen.module.css';

export const LIVING_LINE = 'Living documentation. Every part the site uses is shown here first.';

type Mode = 'dark' | 'light';
const SURFACES = [
  { key: 'ink', name: 'Ink', value: '#000000' },
  { key: 'eggshell', name: 'Eggshell, light page', value: '#f3f1ea' },
  { key: 'white', name: 'White, holes and sheets', value: '#ffffff' },
  { key: 'board', name: 'Board', value: 'var(--s-board)' },
  { key: 'endpaper', name: 'Endpaper', value: 'var(--s-endpaper)' },
  { key: 'cloth', name: 'Cloth', value: '#2bf52b' },
] as const;

const ts = COPY.terpscout.evidence;

export const PARTS: { caption: string; render: (mode: Mode) => ReactNode }[] = [
  { caption: 'Surfaces', render: () => <div className={s.swatches}>{SURFACES.map((x) => <div key={x.key} data-surface={x.key} className="meta-sm">{x.name}{x.value.startsWith('#') ? <><br />{x.value}</> : null}</div>)}</div> },
  { caption: 'Volume face, OG and favicon', render: (mode) => (
    <div className={s.faces}>
      <div id={mode === 'dark' ? 'og-face' : undefined}><VolumeFace no={COPY.volumes.hero.no} name={COPY.volumes.hero.name} year={COPY.volumes.hero.year} /></div>
      <VolumeFace no="12" name="Zen Holo" year="2026" />
      <div id={mode === 'dark' ? 'favicon-face' : undefined}><VolumeFace no="0" name="" year="" size="favicon" /></div>
    </div>
  ) },
  { caption: 'Textures, with provenance', render: () => <div className={s.tiles}>{TEXTURES.map((t) => <div key={t.file}><div className={s.tile} data-tile={t.file} /><div className="meta-sm muted">{provenance(t)}</div></div>)}</div> },
  { caption: 'Type', render: () => (
    <>
      <div className={`display ${s.display}`}>Display 700</div>
      <div className="display t-title">Title, uppercase, -0.02em</div>
      <p className="text t-lead">Lead. Helvetica Neue, as written, 400.</p>
      <p className="text t-body">Body. One idea per sentence. No italics, no weight between 400 and 700.</p>
      <div className="meta">Meta · Courier New · uppercase · 0.04em</div>
      <div className="transcript">Transcript. Courier New, as written, 1.5. 10/13/26 11:05:00 PM</div>
    </>
  ) },
  { caption: 'Type ink: nav label 0.5 px bleed, button label 0.3 px, without for comparison', render: () => (
    <div className={s.ink}>
      <span className="meta-sm">Vantage, no bleed</span><span className="meta-sm bleed-nav">Vantage, 0.5 px bleed</span>
      <span className={`${s.inkBtn}`}>Email me, no bleed</span><span className={`bleed-btn ${s.inkBtn}`}>Email me, 0.3 px bleed</span>
    </div>
  ) },
  { caption: 'Spine band, phones, above the nav', render: () => <SpineBand className={s.band} /> },
  { caption: 'Punch nav, numbered cells, titles as names', render: () => (
    <>
      <Punches />
      <div className={s.cells}>{SECTIONS.map((x, i) => <a key={x.id} href={`#${x.id}`} aria-label={x.label} title={x.label} className={`meta-sm ${s.cell}`} {...(i === 0 ? { 'aria-current': 'location' as const } : {})}>{String(i + 1).padStart(2, '0')}</a>)}</div>
    </>
  ) },
  { caption: 'Divider cut, 2 px over the spine', render: () => (
    <div className={s.cutDemo} data-part="cut-demo">
      <div className={`meta-sm ${s.cutBlock}`}>Section above</div>
      <div className={`cut meta-sm ${s.cutBlock}`}>Section below, cut</div>
    </div>
  ) },
  { caption: 'Transcript', render: () => <Transcript rows={[{ when: '10/21/16', who: 'Virgil', text: 'The theory is to underline its existence by being specific.' }, { when: '[DATE]', who: 'Scott', text: 'Every row is dated with the real date of the thing.' }]} /> },
  { caption: 'Index, the yellow page edge to edge, struck rows', render: () => <Surface kind="endpaper" className={s.yellow}><Index rows={COPY.work.index.slice(6, 9)} /></Surface> },
  { caption: 'Cloth button, one weave across the box, and states', render: (mode) => (
    <>
      <div className={s.btns}>
        <Button href="#r" variant="primary">Rest</Button>
        <span className={s.hover}><Button href="#h" variant="primary">Hover</Button></span>
        <span className={s.focus}><Button href="#f" variant="primary">Focus</Button></span>
        <span className={s.disabled}><Button href="#d" variant="primary">Disabled</Button></span>
      </div>
      <div className={s.btns}>
        <Button href="#r" variant="secondary">Secondary</Button>
        <a href="#l">Text link ↗</a>
        <span className="meta">[{mode.toUpperCase()}]</span>
      </div>
    </>
  ) },
  { caption: 'Evidence figure, stacked, caption beneath', render: () => <div className={s.stack}><Plate e={COPY.practice.evidence[0]} /></div> },
  { caption: 'Identity mark, white tile, both modes', render: () => <div className={s.marks}><Plate e={ts.shown[0]} /><Plate e={COPY.nertia.mark} /></div> },
  { caption: 'Disclosure summary row, video figure with poster inside', render: () => <Disclosure summary={ts.gated.summary}><Spin clip={ts.gated.spin} /></Disclosure> },
  { caption: 'Spec sheet and tech sheet', render: () => (
    <div className={s.pair}>
      <SpecSheet sheet={COPY.work.sheets[1]} volume={{ no: '09', name: '', year: '2026' }} />
      <TechSheet data={COPY.work.tech[1]} />
    </div>
  ) },
];

function Half({ mode }: { mode: Mode }) {
  return (
    <div className={`${s.half} ${s[mode]}`} data-mode={mode}>
      {PARTS.map((p) => <section key={p.caption} className={s.part}><h2 className="meta">{p.caption === 'Surfaces' ? `Surfaces, ${mode}` : p.caption}</h2>{p.render(mode)}</section>)}
    </div>
  );
}

export function Specimen() {
  return (
    <>
      <p className={`meta ${s.living}`}>{LIVING_LINE}</p>
      <div className={s.sp}><PunchFilterDefs /><Half mode="dark" /><Half mode="light" /></div>
    </>
  );
}

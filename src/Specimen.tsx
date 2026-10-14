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
import { SpineBand, SpineReveal } from '@/components/SpineRail';
import { Disclosure } from '@/components/Disclosure';
import { Plate, Spin } from '@/components/Evidence';
import { ToolTape } from '@/components/ToolTape';
import s from './Specimen.module.css';

export const LIVING_LINE = 'Living documentation. Every part the site uses is shown here first.';

type Part = { group: string; name: string; tokens: string; render: () => ReactNode };

const SURFACES = [
  { key: 'ink', name: 'Ink', value: '#000000' },
  { key: 'eggshell', name: 'Eggshell', value: '#f3f1ea' },
  { key: 'white', name: 'White', value: '#ffffff' },
  { key: 'board', name: 'Board', value: '' },
  { key: 'endpaper', name: 'Endpaper', value: '' },
  { key: 'cloth', name: 'Cloth', value: '#2bf52b' },
] as const;
const SPACE = [1, 2, 3, 4, 5, 6, 7, 8];
const ts = COPY.terpscout.evidence;
const tile = (file: string) => TEXTURES.find((t) => t.file === file)!;

const swatches = (mode: 'dark' | 'light') => (
  <div className={`${s.mode} ${s[mode]}`} data-mode={mode}>
    <span className="meta">{mode}</span>
    <div className={s.swatches}>{SURFACES.map((x) => <div key={x.key} data-surface={x.key} className="meta">{x.name}{x.value ? <><br />{x.value}</> : null}</div>)}</div>
  </div>
);

export const PARTS: Part[] = [
  { group: 'Surfaces', name: 'Surfaces, dark and light', tokens: '--s-ink --s-page --s-white --s-board --s-endpaper --s-cloth --bg --hole --sheet', render: () => <div className={s.pair}>{swatches('dark')}{swatches('light')}</div> },

  { group: 'Type', name: 'Display', tokens: '.display .t-display --t-display, fluid', render: () => <div className="display t-display">Something Click'd</div> },
  { group: 'Type', name: 'Title', tokens: '.display .t-title --t-title, 28 px, 20 px on phones', render: () => <div className="display t-title">Five live sites</div> },
  { group: 'Type', name: 'Text', tokens: '.text --t-text, 18 px, 16 px on phones', render: () => <p className="text">Lead paragraphs and card bodies. One idea per sentence.</p> },
  { group: 'Type', name: 'Meta', tokens: '.meta --t-meta, 13 px, 11 px on phones, uppercase', render: () => <div className="meta">Eyebrows, nav, captions, tables, buttons</div> },
  { group: 'Type', name: 'Transcript', tokens: '.transcript --t-meta, sentence case', render: () => <div className="transcript">10/13/26 11:05:00 PM. Every row is dated with the real date of the thing.</div> },
  { group: 'Type', name: 'Type ink', tokens: '.bleed-nav 0.5 px, .bleed-btn 0.3 px, text-shadow in the text colour', render: () => (
    <div className={s.ink}>
      <span className="meta">Vantage, no bleed</span><span className="meta bleed-nav">Vantage, 0.5 px bleed</span>
    </div>
  ) },

  { group: 'Spacing', name: 'Spacing scale', tokens: '--s-1 to --s-8', render: () => <div className={s.space}>{SPACE.map((n) => <div key={n} className={s.spaceRow}><span className="meta">--s-{n}</span><span className={s.bar} data-s={n} /></div>)}</div> },

  { group: 'Marks', name: 'TerpScout mark, white tile', tokens: '.mark 120 px, 96 px on phones, #ffffff', render: () => <Plate e={ts.shown[0]} /> },
  { group: 'Marks', name: 'Nertia mark, white tile', tokens: '.mark 120 px, 96 px on phones, #ffffff', render: () => <Plate e={COPY.nertia.mark} /> },
  { group: 'Marks', name: 'Volume face, OG and favicon', tokens: '.display .t-title, recto #f5e04a', render: () => (
    <div className={s.faces}>
      <div id="og-face"><VolumeFace no={COPY.volumes.hero.no} name={COPY.volumes.hero.name} year={COPY.volumes.hero.year} /></div>
      <div id="favicon-face"><VolumeFace no="0" name="" year="" size="favicon" /></div>
    </div>
  ) },

  { group: 'Controls', name: 'Cloth button, rest, hover, focus, disabled', tokens: '.chip .meta .bleed-btn, cloth.webp, --focus', render: () => (
    <div className={s.row}>
      <Button href="#r" variant="primary">Rest</Button>
      <span className={s.hover}><Button href="#h" variant="primary">Hover</Button></span>
      <span className={s.focus}><Button href="#f" variant="primary">Focus</Button></span>
      <span className={s.disabled}><Button href="#d" variant="primary">Disabled</Button></span>
    </div>
  ) },
  { group: 'Controls', name: 'Secondary button and text link', tokens: '.meta --line-strong', render: () => <div className={s.row}><Button href="#r" variant="secondary">Secondary</Button><a href="#l" className="meta">Text link ↗</a></div> },
  { group: 'Controls', name: 'Punch nav, numbered cells, titles as names', tokens: '.meta .bleed-nav --hole --line-strong', render: () => (
    <div>
      <Punches />
      <div className={s.cells}>{SECTIONS.map((x, i) => <a key={x.id} href={`#${x.id}`} aria-label={x.label} title={x.label} className={`meta bleed-nav ${s.cell}`} {...(i === 0 ? { 'aria-current': 'location' as const } : {})}>{String(i + 1).padStart(2, '0')}</a>)}</div>
    </div>
  ) },
  { group: 'Controls', name: 'Tools strip, tape over the section edge, -2 degrees', tokens: '.meta --tape --tape-ink --s-6, 90 s loop, paused on hover', render: () => <div className={s.tapeDemo}><ToolTape items={COPY.nertia.tools} /></div> },
  { group: 'Controls', name: 'Disclosure summary row', tokens: '.meta --line-strong, closed by default', render: () => <Disclosure summary="Disclosure, closed by default"><Plate e={COPY.practice.evidence[1]} /></Disclosure> },

  ...TEXTURES.filter((t) => t.file !== 'chip').map((t): Part => ({ group: 'Textures', name: `${t.name} tile`, tokens: provenance(t), render: () => <div className={s.tile} data-tile={t.file} /> })),
  { group: 'Textures', name: 'Spine band, phones, above the nav', tokens: `spine-band.webp, ${provenance(tile('spine'))}`, render: () => <SpineBand className={s.band} /> },
  { group: 'Textures', name: 'Divider cut, 2 px over the spine', tokens: '.cut --strike', render: () => (
    <div className={s.cutDemo} data-part="cut-demo">
      <div className={`meta ${s.cutBlock}`}>Section above</div>
      <div className={`cut meta ${s.cutBlock}`}>Section below, cut</div>
    </div>
  ) },

  { group: 'Figures', name: 'Evidence figure, image, caption beneath', tokens: '.plate .meta', render: () => <Plate e={COPY.practice.evidence[0]} /> },
  { group: 'Figures', name: 'Video figure with poster, inside the age gate', tokens: '.spin, 480 px, 52vh, preload none', render: () => <Disclosure summary={ts.gated.summary}><Spin clip={ts.gated.spin} /></Disclosure> },

  { group: 'Tables', name: 'Index rows, the yellow page', tokens: '.meta --s-endpaper --strike', render: () => <Surface kind="endpaper" className={s.yellow}><Index rows={COPY.work.index.slice(6, 9)} /></Surface> },
  { group: 'Tables', name: 'Transcript row', tokens: '.transcript --t-meta', render: () => <Transcript rows={[{ when: '10/21/16', who: 'Virgil', text: 'The theory is to underline its existence by being specific.' }]} /> },
  { group: 'Tables', name: 'Spec sheet', tokens: '.meta fields, .t-title, .text, --sheet', render: () => <div className={s.sheet}><SpecSheet sheet={COPY.work.sheets[1]} volume={{ no: '09', name: 'Pure Zero Photography', year: '2026' }} /></div> },
  { group: 'Tables', name: 'Tech sheet', tokens: '.meta in a viewBox that tracks its width, --tech --tech-ink', render: () => <div className={s.sheet480}><TechSheet data={COPY.work.tech[4]} /></div> },
];

const GROUPS = [...new Set(PARTS.map((p) => p.group))];

export function Specimen() {
  return (
    <>
      <PunchFilterDefs />
      <SpineReveal />
      <main className={s.sp}>
        <p className={`meta ${s.living}`}>{LIVING_LINE}</p>
        {GROUPS.map((g) => (
          <section key={g} className={`cut ${s.group}`} aria-label={g}>
            <h2 className={`meta muted ${s.groupName}`}>{g}</h2>
            {PARTS.filter((p) => p.group === g).map((p) => (
              <div key={p.name} className={s.part} data-part-name={p.name}>
                <div className={s.specimen}>{p.render()}</div>
                <div className={s.labels}><h3 className="meta">{p.name}</h3><span className="meta muted">{p.tokens}</span></div>
              </div>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}

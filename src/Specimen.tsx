import { COPY, SECTIONS } from '@/content/copy';
import { TEXTURES, provenance } from '@/content/textures';
import { PunchFilterDefs, Punches } from '@/components/Punches';
import { VolumeFace } from '@/components/VolumeFace';
import { Transcript } from '@/components/Transcript';
import { Index } from '@/components/Index';
import { Button } from '@/components/Button';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSheet } from '@/components/TechSheet';
import s from './Specimen.module.css';

const SURFACES = ['Ink', 'Page', 'Board', 'Endpaper', 'Cloth'] as const;

function Half({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div className={`${s.half} ${s[mode]}`} data-mode={mode}>
      <h2 className="meta">Surfaces, {mode}</h2>
      <div className={s.swatches}>{SURFACES.map((n) => <div key={n} data-surface={n.toLowerCase()} className="meta-sm">{n}</div>)}</div>
      <h2 className="meta">Volume face, OG and favicon</h2>
      <div className={s.faces}>
        <div id={mode === 'dark' ? 'og-face' : undefined}><VolumeFace no={COPY.volumes.hero.no} name={COPY.volumes.hero.name} year={COPY.volumes.hero.year} /></div>
        <VolumeFace no="12" name="Zen Holo" year="2026" />
        <div id={mode === 'dark' ? 'favicon-face' : undefined}><VolumeFace no="0" name="" year="" size="favicon" /></div>
      </div>
      <h2 className="meta">Textures, with provenance</h2>
      <div className={s.tiles}>{TEXTURES.map((t) => <div key={t.file}><div className={s.tile} data-tile={t.file} /><div className="meta-sm muted">{provenance(t)}</div></div>)}</div>
      <h2 className="meta">Type</h2>
      <div className={`display ${s.display}`}>Display 700</div>
      <div className="display t-title">Title, uppercase, -0.02em</div>
      <p className="text t-lead">Lead. Helvetica Neue, as written, 400.</p>
      <p className="text t-body">Body. One idea per sentence. No italics, no weight between 400 and 700.</p>
      <div className="meta">Meta · Courier New · uppercase · 0.04em</div>
      <div className="transcript">Transcript. Courier New, as written, 1.5. 10/13/26 11:05:00 PM</div>
      <h2 className="meta">Punch nav</h2>
      <Punches />
      <div className={s.cells}>{SECTIONS.map((x, i) => <a key={x.id} href={`#${x.id}`} className={`meta-sm ${s.cell}`} {...(i === 0 ? { 'aria-current': 'location' as const } : {})}>{x.label}</a>)}</div>
      <h2 className="meta">Transcript</h2>
      <Transcript rows={[{ when: '10/21/16', who: 'Virgil', text: 'The theory is to underline its existence by being specific.' }, { when: '[DATE]', who: 'Scott', text: 'Every row is dated with the real date of the thing.' }]} />
      <h2 className="meta">Index, struck rows</h2>
      <Index rows={COPY.work.index.slice(6, 9)} />
      <h2 className="meta">Buttons and states</h2>
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
      <h2 className="meta">Spec sheet and tech sheet</h2>
      <div className={s.pair}>
        <SpecSheet sheet={COPY.work.sheets[1]} volume={{ no: '09', year: '2026' }} />
        <TechSheet data={COPY.work.tech[1]} />
      </div>
    </div>
  );
}

export function Specimen() {
  return (<div className={s.sp}><PunchFilterDefs /><Half mode="dark" /><Half mode="light" /></div>);
}

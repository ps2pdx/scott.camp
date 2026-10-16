import { ABOUT, BATTLEZONE_ABOUT, COPY, SPECIMEN_ABOUT } from '@/content/copy';
import { Plate } from '@/components/Evidence';
import { SpecimenPlate } from '@/components/SpecimenPlate';

const butterfly = () => import('@/lib/specimens/ButterflyRing');
const slit = () => import('@/lib/specimens/DoubleSlit');
import { AboutBox } from '@/components/AboutBox';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import { width } from '@/components/Grid';
import { TechSlider } from '@/components/TechSlider';
import { DataTable } from '@/components/DataTable';
import { BrandGenerator } from '@/components/BrandGenerator';
import { ZeroPointFrame } from '@/components/ZeroPointFrame';
import { Block } from './Block';
import s from './sections.module.css';

export function NertiaSection() {
  const n = COPY.nertia;
  return (
    <Section id="nertia" tools={n.tools} mark={n.mark} runningHead={n.runningHead} eyebrow={n.eyebrow} lead={n.lead}>
      <Block label="Decisions" note={n.notes.decisions} first><Transcript rows={n.rows} /></Block>
      <TechSlider label="Tech sheets" note={n.notes.tech} sheets={n.tech} />
      <AboutBox about={ABOUT.nertia} className={`${width.figure} ${s.block}`} />
      <Block label={n.evolution.title} part="zero-point-evolution">
        <p className={`transcript ${width.text}`}>{n.evolution.steps[0]}</p>
        <div className={s.stack} data-part="battlezone">
          {n.evolution.battlezone.figures.map((e) => <Plate key={e.src} e={e} />)}
          <AboutBox about={BATTLEZONE_ABOUT} className={width.figure} />
          <p className="transcript"><a href={n.evolution.battlezone.link.href}>{n.evolution.battlezone.link.label} ↗</a></p>
        </div>
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[1]}</p>
        <BrandGenerator />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[2]}</p>
        <SpecimenPlate part="specimen-butterfly" load={butterfly} label={n.evolution.specimens.butterfly.label} about={SPECIMEN_ABOUT.butterfly} />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[3]}</p>
        <SpecimenPlate part="specimen-slit" load={slit} label={n.evolution.specimens.slit.label} about={SPECIMEN_ABOUT.slit} />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[4]}</p>
        <ZeroPointFrame caption={n.evolution.frameCaption} />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[5]}</p>
      </Block>
      <Block label="Skin contract" note={n.contract.lead}><DataTable kind="tiers" label="Skin contract tokens by tier" rows={n.contract.tiers} /></Block>
      <Block label="Tools that act on the system" note={n.notes.tools}>
        <DataTable kind="tools" label="MCP tools that act on the design system or publish" rows={n.contract.tools} />
        <p className="transcript"><a href={n.contract.link.href}>{n.contract.link.label} ↗</a></p>
      </Block>
      <p className={`transcript ${width.text} ${s.block}`}>{n.codeSiteLine} <a href={n.source.href}>{n.source.label} ↗</a></p>
    </Section>
  );
}

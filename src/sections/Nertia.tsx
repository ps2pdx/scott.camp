import { COPY } from '@/content/copy';
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
    <Section id="nertia" tools={n.tools} mark={n.mark} runningHead={n.runningHead} eyebrow={n.eyebrow} title={n.title} lead={n.lead}>
      <Block label="Decisions" note={n.notes.decisions} first><Transcript rows={n.rows} /></Block>
      <TechSlider label="Tech sheets" note={n.notes.tech} sheets={n.tech} />
      <Block label={n.evolution.title} part="zero-point-evolution">
        <p className={`transcript ${width.text}`}>{n.evolution.steps[0]}</p>
        <BrandGenerator />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[1]}</p>
        <ZeroPointFrame caption={n.evolution.frameCaption} />
        <p className={`transcript ${width.text} ${s.step}`}>{n.evolution.steps[2]}</p>
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

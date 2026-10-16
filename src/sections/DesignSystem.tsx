import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import { width } from '@/components/Grid';
import { DataTable } from '@/components/DataTable';
import { BookFigure, FigurePair, SurfaceRow, TextureList, TypeStack } from '@/components/DesignStudy';
import { Block } from './Block';
import s from './sections.module.css';

export function DesignSystemSection() {
  const d = COPY.designSystem;
  return (
    <Section id="design-system" tools={d.watermark} runningHead={d.runningHead} lead={d.lead} figure={<BookFigure />}>
      <Block label="Surfaces" first><SurfaceRow /></Block>
      <Block label="Textures" note={d.texturesLine}><TextureList /></Block>
      <Block label="Type" note={d.typeLine}><TypeStack /></Block>
      <Block label="Signature components"><Transcript rows={d.signature} /></Block>
      <Block label="Designed, then built"><FigurePair /></Block>
      <p className={`transcript ${width.text} ${s.block}`}>{d.closing.line} <a href={d.closing.href}>{d.closing.label} ↗</a></p>
      <Block label="Token tiers"><DataTable kind="tiers" label="This site's tokens by tier" rows={d.tiers} /></Block>
    </Section>
  );
}

import { ABOUT, COPY } from '@/content/copy';
import { AboutBox } from '@/components/AboutBox';
import { width } from '@/components/Grid';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import s from './sections.module.css';

export function VantageSection() {
  const v = COPY.vantage;
  return (
    <Section id="vantage" tools={v.tools} mark={v.mark} runningHead={v.runningHead} eyebrow={v.eyebrow} lead={v.lead}>
      <Transcript rows={v.rows} />
      <AboutBox about={ABOUT.vantage} className={`${width.figure} ${s.block}`} />
      <p className={`transcript ${s.block}`}><a href={v.caseStudy.href}>{v.caseStudy.label} ↗</a></p>
    </Section>
  );
}

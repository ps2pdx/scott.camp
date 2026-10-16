import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { width } from '@/components/Grid';
import { TechSlider } from '@/components/TechSlider';
import { WorkSheet, workNo } from '@/components/WorkSheet';
import s from './sections.module.css';

export function WorkSection() {
  const w = COPY.work;
  return (
    <Section id="work" tools={w.tools} runningHead={w.runningHead} eyebrow={w.eyebrow} lead={w.lead}>
      <div className={s.stack} data-part="work-sheets">{w.sheets.map((sh, i) => <div key={sh.title} className={width.figure}><WorkSheet sheet={sh} no={workNo(i)} /></div>)}</div>
      <TechSlider label="Tech sheets" note={w.techNote} sheets={w.tech} />
    </Section>
  );
}

import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { Grid } from '@/components/Grid';
import { TechSlider } from '@/components/TechSlider';
import { WorkSheet, workNo } from '@/components/WorkSheet';

export function WorkSection() {
  const w = COPY.work;
  return (
    <Section id="work" tools={w.tools} runningHead={w.runningHead} eyebrow={w.eyebrow} title={w.title}>
      <Grid columns={2}>{w.sheets.map((sh, i) => <WorkSheet key={sh.title} sheet={sh} no={workNo(i)} />)}</Grid>
      <TechSlider label="Tech sheets" note={w.techNote} sheets={w.tech} />
    </Section>
  );
}

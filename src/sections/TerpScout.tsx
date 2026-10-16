import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import { Disclosure } from '@/components/Disclosure';
import { Plate, Spin } from '@/components/Evidence';

export function TerpScoutSection() {
  const t = COPY.terpscout;
  const g = t.evidence.gated;
  return (
    <Section id="terpscout" tools={t.tools} mark={t.mark} runningHead={t.runningHead} eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <Transcript rows={t.rows} />
      <Disclosure summary={g.summary}>
        <Spin clip={g.spin} />
        <Spin clip={g.reel} />
        {g.stills.map((e) => <Plate key={e.src} e={e} />)}
      </Disclosure>
    </Section>
  );
}

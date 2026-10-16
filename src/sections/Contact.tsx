import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import { Button } from '@/components/Button';
import { Consulting } from '@/components/Consulting';
import { Portrait } from '@/components/Mark';
import s from './sections.module.css';

export function ContactSection() {
  const c = COPY.contact;
  return (
    <Section id="contact" runningHead={c.runningHead} eyebrow={c.eyebrow} lead={c.lead} portrait={<Portrait p={c.portrait} />}>
      <Transcript rows={c.rows} render={(r) => <a href={r.when === 'Email' ? c.links.email : c.links.phone}>{r.text}</a>} />
      <div className={`${s.btns} ${s.block}`}><Button href={c.resume.href} variant="primary" bracket={c.resume.bracket} download>{c.resume.label}</Button></div>
      <Consulting className={s.block} />
    </Section>
  );
}

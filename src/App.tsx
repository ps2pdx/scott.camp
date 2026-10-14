import { COPY, SECTIONS } from '@/content/copy';
import { PunchFilterDefs } from '@/components/Punches';
import { PunchNav } from '@/components/PunchNav';
import { SpineBand, SpineRail, SpineReveal } from '@/components/SpineRail';
import { Section } from '@/components/Section';
import { Cover } from '@/components/Cover';
import { Label } from '@/components/Label';
import { Transcript } from '@/components/Transcript';
import { Button } from '@/components/Button';
import { Grid } from '@/components/Grid';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSheet } from '@/components/TechSheet';
import { Index } from '@/components/Index';
import { Footer } from '@/components/Footer';
import { Plate, Spin } from '@/components/Evidence';
import { Disclosure } from '@/components/Disclosure';
import s from './App.module.css';

const vol = (no: string) => COPY.work.index.find((r) => r.no === no)!;
const practiceSheets = COPY.practice.sheets.filter((sh) => !sh.placeholder);

export function App() {
  const h = COPY.hero;
  const ts = COPY.terpscout.evidence;
  return (
    <>
      <PunchFilterDefs />
      <SpineReveal />
      <Cover id="hero" />
      <SpineRail />
      <SpineBand />
      <PunchNav sections={SECTIONS} />
      <main>
        <Section id="endpapers" surface="endpaper">
          <p className={`text ${s.lead}`}>{h.lead}</p>
          <Transcript rows={h.facts} tight className={s.after} />
          <Transcript rows={[COPY.endpapers.virgil]} className={s.after} />
          <div className={s.index}><Index rows={COPY.work.index} /></div>
        </Section>

        <Section id="vantage" tools={COPY.vantage.tools} mark={COPY.vantage.mark} runningHead={COPY.vantage.runningHead} eyebrow={COPY.vantage.eyebrow} title={COPY.vantage.title} lead={COPY.vantage.lead}>
          <Transcript rows={COPY.vantage.rows} />
          <p className={`transcript ${s.after}`}><a href={COPY.vantage.caseStudy.href}>{COPY.vantage.caseStudy.label} ↗</a></p>
        </Section>

        <Section id="nertia" tools={COPY.nertia.tools} mark={COPY.nertia.mark} runningHead={COPY.nertia.runningHead} eyebrow={COPY.nertia.eyebrow} title={COPY.nertia.title} lead={COPY.nertia.lead}>
          <Transcript rows={COPY.nertia.rows} />
          <div className={s.techBlock}>
            <Label>Tech sheets</Label>
            <div className={s.techGrid}>{COPY.nertia.tech.map((t) => <TechSheet key={t.sheet} data={t} />)}</div>
          </div>
          <p className={`transcript ${s.after}`}>{COPY.nertia.codeSiteLine} <a href={COPY.nertia.source.href}>{COPY.nertia.source.label} ↗</a></p>
          <p className={`transcript ${s.next}`}>{COPY.nertia.docs.line} <a href={COPY.nertia.docs.href}>{COPY.nertia.docs.label} ↗</a></p>
        </Section>

        <Section id="work" tools={COPY.work.tools} runningHead={COPY.work.runningHead} eyebrow={COPY.work.eyebrow} title={COPY.work.title}>
          <Grid columns={2}>{COPY.work.sheets.map((sh, i) => { const v = vol(String(7 + i).padStart(2, '0')); return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid>
          <div className={s.techBlock}>
            <Label>Tech sheets</Label>
            <div className={s.techGrid}>{COPY.work.tech.map((t) => <TechSheet key={t.sheet} data={t} />)}</div>
          </div>
        </Section>

        <Section id="terpscout" tools={COPY.terpscout.tools} mark={COPY.terpscout.mark} runningHead={COPY.terpscout.runningHead} eyebrow={COPY.terpscout.eyebrow} title={COPY.terpscout.title} lead={COPY.terpscout.lead}>
          <Transcript rows={COPY.terpscout.rows} />
          <Disclosure summary={ts.gated.summary}>
            <Spin clip={ts.gated.spin} />
            <Spin clip={ts.gated.reel} />
            {ts.gated.stills.map((e) => <Plate key={e.src} e={e} />)}
          </Disclosure>
        </Section>

        <Section id="practice" tools={COPY.practice.tools} surface="board" runningHead={COPY.practice.runningHead} eyebrow={COPY.practice.eyebrow} title={COPY.practice.title}>
          {practiceSheets.length ? <Grid columns={2}>{practiceSheets.map((sh) => { const v = COPY.work.index.find((r) => r.name === sh.title)!; return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid> : null}
          <Transcript rows={COPY.practice.rows} className={practiceSheets.length ? s.after : undefined} />
          <div className={s.stack}>
            {COPY.practice.evidence.map((e) => <Plate key={e.src} e={e} />)}
          </div>
        </Section>

        <Section id="contact" runningHead={COPY.contact.runningHead} eyebrow={COPY.contact.eyebrow} title={COPY.contact.title} lead={COPY.contact.lead}>
          <Transcript rows={COPY.contact.rows} render={(r) => <a href={r.when === 'Email' ? COPY.contact.links.email : COPY.contact.links.phone}>{r.text}</a>} />
          <div className={`${s.btns} ${s.after}`}><Button href={COPY.contact.resume.href} variant="primary" bracket={COPY.contact.resume.bracket} download>{COPY.contact.resume.label}</Button></div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

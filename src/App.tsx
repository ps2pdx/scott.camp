import { COPY, SECTIONS } from '@/content/copy';
import { PunchFilterDefs } from '@/components/Punches';
import { PunchNav } from '@/components/PunchNav';
import { SpineBand, SpineRail, SpineReveal } from '@/components/SpineRail';
import { Section, SectionBody } from '@/components/Section';
import { Label } from '@/components/Label';
import { Transcript } from '@/components/Transcript';
import { Button } from '@/components/Button';
import { Grid } from '@/components/Grid';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSheet } from '@/components/TechSheet';
import { Index } from '@/components/Index';
import { RunningHead } from '@/components/RunningHead';
import { Footer } from '@/components/Footer';
import { Plate, Spin } from '@/components/Evidence';
import { Disclosure } from '@/components/Disclosure';
import s from './App.module.css';

const vol = (no: string) => COPY.work.index.find((r) => r.no === no)!;

export function App() {
  const h = COPY.hero;
  const ts = COPY.terpscout.evidence;
  return (
    <>
      <PunchFilterDefs />
      <SpineReveal />
      <SpineRail />
      <SpineBand />
      <PunchNav sections={SECTIONS} />
      <main>
        <section id="hero" className={`grain tex-paper ${s.hero} first`}>
          <div className={s.heroWrap}>
            <div className={s.heroHead}><Label>{h.eyebrow}</Label><RunningHead>{h.runningHead}</RunningHead></div>
            <h1 className={`display t-hero ${s.headline}`}>{h.headline}</h1>
            <p className={`text t-lead ${s.lead}`}>{h.lead}</p>
            <div className={s.btns}>
              <Button href={h.actions.email.href} variant="primary">{h.actions.email.label}</Button>
              <Button href={h.actions.resume.href} variant="secondary" bracket={h.actions.resume.bracket} download>{h.actions.resume.label}</Button>
            </div>
            <Transcript rows={h.facts} tight className={s.facts} />
          </div>
        </section>

        <Section id="vantage" runningHead={COPY.vantage.runningHead} eyebrow={COPY.vantage.eyebrow} title={COPY.vantage.title} lead={COPY.vantage.lead}>
          <Transcript rows={COPY.vantage.rows} />
          <p className={`transcript ${s.after}`}><a href={COPY.vantage.caseStudy.href}>{COPY.vantage.caseStudy.label} ↗</a></p>
        </Section>

        <Section id="nertia" runningHead={COPY.nertia.runningHead} eyebrow={COPY.nertia.eyebrow} title={COPY.nertia.title} lead={COPY.nertia.lead}>
          <Transcript rows={COPY.nertia.rows} />
          <div className={s.techBlock}>
            <Label>Tech sheets</Label>
            <div className={s.techGrid}>{COPY.nertia.tech.map((t) => <TechSheet key={t.sheet} data={t} />)}</div>
          </div>
          <p className={`transcript ${s.after}`}>{COPY.nertia.codeSiteLine} <a href={COPY.nertia.source.href}>{COPY.nertia.source.label} ↗</a></p>
        </Section>

        <Section id="terpscout" runningHead={COPY.terpscout.runningHead} eyebrow={COPY.terpscout.eyebrow} title={COPY.terpscout.title} lead={COPY.terpscout.lead}>
          <Transcript rows={COPY.terpscout.rows} />
          <div className={s.stack}>
            {ts.shown.map((e) => <Plate key={e.src} e={e} />)}
          </div>
          <Disclosure summary={ts.gated.summary}>
            <Spin clip={ts.gated.spin} />
            {ts.gated.stills.map((e) => <Plate key={e.src} e={e} />)}
          </Disclosure>
        </Section>

        <Section id="work" surface="endpaper" runningHead={COPY.work.runningHead} eyebrow={COPY.work.eyebrow} title={COPY.work.title}>
          <Index rows={COPY.work.index} />
        </Section>
        <SectionBody>
          <Grid columns={3}>{COPY.work.sheets.map((sh, i) => { const v = vol(String(8 + i).padStart(2, '0')); return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid>
          <div className={s.techBlock}>
            <Label>Tech sheets</Label>
            <div className={s.techGrid}>{COPY.work.tech.map((t) => <TechSheet key={t.sheet} data={t} />)}</div>
          </div>
        </SectionBody>

        <Section id="practice" surface="board" runningHead={COPY.practice.runningHead} eyebrow={COPY.practice.eyebrow} title={COPY.practice.title}>
          <Grid columns={2}>{COPY.practice.sheets.map((sh, i) => { const v = vol(String(13 + i)); return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid>
          <Transcript rows={COPY.practice.rows} className={s.after} />
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

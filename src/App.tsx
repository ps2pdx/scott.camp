import { COPY, SECTIONS } from '@/content/copy';
import { CalBooking } from '@/components/CalBooking';
import cal from '@/components/CalBooking.module.css';
import { PunchFilterDefs } from '@/components/Punches';
import { PunchNav } from '@/components/PunchNav';
import { SpineBand, SpineEnd, SpineRail, SpineReveal } from '@/components/SpineRail';
import { Section } from '@/components/Section';
import { Cover } from '@/components/Cover';
import { Label } from '@/components/Label';
import { Transcript } from '@/components/Transcript';
import { Button } from '@/components/Button';
import { Grid } from '@/components/Grid';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSlider } from '@/components/TechSlider';
import { Index } from '@/components/Index';
import { Footer } from '@/components/Footer';
import { Plate, Spin } from '@/components/Evidence';
import { DataTable } from '@/components/DataTable';
import { BrandGenerator } from '@/components/BrandGenerator';
import { ZeroPointFrame } from '@/components/ZeroPointFrame';
import { FigurePair, SurfaceRow, TextureList, TypeStack } from '@/components/DesignStudy';
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
          <p data-part="yellow-name" className={`display t-title ${s.name}`}>{COPY.endpapers.name}</p>
          <p className={`text ${s.lead}`}>{h.lead}</p>
          <Transcript rows={h.facts} tight className={s.after} />
          <Transcript rows={[COPY.endpapers.virgil]} className={s.after} />
          <div className={s.index}><Index rows={COPY.work.index} /></div>
        </Section>

        <Section id="design-system" tools={COPY.designSystem.watermark} runningHead={COPY.designSystem.runningHead} title={COPY.designSystem.title} lead={COPY.designSystem.lead}>
          <Label>Surfaces</Label>
          <div className={s.gap}><SurfaceRow /></div>
          <div className={s.block}>
            <Label>Textures</Label>
            <p className={`transcript ${s.gap}`}>{COPY.designSystem.texturesLine}</p>
            <div className={s.gap}><TextureList /></div>
          </div>
          <div className={s.block}>
            <Label>Type</Label>
            <div className={s.gap}><TypeStack /></div>
            <p className={`meta ${s.gap}`}>{COPY.designSystem.typeLine}</p>
          </div>
          <div className={s.block}>
            <Label>Signature components</Label>
            <Transcript rows={COPY.designSystem.signature} className={s.gap} />
          </div>
          <div className={s.block}>
            <Label>Designed, then built</Label>
            <div className={s.gap}><FigurePair /></div>
          </div>
          <p className={`transcript ${s.after}`}>{COPY.designSystem.closing.line} <a href={COPY.designSystem.closing.href}>{COPY.designSystem.closing.label} ↗</a></p>
          <div className={s.block}>
            <Label>Token tiers</Label>
            <div className={s.gap}><DataTable label="This site's tokens by tier" rows={COPY.designSystem.tiers} /></div>
          </div>
        </Section>

        <Section id="vantage" tools={COPY.vantage.tools} mark={COPY.vantage.mark} runningHead={COPY.vantage.runningHead} eyebrow={COPY.vantage.eyebrow} title={COPY.vantage.title} lead={COPY.vantage.lead}>
          <Transcript rows={COPY.vantage.rows} />
          <p className={`transcript ${s.after}`}><a href={COPY.vantage.caseStudy.href}>{COPY.vantage.caseStudy.label} ↗</a></p>
        </Section>

        <Section id="nertia" tools={COPY.nertia.tools} mark={COPY.nertia.mark} runningHead={COPY.nertia.runningHead} eyebrow={COPY.nertia.eyebrow} title={COPY.nertia.title} lead={COPY.nertia.lead}>
          <Transcript rows={COPY.nertia.rows} />
          <TechSlider label="Tech sheets" sheets={COPY.nertia.tech} />
          <div className={s.block} data-part="zero-point-evolution">
            <h3 className="display t-title">{COPY.nertia.evolution.title}</h3>
            <p className={`meta ${s.gap}`}>{COPY.nertia.evolution.steps[0]}</p>
            <div className={s.gap}><BrandGenerator /></div>
            <p className={`meta ${s.block}`}>{COPY.nertia.evolution.steps[1]}</p>
            <div className={s.gap}><ZeroPointFrame caption={COPY.nertia.evolution.frameCaption} /></div>
            <p className={`meta ${s.block}`}>{COPY.nertia.evolution.steps[2]}</p>
            <p className={`transcript ${s.gap}`}>{COPY.nertia.contract.lead}</p>
            <div className={s.gap}><Label>Token tiers</Label></div>
            <div className={s.gap}><DataTable label="Skin contract tokens by tier" rows={COPY.nertia.contract.tiers} /></div>
            <div className={s.after}><Label>Tools that act on the system</Label></div>
            <div className={s.gap}><DataTable label="MCP tools that act on the design system or publish" rows={COPY.nertia.contract.tools} /></div>
            <p className={`transcript ${s.gap}`}><a href={COPY.nertia.contract.link.href}>{COPY.nertia.contract.link.label} ↗</a></p>
          </div>
          <p className={`transcript ${s.after}`}>{COPY.nertia.codeSiteLine} <a href={COPY.nertia.source.href}>{COPY.nertia.source.label} ↗</a></p>
        </Section>

        <Section id="work" tools={COPY.work.tools} runningHead={COPY.work.runningHead} eyebrow={COPY.work.eyebrow} title={COPY.work.title}>
          <Grid columns={2}>{COPY.work.sheets.map((sh, i) => { const v = vol(String(7 + i).padStart(2, '0')); return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid>
          <TechSlider label="Tech sheets" sheets={COPY.work.tech} />
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
          <div className={`${cal.pair} ${s.after}`} data-part="booking">{COPY.contact.booking.map((b) => <CalBooking key={b.slug} {...b} />)}</div>
        </Section>
      </main>
      <Footer />
      <SpineEnd />
    </>
  );
}

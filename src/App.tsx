import type { ReactNode } from 'react';
import { COPY, SECTIONS } from '@/content/copy';
import { Consulting } from '@/components/Consulting';
import { PunchFilterDefs } from '@/components/Punches';
import { PunchNav } from '@/components/PunchNav';
import { SpineBand, SpineEnd, SpineRail, SpineReveal } from '@/components/SpineRail';
import { Section } from '@/components/Section';
import { Cover } from '@/components/Cover';
import { Label } from '@/components/Label';
import { Transcript } from '@/components/Transcript';
import { Button } from '@/components/Button';
import { Grid, width } from '@/components/Grid';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSlider } from '@/components/TechSlider';
import { Index } from '@/components/Index';
import { Footer } from '@/components/Footer';
import { Plate, Spin } from '@/components/Evidence';
import { DataTable } from '@/components/DataTable';
import { BrandGenerator } from '@/components/BrandGenerator';
import { ZeroPointFrame } from '@/components/ZeroPointFrame';
import { BookFigure, FigurePair, SurfaceRow, TextureList, TypeStack } from '@/components/DesignStudy';
import { Disclosure } from '@/components/Disclosure';
import { Portrait } from '@/components/Mark';
import s from './App.module.css';

const vol = (no: string) => COPY.work.index.find((r) => r.no === no)!;
const practiceSheets = COPY.practice.sheets.filter((sh) => !sh.placeholder);

function Block({ label, note, first, part, children }: { label: string; note?: string; first?: boolean; part?: string; children: ReactNode }) {
  return (
    <div className={`${s.sub} ${first ? '' : s.block}`} {...(part ? { 'data-part': part } : {})}>
      <Label>{label}</Label>
      {note ? <p className={`transcript muted ${width.text}`}>{note}</p> : null}
      {children}
    </div>
  );
}

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
          <p className={`text ${width.text} ${s.lead}`}>{h.lead}</p>
          <Transcript rows={h.facts} tight className={s.gap} />
          <Transcript rows={[COPY.endpapers.virgil]} className={s.block} />
          <div className={s.block}><Index rows={COPY.work.index} /></div>
        </Section>

        <Section id="design-system" tools={COPY.designSystem.watermark} runningHead={COPY.designSystem.runningHead} title={COPY.designSystem.title} lead={COPY.designSystem.lead} figure={<BookFigure />}>
          <Block label="Surfaces" first><SurfaceRow /></Block>
          <Block label="Textures" note={COPY.designSystem.texturesLine}><TextureList /></Block>
          <Block label="Type" note={COPY.designSystem.typeLine}><TypeStack /></Block>
          <Block label="Signature components"><Transcript rows={COPY.designSystem.signature} /></Block>
          <Block label="Designed, then built"><FigurePair /></Block>
          <p className={`transcript ${width.text} ${s.block}`}>{COPY.designSystem.closing.line} <a href={COPY.designSystem.closing.href}>{COPY.designSystem.closing.label} ↗</a></p>
          <Block label="Token tiers"><DataTable kind="tiers" label="This site's tokens by tier" rows={COPY.designSystem.tiers} /></Block>
        </Section>

        <Section id="vantage" tools={COPY.vantage.tools} mark={COPY.vantage.mark} runningHead={COPY.vantage.runningHead} eyebrow={COPY.vantage.eyebrow} title={COPY.vantage.title} lead={COPY.vantage.lead}>
          <Transcript rows={COPY.vantage.rows} />
          <p className={`transcript ${s.block}`}><a href={COPY.vantage.caseStudy.href}>{COPY.vantage.caseStudy.label} ↗</a></p>
        </Section>

        <Section id="nertia" tools={COPY.nertia.tools} mark={COPY.nertia.mark} runningHead={COPY.nertia.runningHead} eyebrow={COPY.nertia.eyebrow} title={COPY.nertia.title} lead={COPY.nertia.lead}>
          <Block label="Decisions" note={COPY.nertia.notes.decisions} first><Transcript rows={COPY.nertia.rows} /></Block>
          <TechSlider label="Tech sheets" note={COPY.nertia.notes.tech} sheets={COPY.nertia.tech} />
          <Block label={COPY.nertia.evolution.title} part="zero-point-evolution">
            <p className={`transcript ${width.text}`}>{COPY.nertia.evolution.steps[0]}</p>
            <BrandGenerator />
            <p className={`transcript ${width.text} ${s.step}`}>{COPY.nertia.evolution.steps[1]}</p>
            <ZeroPointFrame caption={COPY.nertia.evolution.frameCaption} />
            <p className={`transcript ${width.text} ${s.step}`}>{COPY.nertia.evolution.steps[2]}</p>
          </Block>
          <Block label="Skin contract" note={COPY.nertia.contract.lead}><DataTable kind="tiers" label="Skin contract tokens by tier" rows={COPY.nertia.contract.tiers} /></Block>
          <Block label="Tools that act on the system" note={COPY.nertia.notes.tools}>
            <DataTable kind="tools" label="MCP tools that act on the design system or publish" rows={COPY.nertia.contract.tools} />
            <p className="transcript"><a href={COPY.nertia.contract.link.href}>{COPY.nertia.contract.link.label} ↗</a></p>
          </Block>
          <p className={`transcript ${width.text} ${s.block}`}>{COPY.nertia.codeSiteLine} <a href={COPY.nertia.source.href}>{COPY.nertia.source.label} ↗</a></p>
        </Section>

        <Section id="work" tools={COPY.work.tools} runningHead={COPY.work.runningHead} eyebrow={COPY.work.eyebrow} title={COPY.work.title}>
          <Grid columns={2}>{COPY.work.sheets.map((sh, i) => { const v = vol(String(7 + i).padStart(2, '0')); return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid>
          <TechSlider label="Tech sheets" note={COPY.work.techNote} sheets={COPY.work.tech} />
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
          <Transcript rows={COPY.practice.rows} className={practiceSheets.length ? s.block : undefined} />
          <div className={`${s.block} ${s.stack}`}>
            {COPY.practice.evidence.map((e) => <Plate key={e.src} e={e} />)}
          </div>
        </Section>

        <Section id="contact" runningHead={COPY.contact.runningHead} eyebrow={COPY.contact.eyebrow} title={COPY.contact.title} lead={COPY.contact.lead} portrait={<Portrait p={COPY.contact.portrait} />}>
          <Transcript rows={COPY.contact.rows} render={(r) => <a href={r.when === 'Email' ? COPY.contact.links.email : COPY.contact.links.phone}>{r.text}</a>} />
          <div className={`${s.btns} ${s.block}`}><Button href={COPY.contact.resume.href} variant="primary" bracket={COPY.contact.resume.bracket} download>{COPY.contact.resume.label}</Button></div>
          <Consulting className={s.block} />
        </Section>
      </main>
      <Footer />
      <SpineEnd />
    </>
  );
}

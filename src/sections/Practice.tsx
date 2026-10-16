import { COPY } from '@/content/copy';
import { Section } from '@/components/Section';
import { Transcript } from '@/components/Transcript';
import { Grid, width } from '@/components/Grid';
import { SpecSheet } from '@/components/SpecSheet';
import { TechSheet } from '@/components/TechSheet';
import { Plate } from '@/components/Evidence';
import { Block } from './Block';
import s from './sections.module.css';

const p = COPY.practice;
const zh = p.zenHolo;
const sheets = p.sheets.filter((sh) => !sh.placeholder);

export function PracticeSection() {
  return (
    <Section id="practice" tools={p.tools} surface="board" runningHead={p.runningHead} eyebrow={p.eyebrow} title={p.title}>
      {sheets.length ? <Grid columns={2}>{sheets.map((sh) => { const v = COPY.work.index.find((r) => r.name === sh.title)!; return <SpecSheet key={sh.title} sheet={sh} volume={{ no: v.no, name: v.name, year: v.year }} />; })}</Grid> : null}
      <Block label={zh.label} part="zen-holo">
        <p className={`text ${width.text}`}>{zh.lead}</p>
        <Transcript rows={zh.rows} />
        <div className={s.sheet}><TechSheet data={zh.tech} /></div>
        <div className={s.stack}>{zh.figures.map((e) => <Plate key={e.src} e={e} />)}</div>
        <p className="transcript"><a href={zh.link.href}>{zh.link.label} ↗</a></p>
      </Block>
      <Transcript rows={p.rows} className={s.block} />
      <div className={`${s.block} ${s.stack}`}>
        {p.evidence.map((e) => <Plate key={e.src} e={e} />)}
      </div>
    </Section>
  );
}

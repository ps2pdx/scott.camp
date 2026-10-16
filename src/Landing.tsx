import { COPY } from '@/content/copy';
import { bookStill } from '@/content/book';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Cover } from '@/components/Cover';
import { Transcript } from '@/components/Transcript';
import { Grid, width } from '@/components/Grid';
import { Index } from '@/components/Index';
import { Plate } from '@/components/Evidence';
import { Mark, Portrait } from '@/components/Mark';
import { Snippet, lede, snippetClass } from '@/components/Snippet';
import { WorkSheet, workNo } from '@/components/WorkSheet';
import s from '@/sections/sections.module.css';

export function Landing() {
  const h = COPY.hero;
  const { designSystem: ds, vantage: v, nertia: n, work: w, terpscout: t, practice: p, contact: c } = COPY;
  return (
    <Shell current="hero" cover={<Cover id="hero" />}>
      <Section id="endpapers" surface="endpaper">
        <p data-part="yellow-name" className={`display t-title ${s.name}`}>{COPY.endpapers.name}</p>
        <p className={`text ${width.text} ${s.lead}`}>{h.lead}</p>
        <Transcript rows={h.facts} tight className={s.gap} />
        <Transcript rows={[COPY.endpapers.virgil]} className={s.block} />
        <div className={s.block}><Index rows={w.index} /></div>
      </Section>
      <Snippet page="design-system" runningHead={ds.runningHead} title={ds.title} lead={lede(ds.lead, 2)}><Plate e={bookStill()} /></Snippet>
      <Snippet page="vantage" eyebrow={v.eyebrow} runningHead={v.runningHead} title={v.title} lead={lede(v.lead, 1)}><Mark mark={v.mark} /></Snippet>
      <Snippet page="nertia" eyebrow={n.eyebrow} runningHead={n.runningHead} title={n.title} lead={lede(n.lead, 2)}><Mark mark={n.mark} /></Snippet>
      <Snippet page="work" eyebrow={w.eyebrow} runningHead={w.runningHead} title={w.title}><Grid columns={2}><WorkSheet sheet={w.sheets[0]} no={workNo(0)} /></Grid></Snippet>
      <Snippet page="terpscout" eyebrow={t.eyebrow} runningHead={t.runningHead} title={t.title} lead={lede(t.lead, 1)}><Mark mark={t.mark} /></Snippet>
      <Snippet page="practice" surface="board" eyebrow={p.eyebrow} runningHead={p.runningHead} title={p.title} lead={lede(p.zenHolo.lead, 1)}><Plate e={p.zenHolo.figures[0]} /></Snippet>
      <Snippet page="contact" eyebrow={c.eyebrow} runningHead={c.runningHead} title={c.title} lead={lede(c.lead, 1)}><div className={snippetClass.portrait}><Portrait p={c.portrait} /></div></Snippet>
    </Shell>
  );
}

import type { ReactNode } from 'react';
import { chapterIndex, chapterTitle, pageLabel, type PageId } from '@/content/copy';
import { Index } from './Index';
import { Section } from './Section';
import { Cover } from './Cover';
import { PunchFilterDefs } from './Punches';
import { PunchNav } from './PunchNav';
import { SpineBand, SpineEnd, SpineRail } from './SpineRail';
import { Footer } from './Footer';

export function Shell({ current, cover, children }: { current: PageId; cover?: ReactNode; children: ReactNode }) {
  return (
    <>
      <PunchFilterDefs />
      {cover ?? (current === 'hero' ? null : <Cover chapter={{ title: chapterTitle(current) }} />)}
      <SpineRail />
      <SpineBand />
      <div className="shell-body">
      <PunchNav current={current} />
      <main>{current === 'hero' ? null : <Section id="contents" surface="endpaper" first><Index rows={chapterIndex(current)} label={`Contents. ${pageLabel(current)} is this page; struck rows are the other chapters.`} /></Section>}{children}</main>
      <Footer current={current} />
      </div>
      <SpineEnd />
    </>
  );
}

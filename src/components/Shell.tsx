import type { ReactNode } from 'react';
import { chapterTitle, pageLabel, type PageId } from '@/content/copy';
import { Cover } from './Cover';
import { PunchFilterDefs } from './Punches';
import { PunchNav } from './PunchNav';
import { SpineBand, SpineEnd, SpineRail } from './SpineRail';
import { Footer } from './Footer';

export function Shell({ current, cover, children }: { current: PageId; cover?: ReactNode; children: ReactNode }) {
  return (
    <>
      <PunchFilterDefs />
      {cover ?? (current === 'hero' ? null : <Cover chapter={{ label: pageLabel(current), title: chapterTitle(current) }} />)}
      <SpineRail />
      <SpineBand />
      <PunchNav current={current} />
      <main>{children}</main>
      <Footer />
      <SpineEnd />
    </>
  );
}

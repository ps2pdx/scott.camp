import type { ReactNode } from 'react';
import type { PageId } from '@/content/copy';
import { PunchFilterDefs } from './Punches';
import { PunchNav } from './PunchNav';
import { SpineBand, SpineEnd, SpineRail, SpineReveal } from './SpineRail';
import { Footer } from './Footer';

export function Shell({ current, cover, children }: { current: PageId; cover?: ReactNode; children: ReactNode }) {
  return (
    <>
      <PunchFilterDefs />
      <SpineReveal />
      {cover}
      <SpineRail />
      <SpineBand />
      <PunchNav current={current} />
      <main>{children}</main>
      <Footer />
      <SpineEnd />
    </>
  );
}

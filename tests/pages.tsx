import type { ComponentType } from 'react';
import { render } from '@testing-library/react';
import type { PageId } from '@/content/copy';
import { Landing } from '@/Landing';
import { Shell } from '@/components/Shell';
import { DesignSystemSection } from '@/sections/DesignSystem';
import { VantageSection } from '@/sections/Vantage';
import { NertiaSection } from '@/sections/Nertia';
import { WorkSection } from '@/sections/Work';
import { TerpScoutSection } from '@/sections/TerpScout';
import { PracticeSection } from '@/sections/Practice';
import { ContactSection } from '@/sections/Contact';

export const SECTION_PAGES: Record<Exclude<PageId, 'hero'>, ComponentType> = {
  'design-system': DesignSystemSection, vantage: VantageSection, nertia: NertiaSection, work: WorkSection, terpscout: TerpScoutSection, practice: PracticeSection, contact: ContactSection,
};

export function Page({ id }: { id: PageId }) {
  if (id === 'hero') return <Landing />;
  const S = SECTION_PAGES[id];
  return <Shell current={id}><S /></Shell>;
}
export const renderPage = (id: PageId) => render(<Page id={id} />);

// The landing followed by every chapter's section, one container, for checks that span the whole site.
export const renderBook = () => render(<><Landing />{Object.entries(SECTION_PAGES).map(([id, S]) => <S key={id} />)}</>);

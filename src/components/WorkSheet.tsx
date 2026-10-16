import { COPY, type Sheet } from '@/content/copy';
import { SpecSheet } from './SpecSheet';
import type { About } from './AboutBox';

export const workNo = (i: number) => COPY.work.index.find((r) => r.name.startsWith(COPY.work.sheets[i].title))!.no;
export function WorkSheet({ sheet, no, about }: { sheet: Sheet; no: string; about?: About }) {
  const v = COPY.work.index.find((r) => r.no === no)!;
  return <SpecSheet sheet={sheet} volume={{ no: v.no, name: v.name, year: v.year }} about={about} />;
}

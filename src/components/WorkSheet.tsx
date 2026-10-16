import { COPY, type Sheet } from '@/content/copy';
import { SpecSheet } from './SpecSheet';

export const workNo = (i: number) => String(8 + i).padStart(2, '0');
export function WorkSheet({ sheet, no }: { sheet: Sheet; no: string }) {
  const v = COPY.work.index.find((r) => r.no === no)!;
  return <SpecSheet sheet={sheet} volume={{ no: v.no, name: v.name, year: v.year }} />;
}

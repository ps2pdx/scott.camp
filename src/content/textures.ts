export type Texture = { name: string; file: string; source: string; shot: string; camera: string };

export const TEXTURES: Texture[] = [
  { name: 'Paper', file: 'paper', source: 'IMG_2999', shot: '10.13.26', camera: 'iPhone' },
  { name: 'Board', file: 'board', source: 'IMG_2939', shot: '10.13.26', camera: 'iPhone' },
  { name: 'Cloth', file: 'cloth', source: 'IMG_2976', shot: '10.13.26', camera: 'iPhone' },
  { name: 'Spine', file: 'spine', source: 'IMG_2983', shot: '10.13.26', camera: 'iPhone' },
  { name: 'Chip', file: 'chip', source: 'IMG_3027', shot: '10.14.26', camera: 'iPhone' },
];

export const PROVENANCE_LINE = 'Textures photographed from one copy of ICONS, 10.13.26.';

export function provenance(t: Texture): string {
  return `${t.name} · ${t.source} · ${t.camera} · ${t.shot}`.toUpperCase();
}

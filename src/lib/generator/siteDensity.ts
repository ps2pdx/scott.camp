/**
 * Vendored read-only from ps2pdx/nertia `src/lib/siteDensity.ts` at d9d25008 (main, 2026-10-14).
 * Kept byte-faithful except imports, which point at the other vendored files, and dashes in comments, which follow this repo's no-dash rule.
 */
/**
 * Site density band, corpus lean | standard | dense → spacing CSS vars.
 * Set `--site-density-band` on site.ds; expandSiteDs applies section-py + grid gaps.
 */

// Vendored from src/lib/layouts/vocab.ts at the same commit.
export type LayoutDensityBand = 'lean' | 'standard' | 'dense';
const LAYOUT_DENSITY_BANDS: readonly LayoutDensityBand[] = ['lean', 'standard', 'dense'];

export const SITE_DENSITY_BAND_TOKEN = '--site-density-band';


const BAND_SET = new Set<string>(LAYOUT_DENSITY_BANDS);

export function resolveDensityBand(value?: string | null): LayoutDensityBand {
  const v = value?.trim();
  if (v && BAND_SET.has(v)) return v as LayoutDensityBand;
  return 'standard';
}

/** Spacing bag for a density band, drives `--section-py` and `--site-grid-gap-*`. */
export function densityBandToSpacingVars(
  band: LayoutDensityBand,
): Record<string, string> {
  switch (band) {
    case 'lean':
      return {
        [SITE_DENSITY_BAND_TOKEN]: 'lean',
        '--section-py': '7.5rem',
        '--site-grid-gap-sm': '1rem',
        '--site-grid-gap-md': '1.5rem',
        '--site-grid-gap-lg': '2.5rem',
      };
    case 'dense':
      return {
        [SITE_DENSITY_BAND_TOKEN]: 'dense',
        '--section-py': '3rem',
        '--site-grid-gap-sm': '0.5rem',
        '--site-grid-gap-md': '0.75rem',
        '--site-grid-gap-lg': '1.25rem',
      };
    case 'standard':
    default:
      return {
        [SITE_DENSITY_BAND_TOKEN]: 'standard',
        '--section-py': '6rem',
        '--site-grid-gap-sm': '0.75rem',
        '--site-grid-gap-md': '1.25rem',
        '--site-grid-gap-lg': '2rem',
      };
  }
}

/**
 * Vendored read-only from ps2pdx/nertia `src/lib/styles/m3BrandTokens.ts` at d9d25008 (main, 2026-10-14).
 * Kept byte-faithful except imports, which point at the other vendored files, and dashes in comments, which follow this repo's no-dash rule.
 */
/**
 * Palette-aware brand-color token assembly. Generator-side, not hosted-side.
 *
 * `src/lib/styles/brandColors.ts` is reached from inside `REGISTRY_ROOTS` (via
 * `src/lib/foundation/providers/shadcn/compileTokens.ts`, which value-imports
 * `brandColorForeground`) and from the `registry:build` script's static import
 * graph. If `brandColors.ts` imported the M3 adapter, both graphs would drag
 * in the ESM-only `@materialx/material-color-utilities`: one leak would ship
 * the package into every exported site and break the no-lock-in claim, the
 * other breaks `npm run build` outright because `tsx` cannot resolve the
 * package's `"import"`-only export condition through its CJS loader.
 *
 * This module is the one place that imports both `brandColors.ts` and
 * `m3Palette.ts`, so the dependency arrow points the safe way: nothing in the
 * hosted graph, and nothing the registry build touches, reaches the adapter.
 */
import {
  brandColorForeground,
  brandColorsToTokens,
  mergeBrandColorsIntoDs,
  slugifyBrandColorName,
  type NamedBrandColor,
} from './brandColors';
import { m3BrandRoles, type BrandPaletteOptions } from './m3Palette';

/**
 * Canonical brand-color mapping, palette-aware. Primary must land in BOTH
 * token worlds: compiled skins color CTAs from --primary, legacy sections
 * from --accent.
 *
 * Only role-scoped tokens carry the brand. Surface tokens (--card, --muted,
 * --border, --footer-bg) stay with the Base Color neutral the design system
 * already compiled, so soft fields read clean next to any brand role instead
 * of staying primary-tinted inside the secondary table.
 *
 * When `palette` is absent, this DELEGATES to the plain `brandColorsToTokens`
 * instead of reimplementing the pre-M3 path, which makes byte-stability
 * structural rather than conditional on two implementations staying in sync
 * (see `__tests__/brandColorsByteStability.test.ts`). When `palette` is
 * present the brand hex still lands verbatim on --primary and --accent, as
 * `validateBrandColorAgreement` requires; M3 supplies the partners that used
 * to come from a single luminance threshold.
 */
export function brandColorsToTokensWithPalette(
  brandColors: NamedBrandColor[] | undefined,
  palette?: BrandPaletteOptions,
): Record<string, string> {
  if (!palette) return brandColorsToTokens(brandColors);
  if (!brandColors?.length) return {};

  const primary = brandColors.find((c) => c.role === 'primary');
  const m3 = primary ? m3BrandRoles(primary.hex, palette) : null;

  const out: Record<string, string> = {};
  for (const color of brandColors) {
    const slug = slugifyBrandColorName(color.id || color.name);
    out[`--color-${slug}`] = color.hex;
    if (color.role === 'primary') {
      const fg = m3?.onSeed ?? brandColorForeground(color.hex);
      out['--primary'] = color.hex;
      out['--primary-foreground'] = fg;
      out['--accent'] = color.hex;
      out['--accent-fg'] = fg;
      // expandSiteDs reads --on-primary and aliases it to --accent-fg.
      if (m3) out['--on-primary'] = fg;
    } else {
      // A supplied secondary is a brand colour too, so it stays verbatim and
      // gets the same seed-as-fill treatment, seeded from itself.
      const ownRoles = m3 ? m3BrandRoles(color.hex, palette) : null;
      out['--secondary'] = color.hex;
      out['--secondary-foreground'] = ownRoles?.onSeed ?? brandColorForeground(color.hex);
    }
  }

  if (m3) {
    out['--color-danger'] = m3.error;
    // No secondary was supplied: M3's harmonised secondary beats leaving the
    // table on the compiled neutral.
    if (!out['--secondary']) {
      out['--secondary'] = m3.secondary;
      out['--secondary-foreground'] = m3.onSecondary;
    }
  }

  return out;
}

/**
 * `mergeBrandColorsIntoDs`, palette-aware. Delegates to the plain function
 * when `palette` is absent, for the same byte-stability reason as
 * `brandColorsToTokensWithPalette` above.
 */
export function mergeBrandColorsIntoDsWithPalette(
  ds: Record<string, string>,
  brandColors: NamedBrandColor[] | undefined,
  palette?: BrandPaletteOptions,
): Record<string, string> {
  if (!palette) return mergeBrandColorsIntoDs(ds, brandColors);
  if (!brandColors?.length) return ds;
  return { ...ds, ...brandColorsToTokensWithPalette(brandColors, palette) };
}

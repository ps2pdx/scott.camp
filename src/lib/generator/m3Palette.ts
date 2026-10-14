/**
 * Vendored read-only from ps2pdx/nertia `src/lib/styles/m3Palette.ts` at d9d25008 (main, 2026-10-14).
 * Kept byte-faithful except imports, which point at the other vendored files, and dashes in comments, which follow this repo's no-dash rule.
 */
/**
 * Material 3 colour science for the skin generator.
 *
 * GENERATOR ONLY. `src/lib/styles/` is outside `REGISTRY_ROOTS`
 * (`src/lib/registry/boundary.ts`), and nothing under those roots may import
 * this module: a hosted leaf that did would make
 * `@materialx/material-color-utilities` a runtime dependency of every exported
 * site and break the no-lock-in claim. The boundary test next to
 * `boundary.ts` enforces it.
 *
 * Only the `fidelity` and `content` variants are offered. Both place the seed
 * verbatim on M3's `primaryContainer`, so `onPrimaryContainer` is the
 * contrast-guaranteed partner of the brand hex used as a fill. `tonalSpot`
 * desaturates the seed and `expressive` rotates its hue, so neither can carry a
 * brand colour.
 *
 * Why the fork and not `@material/material-color-utilities`: the official 0.4.0
 * ships extensionless relative imports inside an ESM package and fails to
 * resolve under this repo's vitest and under plain Node. The `@materialx` fork
 * is the same Apache-2.0 source with a correct `exports` map.
 */
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
  SchemeFidelity,
} from '@materialx/material-color-utilities';

export const M3_SCHEME_VARIANTS = ['fidelity', 'content'] as const;
export type M3SchemeVariant = (typeof M3_SCHEME_VARIANTS)[number];

/** Generation option stored on a design-system record. Absent means pre-M3 derivation. */
export type BrandPaletteOptions = {
  variant: M3SchemeVariant;
};

export type M3BrandRoles = {
  /**
   * Contrast-guaranteed partner of the seed used as a fill: M3's
   * `onPrimaryContainer`, because fidelity and content put the seed on
   * `primaryContainer`.
   */
  onSeed: string;
  /** Harmonised secondary, for when the user supplied only one brand colour. */
  secondary: string;
  /** Partner of `secondary` above: M3's `onSecondary`. */
  onSecondary: string;
  /** M3's error role, for the in-contract `--color-danger`. */
  error: string;
};

export function isM3SchemeVariant(value: unknown): value is M3SchemeVariant {
  return (
    typeof value === 'string' && (M3_SCHEME_VARIANTS as readonly string[]).includes(value)
  );
}

export function normalizeBrandPaletteOptions(
  value: unknown,
): BrandPaletteOptions | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const variant = (value as { variant?: unknown }).variant;
  return isM3SchemeVariant(variant) ? { variant } : undefined;
}

function schemeFor(variant: M3SchemeVariant, hct: Hct, dark: boolean) {
  return variant === 'fidelity'
    ? new SchemeFidelity(hct, dark, 0)
    : new SchemeContent(hct, dark, 0);
}

/**
 * RGB channels of a brand hex, or null.
 *
 * Deliberately local rather than `normalizeBrandHex` from `brandColors.ts`:
 * that module imports this one, and an adapter that imports its own consumer
 * back is a cycle ESM only tolerates because neither side touches the other at
 * module-evaluation time. A dependency-free adapter is also the cleaner story
 * for the portability boundary. The accepted shapes match `normalizeBrandHex`
 * exactly (`#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, and each without the `#`)
 * and both are pinned by tests, so a divergence fails loudly.
 */
function seedRgbFromHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, '');
  if (!/^(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw)) return null;
  const full =
    raw.length === 3 || raw.length === 4
      ? raw.split('').map((c) => c + c).join('')
      : raw;
  return `#${full.slice(0, 6)}`;
}

/**
 * The four roles the generator is allowed to emit, from one seed.
 *
 * Returns null on a seed that is not a usable hex so callers degrade to pre-M3
 * derivation instead of throwing on a render path. Surface roles are
 * deliberately not returned: surfaces stay with the compiled base colour.
 */
export function m3BrandRoles(
  seedHex: string,
  options: BrandPaletteOptions,
  scheme: 'light' | 'dark' = 'light',
): M3BrandRoles | null {
  const rgb = seedRgbFromHex(seedHex);
  if (!rgb) return null;

  const built = schemeFor(options.variant, Hct.fromInt(argbFromHex(rgb)), scheme === 'dark');

  return {
    onSeed: hexFromArgb(MaterialDynamicColors.onPrimaryContainer.getArgb(built)),
    secondary: hexFromArgb(MaterialDynamicColors.secondary.getArgb(built)),
    onSecondary: hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(built)),
    error: hexFromArgb(MaterialDynamicColors.error.getArgb(built)),
  };
}

/**
 * The hex of an HCT colour: hue in degrees, chroma and tone as M3 defines them.
 * A chroma the hue and tone cannot reach is clamped to the most they allow, so
 * every input is a real colour. The design system generator's primary comes
 * from here.
 */
export function hexFromHct(hue: number, chroma: number, tone: number): string {
  return hexFromArgb(Hct.from(hue, chroma, tone).toInt());
}

/** The HCT hue of a hex, in degrees, or null when the input is not a usable hex. */
export function hueFromHex(hex: string): number | null {
  const rgb = seedRgbFromHex(hex);
  return rgb ? Hct.fromInt(argbFromHex(rgb)).hue : null;
}

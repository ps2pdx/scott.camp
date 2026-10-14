/**
 * Vendored read-only from ps2pdx/nertia `src/lib/styles/brandColors.ts` at d9d25008 (main, 2026-10-14).
 * Kept byte-faithful except imports, which point at the other vendored files, and dashes in comments, which follow this repo's no-dash rule.
 */
export type NamedBrandColor = {
  id: string;
  name: string;
  hex: string;
  role: 'primary' | 'secondary';
};

export function slugifyBrandColorName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'brand-color';
}

/**
 * Normalize pasted brand color codes to `#RRGGBB` or `#RRGGBBAA`.
 * Accepts `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, and bare hex (case-insensitive).
 * Returns null when the string is not a valid hex color.
 */
export function normalizeBrandHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(raw)) {
    return null;
  }
  const full =
    raw.length === 3 || raw.length === 4
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  return `#${full.toUpperCase()}`;
}

/** RGB channels only, for native `<input type="color">` which ignores alpha. */
export function brandHexOpaque(hex: string): string {
  const normalized = normalizeBrandHex(hex);
  if (!normalized) return '#71717A';
  return `#${normalized.slice(1, 7)}`;
}

export function brandHexHasAlpha(hex: string): boolean {
  const normalized = normalizeBrandHex(hex);
  return Boolean(normalized && normalized.length === 9);
}

/**
 * WCAG-ish relative luminance from hex; picks readable text color.
 * Threshold 0.45 is tuned so teal #2BB6C3 (luminance ~0.38) gets white text,
 * matching the approved bend.cleaning CTA look. Do not change it without
 * updating the tests in __tests__/brandColors.test.ts.
 */
export function brandColorForeground(hex: string): string {
  const normalized = normalizeBrandHex(hex) ?? hex;
  const h = brandHexOpaque(normalized).replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '#1a1a1a' : '#ffffff';
}

/**
 * Canonical brand-color mapping. Primary must land in BOTH token worlds:
 * compiled skins color CTAs from --primary, legacy sections from --accent.
 *
 * Only role-scoped tokens carry the brand. Surface tokens (--card, --muted,
 * --border, --footer-bg) stay with the Base Color neutral the design system
 * already compiled, so soft fields read clean next to any brand role instead
 * of staying primary-tinted inside the secondary table.
 */
export function brandColorsToTokens(
  brandColors: NamedBrandColor[] | undefined,
): Record<string, string> {
  if (!brandColors?.length) return {};
  const out: Record<string, string> = {};
  for (const color of brandColors) {
    const slug = slugifyBrandColorName(color.id || color.name);
    const fg = brandColorForeground(color.hex);
    out[`--color-${slug}`] = color.hex;
    if (color.role === 'primary') {
      out['--primary'] = color.hex;
      out['--primary-foreground'] = fg;
      out['--accent'] = color.hex;
      out['--accent-fg'] = fg;
    } else {
      out['--secondary'] = color.hex;
      out['--secondary-foreground'] = fg;
    }
  }
  return out;
}

export function mergeBrandColorsIntoDs(
  ds: Record<string, string>,
  brandColors: NamedBrandColor[] | undefined,
): Record<string, string> {
  if (!brandColors?.length) return ds;
  return { ...ds, ...brandColorsToTokens(brandColors) };
}

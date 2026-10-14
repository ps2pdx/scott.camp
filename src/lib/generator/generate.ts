/**
 * One colour in, the whole contract out. Composes the vendored pieces the way nertia's
 * `skinModeVars` (src/lib/siteTokens.ts) and the brand-colour merge do: the zinc base,
 * its tinted shadows and secondary, the brand primary through M3 fidelity
 * (`mergeBrandColorsIntoDsWithPalette`), then `expandSiteDs` once over the result.
 */
import { expandSiteDs } from './expandSiteDs';
import { mergeBrandColorsIntoDsWithPalette } from './m3BrandTokens';
import { PRESET_SHADOWS_DARK, PRESET_SHADOWS_LIGHT, modeToCoreVars, modeTokens, themes } from './zinc';

export const DEFAULT_SEED = '#2bf52b';
export type Scheme = 'light' | 'dark';

export function generateContract(seedHex: string, scheme: Scheme): Record<string, string> {
  const theme = themes.zinc!;
  const mode = theme[scheme];
  const base = {
    ...modeToCoreVars(modeTokens(mode)),
    '--radius': theme.radius,
    '--font-sans': "'Inter', system-ui, sans-serif",
    '--font-heading': "'Inter', system-ui, sans-serif",
    '--font-body': "'Inter', system-ui, sans-serif",
    '--btn-shadow': 'var(--shadow-sm)',
    ...(scheme === 'light' ? PRESET_SHADOWS_LIGHT : PRESET_SHADOWS_DARK),
    '--secondary': mode['--secondary'],
    '--secondary-foreground': mode['--secondary-foreground'],
  };
  const branded = mergeBrandColorsIntoDsWithPalette(base, [{ id: 'brand', name: 'Brand', hex: seedHex, role: 'primary' }], { variant: 'fidelity' });
  return expandSiteDs(branded);
}

/** The contract's variables, in the order the contract doc lists them, that the readout shows. */
export const CONTRACT_VARS = [
  '--background', '--foreground', '--muted', '--muted-fg', '--border', '--accent', '--accent-fg',
  '--card', '--card-bg', '--card-border', '--card-foreground', '--radius',
  '--font-sans', '--font-heading', '--font-body', '--shadow-sm', '--shadow-md', '--shadow-lg', '--btn-shadow', '--color-danger',
] as const;

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** A #RRGGBB hex as an oklch() string (sRGB to OKLab to OKLCH), three decimals. Anything else passes through. */
export function asOklch(value: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return value;
  const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(m[1]!.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r! + 0.5363325363 * g! + 0.0514459929 * b!);
  const mm = Math.cbrt(0.2119034982 * r! + 0.6806995451 * g! + 0.1073969566 * b!);
  const s = Math.cbrt(0.0883024619 * r! + 0.2817188376 * g! + 0.6299787005 * b!);
  const L = 0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = C < 0.0005 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  const f = (n: number) => Number(n.toFixed(3)).toString();
  return `oklch(${f(L)} ${f(C)} ${f(H)})`;
}

/**
 * Vendored read-only from ps2pdx/nertia at d9d25008 (main, 2026-10-14): the zinc theme from
 * `src/lib/nertiaDesignSystem/themes.ts`, `tintedShadows` and `modeTokens` from `src/lib/skins/presets.ts`,
 * `SkinModeTokens` and `modeToCoreVars` from `src/lib/siteTokens.ts`. Byte-faithful; only the zinc entry of `themes`.
 */
export interface ThemeMode {
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--destructive': string;
  '--border': string;
  '--input': string;
  '--ring': string;
}

export interface ThemeDefinition {
  light: ThemeMode;
  dark: ThemeMode;
  radius: string;
}

export const themes: Record<string, ThemeDefinition> = {
  zinc: {
    light: {
      '--background': 'oklch(1 0 0)',
      '--foreground': 'oklch(0.141 0.005 285.823)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.141 0.005 285.823)',
      '--popover': 'oklch(1 0 0)',
      '--popover-foreground': 'oklch(0.141 0.005 285.823)',
      '--primary': 'oklch(0.21 0.006 285.885)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--secondary': 'oklch(0.967 0.001 286.375)',
      '--secondary-foreground': 'oklch(0.21 0.006 285.885)',
      '--muted': 'oklch(0.967 0.001 286.375)',
      '--muted-foreground': 'oklch(0.552 0.016 285.938)',
      '--accent': 'oklch(0.967 0.001 286.375)',
      '--accent-foreground': 'oklch(0.21 0.006 285.885)',
      '--destructive': 'oklch(0.577 0.245 27.325)',
      '--border': 'oklch(0.92 0.004 286.32)',
      '--input': 'oklch(0.92 0.004 286.32)',
      '--ring': 'oklch(0.705 0.015 286.067)',
    },
    dark: {
      '--background': 'oklch(0.141 0.005 285.823)',
      '--foreground': 'oklch(0.985 0 0)',
      '--card': 'oklch(0.21 0.006 285.885)',
      '--card-foreground': 'oklch(0.985 0 0)',
      '--popover': 'oklch(0.21 0.006 285.885)',
      '--popover-foreground': 'oklch(0.985 0 0)',
      '--primary': 'oklch(0.92 0.004 286.32)',
      '--primary-foreground': 'oklch(0.21 0.006 285.885)',
      '--secondary': 'oklch(0.274 0.006 286.033)',
      '--secondary-foreground': 'oklch(0.985 0 0)',
      '--muted': 'oklch(0.274 0.006 286.033)',
      '--muted-foreground': 'oklch(0.705 0.015 286.067)',
      '--accent': 'oklch(0.274 0.006 286.033)',
      '--accent-foreground': 'oklch(0.985 0 0)',
      '--destructive': 'oklch(0.704 0.191 22.216)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--input': 'oklch(1 0 0 / 15%)',
      '--ring': 'oklch(0.552 0.016 285.938)',
    },
    radius: '0.625rem',
  },
};

export interface SkinModeTokens {
    background: string;
    foreground: string;
    muted: string;
    mutedFg: string;
    border: string;
    accent: string;
    accentFg: string;
}

/**
 * Brand-tinted elevation: shadow color = a hint of `--accent` mixed into a
 * near-black base, then dropped to the resting opacity. Neutral skins (accent
 * already near-black) read as plain shadows; colorful skins pick up the hue , 
 * the Cascade craft, generically. Opacities match the prior neutral values.
 */
function tintedShadows(
  accentPct: number,
  base: string,
  alpha: { sm: number; md: number; lg: number },
) {
  const color = (a: number) =>
    `color-mix(in srgb, color-mix(in srgb, var(--accent) ${accentPct}%, ${base}), transparent ${100 - a}%)`;
  return {
    '--shadow-sm': `0 1px 2px ${color(alpha.sm)}`,
    '--shadow-md': `0 4px 8px ${color(alpha.md)}`,
    '--shadow-lg': `0 12px 24px ${color(alpha.lg)}`,
  } as const;
}

const PRESET_SHADOWS_LIGHT = tintedShadows(16, '#0a0a0a', { sm: 4, md: 6, lg: 8 });
const PRESET_SHADOWS_DARK = tintedShadows(24, '#000000', { sm: 35, md: 45, lg: 55 });

function modeTokens(mode: ThemeMode): SkinModeTokens {
  return {
    background: mode['--background'],
    foreground: mode['--foreground'],
    muted: mode['--muted'],
    mutedFg: mode['--muted-foreground'],
    border: mode['--border'],
    accent: mode['--primary'],
    accentFg: mode['--primary-foreground'],
  };
}

function modeToCoreVars(mode: SkinModeTokens): Record<string, string> {
    return {
        "--background": mode.background,
        "--foreground": mode.foreground,
        "--muted": mode.muted,
        "--muted-fg": mode.mutedFg,
        "--border": mode.border,
        "--accent": mode.accent,
        "--accent-fg": mode.accentFg,
    };
}


export { PRESET_SHADOWS_LIGHT, PRESET_SHADOWS_DARK, modeTokens, modeToCoreVars };

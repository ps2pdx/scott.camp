/**
 * Vendored read-only from ps2pdx/nertia `src/lib/siteTokens.ts (expandSiteDs)` at d9d25008 (main, 2026-10-14).
 * Kept byte-faithful except imports, which point at the other vendored files, and dashes in comments, which follow this repo's no-dash rule.
 */
import { SITE_DENSITY_BAND_TOKEN, densityBandToSpacingVars, resolveDensityBand } from './siteDensity';

/** Derive alias vars from core skin tokens so sections never fall through to app :root. */
export function expandSiteDs(ds: Record<string, string>): Record<string, string> {
    const out = { ...ds };
    const set = (k: string, v: string) => { if (!out[k]) out[k] = v; };
    if (out["--surface-container-high"]) {
        out["--card"] = out["--surface-container-high"];
        out["--card-bg"] = out["--surface-container-high"];
    } else if (out["--muted"]) {
        set("--card", out["--muted"]);
        set("--card-bg", out["--muted"]);
    }
    if (out["--border"])      set("--card-border", out["--border"]);
    if (out["--foreground"])  set("--card-foreground", out["--foreground"]);
    if (out["--muted-fg"])    set("--muted-foreground", out["--muted-fg"]);
    if (out["--accent-fg"])   set("--accent-foreground", out["--accent-fg"]);
    if (out["--font-sans"]) { set("--font-heading", out["--font-sans"]); set("--font-body", out["--font-sans"]); }
    if (out["--surface-container-high"]) {
        set("--card", out["--surface-container-high"]);
        set("--card-bg", out["--surface-container-high"]);
    }
    if (out["--primary"]) {
        set(
            "--primary-ring",
            `oklch(from ${out["--primary"]} l c calc(h + 30deg))`,
        );
        set(
            "--primary-ring-gradient",
            "linear-gradient(135deg, var(--primary), var(--primary-ring))",
        );
    }
    // Only pair primary→accent (and primary-foreground→accent-fg) when accent
    // was not already set. Otherwise shadcn skins keep a light --accent while
    // inheriting white --primary-foreground → invisible primary CTAs.
    const accentAliasedFromPrimary = !ds["--accent"] && Boolean(out["--primary"]);
    if (out["--primary"]) set("--accent", out["--primary"]);
    if (out["--on-primary"]) set("--accent-fg", out["--on-primary"]);
    if (accentAliasedFromPrimary && out["--primary-foreground"]) {
        set("--accent-fg", out["--primary-foreground"]);
    }
    if (out["--accent-foreground"]) set("--accent-fg", out["--accent-foreground"]);
    if (out["--accent"]) {
        set(
            "--accent-ring",
            `oklch(from ${out["--accent"]} l c calc(h + 30deg))`,
        );
        set(
            "--accent-ring-gradient",
            "linear-gradient(135deg, var(--accent), var(--accent-ring))",
        );
    }
    // Final card fallback so a minimal skin never falls through to the app :root.
    if (out["--background"]) {
        set("--card", out["--background"]);
        set("--card-bg", out["--background"]);
    }
    if (out["--border"]) set("--card-border", out["--border"]);
    if (out["--background"]) set("--section-bg", out["--background"]);
    if (out["--foreground"]) set("--section-fg", out["--foreground"]);
    if (out["--muted"])      set("--footer-bg", out["--muted"]);
    if (out["--foreground"]) set("--footer-fg", out["--foreground"]);
    set("--color-danger", "#ef4444");

    // Density band → --section-py + --site-grid-gap-* (explicit band wins; else gap
    // defaults only). The band must overwrite: this function re-expands its own
    // output on several paths (SiteSurface, mergeSiteDsForSurface),
    // so gap keys in the input are routinely the previous expansion's defaults,
    // not a person's choice, deferring to them makes the density control inert.
    const inputBand = ds[SITE_DENSITY_BAND_TOKEN]?.trim();
    if (inputBand) {
        const spacing = densityBandToSpacingVars(resolveDensityBand(inputBand));
        for (const [k, v] of Object.entries(spacing)) {
            out[k] = v;
        }
    } else {
        const gaps = densityBandToSpacingVars("standard");
        set("--site-grid-gap-sm", gaps["--site-grid-gap-sm"]!);
        set("--site-grid-gap-md", gaps["--site-grid-gap-md"]!);
        set("--site-grid-gap-lg", gaps["--site-grid-gap-lg"]!);
    }

    return out;
}

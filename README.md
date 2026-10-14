# scott.camp

Scott Campbell's site, at scott.camp/bell. One page in seven sections (Hero, Vantage, Nertia, TerpScout, Work, Creative practice, Contact) plus a specimen of the design system at /specimen. A nertia code site: built here, published to nertia by the workflow on every push to `main`, never edited in the editor.

Vite multi-page React app. `/` is a small redirect sheet to `/bell`; `404.html` links there too. All copy lives in `src/content/copy.ts`; tokens, type and textures are plain CSS in `src/styles/`.

## Run

    npm install
    npm run dev          # http://localhost:5173/bell/
    npm test             # vitest, includes a full build
    npm run build        # writes out/
    npm run faces        # re-renders public/og.png and public/favicon.png
    npx tsx scripts/qa.ts   # screenshots into .parity/ (gitignored) at 1280 and 390, dark, light, textures off, plus the TerpScout block closed and open; checks the disclosure in Chromium and WebKit

The Playwright scripts use the bundled Chromium and fall back to the installed Chrome.

## Publish

`.github/workflows/nertia-publish.yml` builds `out/` and runs `npx @nersh/publish out --site $NERTIA_SITE` on every push to `main`. That lands on staging at https://scottcamp.nertia.ai/ only. Production stays a manual decision.

Status on 2026-10-14: the code site `scottcamp` exists. Every push to `main` publishes to staging at https://scottcamp.nertia.ai/; Scott puts it live from the dashboard. Live at https://scott.camp/bell.

### Scott's three manual steps (once)

1. On nertia's admin console, create the code site at slug `scottcamp` with repository `ps2pdx/scott.camp` and your email as owner.
2. On the site's Settings, mint a publish token. In this repo: Settings, Secrets and variables, Actions: secret `NERTIA_PUBLISH_TOKEN`, and variable `NERTIA_SITE` = `scottcamp`.
3. Re-run the workflow (or push to `main`). The build lands on staging at scottcamp.nertia.ai. Put it live from the dashboard or through the connector when you are ready.

## Open facts (rendered as brackets until confirmed)

- Per-item dates for Vantage (four rows) and Nertia (Default, Distribution, Identity, Plotswitch).
- Creative practice copy for Zen Holo and Purple Scott.
- The evidence set: the sales log page, two studio frames, four FX30 screen clips. Each lands as its own commit once the files exist.

## Resolved facts

- The Euphoria night is Marquee Mondays, District, 2017: seventeen weekly nights of curated live DJs, residents Purple Scott, Dirty Deeds and Token, ending 5 June 2017. Sources: the event banners (012 dated 04 24 17; 017 dated 06 05 17, Bad Technique, Everettz, Residents) and the Purple Scott Facebook Page's past events and albums (001 Suma, a 49-photo album; 016 the Memorial Day party, 29 May 2017; 017 on Mon 5 June 2017). District, 220 SW Ankeny St, Portland, est. 2014; 9 PM, no cover; Jägermeister sponsor mark on the banners. Now the Practice row's date and first sentence. Open: whether Euphoria is the room inside District.

- TerpScout evidence, 2020 to 2022: the studio phase, now in the index row and in the TerpScout block (the TS mark shown, the rest behind the 21 and over disclosure). Sources, all Scott's own work, converted into `public/evidence/`: `terpscout/product-loop.mp4` (the spin, 720 px H.264, poster from the first frame); `terpscout/martian-fruit-print-torn.jpg` (the strain print, cultivator credit kept); page 3 of `terpscout/terp-scouts-photography-pricing-summer-2022.pdf` (Per Image Pricing, summer 2022); `terpscout/terpscout-watermark.png` as `terpscout-mark.webp` (the TS mark, 240 px lossless with alpha, on a white square tile, 120 px on desktop and 96 px on phones, the same in both modes). Removed (Scott, 2026-10-14): the Boring Glory wholesale flower menu table crop (page 1 of `terpscout/flower-menu-2022-12.pdf`, December 2022) and its caption; `public/evidence/flower-menu-table.webp` is deleted. Removed (Scott, 2026-10-14): the red Terpscout wordmark (`public/evidence/terpscout-wordmark.webp`), replaced by the TS mark. The rosin press reel (Scott, 2026-10-14: full frame, no crop, the printed mat may show): `marquee-mondays/squishy_freshpress_slow_reel.mp4` as `rosin-press-reel.mp4`, frames 0 to 120 (the separate logo end card trimmed), 720 by 1280 H.264, muted, poster from the first frame, under the spin. Removed (Scott, 2026-10-14): the Martian Fruit detail crop (`martian-fruit-detail.webp`) and the Trap Fuel full bud study (`trap-fuel-full-bud.webp`, from `marquee-mondays/trap fuel live.jpg`), with their captions.

- Evidence layout (Scott, 2026-10-14: "everything full width on top of each other is best for assets to start"; "the cannabis stuff should be behind an age gate"): every evidence figure in every block stacks full width in the content column, one above the next, Meta caption under each; no side-by-side pairs. A source narrower than the column sits at its own pixel width and is never upscaled. The TerpScout block shows only the TS mark on its white tile. The spin, the rosin press reel, the Martian Fruit print and the Per Image Pricing page sit inside a closed-by-default native `<details>` at the end of the block, summary "Cannabis product work, 21 and over" with Show or Hide, no persistence. Its contents render only after the first open, so nothing inside downloads while it is closed (checked in Chromium and WebKit by `scripts/qa.ts`); the spin plays only once open and in view, and pauses when the disclosure closes. Reduced motion, reduced data and forced colors get the poster still instead of the video. The spin sits in a black figure no wider than 480 px on desktop (the full column on phones), capped at 52vh, caption beneath.

- Years for the TerpScout evidence, from file creation dates: the spin ("Comp 1.mp4") was exported 2022-12-08, so its caption reads 2022; the Martian Fruit print ("Martian Fruit Print.jpg") was created 2022-09-22, so its caption reads 2022; the Squishy reels are from May 2024 and are not on the page.

- Sweet Life and LTRMN years, the TerpScout "Network" row: 2017 to 2020. Source: the resume on the page (`public/Scott_Campbell_Resume.pdf`): The Sweet Life, Account Executive, Oct 2017 to Dec 2019; LTRMN, Business Development Manager, Jan 2019 to Dec 2020.

- Nertia index year: Scott: started December 2025; the resume's Jan 2023 is wrong and Scott will reissue the PDF. The index row stays 2025 and the Nertia origin row reads 12/2025. Note: the repo's first commit is dated 01/15/26 (the date the origin row carried before); it is kept here, not on the page.

- ScoutCamp revenue: Scott: $10M total, 2020 to 2022; the resume's '$10M+ annual' is to be corrected by Scott. Hero fact 04, the TerpScout Volume and Delivery rows and index row 03 now read 2020 to 2022 and $10M, with no per-year rate.

## Design sources

- `design/README.md`: which photograph each texture was cut from; `design/source/` holds those frames, `scripts/cut-tiles.py` reproduces `public/textures/`.
- Spec: `docs/superpowers/specs/2026-10-13-scott-camp-design-system.md` in `ps2pdx/nertia`, branch `claude/personal-website-design-ec0a29` (PR #1176), alongside the build plan in `docs/superpowers/plans/2026-10-14-scott-camp-site.md`.
- Canvas prototype: https://claude.ai/artifact/R5WnhPbqkKSfmzCWyAY4na (`project/Main.dc.html`).
- Originals on Scott's Mac: `~/Desktop/untitle/fullsize/` and `~/Desktop/untitle/fullsize/new/`; Photos album `somethings click'd`.

## Decisions taken in the last review pass

- Design system block (2026-10-14): tiers and the lead from `docs/design-system-contract.md` in ps2pdx/nertia; tool lines from the MCP tool list in `src/lib/mcp/jsonRpcEngine.ts`. The two figures are `npx create-nersh@latest` (0.2.0) scaffolding its default catalogue site in a scratch folder, built with `next build` once under `skinId: zinc` and once under `skinId: orange` (nothing else changed; `ds` was empty), shot at 1280 by 800 from `next start`.

- The Zen Holo and Purple Scott spec sheet cards are hidden (2026-10-14) while their copy is pending; their Index rows stay. The cards return as soon as Scott supplies the copy: drop `placeholder: true` from their entries in `src/content/copy.ts`.

- KAL Contracting is out of the Index (Scott, 2026-10-14); the rows run 01 to 13 with no gap and the volume faces follow (Pharm to Body is Vol. 07, Zen Holo and Purple Scott are 12 and 13).

- Type is three roles at four sizes (Scott, 2026-10-14: "too many font variations, simplify for digestibility"). Display, Helvetica Neue Bold uppercase: `--t-display` (fluid, the hero headline only) and `--t-title` (28 px, 20 px on phones: section titles, the volume face numbers and names, spec sheet titles). Text, Helvetica Neue regular: `--t-text` (18 px, 16 px on phones: leads and card bodies). Meta, Courier New regular uppercase: `--t-meta` (13 px, 11 px on phones: eyebrows, nav cells, running heads, captions, index and table cells, spec sheet fields, tech sheet text, footer links, button and disclosure labels); transcript rows are `--t-meta` in sentence case. Tech sheets size their viewBox to their rendered width so their text stays `--t-meta`; they sit in a row of 480 px sheets that wraps. The OG and favicon faces keep their own sizes: they are images, not page type. Work spec sheets sit two across so a volume name at `--t-title` fits its recto. Distinct font declarations went from 34 to 19 (5 of the 19 are the OG and favicon face sizes); inventories in `.parity/type-inventory.md` and `type-inventory-after.md`. The button label is now Meta, not the 14 px Display label; it keeps its 0.3 px ink bleed.

- Light `--focus` is dark green `#005a14` (volt fails 3:1 on white); dark keeps volt. The spec says focus is the cloth in both modes.
- Light `--fg-muted` is 75% black, not 45%, so muted copy passes 4.5:1 on the light board after grain.
- Light page surface is eggshell `#f3f1ea` (`--s-page`, light `--bg`), not white (Scott, 2026-10-14). Pure white stays only where the canvas draws it: the punch holes (`--hole`, the white layer beneath the sheet), the spec sheet (`--sheet`) and the tech sheet punches. Light grain is 0.14. The grain tiles are high-pass images centred on mid grey; `filter: brightness(2)` on the grain layer rebases that grey to 1.0 so `multiply` leaves the surface colour itself (eggshell stays eggshell, black stays black) and only the fibres darken. With textures off the page is the flat `--bg`.
- The Vantage and TerpScout running heads keep their brackets: the spec sets those date ranges as Bracket devices, not as unknowns.

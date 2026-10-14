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

- TerpScout evidence, 2020 to 2022: the studio phase, now in the index row and in the TerpScout block (the wordmark shown, the rest behind the 21 and over disclosure). Sources, all Scott's own work, converted into `public/evidence/`: `terpscout/product-loop.mp4` (the spin, 720 px H.264, poster from the first frame); `terpscout/martian-fruit-print-torn.jpg` (the strain print, cultivator credit kept, plus a 320 px trichome detail cut 1:1 from the source); page 3 of `terpscout/terp-scouts-photography-pricing-summer-2022.pdf` (Per Image Pricing, summer 2022); `terpscout/terpscout-wordmark-red.webp` (the mark). The Squishy fresh press reel is left out: the Squishy Scientific logo is printed on the mat and fills its end card. Removed (Scott, 2026-10-14): the Boring Glory wholesale flower menu table crop (page 1 of `terpscout/flower-menu-2022-12.pdf`, December 2022) and its caption; `public/evidence/flower-menu-table.webp` is deleted.

- Evidence layout (Scott, 2026-10-14: "everything full width on top of each other is best for assets to start"; "the cannabis stuff should be behind an age gate"): every evidence figure in every block stacks full width in the content column, one above the next, Meta caption under each; no side-by-side pairs. A source narrower than the column (the wordmark, the detail crop) sits at its own pixel width and is never upscaled. The TerpScout block shows only the red wordmark. The spin, the Martian Fruit print, its detail and the Per Image Pricing page sit inside a closed-by-default native `<details>` at the end of the block, summary "Cannabis product work, 21 and over" with Show or Hide, no persistence. Its contents render only after the first open, so nothing inside downloads while it is closed (checked in Chromium and WebKit by `scripts/qa.ts`); the spin plays only once open and in view, and pauses when the disclosure closes. Reduced motion, reduced data and forced colors get the poster still instead of the video. The spin sits in a black figure no wider than 480 px on desktop (the full column on phones), capped at 52vh, caption beneath.

- Years for the TerpScout evidence, from file creation dates: the spin ("Comp 1.mp4") was exported 2022-12-08, so its caption reads 2022; the Martian Fruit print ("Martian Fruit Print.jpg") was created 2022-09-22, so its caption reads 2022; the Squishy reels are from May 2024 and are not on the page.

- Sweet Life and LTRMN years, the TerpScout "Network" row: 2017 to 2020. Source: the resume on the page (`public/Scott_Campbell_Resume.pdf`): The Sweet Life, Account Executive, Oct 2017 to Dec 2019; LTRMN, Business Development Manager, Jan 2019 to Dec 2020.

- Nertia index year: Scott: started December 2025; the resume's Jan 2023 is wrong and Scott will reissue the PDF. The index row stays 2025 and the Nertia origin row reads 12/2025. Note: the repo's first commit is dated 01/15/26 (the date the origin row carried before); it is kept here, not on the page.

- ScoutCamp revenue: Scott: $10M total, 2020 to 2022; the resume's '$10M+ annual' is to be corrected by Scott. Hero fact 04, the TerpScout Volume and Delivery rows and index row 04 now read 2020 to 2022 and $10M, with no per-year rate.

## Design sources

- `design/README.md`: which photograph each texture was cut from; `design/source/` holds those frames, `scripts/cut-tiles.py` reproduces `public/textures/`.
- Spec: `docs/superpowers/specs/2026-10-13-scott-camp-design-system.md` in `ps2pdx/nertia`, branch `claude/personal-website-design-ec0a29` (PR #1176), alongside the build plan in `docs/superpowers/plans/2026-10-14-scott-camp-site.md`.
- Canvas prototype: https://claude.ai/artifact/R5WnhPbqkKSfmzCWyAY4na (`project/Main.dc.html`).
- Originals on Scott's Mac: `~/Desktop/untitle/fullsize/` and `~/Desktop/untitle/fullsize/new/`; Photos album `somethings click'd`.

## Decisions taken in the last review pass

- Light `--focus` is dark green `#005a14` (volt fails 3:1 on white); dark keeps volt. The spec says focus is the cloth in both modes.
- Light `--fg-muted` is 75% black, not 45%, so muted copy passes 4.5:1 on the light board after grain.
- Light page surface is eggshell `#f3f1ea` (`--s-page`, light `--bg`), not white (Scott, 2026-10-14). Pure white stays only where the canvas draws it: the punch holes (`--hole`, the white layer beneath the sheet), the spec sheet (`--sheet`) and the tech sheet punches. Light grain is 0.14. The grain tiles are high-pass images centred on mid grey; `filter: brightness(2)` on the grain layer rebases that grey to 1.0 so `multiply` leaves the surface colour itself (eggshell stays eggshell, black stays black) and only the fibres darken. With textures off the page is the flat `--bg`.
- The Vantage and TerpScout running heads keep their brackets: the spec sets those date ranges as Bracket devices, not as unknowns.

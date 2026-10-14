# scott.camp

Scott Campbell's site, at scott.camp/bell. One page in seven sections (Hero, Vantage, Nertia, TerpScout, Work, Creative practice, Contact) plus a specimen of the design system at /specimen. A nertia code site: built here, published to nertia by the workflow on every push to `main`, never edited in the editor.

Vite multi-page React app. `/` is a small redirect sheet to `/bell`; `404.html` links there too. All copy lives in `src/content/copy.ts`; tokens, type and textures are plain CSS in `src/styles/`.

## Run

    npm install
    npm run dev          # http://localhost:5173/bell/
    npm test             # vitest, includes a full build
    npm run build        # writes out/
    npm run faces        # re-renders public/og.png and public/favicon.png
    npx tsx scripts/qa.ts   # screenshots into .parity/ (gitignored) at 1280 and 390, dark, light, textures off

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
- Hero fact 04 reads "$10M sold, 2019 to 2021, regulated CPG", the two-year total of the $5M a year in TerpScout. You said "10M ARR"; if ARR is right, change both lines together.
- Creative practice copy for Zen Holo and Purple Scott.
- The evidence set: the sales log page, two studio frames, four FX30 screen clips. Each lands as its own commit once the files exist.

## Resolved facts

- The Euphoria night is Marquee Mondays, District, 2017: seventeen weekly nights of curated live DJs, residents Purple Scott, Dirty Deeds and Token, ending 5 June 2017. Sources: the event banners (012 dated 04 24 17; 017 dated 06 05 17, Bad Technique, Everettz, Residents) and the Purple Scott Facebook Page's past events and albums (001 Suma, a 49-photo album; 016 the Memorial Day party, 29 May 2017; 017 on Mon 5 June 2017). District, 220 SW Ankeny St, Portland, est. 2014; 9 PM, no cover; Jägermeister sponsor mark on the banners. Now the Practice row's date and first sentence. Open: whether Euphoria is the room inside District.

- TerpScout evidence, 2019 to 2022: the studio phase, now in the index row and under the TerpScout block. Sources, all Scott's own work, converted into `public/evidence/`: `terpscout/product-loop.mp4` (the spin, 720 px H.264, poster from the first frame); `terpscout/martian-fruit-print-torn.jpg` (the strain print, cultivator credit kept, plus a 320 px trichome detail cut 1:1 from the source); page 3 of `terpscout/terp-scouts-photography-pricing-summer-2022.pdf` (Per Image Pricing, summer 2022); page 1 of `terpscout/flower-menu-2022-12.pdf` cropped to the table (December 2022); `terpscout/terpscout-wordmark-red.webp` (the mark). The Squishy fresh press reel is left out: the Squishy Scientific logo is printed on the mat and fills its end card.

- Years for the TerpScout evidence, from file creation dates: the spin ("Comp 1.mp4") was exported 2022-12-08, so its caption reads 2022; the Martian Fruit print ("Martian Fruit Print.jpg") was created 2022-09-22, so its caption reads 2022; the Squishy reels are from May 2024 and are not on the page.

- Sweet Life and LTRMN years, the TerpScout "Network" row: 2017 to 2020. Source: the resume on the page (`public/Scott_Campbell_Resume.pdf`): The Sweet Life, Account Executive, Oct 2017 to Dec 2019; LTRMN, Business Development Manager, Jan 2019 to Dec 2020.

- Nertia index year: Scott: started December 2025; the resume's Jan 2023 is wrong and Scott will reissue the PDF. The index row stays 2025 and the Nertia origin row reads 12/2025. Note: the repo's first commit is dated 01/15/26 (the date the origin row carried before); it is kept here, not on the page.

## Design sources

- `design/README.md`: which photograph each texture was cut from; `design/source/` holds those frames, `scripts/cut-tiles.py` reproduces `public/textures/`.
- Spec: `docs/superpowers/specs/2026-10-13-scott-camp-design-system.md` in `ps2pdx/nertia`, branch `claude/personal-website-design-ec0a29` (PR #1176), alongside the build plan in `docs/superpowers/plans/2026-10-14-scott-camp-site.md`.
- Canvas prototype: https://claude.ai/artifact/R5WnhPbqkKSfmzCWyAY4na (`project/Main.dc.html`).
- Originals on Scott's Mac: `~/Desktop/untitle/fullsize/` and `~/Desktop/untitle/fullsize/new/`; Photos album `somethings click'd`.

## Decisions taken in the last review pass

- Light `--focus` is dark green `#005a14` (volt fails 3:1 on white); dark keeps volt. The spec says focus is the cloth in both modes.
- Light `--fg-muted` is 75% black, not 45%, so muted copy passes 4.5:1 on the light board after grain.
- The grain tiles are high-pass images centred on mid grey, which under `multiply` greyed the white page to about `#e8e8e8`. `filter: brightness(2)` on the grain layer puts that baseline back at the surface color, so the light page is white and only the fibres darken.
- The Vantage and TerpScout running heads keep their brackets: the spec sets those date ranges as Bracket devices, not as unknowns.

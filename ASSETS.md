# ASSETS.md — images I must supply (production checklist, updated 2026-11-01 from REFERENCES.md)

Order below = **production priority** (build in this order). Filenames are fixed — they match
`projects/library.json` exactly, so a dropped-in file appears on the site with zero code changes.
Numbers like D-01 / SK-01 / R-01 on the page are **auto-generated from the list order**, you never type them.

## FIRST TARGET — the minimum viable set (8 files)

With only these, the library page is review-ready: every section of project.html has real content
and the gallery count stays correct. If you stop here, delete the `library.json` entries for files
you did NOT make (see trimming note at the bottom).

| # | File | What it is | Feeds (project.html) |
|---|------|------------|----------------------|
| 1 | `images/library/drawings/section-a-a.svg` | Long section: entry through reading room | 4 DRAWINGS |
| 2 | `images/library/drawings/plan-level-01.svg` | Ground-floor plan | 4 DRAWINGS |
| 3 | `images/library/diagrams/concept-diagram-01.svg` | Circulation diagram | 3 CONCEPT |
| 4 | `images/library/renders/01-hero-exterior.webp` | Hero render (also reused in 6 CLOSING by default) | 1 HERO + 6 CLOSING |
| 5 | `images/library/renders/02-entrance-approach.webp` | Entrance / approach | 5 GALLERY |
| 6 | `images/library/renders/03-reading-room.webp` | Interior 1 — reading room | 5 GALLERY |
| 7 | `images/library/renders/06-dusk-view.webp` | Dusk view | 5 GALLERY |
| 8 | `images/library/renders/07-detail.webp` | Detail / material vignette | 5 GALLERY |

## Full target after the MVS — "then optional extras"

In the user-first order asked for: long section, ground-floor plan, circulation diagram, hero render,
then 4-5 more renders (entrance, TWO interiors: 03 + 04, dusk, detail), then extras. Extras:

| File | What it is | Feeds |
|------|-----------|-------|
| `images/library/renders/04-interior-2.webp` | Interior 2 (completes the two-interior habit) | 5 GALLERY |
| `images/library/renders/05-section-cutaway.webp` | One D5 cutaway view | 5 GALLERY |
| `images/library/renders/08-*.webp` | Optional 8th render | 5 GALLERY |
| `images/library/drawings/plan-level-02.svg` | Upper-floor plan | 4 DRAWINGS |
| `images/library/drawings/section-b-b.svg` | Cross section | 4 DRAWINGS |
| `images/library/drawings/elevation-north.svg` / `-south.svg` | Elevations | 4 DRAWINGS |
| `images/library/diagrams/concept-diagram-02.svg` | Massing evolution (3-4 steps, same camera) | 3 CONCEPT |

## Black-line style — every drawing/diagram, per REFERENCES.md

- Ground `#F5F3EF` (same as the site background), lines near-black `#1A1A1A`, no shadows/gradient fills.
- **Three line weights**: cut / building edge = 0.50 mm at 1:200 on A3; firm (windows, furniture) = 0.25;
  light (grid, hatch, paving lines) = 0.13.
- **Grey poché**: walls cut solid grey (10-15% tone from `#8A8A8A` over off-white), no black fills.
- **One burgundy accent** `#7A1F2B` per drawing at most (e.g. the entry arrow on the circulation
  diagram, the section cut-line), small area.

## How to produce each drawing (SketchUp / LayOut / AutoCAD)

**1 — Long section `section-a-a.svg`** (D-0x in DRAWINGS):
1. SketchUp: a section plane cutting the long axis (entry to reading room); make a parallel-projection scene, name it.
2. File > Export > 2D, or LayOut: one A3 page, export PDF.
3. AutoCAD: import/DWG, tidy the cut, set the three line weights, grey poché on cut walls.
4. Save As SVG (or export PNG, 2400 px wide, background `#F5F3EF`).

**2 — Ground-floor plan `plan-level-01.svg`**: AutoCAD plan at 1:200; cut line 0.50, furniture 0.25,
grid/paving 0.13; poché; north mark tiny (drawing furniture is fine, icon rows are not). Same export.

**3 — Circulation diagram `concept-diagram-01.svg`**: trace over a very light (10%) version of the ground
plan; one burgundy path arrow for the visitor journey (entry > counter > reading room > garden), labels in
11-12 px uppercase to match the site.

## How to produce the renders (D5)

All from the same SketchUp model into D5 Render; export ~1920 px wide, then convert to
**WebP, 200-400 KB each** (for example with Squoosh or Photoshop Save For Web).
- **4 — Hero `01`**: exterior, daylight HDRI, camera at standing height, slight two-point angle, people small.
- **5 — Entrance `02`**: the approach view with the open-book entry idea, still daylight.
- **6 — Reading room `03`**: interior one-point view, north/side light on the shelves, 24-35 mm.
- **7 — Dusk `06`**: 15-30 min after sunset, warm interiors against blue outside, lamps on.
- **8 — Detail `07`**: one junction deep (shelf meets seating / stair balustrade), macro feel.

## Sizes at one glance

- Renders (`.webp`): 1600-2000 px wide, 200-400 KB, lazy-loaded by the site automatically.
- Drawings/diagrams (SVG preferred): full plan view width, tiny file size; PNG fallback 2400 px wide,
  under 400 KB, background `#F5F3EF`.
- No rounded corners, no borders baked into files (the site supplies its hairlines).

## Replacing a page BACKGROUND with my own image (backgrounds, since 2026-11-01)

Backgrounds are decorative only — they never enter project image slots. Three ways
(no code edits in any of them):

1. **My own photo:** name the file after the slot and drop it in
   `images/backgrounds/cover.webp` (also `projects.webp`, `project.webp`, `about.webp`).
   That file wins over everything, at both sizes. Tip: keep it wide, ~1920 px, and
   expect the desaturation treatment; if you want your photo in color set
   `"grayscale": false` for that slot in `backgrounds-config.js`.
2. **Pick one of the 14 stock candidates:** open `backgrounds-preview.html`
   (local server) and change `"selected"` in `backgrounds-config.js` to the candidate name.
3. **Add a new candidate:** save `mypick-1920.webp` + `mypick-900.webp` (900 = phone)
   into `images/backgrounds/`, add the name to `candidates` in `backgrounds-config.js`,
   and add a credit line in `images/BACKGROUNDS.md` AND the `credits` block in
   `backgrounds-config.js` (the about-page Credits section reads from it).

Overlay strength: `"overlay"` per slot — cover 0.6 (flat veil, ink text >= 4.5:1),
inner pages 0.08 ("very low visibility"). Credits for the current picks ALSO appear
in the about page's Credits section — keep the two files in step.

## Trimming note (important if you stop at the MVS)

`projects/library.json` lists every file above. If a file was not produced, DELETE that object from the
`drawings` / `diagrams` / `gallery` arrays so no empty IMAGE TODO blocks and no wrong auto-numbers
(the D/R/SK numbers come from list position). The drawings array must stay in the order
plan > section > elevation, whatever the production order was.

# DESIGN-IDEAS.md — three directions (ideas only; nothing applied)

Made with the design-taste-frontend direction sheets (dealt from its 247-site library, seed dated 2026-10-31) and ui-ux-pro-max's design-system search. **PROJECT.md section 5 rules hold everywhere unless a change is explicitly listed.** The cover is approved and untouched.

Where PROJECT.md and a dealt sheet disagree, PROJECT.md wins. The one real conflict: taste-skill's house style bans thin rules and eyebrow labels — both are core to PROJECT.md's look, so they stay.

---

## Direction A — "Drawing Sheet" *(prescribed concept)*

**Concept:** every page *is* a construction sheet — title block, sheet number, construction lines — so office reviewers read the site like a drawing set they already know.

**Palette / type / grid:**

| Token | Value |
|---|---|
| bg | `#F5F3EF` (unchanged — PROJECT.md) |
| ink / rules | `#1A1A1A` (rules at 20% / 9%) |
| accent | `#7A1F2B` (sheet codes, active nav, dimension ticks) |
| grey | `#8A8A8A` |
| Type | Headings: **PP Editorial New → free swap: "Fraunces"** (Google, light 300) · Body/labels: **"Inter"** (Google) · both free |
| Grid | 1200px max + fixed 12-col hairline overlay; content "snaps to column lines" |
| Spacing | 8px run (8/16/24 → section 96/64) — increments read like dimension chains |

**Page changes:**

- **Title block strip (shared, new):** one fixed 40px strip at page bottom (desktop) / collapsible (phone): left `MOHAMMED HUZEFA — PORTFOLIO 2024-27`, centre current sheet code (updates on scroll), right `1:200 · OCT 2026`. Drawn with hairlines only.
- **Projects index = drawing register:** table rows, not cards: `№ | SHEET | PROJECT | TYPE | YEAR | SCALE`. Hover shows the thumbnail sliding out beside the row. Row click → project page. Register header uses the uppercase-label style.
- **Project page (plan → section → render flow):**
  1. Hero render becomes the cover sheet: big `A-00` + title in a corner title block, render framed with a thin double border.
  2. Brief = title block table (Location / Program / Year / Type / Tools as rows with hairlines).
  3. Concept keeps its text; diagrams get `SK-01, SK-02` codes.
  4. Drawings = the middle of the flow, largest on page, each with code + scale note (`PLAN · LEVEL 01 · 1:200`); a hairline "cut line" runs between drawings and gallery.
  5. Gallery = renders as "vignettes", same grid but lighter treatment, lightbox unchanged.
  6. Closing image + next-sheet link written as `CONTINUE ON A-05 →`.
- **About page:** facts as a spec table (`EDUCATION`, `SKILLS`, `TOOLS` as block types); contact block styled as a title block corner.
- **Nav:** uppercase letter-spaced, hairline under-rule; current page shows `A-XX` prefix (e.g. `A-01 PROJECTS`).

**Signature interaction — sheet-code tracking:** as you scroll, the centre of the title block ticks from `A-01` to `A-04` with a small motion like a dimension marker. Build: the existing IntersectionObserver from `script.js` sets one `data-sheet` attribute; a CSS transition cross-fades the label. Cost: ~0 KB, pure text swap, zero repaint risk.

**Dials (ui-ux-pro-max `search.py` tuning):** variance **2** / motion **2** / density **7** — deliberately conservative variance (sites like this bank on repetition and order), near-still motion, highish because register rows pack real information.

**Risks & fixes:** *Over-decoration* from construction lines → only 3 motifs (rules, ticks, title block), nothing more. *Title strip eats phone space* → collapses to a 24px bar with just the sheet code. *Table banality on phone* → register becomes stacked rows with left sheet-code column retained.

**Optional cover changes (separate, not applied):** add a discreet `A-00` in the corner echoing the title block. Only for consistency across the set; design untouched otherwise.

---

## Direction B — "Prints on a Wall" *(taste-skill: uneven-photographs, dealt sheet)*

**Concept:** the pages feel like prints pinned to a gallery wall — a light 12-column grid, each image at its own size and offset (100% / 72% / 60%) — the unevenness does the art direction while text stays small and light.

**Palette / type / grid:**

| Token | PROJECT.md-safe value | Dealt sheet value (override flag ⚑) |
|---|---|---|
| bg | `#F5F3EF` | `#0c0a08` warm black |
| ink | `#1A1A1A` | white |
| muted | `#8A8A8A` | `#8f8a84` |
| accent | `#7A1F2B` | gold `#c9a45a` |

⚑ **Proposed change (only if you want the dark variant):** warm-black ground makes renders glow like backlit prints; rejected for now because PROJECT.md fixes the off-white ground.
Type: **Clash Grotesk** (Fontshare, free) — 400 everywhere, display at 6–9vw, body 17–19px, no second family. Grid: 12 columns, 5–7vw margins, heights staggered 120–260px but always on column lines.

**Page changes:**

- **Projects index = staggered tiles, empty cells:** 4-col grid with some cells intentionally blank, tiles at mixed spans (2-col 3:2 next to 1-col 4:5...), heading occupying one empty cell; caption row: name left / year-type right.
- **Project page section by section:** hero → one large off-centre render (cols 6–12, 16:10) under a two-line stepped title; brief → text on four columns, empty four opposite; concept → paragraph next to one square diagram; drawings → pairs at unequal widths and vertical offsets (labels and captions still required by PROJECT.md); gallery → the stagger becomes the gallery, lightbox kept; closing → single full-bleed dim render with next-project link bottom-left.
- **About page:** wide photo with a paper-colour text block overlapping its top-right; facts as 2×2 label/value pairs (education / skills / year / city).
- **Nav:** three small items along the top edge — link left, wordmark centred, contact right — no underline hover, hover shifts type weight 400→500.

**Signature interaction — print lift:** hovering a print lifts it 2–4px and shows a one-line caption; neighbours fade to 60% for a wall-of-prints feel. Build: CSS `:hover` on figure with `transition: transform .25s, opacity .25s`; ~0 cost, transform/opacity only. `prefers-reduced-motion` skips the lift.

**Dials:** variance **7** / motion **3** / density **4** — high variance is the direction's engine; low density so whitespace does the talking.

**Risks & fixes:** *Too many big images → load time* → 6 WebP at 200–400 KB, lazy-loaded, one family of crops reused (taste-skill rule). *Uneven feels random* → every edge lands on a grid line; offsets come from a 3-value set only. *Renders dark on dark (photo moods)* → keep the light palette variant for now. *Mobile* → keep the stagger: alternating 100%/72%/60% widths, not full-width stack.

---

## Direction C — "Monument" *(taste-skill: name-as-monument, dealt sheet)*

**Concept:** the name is the architecture — set so large it fills the first screen, after which the page goes deliberately small and calm — scale contrast is the whole visual event.

**Palette / type / grid:**

| Token | PROJECT.md-safe value | Dealt sheet value (override flag ⚑) |
|---|---|---|
| bg | `#F5F3EF` | `#0f1f10` forest |
| ink | `#1A1A1A` | white / forest inverted sections |
| accent | `#7A1F2B` | lime `#c6f19d` (small squares only) |

⚑ **Proposed change:** the dealt palette alternates ground colours section by section; would replace PROJECT.md's single off-white ground. Kept light for now.
Type: **Erode** (Fontshare, free) — display 500 at 16–24vw with tight tracking; small text 13–17px; navigation in the name's own family. Grid: tight margins (20–32px), two sizes do all work (monument + small), one mid size for section headings.

**Page changes:**

- **Projects index:** no cards — a loose scatter: each project a single large image at its own width and side on the 12-col grid, name above top-left in 13px, one-line description below; 22–30vh pauses between.
- **Project page:** hero → title over first render with the name pinned above (title crosses the image's top quarter); brief → "side facts" rows sharing one vertical line at 34% width; concept → right-half paragraph, lone photo opposite; drawings → full-width inserts, one per viewport, caption under the bottom-left corner; gallery → images alternate 100%/68%/82% widths; closing → "email as display type" trick reused: the next-project link set as full-width display type at the bottom.
- **About page:** side-facts table (Education / Skills) + one wide paragraph on the centre line; contact rendered as display type (the dealt "email as display type" blueprint).
- **Nav:** wordmark top-left, one "Menu" word top-right; sections of the page reached by scroll.

**Signature interaction — pinned story:** the name stays `position: sticky` at the top while 4–5 project images scroll past beneath it, each swap carrying its own caption line. Build: CSS `position: sticky` + the existing IntersectionObserver toggling an `is-active` class on images; ~40 lines JS total, no scroll-jacking, GPU-friendly opacity swaps.

**Dials:** variance **5** / motion **4** / density **3** — monument needs stillness below the fold; motion budget spent entirely on the pinned reveal.

**Risks & fixes:** *Webfont Erode at 20vw = layout shift (CLS)* → `font-display: swap` + `size-adjust` fallback; or system serif while loading. *Long name breaks the monument* → "MOHAMMED HUZEFA" stacks 2 lines or crops at the viewport edge; never below 12vw. *Skimmers lose structure* → every section keeps its heading (PROJECT.md rule). *Over-design* → the small-text layer stays truly small — body never creeps above 20px.

---

## Recommendation

**Direction A (Drawing Sheet), with two small imports from B.** Reasons: it is the only concept that comes from the subject itself (an office reviewer's daily material — drawing sets, not gallery walls); it needs no new assets beyond what ASSETS.md already lists; it works on the first phone swipe; and it needs the least deviation from approved PROJECT.md rules (the hairline grid is already the house style — this direction just names it). Borrow from B: (1) the staggered index tiles *as a fallback layout if the register feels too dry*, (2) B's caption-row pattern (name left / year-type right) under every index thumb. C is a strong second for a later "personal site" phase, not for review season.

## Eight small upgrades (any direction; ranked by value)

| # | Upgrade | Effort |
|---|---|---|
| 1 | Scroll-position sheet-code in a persistent header/member bar (IntersectionObserver + 1 label swap) | low |
| 2 | Reading the *gallery* images with keyboard ←/→ in the existing lightbox | low |
| 3 | `@media print` stylesheet — projects print as clean sheets, captioned, no nav | low |
| 4 | Register rows on the index with hover-thumbnail preview (pure CSS, one shared img) | medium |
| 5 | WebP AVIF fallback `<picture>` for the six renders (~20–30% smaller again) | low |
| 6 | Scale toggle on drawings: tap to switch `1:200` plan into a cropped detail view (2-image crossfade) | medium |
| 7 | Real project page `<title>` + Open Graph description filled from the JSON — looks right when reviewers share links | low |
| 8 | Pinned mini-TOC on the project page (desktop only): section names with a hairline progress rule | medium |

## Avoid (portfolio sameness)

- Glassmorphism, gradients, neon/dark-tech palettes — reads as AI-generated, not architectural
- Autoplay sliders/carousels — reviewers will not wait for your best render
- Parallax and scroll-hijack — the telegram is skim speed
- Icon squads (Lucide/Feather pill rows) — drawings are the only icons allowed
- Centered hero over three text columns — the most common student portfolio layout
- "01 / 02 / 03" giant section counters + monospace captions — the other most common one
- Cursor-follow blobs, magnetic buttons, 3D card tilts — degrades skim comprehension on touch
- Rainbow section background colours — break the drawing-set credibility
- Fake loading screens / page transitions — wastes the reviewer's 30-second read

*Note: taste-skill's inspector prefers every page to move; PROJECT.md section 5 says "none, or a very gentle fade-in" — the gentle fade already built into script.js is the compliance floor and stays free in all three directions.*

*Ponytail lite: skipped loading the deal sheets' photographic assets (ideas only), didn't run the browser inspector (no page built), and didn't check Socket's 1 median-risk alert on taste-skill in depth.*

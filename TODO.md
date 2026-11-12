# TODO.md — remaining work

## TASK 11 — LIBRARY RENDER INVENTORY + INTEGRATION (2026-11-12, renders only)
- [x] Inventoried `FOLDER\5thSEM`: 37 image files — 15 are AI texture maps (`_AI_Albedo` / `_AI_Material` / `_AI_Normal`) and were excluded, as were line drawings, presentation sheets, WhatsApp photos, ID/documents and web icons.
- [x] Integrated six genuine Proposed Library renders, converted to WebP at native aspect ratio (no upscaling, sources untouched): `10-hero-exterior.webp` (Scene 14.png, 2800×1575), `11-front-approach.webp` (Image_1.png, 2000×1125), `12-aerial-view.webp` (Image_2.png, 2000×1332), `13-aerial-cutaway.webp` (Image_5.png, 2000×1333), `14-courtyard-view.webp` (Image_3.png, 2000×1125), `15-meeting-room.webp` (meething room vray.png, 2000×1125).
- [x] `projects/library.json`: hero → `10-hero-exterior.webp`; gallery → front approach, aerial, aerial cutaway, courtyard + open-air theatre, meeting room, then the still-pending sectional elevation; closing → `13-aerial-cutaway.webp` (so the closing no longer repeats the hero). Captions/alt text describe only what the image shows.
- [x] Verified in Chrome at 1440×900, 390×844 and 360×780 after lazy-loading settled: all five gallery images load, the missing section falls back to its IMAGE TODO block (no broken card), caption rows fit, `cardOverflow` 0, no horizontal overflow, console clean. Only the 5 pending files 404. Screenshots `test-shots/task11-*.png`.
- [x] `node check-placeholders.js` still exits 1: 5 missing, 0 stand-ins — do not weaken it.
- [ ] **Four CAD drawings still pending** — `plan-level-01.svg`, `plan-level-02.svg`, `section.svg`, `elevation.svg`. Do not fabricate from the PDF.
- [ ] `05-section-cutaway.webp` still pending (source p22 is a drawing sheet, not a render).
- [ ] The four Task 10.2 PDF-derived files (`01`, `02`, `08`, `09`) are all unused now; kept on disk deliberately (no overwrite/delete).

## TASK 10 — PROJECT FACTS + BROWSER VERIFICATION (2026-11-11, done)
- [x] Compact `PROJECT FACTS` block added to the project page (`script.js`, `.proj-facts` in `styles.css`), driven entirely by `projects/library.json`: Project, Location, Academic year, Type, Site area, FSI, Built-up area, Software. Two-column hairline table on desktop, stacked on ≤719px; long values wrap, no horizontal overflow at 360/390/1440.
- [x] `projects/library.json` meta keys normalised (`Year` → `Academic year`, `Tools` → `Software`) and `Built-up area` (2,355.15 m²) added; `FACT_KEYS` updated so the first-screen meta line still reads Location · Academic year · Program.
- [x] Async render verified in real Chrome via DevTools Protocol (waits for `#project-root` to populate, not a fixed delay): title, title block, hero, brief, facts, concept, drawings, gallery, closing all built; console clean; missing-project URL shows the 404 state; internal links return 200. Screenshots in `test-shots/task10-*.png`.
- [x] `node check-placeholders.js` runs after Task 10.2: now exits 1 with **5 missing, 0 stand-ins** — expected; do not weaken it.
- [x] **TASK 10.1:** first-screen meta line now prints Program only — Location and Academic year appear once, in the facts table (verified 1440/390, no overflow).

## TASK 10.2 — RENDER ASSETS FROM THE PORTFOLIO PDF (2026-11-11, renders only)
- [x] Extracted the four approved exterior renders from the embedded bitmaps in `cad porfolio final pp4.pdf` (read-only source, no page re-render): `01-hero-exterior.webp` and `02-entrance-approach.webp` (p24 crop 2400×1232 / 2000×1027), `08-aerial-view.webp` (p23, 1388×713), `09-courtyard-view.webp` (p25 clean 16:9 inset, 2400×1350). Sheet margin, title block and the "ISOMETRIC / SCALE FIT TO PAPER" stamp were cropped out; nothing was drawn, retouched or upscaled.
- [x] Verified in Chrome: all four files load (`naturalWidth` 2400/2000/1388/2400), gallery and hero render, console clean, only the 5 still-missing files 404. Screenshots `test-shots/task10-1-*.png`.
- [x] **Renders came from a Canva-flattened PDF** — superseded by Task 11: native 3840 px renders from `FOLDER\5thSEM` are now in the hero and gallery.
- [x] **Hero and gallery R-01 used the same render** — resolved in Task 11: hero is `10-hero-exterior.webp`, gallery R-01 is `11-front-approach.webp`, closing is `13-aerial-cutaway.webp`.
- [ ] **The four drawings cannot come from this PDF**: each page holds one flattened A3 bitmap (p21/p22 ~90 DPI), so exporting `.svg` would fake vector. Awaiting CAD exports at `images/library/drawings/plan-level-01.svg`, `plan-level-02.svg`, `section.svg`, `elevation.svg`.
- [ ] `05-section-cutaway.webp` is held with the drawings — its source (p22) is a drawing sheet, not a render.

## TASK 09 — LIBRARY CONTENT (2026-11-11, drafted)
- [x] `projects/library.json` populated from the verified portfolio: title, Hubli location, 2026–27, academic proposal type, program, site area 8,000 m², FSI 0.294, tools; brief written; `projects/index.json` title/year/type updated so the register shows "Proposed Library".
- [x] Drawing array consolidated to four verified sheets: GF plan (p30), FF plan (p29), sectional elevation (p22), front elevation (p21). The two sections, two directed elevations and both concept-diagram slots were removed.
- [x] Gallery reduced to four verified exterior views (p24 approach, p23 aerial, p25 courtyard, p22 section).
- [ ] **Concept is a draft awaiting student review** — "Three Wings, One Centre" is in the JSON with a visible DRAFT label; do not treat it as final.
- [x] **Render files now exist** (Task 11): hero, front approach, aerial, aerial cutaway, courtyard/open-air theatre and meeting room. Only `05-section-cutaway.webp` is still missing.
- [ ] **Four drawing files still missing**: `plan-level-01.svg`, `plan-level-02.svg`, `section.svg`, `elevation.svg`. Export from CAD, do not trace the PDF raster.
- [x] Interior render added in Task 11: the meeting room is now gallery R-05 (`15-meeting-room.webp`).
- [ ] Dharwad case study is a separate future project page; it is not part of the Library page.

## TASK 04H/04I — TEMPORARY LIBRARY IMAGES (2026-11-10, removed 2026-11-11)
- [x] Temporary still removed from the site on 2026-11-11: `projects/library.json`, `projects/index.json`, `script.js` and `check-placeholders.js` are back to their pre-temporary state, so every render slot points at its real target (`images/library/renders/*`) and the gate reports the stock stand-ins again. `.feat-temp` CSS removed; the file itself is left untouched at `renders/clip4-exterior-temp.webp`, unreferenced.
- [ ] **Real renders still missing** — hero/front isometric, entrance approach, sectional elevation, aerial view and courtyard view, at the slot paths now in `projects/library.json`.
- [ ] **Final drawings still missing** (4 slots): `images/library/drawings/plan-level-01.svg`, `plan-level-02.svg`, `section.svg`, `elevation.svg`. No concept diagrams are referenced any more.
- [ ] **Optional door scenes** (door.html falls back to its drawn CSS scene, so not urgent): `images/scenes/door-closed.webp`, `door-closed-portrait.webp`, `door-open.webp`, `door-open-portrait.webp`, `hall.webp`, `hall-portrait.webp`.
- [ ] `node check-placeholders.js` must exit 0 before sharing or deploying. It checks every `projects/*.json`; it currently exits 1 because all 9 required files are missing and 2 renders still show stock stand-ins. Paths are deduplicated, invalid JSON and unsafe paths block the run, and leftover files in `images/placeholders/` are information only.

## TASK 04G — MOBILE COUNTER/FOOTER (2026-11-10, done)
- [x] Verified `.proj-counter` cleared the footer text by only 5.5-6.3px at 320/375/390/430px; fixed with `body.register.tb { padding-bottom: 72px }` in the <=719px block (gap now 21.5-22.3px, chip->titleblock 13px, 768/1440 unchanged). The `.proj-counter { bottom: 78px }` option was measured and rejected: it overlapped the footer links by ~10px [styles.css]
- [ ] Mohammed reviews projects.html at 320/375/390/430 scrolled to the very bottom

## TASK 03 POLISH (2026-11-07, done — tags task03-fix-1/2/3)
- [x] Title block restored (project name + SHEET A-01 from index.json; capitalized-slug fallback)
- [x] First-screen identity: hero ~72svh/min 420px (60svh portrait tablets), title + Location · Year · Program facts line visible at 1440x900 and 768x1024; per-project "focus" key documented
- [x] Lightbox: opens only on a loaded image (currentSrc, naturalWidth guard; R-01), opaque #F5F3ED veil above header/footer, visible +/−/FIT + hint, charcoal outline arrows, no caption/control overlap at 420px, reduced-motion instant
- [ ] Mohammed reviews project.html at 1440x900 / 768x1024 / 420x860 (screenshots in test-shots/); lightbox zoom/pinch/keys exercised live (not scriptable)

## STAGE 1 — ARCHITECTURAL ENTRANCE HOMEPAGE (2026-11-05, refined with Approach A — awaiting review)
- [x] Backup original index.html to index-v1.html (rollback path preserved)
- [x] Optimize assets/images/entrance-scene.png (2.1MB) to assets/images/entrance-scene.webp (134KB, 93.6% reduction; original preserved)
- [x] Integrate entrance scene into index.html using entrance.css and entrance.js
- [x] Implement 3 openings: 01 — Projects, 02 — About, 03 — Contact with square-and-dot markers and hover brighten/dim veils
- [x] Refinement (Approach A): Replaced camera zoom with expanding warm light reveal from portal center settling on #F5F3EF
- [x] Typography refinement: Removed duplicate desktop HTML title; wall inscription serves as visual title (semantic h1 for SR); added mobile-only header
- [x] Opening labels: Anchored directly below square selection markers across all screen widths
- [x] Implement Escape key cancellation (restores quiet hall) and prefers-reduced-motion bypass
- [x] Responsive layout: full-bleed cover on desktop/landscape, contain-fit stage + touch rows on mobile/portrait
- [ ] Mohammed reviews refined entrance at desktop (1440x900), tablet (768x1024), and mobile (390x844)


## DOOR WALK-THROUGH + SCROLLING PROJECTS (2026-11-05, done — see PLAN-DOOR.md)
- [x] Engine built door.html + door.js + door.css with scenes.json data (tags door-1..door-7; resume file PLAN-DOOR.md)
- [x] Scenes DRAWN in HTML/CSS (tag door-html) - no image files needed; Mohammed may still supply scene photos (door-closed/door-open/hall.webp 1920x1080 + optional -portrait variants): a photo simply covers the drawn scene and shows the AI-credit line; tune hotspot rects with door.html?debug=1 — until then door.html shows PLACEHOLDER SCENE blocks; tune hotspot rectangles with door.html?debug=1 if needed
- [ ] Set the door colour by eye: --door-color / --door-tint in door.css THEME (default keeps the photo's colour)
- [ ] Mohammed reviews door at 375 / 768 / 1440 and the new scrolling projects page
- [ ] Before sharing: `node check-placeholders.js` must pass (now also guards scenes)

## MAKHNO SKETCH COVER (2026-11-05, Phase 1+2 done — see SKETCH-COVER.md)
- [x] Phase 0 audit (see my report; DESIGN-AUDIT.md remains the inner-page audit)
- [x] Phase 1 storyboard (SKETCH-COVER.md): hand-drawn self-sketching room + ajar burgundy door, Drawing Sheet typography
- [x] Phase 2 prototype: sketch.html + sketch.css (isolated, noindex, not linked; works on file:// — double-click it)
- [ ] Mohammed reviews sketch.html at 1440x900, 768 and 390x844, and with font sizes he likes
- [ ] Owner approves (or requests style changes — palette, room, timing all tunable in sketch.css/SVG)
- [ ] Phase 3 ONLY after approval: replace index.html on the live site; keep old cover as index-v1.html; rollback tags cover-v1 / before-approved-changes stay
- [ ] Later: swap the temporary sketch for Mohammed's own drawing/renders (never published with stand-in art; honesty tag on the prototype sketch until then)

## NOW — first target: produce the minimum viable set (see ASSETS.md, marked FIRST TARGET)
- [x] Five temporary stand-in photos added + auto-swap + "PLACEHOLDER - NOT MY WORK" tag + photo credits; `node check-placeholders.js` guards publishing (2026-11-01, credits in images/PLACEHOLDERS.md). Drop a real render at its exact expected path and the stand-in disappears by itself
- [x] Page backgrounds added on all four pages from stock candidates (2026-11-01): swappable via `backgrounds-config.js` / `images/backgrounds/<slot>.webp`; preview at backgrounds-preview.html; credits on the about page + images/BACKGROUNDS.md. Review the picks by eye and change "selected" if wanted
- [ ] Long section `images/library/drawings/section-a-a.svg`
- [ ] Ground-floor plan `images/library/drawings/plan-level-01.svg`
- [ ] Circulation diagram `images/library/diagrams/concept-diagram-01.svg`
- [ ] Hero render `images/library/renders/01-hero-exterior.webp`
- [ ] Entrance `.../02-entrance-approach.webp` · Reading room `.../03-reading-room.webp`
- [ ] Dusk view `.../06-dusk-view.webp` · Detail `.../07-detail.webp`
- [ ] If stopping at the MVS: trim `projects/library.json` to only the files produced (ASSETS.md trimming note)
- [x] Template page built and filled from `projects/library.json` (2026-10-31, placeholders intact)
- [x] About page built on `about.html`, content filled from `projects/about.json` in Mohammed's wording (2026-10-31)
- [x] Fonts decided (2026-10-31): Fraunces + Inter from Google Fonts, `display=swap`, system fallbacks; cover keeps system fonts (untouched)

## NEXT — text
- [ ] Fill all TODO fields in `projects/library.json` (title, location, program, year, concept text, captions)
- [ ] Fill `projects/index.json` title/year/type for the Library once Mohammed decides them
- [ ] Send contact details for `projects/about.json` (email, phone, city, LinkedIn) + the finished portfolio PDF URL — the about page shows those lines automatically once real
- [ ] Review the filled page and approve it (then it becomes DONE in PROJECT.md section 2)

## LATER — rest of the site
- [ ] Second project page (add `projects/<slug>.json` + one entry in `projects/index.json` + images in `images/<slug>/`; no new HTML needed)
- [ ] About photos: one sketch or physical-model photo for the about page (ideas in REFERENCES.md section 4)
- [ ] Optional extras beyond the MVS: upper plan, cross section, elevations, 2nd interior/cutaway renders, massing diagram (ASSETS.md "Full target")
- [ ] Contact page (link is already in the nav)
- [ ] Deployment: GitHub Pages or Netlify, free (README has the steps). Note: OG image links resolve fully only after deploy
- [ ] Remove the noindex meta tag from the four pages before sharing the link, after check-placeholders.js passes
- [ ] "Direction A" strip uses placeholder sheet text "SCALE 1:200 · OCT 2026" — give real scale/date values if wanted

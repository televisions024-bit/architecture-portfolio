# TODO.md — remaining work

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

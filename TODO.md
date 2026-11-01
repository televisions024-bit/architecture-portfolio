# TODO.md — remaining work

## NOW — first target: produce the minimum viable set (see ASSETS.md, marked FIRST TARGET)
- [x] Five temporary stand-in photos added + auto-swap + "PLACEHOLDER - NOT MY WORK" tag + photo credits; `node check-placeholders.js` guards publishing (2026-11-01, credits in images/PLACEHOLDERS.md). Drop a real render at its exact expected path and the stand-in disappears by itself
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
- [ ] "Direction A" strip uses placeholder sheet text "SCALE 1:200 · OCT 2026" — give real scale/date values if wanted

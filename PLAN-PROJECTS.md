# PLAN-PROJECTS.md — projects + project page polish (Nov 2026)

Resume rule: on "continue", resume at the first unticked box.

- [ ] STEP 0: tag before-projects + this plan file
- [x] STEP 1: fix class/id mismatches between projects.html, styles.css, script.js — none found; audit 2026-11-06 confirmed all references resolve (snap code exists only in -v1 backups, not loaded)
- [x] STEP 2: motion tokens in styles.css (--ease/--t-*) + @view-transition page fade + .reveal clip-path wipe (JS gated, reduced-motion instant)
- [x] STEP 3: projects.html editorial layout — dominant featured project + quiet numbered list (projects/index.json "featured" key documented)
- [x] STEP 4: project page polish — facts row, numbered Brief/Concept, render rhythm grid, sheet-grid captions, next-project teaser
- [x] STEP 5: existing lightbox shows sheet code | title | scale in caption; counter/zoom/pan intact
- [x] STEP 6: performance — width/height + decoding async + lazy loading on every img except first screen; list non-WebP / >350KB images
- [ ] STEP 7: node --check all JS, node check-placeholders.js, ?v= bumps, diff audit vs before-projects, tag projects-done

Rules: no push, TODO values never render, Drawing Sheet palette only, index.html / entrance.* / about.html untouched.

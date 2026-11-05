# PLAN-DOOR.md — "walk into the house" sequence + scrolling projects page

> Resume rule: if Mohammed says "continue", read this file and do the FIRST
> unticked step. One commit per step, tag `door-N`, one CHANGELOG line, tick here.

- [x] STEP 0 SETUP — git tag `before-door` (door.html/door.css were already
      committed at dd25327, so no "wip: old CSS door" commit was needed; the
      dirty doc/sketch files from the previous session were committed first so
      the tag lands on a clean tree). This file created.
- [x] STEP 1 DATA + THEME — scenes.json (door + hall, hotspots, credit),
      door.css with a single "THEME" variable block incl. door recolour
      (--door-color / --door-tint), ?debug=1 hotspot outlines, placeholder
      blocks when scene images are missing.
- [x] STEP 2 ENGINE — door.html + door.js: cover-sized stage, real
      button/link hotspots, crossfade, camera transform (door -> hall only),
      #door/#hall hashes, skip link first in tab order, top bar, noscript
      list, next-scene preloading, contrast >= 4.5:1, reduced motion.
- [ ] STEP 3 DOOR — leaf rotation (crop of door-closed, rotateY round the
      hinge), reveals door-open, camera push into hall; sessionStorage
      "seen" starts repeat visits at the hall; graceful crossfade fallback.
- [ ] STEP 4 HALL — Projects / About / Contact openings; add the missing
      `id="contact"` anchor (it lives in the CONTACT section built by
      script.js, not in about.html); quick fade then navigate.
- [ ] STEP 5 SCROLLING PROJECTS PAGE — projects.html one tall section per
      project (big number, title, year/type, thumbnail, whole-section link,
      sheet code kept), fixed "1 / N" counter, IO fade/slide, proximity
      scroll-snap, reduced-motion opt-out, link to door.html#hall.
- [ ] STEP 6 VIEWER — upgrade the existing initLightbox in place: zoom
      (wheel / +/- / double click / pinch), pan drag, fullscreen button,
      visible prev/next, swipe, Esc, focus trap, counter + caption kept.
- [ ] STEP 7 PHONES — portrait scene images when the viewport is portrait;
      screenshot check at 375 / 768 / 1440 where a headless browser allows.
- [ ] STEP 8 LINK-UP — one "Enter" link in index.html to door.html (nothing
      else), cache-bust ?v= bump on touched pages, extend
      check-placeholders.js with scene placeholders, run it, update TODO.md
      and PROJECT.md section 10, tag `door-done`, final report.

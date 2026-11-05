# SKETCH-COVER.md — Phase 1+2 storyboard & spec (MAKHNO guide)
Status: PROTOTYPE. Created 2026-11-05 under OPENCODE_MAKHNO_MASTER_BUILD_GUIDE.md.
Supervised by: DOOR-COVER.md content/contrast rules; PROJECT.md section 5 palette.
Nothing here replaces index.html. The live cover, door.html and all rollback tags stay untouched.

## Approved creative direction
Full MAKHNO-inspired immersive opening + hybrid identity (immersive visuals, Drawing Sheet
typography), refined per owner's message: **hand-drawn animated architectural sketch style**
for the prototype; visual style refined later.

## Technical approach (chosen)
**Option D hybrid, vector-first:** the immersive scene is a single inline SVG hand-sketch
(one-point perspective room, ajar door, light) whose lines DRAW THEMSELVES with CSS
stroke-dash animation + a subtle turbulence filter for the hand feel. Zero images, zero
libraries, zero JS. Trade-offs:
- Chosen over WebGL (guide option B): no GPU/bundle risk, works on file:// and old phones.
- Chosen over pre-rendered video (C): no blocking media, tiny payload, crisp at any size.
- Interpretation B considered - "plan lines morph into perspective" - rejected for now:
  needs JS path morphing, heavier and less beginner-editable. Slot for a later refinement.

## Storyboard (5 frames)
1. LAND  - paper #F5F3EF fills screen. Title block left (same 3 lines as live cover).
           Sketch room already half-drawn, drawing finishes over ~2s. Nav + links LIVE immediately.
2. BUILD - wall/floor/ceiling lines complete; door frame draws; glazing mullion appears.
3. WARM  - door leaf (flat burgundy) and doorway light (flat #F3E3C3, sanctioned by
           DOOR-COVER.md) fade in; light spill puddles on the floor.
4. GUIDE - burgundy ENTER arrow draws along the floor toward the door; dimension line + ticks
           (Drawing Sheet language) confirm 1:200 sheet feel.
5. ARRIVE - hotspots are semantic links: View projects -> projects.html, About me -> about.html,
           nav header (About / Projects / Contact disabled) always visible. Native navigation,
           no fake page transition. Drawing is non-blocking, so no extra skip link is needed;
           every destination is reachable from frame 1.

Reduced motion: all lines/fills shown completed instantly. Print/explanation of replacement:
the sketch is TEMPORARY stand-in artwork (tagged on-page) until Mohammed's own drawing/renders
are supplied - same honesty rule as images/PLACEHOLDERS.md; never presented as his work.

## Motion values (emil-design-eng + guide 1.3)
- One-time explanatory motion: line draw 0.3-0.9s per path, staggered, total ~2s. ease default.
- Fills/texts: opacity fade 0.5s ease-out, staggered after their lines.
- Hover/focus on links: instant ink/burgundy colour swap (Direction A rule - no lift, no bounce).
- Keyboard-initiated navigation: never animated (native link navigation).
- prefers-reduced-motion: reduce -> animation: none, everything visible immediately.

## Integration / rollback plan (needs owner approval - Phase 3)
- Prototype pages sketch.html + sketch.css stay ISOLATED and unpublished.
- After review: owner says "approve" -> only then index.html gets replaced, with the old cover
  kept as index-v1.html and tags cover-v1 / before-approved-changes intact.
- Future real artwork: swap the inline sketch for Mohammed's own drawing (SVG/PNG at
  images/cover/), or feed his D5 renders as flat perspective planes - no code redesign needed.

## v3 — realism pass (owner feedback, 2026-11-05)
Target mix ≈ 70% material realism / 30% pencil. Still: zero images, zero libraries, zero JS/WebGL.
- Three-act sequence: (1) pencil draws as before; (2) procedural material fades in layer by layer;
  (3) crisp Drawing Sheet annotations draw last over the finished scene.
- Materials are all procedural SVG filters: plaster/floor mottle (turbulence + blur),
  wood grain on the burgundy leaf (stretched turbulence, multiply), soft blurred cast
  shadows, AO bands at wall/floor/ceiling junctions.
- Warm directional light: radial light pool + hot core on the floor from the opening,
  warm bloom around the frame, faint glazing sheen. The door gains routed panels + ivory handle.
- The pencil stays visible: strokes group settles to 45% opacity with mix-blend multiply
  so the graphite reads etched into the material surface.
- Gradients are used ONLY for light/AO/shadows — an explicit owner instruction for realism,
  overriding PROJECT.md's flat-veil cover rule inside this prototype.
- Tunables: filter seed/scale, gradient strengths (stop-opacity), .ink final opacity, delays.

## v4 — full-screen immersive environment (owner direction, 2026-11-05)
Layers bottom→top (photo on the bottom, sheet on top):
1. `.backdrop` — full-bleed CSS-background photo, cover-05-courtyard
   (1920 desktop / 900 phone; temporary stand-in, © Kubra Nur Sahin, Pexels).
   `prefers-reduced-data` drops the photo, paper remains.
2. `.sheet` SVG overlay — hairline sheet frame + corner ticks + labels
   draw over the photo, then settle to .4 graphite print (Drawing Sheet
   identity over reality).
3. `.title-block` — flat opaque paper panel (no blur/glass): the three
   approved lines + View projects / About links. H1 sized so
   "ARCHITECTURE" never clips (78px cap fits the 560px panel).
4. `.door` — OVERSIZED door as its OWN stacked layer, real <a href="projects.html">
   standing in the portico: threshold (warm light) under a static ground
   shadow, then `.leaf` (burgundy SVG: wood-grain filter, routed panels,
   ivory handle, sun-gradient light). Hover/focus = ajar 8°; click =
   swing to 82° revealing the light, then navigation (sketch.js ~25 lines,
   hold 950ms). No-JS = plain link; prefers-reduced-motion = instant jump,
   no swing; door carries a pencil portal outline (`.portal`) that draws
   itself and settles.
5. `.honesty` — visible credit: temporary environment photo + concept-art
   disclaimer (Pexels/Kubra Nur Sahin), per the honesty rule.
All content is one door in one scene; MAKHNO used for scale/atmosphere only.

## v5 — door realism + grounding pass (owner direction, 2026-11-05)
Photo geometry FIRST: cover-05-courtyard is PORTRAIT (1920 x 2560; verified
from the webp VP8 header). At center 38% a 16:9 screen saw only arch
mid-sections — the floor was cropped out, which is why the v4 door floated.
Fix: `background-position: center bottom` — the lower loggia (stone wall
bay, pillar bases, flagstone floor) is now always in frame on desktop.
- Door rebuilt mm-true: leaf exactly 1000 x 2300 (ratio .435), in a
  1600 x 3200 "install" viewBox where 1 unit ≈ 1 mm.
- Installed, not pasted: stone reveal bands 120 deep (jambs + head with
  shadowed inner cheeks), dark joint lines seating the frame into the
  masonry, stone threshold slab (top + front face) with mottle texture.
- Proper ground: apron polygon extends from the threshold to the viewport
  bottom (translucent flagstone wash + AO + two raking sun stripes matching
  the photo's light), ground-contact blur under the leaf + broad assembly
  shadow, so the door visibly meets the floor and the floor leads forward.
- Full-scale details: 3 hinges on the left hinge-stile, flush timber pull,
  two routed panels, sun + edge shading.
- Swing: rotateY on the real left hinge (transform-origin 0 50%,
  perspective 1500): ajar 7 deg on hover/focus, 84 deg open; swing shadow
  rotates away around the same origin; warm light floods the apron on
  open (open spill). Reduced motion: plain link, no swing.

## Files this phase
- SKETCH-COVER.md (this spec)
- sketch.html, sketch.css (prototype, noindex, not linked from any live page)

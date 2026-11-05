# DOOR-COVER.md - spec for the new interactive cover

Read PROJECT.md, AGENTS.md and this file. This file OVERRIDES PROJECT.md section 3
("no animation") for the cover only. Approved by the owner on 2026-11-03.
Log it in PROJECT.md section 10 in task D1.

## Idea
The cover is a plain plaster wall seen straight on. A tall burgundy door stands at the
far RIGHT edge; the wall ends at the door frame. The hero title sits on the empty LEFT
side. The visitor clicks the door, it swings open onto warm light, and the page goes to
projects.html. The images in the folder (door-ref-*.png) are only for visualising the
idea. Do NOT use them as the final door. Build the door in HTML and CSS.

## Safety first
- Tag the current state: `git tag cover-v1` (do this before any edit).
- Build in a NEW file `door.html`. Do not edit index.html until the owner approves (task D5).
- No libraries, no frameworks, no video. Plain HTML, CSS, JS, beginner-commented.
- Content (title text) stays the same as the current cover:
  "Portfolio 2024-27", "Architecture Internship Portfolio", "Presented by Mohammed Huzefa".

## Design rules (keep Direction A and PROJECT.md section 5)
- Colours: wall tones near #F5F3EF, ink #1A1A1A, accent burgundy #7A1F2B. Burgundy is
  used ONLY on the door and the small ENTER label.
- No gradients, glassmorphism, drop shadows, icon rows or rounded corners.
  (Soft light on the wall = one flat, low-opacity colour layer, not a gradient.)
- Fonts: Fraunces for the title, Inter for the small labels. Same as the other pages.
- Title text must keep contrast of at least 4.5:1 on the wall (check it).

## Door geometry (use CSS variables, so it can be tuned in one place)
- Leaf aspect ratio 9:21 (about 900 x 2100 mm): `aspect-ratio: 9 / 21`.
- Door height `--door-h: clamp(380px, 82vh, 900px)`; width follows from the aspect ratio.
- Frame: a thin 1px ink line plus a slightly darker plaster surround. No decoration.
- Handle: one slim vertical bar, ink or light grey, on the side away from the hinge.
- The door head height lines up with ONE horizontal reveal joint across the wall
  (a single 1px line at low opacity). The floor is a thin strip at the bottom.
- The wall ends at the door frame: nothing to the right of the frame.

## Behaviour
- The door is a real link: `<a href="projects.html" class="door" aria-label="Enter the portfolio: projects">`.
  Keyboard Enter works, visible focus ring in burgundy, no JS needed to navigate.
- Hover and focus: the door opens a few degrees (ajar), with a thin strip of warm light.
- Click: JS stops the default, adds `.is-open`, the leaf swings about 70 degrees
  (CSS 3D: `perspective` on the wrapper, `transform: rotateY(...)`,
  hinge side = `transform-origin`), the light panel behind it shows,
  then after about 700 ms the page fades out and goes to projects.html.
- The light panel behind the door is flat warm colour (about #F3E3C3) with one
  slightly darker flat panel inside for depth. No gradient.
- A small label "ENTER" in burgundy (uppercase, letter-spaced) with a thin line, near the door.
- A visible "Skip to projects" text link in the top-left for anyone who does not
  want to use the door. The nav (About, Projects, Contact disabled) must stay visible.
- `prefers-reduced-motion: reduce`: no swing and no fade. A click goes straight to the page.
- Touch screens have no hover: the door must work with one tap.

## Layout
- Desktop: full viewport height, wall fills the screen, title block on the left
  (left aligned, large Fraunces title), door at the right edge, bottom aligned to the floor strip.
- Phone (under 720px): title on top, door below it, still on the right edge,
  height about 55vh, 16px side padding. Nothing may overlap or scroll sideways.
- Test at 1440x900, 1024x768, 390x844.

## Time of day (phase 2, optional)
- JS reads the visitor's local hour and sets `data-time="morning|noon|dusk"` on the wall.
- CSS changes only one flat tint layer on the wall (cool pale, neutral, warm).
- Reduced motion: no transition. Default to "noon" if anything fails.

## Optional wall texture
- The wall may start as a flat CSS colour. If the owner adds an AI wall image later,
  it goes in images/backgrounds/, is credited "AI-generated background" in ASSETS.md,
  and is never presented as the owner's own drawing or render.

---

## TASKS (do ONE per session, then stop and wait for "next")
Rules: tell me in 3 lines what you will change first. One commit per task. Mark [x] here,
add a line to CHANGELOG.md, report in max 5 lines. Never touch index.html until D5.

- [ ] D1 Run `git tag cover-v1`. Add the decision to PROJECT.md section 10. Create door.html
      with the wall, the title block on the left, and the CLOSED door on the right with exact
      proportions (no animation yet), plus the shared styles in a new file door.css. Desktop and phone layout.
- [ ] D2 Add the open animation and the click-to-navigate behaviour (hover ajar, click swing,
      light panel, 700 ms then go to projects.html). Use the strongest model for this task.
- [ ] D3 Accessibility and fallbacks: focus ring, "Skip to projects" link, reduced motion,
      touch, contrast check of the title, check at the three sizes, report in one line.
- [ ] D4 (optional) Time of day tint.
- [ ] D5 ONLY after the owner says "approve": replace index.html with door.html content
      (keep old cover as index-v1.html), update links, run node check-placeholders.js.

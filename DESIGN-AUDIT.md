# DESIGN-AUDIT.md — full-site audit, 2026-11-01

**Skills used:** impeccable (auditor/detector on a real render: `npx impeccable detect` against the local server,
plus sub-command playbooks), emil-design-eng (review format + craft bar), find-animation-opportunities
(frequency gate), review-animations standards, plus an independent fresh-context reviewer (sub-agent that could
not see my conclusions) and spec-math/jsdom verification of every claim below.
**Baseline:** tag `before-new-skills`. The cover's only approved change stays the backgrounds task
(one script-tag line); nothing below edits index.html.

---

## 1. Problems found (ranked)

| # | P | Where | Problem | Root cause |
|---|---|-------|---------|-----------|
| 1 | **P0** | styles.css:31+91 | (b) **Content column too narrow on wide screens** — 912px at 1440, 432px at 1920, collapses to ≤0 at ~2352 (ultrawide garbage); on 720–1247px the side padding computes negative and clamps to 0, so content touches the edges with no gutter | `--side = (100vw − 1200)/2 + 24px` re-uses the centering that `margin: 0 auto` already provides as INNER border-box padding — double-counted |
| 2 | **P0** | styles.css:312 | (a) **Caption rows overlap the next row of placeholders** (Drawings, Renders, Concept; desktop AND phone) | `.ph { height: 100% }` predates Direction A caption rows: a placeholder fills the whole stretched figure height, then the `.cap-row` (~39px) overflows the 24px grid gap onto the row below; grey text paints over the next block's border/background |
| 3 | **P1** | script.js:443 | **Lightbox caption is empty** — shows only "3 / 8 — " | `show()` reads `figure > figcaption`, but Direction A captions are `div.cap-row`; the matched CSS rule `.gallery figcaption` is dead |
| 4 | **P1** | script.js:400–403 | **Register rows render ~250px tall broken blocks today** — the 404ing thumbnail becomes a 220px `.ph` inside a 112×64 slot | No `.reg-row`-scoped sizing for the placeholder; register is the site's front door |
| 5 | **P1** | index.html had the styles; script.js:395+ | **"Next project"/"Back to all projects"/PDF links render browser-blue** underlined | `.cover-link` base styles live ONLY in the cover's inline `<style>`; the class is shared but the style isn't |
| 6 | **P1** | script.js:466–471 | **Lightbox mouse-only** — figures not keyboard-focusable, no Enter/Space open, no focus moved into the overlay, no `role="dialog"`/`aria-modal`, focus not restored | Interactive element built as bare `figure` with click handler |
| 7 | **P2** | styles.css:12 (+8 usages) | **Grey `#8A8A8A` on cream = 3.1:1** (detector: median 3.1, floor 4.5) on caption notes, figcaptions, footer, `.tb-side`, `.ph` text, metadata keys — every drawing annotation fails AA | Token value predates the AA check |
| 8 | **P2** | styles.css:36 | **`scroll-behavior: smooth` unguarded for reduced-motion** (only `.fade` is guarded) | Footer "Credits" jump animates for reduced-motion users |
| 9 | **P2** | projects/library.json, index.json | "TODO: Library Proposal — final title" shows in h1, strip, document.title, og:title | Content TODOs — must be filled before sharing (Next task in TODO.md), not a code bug |
| 10 | **P2** | all pages nav | `<a href="#" onclick="return false">Contact</a>` — dead tab stop pretending to be live | Contact page not built yet (later task) |
| 11 | **P3** | script.js:622–625 | About sheet code off-by-one vs its own comment ("1 project → A-02", code computes A-03) | Comment and formula disagree; register numbering says A-02 is correct |
| 12 | **P3** | script.js:453 | `img.src = ''` on lightbox close re-requests the page (empty-src quirk) | Reset idiom |
| 13 | **P3** | script.js:140, 402 | JSON paths interpolated into `innerHTML` — safe because the JSON is first-party (never user input); changing to textContent adds noise for zero risk reduction today | Accepted; document, don't churn |
| 14 | **P3** | styles.css:235–240, 269–273 | Dead CSS: `.figure-caption` never used; `.gallery figcaption` never matches (see #3) | Leftovers from before Direction A |
| 15 | **P3** | styles.css:31 | `100vw` includes the Windows scrollbar → ~8px centring offset | Folds into fix #1 (fixed side padding makes it moot) |

Also flagged by the detector, **rejected by precedence** (AGENTS.md: PROJECT.md / Direction A win — recorded, not fixed):
- `cream-palette` — #F5F3EF is the deliberate drawing-paper token, not a reflex.
- `overused-font` (Inter/Fraunces) — the decided font pair (PROJECT.md §5, final).
- `kicker-above-heading` ("DRAWING REGISTER" over "All projects") — the section-label system is the Direction A drawing-sheet language, used deliberately across every section.
- Cover title vs drawing underlay measured 3.1:1 median — the hero PNG is still missing; once the real drawing lands behind the 0.85 veil this will move. **Re-check then; no cover change now (NEEDS APPROVAL at that point).**

## 2. What is already good

1. One JSON source of truth with graceful degradation at every layer (real file → credited stand-in → filename-revealing TODO block; missing JSON → friendly stub; missing backgrounds.json → plain paper page, Credits section self-removes).
2. Disciplined Direction A execution: grep-verified ZERO gradients/drop-shadows/keyframes site-wide; hairline rules + dimension ticks as the only decoration; burgundy strictly rationed to codes/labels/hover.
3. Accessibility instincts already partly in place: alt texts, aria-label on the lightbox close, `prefers-reduced-motion`/`prefers-reduced-data`/print handling, cover veil math ≥ 4.5:1.
4. Honest beginner editability: TODO blocks echo the exact filename to drop in; `check-placeholders.js` guards publishing; credits rendered from config.
5. The site is genuinely low-motion — nothing bounces, nothing slides; the scroll fade is the single gentle exception.

## 3. Motion: opportunities, and what NOT to animate

Verified via the find-animation-opportunities frequency gate (how often seen → justify → restrain):

**KEEP (already correct):** scroll fade-in (0.6s ease, reduced-motion + no-IO + print fallbacks), instant hover
swaps (nav underline, register burgundy highlight, lightbox ×, footer, stage links — instant ink-feel is
Direction A correct), instant lightbox open/close, instant sheet-code swap.

**NEVER animate:** the sheet-code text on section scroll (fires every section of every visit — frequency gate
reject), register-row hovers, the dimension ticks, the title strip.

**ONE genuine opportunity:** lightbox OPEN fade, ~180ms, opacity only (overlay + figure; close stays instant) —
user-rare, close to a jarring full-viewport pop, and it is exactly the "very gentle fade" the brief allows.
Listed as a motion ADDITION → **NEEDS APPROVAL** (not applied today).

## 4. Proposed changes (numbered; each marked)

1. **SAFE** — Remove `.ph { height: 100% }` (styles.css:312). Fixes (a): captions stop overlapping the next row. No deliberate size is touched (`min-height: 220px` stays).
2. **NEEDS APPROVAL (widths)** — Fix the double-centring: desktop `--side` becomes a fixed 24px instead of `calc((100vw − 1200px)/2 + 24px)`. Content column becomes a true 1152px at every wide viewport, the 720–1247px gutter returns, and the register stops overflowing (thumbnail back inside the row, (b) fully healed). This changes layout width behaviour on every inner page — your call.
3. **SAFE** — Size the register's THUMB TODO placeholder to its 112×64 slot (64px desktop / 56px phone) while thumbnails are pending: rows return to their intended ~45px rhythm instead of ~250px grey blocks.
4. **SAFE** — Lightbox caption reads the real Direction A caption row (`.cap-title` + note, falling back to `figcaption`) instead of the missing figcaption: "3 / 8 — South wall [Photo: …]".
5. **SAFE** — Move the `.cover-link` base styles into styles.css (shared). The cover keeps its own inline copy and looks identical; project END links + about PDF stop being browser-blue.
6. **SAFE** — Lightbox keyboard/screen-reader operability: gallery figures become focusable buttons (roving), Enter/Space opens, focus moves to the close button and returns on Esc, `role="dialog"` + `aria-modal`. Plus `img.src=''` → `removeAttribute` (stops the per-close page re-request). Zero layout/visual change.
7. **SAFE** — Darken `--grey` #8A8A8A → #5E5E5E: every grey text passes AA (≈4.5–4.6:1 on cream; burgundy labels unchanged). Colour-only, no reflow.
8. **SAFE** — Guard `scroll-behavior: smooth` behind `prefers-reduced-motion: no-preference`.
9. **SAFE** — Mark the Contact nav item `aria-disabled="true"` (honest until the contact page exists).
10. **SAFE** — About sheet code `n + 2` → `n + 1` so the code matches its comment and the register (A-02 with one project; shifts automatically as projects are added).
11. **SAFE** — Delete the dead CSS (#14).
12. **NEEDS APPROVAL (font sizes)** — `PLACEHOLDER - NOT MY WORK` tag at 10px and caption notes/codes at 10.5px are below the 11px legibility floor (detector). Bumping them is a text-size change, so approval needed; note the stand-in system disappears entirely once real renders land.
13. **NEEDS APPROVAL (sizes)** — Gallery thumbs crop to a fixed 300px band on desktop. Observation only — say the word if you want natural heights there.
14. **NEEDS APPROVAL (motion)** — The one motion opportunity: lightbox open fade (~180ms, opacity only).
15. **Content (not code)** — Fill the TODO titles/fields in library.json, index.json, about.json (already the "Next" list).

(issues (c) — the title strip — was **verified already correct**: one 40px line at 320px, name ellipsises, code never wraps; the phone rule `body.tb { padding-bottom: 56px }` clears it. A future-proofing nicety — `min-width: 0` + ellipsis on `.tb-code` so absurdly long codes can't eat the name — is noted but not needed today.)

## 5. Applied (filled after step 7)

See CHANGELOG.md; every applied change kept the cover untouched
(`git diff before-new-skills -- index.html` shows only the backgrounds-task line) and was re-verified with the
detector sweep + the jsdom page tests.

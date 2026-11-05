# PROJECT.md — Architecture Portfolio Website

> Read this file fully at the start of every session. Follow it exactly. Do not change anything marked DONE unless asked.

## 1. Purpose
A personal website for **Mohammed Huzefa**, used ONLY as an architecture portfolio for an internship application. It is not a business site: no shop, no blog, no services page.

Portfolio period: 2024-27.

## 2. Status
- DONE (approved, do not touch): front page / cover
- NOW: one dedicated project page for the **Library Proposal**
- LATER: About / skills / contents page, project index, contact

## 3. Cover page (DONE)
- Hero image: static PNG, cleaned black-line-on-off-white hidden-line building drawing (cantilevered volume, curved corner, glazing mullions)
- Text sits in the empty left half of the image:
  - "Portfolio 2024-27"
  - "Architecture Internship Portfolio"
  - "Presented by Mohammed Huzefa"
- No animation.

## 4. Site structure (own layout, inspired by a reference portfolio PDF)
1. Cover (done)
2. Personal info / skills / contents page
3. Project pages, one per project (starting with the Library Proposal)
4. Contact

Navigation: only **About, Projects, Contact**.

## 5. Design rules (follow exactly)
- Mood: calm, spare, architectural. Drawings and renders are the decoration. Lots of white space.
- Background: off-white `#F5F3EF`
- Text and lines: near-black `#1A1A1A`
- Accent (used sparingly, e.g. small labels, hover, thin rules): burgundy `#7A1F2B`
- Secondary grey: `#8A8A8A`
- Lines: 1px hairline rules in `#1A1A1A` at low opacity to show the grid
- Type: two fonts max. One serif or light sans for headings, one clean sans for body. Small uppercase letter-spaced labels (e.g. "PLAN", "SECTION") for metadata. (Decided: Fraunces for headings, Inter for body — Google Fonts, `display=swap`, system serif/sans fallbacks. Cover keeps system fonts, it is DONE.)
- Max content width about 1200px, generous margins, section spacing about 96px on desktop
- Images: full-width or two-column only. No rounded corners, no drop shadows, no decorative icons
- Motion: none, or a very gentle fade-in on scroll. No parallax, no sliders that autoplay
- Responsive: must work on a phone (single column, 16px side padding)
- Performance: images exported as WebP, about 200-400 KB each, lazy-loaded
- Backgrounds (added 2026-11-01): decorative stock photography allowed ONLY as page backgrounds (cover + the three templates), always desaturated/tinted to the palette, never inside project image slots, never competing with content. Flat veil only (no gradients). Configured in `backgrounds-config.js`; credits in `images/BACKGROUNDS.md` and the about-page Credits section; never published while render placeholders remain

## 6. Project page template (reusable)
Build ONE template so future projects only need new content. Content lives in a data file (e.g. `projects/library.json` or a markdown file with frontmatter), not hard-coded into the HTML.

Sections, in order:
1. Hero render, full width, with project title and one-line description
2. Brief: small metadata block (Location, Program, Year, Type, Tools: D5 Render, AutoCAD, SketchUp, Photoshop)
3. Concept: short text (2-3 short paragraphs) plus 1-2 diagrams
4. Drawings: plans, sections, elevations in black-line style, **every drawing captioned**
5. Render gallery: grid of 6-8 images, click to open a lightbox
6. Closing image and a link to the next project / back to index

Writing rules: short paragraphs, meaningful captions, no filler words.

## 7. Library Proposal project (content to fill in)
- Title: TODO
- Location / site: TODO
- Program: public library (TODO: floors, key spaces)
- Year: TODO
- Concept (2-3 sentences): TODO
- Model: built in D5; renders being produced separately
- Image folders: `/images/library/renders`, `/images/library/drawings`, `/images/library/diagrams`
- Render list (target 6-8): hero exterior, entrance/approach, 2 interiors, section/cutaway, dusk view, detail

## 8. Tech
- Plain HTML, CSS and JavaScript (no heavy framework) unless told otherwise
- One shared `styles.css` with the color/spacing variables above
- Static site, deployable free on GitHub Pages / Netlify / Vercel
- Keep the code simple and commented so a beginner can edit it

## 9. Working rules for the coding model
- Do ONE task per request. Do not redesign other pages while working on one.
- Never overwrite the cover page.
- Before big changes, tell me what files you will change.
- After each task: list the files changed and how I preview them.
- If a requirement is unclear, ask one short question instead of guessing.
- Use the exact colors and spacing in section 5.

## 10. Decisions log (add a line for every new decision)
- New interactive cover (DOOR-COVER.md, approved 2026-11-03): plaster wall with a burgundy door at the far right edge; built in a separate door.html + door.css until owner approval (task D5); overrides section 3 "no animation" for the cover only
- 2026-11-05: Door walk-through (door.html + door.js + door.css + scenes.json): a closed door scene opens (leaf rotateY + camera push into a hall with Projects/About/Contact openings), then a scrolling projects page (one tall linked slot per project, fixed 1/N counter, proximity snap armed after first scroll only, lightbox upgraded to zoom/pan/fullscreen/swipe in place). Scene art is AI-generated (credited on-screen); files are PLACEHOLDER until images/scenes/*.webp land; ?debug=1 outlines hotspots; sessionStorage "seen" starts repeat visits at the hall; #door/#hall hashes keep the Back button working. Decisions: today's scene engine REPLACES the outdated CSS-drawn door (dd25327 kept in git); the cover keeps its old ?v=20261104b (its styles are untouched); retains MAKHNO decision above as the approval gate for replacing the LIVE cover — door.html stays linked from a single "Enter" link pending Mohammed's pick between the two
- 2026-11-05: Mohammed approved full MAKHNO-inspired immersive direction (OPENCODE_MAKHNO_MASTER_BUILD_GUIDE.md) — supersedes the older cover-is-untouchable rule for approved future work; the current cover and door.html stay intact as rollback until the new cover is explicitly approved. Prototype direction: hand-drawn animated architectural sketch (SKETCH-COVER.md), built in sketch.html + sketch.css only
- Cover: static PNG, no animation
- Navigation limited to About / Projects / Contact
- Site follows reference PDF structure but with our own layout
- Library is the first project page; template must be reusable
- Cover rebuilt from the approved final version of the "Plan Internship Portfolio Cover" chat; text lines per approval. Hero PNG is a placeholder at /images/cover/hero.png until supplied (see ASSETS.md)
- Interim fonts: system serif (Georgia) for headings, system sans (Segoe UI / Arial) for body and labels. Exact fonts still TODO in first session, swap in styles.css
- Multiple projects: each project is a `projects/<slug>.json` loaded by `project.html?p=<slug>`; no per-project HTML copies
- `projects/index.json` is the single source for the projects index (`projects.html` cards) AND for the "Next project" links at the bottom of each project page
- Cover's "Projects" link points to projects.html (the project index); the cover design itself is untouched
- "Next project" is hidden on the last entry of index.json; "Back to all projects" always shows
- About page (`about.html`) driven by `projects/about.json`; any value still marked TODO is hidden, not printed; compact spacing (44-48px) instead of the project page's 96px rhythm
- Fonts final: Fraunces (headings) + Inter (body) loaded from Google Fonts with `display=swap` and system fallbacks in `styles.css`; loaded on the three inner pages only, never on the immutable cover
- Direction A "Drawing Sheet" (from DESIGN-IDEAS.md) implemented with only the caption-row pattern imported from Direction B: title-block strip, projects index as a drawing register, thin construction-lines / dimension ticks as the only decoration, scroll-tracked sheet code. Burgundy stays sparing (codes, hover, small markers)
- The library study item on the about page links to project.html?p=library; about JSON is filled in Mohammed's exact wording, never paraphrased
- Temporary stand-in photos: while the five real library renders are missing, script.js shows free-license Pexels stock photos (never Mohammed's work) instead of the IMAGE TODO blocks — each tagged "PLACEHOLDER - NOT MY WORK" on the image with a Photo credit ending its caption row; a real file at the exact expected path replaces the stand-in automatically. Credits + removal steps in images/PLACEHOLDERS.md; `node check-placeholders.js` must pass (exit 0) before sharing or deploying. To be deleted together with images/placeholders/ once the last real render lands. Formal drawings/diagrams keep IMAGE TODO blocks, no stand-ins
- Page backgrounds (2026-11-01, Mohammed approved a cover-background-only change; reworked 2026-11-02): a fixed full-viewport layer via CSS pseudo-elements (body::before image / body::after flat veil — no background-attachment: fixed, so phones don't jank), driven by `backgrounds-config.js` (`window.BG_CONFIG`: candidates, selected, overlay opacity, grayscale; a plain script tag before backgrounds.js on every page, replacing the old backgrounds.json fetch so the site also works opened directly as a file) and `backgrounds.js` which only sets CSS variables. Cover: grayscale image full-strength + flat off-white veil at 0.6 (lowest that keeps the ink text ≥ 4.5:1 over the image — measured ≈6.3:1 at the image's 1st-percentile dark pixel; note the grey kicker would need ≈0.90) with the hero PNG set to mix-blend-mode: multiply so the background shows through the paper while black lines stay black; the real cover drawing must be black-on-off-white/transparent (ASSETS.md). Text/sizes/positions untouched. Inner pages: same image family at 8% visibility, different image per template, title-block strip untouched. Swap without touching code: change "selected" in backgrounds-config.js or drop a file at images/backgrounds/<slot>.webp. Chosen by eye via unlinked backgrounds-preview.html. Credits render from BG_CONFIG on the about page (id=credits, linked from all three footers) with the fixed honesty note; every candidate logged in images/BACKGROUNDS.md. Phone uses the -900.webp via the CSS media query; prefers-reduced-data and print get no backgrounds

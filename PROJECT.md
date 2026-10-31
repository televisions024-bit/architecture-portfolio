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
- Type: two fonts max. One serif or light sans for headings, one clean sans for body. Small uppercase letter-spaced labels (e.g. "PLAN", "SECTION") for metadata. (Exact fonts: TODO, decide in first session.)
- Max content width about 1200px, generous margins, section spacing about 96px on desktop
- Images: full-width or two-column only. No rounded corners, no drop shadows, no decorative icons
- Motion: none, or a very gentle fade-in on scroll. No parallax, no sliders that autoplay
- Responsive: must work on a phone (single column, 16px side padding)
- Performance: images exported as WebP, about 200-400 KB each, lazy-loaded

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
- Cover: static PNG, no animation
- Navigation limited to About / Projects / Contact
- Site follows reference PDF structure but with our own layout
- Library is the first project page; template must be reusable
- Cover rebuilt from the approved final version of the "Plan Internship Portfolio Cover" chat; text lines per approval. Hero PNG is a placeholder at /images/cover/hero.png until supplied (see ASSETS.md)
- Interim fonts: system serif (Georgia) for headings, system sans (Segoe UI / Arial) for body and labels. Exact fonts still TODO in first session, swap in styles.css

# OPENCODE MASTER BUILD GUIDE
## MAKHNO-inspired immersive architecture portfolio
**Project:** Mohammed Huzefa — Architecture Internship Portfolio 2024–27  
**Repository:** https://github.com/televisions024-bit/architecture-portfolio  
**Hosting target:** GitHub Pages, project base path `/architecture-portfolio/`

---

# 0. THE APPROVED CREATIVE DIRECTION

The user has explicitly approved:

- **Inspiration level:** Full MAKHNO-inspired experience.
- **Cover:** Replace the current cover concept with a new immersive architectural introduction.
- **Visual identity:** Hybrid — immersive, atmospheric architectural visuals combined with the existing Drawing Sheet typography, palette, precision and technical presentation.

This approval authorizes design exploration and implementation planning. It does **not** authorize immediate editing, deleting, overwriting, committing, pushing, publishing, or changing GitHub Pages settings. Work must proceed through the checkpoints below.

## The central idea

Build a personal architecture portfolio that feels like entering an architectural world. The opening should have the memorable, spatial, cinematic quality of MAKHNO Studio's website, but the visual language, architecture, content and project presentation must belong to Mohammed Huzefa.

The experience should communicate:
- architectural curiosity and design thinking;
- a sense of space, material, proportion, light and movement;
- confidence and craft without looking like a commercial architecture studio template;
- a clear path to real student projects, drawings and academic work.

**Do not copy MAKHNO.** It is a reference for experience design and visual storytelling only. Do not copy its source code, exact composition, text, branding, assets, 3D models, animations or distinctive artwork.

Reference: https://makhnostudio.com/

---

# 1. DESIGN PRINCIPLES

## 1.1 Hybrid visual identity

The website has two coordinated visual layers.

### Immersive architectural layer
Use for the introduction and spatial navigation:
- realistic architectural form and spatial depth;
- controlled lighting and shadows;
- tactile but restrained material treatment;
- perspective and camera movement;
- carefully composed architectural framing;
- a sense of entering or moving through a designed space.

This layer should feel architectural and authored, not like a generic luxury real-estate website, game environment, or premade 3D landing page.

### Drawing Sheet layer
Use for information, project pages, drawings, labels and navigation UI:
- background: `#F5F3EF`;
- ink: `#1A1A1A`;
- accent: `#7A1F2B` (burgundy, sparingly);
- secondary grey: use the current accessible grey token in `styles.css`;
- headings: Fraunces;
- body: Inter;
- hairline rules, precise alignment, editorial grids and uppercase technical labels;
- generous whitespace and clear drawing captions.

Keep the two layers visually related. The immersive scene may be darker or more atmospheric, but interface typography and technical information should still feel like the same portfolio.

Do not introduce unrelated gold, glossy glassmorphism, excessive gradients, rounded cards, drop shadows, decorative icon rows, or a separate warm oak/stone branding system.

## 1.2 Portfolio-first rule

This is a student's internship portfolio, not a business website. It is not a shop, studio-services site, blog, or fictional architecture practice.

A reviewer must be able to reach actual projects quickly. Provide a persistent, visible route such as `View Projects` / `Skip experience` / `Enter portfolio`. Never force a visitor through a long animation or multiple rooms before they can see the work.

Never invent projects, drawings, qualifications, project facts, dates, locations, awards, tools, or authorship. Use verified existing content or user-supplied information. Keep missing information as a clearly labelled TODO that is not shown as finished content.

## 1.3 Motion principles

Motion should explain spatial relationships:
- camera approach or reveal;
- transition between the cover and entrance;
- selecting a doorway/destination;
- subtle reveal of project content.

Avoid motion that is merely decorative:
- no bouncing;
- no constant floating;
- no cursor trails;
- no particle effects without a clear architectural purpose;
- no autoplay music;
- no endless camera movement;
- no scroll hijacking.

Provide `prefers-reduced-motion` behaviour. Visitors with reduced motion should get a still composition and immediate navigation, not a broken or incomplete experience.

---

# 2. REFERENCE STUDY

Use these references as separate sources of design principles:

1. **MAKHNO Studio** — https://makhnostudio.com/  
   Primary reference. Study its memorable opening, spatial destinations, visual world, architectural imagery, lighting and transition language. Revisit the live site and document what can actually be observed. Do not assume its implementation details without evidence.

2. **The Samulation** — https://sam-bloch.com/projects/portfolio  
   Study the relationship between an immersive environment and a usable conventional portfolio.

3. **ZahrArch** — https://www.theyoungwolf.dev/projects/zahrarch  
   Study how architectural drawings, project geometry and technical information can be integrated into a portfolio.

4. **VANTA** — https://webdanger.com/work/vanta  
   Study restrained image-led navigation and transitions.

5. **19-86 Architecture** — https://step1.dev/gallery/9CPyqufje9Xlh_zfjd1g1  
   Study minimal typography and project-archive presentation.

6. **Aum Architects** — https://aumarch.com/  
   Study editorial project presentation and architectural imagery.

For every reference, report:
- what is directly visible;
- what design principle is worth borrowing;
- what would not suit this student's portfolio;
- an implementation idea that is feasible in our existing static site.

Do not claim to have tested or inspected a feature that cannot be accessed.

---

# 3. EXPERIENCE CONCEPT

Create a coherent experience with the following high-level journey:

`Immersive Cover → Architectural Entrance / Navigation → Portfolio Pages → Project Presentations`

The cover should introduce the visitor to an architectural composition. The scene may use a perspective view, facade, threshold, courtyard-like transition, or another strong architectural idea discovered during reference research. Do not lock into a generic four-door facade before studying the strongest composition.

The navigation should feel spatially integrated:
- Projects
- Academic
- About
- Contact

However, the existing project documentation currently specifies only About, Projects and Contact. Academic is a proposed addition from the new experience concept. During the audit, inspect existing pages and content, then recommend whether Academic should be a separate destination or a category within Projects. Do not create duplicate or empty pages.

A clear direct route to Projects must always be available.

The immersive introduction should be a finite sequence, not a maze:
- one opening composition;
- one meaningful spatial transition;
- a clear destination selection;
- then the existing portfolio experience.

Do not create seven rooms, a complete virtual residence, a multi-floor game-like world, or a complex 3D navigation system unless a later explicit approval is given.

---

# 4. TECHNICAL STRATEGY — RESEARCH BEFORE CHOOSING

The current site is a static HTML/CSS/JavaScript GitHub Pages project. Preserve this deployment model unless the user explicitly approves a change.

Do not automatically introduce Webflow, React, Next.js, a build pipeline, or a large framework.

During Phase 0, compare these approaches for the immersive opening:

### Option A — CSS / HTML / lightweight JavaScript
Best when the scene can be composed with layers, transforms, perspective and well-prepared assets. Small, maintainable and compatible with the existing site.

### Option B — Three.js / WebGL
Consider only if actual real-time 3D interaction is necessary and can run reliably on ordinary phones and laptops. Explain bundle size, GPU use, loading, fallbacks, accessibility and maintenance cost before recommending it.

### Option C — Pre-rendered architectural sequence
Use still images or a short carefully optimised sequence for cinematic camera movement where real-time 3D is unnecessary. This can be visually rich and reliable, but must not create a long blocking video or inaccessible navigation.

### Option D — Hybrid
A pre-rendered or still architectural composition with lightweight HTML hotspots and CSS transitions may deliver the best balance.

Evaluate the actual visual ambition, user's existing assets, device performance, free tooling, hosting and maintainability. Recommend one approach with reasons. Do not install dependencies or implement a 3D engine during the audit.

The user's known computer is an HP Victus with an RTX 3050 Laptop GPU (4 GB VRAM), but the portfolio must not depend on that hardware. It must remain usable on typical mobile devices and lower-powered computers.

---

# 5. REPOSITORY RULES AND EXISTING PROJECT DOCUMENTS

Before editing, read these files fully if they exist:
- `AGENTS.md`
- `PROJECT.md`
- `README.md`
- `DESIGN-IDEAS.md`
- `DESIGN-AUDIT.md`
- `TODO.md`
- `CHANGELOG.md`
- `DOOR-COVER.md`
- `ASSETS.md`
- `images/PLACEHOLDERS.md`
- `images/BACKGROUNDS.md`

The current `PROJECT.md` and `AGENTS.md` state that the existing cover is DONE and must not be changed. This conflicts with the user's newer explicit decision to replace the cover concept.

Resolve this carefully:
1. Record the conflict in the audit.
2. Treat this master guide's new cover decision as the latest user-approved creative direction.
3. Do not silently edit the old project instructions in Phase 0.
4. Propose the exact documentation updates needed so future coding sessions do not receive contradictory instructions.
5. Keep the old cover and its assets intact as a rollback/reference until the replacement has been reviewed and explicitly approved.

The user has approved a new direction, not deletion of the old implementation.

Existing website rules and code should be inspected rather than assumed. Preserve working project data, JSON-driven pages, drawing viewer/lightbox features, credits and accessibility behaviour unless the user approves changes.

---

# 6. PHASE 0 — FULL READ-ONLY AUDIT

**This is the first task. No file changes.**

Inspect the actual local repository, not just the public GitHub copy.

Run safe read-only checks:
- repository root;
- `git status --short --branch`;
- `git remote -v`;
- `git branch -vv`;
- recent `git log`;
- local tags;
- directory tree and asset inventory.

Never discard local changes. Never run `git reset --hard`, `git clean -fd`, force-push, or other destructive commands.

Inspect:
- all HTML pages and actual routes;
- CSS and JavaScript entry points;
- JSON data and fetch paths;
- cover implementation and its assets;
- project and academic content;
- images, video, 3D files, fonts, dimensions and file sizes;
- existing transitions and motion;
- mobile breakpoints;
- loading and performance issues;
- GitHub Pages base-path handling (`/architecture-portfolio/`);
- accessibility and reduced-motion behaviour;
- current TODOs, changelog and credits;
- whether any temporary external assets are in use.

Pay particular attention to:
- `images/cover/hero.png`;
- `images/backgrounds/`;
- `images/placeholders/`;
- root-level image files;
- duplicate JSON files;
- broken paths or missing directories;
- whether the local project differs from GitHub.

### Required audit report

1. Actual local repository path and Git state.
2. Current site map and routes.
3. Existing visual system and components.
4. Actual assets available for the new immersive introduction.
5. Asset gaps and path mismatches.
6. Existing project content and viewer features.
7. Confirmed bugs versus suspected bugs.
8. Conflicts in project documentation.
9. Technical comparison of CSS, WebGL and pre-rendered approaches.
10. Recommended new experience concept, with a written scene description and a simple sequence of visitor actions.
11. Proposed files to create/edit in each phase.
12. Risks, performance budget and testing plan.

**Stop after the audit. Do not create or edit files. Ask the user to approve the proposed concept and implementation strategy.**

---

# 7. PHASE 1 — CREATIVE DIRECTION AND STORYBOARD

Only after the user approves Phase 0.

Prepare a design specification before coding:
- opening screen composition;
- architectural subject and viewpoint;
- material and lighting direction;
- camera position and movement;
- destination/navigation concept;
- desktop and mobile compositions;
- typography and interface placement;
- transition timings;
- reduced-motion/static fallback;
- direct route to Projects.

Create a simple storyboard with 4–6 frames. These may be written descriptions or simple diagrams. Do not generate or download artwork without user approval.

The scene should feel like a crafted architectural presentation, not a stock 3D house. Prefer a concept connected to the user's own architectural drawings/models if suitable assets exist.

Show at least two viable design interpretations if the reference study leaves a meaningful choice. Explain trade-offs. Wait for user approval of one storyboard before implementation.

---

# 8. PHASE 2 — ASSET PLAN AND PROTOTYPE

After storyboard approval:

1. Inventory existing user-created models, drawings and renders.
2. Identify which can become the main visual of the opening.
3. Make an asset list with exact required formats, aspect ratios, dimensions and file sizes.
4. Identify which assets can be prepared from existing files using free tools.
5. Separate user-created work from temporary reference imagery.
6. Keep source and credit information for every external asset.
7. Do not put temporary imagery into actual project slots or imply it is the user's work.

Build only a small prototype of the opening transition. Do not replace the live cover yet. Prototype in separate new files or an isolated branch only after the user approves the file list.

Test loading time and fallback behaviour before expanding the prototype.

---

# 9. PHASE 3 — IMMERSIVE COVER IMPLEMENTATION

The new cover should:
- introduce the architectural world immediately;
- have a clear visual focal point;
- use controlled depth, light and perspective;
- include a clear name/portfolio identity;
- offer a visible `Enter portfolio` / `View projects` action;
- not hide navigation behind an unexplained interaction;
- support keyboard, touch and pointer input;
- work at desktop, tablet and mobile sizes;
- respect reduced motion and data-saving preferences;
- load progressively and avoid blocking the whole site.

Use real semantic links for navigation. Do not make essential navigation depend on canvas/WebGL.

Keep the old `index.html` and old cover assets recoverable. Implement the new cover in a separate test page or isolated implementation first. Do not replace `index.html` until the user explicitly approves the tested result.

Test:
- direct page load;
- refresh;
- keyboard navigation;
- touch;
- reduced motion;
- failed image/video/WebGL;
- slow connection;
- GitHub Pages project path;
- browser back/forward.

Stop for review.

---

# 10. PHASE 4 — SPATIAL NAVIGATION

After cover approval, implement a finite architectural navigation experience.

Potential destinations:
- Projects;
- Academic;
- About;
- Contact.

The final set and route structure must be based on the actual content audit. Do not create empty destinations just to fill the scene.

The navigation may use doorways, openings, thresholds, portals, framed views or another architectural metaphor. Choose what best fits the approved storyboard. Do not assume four equal doors are mandatory.

Interaction:
- destination is visually identifiable;
- hover and focus states are clear;
- click/tap produces a restrained spatial transition;
- destination remains a semantic anchor;
- `Skip to projects` is always available;
- reduced-motion mode navigates immediately;
- browser history and direct URLs continue to work.

No maze, hidden menu, forced camera tour, or inaccessible hover-only interaction.

Stop for review.

---

# 11. PHASE 5 — PORTFOLIO PAGES

Preserve the Drawing Sheet identity for the information-rich portfolio pages.

## Projects index
- clear project register or carefully designed visual archive;
- actual project title, type and year only when verified;
- meaningful preview images;
- clear navigation to project details;
- responsive layout;
- no fake project cards.

The existing drawing-register idea is valuable and should be retained unless the audit demonstrates a better solution.

## Individual project page
Use the existing reusable JSON-driven architecture if it works. The intended information order:
1. Hero render and project title.
2. Concise introduction.
3. Brief / metadata.
4. Concept and diagrams.
5. Plans.
6. Sections.
7. Elevations.
8. Render gallery.
9. Closing image and navigation.

Do not force empty sections. Drawings should be prominent, legible, captioned and viewable at useful resolution.

## Academic
Decide from the content audit whether Academic deserves a separate page or belongs as a category/filter within Projects. Do not duplicate the same content in two places.

## About and Contact
Keep concise, factual and consistent with the Drawing Sheet identity. Do not invent details.

Stop for review after the relevant pages are updated.

---

# 12. PHASE 6 — DRAWING VIEWER

Inspect the existing lightbox before replacing or extending it. The repository audit previously identified accessibility and caption issues in the lightbox, but verify the current local version before making changes.

The desired viewer, if not already adequately implemented:
- high-resolution straight-on drawing;
- zoom in/out;
- wheel zoom around pointer;
- drag to pan;
- fit to screen;
- fullscreen;
- previous/next;
- close;
- keyboard: Escape, arrows, plus/minus, zero;
- mobile pinch zoom and drag;
- focus moves into viewer and returns to trigger;
- correct captions;
- no image distortion or cropping.

Use only real available drawings. Do not invent content categories.

---

# 13. PHASE 7 — QUALITY, PERFORMANCE AND ACCESSIBILITY

Test at:
- desktop: 1440 × 900 and 1920 × 1080;
- tablet: around 768 px wide;
- mobile: 390 × 844 and 360 × 800.

Verify:
- no broken assets or JSON requests;
- no console errors;
- no horizontal overflow;
- no overlapping UI;
- all direct routes load;
- browser back/forward works;
- GitHub Pages base path works;
- no large blocking downloads;
- mobile GPU/memory use remains reasonable;
- no autoplay audio;
- keyboard and touch support;
- reduced-motion and data-saving behaviour;
- fallback when WebGL or media fails;
- project images are not mistaken for temporary stock references.

If using WebGL:
- provide a static fallback;
- test on a phone or lower-powered device if possible;
- avoid unnecessarily high-resolution textures;
- dispose of GPU resources when no longer needed;
- do not make the portfolio unusable when WebGL is unavailable.

Do not claim tests passed unless they were actually run. If browser testing is unavailable, say so and give a manual test checklist.

---

# 14. BUG-FIXING PROTOCOL

When anything goes wrong:

1. Stop the next task.
2. Reproduce the issue and record page, viewport, action and exact error.
3. Inspect the relevant code, asset path, console and network requests.
4. Identify the root cause.
5. Make the smallest targeted fix.
6. Retest the failure and nearby features.
7. Inspect the full diff for unrelated changes.
8. Report the cause, fix, files changed and test results.
9. Wait for approval before proceeding.

Do not hide errors by removing features or replacing content with dummy content.

Never run destructive Git commands or force-push without explicit user instruction after explaining the exact consequences.

---

# 15. GIT, FILE AND DEPLOYMENT SAFETY

- Verify the repository root before working.
- Check Git status before editing.
- Preserve all uncommitted work.
- Do not change branch, rewrite history, push, publish, alter GitHub Pages settings, change default branch or delete a branch without explicit approval.
- Before an approved push, show the branch, commit range and changed files.
- Keep the old cover implementation and assets as rollback until the replacement is explicitly approved.
- Do not assume local files match GitHub.
- Ensure all asset and navigation URLs work under `/architecture-portfolio/`.

---

# 16. REQUIRED REPORT AFTER EVERY TASK

### Task completed
- Phase and task ID.
- Objective.

### Files changed
- Every created, edited, moved or deleted file.
- If none: “No files changed.”

### What it looks like now
- Describe the visible result.
- Desktop and mobile behaviour.
- Include screenshots only if actually captured.

### Tests
- Commands/checks actually run.
- Browser sizes and interactions tested.
- Failures and fixes.

### Remaining issues
- Known issues and unknowns.

### Approval
- State the exact next task.
- Stop and wait.

---

# 17. FIRST INSTRUCTION TO OPENCODE

Read this entire file and all existing project instructions.

**Begin with Phase 0 — READ-ONLY AUDIT ONLY.**

The user's approved direction is full MAKHNO-inspired immersive architecture, a replacement cover concept, and a hybrid visual identity. Record that this supersedes the older cover-is-untouchable decision for future approved work, but do not modify that documentation yet.

Inspect the actual local repository. Do not edit, create, delete, move, install, commit, push or publish anything.

Return the complete Phase 0 report. Recommend a feasible technical approach and a concrete visual storyboard direction. Then stop and wait for the user's approval.

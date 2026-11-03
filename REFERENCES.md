# REFERENCES.md — research for the Library page + coming projects (ideas only, nothing applied)

> Made 2026-10-31. Research only: no site files touched, nothing downloaded or embedded.
> **Rule at the top: every image source below is INSPIRATION ONLY.** Use the pages/photos to decide
> what to create and how to order/draw it — never as project images. Your project images must be your
> own renders, drawings and diagrams (D5, SketchUp, AutoCAD), per PROJECT.md and ASSETS.md.

---

## 1. Reference sites (what good library pages do)

| Site | URL | What it does well | One thing to avoid |
|---|---|---|---|
| Justin Meikle — Lockhart Public Library (student) | https://www.jrmdesign.space/undergrad/project-five | Clear plan → section → rendering flow with a short concept-first text; site context explained through the parti before any drawing | Images labelled only "View fullsize" — no captions, so the reviewer loses what they are looking at |
| Mollie McNally — Clifton Library (Miami Univ. studio) | https://sites.miamioh.edu/second-year-spring-2020/category/studio-section/aaaa/mollmcn/ | Model inventory: parti, program-org, structural, circulation diagrams + cut-away axon + materials board, each listed by name | Wall-of-text concept paragraph up front — reviewers skim, so lead with the drawing |
| Negar Adibpour — Chambly Library (McGill) | https://negaradibpour.com/chambly-library | Strong concept narrative (deconstructed cube) tied to plans; two floors + site plan, renders paired with the spatial idea they explain | Very long unbroken prose — breaks the fast desktop skim |
| Yale Core III — New Haven Public Library (HAO) | https://hao-hao.haus/The-Open-Workshop-Library | Tiny sequence: ground-floor plan, second floor, roof-scape axonometric, sectional perspective — 4 drawings tell the whole building | Almost no captions at all — the opposite failure of the first site |
| Miraz Reza — Dix Park Library (Archinect) | https://archinect.com/mirazreza/project/nexus-dix-park-library | Parti → facade concept → level plans 1-4 → key spaces, one image per idea, short title lines | Thumbnails-only gallery on Archinect — our site must keep big images |
| Khushi Patel (portfolio, general pattern) | https://www.imkhushi.com/ | Every project card repeats the same metadata line (TYPE · YEAR · LOCATION · TIME) — exactly our register/caption habit | Many projects with one image each — our reviewer wants depth on one project |
| Donovan Wessel (portfolio, tools honesty) | https://donovanwesselportfolio.framer.website/ | Lists D5 Render among tools and shows clean one-project pages | Framer-site heaviness; ours stays plain HTML (PROJECT.md §8) |

*(Row notes derive from what each page publicly shows on 2026-10-31.)*

---

## 2. Drawing & diagram ideas, ranked by impact vs effort (library / public buildings)

| # | Drawing | What it shows | How to produce (SketchUp / D5 / AutoCAD) | Effort |
|---|---|---|---|---|
| 1 | **Long section through the main space** | Light, levels, atmosphere in one place where a plan can't | SketchUp section cut → scene → LayOut/DWG → clean in AutoCAD/Photoshop | medium |
| 2 | **Ground-floor plan** | Program, entry logic, furniture | AutoCAD from SketchUp/DWG; line weights 0.25/0.18/0.09 (like our hairlines) + poché grey | medium |
| 3 | **Circulation diagram** | The library as a path (borrower's route) | SketchUp arrows/paths export → trace in Photoshop/Illustrator over a light plan | low |
| 4 | **Sectional perspective (cutaway)** | Draws reviewer in like no 2D section | D5: one section-cut render, black-line overlay in Photoshop | medium |
| 5 | **Exploded axonometric** | Roof / floors / structure as three layers | SketchUp: duplicate model, `explode` layers apart, one parallel-projection scene | medium |
| 6 | **Daylight / ventilation diagram** | Why reading rooms face north/soft light | Sun-path study in SketchUp or Climate Consultant screenshot traced; arrows for prevailing wind | low |
| 7 | **Site plan with approach lines** | Relationship to street, park, parking | AutoCAD line work over an OpenStreetMap base (trace, don't paste) | low |
| 8 | **Structure diagram** | Grid, spans, the cantilever | SketchUp structure-only layer scene → wireframe export | low |
| 9 | **Massing evolution (3-4 steps)** | Idea growth: cube → split → cantilever | 3-4 SketchUp views from the early model versions, same camera, same scale | low |
| 10 | **Upper-floor plans (2-3)** | Stacking story | Same AutoCAD template as ground plan | medium |
| 11 | **Materials / detail vignette** | Craft close-up (shelf-seat link) | D5 detail render, one only | low |

**Black-line style for everything black-line (fits our site exactly):** off-white ground, only `#1A1A1A` lines
(three weights: cut 0.5 / firm 0.25 / light 0.13), grey poché at 10-15% yellow-free tone, no fills except
thin hatches/crosses for materials, no colour except a single burgundy accent (e.g. the entry arrow) —
that matches PROJECT.md §5 tokens `#F5F3EF / #1A1A1A / #8A8A8A / #7A1F2B`.

---

## 3. Content to create for the library page — checklist vs project.html's six sections

| Page section (PROJECT.md §6) | To create (my own work) | Done? |
|---|---|---|
| 1 — Hero | 1 exterior D5 render (daylight, slight angle, people small), 1-line description | ☐ |
| 2 — Brief | Final title, location, program (floors + key spaces), year, type; keep Tools line | ☐ |
| 3 — Concept | 2-3-sentence parti + **SK-01 circulation diagram**, **SK-02 massing evolution** | ☐ |
| 4 — Drawings (plan → section → elevation) | ground plan, 1-2 upper plans (D-01…), 1 long + 1 cross section, 1-2 elevations | ☐ |
| 5 — Render gallery | 6-8 D5 renders: hero, entrance, 2 interiors, section/cutaway, dusk, detail (+ optional per-image `scale`) | ☐ |
| 6 — Closing | 1 dusk/atmosphere render reused or new + filler-free caption | ☐ |

Minimum viable set if time is short: long section, ground plan, circulation diagram, 4 renders — delete the
JSON entries you don't fill (empty gallery entries break the register's counts).

---

## 4. Ideas for the About page and the next project

- **About:** add one process line per study year ("what I learned" beats "what I made"); the hand-sketch or
  physical-model photo (if you have any) belongs on the About page, not the project page.
- **About PDF:** the 6-section web page prints cleanly already (Ctrl+P) — the PDF can literally be
  "print this page to PDF" once the content is real, plus a cover sheet.
- **Next project ideas** (pairs well with a library, same public-building skill set):
  a **reading-pavilion / community hall**, a **museum gallery extension**, or a **transit pavilion shed** —
  each reuses massing evolution + section-first presentation without repeating the library's program.

---

## 5. Sources (every URL, license terms for the image sources)

**Reference sites (look, no reuse rights implied)**
- https://www.jrmdesign.space/undergrad/project-five
- https://sites.miamioh.edu/second-year-spring-2020/category/studio-section/aaaa/mollmcn/
- https://negaradibpour.com/chambly-library
- https://hao-hao.haus/The-Open-Workshop-Library
- https://archinect.com/mirazreza/project/nexus-dix-park-library
- https://www.imkhushi.com/
- https://donovanwesselportfolio.framer.website/

**Image sources — INSPIRATION ONLY**
- Wikimedia Commons, category "Interiors of libraries" — mixed CC BY-SA 2.0-4.0 per file; attribution +
  share-alike required for anything copied: https://commons.wikimedia.org/wiki/Category:Interiors_of_libraries
- Wikimedia Commons, category "Reading rooms" — 99 files, individual file licenses vary, mostly CC BY-SA:
  https://commons.wikimedia.org/wiki/Category:Reading_rooms
- Example (daylight in a historic reading room), CC BY-SA 3.0, requires attribution line under any reuse:
  https://commons.wikimedia.org/wiki/File:Duke_Humfrey%27s_Library_Interior_1,_Bodleian_Library,_Oxford,_UK_-_Diliff.jpg
- Modern library interior (Stuttgart Stadtbibliothek), Unsplash License — free use, no attribution required,
  competing-service resale forbidden: https://unsplash.com/photos/modern-library-interior-with-white-stairs-and-bookshelves-IKf-H_mPoh0
- 3-storey library interior (State Library of South Australia), Unsplash License:
  https://unsplash.com/photos/3-storey-library-interior-BplhhW_JyhQ
- NYPL Rose Main Reading Room green desk-and-lamp study, Unsplash License:
  https://unsplash.com/photos/interior-building-OvXht_wi5Ew
- Unsplash licence text (main): https://unsplash.com/license and https://help.unsplash.com/en/articles/2612337
- Pexels (similar free license, no attribution required, no resale): https://www.pexels.com/license/
- Library of Congress (historic reading rooms, mostly "no known restrictions"): https://www.loc.gov/free-to-use/

**None of these are to be embedded or downloaded into `images/` — they are for looking at, only.**

---

## Production status (2026-11-01)

The drawing-idea table above became the production checklist in **ASSETS.md** ("FIRST TARGET =
minimum viable set": long section → ground-floor plan → circulation diagram → hero render →
entrance, reading room, dusk, detail). TODO.md's NOW block tracks those first.

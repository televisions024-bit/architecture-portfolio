# Portfolio website — Architecture Internship Portfolio (Mohammed Huzefa)

Preview locally: double-click `index.html`, or from this folder run `python -m http.server 8000` (or use VS Code Live Server) and open http://localhost:8000 — the server is needed for `project.html` content to load.

**Before sharing or deploying: run `node check-placeholders.js`. Do not publish while it reports placeholders** (it lists every temporary stand-in stock photo still shown for a missing real render — credits in `images/PLACEHOLDERS.md`).
How to add a project (3 steps): copy `projects/library.json` to `projects/<new-slug>.json` and fill its content; add one entry (slug, title, year, type, thumbnail) to `projects/index.json`; put the images in `images/<new-slug>/` — it then appears on projects.html automatically, and "Next project" links update on their own.
Deploy free: push this folder to a GitHub repo and enable Pages (Settings > Pages > main branch), or drag the folder into https://app.netlify.com/drop.
The cover page (`index.html`) is approved and must not be redesigned; edit content through `projects/*.json` only.
Colors, fonts and spacing come from `styles.css` and must follow section 5 of `PROJECT.md`.

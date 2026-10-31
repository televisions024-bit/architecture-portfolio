# Portfolio website — Architecture Internship Portfolio (Mohammed Huzefa)

Preview locally: double-click `index.html`, or from this folder run `python -m http.server 8000` (or use VS Code Live Server) and open http://localhost:8000 — the server is needed for `project.html` content to load.
Add a new project: copy `projects/library.json` to `projects/<name>.json`, put its images in `images/<name>/`, then copy `project.html` and change the `data-project` filename at the top of its `<script>` tag.
Deploy free: push this folder to a GitHub repo and enable Pages (Settings > Pages > main branch), or drag the folder into https://app.netlify.com/drop.
The cover page (`index.html`) is approved and must not be redesigned; edit content through `projects/*.json` only.
Colors, fonts and spacing come from `styles.css` and must follow section 5 of `PROJECT.md`.

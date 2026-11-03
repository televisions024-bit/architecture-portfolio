# Architecture portfolio — Mohammed Huzefa

A static HTML/CSS/JavaScript portfolio. Open `index.html` directly for the cover, or run a local server (for example `python -m http.server 8000`) to preview all project data.

## Changing project images
The project JSON files point to permanent image paths under `images/library/`. Add your own render at the exact path and it will automatically replace the current visual reference. You can also replace any image in `images/placeholders/` with another image while keeping its filename; the layout and code do not need to change.

The five temporary images are used as **visual references**, not as completed project renders. The website gives them a quiet “Visual reference” caption. Their source and photographer details are recorded in `images/PLACEHOLDERS.md`.

## Add a project
Copy `projects/library.json` to `projects/<new-slug>.json`, fill its content, add an entry to `projects/index.json`, and place images in `images/<new-slug>/`.

## Deploy
Upload the contents of this folder to the root of a GitHub repository and enable GitHub Pages from the `main` branch, `/ (root)`.

The cover page (`index.html`) is approved and intentionally unchanged. Edit project content through `projects/*.json`.

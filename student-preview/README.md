# Student portfolio preview

This is an isolated, unlisted prototype inspired by MAKHNO's immersive project storytelling. It does not replace the current website. All existing site assets remain in their original folders.

## Preview locally

From the portfolio repository root, run:

`python -m http.server 8000`

Then open `http://localhost:8000/student-preview/`. The project pages load JSON data, so use a local server rather than opening the files directly.

## Add a project

1. Add one entry to `data/projects.json` (slug, title, category, year, summary, cover path).
2. Add `data/projects/<slug>.json` with facts, project story, optional technical drawings and gallery items.
3. Put images in the existing or new project image folder and reference their relative paths.

Keep draft text and sample content clearly marked. Only add drawings or images that represent the actual project. The preview is `noindex` and is not ready to publish.
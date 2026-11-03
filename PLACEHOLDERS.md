# Visual reference image sources and replacement guide

The images in `images/placeholders/` are temporary visual references used only when the matching project render is not yet present. They are not Mohammed's project work. The live site uses a discreet “Visual reference” caption rather than a warning badge.

## Replace images at any time
- To change the temporary visual, replace the corresponding file in `images/placeholders/` and keep the same filename.
- To show your own work, add your render at the matching permanent path under `images/library/renders/`. The real render automatically takes priority over the visual reference.
- No HTML, CSS, or JavaScript edits are needed for either method.

| Temporary file | Permanent project image path | Source / photographer | License |
|---|---|---|---|
| `placeholder-01-hero.webp` | `images/library/renders/01-hero-exterior.webp` | Pexels — Galla_ph | Pexels License |
| `placeholder-02-entrance.webp` | `images/library/renders/02-entrance-approach.webp` | Pexels — Agung Pandit Wiguna | Pexels License |
| `placeholder-03-reading-room.webp` | `images/library/renders/03-reading-room.webp` | Pexels — Polina Zimmerman | Pexels License |
| `placeholder-04-dusk.webp` | `images/library/renders/06-dusk-view.webp` | Pexels — iramezatil | Pexels License |
| `placeholder-05-detail.webp` | `images/library/renders/07-detail.webp` | Pexels — Ricky Esquivel | Pexels License |

The hero and reading-room fallbacks previously used remote Unsplash URLs; the current fallback map uses the bundled local files so the site remains reliable when a remote image host changes. The original source notes are retained in `REFERENCES.md`.

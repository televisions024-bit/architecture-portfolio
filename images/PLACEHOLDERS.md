# PLACEHOLDERS.md — temporary stand-in photos

While a **real render file** is missing from `images/library/renders/`, the site shows a
free-license stock photo from the list below instead — always marked on the image with a
burgundy tag reading **PLACEHOLDER - NOT MY WORK**, with the photo credit at the end of
the caption row. As soon as a real render file exists at its exact expected path, it is
shown instead and the stand-in is ignored.

**None of these photos are Mohammed's work. They must never be published, shared or
deployed.** Run `node check-placeholders.js` — it exits with an error while any stand-in
is still in use.

When the last real render arrives: delete `images/placeholders/`, the `PLACEHOLDERS`
map in `script.js`, the `.ph-tag` CSS block in `styles.css`, this folder's mention in
`README.md`, and `check-placeholders.js`.

| # | Stand-in file | Real file it stands in for | Size | Source | Status |
|---|---------------|----------------------------|------|--------|--------|
| 1 | `images/placeholders/placeholder-01-hero.webp` | `images/library/renders/01-hero-exterior.webp` | 800x600 | — | **SOURCE PENDING** (replaced by Mohammed 2026-11-06, creator/licence not recorded yet) |
| 2 | `images/placeholders/placeholder-02-entrance.webp` | `images/library/renders/02-entrance-approach.webp` | 1125x750 | — | **SOURCE PENDING** (replaced by Mohammed 2026-11-06, creator/licence not recorded yet) |
| 3 | `images/placeholders/placeholder-03-reading-room.webp` | `images/library/renders/03-reading-room.webp` | 500x625 | — | **SOURCE PENDING** (replaced by Mohammed 2026-11-06, creator/licence not recorded yet) |
| 4 | `images/placeholders/placeholder-04-dusk.webp` | `images/library/renders/06-dusk-view.webp` | 1920x2879 (2:3) | https://www.pexels.com/photo/interior-with-illuminated-shelves-with-books-20449661/ | Photographer iramezatil, Pexels License — https://www.pexels.com/license/ |
| 5 | `images/placeholders/placeholder-05-detail.webp` | `images/library/renders/07-detail.webp` | 500x333 | — | **SOURCE PENDING** (replaced by Mohammed 2026-11-06, creator/licence not recorded yet) |

Notes
- Photos 1, 2, 3 and 5 were hand-copied by Mohammed on 2026-11-06 (low-resolution
  stand-ins, real creator and licence unknown). Until a creator + licence is
  written here, the site shows "source pending" in the caption instead of a
  photographer name, and `node check-placeholders.js` reports `CREDIT PENDING`.
  NEVER publish, share or deploy while a credit is pending.
- #4 (dusk) is unchanged: iramezatil via Pexels, a credited free-licence photo.
- The old 2026-11-01 stand-ins (Galla_ph, Agung Pandit Wiguna, Polina Zimmerman,
  Ricky Esquivel — all Pexels) were overwritten on 2026-11-06; their credits are
  no longer relevant and are not shown anywhere.
- Files are WebP. They are NOT the size/style guidance for the real renders —
  see ASSETS.md.

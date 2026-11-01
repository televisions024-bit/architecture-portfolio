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

| # | Stand-in file | Real file it stands in for | Source page | Photographer | License |
|---|---------------|----------------------------|-------------|--------------|---------|
| 1 | `images/placeholders/placeholder-01-hero.webp` | `images/library/renders/01-hero-exterior.webp` | https://www.pexels.com/photo/modern-library-building-architecture-33481977/ | Galla_ph | Pexels License — https://www.pexels.com/license/ |
| 2 | `images/placeholders/placeholder-02-entrance.webp` | `images/library/renders/02-entrance-approach.webp` | https://www.pexels.com/photo/a-double-glass-door-in-the-library-10743869/ | Agung Pandit Wiguna | Pexels License — https://www.pexels.com/license/ |
| 3 | `images/placeholders/placeholder-03-reading-room.webp` | `images/library/renders/03-reading-room.webp` | https://www.pexels.com/photo/spacious-library-room-with-bookshelves-under-natural-daylight-3747505/ | Polina Zimmerman | Pexels License — https://www.pexels.com/license/ |
| 4 | `images/placeholders/placeholder-04-dusk.webp` | `images/library/renders/06-dusk-view.webp` | https://www.pexels.com/photo/interior-with-illuminated-shelves-with-books-20449661/ | iramezatil | Pexels License — https://www.pexels.com/license/ |
| 5 | `images/placeholders/placeholder-05-detail.webp` | `images/library/renders/07-detail.webp` | https://www.pexels.com/photo/turned-on-floor-lamp-near-sofa-on-a-library-room-1907784/ | Ricky Esquivel | Pexels License — https://www.pexels.com/license/ |

Notes
- All five come from Pexels (allowed source). Generic photos: no recognizable people,
  no logos, no famous named buildings.
- Files are WebP, ~1920 px wide, converted from the originals (quality tuned to
  200-400 KB). They are NOT the size/style guidance for the real renders — see ASSETS.md.

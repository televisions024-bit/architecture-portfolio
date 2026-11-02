/* ============================================================
   backgrounds-config.js — BACKGROUND SETTINGS (the old
   backgrounds.json, now a plain .js file so it also works when
   you open the site directly (file://), not just on a server).

   How it works — no code changes needed:
   - "selected" names a candidate that exists as
     images/backgrounds/<name>-1920.webp (desktop) and
     <name>-900.webp (phone); swap it by changing the name.
   - Add your own image: drop a file at
     images/backgrounds/<slot>.webp (e.g. cover.webp) - it then
     wins over "selected" and is used at both sizes.
   - "overlay" = flat veil opacity on the COVER; on the three
     inner pages the same number is the background's overall
     visibility (suggestion: 0.06-0.10).
   - "grayscale": true keeps every background desaturated.
   - "credits" feeds the Credits section on the about page -
     keep it in step with images/BACKGROUNDS.md when you add
     files.

   Preview: open backgrounds-preview.html on the local server.
   ============================================================ */
window.BG_CONFIG = {
  "credits": {
    "cover-01-lines":          { "author": "Dirar",                  "source": "https://www.pexels.com/photo/black-and-white-modern-architectural-structure-32035884/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "cover-02-facade":         { "author": "Jan van der Wolf",       "source": "https://www.pexels.com/photo/abstract-architecture-view-of-modern-building-29158426/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "cover-03-stair-light":    { "author": "Tizzy",                  "source": "https://www.pexels.com/photo/stairs-in-sunlight-20540982/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "cover-04-brutalist":      { "author": "Josephine Joo-Hee Yang", "source": "https://www.pexels.com/photo/facade-of-brutalist-building-17660884/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "cover-05-courtyard":      { "author": "Kubra Nur Sahin",        "source": "https://www.pexels.com/photo/the-arches-of-a-building-with-a-sun-shining-through-27272980/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "projects-01-grid":        { "author": "Steve",                  "source": "https://www.pexels.com/photo/beige-and-blue-tiled-surface-845234/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "projects-02-repeat":      { "author": "Feyza Yildirim",         "source": "https://www.pexels.com/photo/windows-of-an-office-building-19543546/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "projects-03-blocks":      { "author": "Jan van der Wolf",       "source": "https://www.pexels.com/photo/row-of-concrete-blocks-25643330/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "project-01-stairs":       { "author": "Hassan",                 "source": "https://www.pexels.com/photo/view-of-a-staircase-19808894/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "project-02-shadow-stair": { "author": "Joshua Mueller",         "source": "https://www.pexels.com/photo/concrete-pillars-near-white-wall-in-close-up-photography-14886657/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "project-03-shadow-pattern": { "author": "David Hernandez",      "source": "https://www.pexels.com/photo/shadow-and-light-on-urban-staircase-36201546/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "about-01-minimal":        { "author": "Laura Cleffmann",        "source": "https://www.pexels.com/photo/stairs-behind-columns-20207674/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "about-02-wall":           { "author": "David Underland",        "source": "https://www.pexels.com/photo/white-squares-on-wall-18448817/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" },
    "about-03-afternoon":      { "author": "Tanha Tamanna Syed",     "source": "https://www.pexels.com/photo/artistic-staircase-in-afternoon-light-37020714/", "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/" }
  },

  "slots": {
    "cover": {
      "candidates": [
        "cover-01-lines",
        "cover-02-facade",
        "cover-03-stair-light",
        "cover-04-brutalist",
        "cover-05-courtyard"
      ],
      "selected": "cover-04-brutalist",
      "overlay": 0.85,
      "grayscale": true
    },
    "projects": {
      "candidates": [
        "projects-01-grid",
        "projects-02-repeat",
        "projects-03-blocks"
      ],
      "selected": "projects-01-grid",
      "overlay": 0.08,
      "grayscale": true
    },
    "project": {
      "candidates": [
        "project-01-stairs",
        "project-02-shadow-stair",
        "project-03-shadow-pattern"
      ],
      "selected": "project-02-shadow-stair",
      "overlay": 0.08,
      "grayscale": true
    },
    "about": {
      "candidates": [
        "about-01-minimal",
        "about-02-wall",
        "about-03-afternoon"
      ],
      "selected": "about-02-wall",
      "overlay": 0.08,
      "grayscale": true
    }
  }
};

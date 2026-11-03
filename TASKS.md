# TASKS.md - queue of approved tasks for the coding model

How to use (for the coding model):
1. Read PROJECT.md and AGENTS.md first.
2. Do ONLY the first task below that is not marked [x]. Never do two tasks in one go.
3. Before editing, tell me in 3 lines what you will change. Then apply it exactly as written in DESIGN-AUDIT.md.
4. Do not touch the cover (index.html). Verify: git diff before-new-skills -- index.html must show only the approved background lines.
5. One commit per task with a clear message. Keep answers short and never repeat lines.
6. When the task is done, mark it [x] in this file, add a line to CHANGELOG.md, commit, report in max 5 lines, and STOP. Wait for me to say "next".

Already done: #10 About sheet code, #11 dead CSS, #2 double-centring.

## Tasks

- [x] #12 Bump placeholder and note font sizes to 11px (DESIGN-AUDIT.md #12). Approved.
- [x] #13 Gallery thumbs natural height so portrait photos are not cropped (DESIGN-AUDIT.md #13). Approved. After the change, check the project page at desktop and phone widths and tell me in one line what changed.
- [x] #14 Lightbox open fade, 180ms (DESIGN-AUDIT.md #14). Approved ONLY if it is fully disabled under prefers-reduced-motion. If it cannot be done that way, skip it and tell me.
- [x] Final: update TODO.md and PROJECT.md section 10, run node check-placeholders.js, report the result (placeholders are expected for now). Max 10 lines.

## Content still needed from me (do not invent anything)
- TODO fields in projects/library.json, projects/index.json, projects/about.json
- Real images per ASSETS.md (first target: the 8-file set)

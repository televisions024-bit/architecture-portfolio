/* ============================================================
   backgrounds.js — decorative page backgrounds (PROJECT.md
   section 5 amendment, 2026-11-01). Loaded by all four pages.

   How a background is picked (no code changes needed):
   1. If you dropped your own file at images/backgrounds/<slot>.webp
      (cover.webp / projects.webp / project.webp / about.webp),
      that file is used at both desktop and phone size.
   2. Otherwise the "selected" candidate from backgrounds-config.js is
      used — desktop gets <name>-1920.webp, phones get <name>-900.webp
      (styles.css switches between the two variables by media query,
      so no resize handling is needed here).

   The script only sets CSS variables; it never touches layout,
   sizes or content. If backgrounds-config.js is missing the page
   keeps its plain off-white look. Data-saver visitors (and print)
   get no background at all.

   The settings are read from the BG_CONFIG global (loaded by
   backgrounds-config.js just before this script) instead of a
   fetch, so the page also works when opened directly as a file.
   ============================================================ */
(function () {
  'use strict';
  var SLOT = {
    'index.html': 'cover',
    'projects.html': 'projects',
    'project.html': 'project',
    'about.html': 'about'
  };
  var page = (location.pathname.split('/').pop() || 'index.html');
  var slot = SLOT[page];
  if (!slot) return;
  /* prefers-reduced-data is barely supported anywhere yet, but where
     it exists we simply skip the background — the cheapest respect. */
  if (window.matchMedia && matchMedia('(prefers-reduced-data: reduce)').matches) return;

  var cfg = window.BG_CONFIG;   /* loaded by backgrounds-config.js */
  if (!cfg || !cfg.slots) return;
  const s = cfg.slots[slot];
  if (!s || !s.selected) return;
  apply('images/backgrounds/' + slot + '.webp',      /* optional local override */
        s.desktopUrl || ('images/backgrounds/' + s.selected + '-1920.webp'),
        s.phoneUrl || ('images/backgrounds/' + s.selected + '-900.webp'), s);
  /* probe runs first; on 404 falls straight through to fallback */
  function apply(overrideSrc, deskSrc, phoneSrc, set) {
    const probe = new Image();
    probe.onload = () => setVars(set, overrideSrc, overrideSrc);
    probe.onerror = () => setVars(set, deskSrc, phoneSrc);
    probe.src = overrideSrc;
  }
  function setVars(set, desk, phone) {
    const b = document.body;
    b.style.setProperty('--bg-image',       'url("' + desk + '")');
    b.style.setProperty('--bg-image-phone', 'url("' + phone + '")');
    if (page === 'index.html') {
      /* cover: image visible at full strength, flat off-white veil
         on top keeps every text pixel above 4.5:1 contrast     */
      b.style.setProperty('--bg-opacity', '1');
      b.style.setProperty('--bg-veil', String(set.overlay));
    } else {
      /* inner pages: very low visibility behind all content */
      b.style.setProperty('--bg-opacity', String(set.overlay));
    }
    if (!set.grayscale) b.classList.add('bg-colorize');
  }
})();

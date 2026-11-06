/* ============================================================
   script.js — the only JavaScript on the site. Three small jobs:
   1) On the project page: load content from projects/<p>.json
      where <p> comes from the URL, e.g. project.html?p=library.
      Missing parameter or missing file -> friendly "not found".
   2) On projects.html: build the index cards from projects/index.json.
   3) The gallery lightbox: click image to open, click or Esc to close.
   Written simply on purpose. No libraries, no build step.
============================================================ */

/* Which page are we on? project page uses #project-root,
   the projects index uses #index-root.                           */
const projectRoot = document.getElementById('project-root');
const indexRoot = document.getElementById('index-root');

/* JS is on: tell the CSS so motion like .reveal may hide
   content (without JS nothing is ever hidden).                */
document.documentElement.classList.add('js');

/* ============================================================
   TEMPORARY stand-in photos: if a real render file is missing,
   show a free-license stock photo instead of the IMAGE TODO
   block, with a warning tag on the image and a photo credit in
   the caption row. If the real render exists, the stand-in is
   never used. Full credits live in images/PLACEHOLDERS.md.
   credit "SOURCE PENDING" = the FILE was replaced by Mohammed but
   its creator/licence is not recorded yet: pages show "source
   pending" (never a photographer name, never "TODO") and
   check-placeholders.js flags the entry until a real credit lands.
   When all real renders exist, delete this map + check script.
   One map at the top: the project PAGE and the register both
   use the same stand-ins.                                    */
const PLACEHOLDERS = {
  'images/library/renders/01-hero-exterior.webp':
    { file: 'images/placeholders/placeholder-01-hero.webp',
      w: 800, h: 600, credit: 'SOURCE PENDING' },
  'images/library/renders/02-entrance-approach.webp':
    { file: 'images/placeholders/placeholder-02-entrance.webp',
      w: 1125, h: 750, credit: 'SOURCE PENDING' },
  'images/library/renders/03-reading-room.webp':
    { file: 'images/placeholders/placeholder-03-reading-room.webp',
      w: 500, h: 625, credit: 'SOURCE PENDING' },
  'images/library/renders/06-dusk-view.webp':
    { file: 'images/placeholders/placeholder-04-dusk.webp',
      w: 1920, h: 2879, credit: 'iramezatil, Pexels' },
  'images/library/renders/07-detail.webp':
    { file: 'images/placeholders/placeholder-05-detail.webp',
      w: 500, h: 333, credit: 'SOURCE PENDING' }
};

/* ============================================================
   TODO VALUES NEVER RENDER — a value that starts with "TODO"
   is hidden everywhere. A value may carry a real head and an
   open TODO tail ("Public library — TODO: floors, key spaces");
   only the real head is shown then, never the TODO text.     */
function cleanValue(v) {
  if (v === undefined || v === null) return '';
  const s = String(v);
  if (s.trim().toUpperCase().startsWith('TODO')) return '';
  const cut = s.search(/TODO/i);
  return (cut > 0 ? s.slice(0, cut) : s)
    .replace(/[—–\-,:; ]+$/, '').trim();
}

/* ============================================================
   PROJECT PAGE (?p=slug) — build the SIX sections from JSON
   (PROJECT.md section 6: hero, brief, concept, drawings,
   gallery with lightbox, closing image + next/back links)
============================================================ */
if (projectRoot) {
  /* the slug arrives in the URL: project.html?p=library.
     Only letters, numbers and dashes are allowed, so nobody can
     poke at other files through the URL.                          */
  const slug = (new URLSearchParams(location.search).get('p') || '')
    .trim().replace(/[^\w-]/g, '');

  if (!slug) {
    showProjectNotFound(projectRoot, 'No project was given in the link.');
  } else {
    /* fetch() only works over a small local server (see README.md) */
    fetch('projects/' + slug + '.json')
      .then(r => {
        if (!r.ok) throw new Error('not-found');       // file missing
        return r.json();
      })
      .then(data => {
        /* also load projects/index.json so the footer knows the
           next project and this project's place in the list      */
        return fetch('projects/index.json')
          .then(r => r.ok ? r.json() : { projects: [] })
          .then(ix => {
            buildProjectPage(document, data, slug, ix.projects || []);
            initLightbox(document);
            initFades(document);
          });
      })
      .catch(err => {
        if (err.message === 'not-found') {
          showProjectNotFound(projectRoot,
            'There is no project called "' + slug + '" yet.');
        } else {
          /* Beginner-friendly error: content does not load over
             file:// — easy local servers are explained in README.md */
          projectRoot.innerHTML =
            '<p style="padding:48px">Could not load projects/' + slug +
            '.json (' + err.message + '). Run a small local server and open ' +
            'this page through it — see README.md for how.</p>';
        }
      });
  }
}

/* friendly stub for a missing p= parameter or a missing JSON file */
function showProjectNotFound(root, why) {
  document.title = 'Project not found — Mohammed Huzefa';
  root.innerHTML =
    '<section class="section"><div class="wrap">' +
    '  <p class="label">404</p>' +
    '  <h1 style="font-family:var(--font-heading);font-weight:normal;' +
    '      font-size:clamp(28px,4vw,44px);margin-bottom:14px;">Project not found</h1>' +
    '  <p style="max-width:62ch;color:var(--grey);margin-bottom:28px;">' + why +
    '    It may not exist yet, or the link may be out of date.</p>' +
    '  <a class="cover-link" href="projects.html">Back to all projects</a>' +
    '</div></section>';
}

/* Build the whole page from the data object ------------------ */
function buildProjectPage(doc, data, slug, ixProjects) {
  const root = doc.getElementById('project-root');
  root.innerHTML = '';
  /* the project name; TODO values never render — the URL slug
     is the quiet stand-in name until real content is written.  */
  const name = cleanValue(data.title);
  doc.title = (name || slug) + ' — Mohammed Huzefa';

  /* helpers ------------------------------------------------- */

  // create a simple element, like el('p', 'measure', 'text')
  function el(tag, cls, text) {
    const n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // an element whose content is HTML, used for the placeholder blocks
  function elHTML(tag, cls, html) {
    const n = el(tag, cls);
    n.innerHTML = html;
    return n;
  }

  /* an <img>, lazy-loaded; if the file does not exist yet, swap in
     the stock stand-in (tagged "PLACEHOLDER - NOT MY WORK") for the
     five renders above, or a clean "IMAGE TODO" block for everything
     else, showing the exact filename to drop in.
     capRow = the figure's caption row, so the credit line can be
     appended to its end when a stand-in is used (hero gets a new row). */
  function image(src, alt, eager, capRow) {
    if (!src) return elHTML('div', 'ph', '<span>IMAGE TODO</span>');

    const img = doc.createElement('img');
    img.src = src;
    img.alt = alt || '';
    if (!eager) img.setAttribute('loading', 'lazy'); // lazy-load everything but the hero
    img.setAttribute('decoding', 'async');          // never block the main thread
    if (eager) img.setAttribute('fetchpriority', 'high');   // the hero is first screen
    /* width/height kill the layout jump while the file loads; CSS
       sets the real layout on top (crop / max-height). Default 3:2
       for real renders; when a stand-in swaps in, its real stored
       size (w/h in PLACEHOLDERS) is set on the img, so nothing
       jumps or stretches.                                           */
    img.width = 1920; img.height = 1280;

    const ph = elHTML('div', 'ph',
      '<span>IMAGE TODO:<br><span>' + src + '</span></span>');
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);   // fire once: real -> stand-in -> TODO
      const std = PLACEHOLDERS[src];
      if (!std) { img.replaceWith(ph); return; }

      /* stand-in: swap the file in (its real size with it). No corner
         tag any more — Mohammed asked for the chips removed; the
         invisible markers (classes, credits) are kept.           */
      img.src = std.file;
      img.width = std.w; img.height = std.h;
      const fig = img.parentElement;             // hero's credit row needs the figure
      /* captions name the photographer; an unrecorded creator shows
         "source pending" — never a guessed name, never "TODO"      */
      const credit = el('span', 'cap-note',
        std.credit === 'SOURCE PENDING' ? 'source pending'
                                        : 'Photo: ' + std.credit);
      if (capRow) capRow.appendChild(credit);
      else {                                     // hero has no caption row — add one
        const row = el('div', 'cap-row');
        row.appendChild(credit);
        if (fig) fig.appendChild(row);
      }
      /* if the stand-in file is missing too, fall back to the TODO block */
      img.addEventListener('error', () => img.replaceWith(ph));
    });
    return img;
  }

  /* one figure: image + the caption ROW (Direction A with B's pattern):
     a hairline row under the image showing sheet no. | short title |
     scale note. Codes are auto-numbered per section (SK-01, D-02,
     R-03, ...) so new projects are numbered without any extra work.
     The title is never invented: a TODO caption shows nothing.      */
  function figure(src, alt, caption, cap) {
    const f = el('figure', 'reveal');
    const title = cleanValue(caption);
    /* the caption row is built first so image() can append a photo
       credit to its end when a stand-in photo is used            */
    const row = (title || cap) ? el('div', 'cap-row') : null;
    if (row) {
      if (cap && cap.code) row.appendChild(el('span', 'cap-code', cap.code));
      if (title) row.appendChild(el('span', 'cap-title', title));
      if (cap && cap.note) row.appendChild(el('span', 'cap-note', cap.note));
    }
    if (src) f.appendChild(image(src, alt, false, row));
    if (row) f.appendChild(row);
    return f;
  }

  /* a section: thin rule feel, small label, big serif title.
     part = the sheet-part name shown in the title-block code.
     (Returns the inner .wrap, as before, so callers append into it.) */
  function section(label, title, part) {
    const s = el('section', 'section');
    if (part || label) s.dataset.part = part || label;
    const w = el('div', 'wrap');
    if (label) w.appendChild(el('p', 'label', label));
    if (title) w.appendChild(el('h2', '', title));
    s.appendChild(w);
    root.appendChild(s);
    return w;
  }

  /* ---- 1 — HERO: full-width render + title + one-liner ---- */
  const hero = el('section', 'section project-hero');
  hero.dataset.part = 'TITLE';
  hero.style.paddingTop = '48px';
  const hw = el('div', 'wrap');
  hw.appendChild(el('div', 'dim-line'));   // hairline + ticks: the only decoration
  const t1 = el('h1', 'proj-title', name || slug);
  t1.style.cssText =
    'font-family:var(--font-heading);font-weight:normal;' +
    'font-size:clamp(30px,4vw,46px);margin-bottom:6px;';
  hw.appendChild(t1);
  const lead = cleanValue(data.hero && data.hero.lead);
  if (lead) hw.appendChild(el('p', 'label', lead));   // one-line description
  const heroFig = el('figure', 'fig-wide');   // no reveal: first-screen media must simply show (see styles.css note)
  heroFig.appendChild(image(data.hero.src, data.hero.alt, true));
  hw.appendChild(heroFig);
  hero.appendChild(hw);
  root.appendChild(hero);

  /* ---- facts row under the hero (from the meta list) ------ */
  /* Only the five agreed keys show, in the JSON's own order,
     and only when the value is real (TODO stays hidden).     */
  const FACT_KEYS = ['Type', 'Location', 'Program', 'Year', 'Tools'];
  if (Array.isArray(data.meta)) {
    const facts = el('dl', 'proj-facts fade');
    facts.style.cssText = 'margin-top:26px;max-width:none;';
    data.meta.forEach(m => {
      const v = cleanValue(m && m.value);
      if (!v || !FACT_KEYS.includes(m && m.key)) return;
      const line = el('div');
      line.appendChild(el('dt', '', m.key));
      line.appendChild(el('dd', '', v));
      facts.appendChild(line);
    });
    if (facts.children.length) hw.appendChild(facts);
  }

  /* ---- 2 — 01 BRIEF: 2-3 short factual sentences ----------
     The numbered text block is hidden entirely while its text
     is still a TODO value.                                    */
  const briefTxt = cleanValue(data.brief);
  if (briefTxt) {
    const bw = section('01 — BRIEF', null, 'BRIEF');
    const p = el('p', 'measure fade', briefTxt);
    p.style.cssText = 'max-width:62ch;';
    bw.appendChild(p);
  }

  /* ---- 3 — 02 CONCEPT: numbered block; each TODO paragraph
     is hidden on its own; the block stays if diagrams exist.  */
  const paras = ((data.concept && data.concept.paragraphs) || [])
    .map(cleanValue).filter(Boolean);
  const diags = ((data.concept && data.concept.diagrams) || [])
    .filter(d => d && d.src);
  if (paras.length || diags.length) {
    const cw = section('02 — CONCEPT', 'Concept', 'CONCEPT');
    paras.forEach((t, i) => {
      const p = el('p', 'measure fade', t);
      p.style.cssText = 'max-width:62ch;' + (i ? 'margin-top:14px;' : 'margin-top:8px;');
      cw.appendChild(p);
    });
    if (diags.length) {
      const dg = el('div', 'two-col fade');
      dg.style.marginTop = '40px';
      diags.forEach((d, i) =>
        dg.appendChild(figure(d.src, d.alt, d.caption,
          { code: 'SK-0' + (i + 1), note: cleanValue(d.scale) })));
      cw.appendChild(dg);
    }
  }

  /* ---- 4 — DRAWINGS: plan → section → elevation flow.
     If all drawings are TODO (files absent), show a single
     dignified placeholder instead of a grid of error blocks.   */
  const dw = section('DRAWINGS · PLAN → SECTION → ELEVATION', 'Drawings', 'DRAWINGS');
  const hasDrawings = data.drawings && data.drawings.some(d => d.src);
  if (!hasDrawings) {
    /* Graceful empty state: one quiet note instead of N error blocks */
    const dwEmpty = el('p', 'drawings-pending fade',
      'Technical drawings will appear here once the files are placed in ' +
      'images/' + data.slug + '/drawings/');
    dwEmpty.style.cssText = 'margin-top:16px;color:var(--grey);font-size:14px;';
    dw.appendChild(dwEmpty);
  } else {
    const drg = el('div', 'two-col fade');
    drg.style.marginTop = '8px';
    data.drawings.forEach((d, i) =>
      drg.appendChild(figure(d.src, d.alt,
        cleanValue(d.caption) || d.label || '',
        { code: 'D-0' + (i + 1), note: cleanValue(d.scale) })));
    dw.appendChild(drg);
  }

  /* ---- 5 — GALLERY: render RHYTHM — first big, then pairs,
     last big (any count works). Click opens the lightbox.  ---- */
  const gw = section('RENDERS', 'Renders', 'RENDERS');
  const grid = el('div', 'gallery rhythm fade');
  data.gallery.forEach((g, i) =>
    grid.appendChild(figure(g.src, g.alt, g.caption,
      { code: 'R-0' + (i + 1), note: cleanValue(g.scale) })));
  gw.appendChild(grid);

  /* ---- 6 — CLOSING image + next/back links ----------------- */
  /* The links are built from projects/index.json, not from the
     project's own JSON, so they stay correct for every project.   */
  const lw = section('END', null, 'END');
  lw.appendChild(figure(data.closing.src, data.closing.alt,
    data.closing.caption, { code: 'E-01', note: cleanValue(data.closing.scale) }));

  const where = ixProjects.findIndex(p => p.slug === slug);
  const nextEntry = ixProjects[where + 1];           // undefined at the end

  /* Title block strip (Direction A): project name + its register sheet
     code, both straight from index.json so new projects come free.
     A TODO title falls back to the slug — the TODO text never shows.  */
  const thisEntry = ixProjects.find(p => p.slug === slug);
  const tbName = doc.getElementById('tb-name');
  const tbCode = doc.getElementById('tb-code');
  if (tbName && thisEntry) tbName.textContent = cleanValue(thisEntry.title) || slug;
  if (tbCode && thisEntry && thisEntry.sheet) {
    tbCode.textContent = 'SHEET ' + thisEntry.sheet;
  }

  /* Signature interaction (Direction A): as you scroll, the sheet code
     in the strip shows which part of the sheet is being read —
     SHEET A-01 · BRIEF, · DRAWINGS, ... One IntersectionObserver,
     one text swap each time, no animation, no libraries. The update
     is instant text, so reduced-motion visitors lose nothing.       */
  if (tbCode && 'IntersectionObserver' in window) {
    const base = tbCode.textContent;                  // "SHEET A-01"
    const parts = root.querySelectorAll('section[data-part]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          tbCode.textContent = base + ' · ' + en.target.dataset.part;
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });          // watches the middle band
    parts.forEach(s => io.observe(s));
  }

  /* Open Graph (Direction A extra): share-link title/description/image
     straight from the project JSON, so future projects are covered.  */
  function setOG(prop, val) {
    let m = doc.head.querySelector('meta[property="' + prop + '"]');
    if (!m) {
      m = doc.createElement('meta');
      m.setAttribute('property', prop);
      doc.head.appendChild(m);
    }
    m.setAttribute('content', val);
  }
  setOG('og:title', (name || slug) + ' — Mohammed Huzefa');
  if (data.hero && data.hero.lead) setOG('og:description', data.hero.lead);
  if (data.hero && data.hero.src) {
    /* absolute URL, built from wherever the site is hosted */
    setOG('og:image', new URL(data.hero.src, location.href).href);
  }

  /* Direction A closing navigation: back link to the register. */
  const navRow = el('div', 'proj-nav-row fade');
  const back = el('a', 'cover-link', '← Back to register');
  back.href = 'projects.html';
  navRow.appendChild(back);
  lw.appendChild(navRow);

  /* next-project teaser card: thumbnail + name straight from
     index.json; hidden entirely on the last (or only) project.  */
  if (nextEntry) {
    const teaser = el('a', 'proj-next fade');
    teaser.href = 'project.html?p=' + encodeURIComponent(nextEntry.slug);
    const media = el('div', 'proj-next-media');
    if (nextEntry.thumbnail) {
      const img = doc.createElement('img');
      img.src = nextEntry.thumbnail;
      img.alt = '';                 /* the text block names it */
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.width = 1920; img.height = 2880;  /* stand-in ratio; CSS crops */
      img.addEventListener('error', () => img.replaceWith(elHTML('div', 'ph',
        '<span>IMAGE TODO:<br><span>' + nextEntry.thumbnail + '</span></span>')));
      media.appendChild(img);
    } else {
      media.appendChild(elHTML('div', 'ph', '<span>IMAGE TODO</span>'));
    }
    teaser.appendChild(media);
    const txt = el('div', 'proj-next-text');
    txt.appendChild(el('p', 'label', 'NEXT PROJECT'));
    txt.appendChild(el('p', 'proj-next-name',
      cleanValue(nextEntry.title) || nextEntry.slug));
    if (nextEntry.sheet) {
      txt.appendChild(el('span', 'reg-code', 'SHEET ' + nextEntry.sheet));
    }
    teaser.appendChild(txt);
    lw.appendChild(teaser);
  }
}

/* ============================================================
   PROJECTS INDEX (projects.html) — DIRECTION A DRAWING REGISTER
   Compact table rows: SHEET | TITLE | TYPE | YEAR | THUMB
   Built from projects/index.json. The whole row is a link.
   On mobile: type/year columns hide; they appear as a sub-line
   under the title. Thumbnail shrinks. Register header has a
   back link to the entrance (index.html).
============================================================ */
if (indexRoot) {
  document.title = 'Projects — Mohammed Huzefa';
  fetch('projects/index.json')
    .then(r => {
      if (!r.ok) throw new Error('not-found');
      return r.json();
    })
    .then(ix => {
      indexRoot.innerHTML = '';
      const w = document.createElement('div');
      w.className = 'wrap';

      /* ---- Register header: eyebrow label + h2 + entrance back-link ---- */
      const hdr = document.createElement('div');
      hdr.className = 'reg-header';
      const hdrLeft = document.createElement('div');
      hdrLeft.appendChild(Object.assign(document.createElement('p'),
        { className: 'label', textContent: 'DRAWING REGISTER' }));
      hdrLeft.appendChild(Object.assign(document.createElement('h2'),
        { className: 'index-title', textContent: 'All projects' }));
      const hdrRight = document.createElement('div');
      hdrRight.className = 'reg-header-right';
      const entranceLink = document.createElement('a');
      entranceLink.href = 'index.html';
      entranceLink.className = 'cover-link';
      entranceLink.textContent = '← Entrance';
      entranceLink.title = 'Back to the entrance';
      hdrRight.appendChild(entranceLink);
      hdr.appendChild(hdrLeft);
      hdr.appendChild(hdrRight);
      w.appendChild(hdr);

      const projects = ix.projects || [];

      /* Graceful empty state */
      if (projects.length === 0) {
        w.appendChild(Object.assign(document.createElement('p'),
          { className: 'reg-empty',
            textContent: 'No projects are registered yet.' }));
      } else {
        /* ---- Dominant featured project (editorial register) ----
           The entry with "featured": true in index.json, otherwise
           the first one. Full-viewport image, big number, name in
           caps, facts row (Location · Year · Program from that
           project's own JSON — TODO values stay hidden) and one
           "View project" link. Other projects follow as a quiet
           numbered list.                                            */
        const featured = projects.find(p => p.featured === true) || projects[0];
        const featNum = projects.indexOf(featured) + 1;

        const feat = document.createElement('article');
        feat.className = 'proj-featured';

        const media = document.createElement('a');
        media.className = 'feat-media';   // no reveal: first-screen media must simply show
        media.href = 'project.html?p=' + encodeURIComponent(featured.slug);

        /* an IMAGE TODO block for a blank entry, written by hand */
        function todoBlock(src) {
          return Object.assign(document.createElement('div'),
            { className: 'ph',
              innerHTML: '<span>IMAGE TODO' +
                (src ? ':<br><span>' + src + '</span>' : '') + '</span>' });
        }

        if (featured.thumbnail) {
          const img = document.createElement('img');
          img.src = featured.thumbnail;
          img.alt = '';            /* decorative: the caption names it */
          img.setAttribute('fetchpriority', 'high');  /* dominant image */
          img.setAttribute('decoding', 'async');
          /* provisional canvas ratio (3:2, the real renders' default);
             CSS sets the real layout, these two kill the jump. When a
             stand-in swaps in below, its own stored w/h replaces them */
          img.width = 1920; img.height = 1280;
          /* missing file -> stock stand-in (tagged) -> TODO block */
          img.addEventListener('error', function onErr() {
            img.removeEventListener('error', onErr);
            const std = PLACEHOLDERS[featured.thumbnail];
            if (!std) { img.replaceWith(todoBlock(featured.thumbnail)); return; }
            img.src = std.file;
            img.width = std.w; img.height = std.h;
            /* if the stand-in file is missing too, fall back */
            img.addEventListener('error', () =>
              img.replaceWith(todoBlock(featured.thumbnail)));
          });
          media.appendChild(img);
        } else {
          media.appendChild(todoBlock(''));
        }
        feat.appendChild(media);

        /* caption block on paper, under the image */
        const cap = document.createElement('div');
        cap.className = 'feat-cap wrap fade';
        cap.dataset.index = String(featNum);

        /* number + sheet code on one hairline-separated row */
        const top = document.createElement('div');
        top.className = 'feat-top';
        top.appendChild(Object.assign(document.createElement('span'),
          { className: 'feat-num',
            textContent: String(featNum).padStart(2, '0') }));
        if (featured.sheet) {
          top.appendChild(Object.assign(document.createElement('span'),
            { className: 'reg-code', textContent: 'SHEET ' + featured.sheet }));
        }
        cap.appendChild(top);

        /* name in caps — TODO never renders, skip the line then */
        const name = cleanValue(featured.title);
        if (name) {
          cap.appendChild(Object.assign(document.createElement('h2'),
            { className: 'feat-title', textContent: name }));
        }

        /* category · type under the name (same TODO rule)        */
        const kind = [featured.category, featured.type]
          .map(cleanValue).filter(Boolean).join(' · ');
        if (kind) {
          cap.appendChild(Object.assign(document.createElement('p'),
            { className: 'feat-type', textContent: kind }));
        }

        /* facts row: Location · Year · Program, read from the
           project's OWN json (not index.json) and hidden while
           TODO. The row fills quietly when the file arrives.    */
        cap.appendChild(Object.assign(document.createElement('dl'),
          { className: 'feat-facts' }));
        fetch('projects/' + encodeURIComponent(featured.slug) + '.json')
          .then(r => r.ok ? r.json() : null)
          .then(pj => {
            const dl = cap.querySelector('.feat-facts');
            if (!pj || !Array.isArray(pj.meta) || !dl) return;
            ['Location', 'Year', 'Program'].forEach(key => {
              const m = pj.meta.find(x => x && x.key === key);
              const v = m ? cleanValue(m.value) : '';
              if (!v) return;             /* TODO or absent -> hidden */
              const line = document.createElement('div');
              line.appendChild(Object.assign(document.createElement('dt'),
                { textContent: key }));
              line.appendChild(Object.assign(document.createElement('dd'),
                { textContent: v }));
              dl.appendChild(line);
            });
          })
          .catch(() => { /* no json -> the facts row stays empty */ });

        const link = document.createElement('a');
        link.className = 'cover-link';
        link.href = media.href;
        link.textContent = 'View project →';
        cap.appendChild(link);

        feat.appendChild(cap);
        w.appendChild(feat);

        /* ---- quiet numbered list of the remaining projects ----
           With a single project nothing extra is rendered here.  */
        projects.forEach((p, n0) => {
          const n = n0 + 1;
          if (p === featured) return;
          if (!w.querySelector('.reg-list')) {
            const list = document.createElement('div');
            list.className = 'reg-list wrap';
            list.setAttribute('role', 'list');
            w.appendChild(list);
          }
          const row = document.createElement('a');
          row.className = 'reg-mini fade';
          row.href = 'project.html?p=' + encodeURIComponent(p.slug);
          row.setAttribute('role', 'listitem');
          row.dataset.index = String(n);
          row.appendChild(Object.assign(document.createElement('span'),
            { className: 'reg-mini-num',
              textContent: String(n).padStart(2, '0') }));
          const miniName = cleanValue(p.title);
          if (miniName) {
            row.appendChild(Object.assign(document.createElement('span'),
              { className: 'reg-mini-title', textContent: miniName }));
          }
          const miniType = cleanValue(p.type);
          if (miniType) {
            row.appendChild(Object.assign(document.createElement('span'),
              { className: 'reg-mini-type', textContent: miniType }));
          }
          const miniYear = cleanValue(p.year);
          if (miniYear) {
            row.appendChild(Object.assign(document.createElement('span'),
              { className: 'reg-mini-year', textContent: miniYear }));
          }
          row.appendChild(Object.assign(document.createElement('span'),
            { className: 'reg-code', textContent: p.sheet || '' }));
          w.querySelector('.reg-list').appendChild(row);
        });
      }

      indexRoot.appendChild(w);
      initFades(document);

      /* Sheet counter "1 / N" — follows the numbers of the featured
         caption block and the quiet list rows                     */
      if (projects.length > 0) {
        const counter = document.createElement('div');
        counter.className = 'proj-counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');
        counter.textContent = '1 / ' + projects.length;
        document.body.appendChild(counter);

        if ('IntersectionObserver' in window) {
          const marks = indexRoot.querySelectorAll('[data-index]');
          const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
              if (en.isIntersecting) {
                counter.textContent =
                  en.target.dataset.index + ' / ' + projects.length;
              }
            });
          }, { rootMargin: '-40% 0px -50% 0px' });
          marks.forEach(r => io.observe(r));
        }
      }
    })
    .catch(err => {
      indexRoot.innerHTML =
        '<section class="section"><div class="wrap"><p style="padding:48px">' +
        'Could not load projects/index.json (' + err.message + ').' +
        ' Run a small local server — see README.md for how.' +
        '</p></div></section>';
    });
}

/* ============================================================
   LIGHTBOX — upgraded (door task step 6). Still ONE lightbox,
   same initLightbox call, gallery untouched. On top of open /
   close / arrow keys it now adds: zoom (wheel, + / - / 0 keys,
   double click / tap, pinch), pan by drag, a fullscreen button,
   visible prev / next buttons, swipe, Esc, focus kept inside,
   and the old "3 / 8 — caption" counter line. No libraries.
============================================================ */
function initLightbox(doc) {
  const box = doc.createElement('div');
  box.className = 'lightbox';
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&#215;</button>' +
    '<button class="lightbox-fs" aria-label="Toggle full screen">FULL</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8592;</button>' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next image">&#8594;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  doc.body.appendChild(box);

  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  const closeBtn = box.querySelector('.lightbox-close');
  const fsBtn = box.querySelector('.lightbox-fs');
  const prevBtn = box.querySelector('.lightbox-prev');
  const nextBtn = box.querySelector('.lightbox-next');
  const figs = Array.from(doc.querySelectorAll('.gallery figure'));
  let idx = -1;                      // which gallery image is open
  let lastFocus = null;              // element to return focus to on close

  /* ---- zoom + pan state: z = scale (1 .. 8), x/y = pan offsets ---- */
  const Z_MAX = 8;
  let z = 1, x = 0, y = 0;

  function apply() {
    img.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + z + ')';
    img.classList.toggle('lb-zoomed', z > 1);   // grab cursor when zoomable
  }
  function reset() { z = 1; x = 0; y = 0; apply(); }

  /* zoom while keeping the point under the cursor (or the pinch
     midpoint) fixed; the visual centre = layout centre + pan      */
  function zoomAt(factor, cx, cy) {
    const rect = img.getBoundingClientRect();
    const lx = rect.left + rect.width / 2 - x;
    const ly = rect.top + rect.height / 2 - y;
    const dz = Math.min(Z_MAX, Math.max(1, z * factor)) / z;
    x = cx - lx - dz * ((cx - lx) - x);
    y = cy - ly - dz * ((cy - ly) - y);
    z *= dz;
    if (z <= 1.001) { x = 0; y = 0; z = 1; }   // never below 100%
    apply();
  }
  function zoomAtCentre(f) { zoomAt(f, window.innerWidth / 2, window.innerHeight / 2); }

  /* screen-reader/keyboard contract (audit fix): a full-screen dialog
      announces itself and hands focus in and out                    */
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Large image view');
  /* Tab cycles the four visible buttons: focus never escapes */
  box.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const order = [closeBtn, fsBtn, prevBtn, nextBtn];
    const i = order.indexOf(doc.activeElement);
    e.preventDefault();
    const n = e.shiftKey
      ? (i <= 0 ? order.length - 1 : i - 1)
      : (i < 0 || i === order.length - 1 ? 0 : i + 1);
    order[n].focus();
  });

  function show() {
    const f = figs[idx];
    if (!f) return;
    const im = f.querySelector('img');   // re-read: placeholders may have swapped in
    if (!im) return;
    reset();                             // every image opens at 100 %
    img.src = im.currentSrc || im.src;
    img.alt = im.alt || '';
    /* Direction A captions live in .cap-row spans (code | title |
       note), never in a figcaption - read those instead; the plain
       figcaption stays as a fallback (audit fix: the old figcaption
       lookup found nothing, so captions only showed "3 / 8 — ")   */
    const row = f.querySelector('.cap-row');
    const fallback = f.querySelector('figcaption');
    const text = row
      ? Array.from(row.querySelectorAll('.cap-code, .cap-title, .cap-note'))
          .map(n => n.textContent).filter(Boolean).join(' ')
      : (fallback ? fallback.textContent : '');
    const where = figs.length > 1 ? (idx + 1) + ' / ' + figs.length + ' — ' : '';
    cap.textContent = where + text;
    prevBtn.disabled = idx <= 0;             // visible buttons, off at the ends
    nextBtn.disabled = idx >= figs.length - 1;
    box.classList.add('is-open');
  }
  function openAt(i) {
    lastFocus = doc.activeElement;   // remember the thumbnail that opened it
    idx = i;
    show();
    closeBtn.focus();                // keyboard users land inside the dialog
  }
  function close() {
    box.classList.remove('is-open');
    box.style.opacity = '0';
    img.removeAttribute('src');      // (src = '' would re-request the page)
    reset();
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  function step(d) {
    const n = Math.min(figs.length - 1, Math.max(0, idx + d));
    if (n !== idx) { idx = n; show(); }
  }

  /* backdrop click closes; the image itself now belongs to zoom
     (double click) and pan, so clicking it no longer closes       */
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  doc.addEventListener('keydown', e => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === '+' || e.key === '=') zoomAtCentre(1.25);
    if (e.key === '-' || e.key === '_') zoomAtCentre(0.8);
    if (e.key === '0') reset();
  });

  /* wheel = zoom at the cursor; double click / tap = in or out */
  img.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.25 : 0.8, e.clientX, e.clientY);
  });
  img.addEventListener('dblclick', function (e) {
    zoomAt(z > 1 ? 1 / z : 2.5 / z, e.clientX, e.clientY);
  });

  /* ---- pointer drag: pan when zoomed in, swipe at 100 %,
          two fingers = pinch zoom at their midpoint ---- */
  const pointers = new Map();
  let pinch = null, swipe = null;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  img.addEventListener('pointerdown', function (e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      pinch = { d: dist(pts[0], pts[1]) };
    } else if (pointers.size === 1) {
      swipe = { x: 0, y: 0 };
    }
    img.setPointerCapture(e.pointerId);
  });
  img.addEventListener('pointermove', function (e) {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinch) {
      const pts = Array.from(pointers.values());
      const d = dist(pts[0], pts[1]);
      zoomAt(d / pinch.d, (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      pinch.d = d;
    } else if (z > 1) {
      x += dx; y += dy;                   // pan (drag must not lag)
      img.style.transition = 'none';
      apply();
    } else if (swipe) {
      swipe.x += dx; swipe.y += dy;       // decided on release
    }
  });
  function pointerEnd(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    img.style.transition = '';            // fall back to the CSS easing
    if (swipe && z <= 1 && Math.abs(swipe.x) > 50 && Math.abs(swipe.x) > Math.abs(swipe.y)) {
      step(swipe.x < 0 ? 1 : -1);         // swipe left -> next, right -> previous
    }
    swipe = null;
  }
  img.addEventListener('pointerup', pointerEnd);
  img.addEventListener('pointercancel', pointerEnd);

  /* fullscreen toggle; the label flips with it */
  fsBtn.addEventListener('click', function () {
    if (doc.fullscreenElement) doc.exitFullscreen();
    else box.requestFullscreen();
  });
  doc.addEventListener('fullscreenchange', function () {
    fsBtn.textContent = doc.fullscreenElement ? 'EXIT' : 'FULL';
  });

  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  /* every gallery figure is clickable AND keyboard-operable
     (tab to a thumbnail, press Enter/Space); the fixture list keeps
     its position, so ←/→ know where they are                       */
  figs.forEach((fig, i) => {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    const openOr = () => {
      if (!fig.querySelector('img')) return;    // still an IMAGE TODO block
      openAt(i);
    };
    fig.addEventListener('click', openOr);
    fig.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOr(); }
    });
  });
}

/* ============================================================
   ABOUT PAGE (about.html) — content comes from projects/about.json
   Compact layout: intro, looking for, education, skills,
   study year-by-year list, contact details, portfolio PDF.
   Any value still marked TODO is hidden, not shown.
============================================================ */
const aboutRoot = document.getElementById('about-root');
if (aboutRoot) {
  document.title = 'About — Mohammed Huzefa';
  fetch('projects/about.json')
    .then(r => {
      if (!r.ok) throw new Error('not-found');
      return r.json();
    })
    .then(d => {
      aboutRoot.innerHTML = '';
      const main = document.createElement('div');
      main.className = 'wrap about-layout';

      /* little local helpers (same ideas as the project page) */
      const el = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
      };
      const sec = (label) => {
        const s = el('section', 'section section-tight fade');
        s.appendChild(el('p', 'label', label));
        main.appendChild(s);
        return s;
      };
      /* a value is "still a TODO" -> its line is hidden entirely */
      const isTodo = (v) => !v || String(v).trim().split('=')[0].toUpperCase().startsWith('TODO');

      /* header + intro paragraphs */
      const h = el('h1', 'page-title', 'About');
      main.appendChild(h);
      d.intro.forEach(t => main.appendChild(el('p', 'measure about-intro', t)));
      const introRule = el('div', 'dim-line');
      introRule.style.marginTop = '28px';
      main.insertBefore(introRule, main.children[main.children.length - d.intro.length]);

      /* looking for — its own short section */
      sec('LOOKING FOR').appendChild(el('p', 'measure', d.looking_for));

      /* education */
      const edu = sec('EDUCATION');
      d.education.forEach(t => edu.appendChild(el('p', 'measure', t)));

      /* skills: one compact line, comma separated */
      const sk = sec('SKILLS');
      const skp = el('p', 'measure', d.skills.join('  ·  '));
      skp.style.color = 'var(--ink)';
      sk.appendChild(skp);

      /* study and projects: small stage label on the left, items right */
      const sp = sec('STUDY AND PROJECTS');
      d.study_and_projects.forEach(row => {
        const line = el('div', 'stage-row');
        line.appendChild(el('p', 'label stage-label', row.stage));
        const items = el('ul', 'stage-items');
        row.items.forEach(t => {
          const li = document.createElement('li');
          /* the library item links straight into the project page */
          if (t.startsWith('Public library proposal')) {
            const a = document.createElement('a');
            a.href = 'project.html?p=library';
            a.textContent = t;
            li.appendChild(a);
          } else {
            li.textContent = t;
          }
          items.appendChild(li);
        });
        line.appendChild(items);
        sp.appendChild(line);
      });

      /* contact details: only the lines that are filled in */
      const ct = sec('CONTACT');
      ct.id = 'contact';   // door.html hall links to about.html#contact
      const rows = [
        ['EMAIL', d.contact.email, 'mailto:data'],
        ['PHONE', d.contact.phone, null],
        ['CITY', d.contact.city, null],
        ['LINKEDIN', d.contact.linkedin, null],
      ];
      rows.forEach(([key, val]) => {
        if (isTodo(val)) return;                 // TODO -> hide the line
        const line = el('div', 'stage-row');
        line.appendChild(el('p', 'label stage-label', key));
        line.appendChild(el('p', 'stage-items', val));
        ct.appendChild(line);
      });

      /* portfolio PDF link, only once the url is real */
      if (!isTodo(d.pdf_url)) {
        const a = el('a', 'cover-link', 'Portfolio PDF');
        a.href = d.pdf_url;
        main.appendChild(a);
      }

      /* ---------- CREDITS (id=credits, footer links point here) ----------
         Page backgrounds are decorative stock photos, never Mohammed's
         work. Every SELECTED background is listed: photographer, source,
         license - straight out of backgrounds-config.js ("credits" block),
         so swapping a background updates the list with zero code changes.
         If backgrounds-config.js is missing, the section drops away. */
      const cr = sec('CREDITS');
      cr.id = 'credits';
      cr.appendChild(el('p', 'measure',
        'Background images are decorative stock photography, not my work. ' +
        'All drawings and renders are my own.'));
      const bg = window.BG_CONFIG;   /* loaded by backgrounds-config.js */
      if (!bg || !bg.credits || !bg.slots) {
        cr.remove();
      } else {
        Object.keys(bg.slots).forEach(slot => {
          const name = bg.slots[slot].selected;      // the file actually used
          const c = bg.credits[name];
          if (!c) return;                            // unknown file: not shown
          const line = el('div', 'stage-row');
          line.appendChild(el('p', 'label stage-label', slot));
          const p = el('p', 'stage-items');
          p.appendChild(el('span', '', c.author + ', ' + c.license + ' — '));
          const a = document.createElement('a');
          a.href = c.source;
          a.textContent = 'photo page';
          p.appendChild(a);
          const l = document.createElement('a');
          l.href = c.licenseUrl || c.source;
          l.textContent = c.license;
          p.appendChild(el('span', '', ' · '));
          p.appendChild(l);
          line.appendChild(p);
          cr.appendChild(line);
        });
      }

      aboutRoot.appendChild(main);
      initFades(document);

      /* Title block strip (Direction A): About's sheet code is ALWAYS the
         sheet after the last project in the register (1 project -> A-02).
         Loading index.json failing is harmless: the default text stays.  */
      fetch('projects/index.json')
        .then(r => (r.ok ? r.json() : { projects: [] }))
        .then(ix => {
          const n = (ix.projects || []).length;
          const code = document.getElementById('tb-code');
          if (code) code.textContent =
            'SHEET A-' + String(n + 1).padStart(2, '0') + ' · ABOUT';
        })
        .catch(() => { /* keep the default code */ });
    })
    .catch(err => {
      aboutRoot.innerHTML =
        '<div class="wrap"><p style="padding:48px">Could not load ' +
        'projects/about.json (' + err.message + '). Run a small ' +
        'local server — see README.md for how.</p></div>';
    });
}
/* ============================================================
   GENTLE FADE-IN + WIPE-REVEAL on scroll — the allowed motion
   (PROJECT.md section 5). One IntersectionObserver adds .is-in
   to fading (.fade) and wiping (.reveal) elements. Off when
   the visitor prefers reduced motion (handled in styles.css).
============================================================ */
function initFades(doc) {
  const els = doc.querySelectorAll('.fade, .reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0 });  /* 0, not 0.12: .reveal is clipped to a 2% sliver
     at start, so its intersection ratio can never exceed 0.02 — any
     positive overlap must be enough. Was the blank-media bug part 2. */
  els.forEach(e => {
    /* already scrolled past (above the viewport) on load: IO will
       never fire for them, so start them visible now          */
    if (e.getBoundingClientRect().bottom < 0) {
      e.classList.add('is-in');
      io.unobserve(e);
    } else {
      io.observe(e);
    }
  });
  /* safety net: some browsers under-report tiny/clipped areas, so
     after 1500 ms force .is-in on anything still hidden that is
     in the viewport or above it — media must never stay blank  */
  setTimeout(() => {
    els.forEach(e => {
      if (e.classList.contains('is-in')) return;
      const r = e.getBoundingClientRect();
      if (r.top <= window.innerHeight) {
        e.classList.add('is-in');
        io.unobserve(e);
      }
    });
  }, 1500);
}

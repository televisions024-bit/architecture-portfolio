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
  doc.title = data.title + ' — Mohammed Huzefa';

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

  /* TEMPORARY stand-in photos: if a real render file is missing, show a
     free-license stock photo instead of the IMAGE TODO block, with a
     warning tag on the image and a photo credit on the caption row.
     If the real render exists, the stand-in is never used.
     Full credits live in images/PLACEHOLDERS.md.
     When all real renders exist, delete this map + the check script.  */
  const PLACEHOLDERS = {
    'images/library/renders/01-hero-exterior.webp':
      { file: 'images/placeholders/placeholder-01-hero.webp',
        credit: 'Galla_ph, Pexels' },
    'images/library/renders/02-entrance-approach.webp':
      { file: 'images/placeholders/placeholder-02-entrance.webp',
        credit: 'Agung Pandit Wiguna, Pexels' },
    'images/library/renders/03-reading-room.webp':
      { file: 'images/placeholders/placeholder-03-reading-room.webp',
        credit: 'Polina Zimmerman, Pexels' },
    'images/library/renders/06-dusk-view.webp':
      { file: 'images/placeholders/placeholder-04-dusk.webp',
        credit: 'iramezatil, Pexels' },
    'images/library/renders/07-detail.webp':
      { file: 'images/placeholders/placeholder-05-detail.webp',
        credit: 'Ricky Esquivel, Pexels' }
  };

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

    const ph = elHTML('div', 'ph',
      '<span>IMAGE TODO:<br><span>' + src + '</span></span>');
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);   // fire once: real -> stand-in -> TODO
      const std = PLACEHOLDERS[src];
      if (!std) { img.replaceWith(ph); return; }

      /* stand-in: swap the file in and mark it clearly */
      img.src = std.file;
      const fig = img.parentElement;             // the hero/gallery figure
      if (fig) {
        fig.classList.add('has-ph');             // gives the tag a positioning anchor
        fig.appendChild(el('span', 'ph-tag', 'PLACEHOLDER - NOT MY WORK'));
      }
      const credit = el('span', 'cap-note', 'Photo: ' + std.credit);
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
     cap = { code: 'D-01', note: 'PLAN — LEVEL 01' } or omitted.
     Every drawing is captioned (PROJECT.md section 6, section 4). */
  function figure(src, alt, caption, cap) {
    const f = el('figure', 'fade');
    /* the caption row is built first so image() can append a photo
       credit to its end when a stand-in photo is used            */
    const row = (caption || cap) ? el('div', 'cap-row') : null;
    if (row) {
      if (cap && cap.code) row.appendChild(el('span', 'cap-code', cap.code));
      if (caption) row.appendChild(el('span', 'cap-title', caption));
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
  const hero = el('section', 'section');
  hero.dataset.part = 'TITLE';
  hero.style.paddingTop = '48px';
  const hw = el('div', 'wrap');
  hw.appendChild(el('div', 'dim-line'));   // hairline + ticks: the only decoration
  const t1 = el('h1', 'proj-title', data.title);
  t1.style.cssText =
    'font-family:var(--font-heading);font-weight:normal;' +
    'font-size:clamp(30px,4vw,46px);margin-bottom:6px;';
  hw.appendChild(t1);
  hw.appendChild(el('p', 'label', data.hero.lead));   // one-line description
  const heroFig = el('figure', 'fig-wide fade');
  heroFig.appendChild(image(data.hero.src, data.hero.alt, true));
  hw.appendChild(heroFig);
  hero.appendChild(hw);
  root.appendChild(hero);

  /* ---- 2 — BRIEF: metadata block + 2-3 short sentences ---- */
  const bw = section('BRIEF');
  const dl = el('dl', 'metadata fade');
  data.meta.forEach(m => {
    const row = el('div');
    row.appendChild(el('dt', '', m.key));
    row.appendChild(el('dd', '', m.value));
    dl.appendChild(row);
  });
  bw.appendChild(dl);
  const briefTxt = el('p', 'measure fade', data.brief);
  briefTxt.style.cssText = 'margin-top:32px;max-width:62ch;';
  bw.appendChild(briefTxt);

  /* ---- 3 — CONCEPT: short text + 1-2 diagrams ------------- */
  const cw = section('CONCEPT', 'Concept', 'CONCEPT');
  data.concept.paragraphs.forEach((t, i) => {
    const p = el('p', 'measure fade', t);
    p.style.cssText = 'max-width:62ch;' + (i ? 'margin-top:14px;' : 'margin-top:8px;');
    cw.appendChild(p);
  });
  if (data.concept.diagrams.length) {
    const dg = el('div', 'two-col fade');
    dg.style.marginTop = '40px';
    data.concept.diagrams.forEach((d, i) =>
      dg.appendChild(figure(d.src, d.alt, d.caption,
        { code: 'SK-0' + (i + 1), note: d.scale || '' })));
    cw.appendChild(dg);
  }

  /* ---- 4 — DRAWINGS: the plan -> section -> render flow.
     The JSON lists drawings in that order (plans first, then
     sections, then elevations); each gets a caption row.      */
  const dw = section('DRAWINGS · PLAN → SECTION → ELEVATION', 'Drawings', 'DRAWINGS');
  const drg = el('div', 'two-col fade');
  drg.style.marginTop = '8px';
  data.drawings.forEach((d, i) =>
    drg.appendChild(figure(d.src, d.alt, d.caption,
      { code: 'D-0' + (i + 1), note: d.label || '' })));
  dw.appendChild(drg);

  /* ---- 5 — GALLERY: 2-col grid, click opens the lightbox -- */
  const gw = section('RENDERS', 'Renders', 'RENDERS');
  const grid = el('div', 'gallery fade');
  data.gallery.forEach((g, i) =>
    grid.appendChild(figure(g.src, g.alt, g.caption,
      { code: 'R-0' + (i + 1), note: g.scale || '' })));
  gw.appendChild(grid);

  /* ---- 6 — CLOSING image + next/back links ----------------- */
  /* The links are built from projects/index.json, not from the
     project's own JSON, so they stay correct for every project.   */
  const lw = section('END', null, 'END');
  lw.appendChild(figure(data.closing.src, data.closing.alt,
    data.closing.caption, { code: 'E-01', note: data.closing.scale || '' }));

  const where = ixProjects.findIndex(p => p.slug === slug);
  const nextEntry = ixProjects[where + 1];           // undefined at the end

  /* Title block strip (Direction A): project name + its register sheet
     code, both straight from index.json so new projects come free.   */
  const thisEntry = ixProjects.find(p => p.slug === slug);
  const tbName = doc.getElementById('tb-name');
  const tbCode = doc.getElementById('tb-code');
  if (tbName && thisEntry) tbName.textContent = thisEntry.title;
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
  setOG('og:title', data.title + ' — Mohammed Huzefa');
  if (data.hero && data.hero.lead) setOG('og:description', data.hero.lead);
  if (data.hero && data.hero.src) {
    /* absolute URL, built from wherever the site is hosted */
    setOG('og:image', new URL(data.hero.src, location.href).href);
  }

  const back = el('a', 'cover-link fade', 'Back to all projects');
  back.href = 'projects.html';
  back.style.display = 'inline-block';
  back.style.marginTop = '32px';
  lw.appendChild(back);

  if (nextEntry) {                                   // hidden on the last project
    const next = el('a', 'cover-link fade', 'Next project');
    next.href = 'project.html?p=' + nextEntry.slug;
    next.style.display = 'inline-block';
    next.style.marginTop = '32px';
    next.style.marginLeft = '24px';
    lw.appendChild(next);
  }
}

/* ============================================================
   PROJECTS INDEX (projects.html) — a DRAWING REGISTER (Direction A):
   one thin row per project — sheet code | title | type | year | thumb
   — straight from projects/index.json. The whole row is the link;
   hover highlights it in burgundy. Stacks on the phone.
============================================================ ═*/
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

      w.appendChild(Object.assign(document.createElement('p'),
        { className: 'label', textContent: 'DRAWING REGISTER' }));
      w.appendChild(Object.assign(document.createElement('h2'),
        { className: 'index-title', textContent: 'All projects' }));

      const list = document.createElement('div');
      list.className = 'register';
      (ix.projects || []).forEach(p => {
        /* the whole row is one link, like a line in a sheet list */
        const row = document.createElement('a');
        row.className = 'reg-row fade';
        row.href = 'project.html?p=' + encodeURIComponent(p.slug);

        const code = document.createElement('span');
        code.className = 'reg-code';
        code.textContent = p.sheet || '—';        // drawing code, e.g. A-01
        row.appendChild(code);

        const title = document.createElement('h3');
        title.className = 'reg-title';
        title.textContent = p.title;
        row.appendChild(title);

        /* type + year: separate columns on desktop, one line on phone */
        const meta = document.createElement('span');
        meta.className = 'reg-meta';
        const type = document.createElement('span');
        type.className = 'reg-type';
        type.textContent = p.type || '—';
        const year = document.createElement('span');
        year.className = 'reg-year';
        year.textContent = p.year || '';
        meta.appendChild(type);
        meta.appendChild(year);
        row.appendChild(meta);

        /* small framed thumbnail; missing file -> IMAGE TODO block */
        const img = document.createElement('img');
        img.className = 'reg-thumb';
        img.src = p.thumbnail;
        img.alt = p.title + ' — thumbnail';
        img.setAttribute('loading', 'lazy');
        const ph = document.createElement('div');
        ph.className = 'ph';
        ph.innerHTML = '<span>THUMB TODO:<br><span>' + p.thumbnail + '</span></span>';
        img.addEventListener('error', () => img.replaceWith(ph));
        row.appendChild(img);

        list.appendChild(row);
      });
      w.appendChild(list);
      indexRoot.appendChild(w);
      initFades(document);
    })
    .catch(err => {
      indexRoot.innerHTML =
        '<section class="section"><div class="wrap"><p style="padding:48px">' +
        'Could not load projects/index.json (' + err.message + ').' +
        ' Run a small local server — see README.md for how.</p></div></section>';
    });
}

/* ============================================================
   LIGHTBOX — click a gallery image to open it big; click (or
   press Esc) to close; arrow keys ←/→ step through the images.
   A small "3 / 8" counter sits in front of the caption.
   One element, reused. No libraries.
============================================================ */
function initLightbox(doc) {
  const box = doc.createElement('div');
  box.className = 'lightbox';
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&#215;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  doc.body.appendChild(box);

  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  const closeBtn = box.querySelector('.lightbox-close');
  const figs = Array.from(doc.querySelectorAll('.gallery figure'));
  let idx = -1;                      // which gallery image is open
  let lastFocus = null;              // element to return focus to on close

  /* screen-reader/keyboard contract (audit fix): a full-screen dialog
     announces itself and hands focus in and out                    */
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Large image view');
  box.addEventListener('keydown', e => {
    if (e.key === 'Tab') e.preventDefault();   // one focusable inside: keep it
  });

  function show() {
    const f = figs[idx];
    if (!f) return;
    const im = f.querySelector('img');   // re-read: placeholders may have swapped in
    if (!im) return;
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
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }

  box.addEventListener('click', close);
  doc.addEventListener('keydown', e => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight' && idx < figs.length - 1) { idx++; show(); }
    if (e.key === 'ArrowLeft' && idx > 0) { idx--; show(); }
  });

  /* every gallery figure is clickable AND keyboard-operable now
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
      main.className = 'wrap';

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
      const h = el('h1', 'index-title', 'About');
      main.appendChild(h);
      d.intro.forEach(t => main.appendChild(el('p', 'measure', t)));

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
         license - straight out of backgrounds.json ("credits" block), so
         swapping a background updates the list with zero code changes.
         If backgrounds.json is missing, the section drops itself away. */
      const cr = sec('CREDITS');
      cr.id = 'credits';
      cr.appendChild(el('p', 'measure',
        'Background images are decorative stock photography, not my work. ' +
        'All drawings and renders are my own.'));
      fetch('backgrounds.json')
        .then(r => (r.ok ? r.json() : Promise.resolve(null)))
        .then(bg => {
          if (!bg || !bg.credits || !bg.slots) { cr.remove(); return; }
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
        })
        .catch(() => {                                 // no config: hide section
          cr.remove();
        });

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
   GENTLE FADE-IN on scroll — the only allowed motion
   (PROJECT.md section 5). Off when the visitor prefers
   reduced motion (handled in styles.css).
============================================================ */
function initFades(doc) {
  const els = doc.querySelectorAll('.fade');
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
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

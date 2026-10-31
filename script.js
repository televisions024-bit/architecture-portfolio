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

  /* an <img>, lazy-loaded; if the file does not exist yet, swap in
     a clean "IMAGE TODO" block showing the exact filename to drop in */
  function image(src, alt, eager) {
    if (!src) return elHTML('div', 'ph', '<span>IMAGE TODO</span>');

    const img = doc.createElement('img');
    img.src = src;
    img.alt = alt || '';
    if (!eager) img.setAttribute('loading', 'lazy'); // lazy-load everything but the hero

    const ph = elHTML('div', 'ph',
      '<span>IMAGE TODO:<br><span>' + src + '</span></span>');
    img.addEventListener('error', () => img.replaceWith(ph));
    return img;
  }

  /* one figure: image + optional small burgundy label + caption.
     Every drawing is captioned (PROJECT.md section 6, section 4).   */
  function figure(src, alt, label, caption, captionClass) {
    const f = el('figure', 'fade');
    if (src) f.appendChild(image(src, alt));
    if (label) f.appendChild(el('p', 'label', label));
    if (caption) {
      const c = el('figcaption', captionClass || 'figure-caption', caption);
      f.appendChild(c);
    }
    return f;
  }

  /* a section: thin rule feel, small label, big serif title  */
  function section(label, title) {
    const s = el('section', 'section');
    const w = el('div', 'wrap');
    if (label) w.appendChild(el('p', 'label', label));
    if (title) w.appendChild(el('h2', '', title));
    s.appendChild(w);
    root.appendChild(s);
    return w;
  }

  /* ---- 1 — HERO: full-width render + title + one-liner ---- */
  const hero = el('section', 'section');
  hero.style.paddingTop = '48px';
  const hw = el('div', 'wrap');
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
  const cw = section('CONCEPT', 'Concept');
  data.concept.paragraphs.forEach((t, i) => {
    const p = el('p', 'measure fade', t);
    p.style.cssText = 'max-width:62ch;' + (i ? 'margin-top:14px;' : 'margin-top:8px;');
    cw.appendChild(p);
  });
  if (data.concept.diagrams.length) {
    const dg = el('div', 'two-col fade');
    dg.style.marginTop = '40px';
    data.concept.diagrams.forEach(d =>
      dg.appendChild(figure(d.src, d.alt, null, d.caption)));
    cw.appendChild(dg);
  }

  /* ---- 4 — DRAWINGS: captioned black-line, two columns ---- */
  const dw = section('DRAWINGS', 'Drawings');
  const drg = el('div', 'two-col fade');
  drg.style.marginTop = '8px';
  data.drawings.forEach(d => drg.appendChild(figure(d.src, d.alt, d.label, d.caption)));
  dw.appendChild(drg);

  /* ---- 5 — GALLERY: 2-col grid, click opens the lightbox -- */
  const gw = section('RENDER GALLERY', 'Renders');
  const grid = el('div', 'gallery fade');
  data.gallery.forEach(g =>
    grid.appendChild(figure(g.src, g.alt, null, g.caption)));
  gw.appendChild(grid);

  /* ---- 6 — CLOSING image + next/back links ----------------- */
  /* The links are built from projects/index.json, not from the
     project's own JSON, so they stay correct for every project.   */
  const lw = section('END');
  lw.appendChild(figure(data.closing.src, data.closing.alt, null, data.closing.caption));

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
   PROJECTS INDEX (projects.html) — one clean card per project,
   from projects/index.json. 2-column grid, hairline borders,
   same design tokens as everything else.
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

      w.appendChild(Object.assign(document.createElement('p'),
        { className: 'label', textContent: 'PROJECTS' }));
      w.appendChild(Object.assign(document.createElement('h2'),
        { className: 'index-title', textContent: 'All projects' }));

      const grid = document.createElement('div');
      grid.className = 'cards';
      (ix.projects || []).forEach(p => {
        /* the whole card is one link; hairline border, no shadows */
        const card = document.createElement('a');
        card.className = 'card fade';
        card.href = 'project.html?p=' + encodeURIComponent(p.slug);

        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = p.thumbnail;
        img.alt = p.title + ' — thumbnail';
        img.setAttribute('loading', 'lazy');
        /* same IMAGE TODO block as the project page if the file is missing */
        const ph = document.createElement('div');
        ph.className = 'ph';
        ph.innerHTML = '<span>THUMBNAIL TODO:<br><span>' + p.thumbnail + '</span></span>';
        img.addEventListener('error', () => img.replaceWith(ph));
        fig.appendChild(img);
        card.appendChild(fig);

        const t = document.createElement('h3');
        t.className = 'card-title';
        t.textContent = p.title;
        card.appendChild(t);

        const meta = document.createElement('p');
        meta.className = 'card-meta';
        meta.textContent = (p.year || '') + (p.year && p.type ? ' — ' : '') + (p.type || '');
        card.appendChild(meta);

        grid.appendChild(card);
      });
      w.appendChild(grid);
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
   LIGHTBOX — click a gallery image to open it big; click
   anywhere (or press Esc) to close. One element, reused.
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

  function open(src, alt, caption) {
    img.src = src;
    img.alt = alt || '';
    cap.textContent = caption || '';
    box.classList.add('is-open');
  }
  function close() {
    box.classList.remove('is-open');
    img.src = '';                       // reset, frees memory
  }

  box.addEventListener('click', close);
  doc.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // every gallery figure is clickable (frames re-read the <img> so it
  // still works if placeholder blocks swap in later)
  doc.querySelectorAll('.gallery figure').forEach(fig => {
    fig.addEventListener('click', () => {
      const im = fig.querySelector('img');
      if (!im) return;
      const fc = fig.querySelector('figcaption');
      open(im.currentSrc || im.src, im.alt, fc ? fc.textContent : '');
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
            'SHEET A-' + String(n + 2).padStart(2, '0') + ' · ABOUT';
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

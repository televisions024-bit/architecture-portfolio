/* ============================================================
   script.js — the only JavaScript on the site. Two small jobs:
   1) On the project page: load content from projects/<name>.json
      and build the page from it (content is NOT hard-coded in HTML).
   2) The gallery lightbox: click image to open, click or Esc to close.
   Written simply on purpose. No libraries, no build step.
============================================================ */

/* The page tells us which JSON file to use via:
   <script src="script.js" data-project="library">
     -> projects/library.json                                     */
const projectName = document.querySelector('[data-project]')?.dataset.project;

/* ============================================================
   PROJECT PAGE — build the SIX sections from JSON
   (PROJECT.md section 6: hero, brief, concept, drawings,
   gallery with lightbox, closing image + next link)
============================================================ */
if (projectName) {
  fetch('projects/' + projectName + '.json')
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(data => {
      buildProjectPage(document, data);
      initLightbox(document);
      initFades(document);
    })
    .catch(err => {
      /* Beginner-friendly error: content does not load over
         file:// — easy local servers are explained in README.md  */
      const root = document.getElementById('project-root');
      if (root) root.innerHTML =
        '<p style="padding:48px">Could not load projects/' + projectName +
        '.json (' + err.message + '). Run a small local server and open ' +
        'this page through it — see README.md for how.</p>';
    });
}

/* Build the whole page from the data object ------------------ */
function buildProjectPage(doc, data) {
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

  /* ---- 6 — CLOSING image + next project / back to index --- */
  const lw = section('END');
  lw.appendChild(figure(data.closing.src, data.closing.alt, null, data.closing.caption));
  const next = el('a', 'cover-link fade', data.closing.next.label);
  next.href = data.closing.next.href;
  next.style.display = 'inline-block';
  next.style.marginTop = '32px';
  lw.appendChild(next);
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

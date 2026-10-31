/* ============================================================
   script.js — the only JavaScript on the site. Two small jobs:
   1) On the project page: load content from projects/<name>.json
      and build the page from it (content is NOT hard-coded in HTML).
   2) The gallery lightbox: click image to open, click or Esc to close.
   Written simply on purpose. No libraries, no build step.
============================================================ */

/* ---------- 1) Project page renderer ----------------------- */
/* The page tells us which JSON file to use via:
   <data-project="library"> on the <main> element, or a
   <script src="script.js" data-project="library"> tag.            */
const projectName =
  document.querySelector('main[data-project]')?.dataset.project ||
  document.querySelector('script[data-project]')?.dataset.project;

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
      /* Beginner-friendly error: content only loads over a real
         server (Live Server / python -m http.server), not file://  */
      const t = document.getElementById('project-root');
      if (t) t.innerHTML =
        '<p style="padding:40px 0">Could not load projects/' + projectName +
        '.json (' + err.message + '). If you opened this file directly ' +
        'by double-clicking, run a small local server instead - see README.md.</p>';
    });
}

/* ---------- 2) Lightbox (gallery) -------------------------- */
/* Call AFTER the page is rendered. Click a gallery image to open;
   click anywhere (or Esc) to close.                              */
function initLightbox(doc) {
  // One lightbox element, reused for every image.
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
    img.src = ''; // free memory
  }

  // Clicking any gallery image opens it big.
  box.addEventListener('click', close);
  doc.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  doc.querySelectorAll('.gallery figure').forEach(fig => {
    const im = fig.querySelector('img');
    const cap2 = fig.querySelector('figcaption');
    if (!im) return;
    fig.addEventListener('click', () =>
      open(im.currentSrc || im.src, im.alt, cap2 ? cap2.textContent : ''));
  });
}

/* ---------- 3) Gentle fade-in on scroll -------------------- */
/* The only motion allowed (PROJECT.md section 5). Off for people
   who prefer reduced motion (handled in styles.css).              */
function initFades(doc) {
  const els = doc.querySelectorAll('.fade');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
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
  els.forEach(el => io.observe(el));
}

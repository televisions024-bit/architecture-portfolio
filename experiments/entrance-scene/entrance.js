/* ============================================================
   entrance.js — logic for the standalone entrance experiment.
   No libraries. A beginner edits ONLY the CONFIG block below:
   - image path
   - the three destinations (href + region rect + mark position)
   All coordinates are PERCENT of the image, so they survive
   every resize and crop automatically.
   tip: open index.html?debug=1 to see region outlines + values.
   ============================================================ */
'use strict';

const CONFIG = {
  image: '../../assets/images/entrance-scene.webp',

  zoomMs: 1000,   // camera push duration (<= 1.1s)
  veilMs: 320,    // full-screen fade before the browser navigates

  destinations: [
    { id: 'projects', label: 'Projects',
      href: '../../projects.html',
      rect: { x: 10.9, y: 19.3, w: 18.2, h: 64.2 },   // opening 1 (left)
      mark: { x: 16.5, y: 59.2, s: 3.7, dx: -15 } },  // dot offset: image quirk — its dot sits left of the square centre
    { id: 'about', label: 'About',
      href: '../../about.html',
      rect: { x: 40.4, y: 19.3, w: 19.5, h: 64.2 },   // opening 2 (centre)
      mark: { x: 44.5, y: 59.3, s: 2.25 } },
    { id: 'contact', label: 'Contact',
      href: '../../about.html#contact',
      rect: { x: 71.0, y: 19.3, w: 18.5, h: 64.2 },   // opening 3 (right)
      mark: { x: 74.25, y: 59.4, s: 2.3 } }
  ]
};

/* ---------- element handles + small state ---------- */
const scene    = document.getElementById('es-scene');
const stageEl  = document.getElementById('es-stage');
const stageBox = document.getElementById('es-stagebox');
const camera   = document.getElementById('es-camera');
const veil     = document.getElementById('es-screen');
const navlist  = document.getElementById('es-navlist');
const regions  = Array.prototype.slice.call(scene.querySelectorAll('.es-region'));

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEBUG   = new URLSearchParams(location.search).has('debug');
if (DEBUG) document.body.classList.add('es-debug');

let aspect = [1672, 941];      // corrected from the real file once it loads
let busy = false;              // a zoom is running
let timers = [];               // pending steps of the running zoom

/* ---------- little helpers ---------- */
const rectCSS = function (r) {
  return 'left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;';
};
const clearTimers = function () { timers.forEach(clearTimeout); timers = []; };

/* ============================================================
   Positioning: regions from CONFIG; each region carries its own
   square-and-dot mark, positioned relative to the region.
   ============================================================ */
function positionRegions() {
  const stageW = stageBox.getBoundingClientRect().width;
  CONFIG.destinations.forEach(function (d) {
    const el = document.getElementById('es-rg-' + d.id);
    if (!el) return;                    // region was removed from the HTML
    el.style.cssText = rectCSS(d.rect);
    const mark = el.querySelector('.es-mark');
    if (mark) {
      /* region-relative % = (stage-% difference / region size) * 100 */
      mark.style.left = ((d.mark.x - d.rect.x) / d.rect.w * 100) + '%';
      mark.style.top = ((d.mark.y - d.rect.y) / d.rect.h * 100) + '%';
      mark.style.width = (d.mark.s / 100) * stageW + 'px';  // square via aspect-ratio
      if (d.mark.dx) mark.style.setProperty('--es-dotdx', d.mark.dx + '%');
    }
    if (DEBUG) {                        // exact values to copy back into CONFIG
      el.dataset.rect = 'x' + d.rect.x + ' y' + d.rect.y +
        ' w' + d.rect.w + ' h' + d.rect.h + ' / mark ' +
        d.mark.x + ',' + d.mark.y + ' s' + d.mark.s;
    }
  });
}

/* ============================================================
   Stage sizing. Desktop/tablet landscape: the box keeps the IMAGE
   aspect ratio and is sized to COVER the viewport (full-bleed).
   Phone portrait: CONTAIN — the whole composition stays visible
   as a strip, and large nav rows below carry navigation.
   ============================================================ */
const CONTAIN = window.matchMedia('(max-width: 640px), (orientation: portrait)');

function sizeStage() {
  const vw = window.innerWidth, vh = window.innerHeight;
  let w, h;
  if (CONTAIN.matches) {               // whole composition, never cropped
    w = vw;
    h = (vw * aspect[1]) / aspect[0];
    stageEl.style.height = h + 'px';   // the strip cell shrinks to the art
  } else {                             // cover: no letterboxing, no distortion
    w = Math.max(vw, (vh * aspect[0]) / aspect[1]);
    h = Math.max(vh, (vw * aspect[1]) / aspect[0]);
    stageEl.style.height = '100vh';    // back to the full-viewport cell
    stageEl.style.height = '100svh';
  }
  stageBox.style.width = w + 'px';
  stageBox.style.height = h + 'px';
  positionRegions();
}

/* ============================================================
   CLICK — camera-like push towards the chosen opening, then a
   full-screen fade, then navigation. Escape cancels mid-flight.
   Reduced motion: no push, a short fade only.
   ============================================================ */
function zoomTo(dest) {
  if (busy) return;
  busy = true;
  const r = dest.rect;
  const cx = (r.x + r.w / 2) / 100;          // opening centre, stage fractions
  const cy = (r.y + r.h / 2) / 100;
  const s = 0.8 / (r.w / 100);               // opening lands at ~80% of the view
  const tx = 0.5 - s * cx;
  const ty = 0.5 - s * cy;

  camera.style.transformOrigin = '0 0';
  camera.style.transition = REDUCED ? 'none'
    : 'transform ' + CONFIG.zoomMs + 'ms ease-in-out';
  camera.style.transform =
    'translate(' + (tx * 100) + '%, ' + (ty * 100) + '%) scale(' + s + ')';

  // after the push: end-frame veil, then let the browser navigate
  timers.push(setTimeout(function () {
    veil.classList.add('is-on');
    timers.push(setTimeout(function () { location.href = dest.href; },
      REDUCED ? 120 : CONFIG.veilMs + 60));
  }, REDUCED ? 0 : CONFIG.zoomMs));
}

/* Escape cancels a running zoom and goes back to the quiet hall */
window.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape' || !busy) return;
  clearTimers();
  busy = false;
  veil.classList.remove('is-on');
  if (!REDUCED) camera.style.transform = 'none';
});

/* ============================================================
   Wiring: click = zoom; disabled with pointer-events over each
   element (CSS handles hover/focus visuals). Mobile rows reuse
   the same CONFIG with a simple fade, no camera push.
   ============================================================ */
function wireRegions() {
  regions.forEach(function (el) {
    const dest = CONFIG.destinations.filter(function (d) {
      return d.id === el.dataset.dest;
    })[0];
    if (!dest) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();                 // we animate the move ourselves
      zoomTo(dest);
    });
  });

  CONFIG.destinations.forEach(function (d, i) {
    const a = document.createElement('a');
    a.className = 'es-row';
    a.href = d.href;
    const num = String(i + 1).padStart(2, '0');
    a.innerHTML =
      '<span>' + num + ' · ' + d.label + '</span>' +
      '<span class="es-num" aria-hidden="true">' + num + '</span>';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      screen.classList.add('is-on');
      setTimeout(function () { location.href = d.href; }, REDUCED ? 0 : CONFIG.veilMs);
    });
    navlist.appendChild(a);
  });
}

/* Image aspect is read from the file itself once it has decoded. */
window.addEventListener('load', function () {
  const img = document.querySelector('.es-img');
  if (img && img.naturalWidth) {
    aspect = [img.naturalWidth, img.naturalHeight];
    sizeStage();
  }
});

/* ---------- boot ---------- */
window.addEventListener('resize', sizeStage);
CONTAIN.addEventListener ? CONTAIN.addEventListener('change', sizeStage) : null;
sizeStage();
wireRegions();

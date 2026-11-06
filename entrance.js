/* ============================================================
   entrance.js — Architectural Entrance Scene Engine
   MOHAMMED HUZEFA — ARCHITECTURE PORTFOLIO (2024-27)
   Approach A: Warm Light Reveal Transition
   Vanilla JavaScript. Zero external dependencies.

   Coordinates are PERCENTAGES of the 16:9 architectural stage,
   ensuring pixel-accurate alignment across all display resolutions.
   Tip: append ?debug=1 to URL to view interactive region bounds.
   ============================================================ */

'use strict';

const CONFIG = {
  image: 'assets/images/entrance-scene.webp',
  expandMs: 650,  // Radial light bloom expansion duration (ms)
  veilMs: 280,    // End-frame #F5F3EF settle duration before navigation (ms)

  destinations: [
    {
      id: 'projects',
      num: '01',
      label: 'Projects',
      href: 'projects.html',
      rect: { x: 10.9, y: 19.3, w: 18.2, h: 64.2 },   // Opening 1 (left)
      mark: { x: 16.5, y: 59.2, s: 3.7, dx: -15 }     // Marker center & dot offset
    },
    {
      id: 'about',
      num: '02',
      label: 'About',
      href: 'about.html',
      rect: { x: 40.4, y: 19.3, w: 19.5, h: 64.2 },   // Opening 2 (center)
      mark: { x: 44.5, y: 59.3, s: 2.25 }
    },
    {
      id: 'contact',
      num: '03',
      label: 'Contact',
      href: 'about.html#contact',
      rect: { x: 71.0, y: 19.3, w: 18.5, h: 64.2 },   // Opening 3 (right)
      mark: { x: 74.25, y: 59.4, s: 2.3 }
    }
  ]
};

/* ---------- DOM Element Handles & Runtime State ---------- */
const scene       = document.getElementById('es-scene');
const stageEl     = document.getElementById('es-stage');
const stageBox    = document.getElementById('es-stagebox');
const lightReveal = document.getElementById('es-light-reveal');
const veil        = document.getElementById('es-screen');
const navlist     = document.getElementById('es-navlist');
const regions     = Array.prototype.slice.call(scene ? scene.querySelectorAll('.es-region') : []);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEBUG   = new URLSearchParams(location.search).has('debug');
if (DEBUG) document.body.classList.add('es-debug');

let aspect = [1672, 941];      // Corrected from naturalWidth/Height on load
let busy = false;              // Guard against overlapping transitions
let timers = [];               // Active transition timeouts

/* ---------- Utilities ---------- */
function rectCSS(r) {
  return 'left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;';
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

/* ============================================================
   REGION, MARKER & LABEL POSITIONING
   Aligns regions and anchors labels directly beneath markers
   ============================================================ */
function positionRegions() {
  if (!stageBox) return;
  const stageW = stageBox.getBoundingClientRect().width;

  CONFIG.destinations.forEach(function (d) {
    const el = document.getElementById('es-rg-' + d.id);
    if (!el) return;

    el.style.cssText = rectCSS(d.rect);

    // Position square-and-dot marker relative to opening
    const mark = el.querySelector('.es-mark');
    if (mark) {
      mark.style.left = ((d.mark.x - d.rect.x) / d.rect.w * 100) + '%';
      mark.style.top  = ((d.mark.y - d.rect.y) / d.rect.h * 100) + '%';
      mark.style.width = (d.mark.s / 100) * stageW + 'px';
      if (d.mark.dx) {
        mark.style.setProperty('--es-dotdx', d.mark.dx + '%');
      }
    }

    // Anchor minimal label centered directly under the marker
    const label = el.querySelector('.es-label');
    if (label) {
      label.style.left = ((d.mark.x - d.rect.x) / d.rect.w * 100) + '%';
      label.style.top  = ((d.mark.y - d.rect.y) / d.rect.h * 100) + '%';
    }

    if (DEBUG) {
      el.dataset.rect = 'x:' + d.rect.x + '% y:' + d.rect.y + '% w:' + d.rect.w + '% h:' + d.rect.h + '%';
    }
  });
}

/* ============================================================
   RESPONSIVE STAGE SIZING
   - Desktop & Tablet Landscape: Cover-fit maintaining 16:9 aspect
   - Mobile Portrait: Contain-fit strip at top with nav rows below
   ============================================================ */
const CONTAIN = window.matchMedia('(max-width: 640px), (orientation: portrait)');

function sizeStage() {
  if (!stageEl || !stageBox) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let w, h;

  if (CONTAIN.matches) {
    // Preserve entire composition on mobile without cropping
    w = vw;
    h = (vw * aspect[1]) / aspect[0];
    stageEl.style.height = h + 'px';
  } else {
    // Full-bleed cover for desktop & tablet
    w = Math.max(vw, (vh * aspect[0]) / aspect[1]);
    h = Math.max(vh, (vw * aspect[1]) / aspect[0]);
    stageEl.style.height = '100vh';
    stageEl.style.height = '100svh';
  }

  stageBox.style.width  = w + 'px';
  stageBox.style.height = h + 'px';
  positionRegions();
}

/* ============================================================
   APPROACH A — WARM LIGHT REVEAL TRANSITION
   1. The clicked portal illuminates with warm interior light
   2. Surrounding architecture gently dims (subtly visible)
   3. A radial light veil expands from the opening center
   4. Screen settles on #F5F3EF before navigating
   ============================================================ */
function triggerLightReveal(dest, regionEl) {
  if (busy) return;
  busy = true;

  // Calculate viewport origin of the selected opening center
  if (regionEl && lightReveal) {
    const r = regionEl.getBoundingClientRect();
    const vx = ((r.left + r.width / 2) / window.innerWidth * 100).toFixed(2);
    const vy = ((r.top + r.height / 2) / window.innerHeight * 100).toFixed(2);
    lightReveal.style.setProperty('--cx', vx + '%');
    lightReveal.style.setProperty('--cy', vy + '%');
  }

  // Phase 1: Illuminate opening & gently dim surrounding architecture
  if (regionEl) regionEl.classList.add('is-illuminated');
  if (stageBox) stageBox.classList.add('is-dimmed');

  // Reduced motion: skip expanding circle, perform gentle fade
  if (REDUCED) {
    if (veil) veil.classList.add('is-on');
    timers.push(setTimeout(function () {
      location.href = dest.href;
    }, 120));
    return;
  }

  // Phase 2: Expand radial light bloom from opening origin
  timers.push(setTimeout(function () {
    if (lightReveal) lightReveal.classList.add('is-expanding');
  }, 160));

  // Phase 3: Settle solid end-frame veil on #F5F3EF as light covers viewport
  timers.push(setTimeout(function () {
    if (veil) veil.classList.add('is-on');
  }, 540));

  // Phase 4: Navigate smoothly to destination page
  timers.push(setTimeout(function () {
    location.href = dest.href;
  }, 820));
}

/* ============================================================
   KEYBOARD ESCAPE ABORT
   Cancels active light reveal and restores entrance view
   ============================================================ */
window.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape' || !busy) return;
  clearTimers();
  busy = false;

  if (veil) veil.classList.remove('is-on');
  if (lightReveal) {
    lightReveal.classList.remove('is-expanding');
    lightReveal.style.opacity = '0';
  }
  if (stageBox) stageBox.classList.remove('is-dimmed');
  regions.forEach(function (r) {
    r.classList.remove('is-illuminated');
  });

  setTimeout(function () {
    if (lightReveal) lightReveal.style.opacity = '';
  }, 320);
});

/* ============================================================
   EVENT WIRING
   ============================================================ */
function wireRegions() {
  // Desktop/Tablet clickable portal regions
  regions.forEach(function (el) {
    const dest = CONFIG.destinations.filter(function (d) {
      return d.id === el.dataset.dest;
    })[0];
    if (!dest) return;

    el.addEventListener('click', function (e) {
      e.preventDefault();
      triggerLightReveal(dest, el);
    });
  });

  // Mobile navigation rows
  if (navlist) {
    navlist.innerHTML = '';
    CONFIG.destinations.forEach(function (d) {
      const a = document.createElement('a');
      a.className = 'es-row';
      a.href = d.href;
      a.innerHTML =
        '<span>' + d.num + ' — ' + d.label + '</span>' +
        '<span class="es-row-num" aria-hidden="true">&#8594;</span>';

      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (veil) veil.classList.add('is-on');
        setTimeout(function () {
          location.href = d.href;
        }, REDUCED ? 0 : CONFIG.veilMs);
      });

      navlist.appendChild(a);
    });
  }
}

/* Update stage dimensions once image natural dimensions are decoded */
function initImage() {
  const img = document.querySelector('.es-img');
  if (img) {
    if (img.complete && img.naturalWidth) {
      aspect = [img.naturalWidth, img.naturalHeight];
      sizeStage();
    } else {
      img.addEventListener('load', function () {
        if (img.naturalWidth) {
          aspect = [img.naturalWidth, img.naturalHeight];
          sizeStage();
        }
      });
    }
  }
}

/* ---------- Boot Sequence ---------- */
window.addEventListener('resize', sizeStage);
if (CONTAIN.addEventListener) {
  CONTAIN.addEventListener('change', sizeStage);
}

sizeStage();
wireRegions();
initImage();

/* ============================================================
   door.js — the scene engine for the door walk-through.
   Reads scenes.json (hotspots, door rectangle, hinge side) and
   door.css (THEME block: colours, door tint, timings).
   No libraries. Written simply so a beginner can edit it.

   Scenes: "door" (a closed door you can open) and "hall"
   (three labelled openings that navigate the site).
============================================================ */
'use strict';

/* ---------- small settings read once ---------- */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEBUG = new URLSearchParams(location.search).has('debug');
if (DEBUG) document.body.classList.add('debug');

/* sessionStorage key: once the visitor has walked in, repeat visits
   start at the hall instead of the door                          */
const SEEN_KEY = 'doorSeen';

/* ---------- element handles ---------- */
const stage = document.getElementById('stage');
const layers = [document.getElementById('layer-a'), document.getElementById('layer-b')];
const camera = document.getElementById('camera');

/* ---------- engine state ---------- */
let data = null;        // the parsed scenes.json
let current = 0;        // which layer is visible (0 or 1)
let sceneName = null;   // "door" or "hall"
let token = 0;          // bump per rebuild: stale image callbacks give up
let lastPortrait = null;
let busy = false;

/* ============================================================
   Helpers
   ============================================================ */

// turn a {x,y,w,h} percent rect into CSS
function rectCSS(r) {
  return 'left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;';
}

// "images/scenes/hall.webp" -> "images/scenes/hall-portrait.webp"
function portraitName(src) { return src.replace(/(\.\w+)$/, '-portrait$1'); }

function isPortrait() { return window.innerHeight > window.innerWidth; }

// probe an image file; done(url) with url = null when it is missing
function loadImg(url, tok, done) {
  const probe = new Image();
  probe.onload = function () { if (tok === token) done(url); };
  probe.onerror = function () { if (tok === token) done(null); };
  probe.src = url;
}

// pick image vs -portrait variant by device orientation
function variantOf(src) { return isPortrait() ? portraitName(src) : src; }

/* ============================================================
   Stage sizing: a box with the image's own aspect ratio, sized
   to COVER the viewport and centred, so percent hotspots align.
   ============================================================ */
function sizeStage(scene) {
  const aspect = isPortrait() ? [9, 16] : scene.aspect; // 16:9 art / 9:16 portrait art
  const vw = window.innerWidth, vh = window.innerHeight;
  const w = Math.max(vw, (vh * aspect[0]) / aspect[1]);
  const h = Math.max(vh, (vw * aspect[1]) / aspect[0]);
  stage.style.width = w + 'px';
  stage.style.height = h + 'px';
  sizeLeaf();
}

/* ============================================================
   CSS scene art: the backdrop EVERY scene starts with, drawn in
   plain HTML/CSS (styles live in door.css, no image files).
   A real scene photo is layered on top, so when it loads it
   simply covers this art — "image wins" needs no extra code.
   ============================================================ */
function addArt(parent, cls, css) {
  const el = document.createElement('div');
  el.className = cls;
  if (css) el.style.cssText = css;
  parent.appendChild(el);
  return el;
}

/* door scene: wall, window-light bands, floor, frame, lit room */
function buildDoorArt(layer) {
  const art = addArt(layer, 'scene-art');
  addArt(art, 'd-wall');
  addArt(art, 'd-light').innerHTML = '<span></span><span></span><span></span>';
  addArt(art, 'd-floor');
  addArt(art, 'd-threshold');
  addArt(art, 'd-frame');
  addArt(art, 'd-open-room');
  addArt(art, 'noise');
}

/* hall scene: same wall/floor, openings drawn FROM the hotspot
   rects in scenes.json, so frames and click targets can't drift */
function buildHallArt(layer, scene) {
  const art = addArt(layer, 'scene-art');
  addArt(art, 'd-wall');
  (scene.hotspots || []).forEach(function (h) {
    addArt(art, 'd-opening', rectCSS(h));
  });
  addArt(art, 'hall-floor').innerHTML = '<div class="tile-plane"></div>';
  addArt(art, 'd-ceiling');
  addArt(art, 'noise');
}

/* ============================================================
   Door leaf: a crop of door-closed at doorRect, recoloured via
   the THEME variables, with the open-state image behind it.
   ============================================================ */
function buildLeaf(scene, tok) {
  const wrap = document.createElement('div');
  wrap.className = 'scene-door-leaf-wrap';
  wrap.style.cssText = rectCSS(scene.doorRect);
  wrap.setAttribute('aria-hidden', 'true');   // the door button is the real control

  const leaf = document.createElement('div');
  leaf.className = 'scene-door-leaf';
  leaf.appendChild(Object.assign(document.createElement('div'), { className: 'scene-door-tint' }));
  wrap.appendChild(leaf);

  /* the CSS-drawn leaf shows straight away and CAN swing already
     (d-leaf + handle + shade, styles in door.css); the real photo
     covers it when it loads, so the image always wins           */
  const cssLeaf = document.createElement('div');
  cssLeaf.className = 'd-leaf';
  cssLeaf.innerHTML =
    '<div class="d-handle"></div><div class="d-leaf-shade"></div><div class="noise"></div>';
  leaf.appendChild(cssLeaf);
  wrap.dataset.armed = '1';                    // leaf ready -> swing allowed

  const src = variantOf(scene.image);
  loadImg(src, tok, function (url) {
    if (url) {
      // the background is the WHOLE scene image; sizeLeaf() offsets it so the
      // leaf box shows exactly the door's slice (true even after resizes)
      leaf.style.backgroundImage = 'url("' + url + '")';
      cssLeaf.remove();                        // photo wins over the CSS leaf
    }
  });
  return wrap;
}

// crop maths for the leaf background (kept current on every resize)
function sizeLeaf() {
  const leaf = stage.querySelector('.scene-door-leaf');
  if (!leaf) return;
  const scene = data && data.scenes.door;
  if (!scene || !scene.doorRect) return;
  const rect = scene.doorRect;
  const box = stage.getBoundingClientRect();
  leaf.style.backgroundSize = box.width + 'px ' + box.height + 'px';
  leaf.style.backgroundPosition =
    (-(rect.x / 100) * box.width) + 'px ' + (-(rect.y / 100) * box.height) + 'px';
}

/* ============================================================
   Hotspots: real <a>/<button>, visible text label, focus ring
   ============================================================ */
function makeHotspot(h) {
  const a = h.action ? document.createElement('button') : document.createElement('a');
  a.className = 'hotspot' + (h.action === 'open' ? ' is-door' : '');
  if (h.target) a.href = h.target;            // <a> hotspots navigate
  a.style.cssText = rectCSS(h);

  /* hall openings: quick fade (<= 0.4s) THEN navigate, no camera move.
     Reduced motion skips the fade entirely. */
  if (h.target && !h.action) {
    a.addEventListener('click', function (e) {
      if (REDUCED) return;                    // default navigation, instant
      e.preventDefault();
      document.body.classList.add('opening'); // door.css fades the viewport
      setTimeout(function () { location.href = h.target; }, 360);
    });
  }

  const label = document.createElement('span');
  label.className = 'hs-label';
  label.textContent = h.label;
  a.appendChild(label);

  if (DEBUG) {  // ?debug=1: show the exact % values to copy back into scenes.json
    a.dataset.rect = 'x' + h.x + ' y' + h.y + ' · w' + h.w + ' h' + h.h;
  }
  if (h.action === 'open') {                  // the door itself
    a.type = 'button';
    a.setAttribute('aria-label', h.label + ' the door');
    a.addEventListener('click', openDoor);
  }
  return a;
}

function buildLayer(layer, scene, name) {
  layer.innerHTML = '';
  const tok = ++token;           // invalidate any pending image callbacks

  /* 1 - the CSS-drawn scene always goes in first (all door.css) */
  if (name === 'door') buildDoorArt(layer);
  else buildHallArt(layer, scene);

  /* 2 - a real scene photo on top: it only shows once it has
     actually loaded, so the CSS art is never blankly covered   */
  const bgSrc = variantOf(name === 'door' ? scene.openImage : scene.image);
  const bgImg = document.createElement('img');
  bgImg.className = 'scene-img';
  bgImg.alt = scene.alt || '';
  bgImg.hidden = true;           // unhidden by the load callback only
  layer.appendChild(bgImg);
  loadImg(bgSrc, tok, function (url) {
    if (url) {
      bgImg.src = url;
      bgImg.hidden = false;
      const credit = document.getElementById('credit');
      if (credit) credit.hidden = false; // credit only when a photo is used
    }
  });

  /* 3 - the closed leaf sits over the door area (door scene only) */
  if (name === 'door' && scene.doorRect) layer.appendChild(buildLeaf(scene, tok));

  /* 4 - hotspots on top */
  (scene.hotspots || []).forEach(function (h) { layer.appendChild(makeHotspot(h)); });
}


/* ============================================================
   Scene switch: crossfade (or an instant swap for reduced motion).
   Back button: each user move pushes #door / #hall into history.
   ============================================================ */
function show(name) {
  const scene = data.scenes[name];
  if (!scene) return;
  busy = false;
  sceneName = name;
  sizeStage(scene);

  const from = layers[current], to = layers[1 - current];
  buildLayer(to, scene, name);
  to.classList.add('is-active');
  from.classList.remove('is-active');
  current = 1 - current;

  // keep the URL hash in step (#door / #hall) so the Back button works
  if (location.hash.slice(1) !== name) location.hash = name;

  document.title = name === 'door'
    ? 'Portfolio 2024-27 — Mohammed Huzefa'
    : 'Hall — Portfolio 2024-27';

  // preload ONLY the next scene image (from the door, the next is the hall)
  if (name === 'door' && data.scenes.hall) {
    const pre = new Image();
    pre.src = isPortrait() ? portraitName(data.scenes.hall.image) : data.scenes.hall.image;
  }
}

/* hash routing: Back button re-shows the previous scene */
window.addEventListener('hashchange', function () {
  const name = location.hash.slice(1);
  if (data && data.scenes[name] && name !== sceneName && !busy) show(name);
});

/* ============================================================
   THE DOOR — click / Enter / Space rotates the closed leaf
   around its hinge (<= 1.1s), revealing the lit room behind,
   then the camera pushes into the hall (<= 1.2s), then a
   crossfade. Reduced motion: a plain crossfade instead.
   ============================================================ */
function openDoor() {
  if (busy) return;
  busy = true;
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* private mode: fine */ }

  const scene = data.scenes.door;
  const wrap = stage.querySelector('.scene-door-leaf-wrap');

  // the CSS leaf is armed as soon as it exists, so the swing always
  // works; only reduced motion falls back to a plain crossfade
  if (REDUCED || !wrap || wrap.dataset.armed !== '1') { show('hall'); return; }

  // swing: rotate around the hinge edge (set in scenes.json)
  const leaf = wrap.querySelector('.scene-door-leaf');
  leaf.style.transformOrigin = scene.hinge === 'right'
    ? 'right center' : 'left center';
  wrap.style.setProperty('--swing',
    (scene.hinge === 'right' ? '82deg' : '-82deg'));
  wrap.classList.add('is-open-swing');

  // once the leaf is out of the way, push the camera in
  setTimeout(startCamera, 950);
}

// the camera: scale + translate so the doorway fills the view
function startCamera() {
  const rect = data.scenes.door.doorRect;
  const cx = (rect.x + rect.w / 2) / 100;      // door centre, fractions of the stage
  const cy = (rect.y + rect.h / 2) / 100;
  const s = 0.85 / (rect.w / 100);             // doorway lands at ~85% of the viewport
  const tx = 0.5 - s * cx;
  const ty = 0.5 - s * cy;

  camera.style.transformOrigin = '0 0';
  camera.style.transition = REDUCED
    ? 'none'
    : 'transform ' + (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--camera-ms')) || 900) + 'ms ease-in-out';
  camera.style.transform =
    'translate(' + (tx * 100) + '%, ' + (ty * 100) + '%) scale(' + s + ')';

  // after the push: reset the camera, crossfade into the hall
  setTimeout(function () {
    camera.style.transition = 'none';
    camera.style.transform = 'none';
    show('hall');
  }, REDUCED ? 0 : 930);
}

/* ============================================================
   Resize: re-cover the stage; when the device flips portrait /
   landscape, rebuild the active layer so the right image shows.
   ============================================================ */
function onResize() {
  const scene = data && data.scenes[sceneName];
  if (!scene) return;
  const portrait = isPortrait();
  sizeStage(scene);
  if (portrait !== lastPortrait) {
    lastPortrait = portrait;
    buildLayer(layers[current], scene, sceneName);
  }
}
window.addEventListener('resize', onResize);

/* ============================================================
   Init: start scene = the #hash, or the hall on repeat visits.
   ============================================================ */
function init(d) {
  data = d;
  const credit = document.getElementById('credit');
  credit.textContent = data.credit;
  credit.hidden = true; // unhidden ONLY when a real scene photo loads

  let start = location.hash.slice(1);
  if (!data.scenes[start]) {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { /* fine */ }
    start = seen && data.scenes.hall ? 'hall' : 'door';
    history.replaceState(null, '', '#' + start);   // no extra Back step
  }
  lastPortrait = isPortrait();

  current = 0;
  buildLayer(layers[0], data.scenes[start], start);
  layers[0].classList.add('is-active');
  sizeStage(data.scenes[start]);
  sceneName = start;

  if (start === 'door') {   // preload ONLY the next scene image
    const pre = new Image();
    pre.src = variantOf(data.scenes.hall.image);
  }
}

/* load the scene data; without it, show why (nothing is invented) */
fetch('scenes.json')
  .then(function (r) { if (!r.ok) throw new Error('not-found'); return r.json(); })
  .then(init)
  .catch(function (err) {
    // plain message, no fake scene art (nothing is invented)
    const msg = document.createElement('p');
    msg.className = 'scene-credit';
    msg.textContent = 'scenes.json could not be loaded (' + err.message +
      '). Run a small local server — see README.md.';
    stage.appendChild(msg);
    stage.style.width = '100%';
    stage.style.height = '100%';
  });

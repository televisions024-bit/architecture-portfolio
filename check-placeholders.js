#!/usr/bin/env node
/* check-placeholders.js - publishing gate for the project pages.
   Reads every projects/*.json, finds each image it points at (src,
   thumbnail) and reports missing files, stand-ins still in use, and
   references that are malformed or escape the repository.
   Also reports, as information only: unused stand-ins, stale stand-in
   mappings, and the optional door scenes - none of these fail the run.
   RUN: node check-placeholders.js
   Exit 0 = every required asset exists, no stand-in in use.
   Exit 1 = at least one release blocker (see the RESULT line).
   Never reads image content - only checks that the files exist.      */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;                       // works from any cwd
const IMAGE_EXT = /\.(webp|svg|png|jpe?g|avif)$/i;

/* Temporary stand-ins: [real render file, stand-in file, credit].
   Mirrors PLACEHOLDERS in script.js. A stand-in is only reported while
   a projects/*.json actually points at its real file.               */
const STAND_INS = [
  ['images/library/renders/01-hero-exterior.webp',
   'images/placeholders/placeholder-01-hero.webp', 'SOURCE PENDING'],
  ['images/library/renders/02-entrance-approach.webp',
   'images/placeholders/placeholder-02-entrance.webp', 'SOURCE PENDING'],
  ['images/library/renders/03-reading-room.webp',
   'images/placeholders/placeholder-03-reading-room.webp', 'SOURCE PENDING'],
  ['images/library/renders/06-dusk-view.webp',
   'images/placeholders/placeholder-04-dusk.webp', 'iramezatil, Pexels'],
  ['images/library/renders/07-detail.webp',
   'images/placeholders/placeholder-05-detail.webp', 'SOURCE PENDING']
];

const blockers = [];        // asset-level blockers (missing / stand-in)
const refErrors = [];       // malformed JSON, bad paths, escapes
const info = [];
const blocked = (msg) => blockers.push(msg);
const blockedRef = (msg) => refErrors.push(msg);

/* ---------- path helpers ---------------------------------------- */

function isExternal(v) {
  return /^(https?:)?\/\//i.test(v) || /^(data|mailto|tel):/i.test(v) || v.startsWith('#');
}

/* Turn a JSON reference into a repo-relative POSIX path.
   Returns { rel, abs } or a string describing why it is invalid.    */
function resolveRef(ref) {
  const clean = String(ref).trim().replace(/\\/g, '/').split(/[?#]/)[0];
  if (!clean) return 'empty path';
  if (isExternal(clean)) return 'external URL';
  if (/^[a-zA-Z]:\//.test(clean) || clean.startsWith('/'))
    return 'absolute path is not allowed';
  if (!IMAGE_EXT.test(clean)) return 'not an image file (.webp/.svg/.png/.jpg/.avif)';
  const abs = path.resolve(ROOT, clean);
  const rootKey = process.platform === 'win32' ? ROOT.toLowerCase() : ROOT;
  const absKey = process.platform === 'win32' ? abs.toLowerCase() : abs;
  if (absKey !== rootKey && !absKey.startsWith(rootKey + path.sep))
    return 'path escapes the repository';
  return { rel: clean.replace(/^\.\//, ''), abs };
}

function exists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function categoryOf(rel) {
  if (/\/renders\//i.test(rel)) return 'RENDERS';
  if (/\/drawings\//i.test(rel)) return 'DRAWINGS';
  if (/\/diagrams\//i.test(rel)) return 'DIAGRAMS';
  if (/\/placeholders\//i.test(rel)) return 'PLACEHOLDERS';
  return 'OTHER';
}

/* ---------- find image references ------------------------------- */

/* Collect every { slot, ref } under a parsed project document.       */
function collectRefs(node, where, out) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectRefs(v, where + '[' + i + ']', out));
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [key, val] of Object.entries(node)) {
    if (key === '_') continue;                       // author notes
    if ((key === 'src' || key === 'thumbnail') && typeof val === 'string') {
      out.push({ slot: where || key, ref: val });
    } else if (val && typeof val === 'object') {
      collectRefs(val, where ? where + '.' + key : key, out);
    }
  }
}

const projectsDir = path.join(ROOT, 'projects');
let files = [];
try {
  files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json')).sort();
} catch (e) {
  console.error('FATAL: cannot read projects/ - ' + e.message);
  process.exit(1);
}

/* project name -> Map(dedupe key -> asset) */
const byProject = new Map();
/* every reference that could not even be resolved */
const seenRequired = new Set();                      // repo-relative, for stand-in checks

function projectBucket(name) {
  if (!byProject.has(name)) byProject.set(name, new Map());
  return byProject.get(name);
}

function addRef(project, slot, ref, file) {
  if (typeof ref !== 'string' || !ref.trim()) return;         // intentionally empty
  if (/^\s*TODO/i.test(ref)) return;                          // open, optional slot
  if (isExternal(ref.trim())) return;                         // not a local asset
  const resolved = resolveRef(ref);
  if (typeof resolved === 'string') {
    blockedRef(file + ' -> ' + slot + ': "' + ref + '" - ' + resolved);
    return;
  }
  const key = process.platform === 'win32' ? resolved.abs.toLowerCase() : resolved.abs;
  const bucket = projectBucket(project);
  if (!bucket.has(key)) {
    bucket.set(key, { rel: resolved.rel, abs: resolved.abs, slots: new Set() });
  }
  bucket.get(key).slots.add(slot);
  seenRequired.add(resolved.rel);
}

for (const file of files) {
  const full = path.join(projectsDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    blockedRef(file + ': invalid JSON - ' + e.message);
    continue;
  }
  if (file === 'index.json') {
    /* register entries: each thumbnail belongs to that project */
    const list = Array.isArray(data.projects) ? data.projects : [];
    list.forEach((p, i) => {
      addRef(p && p.slug ? p.slug : 'index', 'register thumbnail' + '[' + i + ']',
        p && p.thumbnail, file);
    });
    continue;
  }
  const project = data.slug || file.replace(/\.json$/i, '');
  const refs = [];
  collectRefs(data, '', refs);
  refs.forEach(r => addRef(project, r.slot, r.ref, file));
}

/* ---------- evaluate assets ------------------------------------- */

const standInByReal = new Map();
for (const [real, standIn, credit] of STAND_INS) standInByReal.set(real, { standIn, credit });

let uniqueFiles = 0;
let missingCount = 0;
let standInCount = 0;

for (const [project, bucket] of byProject) {
  for (const asset of bucket.values()) {
    uniqueFiles++;
    asset.exists = exists(asset.abs);
    asset.category = categoryOf(asset.rel);
    if (/\/placeholders\//i.test(asset.rel)) {
      blocked('direct placeholder reference: ' + asset.rel +
        ' [' + [...asset.slots].join(', ') + ']');
      continue;
    }
    if (asset.exists) continue;
    missingCount++;
    const map = standInByReal.get(asset.rel);
    if (map) {
      if (exists(path.join(ROOT, map.standIn))) {
        asset.standIn = map;
        standInCount++;
        blocked('stand-in in use: ' + asset.rel + ' -> ' + map.standIn);
      } else {
        asset.standInMissing = map.standIn;
        blocked('missing asset and its stand-in: ' + asset.rel);
      }
    } else {
      blocked('missing asset: ' + asset.rel);
    }
  }
}

/* ---------- information only ------------------------------------ */

/* stand-ins nobody references any more */
const standInFiles = new Set(STAND_INS.map(s => s[1]));
const referencedAny = new Set();
for (const bucket of byProject.values()) {
  for (const asset of bucket.values()) referencedAny.add(asset.rel);
}
for (const [real, standIn] of STAND_INS) {
  if (!referencedAny.has(real)) {
    info.push('stale stand-in mapping: ' + standIn +
      ' (no project points at ' + real + ' any more)');
  }
}

/* stand-in files on disk that nothing uses any more */
const placeholderDir = path.join(ROOT, 'images', 'placeholders');
if (fs.existsSync(placeholderDir)) {
  for (const f of fs.readdirSync(placeholderDir).sort()) {
    if (!/\.(webp|png|jpe?g|avif)$/i.test(f)) continue;
    const rel = 'images/placeholders/' + f;
    if (!standInFiles.has(rel) && !referencedAny.has(rel)) {
      info.push('unreferenced stand-in: ' + rel + ' (safe to delete, not a blocker)');
    }
  }
}

/* optional door scenes: informational, the page has a drawn fallback */
const scenesFile = path.join(ROOT, 'scenes.json');
if (fs.existsSync(scenesFile)) {
  try {
    const scenes = JSON.parse(fs.readFileSync(scenesFile, 'utf8'));
    const refs = [];
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      for (const [k, v] of Object.entries(node)) {
        if ((k === 'image' || k === 'openImage') && typeof v === 'string') refs.push(v);
        else if (v && typeof v === 'object') walk(v);
      }
    };
    walk(scenes);
    for (const r of refs) {
      const resolved = resolveRef(r);
      if (typeof resolved === 'object' && !exists(resolved.abs)) {
        info.push('optional scene missing: ' + resolved.rel + ' (drawn fallback is used)');
      }
    }
  } catch (e) {
    info.push('scenes.json could not be read: ' + e.message);
  }
}

/* ---------- report ---------------------------------------------- */

const ORDER = ['RENDERS', 'DRAWINGS', 'DIAGRAMS', 'PLACEHOLDERS', 'OTHER'];
const result = [];

for (const [project, bucket] of byProject) {
  const byCat = new Map();
  for (const asset of bucket.values()) {
    if (!byCat.has(asset.category)) byCat.set(asset.category, []);
    byCat.get(asset.category).push(asset);
  }
  if (!bucket.size) continue;
  result.push(project);
  for (const cat of ORDER) {
    const list = byCat.get(cat);
    if (!list) continue;
    result.push('  ' + cat + ' (' + list.length + ')');
    for (const asset of list.sort((a, b) => a.rel.localeCompare(b.rel))) {
      const slots = [...asset.slots].join(', ');
      if (/\/placeholders\//i.test(asset.rel)) {
        result.push('    BLOCKED    ' + asset.rel + '  [' + slots + ']');
        result.push('               direct placeholder reference - point the project at a real asset');
      } else if (asset.standIn) {
        result.push('    STAND-IN   ' + asset.rel + '  [' + slots + ']');
        result.push('               using ' + asset.standIn.standIn +
          ' (' + asset.standIn.credit + ')');
      } else if (asset.exists) {
        result.push('    ok         ' + asset.rel + '  [' + slots + ']');
      } else {
        result.push('    MISSING    ' + asset.rel + '  [' + slots + ']');
        if (asset.standInMissing)
          result.push('               stand-in missing too: ' + asset.standInMissing);
      }
    }
  }
}

console.log('PROJECT ASSETS');
console.log(result.length ? result.join('\n') : '(no project image references found)');

if (refErrors.length) {
  console.log('\nREFERENCE ERRORS (blocking)');
  refErrors.forEach(e => console.log('  ' + e));
}

if (info.length) {
  console.log('\nINFORMATION (not blocking)');
  info.forEach(i => console.log('  ' + i));
}

const totalReasons = blockers.length + refErrors.length;
console.log('\n' + uniqueFiles + ' required file(s) checked across ' +
  byProject.size + ' project(s); ' + missingCount + ' missing, ' +
  standInCount + ' stand-in(s) in use.');

if (totalReasons) {
  console.log('RESULT: NOT PUBLISHABLE - ' + totalReasons +
    ' release blocker(s). Do not share or deploy.');
  process.exit(1);
}
console.log('RESULT: OK - every required asset exists and no stand-in is in use.');

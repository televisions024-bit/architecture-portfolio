#!/usr/bin/env node
/* check-placeholders.js — lists every stand-in photo still in use.
   A stand-in is "in use" while the real render file it backs up is
   still missing from images/library/renders/.
   RUN: node check-placeholders.js
   Do NOT share or deploy the site while this reports placeholders —
   it exits with code 1 whenever any stand-in is still needed.      */

'use strict';
const fs = require('fs');

/* [real render file, stand-in file, credit] — mirrors PLACEHOLDERS in script.js */
const PAIRS = [
  ['images/library/renders/01-hero-exterior.webp',
   'images/placeholders/placeholder-01-hero.webp', 'Galla_ph, Pexels'],
  ['images/library/renders/02-entrance-approach.webp',
   'images/placeholders/placeholder-02-entrance.webp', 'Agung Pandit Wiguna, Pexels'],
  ['images/library/renders/03-reading-room.webp',
   'images/placeholders/placeholder-03-reading-room.webp', 'Polina Zimmerman, Pexels'],
  ['images/library/renders/06-dusk-view.webp',
   'images/placeholders/placeholder-04-dusk.webp', 'iramezatil, Pexels'],
  ['images/library/renders/07-detail.webp',
   'images/placeholders/placeholder-05-detail.webp', 'Ricky Esquivel, Pexels']
];

let stillUsed = 0;
for (const [real, standIn, credit] of PAIRS) {
  if (fs.existsSync(real)) continue;                 // real render landed — fine
  if (fs.existsSync(standIn)) {
    console.log('STILL IN USE  ' + standIn +
                '  (standing in for ' + real + ')  Photo: ' + credit);
  } else {
    console.log('MISSING BOTH   ' + real + ' and its stand-in ' + standIn);
  }
  stillUsed++;
}

const strays = fs.existsSync('images/placeholders')
  ? fs.readdirSync('images/placeholders')
      .filter(f => f.endsWith('.webp') &&
        !PAIRS.some(p => p[1].endsWith(f)))
  : [];
strays.forEach(f => console.log('ORPHANED  images/placeholders/' + f +
  ' — no real file backs it up; safe to delete'));

/* ---- scene art (door.html) ---------------------------------------------
   The scenes are DRAWN in HTML/CSS (door.css), so a missing scene photo
   is NOT a problem — the photo is an optional upgrade that covers the
   drawn scene when it exists. Informational only; never fails the run.  */
const SCENES = [
  ['images/scenes/door-closed.webp', 'images/scenes/door-closed-portrait.webp'],
  ['images/scenes/door-open.webp',   'images/scenes/door-open-portrait.webp'],
  ['images/scenes/hall.webp',        'images/scenes/hall-portrait.webp']
];
for (const [real, portrait] of SCENES) {
  if (fs.existsSync(real)) {
    if (!fs.existsSync(portrait)) {
      console.log('SCENE PHOTO   ' + real +
        '  (portrait variant ' + portrait + ' still missing — optional)');
    }
  } else {
    console.log('SCENE PHOTO   ' + real +
      '  missing — fine: door.html shows the drawn CSS scene instead');
  }
}

if (stillUsed || strays.length) {
  console.log('\n' + (stillUsed ? stillUsed : 'No') + ' render placeholder(s)' +
    ' still in use. Do not publish while placeholders remain.');
  process.exit(1);
}
console.log('\nOK: every real render exists. You may now delete ' +
  'images/placeholders/, the PLACEHOLDERS map in script.js, the ".ph-tag" ' +
  'CSS block, and this script. See images/PLACEHOLDERS.md.');

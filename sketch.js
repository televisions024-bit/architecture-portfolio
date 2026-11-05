/* ============================================================
   sketch.js — v4. ONLY job: on door click, play the swing open
   (CSS class) then follow the link to projects.html. No libraries.

   - prefers-reduced-motion users: no swing, default link jump.
   - No-JS users: the door is a plain <a>, this never runs.
   ============================================================ */
window.addEventListener('DOMContentLoaded', function () {
  var door = document.querySelector('.door');
  if (!door) return;

  door.addEventListener('click', function (e) {
    // reduced motion: let the browser navigate straight through
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // already mid-swing: don't restart
    if (door.classList.contains('open')) { e.preventDefault(); return; }

    e.preventDefault();       // hold navigation for one swing
    door.classList.add('open');
    window.setTimeout(function () {
      window.location.href = door.getAttribute('href');
    }, 950);
  });
});

# Standalone Interactive Architectural Entrance Scene

An independent, reusable, lightweight entrance scene experiment built with plain HTML, CSS, and vanilla JavaScript (no frameworks or external dependencies).

## Overview

This experiment presents an architectural photograph of three tall, deep rectangular openings framed in burgundy (`#7A1F2B`) within a warm lime-plaster hall. Interactive HTML regions sit precisely over each opening:

1. **PROJECTS** (`../../projects.html`)
2. **ABOUT** (`../../about.html`)
3. **CONTACT** (`../../about.html#contact`)

---

## File Structure

```text
assets/images/
└── entrance-scene.webp    <-- Reference architectural photograph

experiments/entrance-scene/
├── index.html             <-- Independent scene document
├── entrance.css           <-- Scoped styles (prefixed with .es-)
├── entrance.js            <-- Configurable scene logic & camera math
└── README.md              <-- Integration & usage instructions
```

---

## Features & Behavior

### 1. Architectural Alignment
- **Full-Bleed Cover**: Desktop and tablet viewports preserve the composition in 16:9 ratio with natural architectural scaling.
- **Percentages-Based Geometry**: Interactive regions (`x%, y%, w%, h%`) and square-and-dot selection markers are defined relative to the image stage width/height, maintaining exact alignment across screen resizes.

### 2. Interaction & Visual Hierarchy
- **Hover / Focus State**: Hovering or focusing an opening subtly brightens it while sibling openings gently dim (`opacity` on non-intrusive pseudo-element veils). No heavy blurs or loud glow effects.
- **Selection Markers**: An HTML square-and-dot marker scales up smoothly on hover/focus (`scale(1.28)`), expanding the dot.
- **Camera Zoom Transition**: Clicking an opening initiates a camera push towards its center using CSS `transform: translate(...) scale(s)` on an inner camera container (`#es-camera`).
- **Escape Key Cancellation**: Pressing `Escape` at any point during camera zoom cancels the transition and restores the quiet hall view.
- **Screen-Reader & Keyboard Accessibility**: Regions are semantic `<a>` links with screen-reader labels (`.es-sr`) and visible focus indicators. Supports `prefers-reduced-motion` (bypasses zoom animation, performing a gentle fade only).

### 3. Responsive Adaptations
- **Desktop & Tablet**: Full-viewport immersive stage covering the screen.
- **Mobile & Portrait Viewports**: Contain-fit composition at the top, paired with generous, touch-friendly navigation rows (`.es-navlist`) below. Does not rely on hover interactions.

---

## Navigation Configuration

All destinations and coordinates are isolated inside the `CONFIG` object at the top of `entrance.js`:

```javascript
const CONFIG = {
  image: '../../assets/images/entrance-scene.webp',
  zoomMs: 1000,   // Camera push duration (ms)
  veilMs: 320,    // Page fade duration before navigation (ms)

  destinations: [
    {
      id: 'projects',
      label: 'Projects',
      href: '../../projects.html',
      rect: { x: 10.9, y: 19.3, w: 18.2, h: 64.2 }, // Opening 1 (left)
      mark: { x: 16.5, y: 59.2, s: 3.7, dx: -15 }   // Marker position & dot offset
    },
    {
      id: 'about',
      label: 'About',
      href: '../../about.html',
      rect: { x: 40.4, y: 19.3, w: 19.5, h: 64.2 }, // Opening 2 (centre)
      mark: { x: 44.5, y: 59.3, s: 2.25 }
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '../../about.html#contact',
      rect: { x: 71.0, y: 19.3, w: 18.5, h: 64.2 }, // Opening 3 (right)
      mark: { x: 74.25, y: 59.4, s: 2.3 }
    }
  ]
};
```

To tune or inspect interactive regions in a browser, append `?debug=1` to the URL:
`http://localhost:.../experiments/entrance-scene/index.html?debug=1`

---

## Integration Guide (When Ready to Deploy to Homepage)

When you decide to make this scene your main homepage:

1. **Move / Copy Assets**:
   - Keep `assets/images/entrance-scene.webp`.
   - Update `href` paths in `CONFIG` (e.g. `href: 'projects.html'` instead of `../../projects.html`).

2. **Embed in Target Page**:
   - Link `entrance.css` inside `<head>` (all rules are namespaced under `.es-scene` / `.es-` so they will not pollute site styles).
   - Place `<div class="es-scene" id="es-scene">...</div>` into your `index.html`.
   - Include `<script src="entrance.js"></script>` before `</body>`.

3. **No External Dependencies**: Requires no build step, NPM packages, or external CDN scripts.

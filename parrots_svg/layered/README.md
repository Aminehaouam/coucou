# Layered parrot (set2_parrot01)

- `parrot_layered_for_rive.svg` — import this into Rive. Top-level groups, back to front:
  `tail`, `body`, `wing`, `head`, `face`, `pupil`, `eyelid`, `beak`.
  `eyelid` is hidden (opacity 0): key its opacity/scale-Y for blinks.
  Suggested pivots (px, viewBox 476x740): tail (185,585), body (240,700), wing (225,345),
  head (235,310), beak hinge (335,215), eyelid top (256,110).
- `parrot_animated_preview.svg` — open in a browser to see the idle loop
  (breathe, head bob, wing flutter, tail sway, blink, beak twitch, eye look).
  It is a CSS preview only; Rive ignores CSS animation, so rebuild the motion in Rive's timeline.

## GSAP version
- `parrot_gsap.html` — open in a browser (needs `gsap.min.js` beside it). Idle loop (breathing, head, wing, tail),
  random blinks, wandering eyes, and a click reaction (squash, hop, wing flap, beak chirp, land).
  Respects `prefers-reduced-motion`. Pivots/timings are at the top of the `<script>`.
- `build_gsap.py` regenerates the HTML from `parrot_layered_for_rive.svg`.

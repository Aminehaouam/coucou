import { FillGradient } from 'pixi.js';

const parse = (c) => {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

export const mix = (a, b, t) => {
  const [pa, pb] = [parse(a), parse(b)];
  return hex(pa.map((v, i) => v + (pb[i] - v) * t));
};
export const shade = (c, t) => mix(c, '#000000', t);
export const tint = (c, t) => mix(c, '#ffffff', t);

const gradient = (end, stops) =>
  new FillGradient({
    type: 'linear',
    start: { x: 0, y: 0 },
    end,
    colorStops: stops.map(([offset, color]) => ({ offset, color })),
  });
export const vgrad = (...stops) => gradient({ x: 0, y: 1 }, stops);
export const hgrad = (...stops) => gradient({ x: 1, y: 0 }, stops);

export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Rounded-top ("arched") or flat rectangle path. */
export const archRect = (g, x, y, w, h, arched) => {
  if (!arched) return g.rect(x, y, w, h);
  const r = w / 2;
  return g.moveTo(x, y + h).lineTo(x, y + r).arc(x + r, y + r, r, Math.PI, 0).lineTo(x + w, y + h).closePath();
};

/** Soft blob made of stacked translucent ellipses (cheap stand-in for a blur). */
export const softBlob = (g, cx, cy, rx, ry, color, alpha, steps = 5) => {
  for (let i = 0; i < steps; i++) {
    const k = 1 - i / steps;
    g.ellipse(cx, cy, rx * (0.55 + 0.45 * k), ry * (0.55 + 0.45 * k)).fill({ color, alpha: alpha / steps * 1.6 });
  }
  return g;
};

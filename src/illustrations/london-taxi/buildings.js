import { Container, Graphics } from 'pixi.js';
import { P } from './palette';
import { archRect, rng, shade, tint, vgrad } from './draw';

const FLOOR_H = [96, 90, 78, 68, 60];

function sash(g, x, y, w, h, { arched = false, lit = false, trim = P.cream, bars = true }) {
  archRect(g, x - 4, y - 4, w + 8, h + 4 + (arched ? 0 : 0), arched).fill(trim);
  archRect(g, x, y, w, h, arched).fill(lit ? vgrad([0, P.warm], [1, P.warmDeep]) : vgrad([0, P.glass], [1, P.glassLight]));
  if (!lit) {
    g.poly([x + 2, y + h, x + w * 0.55, y + h, x + w, y + h * 0.35, x + w, y + h * 0.1, x + 2, y + h * 0.8]).fill({ color: '#ffffff', alpha: 0.16 });
  } else {
    g.rect(x, y, 4, h).fill({ color: P.brick, alpha: 0.35 });
    g.rect(x + w - 4, y, 4, h).fill({ color: P.brick, alpha: 0.35 });
  }
  if (bars) {
    g.rect(x + w / 2 - 0.8, y, 1.6, h).fill(trim);
    g.rect(x, y + h * 0.38, w, 1.6).fill(trim);
    if (h > 44) g.rect(x, y + h * 0.7, w, 1.6).fill({ color: trim, alpha: 0.9 });
  }
  g.rect(x - 6, y + h, w + 12, 4).fill(trim);
  g.rect(x - 6, y + h + 4, w + 12, 3).fill({ color: '#000000', alpha: 0.16 });
  if (!arched) {
    g.rect(x - 5, y - 10, w + 10, 7).fill(trim);
    g.rect(x + w / 2 - 3, y - 10, 6, 9).fill(tint(trim, 0.35));
  }
}

function windowBox(g, x, y, w, R) {
  g.roundRect(x - 4, y, w + 8, 9, 2).fill(shade(P.brick, 0.25));
  for (let i = 0; i < 6; i++) g.circle(x + 2 + i * (w - 4) / 5, y - 3 - R() * 3, 5 + R() * 2).fill(i % 2 ? P.sageDeep : P.sageDark);
  for (let i = 0; i < 3; i++) g.circle(x + 6 + i * (w - 12) / 2, y - 8 - R() * 3, 2.2).fill(i === 1 ? P.cream : P.brickMuted);
}

function door(g, cx, color, trim) {
  const w = 34, h = 62;
  g.rect(cx - w / 2 - 9, -h - 4, w + 18, h + 4).fill(trim);
  g.rect(cx - w / 2 - 12, -h - 24, w + 24, 5).fill(trim);
  g.moveTo(cx - w / 2, -h).lineTo(cx - w / 2, -h - 4).arc(cx, -h - 4, w / 2, Math.PI, 0).lineTo(cx + w / 2, -h).closePath().fill(vgrad([0, P.glass], [1, P.glassLight]));
  for (let i = 1; i < 4; i++) g.moveTo(cx, -h - 4).lineTo(cx - w / 2 + (w / 4) * i, -h).stroke({ width: 1.2, color: trim });
  g.rect(cx - w / 2, -h, w, h - 8).fill(color);
  for (const [dx, dy, ww, hh] of [[4, 6, 11, 18], [19, 6, 11, 18], [4, 29, 11, 20], [19, 29, 11, 20]]) {
    g.roundRect(cx - w / 2 + dx, -h + dy, ww, hh, 1.5).fill({ color: shade(color, 0.22), alpha: 0.9 });
    g.roundRect(cx - w / 2 + dx + 1, -h + dy + 1, ww - 2, 2, 1).fill({ color: '#ffffff', alpha: 0.12 });
  }
  g.circle(cx + 10, -h + 30, 2.2).fill('#d9b56a');
  g.rect(cx - 5, -h + 3, 10, 3).fill('#d9b56a');
  g.rect(cx - w / 2 - 6, -8, w + 12, 4).fill(tint(trim, 0.1));
  g.rect(cx - w / 2 - 10, -4, w + 20, 4).fill(shade(trim, 0.08));
  g.rect(cx - w / 2 - 14, 0, w + 28, 2).fill({ color: '#000000', alpha: 0.12 });
}

function chimney(g, x, y, brick) {
  g.rect(x, y - 52, 24, 52).fill(shade(brick, 0.22));
  g.rect(x, y - 52, 6, 52).fill({ color: '#000', alpha: 0.12 });
  g.rect(x - 3, y - 58, 30, 7).fill(P.stone);
  for (const px of [x + 5, x + 15]) {
    g.roundRect(px, y - 76, 7, 18, 2).fill(P.terracotta);
    g.rect(px - 1, y - 78, 9, 3).fill(shade(P.terracotta, 0.12));
  }
}

function roof(g, w, topY, kind, brick, R) {
  if (kind === 'mansard') {
    g.poly([-6, topY, w + 6, topY, w - 20, topY - 50, 20, topY - 50]).fill(vgrad([0, tint(P.roofSlate, 0.1)], [1, shade(P.roofSlate, 0.2)]));
    for (let y = topY - 8; y > topY - 50; y -= 8) g.moveTo(-6 + (topY - y) * 0.52, y).lineTo(w + 6 - (topY - y) * 0.52, y).stroke({ width: 1, color: '#000', alpha: 0.12 });
    const n = Math.max(1, Math.floor(w / 80));
    for (let i = 0; i < n; i++) {
      const cx = (w / n) * (i + 0.5);
      g.rect(cx - 12, topY - 40, 24, 30).fill(P.cream);
      g.rect(cx - 8, topY - 36, 16, 24).fill(vgrad([0, P.glass], [1, P.glassLight]));
      g.rect(cx - 0.8, topY - 36, 1.6, 24).fill(P.cream);
      g.poly([cx - 15, topY - 40, cx + 15, topY - 40, cx, topY - 56]).fill(shade(P.roofSlate, 0.3));
    }
    g.rect(18, topY - 52, w - 36, 4).fill(shade(P.roofSlate, 0.35));
    chimney(g, 14, topY - 40, brick);
    chimney(g, w - 40, topY - 40, brick);
  } else {
    g.rect(-2, topY - 16, w + 4, 16).fill(tint(brick, 0.02));
    g.rect(-4, topY - 20, w + 8, 6).fill(P.stone);
    for (let x = 6; x < w - 6; x += 14) g.roundRect(x, topY - 14, 7, 20, 3).fill(tint(P.stone, 0.25)); // balusters
    g.rect(-4, topY - 20, w + 8, 4).fill(tint(P.stone, 0.3));
    chimney(g, w * 0.2, topY - 20, brick);
    chimney(g, w * 0.66, topY - 20, brick);
    if (R() > 0.5) chimney(g, w * 0.43, topY - 20, brick);
  }
}

function shopfront(g, w, trim) {
  const h = 96;
  g.rect(0, -h, w, h).fill(shade(P.navy, 0.1));
  g.rect(0, -h, w, 24).fill(P.navy);
  g.rect(14, -h + 8, w * 0.45, 8).fill({ color: P.cream, alpha: 0.8 });
  g.rect(0, -h + 24, w, 3).fill('#d9b56a');
  const gx = 14, gw = w - 90, gy = -h + 52;
  g.rect(gx, gy, gw, 52 + (-gy - 52 + 0) + 0).fill(P.navyDeep);
  g.rect(gx + 3, gy + 3, gw - 6, -gy - 12).fill(vgrad([0, '#f8e2ae'], [1, P.warmDeep]));
  for (let i = 0; i < 3; i++) { // pendant lamps
    const lx = gx + gw * (0.2 + 0.3 * i);
    g.moveTo(lx, gy + 3).lineTo(lx, gy + 14).stroke({ width: 1, color: P.navy });
    g.moveTo(lx - 7, gy + 22).quadraticCurveTo(lx, gy + 8, lx + 7, gy + 22).closePath().fill(P.navy);
    g.circle(lx, gy + 23, 3).fill('#fff6d8');
  }
  g.rect(gx + 6, gy + 40, gw - 12, 4).fill({ color: P.brickDeep, alpha: 0.7 });
  g.roundRect(gx + gw * 0.2, gy + 30, 22, 10, 3).fill(P.brickMuted); // cakes on shelf
  g.roundRect(gx + gw * 0.55, gy + 28, 16, 12, 3).fill(P.cream);
  g.poly([gx + 3, gy + 3, gx + 40, gy + 3, gx + 3, gy + 46]).fill({ color: '#ffffff', alpha: 0.18 });
  const dx = w - 66;
  g.rect(dx, gy - 6, 40, 58 + 12).fill(P.navy);
  g.rect(dx + 5, gy + 0, 30, 54).fill(vgrad([0, '#f8e2ae'], [1, P.warmDeep]));
  g.circle(dx + 31, gy + 36, 2).fill('#d9b56a');
  // awning
  const ay = -h + 26;
  const n = Math.round((w + 10) / 18);
  g.poly([-6, ay, w + 6, ay, w + 12, ay + 24, -12, ay + 24]).fill(P.sage);
  for (let i = 0; i < n; i += 2) g.poly([-6 + (i * (w + 12)) / n, ay, -6 + ((i + 1) * (w + 12)) / n, ay, -12 + ((i + 1) * (w + 24)) / n, ay + 24, -12 + (i * (w + 24)) / n, ay + 24]).fill(P.cream);
  for (let i = 0; i < n; i++) {
    const x0 = -12 + (i * (w + 24)) / n, sw = (w + 24) / n;
    g.moveTo(x0, ay + 24).arc(x0 + sw / 2, ay + 24, sw / 2, Math.PI, 0, true).closePath().fill(i % 2 ? P.sageDeep : P.cream);
  }
  g.rect(-12, ay + 22, w + 24, 3).fill({ color: '#000', alpha: 0.1 });
  g.rect(-8, ay + 30, w + 16, 20).fill({ color: '#000', alpha: 0.12 });
}

/** One terraced facade. Origin is its bottom-left corner at pavement level. */
export function terrace({ w, floors = 3, brick = P.brickMuted, trim = P.cream, roof: roofKind = 'mansard', door: doorIdx = 1, doorColor = P.navy, shop = false, lit = [], boxes = [], seed = 1 }) {
  const c = new Container();
  const g = new Graphics();
  c.addChild(g);
  const R = rng(seed);
  const fhs = FLOOR_H.slice(0, floors + 1);
  const H = fhs.reduce((a, b) => a + b, 0);

  g.rect(0, -H, w, H).fill(vgrad([0, tint(brick, 0.1)], [1, shade(brick, 0.1)]));
  for (let y = -H + 9; y < 0; y += 9) g.rect(0, y, w, 1.2).fill({ color: shade(brick, 0.4), alpha: 0.1 });
  for (let y = -H; y < -fhs[0]; y += 18) for (let x = (y / 18) % 2 ? 9 : 0; x < w; x += 18) g.rect(x, y, 1, 9).fill({ color: shade(brick, 0.35), alpha: 0.07 });
  g.rect(0, -H, 7, H).fill({ color: '#ffffff', alpha: 0.05 });
  g.rect(w - 14, -H, 14, H).fill({ color: '#000000', alpha: 0.07 });

  const cols = Math.max(2, Math.round(w / 64));
  const step = w / cols;
  let yb = -fhs[0];

  if (shop) shopfront(g, w, trim);
  else {
    g.rect(0, -fhs[0], w, fhs[0]).fill(vgrad([0, tint(trim, 0.15)], [1, shade(trim, 0.06)]));
    for (let y = -fhs[0] + 18; y < 0; y += 18) g.rect(0, y, w, 1.5).fill({ color: shade(trim, 0.3), alpha: 0.18 });
    for (let i = 0; i < cols; i++) {
      const cx = step * (i + 0.5);
      if (i === doorIdx) door(g, cx, doorColor, trim);
      else {
        sash(g, cx - 14, -78, 28, 44, { trim: tint(trim, 0.3), arched: false });
        for (let k = 0; k < 5; k++) g.rect(cx - 15 + k * 7, -26, 1.6, 22).fill(P.navy); // area railing
        g.rect(cx - 17, -27, 34, 2).fill(P.navy);
      }
    }
  }
  g.rect(0, -fhs[0] - 3, w, 5).fill(shop ? P.stone : tint(trim, 0.2));

  for (let k = 1; k <= floors; k++) {
    const fh = fhs[k], wh = [0, 58, 50, 42, 36][k];
    const top = yb - fh;
    for (let i = 0; i < cols; i++) {
      const cx = step * (i + 0.5);
      const y = top + (fh - wh) / 2 - 2;
      const isLit = lit.includes(`${k}.${i}`);
      sash(g, cx - 13, y, 26, wh, { arched: k === 1, lit: isLit, trim });
      if (boxes.includes(`${k}.${i}`)) windowBox(g, cx - 13, y + wh + 6, 26, R);
    }
    g.rect(0, top - 2, w, 5).fill(tint(trim, k === floors ? 0.05 : 0));
    g.rect(0, top + 3, w, 3).fill({ color: '#000', alpha: 0.14 });
    yb = top;
  }

  g.rect(-5, -H - 12, w + 10, 12).fill(trim);
  for (let x = 0; x < w; x += 8) g.rect(x, -H - 3, 4, 3).fill({ color: '#000', alpha: 0.2 });
  g.rect(-5, -H, w + 10, 4).fill({ color: '#000', alpha: 0.2 });
  roof(g, w, -H - 12, roofKind, brick, R);
  g.rect(0, -6, w, 6).fill({ color: '#000', alpha: 0.1 }); // grounding shadow
  return c;
}

// Parametric London facades, emitted as SVG strings (origin = bottom-left at pavement level).
// The scene rasterises each one once and places it as a sprite.
import { rng, shade, tint } from '../draw';

const FLOOR_H = [96, 90, 80, 70, 62];
const f = (n) => Math.round(n * 10) / 10;

const defs = (brick, seed) => {
  const R = rng(seed * 31 + 7);
  const bricks = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
    if (R() < 0.32) bricks.push(`<rect x="${c * 24 + (r % 2) * 12}" y="${r * 8}" width="23" height="7" fill="${R() > 0.5 ? tint(brick, 0.1) : shade(brick, 0.14)}" opacity="${f(0.25 + R() * 0.3)}"/>`);
  }
  return `<defs>
  <pattern id="brick" width="192" height="48" patternUnits="userSpaceOnUse"><rect width="192" height="48" fill="${brick}"/>${bricks.join('')}
    ${[0, 1, 2, 3, 4, 5].map((r) => `<rect y="${r * 8 + 7}" width="192" height="1" fill="#000" opacity=".14"/>`).join('')}</pattern>
  <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".08" stop-color="#fff" stop-opacity="0"/><stop offset=".9" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
  <linearGradient id="lift" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9bb3"/><stop offset="1" stop-color="#bccdd8"/></linearGradient>
  <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9e3b0"/><stop offset="1" stop-color="#e8b565"/></linearGradient>
  <linearGradient id="slate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7480"/><stop offset="1" stop-color="#46505b"/></linearGradient>
  <linearGradient id="stucco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6efe1"/><stop offset="1" stop-color="#e3d8c2"/></linearGradient>
</defs>`;
};

const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;

function sash({ x, y, w, h, arched = false, lit = false, trim, keystone = true }) {
  const r = w / 2;
  const shape = (px, py, pw, ph, pr) => (arched
    ? `M${f(px)} ${f(py + ph)} L${f(px)} ${f(py + pr)} A${f(pr)} ${f(pr)} 0 0 1 ${f(px + pw)} ${f(py + pr)} L${f(px + pw)} ${f(py + ph)} Z`
    : `M${f(px)} ${f(py)} h${f(pw)} v${f(ph)} h${f(-pw)} Z`);
  const out = [];
  out.push(`<path d="${shape(x - 4.5, y - 4.5, w + 9, h + 4.5, r + 4.5)}" fill="${trim}"/>`);
  out.push(`<path d="${shape(x, y, w, h, r)}" fill="url(#${lit ? 'lit' : 'glass'})"/>`);
  if (!lit) out.push(`<path d="M${f(x + 2)} ${f(y + h)} L${f(x + w * 0.6)} ${f(y + h)} L${f(x + w)} ${f(y + h * 0.32)} L${f(x + w)} ${f(y + h * 0.12)} L${f(x + 2)} ${f(y + h * 0.82)} Z" fill="#fff" opacity=".17"/>`);
  else out.push(rect(x, y, 4, h, '#b94e43', 'opacity=".32"'), rect(x + w - 4, y, 4, h, '#b94e43', 'opacity=".32"'));
  const bars = [`M${f(x + w / 2)} ${f(y)} v${f(h)}`, `M${f(x)} ${f(y + h * 0.36)} h${f(w)}`];
  if (h > 44) bars.push(`M${f(x)} ${f(y + h * 0.68)} h${f(w)}`);
  out.push(`<path d="${bars.join(' ')}" stroke="${trim}" stroke-width="1.8" fill="none"/>`);
  out.push(rect(x - 6.5, y + h, w + 13, 4.5, trim), rect(x - 6.5, y + h + 4.5, w + 13, 3, '#000', 'opacity=".16"'));
  if (!arched) {
    out.push(rect(x - 6, y - 11, w + 12, 7, trim));
    if (keystone) out.push(rect(x + w / 2 - 3.5, y - 12, 7, 10, tint(trim, 0.4)));
    out.push(`<path d="M${f(x - 5)} ${f(y - 11)} Q${f(x + w / 2)} ${f(y - 24)} ${f(x + w + 5)} ${f(y - 11)}" fill="none" stroke="#000" stroke-width="1" opacity=".16"/>`); // gauged arch
  } else {
    out.push(`<path d="M${f(x - 5)} ${f(y + r)} A${f(r + 5)} ${f(r + 5)} 0 0 1 ${f(x + w + 5)} ${f(y + r)}" fill="none" stroke="${tint(trim, 0.3)}" stroke-width="2"/>`);
  }
  return out.join('');
}

function windowBox(x, y, w, R) {
  const out = [`<rect x="${f(x - 4)}" y="${f(y)}" width="${f(w + 8)}" height="9" rx="2" fill="#7e3a31"/>`];
  for (let i = 0; i < 7; i++) out.push(`<circle cx="${f(x + 2 + (i * (w - 4)) / 6)}" cy="${f(y - 3 - R() * 3)}" r="${f(5 + R() * 2.4)}" fill="${i % 2 ? '#82987c' : '#5f7660'}"/>`);
  out.push(`<circle cx="${f(x + 6)}" cy="${f(y - 8)}" r="2.2" fill="#f1e8d8"/><circle cx="${f(x + w - 6)}" cy="${f(y - 9)}" r="2.2" fill="#b4695a"/>`);
  return out.join('');
}

function balcony(x, y, w) {
  const out = [rect(x, y, w, 3, '#202d40'), rect(x - 2, y + 12, w + 4, 3, '#202d40')];
  for (let bx = x + 3; bx < x + w - 1; bx += 7) out.push(rect(bx, y, 1.6, 15, '#202d40'));
  out.push(`<path d="M${f(x + 4)} ${f(y + 15)} q${f(w / 2 - 4)} 10 ${f(w - 8)} 0" fill="none" stroke="#202d40" stroke-width="1.6"/>`);
  return out.join('');
}

function door({ cx, color, trim, pediment }) {
  const w = 34, h = 62;
  const out = [];
  out.push(rect(cx - w / 2 - 9, -h - 6, w + 18, h + 6, trim));
  out.push(rect(cx - w / 2 - 12, -h - 26, w + 24, 5, trim));
  if (pediment) out.push(`<path d="M${f(cx - w / 2 - 14)} ${-h - 26} L${f(cx)} ${-h - 42} L${f(cx + w / 2 + 14)} ${-h - 26} Z" fill="${tint(trim, 0.2)}"/><path d="M${f(cx - w / 2 - 10)} ${-h - 27.5} L${f(cx)} ${-h - 38.5} L${f(cx + w / 2 + 10)} ${-h - 27.5}" fill="none" stroke="#000" stroke-width="1" opacity=".18"/>`);
  out.push(`<path d="M${f(cx - w / 2)} ${-h} L${f(cx - w / 2)} ${-h - 4} A${w / 2} ${w / 2} 0 0 1 ${f(cx + w / 2)} ${-h - 4} L${f(cx + w / 2)} ${-h} Z" fill="url(#glass)"/>`);
  for (let i = 1; i < 4; i++) out.push(`<path d="M${f(cx)} ${-h - 4} L${f(cx - w / 2 + (w / 4) * i)} ${-h}" stroke="${trim}" stroke-width="1.3"/>`);
  out.push(rect(cx - w / 2, -h, w, h - 8, color));
  for (const [dx, dy, ww, hh] of [[4, 6, 11, 18], [19, 6, 11, 18], [4, 29, 11, 20], [19, 29, 11, 20]]) {
    out.push(`<rect x="${f(cx - w / 2 + dx)}" y="${f(-h + dy)}" width="${ww}" height="${hh}" rx="1.5" fill="${shade(color, 0.25)}"/><rect x="${f(cx - w / 2 + dx + 1)}" y="${f(-h + dy + 1)}" width="${ww - 2}" height="2" rx="1" fill="#fff" opacity=".13"/>`);
  }
  out.push(`<circle cx="${f(cx + 10)}" cy="${-h + 30}" r="2.3" fill="#d9b56a"/>${rect(cx - 5, -h + 3, 10, 3, '#d9b56a')}`);
  out.push(rect(cx - w / 2 - 6, -8, w + 12, 4, tint(trim, 0.1)), rect(cx - w / 2 - 10, -4, w + 20, 4, shade(trim, 0.08)), rect(cx - w / 2 - 14, 0, w + 28, 2, '#000', 'opacity=".12"'));
  return out.join('');
}

function chimney(x, y, brick) {
  const out = [rect(x, y - 52, 24, 52, shade(brick, 0.22)), rect(x, y - 52, 6, 52, '#000', 'opacity=".12"'), rect(x - 3, y - 58, 30, 7, '#dcd0b8')];
  for (const px of [x + 5, x + 15]) out.push(`<rect x="${px}" y="${y - 78}" width="7" height="20" rx="2" fill="#c0714f"/><rect x="${px - 1}" y="${y - 80}" width="9" height="3" rx="1" fill="#a45a3d"/>`);
  return out.join('');
}

function mansard(w, top, brick) {
  const out = [`<path d="M-6 ${top} L${w + 6} ${top} L${w - 20} ${top - 52} L20 ${top - 52} Z" fill="url(#slate)"/>`];
  for (let y = top - 8; y > top - 52; y -= 7) out.push(`<path d="M${f(-6 + (top - y) * 0.5)} ${y} H${f(w + 6 - (top - y) * 0.5)}" stroke="#000" stroke-width="1" opacity=".13"/>`);
  const n = Math.max(1, Math.floor(w / 78));
  for (let i = 0; i < n; i++) {
    const cx = (w / n) * (i + 0.5);
    out.push(rect(cx - 13, top - 42, 26, 32, '#f1e8d8'), rect(cx - 9, top - 38, 18, 26, 'url(#glass)'), rect(cx - 0.9, top - 38, 1.8, 26, '#f1e8d8'));
    out.push(`<path d="M${cx - 17} ${top - 42} L${cx + 17} ${top - 42} L${cx} ${top - 60} Z" fill="${shade('#58616c', 0.28)}"/><path d="M${cx - 15} ${top - 43} L${cx} ${top - 57} L${cx + 15} ${top - 43}" fill="none" stroke="#f1e8d8" stroke-width="2"/>`);
  }
  out.push(rect(18, top - 54, w - 36, 4, shade('#58616c', 0.35)), chimney(14, top - 40, brick), chimney(w - 40, top - 40, brick));
  return out.join('');
}

function parapet(w, top, brick, R) {
  const out = [rect(-2, top - 18, w + 4, 18, tint(brick, 0.02)), rect(-5, top - 24, w + 10, 6, '#dcd0b8'), rect(-5, top - 24, w + 10, 3, '#fff', 'opacity=".25"')];
  for (let x = 6; x < w - 6; x += 14) out.push(`<path d="M${x} ${top - 3} q-1 -8 3.5 -10 q4.5 2 3.5 10 Z" fill="#efe6d4"/>`);
  out.push(chimney(w * 0.2, top - 24, brick), chimney(w * 0.64, top - 24, brick));
  if (R() > 0.5) out.push(chimney(w * 0.42, top - 24, brick));
  return out.join('');
}

// Dutch (Flemish) gable: a curved, stepped silhouette with stone coping, oculus and finial.
function dutchGable(w, top) {
  const m = w / 2;
  const X = (dx) => f(m + dx), Y = (up) => f(top - up);
  const o = m + 3, k = m - 18;
  const outline = [
    `M${X(-o)} ${Y(0)} L${X(-o)} ${Y(30)}`,
    `C${X(-o)} ${Y(46)} ${X(-k)} ${Y(42)} ${X(-k)} ${Y(58)} L${X(-k)} ${Y(66)}`,
    `C${X(-k)} ${Y(82)} ${X(-32)} ${Y(72)} ${X(-32)} ${Y(86)}`,
    `C${X(-28)} ${Y(102)} ${X(-9)} ${Y(102)} ${X(0)} ${Y(114)}`,
    `C${X(9)} ${Y(102)} ${X(28)} ${Y(102)} ${X(32)} ${Y(86)}`,
    `C${X(32)} ${Y(72)} ${X(k)} ${Y(82)} ${X(k)} ${Y(66)} L${X(k)} ${Y(58)}`,
    `C${X(k)} ${Y(42)} ${X(o)} ${Y(46)} ${X(o)} ${Y(30)} L${X(o)} ${Y(0)} Z`,
  ].join(' ');
  return [
    `<path d="${outline}" fill="url(#brick)"/>`,
    `<path d="${outline}" fill="none" stroke="#dcd0b8" stroke-width="5" stroke-linejoin="round"/>`,
    `<circle cx="${m}" cy="${Y(44)}" r="12" fill="#dcd0b8"/><circle cx="${m}" cy="${Y(44)}" r="8" fill="url(#glass)"/><path d="M${X(-8)} ${Y(44)} h16 M${m} ${Y(52)} v16" stroke="#dcd0b8" stroke-width="1.6"/>`,
    `<path d="M${X(-5)} ${Y(112)} L${m} ${Y(130)} L${X(5)} ${Y(112)} Z" fill="#dcd0b8"/><circle cx="${m}" cy="${Y(133)}" r="3.2" fill="#dcd0b8"/>`,
    rect(m - 26, Y(30), 52, 4, '#dcd0b8', 'opacity=".9"'),
  ].join('');
}

// Canted bay: three glazed panels per floor, stone piers, a plinth and a slate cap.
function bayFloor(x0, x1, y, h, trim, lit) {
  const w = x1 - x0, cw = w * 0.46, sw = (w - cw) / 2 - 3;
  const out = [rect(x0 - 5, y - 5, w + 10, h + 10, trim)];
  const pane = (px, pw, skew) => {
    const d = skew === 0 ? `M${f(px)} ${f(y)} h${f(pw)} v${f(h)} h${f(-pw)} Z`
      : skew < 0 ? `M${f(px)} ${f(y + 5)} L${f(px + pw)} ${f(y)} V${f(y + h)} L${f(px)} ${f(y + h - 5)} Z`
        : `M${f(px)} ${f(y)} L${f(px + pw)} ${f(y + 5)} V${f(y + h - 5)} L${f(px)} ${f(y + h)} Z`;
    out.push(`<path d="${d}" fill="url(#${lit ? 'lit' : 'glass'})"/>`);
    if (!lit) out.push(`<path d="M${f(px + 2)} ${f(y + h)} L${f(px + pw * 0.7)} ${f(y + h)} L${f(px + pw)} ${f(y + h * 0.4)} L${f(px + pw)} ${f(y + h * 0.2)} Z" fill="#fff" opacity=".16"/>`);
    out.push(`<path d="M${f(px + pw / 2)} ${f(y)} v${f(h)} M${f(px)} ${f(y + h * 0.38)} h${f(pw)}" stroke="${trim}" stroke-width="1.6" fill="none"/>`);
  };
  pane(x0, sw, -1);
  pane(x0 + sw + 3, cw, 0);
  pane(x0 + sw + cw + 6, sw, 1);
  out.push(`<path d="M${f(x0 + sw + 1.5)} ${f(y - 5)} V${f(y + h + 5)} M${f(x0 + sw + cw + 4.5)} ${f(y - 5)} V${f(y + h + 5)}" stroke="${shade(trim, 0.14)}" stroke-width="3"/>`);
  return out.join('');
}

function bayFrame(x0, x1, yTop, yBottom, trim) {
  const w = x1 - x0;
  return [
    rect(x0 - 12, yBottom + 4, w + 24, 8, tint(trim, 0.15)), rect(x0 - 12, yBottom + 12, w + 24, 4, '#000', 'opacity=".14"'),
    `<path d="M${f(x0 - 14)} ${f(yTop - 4)} L${f(x0 + 4)} ${f(yTop - 26)} L${f(x1 - 4)} ${f(yTop - 26)} L${f(x1 + 14)} ${f(yTop - 4)} Z" fill="url(#slate)"/>`,
    rect(x0 - 14, yTop - 6, w + 28, 5, tint(trim, 0.2)),
  ].join('');
}

function shopfront(w) {
  const h = 96, out = [];
  out.push(rect(0, -h, w, h, '#1b2638'), rect(0, -h, w, 24, '#202d40'), rect(14, -h + 8, w * 0.42, 8, '#f1e8d8', 'opacity=".85"'), rect(0, -h + 24, w, 3, '#d9b56a'));
  const gx = 14, gw = w - 92, gy = -44;
  out.push(rect(gx, gy, gw, 44, '#141c2a'), rect(gx + 3, gy + 3, gw - 6, 36, 'url(#lit)'));
  for (let i = 0; i < 3; i++) {
    const lx = gx + gw * (0.2 + 0.3 * i);
    out.push(`<path d="M${f(lx)} ${gy + 3} v10" stroke="#202d40"/><path d="M${f(lx - 7)} ${gy + 21} Q${f(lx)} ${gy + 7} ${f(lx + 7)} ${gy + 21} Z" fill="#202d40"/><circle cx="${f(lx)}" cy="${gy + 22}" r="3" fill="#fff6d8"/>`);
  }
  out.push(rect(gx + 6, gy + 30, gw - 12, 4, '#9c5246', 'opacity=".75"'), `<rect x="${f(gx + gw * 0.2)}" y="${gy + 20}" width="22" height="10" rx="3" fill="#b4695a"/><rect x="${f(gx + gw * 0.56)}" y="${gy + 18}" width="16" height="12" rx="3" fill="#f1e8d8"/>`);
  out.push(`<path d="M${gx + 3} ${gy + 3} h38 l-38 40 Z" fill="#fff" opacity=".18"/>`);
  const dx = w - 66;
  out.push(rect(dx, gy - 8, 40, 52, '#202d40'), rect(dx + 5, gy - 2, 30, 46, 'url(#lit)'), `<circle cx="${dx + 31}" cy="${gy + 22}" r="2" fill="#d9b56a"/>`);
  // scalloped awning
  const ay = -h + 26, n = Math.round((w + 10) / 18), sw = (w + 24) / n;
  out.push(`<path d="M-6 ${ay} H${w + 6} L${w + 12} ${ay + 24} H-12 Z" fill="#A9B9A1"/>`);
  for (let i = 0; i < n; i += 2) out.push(`<path d="M${f(-6 + (i * (w + 12)) / n)} ${ay} H${f(-6 + ((i + 1) * (w + 12)) / n)} L${f(-12 + ((i + 1) * (w + 24)) / n)} ${ay + 24} H${f(-12 + (i * (w + 24)) / n)} Z" fill="#f1e8d8"/>`);
  for (let i = 0; i < n; i++) out.push(`<path d="M${f(-12 + i * sw)} ${ay + 24} a${f(sw / 2)} ${f(sw / 2)} 0 0 0 ${f(sw)} 0 Z" fill="${i % 2 ? '#82987c' : '#f1e8d8'}"/>`);
  out.push(rect(-8, ay + 34, w + 16, 20, '#000', 'opacity=".12"'));
  return out.join('');
}

/** Build one facade. Returns { svg, width, height } in SVG units; the pavement line is at y = height. */
export function facade(spec) {
  const { w, floors = 3, brick = '#B4695A', trim = '#F1E8D8', roof = 'mansard', door: doorCol = 1, doorColor = '#202D40', shop = false, lit = [], boxes = [], balconies = [], bayCols = null, pediment = false, seed = 1 } = spec;
  const R = rng(seed);
  const fhs = FLOOR_H.slice(0, floors + 1);
  const H = fhs.reduce((a, b) => a + b, 0);
  const pad = 16, top = roof === 'dutch' ? 172 : 136;
  const W = w + pad * 2, Hh = H + top;
  const cols = Math.max(2, Math.round(w / 64));
  const step = w / cols;
  const body = [];

  body.push(rect(0, -H, w, H, 'url(#brick)'), rect(0, -H, w, H, 'url(#lift)'));
  if (shop) body.push(shopfront(w));
  else {
    body.push(rect(0, -fhs[0], w, fhs[0], 'url(#stucco)'));
    for (let y = -fhs[0] + 18; y < 0; y += 18) body.push(rect(0, y, w, 1.5, shade(trim, 0.3), 'opacity=".2"'));
  }
  body.push(rect(0, -fhs[0] - 3, w, 5, shop ? '#dcd0b8' : tint(trim, 0.2)));

  let yb = -fhs[0];
  let bayRange = null;
  for (let k = 1; k <= floors; k++) {
    const fh = fhs[k], wh = [0, 60, 52, 44, 38][k], topY = yb - fh;
    for (let i = 0; i < cols; i++) {
      const cx = step * (i + 0.5), y = topY + (fh - wh) / 2 - 2;
      const inBay = bayCols && i >= bayCols[0] && i <= bayCols[1] && k <= (spec.bayFloors ?? 2);
      if (inBay) {
        if (i === bayCols[0]) {
          const x0 = bayCols[0] * step + 14, x1 = (bayCols[1] + 1) * step - 14;
          body.push(bayFloor(x0, x1, y, wh, trim, lit.includes(`${k}.${i}`)));
          if (k === 1) bayRange = { x0, x1, yBottom: y + wh };
          if (k === (spec.bayFloors ?? 2)) bayRange = { ...bayRange, yTop: y };
        }
        continue;
      }
      const wx = cx - 13;
      body.push(sash({ x: wx, y, w: 26, h: wh, arched: k === 1 && !inBay, lit: lit.includes(`${k}.${i}`), trim, keystone: true }));
      if (balconies.includes(`${k}.${i}`)) body.push(balcony(wx - 10, y + wh + 8, 46));
      if (boxes.includes(`${k}.${i}`)) body.push(windowBox(wx, y + wh + 6, 26, R));
    }
    body.push(rect(0, topY - 2, w, 5, tint(trim, k === floors ? 0.05 : 0)), rect(0, topY + 3, w, 3, '#000', 'opacity=".14"'));
    yb = topY;
  }

  if (bayRange) body.push(bayFrame(bayRange.x0, bayRange.x1, bayRange.yTop, bayRange.yBottom, trim));

  if (!shop) {
    for (let i = 0; i < cols; i++) {
      const cx = step * (i + 0.5);
      if (i === doorCol) body.push(door({ cx, color: doorColor, trim, pediment }));
      else {
        body.push(sash({ x: cx - 14, y: -78, w: 28, h: 44, trim: tint(trim, 0.3), keystone: false }));
        for (let k = 0; k < 5; k++) body.push(rect(cx - 15 + k * 7, -26, 1.6, 22, '#202d40'));
        body.push(rect(cx - 17, -27, 34, 2, '#202d40'));
      }
    }
  }

  body.push(rect(-5, -H - 12, w + 10, 12, trim));
  for (let x = 0; x < w; x += 8) body.push(rect(x, -H - 3, 4, 3, '#000', 'opacity=".2"'));
  body.push(rect(-5, -H, w + 10, 4, '#000', 'opacity=".2"'));
  const roofTop = -H - 12;
  body.push(roof === 'mansard' ? mansard(w, roofTop, brick) : roof === 'dutch' ? dutchGable(w, roofTop) : parapet(w, roofTop, brick, R));
  body.push(rect(0, -6, w, 6, '#000', 'opacity=".1"'), rect(0, -H, w, H, 'url(#shade)'));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}">${defs(brick, seed)}<g transform="translate(${pad} ${Hh})">${body.join('')}</g></svg>`;
  return { svg, width: W, height: Hh, pad };
}

import { Container, Graphics, Text } from 'pixi.js';
import { P } from './palette';
import { rng, shade, softBlob, tint, vgrad } from './draw';
import { terrace } from './buildings';
import { createTaxi } from './taxi';
import { createCoco } from './coco';
import { createWalker } from './people';

export const W = 1200;
export const H = 800;
const GROUND = 470; // base of the terrace
const KERB = 548;
const ROAD_TOP = 562;
const TAXI = { x: 566, y: 726 };
const FOCUS_X = 600; // the part of the picture that must stay visible when the canvas is cropped

const layer = (name) => { const c = new Container(); c.label = name; return c; };
const gfx = (parent) => { const g = new Graphics(); parent.addChild(g); return g; };

function cloud(x, y, s, alpha = 0.9) {
  const c = new Container();
  const g = gfx(c);
  for (const [dx, dy, rx, ry] of [[0, 0, 70, 20], [-38, 6, 44, 15], [42, 8, 50, 14], [8, -12, 40, 16]]) g.ellipse(dx, dy, rx, ry).fill({ color: P.ivory, alpha });
  g.ellipse(0, 12, 80, 6).fill({ color: P.cream, alpha: 0.5 });
  c.position.set(x, y); c.scale.set(s);
  return c;
}

function skyline() {
  const g = new Graphics();
  const R = rng(7);
  const col = '#a9b9c6';
  let x = -20;
  while (x < W + 40) {
    const w = 40 + R() * 70, h = 60 + R() * 120;
    g.rect(x, GROUND - h, w, h).fill(col);
    if (R() > 0.6) g.poly([x - 3, GROUND - h, x + w + 3, GROUND - h, x + w - 8, GROUND - h - 18, x + 8, GROUND - h - 18]).fill(shade(col, 0.06));
    x += w - 4;
  }
  // church spire and a plain clock tower, lighter than the rest (further away)
  const far = '#b7c5d0';
  g.rect(742, GROUND - 250, 26, 250).fill(far);
  g.poly([738, GROUND - 250, 772, GROUND - 250, 755, GROUND - 330]).fill(shade(far, 0.05));
  g.rect(798, GROUND - 190, 40, 190).fill(far);
  g.poly([798, GROUND - 190, 838, GROUND - 190, 818, GROUND - 275, 817, GROUND - 275]).fill(shade(far, 0.04));
  g.circle(818, GROUND - 160, 4).fill({ color: P.ivory, alpha: 0.5 });
  return g;
}

function bus() {
  const c = new Container();
  c.label = 'bus';
  const g = gfx(c);
  const body = P.brick;
  g.roundRect(0, -150, 290, 138, 16).fill(vgrad([0, tint(body, 0.1)], [1, shade(body, 0.12)]));
  g.rect(0, -52, 290, 3).fill({ color: P.cream, alpha: 0.8 });
  g.rect(0, -22, 290, 10).fill({ color: '#000', alpha: 0.2 });
  for (const y of [-134, -88]) for (let i = 0; i < 7; i++) g.roundRect(46 + i * 34, y, 26, 30, 5).fill(vgrad([0, '#33445f'], [1, '#1d2a40']));
  g.roundRect(8, -134, 28, 76, 5).fill('#25344d');
  g.roundRect(8, -150, 54, 12, 4).fill('#0f1520');
  g.roundRect(14, -147, 40, 6, 2).fill({ color: P.warm, alpha: 0.9 });
  for (const cx of [60, 232]) { g.circle(cx, -12, 18).fill('#10131a'); g.circle(cx, -12, 9).fill('#8a9098'); }
  g.circle(284, -34, 5).fill(P.warm);
  return c;
}

function sideStreet() {
  const c = layer('sideStreet');
  const g = gfx(c);
  const x0 = 700, x1 = 862;
  g.rect(x0, GROUND - 300, x1 - x0, 300).fill(vgrad([0, '#c9d6de'], [1, '#e2e6e0']));
  const R = rng(21);
  for (const [bx, bw, bh, col] of [[x0, 60, 220, '#b9a79b'], [x0 + 62, 48, 270, '#c3b3a4'], [x0 + 112, 50, 190, '#b5a396']]) {
    g.rect(bx, GROUND - bh, bw, bh).fill(col);
    for (let y = GROUND - bh + 14; y < GROUND - 30; y += 34) for (let x = bx + 8; x < bx + bw - 14; x += 18) g.rect(x, y, 8, 15).fill({ color: R() > 0.8 ? P.warm : '#8fa4b6', alpha: 0.85 });
  }
  g.rect(x0, GROUND, x1 - x0, 22).fill('#a9aeb2'); // far road
  g.rect(x0, GROUND, x1 - x0, 3).fill({ color: P.cream, alpha: 0.6 });
  const b = bus();
  b.scale.set(0.44);
  b.position.set(x0 + 26, GROUND + 18);
  c.addChild(b);
  const haze = gfx(c);
  haze.rect(x0, GROUND - 300, x1 - x0, 330).fill({ color: '#e9e3d6', alpha: 0.35 });
  c.drift = b;
  return c;
}

function tree(x, y, s = 1) {
  const c = new Container();
  c.label = 'tree';
  const g = gfx(c);
  g.ellipse(0, 4, 34, 7).fill({ color: '#000', alpha: 0.15 });
  g.moveTo(-4, 0).lineTo(-3, -90).lineTo(3, -90).lineTo(4, 0).closePath().fill('#4b3b2e');
  g.roundRect(-16, -12, 32, 14, 3).fill(shade(P.slate, 0.15)); // tree guard base
  for (const [dx, dy, r, col] of [[-26, -130, 34, P.sageDark], [24, -136, 36, P.sageDark], [0, -160, 42, P.sageDeep], [-4, -120, 38, P.sageDeep], [30, -110, 26, P.sageDark], [-34, -106, 26, P.sageDark]]) g.circle(dx, dy, r).fill(col);
  for (const [dx, dy, r] of [[-12, -170, 22], [14, -150, 18], [-30, -134, 15], [6, -130, 16]]) g.circle(dx, dy, r).fill({ color: P.sage, alpha: 0.9 });
  for (const [dx, dy, r] of [[-20, -176, 7], [8, -160, 6], [-30, -140, 5]]) g.circle(dx, dy, r).fill({ color: P.cream, alpha: 0.35 });
  c.position.set(x, y); c.scale.set(s);
  return c;
}

function streetSign(x, y) {
  const c = new Container();
  c.label = 'streetSign';
  const g = gfx(c);
  g.ellipse(6, 2, 20, 4).fill({ color: '#000', alpha: 0.18 });
  g.rect(-3, -190, 6, 190).fill(P.navy);
  g.rect(-5, -192, 10, 5).fill(P.navyDeep);
  g.roundRect(-34, -176, 128, 30, 3).fill(P.ivory);
  g.roundRect(-34, -176, 128, 30, 3).stroke({ width: 2, color: P.navy });
  g.rect(-31, -173, 122, 3).fill({ color: P.brick, alpha: 0.9 });
  const t = new Text({ text: 'ALBION ROAD', style: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: '800', fill: P.navy, letterSpacing: 1 } });
  t.resolution = 3; t.anchor.set(0.5); t.position.set(30, -158);
  c.addChild(t);
  g.roundRect(-34, -144, 40, 12, 2).fill(P.navy);
  c.position.set(x, y);
  return c;
}

function lamp(x, y) {
  const c = new Container();
  c.label = 'lamp';
  const g = gfx(c);
  g.ellipse(4, 2, 18, 4).fill({ color: '#000', alpha: 0.18 });
  g.moveTo(-9, 0).quadraticCurveTo(-6, -14, -4, -34).lineTo(4, -34).quadraticCurveTo(6, -14, 9, 0).closePath().fill(P.navy);
  g.rect(-3, -250, 6, 220).fill(P.navy);
  g.rect(-8, -62, 16, 5).fill(P.navyDeep);
  g.moveTo(-3, -246).quadraticCurveTo(-24, -252, -26, -272).stroke({ width: 4, color: P.navy, cap: 'round' });
  g.circle(-26, -276, 28).fill({ color: P.warm, alpha: 0.12 });
  g.moveTo(-36, -268).lineTo(-16, -268).lineTo(-19, -290).lineTo(-33, -290).closePath().fill(vgrad([0, '#fff3cf'], [1, P.warm]));
  g.moveTo(-38, -290).lineTo(-14, -290).lineTo(-26, -300).closePath().fill(P.navyDeep);
  g.rect(-36, -270, 20, 3).fill(P.navyDeep);
  c.position.set(x, y);
  return c;
}

function railing(x0, x1, y) {
  const g = new Graphics();
  g.label = 'railing';
  g.rect(x0, y - 56, x1 - x0, 4).fill(P.navy);
  g.rect(x0, y - 30, x1 - x0, 3).fill(P.navy);
  for (let x = x0; x <= x1; x += 26) {
    g.rect(x - 1.5, y - 62, 3, 62).fill(P.navy);
    g.poly([x - 4, y - 62, x, y - 71, x + 4, y - 62]).fill(P.navyDeep);
  }
  g.rect(x0, y - 2, x1 - x0, 3).fill({ color: '#000', alpha: 0.16 });
  return g;
}

function street() {
  const c = layer('street');
  const g = gfx(c);
  g.rect(0, GROUND, W, KERB - GROUND).fill(vgrad([0, '#cfc5b2'], [1, P.pavement]));
  for (let x = 0; x < W; x += 72) g.moveTo(x, GROUND + 10).lineTo(x - 22, KERB).stroke({ width: 1.2, color: shade(P.pavement, 0.3), alpha: 0.28 });
  for (const y of [GROUND + 26, GROUND + 52]) g.rect(0, y, W, 1.2).fill({ color: shade(P.pavement, 0.3), alpha: 0.22 });
  g.rect(0, GROUND, W, 14).fill({ color: '#000', alpha: 0.08 });
  g.rect(0, KERB, W, 14).fill(vgrad([0, '#efe6d4'], [1, '#b9b0a0']));
  g.rect(0, KERB + 12, W, 3).fill({ color: '#000', alpha: 0.2 });
  g.rect(0, ROAD_TOP, W, H - ROAD_TOP).fill(vgrad([0, '#656e77'], [0.45, P.road], [1, '#4a525b']));
  g.rect(0, ROAD_TOP + 5, W, 3).fill({ color: '#d9bd5a', alpha: 0.75 });
  g.rect(0, ROAD_TOP + 13, W, 3).fill({ color: '#d9bd5a', alpha: 0.75 });
  for (let x = 24; x < W; x += 110) g.roundRect(x, 640, 60, 5, 2).fill({ color: P.cream, alpha: 0.5 });
  softBlob(g, 940, 775, 220, 16, P.cream, 0.06);
  g.ellipse(120, 720, 26, 8).stroke({ width: 3, color: '#3d444c', alpha: 0.7 });
  g.ellipse(120, 720, 18, 5).fill({ color: '#3d444c', alpha: 0.6 });
  return c;
}

export function createScene() {
  const root = new Container();
  root.label = 'london-taxi';
  const world = new Container();
  root.addChild(world);
  const L = Object.fromEntries(['background', 'skyline', 'sideStreet', 'buildings', 'trees', 'street', 'furniture', 'pedestrians', 'taxi', 'foreground', 'coco'].map((n) => [n, layer(n)]));
  const sky = layer('sky');
  world.addChild(sky, L.background, L.skyline, L.sideStreet, L.buildings, L.street, L.trees, L.furniture, L.pedestrians, L.taxi, L.foreground, L.coco);

  // background
  const sg = gfx(sky);
  sg.rect(0, 0, W, H).fill(vgrad([0, '#b3cde2'], [0.45, '#dbe5e6'], [0.62, '#f5e9d3'], [1, '#f1e8d8']));
  const glow = gfx(L.background);
  for (const [r, a] of [[170, 0.05], [120, 0.07], [80, 0.1], [46, 0.18]]) glow.circle(900, 150, r).fill({ color: '#fff4d6', alpha: a });
  glow.circle(900, 150, 24).fill({ color: '#fffbea', alpha: 0.9 });
  const clouds = [cloud(180, 120, 1.1), cloud(560, 70, 0.8, 0.8), cloud(1040, 240, 0.9, 0.7)];
  clouds.forEach((c) => L.background.addChild(c));

  L.skyline.addChild(skyline());
  const side = sideStreet();
  L.sideStreet.addChild(side);

  // buildings
  const rows = [
    { x: -40, w: 200, floors: 2, brick: '#B4695A', door: 1, doorColor: P.blue, roof: 'mansard', lit: ['2.0'], boxes: ['1.1'], seed: 3 },
    { x: 160, w: 170, floors: 3, brick: '#A65A4E', door: 0, doorColor: P.navy, roof: 'parapet', lit: ['3.1', '1.0'], boxes: ['2.0'], seed: 5 },
    { x: 330, w: 190, floors: 2, brick: '#C28A74', shop: true, roof: 'parapet', lit: ['2.1'], boxes: ['1.0', '1.2'], seed: 9 },
    { x: 520, w: 180, floors: 3, brick: '#9C5246', door: 2, doorColor: P.sageDark, roof: 'mansard', lit: ['3.0'], boxes: ['1.1'], seed: 11 },
    { x: 862, w: 190, floors: 3, brick: '#B86A58', door: 0, doorColor: P.navy, roof: 'parapet', lit: ['2.2', '1.1'], boxes: ['2.1'], seed: 13 },
    { x: 1052, w: 190, floors: 3, brick: '#A95C4E', door: 1, doorColor: P.blue, roof: 'mansard', lit: ['3.2'], boxes: ['1.0'], seed: 17 },
  ];
  rows.forEach((r) => { const t = terrace(r); t.position.set(r.x, GROUND); L.buildings.addChild(t); });
  // atmospheric depth: a touch of warm haze on the nearest-to-sky rooflines
  const haze = gfx(L.buildings);
  haze.rect(0, 40, W, 200).fill(vgrad([0, 'rgba(245,233,211,0.18)'], [1, 'rgba(245,233,211,0)']));

  L.street.addChild(street());

  // trees and furniture
  L.trees.addChild(tree(668, 526, 0.85), tree(1138, 520, 0.8));
  L.furniture.addChild(streetSign(292, KERB - 2), lamp(842, KERB - 2), railing(906, 1120, KERB - 2));

  // pedestrians (small, faceless)
  const peds = [
    createWalker({ coat: P.brick, trousers: P.navy, hair: '#2a1c14', bag: P.cream, scale: 0.56, stride: 0.5 }),
    createWalker({ coat: P.sageDark, trousers: '#2b3140', hair: '#6b4a32', scale: 0.56, stride: -0.4, scarf: P.cream, flip: true }),
    createWalker({ coat: P.slate, trousers: P.navyDeep, hair: '#c9c4bb', scale: 0.34, stride: 0.3 }),
    createWalker({ coat: P.blue, trousers: '#2b3140', hair: '#1a1410', phone: true, scale: 0.34, stride: 0.2, flip: true }),
    createWalker({ coat: P.cream, trousers: P.slate, hair: '#3b2a1e', bag: P.brickDeep, scale: 0.6, stride: 0.5 }),
  ];
  [[196, 530], [232, 536], [86, 508], [124, 512], [1010, 528]].forEach(([x, y], i) => {
    const s = gfx(L.pedestrians);
    s.ellipse(x, y + 2, 20 * peds[i].scale.y / 0.56, 4).fill({ color: '#000', alpha: 0.16 });
    peds[i].position.set(x, y); L.pedestrians.addChild(peds[i]);
  });

  // hero
  const taxi = createTaxi();
  taxi.position.set(TAXI.x, TAXI.y);
  L.taxi.addChild(taxi);

  // foreground framing: low kerb-side planter, cropped by the edge
  const fg = gfx(L.foreground);
  fg.rect(0, 770, W, 30).fill({ color: P.navyDeep, alpha: 0.1 });
  fg.rect(0, 0, W, H).fill({ color: '#000', alpha: 0 });

  const coco = createCoco();
  coco.scale.set(1.05);
  coco.position.set(932, KERB - 2 - 71);
  L.coco.addChild(coco);

  // responsive framing: cover the container, keep FOCUS_X in view and the road at the bottom
  const layout = (w, h) => {
    const s = Math.max(w / W, h / H);
    world.scale.set(s);
    world.x = Math.min(0, Math.max(w - W * s, w / 2 - FOCUS_X * s));
    world.y = h - H * s;
    const p = coco.getGlobalPosition();
    return { x: ((p.x) / w) * 100, y: ((p.y - 46 * s) / h) * 100 };
  };

  let t = 0;
  const update = (dt) => {
    t += dt;
    clouds.forEach((c, i) => { c.x += dt * (4 + i * 2); if (c.x > W + 140) c.x = -140; });
    side.drift.x -= dt * 2.2;
    if (side.drift.x < 560) side.drift.x = 870;
    coco.rotation = Math.sin(t * 1.3) * 0.02;
    coco.y = KERB - 2 - 71;
  };

  return { root, world, layers: L, parts: { taxi, coco, bus: side.drift }, layout, update };
}

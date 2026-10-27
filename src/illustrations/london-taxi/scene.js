import { Container, Graphics } from 'pixi.js';
import { P } from './palette';
import { rng, shade, softBlob, vgrad } from './draw';
import { SVG, COCO, facade, walkerSvg } from './svg';
import { svgSprite } from './render/sprites';

export const W = 1200;
export const H = 800;
const GROUND = 470; // base of the terrace
const KERB = 548;
const ROAD_TOP = 562;
const TAXI = { x: 566, y: 726 };
const FOCUS_X = 612; // the part of the picture that must stay visible when the canvas is cropped

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

const place = (sprite, x, y, scale = 1) => { sprite.position.set(x, y); sprite.scale.set(sprite.scale.x * scale, sprite.scale.y * scale); return sprite; };

const BUILDINGS = [
  { x: -40, w: 200, floors: 2, brick: '#B4695A', door: 1, doorColor: P.blue, roof: 'mansard', lit: ['2.0'], boxes: ['1.1'], seed: 3 },
  { x: 160, w: 170, floors: 2, brick: '#A65A4E', door: 0, doorColor: P.navy, roof: 'dutch', bayCols: [0, 1], lit: ['2.2'], seed: 5 },
  { x: 330, w: 190, floors: 2, brick: '#C28A74', shop: true, roof: 'parapet', lit: ['2.1'], boxes: ['1.0', '1.2'], seed: 9 },
  { x: 520, w: 180, floors: 3, brick: '#9C5246', door: 1, doorColor: P.sageDark, roof: 'mansard', balconies: ['1.1'], pediment: true, lit: ['3.0'], boxes: ['2.0'], seed: 11 },
  { x: 862, w: 190, floors: 2, brick: '#B86A58', door: 0, doorColor: P.navy, roof: 'parapet', lit: ['2.2', '1.1'], boxes: ['2.1'], seed: 13 },
  { x: 1052, w: 190, floors: 3, brick: '#A95C4E', door: 1, doorColor: P.blue, roof: 'mansard', lit: ['3.2'], boxes: ['1.0'], seed: 17 },
];

const WALKERS = [
  { at: [196, 532, 0.5], coat: P.brick, trousers: P.navy, hair: '#2a1c14', bag: P.cream, pose: 'walk' },
  { at: [236, 538, 0.5], coat: P.sageDark, trousers: '#2b3140', hair: '#6b4a32', scarf: P.cream, pose: 'walk', flip: true },
  { at: [88, 510, 0.32], coat: P.slate, trousers: P.navyDeep, hair: '#c9c4bb', pose: 'walk' },
  { at: [124, 514, 0.32], coat: P.blue, trousers: '#2b3140', hair: '#1a1410', pose: 'phone', flip: true },
  { at: [1010, 530, 0.52], coat: P.cream, trousers: P.slate, hair: '#3b2a1e', bag: P.brickDeep, pose: 'walk', hem: 'long' },
];

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


export async function createScene({ coco = 'a' } = {}) {
  const root = new Container();
  root.label = 'london-taxi';
  const world = new Container();
  root.addChild(world);
  const names = ['sky', 'background', 'skyline', 'sideStreet', 'buildings', 'street', 'trees', 'furniture', 'pedestrians', 'taxi', 'foreground', 'coco'];
  const L = Object.fromEntries(names.map((n) => [n, layer(n)]));
  world.addChild(...names.map((n) => L[n]));

  // ---- simple geometry stays in PixiJS: sky, sun, clouds, skyline, street surface ----
  gfx(L.sky).rect(0, 0, W, H).fill(vgrad([0, '#b3cde2'], [0.45, '#dbe5e6'], [0.62, '#f5e9d3'], [1, '#f1e8d8']));
  const glow = gfx(L.background);
  for (const [r, a] of [[170, 0.05], [120, 0.07], [80, 0.1], [46, 0.18]]) glow.circle(900, 150, r).fill({ color: '#fff4d6', alpha: a });
  glow.circle(900, 150, 24).fill({ color: '#fffbea', alpha: 0.9 });
  const clouds = [cloud(180, 120, 1.1), cloud(560, 70, 0.8, 0.8), cloud(1040, 240, 0.9, 0.7)];
  clouds.forEach((c) => L.background.addChild(c));
  L.skyline.addChild(skyline());
  L.street.addChild(street());

  // ---- rasterise every SVG once, in parallel ----
  const cocoDef = COCO[coco] ?? COCO.a;
  const facades = BUILDINGS.map(facade);
  const [taxi, busSprite, lampS, signS, treeA, treeB, ...rest] = await Promise.all([
    svgSprite(SVG.taxi, { pivot: [270, 232], label: 'taxi' }),
    svgSprite(SVG.bus, { pivot: [0, 191], label: 'bus' }),
    svgSprite(SVG.lamp, { pivot: [66, 334], label: 'lamp' }),
    svgSprite(SVG.streetSign, { pivot: [46, 214], label: 'streetSign' }),
    svgSprite(SVG.tree, { pivot: [110, 284], label: 'tree' }),
    svgSprite(SVG.tree, { pivot: [110, 284], label: 'tree' }),
    svgSprite(cocoDef.svg, { res: 3, pivot: cocoDef.pivot, label: 'coco' }),
    ...[0, 1].map(() => svgSprite(SVG.railing, { pivot: [0, 86], label: 'railing' })),
    ...facades.map((f, i) => svgSprite(f.svg, { pivot: [f.pad, f.height], label: `building-${i}` })),
    ...WALKERS.map((w) => svgSprite(walkerSvg(w), { res: 3, pivot: [30, 116], label: 'pedestrian' })),
  ]);
  const cocoS = rest[0];
  const rails = rest.slice(1, 3);
  const bSprites = rest.slice(3, 3 + facades.length);
  const wSprites = rest.slice(3 + facades.length);

  // far end of the street: hazy side road and the bus
  const side = layer('sideStreetContent');
  const sg = gfx(side);
  sg.rect(700, GROUND - 300, 162, 300).fill(vgrad([0, '#c9d6de'], [1, '#e2e6e0']));
  const R = rng(21);
  for (const [bx, bw, bh, col] of [[700, 60, 220, '#b9a79b'], [762, 48, 270, '#c3b3a4'], [812, 50, 190, '#b5a396']]) {
    sg.rect(bx, GROUND - bh, bw, bh).fill(col);
    for (let y = GROUND - bh + 14; y < GROUND - 30; y += 34) for (let x = bx + 8; x < bx + bw - 14; x += 18) sg.rect(x, y, 8, 15).fill({ color: R() > 0.8 ? P.warm : '#8fa4b6', alpha: 0.85 });
  }
  sg.rect(700, GROUND, 162, 22).fill('#a9aeb2');
  sg.rect(700, GROUND, 162, 3).fill({ color: P.cream, alpha: 0.6 });
  place(busSprite, 726, GROUND + 18, 0.42);
  side.addChild(busSprite);
  gfx(side).rect(700, GROUND - 300, 162, 330).fill({ color: '#e9e3d6', alpha: 0.38 });
  L.sideStreet.addChild(side);

  bSprites.forEach((s, i) => { place(s, BUILDINGS[i].x, GROUND); L.buildings.addChild(s); });
  const haze = gfx(L.buildings);
  haze.rect(0, 20, W, 220).fill(vgrad([0, 'rgba(245,233,211,0.2)'], [1, 'rgba(245,233,211,0)']));

  // trees, signage, railing
  place(treeA, 716, 526, 0.74); place(treeB, 1156, 520, 0.8);
  L.trees.addChild(treeA, treeB);
  place(signS, 330, KERB - 2); place(lampS, 842, KERB - 2);
  L.furniture.addChild(signS, lampS);
  rails.forEach((r, i) => { place(r, 906 + i * 104, KERB - 2); L.furniture.addChild(r); });

  // pedestrians
  WALKERS.forEach((w, i) => {
    const [x, y, s] = w.at;
    const shadow = gfx(L.pedestrians);
    shadow.ellipse(x, y + 1, 60 * s * 0.45, 4).fill({ color: '#000', alpha: 0.16 });
    const sp = wSprites[i];
    place(sp, x, y, s);
    if (w.flip) sp.scale.x *= -1;
    L.pedestrians.addChild(sp);
  });

  // hero
  place(taxi, TAXI.x, TAXI.y);
  L.taxi.addChild(taxi);
  gfx(L.foreground).rect(0, 770, W, 30).fill({ color: P.navyDeep, alpha: 0.1 });

  // Coco: perched on the top rail between two posts
  const COCO_AT = { x: 932, y: KERB - 2 - 86 + 22 };
  place(cocoS, COCO_AT.x, COCO_AT.y, cocoDef.scale);
  L.coco.addChild(cocoS);

  // responsive framing: cover the container, keep FOCUS_X in view and the road at the bottom
  const layout = (w, h) => {
    const s = Math.max(w / W, h / H);
    world.scale.set(s);
    world.x = Math.min(0, Math.max(w - W * s, w / 2 - FOCUS_X * s));
    world.y = h - H * s;
    const p = cocoS.getGlobalPosition();
    return { x: (p.x / w) * 100, y: ((p.y - 52 * s) / h) * 100 };
  };

  let t = 0;
  const baseCoco = cocoS.scale.x;
  const update = (dt) => {
    t += dt;
    clouds.forEach((c, i) => { c.x += dt * (4 + i * 2); if (c.x > W + 140) c.x = -140; });
    busSprite.x -= dt * 2.4;
    if (busSprite.x < 560) busSprite.x = 880;
    cocoS.rotation = Math.sin(t * 1.3) * 0.018;
    cocoS.scale.y = baseCoco * (1 + Math.sin(t * 2.1) * 0.006);
  };

  return { root, world, layers: L, parts: { taxi, coco: cocoS, bus: busSprite }, layout, update };
}

import { Container, Graphics } from 'pixi.js';
import { shade } from './draw';

/** Faceless pedestrian. Origin is the point between the feet; roughly 100 units tall. */
export function createWalker({ coat, trousers, hair, skin = '#D9B08C', stride = 0.45, bag = null, scarf = null, phone = false, scale = 1, flip = false }) {
  const c = new Container();
  const g = new Graphics();
  c.addChild(g);
  const hip = -44;
  const leg = (dir, col) => {
    const fx = Math.sin(dir * stride) * 20;
    g.moveTo(0, hip).quadraticCurveTo(fx * 0.15, hip / 2, fx, -5).stroke({ width: 9, color: col, cap: 'round' });
    g.ellipse(fx + 3, -2.5, 7, 3).fill('#1a1d24');
  };
  leg(-1, shade(trousers, 0.2));
  const sway = Math.sin(stride) * 8;
  g.moveTo(-8, -78).quadraticCurveTo(-12 + sway * 0.4, -64, -10 + sway, -50).stroke({ width: 6, color: shade(coat, 0.2), cap: 'round' });
  leg(1, trousers);
  // coat
  g.moveTo(-11, -84).bezierCurveTo(-15, -70, -17, -54, -18, -38).lineTo(18, -38).bezierCurveTo(17, -54, 14, -70, 11, -84).quadraticCurveTo(0, -90, -11, -84).closePath().fill(coat);
  g.moveTo(3, -84).bezierCurveTo(8, -68, 12, -54, 18, -38).lineTo(10, -38).bezierCurveTo(8, -56, 4, -70, 0, -84).closePath().fill({ color: '#000', alpha: 0.1 });
  if (scarf) g.ellipse(0, -84, 11, 5).fill(scarf);
  // front arm
  if (phone) {
    g.moveTo(9, -78).quadraticCurveTo(18, -66, 8, -60).stroke({ width: 6, color: coat, cap: 'round' });
    g.roundRect(4, -68, 6, 10, 2).fill('#2a2f3a');
    g.circle(8, -60, 3.2).fill(skin);
  } else {
    g.moveTo(9, -78).quadraticCurveTo(14 - sway * 0.4, -64, 10 - sway, -50).stroke({ width: 6, color: coat, cap: 'round' });
    g.circle(10 - sway, -47, 3.4).fill(skin);
    if (bag) {
      g.moveTo(10 - sway, -47).lineTo(10 - sway, -38).stroke({ width: 1.2, color: shade(bag, 0.3) });
      g.roundRect(10 - sway - 9, -38, 18, 15, 3).fill(bag);
    }
  }
  // head: skin ellipse + hair mass, deliberately without features
  g.rect(-3.5, -92, 7, 8).fill(skin);
  g.ellipse(0, -97, 8.5, 9.5).fill(skin);
  g.moveTo(-9, -96).bezierCurveTo(-10, -108, 8, -110, 9, -98).bezierCurveTo(5, -103, -3, -102, -9, -96).closePath().fill(hair);
  g.ellipse(-5.5, -96, 4.5, 7).fill(hair);
  c.scale.set(flip ? -scale : scale, scale);
  return c;
}

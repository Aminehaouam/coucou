import { Container, Graphics } from 'pixi.js';

const BODY = '#464C54';
const WING = '#9AA1A8';
const BEAK = '#1B1E24';
const TAIL = '#C2463A';

/**
 * Coco: charcoal body, one pale wing, tiny beak, small red tail. No eyes, no other features.
 * Faces left; origin is the perch point under her feet.
 */
export function createCoco() {
  const coco = new Container();
  coco.label = 'coco';
  const g = new Graphics();
  coco.addChild(g);

  // feet on the perch
  g.moveTo(-3, 0).lineTo(-3, -3).stroke({ width: 1.8, color: '#2b2f36', cap: 'round' });
  g.moveTo(5, 0).lineTo(5, -3).stroke({ width: 1.8, color: '#2b2f36', cap: 'round' });
  // small red tail hanging below the perch line, tipped slightly backwards
  g.moveTo(4, -6).lineTo(13, -6).lineTo(13, 11).quadraticCurveTo(9.5, 16, 6, 11).closePath().fill(TAIL);
  // body and head: one rounded charcoal silhouette
  g.ellipse(2, -15, 13, 16).fill(BODY);
  g.circle(-4, -31, 9.5).fill(BODY);
  g.moveTo(-9, -25).quadraticCurveTo(-3, -22, 4, -26).lineTo(4, -20).lineTo(-9, -20).closePath().fill(BODY);
  // tiny curved beak
  g.moveTo(-12.5, -35).quadraticCurveTo(-20, -33, -17.5, -25).quadraticCurveTo(-15.5, -29.5, -11, -28.5).closePath().fill(BEAK);
  // one lighter wing
  g.moveTo(-5, -23).bezierCurveTo(4, -28, 14, -20, 12, -3).bezierCurveTo(4, -1, -5, -7, -6, -16).bezierCurveTo(-6.5, -19.5, -6, -21.5, -5, -23).closePath().fill(WING);
  g.moveTo(-1, -19).bezierCurveTo(5, -20, 9, -15, 9.5, -9).stroke({ width: 1, color: '#ffffff', alpha: 0.3 });
  return coco;
}

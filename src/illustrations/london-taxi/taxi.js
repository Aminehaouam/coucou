import { Container, Graphics, Text } from 'pixi.js';
import { P } from './palette';
import { shade, tint, vgrad } from './draw';

const BODY = '#1F2430';
const BODY_HI = '#3A4250';
const CHROME = '#CBD0D4';
const GLASS_TOP = '#2E4260';
const GLASS_BOT = '#1B2A40';
const WHEEL_X = [-148, 142];

/**
 * Side-on London taxi, facing right. Origin is ground contact, horizontally centred.
 * Each part is its own Graphics so it can be restyled independently (taxi.parts.*).
 */
export function createTaxi() {
  const taxi = new Container();
  taxi.label = 'taxi';
  const mk = (name) => { const g = new Graphics(); g.label = name; taxi.addChild(g); return g; };
  const parts = {
    shadow: mk('shadow'), under: mk('under'), body: mk('body'), glass: mk('glass'),
    details: mk('details'), wheels: mk('wheels'), lights: mk('lights'),
  };
  taxi.parts = parts;

  // ground shadow
  parts.shadow.ellipse(10, 2, 262, 15).fill({ color: '#0e131c', alpha: 0.22 });
  parts.shadow.ellipse(6, 1, 238, 9).fill({ color: '#0e131c', alpha: 0.3 });

  // underbody, so nothing shows through between the wheels
  parts.under.roundRect(-214, -40, 430, 24, 6).fill('#0A0C11');

  // ----- bodywork silhouette -----
  const b = parts.body;
  const outline = () => b
    .moveTo(-230, -28)
    .lineTo(-231, -92)
    .bezierCurveTo(-231, -108, -224, -114, -212, -118)
    .bezierCurveTo(-200, -124, -194, -160, -170, -172)
    .bezierCurveTo(-164, -175, -158, -175, -150, -175)
    .lineTo(58, -175)
    .bezierCurveTo(82, -175, 91, -164, 97, -150)
    .lineTo(113, -116)
    .bezierCurveTo(152, -114, 196, -110, 216, -98)
    .bezierCurveTo(232, -88, 236, -66, 234, -28)
    .closePath();
  outline().fill(vgrad([0, BODY_HI], [0.28, BODY], [1, shade(BODY, 0.4)]));

  // sill shadow band + belt-line highlight
  b.poly([-230, -52, 234, -52, 234, -28, -230, -28]).fill({ color: '#06080c', alpha: 0.45 });
  b.moveTo(-229, -101).bezierCurveTo(-120, -106, 60, -106, 216, -97).stroke({ width: 2.2, color: tint(BODY_HI, 0.25), alpha: 0.75 });
  b.moveTo(-214, -116).bezierCurveTo(-200, -122, -194, -160, -172, -171).stroke({ width: 2, color: tint(BODY_HI, 0.3), alpha: 0.6 });
  // roof sheen
  b.moveTo(-150, -174).lineTo(56, -174).stroke({ width: 2.5, color: tint(BODY_HI, 0.45), alpha: 0.85 });
  // bonnet reflection (soft cream/blue)
  b.moveTo(122, -112).bezierCurveTo(158, -111, 192, -107, 208, -99).lineTo(204, -95).bezierCurveTo(186, -102, 154, -106, 120, -107).closePath().fill({ color: P.cream, alpha: 0.2 });

  // door shut lines
  for (const x of [-182, -9, 5, 100]) {
    b.moveTo(x, -111).lineTo(x + (x > 90 ? 12 : 0), -50).stroke({ width: 1.3, color: '#05070a', alpha: 0.7 });
  }
  b.moveTo(-182, -50).lineTo(100, -50).stroke({ width: 1.1, color: '#05070a', alpha: 0.5 });
  // door handles
  for (const hx of [-34, 62]) b.roundRect(hx, -104, 20, 5, 2.5).fill({ color: CHROME, alpha: 0.85 });

  // ----- glass -----
  const g = parts.glass;
  const win = (pts) => g.poly(pts).fill(vgrad([0, GLASS_TOP], [1, GLASS_BOT]));
  win([-182, -116, -176, -150, -166, -165, -152, -168, -14, -168, -14, -116]); // rear door + quarter glass
  win([10, -116, 10, -168, 56, -168, 74, -164, 80, -150, 92, -116]); // front door glass
  // faceless passenger and driver silhouettes
  g.ellipse(-84, -140, 10, 12).fill({ color: '#0f1724', alpha: 0.85 });
  g.moveTo(-108, -117).bezierCurveTo(-106, -131, -96, -129, -84, -128).bezierCurveTo(-70, -129, -62, -131, -60, -117).closePath().fill({ color: '#0f1724', alpha: 0.85 });
  g.ellipse(50, -142, 9, 11).fill({ color: '#0f1724', alpha: 0.9 });
  g.moveTo(30, -117).bezierCurveTo(32, -130, 41, -128, 50, -128).bezierCurveTo(60, -129, 66, -130, 68, -117).closePath().fill({ color: '#0f1724', alpha: 0.9 });
  // diagonal reflections
  g.poly([-150, -116, -128, -116, -96, -166, -122, -167]).fill({ color: P.cream, alpha: 0.15 });
  g.poly([-58, -116, -48, -116, -26, -167, -38, -167]).fill({ color: P.cream, alpha: 0.1 });
  g.poly([16, -116, 30, -116, 52, -163, 38, -165]).fill({ color: P.cream, alpha: 0.16 });
  g.moveTo(-182, -116).lineTo(-14, -116).stroke({ width: 1.6, color: '#0a0e15', alpha: 0.7 });
  // window trim
  g.moveTo(-185, -115).lineTo(-178, -150).bezierCurveTo(-172, -166, -162, -171, -150, -171).lineTo(56, -171).bezierCurveTo(78, -171, 87, -161, 94, -146).lineTo(104, -116).stroke({ width: 3, color: '#07090d', alpha: 0.9 });

  // ----- details: roof sign, mirror, bumpers, grille, rear lamp -----
  const d = parts.details;
  d.roundRect(-20, -197, 62, 22, 6).fill('#0b0e14');
  d.roundRect(-17, -194, 56, 16, 4).fill(vgrad([0, '#fbeab4'], [1, '#e8c066']));
  d.roundRect(-14, -192, 50, 4, 2).fill({ color: '#ffffff', alpha: 0.5 });
  const sign = new Text({ text: 'TAXI', style: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: '800', fill: '#2a2216', letterSpacing: 1.6 } });
  sign.resolution = 3; sign.anchor.set(0.5); sign.position.set(11, -186);
  taxi.addChild(sign);
  d.roundRect(-3, -179, 28, 5, 2).fill('#0b0e14');
  // wing mirror
  d.roundRect(86, -140, 14, 9, 4).fill('#0b0e14');
  d.moveTo(90, -131).lineTo(96, -118).stroke({ width: 2.5, color: '#0b0e14' });
  // bumpers
  d.roundRect(210, -50, 28, 15, 7).fill(vgrad([0, tint(CHROME, 0.3)], [1, '#8a9098']));
  d.roundRect(-238, -50, 22, 15, 7).fill(vgrad([0, tint(CHROME, 0.2)], [1, '#8a9098']));
  // nose and grille
  d.moveTo(212, -100).bezierCurveTo(230, -90, 238, -70, 236, -48).lineTo(222, -48).bezierCurveTo(222, -68, 218, -86, 206, -98).closePath().fill('#12161d');
  for (let i = 0; i < 5; i++) d.roundRect(222, -92 + i * 8, 14 - i * 0.6, 3, 1.5).fill({ color: CHROME, alpha: 0.9 });
  d.roundRect(213, -58, 20, 4, 2).fill({ color: CHROME, alpha: 0.8 }); // number-plate recess
  // rear lamp
  d.roundRect(-234, -96, 8, 26, 3).fill(P.brick);
  d.roundRect(-233, -94, 3, 22, 1.5).fill({ color: '#ff9a88', alpha: 0.7 });
  // fender highlight around arches
  for (const cx of WHEEL_X) d.moveTo(cx - 44, -46).arc(cx, -46, 44, Math.PI, 0).stroke({ width: 2, color: BODY_HI, alpha: 0.55 });

  // ----- wheels -----
  const w = parts.wheels;
  for (const cx of WHEEL_X) {
    w.moveTo(cx - 40, -30).arc(cx, -30, 40, Math.PI, 0).closePath().fill('#080a0e'); // arch
    w.circle(cx, -33, 33).fill('#0d1017');
    w.circle(cx, -33, 33).stroke({ width: 2, color: '#262c36' });
    w.circle(cx, -33, 21).fill(vgrad([0, '#d5dadd'], [1, '#8d949b']));
    w.circle(cx, -33, 17).fill('#a9b0b6');
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      w.circle(cx + Math.cos(a) * 9, -33 + Math.sin(a) * 9, 2.6).fill('#4a5058');
    }
    w.circle(cx, -33, 4).fill('#5a626a');
    w.moveTo(cx - 28, -48).arc(cx, -33, 29, Math.PI * 1.15, Math.PI * 1.6).stroke({ width: 2, color: '#ffffff', alpha: 0.1 });
  }

  // ----- lights -----
  const l = parts.lights;
  l.ellipse(206, -80, 30, 18).fill({ color: '#fff0c0', alpha: 0.1 });
  l.circle(206, -80, 13).fill(CHROME);
  l.circle(206, -80, 10).fill(vgrad([0, '#fffbe8'], [1, '#f6dc96']));
  l.circle(203, -83, 3).fill({ color: '#ffffff', alpha: 0.9 });
  l.circle(226, -50, 3.5).fill('#f6dc96');
  l.ellipse(-236, -83, 10, 14).fill({ color: P.brick, alpha: 0.18 });

  return taxi;
}

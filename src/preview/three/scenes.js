import * as THREE from 'three';
import {
  ball, box, cup, cyl, glow, group, lamp, mat, parrot, person, place, skyGradient, suitcase, textPlane, tree, windowGrid,
} from './kit';

const traveller = (x, z, extra = {}) => {
  const p = person({ shirt: '#6f7f4f', pants: '#2b3140', hair: '#1f1a16', pack: '#2a2f3a', ...extra });
  p.rotation.y = Math.PI; // back to camera
  return place(p, x, 0, z);
};

const lightRig = (scene, { sky = '#cfe3f5', ground = '#d9c9a8', hemi = 1.15, sun = '#fff1d6', sunI = 2.4, pos = [4, 7, 6] } = {}) => {
  scene.add(new THREE.HemisphereLight(sky, ground, hemi));
  const d = new THREE.DirectionalLight(sun, sunI);
  d.position.set(...pos);
  d.castShadow = true;
  d.shadow.mapSize.set(1024, 1024);
  Object.assign(d.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  d.shadow.bias = -0.0006; d.shadow.radius = 4;
  scene.add(d);
};

const brickWall = (w, h, d, x, z, color = '#b4694f') => {
  const g = group(box(w, h, d, color, x, 0, z));
  for (let y = 0.5; y < h; y += 0.5) g.add(box(w + 0.02, 0.025, d + 0.02, '#8f4f3b', x, y, z));
  return g;
};

/** 1 — Airport arrivals */
function airport(scene) {
  scene.background = skyGradient('#8fc1ee', '#e3effa');
  scene.fog = new THREE.Fog('#dfe9f3', 14, 34);
  lightRig(scene, { pos: [-3, 7, 6] });
  scene.add(box(30, 0.1, 22, '#d8d6d0', 0, -0.1, -2));
  for (let i = -3; i < 4; i++) scene.add(box(0.02, 0.01, 22, '#c5c3bc', i * 2, 0, -2));
  // window wall
  const wall = group();
  for (let i = -7; i <= 7; i++) wall.add(box(0.12, 4.6, 0.14, '#4a525c', i * 1.2, 0, -4));
  wall.add(box(18, 0.14, 0.16, '#4a525c', 0, 4.5, -4), box(18, 0.14, 0.16, '#4a525c', 0, 2.3, -4));
  wall.add(box(18, 0.9, 0.3, '#8a8f96', 0, 0, -4.05));
  scene.add(wall);
  // roof
  scene.add(box(24, 0.3, 10, '#eceff2', 0, 5.2, -3));
  // aeroplane outside
  const plane = group();
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 4.2, 8, 20), mat('#f4f6f8'));
  fus.rotation.z = Math.PI / 2; plane.add(fus);
  plane.add(box(0.3, 0.05, 0.4, '#2c4f86', -2.4, 0.12, 0), ball(0.04, '#222', 0, 0, 0));
  const wing = box(1.2, 0.08, 4.4, '#e3e8ee', 0.2, -0.12, 0); wing.rotation.y = 0.0; plane.add(wing);
  const fin = box(0.9, 1.3, 0.08, '#2c4f86', -2.3, 0.4, 0); fin.rotation.z = -0.35; plane.add(fin);
  plane.add(box(0.6, 0.06, 1.7, '#e3e8ee', -2.2, 0.2, 0));
  for (const z of [-1.2, 1.2]) plane.add(cyl(0.2, 0.2, 0.6, '#9aa3ad', 0.4, -0.35, z, 16));
  plane.position.set(3, 1.6, -11); plane.rotation.y = 0.35; scene.add(plane);
  scene.add(box(40, 0.1, 14, '#9ba3ab', 0, -0.12, -14));
  // hanging sign
  scene.add(box(0.05, 1.6, 0.05, '#222', -1.4, 3.7, -1.5), box(0.05, 1.6, 0.05, '#222', 1.4, 3.7, -1.5));
  const sign = box(3.4, 1.1, 0.12, '#20262e', 0, 3.4, -1.5);
  scene.add(sign);
  const label = textPlane('', 3.2, 1.0, { bg: '#20262e', fg: '#ffcf4a', lines: ['Arrivals  ↑', 'Border control  ↑'] });
  label.position.set(0, 3.95, -1.43); scene.add(label);
  // border desk + officer
  scene.add(box(2.4, 1.05, 0.7, '#5f6a75', 0.9, 0, -1.4), box(2.5, 0.08, 0.8, '#d9dde1', 0.9, 1.05, -1.4));
  scene.add(box(0.5, 0.3, 0.04, '#222', 1.2, 1.2, -1.2));
  const officer = person({ shirt: '#1e2a3d', pants: '#1e2a3d', hair: '#3a2c20' }); officer.rotation.y = 0.2;
  const cap = cyl(0.2, 0.2, 0.08, '#111', 0, 1.97, 0); officer.add(cap);
  scene.add(place(officer, 0.9, 0, -2.2));
  // background travellers
  [[-3.2, -2.6, '#3b4a63'], [-2.4, -2.4, '#8a4b4b'], [2.9, -2.5, '#5b6b5a'], [3.5, -2.9, '#2b2f3a']].forEach(([x, z, c]) => {
    const p = person({ shirt: c, pants: '#2a2d36', hair: '#201812', scale: 0.95 }); p.rotation.y = Math.PI * 0.9; scene.add(place(p, x, 0, z));
  });
  scene.add(traveller(-1.5, 1.6));
  scene.add(place(suitcase('#2b3a55'), -0.4, 0, 1.4));
  const bird = parrot(); place(bird, -0.4, 1.12, 1.4); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.2, 1.9, 6.6], target: [0.2, 1.6, 0] }, bird, plane };
}

/** 2 — London taxi */
function taxi(scene) {
  scene.background = skyGradient('#9ac8ee', '#f2dcc2');
  scene.fog = new THREE.Fog('#efdcc6', 12, 30);
  lightRig(scene, { pos: [5, 6, 5], sunI: 2.6 });
  scene.add(box(40, 0.1, 30, '#4a4d55', 0, -0.1, -6), box(40, 0.1, 6, '#b9b2a6', 0, 0, 3.4));
  for (let i = -5; i < 6; i++) scene.add(box(0.9, 0.02, 0.12, '#e9e4d3', i * 1.6, 0, -1.5));
  // buildings
  scene.add(brickWall(5, 7, 4, -5.2, -3), brickWall(5, 8, 4, 5.6, -4, '#a8573f'));
  scene.add(windowGrid(4, 3, 0.7, 0.9, 0.55, '#c5dbe8', '#efe6d6', -5.8, 1.2, -0.97));
  scene.add(windowGrid(5, 3, 0.7, 0.9, 0.55, '#c5dbe8', '#efe6d6', 4.8, 1.2, -1.97));
  scene.add(box(3, 6, 2, '#c9b08a', -0.5, 0, -9), box(2.6, 5, 2, '#b4694f', 3, 0, -10));
  // Big Ben-ish tower
  scene.add(box(1.1, 6.5, 1.1, '#cdb88f', 1.2, 0, -12), box(1.3, 0.4, 1.3, '#bfa876', 1.2, 6.5, -12));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.8, 4), mat('#4f6b5a')); roof.position.set(1.2, 7.9, -12); roof.rotation.y = Math.PI / 4; scene.add(roof);
  scene.add(place(new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), mat('#f8f4e6', glow('#fff0c0', 0.4))), 1.2, 5.7, -11.43));
  // red bus
  const bus = group(box(3.4, 1.2, 1.2, '#cf3b2d', 0, 0.3), box(3.4, 1.0, 1.2, '#cf3b2d', 0, 1.5), box(3.42, 0.9, 1.22, '#bfe0ee', 0, 1.55, 0, { opacity: 0.9 }), box(3.42, 0.5, 1.22, '#bfe0ee', 0, 0.55));
  [-1.1, 1.1].forEach((x) => { const w = cyl(0.28, 0.28, 1.25, '#1b1b1b', x, 0, 0, 16); w.rotation.x = Math.PI / 2; w.position.y = 0.28; bus.add(w); });
  bus.position.set(0.6, 0, -6.5); scene.add(bus);
  // taxi
  const cab = group(
    box(2.5, 0.7, 1.15, '#2b2e36', 0, 0.35), box(1.3, 0.62, 1.05, '#2b2e36', -0.15, 1.05),
    box(1.25, 0.45, 1.07, '#9cc0d4', -0.15, 1.12), box(0.5, 0.45, 1.16, '#2b2e36', 1.1, 0.75), box(0.28, 0.12, 0.5, '#ffe58a', 0, 1.7, 0, glow('#ffd35a', 1.2)),
    box(0.06, 0.28, 0.9, '#ddd', 1.28, 0.3), box(0.08, 0.14, 0.2, '#fff5cf', 1.27, 0.55, 0.38, glow('#fff0b0', 1)), box(0.08, 0.14, 0.2, '#fff5cf', 1.27, 0.55, -0.38, glow('#fff0b0', 1)),
  );
  [-0.8, 0.85].forEach((x) => [-0.55, 0.55].forEach((z) => { const w = cyl(0.3, 0.3, 0.2, '#111', x, 0, z, 18); w.rotation.x = Math.PI / 2; w.position.y = 0.3; cab.add(w); }));
  cab.position.set(1.0, 0, -0.6); cab.rotation.y = -0.5; cab.scale.setScalar(1.15); scene.add(cab);
  scene.add(place(lamp(3.4), -1.9, 0, -0.6), place(lamp(3.4), 4.6, 0, -1.8));
  // railing
  for (let i = 0; i < 6; i++) scene.add(box(0.05, 0.9, 0.05, '#1b2227', -3.6 + i * 0.45, 0, 1.9));
  scene.add(box(2.4, 0.05, 0.05, '#1b2227', -2.4, 0.9, 1.9));
  scene.add(place(tree(0.7, 1.5), -4.3, 0, 0.6));
  
  scene.add(traveller(-1.5, 2.4));
  const bird = parrot(); place(bird, -0.1, 0.95, 1.9); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.4, 2.1, 7.6], target: [0.2, 1.8, 0] }, bird };
}

/** 3 — Café */
function cafe(scene) {
  scene.background = new THREE.Color('#e9d9bf');
  scene.fog = new THREE.Fog('#e9d9bf', 12, 26);
  lightRig(scene, { sky: '#fff0d8', ground: '#a8794f', hemi: 1.1, sunI: 1.6, pos: [-4, 6, 5] });
  scene.add(box(20, 0.1, 14, '#a8764a', 0, -0.1, -2));
  for (let i = -8; i < 9; i++) scene.add(box(0.015, 0.01, 14, '#8e603c', i * 0.5, 0, -2));
  scene.add(box(20, 6, 0.2, '#d9c3a0', 0, 0, -4.4), box(20, 0.9, 0.22, '#6b4a32', 0, 0, -4.38));
  // window onto the street
  scene.add(box(2.6, 2.6, 0.1, '#bcd9ec', -3.2, 1.2, -4.28, glow('#bcd9ec', 0.5)), box(0.06, 2.6, 0.12, '#3a2a20', -3.2, 1.2, -4.25), box(2.6, 0.06, 0.12, '#3a2a20', -3.2, 2.5, -4.25));
  // menu board
  scene.add(box(2.4, 1.7, 0.1, '#2a2f2a', 0.9, 2.3, -4.28));
  scene.add(place(textPlane('', 2.2, 1.5, { bg: '#2a2f2a', fg: '#f1ead6', font: '600 {s}px Georgia, serif', lines: ['COFFEE', 'Espresso  2.80', 'Latte  3.50', 'Flat White  3.80', 'Tea  2.50'] }), 0.9, 3.15, -4.21));
  // counter + barista
  scene.add(box(5.2, 1.1, 1.0, '#6b4a32', 1.5, 0, -2.5), box(5.4, 0.1, 1.2, '#c9a678', 1.5, 1.1, -2.5), box(5.0, 0.8, 0.02, '#7d583c', 1.5, 0.2, -1.99));
  scene.add(place(box(0.9, 0.4, 0.5, '#e7ddc9'), 2.9, 1.2, -2.5), place(cyl(0.18, 0.18, 0.3, '#c9d3d6', 0, 0, 0, 16), 0.6, 1.2, -2.5));
  const barista = person({ shirt: '#2b3442', pants: '#2b3442', hair: '#2a1e18', long: true }); barista.rotation.y = -0.15;
  barista.add(box(0.5, 0.55, 0.05, '#2b3442', 0, 0.86, 0.2));
  scene.add(place(barista, 1.7, 0, -3.3));
  // pendants
  [[-2, 3.3], [0.3, 3.5], [2.6, 3.3]].forEach(([x, y], i) => {
    const l = group(cyl(0.012, 0.012, 6 - y, '#222', 0, 0, 0, 6), place(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 20, 1, true), mat('#222', { side: THREE.DoubleSide })), 0, -0.05, 0), ball(0.1, '#fff2c8', 0, -0.12, 0, glow('#ffd88a', 2)));
    l.position.set(x, y, -2.6 + i * 0.1); scene.add(l);
  });
  const pl = new THREE.PointLight('#ffd9a0', 8, 9); pl.position.set(0.3, 3.0, -1.5); scene.add(pl);
  // table & chair
  scene.add(cyl(0.7, 0.7, 0.07, '#f2e6d0', 1.9, 0.78, 0.5, 28), cyl(0.07, 0.07, 0.8, '#3a2a20', 1.9, 0, 0.5, 10), cyl(0.3, 0.3, 0.05, '#3a2a20', 1.9, 0, 0.5, 16));
  scene.add(place(cup(), 1.8, 0.86, 0.45), place(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8), mat('#6fa06a')), 2.15, 0.96, 0.5));
  scene.add(place(ball(0.09, '#f3e9ff', 2.15, 1.1, 0.5), 2.15, 1.1, 0.5));
  const chair = group(box(0.7, 0.07, 0.7, '#9a6a3f', 0, 0.5), box(0.7, 0.9, 0.07, '#9a6a3f', 0, 0.55, -0.32), box(0.06, 0.5, 0.06, '#7d5430', -0.3, 0, 0.3), box(0.06, 0.5, 0.06, '#7d5430', 0.3, 0, 0.3), box(0.06, 0.5, 0.06, '#7d5430', -0.3, 0, -0.3), box(0.06, 0.5, 0.06, '#7d5430', 0.3, 0, -0.3));
  chair.position.set(2.9, 0, 0.6); chair.rotation.y = -0.6; scene.add(chair);
  scene.add(place(tree(0.35, 0.8, '#5d8f4e'), 3.9, 0, -3.6));
  scene.add(traveller(-1.3, 1.1));
  const bird = parrot(); place(bird, 2.9, 1.4, 0.55); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.4, 2.0, 6.4], target: [0.5, 1.5, 0] }, bird };
}

/** 4 — Hotel */
function hotel(scene) {
  scene.background = new THREE.Color('#5a3a26');
  scene.fog = new THREE.Fog('#5a3a26', 12, 24);
  lightRig(scene, { sky: '#ffe9c4', ground: '#6b4a32', hemi: 0.9, sunI: 1.2, pos: [0, 6, 6], sun: '#ffe2b0' });
  scene.add(box(20, 0.1, 14, '#c4b69e', 0, -0.1, -2), box(20, 6, 0.2, '#6b4429', 0, 0, -4));
  for (let i = -6; i < 7; i++) scene.add(box(0.9, 4.4, 0.06, '#7d5233', i * 1.1, 0.4, -3.88), box(0.06, 4.4, 0.08, '#4d3020', i * 1.1 + 0.55, 0.4, -3.86));
  const s = textPlane('', 3.4, 1.4, { bg: '#4a2f1d', fg: '#d9b56a', font: '600 {s}px Georgia, serif', lines: ['THE', 'GRAND HOTEL', 'LONDON'] });
  s.position.set(0, 3.15, -3.8); scene.add(s);
  // desk
  scene.add(box(5, 1.1, 0.9, '#7a4f31', 0.2, 0, -1.9), box(5.2, 0.1, 1.1, '#d2b98e', 0.2, 1.1, -1.9));
  scene.add(box(0.6, 0.4, 0.05, '#222', -0.8, 1.35, -1.9), box(0.5, 0.04, 0.4, '#f0e8d2', 0.7, 1.2, -1.7));
  const rec = person({ shirt: '#20283a', pants: '#20283a', hair: '#251a14', long: true }); rec.rotation.y = 0.15;
  rec.add(box(0.1, 0.03, 0.02, '#d9b56a', 0.1, 1.2, 0.2));
  scene.add(place(rec, 0.2, 0, -2.7));
  // lamp
  scene.add(cyl(0.2, 0.2, 0.05, '#3a2a20', -2.1, 1.2, -1.9, 16), cyl(0.04, 0.04, 0.5, '#3a2a20', -2.1, 1.2, -1.9, 8));
  scene.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.35, 20, 1, true), mat('#fff0cb', { side: THREE.DoubleSide, ...glow('#ffcf80', 1.8) })), -2.1, 1.95, -1.9));
  const pl = new THREE.PointLight('#ffcf80', 6, 8); pl.position.set(-2.1, 2.1, -1.4); scene.add(pl);
  // flowers
  scene.add(cyl(0.12, 0.09, 0.22, '#e7e2d6', 2.1, 1.2, -1.7, 14));
  [[-0.1, 0.1], [0.1, 0.15], [0, 0.22], [0.08, 0.05]].forEach(([dx, dy], i) => scene.add(ball(0.08, ['#f7f1ea', '#f5d0d4', '#fff'][i % 3], 2.1 + dx, 1.5 + dy, -1.7)));
  scene.add(place(tree(0.45, 1.0, '#4f7a47'), 4.0, 0, -2.4), box(0.4, 0.6, 0.4, '#e7e2d6', 4.0, 0, -2.4));
  scene.add(traveller(1.9, 1.5), place(suitcase('#273244'), 0.9, 0, 1.6));
  const bird = parrot(); place(bird, 0.9, 1.12, 1.6); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.2, 2.0, 6.6], target: [0.2, 1.5, 0] }, bird };
}

/** 5 — Tower of London */
function tower(scene) {
  scene.background = skyGradient('#8dc2ec', '#e8f1f8');
  scene.fog = new THREE.Fog('#e6eef5', 14, 36);
  lightRig(scene, { pos: [4, 8, 6], sunI: 2.7 });
  scene.add(box(40, 0.1, 30, '#7fa36a', 0, -0.1, -8), box(30, 0.05, 4, '#d9cfb6', 0, 0, 1.6));
  const stone = '#cdbf9f', dark = '#b8a981';
  scene.add(box(5.2, 3.6, 3.4, stone, 0, 0, -5.4), box(5.4, 0.3, 3.6, dark, 0, 3.6, -5.4));
  for (let i = 0; i < 9; i++) scene.add(box(0.4, 0.35, 0.3, stone, -2.4 + i * 0.6, 3.9, -3.55));
  [[-2.8, -3.8], [2.8, -3.8], [-2.8, -7], [2.8, -7]].forEach(([x, z]) => {
    scene.add(cyl(0.7, 0.7, 5.2, stone, x, 0, z, 20), cyl(0.82, 0.82, 0.3, dark, x, 5.2, z, 20));
    scene.add(place(new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.9, 20), mat('#7b8b9b')), x, 5.95, z));
    scene.add(box(0.14, 0.5, 0.05, '#5f5a4d', x, 3.4, z + 0.7));
  });
  scene.add(box(10, 2.4, 1.2, stone, -5.5, 0, -2.2), box(10, 2.4, 1.2, stone, 5.5, 0, -2.2));
  for (let i = 0; i < 16; i++) { scene.add(box(0.4, 0.35, 0.3, stone, -9.6 + i * 0.62, 2.4, -1.7)); scene.add(box(0.4, 0.35, 0.3, stone, 0.8 + i * 0.62, 2.4, -1.7)); }
  scene.add(box(1.6, 2.2, 0.1, '#4a3a2c', 0, 0, -1.65));
  const flag = group(cyl(0.025, 0.025, 1.1, '#555', 0, 0, 0, 6), box(0.6, 0.38, 0.02, '#c8372d', 0.32, 0.65, 0)); flag.position.set(0, 4.2, -5.4); scene.add(flag);
  scene.userData.flag = flag;
  [[-5, 0.5, -0.9], [4.2, 0.9, -2.5]].forEach(([x, s2, z]) => scene.add(place(tree(0.9 * s2 + 0.3, 2 * s2 + 0.6), x, 0, z)));
  scene.add(place(tree(1, 2.4), -6, 0, -4.5), place(tree(0.8, 2), 6.4, 0, -4.8));
  // wall + sign
  scene.add(box(3.4, 0.6, 0.9, '#bfb08a', -2.2, 0, 1.0));
  scene.add(box(0.1, 1.6, 0.1, '#222', 2.5, 0, 1.6), box(2.0, 1.0, 0.1, '#23303a', 2.5, 1.0, 1.6));
  scene.add(place(textPlane('', 1.9, 0.9, { bg: '#23303a', fg: '#f1ead6', lines: ['TOWER OF LONDON', 'Tickets & Entrance →'] }), 2.5, 1.5, 1.66));
  const officer = person({ shirt: '#1d2740', pants: '#1d2740', hair: '#2a1e18', long: true }); officer.rotation.y = -0.5;
  scene.add(place(officer, 1.0, 0, 1.4));
  scene.add(traveller(-0.7, 2.6));
  const bird = parrot(); place(bird, -2.2, 0.6, 1.0); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.3, 2.3, 8.6], target: [0.3, 2.2, 0] }, bird, flag };
}

/** 6 — Underground */
function underground(scene) {
  scene.background = skyGradient('#a6cdee', '#f0e2cf');
  scene.fog = new THREE.Fog('#efdfca', 12, 30);
  lightRig(scene, { pos: [5, 6, 6], sunI: 2.5 });
  scene.add(box(40, 0.1, 30, '#4a4d55', 0, -0.1, -6), box(40, 0.1, 6, '#b9b2a6', 0, 0, 1));
  scene.add(brickWall(6, 8, 4, -4.8, -3), brickWall(6, 8, 4, 5.4, -3.5, '#a8573f'), brickWall(6, 7, 3, 0.4, -6.5, '#c47a58'));
  scene.add(windowGrid(4, 3, 0.8, 1.0, 0.6, '#c5dbe8', '#efe6d6', -5.6, 1.4, -0.97));
  scene.add(windowGrid(4, 3, 0.8, 1.0, 0.6, '#c5dbe8', '#efe6d6', 4.4, 1.4, -1.47));
  scene.add(place(lamp(3.4), -2.5, 0, 0.5));
  // underground sign
  scene.add(cyl(0.05, 0.05, 3.2, '#222', 2.3, 0, 0.0, 8));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.11, 12, 40), mat('#d52b1e')); ring.position.set(2.3, 3.2, 0); scene.add(ring);
  scene.add(box(1.9, 0.38, 0.1, '#1f3d8f', 2.3, 3.0, 0.14));
  scene.add(place(textPlane('UNDERGROUND', 1.8, 0.3, { fg: '#fff' }), 2.3, 3.0, 0.2));
  // railings
  for (let i = 0; i < 12; i++) scene.add(box(0.05, 1.0, 0.05, '#1b2227', -1.1 + i * 0.5, 0, 0.9));
  scene.add(box(5.6, 0.05, 0.05, '#1b2227', 1.7, 1.0, 0.9));
  scene.add(traveller(-0.4, 2.7));
  const w = person({ shirt: '#cdb99a', pants: '#cdb99a', hair: '#3a2418', long: true, dress: true }); w.rotation.y = -0.7;
  w.add(box(0.28, 0.24, 0.12, '#6b4a32', 0.34, 0.78, 0.1));
  const armUp = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.45, 4, 8), mat('#cdb99a')); armUp.position.set(-0.4, 1.25, 0.15); armUp.rotation.set(0, 0, 1.2); w.add(armUp);
  scene.add(place(w, 1.2, 0, 2.5));
  const bird = parrot(); place(bird, -2.5, 3.78, 0.5); bird.rotation.y = 0.15; scene.add(bird);
  return { cam: { pos: [0.4, 2.2, 7.4], target: [0.4, 1.9, 0] }, bird };
}

export const BUILDERS = [airport, taxi, cafe, hotel, tower, underground];

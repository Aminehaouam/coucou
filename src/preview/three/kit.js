import * as THREE from 'three';

const mats = new Map();
export const mat = (color, o = {}) => {
  const key = color + JSON.stringify(o);
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o }));
  return mats.get(key);
};

export const place = (obj, x = 0, y = 0, z = 0) => { obj.position.set(x, y, z); return obj; };

export const box = (w, h, d, color, x = 0, y = 0, z = 0, o) =>
  place(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, o)), x, y + h / 2, z);

export const cyl = (rt, rb, h, color, x = 0, y = 0, z = 0, seg = 20, o) =>
  place(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, o)), x, y + h / 2, z);

export const ball = (r, color, x = 0, y = 0, z = 0, o) =>
  place(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(color, o)), x, y, z);

export const glow = (color, intensity = 1.6) => ({ emissive: color, emissiveIntensity: intensity });

export const group = (...kids) => { const g = new THREE.Group(); kids.flat().forEach((k) => k && g.add(k)); return g; };

export function textPlane(text, w, h, { bg = null, fg = '#fff', font = '700 {s}px Inter, system-ui, sans-serif', lines } = {}) {
  const px = 512;
  const c = document.createElement('canvas');
  c.width = px; c.height = Math.round((px * h) / w);
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); }
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  const rows = lines ?? [text];
  const s = Math.min(c.height / (rows.length + 0.6), c.width / (Math.max(...rows.map((r) => r.length)) * 0.62));
  g.font = font.replace('{s}', Math.round(s));
  rows.forEach((r, i) => g.fillText(r, c.width / 2, (c.height * (i + 1)) / (rows.length + 1)));
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: 0.9, transparent: !bg }));
}

export function skyGradient(top, bottom) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, top); grad.addColorStop(1, bottom);
  g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function person({ skin = '#e8b98f', shirt = '#4f6b8a', pants = '#2d3748', hair = '#2a2118', pack = null, dress = false, long = false, scale = 1 } = {}) {
  const g = new THREE.Group();
  g.add(box(0.17, 0.78, 0.2, pants, -0.11, 0), box(0.17, 0.78, 0.2, pants, 0.11, 0));
  const torso = place(new THREE.Mesh(new THREE.CapsuleGeometry(0.23, 0.5, 6, 14), mat(shirt)), 0, 1.13, 0);
  torso.scale.z = 0.72; g.add(torso);
  if (dress) g.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.55, 18), mat(shirt)), 0, 0.72, 0));
  const arm = (x) => { const a = place(new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.5, 4, 8), mat(shirt)), x, 1.13, 0); a.rotation.z = x > 0 ? -0.08 : 0.08; return a; };
  g.add(arm(-0.31), arm(0.31));
  g.add(ball(0.055, skin, -0.33, 0.8, 0.0), ball(0.055, skin, 0.33, 0.8, 0.0));
  g.add(cyl(0.07, 0.08, 0.1, skin, 0, 1.55, 0));
  g.add(ball(0.18, skin, 0, 1.78, 0));
  const h = ball(0.19, hair, 0, 1.82, -0.035); h.scale.set(1, 0.92, 1.02); g.add(h);
  if (long) g.add(box(0.36, 0.5, 0.14, hair, 0, 1.38, -0.12));
  if (pack) { g.add(box(0.4, 0.55, 0.22, pack, 0, 0.88, -0.28)); g.add(box(0.3, 0.2, 0.06, pack, 0, 0.9, -0.42)); }
  g.scale.setScalar(scale);
  return g;
}

export function parrot() {
  const g = new THREE.Group();
  const grey = '#8d949c';
  const body = ball(0.16, grey, 0, 0.2, 0); body.scale.set(0.85, 1.25, 0.95); body.rotation.x = -0.25; g.add(body);
  const head = ball(0.12, '#a2a9b0', 0, 0.46, 0.04); g.add(head);
  const face = ball(0.05, '#f2efe8', 0.07, 0.47, 0.1); face.scale.z = 0.5; g.add(face);
  const face2 = ball(0.05, '#f2efe8', -0.07, 0.47, 0.1); face2.scale.z = 0.5; g.add(face2);
  g.add(ball(0.022, '#111', 0.075, 0.49, 0.115), ball(0.022, '#111', -0.075, 0.49, 0.115));
  const beak = place(new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 10), mat('#2a2a2e')), 0, 0.43, 0.15); beak.rotation.x = Math.PI * 0.62; g.add(beak);
  const tail = box(0.1, 0.34, 0.04, '#d6402f', 0, -0.1, -0.12); tail.rotation.x = 0.35; g.add(tail);
  const wing = (x) => { const w = ball(0.1, '#7a8189', x, 0.2, -0.02); w.scale.set(0.35, 1.2, 0.7); return w; };
  g.add(wing(0.13), wing(-0.13));
  g.userData.head = head;
  g.scale.setScalar(1.35);
  return g;
}

export function tree(r = 0.7, h = 1.4, color = '#5d8f4e') {
  const g = new THREE.Group();
  g.add(cyl(0.08, 0.11, h * 0.6, '#6b4a32'));
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat(color, { flatShading: true }));
  place(crown, 0, h * 0.6 + r * 0.7, 0); g.add(crown);
  return g;
}

export function lamp(h = 3.2, color = '#1f2a2e') {
  const g = new THREE.Group();
  g.add(cyl(0.07, 0.1, h, color), cyl(0.12, 0.12, 0.08, color, 0, h - 0.06));
  g.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.22, 0.4, 6), mat('#fff3cf', glow('#ffd88a', 1.2))), 0, h + 0.2, 0));
  g.add(cyl(0.02, 0.2, 0.15, color, 0, h + 0.4, 0, 6));
  return g;
}

export function windowGrid(rows, cols, w, h, gap, color, frame, x0 = 0, y0 = 0, z = 0, o) {
  const g = new THREE.Group();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = x0 + c * (w + gap), y = y0 + r * (h + gap);
    g.add(box(w + 0.08, h + 0.08, 0.04, frame, x, y, z), box(w, h, 0.05, color, x, y + 0.0, z + 0.015, o));
  }
  return g;
}

export function suitcase(color = '#2a3342') {
  const g = new THREE.Group();
  g.add(box(0.42, 0.62, 0.22, color, 0, 0.08), box(0.05, 0.4, 0.05, '#999', 0, 0.7), box(0.2, 0.05, 0.05, '#555', 0, 1.08));
  g.add(ball(0.04, '#111', -0.14, 0.04, 0.05), ball(0.04, '#111', 0.14, 0.04, 0.05));
  return g;
}

export function cup() {
  const g = new THREE.Group();
  g.add(cyl(0.07, 0.05, 0.1, '#f4f1ea'), cyl(0.11, 0.11, 0.012, '#f4f1ea', 0, -0.01, 0, 20));
  return g;
}

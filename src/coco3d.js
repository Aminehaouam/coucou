import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const mat = (color, roughness = 0.8) => new THREE.MeshStandardMaterial({ color, roughness });
const GREY = mat('#9a9ba3');
const DARK = mat('#6c6d77');
const LIGHT = mat('#c9cad0');
const WHITE = mat('#f4f4f4', 0.5);
const BLACK = mat('#15151a', 0.3);
const BEAK = mat('#2e2f38', 0.45);
const RED = mat('#e0343a');

const part = (geo, material, pos, scale = [1, 1, 1], rot = [0, 0, 0]) => {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos);
  m.scale.set(...scale);
  m.rotation.set(...rot);
  return m;
};
const sphere = new THREE.SphereGeometry(1, 48, 32);

/** Coco, the grey parrot with a red tail, built from primitives. Faces +Z. */
export function buildCoco() {
  const coco = new THREE.Group();
  coco.name = 'Coco';

  coco.add(part(sphere, GREY, [0, 1.1, 0], [0.62, 0.95, 0.55], [0.15, 0, 0])); // body
  coco.add(part(sphere, LIGHT, [0, 0.95, 0.3], [0.4, 0.65, 0.3])); // belly
  coco.add(part(sphere, GREY, [0, 2.05, 0.12], [0.58, 0.55, 0.55])); // head
  coco.add(part(sphere, WHITE, [0.38, 2.12, 0.42], [0.2, 0.26, 0.1])); // eye patches
  coco.add(part(sphere, WHITE, [-0.38, 2.12, 0.42], [0.2, 0.26, 0.1]));
  coco.add(part(sphere, BLACK, [0.38, 2.12, 0.5], [0.09, 0.11, 0.06])); // eyes
  coco.add(part(sphere, BLACK, [-0.38, 2.12, 0.5], [0.09, 0.11, 0.06]));

  // beak: hooked upper mandible + lower mandible
  coco.add(part(sphere, BEAK, [0, 1.98, 0.62], [0.2, 0.26, 0.3], [0.5, 0, 0]));
  coco.add(part(sphere, BEAK, [0, 1.8, 0.64], [0.14, 0.1, 0.2]));

  // wings
  for (const s of [1, -1]) {
    coco.add(part(sphere, DARK, [0.6 * s, 1.1, -0.1], [0.2, 0.8, 0.4], [0.2, 0, -0.18 * s]));
  }

  // tail: grey base, red tip
  coco.add(part(sphere, DARK, [0, 0.45, -0.55], [0.22, 0.12, 0.7], [-0.5, 0, 0]));
  coco.add(part(sphere, RED, [0, 0.2, -1.0], [0.28, 0.1, 0.65], [-0.6, 0, 0]));
  coco.add(part(sphere, RED, [0.18, 0.22, -0.95], [0.16, 0.08, 0.55], [-0.6, 0.2, 0]));
  coco.add(part(sphere, RED, [-0.18, 0.22, -0.95], [0.16, 0.08, 0.55], [-0.6, -0.2, 0]));

  // feet
  for (const s of [1, -1]) {
    coco.add(part(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12), DARK, [0.22 * s, 0.22, 0.05]));
    for (const t of [-0.12, 0, 0.12]) {
      coco.add(part(sphere, DARK, [0.22 * s + t * 0.6, 0.05, 0.22], [0.06, 0.05, 0.16]));
    }
  }
  return coco;
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dde4e7');
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
camera.position.set(3.5, 2.2, 5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.1, 0);
controls.autoRotate = true;

scene.add(new THREE.HemisphereLight('#ffffff', '#8892a0', 1.6));
const sun = new THREE.DirectionalLight('#ffffff', 2.2);
sun.position.set(3, 5, 4);
scene.add(sun);

const coco = buildCoco();
scene.add(coco);

const resize = () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
addEventListener('resize', resize);
resize();
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

document.getElementById('export').onclick = () => {
  new GLTFExporter().parse(
    coco,
    (glb) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
      a.download = 'coco.glb';
      a.click();
    },
    console.error,
    { binary: true },
  );
};

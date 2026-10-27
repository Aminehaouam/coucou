import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BUILDERS } from './scenes';

const disposeScene = (scene) => {
  scene.traverse((o) => {
    o.geometry?.dispose();
    const ms = o.material ? [].concat(o.material) : [];
    ms.forEach((m) => { m.map?.dispose(); m.dispose(); });
  });
  scene.background?.dispose?.();
};

/** Renders one of the procedural three.js scenes and reports where Coco is on screen. */
export default function Stage({ index, onAnchor }) {
  const host = useRef(null);
  const api = useRef({});
  const anchorCb = useRef(onAnchor);
  anchorCb.current = onAnchor;
  api.current.index = index;

  useEffect(() => {
    const el = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let noMotion = mq.matches;
    const onMq = (e) => { noMotion = e.matches; };
    mq.addEventListener('change', onMq);

    api.current = { scene: null, built: null, t: 0 };
    const state = api.current;

    const report = () => {
      const { built } = state;
      if (!built) return;
      const v = built.bird.getWorldPosition(new THREE.Vector3());
      v.y += 0.55;
      v.project(camera);
      anchorCb.current?.({ x: (v.x * 0.5 + 0.5) * 100, y: (-v.y * 0.5 + 0.5) * 100 });
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // Keep the framing width constant on narrow canvases.
      camera.fov = w / h < 0.9 ? 52 + (0.9 - w / h) * 22 : 52;
      camera.updateProjectionMatrix();
      report();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    state.load = (i) => {
      if (state.scene) disposeScene(state.scene);
      const scene = new THREE.Scene();
      const built = BUILDERS[i](scene);
      scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      built.index = i; state.scene = scene; state.built = built; state.t = 0;
      camera.position.set(...built.cam.pos);
      camera.lookAt(...built.cam.target);
      resize();
    };

    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const { scene, built } = state;
      if (scene) {
        if (!noMotion) {
          state.t += dt;
          const t = state.t;
          camera.position.x = built.cam.pos[0] + Math.sin(t * 0.35) * 0.25;
          camera.lookAt(...built.cam.target);
          built.bird.children[1].position.y = 0.46 + Math.sin(t * 2.2) * 0.012;
          built.bird.rotation.z = Math.sin(t * 1.4) * 0.05;
          if (built.plane) built.plane.position.x = 3 - Math.min(t * 0.25, 5) + 0;
          if (built.flag) built.flag.rotation.y = Math.sin(t * 2) * 0.25;
        }
        renderer.render(scene, camera);
        report();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    state.load(state.index ?? 0);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      if (state.scene) disposeScene(state.scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (api.current.built?.index !== index) api.current.load?.(index);
  }, [index]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" />;
}

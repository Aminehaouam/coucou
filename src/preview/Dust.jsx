import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Soft floating light motes over a scene photo. Pure decoration, so it stays out of the a11y tree.
export default function Dust({ count = 36 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let noMotion = mq.matches;
    const onMq = (e) => { noMotion = e.matches; };
    mq.addEventListener('change', onMq);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20);
    camera.position.z = 6;

    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speed[i] = 0.08 + Math.random() * 0.18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,248,230,1)');
    grad.addColorStop(1, 'rgba(255,248,230,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const map = new THREE.CanvasTexture(c);

    const material = new THREE.PointsMaterial({
      size: 0.16, map, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geometry, material));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!noMotion) {
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] += speed[i] * dt;
          pos[i * 3] += Math.sin(now / 1800 + i) * 0.04 * dt;
          if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -3;
        }
        geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      geometry.dispose();
      material.dispose();
      map.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count]);

  return <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}

import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { createScene } from './scene';

/**
 * Self-contained PixiJS illustration of the London taxi situation.
 * `onAnchor` receives Coco's position as percentages of the container, for placing a speech bubble.
 */
export default function TaxiScene({ onAnchor, className = 'absolute inset-0', label = 'Illustration: a black London taxi on a brick-lined street' }) {
  const host = useRef(null);
  const cb = useRef(onAnchor);
  useEffect(() => { cb.current = onAnchor; });

  useEffect(() => {
    const el = host.current;
    let cancelled = false;
    let app = null;

    (async () => {
      const a = new Application();
      await a.init({ resizeTo: el, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(window.devicePixelRatio || 1, 2) });
      if (cancelled) { a.destroy(true, { children: true }); return; }
      app = a;
      el.appendChild(a.canvas);
      a.canvas.style.display = 'block';

      const scene = createScene();
      a.stage.addChild(scene.root);
      const fit = () => {
        const { width, height } = a.screen;
        if (!width || !height) return;
        const anchor = scene.layout(width, height);
        cb.current?.(anchor);
      };
      a.renderer.on('resize', fit);
      fit();

      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const tick = (t) => { if (!mq.matches) scene.update(t.deltaMS / 1000); };
      a.ticker.add(tick);
    })();

    return () => {
      cancelled = true;
      if (app) { app.destroy(true, { children: true }); app = null; }
    };
  }, []);

  return <div ref={host} className={className} role="img" aria-label={label} />;
}

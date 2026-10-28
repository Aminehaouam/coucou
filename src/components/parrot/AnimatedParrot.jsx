import { useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { PARROT_MARKUP, PARROT_VIEWBOX } from './parrotMarkup';

// Pivots in the 476 × 740 artwork space.
const PIVOTS = {
  rig: '240 700',
  breath: '240 700',
  'head-group': '235 310',
  'head-fx': '235 310',
  'pose-head': '235 310',
  wing: '225 345',
  'wing-fx': '225 345',
  tail: '185 585',
  'tail-fx': '185 585',
  'pose-tail': '185 585',
  beak: '335 215',
  eyelid: '256 110',
};

const MOODS = {
  neutral: { head: 0, tail: 0 },
  curious: { head: -9, tail: 6 },
};

/**
 * The grey parrot, animated with GSAP. Renders a nested <svg>, so it works both on a page
 * (give it a width/height via className or props) and inside another SVG scene (give it
 * x, y, width, height).
 *
 * Idle breathing, head/wing/tail sway, random blinks and wandering eyes run by themselves.
 * `ref.current.chirp()` and `.blink()` trigger the reactions; clicking chirps too.
 *
 * @param {'neutral'|'curious'} mood   resting head tilt
 * @param {boolean} enter              fly in and land on mount
 * @param {boolean} interactive        click to chirp
 */
export default function AnimatedParrot({
  ref,
  mood = 'neutral',
  enter = false,
  interactive = true,
  title,
  ...svgProps
}) {
  const root = useRef(null);
  const api = useRef({ chirp() {}, blink() {} });
  const moodRef = useRef(mood);

  useImperativeHandle(ref, () => ({ chirp: () => api.current.chirp(), blink: () => api.current.blink() }), []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = (p) => root.current.querySelector(`[data-part="${p}"]`);
    let alive = true;
    const calls = new Set();
    const later = (secs, fn) => {
      const c = gsap.delayedCall(secs, () => {
        calls.delete(c);
        if (alive) fn();
      });
      calls.add(c);
    };

    const ctx = gsap.context(() => {
      for (const [name, origin] of Object.entries(PIVOTS)) gsap.set(q(name), { svgOrigin: origin });
      gsap.set(q('eyelid'), { scaleY: 0 });
      gsap.set(q('pose-head'), { rotation: MOODS[moodRef.current].head });
      gsap.set(q('pose-tail'), { rotation: MOODS[moodRef.current].tail });
      if (reduce) return;

      const sine = { ease: 'sine.inOut', repeat: -1, yoyo: true };
      gsap
        .timeline()
        .to(q('breath'), { scaleX: 1.006, scaleY: 1.014, duration: 1.7, ...sine }, 0)
        .to(q('head-group'), { rotation: -2.6, y: -2, duration: 3.1, ...sine }, 0.25)
        .to(q('wing'), { rotation: 3.5, duration: 2.4, ...sine }, 0.4)
        .to(q('tail'), { rotation: 4.5, duration: 2, ...sine }, 0.15);

      if (enter) {
        gsap
          .timeline()
          .fromTo(q('fly'), { x: 150, y: -420, rotation: 14, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
          .to(q('fly'), { x: 0, y: 0, rotation: 0, duration: 0.95, ease: 'power3.out' }, 0)
          .fromTo(q('wing-fx'), { rotation: 28 }, { rotation: -6, duration: 0.14, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 0)
          .to(q('wing-fx'), { rotation: 0, duration: 0.3, ease: 'power2.out' })
          .to(q('rig'), { scaleX: 1.05, scaleY: 0.95, duration: 0.1, ease: 'power2.in' }, 0.95)
          .to(q('rig'), { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1.1,.4)' });
      }
    }, root);

    // blink: lid drops from the top of the eye; one in four is a double
    ctx.add('blink', () => {
      const t = gsap.timeline();
      const once = () =>
        t
          .to(q('eyelid'), { scaleY: 1, duration: 0.07, ease: 'power2.in' })
          .to(q('eyelid'), { scaleY: 0, duration: 0.12, ease: 'power2.out' }, '+=.04');
      once();
      if (Math.random() < 0.25) once();
    });
    const blinkLoop = () => {
      ctx.blink();
      later(gsap.utils.random(2, 5.5), blinkLoop);
    };
    const lookLoop = () => {
      gsap.to(q('pupil'), { x: gsap.utils.random(-7, 3), y: gsap.utils.random(-3, 5), duration: 0.25, ease: 'power2.out' });
      later(gsap.utils.random(1.5, 4), lookLoop);
    };

    let busy = false;
    ctx.add('chirp', () => {
      if (busy || reduce) return;
      busy = true;
      gsap
        .timeline({ onComplete: () => (busy = false) })
        .to(q('rig'), { scaleX: 1.05, scaleY: 0.94, duration: 0.12, ease: 'power2.out' })
        .to(q('rig'), { y: -34, scaleX: 0.97, scaleY: 1.05, duration: 0.22, ease: 'power2.out' })
        .to(q('wing-fx'), { rotation: 20, duration: 0.12, ease: 'power2.out' }, '<')
        .to(q('head-fx'), { rotation: -7, y: -4, duration: 0.18, ease: 'power2.out' }, '<')
        .to(q('beak'), { rotation: 9, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<.05')
        .to(q('rig'), { y: 0, scaleX: 1.05, scaleY: 0.95, duration: 0.2, ease: 'power2.in' }, '+=.05')
        .to(q('rig'), { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1.1,.4)' })
        .to(q('wing-fx'), { rotation: 0, duration: 0.6, ease: 'elastic.out(1,.35)' }, '<')
        .to(q('head-fx'), { rotation: 0, y: 0, duration: 0.5, ease: 'power2.out' }, '<')
        .to(q('tail-fx'), { rotation: 10, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<');
    });
    api.current = { chirp: () => ctx.chirp(), blink: () => ctx.blink() };

    if (!reduce) {
      later(enter ? 1.6 : gsap.utils.random(0.8, 2), blinkLoop);
      later(gsap.utils.random(1, 2.5), lookLoop);
    }

    return () => {
      alive = false;
      calls.forEach((c) => c.kill());
      ctx.revert();
      api.current = { chirp() {}, blink() {} };
    };
  }, [enter]);

  // Mood changes tween the resting head tilt without restarting anything else.
  useEffect(() => {
    moodRef.current = mood;
    const el = root.current;
    const m = MOODS[mood];
    const t = gsap.to(el.querySelector('[data-part="pose-head"]'), { rotation: m.head, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' });
    const u = gsap.to(el.querySelector('[data-part="pose-tail"]'), { rotation: m.tail, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' });
    return () => {
      t.kill();
      u.kill();
    };
  }, [mood]);

  return (
    <svg
      ref={root}
      viewBox={PARROT_VIEWBOX}
      overflow="visible"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      onClick={interactive ? () => api.current.chirp() : undefined}
      style={interactive ? { cursor: 'pointer' } : undefined}
      {...svgProps}
    >
      <g dangerouslySetInnerHTML={{ __html: PARROT_MARKUP }} />
    </svg>
  );
}

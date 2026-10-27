import { useLayoutEffect, useRef, useState } from 'react';
import TaxiScene from '../../illustrations/london-taxi/TaxiScene.jsx';
import { Close } from '../icons.jsx';

/** Coco's speech bubble, placed above her and clamped inside the hero so it never clips. */
function CocoBubble({ anchor, hostRef, children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const host = hostRef.current, el = ref.current;
    if (!anchor || !host || !el) return;
    const W = host.clientWidth, H = host.clientHeight;
    const bw = el.offsetWidth, bh = el.offsetHeight;
    const ax = (anchor.x / 100) * W, ay = (anchor.y / 100) * H;
    const left = Math.min(Math.max(ax, bw / 2 + 14), W - bw / 2 - 14);
    const tail = Math.max(-bw / 2 + 22, Math.min(bw / 2 - 22, ax - left));
    setPos({ left, top: Math.max(ay - bh - 12, 76), tail });
  }, [anchor, hostRef]);

  return (
    <p
      ref={ref}
      className="coco-in absolute z-10 w-max max-w-[min(15rem,70%)] [transform:translateX(-50%)] rounded-2xl bg-(--ivory) px-3.5 py-2.5 text-[15px]/[1.3] font-medium text-[color:var(--navy)] shadow-[0_10px_24px_-12px_rgb(32_45_64/0.5),0_0_0_1px_rgb(32_45_64/0.06)] after:absolute after:top-full after:left-[calc(50%+var(--tail,0px))] after:-mt-1.5 after:-ml-1.5 after:size-3 after:rotate-45 after:rounded-br-[3px] after:bg-(--ivory) lg:text-base"
      style={pos ? { left: pos.left, top: pos.top, '--tail': `${pos.tail}px` } : { visibility: 'hidden' }}
    >
      <span className="sr-only">Coco the parrot says: </span>
      {children}
    </p>
  );
}

/** Rounded illustration card with one close button and the lesson progress. */
export default function HeroScene({ label, step, steps, coco, onClose }) {
  const hostRef = useRef(null);
  const [anchor, setAnchor] = useState(null);

  return (
    <section
      ref={hostRef}
      aria-label={label}
      className="relative isolate h-[clamp(200px,31svh,560px)] overflow-hidden rounded-[28px] bg-[#cfe0ec] ring-1 ring-(--navy)/10 lg:h-full lg:min-h-[420px]"
    >
      <TaxiScene onAnchor={setAnchor} label={label} />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lesson"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-(--ivory)/90 text-[color:var(--navy)] shadow-[0_4px_14px_-6px_rgb(32_45_64/0.45)] backdrop-blur transition active:scale-95 hover:bg-(--ivory) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--blue)/60"
        >
          <Close />
        </button>
        <div
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={1}
          aria-valuemax={steps}
          aria-valuenow={step}
          aria-valuetext={`Question ${step} of ${steps}`}
          className="grid flex-1 auto-cols-fr grid-flow-col gap-1.5 pr-2"
        >
          {Array.from({ length: steps }, (_, i) => (
            <span key={i} className={`h-1.5 rounded-full ring-1 ${i < step ? 'bg-(--blue) ring-white/60' : 'bg-(--ivory)/65 ring-(--navy)/10'}`} />
          ))}
        </div>
      </header>

      <CocoBubble anchor={anchor} hostRef={hostRef}>{coco}</CocoBubble>
    </section>
  );
}

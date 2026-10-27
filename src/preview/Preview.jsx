import { useState } from 'react';
import Stage from './three/Stage.jsx';

const STEPS = [
  { alt: 'Airport arrivals hall', who: 'Border officer', coco: 'New country, new adventures!', q: 'What is the purpose of your visit?', options: ['Tourism', 'Business', 'Visiting family or friends', 'Study'] },
  { alt: 'A black London taxi', who: 'Taxi driver', coco: 'London already looks amazing!', q: 'Where would you like to go?', options: ['The city centre', 'Your hotel', 'Tower Bridge', 'Something else'] },
  { alt: 'A cosy café counter', who: 'Barista', coco: 'Smells great in here!', q: 'Could I have a cup of tea, please?', options: ['Yes, of course.', 'I’d like a coffee instead.', 'Sorry, we don’t have tea.', 'Just a glass of water.'] },
  { alt: 'Hotel reception desk', who: 'Receptionist', coco: 'You got this!', q: 'I have a reservation under my name.', options: ['Yes, that’s me.', 'No, I don’t have a reservation.', 'Could you repeat that, please?'] },
  { alt: 'The Tower of London', who: 'Ticket officer', coco: 'History is so cool!', q: 'Could you tell me where to buy a ticket?', options: ['At the entrance', 'In the gift shop', 'Online', 'I’m not sure'] },
  { alt: 'A London street by the Underground', who: 'Passer-by', coco: 'Almost there!', q: 'Excuse me, how do I get to the nearest station?', options: [] },
];

const Icon = ({ d, className = 'size-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const ICONS = {
  back: <path d="M15 18l-6-6 6-6" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  speaker: <><path d="M11 5L6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 010 7" /></>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></>,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>,
  next: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export default function Preview() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [anchor, setAnchor] = useState({ x: 50, y: 70 });
  const step = STEPS[i];
  const go = (n) => { setI((n + STEPS.length) % STEPS.length); setPicked(null); };

  return (
    <main className="grid min-h-svh place-items-center bg-base-200 p-4">
      <div className="relative flex h-[min(860px,calc(100svh-2rem))] w-full max-w-[400px] flex-col overflow-hidden rounded-[2.5rem] border border-base-300 bg-[var(--ivory)] shadow-2xl">
        {/* Scene */}
        <section className="relative min-h-0 flex-[1.05]" aria-label={step.alt}>
          <Stage index={i} onAnchor={setAnchor} />
          <div className="absolute inset-x-0 top-0 flex items-center gap-3 p-3 pt-4">
            <button type="button" className="btn btn-circle btn-sm min-h-11 min-w-11 border-0 bg-white/85 shadow" aria-label="Back" onClick={() => go(i - 1)}>
              <Icon d={ICONS.back} />
            </button>
            <span className="rounded-full bg-white/85 px-2 py-0.5 text-sm font-medium text-[var(--navy)]" aria-live="polite">{i + 1}/{STEPS.length}</span>
            <progress className="progress progress-primary h-1.5 flex-1 bg-white/60" value={i + 1} max={STEPS.length} aria-label="Lesson progress" />
            <button type="button" className="btn btn-circle btn-sm min-h-11 min-w-11 border-0 bg-white/85 shadow" aria-label="Close lesson">
              <Icon d={ICONS.close} />
            </button>
          </div>
          <p
            className="absolute w-max max-w-[55%] rounded-2xl bg-white px-3 py-2 text-sm font-medium text-[var(--navy)] shadow"
            style={{ left: `${Math.min(Math.max(anchor.x, 30), 70)}%`, top: `${Math.max(anchor.y, 22)}%`, transform: 'translate(-50%, -100%)' }}
          >
            <span className="sr-only">Coco the parrot says: </span>{step.coco}
          </p>
        </section>

        {/* Sheet */}
        <section className="relative z-10 -mt-7 flex min-h-0 flex-1 flex-col gap-3 rounded-t-[2rem] bg-[var(--ivory)] p-4 pb-5 shadow-[0_-8px_24px_rgb(0_0_0/0.08)]" aria-labelledby="q">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--sage)] text-sm font-semibold text-[var(--navy)]" aria-hidden="true">{step.who[0]}</div>
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-base-200 px-3 py-2.5">
              <button type="button" className="btn btn-ghost btn-circle btn-xs min-h-11 min-w-11 -ml-2 text-[var(--slate-text)]" aria-label={`Listen to ${step.who}`}>
                <Icon d={ICONS.speaker} className="size-4" />
              </button>
              <h1 id="q" className="text-[15px] font-medium leading-snug text-[var(--navy)]"><span className="sr-only">{step.who}: </span>{step.q}</h1>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto" role="group" aria-label="Possible answers">
            {step.options.map((o, n) => (
              <button
                key={o}
                type="button"
                aria-pressed={picked === n}
                onClick={() => setPicked(n)}
                className={`btn min-h-11 justify-start rounded-full border-base-300 px-5 text-left text-sm font-normal normal-case shadow-none ${picked === n ? 'btn-primary !text-white' : 'bg-base-200 text-[var(--navy)] hover:bg-base-300'}`}
              >
                {o}
              </button>
            ))}
            {!step.options.length && <p className="m-auto text-center text-sm text-[var(--slate-text)]">Tap the microphone and answer out loud.</p>}
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="btn btn-circle min-h-11 min-w-11 border-0 bg-base-200 text-[var(--slate-text)]" aria-label="Type instead">
              <Icon d={ICONS.keyboard} />
            </button>
            <button type="button" className="btn btn-primary btn-circle size-16 shadow-lg shadow-primary/30 transition-transform active:scale-95" aria-label="Hold to speak">
              <Icon d={ICONS.mic} className="size-7" />
            </button>
            <button type="button" className="btn btn-circle min-h-11 min-w-11 border-0 bg-base-200 text-[var(--slate-text)]" aria-label="Next question" onClick={() => go(i + 1)}>
              <Icon d={ICONS.next} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

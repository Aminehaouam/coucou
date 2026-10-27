import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TaxiScene from '../illustrations/london-taxi/TaxiScene.jsx';
import { Back, Check, Close, Driver, Keyboard, Mic, Next, Speaker } from './icons.jsx';

const LESSON = {
  step: 2,
  steps: 6,
  scene: 'Illustration: a black London taxi on a brick-lined street',
  coco: 'London already looks amazing!',
  speaker: 'Taxi driver',
  line: 'Where would you like to go?',
  replies: [
    'The city centre, please.',
    'To the Grand Hotel, please.',
    'Tower Bridge, please.',
    'I’m not sure yet. Any ideas?',
  ],
};

function CocoBubble({ anchor, host }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!anchor || !host.current || !ref.current) return;
    const W = host.current.clientWidth, H = host.current.clientHeight;
    const bw = ref.current.offsetWidth, bh = ref.current.offsetHeight;
    const ax = (anchor.x / 100) * W, ay = (anchor.y / 100) * H;
    const left = Math.min(Math.max(ax, bw / 2 + 14), W - bw / 2 - 14);
    const tail = Math.max(-bw / 2 + 22, Math.min(bw / 2 - 22, ax - left));
    setPos({ left, top: Math.max(ay - bh - 12, 72), tail });
  }, [anchor, host]);

  return (
    <p ref={ref} className="coco-bubble" style={pos ? { left: pos.left, top: pos.top, '--tail': `${pos.tail}px` } : { visibility: 'hidden' }}>
      <span className="sr-only">Coco the parrot says: </span>
      {LESSON.coco}
    </p>
  );
}

// On narrow screens the lesson sheet overlaps the bottom of the illustration by this many px.
const SHEET_OVERLAP = 30;
const useSheetInset = () => {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => setInset(mq.matches ? SHEET_OVERLAP : 0);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return inset;
};

export default function Lesson() {
  const inset = useSheetInset();
  const sceneRef = useRef(null);
  const [anchor, setAnchor] = useState(null);
  const [reply, setReply] = useState(null);
  const [listening, setListening] = useState(false);

  return (
    <main className="ref">
      <section className="ref__scene" ref={sceneRef} aria-label={LESSON.scene}>
        <TaxiScene onAnchor={setAnchor} bottomInset={inset} label={LESSON.scene} />
        <header className="ref__bar">
          <button type="button" className="icon-btn icon-btn--glass" aria-label="Back to previous question"><Back /></button>
          <div className="steps-bar" role="progressbar" aria-label="Lesson progress" aria-valuemin={1} aria-valuemax={LESSON.steps} aria-valuenow={LESSON.step} aria-valuetext={`Question ${LESSON.step} of ${LESSON.steps}`}>
            {Array.from({ length: LESSON.steps }, (_, i) => <span key={i} data-done={i < LESSON.step} />)}
          </div>
          <button type="button" className="icon-btn icon-btn--glass" aria-label="Close lesson"><Close /></button>
        </header>
        <CocoBubble anchor={anchor} host={sceneRef} />
      </section>

      <section className="ref__sheet" aria-labelledby="line">
        <div className="sheet__inner">
          <div className="who">
            <Driver />
            <div className="who__bubble">
              <div className="who__head">
                <p className="who__name">{LESSON.speaker}</p>
                <button type="button" className="replay"><Speaker /><span>Hear again</span></button>
              </div>
              <h1 id="line" className="who__line">{LESSON.line}</h1>
            </div>
          </div>

          <fieldset className="replies">
            <legend>Say your reply, or tap one</legend>
            {LESSON.replies.map((text) => (
              <label key={text} className="reply" data-picked={reply === text}>
                <input type="radio" name="reply" value={text} checked={reply === text} onChange={() => setReply(text)} />
                <span className="reply__mark" aria-hidden="true"><Check /></span>
                <span className="reply__text">{text}</span>
              </label>
            ))}
          </fieldset>

          <div className="controls">
            <button type="button" className="icon-btn icon-btn--quiet" aria-label="Type your reply"><Keyboard /></button>
            <div className="mic">
              <button type="button" className="mic__btn" aria-pressed={listening} aria-label={listening ? 'Stop recording' : 'Record your reply'} onClick={() => setListening((v) => !v)} data-on={listening}>
                <Mic />
              </button>
              <span className="mic__caption" aria-live="polite">{listening ? 'Listening…' : 'Tap to speak'}</span>
            </div>
            <button type="button" className="icon-btn icon-btn--go" aria-label="Next question" disabled={!reply}><Next /></button>
          </div>
        </div>
      </section>
    </main>
  );
}

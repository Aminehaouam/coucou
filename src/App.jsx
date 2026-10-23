import { useCallback, useEffect, useRef, useState } from 'react';
import IntroStep from './components/lesson/IntroStep';
import ChoiceStep from './components/lesson/ChoiceStep';
import ImageScene from './components/scene/ImageScene';
import { SCREENS } from './screens';
import './App.css';

// Generated art (scripts/nano-banana.mjs) replaces the hand-drawn SVG scene when present.
const ART = import.meta.glob('./assets/scenes/*.png', { eager: true, query: '?url', import: 'default' });
const artFor = (id) => ART[`./assets/scenes/${id}.png`];

const indexFromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '');
  const i = SCREENS.findIndex((s) => s.id === id);
  return i === -1 ? 0 : i;
};

export default function App() {
  const [index, setIndex] = useState(indexFromHash);
  const [step, setStep] = useState('intro');
  const headingRef = useRef(null);
  const moved = useRef(false);

  const go = useCallback((i) => {
    const next = (i + SCREENS.length) % SCREENS.length;
    window.location.hash = `/${SCREENS[next].id}`;
  }, []);

  useEffect(() => {
    const sync = () => {
      setIndex(indexFromHash());
      setStep('intro');
    };
    const onKey = (e) => {
      if (e.target.closest?.('button') && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.key === 'ArrowRight') go(indexFromHash() + 1);
      if (e.key === 'ArrowLeft') go(indexFromHash() - 1);
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('keydown', onKey);
    };
  }, [go]);

  // After the first change, move focus to the new heading for keyboard and screen-reader users.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    moved.current = true;
  }, [index, step]);

  const screen = SCREENS[index];
  const { Scene } = screen;

  return (
    <main className="screen">
      {artFor(screen.id) ? (
        <ImageScene src={artFor(screen.id)} label={`${screen.label}: ${screen.heading}`} />
      ) : (
        <Scene cocoPose={screen.cocoPose[step]} />
      )}
      <section className="lesson" aria-labelledby="lesson-heading">
        <div className="lesson__content" key={`${screen.id}-${step}`}>
          {step === 'intro' ? (
            <IntroStep screen={screen} headingRef={headingRef} onStart={() => setStep('choice')} />
          ) : (
            <ChoiceStep
              choice={screen.choice}
              headingRef={headingRef}
              onBack={() => setStep('intro')}
              onNext={() => go(index + 1)}
              nextLabel={index === SCREENS.length - 1 ? 'Start over' : 'Next'}
            />
          )}
        </div>
      </section>
    </main>
  );
}

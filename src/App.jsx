import { useEffect, useRef, useState } from 'react';
import LondonScene from './components/scene/LondonScene';
import IntroStep from './components/lesson/IntroStep';
import GreetingStep from './components/lesson/GreetingStep';
import './App.css';

export default function App() {
  const [step, setStep] = useState('intro');
  const headingRef = useRef(null);
  const changed = useRef(false);

  // Move focus to the new heading after the first transition so screen
  // readers and keyboard users land on the new content.
  useEffect(() => {
    if (changed.current) headingRef.current?.focus({ preventScroll: true });
    changed.current = true;
  }, [step]);

  return (
    <main className="screen">
      <LondonScene cocoPose={step === 'intro' ? 'perched' : 'curious'} />
      <section className="lesson" aria-labelledby="lesson-heading">
        <div className="lesson__content" key={step}>
          {step === 'intro' ? (
            <IntroStep headingRef={headingRef} onStart={() => setStep('greeting')} />
          ) : (
            <GreetingStep headingRef={headingRef} onBack={() => setStep('intro')} />
          )}
        </div>
      </section>
    </main>
  );
}

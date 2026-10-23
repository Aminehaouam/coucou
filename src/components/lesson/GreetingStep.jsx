import { useState } from 'react';

const OPTIONS = [
  { text: 'Good morning! Lovely day, isn’t it?', good: true },
  { text: 'Hello. Hotel. Now.', good: false },
  { text: 'Hey you, start driving.', good: false },
];

export default function GreetingStep({ onBack, headingRef }) {
  const [picked, setPicked] = useState(null);
  const choice = picked === null ? null : OPTIONS[picked];

  return (
    <>
      <div className="lesson__top">
        <p className="lesson__label">In the taxi</p>
        <button type="button" className="text-button" onClick={onBack}>
          Back
        </button>
      </div>
      <h1 className="lesson__heading" id="lesson-heading" ref={headingRef} tabIndex={-1}>
        How will you greet the driver?
      </h1>
      <p className="lesson__text" aria-live="polite">
        {choice === null
          ? 'Choose the most natural greeting.'
          : choice.good
            ? 'Lovely. Warm, polite and very British.'
            : 'A little abrupt. Try another one.'}
      </p>
      <div className="choices" role="group" aria-labelledby="lesson-heading">
        {OPTIONS.map((option, i) => {
          const state = picked === i ? (option.good ? 'good' : 'bad') : undefined;
          return (
            <button
              key={option.text}
              type="button"
              className="choice"
              data-state={state}
              aria-pressed={picked === i}
              onClick={() => setPicked(i)}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </>
  );
}

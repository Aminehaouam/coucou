import { useState } from 'react';

export default function ChoiceStep({ choice, onBack, onNext, nextLabel, headingRef }) {
  const [picked, setPicked] = useState(null);
  const current = picked === null ? null : choice.options[picked];
  const solved = Boolean(current?.good);

  return (
    <>
      <div className="lesson__top">
        <p className="lesson__label">{choice.label}</p>
        <button type="button" className="text-button" onClick={solved ? onNext : onBack}>
          {solved ? nextLabel : 'Back'}
        </button>
      </div>
      <h1 className="lesson__heading" id="lesson-heading" ref={headingRef} tabIndex={-1}>
        {choice.heading}
      </h1>
      <p className="lesson__text" aria-live="polite">
        {current === null
          ? 'Choose the most natural reply.'
          : solved
            ? 'Lovely. Clear, polite and very British.'
            : 'A little abrupt. Try another one.'}
      </p>
      <div className="choices" role="group" aria-labelledby="lesson-heading">
        {choice.options.map((option, i) => (
          <button
            key={option.text}
            type="button"
            className="choice"
            data-state={picked === i ? (option.good ? 'good' : 'bad') : undefined}
            aria-pressed={picked === i}
            onClick={() => setPicked(i)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </>
  );
}

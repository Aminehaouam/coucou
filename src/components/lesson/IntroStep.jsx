import AudioPhrase from './AudioPhrase';

export default function IntroStep({ onStart, headingRef }) {
  return (
    <>
      <p className="lesson__label">Exploring London</p>
      <h1 className="lesson__heading" id="lesson-heading" ref={headingRef} tabIndex={-1}>
        Where would you like to go?
      </h1>
      <p className="lesson__text">Ask the driver to take you to your hotel.</p>
      <AudioPhrase phrase="Could you take me to this address, please?" />
      <button type="button" className="primary-button" onClick={onStart}>
        Let's go
      </button>
    </>
  );
}

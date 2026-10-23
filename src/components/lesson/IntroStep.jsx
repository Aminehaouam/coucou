import AudioPhrase from './AudioPhrase';

export default function IntroStep({ screen, onStart, headingRef }) {
  return (
    <>
      <p className="lesson__label">{screen.label}</p>
      <h1 className="lesson__heading" id="lesson-heading" ref={headingRef} tabIndex={-1}>
        {screen.heading}
      </h1>
      <p className="lesson__text">{screen.text}</p>
      <AudioPhrase key={screen.id} phrase={screen.phrase} />
      <button type="button" className="primary-button" onClick={onStart}>
        {screen.button}
      </button>
    </>
  );
}

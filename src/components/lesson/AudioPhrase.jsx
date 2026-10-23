import useSpeech from './useSpeech';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M9 6.8v10.4a.8.8 0 0 0 1.2.7l8.2-5.2a.8.8 0 0 0 0-1.4L10.2 6.1A.8.8 0 0 0 9 6.8Z" fill="currentColor" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.2" fill="currentColor" />
    </svg>
  );
}

export default function AudioPhrase({ phrase }) {
  const { supported, speaking, failed, toggle } = useSpeech(phrase);
  const unavailable = !supported || failed;

  return (
    <div className="audio-phrase">
      <button
        type="button"
        className="audio-phrase__button"
        onClick={toggle}
        aria-disabled={!supported}
        aria-label={speaking ? 'Stop audio' : `Play audio: ${phrase}`}
      >
        {speaking ? <StopIcon /> : <PlayIcon />}
      </button>
      <div className="audio-phrase__body">
        <p className="audio-phrase__text">“{phrase}”</p>
        {unavailable && (
          <p className="audio-phrase__note" role="status">
            Audio isn’t available on this device.
          </p>
        )}
      </div>
    </div>
  );
}

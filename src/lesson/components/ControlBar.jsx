import { Keyboard, Mic, Next } from '../icons.jsx';

const secondary =
  'grid size-13 place-items-center rounded-full border-2 border-(--navy)/25 bg-white text-[color:var(--navy)] transition hover:border-(--navy)/50 active:scale-95 disabled:cursor-not-allowed disabled:border-(--navy)/10 disabled:text-[color:var(--slate)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--blue)/60';

/** Keyboard (left), microphone (centre, primary), next (right). */
export default function ControlBar({ listening, onToggleListening, canContinue, onNext, onType }) {
  return (
    <div role="group" aria-label="Reply controls" className="grid grid-cols-[1fr_auto_1fr] items-center">
      <button type="button" onClick={onType} aria-label="Type your reply" className={`${secondary} justify-self-start`}>
        <Keyboard />
      </button>

      <div className="grid justify-items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleListening}
          aria-pressed={listening}
          aria-label={listening ? 'Stop recording' : 'Record your reply'}
          className={`relative grid size-16 place-items-center rounded-full text-white transition active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-(--blue)/60 lg:size-20 ${
            listening
              ? 'bg-(--brick) shadow-[0_16px_28px_-10px_rgb(185_78_67/0.85),0_0_0_6px_rgb(185_78_67/0.15)]'
              : 'bg-(--blue) shadow-[0_16px_28px_-10px_rgb(54_120_212/0.85),0_0_0_6px_rgb(54_120_212/0.14)] hover:bg-(--blue-hover)'
          }`}
        >
          {listening && <span aria-hidden="true" className="mic-pulse absolute -inset-1.5 rounded-full border-2 border-(--brick)" />}
          <Mic />
        </button>
        <span aria-live="polite" className="text-[0.8125rem] font-medium text-[color:var(--slate-text)]">
          {listening ? 'Listening…' : 'Tap to speak'}
        </span>
      </div>

      <button type="button" onClick={onNext} disabled={!canContinue} aria-label="Next question" className={`${secondary} justify-self-end`}>
        <Next />
      </button>
    </div>
  );
}

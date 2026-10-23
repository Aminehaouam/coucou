import { useCallback, useEffect, useState } from 'react';

const getSynth = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
    ? window.speechSynthesis
    : null;

const langOf = (voice) => voice.lang.replace('_', '-').toLowerCase();

function pickVoice(synth) {
  const voices = synth.getVoices();
  return (
    voices.find((v) => langOf(v) === 'en-gb') ||
    voices.find((v) => langOf(v).startsWith('en-gb')) ||
    voices.find((v) => langOf(v).startsWith('en')) ||
    null
  );
}

/** Speak `text` with a British English voice when one exists. */
export default function useSpeech(text) {
  const [synth] = useState(getSynth);
  const [speaking, setSpeaking] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => synth?.cancel(), [synth]);

  const toggle = useCallback(() => {
    if (!synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(synth);
      utterance.lang = voice?.lang ?? 'en-GB';
      if (voice) utterance.voice = voice;
      utterance.rate = 0.92;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        setSpeaking(false);
        if (e.error && e.error !== 'canceled' && e.error !== 'interrupted') setFailed(true);
      };
      setFailed(false);
      setSpeaking(true);
      synth.speak(utterance);
    } catch {
      setSpeaking(false);
      setFailed(true);
    }
  }, [synth, speaking, text]);

  return { supported: Boolean(synth), speaking, failed, toggle };
}

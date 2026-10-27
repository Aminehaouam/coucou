import { useState } from 'react';
import { LESSON } from './data.js';
import HeroScene from './components/HeroScene.jsx';
import DialogCard from './components/DialogCard.jsx';
import ReplyOptions from './components/ReplyOptions.jsx';
import ControlBar from './components/ControlBar.jsx';

/**
 * Speaking scenario screen. Mobile: hero card, dialog, replies, with the control bar pinned
 * to the bottom. Desktop (lg): hero on the left, conversation panel on the right.
 */
export default function Lesson() {
  const [reply, setReply] = useState(null);
  const [listening, setListening] = useState(false);

  return (
    <main className="lesson-font flex min-h-svh flex-col bg-(--ivory) text-[color:var(--navy)] lg:grid lg:h-svh lg:grid-cols-[minmax(0,1fr)_clamp(440px,36vw,560px)] lg:gap-4 lg:p-4">
      <div className="p-3 pb-0 lg:p-0">
        <HeroScene label={LESSON.scene} step={LESSON.step} steps={LESSON.steps} coco={LESSON.coco} onClose={() => {}} />
      </div>

      <div className="flex flex-1 flex-col lg:overflow-y-auto lg:px-6">
        <div className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col gap-3 px-3 pt-3 lg:justify-center lg:gap-6 lg:px-0">
          <DialogCard speaker={LESSON.speaker} prompt={LESSON.prompt} onReplay={() => {}} />
          <ReplyOptions replies={LESSON.replies} value={reply} onChange={setReply} />
        </div>

        <div className="sticky bottom-0 z-20 mt-3 bg-(--ivory)/92 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur lg:static lg:bg-transparent lg:pb-0 lg:backdrop-blur-none">
          <div className="mx-auto w-full max-w-[34rem] px-6 lg:px-0">
            <ControlBar
              listening={listening}
              onToggleListening={() => setListening((v) => !v)}
              canContinue={Boolean(reply)}
              onNext={() => {}}
              onType={() => {}}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

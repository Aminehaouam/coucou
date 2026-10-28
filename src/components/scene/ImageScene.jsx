import { Railing, SceneFrame } from './parts';
import AnimatedParrot from '../parrot/AnimatedParrot';
import { PARROT_ASPECT } from '../parrot/parrotMarkup';
import './Coco.css';

const COCO_HEIGHT = 100; // scene units, feet on the railing at y = 416
const COCO_WIDTH = COCO_HEIGHT * PARROT_ASPECT;

/** A painted scene filling the top area, with a stone railing and Coco standing on it. */
export default function ImageScene({ src, label, pose = 'neutral', cocoX = 296 }) {
  // The old cut-out poses collapse to two moods: the suitcase pose was a prop, so it reads as curious.
  const mood = pose === 'neutral' ? 'neutral' : 'curious';
  return (
    <SceneFrame label={label}>
      <image className="scene__art" href={src} x="0" y="0" width="390" height="450" preserveAspectRatio="xMidYMax slice" />
      <Railing />
      <g transform={`translate(${cocoX} 0) scale(-1 1) translate(${-cocoX} 0)`}>
        <AnimatedParrot
          enter
          mood={mood}
          title="Coco the parrot. Tap to hear him chirp."
          x={cocoX - COCO_WIDTH / 2}
          y={416 - COCO_HEIGHT}
          width={COCO_WIDTH}
          height={COCO_HEIGHT}
        />
      </g>
    </SceneFrame>
  );
}

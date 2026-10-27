import { Railing, SceneFrame } from './parts';
import cocoNeutral from '../../assets/coco/neutral.png';
import cocoCurious from '../../assets/coco/curious.png';
import cocoSuitcase from '../../assets/coco/suitcase.png';
import './Coco.css';

// Cut-outs from the asset sheet: [image, width, height] in scene units, feet at the bottom.
const COCO = {
  neutral: [cocoNeutral, 59, 100],
  curious: [cocoCurious, 75, 100],
  suitcase: [cocoSuitcase, 90, 96],
};

/** A painted scene filling the top area, with a stone railing and Coco standing on it. */
export default function ImageScene({ src, label, pose = 'neutral', cocoX = 296 }) {
  const [href, w, h] = COCO[pose] ?? COCO.neutral;
  const cx = cocoX;
  return (
    <SceneFrame label={label}>
      <image href={src} x="0" y="0" width="390" height="450" preserveAspectRatio="xMidYMax slice" />
      <Railing />
      <g aria-hidden="true" transform={`translate(${cx} 0) scale(-1 1) translate(${-cx} 0)`}>
        <g className="coco--animated">
          <image className="coco__upper" href={href} x={cx - w / 2} y={416 - h} width={w} height={h} />
        </g>
      </g>
    </SceneFrame>
  );
}

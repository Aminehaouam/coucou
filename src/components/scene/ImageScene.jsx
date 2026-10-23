import { SceneFrame } from './parts';

/** A generated illustration filling the scene area, anchored to its bottom edge. */
export default function ImageScene({ src, label }) {
  return (
    <SceneFrame label={label}>
      <image href={src} x="0" y="0" width="390" height="450" preserveAspectRatio="xMidYMax slice" />
    </SceneFrame>
  );
}

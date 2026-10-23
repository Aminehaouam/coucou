import './Coco.css';

// Poses are small offsets applied to the head, wing and tail so a future
// scene can change Coco's mood without redrawing him.
export const COCO_POSES = {
  perched: { head: 0, wing: 0, tail: 0 },
  curious: { head: -11, wing: -3, tail: 7 },
  proud: { head: 5, wing: 2, tail: -4 },
};

const BODY = '#3F464F';
const WING = '#646C76';
const WING_LINE = '#4D545D';
const BEAK = '#1B222B';
const TAIL = '#B94E43';
const FEET = '#2A3038';

/**
 * Coco the African Grey, drawn in local coordinates with his feet at (0, 0)
 * and facing left. `x`/`y` place his feet inside the parent <svg>.
 * He has a beak but deliberately no eyes or other facial features.
 */
export default function Coco({
  x = 0,
  y = 0,
  scale = 1,
  flip = false,
  pose = 'perched',
  animated = true,
  className = '',
}) {
  const p = typeof pose === 'string' ? COCO_POSES[pose] ?? COCO_POSES.perched : pose;
  const sx = flip ? -scale : scale;

  return (
    <g
      className={`coco ${animated ? 'coco--animated' : ''} ${className}`.trim()}
      transform={`translate(${x} ${y}) scale(${sx} ${scale})`}
      aria-hidden="true"
    >
      {/* feet stay planted while the upper body bobs */}
      <g fill="none" stroke={FEET} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-5 -6V-1M-9.5 0H-1.5" />
        <path d="M4 -6V-1M-0.5 0H7.5" />
      </g>

      <g className="coco__upper">
        <g transform={`rotate(${p.tail} 6 -10)`}>
          <path d="M5 -14C14 -9 24 3 31 15L22.5 18C14 9 6 -1 -1 -8Z" fill={TAIL} />
        </g>

        <path
          d="M-10 -44C-21 -38-21 -16-9 -6C-4 -2 6 -2 11 -8C17 -18 16 -38 6 -45C0 -48-6 -47-10 -44Z"
          fill={BODY}
        />

        <g transform={`rotate(${p.wing} -5 -38)`}>
          <path
            d="M-8 -40C-17 -28-10 -10 6 -3L12.5 -6C15 -19 10 -34-8 -40Z"
            fill={WING}
          />
          <path
            d="M-2 -30C-3 -20 1 -12 7 -8"
            fill="none"
            stroke={WING_LINE}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>

        <g transform={`rotate(${p.head} -4 -46)`}>
          <g className="coco__head">
            <circle cx="-7" cy="-55" r="10.5" fill={BODY} />
            <path d="M-15 -59C-25 -60-27 -50-21 -45C-21.5 -50-18.5 -52.5-14 -52.5Z" fill={BEAK} />
          </g>
        </g>
      </g>
    </g>
  );
}

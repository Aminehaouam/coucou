import './Coco.css';

// Poses are small offsets applied to the head, wing and tail so a future
// scene can change Coco's mood without redrawing him.
export const COCO_POSES = {
  perched: { head: 0, wing: 0, tail: 0 },
  curious: { head: -11, wing: -3, tail: 7 },
  proud: { head: 5, wing: 2, tail: -4 },
};

const BODY = '#3B424B';
const BODY_LIGHT = '#59626C';
const WING = '#69727C';
const WING_LIGHT = '#7D8791';
const BEAK = '#1B222B';
const TAIL = '#B94E43';
const TAIL_DARK = '#923D35';
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
      <g fill="none" stroke={FEET} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-4 -6V-2M-9 1Q-6.5 -1 -4 -2Q-1 -1 1 1" />
        <path d="M5 -6V-2M0 1Q2.5 -1 5 -2Q8 -1 10 1" />
      </g>

      <g className="coco__upper">
        <g transform={`rotate(${p.tail} 6 -10)`}>
          <path d="M3 -14L11 -10L26 17L21 19L19.5 15L15 20L11 14L6 16L-2 -6Z" fill={TAIL} />
          <path d="M13 -4L21 14M8 0L12 13" stroke={TAIL_DARK} strokeWidth="1.2" strokeLinecap="round" />
        </g>

        <path
          d="M-9 -47C-18 -38-17 -20-9 -8C-6 -3 3 -2 8 -7C14 -16 14 -36 8 -45C4 -50-5 -51-9 -47Z"
          fill={BODY}
        />
        <path d="M-13 -33q3 3.5 6.5 0M-13 -25q3 3.5 6.5 0M-12 -17q3 3.5 6.5 0M-6 -38q3 3.5 6.5 0" fill="none" stroke={BODY_LIGHT} strokeWidth="1.4" strokeLinecap="round" />

        <g transform={`rotate(${p.wing} -5 -40)`}>
          <path d="M-6 -42C-15 -32-11 -14 0 -4L18 9C19 -6 13 -30-6 -42Z" fill={WING} />
          <path d="M-3 -36C-9 -26-6 -14 2 -6L12 3C10 -10 6 -26-3 -36Z" fill={WING_LIGHT} opacity="0.55" />
          <path d="M-1 -30C-3 -20 2 -11 9 -4M4 -32C4 -22 9 -12 14 -4" fill="none" stroke={BODY} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>

        <g transform={`rotate(${p.head} -4 -47)`}>
          <g className="coco__head">
            <path d="M-14 -55C-14 -64-2 -66 3 -60C6 -56 4 -47-5 -46C-11 -46-14 -50-14 -55Z" fill={BODY} />
            <path d="M-8 -62q4 -3 9 0" fill="none" stroke={BODY_LIGHT} strokeWidth="1.3" strokeLinecap="round" />
            <path d="M-12 -60C-23 -62-28 -52-20 -43C-20.5 -49-17.5 -52-12 -52Z" fill={BEAK} />
            <path d="M-19 -45C-17 -42-13 -43-12 -49Z" fill="#303842" />
          </g>
        </g>
      </g>
    </g>
  );
}

export const GROUND = 305;

const GLASS = '#2E3D55';

function SashWindow({ x, y, w, h, trim, lintel = true }) {
  return (
    <g>
      {lintel && <rect x={x - 2} y={y - 4} width={w + 4} height="3" fill={trim} />}
      <rect x={x} y={y} width={w} height={h} fill={GLASS} />
      <path
        d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 3}H${x + w}M${x} ${y + (2 * h) / 3}H${x + w}`}
        stroke={trim}
        strokeWidth="1"
        opacity="0.9"
      />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={trim} strokeWidth="1.6" />
      <rect x={x - 2} y={y + h} width={w + 4} height="2.5" fill={trim} />
    </g>
  );
}

function Door({ cx, color, trim }) {
  return (
    <g>
      <rect x={cx - 11} y={GROUND - 56} width="22" height="56" fill={trim} />
      <path d={`M${cx - 8} ${GROUND - 42}A8 8 0 0 1 ${cx + 8} ${GROUND - 42}Z`} fill={GLASS} />
      <rect x={cx - 8} y={GROUND - 42} width="16" height="38" fill={color} />
      <rect x={cx - 4.5} y={GROUND - 36} width="9" height="12" rx="1" fill="#000" opacity="0.12" />
      <circle cx={cx + 4} cy={GROUND - 22} r="1.2" fill={trim} />
      <rect x={cx - 13} y={GROUND - 4} width="26" height="4" fill={trim} />
      <rect x={cx - 15} y={GROUND - 2} width="30" height="2" fill="#000" opacity="0.12" />
    </g>
  );
}

function Chimney({ x, top, color, shade }) {
  return (
    <g>
      <rect x={x} y={top - 22} width="11" height="24" fill={color} />
      <rect x={x + 8} y={top - 22} width="3" height="24" fill={shade} />
      <rect x={x - 1} y={top - 25} width="13" height="4" fill={shade} />
      <rect x={x + 2} y={top - 31} width="3" height="6" fill="#A5604F" />
      <rect x={x + 7} y={top - 30} width="3" height="5" fill="#A5604F" />
    </g>
  );
}

function House({ x, w, top, wall, shade, trim, cols, doorAt, doorColor, chimneys = [] }) {
  const colX = (i) => x + (w / cols) * (i + 0.5);
  const ww = cols === 2 ? 20 : 16;
  const upper = [
    { y: top + 20, h: 15, w: ww - 3 },
    { y: GROUND - 158, h: 34, w: ww },
    { y: GROUND - 112, h: 40, w: ww },
  ];

  return (
    <g>
      {chimneys.map((c) => (
        <Chimney key={c} x={x + c} top={top} color={wall} shade={shade} />
      ))}
      <rect x={x} y={top - 6} width={w} height={GROUND - top + 6} fill={wall} />
      <rect x={x - 1.5} y={top - 6} width={w + 3} height="3" fill={shade} />
      <rect x={x - 1.5} y={top - 3} width={w + 3} height="6" fill={trim} />
      <rect x={x} y={top + 3} width={w} height="3" fill="#000" opacity="0.1" />
      <rect x={x} y={GROUND - 64} width={w} height="3" fill={trim} opacity="0.85" />
      <rect x={x} y={GROUND - 12} width={w} height="12" fill={shade} />

      {upper.map((row) =>
        Array.from({ length: cols }, (_, i) => (
          <SashWindow
            key={`${row.y}-${i}`}
            x={colX(i) - row.w / 2}
            y={row.y}
            w={row.w}
            h={row.h}
            trim={trim}
          />
        )),
      )}

      {Array.from({ length: cols }, (_, i) =>
        i === doorAt ? (
          <Door key={i} cx={colX(i)} color={doorColor} trim={trim} />
        ) : (
          <SashWindow key={i} x={colX(i) - ww / 2} y={GROUND - 52} w={ww} h={30} trim={trim} />
        ),
      )}

      <rect x={x + w - 4} y={top - 6} width="4" height={GROUND - top + 6} fill="#000" opacity="0.09" />
    </g>
  );
}

export default function Buildings() {
  return (
    <g>
      <House x={-8} w={114} top={100} wall="#A9473D" shade="#8E3A32" trim="#EADFC9"
        cols={3} doorAt={1} doorColor="#202D40" chimneys={[18, 82]} />
      <House x={106} w={106} top={92} wall="#F1E8D8" shade="#D8CCB4" trim="#FAF9F6"
        cols={3} doorAt={2} doorColor="#3678D4" chimneys={[58]} />
      <House x={212} w={104} top={104} wall="#B5594D" shade="#984639" trim="#EADFC9"
        cols={3} doorAt={0} doorColor="#A9B9A1" chimneys={[26, 86]} />
      <House x={316} w={92} top={96} wall="#A9B9A1" shade="#92A58A" trim="#F1E8D8"
        cols={2} doorAt={1} doorColor="#202D40" chimneys={[48]} />
    </g>
  );
}

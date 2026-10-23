const BODY = '#161C27';
const BELT = '#2A3547';

/** Side view of a black London cab, facing right. Wheels touch y = 40 locally. */
export default function Taxi({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="62" cy="40" rx="66" ry="3.5" fill="#000" opacity="0.14" />
      <rect x="40" y="-5" width="16" height="5" rx="1.5" fill="#F1E8D8" />
      <path
        d="M0 33V19Q0 13 6 12L13 11Q17 0 28 0H66Q74 0 80 8L90 17L112 20Q122 21 122 28V33Z"
        fill={BODY}
      />
      <path d="M19 11Q22 4.5 29 4.5H64Q69 4.5 73 9L80 16H18Z" fill="#AEBBC4" />
      <rect x="44" y="4.5" width="3" height="11.5" fill={BODY} />
      <rect x="0" y="21" width="122" height="2.5" fill={BELT} />
      <rect x="1" y="24" width="4" height="5" rx="1" fill="#B94E43" />
      <path d="M116 24h6v5h-6z" fill="#F1E8D8" />
      <rect x="81" y="22" width="9" height="2" rx="1" fill={BELT} />
      <g>
        <circle cx="26" cy="32" r="10.5" fill="#0B1018" />
        <circle cx="26" cy="32" r="8" fill="#1E2430" />
        <circle cx="26" cy="32" r="3.5" fill="#737B82" />
        <circle cx="98" cy="32" r="10.5" fill="#0B1018" />
        <circle cx="98" cy="32" r="8" fill="#1E2430" />
        <circle cx="98" cy="32" r="3.5" fill="#737B82" />
      </g>
    </g>
  );
}

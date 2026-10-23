const RED = '#B94E43';

/** Traditional pillar box. Origin is the centre of its base on the pavement. */
export default function Postbox({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="2" cy="0" rx="20" ry="3" fill="#000" opacity="0.12" />
      <rect x="-14" y="-52" width="28" height="46" fill={RED} />
      <rect x="7" y="-52" width="7" height="46" fill="#000" opacity="0.1" />
      <path d="M-16.5 -48C-16.5 -64 16.5 -64 16.5 -48Z" fill="#A5443A" />
      <rect x="-17" y="-50" width="34" height="3" rx="1" fill="#8F3A32" />
      <rect x="-10" y="-38" width="20" height="4.5" rx="2.25" fill="#202D40" />
      <rect x="-7" y="-27" width="14" height="8" rx="1" fill="#F1E8D8" opacity="0.9" />
      <rect x="-17" y="-8" width="34" height="8" rx="1.5" fill="#8F3A32" />
    </g>
  );
}

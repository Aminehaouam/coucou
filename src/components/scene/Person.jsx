export const SKIN = { light: '#EBC9A8', tan: '#D3A47C', deep: '#8A5A3E' };

/**
 * Faceless flat-vector person. Feet at (0, 0), roughly 78 units tall.
 * `armL` / `armR` are outward swing angles in degrees (0 = hanging).
 */
export default function Person({
  x = 0,
  y = 0,
  scale = 1,
  flip = false,
  skin = SKIN.light,
  hair = '#2B2420',
  hairStyle = 'short',
  top = '#202D40',
  bottom = '#3A4252',
  skirt = false,
  apron = null,
  armL = 6,
  armR = 6,
  holding = null,
  className = '',
}) {
  const arm = (side, angle) => (
    <g transform={`translate(${side * 11} -55) rotate(${side < 0 ? angle : -angle})`}>
      <rect x="-2.6" y="0" width="5.2" height="24" rx="2.6" fill={top} />
      <circle cy="25.5" r="3" fill={skin} />
    </g>
  );

  return (
    <>
    <ellipse cx="0" cy="0" rx="13" ry="2.8" fill="#000" opacity="0.13" transform={`translate(${x} ${y}) scale(${scale})`} />
    <g className={className} transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} aria-hidden="true">
      {hairStyle === 'long' && <rect x="-9" y="-77" width="18" height="26" rx="8" fill={hair} />}
      {skirt ? (
        <>
          <rect x="-6" y="-26" width="4.5" height="24" fill="#2B2F38" />
          <rect x="2" y="-26" width="4.5" height="24" fill="#2B2F38" />
          <path d="M-11 -36L-14 -18H14L11 -36Z" fill={bottom} />
        </>
      ) : (
        <>
          <rect x="-7.5" y="-34" width="6.5" height="32" rx="2" fill={bottom} />
          <rect x="1" y="-34" width="6.5" height="32" rx="2" fill={bottom} />
        </>
      )}
      <rect x="-9" y="-3" width="8.5" height="3" rx="1.5" fill="#161C27" />
      <rect x="0.5" y="-3" width="8.5" height="3" rx="1.5" fill="#161C27" />

      {arm(-1, armL)}
      <path d="M-11.5 -56Q-11 -61 -5 -61H5Q11 -61 11.5 -56L10.5 -31H-10.5Z" fill={top} />
      <path d="M2 -60H5Q11 -60 11.5 -56L10.5 -31H4Z" fill="#000" opacity="0.1" />
      <path d="M-3.5 -61L0 -52L3.5 -61Z" fill="#fff" opacity="0.5" />
      <rect x="-10.5" y="-33" width="21" height="3.5" fill="#000" opacity="0.18" />
      {apron && <path d="M-8 -46H8L9 -20H-9Z" fill={apron} />}
      {arm(1, armR)}

      <rect x="-3" y="-64" width="6" height="7" fill={skin} />
      <circle cx="0" cy="-70" r="8" fill={skin} />
      {hairStyle !== 'none' && hairStyle !== 'cap' && (
        <path d="M-8.6 -69A8.6 8.6 0 0 1 8.6 -69Q3 -73.5 -8.6 -69Z" fill={hair} />
      )}
      {hairStyle === 'bun' && <circle cx="0" cy="-80" r="4.2" fill={hair} />}
      {hairStyle === 'cap' && <path d="M-9 -71Q0 -82 9 -71L12 -69.5H-9Z" fill={hair} />}
      {holding === 'passport' && <rect x="-14" y="-38" width="6" height="8" rx="1" fill="#B94E43" />}
    </g>
    </>
  );
}

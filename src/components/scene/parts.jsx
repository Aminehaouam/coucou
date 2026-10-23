import './LondonScene.css';

/** Shared frame: every scene is a 390 × 450 SVG that fills the top 53% of the screen. */
export function SceneFrame({ label, background = '#DDE4E7', children }) {
  return (
    <div className="scene" style={{ background }}>
      <svg className="scene__svg" viewBox="0 0 390 450" preserveAspectRatio="xMidYMax slice" role="img" aria-label={label}>
        {children}
      </svg>
    </div>
  );
}

export function Cloud({ x, y, scale = 1, className = '', fill = '#F3F5F4' }) {
  return (
    <g className={`cloud ${className}`}>
      <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
        <rect x="0" y="14" width="96" height="16" rx="8" />
        <circle cx="30" cy="14" r="14" />
        <circle cx="54" cy="9" r="17" />
        <circle cx="74" cy="17" r="10" />
      </g>
    </g>
  );
}

/** Stone balustrade; its top surface sits at y = 408 so Coco's feet go at y ≈ 414. */
export function Railing() {
  const balusters = Array.from({ length: 21 }, (_, i) => 6 + i * 20);
  return (
    <g>
      <rect x="-20" y="428" width="430" height="30" fill="#BDB29A" />
      {balusters.map((bx) => (
        <g key={bx}>
          <rect x={bx} y="428" width="9" height="15" rx="3" fill="#E4DAC6" />
          <rect x={bx + 6} y="428" width="3" height="15" rx="1.5" fill="#CFC4AE" />
        </g>
      ))}
      <rect x="-20" y="443" width="430" height="20" fill="#D9CFBA" />
      <rect x="-20" y="443" width="430" height="3" fill="#C6BAA3" />
      <rect x="-20" y="408" width="430" height="10" fill="#F1E8D8" />
      <rect x="-20" y="418" width="430" height="10" fill="#D9CFBA" />
      <rect x="-20" y="418" width="430" height="2" fill="#000" opacity="0.06" />
    </g>
  );
}

/** Wooden floor with plank joints. */
export function WoodFloor({ y, color = '#B58A62', line = '#A57A55' }) {
  const rows = [];
  for (let ry = y + 14, i = 0; ry < 460; ry += 20 + i * 3, i += 1) rows.push(ry);
  return (
    <g>
      <rect x="-20" y={y} width="430" height={470 - y} fill={color} />
      {rows.map((ry, i) => (
        <g key={ry} stroke={line} strokeWidth="1">
          <path d={`M-20 ${ry}H410`} />
          {Array.from({ length: 6 }, (_, k) => (
            <path key={k} d={`M${(k * 83 + i * 41) % 430 - 20} ${ry}v${20 + i * 3}`} />
          ))}
        </g>
      ))}
    </g>
  );
}

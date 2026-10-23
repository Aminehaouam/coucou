import Buildings from './Buildings';
import Coco from './Coco';
import Postbox from './Postbox';
import Taxi from './Taxi';
import './LondonScene.css';

const CLOUD = '#F3F5F4';

function Cloud({ x, y, scale = 1, className }) {
  return (
    <g className={`cloud ${className}`}>
      <g transform={`translate(${x} ${y}) scale(${scale})`} fill={CLOUD}>
        <rect x="0" y="14" width="96" height="16" rx="8" />
        <circle cx="30" cy="14" r="14" />
        <circle cx="54" cy="9" r="17" />
        <circle cx="74" cy="17" r="10" />
      </g>
    </g>
  );
}

function Lamppost({ x }) {
  return (
    <g fill="#202D40">
      <rect x={x - 1.5} y="236" width="3" height="112" />
      <rect x={x - 5} y="338" width="10" height="10" rx="1" />
      <path d={`M${x - 6} 236L${x - 3.5} 224H${x + 3.5}L${x + 6} 236Z`} />
      <rect x={x - 4} y="236" width="8" height="3" fill="#F1E8D8" />
      <circle cx={x} cy="221" r="2.5" />
    </g>
  );
}

function Railing() {
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

/**
 * The London street. Purely illustrative, so it is exposed as one image
 * with a description rather than as individual elements.
 */
export default function LondonScene({ cocoPose = 'perched' }) {
  return (
    <div className="scene">
      <svg
        className="scene__svg"
        viewBox="0 0 390 450"
        preserveAspectRatio="xMidYMax slice"
        role="img"
        aria-label="A London street of brick Georgian houses with a black taxi and a red postbox. Coco, a small grey parrot with a red tail, perches on a stone railing in the foreground."
      >
        <rect x="-200" y="-300" width="790" height="620" fill="#DDE4E7" />
        <Cloud x={46} y={46} scale={1} className="cloud--a" />
        <Cloud x={238} y={28} scale={0.8} className="cloud--b" />
        <Cloud x={312} y={72} scale={0.55} className="cloud--c" />

        <Buildings />

        {/* pavement, kerb and road */}
        <rect x="-20" y="305" width="430" height="46" fill="#E4DCCB" />
        <path
          d="M36 305V348M108 305V348M180 305V348M252 305V348M324 305V348M396 305V348M-20 327H410"
          stroke="#D2C9B6"
          strokeWidth="1"
        />
        <rect x="-20" y="348" width="430" height="6" fill="#F1E8D8" />
        <rect x="-20" y="354" width="430" height="4" fill="#B9B2A4" />
        <rect x="-20" y="358" width="430" height="52" fill="#7B838A" />
        <path d="M-20 404H410" stroke="#F1E8D8" strokeWidth="2" strokeDasharray="22 16" opacity="0.55" />

        <Lamppost x={209} />
        <Postbox x={346} y={346} scale={1.1} />
        <Taxi x={30} y={346} scale={1.4} />

        <Railing />
        <Coco x={282} y={414} scale={1.25} pose={cocoPose} />
      </svg>
    </div>
  );
}

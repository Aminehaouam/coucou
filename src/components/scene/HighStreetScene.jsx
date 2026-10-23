import Coco from './Coco';
import Person, { SKIN } from './Person';
import { SashWindow } from './Buildings';
import { Cloud, SceneFrame } from './parts';

const GLASS = '#BFD0DA';

function Stripes({ x, w, a, b }) {
  const n = Math.round(w / 10);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x + (w / n) * i} y="238" width={w / n} height="20" fill={i % 2 ? b : a} />
      ))}
      <path d={`M${x} 258q${w / 4} 6 ${w / 2} 0t${w / 2} 0`} fill="none" stroke={a} strokeWidth="3" opacity="0.8" />
    </g>
  );
}

function Shop({ x, w, top, wall, shade, trim, awnA, awnB, door }) {
  const cols = 2;
  const cx = (i) => x + (w / cols) * (i + 0.5);
  return (
    <g>
      <rect x={x} y={top - 6} width={w} height={305 - top + 6} fill={wall} />
      <rect x={x - 1.5} y={top - 6} width={w + 3} height="3" fill={shade} />
      <rect x={x - 1.5} y={top - 3} width={w + 3} height="6" fill={trim} />
      {[top + 22, top + 66].map((wy) => (
        [0, 1].map((i) => <SashWindow key={`${wy}-${i}`} x={cx(i) - 9} y={wy} w={18} h={32} trim={trim} />)
      ))}
      <rect x={x} y="228" width={w} height="10" fill={shade} />
      <rect x={x + 6} y="258" width={w - 12} height="47" fill="#2E3D55" opacity="0.18" />
      <rect x={x + 6} y="258" width={w * 0.58} height="42" fill={GLASS} />
      <path d={`M${x + 6 + w * 0.29} 258V300`} stroke={trim} strokeWidth="2.5" />
      <rect x={x + 6} y="258" width={w * 0.58} height="42" fill="none" stroke={trim} strokeWidth="3" />
      <rect x={x + w * 0.68} y="262" width={w * 0.22} height="43" fill={door} />
      <Stripes x={x + 2} w={w - 4} a={awnA} b={awnB} />
      <rect x={x + w - 4} y={top - 6} width="4" height={305 - top + 6} fill="#000" opacity="0.09" />
    </g>
  );
}

function Park() {
  return (
    <g>
      <rect x="258" y="270" width="140" height="35" fill="#A9B9A1" />
      <circle cx="318" cy="216" r="34" fill="#A9B9A1" />
      <circle cx="294" cy="240" r="24" fill="#92A58A" />
      <circle cx="346" cy="236" r="28" fill="#8FA286" />
      <rect x="314" y="238" width="7" height="34" fill="#6E4F38" />
      <rect x="258" y="290" width="140" height="4" fill="#202D40" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={262 + i * 12} y="280" width="3" height="25" fill="#202D40" />
      ))}
    </g>
  );
}

function Bus({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="80" cy="0" rx="86" ry="3.5" fill="#000" opacity="0.14" />
      <rect x="0" y="-78" width="160" height="70" rx="8" fill="#B94E43" />
      <rect x="0" y="-44" width="160" height="4" fill="#9C3F36" />
      <rect x="0" y="-18" width="160" height="10" fill="#9C3F36" />
      {[10, 36, 62, 88, 114].map((wx) => (
        <g key={wx}>
          <rect x={wx} y="-70" width="21" height="20" rx="3" fill="#F1E8D8" />
          <rect x={wx} y="-36" width="21" height="22" rx="3" fill="#F1E8D8" />
        </g>
      ))}
      <rect x="140" y="-36" width="16" height="28" rx="3" fill="#EBC9A8" opacity="0" />
      <rect x="138" y="-36" width="18" height="24" rx="3" fill="#DDE4E7" />
      <rect x="6" y="-76" width="40" height="3" fill="#202D40" opacity="0" />
      <circle cx="30" cy="-6" r="11" fill="#0B1018" />
      <circle cx="30" cy="-6" r="4" fill="#737B82" />
      <circle cx="122" cy="-6" r="11" fill="#0B1018" />
      <circle cx="122" cy="-6" r="4" fill="#737B82" />
    </g>
  );
}

export default function HighStreetScene({ cocoPose = 'curious' }) {
  return (
    <SceneFrame label="An English high street with brick shopfronts, a small park, a red double-decker bus and two pedestrians. Coco, a small grey parrot with a red tail, perches on a street sign bracket with his head tilted.">
      <rect x="-200" y="-300" width="790" height="640" fill="#DDE4E7" />
      <Cloud x={30} y={54} scale={0.9} className="cloud--a" />
      <Cloud x={250} y={34} scale={0.65} className="cloud--b" />

      <Shop x={-10} w={140} top={112} wall="#A9473D" shade="#8E3A32" trim="#EADFC9" awnA="#A9B9A1" awnB="#F1E8D8" door="#202D40" />
      <Shop x={130} w={128} top={100} wall="#F1E8D8" shade="#D8CCB4" trim="#FAF9F6" awnA="#202D40" awnB="#F1E8D8" door="#B94E43" />
      <Park />

      {/* pavement, kerb, road */}
      <rect x="-20" y="305" width="430" height="56" fill="#E4DCCB" />
      <path d="M40 305V358M120 305V358M200 305V358M280 305V358M360 305V358M-20 332H410" stroke="#D2C9B6" strokeWidth="1" />
      <rect x="-20" y="358" width="430" height="5" fill="#F1E8D8" />
      <rect x="-20" y="363" width="430" height="4" fill="#B9B2A4" />
      <rect x="-20" y="367" width="430" height="50" fill="#7B838A" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={196 + i * 18} y="371" width="11" height="42" fill="#F1E8D8" opacity="0.8" />
      ))}
      <path d="M-20 392H180M270 392H410" stroke="#F1E8D8" strokeWidth="2" strokeDasharray="20 14" opacity="0.5" />

      {/* pedestrians */}
      <Person x={164} y={346} scale={0.95} top="#3678D4" bottom="#3A4252" hairStyle="long" hair="#4A3022" skin={SKIN.tan} armL={6} armR={36} />
      <rect x="176" y="326" width="8" height="10" rx="2" fill="#F1E8D8" />
      <Person x={218} y={350} scale={0.95} top="#A9B9A1" bottom="#202D40" hairStyle="short" hair="#2B2420" skin={SKIN.deep} armL={6} armR={6} />
      <Person x={96} y={349} scale={0.9} top="#202D40" bottom="#737B82" hairStyle="short" hair="#9A9A9A" skin={SKIN.light} armL={8} armR={8} flip />

      <Bus x={10} y={406} />

      {/* foreground pavement and sign post */}
      <rect x="-20" y="417" width="430" height="5" fill="#F1E8D8" />
      <rect x="-20" y="422" width="430" height="40" fill="#E4DCCB" />
      <path d="M-20 436H410M70 422V460M170 422V460M270 422V460M370 422V460" stroke="#D2C9B6" strokeWidth="1" />
      <ellipse cx="302" cy="438" rx="14" ry="3" fill="#000" opacity="0.1" />
      <rect x="299" y="300" width="6" height="138" fill="#202D40" />
      <rect x="282" y="298" width="46" height="6" rx="3" fill="#202D40" />
      <rect x="244" y="306" width="54" height="15" rx="2" fill="#202D40" />
      <text x="271" y="317" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff" fontFamily="Inter, system-ui, sans-serif">High Street</text>
      <rect x="252" y="324" width="46" height="14" rx="2" fill="#3678D4" />
      <text x="275" y="334.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff" fontFamily="Inter, system-ui, sans-serif">Station</text>

      <Coco x={308} y={298} scale={1.2} pose={cocoPose} />
    </SceneFrame>
  );
}

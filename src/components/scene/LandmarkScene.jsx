import Coco from './Coco';
import Person, { SKIN } from './Person';
import { Cloud, Railing, SceneFrame } from './parts';

const STONE = '#D8D0BF';
const STONE_DARK = '#C4BBA7';
const STONE_LIGHT = '#E9E3D4';

function Column({ x }) {
  return (
    <g>
      <rect x={x - 11} y="186" width="22" height="7" fill={STONE_LIGHT} />
      <rect x={x - 7} y="193" width="14" height="124" fill={STONE_LIGHT} />
      <rect x={x + 2} y="193" width="5" height="124" fill={STONE_DARK} opacity="0.55" />
      <path d={`M${x - 2.5} 195V315`} stroke={STONE_DARK} strokeWidth="1" />
      <rect x={x - 10} y="317" width="20" height="8" fill={STONE_LIGHT} />
    </g>
  );
}

function Tree({ x }) {
  return (
    <g>
      <rect x={x - 3} y="290" width="6" height="52" fill="#6E4F38" />
      <circle cx={x} cy="268" r="30" fill="#A9B9A1" />
      <circle cx={x - 22} cy="286" r="20" fill="#92A58A" />
      <circle cx={x + 20} cy="282" r="22" fill="#8FA286" />
    </g>
  );
}

export default function LandmarkScene({ cocoPose = 'perched' }) {
  const cols = [88, 132, 176, 220, 264, 308];
  return (
    <SceneFrame label="A grand stone museum with a columned portico, a ticket kiosk, a few visitors and a tree. Coco, a small grey parrot with a red tail, lands on the stone railing in the foreground." background="#E3EAEA">
      <rect x="-200" y="-300" width="790" height="640" fill="#E3EAEA" />
      <circle cx="318" cy="64" r="22" fill="#F6F1E4" />
      <Cloud x={40} y={50} scale={0.9} className="cloud--a" />
      <Cloud x={236} y={26} scale={0.7} className="cloud--b" />

      {/* side wings */}
      <rect x="-20" y="214" width="106" height="120" fill={STONE} />
      <rect x="-20" y="208" width="106" height="8" fill={STONE_LIGHT} />
      <rect x="304" y="214" width="106" height="120" fill={STONE} />
      <rect x="304" y="208" width="106" height="8" fill={STONE_LIGHT} />
      {[12, 50, 332, 366].map((wx) => (
        <g key={wx}>
          <rect x={wx} y="236" width="18" height="40" fill="#2E3D55" />
          <rect x={wx - 2} y="232" width="22" height="4" fill={STONE_LIGHT} />
          <path d={`M${wx + 9} 236V276`} stroke={STONE_LIGHT} strokeWidth="1.5" />
        </g>
      ))}

      {/* portico */}
      <path d="M58 174L198 106L338 174Z" fill={STONE_DARK} />
      <path d="M82 170L198 114L314 170Z" fill="#DDD5C4" />
      <circle cx="198" cy="150" r="9" fill={STONE_DARK} opacity="0.7" />
      <rect x="56" y="172" width="284" height="14" fill={STONE} />
      <rect x="56" y="184" width="284" height="3" fill="#000" opacity="0.08" />
      <rect x="72" y="186" width="252" height="140" fill="#A79F8C" />
      <rect x="164" y="248" width="68" height="78" rx="2" fill="#3A4252" />
      <path d="M198 248V326" stroke="#2A3240" strokeWidth="2" />
      <rect x="176" y="204" width="44" height="14" fill="#202D40" opacity="0.2" />
      <rect x="153" y="192" width="14" height="62" fill="#B94E43" />
      <rect x="158" y="192" width="4" height="62" fill="#F1E8D8" opacity="0.7" />
      <rect x="229" y="192" width="14" height="62" fill="#3678D4" />
      <rect x="234" y="192" width="4" height="62" fill="#F1E8D8" opacity="0.7" />
      {cols.map((cx) => <Column key={cx} x={cx} />)}

      {/* steps and plaza */}
      <rect x="52" y="325" width="292" height="7" fill={STONE_LIGHT} />
      <rect x="40" y="332" width="316" height="8" fill={STONE} />
      <rect x="28" y="340" width="340" height="8" fill={STONE_LIGHT} />
      <rect x="-20" y="348" width="430" height="62" fill="#E4DCCB" />
      <path d="M-20 372H410M60 348V410M150 348V410M240 348V410M330 348V410" stroke="#D2C9B6" strokeWidth="1" />

      {/* ticket kiosk */}
      <rect x="6" y="300" width="64" height="46" fill="#F1E8D8" />
      <rect x="0" y="292" width="76" height="10" rx="2" fill="#202D40" />
      <rect x="14" y="310" width="38" height="22" fill="#2E3D55" />
      <rect x="10" y="332" width="46" height="5" fill="#C9A57E" />
      <rect x="14" y="274" width="46" height="14" rx="3" fill="#3678D4" />
      <text x="37" y="284.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff" fontFamily="Inter, system-ui, sans-serif">Tickets</text>
      <Person x={33} y={334} scale={0.5} top="#B94E43" bottom="#202D40" hairStyle="short" hair="#2B2420" skin={SKIN.tan} armL={10} armR={10} />
      <rect x="2" y="324" width="68" height="22" fill="#F1E8D8" />
      <rect x="2" y="324" width="68" height="3" fill="#E1D6C0" />

      <Tree x={362} />

      {/* visitors */}
      <Person x={118} y={392} scale={0.95} top="#3678D4" bottom="#3A4252" hairStyle="long" hair="#5A3A28" skin={SKIN.tan} armL={10} armR={44} />
      <Person x={150} y={388} scale={0.92} top="#A9B9A1" bottom="#202D40" hairStyle="short" hair="#2B2420" skin={SKIN.light} armL={6} armR={8} />
      <rect x="164" y="372" width="9" height="12" rx="2" fill="#B94E43" />
      <Person x={226} y={384} scale={0.88} top="#F1E8D8" bottom="#737B82" hairStyle="bun" hair="#8A8A8A" skin={SKIN.light} armL={6} armR={6} skirt />

      <Railing />
      <Coco x={304} y={414} scale={1.2} pose={cocoPose} />
    </SceneFrame>
  );
}

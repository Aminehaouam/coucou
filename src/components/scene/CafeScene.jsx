import Coco from './Coco';
import Person, { SKIN } from './Person';
import { SceneFrame, WoodFloor } from './parts';

function Pendant({ x, drop }) {
  return (
    <g>
      <path d={`M${x} 0V${drop}`} stroke="#202D40" strokeWidth="1.5" />
      <path d={`M${x - 18} ${drop + 16}Q${x - 18} ${drop} ${x} ${drop}Q${x + 18} ${drop} ${x + 18} ${drop + 16}Z`} fill="#202D40" />
      <rect x={x - 6} y={drop + 16} width="12" height="3" rx="1.5" fill="#F7E3B0" />
    </g>
  );
}

export default function CafeScene({ cocoPose = 'perched' }) {
  return (
    <SceneFrame label="A cosy English café with a window, a chalkboard menu, a counter with a server, and a table set for tea. Coco, a small grey parrot with a red tail, perches on the back of an empty wooden chair.">
      <rect x="-20" y="-300" width="430" height="610" fill="#F1E8D8" />
      <rect x="-20" y="236" width="430" height="96" fill="#A9B9A1" />
      <rect x="-20" y="232" width="430" height="6" fill="#FAF9F6" />
      <path d="M-20 262H410M-20 290H410" stroke="#98AA90" strokeWidth="1.5" />

      <Pendant x={104} drop={58} />
      <Pendant x={262} drop={44} />

      {/* window onto the street */}
      <rect x="22" y="98" width="158" height="146" fill="#DDE4E7" />
      <rect x="22" y="196" width="158" height="48" fill="#B5594D" />
      <path d="M36 206h18v20H36zM70 206h18v20H70zM104 206h18v20h-18zM138 206h18v20h-18z" fill="#EADFC9" />
      <rect x="14" y="90" width="174" height="8" fill="#FAF9F6" />
      <rect x="14" y="244" width="174" height="8" fill="#FAF9F6" />
      <path d="M101 98V244M22 171H180" stroke="#FAF9F6" strokeWidth="5" />
      <rect x="22" y="98" width="158" height="146" fill="none" stroke="#FAF9F6" strokeWidth="6" />

      {/* chalkboard menu */}
      <rect x="216" y="92" width="100" height="122" rx="4" fill="#8A6A4C" />
      <rect x="222" y="98" width="88" height="110" rx="2" fill="#202D40" />
      <text x="266" y="120" textAnchor="middle" fontSize="13" fontWeight="600" fill="#F1E8D8" fontFamily="Inter, system-ui, sans-serif">Menu</text>
      <path d="M232 138h44M232 154h56M232 170h38M232 186h50" stroke="#F1E8D8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M294 138h8M294 154h8M294 170h8M294 186h8" stroke="#B94E43" strokeWidth="2.5" strokeLinecap="round" />

      {/* counter and server */}
      <Person x={348} y={312} scale={1.05} top="#FAF9F6" bottom="#202D40" apron="#A9B9A1" hairStyle="bun" hair="#6B4A32" skin={SKIN.tan} armL={32} armR={40} />
      <rect x="300" y="300" width="110" height="34" fill="#8A6A4C" />
      <rect x="296" y="292" width="118" height="9" rx="2" fill="#C9A57E" />
      <path d="M312 292v-10q0-18 18-18t18 18v10Z" fill="#DDE4E7" opacity="0.85" />
      <rect x="306" y="290" width="48" height="4" fill="#F1E8D8" />
      <rect x="326" y="278" width="12" height="9" rx="3" fill="#B94E43" />

      <WoodFloor y="332" />
      <rect x="-20" y="328" width="430" height="6" fill="#FAF9F6" />
      <rect x="296" y="332" width="118" height="6" fill="#000" opacity="0.08" />

      {/* table set for tea */}
      <ellipse cx="116" cy="436" rx="30" ry="6" fill="#000" opacity="0.12" />
      <rect x="111" y="384" width="10" height="52" fill="#202D40" />
      <ellipse cx="116" cy="436" rx="22" ry="5" fill="#202D40" />
      <ellipse cx="116" cy="384" rx="64" ry="14" fill="#E4D9C3" />
      <ellipse cx="116" cy="380" rx="64" ry="14" fill="#FAF9F6" />
      <g>
        <path d="M84 366q0 14 14 14h6q14 0 14-14Z" fill="#FAF9F6" />
        <path d="M84 366h32" stroke="#E4D9C3" strokeWidth="1.5" />
        <path d="M114 370q10 0 10 7" fill="none" stroke="#FAF9F6" strokeWidth="3" />
        <path d="M86 354q2-8 10-8h8q8 0 10 8Z" fill="#B94E43" />
        <rect x="95" y="342" width="10" height="4" rx="2" fill="#B94E43" />
      </g>
      <ellipse cx="146" cy="378" rx="14" ry="4" fill="#E4D9C3" />
      <path d="M135 364q0 12 11 12t11-12Z" fill="#FAF9F6" />
      <ellipse cx="146" cy="364.5" rx="11" ry="2.5" fill="#A9743E" />
      <rect x="62" y="364" width="14" height="18" rx="2" fill="#B94E43" />
      <path d="M65 370h8M65 374h6" stroke="#F1E8D8" strokeWidth="1.5" />

      {/* chair with Coco on its back rail */}
      <rect x="256" y="364" width="64" height="8" rx="4" fill="#6E4F38" />
      <path d="M262 372V404M290 372V404M314 372V404" stroke="#6E4F38" strokeWidth="5" strokeLinecap="round" />
      <rect x="252" y="402" width="74" height="10" rx="4" fill="#8A6A4C" />
      <path d="M260 412V458M318 412V458" stroke="#6E4F38" strokeWidth="6" strokeLinecap="round" />
      <Coco x={296} y={364} scale={1.2} pose={cocoPose} />
    </SceneFrame>
  );
}

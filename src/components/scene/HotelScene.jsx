import Coco from './Coco';
import Person, { SKIN } from './Person';
import { SceneFrame, WoodFloor } from './parts';

function KeyBoard() {
  const keys = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 4; c += 1) keys.push([62 + c * 18, 142 + r * 20]);
  }
  return (
    <g>
      <rect x="50" y="116" width="92" height="98" rx="4" fill="#6E4F38" />
      <rect x="55" y="121" width="82" height="88" rx="2" fill="#8A6A4C" />
      {keys.map(([kx, ky]) => (
        <g key={`${kx}-${ky}`}>
          <path d={`M${kx} ${ky - 8}v8`} stroke="#E4D9C3" strokeWidth="1.5" />
          <circle cx={kx} cy={ky + 3} r="3.5" fill="#C9A57E" />
        </g>
      ))}
    </g>
  );
}

export default function HotelScene({ cocoPose = 'perched' }) {
  return (
    <SceneFrame label="A welcoming hotel reception with a wooden desk, a rack of room keys, framed pictures and a receptionist. Coco, a small grey parrot with a red tail, stands on the edge of the reception counter.">
      <rect x="-20" y="-300" width="430" height="620" fill="#F1E8D8" />
      <rect x="-20" y="196" width="430" height="140" fill="#A9B9A1" />
      <rect x="-20" y="192" width="430" height="7" fill="#FAF9F6" />
      <path d="M-20 232H410M-20 296H410" stroke="#98AA90" strokeWidth="1.5" />
      <path d="M62 196V336M148 196V336M234 196V336M320 196V336M406 196V336" stroke="#98AA90" strokeWidth="1.5" />

      <KeyBoard />

      {/* framed pictures */}
      <rect x="236" y="92" width="76" height="60" fill="#6E4F38" />
      <rect x="241" y="97" width="66" height="50" fill="#DDE4E7" />
      <path d="M241 135l18-20 14 12 12-16 22 24v12h-66z" fill="#A9B9A1" />
      <circle cx="288" cy="111" r="5" fill="#F1E8D8" />
      <rect x="326" y="104" width="38" height="48" fill="#202D40" />
      <rect x="331" y="109" width="28" height="38" fill="#F1E8D8" />
      <path d="M336 138q8-22 18 0" stroke="#B94E43" strokeWidth="3" fill="none" />

      {/* wall light */}
      <path d="M196 136l-12 20h24z" fill="#FAF9F6" />
      <rect x="194" y="116" width="4" height="22" fill="#202D40" />
      <circle cx="196" cy="108" r="3" fill="#202D40" />

      <WoodFloor y="334" color="#C49A6E" line="#B38A5F" />
      <rect x="-20" y="330" width="430" height="6" fill="#FAF9F6" />

      {/* plant */}
      <path d="M352 360l-6-40M362 360l8-52M372 360l16-38" stroke="#8FA286" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="344" cy="316" rx="12" ry="7" fill="#A9B9A1" transform="rotate(-30 344 316)" />
      <ellipse cx="371" cy="304" rx="12" ry="7" fill="#8FA286" transform="rotate(20 371 304)" />
      <ellipse cx="388" cy="322" rx="12" ry="7" fill="#A9B9A1" transform="rotate(40 388 322)" />
      <path d="M346 360h32l-4 34h-24Z" fill="#B94E43" />

      {/* receptionist behind the desk */}
      <Person x={150} y={376} scale={1.3} top="#202D40" bottom="#202D40" hairStyle="bun" hair="#3A2A22" skin={SKIN.light} armL={22} armR={26} />
      <rect x="147" y="300" width="8" height="5" fill="#F1E8D8" />

      {/* reception desk */}
      <rect x="-20" y="354" width="338" height="104" fill="#9C7650" />
      <path d="M12 366h84v72H12zM108 366h84v72h-84zM204 366h84v72h-84z" fill="none" stroke="#876544" strokeWidth="2" />
      <rect x="-24" y="342" width="348" height="14" rx="3" fill="#C9A57E" />
      <rect x="-24" y="342" width="348" height="3" fill="#DDBF9C" />
      <rect x="318" y="348" width="6" height="110" fill="#000" opacity="0.1" />

      {/* desk details */}
      <path d="M226 342q0-12 14-12t14 12Z" fill="#737B82" />
      <rect x="238" y="326" width="4" height="4" rx="2" fill="#4A5058" />
      <rect x="76" y="334" width="34" height="8" rx="1" fill="#FAF9F6" />
      <path d="M80 337h24" stroke="#C9CDD0" strokeWidth="1.5" />

      {/* suitcase waiting in front of the desk */}
      <rect x="18" y="392" width="54" height="64" rx="8" fill="#202D40" />
      <path d="M32 392v-10h26v10" fill="none" stroke="#4A5058" strokeWidth="4" strokeLinejoin="round" />
      <rect x="18" y="414" width="54" height="5" fill="#F1E8D8" opacity="0.85" />

      <Coco x={288} y={343} scale={1.2} pose={cocoPose} />
    </SceneFrame>
  );
}

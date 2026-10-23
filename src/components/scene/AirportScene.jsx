import Coco from './Coco';
import Person, { SKIN } from './Person';
import SpeechBubble from './SpeechBubble';
import { SceneFrame } from './parts';

function Booth({ x, officer }) {
  return (
    <g>
      {officer}
      <rect x={x} y="236" width="92" height="30" fill="#BFD0DA" opacity="0.75" />
      <rect x={x} y="236" width="92" height="30" fill="none" stroke="#9BA6AD" strokeWidth="2" />
      <rect x={x - 4} y="264" width="100" height="8" rx="2" fill="#202D40" />
      <rect x={x - 2} y="272" width="96" height="48" fill="#F1E8D8" />
      <rect x={x + 6} y="282" width="36" height="26" rx="2" fill="#E1D6C0" />
      <rect x={x + 56} y="284" width="26" height="4" rx="2" fill="#3678D4" />
    </g>
  );
}

function Stanchion({ x }) {
  return (
    <g>
      <rect x={x - 1.5} y="356" width="3" height="40" fill="#202D40" />
      <circle cx={x} cy="355" r="3.5" fill="#202D40" />
      <ellipse cx={x} cy="397" rx="9" ry="3" fill="#202D40" />
    </g>
  );
}

export default function AirportScene({ cocoPose = 'perched' }) {
  const mullions = [14, 104, 195, 285, 372];
  return (
    <SceneFrame label="An airport arrivals hall with immigration booths, queue barriers and a large window onto the runway. Coco, a small grey parrot with a red tail, perches on the handle of a blue suitcase.">
      <rect x="-20" y="-300" width="430" height="624" fill="#ECE9E2" />
      <rect x="-20" y="-300" width="430" height="374" fill="#F6F4EF" />

      {/* hanging sign */}
      <path d="M150 0V76M240 0V76" stroke="#737B82" strokeWidth="2" />
      <rect x="118" y="74" width="154" height="30" rx="5" fill="#202D40" />
      <text x="190" y="95" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff" fontFamily="Inter, system-ui, sans-serif">Arrivals</text>
      <path d="M244 89h14m-5-5l5 5-5 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* windows onto the apron */}
      <rect x="14" y="112" width="362" height="142" fill="#DDE4E7" />
      <rect x="14" y="214" width="362" height="40" fill="#AAB1B5" />
      <rect x="14" y="212" width="362" height="3" fill="#C4C9CB" />
      <g>
        <rect x="108" y="190" width="150" height="22" rx="11" fill="#FAF9F6" />
        <path d="M226 192L252 152H266L258 194Z" fill="#3678D4" />
        <path d="M120 198H246" stroke="#C9CDD0" strokeWidth="3" strokeDasharray="4 6" />
        <rect x="152" y="212" width="16" height="3" fill="#737B82" />
      </g>
      {mullions.map((mx) => (
        <rect key={mx} x={mx - 2} y="112" width="4" height="142" fill="#B8BEC2" />
      ))}
      <rect x="12" y="110" width="366" height="146" fill="none" stroke="#B8BEC2" strokeWidth="3" />

      {/* floor */}
      <rect x="-20" y="318" width="430" height="150" fill="#CFD2D2" />
      <path d="M-20 346H410M-20 380H410M-20 424H410" stroke="#C2C6C6" strokeWidth="1.5" />
      <path d="M195 318L-40 450M195 318L50 450M195 318L130 450M195 318L260 450M195 318L340 450M195 318L430 450" stroke="#C2C6C6" strokeWidth="1.2" />

      {/* immigration */}
      <Booth x={40} officer={<Person x={86} y={320} scale={1.05} top="#202D40" bottom="#202D40" hairStyle="cap" hair="#202D40" skin={SKIN.tan} armL={30} armR={30} />} />
      <Booth x={150} officer={<Person x={196} y={320} scale={1.05} top="#202D40" bottom="#202D40" hairStyle="bun" hair="#3A2A22" skin={SKIN.light} armL={28} armR={28} />} />
      <circle cx="186" cy="333" r="0" />

      <Person x={92} y={362} scale={1.15} top="#A9B9A1" bottom="#4A5368" hairStyle="short" hair="#5A3A28" skin={SKIN.deep} armL={4} armR={34} holding="passport" />
      <rect x="112" y="344" width="16" height="22" rx="3" fill="#3678D4" />

      {/* queue barriers */}
      <Stanchion x={28} />
      <Stanchion x={96} />
      <Stanchion x={164} />
      <path d="M28 358Q62 372 96 358Q130 372 164 358" fill="none" stroke="#B94E43" strokeWidth="3" strokeLinecap="round" />

      {/* suitcase with Coco on the handle */}
      <rect x="290" y="346" width="3.5" height="30" fill="#737B82" />
      <rect x="326" y="346" width="3.5" height="30" fill="#737B82" />
      <rect x="286" y="340" width="48" height="7" rx="3.5" fill="#4A5058" />
      <rect x="268" y="374" width="84" height="84" rx="11" fill="#3678D4" />
      <rect x="268" y="374" width="84" height="12" rx="6" fill="#2F6CC2" />
      <path d="M294 386V458M326 386V458" stroke="#F1E8D8" strokeWidth="5" opacity="0.9" />
      <rect x="276" y="458" width="10" height="4" rx="2" fill="#202D40" />

      <SpeechBubble x={222} y={212} lines={['Right then. Let’s see', 'how this goes.']} tipX={302} tipY={272} />
      <Coco x={310} y={340} scale={1.2} pose={cocoPose} />
    </SceneFrame>
  );
}

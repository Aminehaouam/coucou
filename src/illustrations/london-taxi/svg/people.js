// Faceless pedestrians as SVG. Two poses (walking, phone) in a shared 60×120 box; feet at y = 116.
import { shade } from '../draw';

export function walkerSvg({ coat, trousers, hair, skin = '#D9B08C', bag = null, scarf = null, pose = 'walk', hem = 'coat' }) {
  const legs = pose === 'walk'
    ? `<path d="M26 66 C25 82 20 98 15 112 L24 113 C30 100 34 84 35 66 Z" fill="${shade(trousers, 0.22)}"/>
       <path d="M30 66 C32 84 38 100 41 112 L50 111 C46 98 40 84 38 66 Z" fill="${trousers}"/>
       <path d="M13 112 C14 108 22 108 25 112 L25 116 H12 Z M40 111 C42 107 50 107 52 111 L53 115 H40 Z" fill="#1a1d24"/>`
    : `<path d="M25 66 L26 112 L35 112 L35 66 Z" fill="${shade(trousers, 0.2)}"/><path d="M33 66 L34 112 L43 112 L42 66 Z" fill="${trousers}"/>
       <path d="M24 112 H37 V116 H23 Z M32 112 H45 V116 H31 Z" fill="#1a1d24"/>`;
  const coatPath = hem === 'long'
    ? 'M20 34 C14 44 14 66 15 90 L47 90 C47 66 46 44 40 34 C34 30 26 30 20 34 Z'
    : 'M20 34 C15 44 14 60 14 78 L47 78 C47 60 45 44 40 34 C34 30 26 30 20 34 Z';
  const arms = pose === 'phone'
    ? `<path d="M40 38 C48 48 48 56 40 58" fill="none" stroke="${coat}" stroke-width="7" stroke-linecap="round"/><rect x="36" y="50" width="6" height="10" rx="2" fill="#2a2f3a"/><circle cx="39.5" cy="61" r="3.4" fill="${skin}"/>
       <path d="M20 38 C16 50 16 62 18 72" fill="none" stroke="${shade(coat, 0.2)}" stroke-width="7" stroke-linecap="round"/>`
    : `<path d="M20 38 C14 50 12 62 14 74" fill="none" stroke="${shade(coat, 0.22)}" stroke-width="7" stroke-linecap="round"/>
       <path d="M40 38 C46 50 48 62 46 74" fill="none" stroke="${coat}" stroke-width="7" stroke-linecap="round"/><circle cx="46" cy="77" r="3.5" fill="${skin}"/>
       ${bag ? `<path d="M46 77 V86" stroke="${shade(bag, 0.3)}" stroke-width="1.4"/><rect x="38" y="86" width="18" height="15" rx="3.5" fill="${bag}"/>` : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120" width="60" height="120">
  ${legs}
  <path d="${coatPath}" fill="${coat}"/><path d="M33 33 C40 44 44 62 46 ${hem === 'long' ? 90 : 78} H38 C37 62 34 46 30 33 Z" fill="#000" opacity=".1"/>
  ${arms}
  ${scarf ? `<ellipse cx="30" cy="33" rx="10" ry="4.6" fill="${scarf}"/>` : ''}
  <rect x="27" y="24" width="7" height="10" rx="3" fill="${skin}"/>
  <ellipse cx="30" cy="17" rx="8.6" ry="9.6" fill="${skin}"/>
  <path d="M21.2 18 C20 6 41 4 39 18 C35 12 27 11 21.2 18 Z" fill="${hair}"/><ellipse cx="25" cy="18" rx="4.4" ry="7.6" fill="${hair}"/>
</svg>`;
}

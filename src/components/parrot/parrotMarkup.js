import layers from './parrot-layers.svg?raw';

// parrot-layers.svg is the Rive-ready file: eight top-level <g id="…"> layers, back to front.
// Here they are regrouped with wrapper groups so idle motion (inner) and reactions (outer)
// animate different groups and never fight over the same transform. Ids become data-part
// attributes so several parrots can share a page without duplicate ids.
const part = (name) => {
  const m = layers.match(new RegExp(`<g id="${name}"[^>]*>([\\s\\S]*?)</g>(?=<g id="|</svg>)`));
  if (!m) throw new Error(`parrot-layers.svg is missing the "${name}" layer`);
  return `<g data-part="${name}">${m[1]}</g>`;
};
const wrap = (name, inner) => `<g data-part="${name}">${inner}</g>`;

const head = wrap('head-group', ['head', 'face', 'pupil', 'eyelid', 'beak'].map(part).join(''));

export const PARROT_MARKUP = wrap(
  'fly',
  wrap(
    'rig',
    wrap(
      'breath',
      wrap('pose-tail', wrap('tail-fx', part('tail'))) +
        part('body') +
        wrap('wing-fx', part('wing')) +
        wrap('pose-head', wrap('head-fx', head)),
    ),
  ),
);

export const PARROT_VIEWBOX = '0 0 476 740';
export const PARROT_ASPECT = 476 / 740;

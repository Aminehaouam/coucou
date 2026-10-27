import taxi from './taxi.svg?raw';
import bus from './bus.svg?raw';
import lamp from './lamp.svg?raw';
import streetSign from './street-sign.svg?raw';
import tree from './tree.svg?raw';
import railing from './railing.svg?raw';
import cocoA from './coco-a.svg?raw';
import cocoB from './coco-b.svg?raw';
import cocoC from './coco-c.svg?raw';

export { facade } from './buildings';
export { walkerSvg } from './people';
export const SVG = { taxi, bus, lamp, streetSign, tree, railing };

/**
 * Coco alternatives (all facing left). `pivot` is the perch point in SVG units and `scale`
 * the size she should have in the scene. Alternative A is the chosen design.
 */
export const COCO = {
  a: { svg: cocoA, pivot: [54.5, 134], scale: 0.46, label: 'A — upright perch (chosen)' },
  b: { svg: cocoB, pivot: [84, 112], scale: 0.4, label: 'B — alert, leaning' },
  c: { svg: cocoC, pivot: [80, 84], scale: 0.38, label: 'C — sleek horizontal' },
};

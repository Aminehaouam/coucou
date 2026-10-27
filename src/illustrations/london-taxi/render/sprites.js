import { Sprite } from 'pixi.js';
import { svgTexture } from './svgTexture';

/** Build a sprite from an SVG string, sized in SVG units, with the pivot given in SVG units. */
export async function svgSprite(svg, { res = 2, pivot = [0, 0], label } = {}) {
  const { texture, width, height } = await svgTexture(svg, { res });
  const sprite = new Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  sprite.pivot.set(pivot[0] * res, pivot[1] * res);
  if (label) sprite.label = label;
  return sprite;
}

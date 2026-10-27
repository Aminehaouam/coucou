import { CanvasSource, Texture } from 'pixi.js';

const sizeOf = (svg) => {
  const m = svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/);
  if (!m) throw new Error('SVG needs a viewBox');
  return { width: parseFloat(m[1]), height: parseFloat(m[2]) };
};

/**
 * Rasterise an SVG string once into a PixiJS texture. `res` is texels per SVG unit,
 * so a sprite should be scaled by 1 / res to match the SVG's own coordinate system.
 */
export async function svgTexture(svg, { res = 2 } = {}) {
  const { width, height } = sizeOf(svg);
  const img = new Image();
  img.decoding = 'async';
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * res);
  canvas.height = Math.ceil(height * res);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const source = new CanvasSource({ resource: canvas, autoGenerateMipmaps: true, scaleMode: 'linear', alphaMode: 'premultiply-alpha-on-upload' });
  return { texture: new Texture({ source }), width, height, res };
}

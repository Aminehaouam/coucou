// Generates the six scene illustrations with Nano Banana (Gemini image models).
// Usage: GEMINI_API_KEY=... node scripts/nano-banana.mjs [sceneId ...]
// Output: src/assets/scenes/<id>.png (picked up automatically by the app).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('Set GEMINI_API_KEY first (a free key from Google AI Studio works).');
  process.exit(1);
}
const model = process.env.NANO_BANANA_MODEL || 'gemini-3-pro-image-preview';
const outDir = new URL('../src/assets/scenes/', import.meta.url);
const cfg = JSON.parse(await readFile(new URL('./scene-prompts.json', import.meta.url), 'utf8'));
await mkdir(outDir, { recursive: true });

async function generate(text, refs = []) {
  const parts = [{ text }, ...refs.map((data) => ({ inline_data: { mime_type: 'image/png', data } }))];
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:5' } },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const json = await res.json();
  const img = json.candidates?.[0]?.content?.parts?.find((p) => (p.inlineData || p.inline_data));
  const data = (img?.inlineData || img?.inline_data)?.data;
  if (!data) throw new Error('No image returned: ' + JSON.stringify(json).slice(0, 300));
  return data;
}

// 1. Lock Coco's design once, then reuse it as a reference for every scene.
const refFile = new URL('coco-reference.png', outDir);
if (!existsSync(refFile)) {
  console.log('Generating Coco reference sheet…');
  const data = await generate(`${cfg.style} ${cfg.coco} ${cfg.reference}`);
  await writeFile(refFile, Buffer.from(data, 'base64'));
}
const cocoRef = (await readFile(refFile)).toString('base64');

// 2. Scenes, one at a time so each can be reviewed.
const wanted = process.argv.slice(2);
for (const [id, scene] of Object.entries(cfg.scenes)) {
  if (wanted.length && !wanted.includes(id)) continue;
  console.log(`Generating ${id}…`);
  const prompt = `${cfg.style} ${scene} ${cfg.coco} Use the attached reference image for Coco's exact design. ${cfg.people} Portrait composition. Keep the bottom 10% calm and uncluttered. Nothing else.`;
  const data = await generate(prompt, [cocoRef]);
  await writeFile(new URL(`${id}.png`, outDir), Buffer.from(data, 'base64'));
}
console.log('Done. Check every image: Coco and all people must have NO eyes or facial features.');

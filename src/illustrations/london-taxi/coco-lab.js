import a from './svg/coco-a.svg?url';
import b from './svg/coco-b.svg?url';
import c from './svg/coco-c.svg?url';

const items = [
  ['A — Upright perch (chosen for the scene)', a],
  ['B — Alert, leaning', b],
  ['C — Sleek horizontal', c],
];
document.getElementById('row').innerHTML = items
  .map(([name, src]) => `<div class="card"><h2>${name}</h2><div class="big"><img src="${src}" alt=""></div><div class="small"><div class="rail"></div><img src="${src}" alt=""><img src="${src}" alt="" style="height:30px"></div><div class="sil"><img src="${src}" alt=""></div></div>`)
  .join('');

"""Builds parrot_gsap.html: inline layered SVG + GSAP animation. Run from this folder."""
import re
svg = open("parrot_layered_for_rive.svg").read().replace(' opacity="0"', "")
body = re.sub(r"^<svg[^>]*>|</svg>\s*$", "", svg).strip()
# regroup: everything in #rig; head parts in #head-group (layers are top-level <g id=...>)
parts = dict(re.findall(r'<g id="(\w+)">(.*?)</g>(?=<g id="|$)', body, flags=re.S))
g = lambda k: f'<g id="{k}">{parts[k]}</g>'
head = '<g id="head-group">' + "".join(g(k) for k in ("head", "face", "pupil", "eyelid", "beak")) + "</g>"
# *-fx wrappers carry the click reaction so it stacks on top of the idle loop (inner groups)
rig = ('<g id="breath"><g id="tail-fx">' + g("tail") + '</g>' + g("body") +
       '<g id="wing-fx">' + g("wing") + '</g><g id="head-fx">' + head + '</g></g>')
html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Parrot – GSAP idle</title>
<style>
  html,body{{height:100%;margin:0}}
  body{{display:grid;place-items:center;background:#f4f6f3;font:14px system-ui,sans-serif;color:#556}}
  main{{text-align:center}}
  svg{{height:min(80vh,640px);width:auto;cursor:pointer;overflow:visible;-webkit-tap-highlight-color:transparent}}
  p{{margin:.5rem 0 0}}
</style></head><body><main>
<svg id="parrot" viewBox="0 0 476 740" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grey parrot, click to make it chirp">
<g id="rig">{rig}</g></svg>
<p>Click the parrot</p>
</main>
<script src="gsap.min.js"></script>
<script>
(() => {{
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // pivots in viewBox px
  gsap.set(['#rig','#breath'],        {{svgOrigin:'240 700'}});
  gsap.set(['#head-group','#head-fx'], {{svgOrigin:'235 310'}});
  gsap.set(['#wing','#wing-fx'],       {{svgOrigin:'225 345'}});
  gsap.set(['#tail','#tail-fx'],       {{svgOrigin:'185 585'}});
  gsap.set('#beak',       {{svgOrigin:'335 215'}});
  gsap.set('#eyelid',     {{svgOrigin:'256 110', scaleY:0}});

  const sine = {{ease:'sine.inOut', repeat:-1, yoyo:true}};
  const idle = gsap.timeline({{paused:reduce}});
  idle
    .to('#breath',     {{scaleX:1.006, scaleY:1.014, duration:1.7, ...sine}}, 0)
    .to('#head-group', {{rotation:-2.6, y:-2, duration:3.1, ...sine}}, 0.25)      // lags the body
    .to('#wing',       {{rotation:3.5, duration:2.4, ...sine}}, 0.4)
    .to('#tail',       {{rotation:4.5,  duration:2.0, ...sine}}, 0.15);

  // blinks at random intervals, sometimes double
  function blink() {{
    const t = gsap.timeline({{onComplete:() => gsap.delayedCall(gsap.utils.random(1.8, 5), blink)}});
    const once = () => t.to('#eyelid',{{scaleY:1,duration:.07,ease:'power2.in'}})
                        .to('#eyelid',{{scaleY:0,duration:.12,ease:'power2.out'}}, '+=.04');
    once(); if (Math.random() < .25) {{ t.add(() => {{}}, '+=.08'); once(); }}
  }}

  // eyes wander
  function look() {{
    gsap.to('#pupil', {{x:gsap.utils.random(-7,3), y:gsap.utils.random(-3,5), duration:.25, ease:'power2.out'}});
    gsap.delayedCall(gsap.utils.random(1.5, 4), look);
  }}

  if (!reduce) {{ blink(); look(); }}

  // click: squash → hop → wing flap + chirp → land
  let busy = false;
  function chirp() {{
    if (busy) return; busy = true;
    const t = gsap.timeline({{onComplete:() => busy = false}});
    t.to('#rig', {{scaleX:1.05, scaleY:.94, duration:.12, ease:'power2.out'}})          // anticipation
     .to('#rig', {{y:-34, scaleX:.97, scaleY:1.05, duration:.22, ease:'power2.out'}})                       // hop
     .to('#wing-fx',{{rotation:20, duration:.12, ease:'power2.out'}}, '<')
     .to('#head-fx', {{rotation:-7, y:-4, duration:.18, ease:'power2.out'}}, '<')
     .to('#beak',{{rotation:9, duration:.07, yoyo:true, repeat:5, ease:'sine.inOut'}}, '<.05')               // chirp ×3
     .to('#rig', {{y:0, scaleX:1.05, scaleY:.95, duration:.2, ease:'power2.in'}}, '+=.05')                   // land
     .to('#rig', {{scaleX:1, scaleY:1, duration:.5, ease:'elastic.out(1.1,.4)'}})
     .to('#wing-fx',{{rotation:0, duration:.6, ease:'elastic.out(1,.35)'}}, '<')
     .to('#head-fx', {{rotation:0, y:0, duration:.5, ease:'power2.out'}}, '<')
     .to('#tail-fx',{{rotation:10, duration:.15, yoyo:true, repeat:1, ease:'sine.inOut'}}, '<');
  }}
  $('#parrot').addEventListener('click', chirp);
  window.parrot = {{chirp, idle}};
}})();
</script></body></html>
'''
open("parrot_gsap.html", "w").write(html)
print(len(html), list(parts))

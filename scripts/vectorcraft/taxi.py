"""London taxi street, drawn through VectorCraft. Usage: python3 taxi.py OUT_DIR"""
import random, sys
from vc import Doc, lin, rad

out = sys.argv[1]
random.seed(7)
d = Doc("taxi", 390, 450)
G = 305  # ground line of the houses

# --- sky, sun glow, clouds, distant roofs -------------------------------------------------
d.rect(-10, -10, 410, 330, lin(0, 0, 0, 320, (0, "#C3D1D8"), (0.6, "#E4E9E8"), (1, "#F3EEE2")))
d.ellipse(300, 120, 110, 80, "#FFF3D2", opacity=70, effects=[("blur.gaussian", {"radius": 40})])
for cx, cy, s, op in [(60, 52, 1.0, 0.95), (250, 36, 0.8, 0.9), (330, 86, 0.55, 0.85)]:
    d.rect(cx, cy + 14 * s, 96 * s, 16 * s, "#FAFAF7", r=8 * s, opacity=op * 100)
    for ox, oy, r in [(30, 14, 14), (54, 9, 17), (74, 17, 10)]:
        d.ellipse(cx + ox * s, cy + oy * s, r * s, r * s, "#FAFAF7", opacity=op * 100)
for x, top, w in [(-10, 128, 60), (40, 118, 50), (130, 124, 70), (250, 112, 56), (320, 122, 80)]:
    d.rect(x, top, w, G - top, "#B7C3CB", opacity=55)
    d.rect(x, top, w, 4, "#A9B6BF", opacity=60)

# --- houses -------------------------------------------------------------------------------
def window(x, y, w, h, trim, lit=False):
    glass = lin(x, y, x, y + h, (0, "#F3D79B"), (1, "#E2B46A")) if lit else lin(x, y, x, y + h, (0, "#51658A"), (0.5, "#33435F"), (1, "#26324A"))
    if lit:
        d.rect(x - 3, y - 3, w + 6, h + 6, "#F6D58C", r=3, opacity=35, effects=[("blur.gaussian", {"radius": 4})])
    d.rect(x - 2, y - 4, w + 4, 3, trim)
    d.rect(x, y, w, h, glass, stroke=(trim, 1.4))
    d.path(f"M{x + w/2} {y}V{y + h}M{x} {y + h/3}H{x + w}M{x} {y + 2*h/3}H{x + w}", None, stroke=(trim, 0.9), closed=False)
    d.path(f"M{x + 1.5} {y + 1.5}L{x + w*0.55} {y + 1.5}L{x + 1.5} {y + h*0.5}Z", "#FFFFFF", opacity=14)
    d.rect(x - 2, y + h, w + 4, 2.6, trim)
    d.rect(x - 2, y + h + 2.6, w + 4, 2, "#000000", opacity=14)

def house(x, w, top, wall, dark, trim, cols, door_at, door, chimneys):
    d.rect(x, top - 6, w, G - top + 6, lin(x, 0, x + w, 0, (0, wall), (0.7, wall), (1, dark)))
    if wall != "#F1E8D8":  # brickwork courses
        courses = "".join(f"M{x}{' ' if x<0 else ' '}{y}H{x + w}" for y in range(top + 6, G - 10, 7))
        d.path(courses.replace("M-", "M-"), None, stroke=("#000000", 0.7), opacity=9, closed=False)
    d.rect(x, top - 6, w, 10, lin(0, top - 6, 0, top + 4, (0, trim), (1, trim, 0.0)), opacity=100)
    d.rect(x - 1.5, top - 3, w + 3, 6, trim)
    d.rect(x, top + 3, w, 5, "#000000", opacity=14, effects=[("blur.gaussian", {"radius": 2})])
    for c in chimneys:
        d.rect(x + c, top - 28, 11, 26, wall)
        d.rect(x + c + 8, top - 28, 3, 26, dark)
        d.rect(x + c - 1, top - 31, 13, 4, dark)
        d.rect(x + c + 2, top - 37, 3, 6, "#A5604F"); d.rect(x + c + 7, top - 36, 3, 5, "#A5604F")
    d.rect(x, G - 64, w, 3, trim, opacity=85)
    d.rect(x, G - 12, w, 12, dark)
    colx = lambda i: x + (w / cols) * (i + 0.5)
    ww = 20 if cols == 2 else 16
    rows = [(top + 20, 15, ww - 3), (G - 158, 34, ww), (G - 112, 40, ww)]
    for ry, rh, rw in rows:
        for i in range(cols):
            window(colx(i) - rw / 2, ry, rw, rh, trim, lit=random.random() < 0.14)
    for i in range(cols):
        cx = colx(i)
        if i == door_at:
            d.rect(cx - 11, G - 56, 22, 56, trim)
            d.path(f"M{cx - 8} {G - 42}A8 8 0 0 1 {cx + 8} {G - 42}Z", lin(0, G - 50, 0, G - 42, (0, "#F3D79B"), (1, "#C99A55")))
            d.rect(cx - 8, G - 42, 16, 38, lin(cx - 8, 0, cx + 8, 0, (0, door), (1, door)), stroke=("#000000", 0.3))
            d.rect(cx - 4.5, G - 36, 9, 12, "#000000", opacity=14)
            d.ellipse(cx + 4, G - 22, 1.3, 1.3, "#D9B86A")
            d.rect(cx - 13, G - 4, 26, 4, trim); d.rect(cx - 15, G - 2, 30, 2, "#000000", opacity=14)
        else:
            window(cx - ww / 2, G - 52, ww, 30, trim)
    d.rect(x + w - 5, top - 6, 5, G - top + 6, "#000000", opacity=10)

house(-8, 114, 100, "#A9473D", "#873830", "#EADFC9", 3, 1, "#202D40", [18, 82])
house(106, 106, 92, "#F1E8D8", "#D2C4AA", "#FAF9F6", 3, 2, "#3678D4", [58])
house(212, 104, 104, "#B5594D", "#93433A", "#EADFC9", 3, 0, "#A9B9A1", [26, 86])
house(316, 92, 96, "#A9B9A1", "#8C9F84", "#F1E8D8", 2, 1, "#202D40", [48])

# --- pavement, kerb, road -----------------------------------------------------------------
d.rect(-10, G, 410, 50, lin(0, G, 0, 355, (0, "#D9D0BE"), (1, "#EAE3D3")))
d.rect(-10, G, 410, 14, lin(0, G, 0, G + 14, (0, "#000000", 0.22), (1, "#000000", 0)))
d.path("M36 305V350M108 305V350M180 305V350M252 305V350M324 305V350M396 305V350M-10 328H400", None, stroke=("#BFB59F", 0.9), opacity=70, closed=False)
d.rect(-10, 350, 410, 6, "#F4EEE0"); d.rect(-10, 356, 410, 4, "#A8A294")
d.rect(-10, 360, 410, 100, lin(0, 360, 0, 450, (0, "#6C747A"), (0.5, "#868E94"), (1, "#7B838A")))
d.path("M-10 404H400", None, stroke=("#F1E8D8", 2), opacity=55, closed=False)

# --- lamppost, postbox --------------------------------------------------------------------
x = 209
d.rect(x - 1.5, 236, 3, 112, "#202D40"); d.rect(x - 5, 338, 10, 10, "#202D40", r=1)
d.path(f"M{x - 6} 236L{x - 3.5} 224H{x + 3.5}L{x + 6} 236Z", "#202D40")
d.rect(x - 4, 236, 8, 3, "#F7E3A8"); d.ellipse(x, 221, 2.5, 2.5, "#202D40")
d.ellipse(x, 244, 16, 12, "#F7E3A8", opacity=30, effects=[("blur.gaussian", {"radius": 6})])

def postbox(px, py, s):
    d.ellipse(px + 2, py, 21 * s, 3.4 * s, "#000000", opacity=22, effects=[("blur.gaussian", {"radius": 2})])
    d.rect(px - 14 * s, py - 52 * s, 28 * s, 46 * s, lin(px - 14 * s, 0, px + 14 * s, 0, (0, "#C65A4E"), (0.6, "#B94E43"), (1, "#8F3A32")))
    d.path(f"M{px - 16.5 * s} {py - 48 * s}C{px - 16.5 * s} {py - 64 * s} {px + 16.5 * s} {py - 64 * s} {px + 16.5 * s} {py - 48 * s}Z", "#A5443A")
    d.rect(px - 17 * s, py - 50 * s, 34 * s, 3 * s, "#8F3A32", r=1)
    d.rect(px - 10 * s, py - 38 * s, 20 * s, 4.5 * s, "#202D40", r=2)
    d.rect(px - 7 * s, py - 27 * s, 14 * s, 8 * s, "#F1E8D8", r=1)
    d.rect(px - 17 * s, py - 8 * s, 34 * s, 8 * s, "#8F3A32", r=1.5)
postbox(346, 346, 1.1)

# --- the taxi -----------------------------------------------------------------------------
tx, ty, s = 30, 346, 1.4
P = lambda px, py: (tx + px * s, ty + py * s)
def poly(pts, fill, **kw):
    d.path("M" + "L".join(f"{tx + a * s:.2f} {ty + b * s:.2f}" for a, b in pts) + "Z", fill, **kw)
d.ellipse(*P(62, 41), 70 * s, 4.5 * s, "#000000", opacity=30, effects=[("blur.gaussian", {"radius": 3})])
d.ellipse(*P(62, 44), 58 * s, 2.5 * s, "#FFFFFF", opacity=10, effects=[("blur.gaussian", {"radius": 3})])  # wet-road sheen
d.rect(tx + 40 * s, ty - 5 * s, 16 * s, 5 * s, "#F7E3A8", r=1.5)
d.ellipse(*P(48, -3), 16 * s, 6 * s, "#F7E3A8", opacity=40, effects=[("blur.gaussian", {"radius": 5})])
poly([(0, 33), (0, 19), (2, 13), (6, 12), (13, 11), (17, 3), (22, 0), (66, 0), (74, 1), (80, 8), (90, 17), (112, 20), (121, 22), (122, 28), (122, 33)],
     lin(0, ty, 0, ty + 33 * s, (0, "#2B3547"), (0.45, "#161C27"), (1, "#0D1119")))
poly([(19, 11), (22, 5), (29, 4.5), (64, 4.5), (69, 5), (73, 9), (80, 16), (18, 16)], lin(0, ty + 4 * s, 0, ty + 16 * s, (0, "#C9D6DD"), (1, "#8DA1AF")))
d.rect(tx + 44 * s, ty + 4.5 * s, 3 * s, 11.5 * s, "#161C27")
poly([(24, 6), (40, 6), (30, 16), (19, 16)], "#FFFFFF", opacity=22)
d.rect(tx, ty + 21 * s, 122 * s, 2.5 * s, "#3A475E")
poly([(0, 33), (0, 24), (6, 24), (6, 33)], "#B94E43"); poly([(116, 24), (122, 25), (122, 29), (116, 29)], "#F7E3A8")
d.ellipse(*P(123, 26), 12 * s, 6 * s, "#F7E3A8", opacity=30, effects=[("blur.gaussian", {"radius": 4})])
for wx in (26, 98):
    d.ellipse(*P(wx, 32), 11 * s, 11 * s, "#0B1018"); d.ellipse(*P(wx, 32), 8 * s, 8 * s, "#1F2532")
    d.ellipse(*P(wx, 32), 4 * s, 4 * s, lin(0, 0, 0, 0, (0, "#9AA3AA"), (1, "#737B82")) if False else "#8A929A")

d.export(out + "/taxi.svg", out + "/taxi.png")
d.save(out + "/taxi.cmds.json")

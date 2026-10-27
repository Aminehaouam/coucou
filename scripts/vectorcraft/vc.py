"""Tiny helper for drawing scenes through VectorCraft's headless CLI (`vectorcraft-cli run --commands`)."""
import json


class Doc:
    def __init__(self, name, w, h):
        self.cmds = [{"command": "file.new", "params": {"name": name, "width": w, "height": h, "units": "Pixels", "backgroundContents": "transparent"}}]

    def _paint(self, fill, stroke, opacity, effects):
        if isinstance(fill, dict):
            self.cmds.append({"command": "paint.setFill", "params": {"gradient": fill}})
        elif fill:
            self.cmds.append({"command": "paint.setFill", "params": {"color": fill}})
        else:
            self.cmds.append({"command": "paint.setFill", "params": {"none": True}})
        if stroke:
            color, width = stroke
            self.cmds.append({"command": "paint.setStroke", "params": {"color": color}})
            self.cmds.append({"command": "stroke.set", "params": {"weight": width}})
        else:
            self.cmds.append({"command": "paint.setStroke", "params": {"none": True}})
        if opacity is not None:
            self.cmds.append({"command": "transparency.set", "params": {"opacity": opacity}})
        for effect, params in effects or []:
            self.cmds.append({"command": "effect.apply", "params": {"effect": effect, "params": params}})

    def rect(self, x, y, w, h, fill, r=0, stroke=None, opacity=None, effects=None):
        self.cmds.append({"command": "shape.rectangle", "params": {"x": x, "y": y, "width": w, "height": h, "radius": r}})
        self._paint(fill, stroke, opacity, effects)

    def ellipse(self, cx, cy, rx, ry, fill, stroke=None, opacity=None, effects=None):
        self.cmds.append({"command": "shape.ellipse", "params": {"x": cx - rx, "y": cy - ry, "width": 2 * rx, "height": 2 * ry}})
        self._paint(fill, stroke, opacity, effects)

    def path(self, d, fill, stroke=None, opacity=None, effects=None, closed=True):
        self.cmds.append({"command": "path.create", "params": {"d": d, "closed": closed}})
        self._paint(fill, stroke, opacity, effects)

    def export(self, *paths, scale=2):
        for p in paths:
            params = {"path": p}
            if p.endswith(".png"):
                params["scale"] = scale
            self.cmds.append({"command": "document.export", "params": params})

    def save(self, path):
        json.dump(self.cmds, open(path, "w"))


def lin(x1, y1, x2, y2, *stops):
    """Linear gradient in document coordinates; stops are (offset, color[, opacity])."""
    return {"kind": "linear", "start": [x1, y1], "end": [x2, y2],
            "stops": [dict(offset=s[0], color=s[1], **({"opacity": s[2]} if len(s) > 2 else {})) for s in stops]}


def rad(cx, cy, r, *stops):
    return {"kind": "radial", "start": [cx, cy], "end": [cx + r, cy],
            "stops": [dict(offset=s[0], color=s[1], **({"opacity": s[2]} if len(s) > 2 else {})) for s in stops]}

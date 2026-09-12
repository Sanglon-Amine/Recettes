"""Incremente version.json : l'app Android installee telecharge alors les nouveaux fichiers web au demarrage."""
import json
import pathlib

p = pathlib.Path(__file__).with_name("version.json")
d = json.loads(p.read_text(encoding="utf-8"))
d["version"] += 1
p.write_text(json.dumps(d, ensure_ascii=False) + "\n", encoding="utf-8")
print("version.json ->", d["version"])

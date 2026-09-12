"""Copie les fichiers de l'app web dans les assets Android. A lancer avant chaque compilation."""
import pathlib, shutil
root = pathlib.Path(__file__).resolve().parent.parent
dst = root / "android" / "app" / "src" / "main" / "assets"
dst.mkdir(parents=True, exist_ok=True)
for name in ["index.html", "app.js", "recipes.js", "styles.css", "manifest.json", "icon-192.png", "icon-512.png"]:
    shutil.copy2(root / name, dst / name)
print("assets synchronises :", dst)

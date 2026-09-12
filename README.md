# Menu de la Semaine

Application web installable (PWA) : 14 repas (déjeuner + dîner, lundi → dimanche) pour 2 personnes,
avec la liste de courses agrégée et classée par rayon.

Toutes les recettes sont **sans porc** (lardons, jambon et chair à saucisse remplacés par du bœuf) et **sans alcool**
(le vin des mijotés est remplacé par du bouillon, celui des moules par de l'eau citronnée).

En ligne : https://claude.ai/code/artifact/120359d2-2c5f-4867-baa8-35c811dbad6d

## Installer sur Android
1. Ouvrir le lien ci-dessus dans Chrome sur le téléphone (connecté au compte Claude).
2. Menu ⋮ → « Ajouter à l'écran d'accueil » (ou « Installer l'application »).
3. L'icône apparaît comme une app ; les données (semaine, cases cochées) restent sur le téléphone.

## Fichiers
- `index.html` — coque de l'app, icônes SVG
- `styles.css` — thème clair/sombre, mise en page mobile
- `recipes.js` — 102 recettes (quantités pour 2) de 8 cuisines (française, marocaine, italienne, méditerranéenne, asiatique, indienne, mexicaine, américaine), dictionnaire des ingrédients et rayons
- `app.js` — génération de la semaine, rotation, liste de courses, fiche recette, sauvegarde locale
- `manifest.json`, `sw.js`, `icon-*.png` — installation PWA et mode hors ligne

## Règles de génération
- Déjeuners du lundi au vendredi : recettes ≤ 25 min ; dîners de semaine ≤ 60 min ; week-end : tout est permis (rôti, mijoté…).
- Jamais deux fois la même recette dans la semaine ; les familles (viande, poisson, végétarien…) sont équilibrées.
- Un repas verrouillé 🔒 est conservé quand on régénère la semaine.
- Rotation : les plats des 2 semaines précédentes ne sont pas reproposés (l'historique est archivé à chaque changement de semaine).
- Les cuisines sont réparties sur la semaine (pas 5 tajines d'affilée).
- Quand la semaine affichée est passée (ou dès le samedi), un bandeau propose de générer la suivante.

## Fiche recette
Toucher le nom d'un plat (semaine ou catalogue) ouvre sa fiche : ingrédients avec quantités pour 2, « du placard », et la préparation en 5–6 étapes détaillées (températures, temps, gestes).

## Remplacer, exclure
- Cocher un ou plusieurs repas → bouton **Remplacer** : nouveaux tirages pour ces créneaux seulement.
- Dans une fiche : **Autre suggestion**, **Choisir…** (catalogue), **Verrouiller**, **Ne plus proposer** (la recette sort des tirages ; réactivable depuis le catalogue).

## Tester en local
```
python -m http.server 8765
```
puis ouvrir http://localhost:8765/

## Ajouter une recette
Dans `recipes.js`, ajouter une entrée dans `RECIPES` (id unique, `cat`, `cui`, `time`, `slots`, `ing`, `pantry`, `steps`).
Chaque ingrédient utilise une clé de `ING` ; ajouter la clé si elle n'existe pas (libellé + rayon).

## Vers un APK plus tard
Le dossier peut être empaqueté tel quel avec Capacitor (`npx cap add android`) ou publié via
PWABuilder (https://www.pwabuilder.com) une fois hébergé sur une URL publique, sans modifier le code.

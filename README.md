# Menu de la Semaine

Application web installable (PWA) : 14 repas (déjeuner + dîner, lundi → dimanche) pour 2 personnes,
avec la liste de courses agrégée et classée par rayon.

Toutes les recettes sont **sans porc et sans lardons** (jambon de bœuf, bœuf émincé ou haché à la place) et **sans alcool**
(le vin des mijotés est remplacé par du bouillon, celui des moules par de l'eau citronnée).

En ligne : https://claude.ai/code/artifact/120359d2-2c5f-4867-baa8-35c811dbad6d

## Installer sur Android
1. Ouvrir le lien ci-dessus dans Chrome sur le téléphone (connecté au compte Claude).
2. Menu ⋮ → « Ajouter à l'écran d'accueil » (ou « Installer l'application »).
3. L'icône apparaît comme une app ; les données (semaine, cases cochées) restent sur le téléphone.

## Fichiers
- `index.html` — coque de l'app, icônes SVG
- `styles.css` — thème clair/sombre, mise en page mobile
- `recipes.js` — 177 recettes (quantités pour 2) de 12 cuisines (française, marocaine, libanaise, syrienne, italienne, méditerranéenne, japonaise, chinoise, Asie du Sud-Est, indienne, mexicaine, américaine), dictionnaire des ingrédients et rayons
- `app.js` — génération de la semaine, rotation, liste de courses, fiche recette, sauvegarde locale
- `manifest.json`, `sw.js`, `icon-*.png` — installation PWA et mode hors ligne

## Règles de génération
- Déjeuners du lundi au vendredi : recettes ≤ 25 min ; dîners de semaine ≤ 60 min ; week-end : tout est permis (rôti, mijoté…).
- Jamais deux fois la même recette dans la semaine ; les familles (viande, poisson, végétarien…) sont équilibrées.
- Un repas verrouillé 🔒 est conservé quand on régénère la semaine.
- Rotation : les plats des 2 semaines précédentes ne sont pas reproposés (l'historique est archivé à chaque changement de semaine).
- Les cuisines sont réparties sur la semaine (pas 5 tajines d'affilée).
- Quand la semaine affichée est passée (ou dès le samedi), un bandeau propose de générer la suivante.

## Régimes (options)
Deux boutons **Régime** (onglet Semaine et Recettes), cumulables, mémorisés :
- **Léger** — plat complet peu calorique, peu de matières grasses ajoutées, pas de friture ni de gratin/crème/fromage en quantité (96 recettes).
- **Faible en cholestérol** — sans beurre, crème, fromage gras, jaunes d'œufs, viande rouge ni lait de coco ; poisson, volaille, légumineuses, huile d'olive (73 recettes).

Activer un régime remplace aussitôt les repas non conformes (sauf verrouillés), restreint les tirages et le catalogue.
Les étiquettes (`diet: ["leger", "chol"]` dans `recipes.js`) sont une classification de bon sens, pas un avis médical.

## Recettes personnelles : recherche sur internet, import depuis un lien, saisie
Onglet Recettes. Dès qu'on tape 3 lettres dans la recherche, un bouton **« Chercher « … » sur internet »** apparaît :
l'app interroge DuckDuckGo (`html.duckduckgo.com/html/`, puis `lite.duckduckgo.com/lite/`, puis Brave Search en secours ; via le pont Android, sans clé ni compte), filtre
les publicités et réseaux sociaux, affiche les résultats (sites de recettes connus en premier, marqués « import direct »)
et un tap sur un résultat lance l'import automatique ci-dessous. Si le moteur bloque temporairement, l'app le dit.

**Ajouter une recette** ouvre le même formulaire pour coller un lien ou saisir à la main.
- **Depuis un lien** (app Android) : coller l'adresse (Marmiton, 750g, CuisineAZ…) → Importer. L'app lit la fiche structurée
  `schema.org/Recipe` publiée par le site (nom, nombre de personnes, temps, ingrédients, étapes), pré-remplit le formulaire
  et signale porc / lardons / alcool. La lecture de la page passe par le pont `Android.fetchUrl` de la coque
  (une page web n'a pas le droit de lire un autre site) ; dans la version web, seule la saisie manuelle est possible.
- **À la main** : un ingrédient par ligne (« 200 g de bœuf haché », « 2 oignons », « 1 c. à soupe d'huile »). L'analyseur
  reconnaît quantités (fractions, décimales), unités (g, kg, cl, l, cuillères, gousses, bottes, boîtes…) et rattache
  l'ingrédient au dictionnaire quand il existe (donc au bon rayon et agrégé dans les courses) ; sinon il devine le rayon.
  Sel, huile, épices… vont au placard.
- Les quantités sont converties pour 2 personnes à l'enregistrement (champ « Prévue pour »), puis suivent le sélecteur.
- Une recette perso porte l'étiquette **perso**, peut être modifiée ou supprimée depuis sa fiche, et est stockée sur le
  téléphone (`state.custom`) — pas dans `recipes.js`.

## Nombre de personnes
Le sélecteur **− / +** de l'en-tête (1 à 8, mémorisé) ajuste toutes les quantités : liste de courses et fiches.
Les recettes sont écrites pour 2 ; les arrondis sont pensés pour l'achat (grammes par 5 ou 10, œufs/boîtes/pains entiers,
½ possible pour un poivron ou un citron). Les étapes citent les quantités pour 2 — la fiche l'indique avec le facteur à appliquer.

## Photos des plats
- Recettes de la base : 143 sur 177 portent une illustration (`img`, `imgPage`) — vignette 500 px issue de l'article Wikipédia du plat
  (Wikimedia Commons, créditée dans la fiche). Choisies après vérification ; les plats sans article fidèle n'en ont pas.
- Recettes importées : la photo publiée par le site (`image` de la fiche schema.org) est enregistrée avec la recette.
- Chargées à la demande à l'ouverture de la fiche, masquées si l'image ne répond pas.

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

## Application Android (APK)
Dépôt GitHub : https://github.com/Sanglon-Amine/Recettes

À chaque `git push` sur `main`, GitHub Actions (`.github/workflows/build-apk.yml`) compile la coque Android
(`android/`, WebView Java qui embarque les fichiers web) et publie `menu-semaine.apk` dans les **Releases**.

### Mises à jour automatiques
- **Recettes et fonctionnalités** : à chaque ouverture, l'app compare `version.json` sur GitHub avec sa version et télécharge
  les fichiers web (index.html, app.js, recipes.js, styles.css, manifest.json) dans son stockage privé, puis se recharge.
  Rien à réinstaller. Un hook git (`.git/hooks/pre-commit`) incrémente `version.json` automatiquement quand un de ces
  fichiers est modifié ; à défaut, lancer `python bump-version.py` avant de committer.
- **Coque Android** (`android/`) : compilée seulement quand ce dossier change. L'app vérifie une fois par jour la dernière
  Release ; si son numéro de build est plus grand, elle propose de télécharger le nouvel APK (l'installation reste un tap manuel).

Sur le téléphone : ouvrir https://github.com/Sanglon-Amine/Recettes/releases/latest, télécharger le `.apk`,
autoriser l'installation depuis cette source, installer. Pour mettre à jour : réinstaller le nouvel APK par-dessus
(les données restent).

Compiler en local (si JDK 17 + SDK Android sont installés) :
```
python android/sync-assets.py
cd android && gradle assembleDebug
```

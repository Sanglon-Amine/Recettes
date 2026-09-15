/* Base de recettes — quantités pour 2 personnes. Sans porc, sans lardons (remplacés par du bœuf) et sans alcool.
   Ingrédient : [clé, quantité, unité]. Unités : pc (pièce), g, cl, gousse, botte, tranche, boite, cs (c. à soupe), pot, feuille.
   slots : créneaux où la recette est proposée en semaine (le week-end, tout est permis). */

const AISLES = [
  ["legumes", "Fruits & légumes"],
  ["boucherie", "Boucherie & poissonnerie"],
  ["cremerie", "Crèmerie & œufs"],
  ["epicerie", "Épicerie"],
  ["surgeles", "Surgelés"],
  ["boulangerie", "Boulangerie"],
];

const CATS = {
  volaille: "Volaille", viande: "Viande", poisson: "Poisson & mer", vege: "Végétarien",
  pates: "Pâtes & riz", oeufs: "Œufs & fromage", salade: "Salade", soupe: "Soupe",
};

const CUISINES = {
  fr: "Française", ma: "Marocaine", lb: "Libanaise", sy: "Syrienne", it: "Italienne", med: "Méditerranéenne",
  jp: "Japonaise", cn: "Chinoise", as: "Asie du Sud-Est", in: "Indienne", mx: "Mexicaine", us: "Américaine",
};

/* Régimes sélectionnables : une recette peut porter plusieurs étiquettes.
   leger : plat complet peu calorique, peu de matières grasses ajoutées, pas de friture ni de gratin/crème/fromage en quantité.
   chol  : pauvre en graisses saturées et en cholestérol — sans beurre, crème, fromage gras, jaunes d'œufs, viande rouge, lait de coco. */
const DIETS = { leger: "Léger", chol: "Faible en cholestérol" };

const UNITS = {
  pc: ["", ""], g: ["g", "g"], cl: ["cl", "cl"],
  gousse: ["gousse", "gousses"], botte: ["botte", "bottes"], tranche: ["tranche", "tranches"],
  boite: ["boîte", "boîtes"], cs: ["c. à soupe", "c. à soupe"], pot: ["pot", "pots"], feuille: ["feuille", "feuilles"],
  cc: ["c. à café", "c. à café"], sachet: ["sachet", "sachets"],
};

/* clé : [libellé, rayon] */
const ING = {
  // Fruits & légumes
  oignon: ["Oignons", "legumes"], oignon_rouge: ["Oignon rouge", "legumes"], oignon_nouveau: ["Oignons nouveaux", "legumes"],
  echalote: ["Échalotes", "legumes"], ail: ["Ail", "legumes"], tomate: ["Tomates", "legumes"], tomates_cerises: ["Tomates cerises", "legumes"],
  poivron: ["Poivrons", "legumes"], courgette: ["Courgettes", "legumes"], aubergine: ["Aubergines", "legumes"], carotte: ["Carottes", "legumes"],
  pdt: ["Pommes de terre", "legumes"], champignons: ["Champignons de Paris", "legumes"], brocoli: ["Brocoli", "legumes"], poireau: ["Poireaux", "legumes"],
  potiron: ["Potiron", "legumes"], citron: ["Citrons", "legumes"], citron_vert: ["Citron vert", "legumes"], laitue: ["Laitue", "legumes"],
  romaine: ["Salade romaine", "legumes"], mache: ["Mâche", "legumes"], concombre: ["Concombre", "legumes"], avocat: ["Avocat", "legumes"],
  endive: ["Endives", "legumes"], epinards: ["Épinards frais", "legumes"], haricots_verts: ["Haricots verts", "legumes"], germes_soja: ["Germes de soja", "legumes"],
  chou_rouge: ["Chou rouge", "legumes"], navet: ["Navet", "legumes"], persil: ["Persil", "legumes"], ciboulette: ["Ciboulette", "legumes"],
  coriandre: ["Coriandre", "legumes"], basilic: ["Basilic", "legumes"], menthe: ["Menthe", "legumes"], gingembre: ["Gingembre frais", "legumes"],
  celeri: ["Céleri branche", "legumes"], chou_fleur: ["Chou-fleur", "legumes"], roquette: ["Roquette", "legumes"], radis: ["Radis", "legumes"],
  aneth: ["Aneth", "legumes"], chou_vert: ["Chou vert (un quart suffit)", "legumes"], patate_douce: ["Patates douces", "legumes"],
  // Boucherie & poissonnerie
  poulet_blanc: ["Blancs de poulet", "boucherie"], poulet_cuisse: ["Cuisses de poulet", "boucherie"], poulet_haut: ["Hauts de cuisse de poulet", "boucherie"],
  poulet_entier: ["Poulet fermier (≈1,3 kg)", "boucherie"], dinde: ["Escalopes de dinde", "boucherie"], boeuf_hache: ["Bœuf haché", "boucherie"],
  steak_hache: ["Steaks hachés", "boucherie"], boeuf_braiser: ["Bœuf à braiser (paleron)", "boucherie"], veau: ["Épaule de veau", "boucherie"],
  merguez: ["Merguez de bœuf", "boucherie"], jambon_boeuf: ["Jambon de bœuf", "boucherie"],
  saumon: ["Pavés de saumon", "boucherie"], cabillaud: ["Filets de cabillaud", "boucherie"], crevettes: ["Crevettes décortiquées", "boucherie"], moules: ["Moules", "boucherie"],
  agneau: ["Épaule d'agneau (morceaux)", "boucherie"], boeuf_saute: ["Bœuf à sauter (émincé)", "boucherie"], roti_boeuf: ["Rôti de bœuf", "boucherie"], truite: ["Truites (vidées)", "boucherie"],
  // Crèmerie & œufs
  oeuf: ["Œufs", "cremerie"], beurre: ["Beurre", "cremerie"], creme: ["Crème fraîche", "cremerie"], creme_liquide: ["Crème liquide", "cremerie"],
  lait: ["Lait", "cremerie"], gruyere: ["Gruyère râpé", "cremerie"], parmesan: ["Parmesan", "cremerie"], mozzarella: ["Mozzarella", "cremerie"],
  feta: ["Feta", "cremerie"], chevre: ["Bûche de chèvre", "cremerie"], cheddar: ["Cheddar en tranches", "cremerie"], fromage_frais: ["Fromage frais", "cremerie"],
  pate_brisee: ["Pâte brisée", "cremerie"], pate_pizza: ["Pâte à pizza", "cremerie"], galettes: ["Galettes de sarrasin", "cremerie"], gnocchis: ["Gnocchis", "cremerie"],
  yaourt: ["Yaourt nature", "cremerie"], tofu: ["Tofu ferme", "cremerie"], pate_feuilletee: ["Pâte feuilletée", "cremerie"], brick: ["Feuilles de brick", "cremerie"], cheddar_rape: ["Cheddar râpé", "cremerie"],
  // Épicerie
  riz: ["Riz", "epicerie"], riz_arborio: ["Riz arborio", "epicerie"], riz_basmati: ["Riz basmati", "epicerie"], riz_complet: ["Riz complet", "epicerie"],
  spaghetti: ["Spaghetti", "epicerie"], pates: ["Pâtes (fusilli, penne…)", "epicerie"], tagliatelles: ["Tagliatelles", "epicerie"], lasagnes: ["Feuilles de lasagne", "epicerie"],
  nouilles_riz: ["Nouilles de riz", "epicerie"], semoule: ["Semoule", "epicerie"], boulgour: ["Boulgour fin", "epicerie"], quinoa: ["Quinoa", "epicerie"],
  lentilles_corail: ["Lentilles corail", "epicerie"], farine: ["Farine", "epicerie"], chapelure: ["Chapelure", "epicerie"],
  haricots_rouges: ["Haricots rouges (boîte 400 g)", "epicerie"], pois_chiches: ["Pois chiches (boîte 400 g)", "epicerie"], tomates_concassees: ["Tomates concassées (boîte 400 g)", "epicerie"],
  thon: ["Thon au naturel", "epicerie"], mais: ["Maïs (petite boîte)", "epicerie"], lait_coco: ["Lait de coco", "epicerie"], coulis: ["Coulis de tomate", "epicerie"],
  pesto: ["Pesto", "epicerie"], olives_vertes: ["Olives vertes", "epicerie"], olives_noires: ["Olives noires", "epicerie"], citron_confit: ["Citron confit", "epicerie"],
  sauce_soja: ["Sauce soja", "epicerie"], nuoc_mam: ["Nuoc-mâm", "epicerie"], tahini: ["Tahini", "epicerie"], miel: ["Miel", "epicerie"],
  cacahuetes: ["Cacahuètes", "epicerie"], noix: ["Cerneaux de noix", "epicerie"], pignons: ["Pignons de pin", "epicerie"], sesame: ["Graines de sésame", "epicerie"],
  bouillon: ["Cubes de bouillon", "epicerie"], cornichons: ["Cornichons", "epicerie"],
  tortillas: ["Tortillas de blé", "epicerie"], pain_mie: ["Pain de mie", "epicerie"],
  pruneaux: ["Pruneaux dénoyautés", "epicerie"], amandes: ["Amandes effilées", "epicerie"], raisins_secs: ["Raisins secs", "epicerie"],
  vermicelles: ["Vermicelles (cheveux d'ange)", "epicerie"], vermicelles_riz: ["Vermicelles de riz", "epicerie"], pois_casses: ["Pois cassés", "epicerie"],
  haricots_blancs: ["Haricots blancs (boîte 400 g)", "epicerie"], lentilles_vertes: ["Lentilles vertes", "epicerie"], pois_chiches_secs: ["Pois chiches secs", "epicerie"],
  tomates_sechees: ["Tomates séchées", "epicerie"], capres: ["Câpres", "epicerie"], polenta: ["Polenta", "epicerie"], pate_curry_vert: ["Pâte de curry vert", "epicerie"],
  nouilles_soba: ["Nouilles soba", "epicerie"], udon: ["Nouilles udon", "epicerie"], nouilles_chinoises: ["Nouilles chinoises (blé)", "epicerie"], miso: ["Pâte miso", "epicerie"],
  cajou: ["Noix de cajou", "epicerie"], feuilles_vigne: ["Feuilles de vigne (bocal)", "epicerie"], melasse_grenade: ["Mélasse de grenade", "epicerie"], feves: ["Fèves cuites (boîte 400 g)", "epicerie"],
  // Surgelés
  petits_pois: ["Petits pois", "surgeles"],
  // Boulangerie
  pain: ["Pain de campagne", "boulangerie"], pain_burger: ["Pains à burger", "boulangerie"], pita: ["Pains pita", "boulangerie"],
};

const RECIPES = [
  { id: "poulet-basquaise", name: "Poulet basquaise", cat: "volaille", cui: "fr", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Poulet_basquaise_01.jpg/500px-Poulet_basquaise_01.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poulet_basquaise",
    ing: [["poulet_haut", 4, "pc"], ["poivron", 2, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["tomates_concassees", 1, "boite"], ["riz", 150, "g"]],
    pantry: ["huile d'olive", "piment d'Espelette", "thym", "sel", "poivre"],
    steps: [
      "Salez et poivrez les 4 hauts de cuisse. Dans une cocotte, faites-les dorer dans 2 cuillères à soupe d'huile d'olive, 5 minutes côté peau puis 3 minutes de l'autre côté. Réservez-les sur une assiette.",
      "Émincez l'oignon, coupez les 2 poivrons en lanières et hachez les 2 gousses d'ail. Faites-les revenir dans la cocotte à feu moyen pendant 8 minutes, jusqu'à ce que les poivrons soient souples.",
      "Ajoutez la boîte de tomates concassées, une pincée de piment d'Espelette et le thym. Remettez le poulet dans la sauce, couvrez et laissez mijoter 25 minutes à feu doux, en retournant les morceaux à mi-cuisson.",
      "Pendant ce temps, faites cuire 150 g de riz dans une grande casserole d'eau salée selon le temps indiqué sur le paquet, puis égouttez.",
      "Goûtez la sauce, rectifiez le sel. Servez le poulet nappé de sa sauce aux poivrons, avec le riz."
    ] },

  { id: "carbonara", name: "Spaghetti au bœuf sauté façon carbonara", cat: "pates", cui: "it", time: 20, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Spaghetti_alla_Carbonara_%28Madrid%29.JPG/500px-Spaghetti_alla_Carbonara_%28Madrid%29.JPG", imgPage: "https://fr.wikipedia.org/wiki/P%C3%A2tes_%C3%A0_la_carbonara",
    ing: [["spaghetti", 200, "g"], ["boeuf_saute", 200, "g"], ["oeuf", 3, "pc"], ["parmesan", 60, "g"], ["ail", 1, "gousse"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Portez une grande casserole d'eau salée à ébullition et faites cuire 200 g de spaghetti al dente (1 minute de moins que le paquet).",
      "Coupez 200 g de bœuf en fines lanières, salez, poivrez. Dans une poêle très chaude avec 1 cuillère d'huile d'olive, saisissez-les 2 minutes avec la gousse d'ail écrasée, puis coupez le feu.",
      "Dans un saladier, battez 1 œuf entier et 2 jaunes avec 60 g de parmesan râpé et beaucoup de poivre du moulin.",
      "Égouttez les pâtes en gardant une louche d'eau de cuisson. Versez-les dans la poêle avec le bœuf, hors du feu, puis ajoutez le mélange aux œufs en remuant vivement.",
      "Ajoutez un peu d'eau de cuisson chaude jusqu'à obtenir une sauce crémeuse qui nappe les pâtes, sans les brouiller. Servez aussitôt avec du poivre."
    ] },

  { id: "gratin-dauphinois", name: "Gratin dauphinois, salade verte", cat: "vege", cui: "fr", time: 80, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Gratin_dauphinois.jpg/500px-Gratin_dauphinois.jpg", imgPage: "https://fr.wikipedia.org/wiki/Gratin_dauphinois",
    ing: [["pdt", 800, "g"], ["creme_liquide", 20, "cl"], ["lait", 20, "cl"], ["ail", 1, "gousse"], ["beurre", 20, "g"], ["laitue", 1, "pc"]],
    pantry: ["muscade", "sel", "poivre", "huile d'olive", "vinaigre"],
    steps: [
      "Préchauffez le four à 160 °C. Frottez un plat à gratin avec la gousse d'ail coupée en deux, puis beurrez-le.",
      "Épluchez 800 g de pommes de terre et coupez-les en rondelles très fines (2 mm) à la mandoline ou au couteau. Ne les rincez pas : l'amidon lie le gratin.",
      "Disposez-les en couches dans le plat en salant, poivrant et râpant un peu de muscade entre chaque couche.",
      "Mélangez 20 cl de crème liquide et 20 cl de lait, versez sur les pommes de terre : le liquide doit affleurer. Parsemez de quelques noisettes de beurre.",
      "Enfournez 1 h 15. Le dessus doit être doré et la pointe d'un couteau s'enfoncer sans résistance. Laissez reposer 5 minutes.",
      "Servez avec la laitue assaisonnée d'une vinaigrette (1 cuillère de vinaigre, 3 d'huile d'olive, sel, poivre)."
    ] },

  { id: "saumon-four", name: "Saumon au four, légumes rôtis", cat: "poisson", cui: "fr", time: 35, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["saumon", 300, "g"], ["courgette", 1, "pc"], ["poivron", 1, "pc"], ["oignon_rouge", 1, "pc"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "herbes de Provence", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Coupez la courgette en demi-rondelles, le poivron en lanières et l'oignon rouge en quartiers.",
      "Étalez les légumes sur une plaque, arrosez de 2 cuillères à soupe d'huile d'olive, salez, poivrez, saupoudrez d'herbes de Provence. Enfournez 20 minutes.",
      "Sortez la plaque, poussez les légumes sur les côtés et déposez les 2 pavés de saumon au centre, peau dessous. Salez, poivrez, posez 2 rondelles de citron sur chaque pavé.",
      "Remettez au four 12 minutes : le saumon doit rester légèrement rosé au cœur.",
      "Servez avec le reste du citron à presser dessus."
    ] },

  { id: "quiche-lorraine", name: "Quiche au jambon de bœuf et oignons", cat: "oeufs", cui: "fr", time: 50, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Quiche_Lorraine.jpg/500px-Quiche_Lorraine.jpg", imgPage: "https://fr.wikipedia.org/wiki/Quiche",
    ing: [["pate_brisee", 1, "pc"], ["jambon_boeuf", 3, "tranche"], ["oignon", 1, "pc"], ["oeuf", 3, "pc"], ["creme", 20, "cl"], ["lait", 10, "cl"], ["gruyere", 80, "g"], ["beurre", 15, "g"]],
    pantry: ["muscade", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 180 °C. Déroulez la pâte brisée dans un moule à tarte avec son papier, piquez le fond à la fourchette.",
      "Émincez l'oignon et faites-le fondre 8 minutes dans 15 g de beurre à feu doux, sans coloration. Coupez les 3 tranches de jambon de bœuf en lanières.",
      "Dans un saladier, battez 3 œufs avec 20 cl de crème fraîche et 10 cl de lait. Salez légèrement, poivrez généreusement, ajoutez une pincée de muscade.",
      "Répartissez l'oignon et le jambon sur la pâte, puis 80 g de gruyère râpé. Versez l'appareil par-dessus.",
      "Enfournez 35 minutes, jusqu'à ce que la quiche soit dorée et prise au centre. Laissez tiédir 5 minutes avant de couper."
    ] },

  { id: "chili", name: "Chili con carne", cat: "viande", cui: "mx", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Bowl_of_chili.jpg/500px-Bowl_of_chili.jpg", imgPage: "https://fr.wikipedia.org/wiki/Chili_con_carne",
    ing: [["boeuf_hache", 300, "g"], ["haricots_rouges", 1, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["poivron", 1, "pc"], ["riz", 150, "g"]],
    pantry: ["cumin", "paprika", "huile", "sel", "poivre"],
    steps: [
      "Hachez l'oignon et 2 gousses d'ail, coupez le poivron en dés. Faites-les revenir dans une cocotte avec 1 cuillère à soupe d'huile pendant 5 minutes.",
      "Ajoutez 300 g de bœuf haché, émiettez-le à la cuillère en bois et faites-le colorer 5 minutes à feu vif.",
      "Saupoudrez de 1 cuillère à café de cumin et 1 de paprika, mélangez 30 secondes. Ajoutez la boîte de tomates concassées, salez, poivrez et laissez mijoter 20 minutes à feu doux, à demi couvert.",
      "Égouttez et rincez les haricots rouges, ajoutez-les et poursuivez la cuisson 10 minutes. La sauce doit être épaisse.",
      "Faites cuire 150 g de riz pendant ce temps. Servez le chili sur le riz."
    ] },

  { id: "cesar", name: "Salade César au poulet", cat: "salade", cui: "us", time: 20, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Ceasar_salad_%286814864465%29.jpg/500px-Ceasar_salad_%286814864465%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Salade_C%C3%A9sar",
    ing: [["poulet_blanc", 250, "g"], ["romaine", 1, "pc"], ["parmesan", 40, "g"], ["pain", 2, "tranche"], ["oeuf", 1, "pc"], ["citron", 1, "pc"], ["ail", 1, "gousse"]],
    pantry: ["moutarde", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 250 g de blanc de poulet en lanières, salez, poivrez, et faites-les dorer 8 minutes à la poêle avec un filet d'huile d'olive. Réservez.",
      "Coupez 2 tranches de pain en dés, faites-les dorer dans la même poêle avec un peu d'huile 3 minutes, en remuant. Réservez.",
      "Sauce : dans un bol, mélangez 1 jaune d'œuf, 1 cuillère à café de moutarde, la gousse d'ail pressée et le jus d'un demi-citron. Versez 6 cuillères à soupe d'huile d'olive en filet en fouettant, puis 20 g de parmesan râpé, sel et poivre.",
      "Lavez et essorez la romaine, coupez-la en gros morceaux. Mélangez avec la sauce dans un saladier.",
      "Ajoutez le poulet, les croûtons, le reste du parmesan en copeaux. Servez aussitôt."
    ] },

  { id: "risotto", name: "Risotto aux champignons", cat: "pates", cui: "it", time: 35, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Flickr_-_cyclonebill_-_Risotto_med_citron_og_gr%C3%B8nne_b%C3%B8nner.jpg/500px-Flickr_-_cyclonebill_-_Risotto_med_citron_og_gr%C3%B8nne_b%C3%B8nner.jpg", imgPage: "https://fr.wikipedia.org/wiki/Risotto",
    ing: [["riz_arborio", 180, "g"], ["champignons", 250, "g"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"], ["parmesan", 50, "g"], ["beurre", 30, "g"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Faites dissoudre le cube de bouillon dans 75 cl d'eau et gardez le bouillon frémissant dans une casserole.",
      "Émincez 250 g de champignons et faites-les sauter à feu vif dans une poêle avec un filet d'huile, 6 minutes, jusqu'à ce qu'ils soient dorés. Salez, réservez.",
      "Dans une sauteuse, faites fondre l'oignon haché dans 1 cuillère d'huile 3 minutes. Ajoutez 180 g de riz arborio et remuez 2 minutes jusqu'à ce que les grains deviennent translucides.",
      "Ajoutez une louche de bouillon chaud, remuez jusqu'à absorption, puis recommencez louche par louche pendant environ 18 minutes. Le riz doit être crémeux et encore légèrement ferme.",
      "Hors du feu, incorporez les champignons, 30 g de beurre et 50 g de parmesan râpé. Couvrez 2 minutes, poivrez et servez immédiatement."
    ] },

  { id: "omelette", name: "Omelette aux herbes, tomates en salade", cat: "oeufs", cui: "fr", time: 15, slots: ["midi"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Omelette-Plate.jpg/500px-Omelette-Plate.jpg", imgPage: "https://fr.wikipedia.org/wiki/Omelette",
    ing: [["oeuf", 5, "pc"], ["ciboulette", 1, "botte"], ["beurre", 15, "g"], ["tomate", 3, "pc"], ["echalote", 1, "pc"]],
    pantry: ["huile d'olive", "vinaigre", "sel", "poivre"],
    steps: [
      "Coupez les 3 tomates en quartiers, ciselez l'échalote. Assaisonnez avec 1 cuillère de vinaigre, 3 d'huile d'olive, sel et poivre. Réservez.",
      "Cassez 5 œufs dans un bol, ajoutez la ciboulette ciselée, sel et poivre. Battez à la fourchette sans trop insister.",
      "Faites chauffer 15 g de beurre dans une poêle antiadhésive à feu vif. Quand il mousse, versez les œufs.",
      "Ramenez les bords vers le centre avec une spatule pendant 1 minute pour que l'œuf cru coule dessous. Quand le dessus est encore baveux, pliez l'omelette en deux.",
      "Faites glisser sur les assiettes et servez aussitôt avec la salade de tomates."
    ] },

  { id: "ratatouille", name: "Ratatouille et riz", cat: "vege", cui: "fr", time: 50, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Ratatouille_001.jpg/500px-Ratatouille_001.jpg", imgPage: "https://fr.wikipedia.org/wiki/Ratatouille",
    ing: [["aubergine", 1, "pc"], ["courgette", 2, "pc"], ["poivron", 2, "pc"], ["tomate", 4, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["riz", 150, "g"]],
    pantry: ["huile d'olive", "thym", "sel", "poivre"],
    steps: [
      "Coupez l'aubergine, les 2 courgettes, les 2 poivrons et l'oignon en dés de 2 cm. Pelez les 4 tomates (plongez-les 30 secondes dans l'eau bouillante) et concassez-les.",
      "Dans une cocotte avec 2 cuillères d'huile d'olive, faites revenir l'aubergine 6 minutes à feu vif, réservez. Faites de même avec les courgettes, puis avec les poivrons et l'oignon.",
      "Remettez tous les légumes dans la cocotte, ajoutez les tomates, 2 gousses d'ail hachées, le thym, sel et poivre.",
      "Couvrez et laissez mijoter 30 minutes à feu doux en remuant de temps en temps. Les légumes doivent être fondants mais garder leur forme.",
      "Faites cuire 150 g de riz. Servez la ratatouille chaude ou tiède, avec un filet d'huile d'olive crue."
    ] },

  { id: "boeuf-carottes", name: "Bœuf aux carottes", cat: "viande", cui: "fr", time: 100, slots: ["soir"],
    ing: [["boeuf_braiser", 500, "g"], ["carotte", 500, "g"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"], ["ail", 1, "gousse"], ["farine", 20, "g"]],
    pantry: ["laurier", "thym", "huile", "sel", "poivre"],
    steps: [
      "Coupez 500 g de bœuf en cubes de 4 cm, salez, poivrez. Dans une cocotte, faites-les colorer sur toutes les faces dans 2 cuillères d'huile, par petites quantités. Réservez.",
      "Faites fondre l'oignon émincé dans la cocotte 3 minutes. Remettez la viande, saupoudrez de 20 g de farine et remuez 1 minute pour l'enrober.",
      "Préparez 55 cl de bouillon avec le cube. Versez-le dans la cocotte en grattant le fond, ajoutez la gousse d'ail écrasée, le laurier et le thym.",
      "Couvrez et laissez mijoter 1 h 15 à feu très doux, la viande doit à peine frémir.",
      "Épluchez 500 g de carottes et coupez-les en rondelles épaisses. Ajoutez-les et poursuivez 30 minutes. La viande doit se défaire à la fourchette. Servez avec du pain ou des pommes de terre vapeur."
    ] },

  { id: "wok-poulet", name: "Wok de poulet aux légumes", cat: "volaille", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Making_Stir-Fry_%283286445383%29.jpg/500px-Making_Stir-Fry_%283286445383%29.jpg", imgPage: "https://en.wikipedia.org/wiki/Stir_frying",
    ing: [["poulet_blanc", 300, "g"], ["brocoli", 1, "pc"], ["carotte", 1, "pc"], ["poivron", 1, "pc"], ["sauce_soja", 4, "cs"], ["gingembre", 20, "g"], ["ail", 1, "gousse"], ["nouilles_riz", 150, "g"], ["sesame", 1, "cs"]],
    pantry: ["huile"],
    steps: [
      "Faites tremper 150 g de nouilles de riz dans l'eau chaude selon le paquet (généralement 5 à 8 minutes), puis égouttez.",
      "Coupez 300 g de blanc de poulet en lanières fines. Détaillez le brocoli en petits bouquets, la carotte en bâtonnets fins, le poivron en lanières. Râpez 20 g de gingembre et hachez la gousse d'ail.",
      "Dans un wok ou une grande poêle très chaude avec 1 cuillère d'huile, saisissez le poulet 3 minutes en remuant. Réservez.",
      "Ajoutez un peu d'huile, puis le brocoli et la carotte 3 minutes, le poivron 2 minutes, enfin l'ail et le gingembre 1 minute. Les légumes doivent rester croquants.",
      "Remettez le poulet, ajoutez les nouilles et 4 cuillères de sauce soja. Mélangez 2 minutes à feu vif. Parsemez de graines de sésame et servez."
    ] },

  { id: "chevre-chaud", name: "Tartines de chèvre chaud, mâche aux noix", cat: "oeufs", cui: "fr", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Salade_de_ch%C3%A8vre_chaud_002.jpg/500px-Salade_de_ch%C3%A8vre_chaud_002.jpg", imgPage: "https://fr.wikipedia.org/wiki/Salade_de_ch%C3%A8vre_chaud",
    ing: [["pain", 4, "tranche"], ["chevre", 150, "g"], ["miel", 1, "cs"], ["mache", 100, "g"], ["noix", 30, "g"]],
    pantry: ["vinaigre balsamique", "huile d'olive", "poivre"],
    steps: [
      "Préchauffez le gril du four. Coupez la bûche de chèvre en 8 rondelles.",
      "Posez 4 tranches de pain de campagne sur une plaque, déposez 2 rondelles de chèvre sur chacune, un filet de miel et du poivre.",
      "Passez sous le gril 5 à 6 minutes : le chèvre doit être fondant et légèrement doré.",
      "Pendant ce temps, lavez la mâche, préparez une vinaigrette avec 1 cuillère de vinaigre balsamique et 3 d'huile d'olive, et concassez grossièrement les noix.",
      "Dressez la mâche avec les noix, posez les tartines chaudes dessus et servez."
    ] },

  { id: "soupe-potiron", name: "Soupe de potiron, croûtons", cat: "soupe", cui: "fr", time: 35, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Pumpkin_Cream_Soup.jpg/500px-Pumpkin_Cream_Soup.jpg", imgPage: "https://fr.wikipedia.org/wiki/Soupe_de_potiron",
    ing: [["potiron", 800, "g"], ["pdt", 200, "g"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"], ["creme", 10, "cl"], ["pain", 2, "tranche"]],
    pantry: ["muscade", "huile d'olive", "sel", "poivre"],
    steps: [
      "Épluchez le potiron (800 g) et les 200 g de pommes de terre, coupez-les en cubes. Émincez l'oignon.",
      "Dans une casserole, faites suer l'oignon 3 minutes dans 1 cuillère d'huile d'olive. Ajoutez potiron et pommes de terre, puis 80 cl d'eau et le cube de bouillon.",
      "Portez à ébullition, couvrez et laissez cuire 25 minutes, jusqu'à ce que les légumes s'écrasent facilement.",
      "Mixez finement, ajoutez 10 cl de crème, une pincée de muscade, sel et poivre. Détendez avec un peu d'eau si la soupe est trop épaisse.",
      "Coupez 2 tranches de pain en dés et faites-les dorer à la poêle dans un peu d'huile. Servez la soupe avec les croûtons."
    ] },

  { id: "lasagnes", name: "Lasagnes à la bolognaise", cat: "pates", cui: "it", time: 70, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/500px-Lasagne_-_stonesoup.jpg", imgPage: "https://fr.wikipedia.org/wiki/Lasagnes",
    ing: [["lasagnes", 8, "feuille"], ["boeuf_hache", 300, "g"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["carotte", 1, "pc"], ["lait", 40, "cl"], ["beurre", 30, "g"], ["farine", 30, "g"], ["gruyere", 80, "g"]],
    pantry: ["muscade", "origan", "huile", "sel", "poivre"],
    steps: [
      "Bolognaise : faites revenir l'oignon haché et la carotte râpée dans 1 cuillère d'huile 5 minutes. Ajoutez 300 g de bœuf haché, faites colorer, puis 2 gousses d'ail, la boîte de tomates, l'origan, sel, poivre. Mijotez 25 minutes.",
      "Béchamel : faites fondre 30 g de beurre, ajoutez 30 g de farine, remuez 1 minute. Versez 40 cl de lait froid petit à petit en fouettant, cuisez jusqu'à épaississement. Muscade, sel, poivre.",
      "Préchauffez le four à 180 °C. Dans un plat, étalez un peu de béchamel, puis alternez : 2 feuilles de lasagne, bolognaise, béchamel. Répétez 4 fois.",
      "Terminez par de la béchamel et 80 g de gruyère râpé.",
      "Enfournez 35 minutes, jusqu'à ce que le dessus soit doré et bouillonnant. Laissez reposer 10 minutes avant de couper."
    ] },

  { id: "croque", name: "Croque-monsieur au jambon de bœuf, salade", cat: "oeufs", cui: "fr", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Sandwich-Mixto.jpg/500px-Sandwich-Mixto.jpg", imgPage: "https://fr.wikipedia.org/wiki/Croque-monsieur",
    ing: [["pain_mie", 8, "tranche"], ["jambon_boeuf", 4, "tranche"], ["gruyere", 120, "g"], ["beurre", 30, "g"], ["creme", 10, "cl"], ["laitue", 1, "pc"]],
    pantry: ["moutarde", "muscade", "vinaigre", "huile"],
    steps: [
      "Préchauffez le gril du four. Mélangez 10 cl de crème avec une pincée de muscade et un peu de poivre.",
      "Beurrez 8 tranches de pain de mie sur une face (face extérieure). Retournez 4 tranches, tartinez-les de crème muscadée et d'une pointe de moutarde.",
      "Déposez sur chacune 1 tranche de jambon de bœuf pliée et 20 g de gruyère. Refermez avec les autres tranches, face beurrée vers l'extérieur.",
      "Posez sur une plaque, répartissez le reste de gruyère sur le dessus. Passez sous le gril 8 minutes environ, jusqu'à ce que le dessus soit doré et le fromage fondu.",
      "Servez avec la laitue assaisonnée de vinaigrette."
    ] },

  { id: "dahl", name: "Dahl de lentilles corail, riz basmati", cat: "vege", cui: "in", time: 30, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/3_types_of_lentil.png/500px-3_types_of_lentil.png", imgPage: "https://en.wikipedia.org/wiki/Dal",
    ing: [["lentilles_corail", 200, "g"], ["lait_coco", 40, "cl"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["gingembre", 15, "g"], ["tomates_concassees", 1, "boite"], ["riz_basmati", 150, "g"], ["coriandre", 1, "botte"]],
    pantry: ["curry", "cumin", "huile", "sel"],
    steps: [
      "Hachez l'oignon et 2 gousses d'ail, râpez 15 g de gingembre. Faites-les revenir 3 minutes dans 1 cuillère d'huile avec 1 cuillère à soupe de curry et 1 cuillère à café de cumin.",
      "Rincez 200 g de lentilles corail à l'eau froide. Ajoutez-les dans la casserole avec la boîte de tomates, 40 cl de lait de coco et 20 cl d'eau. Salez.",
      "Portez à ébullition puis laissez mijoter 20 minutes à feu doux en remuant régulièrement : les lentilles doivent être fondantes et le dahl épais.",
      "Faites cuire 150 g de riz basmati (rincé) pendant ce temps.",
      "Servez le dahl sur le riz, parsemé de coriandre fraîche ciselée."
    ] },

  { id: "cabillaud-pane", name: "Cabillaud pané maison, purée", cat: "poisson", cui: "fr", time: 35, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Fishfinger_classic_fried_2.jpg/500px-Fishfinger_classic_fried_2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poisson_pan%C3%A9",
    ing: [["cabillaud", 300, "g"], ["chapelure", 60, "g"], ["farine", 30, "g"], ["oeuf", 1, "pc"], ["pdt", 600, "g"], ["lait", 10, "cl"], ["beurre", 40, "g"], ["citron", 1, "pc"]],
    pantry: ["huile", "sel", "poivre", "muscade"],
    steps: [
      "Épluchez 600 g de pommes de terre, coupez-les en cubes et faites-les cuire 20 minutes dans l'eau bouillante salée.",
      "Préparez trois assiettes : 30 g de farine, 1 œuf battu, 60 g de chapelure. Coupez le cabillaud en 2 ou 4 portions, salez, poivrez, passez-les dans la farine, puis l'œuf, puis la chapelure en pressant bien.",
      "Égouttez les pommes de terre, écrasez-les avec 30 g de beurre et 10 cl de lait chaud. Muscade, sel, poivre. Gardez au chaud.",
      "Faites chauffer 2 cuillères d'huile et 10 g de beurre dans une poêle. Cuisez le poisson 3 à 4 minutes par face jusqu'à ce que la panure soit bien dorée.",
      "Servez avec la purée et des quartiers de citron."
    ] },

  { id: "salade-pates-thon", name: "Salade de pâtes au thon", cat: "salade", cui: "it", time: 20, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Pasta_salad_closeup.JPG/500px-Pasta_salad_closeup.JPG", imgPage: "https://fr.wikipedia.org/wiki/Salade_de_p%C3%A2tes",
    ing: [["pates", 200, "g"], ["thon", 1, "boite"], ["tomates_cerises", 200, "g"], ["mais", 1, "boite"], ["concombre", 1, "pc"], ["mozzarella", 125, "g"], ["basilic", 1, "botte"]],
    pantry: ["huile d'olive", "vinaigre", "sel", "poivre"],
    steps: [
      "Faites cuire 200 g de pâtes al dente dans l'eau bouillante salée, égouttez et rafraîchissez sous l'eau froide.",
      "Coupez 200 g de tomates cerises en deux, un demi-concombre en dés, la mozzarella en cubes. Égouttez le maïs et le thon.",
      "Dans un saladier, mélangez les pâtes, les légumes, le thon émietté, le maïs et la mozzarella.",
      "Assaisonnez avec 3 cuillères d'huile d'olive, 1 de vinaigre, sel et poivre. Ajoutez le basilic ciselé.",
      "Servez frais ou à température ambiante. Se garde très bien au réfrigérateur pour le lendemain."
    ] },

  { id: "steak-haricots", name: "Steak haché, haricots verts persillés", cat: "viande", cui: "fr", time: 20, slots: ["midi", "soir"],
    ing: [["steak_hache", 2, "pc"], ["haricots_verts", 400, "g"], ["echalote", 1, "pc"], ["beurre", 20, "g"], ["ail", 1, "gousse"], ["persil", 1, "botte"]],
    pantry: ["moutarde", "sel", "poivre"],
    steps: [
      "Équeutez 400 g de haricots verts. Plongez-les 8 minutes dans une grande casserole d'eau bouillante salée, puis égouttez-les.",
      "Dans une poêle, faites fondre 20 g de beurre, ajoutez la gousse d'ail hachée puis les haricots. Faites-les sauter 3 minutes, ajoutez le persil ciselé, salez, poivrez.",
      "Dans une autre poêle bien chaude avec un filet d'huile, cuisez les 2 steaks hachés 2 à 3 minutes par face selon la cuisson souhaitée. Salez et poivrez après cuisson.",
      "Retirez les steaks, jetez l'échalote ciselée dans la poêle 1 minute, puis versez-la sur la viande.",
      "Servez avec les haricots et de la moutarde."
    ] },

  { id: "tajine-poulet", name: "Tajine de poulet aux olives et citron confit", cat: "volaille", cui: "ma", time: 60, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Tajine_008.JPG/500px-Tajine_008.JPG", imgPage: "https://fr.wikipedia.org/wiki/Tajine",
    ing: [["poulet_haut", 4, "pc"], ["oignon", 2, "pc"], ["ail", 2, "gousse"], ["citron_confit", 1, "pc"], ["olives_vertes", 100, "g"], ["coriandre", 1, "botte"], ["semoule", 150, "g"]],
    pantry: ["curcuma", "gingembre moulu", "cumin", "huile d'olive", "sel", "poivre"],
    steps: [
      "Salez et poivrez les 4 hauts de cuisse. Dans une cocotte ou un plat à tajine, faites-les dorer 4 minutes de chaque côté dans 2 cuillères d'huile d'olive. Réservez.",
      "Émincez les 2 oignons et faites-les fondre 5 minutes dans la cocotte. Ajoutez 2 gousses d'ail hachées, 1 cuillère à café de curcuma, 1 de gingembre moulu et 1 de cumin. Mélangez 1 minute.",
      "Remettez le poulet, versez 20 cl d'eau, ajoutez le citron confit coupé en quartiers (retirez la pulpe si elle est amère). Couvrez et laissez mijoter 35 minutes à feu doux.",
      "Ajoutez 100 g d'olives vertes 10 minutes avant la fin. La sauce doit être onctueuse ; découvrez quelques minutes si elle est trop liquide.",
      "Préparez 150 g de semoule : versez le même volume d'eau bouillante salée dessus, couvrez 5 minutes, égrenez à la fourchette avec un filet d'huile.",
      "Servez le tajine parsemé de coriandre ciselée, avec la semoule."
    ] },

  { id: "tomates-farcies", name: "Tomates farcies au bœuf, riz", cat: "viande", cui: "fr", time: 60, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Tomates_farcies_maison_de_Mina_Biennier.jpg/500px-Tomates_farcies_maison_de_Mina_Biennier.jpg", imgPage: "https://fr.wikipedia.org/wiki/Tomates_farcies",
    ing: [["tomate", 4, "pc"], ["boeuf_hache", 300, "g"], ["oignon", 1, "pc"], ["ail", 1, "gousse"], ["persil", 1, "botte"], ["pain", 1, "tranche"], ["riz", 120, "g"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 180 °C. Coupez un chapeau sur les 4 tomates, évidez-les à la cuillère (gardez la pulpe), salez l'intérieur et retournez-les 10 minutes sur une grille.",
      "Faites tremper la tranche de pain dans un peu d'eau ou de lait, puis essorez-la. Hachez l'oignon, la gousse d'ail et le persil.",
      "Mélangez 300 g de bœuf haché avec le pain émietté, l'oignon, l'ail, le persil, sel et poivre. Travaillez à la main pour une farce homogène.",
      "Garnissez les tomates de farce en formant un dôme, posez les chapeaux. Placez-les dans un plat, versez 120 g de riz cru tout autour avec la pulpe des tomates, 20 cl d'eau et un filet d'huile d'olive.",
      "Enfournez 45 minutes. Le riz absorbe le jus des tomates ; ajoutez un peu d'eau à mi-cuisson s'il est sec."
    ] },

  { id: "pizza", name: "Pizza margherita maison", cat: "vege", cui: "it", time: 30, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/500px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Pizza_Margherita",
    ing: [["pate_pizza", 1, "pc"], ["coulis", 200, "g"], ["mozzarella", 250, "g"], ["basilic", 1, "botte"]],
    pantry: ["huile d'olive", "origan", "sel"],
    steps: [
      "Préchauffez le four à 240 °C avec la plaque dedans (ou une pierre à pizza).",
      "Étalez la pâte sur du papier cuisson. Étalez 200 g de coulis de tomate en laissant un bord de 2 cm, salez légèrement, saupoudrez d'origan.",
      "Égouttez la mozzarella (250 g), coupez-la en tranches et répartissez-les sur la pizza.",
      "Faites glisser la pizza sur la plaque chaude et enfournez 12 à 15 minutes, jusqu'à ce que le bord soit doré et le fromage bouillonnant.",
      "À la sortie, ajoutez les feuilles de basilic et un filet d'huile d'olive."
    ] },

  { id: "galettes", name: "Galettes complètes", cat: "oeufs", cui: "fr", time: 20, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Galette_de_sarrasin_compl%C3%A8te_bretonne.jpg/500px-Galette_de_sarrasin_compl%C3%A8te_bretonne.jpg", imgPage: "https://fr.wikipedia.org/wiki/Galette_de_sarrasin_(Haute-Bretagne)",
    ing: [["galettes", 4, "pc"], ["jambon_boeuf", 2, "tranche"], ["oeuf", 2, "pc"], ["gruyere", 100, "g"], ["beurre", 20, "g"], ["laitue", 1, "pc"]],
    pantry: ["vinaigre", "huile", "sel", "poivre"],
    steps: [
      "Râpez ou sortez 100 g de gruyère, coupez les tranches de jambon de bœuf en deux. Préparez la laitue et une vinaigrette.",
      "Faites chauffer une grande poêle à feu moyen avec une noisette de beurre. Posez une galette de sarrasin.",
      "Répartissez 25 g de gruyère, une demi-tranche de jambon, puis cassez un œuf au centre. Salez, poivrez. Couvrez et laissez cuire 3 minutes : le blanc doit être pris, le jaune coulant.",
      "Repliez les 4 bords de la galette vers le centre en laissant le jaune visible. Faites glisser sur l'assiette.",
      "Recommencez pour les autres galettes (2 par personne). Servez avec la salade."
    ] },

  { id: "nicoise", name: "Salade niçoise", cat: "salade", cui: "fr", time: 25, slots: ["midi"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Salade_ni%C3%A7oise_001.jpg/500px-Salade_ni%C3%A7oise_001.jpg", imgPage: "https://fr.wikipedia.org/wiki/Salade_ni%C3%A7oise",
    ing: [["thon", 1, "boite"], ["oeuf", 2, "pc"], ["tomate", 3, "pc"], ["haricots_verts", 200, "g"], ["pdt", 300, "g"], ["olives_noires", 50, "g"], ["oignon_rouge", 1, "pc"], ["laitue", 1, "pc"]],
    pantry: ["huile d'olive", "vinaigre", "moutarde", "sel", "poivre"],
    steps: [
      "Faites cuire 300 g de pommes de terre en robe des champs 20 minutes, les 2 œufs 9 minutes, et 200 g de haricots verts 8 minutes dans l'eau bouillante salée. Refroidissez les œufs sous l'eau froide.",
      "Épluchez les pommes de terre encore tièdes et coupez-les en rondelles. Écalez les œufs et coupez-les en quartiers. Coupez les 3 tomates en quartiers et l'oignon rouge en fines rondelles.",
      "Vinaigrette : 1 cuillère à café de moutarde, 1 cuillère à soupe de vinaigre, 4 cuillères d'huile d'olive, sel, poivre.",
      "Dans un grand plat, disposez la laitue, puis les pommes de terre, les haricots, les tomates, l'oignon, le thon émietté et 50 g d'olives noires.",
      "Ajoutez les œufs par-dessus, arrosez de vinaigrette au moment de servir."
    ] },

  { id: "blanquette", name: "Blanquette de veau, riz", cat: "viande", cui: "fr", time: 75, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Blanquette_de_veau_%C3%A0_l%27ancienne_04.jpg/500px-Blanquette_de_veau_%C3%A0_l%27ancienne_04.jpg", imgPage: "https://fr.wikipedia.org/wiki/Blanquette_de_veau",
    ing: [["veau", 500, "g"], ["carotte", 2, "pc"], ["poireau", 1, "pc"], ["oignon", 1, "pc"], ["champignons", 150, "g"], ["creme", 15, "cl"], ["oeuf", 1, "pc"], ["bouillon", 1, "pc"], ["farine", 20, "g"], ["beurre", 20, "g"], ["citron", 1, "pc"], ["riz", 150, "g"]],
    pantry: ["laurier", "thym", "sel", "poivre"],
    steps: [
      "Coupez 500 g d'épaule de veau en cubes. Mettez-les dans une casserole, couvrez d'eau froide, portez à ébullition 2 minutes, puis égouttez et rincez.",
      "Remettez la viande dans la casserole avec les 2 carottes en rondelles, le poireau en tronçons, l'oignon entier, le cube de bouillon, le laurier et le thym. Couvrez d'eau, laissez frémir 1 heure à couvert.",
      "Faites cuire 150 g de riz. Émincez 150 g de champignons.",
      "Dans une autre casserole, faites fondre 20 g de beurre, ajoutez 20 g de farine, remuez 1 minute, puis versez 40 cl du jus de cuisson filtré en fouettant. Cuisez 5 minutes, ajoutez les champignons 5 minutes de plus.",
      "Hors du feu, mélangez 15 cl de crème, 1 jaune d'œuf et le jus d'un demi-citron, incorporez à la sauce sans faire bouillir. Ajoutez la viande et les carottes, salez, poivrez. Servez avec le riz."
    ] },

  { id: "gratin-courgettes", name: "Gratin de courgettes", cat: "vege", cui: "fr", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Cheese_and_potato_casserole_from_Poznan_%282%29.JPG/500px-Cheese_and_potato_casserole_from_Poznan_%282%29.JPG", imgPage: "https://fr.wikipedia.org/wiki/Gratin",
    ing: [["courgette", 3, "pc"], ["oeuf", 3, "pc"], ["creme", 20, "cl"], ["gruyere", 80, "g"], ["oignon", 1, "pc"], ["ail", 1, "gousse"]],
    pantry: ["muscade", "huile d'olive", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 190 °C. Coupez 3 courgettes en fines rondelles, émincez l'oignon, hachez la gousse d'ail.",
      "Dans une grande poêle avec 2 cuillères d'huile d'olive, faites sauter les courgettes avec l'oignon et l'ail 10 minutes à feu vif, jusqu'à ce qu'elles soient tendres et que l'eau se soit évaporée. Salez, poivrez.",
      "Battez 3 œufs avec 20 cl de crème, une pincée de muscade et la moitié des 80 g de gruyère.",
      "Versez les courgettes dans un plat à gratin huilé, recouvrez de l'appareil aux œufs et du reste de gruyère.",
      "Enfournez 30 minutes jusqu'à ce que le gratin soit pris et doré. Servez avec une salade verte."
    ] },

  { id: "pad-thai", name: "Pad thaï aux crevettes", cat: "poisson", cui: "as", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg/500px-Phat_Thai_kung_Chang_Khien_street_stall.jpg", imgPage: "https://fr.wikipedia.org/wiki/Phat_thai",
    ing: [["nouilles_riz", 150, "g"], ["crevettes", 200, "g"], ["oeuf", 2, "pc"], ["germes_soja", 100, "g"], ["oignon_nouveau", 2, "pc"], ["cacahuetes", 30, "g"], ["citron_vert", 1, "pc"], ["sauce_soja", 2, "cs"], ["nuoc_mam", 1, "cs"], ["ail", 1, "gousse"]],
    pantry: ["sucre", "huile"],
    steps: [
      "Faites tremper 150 g de nouilles de riz dans l'eau chaude selon le paquet, puis égouttez. Préparez la sauce : 2 cuillères de sauce soja, 1 de nuoc-mâm, 1 de sucre, le jus d'un demi-citron vert.",
      "Hachez la gousse d'ail, émincez les 2 oignons nouveaux, concassez 30 g de cacahuètes.",
      "Dans un wok très chaud avec 1 cuillère d'huile, faites sauter l'ail 20 secondes puis 200 g de crevettes 2 minutes. Poussez-les sur le côté.",
      "Cassez 2 œufs dans l'espace libre, brouillez-les 1 minute, puis mélangez tout.",
      "Ajoutez les nouilles et la sauce, mélangez 2 minutes à feu vif, puis 100 g de germes de soja 30 secondes.",
      "Servez avec les cacahuètes, les oignons nouveaux et un quartier de citron vert."
    ] },

  { id: "veloute-poireaux", name: "Velouté poireaux–pommes de terre", cat: "soupe", cui: "fr", time: 35, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Mon_Plaisir%2C_Covent_Garden%2C_London_%283717184145%29.jpg/500px-Mon_Plaisir%2C_Covent_Garden%2C_London_%283717184145%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Soupe_de_poireaux",
    ing: [["poireau", 2, "pc"], ["pdt", 400, "g"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"], ["creme", 10, "cl"], ["beurre", 20, "g"]],
    pantry: ["sel", "poivre"],
    steps: [
      "Fendez les 2 poireaux, lavez-les soigneusement et émincez-les. Émincez l'oignon. Épluchez 400 g de pommes de terre et coupez-les en cubes.",
      "Dans une casserole, faites fondre 20 g de beurre et faites suer poireaux et oignon 5 minutes à feu doux sans coloration.",
      "Ajoutez les pommes de terre, 80 cl d'eau et le cube de bouillon. Portez à ébullition, couvrez et laissez cuire 25 minutes.",
      "Mixez finement, ajoutez 10 cl de crème, salez, poivrez.",
      "Servez bien chaud, avec du pain grillé."
    ] },

  { id: "hachis", name: "Hachis parmentier", cat: "viande", cui: "fr", time: 50, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Hachis_parmentier_01.jpg/500px-Hachis_parmentier_01.jpg", imgPage: "https://fr.wikipedia.org/wiki/Hachis_parmentier",
    ing: [["boeuf_hache", 300, "g"], ["pdt", 700, "g"], ["oignon", 1, "pc"], ["ail", 1, "gousse"], ["lait", 15, "cl"], ["beurre", 40, "g"], ["gruyere", 60, "g"], ["persil", 1, "botte"]],
    pantry: ["muscade", "huile", "sel", "poivre"],
    steps: [
      "Épluchez 700 g de pommes de terre, coupez-les en morceaux et faites-les cuire 20 minutes dans l'eau bouillante salée. Écrasez-les avec 30 g de beurre et 15 cl de lait chaud, muscade, sel, poivre.",
      "Pendant ce temps, faites revenir l'oignon et la gousse d'ail hachés dans 1 cuillère d'huile 4 minutes. Ajoutez 300 g de bœuf haché, faites colorer 6 minutes en émiettant. Salez, poivrez, ajoutez le persil ciselé.",
      "Préchauffez le four à 200 °C. Étalez la viande au fond d'un plat à gratin.",
      "Recouvrez de purée, lissez, parsemez de 60 g de gruyère et de quelques noisettes de beurre.",
      "Enfournez 20 minutes jusqu'à ce que le dessus soit doré. Servez avec une salade verte."
    ] },

  { id: "quinoa-feta", name: "Salade de quinoa, feta et légumes croquants", cat: "vege", cui: "med", time: 25, slots: ["midi"], diet: ["leger", "chol"],
    ing: [["quinoa", 150, "g"], ["feta", 100, "g"], ["concombre", 1, "pc"], ["tomates_cerises", 200, "g"], ["poivron", 1, "pc"], ["oignon_rouge", 1, "pc"], ["menthe", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "cumin", "sel", "poivre"],
    steps: [
      "Rincez 150 g de quinoa sous l'eau froide. Faites-le cuire 12 minutes dans 30 cl d'eau salée à couvert, puis laissez gonfler 5 minutes hors du feu et refroidir.",
      "Coupez le concombre (la moitié), le poivron et l'oignon rouge en petits dés, les tomates cerises en deux. Émiettez la feta, ciselez la menthe.",
      "Sauce : le jus du citron, 4 cuillères d'huile d'olive, 1 cuillère à café de cumin, sel, poivre.",
      "Mélangez le quinoa froid avec les légumes, la feta et la menthe. Versez la sauce et mélangez.",
      "Servez frais. Se prépare la veille sans problème."
    ] },

  { id: "cabillaud-citron", name: "Cabillaud au beurre citronné, riz", cat: "poisson", cui: "fr", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    ing: [["cabillaud", 300, "g"], ["beurre", 40, "g"], ["citron", 1, "pc"], ["persil", 1, "botte"], ["riz", 150, "g"], ["echalote", 1, "pc"]],
    pantry: ["sel", "poivre"],
    steps: [
      "Faites cuire 150 g de riz dans l'eau bouillante salée selon le paquet.",
      "Séchez les 2 morceaux de cabillaud avec du papier absorbant, salez, poivrez. Ciselez l'échalote et le persil.",
      "Dans une poêle, faites fondre 10 g de beurre et cuisez le poisson 3 minutes par face à feu moyen. Il doit se détacher en feuillets. Réservez au chaud.",
      "Dans la même poêle, faites fondre l'échalote 1 minute, ajoutez les 30 g de beurre restants, le jus du citron et le persil. Laissez mousser 30 secondes.",
      "Nappez le poisson de beurre citronné et servez avec le riz."
    ] },

  { id: "pesto", name: "Pâtes au pesto, tomates cerises", cat: "pates", cui: "it", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/BasilPesto.JPG/500px-BasilPesto.JPG", imgPage: "https://fr.wikipedia.org/wiki/Pesto",
    ing: [["pates", 200, "g"], ["pesto", 1, "pot"], ["tomates_cerises", 150, "g"], ["parmesan", 30, "g"], ["pignons", 20, "g"]],
    pantry: ["sel", "poivre"],
    steps: [
      "Faites cuire 200 g de pâtes al dente dans une grande casserole d'eau salée.",
      "Pendant ce temps, faites griller 20 g de pignons à sec dans une poêle 2 minutes en remuant. Coupez 150 g de tomates cerises en deux.",
      "Égouttez les pâtes en gardant un peu d'eau de cuisson. Remettez-les dans la casserole avec le pot de pesto et 2 cuillères d'eau de cuisson, mélangez hors du feu.",
      "Ajoutez les tomates cerises, mélangez délicatement.",
      "Servez avec le parmesan râpé, les pignons et du poivre."
    ] },

  { id: "dinde-creme", name: "Escalopes de dinde à la crème, tagliatelles", cat: "volaille", cui: "fr", time: 30, slots: ["soir"],
    ing: [["dinde", 300, "g"], ["champignons", 250, "g"], ["creme", 20, "cl"], ["echalote", 1, "pc"], ["tagliatelles", 200, "g"], ["persil", 1, "botte"]],
    pantry: ["huile", "sel", "poivre"],
    steps: [
      "Salez et poivrez les escalopes de dinde. Faites-les dorer 3 minutes par face dans une poêle avec 1 cuillère d'huile. Réservez.",
      "Émincez l'échalote et 250 g de champignons. Faites-les revenir dans la poêle 6 minutes à feu vif jusqu'à évaporation de l'eau.",
      "Versez 20 cl de crème fraîche, salez, poivrez, remettez la dinde et laissez mijoter 5 minutes à feu doux.",
      "Faites cuire 200 g de tagliatelles pendant ce temps, égouttez.",
      "Servez les escalopes et leur sauce sur les tagliatelles, parsemées de persil ciselé."
    ] },

  { id: "buddha-bowl", name: "Buddha bowl pois chiches, avocat", cat: "vege", cui: "med", time: 30, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/BuddhaBowlLot.jpg/500px-BuddhaBowlLot.jpg", imgPage: "https://fr.wikipedia.org/wiki/Buddha_bowl",
    ing: [["riz_complet", 150, "g"], ["pois_chiches", 1, "boite"], ["avocat", 1, "pc"], ["carotte", 1, "pc"], ["chou_rouge", 100, "g"], ["tahini", 2, "cs"], ["citron", 1, "pc"], ["sesame", 1, "cs"]],
    pantry: ["huile d'olive", "cumin", "paprika", "sel"],
    steps: [
      "Rincez 150 g de riz complet et faites-le cuire 25 minutes dans l'eau bouillante salée, puis égouttez.",
      "Égouttez et séchez les pois chiches. Faites-les sauter 8 minutes dans une poêle avec 1 cuillère d'huile d'olive, 1 cuillère à café de cumin, 1 de paprika et du sel, jusqu'à ce qu'ils soient dorés.",
      "Râpez la carotte, émincez finement 100 g de chou rouge, coupez l'avocat en tranches et citronnez-le.",
      "Sauce : 2 cuillères de tahini, le jus d'un demi-citron, 2 cuillères d'eau, une pincée de sel. Fouettez jusqu'à obtenir une sauce lisse.",
      "Dans deux bols, disposez le riz puis les pois chiches, la carotte, le chou et l'avocat côte à côte. Arrosez de sauce et parsemez de sésame."
    ] },

  { id: "endives-jambon", name: "Endives au jambon de bœuf", cat: "viande", cui: "fr", time: 50, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Jielbeaumadier_chicon_au_jambon_maroilles_2010.jpg/500px-Jielbeaumadier_chicon_au_jambon_maroilles_2010.jpg", imgPage: "https://fr.wikipedia.org/wiki/Endive_au_jambon",
    ing: [["endive", 4, "pc"], ["jambon_boeuf", 4, "tranche"], ["lait", 40, "cl"], ["beurre", 30, "g"], ["farine", 30, "g"], ["gruyere", 80, "g"]],
    pantry: ["muscade", "sel", "poivre"],
    steps: [
      "Retirez le cône amer à la base des 4 endives. Faites-les cuire 20 minutes à la vapeur ou dans une casserole avec 2 cm d'eau à couvert. Égouttez-les et pressez-les doucement pour retirer l'eau.",
      "Béchamel : faites fondre 30 g de beurre, ajoutez 30 g de farine, remuez 1 minute. Versez 40 cl de lait froid petit à petit en fouettant, cuisez jusqu'à épaississement. Muscade, sel, poivre.",
      "Préchauffez le four à 200 °C. Enroulez chaque endive dans une tranche de jambon de bœuf et rangez-les dans un plat à gratin.",
      "Nappez de béchamel, parsemez de 80 g de gruyère râpé.",
      "Enfournez 20 minutes jusqu'à ce que le dessus soit doré."
    ] },

  { id: "soupe-oignon", name: "Soupe à l'oignon gratinée", cat: "soupe", cui: "fr", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Soupe_%C3%A0_l%27oignon_01.JPG/500px-Soupe_%C3%A0_l%27oignon_01.JPG", imgPage: "https://fr.wikipedia.org/wiki/Soupe_%C3%A0_l'oignon",
    ing: [["oignon", 5, "pc"], ["beurre", 30, "g"], ["farine", 20, "g"], ["bouillon", 1, "pc"], ["pain", 4, "tranche"], ["gruyere", 100, "g"]],
    pantry: ["thym", "sel", "poivre"],
    steps: [
      "Émincez finement les 5 oignons. Dans une cocotte, faites-les fondre dans 30 g de beurre à feu doux pendant 20 minutes en remuant souvent : ils doivent devenir blonds et fondants sans brûler.",
      "Saupoudrez de 20 g de farine, mélangez 1 minute. Versez 85 cl de bouillon (cube + eau), ajoutez le thym, salez, poivrez. Laissez mijoter 15 minutes.",
      "Préchauffez le gril du four. Faites griller 4 tranches de pain.",
      "Versez la soupe dans deux bols allant au four, posez 2 tranches de pain sur chaque, couvrez de 100 g de gruyère râpé.",
      "Passez sous le gril 5 minutes jusqu'à ce que le fromage soit doré et gratiné. Servez brûlant."
    ] },

  { id: "taboule", name: "Taboulé libanais", cat: "salade", cui: "lb", time: 25, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Tabouleh_1.JPG/500px-Tabouleh_1.JPG", imgPage: "https://fr.wikipedia.org/wiki/Taboul%C3%A9",
    ing: [["boulgour", 100, "g"], ["persil", 2, "botte"], ["menthe", 1, "botte"], ["tomate", 3, "pc"], ["oignon_nouveau", 2, "pc"], ["citron", 2, "pc"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Versez 100 g de boulgour fin dans un saladier, couvrez d'eau tiède à hauteur et laissez gonfler 15 minutes. Égouttez et pressez.",
      "Lavez et séchez 2 bottes de persil et la botte de menthe. Effeuillez et ciselez très finement au couteau.",
      "Coupez les 3 tomates en très petits dés, émincez les 2 oignons nouveaux.",
      "Mélangez le boulgour, les herbes, les tomates et les oignons. Assaisonnez avec le jus de 2 citrons, 4 cuillères d'huile d'olive, sel et poivre.",
      "Laissez reposer 15 minutes au frais avant de servir : le taboulé libanais est surtout fait d'herbes, le boulgour est là en touche."
    ] },

  { id: "couscous", name: "Couscous royal poulet–merguez", cat: "volaille", cui: "ma", time: 50, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/500px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg", imgPage: "https://fr.wikipedia.org/wiki/Couscous",
    ing: [["poulet_cuisse", 2, "pc"], ["merguez", 4, "pc"], ["semoule", 200, "g"], ["carotte", 2, "pc"], ["courgette", 2, "pc"], ["navet", 1, "pc"], ["pois_chiches", 1, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"]],
    pantry: ["ras el hanout", "huile d'olive", "sel", "poivre"],
    steps: [
      "Dans une grande cocotte, faites dorer les 2 cuisses de poulet dans 2 cuillères d'huile d'olive. Ajoutez l'oignon émincé et 1 cuillère à soupe de ras el hanout, mélangez 2 minutes.",
      "Ajoutez la boîte de tomates concassées, le cube de bouillon et 60 cl d'eau. Épluchez les 2 carottes et le navet, coupez-les en gros morceaux et ajoutez-les. Couvrez, mijotez 20 minutes.",
      "Coupez les 2 courgettes en tronçons, ajoutez-les avec les pois chiches égouttés. Poursuivez 15 minutes. Salez, poivrez.",
      "Faites griller les 4 merguez à la poêle 8 minutes en les retournant.",
      "Préparez 200 g de semoule : versez 20 cl d'eau bouillante salée dessus, couvrez 5 minutes, ajoutez un filet d'huile et égrenez à la fourchette.",
      "Servez la semoule avec les légumes, le poulet, les merguez et le bouillon à part."
    ] },

  { id: "burger", name: "Burgers maison, frites au four", cat: "viande", cui: "us", time: 35, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/500px-RedDot_Burger.jpg", imgPage: "https://fr.wikipedia.org/wiki/Hamburger",
    ing: [["steak_hache", 2, "pc"], ["pain_burger", 2, "pc"], ["cheddar", 2, "tranche"], ["tomate", 1, "pc"], ["laitue", 1, "pc"], ["oignon_rouge", 1, "pc"], ["cornichons", 4, "pc"], ["pdt", 500, "g"]],
    pantry: ["ketchup", "moutarde", "huile", "paprika", "sel"],
    steps: [
      "Préchauffez le four à 220 °C. Coupez 500 g de pommes de terre en bâtonnets, séchez-les, mélangez avec 2 cuillères d'huile, du paprika et du sel. Étalez sur une plaque et enfournez 30 minutes en retournant à mi-cuisson.",
      "Coupez la tomate en rondelles, l'oignon rouge en fines rondelles, les cornichons en lamelles. Lavez 4 feuilles de laitue.",
      "Faites chauffer une poêle à feu vif. Cuisez les 2 steaks hachés 3 minutes par face, salez, poivrez. Posez une tranche de cheddar sur chaque steak 1 minute avant la fin pour qu'elle fonde.",
      "Faites griller les pains à burger ouverts 1 minute dans la poêle ou au four.",
      "Montez : moutarde et ketchup sur le pain, salade, steak au cheddar, tomate, oignon, cornichons, chapeau. Servez avec les frites."
    ] },

  { id: "oeufs-cocotte", name: "Œufs cocotte, mouillettes", cat: "oeufs", cui: "fr", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Oeuf_cocotte.jpg/500px-Oeuf_cocotte.jpg", imgPage: "https://fr.wikipedia.org/wiki/%C5%92ufs_cocotte",
    ing: [["oeuf", 4, "pc"], ["creme", 10, "cl"], ["jambon_boeuf", 1, "tranche"], ["ciboulette", 1, "botte"], ["pain", 4, "tranche"], ["mache", 100, "g"]],
    pantry: ["sel", "poivre", "huile", "vinaigre"],
    steps: [
      "Préchauffez le four à 180 °C. Beurrez 2 ramequins. Coupez la tranche de jambon de bœuf en petits dés, ciselez la ciboulette.",
      "Dans chaque ramequin, mettez 2 cuillères de crème, la moitié du jambon, puis cassez 2 œufs. Salez, poivrez, ajoutez une dernière cuillère de crème sur le dessus.",
      "Placez les ramequins dans un plat, versez de l'eau chaude à mi-hauteur (bain-marie). Enfournez 12 minutes : le blanc doit être pris et le jaune encore coulant.",
      "Faites griller 4 tranches de pain, coupez-les en mouillettes. Assaisonnez la mâche d'un filet d'huile et de vinaigre.",
      "Parsemez les œufs de ciboulette et servez aussitôt avec les mouillettes et la mâche."
    ] },

  { id: "gnocchis-epinards", name: "Poêlée de gnocchis aux épinards", cat: "pates", cui: "it", time: 15, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Gnocchi_di_ricotta_burro_e_salvia.jpg/500px-Gnocchi_di_ricotta_burro_e_salvia.jpg", imgPage: "https://fr.wikipedia.org/wiki/Gnocchi",
    ing: [["gnocchis", 400, "g"], ["epinards", 200, "g"], ["creme", 15, "cl"], ["ail", 1, "gousse"], ["parmesan", 30, "g"], ["beurre", 20, "g"]],
    pantry: ["muscade", "sel", "poivre"],
    steps: [
      "Lavez et essorez 200 g d'épinards frais. Hachez la gousse d'ail.",
      "Dans une grande poêle, faites fondre 20 g de beurre et faites dorer 400 g de gnocchis (directement, sans les cuire à l'eau) 6 minutes en remuant, jusqu'à ce qu'ils soient dorés et croustillants.",
      "Ajoutez l'ail 30 secondes, puis les épinards par poignées : ils tombent en 2 minutes.",
      "Versez 15 cl de crème, une pincée de muscade, sel et poivre. Laissez mijoter 2 minutes.",
      "Servez avec 30 g de parmesan râpé."
    ] },

  { id: "moules-frites", name: "Moules marinières, frites", cat: "poisson", cui: "fr", time: 30, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Moules_marini%C3%A8res_01.jpg/500px-Moules_marini%C3%A8res_01.jpg", imgPage: "https://fr.wikipedia.org/wiki/Moules-frites",
    ing: [["moules", 1500, "g"], ["echalote", 2, "pc"], ["citron", 1, "pc"], ["persil", 1, "botte"], ["beurre", 30, "g"], ["pdt", 600, "g"]],
    pantry: ["huile", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 220 °C. Coupez 600 g de pommes de terre en frites, séchez-les, huilez, salez, et enfournez 30 minutes sur une plaque en retournant à mi-cuisson.",
      "Nettoyez 1,5 kg de moules : grattez, retirez le byssus, jetez celles qui restent ouvertes après un choc. Rincez plusieurs fois.",
      "Ciselez les 2 échalotes et le persil. Dans une grande cocotte, faites fondre 30 g de beurre et suez les échalotes 2 minutes.",
      "Versez 15 cl d'eau et le jus du citron, portez à ébullition, ajoutez les moules. Couvrez et cuisez 5 minutes à feu vif en secouant la cocotte 2 ou 3 fois : elles sont prêtes quand elles sont toutes ouvertes.",
      "Parsemez de persil, poivrez, servez aussitôt avec les frites et le jus de cuisson."
    ] },

  { id: "wraps-poulet", name: "Wraps au poulet et crudités", cat: "volaille", cui: "us", time: 20, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Wrapped_Snacks_%284612762075%29.jpg/500px-Wrapped_Snacks_%284612762075%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Wrap",
    ing: [["tortillas", 4, "pc"], ["poulet_blanc", 250, "g"], ["laitue", 1, "pc"], ["tomate", 1, "pc"], ["concombre", 1, "pc"], ["fromage_frais", 100, "g"]],
    pantry: ["paprika", "huile", "sel"],
    steps: [
      "Coupez 250 g de blanc de poulet en lanières. Faites-les dorer 8 minutes à la poêle avec 1 cuillère d'huile, 1 cuillère à café de paprika et du sel. Laissez tiédir.",
      "Lavez 4 feuilles de laitue, coupez la tomate en rondelles fines et un quart de concombre en bâtonnets.",
      "Réchauffez les 4 tortillas 20 secondes au micro-ondes ou à la poêle sèche pour les assouplir.",
      "Tartinez chaque tortilla de fromage frais, posez une feuille de salade, le poulet, la tomate et le concombre en ligne au centre.",
      "Repliez les bords puis roulez serré. Coupez en deux en biais. Se transporte très bien pour un déjeuner au travail."
    ] },

  { id: "aubergines-farcies", name: "Aubergines farcies à la feta", cat: "vege", cui: "med", time: 50, slots: ["soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Azerbaijani_Bad%C4%B1mcan_dolmas%C4%B1_1.JPG/500px-Azerbaijani_Bad%C4%B1mcan_dolmas%C4%B1_1.JPG", imgPage: "https://en.wikipedia.org/wiki/Stuffed_eggplant",
    ing: [["aubergine", 2, "pc"], ["tomate", 2, "pc"], ["oignon", 1, "pc"], ["ail", 1, "gousse"], ["feta", 100, "g"], ["chapelure", 20, "g"], ["riz", 120, "g"]],
    pantry: ["huile d'olive", "origan", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Coupez les 2 aubergines en deux dans la longueur, incisez la chair en croisillons, huilez, salez. Enfournez 25 minutes.",
      "Pendant ce temps, hachez l'oignon et la gousse d'ail, coupez les 2 tomates en dés. Faites-les revenir 8 minutes dans 1 cuillère d'huile d'olive avec l'origan.",
      "Creusez les aubergines à la cuillère en gardant 1 cm de chair contre la peau. Hachez la chair prélevée et mélangez-la à la poêlée. Salez, poivrez.",
      "Garnissez les demi-aubergines, émiettez 100 g de feta dessus, saupoudrez de 20 g de chapelure et d'un filet d'huile. Enfournez 15 minutes.",
      "Faites cuire 120 g de riz pendant ce temps et servez ensemble."
    ] },

  { id: "poulet-roti", name: "Poulet rôti, pommes de terre", cat: "volaille", cui: "fr", time: 90, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg/500px-Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poulet_r%C3%B4ti",
    ing: [["poulet_entier", 1, "pc"], ["pdt", 800, "g"], ["ail", 4, "gousse"], ["beurre", 30, "g"]],
    pantry: ["thym", "huile", "sel", "poivre"],
    steps: [
      "Sortez le poulet du réfrigérateur 30 minutes avant. Préchauffez le four à 200 °C.",
      "Mélangez 30 g de beurre mou avec du thym, du sel et du poivre. Glissez la moitié sous la peau des blancs, étalez le reste sur le poulet. Mettez 2 gousses d'ail dans le ventre.",
      "Posez le poulet sur le côté dans un plat, avec 2 gousses d'ail en chemise et un filet d'huile. Enfournez 25 minutes, retournez sur l'autre côté 25 minutes.",
      "Épluchez 800 g de pommes de terre, coupez-les en quartiers, ajoutez-les autour du poulet en les roulant dans le jus. Mettez le poulet sur le dos et poursuivez 25 minutes en arrosant.",
      "Vérifiez la cuisson : le jus qui s'écoule de la cuisse doit être clair. Laissez reposer 10 minutes sous une feuille d'aluminium avant de découper."
    ] },

  /* ---------- Marocaines ---------- */
  { id: "tajine-kefta", name: "Tajine de kefta aux œufs", cat: "viande", cui: "ma", time: 40, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Sultanahmet_K%C3%B6ftesi.jpg/500px-Sultanahmet_K%C3%B6ftesi.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kefta",
    ing: [["boeuf_hache", 400, "g"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["tomates_concassees", 1, "boite"], ["oeuf", 3, "pc"], ["persil", 1, "botte"], ["coriandre", 1, "botte"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "piment doux", "huile d'olive", "sel", "poivre"],
    steps: [
      "Hachez l'oignon, gardez-en la moitié. Ciselez le persil et la coriandre. Dans un saladier, mélangez 400 g de bœuf haché avec la moitié de l'oignon, la moitié des herbes, 1 cuillère à café de cumin, 1 de paprika, sel et poivre.",
      "Formez des boulettes de la taille d'une noix (une vingtaine) en les roulant entre vos paumes humides.",
      "Dans un plat à tajine ou une sauteuse, faites revenir le reste d'oignon et 2 gousses d'ail hachées dans 2 cuillères d'huile d'olive 3 minutes. Ajoutez la boîte de tomates, 1 cuillère à café de paprika, une pointe de piment doux, sel, poivre. Mijotez 10 minutes.",
      "Déposez les boulettes dans la sauce, couvrez et laissez cuire 15 minutes à feu doux en les retournant à mi-cuisson.",
      "Creusez 3 puits dans la sauce, cassez-y les œufs, couvrez 4 minutes : les blancs prennent, les jaunes restent coulants.",
      "Parsemez du reste des herbes et servez directement dans le plat, avec du pain pour saucer."
    ] },

  { id: "tajine-agneau-pruneaux", name: "Tajine d'agneau aux pruneaux et amandes", cat: "viande", cui: "ma", time: 90, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Tajine_008.JPG/500px-Tajine_008.JPG", imgPage: "https://fr.wikipedia.org/wiki/Tajine",
    ing: [["agneau", 600, "g"], ["oignon", 2, "pc"], ["ail", 2, "gousse"], ["pruneaux", 200, "g"], ["amandes", 40, "g"], ["miel", 2, "cs"], ["sesame", 1, "cs"], ["semoule", 150, "g"]],
    pantry: ["cannelle", "gingembre moulu", "safran (ou curcuma)", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 600 g d'épaule d'agneau en gros morceaux. Émincez les 2 oignons, hachez 2 gousses d'ail.",
      "Dans une cocotte, faites colorer l'agneau dans 2 cuillères d'huile d'olive 5 minutes. Ajoutez les oignons, l'ail, 1 cuillère à café de gingembre moulu, une pincée de safran (ou 1 cuillère à café de curcuma), sel et poivre. Mélangez 3 minutes.",
      "Couvrez d'eau à hauteur, portez à ébullition, puis couvrez et laissez mijoter 1 heure à feu doux.",
      "Ajoutez 200 g de pruneaux, 2 cuillères de miel et 1 cuillère à café de cannelle. Poursuivez 15 minutes à découvert pour que la sauce épaississe.",
      "Faites griller 40 g d'amandes effilées à sec dans une poêle 2 minutes. Préparez 150 g de semoule (même volume d'eau bouillante salée, 5 minutes à couvert).",
      "Servez le tajine parsemé d'amandes et de graines de sésame, avec la semoule."
    ] },

  { id: "harira", name: "Harira", cat: "soupe", cui: "ma", time: 50, slots: ["soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Harira_vegetarisch.jpg/500px-Harira_vegetarisch.jpg", imgPage: "https://fr.wikipedia.org/wiki/Harira",
    ing: [["boeuf_saute", 150, "g"], ["lentilles_vertes", 100, "g"], ["pois_chiches", 1, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["celeri", 2, "pc"], ["coriandre", 1, "botte"], ["persil", 1, "botte"], ["vermicelles", 40, "g"], ["farine", 30, "g"], ["citron", 1, "pc"]],
    pantry: ["curcuma", "gingembre moulu", "cannelle", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 150 g de bœuf en très petits dés. Hachez l'oignon et 2 branches de céleri avec leurs feuilles. Ciselez la coriandre et le persil.",
      "Dans une grande casserole, faites revenir la viande, l'oignon et le céleri dans 2 cuillères d'huile d'olive 5 minutes. Ajoutez 1 cuillère à café de curcuma, 1 de gingembre moulu et une pincée de cannelle.",
      "Ajoutez la boîte de tomates, 100 g de lentilles vertes rincées, la moitié des herbes et 1,2 litre d'eau. Salez, poivrez. Portez à ébullition puis laissez mijoter 30 minutes à couvert.",
      "Ajoutez les pois chiches égouttés et 40 g de vermicelles. Cuisez 5 minutes.",
      "Délayez 30 g de farine dans un verre d'eau froide, versez en filet dans la soupe en remuant, laissez épaissir 3 minutes.",
      "Ajoutez le reste des herbes. Servez avec des quartiers de citron à presser dans le bol."
    ] },

  { id: "tajine-legumes", name: "Tajine de légumes aux olives", cat: "vege", cui: "ma", time: 50, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Tajine_008.JPG/500px-Tajine_008.JPG", imgPage: "https://fr.wikipedia.org/wiki/Tajine",
    ing: [["pdt", 400, "g"], ["carotte", 3, "pc"], ["courgette", 2, "pc"], ["tomate", 3, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["olives_vertes", 80, "g"], ["citron_confit", 1, "pc"], ["coriandre", 1, "botte"], ["pain", 4, "tranche"]],
    pantry: ["ras el hanout", "cumin", "curcuma", "huile d'olive", "sel", "poivre"],
    steps: [
      "Épluchez 400 g de pommes de terre et les 3 carottes, coupez-les en quartiers dans la longueur. Coupez les 2 courgettes en gros tronçons, les 3 tomates en rondelles. Émincez l'oignon, hachez 2 gousses d'ail.",
      "Dans une cocotte ou un plat à tajine, faites revenir l'oignon et l'ail dans 3 cuillères d'huile d'olive avec 1 cuillère à café de ras el hanout, 1 de cumin et 1 de curcuma, 3 minutes.",
      "Rangez les légumes en dôme : pommes de terre et carottes au fond, courgettes par-dessus, tomates en rondelles pour finir. Ajoutez le citron confit coupé en 4, salez, poivrez, versez 15 cl d'eau.",
      "Couvrez et laissez cuire 35 minutes à feu doux sans remuer. Les légumes cuisent à la vapeur des tomates.",
      "Ajoutez 80 g d'olives vertes et la coriandre ciselée 5 minutes avant la fin. Servez avec du pain pour saucer."
    ] },

  { id: "bissara", name: "Bissara (soupe de pois cassés au cumin)", cat: "soupe", cui: "ma", time: 40, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Thamarakt%2C_pur%C3%A9e_de_pois_cass%C3%A9s_%C3%A0_servir_avec_un_bon_filet_d%27huile_d%27olive..jpg/500px-Thamarakt%2C_pur%C3%A9e_de_pois_cass%C3%A9s_%C3%A0_servir_avec_un_bon_filet_d%27huile_d%27olive..jpg", imgPage: "https://fr.wikipedia.org/wiki/Bissara",
    ing: [["pois_casses", 250, "g"], ["ail", 3, "gousse"], ["citron", 1, "pc"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "huile d'olive", "sel"],
    steps: [
      "Rincez 250 g de pois cassés. Mettez-les dans une casserole avec 3 gousses d'ail pelées et 1 litre d'eau. Portez à ébullition, écumez.",
      "Laissez cuire 35 minutes à feu moyen à couvert, en remuant de temps en temps, jusqu'à ce que les pois s'écrasent à la cuillère. Ajoutez de l'eau chaude s'ils accrochent.",
      "Mixez avec 3 cuillères d'huile d'olive, 1 cuillère à café de cumin et du sel, jusqu'à obtenir une purée lisse et fluide. Détendez avec un peu d'eau si besoin.",
      "Servez dans des bols avec un filet d'huile d'olive, une pincée de cumin et de paprika, et un quartier de citron.",
      "Accompagnez de pain de campagne grillé. Se réchauffe très bien le lendemain avec un peu d'eau."
    ] },

  { id: "zaalouk", name: "Zaalouk, salade de tomates et pain", cat: "vege", cui: "ma", time: 30, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Zaalouk_03.jpg/500px-Zaalouk_03.jpg", imgPage: "https://fr.wikipedia.org/wiki/Zaalouk",
    ing: [["aubergine", 2, "pc"], ["tomate", 4, "pc"], ["ail", 3, "gousse"], ["coriandre", 1, "botte"], ["citron", 1, "pc"], ["concombre", 1, "pc"], ["oignon", 1, "pc"], ["pain", 6, "tranche"]],
    pantry: ["cumin", "paprika", "huile d'olive", "sel"],
    steps: [
      "Coupez les 2 aubergines en gros cubes. Faites-les cuire 15 minutes dans l'eau bouillante salée (ou 25 minutes au four à 200 °C). Égouttez bien et écrasez-les à la fourchette.",
      "Pelez 2 tomates, concassez-les. Hachez 3 gousses d'ail. Dans une poêle, faites chauffer 3 cuillères d'huile d'olive, ajoutez l'ail, les tomates, 1 cuillère à café de cumin et 1 de paprika. Cuisez 5 minutes.",
      "Ajoutez la purée d'aubergine, salez, et laissez réduire 10 minutes en écrasant à la cuillère jusqu'à obtenir une compotée épaisse. Ajoutez la moitié de la coriandre ciselée et un trait de citron.",
      "Salade : coupez les 2 tomates restantes, le concombre et l'oignon en petits dés, assaisonnez d'huile d'olive, de citron, de sel et du reste de coriandre.",
      "Servez le zaalouk tiède ou froid avec la salade et du pain de campagne. Il se garde 3 jours au frais."
    ] },

  { id: "brochettes-poulet-marocaines", name: "Brochettes de poulet marinées, salade marocaine", cat: "volaille", cui: "ma", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/PinchosAmericanos.jpg/500px-PinchosAmericanos.jpg", imgPage: "https://fr.wikipedia.org/wiki/Brochette",
    ing: [["poulet_blanc", 400, "g"], ["citron", 1, "pc"], ["ail", 2, "gousse"], ["coriandre", 1, "botte"], ["tomate", 3, "pc"], ["concombre", 1, "pc"], ["oignon", 1, "pc"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "curcuma", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 400 g de blanc de poulet en cubes de 3 cm. Dans un plat, mélangez 3 cuillères d'huile d'olive, le jus d'un demi-citron, 2 gousses d'ail pressées, 1 cuillère à café de cumin, 1 de paprika, 1 de curcuma, la moitié de la coriandre ciselée, sel et poivre. Ajoutez le poulet, mélangez, laissez mariner 10 minutes (ou plus).",
      "Salade marocaine : coupez les 3 tomates, le concombre et l'oignon en petits dés. Assaisonnez avec le reste de coriandre, 2 cuillères d'huile d'olive, le jus du demi-citron restant, sel.",
      "Enfilez le poulet sur des piques (si elles sont en bois, trempez-les 10 minutes dans l'eau).",
      "Faites griller 4 minutes de chaque côté sur une poêle-gril bien chaude, au barbecue ou sous le gril du four.",
      "Servez les brochettes avec la salade et le pain."
    ] },

  { id: "tajine-poisson-chermoula", name: "Tajine de poisson à la chermoula", cat: "poisson", cui: "ma", time: 45, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Chermoula_tagine.jpg/500px-Chermoula_tagine.jpg", imgPage: "https://en.wikipedia.org/wiki/Chermoula",
    ing: [["cabillaud", 400, "g"], ["pdt", 400, "g"], ["carotte", 2, "pc"], ["poivron", 1, "pc"], ["tomate", 3, "pc"], ["citron", 1, "pc"], ["ail", 3, "gousse"], ["coriandre", 1, "botte"], ["olives_vertes", 60, "g"]],
    pantry: ["cumin", "paprika", "curcuma", "piment doux", "huile d'olive", "sel"],
    steps: [
      "Chermoula : mixez la botte de coriandre, 3 gousses d'ail, 1 cuillère à café de cumin, 1 de paprika, 1 de curcuma, une pointe de piment doux, le jus du citron (gardez quelques rondelles), 4 cuillères d'huile d'olive et du sel.",
      "Coupez 400 g de cabillaud en 4 morceaux, enrobez-les de la moitié de la chermoula et laissez mariner le temps de préparer les légumes.",
      "Épluchez 400 g de pommes de terre et 2 carottes, coupez-les en rondelles. Coupez le poivron en lanières et les 3 tomates en rondelles.",
      "Dans un plat à tajine ou une sauteuse, étalez pommes de terre et carottes, versez le reste de chermoula et 10 cl d'eau. Couvrez et cuisez 20 minutes à feu doux.",
      "Posez le poisson sur les légumes, puis le poivron, les rondelles de tomate et de citron, et 60 g d'olives vertes. Couvrez et cuisez encore 15 minutes. Servez avec du pain."
    ] },

  { id: "briouates-poulet", name: "Briouates au poulet, salade", cat: "volaille", cui: "ma", time: 45, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Briouat_%28cropped%29.jpg/500px-Briouat_%28cropped%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Briouate",
    ing: [["brick", 8, "feuille"], ["poulet_blanc", 300, "g"], ["oignon", 1, "pc"], ["vermicelles", 50, "g"], ["oeuf", 1, "pc"], ["persil", 1, "botte"], ["laitue", 1, "pc"], ["citron", 1, "pc"]],
    pantry: ["cannelle", "gingembre moulu", "curcuma", "huile", "sel", "poivre"],
    steps: [
      "Coupez 300 g de blanc de poulet en tout petits dés (ou hachez-le). Hachez l'oignon. Faites-les revenir dans 1 cuillère d'huile 10 minutes avec 1 cuillère à café de curcuma, 1/2 de gingembre moulu, 1/2 de cannelle, sel, poivre.",
      "Faites tremper 50 g de vermicelles 3 minutes dans l'eau chaude, égouttez, coupez grossièrement. Mélangez-les au poulet avec le persil ciselé et l'œuf battu, hors du feu.",
      "Préchauffez le four à 200 °C. Coupez chaque feuille de brick en deux. Déposez 1 cuillère de farce à une extrémité de chaque bande et pliez en triangle, en rabattant successivement, jusqu'au bout de la bande.",
      "Posez les triangles sur une plaque, badigeonnez d'huile et enfournez 15 minutes jusqu'à ce qu'ils soient dorés (ou faites-les dorer à la poêle dans un fond d'huile, 2 minutes par face).",
      "Servez chauds avec la laitue assaisonnée au citron."
    ] },

  { id: "loubia", name: "Loubia (haricots blancs en sauce tomate)", cat: "vege", cui: "ma", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/%D9%85%D8%B1%D9%82%D8%A9_%D9%84%D9%88%D8%A8%D9%8A%D8%A7.JPG/500px-%D9%85%D8%B1%D9%82%D8%A9_%D9%84%D9%88%D8%A8%D9%8A%D8%A7.JPG", imgPage: "https://fr.wikipedia.org/wiki/Loubia",
    ing: [["haricots_blancs", 2, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["ail", 3, "gousse"], ["coriandre", 1, "botte"], ["persil", 1, "botte"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "curcuma", "huile d'olive", "sel", "poivre"],
    steps: [
      "Hachez l'oignon et 3 gousses d'ail. Ciselez la coriandre et le persil.",
      "Dans une cocotte, faites revenir l'oignon et l'ail dans 3 cuillères d'huile d'olive 4 minutes. Ajoutez 1 cuillère à café de cumin, 1 de paprika et 1 de curcuma, mélangez 30 secondes.",
      "Ajoutez la boîte de tomates concassées, 20 cl d'eau, la moitié des herbes, sel et poivre. Laissez mijoter 15 minutes.",
      "Égouttez et rincez les 2 boîtes de haricots blancs, ajoutez-les et poursuivez 15 minutes à feu doux : la sauce doit être épaisse et bien enrober les haricots.",
      "Ajoutez le reste des herbes et servez avec du pain de campagne. Encore meilleur réchauffé."
    ] },

  { id: "lentilles-marocaines", name: "Lentilles à la marocaine", cat: "vege", cui: "ma", time: 40, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/EgFoodLentilSoup.jpg/500px-EgFoodLentilSoup.jpg", imgPage: "https://en.wikipedia.org/wiki/Lentil_soup",
    ing: [["lentilles_vertes", 250, "g"], ["tomate", 3, "pc"], ["oignon", 1, "pc"], ["ail", 3, "gousse"], ["carotte", 1, "pc"], ["coriandre", 1, "botte"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "curcuma", "huile d'olive", "sel", "poivre"],
    steps: [
      "Hachez l'oignon et 3 gousses d'ail, coupez la carotte en petits dés. Râpez les 3 tomates (coupez-les en deux et râpez la chair, jetez la peau).",
      "Dans une casserole, faites revenir l'oignon, l'ail et la carotte dans 3 cuillères d'huile d'olive 5 minutes. Ajoutez 1 cuillère à café de cumin, 1 de paprika et 1 de curcuma, puis les tomates râpées. Cuisez 5 minutes.",
      "Rincez 250 g de lentilles vertes, ajoutez-les avec 60 cl d'eau. Portez à ébullition, couvrez et laissez cuire 30 minutes à feu doux. Salez en fin de cuisson.",
      "Les lentilles doivent être tendres et la sauce épaisse. Ajoutez la coriandre ciselée.",
      "Servez chaud avec du pain. Un filet d'huile d'olive et un trait de citron au moment de servir."
    ] },

  { id: "poulet-mhammer", name: "Poulet mhammer (rôti aux épices et oignons)", cat: "volaille", cui: "ma", time: 80, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg/500px-Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poulet_r%C3%B4ti",
    ing: [["poulet_entier", 1, "pc"], ["oignon", 3, "pc"], ["ail", 4, "gousse"], ["citron_confit", 1, "pc"], ["olives_vertes", 80, "g"], ["coriandre", 1, "botte"], ["beurre", 30, "g"], ["pdt", 600, "g"]],
    pantry: ["curcuma", "gingembre moulu", "paprika", "safran (ou curcuma)", "huile d'olive", "sel", "poivre"],
    steps: [
      "Frottez le poulet avec 3 gousses d'ail pressées, 1 cuillère à café de curcuma, 1 de gingembre moulu, 1 de paprika, une pincée de safran, 2 cuillères d'huile d'olive, sel et poivre. Laissez reposer pendant que vous émincez les 3 oignons.",
      "Dans une grande cocotte, mettez le poulet, les oignons, la gousse d'ail restante, la coriandre ciselée, 30 g de beurre et 20 cl d'eau. Couvrez et laissez cuire 45 minutes à feu doux en retournant le poulet à mi-cuisson.",
      "Préchauffez le four à 200 °C. Retirez le poulet de la cocotte, posez-le dans un plat avec 600 g de pommes de terre en quartiers arrosées d'un peu de sauce. Enfournez 20 minutes pour le dorer.",
      "Pendant ce temps, faites réduire la sauce aux oignons à feu vif jusqu'à ce qu'elle soit épaisse. Ajoutez le citron confit en morceaux et 80 g d'olives vertes 5 minutes avant la fin.",
      "Servez le poulet doré nappé de sauce aux oignons, avec les pommes de terre."
    ] },

  { id: "brochettes-kefta", name: "Brochettes de kefta, tomates grillées", cat: "viande", cui: "ma", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Sultanahmet_K%C3%B6ftesi.jpg/500px-Sultanahmet_K%C3%B6ftesi.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kefta",
    ing: [["boeuf_hache", 400, "g"], ["oignon", 1, "pc"], ["persil", 1, "botte"], ["coriandre", 1, "botte"], ["tomate", 4, "pc"], ["pain", 4, "tranche"], ["yaourt", 1, "pot"]],
    pantry: ["cumin", "paprika", "menthe séchée", "huile d'olive", "sel", "poivre"],
    steps: [
      "Râpez l'oignon et pressez-le fort dans vos mains pour retirer le jus. Ciselez finement le persil et la coriandre.",
      "Dans un saladier, mélangez 400 g de bœuf haché avec l'oignon, les herbes, 1 cuillère à café de cumin, 1 de paprika, 1 de menthe séchée, sel et poivre. Pétrissez 2 minutes pour que la farce soit bien liée.",
      "Divisez en 6 portions et formez des boudins allongés autour de piques (ou sans pique, en forme de saucisses).",
      "Faites griller 3 à 4 minutes par face sur une poêle-gril chaude ou au barbecue, avec les 4 tomates coupées en deux à côté.",
      "Mélangez le yaourt avec une pincée de cumin et de sel. Servez les kefta avec les tomates grillées, le yaourt et le pain."
    ] },

  { id: "chakchouka", name: "Chakchouka", cat: "oeufs", cui: "ma", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Shakshuka_by_Calliopejen1.jpg/500px-Shakshuka_by_Calliopejen1.jpg", imgPage: "https://fr.wikipedia.org/wiki/Chakchouka",
    ing: [["poivron", 3, "pc"], ["tomate", 4, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["oeuf", 4, "pc"], ["coriandre", 1, "botte"], ["pain", 4, "tranche"]],
    pantry: ["cumin", "paprika", "piment doux", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez les 3 poivrons en lanières, émincez l'oignon, hachez 2 gousses d'ail. Coupez les 4 tomates en dés.",
      "Dans une grande poêle, faites revenir les poivrons et l'oignon dans 3 cuillères d'huile d'olive 8 minutes à feu moyen, jusqu'à ce qu'ils soient fondants.",
      "Ajoutez l'ail, les tomates, 1 cuillère à café de cumin, 1 de paprika, une pointe de piment doux, sel et poivre. Laissez compoter 8 minutes.",
      "Creusez 4 puits dans les légumes, cassez un œuf dans chacun. Couvrez et cuisez 4 minutes : les blancs doivent être pris et les jaunes coulants.",
      "Parsemez de coriandre ciselée et servez dans la poêle, avec du pain pour saucer."
    ] },

  { id: "couscous-legumes", name: "Couscous aux sept légumes", cat: "vege", cui: "ma", time: 50, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/500px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg", imgPage: "https://fr.wikipedia.org/wiki/Couscous",
    ing: [["semoule", 200, "g"], ["carotte", 2, "pc"], ["courgette", 2, "pc"], ["navet", 2, "pc"], ["potiron", 300, "g"], ["chou_vert", 1, "pc"], ["tomate", 2, "pc"], ["oignon", 1, "pc"], ["pois_chiches", 1, "boite"], ["raisins_secs", 40, "g"], ["coriandre", 1, "botte"]],
    pantry: ["ras el hanout", "curcuma", "gingembre moulu", "huile d'olive", "sel", "poivre"],
    steps: [
      "Épluchez les 2 carottes et les 2 navets, coupez-les en gros morceaux. Coupez les 2 courgettes en tronçons, 300 g de potiron en cubes, un quart de chou vert en 2 morceaux. Émincez l'oignon, coupez les 2 tomates en dés.",
      "Dans une grande cocotte, faites revenir l'oignon dans 3 cuillères d'huile d'olive 4 minutes. Ajoutez les tomates, 1 cuillère à soupe de ras el hanout, 1 cuillère à café de curcuma et 1 de gingembre moulu. Mélangez 2 minutes.",
      "Versez 1 litre d'eau, salez, ajoutez les carottes et les navets. Portez à ébullition et laissez cuire 15 minutes.",
      "Ajoutez les courgettes, le potiron, le chou et les pois chiches égouttés. Poursuivez 20 minutes : les légumes doivent être tendres. Ajoutez 40 g de raisins secs dans le bouillon 5 minutes avant la fin.",
      "Préparez 200 g de semoule (20 cl d'eau bouillante salée, 5 minutes à couvert, égrenée avec un filet d'huile).",
      "Servez la semoule creusée en puits, garnie de légumes, arrosée de bouillon et parsemée de coriandre."
    ] },

  /* ---------- Italiennes ---------- */
  { id: "arrabbiata", name: "Penne all'arrabbiata", cat: "pates", cui: "it", time: 20, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Penne_all%27arrabbiata_-_Pizzeria_Bella_Italia_%28Cr%C3%A9pieux-la-Pape%29_-_2.jpg/500px-Penne_all%27arrabbiata_-_Pizzeria_Bella_Italia_%28Cr%C3%A9pieux-la-Pape%29_-_2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Sauce_arrabbiata",
    ing: [["pates", 200, "g"], ["tomates_concassees", 1, "boite"], ["ail", 3, "gousse"], ["persil", 1, "botte"], ["parmesan", 40, "g"]],
    pantry: ["piment (flocons)", "huile d'olive", "sel", "poivre"],
    steps: [
      "Portez une grande casserole d'eau salée à ébullition pour 200 g de penne.",
      "Émincez 3 gousses d'ail. Dans une sauteuse, faites-les dorer doucement dans 3 cuillères d'huile d'olive avec 1 cuillère à café de piment en flocons, 2 minutes, sans brûler l'ail.",
      "Ajoutez la boîte de tomates concassées, salez, et laissez réduire 12 minutes à feu vif en remuant.",
      "Cuisez les pâtes al dente, égouttez en gardant une louche d'eau. Versez-les dans la sauce avec un peu d'eau de cuisson, mélangez 1 minute à feu vif.",
      "Servez avec le persil ciselé et 40 g de parmesan râpé."
    ] },

  { id: "milanaise", name: "Escalopes à la milanaise, roquette", cat: "volaille", cui: "it", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Cotoletta_e_patate_al_forno.jpg/500px-Cotoletta_e_patate_al_forno.jpg", imgPage: "https://fr.wikipedia.org/wiki/Escalope_%C3%A0_la_milanaise",
    ing: [["poulet_blanc", 300, "g"], ["chapelure", 80, "g"], ["farine", 30, "g"], ["oeuf", 1, "pc"], ["parmesan", 30, "g"], ["roquette", 100, "g"], ["tomates_cerises", 150, "g"], ["citron", 1, "pc"]],
    pantry: ["huile", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 300 g de blanc de poulet en 2 escalopes, posez-les entre deux feuilles de film et aplatissez-les au rouleau à 1 cm d'épaisseur. Salez, poivrez.",
      "Préparez trois assiettes : 30 g de farine, 1 œuf battu, 80 g de chapelure mélangée à 30 g de parmesan râpé. Passez les escalopes dans la farine, l'œuf, puis la chapelure en pressant.",
      "Faites chauffer 4 cuillères d'huile dans une grande poêle. Cuisez les escalopes 3 minutes par face jusqu'à ce que la panure soit dorée et croustillante. Égouttez sur du papier absorbant.",
      "Mélangez 100 g de roquette et 150 g de tomates cerises coupées en deux avec 2 cuillères d'huile d'olive, sel et poivre.",
      "Servez les escalopes avec la salade et des quartiers de citron à presser dessus."
    ] },

  { id: "minestrone", name: "Minestrone", cat: "soupe", cui: "it", time: 45, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Minestrone_soup.jpg/500px-Minestrone_soup.jpg", imgPage: "https://fr.wikipedia.org/wiki/Minestrone",
    ing: [["carotte", 2, "pc"], ["courgette", 1, "pc"], ["pdt", 200, "g"], ["celeri", 2, "pc"], ["oignon", 1, "pc"], ["haricots_blancs", 1, "boite"], ["tomates_concassees", 1, "boite"], ["pates", 80, "g"], ["parmesan", 40, "g"], ["bouillon", 1, "pc"]],
    pantry: ["huile d'olive", "thym", "sel", "poivre"],
    steps: [
      "Coupez les 2 carottes, la courgette, 200 g de pommes de terre et 2 branches de céleri en petits dés. Émincez l'oignon.",
      "Dans une grande casserole, faites revenir l'oignon, le céleri et les carottes dans 2 cuillères d'huile d'olive 5 minutes.",
      "Ajoutez les pommes de terre, la courgette, la boîte de tomates, le thym et 1 litre d'eau avec le cube de bouillon. Laissez mijoter 20 minutes à couvert.",
      "Ajoutez les haricots blancs égouttés et 80 g de petites pâtes. Cuisez 10 minutes de plus. Salez, poivrez.",
      "Servez avec 40 g de parmesan râpé et un filet d'huile d'olive crue."
    ] },

  { id: "sorrentina", name: "Gnocchis à la sorrentina", cat: "pates", cui: "it", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Gnocchi_di_ricotta_burro_e_salvia.jpg/500px-Gnocchi_di_ricotta_burro_e_salvia.jpg", imgPage: "https://fr.wikipedia.org/wiki/Gnocchi",
    ing: [["gnocchis", 400, "g"], ["coulis", 300, "g"], ["mozzarella", 125, "g"], ["basilic", 1, "botte"], ["parmesan", 30, "g"], ["ail", 1, "gousse"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Préchauffez le gril du four. Hachez la gousse d'ail. Dans une sauteuse allant au four, faites-la dorer 1 minute dans 2 cuillères d'huile d'olive.",
      "Ajoutez 300 g de coulis de tomate, la moitié du basilic, sel et poivre. Laissez mijoter 8 minutes.",
      "Plongez 400 g de gnocchis dans l'eau bouillante salée : ils sont cuits quand ils remontent à la surface (2 minutes). Égouttez.",
      "Mélangez les gnocchis à la sauce, ajoutez la mozzarella coupée en dés et 30 g de parmesan sur le dessus.",
      "Passez 5 minutes sous le gril jusqu'à ce que le fromage soit fondu et doré. Ajoutez le reste du basilic et servez."
    ] },

  { id: "piccata", name: "Piccata de poulet au citron, tagliatelles", cat: "volaille", cui: "it", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Chicken_piccata_made_with_fresh_lemons_and_jarred_capers.jpg/500px-Chicken_piccata_made_with_fresh_lemons_and_jarred_capers.jpg", imgPage: "https://fr.wikipedia.org/wiki/Piccata",
    ing: [["poulet_blanc", 300, "g"], ["farine", 30, "g"], ["beurre", 40, "g"], ["citron", 1, "pc"], ["capres", 2, "cs"], ["persil", 1, "botte"], ["tagliatelles", 200, "g"], ["bouillon", 1, "pc"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Faites cuire 200 g de tagliatelles dans l'eau bouillante salée. Préparez 15 cl de bouillon avec le cube.",
      "Coupez 300 g de blanc de poulet en escalopes fines (4 morceaux), salez, poivrez, farinez-les légèrement.",
      "Dans une poêle, faites chauffer 20 g de beurre avec 1 cuillère d'huile d'olive. Dorez les escalopes 2 minutes par face, réservez.",
      "Versez le bouillon et le jus du citron dans la poêle en grattant le fond, ajoutez 2 cuillères de câpres égouttées. Laissez réduire 3 minutes, puis incorporez les 20 g de beurre restants en fouettant.",
      "Remettez le poulet 1 minute dans la sauce, parsemez de persil. Servez sur les tagliatelles."
    ] },

  { id: "tagliatelles-saumon", name: "Tagliatelles au saumon et à l'aneth", cat: "poisson", cui: "it", time: 20, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Making_a_better_homemade_pasta_-_16670047286.jpg/500px-Making_a_better_homemade_pasta_-_16670047286.jpg", imgPage: "https://fr.wikipedia.org/wiki/Tagliatelle",
    ing: [["tagliatelles", 200, "g"], ["saumon", 250, "g"], ["creme", 20, "cl"], ["echalote", 1, "pc"], ["aneth", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Faites cuire 200 g de tagliatelles dans l'eau bouillante salée.",
      "Coupez 250 g de saumon en dés de 2 cm. Ciselez l'échalote et l'aneth. Râpez le zeste d'un demi-citron.",
      "Dans une poêle avec 1 cuillère d'huile d'olive, faites fondre l'échalote 1 minute, puis saisissez le saumon 2 minutes en le retournant délicatement.",
      "Versez 20 cl de crème, le zeste et le jus du demi-citron, sel, poivre. Laissez frémir 3 minutes.",
      "Égouttez les tagliatelles, mélangez-les à la sauce, ajoutez l'aneth ciselé et servez."
    ] },

  { id: "polenta-champignons", name: "Polenta crémeuse aux champignons", cat: "vege", cui: "it", time: 30, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Polenta_Trentina.jpg/500px-Polenta_Trentina.jpg", imgPage: "https://fr.wikipedia.org/wiki/Polenta",
    ing: [["polenta", 150, "g"], ["champignons", 400, "g"], ["parmesan", 50, "g"], ["beurre", 30, "g"], ["ail", 2, "gousse"], ["persil", 1, "botte"], ["lait", 25, "cl"]],
    pantry: ["huile d'olive", "thym", "sel", "poivre"],
    steps: [
      "Portez 50 cl d'eau et 25 cl de lait à ébullition avec du sel. Versez 150 g de polenta en pluie en fouettant.",
      "Baissez le feu et remuez régulièrement 5 à 8 minutes (selon la polenta) jusqu'à ce qu'elle épaississe et se détache des parois. Hors du feu, incorporez 30 g de beurre et 50 g de parmesan. Couvrez.",
      "Nettoyez et coupez 400 g de champignons en quartiers. Hachez 2 gousses d'ail et le persil.",
      "Dans une grande poêle très chaude avec 2 cuillères d'huile d'olive, faites sauter les champignons 6 minutes sans trop les remuer pour qu'ils dorent. Ajoutez l'ail, le thym, sel, poivre, 1 minute de plus, puis le persil.",
      "Servez la polenta crémeuse dans des assiettes creuses, les champignons dessus, un filet d'huile d'olive."
    ] },

  { id: "penne-poulet-epinards", name: "Penne au poulet, tomates séchées et épinards", cat: "pates", cui: "it", time: 25, slots: ["midi", "soir"],
    ing: [["pates", 200, "g"], ["poulet_blanc", 250, "g"], ["tomates_sechees", 60, "g"], ["epinards", 150, "g"], ["creme", 15, "cl"], ["ail", 2, "gousse"], ["parmesan", 40, "g"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: [
      "Faites cuire 200 g de penne al dente dans l'eau bouillante salée.",
      "Coupez 250 g de blanc de poulet en lanières, salez, poivrez. Coupez 60 g de tomates séchées en lanières, hachez 2 gousses d'ail.",
      "Dans une grande poêle avec 1 cuillère d'huile d'olive, faites dorer le poulet 6 minutes. Ajoutez l'ail et les tomates séchées 1 minute.",
      "Ajoutez 150 g d'épinards par poignées et laissez-les tomber 2 minutes. Versez 15 cl de crème, laissez frémir 2 minutes.",
      "Égouttez les pâtes, mélangez-les à la sauce avec 40 g de parmesan. Poivrez et servez."
    ] },

  /* ---------- Asiatiques ---------- */
  { id: "poulet-teriyaki", name: "Poulet teriyaki, riz et brocoli", cat: "volaille", cui: "jp", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Chicken_teriyaki.jpg/500px-Chicken_teriyaki.jpg", imgPage: "https://fr.wikipedia.org/wiki/Teriyaki",
    ing: [["poulet_haut", 4, "pc"], ["sauce_soja", 4, "cs"], ["miel", 2, "cs"], ["gingembre", 15, "g"], ["ail", 2, "gousse"], ["brocoli", 1, "pc"], ["riz", 150, "g"], ["sesame", 1, "cs"]],
    pantry: ["huile", "vinaigre"],
    steps: [
      "Faites cuire 150 g de riz. Détaillez le brocoli en bouquets et faites-le cuire 5 minutes à la vapeur (ou 4 minutes à l'eau bouillante).",
      "Sauce : mélangez 4 cuillères de sauce soja, 2 de miel, 2 d'eau, 1 cuillère à café de vinaigre, 15 g de gingembre râpé et 2 gousses d'ail pressées.",
      "Désossez les hauts de cuisse si besoin (ou demandez-le au boucher). Dans une poêle avec 1 cuillère d'huile, cuisez-les 6 minutes côté peau à feu moyen, puis 4 minutes de l'autre côté.",
      "Retirez le gras de la poêle, versez la sauce et laissez réduire 3 minutes en retournant le poulet pour le laquer : la sauce doit être sirupeuse.",
      "Coupez le poulet en tranches, servez sur le riz avec le brocoli, nappez de sauce et parsemez de sésame."
    ] },

  { id: "boeuf-oignons", name: "Bœuf sauté aux oignons, riz", cat: "viande", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Beef_and_broccoli_stir_fry.jpg/500px-Beef_and_broccoli_stir_fry.jpg", imgPage: "https://en.wikipedia.org/wiki/Beef_and_broccoli",
    ing: [["boeuf_saute", 300, "g"], ["oignon", 3, "pc"], ["sauce_soja", 3, "cs"], ["ail", 2, "gousse"], ["gingembre", 15, "g"], ["riz", 150, "g"], ["coriandre", 1, "botte"]],
    pantry: ["huile", "sucre", "poivre"],
    steps: [
      "Coupez 300 g de bœuf en fines lanières. Mélangez-le avec 3 cuillères de sauce soja, 2 gousses d'ail hachées, 15 g de gingembre râpé, une pincée de sucre et du poivre. Laissez mariner 10 minutes.",
      "Faites cuire 150 g de riz. Émincez les 3 oignons.",
      "Dans un wok très chaud avec 1 cuillère d'huile, faites sauter les oignons 5 minutes à feu vif jusqu'à ce qu'ils soient dorés et fondants. Réservez.",
      "Ajoutez un peu d'huile, saisissez le bœuf égoutté 2 minutes à feu très vif en remuant (par petites quantités pour ne pas le faire bouillir).",
      "Remettez les oignons, versez le reste de marinade, mélangez 30 secondes. Servez sur le riz avec la coriandre."
    ] },

  { id: "curry-vert", name: "Curry vert thaï au poulet", cat: "volaille", cui: "as", time: 30, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Thai_green_chicken_curry_and_roti.jpg/500px-Thai_green_chicken_curry_and_roti.jpg", imgPage: "https://fr.wikipedia.org/wiki/Curry_vert",
    ing: [["poulet_blanc", 300, "g"], ["pate_curry_vert", 2, "cs"], ["lait_coco", 40, "cl"], ["poivron", 1, "pc"], ["haricots_verts", 150, "g"], ["basilic", 1, "botte"], ["citron_vert", 1, "pc"], ["nuoc_mam", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["huile", "sucre"],
    steps: [
      "Coupez 300 g de blanc de poulet en morceaux, le poivron en lanières, équeutez 150 g de haricots verts. Faites cuire 150 g de riz.",
      "Dans une sauteuse, faites chauffer 1 cuillère d'huile et faites revenir 2 cuillères de pâte de curry vert 1 minute en remuant, jusqu'à ce qu'elle embaume.",
      "Ajoutez le poulet et faites-le colorer 3 minutes en l'enrobant de pâte.",
      "Versez 40 cl de lait de coco, ajoutez les haricots et le poivron. Laissez mijoter 12 minutes à feu moyen.",
      "Assaisonnez avec 1 cuillère de nuoc-mâm, une pointe de sucre et le jus d'un demi-citron vert. Ajoutez le basilic effeuillé et servez avec le riz."
    ] },

  { id: "pho", name: "Pho au bœuf (express)", cat: "soupe", cui: "as", time: 40, slots: ["soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Ph%E1%BB%9F_b%C3%B2%2C_C%E1%BA%A7u_Gi%E1%BA%A5y%2C_H%C3%A0_N%E1%BB%99i.jpg/500px-Ph%E1%BB%9F_b%C3%B2%2C_C%E1%BA%A7u_Gi%E1%BA%A5y%2C_H%C3%A0_N%E1%BB%99i.jpg", imgPage: "https://fr.wikipedia.org/wiki/Ph%E1%BB%9F",
    ing: [["boeuf_saute", 250, "g"], ["nouilles_riz", 200, "g"], ["oignon", 1, "pc"], ["gingembre", 30, "g"], ["bouillon", 2, "pc"], ["germes_soja", 100, "g"], ["coriandre", 1, "botte"], ["oignon_nouveau", 2, "pc"], ["citron_vert", 1, "pc"], ["nuoc_mam", 2, "cs"]],
    pantry: ["anis étoilé", "cannelle", "piment"],
    steps: [
      "Coupez l'oignon en deux et 30 g de gingembre en tranches épaisses. Faites-les griller à sec dans une casserole 3 minutes jusqu'à ce qu'ils noircissent légèrement.",
      "Ajoutez 1,5 litre d'eau, les 2 cubes de bouillon, 1 anis étoilé et un bâton de cannelle (ou une pincée). Laissez frémir 25 minutes, puis filtrez et ajoutez 2 cuillères de nuoc-mâm.",
      "Pendant ce temps, faites tremper 200 g de nouilles de riz selon le paquet, égouttez. Coupez 250 g de bœuf en tranches aussi fines que possible (plus facile s'il a passé 20 minutes au congélateur).",
      "Préparez les garnitures : 100 g de germes de soja, coriandre, 2 oignons nouveaux émincés, citron vert en quartiers, piment.",
      "Répartissez les nouilles dans deux grands bols, posez le bœuf cru dessus, et versez le bouillon bouillant : il cuit la viande instantanément. Ajoutez les garnitures à table."
    ] },

  { id: "riz-saute", name: "Riz sauté aux œufs et petits légumes", cat: "oeufs", cui: "cn", time: 15, slots: ["midi"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Nasi_goreng_Solaria_Kuta.JPG/500px-Nasi_goreng_Solaria_Kuta.JPG", imgPage: "https://fr.wikipedia.org/wiki/Riz_frit",
    ing: [["riz", 150, "g"], ["oeuf", 3, "pc"], ["petits_pois", 100, "g"], ["carotte", 1, "pc"], ["oignon_nouveau", 3, "pc"], ["sauce_soja", 3, "cs"], ["sesame", 1, "cs"]],
    pantry: ["huile", "poivre"],
    steps: [
      "Faites cuire 150 g de riz (idéalement la veille : le riz froid ne colle pas). Coupez la carotte en tout petits dés, émincez les 3 oignons nouveaux, battez 3 œufs.",
      "Dans un wok très chaud avec 1 cuillère d'huile, faites sauter la carotte 2 minutes, puis 100 g de petits pois (surgelés, sans décongeler) 2 minutes.",
      "Poussez les légumes sur le côté, versez les œufs et brouillez-les 1 minute.",
      "Ajoutez le riz, 3 cuillères de sauce soja et les oignons nouveaux. Faites sauter 3 minutes à feu vif en remuant, jusqu'à ce que le riz soit chaud et légèrement grillé. Poivrez.",
      "Servez avec les graines de sésame. Ajoutez des restes de poulet ou de crevettes si vous en avez."
    ] },

  { id: "bo-bun", name: "Bò bún", cat: "viande", cui: "as", time: 30, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Bo_Bun_Tha%C3%AF.jpg/500px-Bo_Bun_Tha%C3%AF.jpg", imgPage: "https://fr.wikipedia.org/wiki/B%C3%B2_b%C3%BAn",
    ing: [["boeuf_saute", 300, "g"], ["vermicelles_riz", 150, "g"], ["carotte", 1, "pc"], ["concombre", 1, "pc"], ["laitue", 1, "pc"], ["germes_soja", 100, "g"], ["cacahuetes", 40, "g"], ["menthe", 1, "botte"], ["nuoc_mam", 3, "cs"], ["citron_vert", 1, "pc"], ["ail", 2, "gousse"]],
    pantry: ["sucre", "huile"],
    steps: [
      "Sauce (nuoc-mâm dressing) : mélangez 3 cuillères de nuoc-mâm, le jus du citron vert, 1 cuillère à soupe de sucre, 4 cuillères d'eau et 1 gousse d'ail hachée. Le sucre doit être dissous.",
      "Faites cuire 150 g de vermicelles de riz 4 minutes dans l'eau bouillante, égouttez et rincez à l'eau froide.",
      "Coupez la carotte et un demi-concombre en julienne, ciselez la laitue, effeuillez la menthe, concassez 40 g de cacahuètes.",
      "Coupez 300 g de bœuf en lanières fines. Faites-les saisir 2 minutes dans une poêle très chaude avec 1 cuillère d'huile et 1 gousse d'ail hachée. Salez légèrement.",
      "Dans deux grands bols : laitue au fond, vermicelles, puis le bœuf chaud, la carotte, le concombre, 100 g de germes de soja, la menthe et les cacahuètes. Arrosez de sauce et mélangez à table."
    ] },

  { id: "saumon-sesame", name: "Saumon au sésame, riz et brocoli", cat: "poisson", cui: "jp", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["saumon", 300, "g"], ["sesame", 2, "cs"], ["sauce_soja", 3, "cs"], ["miel", 1, "cs"], ["brocoli", 1, "pc"], ["riz", 150, "g"], ["citron_vert", 1, "pc"]],
    pantry: ["huile", "gingembre moulu"],
    steps: [
      "Marinade : mélangez 3 cuillères de sauce soja, 1 de miel, le jus d'un demi-citron vert et une pincée de gingembre moulu. Faites-y mariner les 2 pavés de saumon 10 minutes en les retournant.",
      "Faites cuire 150 g de riz. Détaillez le brocoli en bouquets et faites-le cuire 5 minutes à la vapeur.",
      "Égouttez le saumon (gardez la marinade), roulez-le dans 2 cuillères de graines de sésame en pressant.",
      "Faites chauffer 1 cuillère d'huile dans une poêle, cuisez le saumon 3 minutes par face à feu moyen. Le sésame doit être doré et le cœur encore rosé.",
      "Faites bouillir la marinade 1 minute dans la poêle. Servez le saumon avec le riz, le brocoli et la sauce."
    ] },

  /* ---------- Indiennes ---------- */
  { id: "tikka-masala", name: "Poulet tikka masala", cat: "volaille", cui: "in", time: 40, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Chicken_Tikka_Masala.jpg/500px-Chicken_Tikka_Masala.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poulet_tikka_masala",
    ing: [["poulet_blanc", 400, "g"], ["yaourt", 1, "pot"], ["tomates_concassees", 1, "boite"], ["creme", 10, "cl"], ["oignon", 1, "pc"], ["ail", 3, "gousse"], ["gingembre", 20, "g"], ["riz_basmati", 150, "g"], ["coriandre", 1, "botte"]],
    pantry: ["garam masala", "curcuma", "paprika", "cumin", "huile", "sel"],
    steps: [
      "Coupez 400 g de blanc de poulet en cubes. Mélangez-les avec le yaourt, 1 cuillère à café de garam masala, 1/2 de curcuma, 1 de paprika et 1 gousse d'ail pressée. Laissez mariner 15 minutes (ou plusieurs heures).",
      "Faites cuire 150 g de riz basmati rincé. Hachez l'oignon, 2 gousses d'ail et 20 g de gingembre.",
      "Dans une poêle très chaude avec 1 cuillère d'huile, saisissez le poulet égoutté 4 minutes pour le colorer. Réservez.",
      "Dans la même poêle, faites revenir l'oignon, l'ail et le gingembre 5 minutes. Ajoutez 1 cuillère à café de cumin et 1 de garam masala, puis la boîte de tomates. Mijotez 10 minutes, puis mixez pour une sauce lisse.",
      "Remettez la sauce dans la poêle avec 10 cl de crème et le poulet. Laissez mijoter 8 minutes. Salez. Servez sur le riz avec la coriandre ciselée."
    ] },

  { id: "chana-masala", name: "Chana masala (curry de pois chiches)", cat: "vege", cui: "in", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Choleindia.jpg/500px-Choleindia.jpg", imgPage: "https://fr.wikipedia.org/wiki/Chana_masala",
    ing: [["pois_chiches", 2, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["ail", 3, "gousse"], ["gingembre", 20, "g"], ["riz_basmati", 150, "g"], ["coriandre", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["garam masala", "cumin", "curcuma", "piment", "huile", "sel"],
    steps: [
      "Hachez l'oignon, 3 gousses d'ail et 20 g de gingembre. Faites cuire 150 g de riz basmati rincé.",
      "Dans une sauteuse, faites revenir l'oignon dans 2 cuillères d'huile 5 minutes. Ajoutez l'ail, le gingembre, 1 cuillère à café de cumin, 1 de curcuma, 1 de garam masala et une pointe de piment. Mélangez 1 minute.",
      "Ajoutez la boîte de tomates concassées et laissez réduire 10 minutes en remuant.",
      "Ajoutez les 2 boîtes de pois chiches égouttés et rincés, 10 cl d'eau, du sel. Laissez mijoter 10 minutes en écrasant quelques pois chiches à la cuillère pour épaissir.",
      "Terminez avec le jus d'un demi-citron et la coriandre ciselée. Servez avec le riz."
    ] },

  { id: "curry-legumes-coco", name: "Curry de légumes au lait de coco", cat: "vege", cui: "in", time: 35, slots: ["soir"], diet: ["leger"],
    ing: [["chou_fleur", 1, "pc"], ["pdt", 300, "g"], ["petits_pois", 150, "g"], ["carotte", 2, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["lait_coco", 40, "cl"], ["tomates_concassees", 1, "boite"], ["riz_basmati", 150, "g"], ["coriandre", 1, "botte"]],
    pantry: ["curry", "cumin", "huile", "sel"],
    steps: [
      "Épluchez 300 g de pommes de terre et 2 carottes, coupez-les en dés. Détaillez le chou-fleur en petits bouquets. Hachez l'oignon et 2 gousses d'ail.",
      "Dans une cocotte, faites revenir l'oignon et l'ail dans 2 cuillères d'huile 4 minutes. Ajoutez 1 cuillère à soupe de curry et 1 cuillère à café de cumin, mélangez 1 minute.",
      "Ajoutez les pommes de terre, les carottes, la boîte de tomates et 40 cl de lait de coco. Salez, couvrez et laissez mijoter 15 minutes.",
      "Ajoutez le chou-fleur, poursuivez 10 minutes, puis 150 g de petits pois 3 minutes. Les légumes doivent être tendres.",
      "Faites cuire 150 g de riz basmati pendant ce temps. Servez le curry sur le riz avec la coriandre."
    ] },

  /* ---------- Méditerranéennes & orientales ---------- */
  { id: "falafels", name: "Falafels, sauce au yaourt, pita", cat: "vege", cui: "lb", time: 40, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Falafels_2.jpg/500px-Falafels_2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Falafel",
    ing: [["pois_chiches_secs", 200, "g"], ["oignon", 1, "pc"], ["ail", 3, "gousse"], ["persil", 1, "botte"], ["coriandre", 1, "botte"], ["farine", 20, "g"], ["yaourt", 1, "pot"], ["citron", 1, "pc"], ["pita", 4, "pc"], ["tomate", 2, "pc"], ["concombre", 1, "pc"]],
    pantry: ["cumin", "coriandre moulue", "bicarbonate", "huile", "sel"],
    steps: [
      "La veille : faites tremper 200 g de pois chiches secs dans un grand volume d'eau froide pendant 12 heures. Ne les cuisez pas.",
      "Égouttez-les bien. Mixez-les avec l'oignon, 3 gousses d'ail, le persil, la coriandre, 1 cuillère à café de cumin, 1 de coriandre moulue, 20 g de farine, une pincée de bicarbonate et du sel, jusqu'à obtenir une pâte granuleuse qui se tient quand on la presse.",
      "Formez des boulettes de la taille d'une noix (une quinzaine) en pressant bien. Laissez reposer 15 minutes au frais.",
      "Faites chauffer 2 cm d'huile dans une poêle. Cuisez les falafels 4 minutes en les retournant, jusqu'à ce qu'ils soient bien dorés. Égouttez sur du papier absorbant. (Au four : 20 minutes à 200 °C, badigeonnés d'huile.)",
      "Sauce : mélangez le yaourt avec le jus d'un demi-citron, 1 pointe d'ail et du sel. Servez les falafels dans les pains pita tièdes avec la tomate et le concombre en dés, et la sauce."
    ] },

  { id: "chich-taouk", name: "Chich taouk, riz et salade", cat: "volaille", cui: "lb", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Shoarma_Carrefour_Laval.jpg/500px-Shoarma_Carrefour_Laval.jpg", imgPage: "https://fr.wikipedia.org/wiki/Shish_taouk",
    ing: [["poulet_blanc", 400, "g"], ["yaourt", 1, "pot"], ["citron", 1, "pc"], ["ail", 3, "gousse"], ["riz", 150, "g"], ["laitue", 1, "pc"], ["tomate", 2, "pc"], ["pita", 2, "pc"]],
    pantry: ["paprika", "cumin", "origan", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez 400 g de blanc de poulet en cubes de 3 cm. Dans un plat, mélangez le yaourt, le jus du citron, 3 gousses d'ail pressées, 1 cuillère à café de paprika, 1 de cumin, 1 d'origan, 2 cuillères d'huile d'olive, sel et poivre. Ajoutez le poulet et laissez mariner 15 minutes minimum (idéalement 2 heures).",
      "Faites cuire 150 g de riz. Lavez la laitue, coupez les 2 tomates en quartiers.",
      "Enfilez le poulet sur des piques. Faites griller 4 minutes par face sur une poêle-gril chaude ou sous le gril du four : le yaourt de la marinade forme une croûte dorée.",
      "Passez les pains pita 1 minute à la poêle pour les tiédir.",
      "Servez les brochettes avec le riz, la salade et le pita. Un peu de sauce à l'ail (yaourt + ail + citron) en plus si vous aimez."
    ] },

  { id: "moussaka", name: "Moussaka au bœuf", cat: "viande", cui: "med", time: 80, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Mousakas.jpg/500px-Mousakas.jpg", imgPage: "https://fr.wikipedia.org/wiki/Moussaka",
    ing: [["aubergine", 3, "pc"], ["boeuf_hache", 400, "g"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["lait", 40, "cl"], ["beurre", 30, "g"], ["farine", 30, "g"], ["gruyere", 60, "g"], ["oeuf", 1, "pc"]],
    pantry: ["cannelle", "origan", "muscade", "huile d'olive", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Coupez les 3 aubergines en tranches de 1 cm dans la longueur, badigeonnez-les d'huile d'olive, salez. Enfournez 20 minutes sur une plaque jusqu'à ce qu'elles soient dorées et souples.",
      "Hachez l'oignon et 2 gousses d'ail. Faites-les revenir dans 1 cuillère d'huile 4 minutes. Ajoutez 400 g de bœuf haché, faites colorer, puis la boîte de tomates, 1/2 cuillère à café de cannelle, 1 cuillère à café d'origan, sel et poivre. Mijotez 15 minutes jusqu'à ce que la sauce soit épaisse.",
      "Béchamel : faites fondre 30 g de beurre, ajoutez 30 g de farine, remuez 1 minute, versez 40 cl de lait froid en fouettant, cuisez jusqu'à épaississement. Hors du feu, ajoutez muscade, sel, poivre et 1 jaune d'œuf.",
      "Baissez le four à 180 °C. Dans un plat, alternez une couche d'aubergines, la viande, puis le reste des aubergines. Nappez de béchamel et parsemez de 60 g de gruyère.",
      "Enfournez 35 minutes jusqu'à ce que le dessus soit doré. Laissez reposer 10 minutes avant de servir : les parts se tiendront mieux."
    ] },

  { id: "salade-grecque", name: "Salade grecque, pita", cat: "salade", cui: "med", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Oia%2C_Santorini%2C_Greece_-_panoramio_%2818%29.jpg/500px-Oia%2C_Santorini%2C_Greece_-_panoramio_%2818%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Salade_grecque",
    ing: [["tomate", 4, "pc"], ["concombre", 1, "pc"], ["poivron", 1, "pc"], ["oignon_rouge", 1, "pc"], ["feta", 200, "g"], ["olives_noires", 80, "g"], ["pita", 4, "pc"]],
    pantry: ["origan", "huile d'olive", "vinaigre", "sel", "poivre"],
    steps: [
      "Coupez les 4 tomates en gros quartiers, le concombre en demi-rondelles épaisses, le poivron en morceaux et l'oignon rouge en fines rondelles.",
      "Réunissez-les dans un saladier avec 80 g d'olives noires.",
      "Assaisonnez avec 4 cuillères d'huile d'olive, 1 cuillère de vinaigre, 1 cuillère à café d'origan, sel et poivre. Mélangez.",
      "Coupez 200 g de feta en gros dés ou en 2 tranches et posez-la sur la salade, avec encore un peu d'origan et d'huile.",
      "Faites griller les 4 pains pita à la poêle ou au grille-pain, coupez-les en triangles et servez."
    ] },

  { id: "poulet-grec-citron", name: "Poulet au citron et pommes de terre à la grecque", cat: "volaille", cui: "med", time: 60, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg/500px-Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg", imgPage: "https://en.wikipedia.org/wiki/Roast_chicken",
    ing: [["poulet_haut", 4, "pc"], ["pdt", 700, "g"], ["citron", 2, "pc"], ["ail", 4, "gousse"], ["bouillon", 1, "pc"], ["laitue", 1, "pc"]],
    pantry: ["origan", "huile d'olive", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Épluchez 700 g de pommes de terre et coupez-les en quartiers. Écrasez 4 gousses d'ail. Préparez 20 cl de bouillon avec le cube.",
      "Dans un grand plat, mélangez les pommes de terre avec 3 cuillères d'huile d'olive, le jus des 2 citrons, l'ail, 1 cuillère à soupe d'origan, sel et poivre.",
      "Salez et poivrez les 4 hauts de cuisse, posez-les côté peau vers le haut sur les pommes de terre. Versez le bouillon dans le fond du plat.",
      "Enfournez 50 minutes en retournant les pommes de terre à mi-cuisson (pas le poulet, pour garder la peau croustillante). Ajoutez un peu d'eau si le plat sèche.",
      "Servez avec la laitue en vinaigrette. Le jus du plat, citronné et aillé, se verse sur tout."
    ] },

  { id: "paella", name: "Paella express poulet et crevettes", cat: "pates", cui: "med", time: 45, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Paella_amb_caragols_a_un_restaurant_de_la_Patacona%2C_Alboraia.jpg/500px-Paella_amb_caragols_a_un_restaurant_de_la_Patacona%2C_Alboraia.jpg", imgPage: "https://fr.wikipedia.org/wiki/Paella",
    ing: [["riz", 200, "g"], ["poulet_haut", 2, "pc"], ["crevettes", 200, "g"], ["poivron", 1, "pc"], ["petits_pois", 100, "g"], ["tomate", 2, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["bouillon", 1, "pc"], ["citron", 1, "pc"]],
    pantry: ["safran (ou curcuma)", "paprika", "huile d'olive", "sel", "poivre"],
    steps: [
      "Préparez 60 cl de bouillon avec le cube et une pincée de safran (ou 1 cuillère à café de curcuma), gardez-le chaud. Coupez les 2 hauts de cuisse en 2 ou 3 morceaux, le poivron en lanières, râpez les 2 tomates, hachez l'oignon et 2 gousses d'ail.",
      "Dans une grande poêle ou un plat à paella avec 2 cuillères d'huile d'olive, faites dorer le poulet 6 minutes. Réservez.",
      "Faites revenir l'oignon, le poivron et l'ail 5 minutes, puis les tomates râpées et 1 cuillère à café de paprika, 3 minutes.",
      "Ajoutez 200 g de riz et remuez 2 minutes pour le nacrer. Versez le bouillon chaud, répartissez le poulet, salez, poivrez. Laissez cuire 15 minutes à feu moyen sans remuer.",
      "Déposez 200 g de crevettes et 100 g de petits pois sur le dessus, couvrez d'un torchon ou d'aluminium et cuisez 5 minutes de plus. Laissez reposer 3 minutes. Servez avec des quartiers de citron."
    ] },

  { id: "tortilla", name: "Tortilla de pommes de terre, salade", cat: "oeufs", cui: "med", time: 30, slots: ["midi", "soir"],
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Tortilla-de-patatas.jpg", imgPage: "https://fr.wikipedia.org/wiki/Tortilla_de_patatas",
    ing: [["pdt", 500, "g"], ["oeuf", 6, "pc"], ["oignon", 1, "pc"], ["laitue", 1, "pc"], ["tomate", 2, "pc"]],
    pantry: ["huile d'olive", "vinaigre", "sel", "poivre"],
    steps: [
      "Épluchez 500 g de pommes de terre et coupez-les en fines lamelles. Émincez l'oignon.",
      "Dans une poêle de 24 cm, faites chauffer un bon fond d'huile d'olive (5 cuillères). Faites cuire les pommes de terre et l'oignon 15 minutes à feu doux en remuant : ils doivent être fondants sans colorer. Égouttez-les dans une passoire (gardez l'huile).",
      "Battez 6 œufs avec du sel et du poivre. Ajoutez les pommes de terre tièdes et laissez reposer 5 minutes.",
      "Remettez 1 cuillère d'huile dans la poêle, versez le mélange et cuisez 5 minutes à feu doux en ramenant les bords. Posez une grande assiette sur la poêle, retournez d'un coup, et faites glisser la tortilla dans la poêle pour cuire l'autre face 4 minutes.",
      "Servez tiède, avec la laitue et les 2 tomates en salade. Excellente froide le lendemain."
    ] },

  { id: "mezze", name: "Assiette mezze (houmous, crudités, pita)", cat: "vege", cui: "lb", time: 20, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Syrian_meal.jpg/500px-Syrian_meal.jpg", imgPage: "https://fr.wikipedia.org/wiki/Mezz%C3%A9",
    ing: [["pois_chiches", 1, "boite"], ["tahini", 3, "cs"], ["citron", 1, "pc"], ["ail", 1, "gousse"], ["concombre", 1, "pc"], ["carotte", 2, "pc"], ["tomates_cerises", 150, "g"], ["feta", 100, "g"], ["olives_noires", 60, "g"], ["pita", 4, "pc"]],
    pantry: ["cumin", "paprika", "huile d'olive", "sel"],
    steps: [
      "Houmous : égouttez la boîte de pois chiches (gardez 3 cuillères de jus). Mixez-les avec 3 cuillères de tahini, le jus du citron, la gousse d'ail, 1 cuillère à café de cumin, 2 cuillères d'huile d'olive et du sel, en ajoutant le jus réservé jusqu'à obtenir une texture lisse et onctueuse.",
      "Coupez le concombre et les 2 carottes en bâtonnets. Coupez 150 g de tomates cerises en deux, la feta en dés.",
      "Étalez le houmous dans une assiette, creusez le centre, versez un filet d'huile d'olive et saupoudrez de paprika.",
      "Faites tiédir les 4 pains pita à la poêle ou au four 2 minutes, coupez-les en triangles.",
      "Disposez tout sur un plateau : houmous, crudités, feta, 60 g d'olives noires et pita. Chacun se sert."
    ] },

  { id: "fattoush", name: "Fattoush", cat: "salade", cui: "lb", time: 25, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Fattoush.JPG/500px-Fattoush.JPG", imgPage: "https://fr.wikipedia.org/wiki/Fattouche",
    ing: [["romaine", 1, "pc"], ["tomate", 3, "pc"], ["concombre", 1, "pc"], ["radis", 1, "botte"], ["oignon_nouveau", 2, "pc"], ["menthe", 1, "botte"], ["persil", 1, "botte"], ["pita", 2, "pc"], ["citron", 1, "pc"]],
    pantry: ["sumac", "huile d'olive", "sel", "poivre"],
    steps: [
      "Coupez les 2 pains pita en petits morceaux, arrosez d'un filet d'huile d'olive et faites-les griller au four à 200 °C 8 minutes (ou à la poêle sèche) jusqu'à ce qu'ils soient bien croustillants.",
      "Coupez la romaine en lanières, les 3 tomates en morceaux, le concombre en demi-rondelles, les radis en fines rondelles. Émincez les 2 oignons nouveaux, ciselez la menthe et le persil.",
      "Sauce : le jus du citron, 4 cuillères d'huile d'olive, 1 cuillère à café de sumac, sel et poivre.",
      "Mélangez tous les légumes et les herbes dans un grand saladier avec la sauce.",
      "Ajoutez les croûtons de pita au tout dernier moment pour qu'ils restent croquants, et une dernière pincée de sumac."
    ] },

  /* ---------- Mexicaines ---------- */
  { id: "fajitas", name: "Fajitas de poulet", cat: "volaille", cui: "mx", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Chicken_fajitas.jpg/500px-Chicken_fajitas.jpg", imgPage: "https://fr.wikipedia.org/wiki/Fajita",
    ing: [["poulet_blanc", 300, "g"], ["poivron", 2, "pc"], ["oignon", 1, "pc"], ["tortillas", 4, "pc"], ["creme", 10, "cl"], ["avocat", 1, "pc"], ["citron_vert", 1, "pc"]],
    pantry: ["paprika", "cumin", "piment", "huile", "sel"],
    steps: [
      "Coupez 300 g de blanc de poulet en lanières, les 2 poivrons en lanières et l'oignon en fines tranches. Mélangez 1 cuillère à café de paprika, 1 de cumin, une pointe de piment et du sel.",
      "Dans une grande poêle très chaude avec 2 cuillères d'huile, faites sauter le poulet 4 minutes avec la moitié des épices. Réservez.",
      "Faites sauter les poivrons et l'oignon 5 minutes avec le reste des épices, jusqu'à ce qu'ils soient tendres et légèrement grillés. Remettez le poulet 1 minute.",
      "Écrasez l'avocat avec le jus du citron vert et du sel. Réchauffez les 4 tortillas à la poêle sèche 20 secondes par face.",
      "Servez tout à table : chacun garnit sa tortilla de poulet, légumes, avocat et crème, puis la roule."
    ] },

  { id: "tacos-boeuf", name: "Tacos au bœuf haché", cat: "viande", cui: "mx", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/500px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg", imgPage: "https://fr.wikipedia.org/wiki/Taco",
    ing: [["boeuf_hache", 300, "g"], ["tortillas", 4, "pc"], ["cheddar_rape", 100, "g"], ["tomate", 2, "pc"], ["laitue", 1, "pc"], ["oignon_rouge", 1, "pc"], ["avocat", 1, "pc"], ["citron_vert", 1, "pc"]],
    pantry: ["cumin", "paprika", "piment", "huile", "sel"],
    steps: [
      "Hachez l'oignon rouge (gardez-en un quart pour la garniture). Dans une poêle avec 1 cuillère d'huile, faites revenir l'oignon 3 minutes, puis 300 g de bœuf haché 8 minutes en l'émiettant, avec 1 cuillère à café de cumin, 1 de paprika, une pointe de piment et du sel.",
      "Coupez les 2 tomates en dés, ciselez 4 feuilles de laitue, coupez l'avocat en dés et citronnez-le. Émincez le reste d'oignon rouge.",
      "Réchauffez les 4 tortillas à la poêle sèche 20 secondes par face, ou 30 secondes au micro-ondes sous un torchon.",
      "Garnissez chaque tortilla de viande chaude, 100 g de cheddar râpé (il fond au contact), laitue, tomate, oignon et avocat.",
      "Pliez en deux et servez avec des quartiers de citron vert."
    ] },

  { id: "quesadillas", name: "Quesadillas au poulet et cheddar", cat: "volaille", cui: "mx", time: 15, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Quesadilla_2.jpg/500px-Quesadilla_2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Quesadilla",
    ing: [["tortillas", 4, "pc"], ["poulet_blanc", 200, "g"], ["cheddar_rape", 150, "g"], ["poivron", 1, "pc"], ["oignon_nouveau", 2, "pc"], ["creme", 10, "cl"]],
    pantry: ["paprika", "huile", "sel"],
    steps: [
      "Coupez 200 g de blanc de poulet en petits dés et le poivron en petits morceaux. Faites-les sauter 6 minutes dans 1 cuillère d'huile avec 1 cuillère à café de paprika et du sel. Émincez les 2 oignons nouveaux.",
      "Posez une tortilla dans une poêle sèche à feu moyen. Répartissez 40 g de cheddar râpé, la moitié du poulet et des poivrons, la moitié des oignons nouveaux, puis encore 35 g de cheddar.",
      "Couvrez d'une seconde tortilla, pressez légèrement. Cuisez 2 minutes jusqu'à ce que le dessous soit doré, retournez avec une grande spatule et cuisez 2 minutes de l'autre côté.",
      "Recommencez avec les 2 autres tortillas et le reste de garniture.",
      "Coupez en quartiers comme une pizza et servez avec la crème fraîche."
    ] },

  /* ---------- Françaises ---------- */
  { id: "pot-au-feu", name: "Pot-au-feu", cat: "viande", cui: "fr", time: 150, slots: ["soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Pot-au-feu2.jpg/500px-Pot-au-feu2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Pot-au-feu",
    ing: [["boeuf_braiser", 600, "g"], ["carotte", 3, "pc"], ["poireau", 2, "pc"], ["navet", 2, "pc"], ["pdt", 400, "g"], ["oignon", 1, "pc"], ["celeri", 1, "pc"], ["cornichons", 6, "pc"]],
    pantry: ["laurier", "thym", "clous de girofle", "gros sel", "poivre en grains", "moutarde"],
    steps: [
      "Mettez 600 g de bœuf dans une grande marmite, couvrez de 2 litres d'eau froide et portez lentement à frémissement. Écumez soigneusement la mousse qui remonte pendant 10 minutes.",
      "Piquez l'oignon de 2 clous de girofle. Ajoutez-le avec le laurier, le thym, une branche de céleri, 1 cuillère à soupe de gros sel et quelques grains de poivre. Couvrez à moitié et laissez frémir 1 h 30 : l'eau ne doit jamais bouillir fort.",
      "Épluchez les 3 carottes, les 2 navets, les 2 poireaux (ficelés) et ajoutez-les. Poursuivez 30 minutes.",
      "Épluchez 400 g de pommes de terre et faites-les cuire à part dans un peu de bouillon 20 minutes (pour ne pas troubler le pot-au-feu).",
      "Servez d'abord un bol de bouillon, puis la viande coupée en tranches avec les légumes, du gros sel, de la moutarde et les cornichons. Le bouillon restant fait une soupe le lendemain."
    ] },

  { id: "poulet-moutarde", name: "Poulet à la moutarde, riz", cat: "volaille", cui: "fr", time: 35, slots: ["soir"],
    ing: [["poulet_haut", 4, "pc"], ["creme", 15, "cl"], ["oignon", 1, "pc"], ["riz", 150, "g"], ["persil", 1, "botte"]],
    pantry: ["moutarde", "thym", "huile", "sel", "poivre"],
    steps: [
      "Salez et poivrez les 4 hauts de cuisse. Dans une sauteuse, faites-les dorer dans 1 cuillère d'huile 5 minutes côté peau, puis 3 minutes de l'autre côté. Réservez.",
      "Jetez le gras, faites fondre l'oignon émincé 4 minutes dans la sauteuse.",
      "Ajoutez 2 cuillères à soupe de moutarde, 15 cl de crème et le thym. Mélangez, remettez le poulet côté peau vers le haut.",
      "Couvrez et laissez mijoter 20 minutes à feu doux. Découvrez les 5 dernières minutes si la sauce est trop liquide.",
      "Faites cuire 150 g de riz pendant ce temps. Servez le poulet nappé de sauce, parsemé de persil, avec le riz."
    ] },

  { id: "quiche-poireaux", name: "Quiche aux poireaux", cat: "oeufs", cui: "fr", time: 50, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Quiche_Lorraine.jpg/500px-Quiche_Lorraine.jpg", imgPage: "https://fr.wikipedia.org/wiki/Quiche",
    ing: [["pate_brisee", 1, "pc"], ["poireau", 3, "pc"], ["oeuf", 3, "pc"], ["creme", 20, "cl"], ["gruyere", 80, "g"], ["beurre", 20, "g"], ["laitue", 1, "pc"]],
    pantry: ["muscade", "vinaigre", "huile", "sel", "poivre"],
    steps: [
      "Fendez les 3 poireaux, lavez-les soigneusement et émincez-les. Faites-les fondre dans 20 g de beurre à feu doux et à couvert 15 minutes, en remuant. Salez, poivrez. Ils doivent être fondants et sans eau.",
      "Préchauffez le four à 180 °C. Déroulez la pâte brisée dans un moule, piquez le fond à la fourchette.",
      "Battez 3 œufs avec 20 cl de crème, une pincée de muscade, sel et poivre.",
      "Étalez les poireaux sur la pâte, parsemez de 80 g de gruyère, versez l'appareil.",
      "Enfournez 35 minutes jusqu'à ce que la quiche soit dorée et prise. Servez tiède avec la laitue en vinaigrette."
    ] },

  { id: "truite-amandes", name: "Truite aux amandes, pommes vapeur", cat: "poisson", cui: "fr", time: 25, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Truite_meuni%C3%A8re.jpg/500px-Truite_meuni%C3%A8re.jpg", imgPage: "https://fr.wikipedia.org/wiki/Truite_meuni%C3%A8re",
    ing: [["truite", 2, "pc"], ["amandes", 40, "g"], ["beurre", 40, "g"], ["citron", 1, "pc"], ["pdt", 500, "g"], ["persil", 1, "botte"], ["farine", 20, "g"]],
    pantry: ["sel", "poivre"],
    steps: [
      "Épluchez 500 g de pommes de terre, coupez-les en gros morceaux et faites-les cuire 20 minutes à la vapeur (ou à l'eau bouillante salée).",
      "Séchez les 2 truites vidées, salez et poivrez l'intérieur et l'extérieur, farinez-les légèrement.",
      "Dans une grande poêle, faites fondre 20 g de beurre à feu moyen. Cuisez les truites 5 minutes par face : la peau doit être dorée et la chair se détacher de l'arête.",
      "Réservez les truites au chaud. Ajoutez les 20 g de beurre restants dans la poêle avec 40 g d'amandes effilées, faites-les dorer 1 minute, puis ajoutez le jus du citron et le persil ciselé.",
      "Nappez les truites de beurre aux amandes et servez avec les pommes vapeur."
    ] },

  { id: "gratin-pates-thon", name: "Gratin de pâtes au thon", cat: "pates", cui: "fr", time: 35, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Tuna_Casserole2.jpg/500px-Tuna_Casserole2.jpg", imgPage: "https://en.wikipedia.org/wiki/Tuna_casserole",
    ing: [["pates", 200, "g"], ["thon", 1, "boite"], ["tomates_concassees", 1, "boite"], ["oignon", 1, "pc"], ["gruyere", 80, "g"], ["creme", 10, "cl"]],
    pantry: ["origan", "huile d'olive", "sel", "poivre"],
    steps: [
      "Faites cuire 200 g de pâtes 2 minutes de moins que le temps indiqué, égouttez.",
      "Préchauffez le four à 200 °C. Hachez l'oignon, faites-le revenir 4 minutes dans 1 cuillère d'huile d'olive. Ajoutez la boîte de tomates, l'origan, sel, poivre. Laissez réduire 8 minutes.",
      "Hors du feu, ajoutez 10 cl de crème et le thon égoutté et émietté.",
      "Mélangez la sauce aux pâtes, versez dans un plat à gratin, parsemez de 80 g de gruyère.",
      "Enfournez 15 minutes jusqu'à ce que le dessus soit gratiné."
    ] },

  { id: "salade-lyonnaise", name: "Salade tiède au bœuf et œuf poché", cat: "salade", cui: "fr", time: 20, slots: ["midi"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Salade_lyonnaise.JPG/500px-Salade_lyonnaise.JPG", imgPage: "https://fr.wikipedia.org/wiki/Salade_lyonnaise",
    ing: [["laitue", 1, "pc"], ["boeuf_saute", 200, "g"], ["oeuf", 2, "pc"], ["pain", 2, "tranche"], ["ail", 1, "gousse"], ["echalote", 1, "pc"]],
    pantry: ["vinaigre", "moutarde", "huile", "sel", "poivre"],
    steps: [
      "Lavez et essorez la laitue. Ciselez l'échalote. Vinaigrette : 1 cuillère à café de moutarde, 1 cuillère de vinaigre, 3 d'huile, l'échalote, sel, poivre.",
      "Coupez 2 tranches de pain en dés, frottez-les d'ail et faites-les dorer 3 minutes à la poêle dans un peu d'huile. Réservez.",
      "Coupez 200 g de bœuf en fines lanières, salez, poivrez. Saisissez-les 2 minutes dans la même poêle très chaude.",
      "Œufs pochés : portez une casserole d'eau à frémissement avec 1 cuillère de vinaigre. Cassez chaque œuf dans une tasse, faites-le glisser dans l'eau et cuisez 3 minutes. Égouttez sur du papier absorbant.",
      "Mélangez la salade et la vinaigrette, répartissez dans deux assiettes, ajoutez le bœuf tiède et les croûtons, posez l'œuf poché dessus. Poivrez et servez aussitôt."
    ] },

  { id: "roti-boeuf", name: "Rôti de bœuf, haricots verts", cat: "viande", cui: "fr", time: 40, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Rosbif.jpg/500px-Rosbif.jpg", imgPage: "https://fr.wikipedia.org/wiki/Rosbif",
    ing: [["roti_boeuf", 600, "g"], ["haricots_verts", 400, "g"], ["echalote", 2, "pc"], ["beurre", 30, "g"], ["ail", 2, "gousse"]],
    pantry: ["huile", "thym", "sel", "poivre"],
    steps: [
      "Sortez le rôti (600 g) du réfrigérateur 30 minutes avant. Préchauffez le four à 220 °C.",
      "Salez, poivrez le rôti. Dans une poêle très chaude avec 1 cuillère d'huile, saisissez-le 1 minute sur chaque face pour bien le colorer.",
      "Posez-le dans un plat avec 2 gousses d'ail en chemise et le thym. Enfournez 25 minutes pour une cuisson saignante (30 minutes à point). Laissez reposer 10 minutes sous une feuille d'aluminium avant de trancher.",
      "Équeutez 400 g de haricots verts, cuisez-les 8 minutes dans l'eau bouillante salée, égouttez.",
      "Faites-les sauter 2 minutes dans 30 g de beurre avec les 2 échalotes ciselées. Servez avec le rôti tranché et son jus. Les restes se mangent froids le lendemain."
    ] },

  { id: "gratin-chou-fleur", name: "Gratin de chou-fleur", cat: "vege", cui: "fr", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Cauliflower_cheese_side_dish.jpg/500px-Cauliflower_cheese_side_dish.jpg", imgPage: "https://en.wikipedia.org/wiki/Cauliflower_cheese",
    ing: [["chou_fleur", 1, "pc"], ["lait", 40, "cl"], ["beurre", 30, "g"], ["farine", 30, "g"], ["gruyere", 100, "g"]],
    pantry: ["muscade", "sel", "poivre"],
    steps: [
      "Détaillez le chou-fleur en bouquets, faites-les cuire 10 minutes dans l'eau bouillante salée. Égouttez très bien.",
      "Béchamel : faites fondre 30 g de beurre, ajoutez 30 g de farine, remuez 1 minute. Versez 40 cl de lait froid en fouettant, cuisez à feu doux jusqu'à épaississement. Muscade, sel, poivre.",
      "Préchauffez le four à 200 °C. Rangez le chou-fleur dans un plat à gratin beurré.",
      "Nappez de béchamel, parsemez de 100 g de gruyère râpé.",
      "Enfournez 20 minutes jusqu'à ce que le dessus soit doré et gratiné. Servez avec du pain ou une tranche de jambon de bœuf."
    ] },

  { id: "papillote", name: "Cabillaud en papillote, riz", cat: "poisson", cui: "fr", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Papillotes_de_Lyon.JPG/500px-Papillotes_de_Lyon.JPG", imgPage: "https://fr.wikipedia.org/wiki/Papillote",
    ing: [["cabillaud", 300, "g"], ["courgette", 1, "pc"], ["tomate", 2, "pc"], ["citron", 1, "pc"], ["riz", 150, "g"], ["echalote", 1, "pc"]],
    pantry: ["huile d'olive", "thym", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Faites cuire 150 g de riz.",
      "Coupez la courgette en fines rondelles, les 2 tomates en rondelles, ciselez l'échalote, coupez le citron en rondelles.",
      "Sur deux grandes feuilles de papier cuisson, disposez les rondelles de courgette, puis un morceau de cabillaud (150 g) salé et poivré, la tomate, l'échalote, 2 rondelles de citron, le thym et un filet d'huile d'olive.",
      "Refermez les papillotes hermétiquement en roulant les bords. Posez-les sur une plaque et enfournez 18 minutes.",
      "Ouvrez les papillotes à table (attention à la vapeur) et servez avec le riz."
    ] },

  { id: "lentilles-merguez", name: "Lentilles aux merguez", cat: "viande", cui: "fr", time: 45, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Merguez_grilled.jpg/500px-Merguez_grilled.jpg", imgPage: "https://fr.wikipedia.org/wiki/Merguez",
    ing: [["lentilles_vertes", 250, "g"], ["merguez", 4, "pc"], ["carotte", 2, "pc"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["bouillon", 1, "pc"]],
    pantry: ["laurier", "thym", "moutarde", "huile", "sel", "poivre"],
    steps: [
      "Hachez l'oignon et 2 gousses d'ail, coupez les 2 carottes en rondelles. Préparez 70 cl de bouillon avec le cube.",
      "Dans une cocotte, faites revenir l'oignon, l'ail et les carottes dans 1 cuillère d'huile 5 minutes.",
      "Rincez 250 g de lentilles vertes, ajoutez-les avec le bouillon, le laurier et le thym. Portez à ébullition puis laissez mijoter 30 minutes à couvert. Salez et poivrez en fin de cuisson seulement.",
      "Faites griller les 4 merguez à la poêle 8 minutes en les retournant, sans matière grasse.",
      "Ajoutez les merguez dans les lentilles 5 minutes. Servez avec de la moutarde."
    ] },

  { id: "tarte-tomate", name: "Tarte fine tomate–moutarde, salade", cat: "vege", cui: "fr", time: 35, slots: ["midi", "soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Pr%C3%A9paration_d%27une_tarte_%C3%A0_la_tomate_%2807%29_-_r%C3%A9sultat_%28gros_plan%29.jpg/500px-Pr%C3%A9paration_d%27une_tarte_%C3%A0_la_tomate_%2807%29_-_r%C3%A9sultat_%28gros_plan%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Tarte_%C3%A0_la_tomate",
    ing: [["pate_feuilletee", 1, "pc"], ["tomate", 4, "pc"], ["gruyere", 60, "g"], ["laitue", 1, "pc"]],
    pantry: ["moutarde", "thym", "huile d'olive", "vinaigre", "sel", "poivre"],
    steps: [
      "Préchauffez le four à 200 °C. Déroulez la pâte feuilletée sur une plaque avec son papier, piquez-la à la fourchette en laissant un bord de 1 cm.",
      "Tartinez le fond de 2 cuillères à soupe de moutarde, parsemez de 60 g de gruyère râpé.",
      "Coupez les 4 tomates en rondelles fines, épongez-les sur du papier absorbant pour qu'elles ne détrempent pas la pâte. Disposez-les en rosace en les chevauchant.",
      "Salez, poivrez, saupoudrez de thym et d'herbes de Provence, arrosez d'un filet d'huile d'olive.",
      "Enfournez 25 minutes jusqu'à ce que la pâte soit dorée et croustillante. Servez tiède avec la laitue en vinaigrette."
    ] },

  /* ---------- Légères et pauvres en cholestérol ---------- */
  { id: "wok-crevettes", name: "Wok de crevettes aux légumes croquants", cat: "poisson", cui: "cn", time: 20, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Making_Stir-Fry_%283286445383%29.jpg/500px-Making_Stir-Fry_%283286445383%29.jpg", imgPage: "https://en.wikipedia.org/wiki/Stir_frying",
    ing: [["crevettes", 250, "g"], ["brocoli", 1, "pc"], ["poivron", 1, "pc"], ["carotte", 1, "pc"], ["ail", 2, "gousse"], ["gingembre", 15, "g"], ["sauce_soja", 3, "cs"], ["citron_vert", 1, "pc"], ["riz", 150, "g"]],
    pantry: ["huile", "poivre"],
    steps: ["Faites cuire 150 g de riz. Détaillez le brocoli en petits bouquets, le poivron en lanières, la carotte en bâtonnets fins. Hachez 2 gousses d'ail, râpez 15 g de gingembre.",
      "Dans un wok très chaud avec 1 cuillère d'huile, faites sauter le brocoli et la carotte 3 minutes, puis le poivron 2 minutes. Les légumes doivent rester croquants.",
      "Poussez les légumes sur le côté, ajoutez l'ail, le gingembre et 250 g de crevettes. Saisissez 2 minutes jusqu'à ce qu'elles soient roses.",
      "Versez 3 cuillères de sauce soja et le jus du citron vert, mélangez 30 secondes à feu vif. Poivrez.",
      "Servez aussitôt sur le riz."] },

  { id: "salade-lentilles", name: "Salade de lentilles, tomates et herbes", cat: "salade", cui: "fr", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["lentilles_vertes", 200, "g"], ["tomate", 3, "pc"], ["oignon_rouge", 1, "pc"], ["concombre", 1, "pc"], ["persil", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "moutarde", "cumin", "sel", "poivre"],
    steps: ["Rincez 200 g de lentilles vertes, couvrez-les de 3 fois leur volume d'eau froide et faites-les cuire 25 minutes à petits bouillons : elles doivent être tendres mais entières. Salez en fin de cuisson, égouttez.",
      "Pendant ce temps, coupez les 3 tomates en dés, un demi-concombre en petits dés, l'oignon rouge en fines lamelles. Ciselez le persil.",
      "Sauce : 1 cuillère à café de moutarde, le jus du citron, 3 cuillères d'huile d'olive, 1 cuillère à café de cumin, sel, poivre.",
      "Mélangez les lentilles encore tièdes avec la sauce, puis les légumes et le persil.",
      "Servez tiède ou froid. Se garde 2 jours au frais et se transporte bien."] },

  { id: "soupe-verte", name: "Soupe verte courgette, poireau et épinards", cat: "soupe", cui: "fr", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Vegetable_udon_noodle_soup.jpg/500px-Vegetable_udon_noodle_soup.jpg", imgPage: "https://en.wikipedia.org/wiki/Vegetable_soup",
    ing: [["courgette", 2, "pc"], ["poireau", 1, "pc"], ["epinards", 150, "g"], ["pdt", 200, "g"], ["oignon", 1, "pc"], ["bouillon", 1, "pc"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: ["Émincez l'oignon et le poireau (bien lavé). Coupez les 2 courgettes et 200 g de pommes de terre en cubes.",
      "Dans une casserole, faites suer l'oignon et le poireau 4 minutes dans 1 cuillère d'huile d'olive.",
      "Ajoutez les courgettes, les pommes de terre, 80 cl d'eau et le cube de bouillon. Portez à ébullition, couvrez et laissez cuire 18 minutes.",
      "Ajoutez 150 g d'épinards, laissez-les tomber 2 minutes, puis mixez finement. Un trait de citron, sel, poivre.",
      "Servez avec un filet d'huile d'olive crue et du pain grillé."] },

  { id: "cabillaud-vapeur-vierge", name: "Cabillaud vapeur, sauce vierge, riz", cat: "poisson", cui: "fr", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["cabillaud", 300, "g"], ["tomate", 2, "pc"], ["citron", 1, "pc"], ["basilic", 1, "botte"], ["echalote", 1, "pc"], ["riz", 150, "g"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: ["Faites cuire 150 g de riz dans l'eau bouillante salée.",
      "Sauce vierge : coupez les 2 tomates en petits dés (retirez les graines), ciselez l'échalote et le basilic. Mélangez avec 3 cuillères d'huile d'olive, le jus du citron, sel et poivre. Laissez reposer.",
      "Salez et poivrez les 2 morceaux de cabillaud. Faites-les cuire 8 minutes à la vapeur (panier vapeur au-dessus d'une casserole d'eau frémissante, couvert). La chair doit se détacher en feuillets.",
      "Dressez le riz, posez le poisson dessus et nappez généreusement de sauce vierge à température ambiante."] },

  { id: "poulet-citron-herbes", name: "Poulet grillé au citron et aux herbes, haricots verts", cat: "volaille", cui: "fr", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["poulet_blanc", 300, "g"], ["citron", 1, "pc"], ["ail", 2, "gousse"], ["persil", 1, "botte"], ["haricots_verts", 400, "g"]],
    pantry: ["huile d'olive", "thym", "sel", "poivre"],
    steps: ["Coupez 300 g de blanc de poulet en 2 escalopes fines. Mélangez le jus d'un demi-citron, 1 cuillère d'huile d'olive, 2 gousses d'ail pressées, du thym, sel et poivre. Enrobez le poulet et laissez mariner 10 minutes.",
      "Équeutez 400 g de haricots verts, faites-les cuire 8 minutes dans l'eau bouillante salée, égouttez.",
      "Faites griller le poulet 4 minutes par face sur une poêle-gril bien chaude (ou une poêle antiadhésive), sans ajouter de matière grasse.",
      "Mélangez les haricots avec le persil ciselé, le zeste du citron et une cuillère d'huile d'olive.",
      "Servez le poulet tranché avec les haricots et le reste du citron en quartiers."] },

  { id: "salade-pois-chiches", name: "Salade de pois chiches, concombre et menthe", cat: "vege", cui: "med", time: 15, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Hummus_salad.jpg/500px-Hummus_salad.jpg", imgPage: "https://en.wikipedia.org/wiki/Chickpea_salad",
    ing: [["pois_chiches", 1, "boite"], ["concombre", 1, "pc"], ["tomates_cerises", 200, "g"], ["oignon_rouge", 1, "pc"], ["menthe", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "cumin", "sel", "poivre"],
    steps: ["Égouttez et rincez les pois chiches.",
      "Coupez le concombre en petits dés, les tomates cerises en deux, l'oignon rouge en fines lamelles. Ciselez la menthe.",
      "Sauce : le jus du citron, 3 cuillères d'huile d'olive, 1 cuillère à café de cumin, sel, poivre.",
      "Mélangez tout dans un saladier et laissez reposer 5 minutes pour que les saveurs se mêlent.",
      "Servez frais, éventuellement avec un pain pita grillé."] },

  { id: "dinde-poivrons", name: "Émincé de dinde aux poivrons, riz", cat: "volaille", cui: "fr", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["dinde", 300, "g"], ["poivron", 2, "pc"], ["oignon", 1, "pc"], ["ail", 1, "gousse"], ["riz", 150, "g"], ["persil", 1, "botte"]],
    pantry: ["huile d'olive", "paprika", "sel", "poivre"],
    steps: ["Faites cuire 150 g de riz. Coupez 300 g d'escalopes de dinde en lanières, les 2 poivrons en lanières, émincez l'oignon, hachez l'ail.",
      "Dans une poêle avec 1 cuillère d'huile d'olive, faites sauter les poivrons et l'oignon 6 minutes à feu vif. Réservez.",
      "Saisissez la dinde 4 minutes avec l'ail et 1 cuillère à café de paprika, sel, poivre.",
      "Remettez les légumes, ajoutez 5 cl d'eau et laissez mijoter 3 minutes. Persil ciselé.",
      "Servez avec le riz."] },

  { id: "veloute-carottes", name: "Velouté de carottes au cumin", cat: "soupe", cui: "fr", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Carrot_soup.jpg/500px-Carrot_soup.jpg", imgPage: "https://en.wikipedia.org/wiki/Carrot_soup",
    ing: [["carotte", 6, "pc"], ["oignon", 1, "pc"], ["pdt", 150, "g"], ["bouillon", 1, "pc"], ["coriandre", 1, "botte"], ["citron", 1, "pc"]],
    pantry: ["cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Épluchez les 6 carottes et 150 g de pommes de terre, coupez-les en rondelles. Émincez l'oignon.",
      "Faites suer l'oignon 3 minutes dans 1 cuillère d'huile d'olive avec 1 cuillère à café de cumin.",
      "Ajoutez les carottes, les pommes de terre, 80 cl d'eau et le cube de bouillon. Couvrez, laissez cuire 22 minutes.",
      "Mixez finement, ajustez avec un peu d'eau si besoin, sel, poivre, un trait de citron.",
      "Servez parsemé de coriandre ciselée."] },

  { id: "truite-four-tomates", name: "Truite au four aux tomates et au thym, pommes vapeur", cat: "poisson", cui: "fr", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["truite", 2, "pc"], ["tomate", 3, "pc"], ["citron", 1, "pc"], ["ail", 2, "gousse"], ["pdt", 400, "g"]],
    pantry: ["thym", "huile d'olive", "sel", "poivre"],
    steps: ["Préchauffez le four à 200 °C. Épluchez 400 g de pommes de terre, coupez-les en morceaux et faites-les cuire 20 minutes à la vapeur.",
      "Posez les 2 truites vidées dans un plat. Salez, poivrez l'intérieur, glissez-y une rondelle de citron, une demi-gousse d'ail et du thym.",
      "Entourez de rondelles de tomate, ajoutez le reste d'ail émincé, le thym, 1 cuillère d'huile d'olive et le jus du reste de citron.",
      "Enfournez 18 minutes : la chair doit se détacher facilement de l'arête.",
      "Servez avec les pommes vapeur et le jus du plat."] },

  { id: "haricots-blancs-epinards", name: "Ragoût de haricots blancs, tomates et épinards", cat: "vege", cui: "med", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    ing: [["haricots_blancs", 2, "boite"], ["tomates_concassees", 1, "boite"], ["epinards", 200, "g"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["pain", 4, "tranche"]],
    pantry: ["huile d'olive", "paprika", "origan", "sel", "poivre"],
    steps: ["Hachez l'oignon et 2 gousses d'ail. Faites-les revenir 4 minutes dans 2 cuillères d'huile d'olive.",
      "Ajoutez 1 cuillère à café de paprika et 1 d'origan, puis la boîte de tomates concassées. Laissez mijoter 8 minutes.",
      "Ajoutez les 2 boîtes de haricots blancs égouttés et rincés, 10 cl d'eau, sel, poivre. Poursuivez 8 minutes.",
      "Ajoutez 200 g d'épinards par poignées et laissez-les tomber 2 minutes.",
      "Servez avec du pain de campagne grillé et un filet d'huile d'olive."] },

  { id: "salade-poulet-avocat", name: "Salade de poulet à l'avocat et au citron vert", cat: "salade", cui: "mx", time: 20, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Chicken_Salad_Chick_Classic_Carol_scoop%2C_Jan_2020.jpg/500px-Chicken_Salad_Chick_Classic_Carol_scoop%2C_Jan_2020.jpg", imgPage: "https://en.wikipedia.org/wiki/Chicken_salad",
    ing: [["poulet_blanc", 250, "g"], ["avocat", 1, "pc"], ["laitue", 1, "pc"], ["tomates_cerises", 150, "g"], ["oignon_rouge", 1, "pc"], ["citron_vert", 1, "pc"], ["coriandre", 1, "botte"]],
    pantry: ["huile d'olive", "cumin", "sel", "poivre"],
    steps: ["Coupez 250 g de blanc de poulet en lanières, salez, poivrez, saupoudrez de cumin. Faites-les griller 8 minutes dans une poêle antiadhésive avec 1 cuillère d'huile d'olive. Laissez tiédir.",
      "Coupez la laitue en lanières, les tomates cerises en deux, l'oignon rouge en fines lamelles, l'avocat en dés.",
      "Sauce : le jus du citron vert, 2 cuillères d'huile d'olive, sel, poivre.",
      "Réunissez tout dans un saladier avec la coriandre ciselée, versez la sauce, mélangez délicatement."] },

  { id: "brochettes-dinde-yaourt", name: "Brochettes de dinde au yaourt et citron, salade", cat: "volaille", cui: "med", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/PinchosAmericanos.jpg/500px-PinchosAmericanos.jpg", imgPage: "https://fr.wikipedia.org/wiki/Brochette",
    ing: [["dinde", 300, "g"], ["yaourt", 1, "pot"], ["citron", 1, "pc"], ["ail", 2, "gousse"], ["laitue", 1, "pc"], ["tomate", 2, "pc"], ["concombre", 1, "pc"]],
    pantry: ["paprika", "cumin", "origan", "huile d'olive", "sel", "poivre"],
    steps: ["Coupez 300 g d'escalopes de dinde en cubes. Mélangez le yaourt, le jus d'un demi-citron, 2 gousses d'ail pressées, 1 cuillère à café de paprika, 1 de cumin, 1 d'origan, sel et poivre. Enrobez la dinde, laissez mariner 10 minutes.",
      "Préparez la salade : laitue, 2 tomates en quartiers, un demi-concombre en rondelles, un filet d'huile d'olive et le reste du citron.",
      "Enfilez la dinde sur des piques. Faites griller 4 minutes par face sur une poêle-gril chaude : la marinade au yaourt forme une croûte dorée.",
      "Servez les brochettes sur la salade."] },

  { id: "cabillaud-herbes-patate-douce", name: "Cabillaud en croûte d'herbes, patate douce rôtie", cat: "poisson", cui: "fr", time: 35, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["cabillaud", 300, "g"], ["patate_douce", 2, "pc"], ["persil", 1, "botte"], ["ail", 1, "gousse"], ["citron", 1, "pc"], ["chapelure", 30, "g"]],
    pantry: ["huile d'olive", "paprika", "sel", "poivre"],
    steps: ["Préchauffez le four à 200 °C. Épluchez les 2 patates douces, coupez-les en quartiers, mélangez avec 1 cuillère d'huile d'olive, du paprika et du sel. Enfournez 25 minutes.",
      "Mixez ou hachez finement le persil avec la gousse d'ail, 30 g de chapelure, le zeste du citron, 1 cuillère d'huile d'olive, sel, poivre.",
      "Posez les 2 morceaux de cabillaud sur une plaque, pressez la croûte d'herbes sur le dessus.",
      "Enfournez 12 minutes à côté des patates douces (ajoutez le poisson quand il reste 12 minutes de cuisson aux patates).",
      "Servez avec le jus du citron."] },

  { id: "salade-crevettes-avocat", name: "Salade de crevettes, avocat et concombre", cat: "salade", cui: "fr", time: 15, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Cocktail_1_bg_060702.jpg/500px-Cocktail_1_bg_060702.jpg", imgPage: "https://en.wikipedia.org/wiki/Prawn_cocktail",
    ing: [["crevettes", 200, "g"], ["avocat", 1, "pc"], ["concombre", 1, "pc"], ["laitue", 1, "pc"], ["citron_vert", 1, "pc"], ["aneth", 1, "botte"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: ["Coupez le concombre en demi-rondelles, l'avocat en dés, la laitue en lanières. Ciselez l'aneth.",
      "Sauce : le jus du citron vert, 2 cuillères d'huile d'olive, sel, poivre.",
      "Mélangez les crevettes décortiquées (cuites) avec les légumes, l'aneth et la sauce.",
      "Servez aussitôt, bien frais."] },

  { id: "chou-fleur-roti-pois-chiches", name: "Chou-fleur rôti au curcuma, pois chiches et yaourt", cat: "vege", cui: "med", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["chou_fleur", 1, "pc"], ["pois_chiches", 1, "boite"], ["yaourt", 1, "pot"], ["citron", 1, "pc"], ["ail", 1, "gousse"], ["coriandre", 1, "botte"], ["pita", 2, "pc"]],
    pantry: ["curcuma", "cumin", "paprika", "huile d'olive", "sel", "poivre"],
    steps: ["Préchauffez le four à 210 °C. Détaillez le chou-fleur en bouquets. Égouttez et séchez les pois chiches.",
      "Sur une plaque, mélangez-les avec 2 cuillères d'huile d'olive, 1 cuillère à café de curcuma, 1 de cumin, 1 de paprika, sel et poivre.",
      "Enfournez 30 minutes en remuant à mi-cuisson : le chou-fleur doit être doré sur les bords et les pois chiches croustillants.",
      "Sauce : mélangez le yaourt avec le jus d'un demi-citron, la gousse d'ail pressée et une pincée de sel.",
      "Servez avec la sauce au yaourt, la coriandre ciselée, le reste du citron et les pains pita tièdes."] },

  { id: "dinde-legumes-rotis", name: "Filet de dinde au four, légumes rôtis", cat: "volaille", cui: "fr", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["dinde", 300, "g"], ["courgette", 1, "pc"], ["poivron", 1, "pc"], ["oignon_rouge", 1, "pc"], ["tomates_cerises", 200, "g"], ["pdt", 400, "g"]],
    pantry: ["herbes de Provence", "huile d'olive", "sel", "poivre"],
    steps: ["Préchauffez le four à 200 °C. Coupez 400 g de pommes de terre en petits quartiers, la courgette en demi-rondelles, le poivron en lanières, l'oignon rouge en quartiers.",
      "Étalez les légumes sur une plaque, arrosez de 2 cuillères d'huile d'olive, herbes de Provence, sel, poivre. Enfournez 25 minutes.",
      "Salez et poivrez les escalopes de dinde. Posez-les sur les légumes avec les tomates cerises et remettez au four 12 minutes.",
      "Servez avec le jus de la plaque."] },

  /* ---------- Japonaises ---------- */
  { id: "oyakodon", name: "Oyakodon (bol de riz au poulet et à l'œuf)", cat: "volaille", cui: "jp", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Oyakodon_003.jpg/500px-Oyakodon_003.jpg", imgPage: "https://fr.wikipedia.org/wiki/Oyakodon",
    ing: [["poulet_haut", 3, "pc"], ["oignon", 1, "pc"], ["oeuf", 4, "pc"], ["sauce_soja", 4, "cs"], ["bouillon", 1, "pc"], ["oignon_nouveau", 2, "pc"], ["riz", 150, "g"]],
    pantry: ["sucre", "vinaigre de riz"],
    steps: ["Faites cuire 150 g de riz. Désossez les hauts de cuisse et coupez-les en morceaux de 2 cm. Émincez l'oignon, ciselez les oignons nouveaux.",
      "Dans une petite poêle, portez à frémissement 15 cl de bouillon avec 4 cuillères de sauce soja, 1 cuillère à soupe de sucre et 1 cuillère de vinaigre de riz.",
      "Ajoutez l'oignon, 3 minutes, puis le poulet. Laissez mijoter 8 minutes à couvert jusqu'à ce qu'il soit cuit.",
      "Battez légèrement 4 œufs (juste pour mélanger blancs et jaunes). Versez-les en spirale sur le poulet, couvrez 1 à 2 minutes : l'œuf doit être juste pris, encore crémeux.",
      "Faites glisser le tout sur le riz dans deux bols, parsemez d'oignons nouveaux."] },

  { id: "yakitori", name: "Yakitori de poulet, riz et concombre au sésame", cat: "volaille", cui: "jp", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Cooking_yakitori.jpg/500px-Cooking_yakitori.jpg", imgPage: "https://fr.wikipedia.org/wiki/Yakitori",
    ing: [["poulet_blanc", 350, "g"], ["oignon_nouveau", 4, "pc"], ["sauce_soja", 4, "cs"], ["miel", 2, "cs"], ["gingembre", 15, "g"], ["concombre", 1, "pc"], ["sesame", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["vinaigre de riz", "sucre", "huile", "sel"],
    steps: ["Faites cuire 150 g de riz. Sauce : faites réduire 3 minutes à feu doux 4 cuillères de sauce soja, 2 de miel, 2 d'eau, 1 de vinaigre de riz et le gingembre râpé, jusqu'à consistance sirupeuse.",
      "Coupez le poulet en cubes de 3 cm et les blancs des oignons nouveaux en tronçons de 3 cm. Enfilez-les en alternance sur des piques (trempées 10 minutes si elles sont en bois).",
      "Concombre : coupez-le en fines rondelles, salez, laissez dégorger 5 minutes, pressez, ajoutez 1 cuillère de vinaigre de riz, une pincée de sucre et le sésame.",
      "Faites griller les brochettes 3 minutes par face sur une poêle-gril huilée, puis badigeonnez de sauce et laissez laquer 1 minute de chaque côté.",
      "Servez sur le riz avec le concombre et le reste de sauce."] },

  { id: "soba-sesame", name: "Nouilles soba froides au sésame et légumes croquants", cat: "vege", cui: "jp", time: 20, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Seiro_soba_at_Takasho_in_Nezu%2C_Tokyo.jpg/500px-Seiro_soba_at_Takasho_in_Nezu%2C_Tokyo.jpg", imgPage: "https://fr.wikipedia.org/wiki/Soba",
    ing: [["nouilles_soba", 200, "g"], ["concombre", 1, "pc"], ["carotte", 1, "pc"], ["oignon_nouveau", 2, "pc"], ["tahini", 2, "cs"], ["sauce_soja", 3, "cs"], ["miel", 1, "cs"], ["sesame", 1, "cs"], ["citron_vert", 1, "pc"]],
    pantry: ["vinaigre de riz", "huile de sésame (facultatif)"],
    steps: ["Faites cuire 200 g de soba selon le paquet (4 à 5 minutes), égouttez et rincez longuement à l'eau froide en frottant pour retirer l'amidon. Égouttez bien.",
      "Sauce : fouettez 2 cuillères de tahini, 3 de sauce soja, 1 de miel, 1 de vinaigre de riz, le jus du citron vert et 3 cuillères d'eau jusqu'à obtenir une sauce lisse.",
      "Coupez le concombre et la carotte en julienne fine, émincez les oignons nouveaux.",
      "Mélangez les nouilles avec la sauce, ajoutez les légumes et le sésame. Servez frais."] },

  { id: "curry-japonais", name: "Curry japonais au poulet et aux légumes", cat: "volaille", cui: "jp", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Beef_curry_rice_003.jpg/500px-Beef_curry_rice_003.jpg", imgPage: "https://fr.wikipedia.org/wiki/Curry_japonais",
    ing: [["poulet_blanc", 300, "g"], ["pdt", 300, "g"], ["carotte", 2, "pc"], ["oignon", 2, "pc"], ["ail", 2, "gousse"], ["gingembre", 10, "g"], ["farine", 30, "g"], ["bouillon", 1, "pc"], ["sauce_soja", 1, "cs"], ["miel", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["curry", "garam masala", "huile", "ketchup", "sel", "poivre"],
    steps: ["Faites cuire 150 g de riz. Émincez les 2 oignons, coupez les carottes en rondelles épaisses, 300 g de pommes de terre en gros cubes et le poulet en morceaux.",
      "Dans une cocotte, faites fondre les oignons 8 minutes dans 1 cuillère d'huile jusqu'à ce qu'ils soient dorés. Ajoutez l'ail et le gingembre hachés, puis le poulet, 3 minutes.",
      "Saupoudrez de 30 g de farine, 1 cuillère à soupe de curry et 1 cuillère à café de garam masala, remuez 1 minute. Versez 60 cl de bouillon en mélangeant.",
      "Ajoutez carottes et pommes de terre, couvrez, mijotez 20 minutes. Terminez avec 1 cuillère de sauce soja, 1 de miel et 1 de ketchup : la sauce doit être épaisse et brillante.",
      "Servez sur le riz."] },

  { id: "soupe-miso-udon", name: "Soupe miso aux nouilles udon, champignons et épinards", cat: "soupe", cui: "jp", time: 20, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Kakeudon.jpg/500px-Kakeudon.jpg", imgPage: "https://fr.wikipedia.org/wiki/Udon",
    ing: [["udon", 300, "g"], ["miso", 3, "cs"], ["champignons", 200, "g"], ["epinards", 100, "g"], ["oignon_nouveau", 3, "pc"], ["gingembre", 10, "g"], ["bouillon", 1, "pc"], ["sauce_soja", 1, "cs"]],
    pantry: ["sésame", "huile de sésame (facultatif)"],
    steps: ["Portez 1 litre d'eau à ébullition avec le cube de bouillon et le gingembre en fines lamelles. Émincez les champignons, les oignons nouveaux ; lavez les épinards.",
      "Ajoutez les champignons dans le bouillon, 4 minutes, puis les nouilles udon (3 minutes pour des udon précuits, selon le paquet sinon) et les épinards 1 minute.",
      "Hors du feu, délayez 3 cuillères de miso dans une louche de bouillon puis reversez dans la casserole (le miso ne doit pas bouillir). Ajoutez 1 cuillère de sauce soja.",
      "Servez dans de grands bols avec les oignons nouveaux, du sésame et quelques gouttes d'huile de sésame."] },

  { id: "katsu-poulet", name: "Katsu de poulet, chou émincé et riz", cat: "volaille", cui: "jp", time: 30, slots: ["soir"],
    ing: [["poulet_blanc", 300, "g"], ["chapelure", 80, "g"], ["farine", 30, "g"], ["oeuf", 1, "pc"], ["chou_vert", 1, "pc"], ["citron", 1, "pc"], ["sauce_soja", 2, "cs"], ["riz", 150, "g"]],
    pantry: ["ketchup", "sucre", "huile", "sel", "poivre"],
    steps: ["Faites cuire 150 g de riz. Émincez un quart de chou vert très finement, laissez-le tremper 10 minutes dans l'eau froide, égouttez : il sera croquant.",
      "Sauce tonkatsu maison : mélangez 3 cuillères de ketchup, 2 de sauce soja et 1 cuillère à café de sucre.",
      "Aplatissez les blancs en 2 escalopes de 1 cm, salez, poivrez. Panez : farine, œuf battu, chapelure en pressant bien.",
      "Faites frire dans 1 cm d'huile chaude 3 à 4 minutes par face jusqu'à ce que la panure soit bien dorée. Égouttez sur du papier absorbant, coupez en lanières.",
      "Servez avec le chou, le riz, la sauce et un quartier de citron."] },

  { id: "gyudon", name: "Gyudon (bol de riz au bœuf et aux oignons)", cat: "viande", cui: "jp", time: 20, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Gyuu-don_003.jpg/500px-Gyuu-don_003.jpg", imgPage: "https://fr.wikipedia.org/wiki/Gy%C5%ABdon",
    ing: [["boeuf_saute", 300, "g"], ["oignon", 2, "pc"], ["sauce_soja", 4, "cs"], ["gingembre", 15, "g"], ["bouillon", 1, "pc"], ["oignon_nouveau", 2, "pc"], ["riz", 150, "g"]],
    pantry: ["sucre", "vinaigre de riz"],
    steps: ["Faites cuire 150 g de riz. Émincez les 2 oignons, coupez le bœuf en tranches très fines, râpez le gingembre.",
      "Dans une poêle, portez à frémissement 20 cl de bouillon avec 4 cuillères de sauce soja, 1 cuillère à soupe de sucre, 1 de vinaigre de riz et le gingembre.",
      "Ajoutez les oignons, laissez-les fondre 6 minutes à couvert.",
      "Ajoutez le bœuf en le séparant, 2 à 3 minutes : il doit juste changer de couleur.",
      "Versez sur le riz avec un peu de bouillon, parsemez d'oignons nouveaux."] },

  /* ---------- Chinoises ---------- */
  { id: "poulet-cajou", name: "Poulet sauté aux noix de cajou", cat: "volaille", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Cashewchickenphoto.jpg/500px-Cashewchickenphoto.jpg", imgPage: "https://en.wikipedia.org/wiki/Cashew_chicken",
    ing: [["poulet_blanc", 300, "g"], ["cajou", 60, "g"], ["poivron", 1, "pc"], ["oignon_nouveau", 3, "pc"], ["ail", 2, "gousse"], ["gingembre", 15, "g"], ["sauce_soja", 3, "cs"], ["miel", 1, "cs"], ["farine", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["vinaigre de riz", "huile", "poivre"],
    steps: ["Faites cuire 150 g de riz. Coupez le poulet en dés, enrobez-les de 1 cuillère de farine et 1 de sauce soja. Coupez le poivron en dés, émincez les oignons nouveaux, hachez l'ail et le gingembre.",
      "Faites griller 60 g de noix de cajou à sec dans le wok 2 minutes, réservez.",
      "Dans le wok très chaud avec 1 cuillère d'huile, saisissez le poulet 4 minutes, réservez. Faites sauter le poivron 2 minutes, puis l'ail et le gingembre 30 secondes.",
      "Remettez le poulet, ajoutez 2 cuillères de sauce soja, 1 de miel, 1 de vinaigre de riz et 3 d'eau. Mélangez 1 minute pour que la sauce nappe.",
      "Ajoutez les noix de cajou et les oignons nouveaux. Servez sur le riz."] },

  { id: "boeuf-brocoli", name: "Bœuf au brocoli, sauce soja-gingembre", cat: "viande", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Beef_and_broccoli_stir_fry.jpg/500px-Beef_and_broccoli_stir_fry.jpg", imgPage: "https://en.wikipedia.org/wiki/Beef_and_broccoli",
    ing: [["boeuf_saute", 300, "g"], ["brocoli", 1, "pc"], ["ail", 2, "gousse"], ["gingembre", 20, "g"], ["sauce_soja", 4, "cs"], ["farine", 1, "cs"], ["riz", 150, "g"], ["sesame", 1, "cs"]],
    pantry: ["sucre", "huile", "poivre"],
    steps: ["Faites cuire 150 g de riz. Coupez le bœuf en lanières fines, mélangez-le avec 1 cuillère de sauce soja et 1 de farine. Détaillez le brocoli en bouquets, hachez l'ail, râpez le gingembre.",
      "Faites blanchir le brocoli 2 minutes dans l'eau bouillante, égouttez.",
      "Dans un wok très chaud avec 1 cuillère d'huile, saisissez le bœuf 2 minutes en remuant, réservez.",
      "Faites sauter l'ail et le gingembre 30 secondes, ajoutez le brocoli, 3 cuillères de sauce soja, 1 cuillère à café de sucre et 5 cl d'eau. 2 minutes.",
      "Remettez le bœuf, mélangez 1 minute. Sésame, poivre, sur le riz."] },

  { id: "chow-mein", name: "Nouilles sautées aux légumes (chow mein)", cat: "vege", cui: "cn", time: 20, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Chow_mein_1_by_yuen.jpg/500px-Chow_mein_1_by_yuen.jpg", imgPage: "https://fr.wikipedia.org/wiki/Chow_mein",
    ing: [["nouilles_chinoises", 200, "g"], ["chou_vert", 1, "pc"], ["carotte", 1, "pc"], ["poivron", 1, "pc"], ["germes_soja", 100, "g"], ["oignon_nouveau", 3, "pc"], ["ail", 2, "gousse"], ["sauce_soja", 3, "cs"], ["sesame", 1, "cs"]],
    pantry: ["huile", "vinaigre de riz", "sucre", "poivre"],
    steps: ["Faites cuire 200 g de nouilles chinoises selon le paquet, égouttez, rincez et mélangez avec quelques gouttes d'huile pour qu'elles ne collent pas.",
      "Émincez finement un quart de chou, la carotte en bâtonnets, le poivron en lanières, les oignons nouveaux ; hachez l'ail.",
      "Dans un wok très chaud avec 1 cuillère d'huile, faites sauter carotte et chou 3 minutes, poivron 2 minutes, ail 30 secondes.",
      "Ajoutez les nouilles, 3 cuillères de sauce soja, 1 de vinaigre de riz, une pincée de sucre. Sautez 2 minutes à feu vif en mélangeant.",
      "Germes de soja et oignons nouveaux 30 secondes. Sésame, poivre, servez."] },

  { id: "kung-pao", name: "Poulet kung pao aux cacahuètes", cat: "volaille", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Kung-pao-shanghai.jpg/500px-Kung-pao-shanghai.jpg", imgPage: "https://fr.wikipedia.org/wiki/Poulet_imp%C3%A9rial",
    ing: [["poulet_blanc", 300, "g"], ["cacahuetes", 50, "g"], ["poivron", 1, "pc"], ["oignon_nouveau", 3, "pc"], ["ail", 3, "gousse"], ["gingembre", 15, "g"], ["sauce_soja", 3, "cs"], ["farine", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["vinaigre de riz", "sucre", "piment (flocons)", "huile"],
    steps: ["Faites cuire 150 g de riz. Coupez le poulet en dés, mélangez avec 1 cuillère de sauce soja et 1 de farine. Poivron en dés, oignons nouveaux en tronçons, ail et gingembre hachés.",
      "Sauce : 2 cuillères de sauce soja, 1 de vinaigre de riz, 1 cuillère à café de sucre, 4 cuillères d'eau.",
      "Faites griller les cacahuètes à sec dans le wok 2 minutes, réservez.",
      "Dans le wok très chaud avec 1 cuillère d'huile, saisissez le poulet 4 minutes, réservez. Faites revenir une pincée de piment, l'ail, le gingembre 30 secondes, puis le poivron 2 minutes.",
      "Remettez le poulet, versez la sauce, 1 minute. Cacahuètes et oignons nouveaux. Servez sur le riz."] },

  { id: "soupe-poulet-mais", name: "Soupe chinoise au poulet et au maïs", cat: "soupe", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Corn_soup.jpg/500px-Corn_soup.jpg", imgPage: "https://en.wikipedia.org/wiki/Corn_soup",
    ing: [["poulet_blanc", 200, "g"], ["mais", 2, "boite"], ["oeuf", 1, "pc"], ["oignon_nouveau", 3, "pc"], ["gingembre", 15, "g"], ["bouillon", 2, "pc"], ["farine", 2, "cs"], ["sauce_soja", 1, "cs"]],
    pantry: ["huile de sésame (facultatif)", "poivre"],
    steps: ["Portez 1 litre d'eau à ébullition avec les 2 cubes de bouillon et le gingembre râpé. Ajoutez le poulet entier, laissez frémir 12 minutes, retirez-le et effilochez-le à la fourchette.",
      "Mixez grossièrement une boîte de maïs égoutté, gardez l'autre entière. Versez les deux dans le bouillon avec le poulet effiloché, 3 minutes.",
      "Délayez 2 cuillères de farine dans un verre d'eau froide, versez en filet en remuant, laissez épaissir 2 minutes. Sauce soja, poivre.",
      "Battez l'œuf et versez-le en filet dans la soupe en tournant avec une fourchette : il forme des rubans.",
      "Servez avec les oignons nouveaux ciselés et quelques gouttes d'huile de sésame."] },

  { id: "aubergines-ail-soja", name: "Aubergines sautées à l'ail et à la sauce soja, riz", cat: "vege", cui: "cn", time: 30, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["aubergine", 2, "pc"], ["ail", 4, "gousse"], ["gingembre", 15, "g"], ["oignon_nouveau", 3, "pc"], ["sauce_soja", 3, "cs"], ["miel", 1, "cs"], ["farine", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["vinaigre de riz", "huile", "piment (flocons)"],
    steps: ["Faites cuire 150 g de riz. Coupez les aubergines en bâtonnets de 5 cm, salez-les et laissez dégorger 10 minutes, épongez.",
      "Sauce : 3 cuillères de sauce soja, 1 de miel, 1 de vinaigre de riz, 1 de farine délayée dans 8 cl d'eau.",
      "Dans un wok bien chaud avec 2 cuillères d'huile, faites sauter les aubergines 8 minutes jusqu'à ce qu'elles soient dorées et fondantes. Réservez.",
      "Faites revenir l'ail et le gingembre hachés avec une pincée de piment 30 secondes, versez la sauce, laissez épaissir 1 minute.",
      "Remettez les aubergines, enrobez, ajoutez les oignons nouveaux. Servez sur le riz."] },

  { id: "mapo-tofu", name: "Mapo tofu au bœuf", cat: "vege", cui: "cn", time: 25, slots: ["midi", "soir"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Mapodoufu.jpg/500px-Mapodoufu.jpg", imgPage: "https://fr.wikipedia.org/wiki/Mapo_doufu",
    ing: [["tofu", 400, "g"], ["boeuf_hache", 150, "g"], ["ail", 3, "gousse"], ["gingembre", 15, "g"], ["oignon_nouveau", 3, "pc"], ["sauce_soja", 2, "cs"], ["bouillon", 1, "pc"], ["farine", 1, "cs"], ["riz", 150, "g"]],
    pantry: ["sauce pimentée (sriracha ou pâte de piment)", "huile", "poivre", "sucre"],
    steps: ["Faites cuire 150 g de riz. Coupez le tofu en cubes de 2 cm et plongez-le 2 minutes dans l'eau frémissante salée, égouttez délicatement.",
      "Dans un wok avec 1 cuillère d'huile, faites revenir 150 g de bœuf haché 3 minutes en l'émiettant. Ajoutez l'ail, le gingembre hachés et 1 à 2 cuillères de sauce pimentée, 1 minute.",
      "Versez 20 cl de bouillon, 2 cuillères de sauce soja, une pincée de sucre. Ajoutez le tofu, laissez mijoter 5 minutes sans trop remuer.",
      "Délayez 1 cuillère de farine dans un peu d'eau, versez, laissez épaissir 1 minute. Poivrez généreusement.",
      "Oignons nouveaux ciselés, servez sur le riz."] },

  /* ---------- Libanaises ---------- */
  { id: "kafta-libanaise", name: "Kafta libanaise grillée, riz aux vermicelles", cat: "viande", cui: "lb", time: 30, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Sultanahmet_K%C3%B6ftesi.jpg/500px-Sultanahmet_K%C3%B6ftesi.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kefta",
    ing: [["boeuf_hache", 400, "g"], ["oignon", 1, "pc"], ["persil", 1, "botte"], ["riz", 150, "g"], ["vermicelles", 40, "g"], ["tomate", 3, "pc"], ["yaourt", 1, "pot"]],
    pantry: ["sept-épices libanais (ou cannelle + quatre-épices)", "cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Riz aux vermicelles : faites dorer 40 g de vermicelles dans 1 cuillère d'huile, ajoutez 150 g de riz rincé, remuez 1 minute, versez 30 cl d'eau chaude salée, couvrez, 15 minutes à feu doux.",
      "Mélangez 400 g de bœuf haché avec l'oignon râpé et pressé, le persil ciselé, 1 cuillère à café de sept-épices, 1/2 de cumin, sel et poivre. Pétrissez bien.",
      "Formez 6 boudins allongés (autour de piques ou non).",
      "Faites griller 4 minutes par face sur une poêle-gril chaude avec les tomates coupées en deux.",
      "Servez avec le riz aux vermicelles et le yaourt salé."] },

  { id: "moujaddara", name: "Moujaddara (lentilles, riz et oignons caramélisés)", cat: "vege", cui: "lb", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Mujaddara.jpg/500px-Mujaddara.jpg", imgPage: "https://en.wikipedia.org/wiki/Mujaddara",
    ing: [["lentilles_vertes", 200, "g"], ["riz", 120, "g"], ["oignon", 4, "pc"], ["yaourt", 1, "pot"], ["concombre", 1, "pc"], ["tomate", 2, "pc"], ["citron", 1, "pc"]],
    pantry: ["cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Rincez 200 g de lentilles vertes, couvrez-les de 60 cl d'eau et faites-les cuire 15 minutes.",
      "Ajoutez 120 g de riz rincé, 1 cuillère à café de cumin, du sel et 15 cl d'eau. Couvrez et laissez cuire 18 minutes à feu doux, jusqu'à absorption. Laissez reposer 5 minutes.",
      "Pendant ce temps, émincez finement les 4 oignons et faites-les dorer 15 minutes dans 3 cuillères d'huile d'olive à feu moyen, en remuant, jusqu'à ce qu'ils soient bruns et croustillants sur les bords.",
      "Mélangez la moitié des oignons aux lentilles-riz. Salade : concombre et tomates en dés, citron, huile, sel.",
      "Servez avec le reste des oignons sur le dessus, le yaourt et la salade."] },

  { id: "fatteh-pois-chiches", name: "Fatteh aux pois chiches, yaourt et pita croustillant", cat: "vege", cui: "lb", time: 20, slots: ["midi"], diet: ["leger"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/%D9%81%D8%AA%D9%91%D8%A9_%D8%A8%D8%A7%D9%84%D9%84%D9%88%D8%B2_%D9%88_%D8%A7%D9%84%D8%B3%D9%91%D9%85%D9%86.jpg/500px-%D9%81%D8%AA%D9%91%D8%A9_%D8%A8%D8%A7%D9%84%D9%84%D9%88%D8%B2_%D9%88_%D8%A7%D9%84%D8%B3%D9%91%D9%85%D9%86.jpg", imgPage: "https://en.wikipedia.org/wiki/Fatteh",
    ing: [["pois_chiches", 1, "boite"], ["pita", 2, "pc"], ["yaourt", 2, "pot"], ["tahini", 2, "cs"], ["ail", 1, "gousse"], ["citron", 1, "pc"], ["pignons", 20, "g"], ["persil", 1, "botte"]],
    pantry: ["cumin", "huile d'olive", "paprika", "sel"],
    steps: ["Coupez les pains pita en petits triangles, badigeonnez-les d'huile d'olive et faites-les griller au four à 200 °C 8 minutes (ou à la poêle sèche) jusqu'à ce qu'ils soient croustillants.",
      "Faites chauffer les pois chiches égouttés dans une casserole avec 10 cl d'eau, 1 cuillère à café de cumin et du sel, 5 minutes.",
      "Sauce : mélangez 2 yaourts, 2 cuillères de tahini, la gousse d'ail pressée, le jus d'un demi-citron, sel.",
      "Faites dorer 20 g de pignons dans une petite poêle avec quelques gouttes d'huile.",
      "Dans un plat : pita croustillant, pois chiches chauds avec un peu de leur eau, sauce au yaourt, pignons, persil ciselé, paprika. Servez tout de suite."] },

  { id: "shawarma-poulet", name: "Shawarma de poulet maison en pita, sauce à l'ail", cat: "volaille", cui: "lb", time: 30, slots: ["midi", "soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Shawarma_2.jpg/500px-Shawarma_2.jpg", imgPage: "https://fr.wikipedia.org/wiki/Chawarma",
    ing: [["poulet_haut", 4, "pc"], ["yaourt", 2, "pot"], ["citron", 1, "pc"], ["ail", 4, "gousse"], ["pita", 4, "pc"], ["tomate", 2, "pc"], ["cornichons", 4, "pc"], ["laitue", 1, "pc"]],
    pantry: ["cumin", "coriandre moulue", "paprika", "cannelle", "curcuma", "huile d'olive", "sel", "poivre"],
    steps: ["Désossez les hauts de cuisse (ou demandez-le au boucher) et coupez-les en lanières. Marinade : 1 yaourt, le jus d'un demi-citron, 2 gousses d'ail pressées, 1 cuillère à café de cumin, 1 de coriandre, 1 de paprika, 1/2 de cannelle, 1/2 de curcuma, 1 cuillère d'huile, sel, poivre. Laissez mariner 15 minutes minimum.",
      "Sauce à l'ail : mélangez l'autre yaourt avec 2 gousses d'ail pressées, le reste de citron et du sel.",
      "Faites cuire le poulet égoutté dans une poêle très chaude 8 à 10 minutes en remuant, jusqu'à ce qu'il soit bien doré sur les bords.",
      "Réchauffez les pains pita. Garnissez de laitue, tomate en dés, cornichons en lamelles, poulet et sauce à l'ail. Roulez serré."] },

  { id: "loubieh-bi-zeit", name: "Loubieh bi zeit (haricots verts à la tomate), riz", cat: "vege", cui: "lb", time: 35, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["haricots_verts", 500, "g"], ["tomate", 4, "pc"], ["oignon", 1, "pc"], ["ail", 4, "gousse"], ["riz", 150, "g"], ["citron", 1, "pc"]],
    pantry: ["huile d'olive", "sel", "poivre"],
    steps: ["Équeutez 500 g de haricots verts et coupez-les en deux. Émincez l'oignon, hachez 4 gousses d'ail, coupez les tomates en dés.",
      "Dans une sauteuse, faites fondre l'oignon 5 minutes dans 3 cuillères d'huile d'olive, puis l'ail 1 minute.",
      "Ajoutez les haricots, enrobez-les 3 minutes, puis les tomates, sel, poivre et 10 cl d'eau. Couvrez et laissez mijoter 25 minutes : les haricots doivent être très fondants.",
      "Faites cuire 150 g de riz. Servez les haricots tièdes ou à température ambiante avec le riz, un filet d'huile d'olive et du citron."] },

  { id: "kibbeh-four", name: "Kibbeh au four (bœuf et boulgour), salade au yaourt", cat: "viande", cui: "lb", time: 60, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/%C4%B0%C3%A7li_k%C3%B6fte_%28Oruk%29.jpg/500px-%C4%B0%C3%A7li_k%C3%B6fte_%28Oruk%29.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kebb%C3%A9",
    ing: [["boeuf_hache", 500, "g"], ["boulgour", 200, "g"], ["oignon", 2, "pc"], ["pignons", 30, "g"], ["yaourt", 1, "pot"], ["concombre", 1, "pc"], ["menthe", 1, "botte"]],
    pantry: ["sept-épices libanais (ou cannelle + quatre-épices)", "cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Rincez 200 g de boulgour fin, couvrez-le d'eau 10 minutes, pressez-le bien. Mixez-le avec 350 g de bœuf haché, 1 oignon, 1 cuillère à café de sept-épices, sel et poivre, jusqu'à obtenir une pâte lisse (ajoutez un peu d'eau glacée si besoin).",
      "Farce : faites revenir l'autre oignon haché dans 1 cuillère d'huile, ajoutez 150 g de bœuf haché, les pignons, 1/2 cuillère à café de cumin, sel, poivre. 8 minutes.",
      "Préchauffez le four à 200 °C. Huilez un plat, étalez la moitié de la pâte au boulgour avec les mains mouillées, la farce, puis le reste de pâte. Lissez, tracez des losanges au couteau, arrosez d'huile d'olive.",
      "Enfournez 35 minutes jusqu'à ce que le dessus soit bien doré.",
      "Salade : yaourt, concombre en dés, menthe ciselée, sel. Servez avec le kibbeh."] },

  { id: "poulet-zaatar-batata-harra", name: "Poulet au zaatar, batata harra (pommes de terre épicées)", cat: "volaille", cui: "lb", time: 40, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Batata_harra.jpg/500px-Batata_harra.jpg", imgPage: "https://fr.wikipedia.org/wiki/Batata_harra",
    ing: [["poulet_blanc", 350, "g"], ["pdt", 600, "g"], ["coriandre", 1, "botte"], ["ail", 4, "gousse"], ["citron", 2, "pc"], ["poivron", 1, "pc"]],
    pantry: ["zaatar", "paprika", "piment (flocons)", "huile d'olive", "sel", "poivre"],
    steps: ["Préchauffez le four à 210 °C. Coupez 600 g de pommes de terre en petits cubes, huilez, salez, enfournez 25 minutes jusqu'à ce qu'ils soient dorés.",
      "Poulet : coupez les blancs en 2 escalopes, enrobez-les du jus d'un citron, 1 cuillère d'huile d'olive, 2 cuillères à soupe de zaatar, sel. Laissez mariner pendant la cuisson des pommes de terre.",
      "Batata harra : dans une poêle, faites revenir 4 gousses d'ail hachées et le poivron en petits dés dans 2 cuillères d'huile 2 minutes, avec 1 cuillère à café de paprika et une pincée de piment. Ajoutez les pommes de terre rôties, la coriandre ciselée et le jus d'un demi-citron. Mélangez.",
      "Faites griller le poulet 4 minutes par face sur une poêle-gril chaude.",
      "Servez avec le reste du citron."] },

  /* ---------- Syriennes ---------- */
  { id: "kabsa-poulet", name: "Kabsa au poulet (riz épicé aux raisins et amandes)", cat: "volaille", cui: "sy", time: 60, slots: ["soir"], diet: ["chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Kabsa.jpg/500px-Kabsa.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kebsa",
    ing: [["poulet_haut", 4, "pc"], ["riz_basmati", 200, "g"], ["oignon", 2, "pc"], ["tomate", 3, "pc"], ["ail", 3, "gousse"], ["carotte", 1, "pc"], ["raisins_secs", 40, "g"], ["amandes", 30, "g"], ["citron", 1, "pc"]],
    pantry: ["cardamome", "cannelle", "clous de girofle", "curcuma", "laurier", "cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Dans une cocotte, faites dorer les 4 hauts de cuisse salés et poivrés dans 2 cuillères d'huile, 4 minutes par face. Réservez.",
      "Faites fondre les 2 oignons émincés 5 minutes, ajoutez l'ail haché, la carotte râpée, les tomates en dés, 4 gousses de cardamome, 1 bâton de cannelle, 3 clous de girofle, 1 cuillère à café de curcuma, 1 de cumin, 2 feuilles de laurier. 5 minutes.",
      "Remettez le poulet, couvrez de 60 cl d'eau, laissez mijoter 20 minutes à couvert. Retirez le poulet, gardez-le au chaud.",
      "Rincez 200 g de riz basmati, versez-le dans le bouillon (il doit y en avoir environ 45 cl : ajustez), ajoutez les raisins secs. Couvrez, 15 minutes à feu doux, puis 5 minutes de repos.",
      "Faites dorer les amandes à sec. Dressez le riz, le poulet dessus (passez-le 5 minutes sous le gril pour le croustillant), les amandes et des quartiers de citron."] },

  { id: "shakriyeh", name: "Shakriyeh (agneau mijoté au yaourt), riz", cat: "viande", cui: "sy", time: 75, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/MyPlate_gov_Cultural_Food_%2820241025-USDA-FNS-UNK-0046%29.jpg/500px-MyPlate_gov_Cultural_Food_%2820241025-USDA-FNS-UNK-0046%29.jpg", imgPage: "https://en.wikipedia.org/wiki/Shakriyeh",
    ing: [["agneau", 500, "g"], ["yaourt", 4, "pot"], ["oignon", 1, "pc"], ["ail", 2, "gousse"], ["farine", 20, "g"], ["riz", 150, "g"], ["pignons", 20, "g"], ["bouillon", 1, "pc"]],
    pantry: ["menthe séchée", "laurier", "huile d'olive", "sel", "poivre"],
    steps: ["Coupez 500 g d'agneau en cubes. Couvrez-les d'eau froide avec l'oignon entier, le laurier et le cube de bouillon, portez à ébullition, écumez, puis laissez frémir 45 minutes à couvert. Réservez la viande et 20 cl de bouillon.",
      "Faites cuire 150 g de riz.",
      "Dans une casserole, fouettez 4 yaourts avec 20 g de farine et 20 cl de bouillon. Chauffez à feu doux en remuant sans arrêt dans le même sens jusqu'à frémissement : la sauce épaissit sans trancher.",
      "Ajoutez la viande, 2 gousses d'ail écrasées, 1 cuillère à café de menthe séchée, sel, poivre. Laissez mijoter 10 minutes.",
      "Faites dorer les pignons dans un peu d'huile d'olive. Servez la shakriyeh sur le riz, pignons dessus."] },

  { id: "yalanji", name: "Yalanji (feuilles de vigne farcies au riz, à l'huile d'olive)", cat: "vege", cui: "sy", time: 80, slots: ["soir"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Speca_te_mbushura_me_mish.JPG/500px-Speca_te_mbushura_me_mish.JPG", imgPage: "https://en.wikipedia.org/wiki/Dolma",
    ing: [["feuilles_vigne", 40, "pc"], ["riz", 200, "g"], ["tomate", 3, "pc"], ["oignon", 2, "pc"], ["persil", 1, "botte"], ["menthe", 1, "botte"], ["citron", 2, "pc"], ["pdt", 300, "g"]],
    pantry: ["huile d'olive", "mélasse de grenade (facultatif)", "cumin", "sel", "poivre"],
    steps: ["Rincez les feuilles de vigne à l'eau chaude, égouttez. Farce : mélangez 200 g de riz rincé (cru), les 2 oignons hachés très fin, 2 tomates en petits dés, le persil et la menthe ciselés, 4 cuillères d'huile d'olive, le jus d'un citron, 1 cuillère à café de cumin, sel, poivre.",
      "Posez une feuille nervures vers vous, 1 cuillère à café de farce à la base, rabattez les côtés et roulez serré. Répétez.",
      "Tapissez le fond d'une casserole de rondelles de pommes de terre et de la tomate restante. Rangez les rouleaux bien serrés, en couches.",
      "Couvrez d'eau à hauteur avec le jus du second citron, 3 cuillères d'huile d'olive, 1 de mélasse de grenade et du sel. Posez une assiette dessus pour les maintenir, couvrez et laissez cuire 50 minutes à feu doux.",
      "Laissez tiédir dans la casserole. Servez tiède ou froid avec du citron. Se garde 3 jours au frais."] },

  { id: "sheikh-el-mahshi", name: "Sheikh el mahshi (courgettes farcies au bœuf, sauce yaourt), riz", cat: "viande", cui: "sy", time: 50, slots: ["soir"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Makhshi1.jpg/500px-Makhshi1.jpg", imgPage: "https://en.wikipedia.org/wiki/Sheikh_al-mahshi",
    ing: [["courgette", 4, "pc"], ["boeuf_hache", 300, "g"], ["oignon", 1, "pc"], ["pignons", 30, "g"], ["yaourt", 3, "pot"], ["farine", 20, "g"], ["ail", 2, "gousse"], ["riz", 150, "g"], ["bouillon", 1, "pc"]],
    pantry: ["sept-épices libanais (ou cannelle + quatre-épices)", "menthe séchée", "huile d'olive", "sel", "poivre"],
    steps: ["Coupez les 4 courgettes en deux dans la longueur et évidez-les à la petite cuillère en gardant 1 cm de chair. Faites-les dorer 3 minutes côté chair dans 1 cuillère d'huile.",
      "Farce : faites revenir l'oignon haché, ajoutez 300 g de bœuf haché, les pignons, 1 cuillère à café de sept-épices, sel, poivre. 8 minutes. Garnissez les courgettes.",
      "Sauce : fouettez 3 yaourts avec 20 g de farine et 20 cl de bouillon. Chauffez à feu doux en remuant sans arrêt jusqu'à frémissement. Ajoutez l'ail écrasé et 1 cuillère à café de menthe séchée.",
      "Rangez les courgettes dans un plat, nappez de sauce au yaourt, couvrez d'aluminium et enfournez 25 minutes à 190 °C.",
      "Faites cuire 150 g de riz et servez ensemble."] },

  { id: "harak-osbao", name: "Harak osbao (lentilles, pâtes et oignons frits à la mélasse de grenade)", cat: "vege", cui: "sy", time: 45, slots: ["soir"], diet: ["leger", "chol"],
    ing: [["lentilles_vertes", 250, "g"], ["pates", 100, "g"], ["oignon", 3, "pc"], ["ail", 4, "gousse"], ["coriandre", 1, "botte"], ["melasse_grenade", 3, "cs"], ["citron", 1, "pc"], ["pita", 2, "pc"]],
    pantry: ["cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Rincez 250 g de lentilles, couvrez de 1 litre d'eau et faites-les cuire 20 minutes.",
      "Pendant ce temps, émincez les 3 oignons et faites-les dorer 15 minutes dans 3 cuillères d'huile d'olive jusqu'à ce qu'ils soient bruns et croustillants. Réservez-en la moitié, remettez l'autre dans la poêle avec l'ail et la coriandre hachés, 2 minutes.",
      "Ajoutez 100 g de petites pâtes aux lentilles avec leur eau, cuisez 10 minutes. Il doit rester un peu de liquide, comme un ragoût épais.",
      "Incorporez l'ail-coriandre, 3 cuillères de mélasse de grenade, le jus du citron, 1 cuillère à café de cumin, sel, poivre.",
      "Servez avec les oignons croustillants et des morceaux de pita grillés sur le dessus."] },

  { id: "kebab-halabi", name: "Kebab halabi (kefta d'Alep à la sauce tomate-poivron), pita", cat: "viande", cui: "sy", time: 40, slots: ["soir"],
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/D%C3%B6ner_kebab_slicing.jpg", imgPage: "https://fr.wikipedia.org/wiki/Kebab",
    ing: [["boeuf_hache", 450, "g"], ["poivron", 2, "pc"], ["tomate", 4, "pc"], ["oignon", 2, "pc"], ["ail", 3, "gousse"], ["persil", 1, "botte"], ["pita", 4, "pc"], ["pignons", 20, "g"]],
    pantry: ["piment d'Alep (ou paprika + piment)", "sept-épices libanais (ou cannelle + quatre-épices)", "huile d'olive", "sel", "poivre"],
    steps: ["Préchauffez le four à 220 °C. Mélangez 450 g de bœuf haché avec 1 oignon râpé et pressé, la moitié du persil ciselé, 1 cuillère à café de sept-épices, 1 de piment d'Alep, sel, poivre. Formez 8 boudins aplatis.",
      "Coupez les poivrons en lanières et 2 tomates en quartiers. Étalez le tout sur une plaque huilée avec les kefta et enfournez 15 minutes.",
      "Sauce : faites revenir l'autre oignon et l'ail hachés dans 1 cuillère d'huile, ajoutez les 2 tomates restantes râpées et 1 cuillère à café de piment d'Alep, 10 minutes.",
      "Versez la sauce sur les kefta et les légumes, remettez au four 8 minutes.",
      "Servez avec le reste du persil, les pignons dorés et les pains pita chauds."] },

  { id: "foul-mdammas", name: "Foul mdammas (fèves à l'huile d'olive, citron et cumin)", cat: "vege", cui: "sy", time: 15, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/500px-Ful_medames_%28arabic_meal%29.jpg", imgPage: "https://en.wikipedia.org/wiki/Ful_medames",
    ing: [["feves", 2, "boite"], ["ail", 2, "gousse"], ["citron", 2, "pc"], ["tomate", 2, "pc"], ["persil", 1, "botte"], ["oignon_nouveau", 2, "pc"], ["pita", 4, "pc"]],
    pantry: ["cumin", "huile d'olive", "sel", "poivre"],
    steps: ["Versez les 2 boîtes de fèves avec leur jus dans une casserole, chauffez 5 minutes à feu doux.",
      "Égouttez en partie, écrasez grossièrement à la fourchette avec 2 gousses d'ail pressées, le jus d'un citron et demi, 1 cuillère à café de cumin, sel et poivre.",
      "Versez dans un plat creux, arrosez généreusement d'huile d'olive.",
      "Garnissez de tomates en dés, oignons nouveaux émincés, persil ciselé et quartiers du citron restant.",
      "Servez chaud avec les pains pita, pour saucer."] },

  { id: "muhammara", name: "Muhammara (dip poivrons-noix), crudités et pita", cat: "vege", cui: "sy", time: 30, slots: ["midi"], diet: ["leger", "chol"],
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Tanoreen_muhammara.jpg/500px-Tanoreen_muhammara.jpg", imgPage: "https://fr.wikipedia.org/wiki/Mouhammara",
    ing: [["poivron", 3, "pc"], ["noix", 80, "g"], ["chapelure", 40, "g"], ["ail", 1, "gousse"], ["melasse_grenade", 2, "cs"], ["citron", 1, "pc"], ["concombre", 1, "pc"], ["carotte", 2, "pc"], ["pita", 4, "pc"]],
    pantry: ["cumin", "piment d'Alep (ou paprika + piment)", "huile d'olive", "sel"],
    steps: ["Faites griller les 3 poivrons entiers sous le gril du four 20 minutes en les tournant, jusqu'à ce que la peau noircisse. Enfermez-les 10 minutes dans un sac ou sous un bol, pelez-les et épépinez-les.",
      "Faites griller 80 g de noix à sec 3 minutes.",
      "Mixez les poivrons, les noix, 40 g de chapelure, la gousse d'ail, 2 cuillères de mélasse de grenade, le jus d'un demi-citron, 1 cuillère à café de cumin, 1 de piment d'Alep, 3 cuillères d'huile d'olive et du sel, jusqu'à obtenir une pâte épaisse encore un peu granuleuse.",
      "Servez dans un plat avec un filet d'huile, accompagné de bâtonnets de concombre et de carotte et de pains pita tièdes."] },
];

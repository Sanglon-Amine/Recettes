(function () {
  "use strict";

  const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const DAYS_SHORT = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const SLOTS = ["midi", "soir"];
  const SLOT_LABEL = { midi: "Déjeuner", soir: "Dîner" };
  const KEY = "menu-semaine-v1";
  const HISTORY_WEEKS = 2; // on évite les plats des 2 semaines précédentes
  let BY_ID = Object.fromEntries(RECIPES.map(r => [r.id, r]));
  const allRecipes = () => (state && state.custom && state.custom.length) ? RECIPES.concat(state.custom) : RECIPES;
  function rebuildIndex() { BY_ID = Object.fromEntries(allRecipes().map(r => [r.id, r])); }
  // Ingrédient de la base (clé de ING) ou ingrédient perso encodé « ~rayon~Libellé ».
  const ingLabel = k => k[0] === "~" ? k.slice(k.indexOf("~", 1) + 1) : (ING[k] ? ING[k][0] : k);
  const ingAisle = k => k[0] === "~" ? k.slice(1, k.indexOf("~", 1)) : (ING[k] ? ING[k][1] : "epicerie");
  const PERSONS_MIN = 1, PERSONS_MAX = 8, BASE_PERSONS = 2;
  // Ingrédients qu'on n'achète pas à la moitié : arrondis à l'unité entière.
  const WHOLE = new Set(["oeuf", "pain_burger", "tortillas", "galettes", "pita", "steak_hache", "pate_brisee", "pate_pizza", "pate_feuilletee",
    "poulet_entier", "poulet_haut", "poulet_cuisse", "truite", "merguez", "cornichons", "endive", "citron_confit", "bouillon",
    "laitue", "romaine", "brocoli", "chou_fleur", "chou_vert"]);

  const $ = (sel, root) => (root || document).querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const meta = r => `${r.time} min · ${esc(CATS[r.cat])} · ${esc(CUISINES[r.cui])}`;

  /* ---------- État ---------- */
  let state = load();
  const ui = { tab: "semaine", picking: null, sheet: null, search: "", cat: "all", cui: "all", selected: new Set(), version: null, form: null, web: null };
  let toastTimer = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.plan) && s.plan.length === 7 && s.plan.every(d => d && typeof d === "object")) {
          s.custom = Array.isArray(s.custom) ? s.custom.filter(r => r && r.id && r.name && Array.isArray(r.ing) && Array.isArray(r.steps)) : [];
          s.checked = s.checked || {};
          s.excluded = (s.excluded || []).filter(id => BY_ID[id]);
          s.history = s.history || {};
          s.persons = Math.min(PERSONS_MAX, Math.max(PERSONS_MIN, s.persons || BASE_PERSONS));
          s.diets = (s.diets || []).filter(d => DIETS[d]);
          return s;
        }
      }
    } catch (e) { /* stockage indisponible : on repart d'une semaine neuve */ }
    return null;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* mode privé, quota… : l'app reste utilisable */ }
  }

  /* ---------- Dates ---------- */
  // Lundi de la semaine à planifier : la semaine en cours, ou la suivante si on est déjà samedi/dimanche.
  function planWeekStart(now) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dow = (d.getDay() + 6) % 7; // 0 = lundi
    d.setDate(d.getDate() + (dow >= 5 ? 7 - dow : -dow));
    return d;
  }
  function isoWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  function dayDate(i) { const d = new Date(state.weekStart); d.setDate(d.getDate() + i); return d; }
  function fmtDay(d) { return `${d.getDate()} ${MONTHS[d.getMonth()]}`; }
  function weekLabel() {
    const a = dayDate(0), b = dayDate(6);
    const from = a.getMonth() === b.getMonth() ? String(a.getDate()) : fmtDay(a);
    return `Semaine ${isoWeek(a)} · du ${from} au ${fmtDay(b)}`;
  }
  function todayIndex() {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const diff = Math.round((t - new Date(state.weekStart).setHours(0, 0, 0, 0)) / 86400000);
    return diff >= 0 && diff < 7 ? diff : -1;
  }
  // La semaine affichée n'est plus celle à planifier (elle est terminée, ou c'est déjà le week-end).
  function nextWeekDue() {
    const next = planWeekStart(new Date());
    return next > new Date(state.weekStart) ? next : null;
  }

  /* ---------- Génération ---------- */
  const isWeekend = day => day >= 5;
  const planIds = plan => plan.flatMap(d => [d.midi, d.soir]).filter(Boolean);
  // Plats à éviter : ceux des semaines précédentes, ceux exclus par l'utilisateur, ceux déjà au menu.
  function avoidSets(plan, extra) {
    const current = new Set(planIds(plan));
    const excluded = new Set(state.excluded);
    const history = new Set(Object.values(state.history).flat());
    (extra || []).forEach(id => history.add(id));
    return { current, excluded, history };
  }
  // Régimes actifs : une recette doit porter toutes les étiquettes sélectionnées.
  const fitsDiet = r => state.diets.every(d => (r.diet || []).includes(d));
  const dietsLabel = () => state.diets.map(d => DIETS[d]).join(" + ");
  // En semaine : déjeuner rapide (≤ 25 min), dîner ≤ 60 min. Le week-end, tout est permis (rôti, mijoté…).
  function fits(r, day, slot) {
    if (isWeekend(day)) return true;
    if (!r.slots.includes(slot)) return false;
    return slot === "midi" ? r.time <= 25 : r.time <= 60;
  }
  // On relâche les contraintes une à une si le vivier est vide : l'historique, puis les exclusions, puis les horaires.
  // Le régime choisi n'est jamais relâché (sauf si aucune recette ne le respecte).
  function candidates(day, slot, sets) {
    const ok = allRecipes().filter(r => fitsDiet(r) && !sets.current.has(r.id));
    const base = ok.filter(r => fits(r, day, slot));
    let pool = base.filter(r => !sets.excluded.has(r.id) && !sets.history.has(r.id));
    if (!pool.length) pool = base.filter(r => !sets.excluded.has(r.id));
    if (!pool.length) pool = base;
    if (!pool.length) pool = ok;
    if (!pool.length) pool = allRecipes().filter(r => fits(r, day, slot) && !sets.current.has(r.id));
    return pool;
  }
  // Active/désactive un régime et remplace aussitôt les repas non verrouillés qui ne le respectent pas.
  function toggleDiet(key) {
    const i = state.diets.indexOf(key);
    if (i >= 0) state.diets.splice(i, 1); else state.diets.push(key);
    let replaced = 0;
    state.plan.forEach((d, day) => SLOTS.forEach(slot => {
      const locked = slot === "midi" ? d.lockMidi : d.lockSoir;
      if (!locked && !fitsDiet(BY_ID[d[slot]])) { swap(day, slot); replaced++; }
    }));
    save();
    return { active: i < 0, replaced };
  }
  // Choix pondéré : familles et cuisines encore peu présentes d'abord, et jamais deux repas de suite de la même famille.
  function pick(day, slot, plan, prevCat, extraAvoid) {
    const sets = avoidSets(plan, extraAvoid);
    const pool = candidates(day, slot, sets);
    if (!pool.length) { const all = allRecipes(); return all[Math.floor(Math.random() * all.length)].id; }
    const cats = {}, cuis = {};
    sets.current.forEach(id => { const r = BY_ID[id]; cats[r.cat] = (cats[r.cat] || 0) + 1; cuis[r.cui] = (cuis[r.cui] || 0) + 1; });
    const scored = pool.map(r => [(cats[r.cat] || 0) + 0.6 * (cuis[r.cui] || 0) + (r.cat === prevCat ? 1.5 : 0) + Math.random() * 0.9, r]);
    scored.sort((a, b) => a[0] - b[0]);
    return scored[0][1].id;
  }
  function generateWeek(keepLocks, extraAvoid) {
    const old = state && state.plan;
    const plan = Array.from({ length: 7 }, () => ({ midi: null, soir: null, lockMidi: false, lockSoir: false }));
    if (keepLocks && old) old.forEach((d, i) => {
      if (d.lockMidi) { plan[i].midi = d.midi; plan[i].lockMidi = true; }
      if (d.lockSoir) { plan[i].soir = d.soir; plan[i].lockSoir = true; }
    });
    let prevCat = null;
    for (let i = 0; i < 7; i++) for (const slot of SLOTS) {
      if (!plan[i][slot]) plan[i][slot] = pick(i, slot, plan, prevCat, extraAvoid);
      prevCat = BY_ID[plan[i][slot]].cat;
    }
    return plan;
  }
  function newWeek() {
    const ws = planWeekStart(new Date()).toISOString();
    if (!state) state = { excluded: [], history: {}, persons: BASE_PERSONS, diets: [], custom: [] };
    let extraAvoid = [];
    if (state.plan) {
      if (state.weekStart !== ws) {
        // La semaine affichée est passée : on l'archive pour ne pas la reproposer tout de suite.
        state.history[state.weekStart] = planIds(state.plan);
        const keys = Object.keys(state.history).sort().slice(-HISTORY_WEEKS);
        state.history = Object.fromEntries(keys.map(k => [k, state.history[k]]));
      } else {
        // Même semaine, on relance le tirage : les plats actuels non verrouillés changent.
        extraAvoid = planIds(state.plan);
      }
    }
    state.weekStart = ws;
    state.plan = generateWeek(true, extraAvoid);
    state.checked = {};
    ui.selected.clear();
    save();
  }
  function swap(day, slot) {
    const sets = avoidSets(state.plan);
    sets.current.add(state.plan[day][slot]);
    const pool = candidates(day, slot, sets);
    if (!pool.length) return BY_ID[state.plan[day][slot]];
    const r = pool[Math.floor(Math.random() * pool.length)];
    setMeal(day, slot, r.id);
    return r;
  }
  function setMeal(day, slot, id) {
    state.plan[day][slot] = id;
    save();
  }
  function toggleLock(day, slot) {
    const k = slot === "midi" ? "lockMidi" : "lockSoir";
    state.plan[day][k] = !state.plan[day][k];
    save();
  }
  // Exclure une recette : elle ne sera plus tirée au sort, et si elle est au menu on la remplace tout de suite.
  function toggleExclude(id) {
    const i = state.excluded.indexOf(id);
    if (i >= 0) { state.excluded.splice(i, 1); save(); return { excluded: false, replaced: 0 }; }
    state.excluded.push(id);
    let replaced = 0;
    state.plan.forEach((d, day) => SLOTS.forEach(slot => {
      if (d[slot] === id) { d[slot === "midi" ? "lockMidi" : "lockSoir"] = false; swap(day, slot); replaced++; }
    }));
    save();
    return { excluded: true, replaced };
  }
  function replaceSelected() {
    const done = [];
    [...ui.selected].forEach(key => {
      const [day, slot] = key.split("|");
      done.push(swap(+day, slot).name);
    });
    ui.selected.clear();
    return done;
  }

  /* ---------- Liste de courses ---------- */
  function fmtNum(n) {
    if (Number.isInteger(n)) return String(n);
    if (Math.abs(n * 2 - Math.round(n * 2)) < 1e-9) return (Math.floor(n) || "") + "½";  // 0,5 → ½ ; 1,5 → 1½
    return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  }
  // Quantité pour le nombre de personnes choisi (les recettes sont écrites pour 2), avec des arrondis d'achat.
  function scaleQty(key, qty, unit) {
    const f = state.persons / BASE_PERSONS;
    if (f === 1) return qty;
    const q = qty * f;
    if (unit === "g") return Math.max(5, q < 100 ? Math.round(q / 5) * 5 : Math.round(q / 10) * 10);
    if (unit === "cl") return Math.max(1, Math.round(q));
    if (unit === "cs") return Math.max(0.5, Math.round(q * 2) / 2);
    if (WHOLE.has(key) || ["tranche", "feuille", "boite", "pot", "botte"].includes(unit)) return Math.max(1, Math.round(q));
    return Math.max(0.5, Math.round(q * 2) / 2);  // pièces, gousses : la moitié est possible
  }
  const personsLabel = () => `${state.persons} personne${state.persons > 1 ? "s" : ""}`;
  function fmtQty(qty, unit) {
    if (unit === "g" && qty >= 1000) return fmtNum(Math.round(qty / 100) / 10) + " kg";
    if (unit === "cl" && qty >= 100) return fmtNum(qty / 100) + " L";
    const u = UNITS[unit] || [unit, unit];
    const word = qty > 1 ? u[1] : u[0];
    return fmtNum(qty) + (word ? " " + word : "");
  }
  function shoppingList() {
    const items = new Map();
    const pantry = new Set();
    state.plan.forEach(d => SLOTS.forEach(slot => {
      const r = BY_ID[d[slot]];
      if (!r) return;
      r.ing.forEach(([key, qty, unit]) => {
        const k = key + "|" + unit;
        const it = items.get(k) || { k, key, unit, qty: 0, uses: [], aisle: ingAisle(key), label: ingLabel(key) };
        it.qty += qty;
        if (!it.uses.includes(r.name)) it.uses.push(r.name);
        items.set(k, it);
      });
      (r.pantry || []).forEach(p => pantry.add(p));
    }));
    const all = [...items.values()];
    all.forEach(it => { it.qty = scaleQty(it.key, it.qty, it.unit); });
    const byAisle = AISLES
      .map(([id, name]) => ({ id, name, items: all.filter(it => it.aisle === id).sort((a, b) => a.label.localeCompare(b.label, "fr")) }))
      .filter(a => a.items.length);
    const done = all.filter(it => state.checked[it.k]).length;
    return { byAisle, pantry: [...pantry].sort((a, b) => a.localeCompare(b, "fr")), total: all.length, done };
  }
  function shoppingText() {
    const list = shoppingList();
    const lines = [`Courses · ${weekLabel()} · ${personsLabel()}`, ""];
    list.byAisle.forEach(a => {
      lines.push(a.name.toUpperCase());
      a.items.forEach(it => lines.push(`${state.checked[it.k] ? "☑" : "☐"} ${it.label} — ${fmtQty(it.qty, it.unit)}`));
      lines.push("");
    });
    lines.push("À vérifier dans le placard : " + list.pantry.join(", "));
    return lines.join("\n");
  }

  /* ---------- Rendu ---------- */
  function render() {
    $("#weekLabel").textContent = weekLabel();
    $("#servesLabel").textContent = personsLabel();
    $('[data-act="personsMinus"]').disabled = state.persons <= PERSONS_MIN;
    $('[data-act="personsPlus"]').disabled = state.persons >= PERSONS_MAX;
    const view = $("#view");
    if (ui.tab === "semaine") view.innerHTML = renderWeek();
    else if (ui.tab === "courses") view.innerHTML = renderCourses();
    else view.innerHTML = renderRecettes();
    document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === ui.tab)));
    const list = shoppingList();
    $("#coursesCount").textContent = list.total - list.done;
    $("#coursesCount").hidden = list.total - list.done === 0;
    renderSheet();
  }

  function renderPrefs() {
    const desc = { leger: "plats complets peu caloriques, peu de matières grasses, pas de friture ni de gratin", chol: "sans beurre, crème, fromage gras, jaunes d'œufs, viande rouge ni lait de coco" };
    return `
      <div class="prefs" role="group" aria-label="Régimes">
        <span class="prefs-label">Régime</span>
        ${Object.entries(DIETS).map(([k, v]) => `<button class="filter pref" data-act="toggleDiet" data-diet="${k}" aria-pressed="${state.diets.includes(k)}" title="${esc(desc[k])}">${state.diets.includes(k) ? icon("check") : ""}${esc(v)}</button>`).join("")}
      </div>
      ${state.diets.length ? `<p class="hint">${state.diets.map(k => `<strong>${esc(DIETS[k])}</strong> : ${esc(desc[k])}`).join(" · ")}. Seules les recettes conformes sont proposées.</p>` : ""}`;
  }

  function mealRow(day, slot) {
    const d = state.plan[day];
    const r = BY_ID[d[slot]];
    const locked = slot === "midi" ? d.lockMidi : d.lockSoir;
    const key = `${day}|${slot}`;
    const sel = ui.selected.has(key);
    return `
      <article class="meal meal-${slot}${sel ? " selected" : ""}" data-day="${day}" data-slot="${slot}">
        <div class="meal-when" aria-hidden="true">${slot === "midi" ? "Midi" : "Soir"}</div>
        <label class="meal-check" title="Cocher pour remplacer">
          <input type="checkbox" data-select="${key}" ${sel ? "checked" : ""} aria-label="Sélectionner ${esc(r.name)} pour le remplacer">
          <span class="check">${icon("check")}</span>
        </label>
        <button class="meal-main" data-act="open" aria-label="${esc(SLOT_LABEL[slot])} : ${esc(r.name)}, voir la recette">
          <span><span class="meal-name">${esc(r.name)}</span><span class="meal-meta">${meta(r)}</span></span>
          <span class="chev">${icon("chevron")}</span>
        </button>
        <button class="icon-btn" data-act="lock" aria-pressed="${locked}" aria-label="${locked ? "Déverrouiller" : "Verrouiller"} ce repas" title="${locked ? "Conservé lors d'une nouvelle semaine" : "Garder ce plat quand on régénère la semaine"}">${icon(locked ? "lock" : "unlock")}</button>
      </article>`;
  }
  function renderWeek() {
    const today = todayIndex();
    const due = nextWeekDue();
    const n = ui.selected.size;
    return `
      ${due ? `<div class="week-banner"><span>La semaine affichée ${today >= 0 ? "se termine" : "est passée"}. Prêt à planifier la <strong>semaine du ${fmtDay(due)}</strong> ?</span><button class="btn btn-accent" data-act="newWeek">Générer</button></div>` : ""}
      <div class="action-row">
        <button class="btn btn-primary" data-act="newWeek">${icon("sparkle")} Nouvelle semaine</button>
        <button class="btn" data-act="goCourses">${icon("basket")} Voir les courses</button>
      </div>
      ${renderPrefs()}
      <p class="hint">Touche un plat pour lire la recette complète · coche un ou plusieurs repas pour les remplacer.</p>
      ${state.plan.map((d, i) => `
        <section class="day${i === today ? " today" : ""}">
          <header class="day-head">
            <h2 class="day-name">${DAYS[i]}</h2>
            <span class="day-date">${fmtDay(dayDate(i))}</span>
            ${i === today ? '<span class="today-tag">Aujourd\'hui</span>' : ""}
          </header>
          ${mealRow(i, "midi")}${mealRow(i, "soir")}
        </section>`).join("")}
      <p class="hint version">Menu de la Semaine${ui.version ? ` · recettes v${ui.version}` : ""} · ${personsLabel()} · sans porc ni alcool</p>
      ${n ? `<div class="select-bar" role="region" aria-label="Sélection">
          <span>${n} repas coché${n > 1 ? "s" : ""}</span>
          <button class="btn btn-ghost" data-act="clearSelection">Annuler</button>
          <button class="btn btn-accent" data-act="replaceSelected">${icon("swap")} Remplacer</button>
        </div>` : ""}`;
  }

  function renderCourses() {
    const list = shoppingList();
    const pct = list.total ? Math.round(100 * list.done / list.total) : 0;
    return `
      <div class="list-head">
        <div class="list-stats"><strong>${list.total}</strong> articles · <strong>${list.done}</strong> dans le panier</div>
        <div class="list-actions">
          <button class="btn" data-act="share">${icon("share")} Partager</button>
          <button class="btn btn-ghost" data-act="uncheck" ${list.done ? "" : "disabled"}>Tout décocher</button>
        </div>
      </div>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Courses faites"><span style="width:${pct}%"></span></div>
      ${list.byAisle.map(a => {
        const done = a.items.filter(it => state.checked[it.k]).length;
        return `
        <section class="aisle">
          <header class="aisle-head"><h2 class="aisle-name">${esc(a.name)}</h2><span class="aisle-count">${done}/${a.items.length}</span></header>
          <ul class="items">
            ${a.items.map(it => `
              <li class="item${state.checked[it.k] ? " done" : ""}">
                <label>
                  <input type="checkbox" data-key="${esc(it.k)}" ${state.checked[it.k] ? "checked" : ""}>
                  <span class="check">${icon("check")}</span>
                  <span class="item-body"><span class="item-name">${esc(it.label)}</span><span class="item-uses">${esc(it.uses.join(" · "))}</span></span>
                  <span class="item-qty">${fmtQty(it.qty, it.unit)}</span>
                </label>
              </li>`).join("")}
          </ul>
        </section>`;
      }).join("")}
      <section class="aisle">
        <header class="aisle-head"><h2 class="aisle-name">Placard</h2><span class="aisle-count">à vérifier</span></header>
        <div class="pantry-box">
          <p class="pantry-note">Normalement déjà à la maison — un coup d'œil avant de partir :</p>
          <div class="chips">${list.pantry.map(p => `<span class="chip">${esc(p)}</span>`).join("")}</div>
        </div>
      </section>`;
  }

  function renderRecettes() {
    const used = new Set(planIds(state.plan));
    const excluded = new Set(state.excluded);
    const q = ui.search.trim().toLowerCase();
    const rows = allRecipes()
      .filter(r => ui.cat === "all" || r.cat === ui.cat)
      .filter(r => ui.cui === "all" || r.cui === ui.cui)
      .filter(fitsDiet)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.ing.some(([k]) => ingLabel(k).toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    const p = ui.picking;
    const chip = (group, val, label, active) => `<button class="filter" data-filter="${group}" data-val="${val}" aria-pressed="${active}">${esc(label)}</button>`;
    return `
      ${p ? `<div class="picking-banner"><span>Choisir pour ${DAYS[p.day]} · ${SLOT_LABEL[p.slot].toLowerCase()}</span><button class="btn btn-ghost" data-act="cancelPick">Annuler</button></div>` : ""}
      <button class="btn btn-block add-btn" data-act="newRecipe">${icon("sparkle")} Ajouter une recette — depuis un lien ou à la main</button>
      <div class="search">${icon("search")}<input type="search" id="searchInput" placeholder="Rechercher un plat ou un ingrédient" value="${esc(ui.search)}" aria-label="Rechercher"></div>
      ${renderPrefs()}
      <div class="filters" role="group" aria-label="Filtrer par cuisine">
        ${chip("cui", "all", "Toutes cuisines", ui.cui === "all")}
        ${Object.entries(CUISINES).map(([k, v]) => chip("cui", k, v, ui.cui === k)).join("")}
      </div>
      <div class="filters" role="group" aria-label="Filtrer par famille">
        ${chip("cat", "all", "Tous les plats", ui.cat === "all")}
        ${Object.entries(CATS).map(([k, v]) => chip("cat", k, v, ui.cat === k)).join("")}
      </div>
      ${q.length >= 3 ? `<button class="btn btn-block web-btn" data-act="webSearch">${icon("search")} Chercher « ${esc(ui.search.trim())} » sur internet</button>` : ""}
      <p class="hint">${rows.length} recette${rows.length > 1 ? "s" : ""}${state.excluded.length ? ` · ${state.excluded.length} exclue${state.excluded.length > 1 ? "s" : ""} des tirages` : ""}${q.length >= 3 ? " dans l'app" : ""}</p>
      <div class="catalog">
        ${!rows.length && q.length >= 3 ? `<p class="empty">Rien dans l'app pour « ${esc(ui.search.trim())} ». Essaie le bouton ci-dessus pour chercher sur internet.</p>` : ""}
        ${rows.length ? rows.map(r => `
          <button class="recipe-row${excluded.has(r.id) ? " excluded" : ""}" data-act="${p ? "pickRecipe" : "openRecipe"}" data-id="${r.id}">
            <span><span class="meal-name">${esc(r.name)}</span>${used.has(r.id) ? '<span class="tag tag-ok">au menu</span>' : ""}${excluded.has(r.id) ? '<span class="tag">exclue</span>' : ""}${r.custom ? '<span class="tag tag-me">perso</span>' : ""}<span class="meal-meta">${esc(CATS[r.cat])} · ${esc(CUISINES[r.cui])}${(r.diet || []).length ? " · " + r.diet.map(d => esc(DIETS[d]).toLowerCase()).join(", ") : ""}</span></span>
            <span class="recipe-side"><span class="recipe-time">${r.time} min</span>${icon("chevron")}</span>
          </button>`).join("") : (q.length >= 3 ? "" : `<p class="empty">Aucune recette ne correspond.</p>`)}
      </div>`;
  }

  function renderSheet() {
    const root = $("#sheetRoot");
    const s = ui.sheet;
    if (!s) { root.innerHTML = ""; document.body.style.overflow = ""; return; }
    const r = s.id ? BY_ID[s.id] : null;
    const ctx = s.ctx;
    const isExcluded = r ? state.excluded.includes(r.id) : false;
    let body, actions;
    if (s.mode === "form") {
      body = renderForm();
      actions = `<button class="btn" data-act="cancelForm">Annuler</button><button class="btn btn-primary" data-act="saveRecipe">${icon("check")} Enregistrer</button>`;
    } else if (s.mode === "web") {
      body = renderWebResults();
      actions = `<button class="btn" data-act="webSearch">${icon("search")} Réessayer</button><button class="btn" data-act="newRecipe">${icon("book")} Coller un lien</button>`;
    } else if (s.mode === "slots") {
      body = `
        <p class="eyebrow">Mettre au menu</p>
        <h2 id="sheetTitle">${esc(r.name)}</h2>
        <p class="pantry">Choisis le repas à remplacer :</p>
        <div class="slot-grid">
          ${state.plan.map((d, i) => SLOTS.map(slot => `
            <button class="slot-btn ${slot}" data-act="placeAt" data-day="${i}" data-slot="${slot}">
              <span class="slot-day">${DAYS_SHORT[i]} ${slot}</span>
              <span class="slot-cur">${esc(BY_ID[d[slot]].name)}</span>
            </button>`).join("")).join("")}
        </div>`;
      actions = `<button class="btn span2" data-act="sheetBack">Retour à la recette</button>`;
    } else {
      const locked = ctx && (ctx.slot === "midi" ? state.plan[ctx.day].lockMidi : state.plan[ctx.day].lockSoir);
      body = `
        ${ctx ? `<p class="eyebrow ${ctx.slot === "midi" ? "noon" : "night"}">${DAYS[ctx.day]} · ${SLOT_LABEL[ctx.slot]}</p>` : ""}
        <h2 id="sheetTitle">${esc(r.name)}</h2>
        <div class="chips"><span class="chip">${r.time} min</span><span class="chip">${esc(CATS[r.cat])}</span><span class="chip">${esc(CUISINES[r.cui])}</span>${(r.diet || []).map(d => `<span class="chip chip-diet">${esc(DIETS[d])}</span>`).join("")}<span class="chip chip-ok">${personsLabel()}</span></div>
        ${dishFigure(r)}
        <h3>Ingrédients</h3>
        <ul class="ing">${r.ing.map(([k, q, u]) => `<li><span>${esc(ingLabel(k))}</span><span class="qty">${fmtQty(scaleQty(k, q, u), u)}</span></li>`).join("")}</ul>
        ${r.pantry && r.pantry.length ? `<p class="pantry">Du placard : ${esc(r.pantry.join(", "))}.</p>` : ""}
        ${r.source ? `<p class="pantry">Source : <a href="${esc(r.source)}" target="_blank" rel="noopener">${esc(hostOf(r.source))}</a></p>` : ""}
        ${state.persons !== BASE_PERSONS ? `<p class="scale-note">Quantités ajustées pour ${personsLabel()}. Les étapes ci-dessous sont rédigées pour 2 personnes : multipliez les quantités qu'elles citent par ${fmtNum(Math.round(state.persons / BASE_PERSONS * 100) / 100)}.</p>` : ""}
        <h3>Préparation · ${r.steps.length} étapes</h3>
        <ol class="steps">${r.steps.map(st => `<li>${esc(st)}</li>`).join("")}</ol>`;
      const excludeBtn = `<button class="btn ${isExcluded ? "" : "btn-ghost"}" data-act="sheetExclude">${icon(isExcluded ? "sparkle" : "ban")} ${isExcluded ? "Proposer à nouveau" : "Ne plus proposer"}</button>`;
      actions = ctx
        ? `<button class="btn" data-act="sheetSwap">${icon("swap")} Autre suggestion</button>
           <button class="btn" data-act="sheetPick">${icon("book")} Choisir…</button>
           <button class="btn ${locked ? "btn-accent" : ""}" data-act="sheetLock">${icon(locked ? "lock" : "unlock")} ${locked ? "Verrouillé" : "Verrouiller"}</button>
           ${excludeBtn}`
        : `<button class="btn btn-primary" data-act="sheetSlots">${icon("calendar")} Mettre au menu…</button>
           ${excludeBtn}
           ${r.custom ? `<button class="btn" data-act="editRecipe">${icon("book")} Modifier</button><button class="btn ${s.confirmDelete ? "btn-accent" : "btn-ghost"}" data-act="deleteRecipe">${icon("ban")} ${s.confirmDelete ? "Confirmer la suppression" : "Supprimer"}</button>` : ""}`;
    }
    root.innerHTML = `
      <div class="sheet-backdrop" data-act="closeSheet"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        <div class="sheet-handle"></div>
        <button class="icon-btn sheet-close" data-act="closeSheet" aria-label="Fermer">${icon("close")}</button>
        <div class="sheet-scroll">${body}</div>
        <div class="sheet-actions">${actions}</div>
      </div>`;
    document.body.style.overflow = "hidden";
  }

  /* ---------- Recettes personnelles : import depuis un lien, saisie, modification ---------- */
  const strip = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").replace(/[’]/g, "'").toLowerCase().replace(/\s+/g, " ").trim();
  const singular = s => s.split(" ").map(w => w.length > 3 ? w.replace(/(s|x)$/, "") : w).join(" ");
  const rxEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ING_INDEX = Object.entries(ING).map(([key, [label]]) => { const l = singular(strip(label.replace(/\(.*?\)/g, ""))); return [key, l, new RegExp("\\b" + rxEsc(l) + "\\b")]; }).sort((a, b) => b[1].length - a[1].length);
  const PANTRY_RX = /\b(sel|poivre|huile|vinaigre|sucre|moutarde|muscade|cumin|paprika|curry|thym|laurier|origan|cannelle|piment|herbes? de provence|curcuma|gingembre moulu|coriandre moulue|garam masala|cardamome|clous? de girofle|bouquet garni|ketchup|maizena|fecule|levure|bicarbonate|tabasco|zaatar|sumac|ras el hanout|quatre-epices|sept-epices|safran|vanille|cacao|epices?|aromates?)\b/;
  const PORK_RX = /\b(porc|lard|lardons?|bacon|jambon(?! de b)|saucisses?|saucisson|chorizo|pancetta|coppa|cochon|travers|andouille|boudin|rillettes|poitrine fumee)\b/;
  const ALCOHOL_RX = /\b(vin|biere|cidre|cognac|rhum|whisky|liqueur|pastis|champagne|porto|marsala|sake|mirin|calvados|armagnac|kirsch|grand marnier|vermouth|xeres|alcool)\b/;
  const AISLE_RX = [
    ["boucherie", /\b(poulet|dinde|boeuf|veau|agneau|viande|steak|escalope|cuisse|magret|canard|lapin|saumon|cabillaud|thon frais|crevette|moule|poisson|truite|dorade|daurade|merlu|lieu|colin|sardine|gambas|calamar|encornet|jambon|merguez|kefta|lotte|maquereau|hache)\b/],
    ["cremerie", /\b(lait|creme|beurre|yaourt|fromage|gruyere|emmental|comte|parmesan|mozzarella|feta|chevre|ricotta|mascarpone|cheddar|oeuf|tofu|brisee|feuilletee|pate a pizza|galette|gnocchi|raclette|reblochon|bleu|roquefort)\b/],
    ["boulangerie", /\b(pain|baguette|pita|brioche|burger|naan|tortilla)\b/],
    ["surgeles", /\b(surgele|petits pois)\b/],
    ["legumes", /\b(oignon|ail|echalote|tomate|poivron|courgette|aubergine|carotte|pomme de terre|pommes de terre|patate|champignon|brocoli|poireau|potiron|courge|citron|salade|laitue|mache|roquette|concombre|avocat|endive|epinard|haricot vert|haricots verts|chou|navet|persil|ciboulette|coriandre|basilic|menthe|aneth|gingembre|celeri|radis|fenouil|betterave|pomme|poire|banane|orange|fruit|legume|herbe|asperge|artichaut|frais|fraiche)\b/],
  ];
  const UNIT_ALIASES = [
    ["kg", /^(kg|kilo|kilos|kilogramme|kilogrammes)$/], ["g", /^(g|gr|gramme|grammes)$/], ["l", /^(l|litre|litres)$/], ["dl", /^(dl)$/], ["cl", /^(cl)$/], ["ml", /^(ml)$/],
    ["cs", /^(cs|cas|c\.? ?a\.? ?s\.?|cuillere a soupe|cuilleres a soupe|cuil\.? a soupe|c\. a soupe|c a soupe|cuillere a s\.?|cuilleres a s\.?|c\.a\.s\.?|cuilleres? a soupe)$/],
    ["cc", /^(cc|cac|c\.? ?a\.? ?c\.?|cuillere a cafe|cuilleres a cafe|cuil\.? a cafe|c\. a cafe|c a cafe|cuillere a c\.?|cuilleres a c\.?|c\.a\.c\.?)$/],
    ["pincee", /^(pincee|pincees)$/], ["gousse", /^(gousse|gousses)$/], ["botte", /^(botte|bottes|bouquet)$/], ["tranche", /^(tranche|tranches|rondelle|rondelles)$/],
    ["boite", /^(boite|boites|conserve|conserves|bocal|bocaux|brique|briques)$/], ["sachet", /^(sachet|sachets|paquet|paquets)$/], ["pot", /^(pot|pots)$/], ["feuille", /^(feuille|feuilles)$/],
    ["verre", /^(verre|verres)$/], ["tasse", /^(tasse|tasses)$/],
    ["pc", /^(piece|pieces|brin|brins|branche|branches|morceau|morceaux|tige|tiges|belle|belles|gros|grosse|grosses|petit|petite|petits|petites|beau|beaux|grand|grande|grands|grandes|unite|unites)$/],
  ];
  function parseQty(s) {
    let m = /^(\d+)\s+(\d)\/(\d)\b/.exec(s); if (m) return { q: +m[1] + (+m[2] / +m[3]), rest: s.slice(m[0].length) };
    m = /^(\d+)\s*\/\s*(\d+)\b/.exec(s); if (m) return { q: +m[1] / +m[2], rest: s.slice(m[0].length) };
    m = /^(\d+)?\s*([½¼¾])/.exec(s); if (m) return { q: (+(m[1] || 0)) + ({ "½": .5, "¼": .25, "¾": .75 })[m[2]], rest: s.slice(m[0].length) };
    m = /^(\d+(?:[.,]\d+)?)(?:\s*(?:-|–|a|à|ou)\s*\d+(?:[.,]\d+)?)?/.exec(s); if (m) return { q: parseFloat(m[1].replace(",", ".")), rest: s.slice(m[0].length) };
    return { q: null, rest: s };
  }
  // « 200 g de bœuf haché » → { key, qty, unit } ; « sel, poivre » → placard. Retourne une liste (une ligne peut en contenir plusieurs).
  function parseIngredientLine(raw) {
    let line = String(raw).replace(/^[-•*·\s]+/, "").replace(/\s+/g, " ").trim();
    if (!line) return [];
    line = line.replace(/\s*\(.*?\)\s*/g, " ").trim();
    let { q, rest } = parseQty(line);
    rest = rest.trim();
    if (q === null && rest.includes(",")) return rest.split(",").flatMap(parseIngredientLine);
    let unit = null;
    const tokens = rest.split(" ");
    for (let n = Math.min(4, tokens.length); n >= 1 && !unit; n--) {
      const cand = strip(tokens.slice(0, n).join(" ")).replace(/\.$/, "");
      const hit = UNIT_ALIASES.find(([, rx]) => rx.test(cand));
      if (hit) { unit = hit[0]; rest = tokens.slice(n).join(" "); }
    }
    rest = rest.replace(/^(de la |de l'|des |du |de |d')/i, "").trim();
    let name = rest.replace(/[.,;:]+$/, "").trim() || String(raw).trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (unit === "kg") { q = (q === null ? 1 : q) * 1000; unit = "g"; }
    else if (unit === "l") { q = (q === null ? 1 : q) * 100; unit = "cl"; }
    else if (unit === "dl") { q = (q === null ? 1 : q) * 10; unit = "cl"; }
    else if (unit === "ml") { q = Math.round(q === null ? 10 : q) / 10; unit = "cl"; }
    else if (unit === "verre") { q = (q === null ? 1 : q) * 15; unit = "cl"; }
    else if (unit === "tasse") { q = (q === null ? 1 : q) * 25; unit = "cl"; }
    const sname = singular(strip(name));
    const nameRx = sname.length >= 4 ? new RegExp("\\b" + rxEsc(sname) + "\\b") : null;
    // 1) libellé identique ; 2) libellé contenu dans le nom (le plus long) ; 3) nom contenu dans un libellé (le plus court).
    const hit = ING_INDEX.find(([, lbl]) => lbl === sname)
      || ING_INDEX.find(([, , rx]) => rx.test(sname))
      || (nameRx && ING_INDEX.filter(([, lbl]) => nameRx.test(lbl)).sort((a, b) => a[1].length - b[1].length)[0]);
    const warn = PORK_RX.test(strip(name)) ? "porc" : (ALCOHOL_RX.test(strip(name)) ? "alcool" : null);
    const pantry = unit === "pincee" || (!hit && PANTRY_RX.test(strip(name)) && (q === null || unit === null || unit === "cs" || unit === "cc"));
    if (pantry) return [{ pantry: true, name: name.charAt(0).toLowerCase() + name.slice(1), warn }];
    return [{ key: hit ? hit[0] : "~" + guessAisle(name) + "~" + name, qty: q === null ? 1 : q, unit: unit || "pc", name, warn }];
  }
  function guessAisle(name) { const s = strip(name); const hit = AISLE_RX.find(([, rx]) => rx.test(s)); return hit ? hit[0] : "epicerie"; }
  // Quantité ramenée à 2 personnes, arrondie pour l'achat.
  function toBase(q, unit, servings) {
    const v = q * BASE_PERSONS / servings;
    if (unit === "g") return Math.max(5, Math.round(v / 5) * 5);
    return Math.max(0.5, Math.round(v * 2) / 2);  // cl, cuillères, pièces, bottes… par demi-unité
  }
  function editLine(k, q, u) {
    const label = ingLabel(k);
    const n = Number.isInteger(q) ? String(q) : String(Math.round(q * 100) / 100).replace(".", ",");
    if (u === "pc") return `${n} ${label}`;
    const w = (UNITS[u] || [u, u])[q > 1 ? 1 : 0];
    const low = label.charAt(0).toLowerCase() + label.slice(1);
    return `${n} ${w} ${/^[aeiouyhàâéèêîôûœ]/i.test(label) ? "d'" + low : "de " + low}`;
  }
  function warnBox(text) {
    const bad = String(text || "").split(/\n/).map(x => x.trim()).filter(x => x && (PORK_RX.test(strip(x)) || ALCOHOL_RX.test(strip(x))));
    return bad.length ? `<div class="warn-box"><strong>À vérifier</strong> — porc, lardons ou alcool détectés : ${bad.map(esc).join(" · ")}. Modifie ou supprime ces lignes.</div>` : "";
  }
  function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } }
  function guessCat(name, lines) {
    const n = strip(name), ing = strip(lines.join(" "));
    const RX = {
      soupe: /\b(soupe|veloute|potage|minestrone|chorba|harira|bouillon)\b/, salade: /\bsalade\b/,
      oeufs: /\b(quiche|omelette|oeufs?|croque|tarte salee|galette|frittata|tortilla)\b/,
      pates: /\b(pates|spaghetti|penne|tagliatelle|risotto|lasagne|gnocchi|nouilles|ramen|paella|riz)\b/,
      poisson: /\b(saumon|cabillaud|poisson|crevette|thon|truite|moule|gambas|dorade|daurade|colin|lieu|merlu|sardine|calamar|lotte|maquereau|bar|loup|sole|rouget)\b/,
      volaille: /\b(poulet|dinde|volaille|canard|pintade|poule)\b/,
      viande: /\b(boeuf|veau|agneau|mouton|steak|viande|merguez|kefta|kafta|bavette|entrecote|roti de boeuf)\b/,
    };
    // Le nom du plat d'abord (« tajine de poisson » reste un poisson même avec de l'ail haché), les ingrédients ensuite.
    for (const k of ["soupe", "salade", "oeufs", "pates", "poisson", "volaille", "viande"]) if (RX[k].test(n)) return k;
    for (const k of ["poisson", "volaille", "viande"]) if (RX[k].test(ing)) return k;
    return "vege";
  }
  function guessCui(hint, name) {
    const s = strip(hint + " " + name);
    const map = [["ma", /maroc|tajine|tagine|couscous/], ["lb", /liban|levant|beyrouth/], ["sy", /syri|alep|damas/], ["it", /ital|pizza|pasta|risotto|lasagne/], ["jp", /japon|teriyaki|ramen|sushi|udon|soba/], ["cn", /chin|cantonais|wok|sichuan/], ["as", /thai|viet|pho|pad|bo bun|indones|malais|coreen|coree/], ["in", /ind(e|ien)|curry|masala|tikka|dahl|dal\b/], ["mx", /mexic|tex|tacos|fajita|burrito|quesadilla/], ["med", /grec|espagn|mediterran|turc|turq|portug/], ["us", /americ|etats-unis|burger/], ["fr", /franc/]];
    const hit = map.find(([, rx]) => rx.test(s));
    return hit ? hit[0] : "fr";
  }
  // Fiche structurée (schema.org/Recipe) publiée par la plupart des sites de recettes.
  function findRecipeLd(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const found = [];
    const seen = new Set();
    const visit = (o, depth) => {
      if (!o || typeof o !== "object" || depth > 6 || seen.has(o)) return;
      seen.add(o);
      if (Array.isArray(o)) { o.forEach(x => visit(x, depth + 1)); return; }
      const t = o["@type"]; const types = Array.isArray(t) ? t : [t];
      if (types.some(x => typeof x === "string" && /recipe$/i.test(x))) found.push(o);
      Object.values(o).forEach(v => visit(v, depth + 1));
    };
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(sc => { try { visit(JSON.parse(sc.textContent), 0); } catch (e) { /* bloc invalide */ } });
    const og = doc.querySelector('meta[property="og:title"]');
    return { recipe: found.find(r => r.recipeIngredient || r.ingredients) || found[0] || null, title: (og && og.content) || doc.title || "" };
  }
  function draftFromLd(ld, url, title) {
    const text = v => { if (v == null) return ""; if (typeof v === "string") return v; if (Array.isArray(v)) return v.map(text).filter(Boolean).join("\n"); if (typeof v === "object") return v.itemListElement ? text(v.itemListElement) : text(v.text || v.name || ""); return String(v); };
    const ta = document.createElement("textarea");
    const clean = s => {
      let t = String(s).replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|div)>/gi, "\n").replace(/<[^>]+>/g, " ");
      for (let i = 0; i < 3 && /&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(t); i++) { ta.innerHTML = t; t = ta.value; }  // certains sites encodent deux fois
      return t.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\s+([.,;:!?])/g, "$1").replace(/([.:;!?])(?=[A-ZÀ-ÝŒ])/g, "$1 ").replace(/ *\n */g, "\n").trim();
    };
    const steps = clean(text(ld.recipeInstructions)).split(/\n+/).map(s => s.replace(/^\s*(\d+\s*[.)-]|etape\s*\d+\s*:?|étape\s*\d+\s*:?)\s*/i, "").trim()).filter(Boolean);
    const ingLines = (Array.isArray(ld.recipeIngredient) ? ld.recipeIngredient : (Array.isArray(ld.ingredients) ? ld.ingredients : [])).map(clean).filter(Boolean);
    const yieldText = Array.isArray(ld.recipeYield) ? ld.recipeYield.join(" ") : String(ld.recipeYield || "");
    const servings = parseInt((yieldText.match(/\d+/) || [""])[0], 10) || "";
    const dur = s => { const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(String(s || "")); return m ? (+(m[1] || 0)) * 1440 + (+(m[2] || 0)) * 60 + (+(m[3] || 0)) : 0; };
    const time = dur(ld.totalTime) || (dur(ld.prepTime) + dur(ld.cookTime)) || 30;
    const name = clean(text(ld.name)) || clean(title);
    const imgOf = v => { if (!v) return ""; if (typeof v === "string") return v; if (Array.isArray(v)) return imgOf(v[0]); if (typeof v === "object") return imgOf(v.url || v.contentUrl || ""); return ""; };
    const image = /^https?:\/\//.test(imgOf(ld.image)) ? imgOf(ld.image) : "";
    return { url, name, servings, image, time: Math.max(5, Math.min(300, time)), ingText: ingLines.join("\n"), stepsText: steps.join("\n"), pantryText: "",
      cat: guessCat(name, ingLines), cui: guessCui(clean(text(ld.recipeCuisine)), name), diets: [], slots: ["midi", "soir"] };
  }
  // Lecture d'une page : via la coque Android quand elle est là, sinon fetch (souvent refusé par les sites).
  const pendingFetch = {};
  window.__fetchResult = (id, ok, text) => { const p = pendingFetch[id]; if (!p) return; delete pendingFetch[id]; if (ok) p.resolve(text); else p.reject(new Error(text || "fetch")); };
  function fetchPage(url) {
    if (window.Android && typeof window.Android.fetchUrl === "function") {
      return new Promise((resolve, reject) => {
        const id = "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        pendingFetch[id] = { resolve, reject };
        window.Android.fetchUrl(url, id);
        setTimeout(() => { if (pendingFetch[id]) { delete pendingFetch[id]; reject(new Error("timeout")); } }, 30000);
      });
    }
    return fetch(url, { mode: "cors" }).then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); });
  }
  function importFromUrl(url) {
    fetchPage(url).then(html => {
      if (!ui.form || ui.form.url !== url) return;  // formulaire fermé ou autre lien entre-temps
      const { recipe, title } = findRecipeLd(html);
      if (!recipe) throw new Error("no-ld");
      const d = draftFromLd(recipe, url, title);
      Object.assign(ui.form, d, { status: `Recette lue${d.servings ? ` — prévue pour ${d.servings} personne${d.servings > 1 ? "s" : ""} sur le site` : " — indique pour combien de personnes elle est prévue"}. Vérifie, corrige si besoin, puis enregistre.` });
      if (ui.sheet && ui.sheet.mode === "form") renderSheet();
    }).catch(err => {
      if (!ui.form || ui.form.url !== url) return;
      ui.form.status = err.message === "no-ld"
        ? "Ce site ne publie pas de fiche lisible automatiquement. Copie la recette dans les champs ci-dessous."
        : (window.Android ? "Impossible de lire cette page (site injoignable ou qui bloque). Tu peux saisir la recette à la main." : "L'import automatique fonctionne dans l'application Android. Ici, saisis la recette à la main.");
      if (ui.sheet && ui.sheet.mode === "form") renderSheet();
    });
  }
  // Moteurs essayés dans l'ordre jusqu'à obtenir des résultats (chacun peut bloquer ponctuellement).
  const SEARCH_ENGINES = [
    { name: "DuckDuckGo", url: q => "https://html.duckduckgo.com/html/?kl=fr-fr&q=" + encodeURIComponent("recette " + q), parse: parseSearchResults },
    { name: "DuckDuckGo", url: q => "https://lite.duckduckgo.com/lite/?kl=fr-fr&q=" + encodeURIComponent("recette " + q), parse: parseSearchResults },
    { name: "Brave", url: q => "https://search.brave.com/search?source=web&q=" + encodeURIComponent("recette " + q), parse: parseBraveResults },
  ];
  function runSearch(qs) {
    const token = ui.web;
    const errors = [];
    const tryEngine = i => {
      if (ui.web !== token) return;
      if (i >= SEARCH_ENGINES.length) {
        ui.web.status = "Aucun résultat pour le moment" + (errors.length ? ` (${errors.join(" · ")})` : "") + ". Réessaie dans quelques minutes, essaie d'autres mots, ou colle un lien.";
        renderSheet(); return;
      }
      const eng = SEARCH_ENGINES[i];
      fetchPage(eng.url(qs)).then(html => {
        if (ui.web !== token) return;
        const results = eng.parse(html);
        if (!results.length) { errors.push(eng.name + (/anomaly|challenge|captcha|bots use/i.test(html) ? " : bloqué" : " : 0 résultat")); return tryEngine(i + 1); }
        ui.web.results = results; ui.web.engine = eng.name;
        ui.web.status = `${results.length} résultat${results.length > 1 ? "s" : ""} — touche une recette pour l'importer.`;
        renderSheet();
      }).catch(err => { errors.push(eng.name + " : " + (err && err.message ? err.message : "erreur")); tryEngine(i + 1); });
    };
    tryEngine(0);
  }
  function parseBraveResults(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const out = [];
    doc.querySelectorAll('.snippet[data-type="web"]').forEach(el => {
      const a = el.querySelector("a[href^='http']");
      if (!a) return;
      const href = a.getAttribute("href");
      const host = hostOf(href);
      if (BLOCKED_HOSTS.some(b => host.includes(b)) || host.includes("brave.com") || out.some(r => r.url === href)) return;
      const t = el.querySelector(".title");
      const sn = el.querySelector(".content, .snippet-description");
      const title = (t ? t.textContent : a.textContent).replace(/\s+/g, " ").trim();
      if (!title) return;
      out.push({ url: href, title, host, snippet: sn ? sn.textContent.replace(/\s+/g, " ").replace(/^\d{1,2} \S+ \d{4} -\s*/, "").trim() : "", known: KNOWN_SITES.some(s => host === s || host.endsWith("." + s)) });
    });
    out.sort((x, y) => (y.known ? 1 : 0) - (x.known ? 1 : 0));
    return out.slice(0, 12);
  }
  // Sites de recettes qui publient des fiches lisibles : affichés en premier.
  const KNOWN_SITES = ["marmiton.org", "750g.com", "cuisineaz.com", "journaldesfemmes.fr", "ptitchef.com", "cuisineactuelle.fr", "femmeactuelle.fr", "academiedugout.fr", "atelierdeschefs.fr", "chefsimon.com", "regal.fr", "papillesetpupilles.fr", "elle.fr", "cuisine-libre.org", "lacuisinedannie.20minutes.fr", "ricardocuisine.com", "recettes.de"];
  const BLOCKED_HOSTS = ["youtube.com", "youtu.be", "pinterest.", "facebook.com", "instagram.com", "tiktok.com", "amazon.", "wikipedia.org", "twitter.com", "x.com", "duckduckgo.com"];
  function parseSearchResults(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const out = [];
    doc.querySelectorAll("a.result__a, a.result-link, a[href*='uddg=']").forEach(a => {
      let href = a.getAttribute("href") || "";
      const m = /[?&]uddg=([^&]+)/.exec(href);
      if (m) { try { href = decodeURIComponent(m[1]); } catch (e) { return; } }
      if (!/^https?:\/\//.test(href)) return;
      const host = hostOf(href);
      if (BLOCKED_HOSTS.some(b => host.includes(b)) || out.some(r => r.url === href)) return;
      const title = a.textContent.replace(/\s+/g, " ").trim();
      if (!title) return;
      const block = a.closest(".result, .links_main, tr");
      let snippet = "";
      if (block) {
        const sn = block.querySelector(".result__snippet, .result-snippet") || (block.nextElementSibling && block.nextElementSibling.querySelector(".result-snippet"));
        if (sn) snippet = sn.textContent.replace(/\s+/g, " ").trim();
      }
      out.push({ url: href, title, host, snippet, known: KNOWN_SITES.some(s => host === s || host.endsWith("." + s)) });
    });
    out.sort((x, y) => (y.known ? 1 : 0) - (x.known ? 1 : 0));
    return out.slice(0, 12);
  }
  function renderWebResults() {
    const w = ui.web || { q: "", status: "", results: [] };
    return `
      <p class="eyebrow">Sur internet</p>
      <h2 id="sheetTitle">« ${esc(w.q)} »</h2>
      <p class="form-status">${esc(w.status)}</p>
      ${w.results.length ? `<div class="catalog web-results">${w.results.map(r => `
        <button class="recipe-row web-result" data-act="webImport" data-url="${esc(r.url)}">
          <span><span class="meal-name">${esc(r.title)}</span><span class="meal-meta"><strong>${esc(r.host)}</strong>${r.known ? " · import direct" : ""}${r.snippet ? " · " + esc(r.snippet) : ""}</span></span>
          <span class="recipe-side">${icon("chevron")}</span>
        </button>`).join("")}</div>` : ""}
      <p class="hint">${w.engine ? `Résultats ${esc(w.engine)}. ` : ""}Les sites marqués « import direct » publient des fiches lisibles : la recette arrive pré-remplie, avec les quantités converties pour ton nombre de personnes. Porc, lardons et alcool sont signalés avant l'enregistrement.</p>`;
  }
  function readForm() {
    const f = Object.assign({}, ui.form || {});
    const v = id => { const el = $("#" + id); return el ? el.value : (f[id] !== undefined ? f[id] : ""); };
    if ($("#fUrl")) f.url = v("fUrl").trim();
    if ($("#fName")) {
      f.name = v("fName"); f.servings = v("fServ"); f.time = v("fTime"); f.cat = v("fCat"); f.cui = v("fCui");
      f.diets = [...document.querySelectorAll('input[name="fDiet"]:checked')].map(i => i.value);
      f.slots = [...document.querySelectorAll('input[name="fSlot"]:checked')].map(i => i.value);
      f.ingText = v("fIng"); f.pantryText = v("fPantry"); f.stepsText = v("fSteps");
    }
    return f;
  }
  function renderForm() {
    const f = ui.form || {};
    const opt = (obj, val) => Object.entries(obj).map(([k, v]) => `<option value="${k}" ${k === val ? "selected" : ""}>${esc(v)}</option>`).join("");
    const slots = f.slots || ["midi", "soir"];
    return `
      <p class="eyebrow">${f.id ? "Modifier la recette" : "Nouvelle recette"}</p>
      <h2 id="sheetTitle">${f.id ? esc(f.name) : "Ajouter une recette"}</h2>
      ${f.id ? "" : `<div class="import-row"><input id="fUrl" type="url" inputmode="url" placeholder="Lien d'une recette (Marmiton, 750g, CuisineAZ…)" value="${esc(f.url || "")}"><button class="btn btn-accent" data-act="importUrl">Importer</button></div>`}
      ${f.status ? `<p class="form-status">${esc(f.status)}</p>` : `<p class="hint">Colle un lien et touche Importer, ou remplis les champs à la main.</p>`}
      ${f.image ? `<figure class="dish dish-small"><img src="${esc(f.image)}" alt="" referrerpolicy="no-referrer" onerror="this.parentNode.hidden=true"><figcaption>Photo du site, enregistrée avec la recette</figcaption></figure>` : ""}
      <label class="field"><span>Nom du plat</span><input id="fName" value="${esc(f.name || "")}" placeholder="Ex. Gratin de courgettes au chèvre"></label>
      <div class="field-row">
        <label class="field"><span>Prévue pour (personnes)</span><input id="fServ" type="number" inputmode="numeric" min="1" max="20" value="${esc(f.servings || "")}" placeholder="4"></label>
        <label class="field"><span>Temps total (min)</span><input id="fTime" type="number" inputmode="numeric" min="5" max="300" value="${esc(f.time || "")}" placeholder="30"></label>
      </div>
      <div class="field-row">
        <label class="field"><span>Famille</span><select id="fCat">${opt(CATS, f.cat || "vege")}</select></label>
        <label class="field"><span>Cuisine</span><select id="fCui">${opt(CUISINES, f.cui || "fr")}</select></label>
      </div>
      <div class="field"><span>Régimes</span><div class="checks">${Object.entries(DIETS).map(([k, v]) => `<label><input type="checkbox" name="fDiet" value="${k}" ${(f.diets || []).includes(k) ? "checked" : ""}> ${esc(v)}</label>`).join("")}</div></div>
      <div class="field"><span>Proposer au</span><div class="checks"><label><input type="checkbox" name="fSlot" value="midi" ${slots.includes("midi") ? "checked" : ""}> Déjeuner</label><label><input type="checkbox" name="fSlot" value="soir" ${slots.includes("soir") ? "checked" : ""}> Dîner</label></div></div>
      <label class="field"><span>Ingrédients — un par ligne, avec la quantité (« 200 g de bœuf haché », « 2 oignons », « 1 c. à soupe d'huile »)</span><textarea id="fIng" rows="8">${esc(f.ingText || "")}</textarea></label>
      <div id="fWarn">${warnBox(f.ingText)}</div>
      <label class="field"><span>Du placard — sel, huile, épices… séparés par des virgules</span><input id="fPantry" value="${esc(f.pantryText || "")}"></label>
      <label class="field"><span>Préparation — une étape par ligne</span><textarea id="fSteps" rows="8">${esc(f.stepsText || "")}</textarea></label>
      <p class="hint">À l'enregistrement, les quantités sont converties pour 2 personnes ; elles suivent ensuite le sélecteur de personnes comme les autres recettes.</p>`;
  }
  function repairPlan() {
    let fixed = 0;
    state.plan.forEach((d, day) => SLOTS.forEach(slot => { if (!BY_ID[d[slot]]) { d[slot] = null; d[slot] = pick(day, slot, state.plan, null); fixed++; } }));
    if (fixed) save();
  }

  // Photo du plat : celle du site pour une recette importée, sinon l'illustration Wikimedia Commons de la base.
  function dishFigure(r) {
    const src = r.image || r.img;
    if (!src) return "";
    const credit = r.image
      ? `Photo : ${esc(hostOf(r.source || src))}`
      : `Photo : <a href="${esc(r.imgPage || "https://commons.wikimedia.org")}" target="_blank" rel="noopener">Wikimedia Commons</a> · illustration du plat`;
    return `<figure class="dish"><img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.hidden=true"><figcaption>${credit}</figcaption></figure>`;
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  /* ---------- Actions ---------- */
  function slotName(day, slot) { return `${DAYS[day]} ${slot}`; }

  function onAction(act, el) {
    const mealEl = el.closest(".meal");
    const day = mealEl ? +mealEl.dataset.day : (ui.sheet && ui.sheet.ctx ? ui.sheet.ctx.day : null);
    const slot = mealEl ? mealEl.dataset.slot : (ui.sheet && ui.sheet.ctx ? ui.sheet.ctx.slot : null);
    switch (act) {
      case "newWeek": {
        const locks = state.plan.filter(d => d.lockMidi).length + state.plan.filter(d => d.lockSoir).length;
        newWeek(); render(); window.scrollTo(0, 0);
        toast(locks ? `Nouvelle semaine — ${locks} repas verrouillé${locks > 1 ? "s" : ""} conservé${locks > 1 ? "s" : ""}` : "Nouvelle semaine générée");
        break;
      }
      case "goCourses": ui.tab = "courses"; render(); window.scrollTo(0, 0); break;
      case "newRecipe": ui.form = { ingText: "", stepsText: "", pantryText: "", slots: ["midi", "soir"], diets: [], cat: "vege", cui: "fr" }; ui.sheet = { mode: "form" }; renderSheet(); break;
      case "cancelForm": ui.sheet = null; ui.form = null; renderSheet(); break;
      case "webSearch": {
        const qs = ui.search.trim() || (ui.web && ui.web.q) || "";
        if (qs.length < 3) break;
        if (!window.Android || typeof window.Android.fetchUrl !== "function") {
          const inWebView = /; wv\)/.test(navigator.userAgent);
          ui.web = { q: qs, status: inWebView
            ? "Cette version de l'application ne sait pas encore chercher sur internet : installe la nouvelle version (build 7 ou plus) quand elle t'est proposée à l'ouverture, ou depuis la page des Releases."
            : "La recherche sur internet fonctionne dans l'application Android. Ici, colle un lien ou saisis la recette à la main.", results: [], engine: "" };
          ui.sheet = { mode: "web" }; renderSheet(); break;
        }
        ui.web = { q: qs, status: "Recherche sur internet…", results: [], engine: "" };
        ui.sheet = { mode: "web" }; renderSheet();
        runSearch(qs);
        break;
      }
      case "webImport": {
        ui.form = { url: el.dataset.url, ingText: "", stepsText: "", pantryText: "", slots: ["midi", "soir"], diets: [], cat: "vege", cui: "fr", status: "Lecture de la page…" };
        ui.sheet = { mode: "form" }; renderSheet();
        importFromUrl(el.dataset.url);
        break;
      }
      case "importUrl": {
        const f = readForm();
        const url = (f.url || "").trim();
        if (!/^https?:\/\//i.test(url)) { f.status = "Colle l'adresse complète de la recette (elle commence par http)."; ui.form = f; renderSheet(); break; }
        f.status = "Lecture de la page…"; ui.form = f; renderSheet();
        importFromUrl(url);
        break;
      }
      case "saveRecipe": {
        const f = readForm();
        const lines = (f.ingText || "").split(/\n/).map(x => x.trim()).filter(Boolean);
        const steps = (f.stepsText || "").split(/\n/).map(x => x.replace(/^\s*(\d+[.)]\s*)/, "").trim()).filter(Boolean);
        const missing = [];
        if (!(f.name || "").trim()) missing.push("le nom");
        if (!lines.length) missing.push("au moins un ingrédient");
        if (!steps.length) missing.push("au moins une étape");
        if (missing.length) { f.status = "Il manque : " + missing.join(", ") + "."; ui.form = f; renderSheet(); break; }
        const serv = Math.max(1, Math.min(20, parseInt(f.servings, 10) || BASE_PERSONS));
        const parsed = lines.flatMap(parseIngredientLine);
        const ing = parsed.filter(x => !x.pantry).map(x => [x.key, toBase(x.qty, x.unit, serv), x.unit]);
        const pantry = [...new Set(parsed.filter(x => x.pantry).map(x => x.name).concat((f.pantryText || "").split(",").map(x => x.trim()).filter(Boolean)))];
        const rec = { id: f.id || "custom-" + Date.now().toString(36), name: f.name.trim(), cat: CATS[f.cat] ? f.cat : "vege", cui: CUISINES[f.cui] ? f.cui : "fr",
          time: Math.max(5, Math.min(300, parseInt(f.time, 10) || 30)), slots: f.slots && f.slots.length ? f.slots : ["midi", "soir"], diet: f.diets || [],
          ing, pantry, steps, custom: true, source: f.url || "", image: f.image || "" };
        const idx = state.custom.findIndex(x => x.id === rec.id);
        if (idx >= 0) state.custom[idx] = rec; else state.custom.push(rec);
        rebuildIndex(); save();
        ui.form = null; ui.sheet = { id: rec.id, ctx: null, mode: "detail" }; ui.tab = "recettes"; ui.search = ""; render();
        toast(`${rec.name} enregistrée`);
        break;
      }
      case "editRecipe": {
        const r = BY_ID[ui.sheet.id];
        ui.form = { id: r.id, url: r.source || "", image: r.image || "", name: r.name, servings: BASE_PERSONS, time: r.time, cat: r.cat, cui: r.cui, diets: r.diet || [], slots: r.slots,
          ingText: r.ing.map(([k, q, u]) => editLine(k, q, u)).join("\n"), pantryText: (r.pantry || []).join(", "), stepsText: r.steps.join("\n") };
        ui.sheet = { mode: "form" }; renderSheet(); break;
      }
      case "deleteRecipe": {
        if (!ui.sheet.confirmDelete) { ui.sheet.confirmDelete = true; renderSheet(); break; }
        const id = ui.sheet.id;
        state.custom = state.custom.filter(x => x.id !== id);
        state.excluded = state.excluded.filter(x => x !== id);
        Object.keys(state.history).forEach(k => { state.history[k] = state.history[k].filter(x => x !== id); });
        rebuildIndex();
        state.plan.forEach((d, day) => SLOTS.forEach(slot => { if (d[slot] === id) { d[slot] = null; d[slot] = pick(day, slot, state.plan, null); } }));
        save(); ui.sheet = null; render(); toast("Recette supprimée"); break;
      }
      case "toggleDiet": {
        const res = toggleDiet(el.dataset.diet);
        render();
        const name = DIETS[el.dataset.diet];
        toast(res.active
          ? `${name} activé${res.replaced ? ` — ${res.replaced} repas remplacé${res.replaced > 1 ? "s" : ""}` : ""}`
          : `${name} désactivé`);
        break;
      }
      case "personsMinus":
      case "personsPlus": {
        const next = Math.min(PERSONS_MAX, Math.max(PERSONS_MIN, state.persons + (act === "personsPlus" ? 1 : -1)));
        if (next === state.persons) break;
        state.persons = next; save(); render();
        toast(`Quantités pour ${personsLabel()}`);
        break;
      }
      case "open": ui.sheet = { id: state.plan[day][slot], ctx: { day, slot }, mode: "detail" }; renderSheet(); break;
      case "lock": toggleLock(day, slot); render(); break;
      case "clearSelection": ui.selected.clear(); render(); break;
      case "replaceSelected": {
        const names = replaceSelected(); render();
        toast(names.length === 1 ? `Remplacé par : ${names[0]}` : `${names.length} repas remplacés`);
        break;
      }
      case "closeSheet": ui.sheet = null; renderSheet(); break;
      case "sheetBack": ui.sheet.mode = "detail"; renderSheet(); break;
      case "sheetSwap": { const r = swap(day, slot); ui.sheet.id = r.id; render(); break; }
      case "sheetLock": toggleLock(day, slot); render(); break;
      case "sheetExclude": {
        const id = ui.sheet.id;
        const res = toggleExclude(id);
        const c = ui.sheet.ctx;
        if (res.excluded && c) { ui.sheet.id = state.plan[c.day][c.slot]; }
        render();
        toast(res.excluded
          ? `${BY_ID[id].name} ne sera plus proposée${res.replaced ? ` — ${res.replaced} repas remplacé${res.replaced > 1 ? "s" : ""}` : ""}`
          : `${BY_ID[id].name} peut de nouveau être proposée`);
        break;
      }
      case "sheetPick": ui.picking = { day, slot }; ui.sheet = null; ui.tab = "recettes"; ui.search = ""; ui.cat = "all"; ui.cui = "all"; render(); window.scrollTo(0, 0); break;
      case "cancelPick": ui.picking = null; ui.tab = "semaine"; render(); break;
      case "openRecipe": ui.sheet = { id: el.dataset.id, ctx: null, mode: "detail" }; renderSheet(); break;
      case "pickRecipe": {
        const p = ui.picking; setMeal(p.day, p.slot, el.dataset.id); ui.picking = null; ui.tab = "semaine"; render();
        toast(`${slotName(p.day, p.slot)} : ${BY_ID[el.dataset.id].name}`); break;
      }
      case "sheetSlots": ui.sheet.mode = "slots"; renderSheet(); break;
      case "placeAt": {
        const d = +el.dataset.day, sl = el.dataset.slot; const id = ui.sheet.id;
        setMeal(d, sl, id); ui.sheet = null; ui.tab = "semaine"; render();
        toast(`${slotName(d, sl)} : ${BY_ID[id].name}`); break;
      }
      case "uncheck": state.checked = {}; save(); render(); break;
      case "share": {
        const text = shoppingText();
        if (navigator.share) {
          navigator.share({ title: "Liste de courses", text }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => toast("Liste copiée dans le presse-papiers")).catch(() => toast("Impossible de copier la liste"));
        } else toast("Partage non disponible sur ce navigateur");
        break;
      }
    }
  }

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (el) { onAction(el.dataset.act, el); return; }
    const tab = e.target.closest(".tab");
    if (tab) { ui.tab = tab.dataset.tab; if (ui.tab !== "recettes") ui.picking = null; render(); window.scrollTo(0, 0); return; }
    const f = e.target.closest(".filter");
    if (f) { ui[f.dataset.filter] = f.dataset.val; render(); }
  });
  document.addEventListener("change", e => {
    const sel = e.target.closest("input[type=checkbox][data-select]");
    if (sel) {
      if (sel.checked) ui.selected.add(sel.dataset.select); else ui.selected.delete(sel.dataset.select);
      render(); return;
    }
    const cb = e.target.closest("input[type=checkbox][data-key]");
    if (!cb) return;
    if (cb.checked) state.checked[cb.dataset.key] = true; else delete state.checked[cb.dataset.key];
    save(); render();
  });
  document.addEventListener("input", e => {
    if (e.target.id === "fIng") { const box = $("#fWarn"); if (box) box.innerHTML = warnBox(e.target.value); return; }
    if (e.target.id !== "searchInput") return;
    ui.search = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const inp = $("#searchInput"); inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (err) { /* type=search sur certains navigateurs */ }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && ui.sheet) { ui.sheet = null; renderSheet(); } });

  /* ---------- Démarrage ---------- */
  if (state) { rebuildIndex(); repairPlan(); } else newWeek();
  render();
  fetch("version.json", { cache: "no-store" }).then(r => r.json()).then(v => { ui.version = v.version; if (ui.tab === "semaine") render(); }).catch(() => {});

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* hébergement sans service worker */ }
  }
})();

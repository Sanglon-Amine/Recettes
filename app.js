(function () {
  "use strict";

  const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const DAYS_SHORT = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const SLOTS = ["midi", "soir"];
  const SLOT_LABEL = { midi: "Déjeuner", soir: "Dîner" };
  const KEY = "menu-semaine-v1";
  const HISTORY_WEEKS = 2; // on évite les plats des 2 semaines précédentes
  const BY_ID = Object.fromEntries(RECIPES.map(r => [r.id, r]));
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
  const ui = { tab: "semaine", picking: null, sheet: null, search: "", cat: "all", cui: "all", selected: new Set(), version: null };
  let toastTimer = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.plan) && s.plan.length === 7 && s.plan.every(d => BY_ID[d.midi] && BY_ID[d.soir])) {
          s.checked = s.checked || {};
          s.excluded = (s.excluded || []).filter(id => BY_ID[id]);
          s.history = s.history || {};
          s.persons = Math.min(PERSONS_MAX, Math.max(PERSONS_MIN, s.persons || BASE_PERSONS));
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
  // En semaine : déjeuner rapide (≤ 25 min), dîner ≤ 60 min. Le week-end, tout est permis (rôti, mijoté…).
  function fits(r, day, slot) {
    if (isWeekend(day)) return true;
    if (!r.slots.includes(slot)) return false;
    return slot === "midi" ? r.time <= 25 : r.time <= 60;
  }
  // On relâche les contraintes une à une si le vivier est vide : d'abord l'historique, puis les exclusions.
  function candidates(day, slot, sets) {
    const base = RECIPES.filter(r => fits(r, day, slot) && !sets.current.has(r.id));
    let pool = base.filter(r => !sets.excluded.has(r.id) && !sets.history.has(r.id));
    if (!pool.length) pool = base.filter(r => !sets.excluded.has(r.id));
    if (!pool.length) pool = base;
    return pool;
  }
  // Choix pondéré : familles et cuisines encore peu présentes d'abord, et jamais deux repas de suite de la même famille.
  function pick(day, slot, plan, prevCat, extraAvoid) {
    const sets = avoidSets(plan, extraAvoid);
    const pool = candidates(day, slot, sets);
    if (!pool.length) return RECIPES[Math.floor(Math.random() * RECIPES.length)].id;
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
    if (!state) state = { excluded: [], history: {}, persons: BASE_PERSONS };
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
        const it = items.get(k) || { k, key, unit, qty: 0, uses: [], aisle: ING[key][1], label: ING[key][0] };
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
    const rows = RECIPES
      .filter(r => ui.cat === "all" || r.cat === ui.cat)
      .filter(r => ui.cui === "all" || r.cui === ui.cui)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.ing.some(([k]) => ING[k][0].toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    const p = ui.picking;
    const chip = (group, val, label, active) => `<button class="filter" data-filter="${group}" data-val="${val}" aria-pressed="${active}">${esc(label)}</button>`;
    return `
      ${p ? `<div class="picking-banner"><span>Choisir pour ${DAYS[p.day]} · ${SLOT_LABEL[p.slot].toLowerCase()}</span><button class="btn btn-ghost" data-act="cancelPick">Annuler</button></div>` : ""}
      <div class="search">${icon("search")}<input type="search" id="searchInput" placeholder="Rechercher un plat ou un ingrédient" value="${esc(ui.search)}" aria-label="Rechercher"></div>
      <div class="filters" role="group" aria-label="Filtrer par cuisine">
        ${chip("cui", "all", "Toutes cuisines", ui.cui === "all")}
        ${Object.entries(CUISINES).map(([k, v]) => chip("cui", k, v, ui.cui === k)).join("")}
      </div>
      <div class="filters" role="group" aria-label="Filtrer par famille">
        ${chip("cat", "all", "Tous les plats", ui.cat === "all")}
        ${Object.entries(CATS).map(([k, v]) => chip("cat", k, v, ui.cat === k)).join("")}
      </div>
      <p class="hint">${rows.length} recette${rows.length > 1 ? "s" : ""}${state.excluded.length ? ` · ${state.excluded.length} exclue${state.excluded.length > 1 ? "s" : ""} des tirages` : ""}</p>
      <div class="catalog">
        ${rows.length ? rows.map(r => `
          <button class="recipe-row${excluded.has(r.id) ? " excluded" : ""}" data-act="${p ? "pickRecipe" : "openRecipe"}" data-id="${r.id}">
            <span><span class="meal-name">${esc(r.name)}</span>${used.has(r.id) ? '<span class="tag tag-ok">au menu</span>' : ""}${excluded.has(r.id) ? '<span class="tag">exclue</span>' : ""}<span class="meal-meta">${esc(CATS[r.cat])} · ${esc(CUISINES[r.cui])}</span></span>
            <span class="recipe-side"><span class="recipe-time">${r.time} min</span>${icon("chevron")}</span>
          </button>`).join("") : `<p class="empty">Aucune recette ne correspond.</p>`}
      </div>`;
  }

  function renderSheet() {
    const root = $("#sheetRoot");
    const s = ui.sheet;
    if (!s) { root.innerHTML = ""; document.body.style.overflow = ""; return; }
    const r = BY_ID[s.id];
    const ctx = s.ctx;
    const isExcluded = state.excluded.includes(r.id);
    let body, actions;
    if (s.mode === "slots") {
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
        <div class="chips"><span class="chip">${r.time} min</span><span class="chip">${esc(CATS[r.cat])}</span><span class="chip">${esc(CUISINES[r.cui])}</span><span class="chip chip-ok">${personsLabel()}</span></div>
        <h3>Ingrédients</h3>
        <ul class="ing">${r.ing.map(([k, q, u]) => `<li><span>${esc(ING[k][0])}</span><span class="qty">${fmtQty(scaleQty(k, q, u), u)}</span></li>`).join("")}</ul>
        ${r.pantry && r.pantry.length ? `<p class="pantry">Du placard : ${esc(r.pantry.join(", "))}.</p>` : ""}
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
           ${excludeBtn}`;
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
    if (e.target.id !== "searchInput") return;
    ui.search = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const inp = $("#searchInput"); inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (err) { /* type=search sur certains navigateurs */ }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && ui.sheet) { ui.sheet = null; renderSheet(); } });

  /* ---------- Démarrage ---------- */
  if (!state) newWeek();
  render();
  fetch("version.json", { cache: "no-store" }).then(r => r.json()).then(v => { ui.version = v.version; if (ui.tab === "semaine") render(); }).catch(() => {});

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* hébergement sans service worker */ }
  }
})();

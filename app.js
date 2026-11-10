/* =========================================================
   Piedra Bruta — sitio
   Para agregar un proyecto, copia un objeto de PROJECTS (abajo).
   mood = atmósfera de la foto simulada · sym = gesto de Bruta
   photo = ruta a una imagen real (opcional), p. ej. "assets/miel.jpg"
   ========================================================= */
/* Datos y utilidades compartidas por las opciones de la web */
window.PB_DATA = {
  CATEGORIES: { branding: "Branding", campanas: "Campañas", marcas: "Marcas", digital: "Digital" },
  PROJECTS: [
    { photo: "", title: "Identidad para organizadora de eventos", client: "Organizadora de música electrónica", category: "branding", mood: "fogata", sym: "baila", year: "2025", summary: "Branding para eventos de música electrónica. Descripción pendiente.", metric: "" },
    { photo: "", title: "Identidad para despacho de abogados", client: "Despacho jurídico", category: "branding", mood: "papelnoche", sym: "bruta", year: "2025", summary: "Branding para despacho de abogados. Descripción pendiente.", metric: "" },
    { photo: "", title: "Tarjetas de fidelización en Apple y Google Wallet", client: "App de fidelización", category: "digital", mood: "mar", sym: "idea", year: "2025", summary: "Digitalización de tarjetas de fidelización en Apple Wallet y Google Wallet. Ya cuenta con web.", metric: "" },
    { photo: "", title: "Branding para dentistas", client: "Consultorio dental", category: "branding", mood: "niebla", sym: "guino", year: "2025", summary: "Identidad para consultorio dental. Descripción pendiente.", metric: "" },
    { photo: "", title: "Marca de miel", client: "Miel", category: "marcas", mood: "cempasuchil", sym: "enamorada", year: "2025", summary: "Marca para producto de miel. Descripción pendiente.", metric: "" },
    { photo: "", title: "Marca de mole", client: "Mole", category: "marcas", mood: "tierra", sym: "molcajete", year: "2025", summary: "Marca para producto de mole. Descripción pendiente.", metric: "" },
    { photo: "", title: "Branding para entrenador fitness", client: "Entrenador fitness", category: "branding", mood: "desierto", sym: "corre", year: "2025", summary: "Identidad para entrenador fitness. Descripción pendiente.", metric: "" },
    { photo: "", title: "Campaña JEEP", client: "JEEP", category: "campanas", mood: "carretera", sym: "salta", year: "2025", summary: "Campañas publicitarias para la marca JEEP. Descripción pendiente.", metric: "150+ autos vendidos" },
  ],
  SERVICES: ["Estrategia y marketing", "Branding e identidad", "Campañas publicitarias", "Redes sociales y contenido", "Fotografía y video", "Sitios web y digital"],
};
/* Pinta la foto de un contenedor: imagen real si tiene ruta en data-photo, si no la foto simulada */
window.paintPhoto = (el, mood, seed, photo) => {
  const old = el.querySelector(".photo");
  if (photo) {
    if (old && old.tagName === "IMG" && old.getAttribute("src") === photo) return;
    const img = document.createElement("img"); img.className = "photo"; img.src = photo; img.alt = ""; img.loading = "lazy";
    old ? old.replaceWith(img) : el.prepend(img); return;
  }
  let c = old;
  if (!c || c.tagName !== "CANVAS") { c = document.createElement("canvas"); c.className = "photo"; old ? old.replaceWith(c) : el.prepend(c); }
  window.Marca.drawPhoto(c, mood, seed);
};
window.paintAll = (root = document) => {
  root.querySelectorAll("[data-mood]").forEach((el) => window.paintPhoto(el, el.dataset.mood, +(el.dataset.seed || 1), el.dataset.photo));
  requestAnimationFrame(() => window.Marca.fixStrokes(root));
};

const { PROJECTS, CATEGORIES, SERVICES } = PB_DATA, M = window.Marca;
document.querySelectorAll("[data-s]").forEach((e) => (e.innerHTML = M.symSVG(e.dataset.s)));
document.getElementById("svc").innerHTML = SERVICES.slice(2).join("<br>");
const N = (i) => String(i + 1).padStart(2, "0");
let filter = "todos", view = "list", current = 0, list = PROJECTS.map((p, i) => ({ ...p, i }));
function filters() {
  const f = document.getElementById("filters");
  f.innerHTML = [["todos", "Todos"], ...Object.entries(CATEGORIES)].map(([k, l]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${k === filter}">${l}</button>`).join("");
  f.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; render(); }));
}
function setStage(p) {
  const st = document.getElementById("stage");
  st.querySelector(".n").textContent = N(p.i);
  st.querySelector(".c").textContent = CATEGORIES[p.category];
  st.querySelector(".sym").innerHTML = M.symSVG(p.sym);
  const me = st.querySelector(".metric"); me.hidden = !p.metric; me.textContent = p.metric;
  paintPhoto(st, p.mood, 10 + p.i, p.photo);
  document.getElementById("stage-client").textContent = p.client;
  document.getElementById("stage-year").textContent = p.year;
  M.fixStrokes(st);
  document.querySelectorAll(".row").forEach((r) => r.classList.toggle("on", +r.dataset.i === p.i));
}
let io;
function render() {
  filters();
  list = PROJECTS.map((p, i) => ({ ...p, i })).filter((p) => filter === "todos" || p.category === filter);
  document.getElementById("count").textContent = `(${list.length})`;
  document.getElementById("rows").innerHTML = list.map((p) => `<button class="row" type="button" data-i="${p.i}">
      <span class="thumb onphoto" data-mood="${p.mood}" data-seed="${10 + p.i}" data-photo="${p.photo || ""}"><canvas class="photo"></canvas><span class="n mono">${N(p.i)}</span><span class="sym">${M.symSVG(p.sym)}</span></span>
      <span class="mono num">${N(p.i)}</span>
      <span><span class="ti">${p.title}</span><span class="cl mono">${CATEGORIES[p.category]} · ${p.client}${p.metric ? " · " + p.metric : ""}</span></span>
      <span class="mono go">Ver caso →</span></button>`).join("");
  // Mosaico: una pieza grande y dos chicas; si al final queda una sola, también va grande
  const big = list.map((_, k) => k % 6 === 0 || k % 6 === 3);
  let tail = 0; for (let k = list.length - 1; k >= 0 && !big[k]; k--) tail++;
  if (tail % 2) big[list.length - 1] = true;
  document.getElementById("grid-view").innerHTML = list.map((p, k) => `<button class="tile${big[k] ? " big" : ""}" type="button" data-i="${p.i}">
      <span class="pv onphoto" data-mood="${p.mood}" data-seed="${10 + p.i}" data-photo="${p.photo || ""}"><canvas class="photo"></canvas><span class="n mono">${N(p.i)}</span><span class="c mono">${CATEGORIES[p.category]}</span><span class="sym">${M.symSVG(p.sym)}</span><span class="tt">${p.title}</span></span>
      <span class="meta mono"><span>${p.client}</span><span>${p.metric || p.year}</span></span></button>`).join("");
  document.querySelectorAll(".row, .tile").forEach((el) => {
    el.addEventListener("click", () => openCase(+el.dataset.i));
    if (el.classList.contains("row")) { el.addEventListener("mouseenter", () => setStage(PROJECTS[+el.dataset.i] && { ...PROJECTS[+el.dataset.i], i: +el.dataset.i })); el.addEventListener("focus", () => setStage({ ...PROJECTS[+el.dataset.i], i: +el.dataset.i })); }
  });
  document.getElementById("list-view").hidden = view !== "list";
  document.getElementById("grid-view").hidden = view !== "grid";
  document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
  if (list.length) setStage(list[0]);
  paintAll(document.getElementById("trabajos"));
  // Sin mouse: el proyecto frente a ti al hacer scroll se vuelve el activo
  if (io) io.disconnect();
  io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting && matchMedia("(min-width: 861px)").matches) setStage({ ...PROJECTS[+e.target.dataset.i], i: +e.target.dataset.i }); }), { rootMargin: "-45% 0px -45% 0px" });
  document.querySelectorAll(".row").forEach((r) => io.observe(r));
}
document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => { view = b.dataset.view; render(); }));
/* Ficha */
const cs = document.getElementById("case");
let lastFocus = null;
function openCase(i) {
  current = list.findIndex((p) => p.i === i); if (current < 0) current = 0;
  const p = list[current];
  document.getElementById("case-kicker").textContent = `${N(p.i)} · ${CATEGORIES[p.category]}`;
  document.getElementById("case-title").textContent = p.title;
  document.getElementById("case-dl").innerHTML = [["Cliente", p.client], ["Categoría", CATEGORIES[p.category]], ["Año", p.year], ...(p.metric ? [["Resultado", p.metric]] : [])].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  document.getElementById("case-sum").textContent = p.summary;
  const cv = document.getElementById("case-cv"); cv.querySelector(".sym").innerHTML = M.symSVG(p.sym);
  if (!cs.classList.contains("open")) lastFocus = document.activeElement;
  cs.classList.add("open"); cs.scrollTop = 0; document.body.style.overflow = "hidden";
  paintPhoto(cv, p.mood, 40 + p.i, p.photo); M.fixStrokes(cv);
  document.getElementById("case-close").focus();
}
function closeCase() { cs.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
document.getElementById("case-close").addEventListener("click", closeCase);
document.getElementById("case-prev").addEventListener("click", () => openCase(list[(current - 1 + list.length) % list.length].i));
document.getElementById("case-next").addEventListener("click", () => openCase(list[(current + 1) % list.length].i));
addEventListener("keydown", (e) => { if (!cs.classList.contains("open")) return; if (e.key === "Escape") closeCase(); if (e.key === "ArrowRight") document.getElementById("case-next").click(); if (e.key === "ArrowLeft") document.getElementById("case-prev").click(); });
render();
paintAll();

/* Estudio y proceso */
document.getElementById("services").innerHTML = SERVICES.map((s) => `<li>${s}</li>`).join("");
document.getElementById("stat-proyectos").textContent = PROJECTS.length;
document.getElementById("steps").innerHTML = [["saluda", "Escuchar", "Conocemos tu negocio, a quién le vendes y qué lo hace distinto."], ["idea", "Idear", "Buscamos el concepto: la idea que sostiene toda la marca."], ["talla", "Tallar", "Diseñamos identidad, piezas y campañas hasta encontrar la forma justa."], ["salta", "Lanzar", "Salimos al mundo: redes, web, impresos y lo que tu marca necesite."]]
  .map(([s, t, d], i) => `<li><span class="mono" style="color:var(--ceniza)">0${i + 1}</span><span class="sym">${M.symSVG(s)}</span><h3>${t}</h3><p>${d}</p></li>`).join("");
paintAll();
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => paintAll(), 250); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => M.fixStrokes(document));

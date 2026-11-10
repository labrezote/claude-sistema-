/* =========================================================
   Piedra Bruta — sitio
   Para agregar un proyecto, copia un objeto de PROJECTS.
   mood = atmósfera de la foto de portada (ver MOODS en marca.js)
   sym  = gesto de Bruta que aparece en la portada del proyecto
   photo = ruta a una imagen real (opcional); si existe, reemplaza la foto simulada
   ========================================================= */

const CATEGORIES = {
  branding: "Branding",
  campanas: "Campañas",
  marcas: "Marcas",
  digital: "Digital",
};

const PROJECTS = [
  { id: "p01", title: "Identidad para organizadora de eventos", client: "Organizadora de música electrónica", category: "branding",
    summary: "Branding para eventos de música electrónica. Descripción pendiente.", metric: "", mood: "fogata", sym: "baila", photo: "" },
  { id: "p02", title: "Identidad para despacho de abogados", client: "Despacho jurídico", category: "branding",
    summary: "Branding para despacho de abogados. Descripción pendiente.", metric: "", mood: "papelnoche", sym: "bruta", photo: "" },
  { id: "p03", title: "Tarjetas de fidelización en Apple y Google Wallet", client: "App de fidelización", category: "digital",
    summary: "Digitalización de tarjetas de fidelización en Apple Wallet y Google Wallet. Ya cuenta con web.", metric: "", mood: "mar", sym: "idea", photo: "" },
  { id: "p04", title: "Branding para dentistas", client: "Consultorio dental", category: "branding",
    summary: "Identidad para consultorio dental. Descripción pendiente.", metric: "", mood: "niebla", sym: "guino", photo: "" },
  { id: "p05", title: "Marca de miel", client: "Miel", category: "marcas",
    summary: "Marca para producto de miel. Descripción pendiente.", metric: "", mood: "cempasuchil", sym: "enamorada", photo: "" },
  { id: "p06", title: "Marca de mole", client: "Mole", category: "marcas",
    summary: "Marca para producto de mole. Descripción pendiente.", metric: "", mood: "tierra", sym: "molcajete", photo: "" },
  { id: "p07", title: "Branding para entrenador fitness", client: "Entrenador fitness", category: "branding",
    summary: "Identidad para entrenador fitness. Descripción pendiente.", metric: "", mood: "desierto", sym: "corre", photo: "" },
  { id: "p08", title: "Campaña JEEP", client: "JEEP", category: "campanas",
    summary: "Campañas publicitarias para la marca JEEP. Descripción pendiente.", metric: "150+ autos vendidos", mood: "carretera", sym: "salta", photo: "" },
];

const STEPS = [
  { sym: "saluda", title: "Escuchar", text: "Conocemos tu negocio, a quién le vendes y qué lo hace distinto." },
  { sym: "idea", title: "Idear", text: "Buscamos el concepto: la idea que sostiene toda la marca." },
  { sym: "talla", title: "Tallar", text: "Diseñamos identidad, piezas y campañas hasta encontrar la forma justa." },
  { sym: "salta", title: "Lanzar", text: "Salimos al mundo: redes, web, impresos y lo que tu marca necesite." },
];

const { symSVG, meltSVG, drawPhoto, fixStrokes } = window.Marca;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Fotos: imagen real si hay ruta, si no la foto simulada ---------- */
function paintPhoto(host, mood, seed, photo) {
  const old = host.querySelector(".photo");
  if (photo) {
    if (old && old.tagName === "IMG" && old.getAttribute("src") === photo) return;
    const img = document.createElement("img");
    img.className = "photo"; img.src = photo; img.alt = ""; img.loading = "lazy";
    old ? old.replaceWith(img) : host.prepend(img);
    return;
  }
  let c = old;
  if (!c || c.tagName !== "CANVAS") { c = document.createElement("canvas"); c.className = "photo"; c.setAttribute("aria-hidden", "true"); old ? old.replaceWith(c) : host.prepend(c); }
  drawPhoto(c, mood, seed);
}
function paintSections() {
  document.querySelectorAll("section[data-mood]").forEach((s) => paintPhoto(s, s.dataset.mood, +s.dataset.seed, s.dataset.photo));
}

/* ---------- Portada, estudio, proceso y contacto ---------- */
document.getElementById("hero-sym").innerHTML = symSVG("bruta");
document.getElementById("hero-melt").insertAdjacentHTML("beforeend", meltSVG(null, { level: "media", outline: false }));
document.getElementById("studio-sym").innerHTML = symSVG("talla");
document.getElementById("contact-sym").innerHTML = symSVG("saluda");
document.getElementById("steps").innerHTML = STEPS.map((s, i) => `
  <li><span class="mono label">${String(i + 1).padStart(2, "0")}</span><span class="sym">${symSVG(s.sym)}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join("");

/* ---------- Trabajos ---------- */
const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const dialog = document.getElementById("caso");
let activeFilter = "todos";

function buildFilters() {
  filters.innerHTML = "";
  [["todos", "Todos"], ...Object.entries(CATEGORIES)].forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "chip"; btn.textContent = label;
    btn.setAttribute("aria-pressed", String(key === activeFilter));
    btn.addEventListener("click", () => { activeFilter = key; buildFilters(); renderGrid(); });
    filters.appendChild(btn);
  });
}

function renderGrid() {
  const list = PROJECTS.filter((p) => activeFilter === "todos" || p.category === activeFilter);
  grid.innerHTML = "";
  document.getElementById("count-visible").textContent = list.length;
  document.getElementById("count-total").textContent = PROJECTS.length;
  if (!list.length) { grid.innerHTML = '<p class="empty mono">Próximamente</p>'; return; }

  list.forEach((p, i) => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "card";
    card.innerHTML = `
      <span class="cover onphoto"><span class="idx mono">${String(i + 1).padStart(2, "0")}</span><span class="sym">${symSVG(p.sym)}</span><span class="tag mono">${CATEGORIES[p.category]}</span></span>
      <span class="card-title"></span><span class="card-client mono"></span>`;
    card.querySelector(".card-title").textContent = p.title;
    card.querySelector(".card-client").textContent = p.client;
    card.addEventListener("click", () => openCase(p));
    grid.appendChild(card);
    paintPhoto(card.querySelector(".cover"), p.mood, 10 + PROJECTS.indexOf(p), p.photo);
  });
  requestAnimationFrame(() => fixStrokes(grid));
}

function openCase(p) {
  document.getElementById("caso-cat").textContent = CATEGORIES[p.category];
  document.getElementById("caso-title").textContent = p.title;
  document.getElementById("caso-client").textContent = p.client;
  document.getElementById("caso-summary").textContent = p.summary;
  const metric = document.getElementById("caso-metric");
  metric.hidden = !p.metric; metric.textContent = p.metric;
  document.getElementById("caso-sym").innerHTML = symSVG(p.sym);
  dialog.showModal();
  const cover = document.getElementById("caso-cover");
  paintPhoto(cover, p.mood, 40 + PROJECTS.indexOf(p), p.photo);
  fixStrokes(cover);
}
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

/* ---------- Navegación: fondo sólido al bajar de la portada ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("solid", scrollY > innerHeight * 0.6);
addEventListener("scroll", onScroll, { passive: true });

/* ---------- Arranque ---------- */
document.getElementById("stat-proyectos").textContent = PROJECTS.length;
document.getElementById("year").textContent = new Date().getFullYear();
buildFilters();
renderGrid();
paintSections();
onScroll();
requestAnimationFrame(() => fixStrokes());
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fixStrokes());
let rt;
addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { paintSections(); renderGrid(); fixStrokes(); }, 250); });

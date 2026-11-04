/* =========================================================
   Studio Crudo — esqueleto del portafolio
   Para agregar un proyecto, copia un objeto de PROJECTS.
   ========================================================= */

const CATEGORIES = {
  branding: "Branding",
  campanas: "Campañas",
  marcas: "Marcas",
  digital: "Digital",
};

const PROJECTS = [
  {
    id: "p01",
    title: "Identidad para organizadora de eventos",
    client: "Organizadora de música electrónica",
    category: "branding",
    summary: "Branding para eventos de música electrónica. Descripción pendiente.",
    metric: "",
    seed: 11,
  },
  {
    id: "p02",
    title: "Identidad para despacho de abogados",
    client: "Despacho jurídico",
    category: "branding",
    summary: "Branding para despacho de abogados. Descripción pendiente.",
    metric: "",
    seed: 23,
  },
  {
    id: "p03",
    title: "Tarjetas de fidelización en Apple y Google Wallet",
    client: "App de fidelización",
    category: "digital",
    summary: "Digitalización de tarjetas de fidelización en Apple Wallet y Google Wallet. Ya cuenta con web.",
    metric: "",
    seed: 37,
  },
  {
    id: "p04",
    title: "Branding para dentistas",
    client: "Consultorio dental",
    category: "branding",
    summary: "Identidad para consultorio dental. Descripción pendiente.",
    metric: "",
    seed: 41,
  },
  {
    id: "p05",
    title: "Marca de miel",
    client: "Miel",
    category: "marcas",
    summary: "Marca para producto de miel. Descripción pendiente.",
    metric: "",
    seed: 53,
  },
  {
    id: "p06",
    title: "Marca de mole",
    client: "Mole",
    category: "marcas",
    summary: "Marca para producto de mole. Descripción pendiente.",
    metric: "",
    seed: 67,
  },
  {
    id: "p07",
    title: "Branding para entrenador fitness",
    client: "Entrenador fitness",
    category: "branding",
    summary: "Identidad para entrenador fitness. Descripción pendiente.",
    metric: "",
    seed: 71,
  },
  {
    id: "p08",
    title: "Campaña JEEP",
    client: "JEEP",
    category: "campanas",
    summary: "Campañas publicitarias para la marca JEEP. Descripción pendiente.",
    metric: "150+ autos vendidos",
    seed: 89,
  },
];

/* ---------- Utilidades ---------- */

// Generador pseudoaleatorio determinista (mulberry32): mismo seed, mismo dibujo
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  ["#0b0b0b", "#f1efe8", "#2336ff"],
  ["#f1efe8", "#0b0b0b", "#ff4d1a"],
  ["#2336ff", "#f1efe8", "#0b0b0b"],
];

// Portada placeholder en píxeles (se reemplaza por la imagen real del caso)
function drawCover(canvas, seed) {
  const W = 16;
  const H = 12;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const rand = rng(seed);
  const [bg, fg, accent] = PALETTES[seed % PALETTES.length];

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const r = rand();
      if (r < 0.38) {
        ctx.fillStyle = fg;
        ctx.fillRect(x, y, 1, 1);
      } else if (r < 0.46) {
        ctx.fillStyle = accent;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

/* ---------- Render: filtros y grid ---------- */

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const countVisible = document.getElementById("count-visible");
const countTotal = document.getElementById("count-total");
const dialog = document.getElementById("caso");

let activeFilter = "todos";

function buildFilters() {
  const options = [["todos", "Todos"], ...Object.entries(CATEGORIES)];
  filters.innerHTML = "";
  for (const [key, label] of options) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", String(key === activeFilter));
    btn.addEventListener("click", () => {
      activeFilter = key;
      buildFilters();
      renderGrid();
    });
    filters.appendChild(btn);
  }
}

function renderGrid() {
  const list = PROJECTS.filter(
    (p) => activeFilter === "todos" || p.category === activeFilter
  );

  grid.innerHTML = "";
  countVisible.textContent = list.length;
  countTotal.textContent = PROJECTS.length;

  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty px";
    empty.textContent = "Próximamente";
    grid.appendChild(empty);
    return;
  }

  list.forEach((p, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";

    const cover = document.createElement("canvas");
    cover.className = "cover";
    drawCover(cover, p.seed);

    const idx = document.createElement("span");
    idx.className = "card-idx px";
    idx.textContent = String(i + 1).padStart(2, "0");

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = p.title;

    const client = document.createElement("p");
    client.className = "card-client";
    client.textContent = p.client;

    const tag = document.createElement("span");
    tag.className = "card-tag";
    tag.textContent = CATEGORIES[p.category];

    card.append(cover, idx, title, client, tag);
    card.addEventListener("click", () => openCase(p));
    grid.appendChild(card);
  });
}

/* ---------- Detalle de proyecto ---------- */

function openCase(p) {
  document.getElementById("caso-cat").textContent = CATEGORIES[p.category];
  document.getElementById("caso-title").textContent = p.title;
  document.getElementById("caso-client").textContent = p.client;
  document.getElementById("caso-summary").textContent = p.summary;

  const metric = document.getElementById("caso-metric");
  metric.hidden = !p.metric;
  metric.textContent = p.metric;

  dialog.showModal();
}

dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  // clic fuera del contenido cierra el diálogo
  if (e.target === dialog) dialog.close();
});

/* ---------- Intro: disolución en bloques de píxel ---------- */

function pixelIntro() {
  const canvas = document.getElementById("intro");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const cell = Math.max(24, Math.round(innerWidth / 26));
  const cols = Math.ceil(canvas.width / cell);
  const rows = Math.ceil(canvas.height / cell);
  const rand = rng(7);
  const delays = Array.from({ length: cols * rows }, () => rand() * 0.7);

  const DURATION = 1400;
  const FADE = 0.3;
  const start = performance.now();

  function frame(now) {
    const p = (now - start) / DURATION;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0b0b0b";

    for (let i = 0; i < delays.length; i++) {
      const d = delays[i];
      const x = (i % cols) * cell;
      const y = Math.floor(i / cols) * cell;
      if (p < d) {
        ctx.fillRect(x, y, cell, cell);
      } else if (p < d + FADE) {
        // bloque que se encoge hasta desaparecer
        const k = 1 - (p - d) / FADE;
        const s = cell * k;
        ctx.fillRect(x + (cell - s) / 2, y + (cell - s) / 2, s, s);
      }
    }

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}

/* ---------- Trail de píxeles con el cursor ---------- */

function pixelTrail() {
  if (!matchMedia("(pointer: fine)").matches) return;
  let last = 0;

  window.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - last < 45) return;
    last = now;

    const dot = document.createElement("div");
    dot.className = "trail";
    dot.style.left = `${Math.round(e.clientX / 10) * 10 - 5}px`;
    dot.style.top = `${Math.round(e.clientY / 10) * 10 - 5}px`;
    document.body.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.opacity = "0";
      dot.style.transform = "scale(0.4)";
    });
    setTimeout(() => dot.remove(), 700);
  });
}

/* ---------- Arranque ---------- */

document.getElementById("stat-proyectos").textContent = PROJECTS.length;
document.getElementById("year").textContent = new Date().getFullYear();

buildFilters();
renderGrid();
pixelIntro();
pixelTrail();

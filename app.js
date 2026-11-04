/* =========================================================
   Piedra Bruta — portafolio
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

/* ---------- Mascota: piedra con ojos de papelería ---------- */

function rockMascot() {
  const stage = document.getElementById("rock-stage");
  const rock = document.getElementById("rock");
  const shadow = document.getElementById("rock-shadow");
  const eyes = [...rock.querySelectorAll(".eye")].map((el) => ({
    el,
    pupil: el.querySelector(".pupil"),
    x: 0, y: 0, vx: 0, vy: 0, max: 10,
  }));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sombra en píxel: elipse de baja resolución que se encoge al saltar
  const SW = 24, SH = 4;
  shadow.width = SW;
  shadow.height = SH;
  const sctx = shadow.getContext("2d");
  function drawShadow(lift) {
    sctx.clearRect(0, 0, SW, SH);
    const k = Math.max(0.35, 1 - lift / 180);
    const rx = (SW / 2) * k, ry = (SH / 2) * k;
    for (let y = 0; y < SH; y++) {
      for (let x = 0; x < SW; x++) {
        const dx = (x + 0.5 - SW / 2) / rx;
        const dy = (y + 0.5 - SH / 2) / ry;
        const d = dx * dx + dy * dy;
        if (d < 1) {
          sctx.fillStyle = d < 0.45 ? `rgba(0,0,0,${0.75 * k})` : `rgba(0,0,0,${0.4 * k})`;
          sctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  function measure() {
    for (const e of eyes) {
      const r = e.el.clientWidth / 2;
      const pr = e.pupil.clientWidth / 2;
      e.max = Math.max(1, r - pr - 1);
    }
  }
  measure();
  addEventListener("resize", measure);

  if (reduce) {
    // Sin animación: pupilas en reposo, abajo
    drawShadow(0);
    for (const e of eyes) e.pupil.style.transform = `translate(0px, ${e.max}px)`;
    return;
  }

  // Estado de la piedra
  const G = 2600;        // gravedad del salto (px/s²)
  const EYE_G = 1500;    // gravedad que sienten las pupilas
  let lift = 0, liftV = 0;          // altura (px, positivo = arriba)
  let ang = 0, angV = 0, angTarget = 0; // inclinación (grados)
  let sq = 0, sqV = 0;              // aplastamiento al caer
  let nextHop = performance.now() + 2200;

  let prev = null, prevV = { x: 0, y: 0 };

  function hop(power, spin = 0) {
    if (lift > 4) return;
    liftV = power;
    angV += spin;
    sqV -= power * 0.0012; // se estira al despegar
  }

  function dust() {
    const base = stage.clientHeight * 0.76;
    for (let i = 0; i < 10; i++) {
      const d = document.createElement("span");
      d.className = "dust" + (i % 3 === 0 ? " blue" : "");
      const size = 4 + Math.round(Math.random() * 2) * 4;
      d.style.width = d.style.height = `${size}px`;
      d.style.left = `${50 + (Math.random() - 0.5) * 50}%`;
      d.style.top = `${base}px`;
      stage.appendChild(d);
      const dx = (Math.random() - 0.5) * 220;
      const dy = -30 - Math.random() * 60;
      d.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${dx * 0.6}px, ${dy}px)`, opacity: 1, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy * 0.3}px)`, opacity: 0 },
        ],
        { duration: 650, easing: "steps(8)" }
      ).onfinish = () => d.remove();
    }
  }

  rock.addEventListener("click", () => {
    hop(620 + Math.random() * 180, (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 120));
    for (const e of eyes) {
      e.vx += (Math.random() - 0.5) * 900;
      e.vy -= 300 + Math.random() * 400;
    }
  });

  // La piedra se inclina un poco hacia el cursor
  addEventListener("pointermove", (ev) => {
    const r = stage.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const dx = (ev.clientX - cx) / (innerWidth / 2);
    angTarget = Math.max(-1, Math.min(1, dx)) * 7;
  });

  let last = performance.now();
  function frame(now) {
    let dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    // Saltitos espontáneos
    if (now > nextHop) {
      hop(300 + Math.random() * 120, (Math.random() - 0.5) * 60);
      nextHop = now + 2500 + Math.random() * 3500;
    }

    // Subpasos para una física estable
    const steps = 3;
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      // salto
      liftV -= G * h;
      lift += liftV * h;
      if (lift <= 0) {
        lift = 0;
        if (liftV < -250) {
          sqV += -liftV * 0.0016;
          if (liftV < -480) dust();
          angV += (Math.random() - 0.5) * 80;
          liftV = -liftV * 0.18;
          if (liftV < 60) liftV = 0;
        } else {
          liftV = 0;
        }
      }
      // inclinación (resorte amortiguado)
      angV += (-(ang - angTarget) * 90 - angV * 9) * h;
      ang += angV * h;
      // aplastamiento (resorte)
      sqV += (-sq * 420 - sqV * 18) * h;
      sq += sqV * h;
    }
    sq = Math.max(-0.18, Math.min(0.22, sq));

    rock.style.transform =
      `translateY(${-lift}px) rotate(${ang}deg) scale(${1 + sq * 0.6}, ${1 - sq})`;
    drawShadow(lift);

    // Aceleración real de la piedra en pantalla (salto + scroll)
    const r = stage.getBoundingClientRect();
    const pos = { x: r.left, y: r.top - lift };
    let ax = 0, ay = 0;
    if (prev && dt > 0) {
      const v = { x: (pos.x - prev.x) / dt, y: (pos.y - prev.y) / dt };
      ax = (v.x - prevV.x) / dt;
      ay = (v.y - prevV.y) / dt;
      prevV = v;
    }
    prev = pos;
    const LIM = 30000;
    ax = Math.max(-LIM, Math.min(LIM, ax));
    ay = Math.max(-LIM, Math.min(LIM, ay));

    // Fuerza que sienten las pupilas, en el marco girado de la piedra
    const fx = -ax, fy = EYE_G - ay;
    const t = (-ang * Math.PI) / 180;
    const c = Math.cos(t), sn = Math.sin(t);
    const lx = fx * c - fy * sn;
    const ly = fx * sn + fy * c;

    for (const e of eyes) {
      for (let i = 0; i < steps; i++) {
        e.vx += lx * h;
        e.vy += ly * h;
        e.vx *= 1 - 2.2 * h;
        e.vy *= 1 - 2.2 * h;
        e.x += e.vx * h;
        e.y += e.vy * h;
        const d = Math.hypot(e.x, e.y);
        if (d > e.max) {
          const nx = e.x / d, ny = e.y / d;
          e.x = nx * e.max;
          e.y = ny * e.max;
          const vn = e.vx * nx + e.vy * ny;
          if (vn > 0) {
            e.vx -= 1.45 * vn * nx; // rebote suave contra el borde
            e.vy -= 1.45 * vn * ny;
          }
          e.vx *= 0.985;
          e.vy *= 0.985;
        }
      }
      e.pupil.style.transform = `translate(${e.x.toFixed(2)}px, ${e.y.toFixed(2)}px)`;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Arranque ---------- */

document.getElementById("stat-proyectos").textContent = PROJECTS.length;
document.getElementById("year").textContent = new Date().getFullYear();

buildFilters();
renderGrid();
pixelIntro();
pixelTrail();
rockMascot();

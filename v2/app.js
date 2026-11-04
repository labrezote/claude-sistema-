/* =========================================================
   Studio Crudo — v2
   Imagen real (cielo) convertida en tramas: líneas, puntos,
   dither y bloques. El cursor empuja la trama y la lupa
   devuelve la foto real.
   Para agregar un proyecto, copia un objeto de PROJECTS.
   ========================================================= */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;

const CATEGORIES = {
  branding: "Branding",
  campanas: "Campañas",
  marcas: "Marcas",
  digital: "Digital",
};

const PROJECTS = [
  { title: "Organizadora de eventos", client: "Música electrónica", category: "branding", summary: "Branding para una organizadora de eventos de música electrónica. Descripción pendiente.", metric: "", seed: 11 },
  { title: "Despacho de abogados", client: "Despacho jurídico", category: "branding", summary: "Identidad para un despacho de abogados. Descripción pendiente.", metric: "", seed: 23 },
  { title: "Fidelización en Wallet", client: "App · Apple y Google Wallet", category: "digital", summary: "Digitalización de tarjetas de fidelización en Apple Wallet y Google Wallet. Ya cuenta con web.", metric: "", seed: 37 },
  { title: "Consultorio dental", client: "Dentistas", category: "branding", summary: "Identidad para consultorio dental. Descripción pendiente.", metric: "", seed: 41 },
  { title: "Miel", client: "Marca de producto", category: "marcas", summary: "Marca para producto de miel. Descripción pendiente.", metric: "", seed: 52 },
  { title: "Mole", client: "Marca de producto", category: "marcas", summary: "Marca para producto de mole. Descripción pendiente.", metric: "", seed: 66 },
  { title: "Entrenador fitness", client: "Marca personal", category: "branding", summary: "Identidad para entrenador fitness. Descripción pendiente.", metric: "", seed: 73 },
  { title: "Campañas JEEP", client: "JEEP", category: "campanas", summary: "Campañas publicitarias para la marca JEEP. Descripción pendiente.", metric: "150+ autos vendidos", seed: 88 },
];

/* ---------- Utilidades ---------- */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Generador pseudoaleatorio determinista (mulberry32)
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

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// Imagen para leer píxeles (data URL: funciona también desde file://)
const skySample = loadImage(window.SKY_DATA || "assets/img/sky.webp");
// Imagen nítida para la lupa
const skyFull = loadImage("assets/img/sky.webp");

/* ---------- Renderizador de tramas ---------- */

class Halftone {
  constructor(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.o = Object.assign(
      {
        mode: "dots",
        cell: 9,
        ditherCell: 4,
        bg: "#0b0b0b",
        fg: "#6b6cf5",
        tiers: ["#eeeeff", "#b9baff", "#4b4cc4"],
        cut: 0.25,   // parte más oscura del cuadro que queda vacía
        gamma: 1.5,  // curva de contraste
        zoom: 1.2,   // margen para el paneo lento
        lens: false,
        repel: 110,
      },
      opts
    );
    this.sample = document.createElement("canvas");
    this.sctx = this.sample.getContext("2d", { willReadFrequently: true });
    this.dc = document.createElement("canvas");
    this.dctx = this.dc.getContext("2d");
    this.pointer = { x: 0, y: 0, active: false };
    this.lensPos = { x: 0, y: 0, r: 0 };
    this.visible = true;
    this.resize();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
  }

  // Encuadre tipo cover con paneo lento (las nubes "se mueven")
  coverRect(t) {
    const iw = skySample.naturalWidth;
    const ih = skySample.naturalHeight;
    const s = Math.max(this.w / iw, this.h / ih) * this.o.zoom;
    const dw = iw * s;
    const dh = ih * s;
    const x = (this.w - dw) / 2 + Math.sin(t / 7000) * ((dw - this.w) / 2) * 0.9;
    const y = (this.h - dh) / 2 + Math.cos(t / 9000) * ((dh - this.h) / 2) * 0.9;
    return [x, y, dw, dh];
  }

  // Brillo de la foto por celda, de 0 a 1
  field(t, gw, gh) {
    this.sample.width = gw;
    this.sample.height = gh;
    const [x, y, w, h] = this.coverRect(t);
    const kx = gw / this.w;
    const ky = gh / this.h;
    this.sctx.drawImage(skySample, x * kx, y * ky, w * kx, h * ky);
    const d = this.sctx.getImageData(0, 0, gw, gh).data;
    const out = new Float32Array(gw * gh);
    let lo = 1;
    let hi = 0;
    for (let i = 0; i < out.length; i++) {
      const l = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
      out[i] = l;
      if (l < lo) lo = l;
      if (l > hi) hi = l;
    }
    // Normaliza al rango del cuadro y aplica curva de contraste
    const from = lo + (hi - lo) * this.o.cut;
    const span = Math.max(0.001, hi - from);
    for (let i = 0; i < out.length; i++) {
      out[i] = clamp((out[i] - from) / span, 0, 1) ** this.o.gamma;
    }
    return out;
  }

  draw(t) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = this.o.bg;
    ctx.fillRect(0, 0, this.w, this.h);
    if (!skySample.complete || !skySample.naturalWidth) return;

    if (this.o.mode === "dither") this.drawDither(t);
    else this.drawCells(t);
    if (this.o.lens) this.drawLens(t);
  }

  drawDither(t) {
    const cs = this.o.ditherCell;
    const gw = Math.ceil(this.w / cs);
    const gh = Math.ceil(this.h / cs);
    const f = this.field(t, gw, gh);
    if (!this.img || this.img.width !== gw || this.img.height !== gh) {
      this.dc.width = gw;
      this.dc.height = gh;
      this.img = this.dctx.createImageData(gw, gh);
    }
    const px = this.img.data;
    const fg = hexToRgb(this.o.fg);
    const bg = hexToRgb(this.o.bg);
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const i = y * gw + x;
        const c = f[i] * 16 > BAYER[(y & 3) * 4 + (x & 3)] + 0.5 ? fg : bg;
        px[i * 4] = c[0];
        px[i * 4 + 1] = c[1];
        px[i * 4 + 2] = c[2];
        px[i * 4 + 3] = 255;
      }
    }
    this.dctx.putImageData(this.img, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.dc, 0, 0, gw * cs, gh * cs);
  }

  drawCells(t) {
    const { mode, cell, repel } = this.o;
    const gw = Math.ceil(this.w / cell);
    const gh = Math.ceil(this.h / cell);
    const f = this.field(t, gw, gh);
    const ctx = this.ctx;
    const p = this.pointer;
    const tiers = [[], [], []];

    ctx.fillStyle = this.o.fg;
    ctx.beginPath();
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        let v = f[y * gw + x];
        if (v < 0.04) continue;
        let cx = x * cell + cell / 2;
        let cy = y * cell + cell / 2;

        // El cursor empuja la trama y la hace crecer
        if (p.active) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const d = Math.hypot(dx, dy);
          if (d < repel && d > 0.01) {
            const k = 1 - d / repel;
            cx += (dx / d) * k * cell * 1.6;
            cy += (dy / d) * k * cell * 1.6;
            v = Math.min(1, v + k * 0.35);
          }
        }

        if (mode === "dots") {
          const r = cell * 0.5 * v;
          if (r < 0.35) continue;
          ctx.moveTo(cx + r, cy);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        } else if (mode === "lines") {
          const hh = cell * 0.8 * v;
          ctx.rect(cx - cell / 2, cy - hh / 2, cell + 0.6, hh);
        } else {
          tiers[v > 0.72 ? 0 : v > 0.42 ? 1 : 2].push(cx, cy);
        }
      }
    }

    if (mode !== "blocks") {
      ctx.fill();
      return;
    }
    const s = cell - 1;
    tiers.forEach((pts, i) => {
      ctx.fillStyle = this.o.tiers[i];
      ctx.beginPath();
      for (let j = 0; j < pts.length; j += 2) ctx.rect(pts[j] - s / 2, pts[j + 1] - s / 2, s, s);
      ctx.fill();
    });
  }

  // Lupa: dentro del círculo se ve la foto real
  drawLens(t) {
    const p = this.pointer;
    const L = this.lensPos;
    let tx = p.x;
    let ty = p.y;
    if (!p.active) {
      // Sin cursor, la lupa recorre una trayectoria fluida
      tx = this.w / 2 + Math.cos(t / 1700) * this.w * 0.28;
      ty = this.h / 2 + Math.sin(t / 1300) * this.h * 0.24;
    }
    const targetR = Math.min(this.w, this.h) * (p.active ? 0.17 : 0.13);
    L.x += (tx - L.x) * 0.16;
    L.y += (ty - L.y) * 0.16;
    L.r += (targetR - L.r) * 0.1;

    const img = skyFull.complete && skyFull.naturalWidth ? skyFull : skySample;
    const [x, y, w, h] = this.coverRect(t);
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(L.x, L.y, L.r, 0, Math.PI * 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(L.x, L.y, L.r, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#c8ff3d";
    ctx.stroke();
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#c8ff3d";
    ctx.fillText("REAL", L.x + L.r + 8, L.y + 4);
  }
}

/* ---------- Instancias: hero y footer ---------- */

const heroCanvas = document.getElementById("hero-canvas");
const footerCanvas = document.getElementById("footer-canvas");

const hero = new Halftone(heroCanvas, { mode: "dots", lens: true });
const footer = new Halftone(footerCanvas, {
  mode: "dither",
  ditherCell: 5,
  bg: "#2a2fe8",
  fg: "#9ea2ff",
  cut: 0.2,
  gamma: 1.2,
  zoom: 1.35,
});
const halftones = [hero, footer];

if (finePointer) {
  heroCanvas.addEventListener("pointermove", (e) => {
    const r = heroCanvas.getBoundingClientRect();
    hero.pointer.x = e.clientX - r.left;
    hero.pointer.y = e.clientY - r.top;
    hero.pointer.active = true;
  });
  heroCanvas.addEventListener("pointerleave", () => { hero.pointer.active = false; });
}

// Selector de trama; rota solo hasta que el usuario elige una
const MODES = ["dots", "lines", "dither", "blocks"];
const modeButtons = Array.from(document.querySelectorAll(".modes button"));
let userPicked = false;
let lastSwitch = 0;

function setMode(mode) {
  hero.o.mode = mode;
  modeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  if (reduceMotion) hero.draw(0);
}
modeButtons.forEach((b) =>
  b.addEventListener("click", () => {
    userPicked = true;
    setMode(b.dataset.mode);
  })
);
setMode(hero.o.mode);

// Solo se anima lo que está en pantalla
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    const h = halftones.find((x) => x.canvas === en.target);
    if (h) h.visible = en.isIntersecting;
  });
});
halftones.forEach((h) => io.observe(h.canvas));

window.addEventListener("resize", () => {
  // cambiar el tamaño borra el canvas: se redibuja aunque esté fuera de pantalla
  halftones.forEach((h) => { h.resize(); h.draw(reduceMotion ? 0 : performance.now()); });
  drawAllCardArt();
});

function loop(t) {
  if (!userPicked && t - lastSwitch > 5000) {
    lastSwitch = t;
    if (t > 1000) setMode(MODES[(MODES.indexOf(hero.o.mode) + 1) % MODES.length]);
  }
  halftones.forEach((h) => { if (h.visible) h.draw(t); });
  requestAnimationFrame(loop);
}

function startHalftones() {
  if (reduceMotion) {
    halftones.forEach((h) => { h.o.lens = false; h.draw(0); });
    return;
  }
  requestAnimationFrame(loop);
}
if (skySample.complete) startHalftones();
else skySample.addEventListener("load", startHalftones, { once: true });

/* ---------- Tarjetas de proyecto ---------- */

// Arte generativo en trama para cada proyecto (se reemplaza por la imagen real)
function drawCardArt(canvas, seed) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.max(1, r.width);
  const H = Math.max(1, r.height);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const rand = rng(seed);
  const shape = seed % 4;
  const cell = 8;
  const phase = rand() * Math.PI * 2;

  // Campo de densidad: 0 = vacío, 1 = lleno
  const field = (u, v) => {
    const dx = u - 0.5;
    const dy = (v - 0.5) * (H / W);
    const d = Math.hypot(dx, dy);
    if (shape === 0) return Math.exp(-(((d - 0.24) / 0.08) ** 2));          // anillo
    if (shape === 1) return clamp(1 - d / 0.3, 0, 1) * (0.6 + 0.4 * Math.sin(u * 9 + phase)); // esfera
    if (shape === 2) return v > 0.55 + 0.16 * Math.sin(u * 6 + phase) ? 0.3 + v * 0.7 : 0;   // montaña
    return clamp(0.5 + 0.5 * Math.sin(u * 10 + Math.sin(v * 4 + phase) * 2), 0, 1) * (1 - Math.abs(dy) * 1.6); // onda
  };

  ctx.fillStyle = "#2a2fe8";
  ctx.font = `${cell + 1}px 'IBM Plex Mono', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let y = cell / 2; y < H; y += cell) {
    for (let x = cell / 2; x < W; x += cell) {
      const v = field(x / W, y / H) * (0.75 + rand() * 0.25);
      if (v < 0.08) continue;
      ctx.globalAlpha = 0.25 + v * 0.75;
      if (shape === 0) {
        ctx.fillText(v > 0.55 ? "0" : "o", x, y); // anillo hecho de ceros
      } else {
        ctx.beginPath();
        ctx.arc(x, y, (cell / 2) * v, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

const cardsBox = document.getElementById("cards");
const dialog = document.getElementById("caso");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderCards() {
  cardsBox.innerHTML = "";
  PROJECTS.forEach((p, i) => {
    const card = el("article", "card");

    const meta = el("div", "card-meta mono");
    meta.append(el("span", "", CATEGORIES[p.category]), el("span", "", `${String(i + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`));

    const art = el("canvas", "card-art");
    art.dataset.seed = p.seed;

    const foot = el("div", "card-foot");
    const info = el("div");
    info.append(el("p", "card-client mono", p.client));
    if (p.metric) info.append(el("span", "card-metric mono", "↗ " + p.metric));
    const btn = el("button", "btn mono", "Ver caso");
    btn.type = "button";
    btn.addEventListener("click", () => openCase(p));
    foot.append(info, btn);

    card.append(meta, art, el("h3", "serif", p.title), el("p", "", p.summary), foot);
    cardsBox.appendChild(card);
  });
  drawAllCardArt();
}

function drawAllCardArt() {
  cardsBox.querySelectorAll(".card-art").forEach((c) => drawCardArt(c, Number(c.dataset.seed)));
}

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
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

function scrollCards(dir) {
  const card = cardsBox.querySelector(".card");
  const step = card ? card.getBoundingClientRect().width + 16 : 320;
  cardsBox.scrollBy({ left: dir * step, behavior: reduceMotion ? "auto" : "smooth" });
}
document.getElementById("prev").addEventListener("click", () => scrollCards(-1));
document.getElementById("next").addEventListener("click", () => scrollCards(1));

/* ---------- Contadores ---------- */

document.querySelector('.count[data-to="8"]').dataset.to = PROJECTS.length;

function runCounters() {
  document.querySelectorAll(".count").forEach((c) => {
    const to = Number(c.dataset.to);
    const suffix = c.dataset.suffix || "";
    if (reduceMotion) {
      c.textContent = to + suffix;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1200);
      const eased = 1 - (1 - k) ** 3;
      c.textContent = Math.round(to * eased) + (k === 1 ? suffix : "");
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
const statsObserver = new IntersectionObserver((entries, obs) => {
  if (entries.some((e) => e.isIntersecting)) {
    runCounters();
    obs.disconnect();
  }
});
statsObserver.observe(document.querySelector(".stats"));

/* ---------- Barra de carga ---------- */

const BLOCKS = 48;
const blocksBox = document.getElementById("loader-blocks");
const loaderLabel = document.getElementById("loader-label");
const blockEls = Array.from({ length: BLOCKS }, () => blocksBox.appendChild(document.createElement("i")));

function updateLoader() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  const on = Math.round(ratio * BLOCKS);
  blockEls.forEach((b, i) => b.classList.toggle("on", i < on));
  loaderLabel.textContent = `CARGANDO ${Math.round(ratio * 100)}%`;
}
window.addEventListener("scroll", updateLoader, { passive: true });
updateLoader();

/* ---------- Texto ondulante ---------- */

const letters = [];
document.querySelectorAll(".wave").forEach((w) => {
  const text = w.dataset.text;
  w.textContent = "";
  for (const ch of text) {
    const span = el("span", "ch", ch === " " ? " " : ch);
    w.appendChild(span);
    letters.push(span);
  }
});

function waveFrame(t) {
  letters.forEach((s, i) => {
    s.style.transform = `translateY(${(Math.sin(t / 380 + i * 0.55) * 7).toFixed(2)}px)`;
  });
  requestAnimationFrame(waveFrame);
}

/* ---------- Arranque ---------- */

document.getElementById("year").textContent = new Date().getFullYear();
renderCards();
if (!reduceMotion) requestAnimationFrame(waveFrame);
// Redibuja el arte de las tarjetas cuando cargan las fuentes (anillo de ceros en mono)
if (document.fonts) document.fonts.ready.then(drawAllCardArt);

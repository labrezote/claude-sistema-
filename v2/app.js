/* =========================================================
   Studio Crudo — identidad v2
   1) Hero: foto real pixelada con el scroll + lupa de realismo
   2) Barra de carga por scroll
   3) Texto ondulante con la tipografía propia
   ========================================================= */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;

/* ---------- 1) HERO ---------- */

const hero = document.getElementById("inicio");
const canvas = document.getElementById("photo");
const ctx = canvas.getContext("2d");
const photo = new Image();
photo.src = "assets/img/sky.webp";

// Canvas pequeño: de aquí sale el efecto pixel (se estira sin suavizado)
const small = document.createElement("canvas");
const smallCtx = small.getContext("2d");

const pointer = { x: 0, y: 0, active: false };
const lens = { x: 0, y: 0, r: 0 };
let W = 0;
let H = 0;
let dpr = 1;

// Ajusta la imagen como object-fit: cover
function coverRect(iw, ih, w, h) {
  const s = Math.max(w / iw, h / ih);
  const dw = iw * s;
  const dh = ih * s;
  return [(w - dw) / 2, (h - dh) / 2, dw, dh];
}

function resizeHero() {
  W = hero.clientWidth;
  H = hero.clientHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  if (!pointer.active) {
    pointer.x = W / 2;
    pointer.y = H / 2;
  }
}

// Progreso del hero: 0 al inicio, 1 al salir de la vista
function heroProgress() {
  return Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
}

function drawHero(time) {
  if (!photo.complete || !photo.naturalWidth) return;

  // Tamaño del pixel: crece con el scroll (nítido -> pixel grueso)
  const p = heroProgress();
  const block = Math.round(6 + p * 38);
  const bw = Math.max(2, Math.ceil(W / block));
  const bh = Math.max(2, Math.ceil(H / block));
  small.width = bw;
  small.height = bh;
  const [sx, sy, sw, sh] = coverRect(photo.naturalWidth, photo.naturalHeight, bw, bh);
  smallCtx.drawImage(photo, sx, sy, sw, sh);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, W, H);

  // Sin cursor (táctil), la lupa recorre una trayectoria fluida
  if (!pointer.active && time !== undefined) {
    pointer.x = W / 2 + Math.cos(time / 1400) * W * 0.28;
    pointer.y = H / 2 + Math.sin(time / 1100) * H * 0.22;
  }

  // Lupa: el radio y la posición se acercan suavemente al objetivo
  const targetR = pointer.active || time !== undefined ? Math.min(W, H) * 0.16 : 0;
  lens.r += (targetR - lens.r) * 0.12;
  lens.x += (pointer.x - lens.x) * 0.18;
  lens.y += (pointer.y - lens.y) * 0.18;

  if (lens.r > 0.5) {
    const [fx, fy, fw, fh] = coverRect(photo.naturalWidth, photo.naturalHeight, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, lens.r, 0, Math.PI * 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(photo, fx, fy, fw, fh);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(lens.x, lens.y, lens.r, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#efefee";
    ctx.stroke();
  }
}

function startHero() {
  if (reduceMotion) {
    // Sin animación: una sola imagen pixelada, se redibuja al scrollear
    const redraw = () => drawHero();
    window.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("resize", () => { resizeHero(); redraw(); });
    resizeHero();
    photo.addEventListener("load", redraw);
    redraw();
    return;
  }

  const loop = (time) => {
    drawHero(time);
    requestAnimationFrame(loop);
  };
  resizeHero();
  window.addEventListener("resize", resizeHero);
  requestAnimationFrame(loop);
}

if (finePointer) {
  hero.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  });
  hero.addEventListener("pointerleave", () => { pointer.active = false; });
}

/* ---------- 2) BARRA DE CARGA ---------- */

const BLOCKS = 40;
const blocksBox = document.getElementById("loader-blocks");
const label = document.getElementById("loader-label");
const blockEls = Array.from({ length: BLOCKS }, () => {
  const el = document.createElement("i");
  blocksBox.appendChild(el);
  return el;
});

function updateLoader() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  const on = Math.round(ratio * BLOCKS);
  blockEls.forEach((el, i) => el.classList.toggle("on", i < on));
  label.textContent = `CARGANDO ${Math.round(ratio * 100)}%`;
}
window.addEventListener("scroll", updateLoader, { passive: true });
updateLoader();

/* ---------- 3) TEXTO ONDULANTE ---------- */

// Parte cada palabra en letras para animarlas por separado
const waves = Array.from(document.querySelectorAll(".wave"));
const letters = [];
waves.forEach((el) => {
  const text = el.dataset.text;
  el.textContent = "";
  for (const ch of text) {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch === " " ? " " : ch;
    el.appendChild(span);
    letters.push(span);
  }
});

function waveFrame(time) {
  letters.forEach((span, i) => {
    const y = Math.sin(time / 380 + i * 0.55) * 8;
    span.style.transform = `translateY(${y.toFixed(2)}px)`;
  });
  requestAnimationFrame(waveFrame);
}

/* ---------- Arranque ---------- */

document.getElementById("year").textContent = new Date().getFullYear();
startHero();
if (!reduceMotion) requestAnimationFrame(waveFrame);

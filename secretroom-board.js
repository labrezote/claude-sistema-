/* =========================================================
   Board interactivo de Secret Room
   - S en 3D girando sobre su eje; cada vuelta cambia de textura (tomada de los flyers)
   - Temporada 2026: flyers, line ups y artistas
   ========================================================= */
(() => {
  const BASE = "assets/secretroom/";
  const EVENTS = [
    { id: "reta-roja", name: "La Reta", date: "Sábado 05 septiembre", tone: "#a3213a", edge: "#2b2224", glow: "rgba(163,33,58,.55)", texture: "Hierro forjado",
      head: ["Manolo GH", "Santiago"], support: ["Chak Boolay", "Faro", "Open decks"] },
    { id: "reta-ambar", name: "La Reta", date: "Sábado 19 septiembre", tone: "#e0701f", edge: "#2a2522", glow: "rgba(224,112,31,.5)", texture: "Ámbar",
      head: ["Kuetox vs Hamar", "Chak Boolay"], support: ["Labrezote", "Totem", "Open decks"] },
    { id: "premiere", name: "Premiere · Live act view party", date: "Viernes 2 octubre", tone: "#4a7fe0", edge: "#1d2a44", glow: "rgba(74,127,224,.45)", texture: "Planeta Tierra",
      head: ["Tierra de Ovnis", "Drakhen"], support: ["Chak Boolay", "Barajas", "Butrøn"] },
    { id: "prefestival", name: "Pre Festival", date: "Viernes 16 octubre", tone: "#b9a9c9", edge: "#3e3a42", glow: "rgba(201,186,214,.55)", texture: "Metal orgánico",
      head: ["Fat Punk", "Suaste", "Chak Boolay"], support: ["Duran", "Aether", "Marqü", "Faeton", "Open decks"] },
    { id: "xibalba", name: "Xibalba", date: "Sábado 07 noviembre", tone: "#3f9b62", edge: "#1f2a22", glow: "rgba(214,52,42,.45)", texture: "Piedra maya",
      head: ["María Nocheydía", "Disastro", "Tierra de Ovnis"], support: ["Labrezote", "Chak Boolay", "Duran B2B Aether", "SXN PXRDRO", "Barajas"] },
  ];
  // artistas únicos (Duran B2B Aether cuenta para Duran y Aether)
  const split = (n) => n.replace(/ B2B | vs /g, "|").split("|").map((s) => s.trim()).filter((s) => s !== "Open decks");
  const artists = {};
  EVENTS.forEach((e, i) => [...e.head, ...e.support].flatMap(split).forEach((a) => { (artists[a] = artists[a] || new Set()).add(i); }));
  const ARTISTS = Object.entries(artists).map(([n, s]) => ({ n, ev: [...s] })).sort((a, b) => b.ev.length - a.ev.length || a.n.localeCompare(b.n));
  const LAYERS = 10, STEP = 1.1, MID = ((10 - 1) * 1.1) / 2;

  function render(root) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = EVENTS.length - 1, sel = EVENTS.length - 1, playing = !reduce, artist = null;
    root.innerHTML = `
    <div class="sr">
      <section class="sr-stage" id="sr-stage" aria-label="Isotipo de Secret Room en 3D">
        <div class="sr-top"><span class="sr-wm" role="img" aria-label="Secret Room"></span><span class="sr-sub" id="sr-sub"></span></div>
        <div class="sr-scene"><div class="sr-spin${reduce ? " still" : ""}" id="sr-spin">
          ${Array.from({ length: LAYERS }, (_, k) => `<i class="sr-layer" style="transform:translateZ(${(MID - k * STEP).toFixed(1)}px)"></i>`).join("")}
          <i class="sr-face front" style="transform:translateZ(${(MID + 0.2).toFixed(1)}px)"></i><i class="sr-face back" style="transform:translateZ(${(-MID - 0.2).toFixed(1)}px) rotateY(180deg) scaleX(-1)"></i>
        </div><div class="sr-floor"></div></div>
        <div class="sr-ctrl">
          <span class="sr-tex" id="sr-tex" aria-live="polite"></span>
          <span class="sr-btns"><button type="button" id="sr-prev" aria-label="Textura anterior">←</button><button type="button" id="sr-play">${playing ? "Pausar" : "Girar"}</button><button type="button" id="sr-next" aria-label="Siguiente textura">→</button></span>
        </div>
        <div class="sr-dots" id="sr-dots"></div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>01</span>Identidad</header>
        <div class="sr-ids">
          <figure><div class="sr-plate dark"><span class="sr-s" style="background:#fff"></span><span class="sr-wm sm" style="background:#fff"></span></div><figcaption>Negativo</figcaption></figure>
          <figure><div class="sr-plate light"><span class="sr-s" style="background:#0b0b0b"></span><span class="sr-wm sm" style="background:#0b0b0b"></span></div><figcaption>Positivo</figcaption></figure>
          <figure><div class="sr-plate dark"><span class="sr-s big" style="background:#fff"></span></div><figcaption>Isotipo · S que se lee como rayo y como puerta</figcaption></figure>
        </div>
        <p class="sr-note">La S tiene volumen propio: se extruye y bisela a partir del contorno del logo, y cambia de material en cada vuelta. Arrástrala para girarla. En los flyers, cada evento reinterpreta la misma S con una textura propia, un color y un ambiente. El logotipo, el orden del flyer y la tipografía espaciada se mantienen, así la serie se reconoce aunque cambie todo lo demás.</p>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>02</span>Temporada 2026<em>Toca un flyer</em></header>
        <div class="sr-stats"><div><b>${EVENTS.length}</b><span>Eventos</span></div><div><b>${ARTISTS.length}</b><span>Artistas</span></div><div><b>1</b><span>Sede · Santomar</span></div></div>
        <div class="sr-reel" id="sr-reel" role="listbox" aria-label="Eventos de la temporada">
          ${EVENTS.map((e, i) => `<button type="button" class="sr-thumb" role="option" data-i="${i}" style="--t:${e.tone}"><img src="${BASE}flyer-${e.id}.webp" alt="Flyer ${e.name}, ${e.date}" loading="lazy"><span><b>${e.name}</b>${e.date}</span></button>`).join("")}
        </div>
        <div class="sr-detail" id="sr-detail"></div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>03</span>Artistas<em>Toca un nombre para ver sus fechas</em></header>
        <div class="sr-cloud" id="sr-cloud">${ARTISTS.map((a) => `<button type="button" data-a="${a.n}" style="font-size:${14 + a.ev.length * 4}px">${a.n}<sup>${a.ev.length > 1 ? "×" + a.ev.length : ""}</sup></button>`).join("")}</div>
      </section>
    </div>`;

    const $ = (s) => root.querySelector(s);
    const stage = $("#sr-stage"), spin = $("#sr-spin");
    function setTexture(i) {
      cur = (i + EVENTS.length) % EVENTS.length;
      const e = EVENTS[cur];
      stage.style.setProperty("--tone", e.tone); stage.style.setProperty("--edge", e.edge); stage.style.setProperty("--glow", e.glow);
      stage.style.setProperty("--tex", `url(${BASE}tex-${e.id}.webp)`);
      $("#sr-sub").textContent = e.name;
      $("#sr-tex").innerHTML = `<b>${String(cur + 1).padStart(2, "0")} / ${String(EVENTS.length).padStart(2, "0")}</b> Textura · ${e.texture}`;
      $("#sr-dots").innerHTML = EVENTS.map((x, k) => `<button type="button" data-k="${k}" aria-label="Textura ${x.texture}" aria-pressed="${k === cur}" style="--t:${x.tone}"></button>`).join("");
      $("#sr-dots").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setTexture(+b.dataset.k)));
    }
    function showEvent(i) {
      sel = i; const e = EVENTS[i];
      root.querySelectorAll(".sr-thumb").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.i === i)));
      const hl = (n) => artist && split(n).includes(artist) ? ` class="hl"` : "";
      $("#sr-detail").style.setProperty("--t", e.tone);
      $("#sr-detail").innerHTML = `
        <img src="${BASE}flyer-${e.id}.webp" alt="Flyer de Secret Room ${e.name}">
        <div class="sr-info">
          <span class="sr-k">Secret Room</span><h4>${e.name}</h4><p class="sr-date">${e.date}</p>
          <span class="sr-k">Line up</span>
          <ul class="head">${e.head.map((n) => `<li${hl(n)}>${n}</li>`).join("")}</ul>
          <ul class="sup">${e.support.map((n) => `<li${hl(n)}>${n}</li>`).join("")}</ul>
          <span class="sr-k">Sede</span><p>Santomar</p>
          <span class="sr-k">Textura del flyer</span><p>${e.texture}</p>
        </div>`;
    }
    function markArtist() {
      root.querySelectorAll("#sr-cloud button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.a === artist)));
      root.querySelectorAll(".sr-thumb").forEach((t) => t.classList.toggle("dim", !!artist && !artists[artist].has(+t.dataset.i)));
      showEvent(artist && !artists[artist].has(sel) ? [...artists[artist]][0] : sel);
    }
    // S en 3D con volumen (Three.js). Si el navegador no tiene WebGL, queda la versión CSS.
    const scene = $(".sr-scene");
    const gl = window.SR3D && window.SR3D.mount(scene, { still: reduce, onChange: (k, t) => {
      stage.style.setProperty("--tone", t.tone); stage.style.setProperty("--glow", t.glow);
      $("#sr-sub").textContent = t.name;
      const T = window.SR3D.TEXTURES;
      $("#sr-tex").innerHTML = `<b>${String(k + 1).padStart(2, "0")} / ${String(T.length).padStart(2, "0")}</b> Textura · ${t.name}`;
      $("#sr-dots").innerHTML = T.map((x, j) => `<button type="button" data-k="${j}" aria-label="Textura ${x.name}" aria-pressed="${j === k}" style="--t:${x.tone}"></button>`).join("");
      $("#sr-dots").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => gl.go(+b.dataset.k)));
    } });
    if (gl) {
      scene.classList.add("is-gl");
      $("#sr-play").addEventListener("click", () => { playing = !playing; gl.play(playing); $("#sr-play").textContent = playing ? "Pausar" : "Girar"; });
      $("#sr-next").addEventListener("click", () => gl.next());
      $("#sr-prev").addEventListener("click", () => gl.prev());
    } else {
      spin.addEventListener("animationiteration", () => setTexture(cur + 1));
      $("#sr-play").addEventListener("click", () => { playing = !playing; spin.classList.toggle("paused", !playing); $("#sr-play").textContent = playing ? "Pausar" : "Girar"; spin.classList.remove("still"); });
      $("#sr-next").addEventListener("click", () => setTexture(cur + 1));
      $("#sr-prev").addEventListener("click", () => setTexture(cur - 1));
    }
    root.querySelectorAll(".sr-thumb").forEach((t) => t.addEventListener("click", () => showEvent(+t.dataset.i)));
    root.querySelectorAll("#sr-cloud button").forEach((b) => b.addEventListener("click", () => { artist = artist === b.dataset.a ? null : b.dataset.a; markArtist(); }));
    if (!playing) spin.classList.add("paused");
    if (!gl) setTexture(cur);
    showEvent(sel);
  }
  window.CaseInteractive = Object.assign(window.CaseInteractive || {}, { secretroom: render });
})();

/* =========================================================
   Board interactivo de Secret Room
   - S en 3D girando sobre su eje; cada vuelta cambia de textura (tomada de los flyers)
   - Temporada 2026: flyers, line ups y artistas
   ========================================================= */
(() => {
  const BASE = "assets/secretroom/";
  // S animada tal como en los flyers (recortes de los videos originales)
  const CLIPS = [
    { id: "reta-agosto", name: "La Reta · Humo de colores", bg: "#02030b", ink: "#f4f2ef", tone: "#39d6a0" },
    { id: "reta-roja", name: "La Reta · Hierro forjado", bg: "#7d0f22", ink: "#f4f2ef", tone: "#ffb3bd" },
    { id: "premiere", name: "Premiere · Planeta Tierra", bg: "#0c0b13", ink: "#f4f2ef", tone: "#6aa0ff" },
    { id: "prefestival", name: "Pre Festival · Metal orgánico", bg: "#d0c4d3", ink: "#141216", tone: "#3a3340" },
  ];
  // Información de la presentación 2026 de Secret Room
  const HITOS = [
    { id: "garden", name: "Secret Garden", year: 2024, place: "Jardines de México, Morelos", date: "Sábado 27 de julio",
      text: "Evento para el parque Jardines de México en Morelos, como activación de su festival de verano. Se hicieron dos ediciones y después cambió de nombre para convertirse en festival.",
      lineup: ["Disastro", "Chak Boolay", "Risser", "Glez", "Brünne", "Mëade", "Alex Gres"] },
    { id: "pinto", name: "Pinto", year: 2024, place: "Rêve Private Club · propiedad privada en Cuernavaca", date: "10 de agosto",
      text: "Trajimos a Pinto en 2024. Fue uno de los eventos con más aforo que hemos tenido y se llevó a cabo en una propiedad privada en Cuernavaca.",
      lineup: ["Pinto", "Henek", "Daybo & Lexit", "Chak Boolay", "Dealorean", "Reec", "Glez", "Loyalty"] },
    { id: "xibalba", name: "Xibalba", year: 2024, place: "Cuernavaca", date: "Día de Muertos",
      text: "Evento para celebrar el Día de Muertos de una manera diferente, inspirado en el Xibalba, que en la mitología maya es el inframundo: un reino oscuro y peligroso gobernado por dioses de la muerte.", lineup: [] },
    { id: "purohouse", name: "Puro House Take over", year: 2025, place: "Ololo Condesa, Ciudad de México", date: "Jueves 29 de mayo",
      text: "Take over en Ololo Condesa, un venue especializado en coctelería de autor y música house. Se llevó a cabo en conjunto con la agencia de booking Crossfade.",
      lineup: ["Chak Boolay", "Ohmem & Gascón", "Triztan", "Dan & Frank"] },
    { id: "rumores", name: "Rumores Take over", year: 2025, place: "Rumores, Ciudad de México", date: "Jueves 27 de noviembre",
      text: "Take over en Rumores, un venue de Ciudad de México especializado en música electrónica. Se llevó a cabo en conjunto con la marca SOMOS.",
      lineup: ["Chak Boolay", "Marcelo Cav", "Daybo", "Daam", "Brünne", "Nualart", "Jitsuo", "Nizzel", "Alephs"] },
    { id: "diente", name: "Diente de León Take over", year: 2026, place: "Diente de León, Cholula, Puebla", date: "Viernes 17 de abril",
      text: "Take over en Diente de León, en Cholula, uno de los venues más populares del circuito de la música electrónica en Puebla.",
      lineup: ["Tierra de Ovnis", "Strawberry", "Chak Boolay", "Riclo", "Labrezote"] },
    { id: "aniversario", name: "5to Aniversario", year: 2026, place: "ODD, Cuernavaca", date: "Sábado 13 de junio",
      text: "Evento para celebrar el quinto aniversario de Secret Room. Se llevó a cabo en ODD, uno de los antros más grandes de Cuernavaca.",
      lineup: ["Chile", "Mariana Barcenas", "Chak Boolay", "MNDZ", "André Disarmo B2B He:rra"] },
  ];
  const EVENTS = [
    { id: "reta-agosto", name: "La Reta", date: "Sábado 01 de agosto", tone: "#39d6a0", edge: "#0b1a1c", glow: "rgba(57,214,160,.45)", texture: "Humo de colores", video: true,
      head: ["Tan Ocampo", "Mëade"], support: ["Hache B2B He:rra", "Riz", "Totem", "Open decks"] },
    { video: true, id: "reta-roja", name: "La Reta", date: "Sábado 05 septiembre", tone: "#a3213a", edge: "#2b2224", glow: "rgba(163,33,58,.55)", texture: "Hierro forjado",
      head: ["Manolo GH", "Santiago"], support: ["Chak Boolay", "Faro", "Open decks"] },
    { id: "reta-ambar", name: "La Reta", date: "Sábado 19 septiembre", tone: "#e0701f", edge: "#2a2522", glow: "rgba(224,112,31,.5)", texture: "Ámbar",
      head: ["Kuetox vs Hamar", "Chak Boolay"], support: ["Labrezote", "Totem", "Open decks"] },
    { video: true, id: "premiere", name: "Premiere · Live act view party", date: "Viernes 2 octubre", tone: "#4a7fe0", edge: "#1d2a44", glow: "rgba(74,127,224,.45)", texture: "Planeta Tierra",
      head: ["Tierra de Ovnis", "Drakhen"], support: ["Chak Boolay", "Barajas", "Butrøn"] },
    { video: true, id: "prefestival", name: "Pre Festival", date: "Viernes 16 octubre", tone: "#b9a9c9", edge: "#3e3a42", glow: "rgba(201,186,214,.55)", texture: "Metal orgánico",
      head: ["Fat Punk", "Suaste", "Chak Boolay"], support: ["Duran", "Aether", "Marqü", "Faeton", "Open decks"] },
    { id: "xibalba", name: "Xibalba", date: "Sábado 07 noviembre", tone: "#3f9b62", edge: "#1f2a22", glow: "rgba(214,52,42,.45)", texture: "Piedra maya",
      head: ["María Nocheydía", "Disastro", "Tierra de Ovnis"], support: ["Labrezote", "Chak Boolay", "Duran B2B Aether", "SXN PXRDRO", "Barajas"] },
  ];
  // artistas únicos (Duran B2B Aether cuenta para Duran y Aether)
  const split = (n) => n.replace(/ B2B | vs /g, "|").split("|").map((s) => s.trim()).filter((s) => s !== "Open decks");
  const artists = {};
  EVENTS.forEach((e, i) => [...e.head, ...e.support].flatMap(split).forEach((a) => { (artists[a] = artists[a] || new Set()).add(i); }));
  const ARTISTS = Object.entries(artists).map(([n, s]) => ({ n, ev: [...s] })).sort((a, b) => b.ev.length - a.ev.length || a.n.localeCompare(b.n));

  function render(root) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, sel = EVENTS.length - 1, playing = !reduce, artist = null;
    root.innerHTML = `
    <div class="sr">
      <section class="sr-stage" id="sr-stage" aria-label="Isotipo de Secret Room en 3D">
        <div class="sr-top"><span class="sr-wm" role="img" aria-label="Secret Room"></span><span class="sr-sub" id="sr-sub"></span></div>
        <div class="sr-scene"><video class="sr-clip" id="sr-clip" muted playsinline preload="auto" aria-label="Isotipo de Secret Room girando"></video></div>
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
        <p class="sr-note">Arriba, la S gira tal como en los flyers animados de cada fecha. Cada evento reinterpreta la misma S con una textura propia, un color y un ambiente. El logotipo, el orden del flyer y la tipografía espaciada se mantienen, así la serie se reconoce aunque cambie todo lo demás.</p>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>02</span>La historia</header>
        <div class="sr-story">
          <div><h4>Una reunión privada y secreta</h4>
            <p>Secret Room inició como una reunión privada y secreta entre amigos amantes de la música electrónica. Nació a raíz de la pandemia de 2020. En Morelos hay una gran comunidad que no podía asistir a eventos para escuchar y sentir su música favorita, así que poco a poco se crearon las primeras sesiones en lugares privados y con un pequeño número de asistentes.</p>
            <h4>Primeras ediciones</h4>
            <p>Empezaron desde cero, con muy poco presupuesto y muy poca producción, pero con mucho entusiasmo y mucho apoyo de sus amigos. Conforme se fue acabando el confinamiento, llegaron los primeros eventos en Cuernavaca y Tepoztlán.</p></div>
          <div class="sr-photos"><img src="${BASE}hist-1.webp" alt="Primeras sesiones privadas de Secret Room" loading="lazy"><img src="${BASE}hist-2.webp" alt="Primeras ediciones al aire libre" loading="lazy"><img src="${BASE}hist-3.webp" alt="Cabina de las primeras ediciones" loading="lazy"></div>
        </div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>03</span>Actualidad</header>
        <p class="sr-lead">Hoy Secret Room es la comunidad más grande dedicada a la música electrónica en Cuernavaca.</p>
        <div class="sr-stats four"><div><b>5</b><span>Años · desde 2020</span></div><div><b>2</b><span>Eventos al mes</span></div><div><b>200 mil+</b><span>Personas al mes en redes</span></div><div><b>3</b><span>Ciudades · Cuernavaca, Puebla y CDMX</span></div></div>
        <div class="sr-story">
          <div><h4>Destacados</h4>
            <ul class="sr-list"><li>Colaboraciones con venues y partners de renombre en la industria: <b>Jardines de México, Born in México, FUNK, Diente de León y Mixmag</b>, entre otros.</li>
            <li>Artistas de talla <b>nacional e internacional</b> en sus eventos.</li>
            <li>Una <b>nueva comunidad</b> de amantes de la música electrónica, conectada y formada por la marca.</li>
            <li>Apoyo continuo al <b>talento emergente</b>.</li></ul>
            <h4>¿Qué pueden aportar?</h4>
            <p><b>Producción de eventos:</b> organización, producción, ejecución y diseño de arte.</p>
            <p class="sr-web">www.secretroom.mx · @secretroom.mx</p></div>
          <div class="sr-photos one"><img src="${BASE}dest.webp" alt="DJ en un evento de Secret Room a la luz de las velas" loading="lazy"></div>
        </div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>04</span>Eventos destacados<span class="sr-years" id="sr-years"></span></header>
        <div class="sr-hitos" id="sr-hitos"></div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>05</span>Flyers animados 2026<em>Toca un flyer</em></header>
        <div class="sr-stats"><div><b>${EVENTS.length}</b><span>Eventos</span></div><div><b>${ARTISTS.length}</b><span>Artistas</span></div><div><b>1</b><span>Sede · Santomar</span></div></div>
        <div class="sr-reel" id="sr-reel" role="listbox" aria-label="Eventos de la temporada">
          ${EVENTS.map((e, i) => `<button type="button" class="sr-thumb" role="option" data-i="${i}" style="--t:${e.tone}"><img src="${BASE}flyer-${e.id}.webp" alt="Flyer ${e.name}, ${e.date}" loading="lazy"><span><b>${e.name}</b>${e.date}</span></button>`).join("")}
        </div>
        <div class="sr-detail" id="sr-detail"></div>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>06</span>Artistas<em>Toca un nombre para ver sus fechas</em></header>
        <div class="sr-cloud" id="sr-cloud">${ARTISTS.map((a) => `<button type="button" data-a="${a.n}" style="font-size:${14 + a.ev.length * 4}px">${a.n}<sup>${a.ev.length > 1 ? "×" + a.ev.length : ""}</sup></button>`).join("")}</div>
      </section>
    </div>`;

    const $ = (s) => root.querySelector(s);
    const stage = $("#sr-stage");
    function showEvent(i) {
      sel = i; const e = EVENTS[i];
      root.querySelectorAll(".sr-thumb").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.i === i)));
      const hl = (n) => artist && split(n).includes(artist) ? ` class="hl"` : "";
      $("#sr-detail").style.setProperty("--t", e.tone);
      $("#sr-detail").innerHTML = `
        ${e.video ? `<video src="${BASE}flyer-${e.id}.mp4" poster="${BASE}flyer-${e.id}.webp" autoplay muted loop playsinline aria-label="Flyer animado de Secret Room ${e.name}"></video>` : `<img src="${BASE}flyer-${e.id}.webp" alt="Flyer de Secret Room ${e.name}">`}
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
    // S animada: reproduce el recorte de cada flyer y pasa al siguiente al terminar
    const clip = $("#sr-clip");
    function setClip(i) {
      cur = (i + CLIPS.length) % CLIPS.length; const c = CLIPS[cur];
      stage.style.setProperty("--bg", c.bg); stage.style.setProperty("--w", c.ink); stage.style.setProperty("--tone", c.tone);
      clip.poster = `${BASE}s-${c.id}.webp`; clip.src = `${BASE}s-${c.id}.mp4`;
      if (playing) { const pr = clip.play(); if (pr && pr.catch) pr.catch(() => {}); }
      $("#sr-sub").textContent = c.name;
      $("#sr-tex").innerHTML = `<b>${String(cur + 1).padStart(2, "0")} / ${String(CLIPS.length).padStart(2, "0")}</b> ${c.name}`;
      $("#sr-dots").innerHTML = CLIPS.map((x, k) => `<button type="button" data-k="${k}" aria-label="${x.name}" aria-pressed="${k === cur}" style="--t:${c.ink}"></button>`).join("");
      $("#sr-dots").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setClip(+b.dataset.k)));
    }
    clip.addEventListener("ended", () => setClip(cur + 1));
    $("#sr-play").addEventListener("click", () => { playing = !playing; playing ? clip.play() : clip.pause(); $("#sr-play").textContent = playing ? "Pausar" : "Girar"; });
    $("#sr-next").addEventListener("click", () => setClip(cur + 1));
    $("#sr-prev").addEventListener("click", () => setClip(cur - 1));
    root.querySelectorAll(".sr-thumb").forEach((t) => t.addEventListener("click", () => showEvent(+t.dataset.i)));
    root.querySelectorAll("#sr-cloud button").forEach((b) => b.addEventListener("click", () => { artist = artist === b.dataset.a ? null : b.dataset.a; markArtist(); }));
    // Eventos destacados con filtro por año
    let year = "todos";
    function hitos() {
      const ys = ["todos", ...new Set(HITOS.map((h) => h.year))];
      $("#sr-years").innerHTML = ys.map((y) => `<button type="button" data-y="${y}" aria-pressed="${String(y) === String(year)}">${y === "todos" ? "Todos" : y}</button>`).join("");
      $("#sr-years").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { year = b.dataset.y; hitos(); }));
      $("#sr-hitos").innerHTML = HITOS.filter((h) => year === "todos" || String(h.year) === String(year)).map((h) => `
        <article class="sr-hito"><img src="${BASE}ev-${h.id}.webp" alt="Foto del evento ${h.name}" loading="lazy">
          <div><span class="sr-k">${h.year} · ${h.date}</span><h4>${h.name}</h4><p class="sr-place">${h.place}</p><p>${h.text}</p>
          ${h.lineup.length ? `<details><summary>Line up</summary><p class="sr-lu">${h.lineup.join(" · ")}</p></details>` : ""}</div></article>`).join("");
    }
    hitos();
    setClip(0);
    showEvent(sel);
  }
  window.CaseInteractive = Object.assign(window.CaseInteractive || {}, { secretroom: render });
})();

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
    { id: "purohouse", name: "Puro House Take over", year: 2025, place: "Ololo · Chicontepec 57, Hipódromo Condesa, CDMX", date: "Jueves 29 de mayo",
      text: "Take over en Ololo Condesa, un venue especializado en coctelería de autor y música house. Se llevó a cabo en conjunto con la agencia de booking Crossfade.",
      lineup: ["Chak Boolay", "Ohmem & Gascón", "Triztan", "Dan & Frank"] },
    { id: "rumores", name: "Rumores Take over", year: 2025, place: "Rumores, Ciudad de México", date: "Jueves 27 de noviembre",
      text: "Take over en Rumores, un venue de Ciudad de México especializado en música electrónica. Se llevó a cabo en conjunto con la marca SOMOS.",
      lineup: ["Chak Boolay", "Marcelo Cav", "Daybo", "Daam", "Brünne", "Nualart", "Jitsuo", "Nizzel", "Alephs"] },
    { id: "diente", name: "Diente de León Take over", year: 2026, place: "Diente de León · 7 Poniente 113, San Pedro Cholula, Puebla", date: "Viernes 17 de abril",
      text: "Take over en Diente de León, en Cholula, uno de los venues más populares del circuito de la música electrónica en Puebla.",
      lineup: ["Tierra de Ovnis", "Strawberry", "Chak Boolay", "Riclo", "Labrezote"] },
    { id: "aniversario", name: "5to Aniversario", year: 2026, place: "ODD, Cuernavaca", date: "Sábado 13 de junio",
      text: "Evento para celebrar el quinto aniversario de Secret Room. Se llevó a cabo en ODD, uno de los antros más grandes de Cuernavaca.",
      lineup: ["Chile", "Mariana Barcenas", "Chak Boolay", "MNDZ", "André Disarmo B2B He:rra"] },
  ];
  const EVENTS_COLORS = [["Rojo La Reta", "#a3213a"], ["Ámbar", "#e0701f"], ["Azul Premiere", "#2f5fc4"], ["Verde Xibalba", "#2f8a55"], ["Lila Pre Festival", "#8f7fa3"]];
  const S_POLY = ["113.0,0.0 314.0,0.0 315.0,1.0 292.0,41.0 288.0,46.0 272.0,74.0 268.0,79.0 226.0,149.0 224.0,149.0 223.0,146.0 224.0,72.0 222.0,68.0 218.0,64.0 215.0,63.0 207.0,64.0 152.0,87.0 133.0,94.0 130.0,96.0 128.0,96.0 125.0,98.0 123.0,98.0 120.0,100.0 118.0,100.0 108.0,105.0 101.0,112.0 97.0,120.0 96.0,129.0 99.0,139.0 101.0,141.0 128.0,192.0 130.0,194.0 133.0,201.0 135.0,203.0 138.0,210.0 140.0,212.0 143.0,219.0 155.0,239.0 160.0,250.0 154.0,248.0 143.0,240.0 140.0,239.0 28.0,165.0 18.0,156.0 14.0,149.0 12.0,142.0 12.0,130.0 15.0,121.0 39.0,81.0 43.0,76.0 59.0,48.0 63.0,43.0 70.0,30.0 78.0,18.0 90.0,7.0 101.0,2.0 112.0,1.0", "167.0,158.0 171.0,159.0 302.0,247.0 310.0,255.0 314.0,263.0 314.0,267.0 315.0,268.0 315.0,280.0 313.0,287.0 285.0,334.0 273.0,352.0 266.0,365.0 262.0,370.0 252.0,388.0 243.0,400.0 236.0,406.0 226.0,412.0 212.0,416.0 8.0,416.0 1.0,416.0 1.0,415.0 5.0,410.0 6.0,407.0 34.0,364.0 38.0,356.0 44.0,348.0 45.0,345.0 49.0,340.0 75.0,297.0 96.0,265.0 98.0,266.0 98.0,272.0 97.0,273.0 97.0,308.0 96.0,309.0 95.0,342.0 96.0,343.0 96.0,346.0 100.0,353.0 104.0,357.0 112.0,361.0 122.0,361.0 125.0,359.0 127.0,359.0 176.0,335.0 178.0,335.0 191.0,328.0 193.0,328.0 206.0,321.0 208.0,321.0 223.0,312.0 229.0,305.0 233.0,295.0 233.0,283.0 231.0,277.0 227.0,271.0 222.0,260.0 220.0,258.0 215.0,247.0 213.0,245.0 208.0,234.0 206.0,232.0 202.0,223.0 200.0,221.0 196.0,212.0 194.0,210.0 183.0,188.0 181.0,186.0 177.0,177.0 170.0,166.0 167.0,160.0"];
  const sSVG = (o = {}) => `<svg viewBox="-20 -20 357 457" aria-hidden="true" class="${o.cls || ""}">${S_POLY.map((p) => `<polygon points="${p}" fill="${o.fill || "none"}" stroke="${o.stroke || "none"}" stroke-width="${o.sw || 0}" stroke-linejoin="round" ${o.filter ? `filter="url(#${o.filter})"` : ""}/>`).join("")}</svg>`;
  const tee = (o) => `<svg viewBox="0 0 400 430" class="sr-tee-svg" role="img" aria-label="${o.label}">
      <path d="M128 30 Q200 66 272 30 L372 84 L340 164 L300 146 L300 410 Q200 424 100 410 L100 146 L60 164 L28 84 Z" fill="${o.color}" stroke="${o.line}" stroke-width="1.5"/>
      <path d="M128 30 Q200 ${o.back ? 50 : 84} 272 30" fill="none" stroke="${o.line}" stroke-width="5"/>
      ${o.art}</svg>`;
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
    let cur = 0, sel = 0, playing = !reduce, artist = null;
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
        <header class="sr-h"><span>01</span>Identidad de marca<span class="sr-years" id="sr-modo"><button type="button" data-m="neg" aria-pressed="true">Negativo</button><button type="button" data-m="pos" aria-pressed="false">Positivo</button></span></header>
        <div class="sr-brand" id="sr-brand" data-m="neg">
          <figure class="wide"><div class="sr-plate"><span class="sr-s"></span><span class="sr-wm sm"></span></div><figcaption>Logotipo principal · isotipo + nombre</figcaption></figure>
          <figure><div class="sr-plate"><span class="sr-s big"></span></div><figcaption>Isotipo</figcaption></figure>
          <figure><div class="sr-plate"><span class="sr-wm sm" style="width:80%"></span></div><figcaption>Nombre</figcaption></figure>
          <figure><div class="sr-plate"><span class="sr-out">${sSVG({ stroke: "currentColor", sw: 9 })}</span></div><figcaption>Isotipo en contorno · stickers y merch</figcaption></figure>
        </div>
        <div class="sr-type">
          <div><span class="sr-k">Principal · Garet · interletrado 210</span><p class="sr-garet big">Secret Room</p><p class="sr-garet">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ 0123456789</p><p class="sr-tnote">Títulos, nombres de eventos y line ups. Siempre en mayúsculas y muy espaciada.</p></div>
          <div><span class="sr-k">Secundaria · Montserrat Regular</span><p class="sr-mont big">Viernes 16 octubre</p><p class="sr-mont">Abcdefghijklmnñopqrstuvwxyz 0123456789</p><p class="sr-tnote">Fechas, sedes, textos de apoyo y pies de foto.</p></div>
        </div>
        <div class="sr-colors">
          <span style="background:#000;color:#fff">Negro<small>#000000</small></span><span style="background:#fff;color:#000">Blanco<small>#FFFFFF</small></span>
          ${EVENTS_COLORS.map(([n, c]) => `<span style="background:${c};color:#fff">${n}<small>${c.toUpperCase()}</small></span>`).join("")}
        </div>
        <p class="sr-note">La marca vive en negro y blanco. El color lo pone cada evento: su tono tiñe el flyer, la fecha y la S, que cambia de material en cada edición. El logotipo, el orden del flyer y la tipografía espaciada no cambian, así la serie se reconoce aunque cambie todo lo demás.</p>
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
        <header class="sr-h"><span>05</span>Flyers animados 2026<em>Se presentan uno por uno · toca para elegir</em></header>
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

      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <filter id="sr-spray" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d"/><feGaussianBlur in="d" stdDeviation="1.1" result="b"/><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.3" result="m"/><feComposite in="b" in2="m" operator="in"/></filter>
      </defs></svg>

      <section class="sr-sec">
        <header class="sr-h"><span>07</span>Merch · Playeras<span class="sr-years" id="sr-teecolor"><button type="button" data-c="negra" aria-pressed="true">Negra</button><button type="button" data-c="blanca" aria-pressed="false">Blanca</button><button type="button" data-c="roja" aria-pressed="false">Roja</button></span></header>
        <div class="sr-tees" id="sr-tees"></div>
        <p class="sr-note">Corte holgado y tela pesada. El gráfico grande va en la espalda, con la S en contorno pintado en aerosol; al frente solo una marca pequeña en el pecho.</p>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>08</span>Stickers<span class="sr-years" id="sr-stk"><button type="button" data-b="blanco" aria-pressed="true">Borde blanco</button><button type="button" data-b="negro" aria-pressed="false">Borde negro</button></span></header>
        <div class="sr-stickers" id="sr-stickers" data-b="blanco">
          <div class="sr-stkbg" style="background:url(${BASE}ev-xibalba.webp) center/cover"><span class="stk">${sSVG({ stroke: "currentColor", sw: 12 })}</span></div>
          <div class="sr-stkbg" style="background:#7d0f22"><span class="stk word"><svg viewBox="0 0 900 120" aria-hidden="true"><text x="450" y="88" text-anchor="middle" class="sr-stktext">SECRET ROOM</text></svg></span></div>
          <div class="sr-stkbg" style="background:url(${BASE}ev-rumores.webp) center/cover"><span class="stk round">${sSVG({ stroke: "currentColor", sw: 12 })}</span></div>
          <div class="sr-stkbg" style="background:#d0c4d3"><span class="stk lock">${sSVG({ stroke: "currentColor", sw: 12 })}<svg viewBox="0 0 900 120" aria-hidden="true"><text x="450" y="88" text-anchor="middle" class="sr-stktext">SECRET ROOM</text></svg></span></div>
        </div>
        <p class="sr-note">Stickers transparentes: la S y las letras van huecas y solo se imprime el borde, en blanco o en negro según la superficie. Así se ve lo que hay debajo: la laptop, el termo o la foto.</p>
      </section>

      <section class="sr-sec">
        <header class="sr-h"><span>09</span>Línea fotográfica</header>
        <div class="sr-fotos">
          ${[["ev-aniversario", "01", "Flash y barrido", "Flash directo con obturación lenta: la persona queda nítida y las luces dejan estela."], ["ev-xibalba", "02", "Todo en rojo", "Un solo tono domina la foto. Rojo y naranja como base; el color del evento como excepción."], ["dest", "03", "Cerca de la gente", "Planos cerrados de DJ y público. Caras, manos y gestos antes que el lugar vacío."], ["ev-garden", "04", "Texto mínimo", "Si lleva texto, es pequeño y en mayúsculas: nombre del evento y datos, sin tapar la escena."]].map(([img, n, t, d]) => `
          <figure><div class="sr-foto"><img src="${BASE}${img}.webp" alt="Ejemplo de la línea fotográfica: ${t}" loading="lazy"><span class="tag">[${n}] ${t}</span><span class="wm">Secret Room</span></div><figcaption><b>${t}</b>${d}</figcaption></figure>`).join("")}
        </div>
        <ul class="sr-list sr-rules"><li><b>Sí:</b> movimiento, grano, luz de color, contrapicados, manos arriba, cabina desde atrás.</li><li><b>No:</b> flash plano sin ambiente, fotos posadas en fila, filtros de colores mezclados, logos de terceros encima.</li><li><b>Edición:</b> contraste alto, negros profundos y un solo tinte por serie para que el feed se lea como una línea.</li></ul>
        <p class="sr-note">Las cuatro imágenes son fotos de eventos de Secret Room con el tratamiento de color aplicado en la web, como ejemplo del resultado que se busca.</p>
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
    // Identidad: positivo / negativo
    $("#sr-modo").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { $("#sr-brand").dataset.m = b.dataset.m; $("#sr-modo").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
    // Playeras
    const TEE = { negra: ["#0c0c0c", "#f4f2ef", "#2a2a2a"], blanca: ["#f4f2ef", "#0c0c0c", "#cfcac2"], roja: ["#8e1226", "#f4f2ef", "#5d0c19"] };
    function tees(c) {
      const [col, ink, line] = TEE[c];
      const g = (inner, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.28}" viewBox="-20 -20 357 457">${inner}</svg>`;
      const poly = (o) => S_POLY.map((p) => `<polygon points="${p}" fill="${o.fill || "none"}" stroke="${o.stroke || "none"}" stroke-width="${o.sw || 0}" stroke-linejoin="round" ${o.f ? 'filter="url(#sr-spray)"' : ""}/>`).join("");
      const word = (y, size) => `<text x="200" y="${y}" text-anchor="middle" fill="${ink}" class="sr-teetext" style="font-size:${size}px">SECRET ROOM</text>`;
      $("#sr-tees").innerHTML = [
        ["Espalda · S en aerosol", tee({ color: col, line, back: true, label: "Playera, espalda con la S en contorno de aerosol", art: g(poly({ stroke: ink, sw: 16, f: 1 }), 118, 110, 164) })],
        ["Frente · marca en el pecho", tee({ color: col, line, label: "Playera, frente con marca pequeña", art: g(poly({ fill: ink }), 236, 112, 30) + "" })],
        ["Espalda · S sólida y nombre", tee({ color: col, line, back: true, label: "Playera, espalda con S sólida y nombre", art: g(poly({ fill: ink }), 150, 104, 100) + word(266, 13) })],
        ["Frente · nombre al centro", tee({ color: col, line, label: "Playera, frente con el nombre", art: word(170, 17) })],
      ].map(([cap, svg]) => `<figure>${svg}<figcaption>${cap}</figcaption></figure>`).join("");
    }
    $("#sr-teecolor").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { tees(b.dataset.c); $("#sr-teecolor").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
    tees("negra");
    // Stickers: borde blanco o negro
    $("#sr-stk").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { $("#sr-stickers").dataset.b = b.dataset.b; $("#sr-stk").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
    // Flyers: se presentan uno por uno
    let auto = 0;
    const nextFlyer = () => { if (!root.isConnected) return clearInterval(auto); const r = $("#sr-detail").getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; showEvent((sel + 1) % EVENTS.length); };
    const startAuto = () => { clearInterval(auto); if (!reduce) auto = setInterval(nextFlyer, 9000); };
    root.querySelectorAll(".sr-thumb").forEach((t) => t.addEventListener("click", startAuto));
    startAuto();
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

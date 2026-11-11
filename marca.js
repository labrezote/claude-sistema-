/* =========================================================
   Piedra Bruta — marca.js
   Símbolos de Bruta, trazo derretido, fotografía simulada
   y logotipo derretido. Lo usa app.js a través de window.Marca.
   ========================================================= */
(() => {
  const state = { trazo: "linea" };
  const fx = document.getElementById("fx");
  /* ===== Filtros: trazo derretido (desplazamiento + desenfoque + umbral) ===== */
  [["melt-suave", 16, 2.8], ["melt-intensa", 60, 5.5]].forEach(([id, sc, bl]) => fx.insertAdjacentHTML("beforeend", `
    <filter id="${id}" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="5" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="${bl}" result="b"/>
      <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"/>
    </filter>`));
  fx.insertAdjacentHTML("beforeend", `
    <filter id="melt" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="5" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="34" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="4" result="b"/>
      <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"/>
    </filter>`);
  fx.insertAdjacentHTML("beforeend", `
    <filter id="outline" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="erode" radius="3.2" result="e"/><feComposite in="SourceGraphic" in2="e" operator="out"/></filter>
    <filter id="outline-melt" x="-10%" y="-20%" width="120%" height="140%"><feMorphology in="SourceAlpha" operator="erode" radius="5" result="e"/><feComposite in="SourceGraphic" in2="e" operator="out"/></filter>`);
  [3, 7, 11].forEach((seed, i) => fx.insertAdjacentHTML("beforeend", `<filter id="wob${i}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>`));
  [3, 7, 11].forEach((seed, i) => {
    fx.insertAdjacentHTML("beforeend", `
      <filter id="goo${i}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="3.2" result="b"/>
        <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/>
      </filter>`);
  });

  /* ===== Símbolos (caja 200 × 200). Cada uno: formas blancas, huecos y detalles sobre el hueco ===== */
  const ray = (cx, cy, a, r0, r1, w) => `<line x1="${cx + Math.cos(a) * r0}" y1="${cy + Math.sin(a) * r0}" x2="${cx + Math.cos(a) * r1}" y2="${cy + Math.sin(a) * r1}" stroke-width="${w}"/>`;
  const spiral = (R = 62, turns = 5.2) => { let d = ""; for (let t = 0; t <= 1; t += 0.01) { const a = t * Math.PI * turns, r = 8 + t * R; d += (t ? " L" : "M") + (100 + Math.cos(a) * r).toFixed(1) + " " + (100 + Math.sin(a) * r).toFixed(1); } return d; };
  const sun = (cx, cy, r, n, len, w, rot) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>` + Array.from({ length: n }, (_, k) => ray(cx, cy, rot + (k / n) * Math.PI * 2, r * .6, r + len * (0.7 + ((k * 37) % 10) / 22), w)).join("");
  /* Bruta en distintas poses: misma piedra, ojos y corte; cambian brazos, piernas y gestos.
     body = formas rellenas · lines = trazos (brazos, piernas, accesorios) · cut = corte de la piedra
     holes = huecos (ojos) · eyeLines = ojos cerrados · over = pupilas y puntos siempre rellenos */
  const ROCK = "M60 214 C40 182 46 138 72 110 C92 88 110 66 146 52 C178 40 214 36 246 40 L300 52 L352 118 C368 146 372 178 362 208 C350 240 322 262 284 274 C240 286 186 288 140 280 C102 273 74 248 60 214 Z";
  const heart = (x, y, r) => `M${x} ${y + r * .85} C${x - r * 1.5} ${y - r * .1} ${x - r * .6} ${y - r * 1.15} ${x} ${y - r * .35} C${x + r * .6} ${y - r * 1.15} ${x + r * 1.5} ${y - r * .1} ${x} ${y + r * .85} Z`;
  const rockAt = (tx, ty, sc) => `<path transform="translate(${tx} ${ty}) scale(${sc})" d="${ROCK}"/>`;
  function rockParts(tx, ty, sc, eyes) {
    const P = (x, y) => [x * sc + tx, y * sc + ty];
    const [lx, ly] = P(160, 132), [rx, ry] = P(236, 126), rL = 36 * sc, rR = 27 * sc;
    const cut = [P(246, 40), P(258, 84), P(316, 130), P(352, 118)].map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
    const arc = (x, y, r) => `<path d="M${x - r} ${y - r * .1} Q${x} ${y + r * .8} ${x + r} ${y - r * .1}" stroke-width="${Math.max(4, r * .45)}"/>`;
    const pupil = (x, y, r, dx, dy, k = .47) => `<circle cx="${x + r * dx}" cy="${y + r * dy}" r="${r * k}"/>`;
    let holes = "", over = "", eyeLines = "", eyeRing = "";
    const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
    if (eyes === "open" || eyes === "up" || eyes === "wide") {
      holes = `<circle cx="${lx}" cy="${ly}" r="${rL}"/><circle cx="${rx}" cy="${ry}" r="${rR}"/>`;
      const [dx, dy, k] = eyes === "up" ? [.15, -.45, .47] : eyes === "wide" ? [0, .02, .42] : [-.28, .42, .47];
      over = pupil(lx, ly, rL, dx, dy, k) + pupil(rx, ry, rR, dx, dy, k);
      eyeRing = ring(lx, ly, rL) + ring(rx, ry, rR);
    } else if (eyes === "wink") {
      holes = `<circle cx="${lx}" cy="${ly}" r="${rL}"/>`; over = pupil(lx, ly, rL, -.25, .4); eyeLines = arc(rx, ry, rR); eyeRing = ring(lx, ly, rL);
    } else if (eyes === "closed") {
      eyeLines = arc(lx, ly, rL) + arc(rx, ry, rR);
    } else if (eyes === "heart") {
      holes = `<path d="${heart(lx, ly, rL * 1.05)}"/><path d="${heart(rx, ry, rR * 1.05)}"/>`;
      eyeRing = `<path d="${heart(lx, ly, rL * .9)}"/><path d="${heart(rx, ry, rR * .9)}"/>`;
    }
    return { body: rockAt(tx, ty, sc), cut, cw: Math.max(4, 12 * sc), holes, over, eyeLines, eyeRing };
  }
  function bru({ tx, ty, sc, eyes = "open", limbs = "", lines = "", fills = "", dots = "", goo = 1, id, name, note }) {
    const r = rockParts(tx, ty, sc, eyes);
    return { id, name, note, goo, cut: r.cut, cw: r.cw, holes: r.holes, eyeLines: r.eyeLines, eyeRing: r.eyeRing,
      body: r.body + fills,
      lines: (limbs ? `<g stroke-width="11">${limbs}</g>` : "") + lines,
      over: r.over + dots };
  }

  const SYMBOLS = [
    bru({ id: "bruta", name: "Bruta", note: "La mascota: piedra con la esquina tallada, ojos huecos y pupilas sueltas.", goo: 0, tx: 10, ty: 32, sc: .45 }),
    bru({ id: "corre", name: "Bruta corre", note: "Bruta con piernas y brazos, en movimiento. Para eventos, avisos y campañas.", tx: 28, ty: 10, sc: .36,
      limbs: `<path d="M82 110 L68 140 L48 148"/><path d="M118 112 L138 136 L134 168"/><path d="M48 82 L26 70"/><path d="M158 76 L180 58"/>` }),
    bru({ id: "guino", name: "Guiño", note: "Bruta guiña un ojo: complicidad y buen humor. Para redes y mensajes cercanos.", goo: 0, tx: 10, ty: 32, sc: .45, eyes: "wink" }),
    bru({ id: "salta", name: "Salta", note: "Bruta brinca de gusto: lanzamientos, logros y buenas noticias.", tx: 28, ty: 2, sc: .36, eyes: "up",
      limbs: `<path d="M50 58 L32 30"/><path d="M156 52 L176 24"/><path d="M80 98 L70 124 L84 142"/><path d="M118 98 L132 122 L120 142"/>`,
      lines: `<g stroke-width="6"><path d="M66 172 L92 172"/><path d="M108 178 L136 178"/></g>` }),
    bru({ id: "saluda", name: "Saluda", note: "Bruta dice hola: bienvenidas, contacto y primeros mensajes.", tx: 22, ty: 22, sc: .36,
      limbs: `<path d="M44 104 L30 128"/><path d="M152 92 L172 66 L182 46"/><path d="M78 124 L74 166 L62 170"/><path d="M112 124 L116 166 L128 170"/>`,
      lines: `<g stroke-width="4"><path d="M176 30 Q190 32 194 46"/><path d="M168 24 Q190 18 200 40"/></g>` }),
    bru({ id: "duerme", name: "Duerme", note: "Bruta descansa: fuera de horario, vacaciones y pausas.", tx: 10, ty: 50, sc: .45, eyes: "closed",
      lines: `<g stroke-width="6"><path d="M148 22 L168 22 L148 42 L168 42"/><path d="M174 4 L186 4 L174 16 L186 16"/></g>` }),
    bru({ id: "sorpresa", name: "Sorpresa", note: "Bruta con los ojos muy abiertos: novedades, avisos y algo que no te esperas.", tx: 10, ty: 40, sc: .45, eyes: "wide",
      lines: `<g stroke-width="7"><path d="M100 4 L100 24"/><path d="M66 12 L74 30"/><path d="M134 12 L126 30"/></g>` }),
    bru({ id: "idea", name: "Idea", note: "A Bruta se le ocurre algo: procesos creativos, talleres y propuestas.", tx: 10, ty: 50, sc: .45, eyes: "up",
      fills: `<path d="M100 0 C102 18 108 24 126 26 C108 28 102 34 100 52 C98 34 92 28 74 26 C92 24 98 18 100 0 Z"/>`,
      lines: `<g stroke-width="5"><path d="M136 12 L144 6"/><path d="M64 12 L56 6"/></g>` }),
    bru({ id: "enamorada", name: "Enamorada", note: "Bruta con ojos de corazón: clientes felices, testimonios y fechas especiales.", tx: 10, ty: 40, sc: .45, eyes: "heart",
      fills: `<path d="${heart(160, 30, 13)}"/><path d="${heart(182, 10, 8)}"/>` }),
    bru({ id: "baila", name: "Baila", note: "Bruta bailando: eventos, fiestas y lanzamientos con música.", tx: 28, ty: 10, sc: .36,
      limbs: `<path d="M50 66 L28 46"/><path d="M158 86 L180 104"/><path d="M80 112 L102 146 L92 170"/><path d="M118 112 L98 146 L112 170"/>`,
      lines: `<path d="M174 44 L174 18 L188 22" stroke-width="5"/>`, dots: `<circle cx="168" cy="44" r="7"/>` }),
    bru({ id: "talla", name: "Talla", note: "Bruta trabajando con su cincel: el oficio, el proceso y el detrás de cámaras.", tx: 14, ty: 22, sc: .36,
      limbs: `<path d="M36 104 L22 126"/><path d="M144 92 L164 108"/><path d="M70 124 L66 166 L54 170"/><path d="M104 124 L108 166 L120 170"/>`,
      fills: `<path d="M158 118 L186 78 L196 86 L168 124 Z"/>`, dots: `<circle cx="180" cy="128" r="4.5"/><circle cx="192" cy="118" r="3.5"/><circle cx="170" cy="136" r="3"/>` }),
    { id: "molcajete", name: "Molcajete", note: "Piedra volcánica mexicana que muele y mezcla: talleres, ideas y recetas de marca.", goo: 1, noLineHoles: true,
      body: `<path d="M34 96 L166 96 C166 138 138 158 100 158 C62 158 34 138 34 96 Z"/><path d="M118 80 L158 30" fill="none" stroke-width="24" stroke-linecap="round"/>`,
      lines: `<g stroke-width="15"><path d="M62 146 L52 180"/><path d="M100 156 L100 184"/><path d="M138 146 L148 180"/></g>`,
      holes: `<circle cx="66" cy="118" r="4"/><circle cx="92" cy="132" r="3.5"/><circle cx="122" cy="122" r="4.5"/><circle cx="142" cy="110" r="3"/><circle cx="104" cy="112" r="3"/><circle cx="78" cy="140" r="3"/>` },
  ];
  let mid = 0;
  const lineMode = () => typeof state !== "undefined" && state.trazo === "linea";
  function symSVG(id, solid) {
    const s = SYMBOLS.find((x) => x.id === id), m = "m" + mid++;
    const line = !solid && lineMode();
    const LN = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
    if (!line) {
      const holes = (s.holes || "") + (s.cut ? `<path d="${s.cut}" fill="none" stroke="#000" stroke-width="${s.cw}" stroke-linejoin="round"/>` : "") + (s.eyeLines ? `<g fill="none" stroke="#000" stroke-linecap="round">${s.eyeLines}</g>` : "");
      const mask = holes ? `<mask id="${m}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="280" height="280"><rect x="-40" y="-40" width="280" height="280" fill="#fff"/><g fill="#000" filter="url(#goo${s.goo})">${holes}</g></mask>` : "";
      return `<svg viewBox="0 0 200 200" aria-hidden="true">${mask}<g ${holes ? `mask="url(#${m})"` : ""}><g fill="currentColor" stroke="currentColor" filter="url(#goo${s.goo})">${s.body}<g ${LN}>${s.lines || ""}</g></g></g>${s.over ? `<g fill="currentColor" filter="url(#goo${s.goo})">${s.over}</g>` : ""}</svg>`;
    }
    // Línea: la piedra se contornea; brazos, corte y ojos cerrados son un solo trazo del mismo grosor
    const lh = s.eyeRing || s.noLineHoles ? "" : s.holes;
    const mask = lh ? `<mask id="${m}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="280" height="280"><rect x="-40" y="-40" width="280" height="280" fill="#fff"/><g fill="#000" filter="url(#goo${s.goo})">${lh}</g></mask>` : "";
    const R = 3.2;
    return `<svg viewBox="0 0 200 200" aria-hidden="true" data-line="1"><filter id="o${m}" x="-10%" y="-10%" width="120%" height="120%"><feMorphology class="er" in="SourceAlpha" operator="erode" radius="${R}" result="e"/><feComposite in="SourceGraphic" in2="e" operator="out"/></filter>${mask}
      <g filter="url(#o${m})"><g ${lh ? `mask="url(#${m})"` : ""}><g fill="currentColor" stroke="currentColor" filter="url(#goo${s.goo})">${s.body}</g></g></g>
      <g class="ln" ${LN} style="--sw:${R}px" filter="url(#wob${s.goo})">${s.lines || ""}${s.cut ? `<path d="${s.cut}"/>` : ""}${s.eyeLines || ""}${s.eyeRing || ""}</g>
      ${s.over ? `<g fill="currentColor" filter="url(#goo${s.goo})">${s.over}</g>` : ""}</svg>`;
  }
  /* Grosor parejo: el trazo depende del tamaño en pantalla, no de la escala del dibujo */
  function fixStrokes(root) {
    (root || document).querySelectorAll("svg[data-line]").forEach((svg) => {
      const w = svg.getBoundingClientRect().width; if (!w) return;
      const vb = svg.viewBox.baseVal.width || 200;
      // Sobre foto: trazo fino, proporcional (como la primera versión). Sin foto: trazo más presente.
      const onPhoto = !!svg.closest(".poster, .site, .bc.back, .onphoto, .thin");
      const px = onPhoto ? Math.max(2, w * 0.022) : Math.min(16, 0.026 * Math.min(w, 600) + 3.5);
      const r = Math.min((px * vb) / w, vb > 200 ? 7 : 12);
      svg.querySelectorAll(".er").forEach((e) => e.setAttribute("radius", r.toFixed(2)));
      svg.querySelectorAll(".ln").forEach((g) => g.style.setProperty("--sw", r.toFixed(2) + "px"));
    });
  }

  /* ===== Fotografía simulada: manchas de color, barrido de movimiento y grano ===== */
  const MOODS = [
    { id: "monte", name: "Monte", note: "Bosque visto desde la carretera: musgo, ocre y destellos de luz.", sw: ["#2c2c1b", "#4f4e2a", "#8a7a3c", "#b49a5c", "#d9d5c9"], dir: [-0.94, 0.34] },
    { id: "cempasuchil", name: "Cempasúchil", note: "Campo de flor de muerto: naranja, amarillo y un cielo pálido.", sw: ["#2f3a1e", "#5d6b2c", "#d9481a", "#ef7d1d", "#f2b51e", "#cfdfe2"], dir: [0, 1] },
    { id: "tierra", name: "Tierra", note: "Ladera volcánica bajo cielo despejado: barro, café y azul.", sw: ["#3d2717", "#6b4a2e", "#9a7550", "#7fa6d6", "#c9d9ec"], dir: [-0.6, -0.8] },
    { id: "agave", name: "Agave", note: "Hojas a contraluz: verde profundo y verde lima.", sw: ["#0d1f0c", "#1f4a17", "#3f8f2a", "#7cc23a", "#c7ef7a"], dir: [0.5, -0.86] },
    { id: "fogata", name: "Fogata", note: "Fuego de noche movido: brasas naranjas sobre negro.", sw: ["#120a06", "#3a1a0c", "#b8410f", "#f08a1e", "#ffd27a"], dir: [0.15, -1], blur: 6, len: 80 },
    { id: "mar", name: "Mar", note: "Pacífico desde la lancha: azul profundo, espuma y horizonte pálido.", sw: ["#0f3f55", "#1f6f8b", "#4fa3b8", "#d8e4ea", "#f4f1ea"], dir: [1, 0], blur: 3, len: 140 },
    { id: "desierto", name: "Desierto", note: "Dunas de Sonora al atardecer: arena, sombra y cielo cálido.", sw: ["#7a4a24", "#a86c38", "#d9a66a", "#efc99a", "#f6e6cf"], dir: [1, 0.1], blur: 2, len: 50 },
    { id: "bugambilia", name: "Bugambilia", note: "Bugambilias fuera de foco: magenta intenso sobre verde oscuro.", sw: ["#1f2a17", "#3d5a2a", "#8e1060", "#c2187a", "#f08cc4"], dir: [0.7, 0.7], blur: 10, len: 30 },
    { id: "niebla", name: "Niebla", note: "Bosque de niebla: troncos que se pierden en gris verdoso.", sw: ["#2e3a34", "#4a5650", "#7f8a82", "#b4bab2", "#dfe1dc"], dir: [0, 1], blur: 6, len: 50 },
    { id: "carretera", name: "Carretera", note: "Luces de autos de noche en exposición larga: rojo, ámbar y blanco.", sw: ["#07080c", "#1a1d2a", "#ff3b2f", "#ffb347", "#f5efe0"], dir: [1, 0], blur: 2, len: 180 },
    { id: "atardecer", name: "Atardecer", note: "Sol bajo detrás del cerro: violeta, rojo y naranja.", sw: ["#1a1210", "#2b1b3a", "#c4462c", "#f2a33a", "#ffd9a0"], dir: [1, 0], blur: 4, len: 70 },
    { id: "papelverde", name: "Papel verde", note: "Papel de algodón verde con fibras: plano, táctil y editorial.", sw: ["#2f4a3a", "#3f5f4a", "#56735f", "#8fa58f", "#dfe6d8"], paper: "#3f5f4a", dir: [1, 0], blur: .3, len: 0 },
    { id: "kraft", name: "Kraft", note: "Papel kraft de empaque: café cálido con fibras visibles.", sw: ["#6e4f33", "#8a6644", "#a58157", "#c9ad86", "#efe3cc"], paper: "#9a744d", dir: [1, 0], blur: .3, len: 0 },
    { id: "papelnoche", name: "Papel noche", note: "Cartulina negra con fibras: sobria y elegante para papelería.", sw: ["#121211", "#1b1b19", "#2c2b28", "#55524b", "#f3efe4"], paper: "#1b1b19", dir: [1, 0], blur: .3, len: 0 },
    { id: "oxido", name: "Papel óxido", note: "Papel rojo tierra, como el tezontle: cálido y con carácter.", sw: ["#5e2418", "#7a3022", "#8e3a2a", "#b0604c", "#f1dccf"], paper: "#8e3a2a", dir: [1, 0], blur: .3, len: 0 },
    { id: "fiesta", name: "Fiesta", note: "Pista de noche: haces de luz roja, humo y gente con las manos arriba.", sw: ["#050303", "#1a0505", "#6e0b0b", "#d01818", "#ff5a4a"], dir: [0.25, 1], blur: 2.5, len: 26 },
    { id: "cielo", name: "Cielo", note: "Nubes altas en un cielo claro de mediodía.", sw: ["#8fb6dc", "#b9d3ea", "#dfeaf3", "#f4f6f5", "#ffffff"], dir: [1, 0], blur: 8, len: 70 },
    { id: "salinas", name: "Salinas", note: "Salinas rosadas de Yucatán: agua rosa, sal blanca y cielo pálido.", sw: ["#e9a6b0", "#f2c4c6", "#f7dedb", "#fbf1ec", "#dcebf0"], dir: [1, 0], blur: 4, len: 90 },
    { id: "maiz", name: "Maíz", note: "Milpa dorada a contraluz al final de la tarde.", sw: ["#8a6a1e", "#c79a2e", "#e8c75a", "#f6e4a0", "#fdf5d6"], dir: [0.1, 1], blur: 5, len: 80 },
    { id: "estrellas", name: "Estrellas", note: "Cielo nocturno de la sierra: azul profundo y rastro de estrellas.", sw: ["#03040c", "#0a1030", "#1a2a5c", "#6f86c8", "#e8eeff"], dir: [0.6, 0.8], blur: 1, len: 30 },
    { id: "cantera", name: "Cantera", note: "Piedra de cantera rosa de cerca: textura, poros y tono cálido.", sw: ["#8a5a4a", "#b07c69", "#c99a86", "#d9b3a1", "#efd9cc"], dir: [1, 0.3], blur: 0.8, len: 4 },
  ];
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const cache = {};
  function photo(mood, seed, W, H) {
    const key = [mood, seed, W, H].join("-"); if (cache[key]) return cache[key];
    const M = MOODS.find((m) => m.id === mood), r = rng(seed * 131 + mood.length);
    const base = document.createElement("canvas"); base.width = W; base.height = H;
    const b = base.getContext("2d");
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    if (mood === "monte") {
      b.fillStyle = "#3a3a22"; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) { b.fillStyle = pick(M.sw.slice(0, 4)); b.beginPath(); b.ellipse(r() * W, r() * H, 20 + r() * W * .2, 10 + r() * H * .12, r() * 3, 0, 7); b.fill(); }
      for (let i = 0; i < 6; i++) { b.fillStyle = "#e4e0d4"; b.beginPath(); b.ellipse(r() * W, (r() < .5 ? r() * .25 : .75 + r() * .25) * H, 30 + r() * W * .25, 8 + r() * 20, 0, 0, 7); b.fill(); }
    } else if (mood === "cempasuchil") {
      const g = b.createLinearGradient(0, 0, 0, H * .38); g.addColorStop(0, "#d3e3e6"); g.addColorStop(1, "#e9e3d4");
      b.fillStyle = "#3d4a22"; b.fillRect(0, 0, W, H); b.fillStyle = g; b.fillRect(0, 0, W, H * .36);
      for (let i = 0; i < 260; i++) { const y = H * .36 + r() * H * .66, s = (y / H) ** 2.2; b.fillStyle = pick(["#d9481a", "#ef7d1d", "#f2b51e", "#ef7d1d", "#5d6b2c", "#2f3a1e"]); b.beginPath(); b.ellipse(r() * W, y, 6 + s * 40, 10 + s * 50, 0, 0, 7); b.fill(); }
    } else if (mood === "tierra") {
      const g = b.createLinearGradient(W, 0, 0, H); g.addColorStop(0, "#c9d9ec"); g.addColorStop(.6, "#7fa6d6");
      b.fillStyle = g; b.fillRect(0, 0, W, H);
      b.fillStyle = "#e9eef5"; for (let i = 0; i < 4; i++) { b.beginPath(); b.ellipse(W * (.5 + r() * .5), H * r() * .3, 40 + r() * 60, 12 + r() * 14, 0, 0, 7); b.fill(); }
      b.fillStyle = "#6b4a2e"; b.beginPath(); b.moveTo(0, H * .28); b.lineTo(W, H * .78); b.lineTo(W, H); b.lineTo(0, H); b.closePath(); b.fill();
      for (let i = 0; i < 900; i++) { const x = r() * W, y = r() * H; if (y < H * .28 + (x / W) * H * .5) continue; b.fillStyle = pick(["#3d2717", "#4f3420", "#9a7550", "#7a5a3a"]); b.beginPath(); b.ellipse(x, y, 2 + r() * 9, 2 + r() * 6, r() * 3, 0, 7); b.fill(); }
    } else if (M.paper) {
      b.fillStyle = M.paper; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { b.fillStyle = r() < .5 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.05)"; b.beginPath(); b.ellipse(r() * W, r() * H, 40 + r() * 120, 30 + r() * 90, r() * 3, 0, 7); b.fill(); }
      for (let i = 0; i < W * H / 260; i++) { const a = r() * 3.14, l = 3 + r() * 12, x = r() * W, y = r() * H; b.strokeStyle = r() < .5 ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"; b.lineWidth = .6 + r() * .6; b.beginPath(); b.moveTo(x, y); b.quadraticCurveTo(x + Math.cos(a) * l * .5 + (r() - .5) * 3, y + Math.sin(a) * l * .5 + (r() - .5) * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); b.stroke(); }
    } else if (mood === "fogata") {
      b.fillStyle = "#120a06"; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 140; i++) { const y = H * (.35 + r() * .7), x = W * (.5 + (r() - .5) * (1.2 - (y / H) * .6)); b.fillStyle = pick(["#3a1a0c", "#b8410f", "#f08a1e", "#f08a1e", "#ffd27a", "#b8410f"]); b.beginPath(); b.ellipse(x, y, 4 + r() * 26, 8 + r() * 40, 0, 0, 7); b.fill(); }
      for (let i = 0; i < 40; i++) { b.fillStyle = "#ffcf7a"; b.beginPath(); b.arc(r() * W, r() * H * .6, 1 + r() * 3, 0, 7); b.fill(); }
    } else if (mood === "mar") {
      const g = b.createLinearGradient(0, 0, 0, H * .42); g.addColorStop(0, "#c9dbe4"); g.addColorStop(1, "#eef0ea");
      b.fillStyle = g; b.fillRect(0, 0, W, H * .42);
      const s2 = b.createLinearGradient(0, H * .42, 0, H); s2.addColorStop(0, "#2f7f98"); s2.addColorStop(1, "#0d3346");
      b.fillStyle = s2; b.fillRect(0, H * .42, W, H);
      for (let i = 0; i < 160; i++) { const y = H * (.43 + r() * .57); b.fillStyle = pick(["#4fa3b8", "#1f6f8b", "#0f3f55", "#f4f1ea", "#4fa3b8"]); b.beginPath(); b.ellipse(r() * W, y, 10 + r() * 70, 1 + (y / H) * 6, 0, 0, 7); b.fill(); }
    } else if (mood === "desierto") {
      const g = b.createLinearGradient(0, 0, 0, H * .5); g.addColorStop(0, "#e8b98a"); g.addColorStop(1, "#f6e6cf");
      b.fillStyle = g; b.fillRect(0, 0, W, H);
      [[.42, "#efc99a"], [.55, "#d9a66a"], [.68, "#c48a4e"], [.82, "#a86c38"]].forEach(([y0, c]) => {
        b.fillStyle = c; b.beginPath(); b.moveTo(0, H); let x = 0; b.lineTo(0, H * y0);
        while (x <= W) { x += W / 6; b.quadraticCurveTo(x - W / 12, H * (y0 - .06 * r()), x, H * (y0 + (r() - .5) * .06)); }
        b.lineTo(W, H); b.closePath(); b.fill();
        b.fillStyle = "rgba(122,74,36,.35)"; b.beginPath(); b.ellipse(W * r(), H * (y0 + .05), W * .3, H * .02, 0, 0, 7); b.fill();
      });
    } else if (mood === "bugambilia") {
      b.fillStyle = "#1f2a17"; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 30; i++) { b.fillStyle = pick(["#3d5a2a", "#2a3d1d"]); b.beginPath(); b.ellipse(r() * W, r() * H, 30 + r() * 60, 15 + r() * 30, r() * 3, 0, 7); b.fill(); }
      for (let i = 0; i < 90; i++) { b.fillStyle = pick(["#8e1060", "#c2187a", "#e04aa0", "#f08cc4", "#c2187a"]); b.beginPath(); b.ellipse(r() * W, r() * H, 8 + r() * 34, 8 + r() * 26, r() * 3, 0, 7); b.fill(); }
    } else if (mood === "niebla") {
      const g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#d9dcd6"); g.addColorStop(1, "#9aa29a");
      b.fillStyle = g; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const d = r(); b.globalAlpha = .25 + d * .7; b.fillStyle = d > .6 ? "#2e3a34" : "#4a5650"; const x = r() * W, w = 6 + d * 26; b.fillRect(x, 0, w, H); b.beginPath(); b.ellipse(x + w / 2, H * (.1 + r() * .4), w * 3, H * .12, 0, 0, 7); b.fill(); }
      b.globalAlpha = .55; b.fillStyle = "#e6e8e3"; for (let i = 0; i < 5; i++) { b.beginPath(); b.ellipse(W * r(), H * (.3 + r() * .6), W * .6, H * .06, 0, 0, 7); b.fill(); }
      b.globalAlpha = 1;
    } else if (mood === "fiesta") {
      b.fillStyle = "#050303"; b.fillRect(0, 0, W, H);
      const halo = b.createRadialGradient(W * .5, H * .12, 0, W * .5, H * .12, W * .9);
      halo.addColorStop(0, "rgba(255,40,30,.55)"); halo.addColorStop(.45, "rgba(140,8,8,.35)"); halo.addColorStop(1, "rgba(0,0,0,0)");
      b.fillStyle = halo; b.fillRect(0, 0, W, H);
      b.globalCompositeOperation = "lighter";
      for (let i = 0; i < 16; i++) { // haces de luz desde el techo
        const x0 = W * (.2 + r() * .6), ang = (r() - .5) * 1.5, len = H * 1.3, w0 = 3 + r() * 10, w1 = 40 + r() * 140;
        const x1 = x0 + Math.sin(ang) * len, y1 = Math.cos(ang) * len;
        const g = b.createLinearGradient(x0, 0, x1, y1); g.addColorStop(0, `rgba(255,${30 + r() * 50 | 0},30,.55)`); g.addColorStop(1, "rgba(120,0,0,0)");
        b.fillStyle = g; b.beginPath(); b.moveTo(x0 - w0, 0); b.lineTo(x0 + w0, 0); b.lineTo(x1 + w1, y1); b.lineTo(x1 - w1, y1); b.closePath(); b.fill();
      }
      for (let i = 0; i < 70; i++) { b.fillStyle = `rgba(255,${40 + r() * 80 | 0},${30 + r() * 40 | 0},${.12 + r() * .35})`; b.beginPath(); b.arc(r() * W, r() * H * .7, 2 + r() * 16, 0, 7); b.fill(); }
      b.globalCompositeOperation = "source-over";
      b.fillStyle = "rgba(60,4,4,.35)"; for (let i = 0; i < 6; i++) { b.beginPath(); b.ellipse(r() * W, H * (.45 + r() * .3), W * .5, H * .08, 0, 0, 7); b.fill(); }
      b.fillStyle = "#020101"; // público con las manos arriba
      for (let i = 0; i < 46; i++) {
        const x = (i / 45) * W + (r() - .5) * 30, hy = H * (.8 + r() * .1), hr = 14 + r() * 12;
        b.beginPath(); b.arc(x, hy, hr, 0, 7); b.fill(); b.fillRect(x - hr * 1.6, hy + hr * .6, hr * 3.2, H);
        if (r() < .45) { b.save(); b.translate(x + (r() - .5) * hr, hy); b.rotate((r() - .5) * .6); b.fillRect(-4, -hr * 4.5, 8, hr * 4.5); b.beginPath(); b.arc(0, -hr * 4.6, 7, 0, 7); b.fill(); b.restore(); }
      }
    } else if (mood === "cielo") {
      const g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#9cc0e2"); g.addColorStop(1, "#e6eef4"); b.fillStyle = g; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 46; i++) { b.fillStyle = pick(["#ffffff", "#f4f6f5", "#e7eef3"]); b.globalAlpha = .5 + r() * .5; b.beginPath(); b.ellipse(r() * W, r() * H, 40 + r() * W * .22, 14 + r() * 40, 0, 0, 7); b.fill(); }
      b.globalAlpha = 1;
    } else if (mood === "salinas") {
      const g = b.createLinearGradient(0, 0, 0, H * .45); g.addColorStop(0, "#d6e8ee"); g.addColorStop(1, "#f6ece8"); b.fillStyle = "#f2c4c6"; b.fillRect(0, 0, W, H); b.fillStyle = g; b.fillRect(0, 0, W, H * .45);
      for (let i = 0; i < 120; i++) { const y = H * (.46 + r() * .54); b.fillStyle = pick(["#e9a6b0", "#f7dedb", "#fbf1ec", "#f2c4c6", "#ffffff"]); b.beginPath(); b.ellipse(r() * W, y, 20 + r() * 110, 2 + (y / H) * 7, 0, 0, 7); b.fill(); }
    } else if (mood === "maiz") {
      const g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#fdf5d6"); g.addColorStop(.5, "#f0d27a"); g.addColorStop(1, "#b98a28"); b.fillStyle = g; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) { b.strokeStyle = pick(["#c79a2e", "#e8c75a", "#f6e4a0", "#8a6a1e"]); b.lineWidth = 4 + r() * 14; b.lineCap = "round"; const x = r() * W; b.beginPath(); b.moveTo(x, H * 1.05); b.quadraticCurveTo(x + (r() - .5) * 80, H * .6, x + (r() - .5) * 140, H * (.15 + r() * .35)); b.stroke(); }
      b.fillStyle = "rgba(255,250,225,.55)"; b.beginPath(); b.arc(W * .7, H * .2, W * .22, 0, 7); b.fill();
    } else if (mood === "estrellas") {
      const g = b.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#03040c"); g.addColorStop(.6, "#0a1030"); g.addColorStop(1, "#1a2a5c"); b.fillStyle = g; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 420; i++) { b.fillStyle = pick(["#e8eeff", "#ffffff", "#9fb2ea", "#ffe9c4"]); b.globalAlpha = .3 + r() * .7; b.beginPath(); b.arc(r() * W, r() * H, .6 + r() * 2.2, 0, 7); b.fill(); }
      b.globalAlpha = .25; b.fillStyle = "#6f86c8"; b.beginPath(); b.ellipse(W * .5, H * .45, W * .7, H * .12, -.5, 0, 7); b.fill(); b.globalAlpha = 1;
      b.fillStyle = "#020207"; b.beginPath(); b.moveTo(0, H * .86); b.quadraticCurveTo(W * .3, H * .74, W * .6, H * .88); b.quadraticCurveTo(W * .82, H * .8, W, H * .9); b.lineTo(W, H); b.lineTo(0, H); b.closePath(); b.fill();
    } else if (mood === "carretera") {
      const g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#07080c"); g.addColorStop(.6, "#1a1d2a"); g.addColorStop(1, "#0b0c10");
      b.fillStyle = g; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const y = H * (.45 + r() * .4); b.strokeStyle = pick(["#ff3b2f", "#ff3b2f", "#ffb347", "#f5efe0"]); b.lineWidth = 1.5 + r() * 5; b.beginPath(); b.moveTo(-20, y); b.bezierCurveTo(W * .3, y - 10 + r() * 20, W * .7, y - 30 + r() * 30, W + 20, y - 20 + r() * 40); b.stroke(); }
      for (let i = 0; i < 12; i++) { b.fillStyle = pick(["#ffb347", "#f5efe0"]); b.beginPath(); b.arc(r() * W, H * r() * .4, 2 + r() * 6, 0, 7); b.fill(); }
    } else if (mood === "atardecer") {
      const g = b.createLinearGradient(0, 0, 0, H * .75); g.addColorStop(0, "#2b1b3a"); g.addColorStop(.55, "#c4462c"); g.addColorStop(1, "#f2a33a");
      b.fillStyle = g; b.fillRect(0, 0, W, H);
      b.fillStyle = "#ffd9a0"; b.beginPath(); b.arc(W * .62, H * .66, W * .09, 0, 7); b.fill();
      b.fillStyle = "#1a1210"; b.beginPath(); b.moveTo(0, H * .72); b.quadraticCurveTo(W * .3, H * .6, W * .55, H * .74); b.quadraticCurveTo(W * .8, H * .68, W, H * .76); b.lineTo(W, H); b.lineTo(0, H); b.closePath(); b.fill();
    } else if (mood === "cantera") {
      b.fillStyle = "#d9b3a1"; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 1400; i++) { b.fillStyle = pick(["#c99a86", "#e8c9b9", "#b07c69", "#d9b3a1", "#efd9cc"]); b.beginPath(); b.ellipse(r() * W, r() * H, 2 + r() * 14, 2 + r() * 8, r() * 3, 0, 7); b.fill(); }
      for (let i = 0; i < 160; i++) { b.fillStyle = "#8a5a4a"; b.beginPath(); b.arc(r() * W, r() * H, .8 + r() * 2.4, 0, 7); b.fill(); }
      b.strokeStyle = "rgba(138,90,74,.5)"; b.lineWidth = 2; b.beginPath(); b.moveTo(0, H * .7); b.lineTo(W * .4, H * .62); b.lineTo(W, H * .66); b.stroke();
    } else {
      b.fillStyle = "#0d1f0c"; b.fillRect(0, 0, W, H);
      for (let i = 0; i < 12; i++) { b.strokeStyle = pick(["#1f4a17", "#3f8f2a", "#7cc23a", "#c7ef7a"]); b.lineWidth = 30 + r() * 70; b.lineCap = "round"; b.beginPath(); const x = r() * W; b.moveTo(x, H * 1.1); b.quadraticCurveTo(x + (r() - .5) * W, H * .5, x + (r() - .5) * W * 1.2, -H * .1); b.stroke(); }
    }
    // desenfoque + barrido
    const out = document.createElement("canvas"); out.width = W; out.height = H;
    const o = out.getContext("2d");
    const blur = M.blur ?? (mood === "tierra" ? 1.2 : mood === "agave" ? 14 : 5);
    const len = M.len ?? (mood === "tierra" ? 6 : mood === "agave" ? 20 : 90);
    o.filter = `blur(${blur}px)`;
    o.drawImage(base, 0, 0);
    const steps = 22;
    for (let i = 1; i <= steps; i++) { o.globalAlpha = 1 / (i + 1); const t = (i / steps - .5) * len; o.drawImage(base, M.dir[0] * t, M.dir[1] * t); }
    o.globalAlpha = 1; o.filter = "none";
    // grano y viñeta
    const img = o.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 46; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    o.putImageData(img, 0, 0);
    const v = o.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.35)"); o.fillStyle = v; o.fillRect(0, 0, W, H);
    return (cache[key] = out);
  }
  function drawPhoto(canvas, mood, seed) {
    const rect = canvas.getBoundingClientRect();
    const W = Math.max(160, Math.round(Math.min(900, rect.width || 400))), H = Math.round(W * ((rect.height || 500) / (rect.width || 400)));
    canvas.width = W; canvas.height = H;
    canvas.getContext("2d").drawImage(photo(mood, seed, W, H), 0, 0);
  }

  function meltSVG(fill, o = {}) {
    const f = o.level === "suave" ? "melt-suave" : o.level === "intensa" ? "melt-intensa" : "melt";
    const outl = o.outline ?? lineMode();
    const mk = "mo" + mid++;
    const ofilt = outl ? `<filter id="${mk}" x="-10%" y="-20%" width="120%" height="140%"><feMorphology class="er" in="SourceAlpha" operator="erode" radius="5" result="e"/><feComposite in="SourceGraphic" in2="e" operator="out"/></filter>` : "";
    if (o.one) return `<svg viewBox="0 0 1700 300" aria-hidden="true" ${outl ? 'data-line="1"' : ""} style="display:block;width:100%;height:auto;overflow:visible">${ofilt}<g ${outl ? `filter="url(#${mk})"` : ""}><g filter="url(#${f})" fill="${fill || "currentColor"}" style="font-family:var(--wm);font-stretch:var(--wm-stretch);font-weight:var(--wm-weight);text-transform:var(--wm-case)" font-size="200" text-anchor="middle"><text x="850" y="220">Piedra Bruta</text></g></g></svg>`;
    return `<svg viewBox="0 0 1000 520" aria-hidden="true" ${outl ? 'data-line="1"' : ""} style="display:block;width:100%;height:auto;overflow:visible">${ofilt}<g ${outl ? `filter="url(#${mk})"` : ""}><g filter="url(#${f})" fill="${fill || "currentColor"}" style="font-family:var(--wm);font-stretch:var(--wm-stretch);font-weight:var(--wm-weight);text-transform:var(--wm-case)" font-size="210" text-anchor="middle"><text x="500" y="230">Piedra</text><text x="500" y="450">Bruta</text></g></g></svg>`;
  }
  window.Marca = { symSVG, meltSVG, drawPhoto, fixStrokes, SYMBOLS, MOODS, state };
})();

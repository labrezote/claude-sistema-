/* =========================================================
   Brand board interactivo de Pilón (réplica del brand board V3)
   Negro Noche #0E100F · Lima Pilón #E2F415 · Crema #FFFCE1
   Archivo Black 900 (titulares) + Archivo 400 (texto)
   El logo usa assets/pilon/logo-mask.png como máscara para pintarlo de cualquier color.
   ========================================================= */
(() => {
  const N = "#0E100F", L = "#E2F415", C = "#FFFCE1";
  const P = {
    cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/>',
    fork: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10"/><path d="M16 3c-2 1-3 4-3 7h3v11"/>',
    cut: '<circle cx="6" cy="17" r="3"/><circle cx="6" cy="7" r="3"/><path d="M8.5 8.5 20 17M8.5 15.5 20 7"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    spark: '<path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z"/><path d="M19 3v3M17.5 4.5h3"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-3 0-5-1.5-4-3.5S12 6 12 9c0-3 3-4.5 4-3.5S15 9 12 9z"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    out: '<path d="M7 17 17 7M9 7h8v8"/>',
  };
  const ico = (k, c, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c || "currentColor"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;
  const logo = (color, cls = "") => `<span class="pb-logo ${cls}" role="img" aria-label="Pilón" style="background:${color}"></span>`;
  const iso = (color, cls = "") => `<span class="pb-iso ${cls}" aria-hidden="true" style="background:${color}"></span>`;
  const bang = (fg, bg, cls = "") => `<span class="pb-bang ${cls}" style="background:${bg}">${iso(fg)}</span>`;
  const zig = (color, cls = "") => `<span class="pb-zig ${cls}" style="--z:${color}" aria-hidden="true"></span>`;
  const head = (n, t, right = "") => `<header class="pb-h"><span class="pb-n">${n}</span><span>${t}</span><i></i>${right ? `<span class="pb-r">${right}</span>` : ""}</header>`;

  function card(o) {
    const full = o.s >= o.total;
    const st = Array.from({ length: o.total }, (_, k) => k === o.total - 1
      ? `<button type="button" class="pb-st gift${full ? " on" : ""}" data-k="${k}" aria-label="Premio">${ico("gift", full ? L : N, 1.8)}</button>`
      : `<button type="button" class="pb-st${k < o.s ? " on" : ""}" data-k="${k}" aria-label="Sello ${k + 1}">${k < o.s ? ico(o.icon, L, 2) : ""}</button>`).join("");
    return `<div class="pb-card" style="--rot:${o.rot || -3}deg">
      <div class="pb-card-h">${bang(L, N, "sm")}<b>${o.name}</b><span class="pb-cnt"><small>Sellos</small>${Math.min(o.s, o.total)}/${o.total}</span></div>
      <div class="pb-dash"></div><div class="pb-stamps" style="--cols:${o.total > 6 ? 4 : 3}">${st}</div><div class="pb-dash"></div>
      <div class="pb-card-f"><span><small>Cliente</small>Luis</span><span><small>Recompensa</small>${o.reward}</span></div>
      ${o.qr ? `<div class="pb-qr"><span>${Array.from({ length: 81 }, (_, k) => `<i${[0, 1, 2, 9, 11, 18, 19, 20, 6, 7, 8, 15, 17, 24, 25, 26, 54, 55, 56, 63, 65, 72, 73, 74].includes(k) || (k * 13 + (k % 7)) % 3 === 0 ? ' class="d"' : ""}></i>`).join("")}</span><small>PILÓN · 2026</small></div>` : ""}
    </div>`;
  }

  function render(root) {
    const st = {
      raiz: { name: "Café Raíz", icon: "cup", reward: "Café gratis", total: 8, s: 6, rot: -4, qr: true },
      neta: { name: "La Neta Tacos", icon: "fork", reward: "Orden gratis", total: 8, s: 5, rot: -3, qr: true },
    };
    root.innerHTML = `
    <div class="pb">
      <div class="pb-top"><span>Pilón · Brand board</span><span class="lima">Tarjetas de lealtad digitales</span><span>MX · 2026</span></div>

      <section class="pb-box pb-main"><div class="pb-lab"><span>Logo principal</span><span class="lima">01</span></div>${logo(L, "xl")}${zig(L, "bottom")}</section>

      <div class="pb-row3">
        <button type="button" class="pb-box crema pb-tile" data-tile><span class="pb-lab dark">Logotipo</span>${logo(N, "md")}</button>
        <button type="button" class="pb-box lima pb-tile" data-tile><span class="pb-lab dark">Isotipo</span>${iso(N, "lg")}</button>
        <button type="button" class="pb-box pb-tile" data-tile><span class="pb-lab">Submarca</span><span class="pb-sub">${iso(N, "md")}</span></button>
      </div>

      ${head("02", "Paleta de color", "Solo 3 colores")}
      <div class="pb-pal">
        ${[["Negro Noche", N, "14 · 16 · 15", "Fondo principal", ""], ["Lima Pilón", L, "226 · 244 · 21", "Acento · CTA · Logo", "lima"], ["Crema", C, "255 · 252 · 225", "Texto · Superficies", "crema"]].map(([n, h, rgb, use, cls]) => `
        <button type="button" class="pb-box pb-col ${cls}" data-hex="${h}" aria-label="Copiar ${n} ${h}">
          <span class="pb-ring"></span><b>${n}</b><span>HEX ${h}</span><span>RGB ${rgb}</span><span>${use}</span><em>Copiar HEX</em></button>`).join("")}
      </div>
      <div class="pb-prop"><i class="n"></i><i class="c"></i><i class="l"></i></div>
      <p class="pb-cap">Proporción de uso · 60 negro / 30 crema / 10 lima</p>

      ${head("03", "Tipografía · Archivo")}
      <div class="pb-type">
        <div class="pb-box crema"><span class="pb-lab dark">Principal · Archivo Black 900</span><span class="pb-aa black">Aa</span><p class="black">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 !¡?¿$%</p></div>
        <div class="pb-box"><span class="pb-lab lima">Secundaria · Archivo Regular 400</span><span class="pb-aa">Aa</span><p>ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 !¡?¿$%</p></div>
      </div>
      <div class="pb-box lima pb-say">
        <p class="black" id="pb-say" contenteditable="true" spellcheck="false" aria-label="Frase de ejemplo, puedes editarla">Tus clientes regresan solitos.</p>
        <span>Titulares en Archivo 900, cuerpo en Archivo 400. Mayúsculas espaciadas para etiquetas y datos. <em>Toca la frase para escribir la tuya.</em></span>
      </div>

      ${head("04", "Aplicación web · Mockups")}
      <section class="pb-box lima pb-pad"><span class="pb-lab dark">Sitio web · pilon.app</span>
        <div class="pb-browser">
          <div class="pb-bbar"><span class="dots"><i></i><i></i><i></i></span><span class="tab">${bang(N, L, "xs")}Pilón — Tarjetas de lealtad</span><span class="url">https://www.pilon.app</span></div>
          <div class="pb-site">
            <nav>${logo(L, "nav")}<span class="links"><span>Cómo funciona</span><span>Negocios</span><span>Precios</span><b>Empieza gratis</b></span></nav>
            <div class="pb-hero">
              <div><span class="pill">Apple Wallet · Google Wallet</span>
                <h3>Tus clientes <mark>vuelven.</mark> Tu negocio crece.</h3>
                <p>Tarjetas de sellos y puntos directo en la cartera del celular. Sin apps, sin papel, sin complicaciones.</p>
                <span class="btns"><button type="button" class="pb-btn" id="pb-sellar">Sellar tarjeta ${ico("arrow", N, 2.4)}</button><button type="button" class="pb-btn ghost" id="pb-reset">Reiniciar</button></span>
                <small class="pb-live" id="pb-status" aria-live="polite"></small>
              </div>
              <div class="pb-hcard"><div id="pb-card-raiz"></div><div class="pb-toast pb-notif" id="pb-toast"></div></div>
            </div>
          </div>
        </div>
      </section>

      <div class="pb-row2">
        <section class="pb-box lima pb-pad"><span class="pb-lab dark">Panel del negocio · Escritorio</span>
          <div class="pb-laptop"><div class="pb-screen">
            <aside>${logo(L, "nav")}<span class="on">Inicio</span><span>Tarjetas</span><span>Clientes</span><span>Campañas</span><span>Ajustes</span></aside>
            <div class="pb-dash-main">
              <div class="pb-dh"><span><small>Resumen de hoy</small><b>Hola, Café Raíz</b></span><span class="new">+ Nueva tarjeta</span></div>
              <div class="pb-kpis"><div class="k1"><small>Sellos hoy</small><b id="pb-kpi">128</b><em>▲ 18% vs ayer</em></div><div><small>Clientes recurrentes</small><b>64%</b><em>Este mes</em></div><div><small>Recompensas</small><b>37</b><em>Canjeadas</em></div></div>
              <div class="pb-grid2"><div class="pb-chart"><small>Visitas esta semana</small><span class="bars">${[38, 52, 45, 60, 100, 70, 48].map((h, i) => `<i style="height:${h}%"${i === 4 ? ' class="hi"' : ""}></i>`).join("")}</span><span class="days">${"LMMJVSD".split("").map((d) => `<em>${d}</em>`).join("")}</span></div>
              <div class="pb-side"><div class="camp"><small>Campaña activa</small><b>¡Sellos dobles este viernes!</b><em>Enviada a 412 clientes</em></div><div class="last"><small>Últimos sellos</small><span>Luis M. <b>6/8</b></span><span>Ana R. <b>3/8</b></span><span>Diego P. <b class="w">¡Premio!</b></span></div></div></div>
            </div></div><div class="pb-base"></div></div>
        </section>
        <section class="pb-box crema pb-pad"><span class="pb-lab dark">Notificación</span>
          <div class="pb-phone"><span class="notch"></span><small>lunes 12 de octubre</small><b class="time">9:41</b><div class="pb-notif" id="pb-notif"></div><div class="pb-notif"><span class="ic">${iso(L)}</span><div><b>Pilón <em>hace 2 h</em></b><p>Sumaste 1 sello. Llevas 6 de 8.</p></div></div>${iso(L, "phone")}</div>
        </section>
      </div>

      <div class="pb-row3 b">
        <section class="pb-box pb-pad"><span class="pb-lab">Ícono de app</span><span class="pb-app">${iso(N, "md")}<b>2</b></span><small class="pb-appname">Pilón</small></section>
        <section class="pb-box lima pb-pad"><span class="pb-lab dark">Slogan</span><p class="pb-slogan">El pilón que hace volver a tus clientes</p></section>
        <section class="pb-box crema pb-pad"><span class="pb-lab dark">Donde vive</span><p class="pb-lives">En tu wallet, siempre.</p><span class="pb-wal">${ico("wallet", L)}Apple Wallet</span><span class="pb-wal">${ico("wallet", L)}Google Wallet</span></section>
      </div>

      <section class="pb-box pb-pad"><span class="pb-lab">Banner web</span>
        <div class="pb-banner"><p>Más <span class="a">sellos.</span> Más <span class="b">clientes.</span> Más <span class="c">pilón.</span></p>
        <div class="pb-bside"><span class="icons">${ico("cup", L)}${ico("star", L)}<b>${ico("gift", N)}</b></span><a class="pb-url" href="https://www.pilon.app" target="_blank" rel="noopener">pilon.app ${ico("out", N, 2.4)}</a></div></div>
      </section>

      ${head("05", "Elementos gráficos")}
      <div class="pb-row2 c">
        <section class="pb-box crema pb-pad"><span class="pb-lab dark">Tarjeta de lealtad · toca los sellos</span><div class="pb-center" id="pb-card-neta"></div></section>
        <div class="pb-col2">
          <section class="pb-box pb-pad"><span class="pb-lab">Sellos</span><span class="pb-seals">${["cup", "cut", "fork", "spark"].map((k, i) => `<i class="${i === 3 ? "c" : ""}">${ico(k, N)}</i>`).join("")}<i class="d">${ico("gift", L, 1.8)}</i></span></section>
          <section class="pb-box lima pb-pad"><span class="pb-lab dark">Patrón zigzag</span>${zig(N, "rows")}${zig(N, "rows")}${zig(N, "rows")}</section>
        </div>
      </div>

      <section class="pb-box lima pb-end">${logo(N, "lg")}<span>www.pilon.app</span></section>
      <div class="pb-top foot"><span>Brand board · V3</span><span>Negro · Lima · Crema</span></div>
    </div>`;

    const $ = (s) => root.querySelector(s);
    function draw() {
      const r = st.raiz, full = r.s >= r.total, faltan = r.total - r.s;
      $("#pb-card-raiz").innerHTML = card(r);
      $("#pb-card-neta").innerHTML = card(st.neta);
      const msg = full ? "¡Completaste tu tarjeta! Pasa por tu café gratis." : `¡Andas cerca! Te ${faltan === 1 ? "falta 1 sello" : `faltan ${faltan} sellos`} para tu café gratis.`;
      const n = `<span class="ic">${iso(L)}</span><div><b>Pilón · Café Raíz <em>ahora</em></b><p>${msg}</p></div>`;
      $("#pb-notif").innerHTML = n; $("#pb-toast").innerHTML = n;
      $("#pb-status").textContent = full ? "¡Premio desbloqueado!" : `${r.s} de ${r.total} sellos`;
      $("#pb-sellar").disabled = full;
      $("#pb-kpi").textContent = 122 + r.s;
      root.querySelectorAll("#pb-card-neta .pb-st").forEach((b) => b.addEventListener("click", () => {
        const k = +b.dataset.k, t = st.neta; t.s = k + 1 === t.s ? k : Math.min(t.total, k + 1); draw();
      }));
    }
    $("#pb-sellar").addEventListener("click", () => { st.raiz.s = Math.min(st.raiz.total, st.raiz.s + 1); draw(); const b = root.querySelectorAll("#pb-card-raiz .pb-st")[st.raiz.s - 1]; if (b) b.classList.add("pop"); });
    $("#pb-reset").addEventListener("click", () => { st.raiz.s = 0; draw(); });
    root.querySelectorAll("[data-hex]").forEach((b) => b.addEventListener("click", () => {
      const em = b.querySelector("em"), ok = () => { em.textContent = "¡Copiado!"; setTimeout(() => (em.textContent = "Copiar HEX"), 1300); };
      try { navigator.clipboard.writeText(b.dataset.hex).then(ok, () => (em.textContent = b.dataset.hex)); } catch (e) { em.textContent = b.dataset.hex; }
    }));
    root.querySelectorAll("[data-tile]").forEach((b) => b.addEventListener("click", () => { b.classList.remove("wig"); void b.offsetWidth; b.classList.add("wig"); }));
    draw();
  }
  window.CaseInteractive = Object.assign(window.CaseInteractive || {}, { pilon: render });
})();

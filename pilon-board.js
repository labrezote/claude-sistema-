/* =========================================================
   Brand board interactivo de Pilón (se abre dentro del caso)
   Colores: Negro Noche #0E100F · Lima Pilón #E2F415 · Crema #FFFCE1
   Tipografía: Archivo Black 900 (titulares) + Archivo 400 (texto)
   ========================================================= */
(() => {
  const NEGRO = "#0E100F", LIMA = "#E2F415", CREMA = "#FFFCE1";
  const ICONS = {
    cafe: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3c0 1.5 1.5 1.5 1.5 3M11.5 3c0 1.5 1.5 1.5 1.5 3"/>',
    tacos: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10"/><path d="M16 3c-2 1-3 4-3 7h3v11"/>',
    barber: '<circle cx="6" cy="17" r="3"/><circle cx="6" cy="7" r="3"/><path d="M8.5 8.5 20 17M8.5 15.5 20 7"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-3 0-5-1.5-4-3.5S12 6 12 9c0-3 3-4.5 4-3.5S15 9 12 9z"/>',
  };
  const ico = (k, c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c || "currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const NEGOCIOS = [
    { id: "cafe", name: "Café Raíz", reward: "Café gratis", total: 8 },
    { id: "tacos", name: "La Neta Tacos", reward: "Orden gratis", total: 8 },
    { id: "barber", name: "Filo Barber", reward: "Corte gratis", total: 6 },
  ];
  const LOGOS = {
    principal: { label: "Logo principal", bg: NEGRO, html: `<span class="pl-logo" style="color:${LIMA}">P!L<span class="pl-o">Ó</span>N</span><span class="pl-zig"></span>` },
    logotipo: { label: "Logotipo", bg: CREMA, html: `<span class="pl-logo" style="color:${NEGRO}">P!L<span class="pl-o">Ó</span>N</span>` },
    isotipo: { label: "Isotipo", bg: LIMA, html: `<span class="pl-bang" style="color:${NEGRO}">!</span>` },
    submarca: { label: "Submarca", bg: NEGRO, html: `<span class="pl-circle"><span class="pl-bang" style="color:${NEGRO}">!</span></span>` },
  };

  function render(root) {
    let logo = "principal", neg = NEGOCIOS[0], sellos = 5;
    root.innerHTML = `
    <div class="pl">
      <div class="pl-top"><span>Pilón · Brand board interactivo</span><span>Tarjetas de lealtad digitales</span><span>MX · 2026</span></div>

      <section class="pl-sec">
        <header class="pl-h"><span class="pl-n">01</span>Logo<span class="pl-tabs" role="tablist" aria-label="Versiones del logo">${Object.entries(LOGOS).map(([k, v]) => `<button type="button" role="tab" data-logo="${k}">${v.label}</button>`).join("")}</span></header>
        <div class="pl-stage" id="pl-stage"></div>
      </section>

      <section class="pl-sec">
        <header class="pl-h"><span class="pl-n">02</span>Paleta de color<span class="pl-hint">Toca un color para copiar su HEX</span></header>
        <div class="pl-sw">
          ${[["Negro Noche", NEGRO, "Fondo principal", CREMA], ["Lima Pilón", LIMA, "Acento · CTA · Logo", NEGRO], ["Crema", CREMA, "Texto · Superficies", NEGRO]].map(([n, h, u, fg]) => `
          <button type="button" class="pl-chip" data-hex="${h}" style="background:${h};color:${fg}">
            <span class="pl-ring" style="border-color:${fg === NEGRO ? NEGRO : "#333"}"></span>
            <b>${n}</b><span>HEX ${h}</span><span>${u}</span><em>Copiar</em></button>`).join("")}
        </div>
        <div class="pl-bar"><i style="flex:60;background:${NEGRO}"></i><i style="flex:30;background:${CREMA}"></i><i style="flex:10;background:${LIMA}"></i></div>
        <p class="pl-cap">Proporción de uso · 60 negro / 30 crema / 10 lima</p>
      </section>

      <section class="pl-sec">
        <header class="pl-h"><span class="pl-n">03</span>Tipografía · Archivo</header>
        <label class="pl-try">Escribe una frase<input id="pl-input" type="text" maxlength="48" value="Tus clientes regresan solitos."></label>
        <div class="pl-type">
          <div class="pl-t1"><span class="pl-cap">Principal · Archivo Black 900</span><p id="pl-out1">Tus clientes regresan solitos.</p></div>
          <div class="pl-t2"><span class="pl-cap">Secundaria · Archivo Regular 400</span><p id="pl-out2">Tus clientes regresan solitos.</p></div>
        </div>
      </section>

      <section class="pl-sec">
        <header class="pl-h"><span class="pl-n">04</span>Tarjeta de lealtad<span class="pl-tabs" aria-label="Negocio de ejemplo">${NEGOCIOS.map((n) => `<button type="button" data-neg="${n.id}">${n.name}</button>`).join("")}</span></header>
        <div class="pl-demo">
          <div class="pl-card" id="pl-card"></div>
          <div class="pl-phone"><div class="pl-notch"></div><p class="pl-date">lunes 12 de octubre</p><p class="pl-time">9:41</p><div class="pl-notif" id="pl-notif"></div><span class="pl-bang pl-phone-bang" style="color:${LIMA}">!</span></div>
        </div>
        <div class="pl-actions"><button type="button" class="pl-btn" id="pl-sellar">Sellar</button><button type="button" class="pl-btn ghost" id="pl-reset">Reiniciar</button><span class="pl-cap" id="pl-status" aria-live="polite"></span></div>
        <p class="pl-cap">Demostración: así se ve la tarjeta en el Wallet del cliente y la notificación de cercanía.</p>
      </section>

      <section class="pl-sec pl-final">
        <p class="pl-slogan">El pilón que hace volver a tus clientes.</p>
        <p class="pl-banner">Más <span>sellos.</span> Más <span class="c">clientes.</span> Más <span class="o">pilón.</span></p>
        <div class="pl-zigbig"></div>
      </section>
    </div>`;

    const $ = (s) => root.querySelector(s);
    function drawLogo() {
      const L = LOGOS[logo];
      $("#pl-stage").style.background = L.bg;
      $("#pl-stage").innerHTML = L.html;
      root.querySelectorAll("[data-logo]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.logo === logo)));
    }
    function drawCard() {
      const n = neg, full = sellos >= n.total;
      $("#pl-card").innerHTML = `
        <div class="pl-card-h"><span class="pl-cb">!</span><b>${n.name}</b><span class="pl-cnt"><small>Sellos</small>${Math.min(sellos, n.total)}/${n.total}</span></div>
        <div class="pl-dash"></div>
        <div class="pl-stamps">${Array.from({ length: n.total }, (_, k) => k === n.total - 1
          ? `<span class="pl-st gift ${full ? "on" : ""}">${ico("gift", full ? LIMA : NEGRO)}</span>`
          : `<span class="pl-st ${k < sellos ? "on" : ""}">${k < sellos ? ico(n.id, LIMA) : ""}</span>`).join("")}</div>
        <div class="pl-dash"></div>
        <div class="pl-card-f"><span><small>Cliente</small>Luis</span><span style="text-align:right"><small>Recompensa</small>${n.reward}</span></div>
        <div class="pl-qr" aria-hidden="true">${Array.from({ length: 49 }, (_, k) => `<i style="background:${(k * 7 + (k % 5) * 3) % 3 ? NEGRO : "transparent"}"></i>`).join("")}</div>`;
      const faltan = Math.max(0, n.total - sellos);
      $("#pl-notif").innerHTML = full
        ? `<span class="pl-cb">!</span><div><b>Pilón · ${n.name}</b><p>¡Completaste tu tarjeta! Pasa por tu ${n.reward.toLowerCase()}.</p></div>`
        : `<span class="pl-cb">!</span><div><b>Pilón · ${n.name}</b><p>¡Andas cerca! Te ${faltan === 1 ? "falta 1 sello" : `faltan ${faltan} sellos`} para tu ${n.reward.toLowerCase()}.</p></div>`;
      $("#pl-status").textContent = full ? "¡Premio desbloqueado!" : `${sellos} de ${n.total} sellos`;
      $("#pl-sellar").disabled = full;
      root.querySelectorAll("[data-neg]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.neg === n.id)));
    }
    root.querySelectorAll("[data-logo]").forEach((b) => b.addEventListener("click", () => { logo = b.dataset.logo; drawLogo(); }));
    root.querySelectorAll("[data-neg]").forEach((b) => b.addEventListener("click", () => { neg = NEGOCIOS.find((n) => n.id === b.dataset.neg); sellos = Math.min(sellos, neg.total - 2); drawCard(); }));
    $("#pl-sellar").addEventListener("click", () => {
      sellos = Math.min(neg.total, sellos + 1); drawCard();
      const st = root.querySelectorAll(".pl-st")[sellos - 1]; if (st) { st.classList.add("pop"); }
    });
    $("#pl-reset").addEventListener("click", () => { sellos = 0; drawCard(); });
    root.querySelectorAll(".pl-chip").forEach((b) => b.addEventListener("click", () => {
      const em = b.querySelector("em"), done = () => { em.textContent = "Copiado"; setTimeout(() => (em.textContent = "Copiar"), 1300); };
      try { navigator.clipboard.writeText(b.dataset.hex).then(done, () => (em.textContent = b.dataset.hex)); } catch (e) { em.textContent = b.dataset.hex; }
    }));
    const inp = $("#pl-input");
    inp.addEventListener("input", () => { const v = inp.value || "Escribe algo"; $("#pl-out1").textContent = v; $("#pl-out2").textContent = v; });
    drawLogo(); drawCard();
  }
  window.CaseInteractive = Object.assign(window.CaseInteractive || {}, { pilon: render });
})();

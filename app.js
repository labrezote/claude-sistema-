(function () {
  "use strict";

  var data = window.PORTFOLIO;
  var CATEGORY_LABELS = { "todos": "Todos", "branding": "Branding", "campaña": "Campañas" };
  var CLIENT_LABELS = { "todos": "Todos", "marca": "Marcas", "empresa": "Empresas" };

  var $ = function (id) { return document.getElementById(id); };

  // Escapa texto antes de insertarlo en el HTML
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initials(name) {
    return String(name).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }

  function setOwner() {
    var o = data.owner;
    document.title = o.name + " · Portafolio de mercadotecnia y publicidad";
    $("owner-name").textContent = o.name;
    $("owner-role").textContent = o.role;
    $("owner-headline").textContent = o.name;
    $("owner-bio").textContent = o.bio;
    $("footer-text").textContent = "© " + new Date().getFullYear() + " " + o.name + ". Todos los derechos reservados.";
    $("owner-email").href = "mailto:" + o.email;

    $("owner-links").innerHTML = (o.links || []).map(function (l) {
      return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a></li>";
    }).join("");
  }

  function renderStats() {
    var brands = data.clients.filter(function (c) { return c.type === "marca"; }).length;
    var companies = data.clients.filter(function (c) { return c.type === "empresa"; }).length;
    var stats = [
      { n: data.projects.length, l: "Proyectos" },
      { n: brands, l: "Marcas" },
      { n: companies, l: "Empresas" }
    ];
    $("stats").innerHTML = stats.map(function (s) {
      return '<div class="stat"><span class="stat-n">' + s.n + '</span><span class="stat-l">' + s.l + "</span></div>";
    }).join("");
  }

  function renderFilters(container, labels, active, onChange) {
    container.innerHTML = Object.keys(labels).map(function (key) {
      var isActive = key === active;
      return '<button type="button" class="chip' + (isActive ? " is-active" : "") + '" data-value="' + esc(key) +
        '" aria-pressed="' + isActive + '">' + esc(labels[key]) + "</button>";
    }).join("");
    container.onclick = function (e) {
      var btn = e.target.closest("button[data-value]");
      if (btn) onChange(btn.getAttribute("data-value"));
    };
  }

  // ---------- Trabajos ----------
  var projectFilter = "todos";

  function renderProjects() {
    var list = data.projects.filter(function (p) {
      return projectFilter === "todos" || p.category === projectFilter;
    });

    $("project-empty").hidden = list.length > 0;
    $("project-grid").innerHTML = list.map(function (p) {
      return '<article class="card" tabindex="0" data-id="' + esc(p.id) + '">' +
        '<div class="card-swatch" style="background:' + esc(p.color || "#888") + '"><span>' + esc(initials(p.client)) + "</span></div>" +
        '<div class="card-body">' +
          '<p class="card-meta">' + esc(CATEGORY_LABELS[p.category] || p.category) + " · " + esc(p.year) + "</p>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="card-client">' + esc(p.client) + "</p>" +
          "<p>" + esc(p.description) + "</p>" +
        "</div></article>";
    }).join("");
  }

  function renderProjectFilters() {
    var labels = { "todos": "Todos" };
    data.projects.forEach(function (p) {
      if (!labels[p.category]) labels[p.category] = CATEGORY_LABELS[p.category] || p.category;
    });
    renderFilters($("project-filters"), labels, projectFilter, function (value) {
      projectFilter = value;
      renderProjectFilters();
      renderProjects();
    });
  }

  // ---------- Clientes ----------
  var clientFilter = "todos";

  function renderClients() {
    var list = data.clients.filter(function (c) {
      return clientFilter === "todos" || c.type === clientFilter;
    });

    $("client-empty").hidden = list.length > 0;
    $("client-grid").innerHTML = list.map(function (c) {
      return '<article class="client">' +
        '<span class="client-type">' + esc(c.type === "marca" ? "Marca" : "Empresa") + "</span>" +
        "<h3>" + esc(c.name) + "</h3>" +
        '<p class="card-client">' + esc(c.sector) + "</p>" +
        '<p class="client-role">' + esc(c.role) + "</p>" +
        '<p class="card-meta">' + esc(c.period) + "</p>" +
      "</article>";
    }).join("");
  }

  function renderClientFilters() {
    renderFilters($("client-filters"), CLIENT_LABELS, clientFilter, function (value) {
      clientFilter = value;
      renderClientFilters();
      renderClients();
    });
  }

  // ---------- Detalle de proyecto ----------
  var dialog = $("project-dialog");

  function openProject(id) {
    var p = data.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    $("dialog-swatch").style.background = p.color || "#888";
    $("dialog-meta").textContent = (CATEGORY_LABELS[p.category] || p.category) + " · " + p.year;
    $("dialog-title").textContent = p.title;
    $("dialog-description").textContent = p.description;
    $("dialog-client").textContent = p.client;
    $("dialog-role").textContent = p.role;
    $("dialog-results").textContent = p.results;
    $("dialog-tags").innerHTML = (p.tags || []).map(function (t) {
      return "<li>" + esc(t) + "</li>";
    }).join("");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  $("project-grid").addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (card) openProject(card.getAttribute("data-id"));
  });
  $("project-grid").addEventListener("keydown", function (e) {
    var card = e.target.closest(".card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openProject(card.getAttribute("data-id"));
    }
  });
  dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (e) {
    // Cierra al hacer clic en el fondo (fuera del contenido)
    if (e.target === dialog) closeDialog();
  });

  // ---------- Inicio ----------
  setOwner();
  renderStats();
  renderProjectFilters();
  renderProjects();
  renderClientFilters();
  renderClients();
})();

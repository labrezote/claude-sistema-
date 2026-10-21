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

  // Cada trabajo tiene su propia página de caso
  function projectUrl(id) {
    return "proyecto.html?id=" + encodeURIComponent(id);
  }

  function setOwner() {
    var o = data.owner;
    document.title = o.name + " · Portafolio de mercadotecnia y publicidad";
    $("owner-name").textContent = o.name;
    $("owner-role").textContent = o.role;
    $("owner-headline").textContent = o.name;
    if (window.splitWords) window.splitWords($("owner-headline"));
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
      return '<a class="card" href="' + esc(projectUrl(p.id)) + '">' +
        '<div class="card-swatch" style="background:' + esc(p.color || "#888") + '">' +
          '<div class="swatch-bg" style="background-color:' + esc(p.color || "#888") + '"></div>' +
          '<span class="swatch-logo">' + esc(initials(p.client)) + "</span>" +
        "</div>" +
        '<div class="card-body">' +
          '<p class="card-meta">' + esc(CATEGORY_LABELS[p.category] || p.category) + " · " + esc(p.year) + "</p>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="card-client">' + esc(p.client) + "</p>" +
          "<p>" + esc(p.description) + "</p>" +
        "</div></a>";
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

  // ---------- Inicio ----------
  setOwner();
  renderStats();
  renderProjectFilters();
  renderProjects();
  renderClientFilters();
  renderClients();
  $("strip-slot").innerHTML = window.stripHtml(data.projects, projectUrl);
})();

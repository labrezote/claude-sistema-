(function () {
  "use strict";

  var data = window.PORTFOLIO;
  var CATEGORY_LABELS = { "branding": "Branding", "campaña": "Campañas" };

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

  function projectUrl(id) {
    return "proyecto.html?id=" + encodeURIComponent(id);
  }

  function setOwner() {
    var o = data.owner;
    $("owner-name").textContent = o.name;
    $("footer-text").textContent = "© " + new Date().getFullYear() + " " + o.name + ". Todos los derechos reservados.";
  }

  // ---------- Página de caso ----------
  function renderNotFound() {
    document.title = "Proyecto no encontrado · " + data.owner.name;
    $("case").innerHTML =
      '<section class="section"><div class="container">' +
        "<h1>Proyecto no encontrado</h1>" +
        '<p class="lead">Es posible que el enlace esté incompleto o que el trabajo ya no esté en el portafolio.</p>' +
        '<a class="btn" href="index.html#trabajos">Ver todos los trabajos</a>' +
      "</div></section>";
  }

  function renderCase(index) {
    var list = data.projects;
    var p = list[index];
    var d = p.detail || {};
    var prev = list[(index - 1 + list.length) % list.length];
    var next = list[(index + 1) % list.length];
    var category = CATEGORY_LABELS[p.category] || p.category;

    document.title = p.title + " · " + data.owner.name;

    var about = (d.about || []).map(function (paragraph) {
      return "<p>" + esc(paragraph) + "</p>";
    }).join("");

    var impact = (d.impact || []).map(function (item) {
      return '<div class="impact-item">' +
        '<span class="impact-n">' + esc(item.n) + "</span>" +
        "<h3>" + esc(item.l) + "</h3>" +
        "<p>" + esc(item.d) + "</p>" +
      "</div>";
    }).join("");

    var gallery = (d.images || []).map(function (img, i) {
      return '<figure class="case-figure' + (i === 0 ? " is-wide" : "") + '" style="background:' + esc(p.color || "#888") + '">' +
        '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" width="1200" height="900" loading="lazy">' +
        (img.caption ? "<figcaption>" + esc(img.caption) + "</figcaption>" : "") +
      "</figure>";
    }).join("");

    $("case").innerHTML =
      '<section class="case-hero">' +
        '<div class="container">' +
          '<a class="back" href="index.html#trabajos">← Todos los trabajos</a>' +
          '<p class="eyebrow">Caso de estudio</p>' +
          "<h1>" + esc(p.title) + "</h1>" +
          '<p class="lead">' + esc(p.description) + "</p>" +
          '<ul class="tags">' + (p.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
          '<dl class="case-meta">' +
            "<div><dt>Categoría</dt><dd>" + esc(category) + "</dd></div>" +
            "<div><dt>Cliente</dt><dd>" + esc(p.client) + "</dd></div>" +
            "<div><dt>Mi rol</dt><dd>" + esc(p.role) + "</dd></div>" +
            "<div><dt>Año</dt><dd>" + esc(p.year) + "</dd></div>" +
          "</dl>" +
        "</div>" +
        '<div class="container">' +
          '<div class="case-cover" style="background:' + esc(p.color || "#888") + '">' +
            '<img src="' + esc(d.hero) + '" alt="Imagen de portada: ' + esc(p.title) + '" width="1600" height="900">' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="container">' +
          '<p class="eyebrow">Sobre el proyecto</p>' +
          '<p class="case-statement">' + esc(d.statement) + "</p>" +
          '<div class="case-copy">' + about + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section section-alt">' +
        '<div class="container">' +
          '<p class="eyebrow">Resultados</p>' +
          '<div class="impact">' + impact + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="container">' +
          '<div class="case-gallery">' + gallery + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section section-alt">' +
        '<div class="container">' +
          '<nav class="case-pager" aria-label="Otros proyectos">' +
            '<a class="pager-link" href="' + esc(projectUrl(prev.id)) + '"><span>← Anterior</span><strong>' + esc(prev.title) + "</strong></a>" +
            '<a class="pager-link is-next" href="' + esc(projectUrl(next.id)) + '"><span>Siguiente →</span><strong>' + esc(next.title) + "</strong></a>" +
          "</nav>" +
        "</div>" +
      "</section>";
  }

  // ---------- Inicio ----------
  var id = new URLSearchParams(window.location.search).get("id");
  var ids = data.projects.map(function (p) { return p.id; });
  var index = ids.indexOf(id);

  setOwner();
  if (index === -1) renderNotFound();
  else renderCase(index);
})();

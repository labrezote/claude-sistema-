(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Marca como visibles los bloques .reveal dentro de root cuando entran en pantalla
  window.observeReveal = function (root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-in)");
    if (!items.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (el) { io.observe(el); });
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Fila de trabajos que se desplaza sola en bucle. El contenido va dos veces
  // para que el giro del 50% quede sin saltos.
  window.stripHtml = function (projects, urlFor) {
    function group(hidden) {
      return '<div class="strip-group"' + (hidden ? ' aria-hidden="true"' : "") + ">" +
        projects.map(function (p) {
          return '<a class="strip-item" href="' + esc(urlFor(p.id)) + '"' + (hidden ? ' tabindex="-1"' : "") + ">" +
            '<div class="strip-img" style="background:' + esc(p.color || "#888") + '"></div>' +
            '<p class="card-meta">' + esc(p.client) + " · " + esc(p.year) + "</p>" +
            "<h3>" + esc(p.title) + "</h3>" +
          "</a>";
        }).join("") +
      "</div>";
    }

    return '<div class="strip" role="region" aria-label="Trabajos en movimiento">' +
      '<div class="strip-track">' + group(false) + group(true) + "</div>" +
    "</div>";
  };

  window.observeReveal(document);
})();

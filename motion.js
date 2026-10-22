(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  // Scroll suave con Lenis, sincronizado con el reloj de GSAP y ScrollTrigger.
  // Si las librerías no cargan (sin red), el sitio sigue funcionando con el scroll nativo.
  if (!reduce && hasGsap && typeof window.Lenis !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    var lenis = new Lenis({ duration: 1.1 });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.documentElement.style.scrollBehavior = "auto";
  }

  // Filtro de distorsión tipo líquido para la imagen de proyecto al pasar el cursor.
  // Solo se inserta si el usuario no pidió movimiento reducido.
  if (!reduce && document.body) {
    document.body.insertAdjacentHTML("afterbegin",
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
        '<filter id="swatch-liquid" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">' +
          '<feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="2" seed="4" result="noise">' +
            '<animate attributeName="baseFrequency" values="0.011 0.019;0.017 0.027;0.011 0.019" dur="7s" repeatCount="indefinite"/>' +
          "</feTurbulence>" +
          '<feDisplacementMap in="SourceGraphic" in2="noise" scale="36" xChannelSelector="R" yChannelSelector="G"/>' +
        "</filter>" +
      "</svg>");
  }

  // Marca como visibles los bloques .reveal dentro de root cuando entran en pantalla
  window.observeReveal = function (root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-in)");
    if (!items.length) return;

    if (reduce) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    // Con GSAP, ScrollTrigger revela cada bloque una sola vez. Si un bloque ya quedó
    // atrás al crearse (scroll restaurado al recargar), también se revela.
    if (hasGsap) {
      items.forEach(function (el) {
        var reveal = function () { el.classList.add("is-in"); };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "bottom top",
          once: true,
          onEnter: reveal,
          onLeave: reveal
        });
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
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

  // Separa el texto en palabras que entran una tras otra, con desenfoque
  window.splitWords = function (el) {
    if (!el || reduce) return;
    var text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/\s+/).map(function (word, i) {
      return '<span class="word" aria-hidden="true" style="--i:' + i + '">' + esc(word) + "</span>";
    }).join(" ");
  };

  function initials(name) {
    return String(name).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }

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
            '<div class="strip-img" style="background:' + esc(p.color || "#888") + '">' +
              '<div class="swatch-bg" style="background-color:' + esc(p.color || "#888") + '"></div>' +
              '<span class="swatch-logo">' + esc(initials(p.client)) + "</span>" +
            "</div>" +
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

// ============================================================
// Contenido del portafolio.
// Edita SOLO este archivo para cambiar textos, proyectos y clientes.
// Todos los datos actuales son de EJEMPLO: reemplázalos por los tuyos.
// ============================================================

window.PORTFOLIO = {
  owner: {
    name: "Tu Nombre",
    role: "Mercadólogo y especialista en publicidad",
    bio: "Creo marcas con identidad clara y campañas que conectan con las personas. Estrategia, branding y ejecución creativa para marcas y empresas de distintos sectores.",
    email: "tu@correo.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "Behance", url: "https://www.behance.net/" }
    ]
  },

  // category: "branding" | "campaña"
  // color: color representativo del proyecto (se usa si no hay imagen)
  // detail: contenido de la página del caso (proyecto.html?id=...).
  //   hero, statement, about (párrafos), impact (n, l, d) e images (src, alt, caption)
  projects: [
    {
      id: "p1",
      title: "Rebranding de cafetería artesanal",
      category: "branding",
      client: "Cliente de ejemplo A",
      year: 2024,
      role: "Estrategia de marca y dirección de arte",
      description: "Nueva identidad visual, paleta, tipografía y sistema de empaques para una cafetería de especialidad que buscaba una imagen más cercana a su comunidad.",
      results: "+35% de reconocimiento de marca en 6 meses",
      tags: ["Identidad visual", "Empaque", "Estrategia"],
      color: "#8B5E3C",
      detail: {
        hero: "https://picsum.photos/seed/p1-hero/1600/900",
        statement: "Una marca que huele a café de barrio, pero se ve de especialidad.",
        about: [
          "La cafetería vendía buen café con una imagen que no le hacía justicia: empaques genéricos, un logotipo gastado y ningún criterio visual en redes.",
          "Desarrollamos un sistema de identidad flexible, con una paleta cálida, una tipografía con carácter e ilustraciones simples inspiradas en el grano y el tostado. Se adapta desde la bolsa de café hasta la fachada."
        ],
        impact: [
          { n: "+35%", l: "Reconocimiento de marca", d: "Medido con encuestas en la zona a los seis meses." },
          { n: "2×", l: "Seguidores en redes", d: "Crecimiento orgánico con una línea de contenido clara." },
          { n: "4", l: "Formatos de empaque", d: "Bolsa, vaso, caja de regalo y etiqueta de degustación." }
        ],
        images: [
          { src: "https://picsum.photos/seed/p1-a/1200/900", alt: "Mockup de empaque de café", caption: "Sistema de empaques" },
          { src: "https://picsum.photos/seed/p1-b/1200/900", alt: "Mockup de vasos y etiquetas", caption: "Aplicaciones en punto de venta" },
          { src: "https://picsum.photos/seed/p1-c/1200/900", alt: "Paleta y tipografía de la marca", caption: "Paleta y tipografía" },
          { src: "https://picsum.photos/seed/p1-d/1200/900", alt: "Publicación en redes sociales", caption: "Piezas para redes" }
        ]
      }
    },
    {
      id: "p2",
      title: "Campaña de lanzamiento de producto",
      category: "campaña",
      client: "Cliente de ejemplo B",
      year: 2024,
      role: "Concepto creativo y planeación de medios",
      description: "Campaña integrada en redes sociales, digital y exterior para el lanzamiento de una línea de productos de cuidado personal.",
      results: "2.4 M de impresiones en el primer mes",
      tags: ["Campaña 360", "Redes sociales", "Medios"],
      color: "#2A7F8E",
      detail: {
        hero: "https://picsum.photos/seed/p2-hero/1600/900",
        statement: "Un lanzamiento que se conversó antes de llegar a la tienda.",
        about: [
          "La nueva línea de cuidado personal tenía que entrar a un mercado saturado sin competir por precio.",
          "Creamos una campaña integrada con una idea central: rutinas cortas que cualquiera puede adoptar. Coordinamos contenido en redes, anuncios digitales y exterior para que cada punto de contacto reforzara el mismo mensaje."
        ],
        impact: [
          { n: "2.4 M", l: "Impresiones en el primer mes", d: "Sumando todas las plataformas de la campaña." },
          { n: "3", l: "Canales coordinados", d: "Redes sociales, digital y exterior con un solo calendario." },
          { n: "+22%", l: "Búsquedas de la marca", d: "Aumento frente a las cuatro semanas previas al lanzamiento." }
        ],
        images: [
          { src: "https://picsum.photos/seed/p2-a/1200/900", alt: "Anuncio exterior de la campaña", caption: "Exterior" },
          { src: "https://picsum.photos/seed/p2-b/1200/900", alt: "Producto en un entorno de baño", caption: "Producto en contexto" },
          { src: "https://picsum.photos/seed/p2-c/1200/900", alt: "Video vertical de la campaña", caption: "Video vertical" },
          { src: "https://picsum.photos/seed/p2-d/1200/900", alt: "Anuncio digital en formato cuadrado", caption: "Anuncios digitales" }
        ]
      }
    },
    {
      id: "p3",
      title: "Identidad para startup tecnológica",
      category: "branding",
      client: "Cliente de ejemplo C",
      year: 2023,
      role: "Naming, logotipo y guía de marca",
      description: "Desarrollo de nombre, logotipo y manual de marca para una startup de software B2B, con sistema visual escalable a producto y web.",
      results: "Manual de marca adoptado por todo el equipo",
      tags: ["Naming", "Logotipo", "Guía de marca"],
      color: "#3B3FA8",
      detail: {
        hero: "https://picsum.photos/seed/p3-hero/1600/900",
        statement: "Un nombre corto, un logotipo que se entiende en un segundo y un sistema que crece con el producto.",
        about: [
          "La startup tenía un producto sólido, pero cada pantalla, presentación y post se veía distinto.",
          "Trabajamos el naming, el logotipo y una guía de marca pensada para software: componentes visuales, color con contraste accesible y plantillas para web, app y presentaciones."
        ],
        impact: [
          { n: "1", l: "Manual de marca en uso", d: "Adoptado por todo el equipo desde el primer mes." },
          { n: "−60%", l: "Tiempo de producción", d: "En presentaciones y piezas para ventas." },
          { n: "3", l: "Plataformas con la misma identidad", d: "Web, aplicación y material comercial." }
        ],
        images: [
          { src: "https://picsum.photos/seed/p3-a/1200/900", alt: "Logotipo en distintas versiones", caption: "Logotipo y variantes" },
          { src: "https://picsum.photos/seed/p3-b/1200/900", alt: "Pantallas de la aplicación con la marca", caption: "Interfaz" },
          { src: "https://picsum.photos/seed/p3-c/1200/900", alt: "Páginas del manual de marca", caption: "Guía de marca" },
          { src: "https://picsum.photos/seed/p3-d/1200/900", alt: "Plantilla de presentación", caption: "Presentaciones" }
        ]
      }
    },
    {
      id: "p4",
      title: "Campaña de temporada navideña",
      category: "campaña",
      client: "Cliente de ejemplo D",
      year: 2023,
      role: "Dirección creativa y contenido",
      description: "Serie de piezas audiovisuales y gráficas para la temporada alta de ventas, con mensajes segmentados por audiencia.",
      results: "+18% en ventas de temporada vs. año anterior",
      tags: ["Video", "Contenido", "Temporada"],
      color: "#B5402A",
      detail: {
        hero: "https://picsum.photos/seed/p4-hero/1600/900",
        statement: "Piezas breves para una temporada en la que todos gritan, y nosotros elegimos hablar bajito.",
        about: [
          "Durante la temporada alta, la marca competía con decenas de anuncios parecidos y necesitaba mensajes distintos para cada audiencia.",
          "Creamos una serie de videos cortos y piezas gráficas segmentadas por perfil, con un tono cálido y una sola idea: el regalo es tiempo compartido."
        ],
        impact: [
          { n: "+18%", l: "Ventas frente al año anterior", d: "Resultado de la temporada completa." },
          { n: "12", l: "Piezas audiovisuales", d: "Videos de 15 y 30 segundos para redes y digital." },
          { n: "3", l: "Audiencias con mensaje propio", d: "Familias, parejas y regalos corporativos." }
        ],
        images: [
          { src: "https://picsum.photos/seed/p4-a/1200/900", alt: "Fotograma de un video de temporada", caption: "Video de temporada" },
          { src: "https://picsum.photos/seed/p4-b/1200/900", alt: "Pieza gráfica para redes", caption: "Piezas para redes" },
          { src: "https://picsum.photos/seed/p4-c/1200/900", alt: "Anuncio en tienda con decoración", caption: "Punto de venta" },
          { src: "https://picsum.photos/seed/p4-d/1200/900", alt: "Tarjeta de regalo corporativa", caption: "Regalos corporativos" }
        ]
      }
    }
  ],

  // type: "marca" | "empresa"
  clients: [
    { name: "Cliente de ejemplo A", type: "marca", sector: "Alimentos y bebidas", period: "2023 – 2024", role: "Branding y empaque" },
    { name: "Cliente de ejemplo B", type: "marca", sector: "Cuidado personal", period: "2024", role: "Campañas integradas" },
    { name: "Cliente de ejemplo C", type: "empresa", sector: "Tecnología B2B", period: "2023", role: "Identidad de marca" },
    { name: "Cliente de ejemplo D", type: "marca", sector: "Retail", period: "2023", role: "Dirección creativa" },
    { name: "Cliente de ejemplo E", type: "empresa", sector: "Servicios financieros", period: "2022", role: "Estrategia de marca" },
    { name: "Cliente de ejemplo F", type: "empresa", sector: "Educación", period: "2021 – 2022", role: "Marketing y publicidad" }
  ]
};

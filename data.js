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
      color: "#8B5E3C"
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
      color: "#2A7F8E"
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
      color: "#3B3FA8"
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
      color: "#B5402A"
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

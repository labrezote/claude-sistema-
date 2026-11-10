/* Datos y utilidades compartidas por las opciones de la web */
window.PB_DATA = {
  CATEGORIES: { branding: "Branding", campanas: "Campañas", marcas: "Marcas", digital: "Digital" },
  PROJECTS: [
    { title: "Identidad para organizadora de eventos", client: "Organizadora de música electrónica", category: "branding", mood: "fogata", sym: "baila", year: "2025", summary: "Branding para eventos de música electrónica. Descripción pendiente.", metric: "" },
    { title: "Identidad para despacho de abogados", client: "Despacho jurídico", category: "branding", mood: "papelnoche", sym: "bruta", year: "2025", summary: "Branding para despacho de abogados. Descripción pendiente.", metric: "" },
    { title: "Tarjetas de fidelización en Apple y Google Wallet", client: "App de fidelización", category: "digital", mood: "mar", sym: "idea", year: "2025", summary: "Digitalización de tarjetas de fidelización en Apple Wallet y Google Wallet. Ya cuenta con web.", metric: "" },
    { title: "Branding para dentistas", client: "Consultorio dental", category: "branding", mood: "niebla", sym: "guino", year: "2025", summary: "Identidad para consultorio dental. Descripción pendiente.", metric: "" },
    { title: "Marca de miel", client: "Miel", category: "marcas", mood: "cempasuchil", sym: "enamorada", year: "2025", summary: "Marca para producto de miel. Descripción pendiente.", metric: "" },
    { title: "Marca de mole", client: "Mole", category: "marcas", mood: "tierra", sym: "molcajete", year: "2025", summary: "Marca para producto de mole. Descripción pendiente.", metric: "" },
    { title: "Branding para entrenador fitness", client: "Entrenador fitness", category: "branding", mood: "desierto", sym: "corre", year: "2025", summary: "Identidad para entrenador fitness. Descripción pendiente.", metric: "" },
    { title: "Campaña JEEP", client: "JEEP", category: "campanas", mood: "carretera", sym: "salta", year: "2025", summary: "Campañas publicitarias para la marca JEEP. Descripción pendiente.", metric: "150+ autos vendidos" },
  ],
  SERVICES: ["Branding e identidad", "Naming", "Campañas publicitarias", "Redes sociales", "Fotografía y video", "Sitios web y digital"],
};
window.paintAll = (root = document) => {
  root.querySelectorAll("[data-mood]").forEach((el) => {
    const c = el.tagName === "CANVAS" ? el : el.querySelector("canvas.photo");
    if (c) window.Marca.drawPhoto(c, el.dataset.mood, +(el.dataset.seed || 1));
  });
  requestAnimationFrame(() => window.Marca.fixStrokes(root));
};

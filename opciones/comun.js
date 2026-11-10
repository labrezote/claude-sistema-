/* Datos y utilidades compartidas por las opciones de la web */
window.PB_DATA = {
  CATEGORIES: { branding: "Branding", campanas: "Campañas", marcas: "Marcas", digital: "Digital" },
  PROJECTS: [
    { title: "Identidad para organizadora de eventos", client: "Organizadora de música electrónica", category: "branding", mood: "fogata", sym: "baila" },
    { title: "Identidad para despacho de abogados", client: "Despacho jurídico", category: "branding", mood: "papelnoche", sym: "bruta" },
    { title: "Tarjetas de fidelización en Apple y Google Wallet", client: "App de fidelización", category: "digital", mood: "mar", sym: "idea" },
    { title: "Branding para dentistas", client: "Consultorio dental", category: "branding", mood: "niebla", sym: "guino" },
    { title: "Marca de miel", client: "Miel", category: "marcas", mood: "cempasuchil", sym: "enamorada" },
    { title: "Marca de mole", client: "Mole", category: "marcas", mood: "tierra", sym: "molcajete" },
    { title: "Branding para entrenador fitness", client: "Entrenador fitness", category: "branding", mood: "desierto", sym: "corre" },
    { title: "Campaña JEEP", client: "JEEP · 150+ autos vendidos", category: "campanas", mood: "carretera", sym: "salta" },
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

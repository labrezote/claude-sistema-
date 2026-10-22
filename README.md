# Portafolio de mercadotecnia y publicidad

Sitio estático de una sola página para mostrar trabajos de **branding**, **campañas**, y las **marcas y empresas** con las que has trabajado.

## Estructura

```
index.html    Estructura de la página principal
proyecto.html Página de caso de cada trabajo (usa ?id=...)
styles.css    Estilos (incluye modo claro/oscuro automático)
app.js        Lógica de render, filtros de la página principal
proyecto.js   Render de la página de caso
data.js       ← TU CONTENIDO: edita solo este archivo
```

## Cómo personalizarlo

Abre `data.js` y reemplaza los datos de ejemplo:

- **`owner`**: nombre, cargo, biografía, correo y enlaces (LinkedIn, Behance, etc.).
- **`projects`**: trabajos. `category` debe ser `"branding"` o `"campaña"`. `color` es el color representativo de la tarjeta. `detail` define la página de caso de cada trabajo (portada, frase principal, párrafos, resultados y galería). Cada trabajo abre en `proyecto.html?id=<id>`.
- **`clients`**: marcas y empresas. `type` debe ser `"marca"` o `"empresa"`.

Para agregar un proyecto, copia un bloque existente, cambia el `id` a uno único y listo.

## Verlo localmente

No requiere instalación. Abre `index.html` en el navegador, o desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## Publicarlo (GitHub Pages)

1. En el repositorio, ve a **Settings → Pages**.
2. En *Source* elige la rama y la carpeta raíz (`/`).
3. El sitio quedará disponible en `https://labrezote.github.io/claude-sistema-/`.

## Librerías de movimiento

Se cargan desde CDN (jsdelivr), sin paso de compilación:

- **GSAP + ScrollTrigger** (`gsap@3.15.0`, ~29 mil estrellas en GitHub): revela los bloques al entrar en pantalla. Licencia *Standard "no charge"* de GSAP, válida para sitios como este.
- **Lenis** (`lenis@1.3.26`, ~17 mil estrellas, MIT): scroll suave, sincronizado con GSAP.

Si la red no permite cargarlas, el sitio sigue funcionando con el scroll nativo y la revelación con `IntersectionObserver`. Con `prefers-reduced-motion` no se activa ninguna de las dos.

## Notas

- Todo el contenido actual es **de ejemplo** (clientes y datos ficticios). Reemplázalo antes de publicar.
- Si quieres imágenes de campañas, puedes añadir una propiedad `image` a cada proyecto y mostrarla en `app.js` en lugar del bloque de color.

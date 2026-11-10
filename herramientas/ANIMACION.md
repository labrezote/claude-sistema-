# Herramientas de animación con Claude

Las 4 herramientas recomendadas en el reel de @rafatatay1 ("Cómo crear animaciones con Claude").

## 1. Paper Shaders: fondos animados (ya instalado)

Paquete npm `@paper-design/shaders@0.0.82`, fijado a una versión exacta porque la serie 0.0.x trae cambios que rompen compatibilidad. Ofrece degradados, grano, semitono, metal líquido y más, sobre canvas y sin dependencias.
Repo: https://github.com/paper-design/shaders

## 2. Claude Animation Base: dibujos animados pintados a mano (ya incluido)

Está en `herramientas/claude-animation-base/` (licencia MIT, de John Heibel). Usa p5.js y p5.brush.

```bash
cd herramientas/claude-animation-base && npm install
```

Después pídele a Claude: *"Lee ANIMATION_GUIDE.md y haz un video de 15 segundos de…"*. Necesitas Node, Chrome y ffmpeg.

## 3. HyperFrames (HeyGen): escribes HTML y te devuelve un video

Es un plugin de Claude Code. Instálalo en tu terminal:

```bash
claude plugin marketplace add heygen-com/hyperframes
```

```bash
claude plugin install hyperframes@hyperframes
```

Repo: https://github.com/heygen-com/hyperframes

## 4. Lemo-Opuscar: 66 estilos de película hechos con código

Es un plugin de Claude Code. Necesita Node 20+, ffmpeg 7+ y Python 3.11+.

```bash
claude plugin marketplace add lemomo-ai/lemo-opuscar
```

```bash
claude plugin install lemo-opuscar@lemolab
```

Úsalo con `/lemo-opuscar:lemo-opuscar`.
Repo: https://github.com/lemomo-ai/lemo-opuscar

/* =========================================================
   Secret Room · S en 3D con volumen (Three.js r128)
   Isotipo extruido con bisel a partir del contorno real del logo.
   Texturas propias, generadas en código (no salen de los flyers).
   ========================================================= */
(() => {
  const OUTLINE = [[[0.3565, 0.0], [0.9905, 0.0], [0.9937, 0.0024], [0.9211, 0.0983], [0.9085, 0.1103], [0.858, 0.1775], [0.8454, 0.1894], [0.7129, 0.3573], [0.7066, 0.3573], [0.7035, 0.3501], [0.7066, 0.1727], [0.7003, 0.1631], [0.6877, 0.1535], [0.6782, 0.1511], [0.653, 0.1535], [0.4795, 0.2086], [0.4196, 0.2254], [0.4101, 0.2302], [0.4038, 0.2302], [0.3943, 0.235], [0.388, 0.235], [0.3785, 0.2398], [0.3722, 0.2398], [0.3407, 0.2518], [0.3186, 0.2686], [0.306, 0.2878], [0.3028, 0.3094], [0.3123, 0.3333], [0.3186, 0.3381], [0.4038, 0.4604], [0.4101, 0.4652], [0.4196, 0.482], [0.4259, 0.4868], [0.4353, 0.5036], [0.4416, 0.5084], [0.4511, 0.5252], [0.489, 0.5731], [0.5047, 0.5995], [0.4858, 0.5947], [0.4511, 0.5755], [0.4416, 0.5731], [0.0883, 0.3957], [0.0568, 0.3741], [0.0442, 0.3573], [0.0379, 0.3405], [0.0379, 0.3118], [0.0473, 0.2902], [0.123, 0.1942], [0.1356, 0.1823], [0.1861, 0.1151], [0.1987, 0.1031], [0.2208, 0.0719], [0.2461, 0.0432], [0.2839, 0.0168], [0.3186, 0.0048], [0.3533, 0.0024]], [[0.5268, 0.3789], [0.5394, 0.3813], [0.9527, 0.5923], [0.9779, 0.6115], [0.9905, 0.6307], [0.9905, 0.6403], [0.9937, 0.6427], [0.9937, 0.6715], [0.9874, 0.6882], [0.8991, 0.801], [0.8612, 0.8441], [0.8391, 0.8753], [0.8265, 0.8873], [0.795, 0.9305], [0.7666, 0.9592], [0.7445, 0.9736], [0.7129, 0.988], [0.6688, 0.9976], [0.0252, 0.9976], [0.0032, 0.9976], [0.0032, 0.9952], [0.0158, 0.9832], [0.0189, 0.976], [0.1073, 0.8729], [0.1199, 0.8537], [0.1388, 0.8345], [0.142, 0.8273], [0.1546, 0.8153], [0.2366, 0.7122], [0.3028, 0.6355], [0.3091, 0.6379], [0.3091, 0.6523], [0.306, 0.6547], [0.306, 0.7386], [0.3028, 0.741], [0.2997, 0.8201], [0.3028, 0.8225], [0.3028, 0.8297], [0.3155, 0.8465], [0.3281, 0.8561], [0.3533, 0.8657], [0.3849, 0.8657], [0.3943, 0.8609], [0.4006, 0.8609], [0.5552, 0.8034], [0.5615, 0.8034], [0.6025, 0.7866], [0.6088, 0.7866], [0.6498, 0.7698], [0.6562, 0.7698], [0.7035, 0.7482], [0.7224, 0.7314], [0.735, 0.7074], [0.735, 0.6787], [0.7287, 0.6643], [0.7161, 0.6499], [0.7003, 0.6235], [0.694, 0.6187], [0.6782, 0.5923], [0.6719, 0.5875], [0.6562, 0.5612], [0.6498, 0.5564], [0.6372, 0.5348], [0.6309, 0.53], [0.6183, 0.5084], [0.612, 0.5036], [0.5773, 0.4508], [0.571, 0.446], [0.5584, 0.4245], [0.5363, 0.3981], [0.5268, 0.3837]]];
  const ASPECT = 317 / 417;

  // ---------- ruido para texturas ----------
  function noise2(seed) {
    const p = new Uint8Array(512); let s = seed;
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 256; i++) p[i + 256] = p[i];
    const f = (t) => t * t * (3 - 2 * t), h = (x, y) => p[p[x & 255] + (y & 255)] / 255;
    const n = (x, y) => { const X = Math.floor(x), Y = Math.floor(y), u = f(x - X), v = f(y - Y);
      return (h(X, Y) * (1 - u) + h(X + 1, Y) * u) * (1 - v) + (h(X, Y + 1) * (1 - u) + h(X + 1, Y + 1) * u) * v; };
    return (x, y, o = 5) => { let a = 0, w = .5, q = 1; for (let i = 0; i < o; i++) { a += w * n(x * q, y * q); w *= .5; q *= 2; } return a; };
  }
  function paint(size, fn) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const x = c.getContext("2d"), img = x.createImageData(size, size), d = img.data;
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const [r, g, b] = fn(i / size, j / size), k = (j * size + i) * 4;
      d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255;
    }
    x.putImageData(img, 0, 0); return c;
  }
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const cl = (t) => Math.max(0, Math.min(1, t));

  // ---------- texturas con relieve (color + altura + brillo) ----------
  function canvas2(size, draw) { const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d"); draw(x, size); return c; }
  function pixels(c) { return c.getContext("2d").getImageData(0, 0, c.width, c.height).data; }
  function fromFn(size, fn) { return paint(size, fn); }
  function voronoi(seed, n) {
    let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const P = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) P.push([(i + .15 + rnd() * .7) / n, (j + .15 + rnd() * .7) / n]);
    return (u, v) => { let f1 = 9, f2 = 9, id = 0; const ci = Math.floor(u * n), cj = Math.floor(v * n);
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const i = ci + di, j = cj + dj, wi = ((i % n) + n) % n, wj = ((j % n) + n) % n, k = wj * n + wi;
        const px = P[k][0] + (i - wi) / n, py = P[k][1] + (j - wj) / n, d = Math.hypot(u - px, v - py);
        if (d < f1) { f2 = f1; f1 = d; id = k; } else if (d < f2) f2 = d; }
      return [f1, f2, id]; };
  }
  const S = 512;
  function greca(x, n) { // greca escalonada mesoamericana en mosaico
    const t = n / 8; x.lineCap = "square"; x.lineJoin = "miter";
    for (let gy = 0; gy < n; gy += t * 2) for (let gx = 0; gx < n; gx += t * 2) {
      x.beginPath(); x.moveTo(gx + t * .2, gy + t * 1.8); x.lineTo(gx + t * .2, gy + t * .2); x.lineTo(gx + t * 1.8, gy + t * .2); x.lineTo(gx + t * 1.8, gy + t * 1.4);
      x.lineTo(gx + t * .7, gy + t * 1.4); x.lineTo(gx + t * .7, gy + t * .75); x.lineTo(gx + t * 1.25, gy + t * .75); x.stroke(); }
  }
  function volutas(x, n, seed) { let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < 26; k++) { const cx = rnd() * n, cy = rnd() * n, r0 = 18 + rnd() * 34, rot = rnd() * 6.28; x.beginPath();
      for (let t = 0; t < 1; t += .01) { const a = rot + t * 11, r = r0 * (1 - t * .85); const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; t ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
      x.beginPath(); x.ellipse(cx + r0 * 1.3, cy, r0 * .5, r0 * .18, rot, 0, 7); x.fill(); } }

  const TEXTURES = [
    { id: "piedra", name: "Piedra tallada", tone: "#d63a2a", glow: "rgba(214,58,42,.42)",
      build() { const N = noise2(5);
        const h = canvas2(S, (x, n) => { x.fillStyle = "#c8c8c8"; x.fillRect(0, 0, n, n); x.strokeStyle = "#2a2a2a"; x.lineWidth = n / 64; greca(x, n); });
        const hp = pixels(h);
        const col = fromFn(S, (u, v) => { const k = ((v * S | 0) * S + (u * S | 0)) * 4, g = hp[k] / 255, nn = N(u * 7, v * 7, 5);
          return g < .5 ? [70, 12, 10] : mix([34, 40, 36], [86, 92, 82], nn).map((c) => c * (.85 + .3 * N(u * 30, v * 30, 2))); });
        const em = fromFn(S, (u, v) => { const k = ((v * S | 0) * S + (u * S | 0)) * 4; return hp[k] < 128 ? [255, 50, 25] : [0, 0, 0]; });
        return { map: col, bump: h, emissive: em, emissiveColor: 0xff3020, emissiveIntensity: 1.6 }; },
      mat: { metalness: .05, roughness: .9, bumpScale: .035 } },
    { id: "plata", name: "Plata repujada", tone: "#b9bcc4", glow: "rgba(185,188,196,.3)",
      build() { const N = noise2(9);
        const h = canvas2(S, (x, n) => { x.fillStyle = "#6a6a6a"; x.fillRect(0, 0, n, n); x.strokeStyle = "#f0f0f0"; x.fillStyle = "#f0f0f0"; x.lineWidth = 7; x.shadowColor = "#fff"; x.shadowBlur = 6; volutas(x, n, 3); });
        const hp = pixels(h);
        const col = fromFn(S, (u, v) => { const k = ((v * S | 0) * S + (u * S | 0)) * 4, g = hp[k] / 255; return mix([60, 60, 64], [196, 198, 204], g * .7 + N(u * 10, v * 10, 3) * .3); });
        return { map: col, bump: h }; },
      mat: { metalness: .9, roughness: .42, bumpScale: .05 } },
    { id: "bronce", name: "Bronce orgánico", tone: "#c08a4a", glow: "rgba(192,138,74,.35)",
      build() { const V = voronoi(13, 6), N = noise2(17); const hh = []; let qi = 0;
        const col = fromFn(S, (u, v) => { const [f1, f2] = V(u, v), e = f2 - f1, ridge = cl(1 - e / .05); hh.push(ridge);
          return ridge > .25 ? mix([92, 60, 30], [200, 150, 90], ridge * .8 + N(u * 12, v * 12, 3) * .2) : mix([12, 9, 7], [34, 24, 16], cl(e * 6)); });
        const bump = fromFn(S, () => { const r = hh[qi++] || 0; const g = 40 + 215 * r; return [g, g, g]; });
        return { map: col, bump }; },
      mat: { metalness: .8, roughness: .5, bumpScale: .06 } },
    { id: "ambar", name: "Ámbar engarzado", tone: "#ff8a2a", glow: "rgba(255,138,42,.4)",
      build() { const V = voronoi(21, 4), N = noise2(23); const em = [], hh = []; let qi = 0, qj = 0;
        const col = fromFn(S, (u, v) => { const [f1, f2] = V(u, v), e = f2 - f1, frame = e < .025;
          const t = cl(f1 * 5), c = frame ? mix([18, 16, 16], [70, 66, 64], N(u * 20, v * 20, 2)) : mix(mix([220, 130, 40], [110, 34, 6], t), [60, 18, 4], cl((N(u * 6, v * 6, 4) - .55) * 3));
          em.push(frame ? 0 : (1 - t) * .5); hh.push(frame ? 1 : .3 + .3 * (1 - t)); return c; });
        const emissive = fromFn(S, () => { const k = em[qj++] || 0; return [255 * k, 110 * k, 20 * k]; });
        const bump = fromFn(S, () => { const g = 255 * (hh[qi++] || 0); return [g, g, g]; });
        return { map: col, bump, emissive, emissiveColor: 0xffffff, emissiveIntensity: .45 }; },
      mat: { metalness: .25, roughness: .32, clearcoat: .4, clearcoatRoughness: .3, bumpScale: .05 } },
    { id: "luna", name: "Superficie lunar", tone: "#a9b4c8", glow: "rgba(150,170,200,.3)",
      build() { const N = noise2(29); let s0 = 77; const rnd = () => ((s0 = (s0 * 16807) % 2147483647) / 2147483647);
        const C = Array.from({ length: 40 }, () => [rnd(), rnd(), .02 + rnd() * .07]); const hh = []; let qi = 0;
        const col = fromFn(S, (u, v) => { let h = N(u * 8, v * 8, 6) * .6 + .2;
          for (const [cx, cy, r] of C) { const d = Math.hypot(u - cx, v - cy) / r; if (d < 1.25) h += d < 1 ? -.35 * (1 - d * d) : .25 * (1.25 - d) * 4 * .1; }
          hh.push(cl(h)); const g = 46 + 96 * cl(h); return [g, g, g + 6]; });
        const bump = fromFn(S, () => { const g = 255 * (hh[qi++] || 0); return [g, g, g]; });
        return { map: col, bump }; },
      mat: { metalness: 0, roughness: .95, bumpScale: .07 } },
    { id: "obsidiana", name: "Obsidiana roja", tone: "#ff2a2a", glow: "rgba(255,30,30,.4)",
      build() { const N = noise2(37); const em = []; let qj = 0;
        const col = fromFn(S, (u, v) => { const c = Math.abs(N(u * 3, v * 3, 5) - .5), k = c < .012 ? 1 - c / .012 : 0; em.push(k);
          return k ? mix([60, 4, 4], [255, 60, 40], k) : mix([6, 6, 8], [30, 28, 34], N(u * 9, v * 9, 4)); });
        const emissive = fromFn(S, () => { const k = em[qj++] || 0; return [255 * k, 40 * k, 30 * k]; });
        return { map: col, emissive, emissiveColor: 0xffffff, emissiveIntensity: 1.5 }; },
      mat: { metalness: .2, roughness: .3, clearcoat: .6, clearcoatRoughness: .2 } },
  ];

  function envMap(renderer) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512; const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, "#222"); g.addColorStop(.5, "#090909"); g.addColorStop(1, "#000");
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    x.fillStyle = "#fff"; [[90, 150, 120, 40], [560, 110, 260, 26], [880, 200, 70, 140]].forEach(([a, b, w, h]) => x.fillRect(a, b, w, h));
    x.fillStyle = "#888"; x.fillRect(300, 300, 400, 14);
    const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping;
    const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); return env;
  }

  function geometry() {
    const Hh = 2.4, Ww = Hh * ASPECT, geos = [];
    const uv = {
      generateTopUV: (g, v, a, b, c) => [a, b, c].map((i) => new THREE.Vector2(v[i * 3] / Ww + .5, v[i * 3 + 1] / Hh + .5)),
      generateSideWallUV: (g, v, a, b, c, d) => {
        const P = (i) => [v[i * 3], v[i * 3 + 1], v[i * 3 + 2]], A = P(a), B = P(b), C = P(c), D = P(d);
        const horiz = Math.abs(A[1] - B[1]) < Math.abs(A[0] - B[0]);
        const f = (q) => horiz ? new THREE.Vector2(q[0] / Ww + .5, q[2] * 1.2) : new THREE.Vector2(q[1] / Hh + .5, q[2] * 1.2);
        return [f(A), f(B), f(C), f(D)];
      },
    };
    OUTLINE.forEach((pts) => {
      const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - .5) * Ww, (.5 - y) * Hh)));
      geos.push(new THREE.ExtrudeGeometry(s, { depth: .16, bevelEnabled: true, bevelThickness: .035, bevelSize: .025, bevelSegments: 5, curveSegments: 4, UVGenerator: uv }));
    });
    geos.forEach((g) => g.translate(0, 0, -.08));
    return geos;
  }

  function mount(host, opts = {}) {
    if (!window.THREE) return null;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    if (!renderer.getContext()) return null;
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    const cv = renderer.domElement; cv.className = "sr-gl"; host.appendChild(cv);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 50); cam.position.set(0, 0, 5.6);
    scene.environment = envMap(renderer);
    scene.add(new THREE.AmbientLight(0xffffff, .25));
    const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(2.5, 3.5, 4); scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 10, 12); rim.position.set(-3, 1, -3); scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 6, 12); fill.position.set(0, -3, 3); scene.add(fill);

    const mats = TEXTURES.map((t) => {
      const m = new THREE.MeshPhysicalMaterial(Object.assign({ envMapIntensity: .6 }, t.mat));
      const b = t.build(), tx = (c, srgb) => { const x = new THREE.CanvasTexture(c); if (srgb) x.encoding = THREE.sRGBEncoding; x.anisotropy = 8; x.wrapS = x.wrapT = THREE.RepeatWrapping; return x; };
      m.map = tx(b.map, true);
      if (b.bump) m.bumpMap = tx(b.bump);
      if (b.emissive) { m.emissiveMap = tx(b.emissive, true); m.emissive = new THREE.Color(b.emissiveColor); m.emissiveIntensity = b.emissiveIntensity; }
      return m;
    });
    const group = new THREE.Group(); scene.add(group);
    const meshes = geometry().map((g) => { const me = new THREE.Mesh(g, mats[0]); group.add(me); return me; });

    let idx = opts.start || 0, ang = -0.35, vel = 0, playing = !opts.still, drag = null, lastTurn = 0, alive = true;
    const speed = 0.9;
    function setIdx(i) { idx = (i + TEXTURES.length) % TEXTURES.length; meshes.forEach((m) => (m.material = mats[idx])); rim.color.set(TEXTURES[idx].tone); opts.onChange && opts.onChange(idx, TEXTURES[idx]); }
    setIdx(idx);
    function size() { const r = host.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); }
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, a: ang }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; const na = drag.a + (e.clientX - drag.x) * .012; vel = (na - ang) * 60; ang = na; });
    cv.addEventListener("pointerup", () => { drag = null; });
    let visible = true; const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting)); io.observe(host);
    let t0 = performance.now();
    function frame(now) {
      if (!alive) return;
      if (!cv.isConnected) { alive = false; ro.disconnect(); io.disconnect(); renderer.dispose(); return; }
      const dt = Math.min(.05, (now - t0) / 1000); t0 = now;
      if (visible) {
        if (!drag) { if (playing) ang += speed * dt; ang += vel * dt; vel *= Math.pow(.04, dt); }
        // cambio de textura en cada vuelta completa, justo cuando la S queda de canto
        const turn = Math.floor((ang + Math.PI / 2) / (Math.PI * 2));
        if (turn !== lastTurn) { if (!drag || true) setIdx(idx + (turn > lastTurn ? 1 : -1)); lastTurn = turn; }
        group.rotation.y = ang; group.rotation.x = Math.sin(now / 2400) * .08; group.position.y = Math.sin(now / 1700) * .07;
        renderer.render(scene, cam);
      }
      requestAnimationFrame(frame);
    }
    lastTurn = Math.floor((ang + Math.PI / 2) / (Math.PI * 2));
    requestAnimationFrame(frame);
    return {
      textures: TEXTURES,
      next() { ang = (lastTurn + 1) * Math.PI * 2 - Math.PI / 2 + .001; },
      prev() { ang = (lastTurn - 1) * Math.PI * 2 + Math.PI * 1.5 - .001; },
      go(i) { setIdx(i); },
      play(v) { playing = v; },
    };
  }
  window.SR3D = { mount, TEXTURES };
})();

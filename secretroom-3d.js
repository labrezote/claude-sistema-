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

  const TEXTURES = [
    { id: "cromo", name: "Cromo líquido", tone: "#c9d3df", glow: "rgba(170,190,215,.35)",
      mat: { color: 0xeeeeee, metalness: 1, roughness: .05, clearcoat: 1, clearcoatRoughness: .05 } },
    { id: "holo", name: "Holográfico", tone: "#b48cff", glow: "rgba(150,110,255,.4)",
      tex: () => { const N = noise2(7); return paint(512, (u, v) => { const t = N(u * 2.2, v * 2.2, 4) * 2.4 + u * .8 + v * .5;
        return [127 + 127 * Math.sin(6.28 * t), 127 + 127 * Math.sin(6.28 * t + 2.1), 127 + 127 * Math.sin(6.28 * t + 4.2)]; }); },
      mat: { metalness: .85, roughness: .12, clearcoat: 1, clearcoatRoughness: .08 } },
    { id: "obsidiana", name: "Obsidiana y oro", tone: "#d6a640", glow: "rgba(214,166,64,.35)",
      tex: () => { const N = noise2(11); return paint(1024, (u, v) => { const n = N(u * 5, v * 5, 5), vein = Math.abs(N(u * 3 + 9, v * 3, 4) - .5);
        const base = mix([8, 8, 10], [26, 24, 30], n); return vein < .018 ? mix([255, 214, 120], [190, 130, 40], vein / .018) : base; }); },
      mat: { metalness: .45, roughness: .18, clearcoat: 1, clearcoatRoughness: .04 } },
    { id: "marmol", name: "Mármol blanco", tone: "#e9e4dc", glow: "rgba(235,228,218,.3)",
      tex: () => { const N = noise2(23); return paint(1024, (u, v) => { const t = Math.sin((u * 6 + v * 3 + N(u * 4, v * 4, 6) * 6) * 1.6);
        const vein = Math.pow(1 - Math.abs(t), 9); return mix([242, 238, 232], [70, 72, 80], vein * .85); }); },
      mat: { metalness: 0, roughness: .22, clearcoat: .8, clearcoatRoughness: .15 } },
    { id: "lava", name: "Roca de lava", tone: "#ff5a1f", glow: "rgba(255,80,20,.5)", emissive: true,
      tex: () => { const N = noise2(31); return paint(1024, (u, v) => { const c = Math.abs(N(u * 4, v * 4, 5) - .5), n = N(u * 14, v * 14, 3);
        return c < .016 ? mix([255, 220, 110], [230, 60, 10], c / .016) : mix([16, 12, 12], [52, 40, 38], n); }); },
      mat: { metalness: .1, roughness: .85 } },
    { id: "jade", name: "Jade", tone: "#3fbf86", glow: "rgba(63,191,134,.4)",
      tex: () => { const N = noise2(43); return paint(1024, (u, v) => { const n = N(u * 3, v * 3, 6), m = N(u * 9 + 4, v * 9, 3);
        return mix(mix([10, 70, 48], [80, 190, 130], n), [210, 250, 225], cl((m - .62) * 3)); }); },
      mat: { metalness: .05, roughness: .2, clearcoat: 1, clearcoatRoughness: .1, sheen: 0 } },
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
      geos.push(new THREE.ExtrudeGeometry(s, { depth: .42, bevelEnabled: true, bevelThickness: .09, bevelSize: .045, bevelSegments: 8, curveSegments: 4, UVGenerator: uv }));
    });
    geos.forEach((g) => g.translate(0, 0, -.21));
    return geos;
  }

  function mount(host, opts = {}) {
    if (!window.THREE) return null;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    if (!renderer.getContext()) return null;
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    const cv = renderer.domElement; cv.className = "sr-gl"; host.appendChild(cv);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 50); cam.position.set(0, 0, 5.6);
    scene.environment = envMap(renderer);
    scene.add(new THREE.AmbientLight(0xffffff, .25));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 18, 12); rim.position.set(-3, 1, -3); scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 6, 12); fill.position.set(0, -3, 3); scene.add(fill);

    const mats = TEXTURES.map((t) => {
      const m = new THREE.MeshPhysicalMaterial(Object.assign({ envMapIntensity: 1.4 }, t.mat));
      if (t.tex) { const c = t.tex(), tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = 8; tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        m.map = tx; if (t.emissive) { m.emissiveMap = tx; m.emissive = new THREE.Color(0xff5a1f); m.emissiveIntensity = 1.1; } }
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

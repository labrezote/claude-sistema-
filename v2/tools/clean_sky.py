"""
Quita la "g" en pixel de la foto de nube (ref-06) y deja solo el cielo.

Rellena los trazos con textura de cielo de los costados y la integra con
mezcla Poisson (cv2.seamlessClone). Requiere numpy y opencv-python-headless.

Uso: python3 v2/tools/clean_sky.py v2/assets/img/ref-06.webp v2/assets/img/sky.webp preview.png
"""
import sys
import numpy as np
import cv2
src, out, preview = sys.argv[1], sys.argv[2], sys.argv[3]
bgr = cv2.imread(src, cv2.IMREAD_COLOR)
a = bgr.astype(np.float32)
H, W, _ = a.shape
lum = a.mean(axis=2)
neutral = (a[..., 0] - a[..., 2]) < 25          # BGR: azul - rojo; la g es gris neutro
mask = ((lum < 140) & neutral).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((25, 25), np.uint8))
# textura de relleno desde los costados limpios, con transición ancha
xs = np.arange(W)
from_right = a[:, np.clip(xs + 500, 0, W - 1)]
from_left = a[:, np.clip(xs - 500, 0, W - 1)]
t = np.clip((xs - 460) / 160, 0, 1)[None, :, None]
fill = (from_right * (1 - t) + from_left * t).clip(0, 255).astype(np.uint8)
# mezcla Poisson: iguala color y degradado en el borde de la máscara
ys, xs_m = np.where(mask > 0)
x0, x1, y0, y1 = xs_m.min(), xs_m.max(), ys.min(), ys.max()
center = (int((x0 + x1) / 2), int((y0 + y1) / 2))
res = cv2.seamlessClone(fill, bgr, mask, center, cv2.NORMAL_CLONE)
# limpieza final: inpaint fino sobre cualquier pixel gris oscuro que quede
r = res.astype(np.float32)
left = (((r.mean(axis=2) < 110) & ((r[..., 0] - r[..., 2]) < 25)) * 255).astype(np.uint8)
res = cv2.inpaint(res, cv2.dilate(left, np.ones((5, 5), np.uint8)), 7, cv2.INPAINT_TELEA)
cv2.imwrite(preview, res)
cv2.imwrite(out, res, [cv2.IMWRITE_WEBP_QUALITY, 88])
print("bbox mascara", x0, x1, y0, y1, "restos limpiados", int((left > 0).sum()))

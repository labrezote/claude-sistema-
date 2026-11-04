"""
Genera la tipografía "Crudo Loop" (TTF).

Cada glifo es una cuadrícula pixel de 5x7. Cada celda encendida se dibuja
como un cuadrado de esquina redondeada; al tocarse con sus vecinas forma
trazos continuos con muescas suaves, como en la referencia "loading culture".

Uso (desde la raíz del repo, con fonttools instalado):
    python3 v2/tools/build_font.py
Salida: v2/assets/fonts/crudo-loop.ttf
"""

import os
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

CELL = 120        # tamaño de cada pixel en unidades de fuente
RADIUS = 24       # radio de la esquina redonda de cada celda
COLS, ROWS = 5, 7
UPM = 1000
CAP = ROWS * CELL  # altura de mayúscula (840)
ASCENT = CAP + CELL + 40  # deja espacio a los acentos

# Glifos: filas de arriba hacia abajo, '#' = encendido
GLYPHS = {
    "A": [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
    "B": ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
    "C": [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
    "D": ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
    "E": ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
    "F": ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
    "G": [".####", "#....", "#....", "#.###", "#...#", "#...#", ".####"],
    "H": ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
    "I": ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
    "J": ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
    "K": ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
    "L": ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
    "M": ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
    "N": ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
    "O": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    "P": ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
    "Q": [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
    "R": ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
    "S": [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
    "T": ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
    "U": ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    "V": ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
    "W": ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
    "X": ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
    "Y": ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
    "Z": ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
    "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
    "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
    "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
    "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
    "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
    "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
    "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
    "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
    "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
    ".": [".....", ".....", ".....", ".....", ".....", ".....", "..#.."],
    "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
    "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
    "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
    ":": [".....", "..#..", ".....", ".....", ".....", "..#..", "....."],
    "/": ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."],
    "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
    "%": ["##..#", "##.#.", "...#.", "..#..", ".#...", ".#.##", "#..##"],
    "·": [".....", ".....", ".....", "..#..", ".....", ".....", "....."],
    "—": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
}

# Signos invertidos del español: el original girado 180°
GLYPHS["¿"] = [row[::-1] for row in reversed(GLYPHS["?"])]
GLYPHS["¡"] = [row[::-1] for row in reversed(GLYPHS["!"])]

# Acentos: una fila extra de píxeles sobre la letra base
ACCENTS = {
    "Á": ("A", "...#."),
    "É": ("E", "...#."),
    "Í": ("I", "...#."),
    "Ó": ("O", "...#."),
    "Ú": ("U", "...#."),
    "Ñ": ("N", ".###."),
}
for char, (base, accent_row) in ACCENTS.items():
    GLYPHS[char] = [accent_row] + GLYPHS[base]


def rounded_cell(pen, x, y):
    """Cuadrado de celda con esquinas redondeadas (contorno en sentido horario)."""
    r = RADIUS
    s = CELL
    pen.moveTo((x + r, y))
    pen.lineTo((x + s - r, y))
    pen.qCurveTo((x + s, y), (x + s, y + r))
    pen.lineTo((x + s, y + s - r))
    pen.qCurveTo((x + s, y + s), (x + s - r, y + s))
    pen.lineTo((x + r, y + s))
    pen.qCurveTo((x, y + s), (x, y + s - r))
    pen.lineTo((x, y + r))
    pen.qCurveTo((x, y), (x + r, y))
    pen.closePath()


def build_glyph(rows):
    pen = TTGlyphPen(None)
    for row_index, row in enumerate(rows):
        for col_index, ch in enumerate(row):
            if ch == "#":
                x = col_index * CELL
                # filas extra (acentos) quedan por encima de la altura de mayúscula
                y = (len(rows) - 1 - row_index) * CELL
                rounded_cell(pen, x, y)
    return pen.glyph()


def main():
    chars = sorted(GLYPHS)
    # nombres de glifo ASCII válidos (uniXXXX), también para Á, ¿, etc.
    name = {c: "uni%04X" % ord(c) for c in chars}
    glyph_order = [".notdef", "space"] + [name[c] for c in chars]
    char_map = {ord(" "): "space"}
    for c in chars:
        char_map[ord(c)] = name[c]
    # minúsculas usan los mismos glifos (la web muestra en mayúsculas)
    for c in "abcdefghijklmnopqrstuvwxyzáéíóúñ":
        char_map[ord(c)] = name[c.upper()]

    advance = (COLS + 1) * CELL  # 5 celdas + 1 celda de separación

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(char_map)

    glyphs = {}
    glyphs[".notdef"] = TTGlyphPen(None).glyph()
    glyphs["space"] = TTGlyphPen(None).glyph()
    for c in chars:
        glyphs[name[c]] = build_glyph(GLYPHS[c])
    fb.setupGlyf(glyphs)

    metrics = {g: (advance, 0) for g in glyph_order}
    metrics["space"] = (advance, 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=-120)

    fb.setupNameTable({
        "familyName": "Crudo Loop",
        "styleName": "Regular",
    })
    fb.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=-120,
        usWinAscent=ASCENT,
        usWinDescent=120,
        sCapHeight=CAP,
        sxHeight=CAP,
    )
    fb.setupPost()
    fb.setupHead(unitsPerEm=UPM)

    out_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.normpath(os.path.join(out_dir, "crudo-loop.ttf"))
    fb.save(out)
    print("Fuente generada:", out)


if __name__ == "__main__":
    main()

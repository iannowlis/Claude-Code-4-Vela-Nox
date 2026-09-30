# Turns the stroke construction files into filled outlines (one path, no strokes or clips), the form a logo file
# should have, and writes the white and black versions to assets/logo/. Needs: pip install picosvg
import pathlib, re
from picosvg.svg import SVG

root = pathlib.Path(__file__).resolve().parent.parent
src, out = root / 'assets/logo/source', root / 'assets/logo'
for name, dest in [('standard', 'vela-nox-mark'), ('bold', 'vela-nox-mark-bold')]:
    raw = (src / f'mark-{name}-strokes.svg').read_text()
    pico = SVG.fromstring(raw).topicosvg()
    d = ' '.join(p.d for p in pico.shapes())
    box = re.search(r'viewBox="([^"]+)"', raw).group(1)
    for suffix, col in [('', '#E6EDF5'), ('-black', '#070C16')]:
        (out / f'{dest}{suffix}.svg').write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}"><path fill="{col}" d="{d}"/></svg>\n')
    # the same outline on two lines (viewBox, path): src/vela.js (MARK) and tools/cover-maker.html embed it
    (src / f'{dest}.path.txt').write_text(box + '\n' + d + '\n')
print('Wrote assets/logo/vela-nox-mark*.svg')

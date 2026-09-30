// The Vela Nox mark, rebuilt on true geometry from the Recraft sketch (assets/logo/source/vela-nox-logo-recraft.svg).
// One circle, one stroke weight: the stem, the ring (its left side runs along the stem), the V hooked into
// the ring at the top right, and a separate top arc. Writes the construction SVGs (strokes) to assets/logo/source/;
// python3 tools/outline-logo.py turns them into the filled logo files in assets/logo/.
//   node tools/logo.mjs && python3 tools/outline-logo.py
import { writeFileSync } from 'node:fs';

const f = (n) => +n.toFixed(1);
export const STANDARD = { w: 56 };
// Heavier line and wider gaps so it survives at 16-32px (favicon, profile icons)
export const BOLD = { w: 92, ringEnd: 213, arcA: 251, arcB: 292, hookA: 336, armTopY: 790, hookLen: 110, hookLen2: 100 };

export function mark(o = {}, col = '#E6EDF5', id = 'vn') {
  const { cx = 1025, cy = 1029, r = 428, w = 56, bot = 1472, ringEnd = 222, arcA = 241.5, arcB = 301, hookA = 332,
    vx = 1023, vy = 1352, lx = 718, armTopY = 770, hookLen = 120, hookLen2 = 110 } = o;
  const stemX = cx - r, top = Math.round(cy - r - w / 2);
  const P = (a) => [f(cx + r * Math.cos(a * Math.PI / 180)), f(cy + r * Math.sin(a * Math.PI / 180))];
  const k = (vx - lx) / (vy - top);                     // the V's slope; both arms mirror it
  const armTop = [f(vx + (vy - armTopY) * k), armTopY];
  const hk = P(hookA), rad = hookA * Math.PI / 180;
  const c1 = [f(hk[0] + Math.sin(rad) * hookLen), f(hk[1] - Math.cos(rad) * hookLen)];
  const L = Math.hypot(k, 1), c2 = [f(armTop[0] + k / L * hookLen2), f(armTop[1] - 1 / L * hookLen2)];
  const S = `fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="butt"`;
  // ring from the upper left, down along the stem, round the bottom, up the right, hooked into the V's right arm,
  // down to the point, up the left arm (cut flat at the top line by the clip)
  const main = `M${P(ringEnd)} A${r} ${r} 0 1 0 ${hk} C${c1} ${c2} ${armTop} L${vx} ${vy} L${f(lx - 60 * k)} ${top - 60}`;
  return {
    box: [stemX - w / 2, top, 2 * r + w, 2 * r + w],
    body: `<clipPath id="${id}"><rect x="0" y="${top}" width="2048" height="${2048 - top}"/></clipPath>` +
      `<path ${S} stroke-linejoin="miter" stroke-miterlimit="8" d="${main}" clip-path="url(#${id})"/>` +
      `<path ${S} d="M${P(arcA)} A${r} ${r} 0 0 1 ${P(arcB)}"/>` +
      `<path ${S} d="M${stemX} ${top} V${bot}"/>`
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = new URL('..', import.meta.url).pathname;
  for (const [name, o] of [['standard', STANDARD], ['bold', BOLD]]) {
    const m = mark(o);
    writeFileSync(root + `assets/logo/source/mark-${name}-strokes.svg`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m.box.join(' ')}" width="${m.box[2]}" height="${m.box[3]}">${m.body}</svg>\n`);
  }
  console.log('Wrote assets/logo/source/mark-*-strokes.svg');
}

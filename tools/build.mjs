// Builds the legal page bodies (ghl/legal/*.html) from copy/legal/*.txt. tools/kit.mjs puts them into the
// Terms, Privacy and Cancellation page blocks, and tools/preview.mjs into the preview.
//   node tools/build.mjs && node tools/kit.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;

// Legal pages: your pasted text, word for word, from copy/legal/*.txt. Only structure is added
// (title as H1, section names as H2, "- " lines as list items) and the email becomes a mailto link.
const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mail = (t) => escHtml(t).replace(/velanox@gmail\.com/g, '<a href="mailto:velanox@gmail.com">velanox@gmail.com</a>');
mkdirSync(root + 'ghl/legal', { recursive: true });
for (const name of ['terms', 'privacy', 'cancellation']) {
  const lines = readFileSync(root + `copy/legal/${name}.txt`, 'utf8').replace(/\r/g, '').split('\n');
  const out = [];
  let list = false;
  const close = () => { if (list) { out.push('</ul>'); list = false; } };
  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t) { close(); return; }
    const prevBlank = i === 0 || !lines[i - 1].trim();
    const nextText = i + 1 < lines.length && lines[i + 1].trim();
    if (i === 0) out.push(`<h1>${escHtml(t)}</h1>`);
    else if (/^Last updated:/.test(t)) out.push(`<p class="vn-meta">${escHtml(t)}</p>`);
    else if (t.startsWith('- ')) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${mail(t.slice(2))}</li>`); }
    else if (prevBlank && nextText && t.length < 60 && !/[.:;,]$/.test(t)) { close(); out.push(`<h2>${escHtml(t)}</h2>`); }
    else { close(); out.push(`<p>${mail(t)}</p>`); }
  });
  close();
  writeFileSync(root + `ghl/legal/${name}.html`,
    `<!-- Vela Nox: /${name} page body. Paste into one Custom Code element. Text is exactly as supplied in copy/legal/${name}.txt. -->\n` +
    `<style>.vn-legal{max-width:38rem}.vn-legal h1,.vn-legal h2{font-weight:700;color:var(--mist,#E7EAED)}.vn-legal h2{font-family:var(--text,'Atkinson Hyperlegible',Arial,sans-serif)}.vn-legal h1{font-family:var(--display,'Big Shoulders Display',sans-serif);font-weight:800;font-size:clamp(40px,6vw,60px);line-height:1;letter-spacing:.01em;margin:0 0 .75rem}.vn-legal h2{font-size:var(--t-body,18px);line-height:1.4;margin:2.25rem 0 .4rem}.vn-legal .vn-meta{color:var(--fog,#95A0AD);margin-bottom:2rem}.vn-legal li{margin-bottom:.4rem}</style>\n` +
    `<div class="vn vn-legal">\n${out.join('\n')}\n</div>\n`);
}
console.log('Built ghl/legal/*.html');

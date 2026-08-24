const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8');
const marker = '\n/* ── Mobile zoom & tap-friendly overrides ── */';
const idx = css.indexOf(marker);
if (idx !== -1) {
  css = css.slice(0, idx);
  fs.writeFileSync('client/src/index.css', css, 'utf8');
  console.log('Removed mobile zoom block');
} else {
  console.log('Block not found');
}

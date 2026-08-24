const fs = require('fs');
const css = fs.readFileSync('client/src/index.css', 'utf8');
// backtick char is 96, n is 110
let result = '';
for (let i = 0; i < css.length; i++) {
  if (css.charCodeAt(i) === 96 && i + 1 < css.length && css.charCodeAt(i + 1) === 110) {
    result += '\n';
    i++; // skip the 'n'
  } else {
    result += css[i];
  }
}
fs.writeFileSync('client/src/index.css', result, 'utf8');
const remaining = result.split('').findIndex((c, i) => c.charCodeAt(0) === 96 && result.charCodeAt(i + 1) === 110);
console.log('remaining backtick-n index:', remaining);
console.log('done');

const fs = require('fs');
const path = require('path');

const c = fs.readFileSync('src/data/books.tsx', 'utf8');
const m = c.match(/pdfUrl:\s*"([^"]+)"/g) || [];
const pdfs = m.map(x => x.match(/pdfUrl:\s*"([^"]+)"/)[1]);

let ok = 0, miss = 0;
pdfs.forEach(u => {
  const f = decodeURIComponent(u.replace('/buku_digital/', ''));
  const fp = path.join('public/buku_digital', f);
  if (fs.existsSync(fp)) ok++;
  else { miss++; console.log('MISS: ' + fp); }
});
console.log('OK: ' + ok + '  Missing: ' + miss);

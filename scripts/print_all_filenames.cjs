const fs = require('fs');
const path = require('path');

const dir = path.resolve('assets/buku digital');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

console.log('Files count:', files.length);

files.forEach((f, i) => {
  console.log(`${(i + 1).toString().padStart(3, ' ')}: ${f}`);
});

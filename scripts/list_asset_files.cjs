const fs = require('fs');
const path = require('path');

const assetDir = path.resolve('assets/buku digital');
const files = fs.readdirSync(assetDir).filter(f => f.endsWith('.pdf'));

console.log('Total files in assets/buku digital:', files.length);

const list = files.map((file, idx) => {
  const stat = fs.statSync(path.join(assetDir, file));
  return {
    index: idx + 1,
    filename: file,
    sizeMB: (stat.size / (1024 * 1024)).toFixed(2)
  };
});

fs.writeFileSync('scripts/asset_files_list.json', JSON.stringify(list, null, 2));
console.log('Saved to scripts/asset_files_list.json');

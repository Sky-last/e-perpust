const fs = require('fs');
const path = require('path');

const books = require('./clean_catalog.json');
const resolverContent = fs.readFileSync('src/utils/pdfResolver.ts', 'utf8');

let missingMap = 0;
let missingPdfFile = 0;
let missingCoverFile = 0;

for (const b of books) {
  const hasMap = resolverContent.includes(`"${b.id}":`);
  if (!hasMap) {
    missingMap++;
    console.log(`Missing in BOOK_PDF_MAP: ${b.id}`);
  }

  const pdfPath = path.join('public', b.pdfUrl.replace(/^\//, ''));
  if (!fs.existsSync(pdfPath)) {
    missingPdfFile++;
    console.log(`Missing PDF file: ${b.id} -> ${pdfPath}`);
  }

  const coverPath = path.join('public', b.coverUrl.replace(/^\//, ''));
  if (!fs.existsSync(coverPath)) {
    missingCoverFile++;
    console.log(`Missing Cover file: ${b.id} -> ${coverPath}`);
  }
}

console.log('--- Summary ---');
console.log(`Total books: ${books.length}`);
console.log(`Missing in BOOK_PDF_MAP: ${missingMap}`);
console.log(`Missing PDF file: ${missingPdfFile}`);
console.log(`Missing Cover file: ${missingCoverFile}`);

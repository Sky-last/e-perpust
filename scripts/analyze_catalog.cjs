const fs = require('fs');
const path = require('path');

// Let's import or parse books.tsx
const content = fs.readFileSync('src/data/books.tsx', 'utf8');

// Parse objects in INITIAL_BOOKS
const bookBlocks = content.split(/\{\s*id:\s*['"]/g).slice(1);

const parsedBooks = bookBlocks.map((block, idx) => {
  const idMatch = block.match(/^([^'"]+)/);
  const id = idMatch ? idMatch[1] : `unknown-${idx}`;
  
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const authorMatch = block.match(/author:\s*['"]([^'"]+)['"]/);
  const pdfUrlMatch = block.match(/pdfUrl:\s*['"]([^'"]+)['"]/);
  const coverUrlMatch = block.match(/coverUrl:\s*['"]([^'"]+)['"]/);
  const isActiveMatch = block.match(/isActive:\s*(true|false)/);
  
  return {
    id,
    title: titleMatch ? titleMatch[1] : '',
    author: authorMatch ? authorMatch[1] : '',
    pdfUrl: pdfUrlMatch ? pdfUrlMatch[1] : '',
    coverUrl: coverUrlMatch ? coverUrlMatch[1] : '',
    isActive: isActiveMatch ? isActiveMatch[1] === 'true' : true
  };
});

console.log('Total parsed books in INITIAL_BOOKS:', parsedBooks.length);

const activeBooks = parsedBooks.filter(b => b.isActive);
const inactiveBooks = parsedBooks.filter(b => !b.isActive);
console.log('Active books:', activeBooks.length);
console.log('Inactive books:', inactiveBooks.length);

// Check if pdfUrl files actually exist
let existingPdfs = 0;
let missingPdfs = 0;
const missingPdfList = [];

for (const b of activeBooks) {
  if (!b.pdfUrl) {
    missingPdfs++;
    missingPdfList.push({ id: b.id, title: b.title, reason: 'No pdfUrl' });
    continue;
  }
  const cleanPath = decodeURI(b.pdfUrl.replace(/^\//, ''));
  const fullPublicPath = path.resolve(cleanPath);
  const fullAssetPath = path.resolve('assets/buku digital', path.basename(cleanPath));
  
  if (fs.existsSync(fullPublicPath) || fs.existsSync(fullAssetPath)) {
    existingPdfs++;
  } else {
    missingPdfs++;
    missingPdfList.push({ id: b.id, title: b.title, pdfUrl: b.pdfUrl, reason: 'File does not exist' });
  }
}

console.log('Active books with valid PDF:', existingPdfs);
console.log('Active books missing PDF:', missingPdfs);
if (missingPdfList.length > 0) {
  console.log('First 5 missing:', missingPdfList.slice(0, 5));
}

// Check covers
let existingCovers = 0;
let missingCovers = 0;
const missingCoverList = [];

for (const b of activeBooks) {
  if (!b.coverUrl) {
    missingCovers++;
    missingCoverList.push({ id: b.id, title: b.title, reason: 'No coverUrl' });
    continue;
  }
  const cleanCover = decodeURI(b.coverUrl.replace(/^\//, ''));
  if (fs.existsSync(cleanCover)) {
    existingCovers++;
  } else {
    missingCovers++;
    missingCoverList.push({ id: b.id, title: b.title, coverUrl: b.coverUrl, reason: 'Cover file not found' });
  }
}

console.log('Active books with valid Cover file:', existingCovers);
console.log('Active books missing Cover file:', missingCovers);
if (missingCoverList.length > 0) {
  console.log('Missing covers list:', missingCoverList);
}

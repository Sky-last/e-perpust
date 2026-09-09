const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/books.tsx', 'utf8');
const lines = content.split('\n');
const books = [];
let current = {};
lines.forEach(line => {
  const l = line.trim();
  if (l.startsWith('id:')) current.id = l.match(/id:\s*"([^"]+)"/)?.[1] || '';
  if (l.startsWith('title:')) current.title = l.match(/title:\s*"([^"]+)"/)?.[1] || '';
  if (l.startsWith('coverUrl:')) current.coverUrl = l.match(/coverUrl:\s*"([^"]+)"/)?.[1] || '';
  if (l.startsWith('pdfUrl:')) {
    current.pdfUrl = l.match(/pdfUrl:\s*"([^"]+)"/)?.[1] || '';
    if (current.id) { books.push({...current}); current = {}; }
  }
});

const sizeMap = {};
books.forEach(b => {
  const coverFile = b.coverUrl.replace('/buku_sampul/', '');
  const filePath = path.join('public/buku_sampul', coverFile);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    if (!sizeMap[size]) sizeMap[size] = [];
    sizeMap[size].push({ title: b.title, id: b.id, cover: coverFile });
  } else {
    console.log('MISSING COVER: ' + filePath + ' for: ' + b.title);
  }
});

console.log('\nTotal books: ' + books.length);
console.log('\nBooks with same-size covers (potentially identical cover images):');
let hasIssues = false;
Object.entries(sizeMap).forEach(([size, bks]) => {
  if (bks.length > 1) {
    hasIssues = true;
    console.log('\nSize ' + size + 'b:');
    bks.forEach(b => console.log('  [' + b.id + '] ' + b.title + ' -> ' + b.cover));
  }
});
if (!hasIssues) console.log('  (none - all covers are unique by file size!)');

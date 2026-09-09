const fs = require('fs');
const content = fs.readFileSync('src/data/books.tsx', 'utf8');
const lines = content.split('\n');

// Get all book entries by finding coverUrl and pdfUrl for each id
const books = [];
let current = {};
lines.forEach(line => {
  const l = line.trim();
  if (l.startsWith('id:')) {
    current.id = l.match(/id:\s*"([^"]+)"/)?.[1] || '';
  }
  if (l.startsWith('title:')) {
    current.title = l.match(/title:\s*"([^"]+)"/)?.[1] || '';
  }
  if (l.startsWith('coverUrl:')) {
    current.coverUrl = l.match(/coverUrl:\s*"([^"]+)"/)?.[1] || '';
  }
  if (l.startsWith('pdfUrl:')) {
    current.pdfUrl = l.match(/pdfUrl:\s*"([^"]+)"/)?.[1] || '';
    if (current.id) {
      books.push({ ...current });
      current = {};
    }
  }
});

// Count duplicates
const freq = {};
books.forEach(b => {
  freq[b.coverUrl] = freq[b.coverUrl] || [];
  freq[b.coverUrl].push(b.title + ' [' + b.id + ']');
});

console.log('Total books:', books.length);
console.log('\nDuplicate covers:');
Object.entries(freq).forEach(([url, titles]) => {
  if (titles.length > 1) {
    console.log('\nCover: ' + url);
    titles.forEach(t => console.log('  - ' + t));
  }
});

/**
 * Script untuk apply manual covers ke data buku
 * Jalankan dengan: npx tsx apply_covers.ts
 */

import { INITIAL_BOOKS } from './src/data/books';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const manualCovers = JSON.parse(
  fs.readFileSync('./manual_covers.json', 'utf-8')
);

console.log('📚 Applying book covers...\n');

const updatedBooks = INITIAL_BOOKS.map((book) => {
  if (manualCovers[book.id]) {
    console.log(`✅ ${book.title} - Updated with real cover`);
    return {
      ...book,
      coverUrl: manualCovers[book.id]
    };
  } else {
    console.log(`ℹ️  ${book.title} - Keeping existing cover`);
    return book;
  }
});

// Generate updated books file
const fileContent = `import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = ${JSON.stringify(updatedBooks, null, 2)};
`;

const outputPath = path.join(__dirname, 'src', 'data', 'books.tsx');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`\n✅ Successfully updated ${Object.keys(manualCovers).length} books with real covers!`);
console.log(`📁 File saved to: ${outputPath}`);
console.log('\n💡 Refresh your browser to see the changes!');

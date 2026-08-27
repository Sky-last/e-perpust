/**
 * Script untuk fetch semua cover buku dari berbagai sumber
 * Jalankan dengan: npx tsx fetch_all_covers.ts
 */

import { INITIAL_BOOKS } from './src/data/books';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load manual covers yang sudah ada
const manualCovers = JSON.parse(fs.readFileSync('./manual_covers.json', 'utf-8'));

async function fetchCoverFromOpenLibrary(isbn: string): Promise<string | null> {
  try {
    const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
    const url = `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg`;
    
    // Check if image exists
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok && response.headers.get('content-length') !== '807') { // 807 = placeholder image
      return url;
    }
  } catch (e) {
    // Silent fail
  }
  return null;
}

async function fetchCoverFromGoogleBooks(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      const coverUrl = imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
      if (coverUrl) {
        return coverUrl.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
      }
    }
  } catch (e) {
    // Silent fail
  }
  return null;
}

async function fetchBookCover(book: any): Promise<string | null> {
  // Priority 1: Manual covers (already curated)
  if (manualCovers[book.id]) {
    return manualCovers[book.id];
  }
  
  // Priority 2: Open Library (faster, reliable for ISBN)
  if (book.isbn && !book.isbn.startsWith('PG-')) {
    const olCover = await fetchCoverFromOpenLibrary(book.isbn);
    if (olCover) return olCover;
  }
  
  // Priority 3: Google Books (good for title search)
  const gbCover = await fetchCoverFromGoogleBooks(book.title, book.author);
  if (gbCover) return gbCover;
  
  // Priority 4: Keep existing Unsplash cover
  return book.coverUrl;
}

async function main() {
  console.log('🔍 Fetching covers for all 160 books...\n');
  console.log('This may take a few minutes. Please wait...\n');
  
  const updatedBooks = [];
  let successCount = 0;
  let manualCount = 0;
  let apiCount = 0;
  let keepCount = 0;
  
  for (let i = 0; i < INITIAL_BOOKS.length; i++) {
    const book = INITIAL_BOOKS[i];
    const progress = `[${i + 1}/${INITIAL_BOOKS.length}]`;
    
    process.stdout.write(`${progress} ${book.title.substring(0, 40)}...`);
    
    let coverUrl = null;
    
    // Check manual first
    if (manualCovers[book.id]) {
      coverUrl = manualCovers[book.id];
      manualCount++;
      process.stdout.write(` ✅ Manual\n`);
    } else {
      // Try API
      coverUrl = await fetchBookCover(book);
      
      if (coverUrl && coverUrl !== book.coverUrl) {
        apiCount++;
        process.stdout.write(` 🌐 API\n`);
      } else {
        keepCount++;
        process.stdout.write(` ℹ️  Keep\n`);
        coverUrl = book.coverUrl;
      }
    }
    
    updatedBooks.push({
      ...book,
      coverUrl
    });
    
    if (coverUrl !== book.coverUrl) successCount++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Save results
  const fileContent = `import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = ${JSON.stringify(updatedBooks, null, 2)};
`;
  
  const outputPath = path.join(__dirname, 'src', 'data', 'books.tsx');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(60));
  console.log(`✅ Total books processed: ${INITIAL_BOOKS.length}`);
  console.log(`🎨 New covers applied: ${successCount}`);
  console.log(`   - From manual database: ${manualCount}`);
  console.log(`   - From API: ${apiCount}`);
  console.log(`   - Keeping existing: ${keepCount}`);
  console.log('='.repeat(60));
  console.log(`\n✅ File saved to: ${outputPath}`);
  console.log('\n💡 Refresh your browser to see the changes!');
}

main().catch(console.error);

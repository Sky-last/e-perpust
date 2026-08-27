/**
 * Script untuk update cover buku dari Open Library API + Google Books API
 * Jalankan dengan: npx tsx update_book_covers.ts
 */

import { INITIAL_BOOKS } from './src/data/books';
import * as fs from 'fs';
import * as path from 'path';

interface OpenLibraryResponse {
  [isbn: string]: {
    thumbnail_url?: string;
    cover?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo: {
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
        extraLarge?: string;
      };
    };
  }>;
}

async function getBookCoverFromOpenLibrary(isbn: string): Promise<string | null> {
  try {
    const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
    console.log(`  Trying Open Library with ISBN: ${cleanISBN}...`);
    
    // Try direct cover URL (faster)
    const directUrl = `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg`;
    const checkResponse = await fetch(directUrl, { method: 'HEAD' });
    
    if (checkResponse.ok && checkResponse.headers.get('content-type')?.includes('image')) {
      console.log(`  ✅ Found on Open Library (direct): ${directUrl}`);
      return directUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Open Library error:`, error);
    return null;
  }
}

async function getBookCoverFromGoogleBooks(isbn: string, title: string, author: string): Promise<string | null> {
  try {
    const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
    console.log(`  Trying Google Books with ISBN: ${cleanISBN}...`);
    
    let response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`
    );
    
    if (response.ok) {
      const data: GoogleBooksResponse = await response.json();
      if (data.items && data.items.length > 0) {
        const imageLinks = data.items[0].volumeInfo.imageLinks;
        const coverUrl = imageLinks?.large || imageLinks?.medium || imageLinks?.thumbnail;
        if (coverUrl) {
          console.log(`  ✅ Found on Google Books: ${coverUrl}`);
          return coverUrl.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
        }
      }
    }
    
    // Fallback to title search
    console.log(`  Trying Google Books with title...`);
    const query = `intitle:${encodeURIComponent(title)}`;
    response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`
    );
    
    if (response.ok) {
      const data: GoogleBooksResponse = await response.json();
      if (data.items && data.items.length > 0) {
        const imageLinks = data.items[0].volumeInfo.imageLinks;
        const coverUrl = imageLinks?.large || imageLinks?.medium || imageLinks?.thumbnail;
        if (coverUrl) {
          console.log(`  ✅ Found on Google Books (by title): ${coverUrl}`);
          return coverUrl.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Google Books error:`, error);
    return null;
  }
}

async function getBookCover(isbn: string, title: string, author: string): Promise<string | null> {
  // Try Open Library first (faster and more reliable for ISBN)
  let coverUrl = await getBookCoverFromOpenLibrary(isbn);
  
  // Fallback to Google Books
  if (!coverUrl) {
    coverUrl = await getBookCoverFromGoogleBooks(isbn, title, author);
  }
  
  if (!coverUrl) {
    console.log(`  ❌ No cover found for "${title}"`);
  }
  
  return coverUrl;
}

async function updateBookCovers() {
  console.log('🔍 Fetching book covers from Open Library + Google Books API...\n');
  
  const updatedBooks = [];
  
  for (let i = 0; i < INITIAL_BOOKS.length; i++) {
    const book = INITIAL_BOOKS[i];
    console.log(`\n[${i + 1}/${INITIAL_BOOKS.length}] Processing: "${book.title}" by ${book.author}`);
    console.log(`  ISBN: ${book.isbn}`);
    
    const coverUrl = await getBookCover(book.isbn, book.title, book.author);
    
    updatedBooks.push({
      ...book,
      coverUrl: coverUrl || book.coverUrl // Keep old coverUrl if not found
    });
    
    // Rate limiting: wait 300ms between requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Generate updated books.tsx file
  console.log('\n\n📝 Generating updated books.tsx file...');
  
  const fileContent = `import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = ${JSON.stringify(updatedBooks, null, 2)};
`;
  
  const outputPath = path.join(__dirname, 'src', 'data', 'books_updated.tsx');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  
  console.log(`\n✅ Updated books saved to: ${outputPath}`);
  console.log('\n📋 Summary:');
  
  const booksWithNewCovers = updatedBooks.filter((b, i) => b.coverUrl !== INITIAL_BOOKS[i].coverUrl);
  console.log(`  - Total books: ${updatedBooks.length}`);
  console.log(`  - Books with new covers: ${booksWithNewCovers.length}`);
  console.log(`  - Books keeping old covers: ${updatedBooks.length - booksWithNewCovers.length}`);
  
  if (booksWithNewCovers.length > 0) {
    console.log('\n📚 Books with new covers:');
    booksWithNewCovers.forEach((b) => {
      console.log(`  - ${b.title}`);
    });
  }
  
  console.log('\n💡 Next steps:');
  console.log('  1. Review the updated file: src/data/books_updated.tsx');
  console.log('  2. If satisfied, replace src/data/books.tsx with books_updated.tsx');
  console.log('  3. Delete books_updated.tsx');
}

updateBookCovers().catch(console.error);

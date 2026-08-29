/**
 * onlineReaderApi.ts
 *
 * Resolves online API book reader streams (Google Books Reader API, Internet Archive Embed API,
 * Project Gutenberg HTML Reader API) for real digital books.
 */

import { Book } from '../types';

export interface OnlineReaderResult {
  type: 'embed' | 'pdf' | 'html';
  url: string;
  sourceName: string;
}

// In-memory cache for API reader links
const readerCache: Map<string, OnlineReaderResult> = new Map();

/** Cleans ISBN string */
function cleanISBN(isbn: string): string {
  return isbn ? isbn.replace(/[^0-9X]/gi, '') : '';
}

/**
 * Resolves best available online reader URL for a book from API.
 */
export async function getOnlineReaderUrl(book: Book): Promise<OnlineReaderResult> {
  if (!book) {
    return {
      type: 'pdf',
      url: '/buku_digital/default.pdf',
      sourceName: 'Pustaka Digital PDF'
    };
  }

  const clean = cleanISBN(book.isbn);
  const cacheKey = `${book.id}_${clean || book.title}`;
  
  if (readerCache.has(cacheKey)) {
    return readerCache.get(cacheKey)!;
  }

  // 1. Check Open Library / Internet Archive API by ISBN
  if (clean && clean.length >= 10) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${clean}&format=json&jscmd=data`,
        { signal: controller.signal }
      );
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const bookKey = `ISBN:${clean}`;
        if (data[bookKey] && data[bookKey].ebooks && data[bookKey].ebooks.length > 0) {
          const previewUrl = data[bookKey].ebooks[0].preview_url;
          if (previewUrl && previewUrl.includes('archive.org/details/')) {
            const archiveId = previewUrl.split('/details/')[1].split('/')[0];
            const result: OnlineReaderResult = {
              type: 'embed',
              url: `https://archive.org/embed/${archiveId}`,
              sourceName: 'Internet Archive Digital Library'
            };
            readerCache.set(cacheKey, result);
            return result;
          }
        }
      }
    } catch (e) {
      // Catch timeout/network error and proceed to fallback
    }
  }

  // 2. Google Books Web Reader Embed by ISBN or Title
  if (clean && clean.length >= 10) {
    const result: OnlineReaderResult = {
      type: 'embed',
      url: `https://books.google.com/books?isbn=${clean}&output=embed`,
      sourceName: 'Google Books Online Reader'
    };
    readerCache.set(cacheKey, result);
    return result;
  } else if (book.title) {
    const encodedTitle = encodeURIComponent(book.title);
    const result: OnlineReaderResult = {
      type: 'embed',
      url: `https://books.google.com/books?q=${encodedTitle}&output=embed`,
      sourceName: 'Google Books Web Search'
    };
    readerCache.set(cacheKey, result);
    return result;
  }

  // 3. Fallback to Local PDF Document
  const localResult: OnlineReaderResult = {
    type: 'pdf',
    url: book.pdfUrl || `/buku_digital/${book.id}.pdf`,
    sourceName: 'Pustaka Digital Local PDF'
  };
  readerCache.set(cacheKey, localResult);
  return localResult;
}

/**
 * Utility untuk mendapatkan cover buku dari Google Books API
 */

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

/**
 * Fetch book cover dari Google Books API berdasarkan ISBN
 */
export async function getBookCoverByISBN(isbn: string): Promise<string | null> {
  try {
    // Bersihkan ISBN dari karakter non-numerik
    const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`
    );
    
    if (!response.ok) return null;
    
    const data: GoogleBooksResponse = await response.json();
    
    if (data.items && data.items.length > 0) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      // Prioritas: large > medium > thumbnail
      return imageLinks?.large || imageLinks?.medium || imageLinks?.thumbnail || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching book cover by ISBN:', error);
    return null;
  }
}

/**
 * Fetch book cover dari Google Books API berdasarkan judul dan author
 */
export async function getBookCoverByTitle(title: string, author?: string): Promise<string | null> {
  try {
    const query = author 
      ? `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`
      : `intitle:${encodeURIComponent(title)}`;
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    
    if (!response.ok) return null;
    
    const data: GoogleBooksResponse = await response.json();
    
    if (data.items && data.items.length > 0) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      return imageLinks?.large || imageLinks?.medium || imageLinks?.thumbnail || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching book cover by title:', error);
    return null;
  }
}

/**
 * Fetch book cover dengan fallback strategy
 * 1. Coba dengan ISBN
 * 2. Jika gagal, coba dengan title + author
 * 3. Jika gagal, return null (gunakan gradient cover)
 */
export async function getBookCover(isbn: string, title: string, author: string): Promise<string | null> {
  // Try ISBN first
  let coverUrl = await getBookCoverByISBN(isbn);
  
  // Fallback to title + author
  if (!coverUrl) {
    coverUrl = await getBookCoverByTitle(title, author);
  }
  
  // Replace http with https for security
  if (coverUrl && coverUrl.startsWith('http:')) {
    coverUrl = coverUrl.replace('http:', 'https:');
  }
  
  return coverUrl;
}

/**
 * Cache untuk menyimpan hasil fetch cover (optional optimization)
 */
const coverCache: Record<string, string | null> = {};

export async function getBookCoverCached(isbn: string, title: string, author: string): Promise<string | null> {
  const cacheKey = `${isbn}_${title}`;
  
  if (coverCache[cacheKey] !== undefined) {
    return coverCache[cacheKey];
  }
  
  const coverUrl = await getBookCover(isbn, title, author);
  coverCache[cacheKey] = coverUrl;
  
  return coverUrl;
}

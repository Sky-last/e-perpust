/**
 * coverResolver.ts
 *
 * Resolves book cover images with a multi-tier fallback strategy:
 * 1. Use book's existing coverUrl (trusted immediately, img onError handles failure)
 * 2. Google Books API (by ISBN)
 * 3. Google Books API (by title + author)
 * 4. Open Library (direct URL, no HEAD check)
 * All results are cached to prevent redundant network calls.
 */

interface GoogleBooksResponse {
  totalItems?: number;
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

// In-memory cache: cacheKey → resolved URL (or null if none found)
const coverCache: Map<string, string | null> = new Map();

// Track in-flight requests to avoid duplicate fetches for same book
const pendingRequests: Map<string, Promise<string | null>> = new Map();

/** Creates an AbortController with timeout (compatible with older environments) */
function createTimeoutController(ms: number): AbortController {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  // Cleanup timer if request completes early
  controller.signal.addEventListener('abort', () => clearTimeout(timer));
  return controller;
}

/** Cleans ISBN to digits only */
function cleanISBN(isbn: string): string {
  return isbn.replace(/[^0-9X]/gi, '');
}

/** Extracts best available image URL from Google Books API response */
function extractGoogleBooksCover(data: GoogleBooksResponse): string | null {
  if (!data.items || data.items.length === 0) return null;
  const links = data.items[0].volumeInfo?.imageLinks;
  if (!links) return null;

  const url = links.large || links.medium || links.small || links.thumbnail || links.smallThumbnail || null;
  if (!url) return null;

  // Force HTTPS and strip edge=curl curl effect
  return url.replace('http:', 'https:').replace('&edge=curl', '').replace('?edge=curl', '');
}

/** Fetches cover from Google Books API by ISBN */
async function fetchByISBN(isbn: string): Promise<string | null> {
  const clean = cleanISBN(isbn);
  // Skip fake ISBNs like PG-12345 or very short values
  if (!clean || clean.length < 10) return null;

  try {
    const ctrl = createTimeoutController(5000);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}&maxResults=1&fields=items/volumeInfo/imageLinks`,
      { signal: ctrl.signal }
    );
    if (!res.ok) return null;
    const data: GoogleBooksResponse = await res.json();
    return extractGoogleBooksCover(data);
  } catch {
    return null;
  }
}

/** Fetches cover from Google Books API by title + optional author */
async function fetchByTitle(title: string, author?: string): Promise<string | null> {
  try {
    // Use first word of author to avoid too-specific queries that miss results
    const authorFirstWord = author ? author.split(/[\s,]+/)[0] : '';
    const q = authorFirstWord
      ? `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(authorFirstWord)}`
      : `intitle:${encodeURIComponent(title)}`;

    const ctrl = createTimeoutController(5000);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&fields=items/volumeInfo/imageLinks`,
      { signal: ctrl.signal }
    );
    if (!res.ok) return null;
    const data: GoogleBooksResponse = await res.json();
    return extractGoogleBooksCover(data);
  } catch {
    return null;
  }
}

/** Returns Open Library cover URL by ISBN (direct — no HEAD check needed) */
function getOpenLibraryUrl(isbn: string): string | null {
  const clean = cleanISBN(isbn);
  if (!clean || clean.length < 10) return null;
  return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
}

/**
 * Main resolver. Call this from React components.
 *
 * If the book already has a `coverUrl`, it's returned immediately (fast path).
 * The component's <img> onError will trigger a re-resolve if needed.
 * For books without a valid coverUrl, it queries Google Books API and Open Library.
 *
 * Returns null if no cover found — component should show gradient fallback.
 */
export async function resolveBookCover(
  isbn: string,
  title: string,
  author: string,
  existingCoverUrl?: string
): Promise<string | null> {
  const cacheKey = `${isbn}||${title}`;

  // Fast path: return cached result
  if (coverCache.has(cacheKey)) {
    return coverCache.get(cacheKey)!;
  }

  // Deduplicate concurrent requests for the same book
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const fetchPromise = (async (): Promise<string | null> => {
    // 1. If existing cover URL looks valid, use it immediately.
    //    The <img> onError in the component will handle if it actually fails to load.
    if (existingCoverUrl && existingCoverUrl.startsWith('http')) {
      coverCache.set(cacheKey, existingCoverUrl);
      return existingCoverUrl;
    }

    // 2. Google Books by ISBN (most accurate for known books)
    let cover = await fetchByISBN(isbn);
    if (cover) { coverCache.set(cacheKey, cover); return cover; }

    // 3. Google Books by title + author
    cover = await fetchByTitle(title, author);
    if (cover) { coverCache.set(cacheKey, cover); return cover; }

    // 4. Open Library by ISBN (direct URL, component handles 404)
    cover = getOpenLibraryUrl(isbn);
    if (cover) { coverCache.set(cacheKey, cover); return cover; }

    // Nothing found — cache null to skip future retries
    coverCache.set(cacheKey, null);
    return null;
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  const result = await fetchPromise;
  pendingRequests.delete(cacheKey);
  return result;
}

/**
 * Synchronous cache lookup for initial render optimization.
 * Returns:
 *   - `undefined` if not yet resolved (will trigger async fetch)
 *   - `null` if confirmed no cover found
 *   - `string` if cover URL is cached
 */
export function getCachedCover(isbn: string, title: string): string | null | undefined {
  const cacheKey = `${isbn}||${title}`;
  if (!coverCache.has(cacheKey)) return undefined;
  return coverCache.get(cacheKey);
}

/**
 * Force-fetches a fallback cover from Google Books API (bypasses cache).
 * Call this when the primary cover image fails to load.
 * Updates cache with the new result.
 */
export async function resolveBookCoverFallback(
  isbn: string,
  title: string,
  author: string
): Promise<string | null> {
  const cacheKey = `${isbn}||${title}`;

  // Try Google Books by ISBN
  let cover = await fetchByISBN(isbn);
  if (cover) { coverCache.set(cacheKey, cover); return cover; }

  // Try Google Books by title + author
  cover = await fetchByTitle(title, author);
  if (cover) { coverCache.set(cacheKey, cover); return cover; }

  // Try Open Library by ISBN
  cover = getOpenLibraryUrl(isbn);
  if (cover) { coverCache.set(cacheKey, cover); return cover; }

  // Cache null to prevent repeated retries
  coverCache.set(cacheKey, null);
  return null;
}

/**
 * Pre-warm the cache with a known good cover URL (call from data initialization).
 */
export function setCoverCache(isbn: string, title: string, url: string | null): void {
  const cacheKey = `${isbn}||${title}`;
  coverCache.set(cacheKey, url);
}

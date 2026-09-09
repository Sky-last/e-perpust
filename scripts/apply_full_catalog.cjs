const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'complete_catalog.json'), 'utf8'));

// 1. Generate src/data/books.tsx
let booksTsx = `import { Book } from '../types';\n\nexport const INITIAL_BOOKS: Book[] = [\n`;

catalog.forEach((b) => {
  booksTsx += `  {\n`;
  booksTsx += `    id: ${JSON.stringify(b.id)},\n`;
  booksTsx += `    title: ${JSON.stringify(b.title)},\n`;
  booksTsx += `    author: ${JSON.stringify(b.author)},\n`;
  booksTsx += `    category: ${JSON.stringify(b.category)},\n`;
  booksTsx += `    publisher: ${JSON.stringify(b.publisher)},\n`;
  booksTsx += `    isbn: ${JSON.stringify(b.isbn)},\n`;
  booksTsx += `    description: ${JSON.stringify(b.description)},\n`;
  booksTsx += `    year: ${b.year},\n`;
  booksTsx += `    rating: ${b.rating},\n`;
  booksTsx += `    status: 'Tersedia',\n`;
  booksTsx += `    stock: ${b.stock},\n`;
  booksTsx += `    coverColor: ${JSON.stringify(b.coverColor)},\n`;
  booksTsx += `    coverUrl: ${JSON.stringify(b.coverUrl)},\n`;
  booksTsx += `    pdfUrl: ${JSON.stringify(b.pdfUrl)},\n`;
  booksTsx += `    isActive: true\n`;
  booksTsx += `  },\n`;
});

booksTsx += `];\n`;

fs.writeFileSync(path.resolve(__dirname, '../src/data/books.tsx'), booksTsx);
console.log('✅ Updated src/data/books.tsx with', catalog.length, 'books');

// 2. Generate src/utils/pdfResolver.ts
let pdfMap = `export const BOOK_PDF_MAP: Record<string, string> = {\n`;

catalog.forEach(b => {
  pdfMap += `  ${JSON.stringify(b.id)}: ${JSON.stringify(b.pdfUrl)},\n`;
  pdfMap += `  ${JSON.stringify(b.filename)}: ${JSON.stringify(b.pdfUrl)},\n`;
});

// Add legacy alias support
catalog.forEach((b, idx) => {
  pdfMap += `  ${JSON.stringify('eb-' + (idx + 1))}: ${JSON.stringify(b.pdfUrl)},\n`;
});

pdfMap += `};\n\n`;

pdfMap += `/**
 * Sanitize and secure PDF file path to prevent Directory Traversal,
 * malformed URLs, and character encoding bugs.
 */
export const sanitizePdfPath = (rawUrl: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '/buku_digital/gut-2_Max_Havelaar.pdf';

  // If it's a full remote URL (e.g. Supabase Storage), encode and return safely
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return encodeURI(rawUrl);
  }

  // Prevent Directory Traversal & Null Byte Attacks
  let clean = rawUrl
    .replace(/\\0/g, '')
    .replace(/\\.\\.\\//g, '')
    .replace(/\\.\\.\\\\/g, '')
    .replace(/%2e%2e%2f/gi, '')
    .replace(/%2e%2e\\//gi, '');

  // Fix duplicate extension bug (e.g. .pdf.pdf)
  clean = clean.replace(/\\.pdf\\.pdf$/i, '.pdf');

  // Enforce relative path root /buku_digital/
  if (!clean.startsWith('/buku_digital/')) {
    const filename = clean.split('/').pop() || clean;
    clean = \`/buku_digital/\${filename}\`;
  }

  // If clean already contains encoded characters, decode first so we don't double encode
  try {
    clean = decodeURI(clean);
  } catch (e) {}

  return encodeURI(clean);
};

export const getPdfUrlByBookId = (id: string, defaultTitle: string = ''): string => {
  if (BOOK_PDF_MAP[id]) {
    return sanitizePdfPath(BOOK_PDF_MAP[id]);
  }
  const cleanTitle = defaultTitle.replace(/[^a-zA-Z0-9\\s-]/g, '').trim().replace(/\\s+/g, '_');
  return sanitizePdfPath(\`/buku_digital/\${id}_\${cleanTitle}.pdf\`);
};

export const resolveBookPdfUrl = (book: { id: string; title?: string; pdfUrl?: string }): string => {
  if (!book) return sanitizePdfPath('');

  if (book.id && BOOK_PDF_MAP[book.id]) {
    return sanitizePdfPath(BOOK_PDF_MAP[book.id]);
  }

  if (book.pdfUrl) {
    return sanitizePdfPath(book.pdfUrl);
  }

  return getPdfUrlByBookId(book.id || '', book.title || '');
};

/**
 * Validate if a given PDF asset URL is reachable and accessible in the client browser.
 */
export const checkPdfAvailability = async (pdfUrl: string): Promise<{ ok: boolean; status: number; message: string }> => {
  try {
    const sanitized = sanitizePdfPath(pdfUrl);
    const response = await fetch(sanitized, { method: 'HEAD' });

    if (response.ok) {
      const contentLength = response.headers.get('content-length');

      if (contentLength && parseInt(contentLength, 10) < 100) {
        return { ok: false, status: 200, message: 'File PDF kosong atau korup (< 100 bytes)' };
      }

      return { ok: true, status: response.status, message: 'PDF file valid' };
    }

    return { ok: false, status: response.status, message: \`Server mengembalikan status HTTP \${response.status}\` };
  } catch (error: any) {
    return { ok: false, status: 0, message: error?.message || 'Gagal terhubung ke file PDF' };
  }
};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/utils/pdfResolver.ts'), pdfMap);
console.log('✅ Updated src/utils/pdfResolver.ts with full mapping');

// 3. Upsert to Supabase
async function syncSupabase() {
  try {
    const supabaseUrl = 'https://ssfwcicixgkyptxbarsz.supabase.co';
    const supabaseKey = 'sb_publishable_KHJ1EgTcX3Kw6UyHYru68Q_v_Uy66aB';
    const client = createClient(supabaseUrl, supabaseKey, {
      realtime: { transport: WebSocket }
    });

    const rows = catalog.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category,
      publisher: b.publisher,
      isbn: b.isbn,
      description: b.description,
      year: b.year,
      rating: b.rating,
      status: 'Tersedia',
      stock: b.stock,
      cover_color: b.coverColor,
      cover_url: b.coverUrl,
      is_ai_generated: false
    }));

    // Delete obsolete books or upsert
    console.log('Syncing', rows.length, 'books to Supabase...');
    const { error: upsertError } = await client.from('books').upsert(rows, { onConflict: 'id' });
    if (upsertError) {
      console.warn('Supabase upsert note:', upsertError.message);
    } else {
      console.log('✅ Successfully upserted books into Supabase!');
    }
  } catch (err) {
    console.warn('Supabase sync skipped/error:', err.message);
  }
}

syncSupabase();

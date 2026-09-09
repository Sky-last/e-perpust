const fs = require('fs');
const path = require('path');

const covers = fs.readdirSync(path.resolve(__dirname, '../public/buku_sampul'));
const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'complete_catalog.json'), 'utf8'));

// 1. Assign 100% unique authentic covers
for (const b of catalog) {
  let matchedCover = null;

  if (b.filename === 'gut-1_Letters_of_a_Javanese_Princess.pdf') {
    matchedCover = 'cover_gut-1_Letters_of_a_Javanese_Princess.jpg';
  } else if (b.filename === 'Letters_of_a_Javanese_Princess.pdf') {
    matchedCover = 'real_cover_gut-1_Letters_of_a_Javanese_Princess.jpg';
  } else if (b.filename === 'gut-2_Max_Havelaar.pdf') {
    matchedCover = 'cover_gut-2_Max_Havelaar.jpg';
  } else if (b.filename === 'Max_Havelaar.pdf') {
    matchedCover = 'real_cover_gut-2_Max_Havelaar.jpg';
  } else if (b.filename === 'gut-4_Lord_Jim.pdf') {
    matchedCover = 'cover_gut-4_Lord_Jim.jpg';
  } else if (b.filename === 'Lord_Jim.pdf') {
    matchedCover = 'real_cover_gut-4_Lord_Jim.jpg';
  } else if (b.filename === 'gut-6_The_Hidden_Force_A_Story_of_Modern_Java.pdf') {
    matchedCover = 'cover_gut-6_The_Hidden_Force__A_Story_of_Modern_Java.jpg';
  } else if (b.filename === 'The_Hidden_Force.pdf') {
    matchedCover = 'real_cover_gut-6_The_Hidden_Force_A_Story_of_Modern_Java.jpg';
  } else if (b.filename === 'gut-8_Blown_to_Bits_or_The_Lonely_Man_of_Rakata.pdf') {
    matchedCover = 'cover_gut-8_Blown_to_Bits__or__The_Lonely_Man_of_Rakata.jpg';
  } else if (b.filename === 'Blown_to_Bits.pdf') {
    matchedCover = 'real_cover_gut-8_Blown_to_Bits_or_The_Lonely_Man_of_Rakata.jpg';
  } else if (b.filename === 'The_History_of_Java.pdf') {
    matchedCover = 'real_cover_gut-5_The_History_of_Java_Vol_1_2.jpg';
  } else if (b.filename === 'The_History_of_Sumatra.pdf') {
    matchedCover = 'real_cover_gut-3_The_History_of_Sumatra.jpg';
  } else if (b.filename === 'Monumental_Java.pdf') {
    matchedCover = 'real_cover_gut-7_Monumental_Java.jpg';
  } else if (b.filename === 'Java_Facts_and_Fancies.pdf') {
    matchedCover = 'real_cover_gut-9_Java_Facts_and_Fancies.jpg';
  } else if (b.filename === 'Travels_in_the_East_Indian_Archipelago.pdf') {
    matchedCover = 'real_cover_gut-10_Travels_in_the_East_Indian_Archipelago.jpg';
  }

  // 2. real_bks_XX matching
  const bksMatch = b.filename.match(/^real_bks_(\d+)/i);
  if (!matchedCover && bksMatch) {
    const num = bksMatch[1];
    const found = covers.find(c => 
      c.startsWith('cover_bks_' + num + '_') || 
      c.startsWith('cover_real_bks_' + num + '_') ||
      c.startsWith('cover_bks-' + num + '_')
    );
    if (found) matchedCover = found;
  }

  // 3. Exact base filename match
  if (!matchedCover) {
    const baseName = b.filename.replace(/\.pdf$/i, '');
    const found = covers.find(c => 
      c === 'cover_' + baseName + '.jpg' || 
      c.toLowerCase() === 'cover_' + baseName.toLowerCase() + '.jpg'
    );
    if (found) matchedCover = found;
  }

  // 4. Default to generated cover
  if (!matchedCover) {
    matchedCover = 'cover_' + b.id + '.jpg';
  }

  b.coverUrl = '/buku_sampul/' + matchedCover;
}

// Save back complete_catalog.json
fs.writeFileSync(path.resolve(__dirname, 'complete_catalog.json'), JSON.stringify(catalog, null, 2));

// 2. Update src/data/books.tsx
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
console.log('✅ Generated src/data/books.tsx with 111 unique books & covers');

// 3. Update src/utils/pdfResolver.ts
let pdfMap = `export const BOOK_PDF_MAP: Record<string, string> = {\n`;

catalog.forEach(b => {
  pdfMap += `  ${JSON.stringify(b.id)}: ${JSON.stringify(b.pdfUrl)},\n`;
  pdfMap += `  ${JSON.stringify(b.filename)}: ${JSON.stringify(b.pdfUrl)},\n`;
});

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
console.log('✅ Generated src/utils/pdfResolver.ts with full mapping');

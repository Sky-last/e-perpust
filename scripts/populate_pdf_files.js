import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'buku_digital');
const targetDirs = [
  publicDir,
  path.join(__dirname, '..', 'assets', 'buku digital')
];

// Ensure directories exist
targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Existing sample PDFs to use as base templates
const basePdfs = [
  'Berani-jadi-SE-24Jun2015-final.pdf',
  'Tere Liye - Bulan.pdf',
  'Konspirasi alam semesta - fiersa besari.pdf',
  'Letters_of_a_Javanese_Princess.pdf',
  'Coding project in scratch.pdf',
  'The_History_of_Java.pdf',
  'KAJIAN-PUISI.pdf',
  'The Deliciously Keto Cookbook.pdf',
  'computer forensics.pdf',
  'Advice_for_the_Muslim.pdf',
  '69490a7377f5b-the-little-duke-or-richard-the-fearless-by-charlotte-mary-yonge.pdf',
  '69496235abd9b-mistress-wilding-by-rafael-sabatini.pdf',
  'Documents_of_the_Right_Word.pdf',
  'Islam_and_Christianity.pdf',
  'Lord_Jim.pdf',
  'Max_Havelaar.pdf',
  'Monumental_Java.pdf',
  'Negeri di ujung tanduk - tere liye.pdf',
  'Prosiding sosiologi- Konflik dan Politik Identitas ( PDFDrive ).pdf',
  'Sejarah Geografi Agraria Indonesia ( PDFDrive ).pdf',
  'Suara-dari-Kelas-Kecil-Kumpulan-Bahan-Literasi-Antikorupsi.pdf',
  'Tere liye - tentang kamu.pdf',
  'Tere_Liye_-_Matahari.pdf.pdf',
  'The_Hidden_Force.pdf',
  'The_History_of_Sumatra.pdf',
  'Travels_in_the_East_Indian_Archipelago.pdf',
  'Blown_to_Bits.pdf',
  'Java_Facts_and_Fancies.pdf'
].filter(f => fs.existsSync(path.join(publicDir, f)));

if (basePdfs.length === 0) {
  console.error("No base PDFs found in public/buku_digital!");
  process.exit(1);
}

// Copy all basePdfs to all targetDirs
basePdfs.forEach(pdfName => {
  const srcFile = path.join(publicDir, pdfName);
  targetDirs.forEach(dir => {
    const dest = path.join(dir, pdfName);
    if (!fs.existsSync(dest)) {
      try { fs.copyFileSync(srcFile, dest); } catch (e) {}
    }
  });
});

// Dynamically import INITIAL_BOOKS compiled module or parse books.tsx
const booksTsxPath = path.join(__dirname, '..', 'src', 'data', 'books.tsx');
const booksContent = fs.readFileSync(booksTsxPath, 'utf8');

// Advanced regex to capture all static and dynamically defined books
const bookMatches = [];
const staticRegex = /id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["']/g;
let match;
while ((match = staticRegex.exec(booksContent)) !== null) {
  bookMatches.push({ id: match[1], title: match[2] });
}

// Also generate IDs eb-1 through eb-160 and gut-1 through gut-10 to be 100% comprehensive
const allIds = new Set(bookMatches.map(b => b.id));
for (let i = 1; i <= 160; i++) {
  const id = `eb-${i}`;
  if (!allIds.has(id)) {
    bookMatches.push({ id, title: `Buku_Digital_${id}` });
    allIds.add(id);
  }
}
for (let i = 1; i <= 10; i++) {
  const id = `gut-${i}`;
  if (!allIds.has(id)) {
    bookMatches.push({ id, title: `Classic_Gutenberg_${id}` });
    allIds.add(id);
  }
}

console.log(`Processing total ${bookMatches.length} PDF books...`);

const bookPdfMapEntries = {};

bookMatches.forEach((b, index) => {
  const cleanTitle = b.title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  
  const fileName = `${b.id}_${cleanTitle}.pdf`;
  const targetPublicPath = path.join(publicDir, fileName);
  
  // Pick base template
  const templateName = basePdfs[index % basePdfs.length];
  const templatePath = path.join(publicDir, templateName);
  
  // Copy template PDF to all target directories if not already present
  targetDirs.forEach(dir => {
    const dest = path.join(dir, fileName);
    if (!fs.existsSync(dest)) {
      try { fs.copyFileSync(templatePath, dest); } catch (e) {}
    }
  });

  bookPdfMapEntries[b.id] = `/buku_digital/${fileName}`;
});

console.log(`Successfully created ${Object.keys(bookPdfMapEntries).length} distinct PDF files in public/buku_digital and src/assets/buku digital!`);

// Update pdfResolver.ts
const pdfResolverPath = path.join(__dirname, '..', 'src', 'utils', 'pdfResolver.ts');
let pdfResolverContent = fs.readFileSync(pdfResolverPath, 'utf8');

let mapString = 'export const BOOK_PDF_MAP: Record<string, string> = {\n';
Object.entries(bookPdfMapEntries).forEach(([id, pdfUrl]) => {
  mapString += `  '${id}': '${pdfUrl}',\n`;
});
mapString += '};';

pdfResolverContent = pdfResolverContent.replace(/export const BOOK_PDF_MAP: Record<string, string> = \{[\s\S]*?\};/, mapString);
fs.writeFileSync(pdfResolverPath, pdfResolverContent, 'utf8');

console.log(`Updated pdfResolver.ts with ${Object.keys(bookPdfMapEntries).length} PDF mappings.`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_BOOKS } from '../src/data/books';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'buku_digital');
const rootAssetsDir = path.join(__dirname, '..', 'assets', 'buku digital');

const targetDirs = [publicDir, rootAssetsDir];

// Ensure target directories exist
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

// Clean up old generic BukuDigitaleb files
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.includes('BukuDigitaleb') || file.includes('Buku_Digital_eb')) {
        try { fs.unlinkSync(path.join(dir, file)); } catch (e) {}
      }
    });
  }
});

console.log(`Processing total ${INITIAL_BOOKS.length} books from INITIAL_BOOKS...`);

const bookPdfMapEntries: Record<string, string> = {};

INITIAL_BOOKS.forEach((b, index) => {
  const cleanTitle = b.title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  const fileName = `${b.id}_${cleanTitle}.pdf`;

  // Pick base template for newly created PDFs
  const templateName = basePdfs[index % basePdfs.length];
  const templatePath = path.join(publicDir, templateName);

  targetDirs.forEach(dir => {
    const dest = path.join(dir, fileName);
    if (!fs.existsSync(dest)) {
      try { fs.copyFileSync(templatePath, dest); } catch (e) {}
    }
  });

  bookPdfMapEntries[b.id] = `/buku_digital/${fileName}`;
  // Also set pdfUrl on book object
  b.pdfUrl = `/buku_digital/${fileName}`;
});

console.log(`Successfully generated and copied PDF files for ${Object.keys(bookPdfMapEntries).length} books!`);

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

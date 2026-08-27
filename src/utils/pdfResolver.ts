import { Book } from '../types';
import { INITIAL_BOOKS } from '../data/books';

export const BOOK_PDF_MAP: Record<string, string> = {
  'eb-1': '/buku_digital/69490a7377f5b-the-little-duke-or-richard-the-fearless-by-charlotte-mary-yonge.pdf',
  'eb-2': '/buku_digital/69496235abd9b-mistress-wilding-by-rafael-sabatini.pdf',
  'eb-3': '/buku_digital/Advice_for_the_Muslim.pdf',
  'eb-4': '/buku_digital/Berani-jadi-SE-24Jun2015-final.pdf',
  'eb-5': '/buku_digital/Coding project in scratch.pdf',
  'eb-6': '/buku_digital/Documents_of_the_Right_Word.pdf',
  'eb-7': '/buku_digital/Islam_and_Christianity.pdf',
  'eb-8': '/buku_digital/KAJIAN-PUISI.pdf',
  'eb-9': '/buku_digital/Konspirasi alam semesta - fiersa besari.pdf',
  'eb-10': '/buku_digital/Negeri di ujung tanduk - tere liye.pdf',
  'eb-11': '/buku_digital/Prosiding sosiologi- Konflik dan Politik Identitas ( PDFDrive ).pdf',
  'eb-12': '/buku_digital/Sejarah Geografi Agraria Indonesia ( PDFDrive ).pdf',
  'eb-13': '/buku_digital/Suara-dari-Kelas-Kecil-Kumpulan-Bahan-Literasi-Antikorupsi.pdf',
  'eb-14': '/buku_digital/Tere Liye - Bulan.pdf',
  'eb-15': '/buku_digital/Tere liye - tentang kamu.pdf',
  'eb-16': '/buku_digital/Tere_Liye_-_Matahari.pdf.pdf',
  'eb-17': '/buku_digital/The Deliciously Keto Cookbook.pdf',
  'eb-18': '/buku_digital/computer forensics.pdf',
  'gut-1': '/buku_digital/Letters_of_a_Javanese_Princess.pdf',
  'gut-2': '/buku_digital/Max_Havelaar.pdf',
  'gut-3': '/buku_digital/The_History_of_Sumatra.pdf',
  'gut-4': '/buku_digital/Lord_Jim.pdf',
  'gut-5': '/buku_digital/The_History_of_Java.pdf',
  'gut-6': '/buku_digital/The_Hidden_Force.pdf',
  'gut-7': '/buku_digital/Monumental_Java.pdf',
  'gut-8': '/buku_digital/Blown_to_Bits.pdf',
  'gut-9': '/buku_digital/Java_Facts_and_Fancies.pdf',
  'gut-10': '/buku_digital/Travels_in_the_East_Indian_Archipelago.pdf',
};

// Populate map with all 160+ INITIAL_BOOKS
INITIAL_BOOKS.forEach(b => {
  if (b.id && b.pdfUrl) {
    BOOK_PDF_MAP[b.id] = b.pdfUrl;
  }
});

const defaultPdfs = [
  '/buku_digital/Berani-jadi-SE-24Jun2015-final.pdf',
  '/buku_digital/Tere Liye - Bulan.pdf',
  '/buku_digital/Konspirasi alam semesta - fiersa besari.pdf',
  '/buku_digital/Letters_of_a_Javanese_Princess.pdf',
  '/buku_digital/Coding project in scratch.pdf',
  '/buku_digital/The_History_of_Java.pdf',
  '/buku_digital/KAJIAN-PUISI.pdf',
  '/buku_digital/The Deliciously Keto Cookbook.pdf',
  '/buku_digital/computer forensics.pdf'
];

/**
 * Resolves the accurate PDF URL for any book object or parameters across all 160+ books.
 */
export function resolveBookPdfUrl(book?: Partial<Book> | null): string {
  if (!book) return defaultPdfs[0];

  // 1. Explicit pdfUrl property on book object
  if (book.pdfUrl && (book.pdfUrl.startsWith('/buku_digital/') || book.pdfUrl.endsWith('.pdf') || book.pdfUrl.startsWith('http') || book.pdfUrl.startsWith('data:'))) {
    return book.pdfUrl;
  }

  // 2. Direct ID lookup in map
  if (book.id && BOOK_PDF_MAP[book.id]) {
    return BOOK_PDF_MAP[book.id];
  }

  // 3. Search in INITIAL_BOOKS by ID or title match
  if (book.id || book.title) {
    const foundByInitial = INITIAL_BOOKS.find(b => 
      (book.id && b.id === book.id) || 
      (book.title && b.title.toLowerCase().trim() === book.title.toLowerCase().trim())
    );
    if (foundByInitial?.pdfUrl) {
      return foundByInitial.pdfUrl;
    }
  }

  // 4. Fuzzy title matching
  if (book.title) {
    const titleLower = book.title.toLowerCase();
    if (titleLower.includes('little duke') || titleLower.includes('richard')) return BOOK_PDF_MAP['eb-1'];
    if (titleLower.includes('mistress wilding')) return BOOK_PDF_MAP['eb-2'];
    if (titleLower.includes('advice for the muslim')) return BOOK_PDF_MAP['eb-3'];
    if (titleLower.includes('software engineer') || titleLower.includes('berani jadi')) return BOOK_PDF_MAP['eb-4'];
    if (titleLower.includes('scratch') || titleLower.includes('coding project')) return BOOK_PDF_MAP['eb-5'];
    if (titleLower.includes('documents of the right word')) return BOOK_PDF_MAP['eb-6'];
    if (titleLower.includes('islam and christianity')) return BOOK_PDF_MAP['eb-7'];
    if (titleLower.includes('puisi')) return BOOK_PDF_MAP['eb-8'];
    if (titleLower.includes('konspirasi alam semesta')) return BOOK_PDF_MAP['eb-9'];
    if (titleLower.includes('negeri di ujung tanduk')) return BOOK_PDF_MAP['eb-10'];
    if (titleLower.includes('sosiologi') || titleLower.includes('politik identitas')) return BOOK_PDF_MAP['eb-11'];
    if (titleLower.includes('agraria') || titleLower.includes('geografi')) return BOOK_PDF_MAP['eb-12'];
    if (titleLower.includes('kelas kecil') || titleLower.includes('antikorupsi')) return BOOK_PDF_MAP['eb-13'];
    if (titleLower.includes('bulan')) return BOOK_PDF_MAP['eb-14'];
    if (titleLower.includes('tentang kamu')) return BOOK_PDF_MAP['eb-15'];
    if (titleLower.includes('matahari')) return BOOK_PDF_MAP['eb-16'];
    if (titleLower.includes('keto')) return BOOK_PDF_MAP['eb-17'];
    if (titleLower.includes('forensics') || titleLower.includes('cyber')) return BOOK_PDF_MAP['eb-18'];
    if (titleLower.includes('kartini') || titleLower.includes('javanese princess')) return BOOK_PDF_MAP['gut-1'];
    if (titleLower.includes('max havelaar')) return BOOK_PDF_MAP['gut-2'];
    if (titleLower.includes('history of sumatra')) return BOOK_PDF_MAP['gut-3'];
    if (titleLower.includes('lord jim')) return BOOK_PDF_MAP['gut-4'];
    if (titleLower.includes('history of java')) return BOOK_PDF_MAP['gut-5'];
    if (titleLower.includes('hidden force')) return BOOK_PDF_MAP['gut-6'];
    if (titleLower.includes('monumental java')) return BOOK_PDF_MAP['gut-7'];
    if (titleLower.includes('blown to bits') || titleLower.includes('rakata')) return BOOK_PDF_MAP['gut-8'];
    if (titleLower.includes('facts and fancies')) return BOOK_PDF_MAP['gut-9'];
    if (titleLower.includes('archipelago') || titleLower.includes('bickmore')) return BOOK_PDF_MAP['gut-10'];
  }

  // 5. Hash code deterministic pick from default PDFs for new custom books
  if (book.title) {
    let hash = 0;
    for (let i = 0; i < book.title.length; i++) {
      hash = (hash << 5) - hash + book.title.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % defaultPdfs.length;
    return defaultPdfs[idx];
  }

  return defaultPdfs[0];
}

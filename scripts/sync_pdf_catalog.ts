#!/usr/bin/env tsx
/**
 * 🔄 PDF CATALOG SYNC UTILITY
 * 
 * Tool untuk sinkronisasi antara file PDF di assets dengan katalog database
 * 
 * Modes:
 * 1. SCAN: Scan assets folder dan tampilkan PDF yang belum tercatat
 * 2. IMPORT: Auto-generate book entries untuk PDF yang orphan
 * 3. CLEANUP: Hapus/archive file PDF yang tidak tercatat dan sudah lama
 * 4. REPORT: Generate laporan lengkap PDF catalog
 * 
 * Usage:
 *   tsx scripts/sync_pdf_catalog.ts --mode=scan
 *   tsx scripts/sync_pdf_catalog.ts --mode=import
 *   tsx scripts/sync_pdf_catalog.ts --mode=cleanup --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURATION
// ==========================================

const ASSETS_DIR = path.resolve(__dirname, '../public/buku_digital');
const ORPHAN_DIR = path.resolve(__dirname, '../public/buku_digital/orphaned');
const BOOKS_DATA_FILE = path.resolve(__dirname, '../src/data/books.tsx');
const PDF_RESOLVER_FILE = path.resolve(__dirname, '../src/utils/pdfResolver.ts');

interface OrphanPdfInfo {
  filename: string;
  size: number;
  created: Date;
  modified: Date;
  path: string;
}

interface ImportableBook {
  id: string;
  title: string;
  filename: string;
  guessedAuthor?: string;
  guessedCategory?: string;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function log(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m'
  };
  const reset = '\x1b[0m';
  const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warn' ? '⚠' : 'ℹ';
  console.log(`${colors[type]}${prefix} ${message}${reset}`);
}

function extractBookInfoFromFilename(filename: string): ImportableBook {
  const nameWithoutExt = filename.replace(/\.pdf$/i, '');
  
  // Try to parse structured filename: eb-1_Title.pdf or gut-2_Title_Author.pdf
  const match = nameWithoutExt.match(/^([a-z]+-\d+)_(.+)$/i);
  
  if (match) {
    const [, id, rest] = match;
    const parts = rest.split('_');
    const title = parts.join(' ').replace(/_/g, ' ').trim();
    
    return {
      id,
      title,
      filename,
      guessedCategory: 'Umum',
      guessedAuthor: 'Unknown'
    };
  }
  
  // Fallback: use entire filename as title
  return {
    id: `gen-${Math.random().toString(36).substr(2, 9)}`,
    title: nameWithoutExt.replace(/_/g, ' ').replace(/-/g, ' ').trim(),
    filename,
    guessedCategory: 'Umum',
    guessedAuthor: 'Unknown'
  };
}

// ==========================================
// MODE 1: SCAN FOR ORPHAN FILES
// ==========================================

async function scanOrphanFiles(): Promise<OrphanPdfInfo[]> {
  log('📂 Scanning assets directory for orphan PDF files...', 'info');
  
  // Load existing mappings
  const booksContent = fs.readFileSync(BOOKS_DATA_FILE, 'utf-8');
  const resolverContent = fs.readFileSync(PDF_RESOLVER_FILE, 'utf-8');
  
  // Extract all referenced filenames
  const referencedFiles = new Set<string>();
  
  // From books.tsx pdfUrl fields
  const pdfUrlMatches = booksContent.matchAll(/pdfUrl:\s*['"]\/buku_digital\/([^'"]+)['"]/g);
  for (const match of pdfUrlMatches) {
    referencedFiles.add(match[1]);
  }
  
  // From pdfResolver.ts BOOK_PDF_MAP
  const mapMatches = resolverContent.matchAll(/['"]\/buku_digital\/([^'"]+)['"]/g);
  for (const match of mapMatches) {
    referencedFiles.add(match[1]);
  }
  
  log(`✓ Found ${referencedFiles.size} referenced PDF files in catalog`, 'success');
  
  // Scan actual files in assets
  const actualFiles = fs.readdirSync(ASSETS_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'));
  
  log(`✓ Found ${actualFiles.length} PDF files in assets directory`, 'success');
  
  // Find orphans
  const orphans: OrphanPdfInfo[] = [];
  
  for (const file of actualFiles) {
    if (!referencedFiles.has(file)) {
      const fullPath = path.join(ASSETS_DIR, file);
      const stats = fs.statSync(fullPath);
      
      orphans.push({
        filename: file,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: fullPath
      });
    }
  }
  
  return orphans;
}

// ==========================================
// MODE 2: IMPORT ORPHAN FILES TO CATALOG
// ==========================================

async function importOrphanFiles(orphans: OrphanPdfInfo[], dryRun: boolean = false): Promise<void> {
  if (orphans.length === 0) {
    log('✓ No orphan files to import', 'success');
    return;
  }
  
  log(`📥 Importing ${orphans.length} orphan PDF files to catalog...`, 'info');
  
  const importableBooks: ImportableBook[] = orphans.map(o => 
    extractBookInfoFromFilename(o.filename)
  );
  
  if (dryRun) {
    log('🔍 DRY RUN - No changes will be made', 'warn');
    log('', 'info');
    log('Books that would be imported:', 'info');
    importableBooks.forEach((book, idx) => {
      log(`  ${idx + 1}. ${book.title} (${book.id}) - ${book.filename}`, 'info');
    });
    return;
  }
  
  // Generate new book entries
  const newBooks = importableBooks.map(book => ({
    id: book.id,
    title: book.title,
    author: book.guessedAuthor || 'Unknown',
    category: book.guessedCategory || 'Umum',
    publisher: 'Not specified',
    isbn: `ISBN-${book.id}`,
    description: `Dokumen PDF yang di-import otomatis dari file: ${book.filename}`,
    year: new Date().getFullYear(),
    rating: 3.0,
    status: 'Tersedia' as const,
    stock: 1,
    coverColor: '#6366f1',
    pdfUrl: `/buku_digital/${book.filename}`,
    isAiGenerated: false,
    isActive: true
  }));
  
  // Read and update books.tsx
  let booksContent = fs.readFileSync(BOOKS_DATA_FILE, 'utf-8');
  
  // Find the INITIAL_BOOKS array
  const match = booksContent.match(/export const INITIAL_BOOKS.*?=\s*\[([\s\S]*?)\];/);
  if (!match) {
    log('✗ Could not find INITIAL_BOOKS array', 'error');
    return;
  }
  
  // Parse existing books
  const existingBooksString = `[${match[1]}]`;
  const existingBooks = eval(existingBooksString);
  
  // Merge
  const mergedBooks = [...existingBooks, ...newBooks];
  
  // Generate new code
  const newBooksString = JSON.stringify(mergedBooks, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
  
  const newContent = booksContent.replace(
    /export const INITIAL_BOOKS.*?=\s*\[[\s\S]*?\];/,
    `export const INITIAL_BOOKS: Book[] = ${newBooksString};`
  );
  
  fs.writeFileSync(BOOKS_DATA_FILE, newContent, 'utf-8');
  
  log(`✓ Successfully imported ${newBooks.length} new book entries to books.tsx`, 'success');
  
  // Update PDF resolver map
  let resolverContent = fs.readFileSync(PDF_RESOLVER_FILE, 'utf-8');
  
  const mapMatch = resolverContent.match(/export const BOOK_PDF_MAP.*?=\s*({[\s\S]*?});/);
  if (mapMatch) {
    const existingMap = eval(`(${mapMatch[1]})`);
    
    // Add new entries
    newBooks.forEach(book => {
      existingMap[book.id] = book.pdfUrl;
    });
    
    // Generate new map code
    const newMapString = JSON.stringify(existingMap, null, 2)
      .replace(/"([^"]+)":/g, "'$1':")
      .replace(/"/g, "'");
    
    const newResolverContent = resolverContent.replace(
      /export const BOOK_PDF_MAP.*?=\s*{[\s\S]*?};/,
      `export const BOOK_PDF_MAP: Record<string, string> = ${newMapString};`
    );
    
    fs.writeFileSync(PDF_RESOLVER_FILE, newResolverContent, 'utf-8');
    
    log(`✓ Successfully updated BOOK_PDF_MAP with ${newBooks.length} new entries`, 'success');
  }
}

// ==========================================
// MODE 3: CLEANUP OLD ORPHAN FILES
// ==========================================

async function cleanupOrphanFiles(orphans: OrphanPdfInfo[], daysOld: number = 90, dryRun: boolean = false): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const oldOrphans = orphans.filter(o => o.modified < cutoffDate);
  
  if (oldOrphans.length === 0) {
    log(`✓ No orphan files older than ${daysOld} days found`, 'success');
    return;
  }
  
  log(`🗑️  Found ${oldOrphans.length} orphan files older than ${daysOld} days`, 'warn');
  
  if (dryRun) {
    log('🔍 DRY RUN - No files will be moved or deleted', 'warn');
    log('', 'info');
    log('Files that would be archived:', 'info');
    oldOrphans.forEach((file, idx) => {
      log(`  ${idx + 1}. ${file.filename} (modified: ${file.modified.toLocaleDateString()})`, 'info');
    });
    return;
  }
  
  // Create orphaned directory if it doesn't exist
  if (!fs.existsSync(ORPHAN_DIR)) {
    fs.mkdirSync(ORPHAN_DIR, { recursive: true });
    log(`✓ Created orphaned directory: ${ORPHAN_DIR}`, 'success');
  }
  
  // Move files to orphaned directory
  let movedCount = 0;
  for (const file of oldOrphans) {
    try {
      const destPath = path.join(ORPHAN_DIR, file.filename);
      fs.renameSync(file.path, destPath);
      movedCount++;
      log(`  ✓ Moved: ${file.filename}`, 'success');
    } catch (error: any) {
      log(`  ✗ Failed to move ${file.filename}: ${error.message}`, 'error');
    }
  }
  
  log(`✓ Successfully archived ${movedCount} orphan files to ${ORPHAN_DIR}`, 'success');
}

// ==========================================
// MODE 4: GENERATE REPORT
// ==========================================

async function generateReport(orphans: OrphanPdfInfo[]): Promise<void> {
  log('', 'info');
  log('================================================', 'info');
  log('📊 PDF CATALOG SYNC REPORT', 'info');
  log('================================================', 'info');
  
  // Load catalog stats
  const booksContent = fs.readFileSync(BOOKS_DATA_FILE, 'utf-8');
  const booksMatch = booksContent.match(/export const INITIAL_BOOKS.*?=\s*\[([\s\S]*?)\];/);
  const books = booksMatch ? eval(`[${booksMatch[1]}]`) : [];
  
  const actualFiles = fs.readdirSync(ASSETS_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'));
  
  log(`Total Books in Catalog: ${books.length}`, 'info');
  log(`Total PDF Files in Assets: ${actualFiles.length}`, 'info');
  log(`Orphan Files (Not in Catalog): ${orphans.length}`, orphans.length > 0 ? 'warn' : 'success');
  
  // Calculate storage
  let totalSize = 0;
  actualFiles.forEach(f => {
    const stats = fs.statSync(path.join(ASSETS_DIR, f));
    totalSize += stats.size;
  });
  
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  log(`Total Storage Used: ${sizeInMB} MB`, 'info');
  
  // Orphan file details
  if (orphans.length > 0) {
    log('', 'info');
    log('🔍 Orphan Files Details:', 'warn');
    orphans.forEach((file, idx) => {
      const sizeKB = (file.size / 1024).toFixed(2);
      log(`  ${idx + 1}. ${file.filename} (${sizeKB} KB, modified: ${file.modified.toLocaleDateString()})`, 'info');
    });
  }
  
  log('================================================', 'info');
}

// ==========================================
// MAIN CLI
// ==========================================

async function main() {
  const args = process.argv.slice(2);
  const mode = args.find(a => a.startsWith('--mode='))?.split('=')[1] || 'scan';
  const dryRun = args.includes('--dry-run');
  const daysOld = parseInt(args.find(a => a.startsWith('--days='))?.split('=')[1] || '90');
  
  log('🔄 PDF CATALOG SYNC UTILITY', 'info');
  log(`Mode: ${mode.toUpperCase()}`, 'info');
  if (dryRun) log('Dry Run: Enabled', 'warn');
  log('', 'info');
  
  try {
    const orphans = await scanOrphanFiles();
    
    switch (mode) {
      case 'scan':
        await generateReport(orphans);
        if (orphans.length > 0) {
          log('', 'info');
          log('💡 Tip: Run with --mode=import to add these files to catalog', 'info');
          log('💡 Tip: Run with --mode=cleanup to archive old orphan files', 'info');
        }
        break;
      
      case 'import':
        await importOrphanFiles(orphans, dryRun);
        break;
      
      case 'cleanup':
        await cleanupOrphanFiles(orphans, daysOld, dryRun);
        break;
      
      case 'report':
        await generateReport(orphans);
        break;
      
      default:
        log(`Unknown mode: ${mode}`, 'error');
        log('Available modes: scan, import, cleanup, report', 'info');
        process.exit(1);
    }
    
    log('', 'info');
    log('✓ Operation completed successfully', 'success');
    
  } catch (error: any) {
    log(`Fatal error: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run main function
main();

export { scanOrphanFiles, importOrphanFiles, cleanupOrphanFiles, generateReport };

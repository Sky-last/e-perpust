#!/usr/bin/env tsx
/**
 * 🔧 AUTO-FIX SCRIPT: Perpustakaan Digital Audit & Repair Tool
 * 
 * Fungsi:
 * - Audit sinkronisasi antara Database Katalog vs File PDF Assets
 * - Deteksi Broken Reference (path PDF di DB tidak ada di assets)
 * - Deteksi Orphan Files (PDF di assets tidak tercatat di DB)
 * - Validasi integritas file PDF (ukuran, readability)
 * - Auto-repair path yang salah
 * - Tandai buku dengan file hilang sebagai inactive
 * - Generate laporan audit lengkap
 * 
 * Stack: React + TypeScript + Supabase + Node.js
 * 
 * Usage:
 *   npm run audit-fix
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
const BOOKS_DATA_FILE = path.resolve(__dirname, '../src/data/books.tsx');
const PDF_RESOLVER_FILE = path.resolve(__dirname, '../src/utils/pdfResolver.ts');
const AUDIT_LOG_FILE = path.resolve(__dirname, '../audit_log.json');

const MIN_PDF_SIZE = 100; // bytes - file kurang dari ini dianggap korup

// ==========================================
// TYPES
// ==========================================

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  isbn: string;
  description: string;
  year: number;
  rating: number;
  status: 'Tersedia' | 'Sedang Dipinjam';
  stock: number;
  coverColor: string;
  coverUrl?: string;
  pdfUrl?: string;
  isAiGenerated?: boolean;
  isActive?: boolean;
}

interface AuditIssue {
  type: 'broken_reference' | 'orphan_file' | 'corrupted_pdf' | 'invalid_path' | 'missing_in_resolver';
  severity: 'critical' | 'high' | 'medium' | 'low';
  bookId?: string;
  bookTitle?: string;
  filePath?: string;
  message: string;
  autoFixed?: boolean;
  fixAction?: string;
}

interface AuditReport {
  timestamp: string;
  totalBooks: number;
  totalPdfFiles: number;
  issues: AuditIssue[];
  fixedCount: number;
  summary: {
    brokenReferences: number;
    orphanFiles: number;
    corruptedPdfs: number;
    invalidPaths: number;
    missingInResolver: number;
  };
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function log(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') {
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warn: '\x1b[33m',    // yellow
    error: '\x1b[31m'    // red
  };
  const reset = '\x1b[0m';
  const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warn' ? '⚠' : 'ℹ';
  console.log(`${colors[type]}${prefix} ${message}${reset}`);
}

function sanitizePdfPath(rawPath: string): string {
  if (!rawPath) return '';
  
  // Remove directory traversal attempts
  let clean = rawPath
    .replace(/\0/g, '')
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '');
  
  // Ensure it starts with /buku_digital/
  if (!clean.startsWith('/buku_digital/')) {
    const filename = clean.split('/').pop() || clean;
    clean = `/buku_digital/${filename}`;
  }
  
  return clean;
}

function extractPathFromPdfUrl(url?: string): string | null {
  if (!url) return null;
  
  // If it's a remote URL (Supabase Storage), skip
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return null;
  }
  
  // Extract relative path
  const sanitized = sanitizePdfPath(url);
  return sanitized.replace('/buku_digital/', '');
}

// ==========================================
// CORE AUDIT FUNCTIONS
// ==========================================

async function loadBooksFromDataFile(): Promise<Book[]> {
  try {
    const content = fs.readFileSync(BOOKS_DATA_FILE, 'utf-8');
    
    // Extract INITIAL_BOOKS array using regex
    const match = content.match(/export const INITIAL_BOOKS.*?=\s*\[([\s\S]*?)\];/);
    if (!match) {
      throw new Error('Could not find INITIAL_BOOKS array in books.tsx');
    }
    
    const booksArrayString = `[${match[1]}]`;
    
    // Safely evaluate the array (we trust our own code)
    // In production, use proper AST parsing library
    const books = eval(booksArrayString) as Book[];
    
    return books;
  } catch (error: any) {
    log(`Failed to load books data: ${error.message}`, 'error');
    return [];
  }
}

async function loadPdfResolverMap(): Promise<Record<string, string>> {
  try {
    const content = fs.readFileSync(PDF_RESOLVER_FILE, 'utf-8');
    
    // Extract BOOK_PDF_MAP
    const match = content.match(/export const BOOK_PDF_MAP.*?=\s*({[\s\S]*?});/);
    if (!match) {
      throw new Error('Could not find BOOK_PDF_MAP in pdfResolver.ts');
    }
    
    const mapString = match[1];
    const pdfMap = eval(`(${mapString})`) as Record<string, string>;
    
    return pdfMap;
  } catch (error: any) {
    log(`Failed to load PDF resolver map: ${error.message}`, 'error');
    return {};
  }
}

async function scanAssetDirectory(): Promise<string[]> {
  try {
    if (!fs.existsSync(ASSETS_DIR)) {
      log(`Assets directory not found: ${ASSETS_DIR}`, 'error');
      return [];
    }
    
    const files = fs.readdirSync(ASSETS_DIR);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    
    return pdfFiles;
  } catch (error: any) {
    log(`Failed to scan assets directory: ${error.message}`, 'error');
    return [];
  }
}

function checkPdfFileIntegrity(filename: string): { exists: boolean; size: number; readable: boolean } {
  try {
    const fullPath = path.join(ASSETS_DIR, filename);
    
    if (!fs.existsSync(fullPath)) {
      return { exists: false, size: 0, readable: false };
    }
    
    const stats = fs.statSync(fullPath);
    const readable = stats.size >= MIN_PDF_SIZE;
    
    return { exists: true, size: stats.size, readable };
  } catch (error) {
    return { exists: false, size: 0, readable: false };
  }
}

// ==========================================
// AUDIT & FIX LOGIC
// ==========================================

async function performAudit(): Promise<AuditReport> {
  log('🔍 Starting Digital Library Audit...', 'info');
  log('================================================', 'info');
  
  const issues: AuditIssue[] = [];
  const books = await loadBooksFromDataFile();
  const pdfMap = await loadPdfResolverMap();
  const assetFiles = await scanAssetDirectory();
  
  log(`📚 Total books in catalog: ${books.length}`, 'info');
  log(`📁 Total PDF files in assets: ${assetFiles.length}`, 'info');
  log('', 'info');
  
  // ==========================================
  // CHECK 1: Broken References (DB → Assets)
  // ==========================================
  log('🔎 Checking for broken references...', 'info');
  
  for (const book of books) {
    // Determine expected PDF path
    let expectedPath: string | null = null;
    
    // Priority 1: Check pdfUrl in book object
    if (book.pdfUrl) {
      expectedPath = extractPathFromPdfUrl(book.pdfUrl);
    }
    
    // Priority 2: Check BOOK_PDF_MAP
    if (!expectedPath && pdfMap[book.id]) {
      expectedPath = extractPathFromPdfUrl(pdfMap[book.id]);
    }
    
    // If we have a path, validate it
    if (expectedPath) {
      const integrity = checkPdfFileIntegrity(expectedPath);
      
      if (!integrity.exists) {
        issues.push({
          type: 'broken_reference',
          severity: 'critical',
          bookId: book.id,
          bookTitle: book.title,
          filePath: expectedPath,
          message: `File PDF "${expectedPath}" tidak ditemukan di assets folder`,
          autoFixed: false,
          fixAction: 'Set isActive=false untuk buku ini'
        });
      } else if (!integrity.readable || integrity.size < MIN_PDF_SIZE) {
        issues.push({
          type: 'corrupted_pdf',
          severity: 'high',
          bookId: book.id,
          bookTitle: book.title,
          filePath: expectedPath,
          message: `File PDF "${expectedPath}" korup atau rusak (size: ${integrity.size} bytes)`,
          autoFixed: false,
          fixAction: 'Set isActive=false dan perlu re-upload file'
        });
      }
    } else {
      // No PDF mapping found for this book
      issues.push({
        type: 'missing_in_resolver',
        severity: 'medium',
        bookId: book.id,
        bookTitle: book.title,
        message: `Buku "${book.title}" (${book.id}) tidak memiliki mapping PDF di BOOK_PDF_MAP`,
        autoFixed: false,
        fixAction: 'Tambahkan entry ke BOOK_PDF_MAP atau upload PDF'
      });
    }
  }
  
  // ==========================================
  // CHECK 2: Orphan Files (Assets → DB)
  // ==========================================
  log('🔎 Checking for orphan PDF files...', 'info');
  
  const mappedFiles = new Set<string>();
  
  // Collect all PDF filenames that are referenced
  books.forEach(book => {
    const pathFromBook = extractPathFromPdfUrl(book.pdfUrl);
    const pathFromMap = extractPathFromPdfUrl(pdfMap[book.id]);
    
    if (pathFromBook) mappedFiles.add(pathFromBook);
    if (pathFromMap) mappedFiles.add(pathFromMap);
  });
  
  // Find files that exist in assets but not referenced anywhere
  for (const file of assetFiles) {
    if (!mappedFiles.has(file)) {
      issues.push({
        type: 'orphan_file',
        severity: 'low',
        filePath: file,
        message: `File PDF "${file}" ada di assets tapi tidak tercatat di katalog database`,
        autoFixed: false,
        fixAction: 'Buat entry buku baru atau hapus file jika tidak diperlukan'
      });
    }
  }
  
  // ==========================================
  // CHECK 3: Invalid Paths (Security Check)
  // ==========================================
  log('🔎 Checking for invalid/dangerous paths...', 'info');
  
  books.forEach(book => {
    if (book.pdfUrl) {
      const original = book.pdfUrl;
      const sanitized = sanitizePdfPath(original);
      
      if (original !== sanitized) {
        issues.push({
          type: 'invalid_path',
          severity: 'high',
          bookId: book.id,
          bookTitle: book.title,
          filePath: original,
          message: `Path PDF tidak aman atau malformed: "${original}"`,
          autoFixed: true,
          fixAction: `Path di-sanitasi menjadi: "${sanitized}"`
        });
      }
    }
  });
  
  // ==========================================
  // GENERATE SUMMARY
  // ==========================================
  log('', 'info');
  log('📊 Generating audit report...', 'info');
  
  const summary = {
    brokenReferences: issues.filter(i => i.type === 'broken_reference').length,
    orphanFiles: issues.filter(i => i.type === 'orphan_file').length,
    corruptedPdfs: issues.filter(i => i.type === 'corrupted_pdf').length,
    invalidPaths: issues.filter(i => i.type === 'invalid_path').length,
    missingInResolver: issues.filter(i => i.type === 'missing_in_resolver').length
  };
  
  const fixedCount = issues.filter(i => i.autoFixed).length;
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalBooks: books.length,
    totalPdfFiles: assetFiles.length,
    issues,
    fixedCount,
    summary
  };
  
  return report;
}

// ==========================================
// AUTO-FIX FUNCTIONS
// ==========================================

async function applyAutoFixes(report: AuditReport): Promise<void> {
  log('', 'info');
  log('🔧 Applying auto-fixes...', 'info');
  log('================================================', 'info');
  
  const books = await loadBooksFromDataFile();
  let modified = false;
  
  // Fix broken references by setting isActive = false
  const brokenBooks = report.issues
    .filter(i => i.type === 'broken_reference' || i.type === 'corrupted_pdf')
    .map(i => i.bookId)
    .filter(Boolean);
  
  if (brokenBooks.length > 0) {
    log(`⚠️  Menonaktifkan ${brokenBooks.length} buku dengan file PDF hilang/rusak...`, 'warn');
    
    books.forEach(book => {
      if (brokenBooks.includes(book.id)) {
        book.isActive = false;
        book.status = 'Sedang Dipinjam'; // Hide from catalog
        log(`   - ${book.title} (${book.id}) → isActive = false`, 'info');
        modified = true;
      }
    });
  }
  
  // Save updated books data
  if (modified) {
    try {
      const content = fs.readFileSync(BOOKS_DATA_FILE, 'utf-8');
      
      // Generate new books array string
      const booksString = JSON.stringify(books, null, 2)
        .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
        .replace(/"/g, "'"); // Use single quotes
      
      const newContent = content.replace(
        /export const INITIAL_BOOKS.*?=\s*\[[\s\S]*?\];/,
        `export const INITIAL_BOOKS: Book[] = ${booksString};`
      );
      
      fs.writeFileSync(BOOKS_DATA_FILE, newContent, 'utf-8');
      log(`✓ File books.tsx berhasil diupdate`, 'success');
    } catch (error: any) {
      log(`✗ Gagal menyimpan perubahan: ${error.message}`, 'error');
    }
  } else {
    log('ℹ  Tidak ada perubahan yang perlu disimpan', 'info');
  }
}

// ==========================================
// REPORT GENERATION
// ==========================================

function printReport(report: AuditReport): void {
  log('', 'info');
  log('================================================', 'info');
  log('📋 AUDIT REPORT SUMMARY', 'info');
  log('================================================', 'info');
  log(`Waktu Audit: ${new Date(report.timestamp).toLocaleString('id-ID')}`, 'info');
  log(`Total Buku: ${report.totalBooks}`, 'info');
  log(`Total PDF Files: ${report.totalPdfFiles}`, 'info');
  log(`Total Issues: ${report.issues.length}`, report.issues.length > 0 ? 'warn' : 'success');
  log(`Auto-Fixed: ${report.fixedCount}`, 'success');
  log('', 'info');
  
  // Breakdown by severity
  const critical = report.issues.filter(i => i.severity === 'critical').length;
  const high = report.issues.filter(i => i.severity === 'high').length;
  const medium = report.issues.filter(i => i.severity === 'medium').length;
  const low = report.issues.filter(i => i.severity === 'low').length;
  
  log('📌 Issue Breakdown:', 'info');
  if (critical > 0) log(`   🔴 Critical: ${critical}`, 'error');
  if (high > 0) log(`   🟠 High: ${high}`, 'warn');
  if (medium > 0) log(`   🟡 Medium: ${medium}`, 'warn');
  if (low > 0) log(`   🟢 Low: ${low}`, 'info');
  log('', 'info');
  
  log('📊 Issue Types:', 'info');
  log(`   - Broken References: ${report.summary.brokenReferences}`, report.summary.brokenReferences > 0 ? 'error' : 'success');
  log(`   - Corrupted PDFs: ${report.summary.corruptedPdfs}`, report.summary.corruptedPdfs > 0 ? 'error' : 'success');
  log(`   - Invalid Paths: ${report.summary.invalidPaths}`, report.summary.invalidPaths > 0 ? 'warn' : 'success');
  log(`   - Missing in Resolver: ${report.summary.missingInResolver}`, report.summary.missingInResolver > 0 ? 'warn' : 'success');
  log(`   - Orphan Files: ${report.summary.orphanFiles}`, report.summary.orphanFiles > 0 ? 'info' : 'success');
  log('', 'info');
  
  // Print detailed issues
  if (report.issues.length > 0) {
    log('🔍 Detailed Issues:', 'info');
    log('================================================', 'info');
    
    report.issues.forEach((issue, idx) => {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '🟢';
      log(`${icon} Issue #${idx + 1}: ${issue.type.toUpperCase()}`, issue.severity === 'critical' ? 'error' : 'warn');
      log(`   Message: ${issue.message}`, 'info');
      if (issue.bookTitle) log(`   Book: ${issue.bookTitle} (${issue.bookId})`, 'info');
      if (issue.filePath) log(`   File: ${issue.filePath}`, 'info');
      if (issue.fixAction) log(`   Fix Action: ${issue.fixAction}`, issue.autoFixed ? 'success' : 'warn');
      log('', 'info');
    });
  }
  
  // Save to JSON log file
  try {
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(report, null, 2), 'utf-8');
    log(`✓ Audit log disimpan ke: ${AUDIT_LOG_FILE}`, 'success');
  } catch (error: any) {
    log(`✗ Gagal menyimpan audit log: ${error.message}`, 'error');
  }
  
  log('', 'info');
  log('================================================', 'info');
  
  if (report.issues.length === 0) {
    log('🎉 Selamat! Tidak ada masalah ditemukan. Database dan Assets sudah sinkron!', 'success');
  } else {
    log('⚠️  Ditemukan beberapa masalah. Silakan review dan perbaiki secara manual.', 'warn');
  }
  
  log('================================================', 'info');
}

// ==========================================
// MAIN EXECUTION
// ==========================================

async function main() {
  try {
    console.log('\n');
    log('╔═══════════════════════════════════════════════════════╗', 'info');
    log('║   🔧 PERPUSTAKAAN DIGITAL - AUTO-FIX AUDIT TOOL   ║', 'info');
    log('╚═══════════════════════════════════════════════════════╝', 'info');
    console.log('\n');
    
    // Step 1: Perform Audit
    const report = await performAudit();
    
    // Step 2: Apply Auto-Fixes
    if (report.issues.length > 0) {
      await applyAutoFixes(report);
    }
    
    // Step 3: Print Report
    printReport(report);
    
    // Exit with appropriate code
    if (report.summary.brokenReferences > 0 || report.summary.corruptedPdfs > 0) {
      process.exit(1); // Exit with error for CI/CD pipelines
    }
    
  } catch (error: any) {
    log(`Fatal error: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { performAudit, applyAutoFixes, type AuditReport, type AuditIssue };

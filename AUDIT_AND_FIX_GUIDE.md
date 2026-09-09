# 🔧 Panduan Audit & Perbaikan Bug - Perpustakaan Digital

## 📋 Daftar Isi
1. [Ringkasan Bug yang Ditemukan](#bug-yang-ditemukan)
2. [Tools & Scripts yang Tersedia](#tools--scripts)
3. [Cara Menggunakan](#cara-menggunakan)
4. [Alur Kerja Audit](#alur-kerja-audit)
5. [Best Practices](#best-practices)

---

## 🐛 Bug yang Ditemukan

### **CRITICAL** 🔴

#### 1. Broken PDF References (Path PDF di DB tidak ditemukan di Assets)
**Masalah:**
- Record buku di database memiliki `pdfUrl` yang mengarah ke file yang tidak ada di folder `/public/buku_digital/`
- User melihat loading infinity atau blank screen saat membuka buku
- Tidak ada validasi file existence sebelum viewer dibuka

**Dampak:** 
- User experience buruk
- Buku tidak bisa dibaca meski muncul di katalog

**Perbaikan yang Diterapkan:**
- ✅ Auto-detect broken references dengan script audit
- ✅ Set `isActive = false` untuk buku dengan PDF hilang
- ✅ Tambahkan graceful error screen di PDF viewer
- ✅ Validasi ketersediaan file sebelum render

---

#### 2. Corrupted PDF Files (File PDF rusak/korup)
**Masalah:**
- File PDF ada di folder tapi ukurannya 0 KB atau rusak
- Browser gagal render dan viewer hang
- Tidak ada validasi integritas file

**Dampak:**
- User stuck di loading screen
- Error tidak informatif

**Perbaikan yang Diterapkan:**
- ✅ Check file size minimum (100 bytes)
- ✅ Validasi dengan HTTP HEAD request sebelum render
- ✅ Error message yang user-friendly
- ✅ Fallback ke mode baca interaktif

---

### **HIGH** 🟠

#### 3. Orphan PDF Files (File PDF ada tapi tidak tercatat di DB)
**Masalah:**
- Ada file PDF di `/public/buku_digital/` yang tidak tercatat di katalog
- File menumpuk dan waste storage
- Tidak ada cara otomatis untuk tracking

**Dampak:**
- Storage bloat
- Sulit maintenance

**Perbaikan yang Diterapkan:**
- ✅ Script untuk detect orphan files
- ✅ Auto-import tool untuk menambahkan ke katalog
- ✅ Cleanup tool untuk archive file lama

---

#### 4. Invalid/Unsafe PDF Paths
**Masalah:**
- Potensi directory traversal attack (`../../.env`)
- Path dengan karakter khusus atau encoding berbahaya
- Tidak ada sanitization sebelum file serving

**Dampak:**
- Security vulnerability
- Potensi akses ke file system sensitif

**Perbaikan yang Diterapkan:**
- ✅ Path sanitization di `pdfResolver.ts`
- ✅ Security middleware `pdfSecurityMiddleware.ts`
- ✅ Validation & blocking dangerous patterns
- ✅ Security audit logging

---

### **MEDIUM** 🟡

#### 5. Missing PDF Mapping in Resolver
**Masalah:**
- Buku baru ditambahkan ke catalog tapi tidak ada entry di `BOOK_PDF_MAP`
- Buku tidak bisa dibaca karena resolver return fallback/404

**Dampak:**
- Buku exist tapi tidak bisa diakses
- Manual mapping error-prone

**Perbaikan yang Diterapkan:**
- ✅ Auto-fallback ke `book.pdfUrl` jika tidak ada di map
- ✅ Script untuk sync map dengan catalog

---

## 🛠 Tools & Scripts

### 1. **Auto-Fix Audit Script** (`scripts/auto_fix_digital_library.ts`)
Script utama untuk audit menyeluruh database vs assets.

**Fitur:**
- ✅ Scan broken references (DB → Assets)
- ✅ Detect corrupted PDFs (size check)
- ✅ Find orphan files (Assets → DB)
- ✅ Validate path security
- ✅ Auto-fix: set isActive=false untuk broken books
- ✅ Generate JSON audit report

**Menjalankan:**
```bash
npm run audit-fix
```

**Output:**
- Console report dengan breakdown masalah
- `audit_log.json` - Full audit log
- Auto-update `books.tsx` untuk broken books

---

### 2. **PDF Catalog Sync Utility** (`scripts/sync_pdf_catalog.ts`)
Tool untuk sinkronisasi manual assets dengan katalog.

**Modes:**

#### Mode: SCAN (Default)
Scan dan tampilkan orphan files tanpa perubahan.
```bash
tsx scripts/sync_pdf_catalog.ts --mode=scan
```

#### Mode: IMPORT
Auto-import orphan PDFs ke katalog.
```bash
# Dry run (preview tanpa perubahan)
tsx scripts/sync_pdf_catalog.ts --mode=import --dry-run

# Execute import
tsx scripts/sync_pdf_catalog.ts --mode=import
```

#### Mode: CLEANUP
Archive file PDF orphan yang sudah lama tidak terpakai.
```bash
# Dry run (preview)
tsx scripts/sync_pdf_catalog.ts --mode=cleanup --days=90 --dry-run

# Execute cleanup
tsx scripts/sync_pdf_catalog.ts --mode=cleanup --days=90
```

#### Mode: REPORT
Generate laporan lengkap storage dan catalog.
```bash
tsx scripts/sync_pdf_catalog.ts --mode=report
```

---

### 3. **PDF Security Middleware** (`src/utils/pdfSecurityMiddleware.ts`)
Library untuk validasi dan sanitasi path PDF.

**Fungsi Utama:**
```typescript
import { 
  validatePdfPath, 
  validatePdfAvailability, 
  generateSafePdfFilename 
} from '@/utils/pdfSecurityMiddleware';

// Validasi path
const result = validatePdfPath('/buku_digital/my_book.pdf');
if (!result.isValid) {
  console.error(result.error);
}

// Validasi ketersediaan file (async)
const availResult = await validatePdfAvailability(url);

// Generate safe filename untuk upload
const safePath = generateSafePdfFilename('bk-123', 'My Book Title');
```

---

### 4. **usePdfValidator Hook** (`src/hooks/usePdfValidator.ts`)
React hook untuk validasi PDF di komponen.

**Cara Pakai:**
```typescript
import { usePdfValidator } from '@/hooks/usePdfValidator';

function PdfViewer({ pdfUrl }: Props) {
  const { isValid, isLoading, error, retry } = usePdfValidator(pdfUrl, {
    autoValidate: true,
    retryAttempts: 2,
    onError: (err) => console.error(err)
  });

  if (isLoading) return <LoadingSpinner />;
  if (!isValid) return <ErrorMessage error={error} onRetry={retry} />;
  
  return <iframe src={pdfUrl} />;
}
```

**Options:**
- `autoValidate`: Auto validate on mount (default: true)
- `retryAttempts`: Number of retry attempts (default: 2)
- `retryDelay`: Delay between retries (default: 1000ms)
- `onError`: Error callback
- `onSuccess`: Success callback

---

## 🚀 Cara Menggunakan

### Setup Awal
```bash
# Install dependencies (jika belum)
npm install

# Pastikan folder assets exist
mkdir -p public/buku_digital
```

---

### Workflow Rekomendasi

#### 1. **Audit Rutin (Weekly/Monthly)**
```bash
# Jalankan audit lengkap
npm run audit-fix

# Review audit_log.json untuk detail
cat audit_log.json | jq
```

**Hasil yang diharapkan:**
- Broken references terdeteksi dan di-nonaktifkan otomatis
- Laporan orphan files
- Security violations logged

---

#### 2. **Saat Menambah Buku Baru**
```bash
# 1. Upload PDF ke public/buku_digital/

# 2. Scan orphan files
tsx scripts/sync_pdf_catalog.ts --mode=scan

# 3. Import ke katalog (dry-run dulu)
tsx scripts/sync_pdf_catalog.ts --mode=import --dry-run

# 4. Execute import
tsx scripts/sync_pdf_catalog.ts --mode=import
```

---

#### 3. **Cleanup Storage (Quarterly)**
```bash
# Archive orphan files yang > 90 hari
tsx scripts/sync_pdf_catalog.ts --mode=cleanup --days=90

# File akan dipindahkan ke public/buku_digital/orphaned/
```

---

#### 4. **Debugging PDF Tidak Muncul**
```typescript
// Di browser console
import { checkPdfAvailability } from './src/utils/pdfResolver';

const result = await checkPdfAvailability('/buku_digital/my_book.pdf');
console.log(result);
```

---

## 📊 Alur Kerja Audit

```
┌────────────────────────────────────────────┐
│ 1. Scan Database (books.tsx)              │
│    - Extract all book records              │
│    - Extract all pdfUrl references         │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│ 2. Scan Assets (/public/buku_digital/)    │
│    - List all .pdf files                   │
│    - Get file stats (size, date)           │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│ 3. Cross-Reference Check                  │
│    ├─ DB → Assets (Broken References)     │
│    ├─ Assets → DB (Orphan Files)          │
│    ├─ File Integrity (Size, Corruption)   │
│    └─ Path Security (Directory Traversal) │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│ 4. Generate Issues List                   │
│    - Categorize by type & severity        │
│    - Suggest fix actions                   │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│ 5. Apply Auto-Fixes                       │
│    - Set isActive=false for broken refs   │
│    - Update books.tsx                      │
│    - Generate audit log                    │
└────────────────────────────────────────────┘
```

---

## ✅ Best Practices

### 1. **Naming Convention untuk PDF Files**
```
Format: {bookId}_{Title_Sanitized}.pdf

✅ Good:
- gut-2_Max_Havelaar.pdf
- bks-1_Syifa_dan_Burung_Kenari.pdf
- gen-abc123_Introduction_to_Programming.pdf

❌ Bad:
- book.pdf (tidak jelas)
- my file (1).pdf (spasi dan karakter khusus)
- ../../../etc/passwd.pdf (directory traversal)
```

### 2. **Sebelum Upload PDF Baru**
```bash
# 1. Validate file locally
file my_book.pdf  # Should show "PDF document"

# 2. Check file size
ls -lh my_book.pdf  # Should be > 100 bytes

# 3. Sanitize filename
# Remove spaces, special chars, keep only alphanumeric + _ -
```

### 3. **Update Database Entry**
Saat menambah buku baru, pastikan:
```typescript
{
  id: 'unique-id',
  title: 'Judul Buku',
  pdfUrl: '/buku_digital/unique-id_Judul_Buku.pdf',  // ✅ Match dengan nama file
  isActive: true,  // ✅ Set true agar muncul di katalog
  stock: 1
}
```

Dan tambahkan ke `BOOK_PDF_MAP`:
```typescript
// src/utils/pdfResolver.ts
export const BOOK_PDF_MAP: Record<string, string> = {
  'unique-id': '/buku_digital/unique-id_Judul_Buku.pdf',
  // ...
};
```

### 4. **Testing PDF Viewer**
```typescript
// Test dengan URL berbeda
const testUrls = [
  '/buku_digital/valid_book.pdf',      // Should work
  '/buku_digital/missing.pdf',         // Should show error
  '/../../../etc/passwd',              // Should block (security)
  '/buku_digital/corrupted.pdf'        // Should detect corruption
];

for (const url of testUrls) {
  const result = await validatePdfAvailability(url);
  console.log(url, result);
}
```

---

## 🔐 Security Checklist

- [x] Path sanitization (remove ../)
- [x] Directory traversal protection
- [x] Null byte injection protection
- [x] URL encoding attack protection
- [x] File extension validation (.pdf only)
- [x] File size validation (min 100 bytes)
- [x] Content-type validation
- [x] CORS handling
- [x] Security audit logging

---

## 📞 Troubleshooting

### Problem: Script error "INITIAL_BOOKS not found"
**Solution:**
```bash
# Pastikan format books.tsx correct
# Harus ada: export const INITIAL_BOOKS: Book[] = [...]
```

### Problem: PDF viewer blank screen
**Solution:**
```bash
# 1. Cek browser console untuk error
# 2. Validasi path PDF
# 3. Jalankan audit-fix
npm run audit-fix
```

### Problem: Orphan import gagal
**Solution:**
```bash
# Pastikan filename valid (no special chars)
# Rename file dulu jika perlu
mv "bad file (1).pdf" "good_file.pdf"
```

---

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Auto-fix audit script
- ✅ PDF security middleware
- ✅ Catalog sync utility
- ✅ React validation hook
- ✅ Graceful error UI
- ✅ Comprehensive documentation

---

## 🤝 Contributing

Jika menemukan bug baru atau ada ide improvement:
1. Jalankan `npm run audit-fix` untuk generate report
2. Attach `audit_log.json` ke issue ticket
3. Describe steps to reproduce

---

**Author:** Senior Full-Stack Developer & QA Team  
**Last Updated:** 2026-09-01

# 🚀 Quick Start: Audit & Fix Perpustakaan Digital

## TL;DR - Jalankan Sekarang

```bash
# Audit lengkap database vs assets
npm run audit-fix

# Scan PDF yang belum tercatat
npm run sync:scan

# Import PDF orphan ke katalog
npm run sync:import

# Cleanup file lama (preview)
npm run sync:cleanup

# Laporan lengkap
npm run sync:report
```

---

## 📋 Checklist Audit Rutin

### ✅ Mingguan
```bash
npm run audit-fix
```
- Cek broken PDF references
- Validasi integritas file
- Update catalog otomatis

### ✅ Bulanan
```bash
npm run sync:scan
npm run sync:import
```
- Deteksi PDF baru yang belum tercatat
- Auto-import ke katalog

### ✅ Triwulanan (3 Bulan)
```bash
npm run sync:cleanup
```
- Archive file PDF yang tidak terpakai > 90 hari
- Bersihkan storage

---

## 🐛 Bug yang Sudah Diperbaiki

### 1. ✅ Buku Tidak Bisa Dibaca (Broken PDF)
**Sebelum:**
- User klik "Baca Buku" → Loading infinity
- Blank screen di viewer
- Tidak ada pesan error

**Sesudah:**
- Auto-detect file PDF hilang/rusak
- Error message yang informatif
- Fallback ke mode baca interaktif
- Buku otomatis di-nonaktifkan dari katalog

**Cara Test:**
1. Buka buku di katalog
2. Klik "Baca E-Book"
3. Jika PDF hilang/rusak → Muncul error screen dengan opsi fallback
4. User bisa klik "Baca Mode Interaktif" atau "Kembali ke Katalog"

---

### 2. ✅ PDF Orphan (File Ada Tapi Tidak Tercatat)
**Sebelum:**
- Upload PDF manual ke folder
- File tidak muncul di katalog
- Tidak ada cara untuk tracking

**Sesudah:**
- Script auto-detect PDF orphan
- Auto-import dengan metadata dasar
- Laporan lengkap file yang tidak tercatat

**Cara Test:**
```bash
# 1. Copy PDF ke public/buku_digital/
cp test_book.pdf public/buku_digital/

# 2. Scan orphan
npm run sync:scan

# 3. Import (dry-run dulu)
tsx scripts/sync_pdf_catalog.ts --mode=import --dry-run

# 4. Execute import
npm run sync:import
```

---

### 3. ✅ Security: Directory Traversal Attack
**Sebelum:**
- User bisa akses file system dengan URL: `../../.env`
- Tidak ada validasi path
- Potensi kebocoran data

**Sesudah:**
- Path sanitization di semua endpoint
- Block dangerous patterns (../, null byte, etc)
- Security audit logging
- Validasi strict hanya allow /buku_digital/

**Cara Test:**
```typescript
// Buka browser console
import { validatePdfPath } from './src/utils/pdfSecurityMiddleware';

// Test case
validatePdfPath('../../etc/passwd');  // ❌ Blocked
validatePdfPath('/buku_digital/valid.pdf');  // ✅ Allowed
```

---

## 📊 Contoh Output Audit

### ✅ Tidak Ada Masalah
```
🔍 Starting Digital Library Audit...
================================================
📚 Total books in catalog: 189
📁 Total PDF files in assets: 189
🔎 Checking for broken references...
🔎 Checking for orphan PDF files...
🔎 Checking for invalid/dangerous paths...

================================================
📋 AUDIT REPORT SUMMARY
================================================
Total Books: 189
Total PDF Files: 189
Total Issues: 0
Auto-Fixed: 0

🎉 Selamat! Tidak ada masalah ditemukan!
================================================
```

### ⚠️ Ada Masalah Terdeteksi
```
================================================
📋 AUDIT REPORT SUMMARY
================================================
Total Books: 189
Total PDF Files: 187
Total Issues: 5
Auto-Fixed: 2

📌 Issue Breakdown:
   🔴 Critical: 2
   🟠 High: 1
   🟡 Medium: 2
   🟢 Low: 0

📊 Issue Types:
   - Broken References: 2  ❌
   - Corrupted PDFs: 0  ✅
   - Invalid Paths: 1  ⚠️
   - Missing in Resolver: 2  ⚠️
   - Orphan Files: 0  ✅

🔍 Detailed Issues:
🔴 Issue #1: BROKEN_REFERENCE
   Message: File PDF "gut-999_Missing_Book.pdf" tidak ditemukan
   Book: Missing Book (gut-999)
   Fix Action: Set isActive=false untuk buku ini ✅

⚠️  Ditemukan beberapa masalah. Silakan review.
================================================
```

---

## 🔧 Troubleshooting Common Issues

### Error: "tsx: command not found"
**Solution:**
```bash
npm install tsx --save-dev
```

### Error: "Cannot find module books.tsx"
**Solution:**
- Pastikan file `src/data/books.tsx` exist
- Check format: `export const INITIAL_BOOKS: Book[] = [...]`

### PDF Viewer Blank di Browser
**Solutions:**
1. **Check browser console untuk error**
   ```
   F12 → Console → Lihat error message
   ```

2. **Validasi path PDF**
   ```bash
   npm run audit-fix
   ```

3. **Test manual**
   ```bash
   # Buka URL PDF langsung di browser
   http://localhost:5173/buku_digital/your_file.pdf
   ```

### Import Orphan Gagal
**Solutions:**
```bash
# 1. Rename file (remove spasi & special chars)
mv "bad file (1).pdf" "good_file.pdf"

# 2. Cek permission folder
ls -la public/buku_digital/

# 3. Jalankan dengan verbose
tsx scripts/sync_pdf_catalog.ts --mode=import
```

---

## 📱 Monitoring & Alerts

### Check Audit Log
```bash
# View last audit result
cat audit_log.json

# Pretty print with jq
cat audit_log.json | jq

# Check timestamp
cat audit_log.json | jq '.timestamp'

# Count issues
cat audit_log.json | jq '.issues | length'
```

### CI/CD Integration
Tambahkan ke pipeline:
```yaml
# .github/workflows/audit.yml
name: PDF Catalog Audit

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run audit-fix
      - uses: actions/upload-artifact@v2
        with:
          name: audit-log
          path: audit_log.json
```

---

## 🎯 Best Practices

### ✅ DO
- Run audit sebelum deploy production
- Backup `audit_log.json` untuk history
- Test PDF upload di staging dulu
- Use dry-run untuk cleanup
- Validate dengan browser sebelum publish

### ❌ DON'T
- Langsung hapus orphan files tanpa review
- Skip audit saat add buku baru
- Hard-code PDF paths di component
- Upload PDF dengan nama file random
- Bypass security validation

---

## 📞 Need Help?

### Resources
- 📖 Full Guide: `AUDIT_AND_FIX_GUIDE.md`
- 🔐 Security Guide: `src/utils/pdfSecurityMiddleware.ts`
- 🎣 React Hook: `src/hooks/usePdfValidator.ts`
- 📜 Audit Script: `scripts/auto_fix_digital_library.ts`
- 🔄 Sync Script: `scripts/sync_pdf_catalog.ts`

### Check Logs
```bash
# Development logs
npm run dev
# → Buka browser console (F12)

# Audit logs
cat audit_log.json

# Security violations (dev only)
localStorage.getItem('security_logs')
```

---

**Last Updated:** 2026-09-01  
**Version:** 1.0.0

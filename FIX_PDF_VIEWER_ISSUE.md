# 🔧 FIX: PDF Viewer Menampilkan Landing Page

## 🐛 Masalah
Saat klik "Dokumen PDF" di viewer, yang muncul adalah landing page aplikasi (Perpustakaan Kita homepage) di dalam iframe, bukan dokumen PDF yang sebenarnya.

## 🔍 Root Cause
1. **Vite Dev Server** tidak serve PDF files dengan MIME type yang benar
2. **iframe fallback** salah - me-resolve path `/buku_digital/...` sebagai route aplikasi
3. **Tidak ada middleware** khusus untuk handle PDF file serving

## ✅ Perbaikan yang Sudah Diterapkan

### 1. **Vite Plugin untuk PDF Serving**
**File:** `vite-plugin-pdf.ts`

Plugin custom yang:
- ✅ Intercept semua request ke `/buku_digital/*.pdf`
- ✅ Set MIME type yang benar: `application/pdf`
- ✅ Set header `Content-Disposition: inline` (display, bukan download)
- ✅ Set CORS headers untuk cross-origin access
- ✅ Handle 404 dengan error JSON yang informatif

### 2. **Vite Config Update**
**File:** `vite.config.ts`

Update konfigurasi:
- ✅ Include `pdfPlugin()` di plugins array
- ✅ Set `assetsInclude: ['**/*.pdf']`
- ✅ Set `assetsInlineLimit: 0` (jangan inline PDF)

### 3. **EBookReader3D Improvements**
**File:** `src/components/EBookReader3D.tsx`

Changes:
- ✅ Mengganti `<object>` dengan `<iframe>` langsung
- ✅ Menambahkan `onError` handler di iframe
- ✅ Debug logging di console untuk troubleshooting
- ✅ Menambahkan retry mechanism dengan counter

### 4. **Enhanced Error Handling**
- ✅ Graceful fallback ke mode baca interaktif
- ✅ User-friendly error messages
- ✅ Tombol "Buka Tab Baru" untuk alternatif

---

## 🚀 Cara Testing Setelah Fix

### Step 1: Restart Dev Server
```bash
# Stop server yang berjalan (Ctrl+C)

# Start ulang
npm run dev
```

### Step 2: Buka Browser Console
```
F12 → Console tab
```

### Step 3: Buka Buku & Klik "Dokumen PDF"
Setelah klik, cek console log:
```javascript
📄 PDF Viewer Debug: {
  bookId: "gut-2",
  bookTitle: "Max Havelaar",
  resolvedPdfUrl: "/buku_digital/gut-2_Max_Havelaar.pdf",
  bookPdfUrl: "/buku_digital/gut-2_Max_Havelaar.pdf",
  mode: "pdf"
}
```

### Step 4: Verifikasi PDF Loading
Di **Network tab** (F12 → Network), filter `pdf`:
- ✅ Request ke `/buku_digital/...pdf` dengan status **200 OK**
- ✅ Content-Type: **application/pdf**
- ✅ Content-Length: **[ukuran file]**

---

## 🛠 Troubleshooting

### Problem: Masih Muncul Landing Page
**Cause:** Vite server belum restart atau plugin belum loaded

**Solution:**
```bash
# 1. Stop server (Ctrl+C)
# 2. Clear cache
rm -rf node_modules/.vite

# 3. Restart
npm run dev
```

---

### Problem: Console Error "PDF not found"
**Cause:** File PDF memang tidak ada di `public/buku_digital/`

**Solution:**
```bash
# Check file exists
ls public/buku_digital/*.pdf

# Check specific file
ls public/buku_digital/gut-2_Max_Havelaar.pdf

# Run audit
npm run audit-fix
```

---

### Problem: iframe Blank Tapi Tidak Ada Error
**Cause:** Browser block PDF rendering

**Solution:**
1. Klik tombol **"Buka Tab Baru"** di viewer
2. PDF akan terbuka di tab baru
3. Atau gunakan **"Baca Mode Interaktif"**

---

### Problem: CORS Error
**Cause:** Browser security blocking cross-origin PDF

**Solution:**
Plugin sudah set CORS headers. Jika masih error:
```typescript
// Check vite-plugin-pdf.ts
res.setHeader('Access-Control-Allow-Origin', '*'); // Already set
```

---

## 📊 Expected Behavior

### ✅ BENAR (Setelah Fix)
```
User klik "Dokumen PDF"
  ↓
Vite plugin intercept request
  ↓
Set correct MIME type & headers
  ↓
Stream PDF file content
  ↓
iframe render PDF document ✓
```

### ❌ SALAH (Sebelum Fix)
```
User klik "Dokumen PDF"
  ↓
Vite router handle request (salah!)
  ↓
Return index.html (landing page)
  ↓
iframe render landing page ✗
```

---

## 🔍 Manual Test Checklist

- [ ] Restart dev server
- [ ] Buka browser console (F12)
- [ ] Pilih buku dari katalog
- [ ] Klik "Dokumen PDF" di viewer
- [ ] **Expected:** PDF muncul di iframe
- [ ] Check console log untuk debug info
- [ ] Check Network tab untuk request PDF
- [ ] Test tombol "Buka Tab Baru"
- [ ] Test error handling (coba buku dengan PDF missing)

---

## 📝 Files Modified

```
✅ vite.config.ts          - Updated plugins & config
✅ vite-plugin-pdf.ts      - NEW: Custom PDF serving plugin
✅ EBookReader3D.tsx       - Updated iframe & error handling
```

---

## 💡 Alternative Solutions (Jika Masih Error)

### Option 1: Use Google PDF Viewer
```typescript
const pdfUrl = resolveBookPdfUrl(book);
const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + pdfUrl)}&embedded=true`;

<iframe src={googleViewerUrl} />
```

### Option 2: Use PDF.js Library
```bash
npm install pdfjs-dist
```

```typescript
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

<Document file={pdfUrl}>
  <Page pageNumber={1} />
</Document>
```

### Option 3: Force External Open
```typescript
// Buka di tab baru instead of iframe
window.open(pdfUrl, '_blank');
```

---

## 🎯 Next Steps

1. **Restart dev server** dan test
2. **Report results** - Apakah PDF sudah muncul dengan benar?
3. Jika masih error, share:
   - Console logs
   - Network tab screenshot
   - Error message

---

**Status:** ✅ FIX APPLIED - READY FOR TESTING

**Updated:** 2026-09-01

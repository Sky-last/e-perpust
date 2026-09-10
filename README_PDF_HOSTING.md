# 📚 Hosting File PDF - Quick Guide

## 🔴 Masalah
File PDF terlalu besar untuk di-push ke Git → **hosting "mental" (crash) karena PDF tidak ketemu**

## ✅ Solusi Cepat

### Opsi 1: GitHub Pages (Recommended) ⭐

**Langkah Singkat:**
1. Buat repo baru: `perpustakaan-digital-pdf` (public)
2. Jalankan script: `./upload-pdf-to-github.ps1`
3. Enable GitHub Pages di Settings → Pages
4. Update `src/utils/pdfResolver.ts`:
   ```typescript
   const PDF_BASE_URL = import.meta.env.PROD 
     ? 'https://USERNAME.github.io/perpustakaan-digital-pdf'
     : '';
   ```

**Kelebihan:** Gratis unlimited, cepat, reliable

---

### Opsi 2: Google Drive (Tercepat Setup)

1. Upload folder `public/buku_digital/` ke Google Drive
2. Set folder public: "Anyone with the link"
3. Update URL setiap file di `pdfResolver.ts`

**Kelebihan:** Setup 5 menit  
**Kekurangan:** Mungkin lambat, ada rate limit

---

### Opsi 3: Cloudinary (Professional)

1. Daftar gratis: https://cloudinary.com
2. Upload PDF via dashboard
3. Copy URL, update di kode

**Kelebihan:** CDN global, cepat  
**Limit:** 25GB free tier

---

## 🛠️ Script Helper

- `./LIST_PDF_FILES.ps1` - Lihat daftar + ukuran PDF
- `./upload-pdf-to-github.ps1` - Auto upload ke GitHub Pages
- `CARA_HOSTING_PDF.txt` - Panduan lengkap

## 📝 Yang Sudah Diupdate

✅ `src/utils/pdfResolver.ts` - Sudah siap pakai PDF_BASE_URL  
✅ `.gitignore` - PDF tetap di-ignore (jangan push ke main repo)  
✅ Kode sudah support production URL

## 🎯 Next Steps

1. **Pilih hosting** (GitHub Pages recommended)
2. **Upload PDF** ke hosting pilihan
3. **Update** `PDF_BASE_URL` di `pdfResolver.ts` dengan URL hosting
4. **Push** kode ke Git
5. **Deploy** aplikasi

✅ PDF akan loaded dari hosting terpisah!

---

**Need Help?** Baca `CARA_HOSTING_PDF.txt` untuk instruksi detail.

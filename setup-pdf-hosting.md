# Setup PDF Hosting - Langkah Mudah

## Cara Tercepat: GitHub Pages untuk PDF

### Langkah 1: Buat Repository Baru
1. Buka GitHub → Klik "New Repository"
2. Nama: `perpustakaan-digital-pdf`
3. Public
4. Create repository

### Langkah 2: Upload PDF ke Repository Baru
```bash
# Di folder project ini
cd public
git init
git add buku_digital/
git commit -m "Add PDF files"
git branch -M main
git remote add origin https://github.com/USERNAME/perpustakaan-digital-pdf.git
git push -u origin main
```

### Langkah 3: Enable GitHub Pages
1. Buka repository `perpustakaan-digital-pdf`
2. Settings → Pages
3. Source: Deploy from branch `main`
4. Folder: `/ (root)`
5. Save
6. Tunggu 1-2 menit, URL akan jadi: `https://USERNAME.github.io/perpustakaan-digital-pdf/`

### Langkah 4: Update Kode (Sudah saya siapkan di bawah)
File `src/utils/pdfResolver.ts` akan di-update untuk point ke GitHub Pages

---

## Alternatif Lain

### A. Google Drive (Paling Mudah)
1. Upload semua PDF ke Google Drive
2. Klik kanan folder → Share → Change to "Anyone with the link"
3. Copy link folder
4. Gunakan service seperti `https://drive.google.com/uc?export=download&id=FILE_ID`

### B. Cloudinary (Professional, Free 25GB)
1. Daftar di https://cloudinary.com (Free)
2. Upload PDF via dashboard
3. Copy URL untuk setiap file
4. Update `pdfResolver.ts`

### C. Vercel Blob (Kalau pakai Vercel)
```bash
npm i @vercel/blob
```
Upload via Vercel dashboard atau API

---

## Mana yang sebaiknya dipilih?

| Metode | Kelebihan | Kekurangan |
|--------|-----------|------------|
| **GitHub Pages** | Gratis unlimited, cepat, reliable | Setup awal agak ribet |
| **Google Drive** | Paling mudah setup | Kadang lambat, bisa kena rate limit |
| **Cloudinary** | Professional, CDN cepat | Limit 25GB free |
| **Vercel Blob** | Terintegrasi dengan Vercel | Limit 500MB free tier |

**Rekomendasi: GitHub Pages** (gratis unlimited + cepat)

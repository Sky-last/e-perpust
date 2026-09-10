# Panduan Hosting File PDF

## Masalah
File PDF terlalu besar untuk di-push ke Git (melebihi batas GitHub 100MB per file / 1GB total)

## Solusi Terbaik: Upload Manual ke Hosting

### Untuk Vercel/Netlify:
1. **Buat folder `public/buku_digital/` di local**
2. **Upload semua file PDF ke hosting storage:**
   
   **Vercel:**
   - Gunakan Vercel Blob: https://vercel.com/docs/storage/vercel-blob
   - Atau upload manual via FTP/SFTP
   
   **Netlify:**
   - Gunakan Netlify Large Media: https://docs.netlify.com/large-media/overview/
   - Atau drag-and-drop di Netlify Dashboard

3. **Keep `.gitignore` seperti sekarang** (PDF tidak masuk Git)

### Untuk GitHub Pages:
1. Buat repository baru khusus PDF: `perpustakaan-digital-assets`
2. Upload semua PDF ke sana
3. Enable GitHub Pages untuk repo assets
4. Update `pdfResolver.ts` untuk point ke URL GitHub Pages:
   ```typescript
   const PDF_BASE_URL = "https://yourusername.github.io/perpustakaan-digital-assets/buku_digital/";
   ```

### Alternatif: Gunakan CDN Gratis
Upload PDF ke:
- **Cloudinary** (Free tier: 25GB storage)
- **imgbb** (Free unlimited storage)
- **Google Drive** (15GB free, set public link)
- **Dropbox** (2GB free, set public link)

## Cara Update URL di Kode

Edit `src/utils/pdfResolver.ts`:
```typescript
// Tambah base URL untuk production
const PDF_BASE_URL = import.meta.env.PROD 
  ? "https://your-cdn-url.com/buku_digital/" 
  : "/buku_digital/";

export const sanitizePdfPath = (rawUrl: string): string => {
  // ... existing code ...
  
  // Prepend base URL for production
  if (import.meta.env.PROD && !clean.startsWith('http')) {
    return PDF_BASE_URL + clean.replace('/buku_digital/', '');
  }
  
  return clean;
};
```

## Rekomendasi
**Untuk production website perpustakaan:** Gunakan **Vercel Blob** atau **Cloudinary** karena:
- Fast CDN delivery
- Tidak membebani Git repository
- Easy to manage
- Professional solution

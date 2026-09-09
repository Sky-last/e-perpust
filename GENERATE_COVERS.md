# 📚 Panduan Generate Cover Buku dari PDF

Dokumen ini menjelaskan cara mengekstrak cover (halaman pertama) dari file PDF dan menggunakannya sebagai sampul buku di aplikasi.

## 🎯 Tujuan

Mengubah sampul buku dari gradien warna menjadi cover asli dari halaman pertama file PDF.

## 📋 Metode yang Tersedia

Ada 2 metode yang bisa digunakan:

### Metode 1: Python Script (Recommended) ✅

**Kelebihan:**
- Lebih mudah di-setup
- Library yang matang (pdf2image)
- Kualitas gambar bagus

**Cara Install Dependencies:**

1. Install Python (jika belum ada): https://www.python.org/downloads/

2. Install library Python:
```bash
pip install pdf2image Pillow
```

3. Install Poppler (diperlukan untuk pdf2image):

   **Windows:**
   - Download Poppler dari: https://github.com/oschwartz10612/poppler-windows/releases/
   - Extract file ZIP
   - Tambahkan folder `bin/` ke PATH system
   - Atau letakkan folder `poppler-xx/Library/bin` di C:\Program Files\

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get install poppler-utils
   ```

   **Mac:**
   ```bash
   brew install poppler
   ```

**Cara Menjalankan:**
```bash
python scripts/generate_pdf_covers_python.py
```

### Metode 2: Node.js Script

**Cara Install Dependencies:**
```bash
npm install pdf-poppler sharp canvas pdfjs-dist
```

**Cara Menjalankan:**
```bash
npm run generate:covers
```

## 📂 Struktur Folder

```
project/
├── public/
│   ├── buku_digital/          # File PDF sumber
│   │   ├── Book1.pdf
│   │   ├── Book2.pdf
│   │   └── ...
│   └── buku_sampul/           # Cover hasil ekstraksi (akan dibuat otomatis)
│       ├── cover_Book1.jpg
│       ├── cover_Book2.jpg
│       └── ...
```

## 🔄 Proses

1. Script akan membaca semua file PDF dari folder `public/buku_digital/`
2. Untuk setiap PDF, ekstrak halaman pertama
3. Simpan sebagai JPG di folder `public/buku_sampul/` dengan nama `cover_NamaFile.jpg`
4. Skip file jika cover sudah ada (tidak overwrite)

## ✅ Hasil

Setelah menjalankan script:
- Cover akan tersimpan di `public/buku_sampul/`
- Aplikasi akan otomatis menggunakan cover JPG jika tersedia
- Jika cover tidak tersedia, akan fallback ke gradien warna

## 🎨 Kualitas Output

- Format: JPEG
- Kualitas: 95% (high quality)
- Resolusi: 300 DPI (untuk Python) atau 2x scale (untuk Node.js)
- Max width: 1200px (auto-resize jika lebih besar)

## 🐛 Troubleshooting

### Error: "poppler not found" atau "Unable to get page count"

**Solusi Windows:**
1. Download Poppler: https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract ke folder (misal: `C:\poppler-xx.xx.x`)
3. Tambahkan path `C:\poppler-xx.xx.x\Library\bin` ke Environment Variable PATH:
   - Buka "Edit the system environment variables"
   - Klik "Environment Variables"
   - Di "System variables", cari "Path", klik "Edit"
   - Klik "New" dan tambahkan path bin poppler
   - Klik OK semua dialog
4. Restart terminal/cmd
5. Tes dengan: `pdfinfo -v`

**Solusi Linux:**
```bash
sudo apt-get update
sudo apt-get install poppler-utils
```

**Solusi Mac:**
```bash
brew install poppler
```

### Error: "pdf2image not found"

**Solusi:**
```bash
pip install pdf2image
```

### Error: "No module named 'PIL'"

**Solusi:**
```bash
pip install Pillow
```

## 📝 Notes

- Script akan skip file yang sudah memiliki cover (tidak overwrite)
- Untuk regenerate cover yang sudah ada, hapus dulu file JPG di folder `buku_sampul/`
- Proses ekstraksi membutuhkan waktu tergantung jumlah PDF (sekitar 2-3 detik per file)
- Pastikan ada space disk yang cukup (setiap cover sekitar 100-500KB)

## 🚀 Quick Start

**Cara paling cepat (Python):**

```bash
# 1. Install dependencies
pip install pdf2image Pillow

# 2. Install Poppler (Windows: download & extract, Linux/Mac: package manager)

# 3. Jalankan script
python scripts/generate_pdf_covers_python.py

# 4. Refresh aplikasi untuk melihat cover baru
```

## 🎉 Selesai!

Setelah cover ter-generate, refresh aplikasi Anda dan buku-buku akan menampilkan cover asli dari PDF!

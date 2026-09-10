# Script untuk upload PDF ke GitHub Pages
# Cara pakai: ./upload-pdf-to-github.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📚 Upload PDF ke GitHub Pages Helper Script" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Minta username GitHub
$username = Read-Host "Masukkan username GitHub Anda"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Username: $username" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Buat repository baru di GitHub dengan nama: perpustakaan-digital-pdf"
Write-Host "2. Pastikan repository bersifat PUBLIC"
Write-Host "3. Jangan centang 'Add README'"
Write-Host ""
$confirm = Read-Host "Sudah buat repository? (y/n)"

if ($confirm -ne "y") {
    Write-Host "⏸️  Silakan buat repository dulu, lalu jalankan script ini lagi." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Memulai proses upload..." -ForegroundColor Cyan
Write-Host ""

# Pindah ke folder public
Set-Location public

# Init git
Write-Host "📦 Inisialisasi Git..." -ForegroundColor Cyan
git init

# Add files
Write-Host "➕ Menambahkan file PDF..." -ForegroundColor Cyan
git add buku_digital/

# Commit
Write-Host "💾 Commit files..." -ForegroundColor Cyan
git commit -m "Add PDF library files"

# Set branch
Write-Host "🌿 Set branch main..." -ForegroundColor Cyan
git branch -M main

# Add remote
Write-Host "🔗 Menghubungkan ke GitHub..." -ForegroundColor Cyan
$repoUrl = "https://github.com/$username/perpustakaan-digital-pdf.git"
git remote add origin $repoUrl

# Push
Write-Host "🚀 Upload ke GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "   ✅ UPLOAD BERHASIL!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 LANGKAH SELANJUTNYA:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Buka: https://github.com/$username/perpustakaan-digital-pdf" -ForegroundColor White
    Write-Host "2. Klik tab 'Settings'" -ForegroundColor White
    Write-Host "3. Klik 'Pages' di sidebar kiri" -ForegroundColor White
    Write-Host "4. Source: pilih branch 'main', folder '/ (root)'" -ForegroundColor White
    Write-Host "5. Klik 'Save'" -ForegroundColor White
    Write-Host "6. Tunggu 2-3 menit, URL akan aktif:" -ForegroundColor White
    Write-Host ""
    Write-Host "   https://$username.github.io/perpustakaan-digital-pdf" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "7. Buka file: src/utils/pdfResolver.ts" -ForegroundColor White
    Write-Host "8. Ganti baris:" -ForegroundColor White
    Write-Host "   const PDF_BASE_URL = import.meta.env.PROD ? '' ..." -ForegroundColor Gray
    Write-Host "   Menjadi:" -ForegroundColor White
    Write-Host "   const PDF_BASE_URL = import.meta.env.PROD ? 'https://$username.github.io/perpustakaan-digital-pdf' : '';" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Selesai!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Upload gagal! Cek error di atas." -ForegroundColor Red
    Write-Host "Mungkin repository belum dibuat atau URL salah." -ForegroundColor Yellow
}

# Kembali ke root
Set-Location ..

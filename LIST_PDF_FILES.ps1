# Script untuk list semua file PDF (memudahkan upload manual)
# Output: list file + ukuran untuk upload ke Google Drive/Cloudinary

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📋 Daftar File PDF" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$pdfPath = "public\buku_digital"

if (-Not (Test-Path $pdfPath)) {
    Write-Host "❌ Folder $pdfPath tidak ditemukan!" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem -Path $pdfPath -Filter *.pdf -File
$totalSize = 0

Write-Host "Ditemukan $($files.Count) file PDF:" -ForegroundColor Green
Write-Host ""
Write-Host ("{0,-50} {1,10}" -f "Nama File", "Ukuran") -ForegroundColor Yellow
Write-Host ("-" * 65) -ForegroundColor Gray

foreach ($file in $files) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    $totalSize += $file.Length
    
    $sizeStr = if ($sizeMB -lt 1) {
        "$([math]::Round($file.Length / 1KB, 0)) KB"
    } else {
        "$sizeMB MB"
    }
    
    Write-Host ("{0,-50} {1,10}" -f $file.Name, $sizeStr)
}

Write-Host ("-" * 65) -ForegroundColor Gray
$totalMB = [math]::Round($totalSize / 1MB, 2)
$totalGB = [math]::Round($totalSize / 1GB, 2)

Write-Host ""
Write-Host "📊 TOTAL:" -ForegroundColor Cyan
Write-Host "   File: $($files.Count)" -ForegroundColor White
Write-Host "   Ukuran: $totalMB MB ($totalGB GB)" -ForegroundColor White
Write-Host ""

# Rekomendasi
Write-Host "💡 REKOMENDASI HOSTING:" -ForegroundColor Yellow
Write-Host ""

if ($totalGB -lt 0.5) {
    Write-Host "   ✅ Bisa pakai Vercel Blob (limit 500MB free)" -ForegroundColor Green
}

if ($totalGB -lt 15) {
    Write-Host "   ✅ Bisa pakai Google Drive (limit 15GB free)" -ForegroundColor Green
}

if ($totalGB -lt 25) {
    Write-Host "   ✅ Bisa pakai Cloudinary (limit 25GB free)" -ForegroundColor Green
}

Write-Host "   ✅ Bisa pakai GitHub Pages (unlimited free)" -ForegroundColor Green
Write-Host ""

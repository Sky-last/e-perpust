/**
 * Script untuk mengekstrak cover (halaman pertama) dari file PDF
 * dan menyimpannya sebagai gambar JPG di folder public/buku_sampul
 * 
 * Cara menjalankan:
 * 1. Install dependencies: npm install pdf-poppler sharp
 * 2. Jalankan: npm run generate:covers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.join(__dirname, '..', 'public', 'buku_digital');
const COVER_DIR = path.join(__dirname, '..', 'public', 'buku_sampul');

// Pastikan folder cover ada
if (!fs.existsSync(COVER_DIR)) {
  fs.mkdirSync(COVER_DIR, { recursive: true });
  console.log('✅ Folder buku_sampul dibuat');
}

// Fungsi untuk generate cover menggunakan pdf-poppler
async function generateCoverWithPoppler(pdfPath: string, outputPath: string): Promise<boolean> {
  try {
    // Import pdf-poppler secara dinamis
    const poppler = await import('pdf-poppler');
    
    const opts = {
      format: 'jpeg',
      out_dir: path.dirname(outputPath),
      out_prefix: path.basename(outputPath, '.jpg'),
      page: 1, // Hanya halaman pertama
      scale: 2048, // Resolusi tinggi
    };

    await poppler.convert(pdfPath, opts);
    
    // Rename file hasil (pdf-poppler menambahkan -1.jpg)
    const generatedFile = path.join(
      path.dirname(outputPath),
      `${path.basename(outputPath, '.jpg')}-1.jpg`
    );
    
    if (fs.existsSync(generatedFile)) {
      fs.renameSync(generatedFile, outputPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error dengan poppler: ${error}`);
    return false;
  }
}

// Fungsi alternatif menggunakan canvas (Node.js canvas)
async function generateCoverWithCanvas(pdfPath: string, outputPath: string): Promise<boolean> {
  try {
    // Import pdfjs-dist dan canvas secara dinamis
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { createCanvas } = await import('canvas');
    
    // Load PDF
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdfDocument = await loadingTask.promise;
    
    // Ambil halaman pertama
    const page = await pdfDocument.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    
    // Buat canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    // Render PDF ke canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Simpan sebagai JPG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(outputPath, buffer);
    
    return true;
  } catch (error) {
    console.error(`❌ Error dengan canvas: ${error}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Memulai ekstraksi cover dari PDF...\n');
  
  // Baca semua file PDF
  const pdfFiles = fs.readdirSync(PDF_DIR).filter(file => file.endsWith('.pdf'));
  
  console.log(`📚 Ditemukan ${pdfFiles.length} file PDF\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(PDF_DIR, pdfFile);
    const coverFileName = `cover_${pdfFile.replace('.pdf', '.jpg')}`;
    const coverPath = path.join(COVER_DIR, coverFileName);
    
    // Skip jika cover sudah ada
    if (fs.existsSync(coverPath)) {
      console.log(`⏭️  Skip: ${pdfFile} (cover sudah ada)`);
      skipCount++;
      continue;
    }
    
    console.log(`🔄 Proses: ${pdfFile}...`);
    
    // Coba generate cover
    let success = false;
    
    // Metode 1: Coba dengan pdf-poppler (paling reliable)
    try {
      success = await generateCoverWithPoppler(pdfPath, coverPath);
    } catch (e) {
      console.log('   ℹ️  pdf-poppler tidak tersedia, coba metode lain...');
    }
    
    // Metode 2: Coba dengan canvas jika poppler gagal
    if (!success) {
      try {
        success = await generateCoverWithCanvas(pdfPath, coverPath);
      } catch (e) {
        console.log('   ℹ️  canvas tidak tersedia');
      }
    }
    
    if (success) {
      console.log(`   ✅ Berhasil: ${coverFileName}`);
      successCount++;
    } else {
      console.log(`   ❌ Gagal: ${pdfFile}`);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RINGKASAN:');
  console.log(`   ✅ Berhasil: ${successCount}`);
  console.log(`   ⏭️  Dilewati: ${skipCount}`);
  console.log(`   ❌ Gagal: ${errorCount}`);
  console.log(`   📚 Total: ${pdfFiles.length}`);
  console.log('='.repeat(60));
  
  if (errorCount > 0) {
    console.log('\n💡 Tips: Install dependencies yang diperlukan:');
    console.log('   npm install pdf-poppler sharp canvas pdfjs-dist');
  }
}

// Jalankan
main().catch(console.error);

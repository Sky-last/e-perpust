const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.resolve(__dirname, '../assets/buku digital');
const PUBLIC_PDF_DIR = path.resolve(__dirname, '../public/buku_digital');
const PUBLIC_COVER_DIR = path.resolve(__dirname, '../public/buku_sampul');
const POPPLER_EXE = path.resolve(__dirname, '../.poppler/poppler-24.08.0/Library/bin/pdftoppm.exe');

if (!fs.existsSync(PUBLIC_PDF_DIR)) fs.mkdirSync(PUBLIC_PDF_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_COVER_DIR)) fs.mkdirSync(PUBLIC_COVER_DIR, { recursive: true });

const pdfFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.pdf'));
console.log(`Found ${pdfFiles.length} PDF files in assets/buku digital`);

// 1. Copy missing PDF files to public/buku_digital
let copiedCount = 0;
for (const file of pdfFiles) {
  const src = path.join(ASSETS_DIR, file);
  const dest = path.join(PUBLIC_PDF_DIR, file);
  if (!fs.existsSync(dest) || fs.statSync(dest).size !== fs.statSync(src).size) {
    fs.copyFileSync(src, dest);
    copiedCount++;
  }
}
console.log(`Copied ${copiedCount} files to public/buku_digital`);

// Helper to make safe id
function makeSafeId(filename, index) {
  // e.g. real_bks_1_Syifa_dan_Burung_Kenari.pdf -> bks-1
  const bksMatch = filename.match(/^real_bks_(\d+)/i);
  if (bksMatch) return `bks-${bksMatch[1]}`;
  
  const gutMatch = filename.match(/^gut-(\d+)/i);
  if (gutMatch) return `gut-${gutMatch[1]}`;

  return `pdf-${index}`;
}

// 2. Generate covers for all files
const results = [];
let generatedCovers = 0;
let existingCovers = 0;

for (let i = 0; i < pdfFiles.length; i++) {
  const filename = pdfFiles[i];
  const safeId = makeSafeId(filename, i + 1);
  const pdfPath = path.join(PUBLIC_PDF_DIR, filename);
  
  // Clean cover filename
  const coverFileName = `cover_${safeId}.jpg`;
  const finalCoverPath = path.join(PUBLIC_COVER_DIR, coverFileName);

  if (fs.existsSync(finalCoverPath) && fs.statSync(finalCoverPath).size > 1000) {
    existingCovers++;
    results.push({ id: safeId, filename, coverFileName, status: 'existing' });
    continue;
  }

  const tempPrefix = path.join(PUBLIC_COVER_DIR, `temp_${safeId}`);
  try {
    // Run pdftoppm to extract page 1
    execSync(`"${POPPLER_EXE}" -jpeg -r 150 -f 1 -l 1 "${pdfPath}" "${tempPrefix}"`, {
      stdio: 'pipe',
      timeout: 30000
    });

    // pdftoppm produces temp_<safeId>-1.jpg or temp_<safeId>-001.jpg
    const tempFile1 = `${tempPrefix}-1.jpg`;
    const tempFile001 = `${tempPrefix}-001.jpg`;
    let foundTemp = null;
    if (fs.existsSync(tempFile1)) foundTemp = tempFile1;
    else if (fs.existsSync(tempFile001)) foundTemp = tempFile001;

    if (foundTemp) {
      if (fs.existsSync(finalCoverPath)) fs.unlinkSync(finalCoverPath);
      fs.renameSync(foundTemp, finalCoverPath);
      generatedCovers++;
      results.push({ id: safeId, filename, coverFileName, status: 'generated' });
      process.stdout.write(`[${i+1}/${pdfFiles.length}] Generated cover for: ${filename.slice(0, 30)}...\n`);
    } else {
      console.warn(`[${i+1}/${pdfFiles.length}] No temp image generated for: ${filename}`);
      results.push({ id: safeId, filename, coverFileName: null, status: 'failed' });
    }
  } catch (err) {
    console.error(`[${i+1}/${pdfFiles.length}] Error generating cover for ${filename}:`, err.message);
    results.push({ id: safeId, filename, coverFileName: null, status: 'error' });
  }
}

console.log(`\nCover Generation Summary:`);
console.log(`- Existing: ${existingCovers}`);
console.log(`- Newly Generated: ${generatedCovers}`);
console.log(`- Total: ${results.length}`);

fs.writeFileSync(path.resolve(__dirname, 'cover_generation_results.json'), JSON.stringify(results, null, 2));

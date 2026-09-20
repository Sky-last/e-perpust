import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

const inputHtml = path.resolve('dokumentasi_fitur_perpustakaan.html');
const outputPdf = path.resolve('Dokumentasi_Fitur_Perpustakaan_Digital.pdf');
const tempDir = path.resolve('scripts', 'temp_browser_profile');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('Using browser:', browserPath);
console.log('Input HTML:', inputHtml);
console.log('Output PDF:', outputPdf);

try {
  execFileSync(browserPath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${tempDir}`,
    '--no-pdf-header-footer',
    `--print-to-pdf=${outputPdf}`,
    `file:///${inputHtml.replace(/\\/g, '/')}`
  ], {
    timeout: 30000,
    stdio: 'inherit'
  });

  if (fs.existsSync(outputPdf)) {
    const stats = fs.statSync(outputPdf);
    console.log(`SUCCESS! PDF generated successfully: ${outputPdf} (${stats.size} bytes)`);
  } else {
    console.error('ERROR: Output PDF file was not created.');
  }
} catch (err) {
  console.error('Failed to run browser:', err);
} finally {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
}

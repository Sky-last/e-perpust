const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ssfwcicixgkyptxbarsz.supabase.co';
// Can use anon key (if upload policy is enabled) or service_role key
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KHJ1EgTcX3Kw6UyHYru68Q_v_Uy66aB';
const BUCKET_NAME = 'buku_digital';

const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'clean_catalog.json'), 'utf8'));

async function uploadFile(localPath, remotePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodeURIComponent(remotePath)}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true'
    },
    body: fileBuffer
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Status ${response.status}: ${errText}`);
  }

  return true;
}

async function main() {
  console.log('🚀 Mulai upload file PDF ke Supabase Storage bucket:', BUCKET_NAME);
  console.log(`📚 Total buku di katalog: ${catalog.length}`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < catalog.length; i++) {
    const book = catalog[i];
    const filename = path.basename(book.pdfUrl);
    const localPath = path.resolve(__dirname, '../public/buku_digital', filename);

    if (!fs.existsSync(localPath)) {
      console.log(`⚠️ [${i + 1}/${catalog.length}] File lokal tidak ditemukan: ${filename}`);
      failCount++;
      continue;
    }

    const fileSizeMB = (fs.statSync(localPath).size / (1024 * 1024)).toFixed(2);
    process.stdout.write(`⏳ [${i + 1}/${catalog.length}] Uploading ${filename} (${fileSizeMB} MB)... `);

    try {
      await uploadFile(localPath, filename);
      console.log('✅ Berhasil!');
      successCount++;
    } catch (err) {
      console.log('❌ Gagal:', err.message);
      failCount++;
    }
  }

  console.log('\n--- Selesai ---');
  console.log(`✅ Berhasil: ${successCount}`);
  console.log(`❌ Gagal: ${failCount}`);
  console.log(`🌐 Base URL Storage: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`);
}

main().catch(console.error);

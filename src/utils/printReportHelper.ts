import { Book, Category, SiteSettings, User } from '../types';

interface PrintReportOptions {
  siteSettings?: SiteSettings;
  books: Book[];
  categories: Category[];
  users: User[];
  allDownloads: Array<{
    id: string;
    userName: string;
    userEmail: string;
    identityNumber?: string;
    bookId: string;
    bookTitle: string;
    category?: string;
    downloadDate: string;
  }>;
  adminUser?: User;
}

export function printOfficialReport({
  siteSettings,
  books,
  categories,
  users,
  allDownloads,
  adminUser
}: PrintReportOptions) {
  const libraryName = siteSettings?.libraryName || 'PERPUSTAKAAN KITA';
  const libraryAddress = siteSettings?.contactAddress || 'Jl. Pemuda No. 123, Kompleks Pendidikan Utama, Jakarta Pusat 10110';
  const libraryPhone = siteSettings?.contactPhone || '+62 812-3456-7890 / (021) 555-0192';
  const libraryEmail = siteSettings?.contactEmail || 'layanan@pustakadigital.sch.id';

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const reportNo = `REF-REP/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`;

  // Category counts
  const categoryStats = categories.map(cat => {
    const count = books.filter(b => b.categoryId === cat.id).length;
    const percentage = books.length > 0 ? ((count / books.length) * 100).toFixed(1) : '0';
    return { name: cat.name, count, percentage };
  });

  // Top books
  const topBooks = books
    .map(book => ({
      ...book,
      downloadCount: allDownloads.filter(d => d.bookId === book.id).length
    }))
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 10);

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Pop-up blocker aktif! Mohon izinkan pop-up browser untuk mencetak PDF Laporan.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Laporan Rekapitulasi - ${libraryName}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm 15mm 20mm 15mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif, Arial, sans-serif;
          color: #111827;
          background: #ffffff;
          margin: 0;
          padding: 20px;
          font-size: 12px;
          line-height: 1.5;
        }

        /* Kop Surat Resmi */
        .kop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px double #000000;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .kop-logo {
          width: 65px;
          height: 65px;
          background: #1e3a8a;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }
        .kop-info {
          text-align: center;
          flex: 1;
          padding: 0 15px;
        }
        .kop-info h1 {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f172a;
        }
        .kop-info h2 {
          font-size: 12px;
          font-weight: bold;
          margin: 2px 0 0 0;
          color: #1e293b;
          text-transform: uppercase;
        }
        .kop-info p {
          font-size: 10px;
          margin: 3px 0 0 0;
          color: #475569;
        }

        /* Title Box */
        .report-title-box {
          text-align: center;
          margin-bottom: 20px;
        }
        .report-title-box h3 {
          font-size: 14px;
          font-weight: bold;
          text-decoration: underline;
          margin: 0;
          text-transform: uppercase;
        }
        .report-title-box p {
          font-size: 11px;
          color: #334155;
          margin: 4px 0 0 0;
        }

        /* Metadata Grid */
        .meta-table {
          width: 100%;
          margin-bottom: 20px;
          font-size: 11px;
          border-collapse: collapse;
        }
        .meta-table td {
          padding: 4px 8px;
          vertical-align: top;
        }
        .meta-label {
          font-weight: bold;
          width: 130px;
          color: #334155;
        }

        /* Executive Summary Cards Grid */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .summary-card {
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px 12px;
          text-align: center;
        }
        .summary-card .val {
          font-size: 18px;
          font-weight: bold;
          color: #1e3a8a;
          margin-top: 2px;
        }
        .summary-card .lbl {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
          color: #64748b;
        }

        /* Section Header */
        .section-header {
          font-size: 12px;
          font-weight: bold;
          color: #0f172a;
          border-bottom: 1.5px solid #0f172a;
          padding-bottom: 4px;
          margin: 22px 0 10px 0;
          text-transform: uppercase;
        }

        /* Standard Table Styles */
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        .data-table th, .data-table td {
          border: 1px solid #94a3b8;
          padding: 6px 8px;
          text-align: left;
        }
        .data-table th {
          background-color: #e2e8f0;
          color: #0f172a;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 10px;
        }
        .data-table tr:nth-child(even) {
          background-color: #f8fafc;
        }

        /* Signature Footer */
        .signature-container {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .signature-box {
          width: 220px;
          text-align: center;
          font-size: 11px;
        }
        .signature-space {
          height: 65px;
        }
        .signature-name {
          font-weight: bold;
          text-decoration: underline;
        }

        .footer-note {
          margin-top: 30px;
          font-size: 9px;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
        }

        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>

      <!-- Kop Surat -->
      <div class="kop-header">
        <div class="kop-logo">📚</div>
        <div class="kop-info">
          <h1>${libraryName}</h1>
          <h2>Layanan Literasi & Perpustakaan Digital Indonesia</h2>
          <p>${libraryAddress}</p>
          <p>Email: ${libraryEmail} | Telp: ${libraryPhone}</p>
        </div>
        <div style="width: 65px;"></div>
      </div>

      <!-- Judul Laporan -->
      <div class="report-title-box">
        <h3>LAPORAN REKAPITULASI AKTIVITAS & SIRKULASI E-BOOK</h3>
        <p>Nomor Dokumen: ${reportNo}</p>
      </div>

      <!-- Informasi Metadata -->
      <table class="meta-table">
        <tr>
          <td class="meta-label">Tanggal Cetak</td>
          <td>: ${todayStr}</td>
          <td class="meta-label">Total Judul Buku</td>
          <td>: ${books.length} Judul</td>
        </tr>
        <tr>
          <td class="meta-label">Dicetak Oleh</td>
          <td>: ${adminUser?.name || 'Administrator Perpustakaan'} (${adminUser?.email || 'admin@pustaka.com'})</td>
          <td class="meta-label">Total Pemustaka</td>
          <td>: ${users.length} Anggota</td>
        </tr>
      </table>

      <!-- Executive Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="lbl">Total Koleksi</div>
          <div class="val">${books.length}</div>
        </div>
        <div class="summary-card">
          <div class="lbl">Total Unduhan</div>
          <div class="val">${allDownloads.length}</div>
        </div>
        <div class="summary-card">
          <div class="lbl">Anggota Terdaftar</div>
          <div class="val">${users.length}</div>
        </div>
        <div class="summary-card">
          <div class="lbl">Total Kategori</div>
          <div class="val">${categories.length}</div>
        </div>
      </div>

      <!-- Tabel 1: Sirkulasi Unduhan Terkini -->
      <div class="section-header">I. Riwayat Sirkulasi Unduhan E-Book Terbaru</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th>Nama Pemustaka</th>
            <th>Email</th>
            <th>Judul Buku</th>
            <th>Kategori</th>
            <th style="width: 120px;">Tanggal Unduh</th>
            <th style="width: 80px; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${allDownloads.slice(0, 15).map((dl, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td><strong>${dl.userName}</strong></td>
              <td>${dl.userEmail}</td>
              <td>${dl.bookTitle}</td>
              <td>${dl.category || '-'}</td>
              <td>${new Date(dl.downloadDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
              <td style="text-align: center; font-weight: bold; color: #166534;">Berhasil</td>
            </tr>
          `).join('')}
          ${allDownloads.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Belum ada riwayat unduhan e-book.</td></tr>' : ''}
        </tbody>
      </table>

      <!-- Tabel 2: Top 10 Buku Populer -->
      <div class="section-header">II. 10 Koleksi E-Book Paling Populer (Banyak Diunduh)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">Peringkat</th>
            <th>Judul Buku</th>
            <th>Penulis</th>
            <th>Kategori</th>
            <th style="width: 100px; text-align: right;">Total Diunduh</th>
          </tr>
        </thead>
        <tbody>
          ${topBooks.map((b, i) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">#${i + 1}</td>
              <td><strong>${b.title}</strong></td>
              <td>${b.author}</td>
              <td>${b.category}</td>
              <td style="text-align: right; font-weight: bold; color: #1e3a8a;">${b.downloadCount}x Unduh</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Tabel 3: Distribusi Kategori -->
      <div class="section-header">III. Distribusi Koleksi Berdasarkan Kategori</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th>Nama Kategori Genre</th>
            <th style="width: 130px; text-align: right;">Jumlah Judul Buku</th>
            <th style="width: 120px; text-align: right;">Persentase Koleksi</th>
          </tr>
        </thead>
        <tbody>
          ${categoryStats.map((c, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td><strong>${c.name}</strong></td>
              <td style="text-align: right;">${c.count} Judul</td>
              <td style="text-align: right; font-weight: bold;">${c.percentage}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Tanda Tangan & Pengesahan -->
      <div class="signature-container">
        <div class="signature-box">
          <p>Mengetahui,</p>
          <p><strong>Kepala Perpustakaan</strong></p>
          <div class="signature-space"></div>
          <p class="signature-name">( Dra. Hj. Sri Wahyuni, M.Pd )</p>
          <p>NIP. 197005121995122001</p>
        </div>

        <div class="signature-box">
          <p>Jakarta, ${todayStr}</p>
          <p><strong>Petugas Administrator</strong></p>
          <div class="signature-space"></div>
          <p class="signature-name">( ${adminUser?.name || 'Admin Perpustakaan'} )</p>
          <p>Staff Pengelola Sistem</p>
        </div>
      </div>

      <div class="footer-note">
        Dokumen laporan resmi ini dihasilkan secara otomatis oleh Sistem Perpustakaan Digital ${libraryName} pada ${todayStr}.
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

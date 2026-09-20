/**
 * Utility untuk mengunduh file (khususnya file PDF buku digital)
 * Menangani kompatibilitas mobile browser (Chrome Android, Safari iOS)
 * dengan mengunduh stream Blob dan memicu event download lokal.
 */

export async function downloadPdfFile(pdfUrl: string, rawFilename: string): Promise<boolean> {
  const cleanName = rawFilename
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim();
  const filename = cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

  try {
    // 1. Coba fetch sebagai Blob untuk memaksa browser menyimpan file fisik ke memori/folder Download
    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf,application/octet-stream,*/*'
      },
      mode: 'cors'
    });

    if (response.ok) {
      const blob = await response.blob();
      // Pastikan mime-type adalah application/pdf
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(pdfBlob);

      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(objectUrl);
      }, 30000);

      return true;
    }
  } catch (err) {
    console.warn('Direct blob fetch failed (mungkin dibatasi CORS), mencoba fallback unduhan langsung:', err);
  }

  // 2. Fallback jika CORS mencegah fetch Blob: buat tag anchor langsung
  try {
    const anchor = document.createElement('a');
    anchor.href = pdfUrl;
    anchor.download = filename;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
    }, 5000);

    return true;
  } catch (err) {
    console.error('Semua metode download gagal:', err);
    // 3. Fallback terakhir: buka URL di tab baru
    window.open(pdfUrl, '_blank');
    return false;
  }
}

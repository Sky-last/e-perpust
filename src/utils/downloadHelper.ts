/**
 * Utility untuk mengunduh file (khususnya file PDF buku digital)
 * Menangani kompatibilitas mobile browser (Chrome Android, Safari iOS, WebView)
 */

function dataURItoBlob(dataURI: string): Blob {
  try {
    const parts = dataURI.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const byteString = atob(parts[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  } catch (e) {
    console.error('Error converting data URI to Blob:', e);
    return new Blob([], { type: 'application/pdf' });
  }
}

export async function downloadPdfFile(pdfUrl: string, rawFilename: string): Promise<boolean> {
  if (!pdfUrl) return false;

  const cleanName = rawFilename
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim();
  const filename = cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

  // 1. Tangani Data URI / Base64 PDF
  if (pdfUrl.startsWith('data:')) {
    try {
      const blob = dataURItoBlob(pdfUrl);
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        if (document.body.contains(anchor)) document.body.removeChild(anchor);
        window.URL.revokeObjectURL(objectUrl);
      }, 10000);
      return true;
    } catch (err) {
      console.warn('Data URI download error:', err);
    }
  }

  // 2. Tangani URL biasa (HTTP/HTTPS/Supabase Public URL)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf,application/octet-stream,*/*'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(pdfBlob);

      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        if (document.body.contains(anchor)) document.body.removeChild(anchor);
        window.URL.revokeObjectURL(objectUrl);
      }, 10000);

      return true;
    }
  } catch (err) {
    console.warn('Blob fetch failed (CORS/Mobile restriction), using fallback link trigger:', err);
  }

  // 3. Fallback Utama Mobile (Direct Anchor Element / Open Tab)
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
    console.error('All download methods failed, fallback to window.open:', err);
    try {
      window.open(pdfUrl, '_blank');
      return true;
    } catch (_e) {
      return false;
    }
  }
}

/**
 * PDF Security Middleware & Validation Utilities
 * 
 * Purpose:
 * - Prevent directory traversal attacks on PDF endpoint
 * - Validate file integrity before serving
 * - Handle CORS & access control
 * - Sanitize all PDF URLs before rendering
 * 
 * SECURITY RULES:
 * 1. Only allow files from /buku_digital/ directory
 * 2. Block all ../ and ..\ patterns
 * 3. Validate file exists and readable before serving
 * 4. Check file size to detect corrupt/empty PDFs
 * 5. Enforce allowed file extensions (.pdf only)
 */

import { sanitizePdfPath as sanitize } from './pdfResolver';

export interface PdfValidationResult {
  isValid: boolean;
  sanitizedPath: string;
  error?: string;
  errorType?: 'not_found' | 'corrupted' | 'invalid_path' | 'security_violation' | 'network_error';
}

const ALLOWED_DIRECTORY = '/buku_digital/';
const ALLOWED_EXTENSION = '.pdf';
const MIN_FILE_SIZE = 100; // bytes
const DANGEROUS_PATTERNS = [
  /\.\./g,           // Directory traversal
  /\0/g,             // Null byte injection
  /%2e%2e/gi,        // URL-encoded traversal
  /\.\.%2f/gi,       // Mixed encoding
  /\.\.%5c/gi,       // Windows path traversal
  /\\/g,             // Windows backslash (should use forward slash)
];

/**
 * Validates and sanitizes a PDF path request
 * Returns validation result with sanitized path or error
 */
export function validatePdfPath(rawPath: string): PdfValidationResult {
  // Step 1: Basic input validation
  if (!rawPath || typeof rawPath !== 'string' || rawPath.trim() === '') {
    return {
      isValid: false,
      sanitizedPath: '',
      error: 'Path PDF kosong atau tidak valid',
      errorType: 'invalid_path'
    };
  }

  // Step 2: Check for dangerous patterns (security check)
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(rawPath)) {
      console.warn(`[SECURITY] Attempted directory traversal or injection: ${rawPath}`);
      return {
        isValid: false,
        sanitizedPath: '',
        error: 'Path mengandung karakter berbahaya atau percobaan directory traversal',
        errorType: 'security_violation'
      };
    }
  }

  // Step 3: Sanitize the path
  const sanitized = sanitize(rawPath);

  // Step 4: Validate sanitized path structure
  if (!sanitized.startsWith(ALLOWED_DIRECTORY)) {
    return {
      isValid: false,
      sanitizedPath: sanitized,
      error: `Path harus berada di dalam direktori ${ALLOWED_DIRECTORY}`,
      errorType: 'security_violation'
    };
  }

  // Step 5: Validate file extension
  if (!sanitized.toLowerCase().endsWith(ALLOWED_EXTENSION)) {
    return {
      isValid: false,
      sanitizedPath: sanitized,
      error: 'File harus berekstensi .pdf',
      errorType: 'invalid_path'
    };
  }

  // Step 6: Check for double extension bug (e.g., .pdf.pdf)
  const extensionCount = (sanitized.match(/\.pdf/gi) || []).length;
  if (extensionCount > 1) {
    return {
      isValid: false,
      sanitizedPath: sanitized,
      error: 'Path file memiliki ekstensi ganda yang tidak valid',
      errorType: 'invalid_path'
    };
  }

  // All validations passed
  return {
    isValid: true,
    sanitizedPath: sanitized
  };
}

/**
 * Validates PDF file availability using HEAD request
 * This should be called BEFORE rendering the PDF viewer
 */
export async function validatePdfAvailability(url: string): Promise<PdfValidationResult> {
  const pathValidation = validatePdfPath(url);
  
  if (!pathValidation.isValid) {
    return pathValidation;
  }

  try {
    const response = await fetch(pathValidation.sanitizedPath, { 
      method: 'HEAD',
      cache: 'no-cache'
    });

    // Check HTTP status
    if (!response.ok) {
      return {
        isValid: false,
        sanitizedPath: pathValidation.sanitizedPath,
        error: `File tidak ditemukan di server (HTTP ${response.status})`,
        errorType: 'not_found'
      };
    }

    // Check content-type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('pdf')) {
      return {
        isValid: false,
        sanitizedPath: pathValidation.sanitizedPath,
        error: `File bukan dokumen PDF (content-type: ${contentType})`,
        errorType: 'invalid_path'
      };
    }

    // Check file size
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) < MIN_FILE_SIZE) {
      return {
        isValid: false,
        sanitizedPath: pathValidation.sanitizedPath,
        error: `File PDF kosong atau korup (ukuran: ${contentLength} bytes)`,
        errorType: 'corrupted'
      };
    }

    // All checks passed
    return {
      isValid: true,
      sanitizedPath: pathValidation.sanitizedPath
    };

  } catch (error: any) {
    return {
      isValid: false,
      sanitizedPath: pathValidation.sanitizedPath,
      error: `Gagal terhubung ke server: ${error.message}`,
      errorType: 'network_error'
    };
  }
}

/**
 * Validates PDF file integrity (for use in admin/upload workflows)
 */
export function validatePdfFile(file: File): PdfValidationResult {
  // Check file extension
  if (!file.name.toLowerCase().endsWith(ALLOWED_EXTENSION)) {
    return {
      isValid: false,
      sanitizedPath: '',
      error: 'File harus berekstensi .pdf',
      errorType: 'invalid_path'
    };
  }

  // Check file size
  if (file.size < MIN_FILE_SIZE) {
    return {
      isValid: false,
      sanitizedPath: '',
      error: `File terlalu kecil atau korup (ukuran: ${file.size} bytes)`,
      errorType: 'corrupted'
    };
  }

  // Check file name for dangerous characters
  const fileName = file.name;
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(fileName)) {
      return {
        isValid: false,
        sanitizedPath: '',
        error: 'Nama file mengandung karakter tidak valid',
        errorType: 'invalid_path'
      };
    }
  }

  return {
    isValid: true,
    sanitizedPath: sanitize(`/buku_digital/${fileName}`)
  };
}

/**
 * Generates a safe filename from book metadata
 * Use this for newly uploaded PDFs to avoid naming conflicts
 */
export function generateSafePdfFilename(bookId: string, title: string): string {
  // Remove special characters and spaces from title
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 50); // Limit length

  // Format: bookId_CleanTitle.pdf
  const filename = `${bookId}_${cleanTitle}.pdf`;
  
  return sanitize(`/buku_digital/${filename}`);
}

/**
 * User-friendly error messages for display in UI
 */
export function getHumanReadableError(validation: PdfValidationResult): string {
  if (validation.isValid) {
    return 'File PDF valid dan siap dibaca';
  }

  switch (validation.errorType) {
    case 'not_found':
      return 'Dokumen PDF tidak ditemukan di server. Mungkin file telah dipindahkan atau dihapus.';
    
    case 'corrupted':
      return 'File PDF rusak atau tidak lengkap. Silakan hubungi administrator untuk upload ulang.';
    
    case 'invalid_path':
      return 'Path file tidak valid atau format salah. Pastikan nama file benar.';
    
    case 'security_violation':
      return 'Akses ditolak karena alasan keamanan. Path yang diminta tidak diizinkan.';
    
    case 'network_error':
      return 'Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.';
    
    default:
      return validation.error || 'Terjadi kesalahan tidak dikenal saat memuat PDF.';
  }
}

/**
 * Log security violations for audit trail
 */
export function logSecurityViolation(path: string, userId?: string, ip?: string): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'SECURITY_VIOLATION',
    attemptedPath: path,
    userId: userId || 'anonymous',
    ip: ip || 'unknown',
    message: 'Attempted directory traversal or invalid path access'
  };

  // In production, send this to backend security log endpoint
  console.error('[SECURITY ALERT]', logEntry);
  
  // Save to localStorage for client-side audit (development only)
  if (process.env.NODE_ENV === 'development') {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('security_logs', JSON.stringify(logs.slice(-50))); // Keep last 50
  }
}

export default {
  validatePdfPath,
  validatePdfAvailability,
  validatePdfFile,
  generateSafePdfFilename,
  getHumanReadableError,
  logSecurityViolation
};

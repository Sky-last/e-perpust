/**
 * usePdfValidator Hook
 * 
 * React hook untuk validasi dan monitoring PDF files
 * Terintegrasi dengan security middleware
 * 
 * Usage:
 * ```tsx
 * const { isValid, isLoading, error, retry } = usePdfValidator(pdfUrl);
 * 
 * if (isLoading) return <Loader />;
 * if (!isValid) return <ErrorMessage error={error} onRetry={retry} />;
 * return <PdfViewer url={pdfUrl} />;
 * ```
 */

import { useState, useEffect } from 'react';
import { 
  validatePdfAvailability, 
  getHumanReadableError,
  type PdfValidationResult 
} from '../utils/pdfSecurityMiddleware';

interface UsePdfValidatorOptions {
  autoValidate?: boolean;      // Automatically validate on mount (default: true)
  retryAttempts?: number;       // Number of retry attempts on failure (default: 2)
  retryDelay?: number;          // Delay between retries in ms (default: 1000)
  onError?: (error: string) => void;  // Error callback
  onSuccess?: () => void;       // Success callback
}

interface UsePdfValidatorReturn {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  errorType: PdfValidationResult['errorType'] | null;
  sanitizedUrl: string;
  retry: () => void;
  validate: () => Promise<void>;
}

export function usePdfValidator(
  url: string | undefined,
  options: UsePdfValidatorOptions = {}
): UsePdfValidatorReturn {
  const {
    autoValidate = true,
    retryAttempts = 2,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<PdfValidationResult['errorType'] | null>(null);
  const [sanitizedUrl, setSanitizedUrl] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const performValidation = async () => {
    if (!url) {
      setIsValid(false);
      setError('URL PDF tidak ditentukan');
      setErrorType('invalid_path');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await validatePdfAvailability(url);

      if (result.isValid) {
        setIsValid(true);
        setError(null);
        setErrorType(null);
        setSanitizedUrl(result.sanitizedPath);
        setAttemptCount(0);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setIsValid(false);
        const humanError = getHumanReadableError(result);
        setError(humanError);
        setErrorType(result.errorType || null);
        setSanitizedUrl(result.sanitizedPath);

        // Auto-retry logic
        if (attemptCount < retryAttempts && result.errorType === 'network_error') {
          setTimeout(() => {
            setAttemptCount(prev => prev + 1);
            performValidation();
          }, retryDelay);
        } else {
          if (onError) {
            onError(humanError);
          }
        }
      }
    } catch (err: any) {
      setIsValid(false);
      const errorMessage = `Validasi gagal: ${err.message}`;
      setError(errorMessage);
      setErrorType('network_error');

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    setAttemptCount(0);
    performValidation();
  };

  // Auto-validate on mount or when URL changes
  useEffect(() => {
    if (autoValidate && url) {
      performValidation();
    }
  }, [url, autoValidate]);

  return {
    isValid,
    isLoading,
    error,
    errorType,
    sanitizedUrl,
    retry,
    validate: performValidation
  };
}

export default usePdfValidator;

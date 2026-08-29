import React, { useEffect, useRef, useState } from 'react';
import { Book } from '../types';
import { ExternalLink, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

interface GoogleBooksViewerProps {
  book: Book;
  onFallbackToPdf: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleBooksViewer({ book, onFallbackToPdf }: GoogleBooksViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [googleBooksUrl, setGoogleBooksUrl] = useState<string>('');

  const isbnClean = book.isbn ? book.isbn.replace(/[^0-9X]/gi, '') : '';
  const searchUrl = isbnClean && isbnClean.length >= 10
    ? `https://books.google.com/books?isbn=${isbnClean}`
    : `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.title + ' ' + book.author)}`;

  useEffect(() => {
    setGoogleBooksUrl(searchUrl);
    let isCancelled = false;

    // Load Google Books API script if not loaded
    const loadGoogleScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.books) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.google.com/jsapi';
        script.async = true;
        script.onload = () => {
          if (window.google) {
            window.google.load('books', '1', {
              callback: () => resolve(),
              language: 'id'
            });
          } else {
            reject(new Error('Google jsapi failed'));
          }
        };
        script.onerror = () => reject(new Error('Script load error'));
        document.body.appendChild(script);
      });
    };

    loadGoogleScript()
      .then(() => {
        if (isCancelled || !viewerRef.current) return;
        try {
          const viewer = new window.google.books.DefaultViewer(viewerRef.current);
          
          const query = isbnClean && isbnClean.length >= 10 ? `ISBN:${isbnClean}` : book.title;
          
          viewer.load(query, () => {
            if (!isCancelled) setLoadError(true);
          }, () => {
            if (!isCancelled) setLoading(false);
          });
        } catch (err) {
          if (!isCancelled) setLoadError(true);
        }
      })
      .catch(() => {
        if (!isCancelled) setLoadError(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [book, isbnClean, searchUrl]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-b-xl border border-slate-800 relative overflow-hidden">
      {/* Container for Embedded Viewer */}
      <div
        ref={viewerRef}
        id="google-books-viewer-canvas"
        className={`w-full h-full ${loadError ? 'hidden' : 'block'}`}
      />

      {/* Fallback & Custom Card View when Google iframe X-Frame/Embed restriction applies */}
      {loadError && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-950">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-10 h-10" />
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-black text-white">Google Books Web Stream</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google membatasi beberapa pratinjau buku (termasuk <i>"{book.title}"</i>) dari frame situs pihak ketiga untuk keamanan hak cipta.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left max-w-md w-full space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 font-semibold">
              <span>Buku:</span>
              <span className="text-white font-bold">{book.title}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-semibold">
              <span>Penulis:</span>
              <span className="text-cyan-400 font-bold">{book.author}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-semibold">
              <span>ISBN:</span>
              <span className="text-mono text-slate-300">{book.isbn}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Reader Resmi Google Books ↗</span>
            </a>

            <button
              onClick={onFallbackToPdf}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Gunakan Dokumen PDF Local
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

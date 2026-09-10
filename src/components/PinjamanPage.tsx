import { useState } from 'react';
import { User, ViewType, Book, DownloadedBook } from '../types';
import { Calendar, Download, BookOpen, CheckCircle, ChevronRight, Layers } from 'lucide-react';
import Book3D from './Book3D';
import EBookReader3D from './EBookReader3D';
import { resolveBookPdfUrl } from '../utils/pdfResolver';

interface PinjamanPageProps {
  currentUser: User;
  books?: Book[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  onReturnBook?: (borrowingId: string) => void;
  onExtendBook?: (borrowingId: string) => void;
  onDownloadBook?: (book: Book) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function PinjamanPage({
  currentUser,
  books = [],
  onNavigate,
  onDownloadBook,
  addToast: _addToast
}: PinjamanPageProps) {
  const [readingBook3D, setReadingBook3D] = useState<Book | null>(null);
  const downloads: DownloadedBook[] = currentUser.downloads || [];

  const handleOpenReader = (bookId: string, bookTitle: string, coverColor?: string, coverUrl?: string) => {
    const foundBook = books.find(b => b.id === bookId || b.title === bookTitle);
    if (foundBook) {
      setReadingBook3D({
        ...foundBook,
        pdfUrl: resolveBookPdfUrl(foundBook)
      });
    } else {
      const tempBook: Partial<Book> = { id: bookId, title: bookTitle, coverUrl };
      setReadingBook3D({
        id: bookId,
        title: bookTitle,
        coverColor: coverColor || 'from-emerald-600 to-teal-900',
        coverUrl,
        pdfUrl: resolveBookPdfUrl(tempBook),
        category: 'Koleksi Unduhan',
        author: 'Perpustakaan Kita',
        publisher: 'Perpustakaan Kita',
        isbn: '000-000-000',
        description: `E-book digital "${bookTitle}" koleksi Perpustakaan Kita.`,
        year: 2026,
        rating: 5,
        status: 'Tersedia'
      });
    }
  };

  const handleRedownload = (item: DownloadedBook) => {
    const foundBook = books.find(b => b.id === item.bookId || b.title === item.bookTitle);
    if (onDownloadBook && foundBook) {
      onDownloadBook(foundBook);
    } else {
      const pdfPath = item.pdfUrl || (foundBook ? resolveBookPdfUrl(foundBook) : '');
      if (pdfPath) {
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = `${item.bookTitle.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Buku yang Di-download</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Koleksi file buku digital (PDF) resmi yang telah Anda unduh untuk dibaca secara offline.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
            {downloads.length} Buku Tersimpan Offline
          </span>
        </div>
      </div>

      {downloads.length > 0 ? (
        <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Buku</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tanggal Diunduh</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Format Dokumen</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Akses Offline</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                {downloads.map((item) => {
                  const foundBook = books.find(b => b.id === item.bookId || b.title === item.bookTitle);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Cover & Title */}
                      <td className="p-4.5">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            onClick={() => onNavigate('detail-buku', item.bookId)}
                            className="cursor-pointer group flex-shrink-0"
                          >
                            <Book3D 
                              book={foundBook || {
                                id: item.bookId,
                                title: item.bookTitle,
                                coverColor: item.coverColor || 'from-emerald-600 to-teal-900',
                                coverUrl: item.coverUrl,
                                category: item.category || 'Digital',
                                author: item.author || 'Pustaka',
                                publisher: 'Perpustakaan Kita',
                                isbn: '000-000',
                                description: '',
                                year: 2026,
                                rating: 5,
                                status: 'Tersedia'
                              }} 
                              size="xs" 
                            />
                          </div>
                          <div>
                            <h4 
                              onClick={() => onNavigate('detail-buku', item.bookId)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 text-sm"
                            >
                              {item.bookTitle}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">Penulis: {item.author || foundBook?.author || 'Perpustakaan Digital'}</p>
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold inline-block mt-1">
                              {item.category || foundBook?.category || 'Koleksi Digital'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Download Date */}
                      <td className="p-4.5 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.downloadDate}</span>
                        </div>
                      </td>

                      {/* Format */}
                      <td className="p-4.5 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-bold text-slate-700">PDF Digital Otentik</span>
                        </div>
                      </td>

                      {/* Status Offline */}
                      <td className="p-4.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Siap Offline
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleOpenReader(item.bookId, item.bookTitle, item.coverColor, item.coverUrl)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                            title="Baca E-Book di Web"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Baca E-Book</span>
                          </button>
                          <button 
                            onClick={() => handleRedownload(item)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
                            title="Unduh Ulang PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Ulang</span>
                          </button>
                          <button 
                            onClick={() => onNavigate('detail-buku', item.bookId)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Detail Buku"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Download className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-slate-800 text-lg">Belum Ada Buku yang Di-download</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Anda dapat membaca seluruh koleksi buku secara bebas di website, atau mengunduh buku digital (PDF) ke perangkat Anda untuk dibaca kapan saja secara offline.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('katalog')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Buka Katalog Buku
          </button>
        </div>
      )}

      {/* 3D E-Book Reader Modal */}
      {readingBook3D && (
        <EBookReader3D 
          book={readingBook3D}
          onClose={() => setReadingBook3D(null)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

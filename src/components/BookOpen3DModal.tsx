import { useState, useEffect } from 'react';
import { Book } from '../types';
import { X, BookOpen, Star, Bookmark, Heart, Sparkles, MapPin, Layers } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface BookOpen3DModalProps {
  book: Book | null;
  onClose: () => void;
  onReadEbook?: (book: Book) => void;
  onPinjam?: (book: Book) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function BookOpen3DModal({
  book,
  onClose,
  onReadEbook,
  onPinjam,
  onToggleFavorite,
  isFavorite = false
}: BookOpen3DModalProps) {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  useEffect(() => {
    if (book) {
      soundFX.playBookOpen();
      const timer = setTimeout(() => setIsOpenAnimation(true), 150);
      return () => clearTimeout(timer);
    } else {
      setIsOpenAnimation(false);
    }
  }, [book]);

  if (!book) return null;

  // Extract primary cover gradient color
  const getCoverColor = (colorStr?: string) => {
    if (!colorStr) return '#2563eb';
    if (colorStr.includes('from-indigo')) return '#4f46e5';
    if (colorStr.includes('from-rose')) return '#be123c';
    if (colorStr.includes('from-emerald')) return '#047857';
    if (colorStr.includes('from-amber')) return '#d97706';
    if (colorStr.includes('from-purple')) return '#7e22ce';
    if (colorStr.includes('from-teal')) return '#0f766e';
    if (colorStr.includes('from-cyan')) return '#0e7490';
    return '#2563eb';
  };

  const primaryColor = getCoverColor(book.coverColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      {/* Background glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Close button */}
      <button
        onClick={() => {
          soundFX.playClick();
          onClose();
        }}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all z-50 cursor-pointer hover:scale-110"
        title="Tutup (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 3D Container */}
      <div
        className="relative max-w-4xl w-full h-[580px] flex items-center justify-center select-none"
        style={{ perspective: '2000px' }}
      >
        {/* 3D BOOK STRUCTURE */}
        <div
          className="relative w-[340px] md:w-[680px] h-[480px] transition-transform duration-1000 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isOpenAnimation ? 'rotateX(12deg) rotateY(0deg)' : 'rotateX(25deg) rotateY(-40deg) scale(0.85)',
          }}
        >
          {/* LEFT PAGE (Book Inner Left) */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full bg-slate-900 border border-slate-800 rounded-l-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-700 ${
              isOpenAnimation ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              boxShadow: 'inset -20px 0 30px rgba(0,0,0,0.5), -15px 15px 30px rgba(0,0,0,0.6)',
              backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)',
            }}
          >
            {/* Book Metadata & Synopsis */}
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 bg-blue-500/20 text-blue-400 font-extrabold uppercase tracking-wider rounded-md border border-blue-500/30">
                  {book.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{book.rating}</span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                {book.title}
              </h2>

              <p className="text-xs text-slate-400 font-semibold">
                Penulis: <span className="text-slate-200">{book.author}</span>
              </p>

              <div className="h-px bg-slate-800 my-3" />

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Sinopsis
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {book.description || 'Buku karya penulis ternama yang menghadirkan wawasan mendalam serta petualangan literasi yang menginspirasi para pembaca.'}
                </p>
              </div>
            </div>

            {/* Left Page Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>ISBN: {book.isbn || '978-602-XXX'}</span>
              <span>Hal. 1</span>
            </div>
          </div>

          {/* RIGHT PAGE (Book Inner Right) */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full bg-slate-900 border border-slate-800 rounded-r-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-700 ${
              isOpenAnimation ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              boxShadow: 'inset 20px 0 30px rgba(0,0,0,0.5), 15px 15px 30px rgba(0,0,0,0.6)',
              backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.03), transparent 70%)',
            }}
          >
            {/* Book Details Grid */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Penerbit</span>
                  <span className="text-xs font-extrabold text-white truncate block mt-0.5">{book.publisher}</span>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tahun Terbit</span>
                  <span className="text-xs font-extrabold text-white block mt-0.5">{book.year}</span>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Lokasi Rak</span>
                    <span className="text-xs font-extrabold text-emerald-400 block">{book.rackLocation || 'Rak A-01'}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Stok Tersedia</span>
                    <span className="text-xs font-extrabold text-blue-400 block">{book.stock} Eks</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-4 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 rounded-xl border border-blue-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Status Akses</span>
                  <span className="text-xs font-black text-white mt-0.5 block">
                    {book.pdfUrl ? '⚡ E-Book Digital & Fisik Tersedia' : '📚 Hanya Peminjaman Fisik'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              {book.pdfUrl && onReadEbook && (
                <button
                  onClick={() => {
                    soundFX.playPageFlip();
                    onReadEbook(book);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Baca E-Book Sekarang (3D Viewer)</span>
                </button>
              )}

              <div className="flex gap-3">
                {onPinjam && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onPinjam(book);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Ajukan Peminjaman</span>
                  </button>
                )}

                {onToggleFavorite && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onToggleFavorite(book.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-rose-400 hover:border-rose-500/30'
                    }`}
                    title="Simpan Favorit"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FRONT COVER (FLIPS OPEN IN 3D) */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full rounded-l-2xl shadow-2xl origin-right transition-transform duration-1000 ease-in-out flex flex-col justify-between p-8 text-white overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              transform: isOpenAnimation ? 'rotateY(-170deg)' : 'rotateY(0deg)',
              backgroundColor: primaryColor,
              backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, rgba(0,0,0,0.6) 100%)`,
              backfaceVisibility: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            {/* Spine Highlight */}
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-white/20 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-black/40" />

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-black/30 rounded-full border border-white/20 backdrop-blur-md">
                {book.category}
              </span>
              <h1 className="text-2xl font-black leading-tight drop-shadow-md">{book.title}</h1>
              <p className="text-xs font-bold opacity-80">{book.author}</p>
            </div>

            <div className="pt-6 border-t border-white/20 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider opacity-75">{book.publisher}</span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

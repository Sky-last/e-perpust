import { useState } from 'react';
import { Book } from '../types';
import Book3D from './Book3D';
import { Sparkles, ArrowRight, Star, BookOpen, Layers } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface Library3DRoomProps {
  books: Book[];
  onSelectBook: (id: string) => void;
}

export default function Library3DRoom({ books = [], onSelectBook }: Library3DRoomProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentBook = books && books.length > 0 ? (books[selectedIndex] || books[0]) : null;

  if (!currentBook) {
    return null;
  }

  return (
    <div className="relative w-full rounded-3xl bg-slate-950 border border-slate-800/80 p-6 md:p-10 overflow-hidden select-none shadow-2xl">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Panggung Visualisasi 3D
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mt-2 tracking-tight">
            Etalase Koleksi Unggulan
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sorotan buku digital interaktif dengan efek rotasi 3D dan detail lengkap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
            Buku {selectedIndex + 1} dari {books.length}
          </span>
        </div>
      </div>

      {/* MAIN SHOWCASE STUDIO STAGE */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl">

        {/* LEFT / CENTER: THE 3D FEATURED BOOK DISPLAY */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 relative">
          {/* Spotlight aura */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive 3D Book */}
          <div
            onClick={() => {
              soundFX.playBookOpen();
              if (currentBook) onSelectBook(currentBook.id);
            }}
            className="relative cursor-pointer transition-transform duration-500 hover:scale-105"
          >
            {currentBook && <Book3D book={currentBook} size="xl" />}
          </div>

          {/* Frosted Glass Podium Reflection Surface */}
          <div className="w-72 h-4 rounded-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-md mt-6" />
        </div>

        {/* RIGHT: FEATURED BOOK DETAILS & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-400/10 text-amber-400 rounded-md border border-amber-400/20">
                {currentBook.category}
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {currentBook.rating}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {currentBook.title}
            </h2>

            <p className="text-xs text-slate-400 font-medium">
              Penulis: <span className="text-slate-200 font-bold">{currentBook.author}</span> • Tahun: <span className="text-slate-200 font-bold">{currentBook.year}</span>
            </p>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 pt-1 font-sans">
              {currentBook.description || 'Koleksi e-book literasi digital dengan materi berkualitas dan tampilan 3D interaktif.'}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ISBN</span>
              <span className="text-xs font-mono font-bold text-slate-200">{currentBook.isbn}</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status Stok</span>
              <span className={`text-xs font-bold ${currentBook.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentBook.stock > 0 ? `${currentBook.stock} Buku Tersedia` : 'Sedang Dipinjam'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                soundFX.playBookOpen();
                if (currentBook) onSelectBook(currentBook.id);
              }}
              className="flex-1 min-w-[200px] py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-blue-200" />
              <span>Buka Detail & Baca 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM THUMBNAILS CAROUSEL */}
      <div className="mt-6 relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Pilih Buku Lain Untuk Ditampilkan:
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {books.map((b, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={b.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedIndex(idx);
                }}
                className={`flex-shrink-0 p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-11 bg-slate-800 rounded overflow-hidden flex-shrink-0 relative border border-white/10">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-900" />
                  )}
                </div>
                <div className="max-w-[140px]">
                  <p className="text-xs font-bold truncate text-white">{b.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{b.author}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

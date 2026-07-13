import { Book, User, ViewType } from '../types';
import { Star, Heart, ArrowLeft, Shield } from 'lucide-react';

interface DetailPageProps {
  book: Book | null;
  onNavigate: (view: ViewType, selectedId?: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenPinjamModal: (book: Book) => void;
  currentUser: User | null;
}

export default function DetailPage({
  book,
  onNavigate,
  favorites,
  onToggleFavorite,
  onOpenPinjamModal,
  currentUser
}: DetailPageProps) {
  if (!book) {
    return (
      <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-lg">Buku Tidak Ditemukan</h3>
        <p className="text-slate-400 text-xs">Silakan kembali ke katalog dan pilih buku yang tersedia.</p>
        <button 
          onClick={() => onNavigate('katalog')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(book.id);
  const isAvailable = book.stock > 0;
  // Dynamic page count mock based on ISBN
  const pageCount = (parseInt(book.isbn.replace(/[^0-9]/g, '')) % 150) + 180;

  return (
    <div className="space-y-6">
      {/* Back to catalog button */}
      <div>
        <button 
          onClick={() => onNavigate('katalog')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Buku</span>
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden shadow-xs">
        {/* Decorative background gradients */}
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10" />

        {/* Column Left: Cover */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[240px] aspect-[3/4] relative rounded-[20px] overflow-hidden shadow-lg border border-slate-100 flex items-center justify-center bg-slate-50">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-full h-full rounded-[20px] bg-gradient-to-tr ${book.coverColor} p-6 text-white flex flex-col justify-between shadow-inner`}>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-75 font-mono">{book.category}</span>
                  <h3 className="text-xl font-bold leading-tight">{book.title}</h3>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-medium opacity-90">Penulis: {book.author}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3 w-full max-w-[240px]">
            <button 
              onClick={() => onToggleFavorite(book.id)}
              className={`flex-1 py-3 border rounded-xl flex items-center justify-center space-x-2 text-xs font-bold transition-all cursor-pointer ${
                isFav 
                  ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100/50' 
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />
              <span>{isFav ? 'Hapus Favorit' : 'Simpan Favorit'}</span>
            </button>
          </div>
        </div>

        {/* Column Right: Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-mono tracking-wide uppercase">
                {book.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {isAvailable ? `Tersedia (Stok: ${book.stock})` : 'Sedang Dipinjam / Kosong'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {book.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-normal">Penulis:</span>
                <span className="font-bold text-slate-700">{book.author}</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-normal">Penerbit:</span>
                <span className="font-bold text-slate-700">{book.publisher}</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-normal">Tahun:</span>
                <span className="font-bold text-slate-700">{book.year}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4.5 bg-slate-50/50 border border-slate-100 rounded-[20px]">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Rating Buku</p>
              <div className="flex items-center justify-center sm:justify-start space-x-1 text-amber-500 font-extrabold text-sm mt-0.5">
                <Star className="w-4 h-4 fill-current" />
                <span>{book.rating} / 5.0</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Halaman</p>
              <p className="font-bold text-slate-700 text-sm mt-0.5">{pageCount} Halaman</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Kode ISBN</p>
              <p className="font-bold text-slate-700 text-sm mt-0.5">{book.isbn}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Stok Tersedia</p>
              <p className="font-bold text-slate-700 text-sm mt-0.5">{book.stock} unit</p>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider font-mono text-slate-400">Sinopsis Buku</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify">
              {book.description}
            </p>
          </div>

          {/* CTA actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => {
                if (!currentUser) {
                  onNavigate('login');
                } else {
                  onOpenPinjamModal(book);
                }
              }}
              disabled={!isAvailable}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isAvailable 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Pinjam Buku Sekarang
            </button>
            <button 
              onClick={() => onNavigate('katalog')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
            >
              Kembali ke Katalog
            </button>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-[10px] text-slate-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Peminjaman online aman, jatah durasi pinjam default adalah 7 hari kalender.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

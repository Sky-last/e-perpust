import { Book, User, ViewType } from '../types';
import { Heart, Star, Trash2, ChevronRight } from 'lucide-react';
import Book3D from './Book3D';

interface FavoritPageProps {
  currentUser: User;
  books: Book[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenPinjamModal: (book: Book) => void;
  onNavigate: (view: ViewType, selectedId?: string) => void;
}

export default function FavoritPage({
  currentUser: _currentUser,
  books,
  favorites,
  onToggleFavorite,
  onOpenPinjamModal,
  onNavigate
}: FavoritPageProps) {
  // Filter books in favorites
  const favBooks = books.filter(b => favorites.includes(b.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Koleksi Buku Favorit</h1>
        <p className="text-slate-400 text-xs md:text-sm">Kumpulan buku digital pilihan Anda untuk dibaca di masa mendatang.</p>
      </div>

      {favBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favBooks.map(book => {
            const isAvailable = book.stock > 0;
            return (
              <div 
                key={book.id}
                className="bg-white border border-slate-100 p-4 rounded-[20px] flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200 group"
              >
                {/* Book Details Container */}
                <div className="flex items-center space-x-4">
                  {/* Miniature Cover representation */}
                  <div 
                    onClick={() => onNavigate('detail-buku', book.id)}
                    className="w-16 h-22 flex items-center justify-center cursor-pointer flex-shrink-0"
                  >
                    <Book3D book={book} size="xs" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md font-semibold font-mono tracking-wider uppercase">
                        {book.category}
                      </span>
                      <div className="flex items-center space-x-0.5 text-amber-500 text-[10px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                    
                    <h3 
                      onClick={() => onNavigate('detail-buku', book.id)}
                      className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 hover:text-blue-600 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500">Penulis: {book.author}</p>
                    
                    <div className="pt-1 flex items-center space-x-2 text-[10px] font-semibold">
                      <span className={isAvailable ? 'text-emerald-600' : 'text-red-500'}>
                        {isAvailable ? 'Tersedia' : 'Sedang Dipinjam'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">Stok: {book.stock} buku</span>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button 
                    onClick={() => onOpenPinjamModal(book)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto ${
                      isAvailable 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-100' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Pinjam
                  </button>
                  <button 
                    onClick={() => onToggleFavorite(book.id)}
                    className="p-2 border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onNavigate('detail-buku', book.id)}
                    className="p-2 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer hidden sm:block"
                    title="Detail Buku"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-lg">Buku Favorit Kosong</h3>
            <p className="text-slate-400 text-xs">
              Anda belum menandai buku mana pun sebagai favorit. Silakan buka katalog kami untuk menandai buku-buku yang paling menarik bagi Anda.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('katalog')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Telusuri Katalog Buku
          </button>
        </div>
      )}
    </div>
  );
}

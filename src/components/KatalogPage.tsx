import { useState, useMemo } from 'react';
import { Book, User, ViewType } from '../types';
import { Search, SlidersHorizontal, Heart, Star, BookOpen, RefreshCw } from 'lucide-react';

interface KatalogPageProps {
  books: Book[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenPinjamModal: (book: Book) => void;
  currentUser: User | null;
}

export default function KatalogPage({
  books,
  onNavigate,
  favorites,
  onToggleFavorite,
  onOpenPinjamModal,
  currentUser
}: KatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terpopuler'); // Default sort
  const [showFilters, setShowFilters] = useState(false);

  // Get distinct categories
  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(books.map(b => b.category)))];
  }, [books]);

  // Handle filtering
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Search query
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);

      // Category filter
      const matchesCategory = selectedCategory === 'Semua' || book.category === selectedCategory;

      // Status filter
      const matchesStatus = 
        selectedStatus === 'Semua' || 
        (selectedStatus === 'Tersedia' && book.stock > 0) || 
        (selectedStatus === 'Sedang Dipinjam' && book.stock === 0);

      // Year filter
      let matchesYear = true;
      if (selectedYear !== 'Semua') {
        if (selectedYear === 'Sebelum 2022') {
          matchesYear = book.year < 2022;
        } else {
          matchesYear = book.year === parseInt(selectedYear);
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });
  }, [books, searchQuery, selectedCategory, selectedStatus, selectedYear]);

  // Handle sorting
  const sortedBooks = useMemo(() => {
    const list = [...filteredBooks];
    switch (sortBy) {
      case 'A-Z':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'Z-A':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'Terbaru':
        return list.sort((a, b) => b.year - a.year);
      case 'Terlama':
        return list.sort((a, b) => a.year - b.year);
      case 'Terpopuler':
      default:
        return list.sort((a, b) => b.rating - a.rating);
    }
  }, [filteredBooks, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedStatus('Semua');
    setSelectedYear('Semua');
    setSortBy('Terpopuler');
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Katalog Perpustakaan</h1>
          <p className="text-slate-400 text-xs md:text-sm">Telusuri dan saring koleksi buku digital terlengkap untuk Anda.</p>
        </div>

        {/* Real-time search layout */}
        <div className="flex items-center space-x-2 w-full md:w-auto md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari judul, penulis, atau ISBN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 border rounded-xl flex items-center justify-center cursor-pointer transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            title="Saring Pencarian"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Drawer/Box */}
      {showFilters && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori Buku</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status availability selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Ketersediaan</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tersedia">Tersedia (Stok &gt; 0)</option>
              <option value="Sedang Dipinjam">Sedang Dipinjam (Kosong)</option>
            </select>
          </div>

          {/* Year of publication */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tahun Terbit</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700"
            >
              <option value="Semua">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="Sebelum 2022">Sebelum 2022</option>
            </select>
          </div>

          {/* Sort type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urutkan Berdasarkan</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700"
            >
              <option value="Terpopuler">Terpopuler (Rating)</option>
              <option value="A-Z">Judul A - Z</option>
              <option value="Z-A">Judul Z - A</option>
              <option value="Terbaru">Tahun Terbaru</option>
              <option value="Terlama">Tahun Terlama</option>
            </select>
          </div>

          {/* Reset button inside filter */}
          <div className="sm:col-span-4 flex justify-end">
            <button 
              onClick={handleResetFilters}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bersihkan Filter</span>
            </button>
          </div>
        </div>
      )}

      {/* Catalog Grid View */}
      {sortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedBooks.map((book) => {
            const isFav = favorites.includes(book.id);
            const isAvailable = book.stock > 0;
            return (
              <div 
                key={book.id} 
                className="p-4 bg-white border border-slate-100 rounded-[24px] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Book cover representational container */}
                <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-4 relative bg-slate-50 flex items-center justify-center">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-[16px] bg-gradient-to-tr ${book.coverColor} p-4 text-white flex flex-col justify-between shadow-md relative group-hover:scale-105 transition-transform duration-500`}>
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-75 font-mono">{book.category}</span>
                        <h4 className="text-xs font-black leading-tight line-clamp-3">{book.title}</h4>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] font-medium opacity-85">{book.author}</p>
                      </div>
                    </div>
                  )}

                  {/* Rating stamp */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1 text-amber-500 font-bold text-[10px]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{book.rating}</span>
                  </div>

                  {/* Category overlay label */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-bold text-blue-600 shadow-xs uppercase">
                    {book.category}
                  </div>
                </div>

                {/* Details text */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase">ISBN: {book.isbn}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {isAvailable ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{book.author}</p>
                  </div>

                  {/* Interactive actions section */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Tahun: {book.year}</span>
                      <span>Stok: {book.stock} buku</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate('detail-buku', book.id)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-xl transition-all duration-200 cursor-pointer text-center"
                      >
                        Detail
                      </button>

                      <button 
                        onClick={() => {
                          if (!currentUser) {
                            onNavigate('login');
                          } else {
                            onOpenPinjamModal(book);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`flex-1 py-2 text-[11px] font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${
                          isAvailable 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100/50 hover:-translate-y-0.5' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        Pinjam
                      </button>

                      <button 
                        onClick={() => onToggleFavorite(book.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border cursor-pointer ${
                          isFav 
                            ? 'bg-rose-50 border-rose-100 text-rose-500' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100'
                        }`}
                        title="Simpan Ke Favorit"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-lg">Buku Tidak Ditemukan</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Maaf, kata kunci pencarian atau filter yang Anda pilih tidak cocok dengan data buku apa pun dalam katalog kami. Silakan coba kata kunci lain.
            </p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Bersihkan Seluruh Saringan
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
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
  const [activeSection, setActiveSection] = useState<'home' | 'katalog' | 'tentang' | 'kontak'>('katalog');

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
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Pustaka<span className="text-blue-600">Digital</span></span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => {
                setActiveSection('home');
                onNavigate('landing');
              }} 
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform transition-transform ${
                activeSection === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </button>
            <button 
              onClick={() => {
                setActiveSection('katalog');
              }} 
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'katalog' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Katalog
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform transition-transform ${
                activeSection === 'katalog' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </button>
            <button 
              onClick={() => {
                setActiveSection('tentang');
                onNavigate('landing');
                // Delay for navigation then scroll to section
                setTimeout(() => {
                  const element = document.getElementById('tentang');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'tentang' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Tentang
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform transition-transform ${
                activeSection === 'tentang' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </button>
            <button 
              onClick={() => {
                setActiveSection('kontak');
                onNavigate('landing');
                // Delay for navigation then scroll to section
                setTimeout(() => {
                  const element = document.getElementById('kontak');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'kontak' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Kontak
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform transition-transform ${
                activeSection === 'kontak' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="hidden sm:block px-5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden px-6 pb-4">
          <div className="flex items-center justify-around border-t border-slate-200 pt-4">
            <button 
              onClick={() => {
                setActiveSection('home');
                onNavigate('landing');
              }} 
              className={`text-xs font-semibold transition-colors relative ${
                activeSection === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Home
              {activeSection === 'home' && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
            <button 
              onClick={() => {
                setActiveSection('katalog');
              }} 
              className={`text-xs font-semibold transition-colors relative ${
                activeSection === 'katalog' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Katalog
              {activeSection === 'katalog' && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
            <button 
              onClick={() => {
                setActiveSection('tentang');
                onNavigate('landing');
                setTimeout(() => {
                  const element = document.getElementById('tentang');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-xs font-semibold transition-colors relative ${
                activeSection === 'tentang' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Tentang
              {activeSection === 'tentang' && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
            <button 
              onClick={() => {
                setActiveSection('kontak');
                onNavigate('landing');
                setTimeout(() => {
                  const element = document.getElementById('kontak');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-xs font-semibold transition-colors relative ${
                activeSection === 'kontak' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Kontak
              {activeSection === 'kontak' && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Katalog Perpustakaan</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Telusuri dan saring koleksi buku digital terlengkap untuk Anda.</p>
        </div>

        {/* Real-time search layout */}
        <div className="flex items-center space-x-2 w-full md:w-auto md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari judul, penulis, atau ISBN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400 font-medium"
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Kategori Buku</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700 font-medium"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status availability selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Status Ketersediaan</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700 font-medium"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tersedia">Tersedia (Stok &gt; 0)</option>
              <option value="Sedang Dipinjam">Sedang Dipinjam (Kosong)</option>
            </select>
          </div>

          {/* Year of publication */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Tahun Terbit</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700 font-medium"
            >
              <option value="Semua">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="Sebelum 2022">Sebelum 2022</option>
            </select>
          </div>

          {/* Sort type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Urutkan Berdasarkan</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50 text-slate-700 font-medium"
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
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
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
                className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Book cover representational container */}
                <div className="aspect-[3/4] rounded-t-2xl overflow-hidden relative bg-slate-50 flex items-center justify-center">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${book.coverColor} p-5 text-white flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                      {/* Decorative overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      
                      <div className="relative z-10 space-y-2">
                        <span className="inline-block text-xs uppercase tracking-widest font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">{book.category}</span>
                      </div>
                      
                      <div className="relative z-10 space-y-2">
                        <h4 className="text-base font-black leading-tight line-clamp-3 drop-shadow-lg">{book.title}</h4>
                        <div className="pt-2 border-t border-white/30">
                          <p className="text-sm font-semibold">{book.author}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rating stamp - positioned outside for better visibility */}
                  <div className="absolute top-3 left-3 bg-white backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 text-amber-500 font-bold text-sm z-10">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-800">{book.rating}</span>
                  </div>

                  {/* Category overlay label */}
                  <div className="absolute top-3 right-3 bg-white backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-md uppercase z-10">
                    {book.category}
                  </div>
                </div>

                {/* Details text */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 font-mono tracking-wider">ISBN: {book.isbn}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {isAvailable ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">{book.author}</p>
                  </div>

                  {/* Interactive actions section */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                      <span>Tahun: {book.year}</span>
                      <span>Stok: {book.stock} buku</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate('detail-buku', book.id)}
                        className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer text-center"
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
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${
                          isAvailable 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100/50 hover:-translate-y-0.5' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        Pinjam
                      </button>

                      <button 
                        onClick={() => onToggleFavorite(book.id)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 border cursor-pointer ${
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
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-2xl">Buku Tidak Ditemukan</h3>
            <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto">
              Maaf, kata kunci pencarian atau filter yang Anda pilih tidak cocok dengan data buku apa pun dalam katalog kami. Silakan coba kata kunci lain.
            </p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-base transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
          >
            Bersihkan Seluruh Saringan
          </button>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

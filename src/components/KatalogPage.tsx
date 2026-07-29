import { useState, useMemo } from 'react';
import { Book, User, ViewType } from '../types';
import { Search, SlidersHorizontal, Heart, Star, BookOpen, RefreshCw, Sun, Moon, Sparkles } from 'lucide-react';
import Book3D from './Book3D';
import BookOpen3DModal from './BookOpen3DModal';
import EBookReader3D from './EBookReader3D';
import { soundFX } from '../utils/audio';

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
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terpopuler');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'katalog' | 'tentang' | 'kontak'>('katalog');

  // Interactive 3D Modals State
  const [selectedBook3D, setSelectedBook3D] = useState<Book | null>(null);
  const [readingBook3D, setReadingBook3D] = useState<Book | null>(null);

  // Get distinct categories
  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(books.map(b => b.category)))];
  }, [books]);

  // Handle filtering
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);

      const matchesCategory = selectedCategory === 'Semua' || book.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'Semua' ||
        (selectedStatus === 'Tersedia' && book.stock > 0) ||
        (selectedStatus === 'Sedang Dipinjam' && book.stock === 0);

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
    soundFX.playClick();
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedStatus('Semua');
    setSelectedYear('Semua');
    setSortBy('Terpopuler');
  };

  const dk = darkMode;
  const bg = dk ? 'bg-slate-950' : 'bg-slate-50';
  const text = dk ? 'text-white' : 'text-slate-900';
  const sub = dk ? 'text-slate-400' : 'text-slate-500';
  const card = dk ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200';
  const nav = dk ? 'bg-slate-950/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900';
  const inputBg = dk ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400';

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans antialiased transition-colors duration-300`}>
      {/* Sticky Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 border-b backdrop-blur-xl z-50 shadow-sm transition-colors ${nav}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight">
                Pustaka<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital 3D</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                soundFX.playHover();
                setActiveSection('home');
                onNavigate('landing');
              }}
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'home' ? 'text-blue-400' : `${sub} hover:text-blue-400`
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                soundFX.playHover();
                setActiveSection('katalog');
              }}
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'katalog' ? 'text-blue-400' : `${sub} hover:text-blue-400`
              }`}
            >
              Katalog
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 rounded-full" />
            </button>
            <button
              onClick={() => {
                soundFX.playHover();
                setActiveSection('tentang');
                onNavigate('landing');
                setTimeout(() => {
                  const element = document.getElementById('tentang');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-sm font-semibold transition-colors relative group ${
                activeSection === 'tentang' ? 'text-blue-400' : `${sub} hover:text-blue-400`
              }`}
            >
              Tentang
            </button>
          </div>

          {/* CTA & Theme Controls */}
          <div className="flex items-center space-x-3">
            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => {
                soundFX.playClick();
                setDarkMode(!dk);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                dk ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={dk ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {dk ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('dashboard');
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('login');
                  }}
                  className={`hidden sm:block px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${sub} hover:text-blue-400`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('register');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CATALOG WORKSPACE */}
      <div className="pt-28 px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER & SEARCH BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Digital Collection
                </span>
                <span className="text-xs text-slate-400 font-semibold">{sortedBooks.length} Buku Ditemukan</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Katalog Buku 3D</h1>
              <p className={`text-sm mt-1 ${sub}`}>Eksplorasi koleksi literasi digital interaktif dengan visualisasi buku 3D.</p>
            </div>

            {/* SEARCH LAYOUT */}
            <div className="flex items-center space-x-2 w-full md:w-auto md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul, penulis, atau ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full md:w-80 pl-11 pr-4 py-3 border rounded-xl text-sm outline-none font-medium transition-colors ${inputBg}`}
                />
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowFilters(!showFilters);
                }}
                className={`p-3 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                  showFilters
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : dk ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title="Saring Pencarian"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ADVANCED FILTERS DRAWER */}
          {showFilters && (
            <div className={`p-6 rounded-2xl border grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn transition-colors ${card}`}>
              {/* Category */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${sub}`}>Kategori Buku</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none font-medium ${inputBg}`}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${sub}`}>Status Ketersediaan</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none font-medium ${inputBg}`}
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tersedia">Tersedia (Stok &gt; 0)</option>
                  <option value="Sedang Dipinjam">Sedang Dipinjam (Kosong)</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${sub}`}>Tahun Terbit</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none font-medium ${inputBg}`}
                >
                  <option value="Semua">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="Sebelum 2022">Sebelum 2022</option>
                </select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${sub}`}>Urutkan Berdasarkan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none font-medium ${inputBg}`}
                >
                  <option value="Terpopuler">Terpopuler (Rating)</option>
                  <option value="A-Z">Judul A - Z</option>
                  <option value="Z-A">Judul Z - A</option>
                  <option value="Terbaru">Tahun Terbaru</option>
                  <option value="Terlama">Tahun Terlama</option>
                </select>
              </div>

              {/* Reset filter button */}
              <div className="sm:col-span-4 flex justify-end pt-2">
                <button
                  onClick={handleResetFilters}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                    dk ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Bersihkan Filter</span>
                </button>
              </div>
            </div>
          )}

          {/* CATALOG GRID VIEW */}
          {sortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedBooks.map((book) => {
                const isFav = favorites.includes(book.id);
                const isAvailable = book.stock > 0;
                return (
                  <div
                    key={book.id}
                    className={`group rounded-2xl border shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${card}`}
                  >
                    {/* 3D Book Cover Container */}
                    <div
                      onClick={() => {
                        soundFX.playBookOpen();
                        setSelectedBook3D(book);
                      }}
                      className="aspect-[3/4] rounded-t-2xl overflow-hidden relative flex items-center justify-center cursor-pointer p-4"
                    >
                      <Book3D book={book} size="md" />

                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 text-amber-400 font-bold text-xs z-10">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-white">{book.rating}</span>
                      </div>

                      {/* Category Label */}
                      <div className="absolute top-3 right-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider z-10">
                        {book.category}
                      </div>
                    </div>

                    {/* Book Text Details */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-slate-800/40">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-semibold ${sub}`}>ISBN: {book.isbn}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isAvailable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isAvailable ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                        <h3 className={`font-black text-sm leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors ${text}`}>
                          {book.title}
                        </h3>
                        <p className={`text-xs font-semibold ${sub}`}>{book.author}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 pt-3 border-t border-slate-800/40">
                        <div className={`flex items-center justify-between text-xs font-semibold ${sub}`}>
                          <span>Tahun: {book.year}</span>
                          <span>Stok: {book.stock} Eks</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              soundFX.playBookOpen();
                              setSelectedBook3D(book);
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                              dk ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            Buka 3D
                          </button>

                          <button
                            onClick={() => {
                              soundFX.playClick();
                              if (!currentUser) {
                                onNavigate('login');
                              } else {
                                onOpenPinjamModal(book);
                              }
                            }}
                            disabled={!isAvailable}
                            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl shadow-lg transition-all cursor-pointer ${
                              isAvailable
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                            }`}
                          >
                            Pinjam
                          </button>

                          <button
                            onClick={() => {
                              soundFX.playClick();
                              onToggleFavorite(book.id);
                            }}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border cursor-pointer ${
                              isFav
                                ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                                : dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
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
            <div className={`p-12 text-center max-w-lg mx-auto space-y-5 rounded-2xl border shadow-xl ${card}`}>
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className={`font-black text-xl ${text}`}>Buku Tidak Ditemukan</h3>
                <p className={`text-xs leading-relaxed max-w-md mx-auto ${sub}`}>
                  Kata kunci pencarian atau filter yang Anda pilih tidak cocok dengan data buku apa pun dalam katalog.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                Bersihkan Seluruh Saringan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3D BOOK OPEN MODAL */}
      {selectedBook3D && (
        <BookOpen3DModal
          book={selectedBook3D}
          onClose={() => setSelectedBook3D(null)}
          onReadEbook={(b) => {
            setSelectedBook3D(null);
            setReadingBook3D(b);
          }}
          onPinjam={(b) => {
            setSelectedBook3D(null);
            if (!currentUser) onNavigate('login');
            else onOpenPinjamModal(b);
          }}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(selectedBook3D.id)}
        />
      )}

      {/* 3D E-READER MODAL */}
      {readingBook3D && (
        <EBookReader3D
          book={readingBook3D}
          onClose={() => setReadingBook3D(null)}
        />
      )}
    </div>
  );
}

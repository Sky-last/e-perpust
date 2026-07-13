/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Clock, 
  User as UserIcon, 
  Search, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Calendar, 
  ChevronRight,
  LogOut,
  Edit,
  Save,
  Bell
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, Notification } from '../../types';

interface SiswaDashboardProps {
  currentUser: User;
  onLogout: () => void;
  books: Book[];
  categories: Category[];
  borrowings: Borrowing[];
  notifications: Notification[];
  settings: LibrarySettings;
  onRequestBorrow: (bookId: string, durationDays: number, notes?: string) => void;
  onRequestReturn: (borrowingId: string) => void;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onMarkNotifRead: (notifId: string) => void;
}

export default function SiswaDashboard({
  currentUser,
  onLogout,
  books,
  categories,
  borrowings,
  notifications,
  settings,
  onRequestBorrow,
  onRequestReturn,
  onUpdateProfile,
  onMarkNotifRead
}: SiswaDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'books' | 'history' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Borrow form states
  const [borrowDays, setBorrowDays] = useState<number>(settings.maxBorrowDays);
  const [borrowNotes, setBorrowNotes] = useState('');
  const [isBorrowingModalOpen, setIsBorrowingModalOpen] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editClass, setEditClass] = useState(currentUser.class || '');

  // Notifications Popover state
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    const bookCategory = categories.find(c => c.id === book.categoryId);
    const categoryName = bookCategory ? bookCategory.name.toLowerCase() : '';
    const matchesCategory = selectedCategory === 'all' || book.categoryId === selectedCategory;

    return (matchesSearch || categoryName.includes(searchQuery.toLowerCase())) && matchesCategory;
  });

  const getCategoryName = (catId: string | undefined) => {
    if (!catId) return 'Lainnya';
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Lainnya';
  };

  const myBorrowings = borrowings.filter((b) => b.studentId === currentUser.id);
  const myUnreadNotifications = notifications.filter(n => n.userId === currentUser.id && !n.read);

  const handleBorrowRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    onRequestBorrow(selectedBook.id, borrowDays, borrowNotes);
    setBorrowSuccess(true);
    setBorrowNotes('');
    
    setTimeout(() => {
      setBorrowSuccess(false);
      setIsBorrowingModalOpen(false);
      setSelectedBook(null);
    }, 2000);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      class: editClass
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900" id="student-dashboard">
      {/* SIDEBAR NAVIGATION FOR DESKTOP */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shrink-0 hidden md:flex shadow-xs">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 pb-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900 tracking-wider uppercase">SISWA PANEL</h2>
              <span className="text-[9px] text-blue-600 font-bold uppercase">Perpustakaan Digital</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <Home className="w-4 h-4" /> Beranda Ringkasan
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'books' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Katalog Buku
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <Clock className="w-4 h-4" /> Riwayat Pinjam
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <UserIcon className="w-4 h-4" /> Profil Saya
            </button>
          </nav>
        </div>

        {/* User Card & Logout at the bottom of sidebar */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-gray-500 font-medium">{currentUser.class || 'Siswa'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <div className="flex-1 min-h-screen flex flex-col overflow-y-auto bg-gray-50">
        {/* HEADER SECTION */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo icon for mobile */}
              <div className="md:hidden w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase border border-blue-100">
                  Siswa • {currentUser.class}
                </span>
                <h1 className="text-sm font-bold text-gray-900 mt-0.5">{currentUser.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-all relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {myUnreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto text-gray-900"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                      <h3 className="text-xs font-bold text-gray-900">Notifikasi Terbaru</h3>
                      <span className="text-[10px] text-gray-500">{myUnreadNotifications.length} Baru</span>
                    </div>
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">Belum ada notifikasi.</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications
                          .filter(n => n.userId === currentUser.id)
                          .map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                onMarkNotifRead(n.id);
                              }}
                              className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                                n.read ? 'bg-gray-50/60 opacity-60' : 'bg-blue-50/40 border-l-2 border-blue-600'
                              }`}
                            >
                              <h4 className="text-xs font-semibold text-gray-900">{n.title}</h4>
                              <p className="text-[10px] text-gray-600 mt-1">{n.message}</p>
                              <span className="text-[9px] text-gray-400 block mt-1">
                                {new Date(n.date).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={onLogout}
                className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 hover:text-rose-700 transition-all cursor-pointer md:hidden"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Responsive Mobile Navigation Tabs (Hidden on Desktop) */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-start overflow-x-auto gap-1.5 scrollbar-none sticky top-[73px] z-30 shadow-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
              activeTab === 'home' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
              activeTab === 'books' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Katalog Buku
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Riwayat Pinjam
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Profil Saya
          </button>
        </div>

        {/* BODY CONTENT SCROLLER */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
          
          {/* TAB 1: HOME (BERANDA) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Promo Banner / Info Card */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-[-10%] bottom-[-20%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2.5 py-1 rounded-full border border-white/10">
                  Sistem Perpustakaan SMA
                </span>
                <h2 className="text-2xl font-bold mt-3 leading-tight">Jelajahi Dunia Lewat Lembaran Buku Digital</h2>
                <p className="text-xs text-blue-100 mt-2 max-w-lg">
                  Pinjam buku pelajaran, modul olimpiade, hingga sastra populer dari mana saja secara real-time. Kembalikan tepat waktu untuk reputasi keanggotaan prima!
                </p>
                <div className="mt-4 flex gap-4 text-xs font-semibold">
                  <div className="bg-white/10 px-3 py-1.5 rounded">
                    Max Pinjam: {settings.maxBorrowBooks} Buku
                  </div>
                  <div className="bg-white/10 px-3 py-1.5 rounded">
                    Denda: Rp {settings.finePerDay.toLocaleString()}/hari
                  </div>
                </div>
              </div>

              {/* Quick Stat Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sedang Dipinjam</span>
                  <span className="text-xl md:text-2xl font-extrabold text-blue-600 mt-1">
                    {myBorrowings.filter((b) => b.status === 'approved' || b.status === 'overdue').length} Buku
                  </span>
                </div>
                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
                  <span className="text-xl md:text-2xl font-extrabold text-amber-500 mt-1">
                    {myBorrowings.filter((b) => b.status === 'pending').length} Buku
                  </span>
                </div>
                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Denda Aktif</span>
                  <span className="text-xl md:text-2xl font-extrabold text-rose-600 mt-1">
                    Rp {myBorrowings.reduce((sum, b) => sum + (b.finePaid ? 0 : (b.fineAmount ?? 0)), 0).toLocaleString()}
                  </span>
                </div>
              </div>

            {/* Real-time Search Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-950">Cari Buku Cepat</h3>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul, penulis, penerbit, ISBN, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            {/* Recommended / All Books Slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-950">Rekomendasi Buku Utama</h3>
                <button 
                  onClick={() => setActiveTab('books')}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {books.slice(0, 4).map((book) => (
                  <div 
                    key={book.id} 
                    onClick={() => setSelectedBook(book)}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <img 
                        src={book.coverUrl || ''} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 text-[9px] bg-white/90 text-blue-600 px-2 py-0.5 rounded-full border border-gray-100 font-medium">
                        {book.rackLocation}
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-[9px] text-blue-600 font-bold uppercase block">
                        {getCategoryName(book.categoryId)}
                      </span>
                      <h4 className="text-xs font-bold text-gray-950 mt-1 line-clamp-1">{book.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{book.author}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[9px] font-semibold ${book.stock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}`}>
                          Stok: {book.stock}/{book.totalStock}
                        </span>
                        <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                          {book.year}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKS (KATALOG BUKU) */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            {/* Search and Categories Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4 shadow-xs">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik kata kunci pencarian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Horizontal Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-xs rounded-full border transition-all shrink-0 cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100 font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100 font-bold'
                        : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div>
              <p className="text-xs text-gray-500 mb-3">Menampilkan {filteredBooks.length} buku pilihan</p>
              
              {filteredBooks.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-xs">
                  <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">Buku tidak ditemukan. Coba ganti kata kunci atau kategori pencarian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <div 
                      key={book.id} 
                      onClick={() => setSelectedBook(book)}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="aspect-[3/4] bg-gray-100 relative">
                        <img 
                          src={book.coverUrl || ''} 
                          alt={book.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-white/90 text-gray-700 px-2 py-0.5 rounded border border-gray-100 font-medium shadow-xs">
                          Rak: {book.rackLocation}
                        </span>
                      </div>
                      <div className="p-3">
                        <span className="text-[9px] text-blue-600 font-bold uppercase block">
                          {getCategoryName(book.categoryId)}
                        </span>
                        <h4 className="text-xs font-bold text-gray-950 mt-1 line-clamp-1">{book.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{book.author}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                          <span className={`text-[9px] font-bold ${book.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {book.stock > 0 ? `Sisa: ${book.stock} Pcs` : 'Habis'}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            {book.publisher}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RIWAYAT PEMINJAMAN (TRANSAKSI) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900">Riwayat Transaksi & Peminjaman</h3>
            <p className="text-xs text-gray-500">Daftar buku yang Anda ajukan, sedang dipinjam, atau sudah dikembalikan.</p>

            {myBorrowings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-xs">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-gray-500">Belum ada transaksi peminjaman terdaftar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBorrowings.map((b) => {
                  const book = books.find((x) => x.id === b.bookId);
                  return (
                    <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-start gap-3">
                        <img 
                          src={book?.coverUrl} 
                          alt={book?.title} 
                          className="w-12 h-16 rounded object-cover border border-gray-100 shadow-xs"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{book?.title || 'Judul Buku'}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">Penulis: {book?.author}</p>
                          <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Pinjam: {b.borrowDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Kembali: {b.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 gap-3">
                        {/* Status badge */}
                        <div>
                          {b.status === 'pending' && (
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Pending Verifikasi
                            </span>
                          )}
                          {b.status === 'approved' && (
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Aktif Dipinjam
                            </span>
                          )}
                          {b.status === 'returned' && (
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Sudah Kembali
                            </span>
                          )}
                          {b.status === 'overdue' && (
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                              Terlambat
                            </span>
                          )}
                          {b.status === 'rejected' && (
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-gray-100 text-gray-500 border border-gray-200">
                              Ditolak Petugas
                            </span>
                          )}
                        </div>

                        {/* Fine info */}
                        {(b.fineAmount ?? 0) > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] text-rose-600 font-semibold block">
                              Denda: Rp {(b.fineAmount ?? 0).toLocaleString()}
                            </span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded ${b.finePaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {b.finePaid ? 'Lunas' : 'Belum Bayar'}
                            </span>
                          </div>
                        )}

                        {/* Return Action Button */}
                        {(b.status === 'approved' || b.status === 'overdue') && (
                          <button
                            onClick={() => onRequestReturn(b.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Ajukan Pengembalian
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE (PROFIL SISWA) */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <img 
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                  alt={currentUser.name} 
                  className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover shadow-sm"
                />
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">NISN: {currentUser.nisn || '-'}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Siswa - {currentUser.class || '-'}</p>
                  <span className="inline-block mt-3 px-3 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200 uppercase">
                    Status Akun: Aktif
                  </span>
                </div>
                <div>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Profil
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Save className="w-3.5 h-3.5" /> Simpan
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Profile & Fields */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 disabled:opacity-50 disabled:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Email Sekolah (Immutable)</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nomor Handphone</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 disabled:opacity-50 disabled:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Kelas</label>
                    <select
                      disabled={!isEditingProfile}
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 disabled:opacity-50 disabled:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    >
                      <option value="X MIPA 1">X MIPA 1</option>
                      <option value="X IPS 1">X IPS 1</option>
                      <option value="XI MIPA 2">XI MIPA 2</option>
                      <option value="XI IPS 1">XI IPS 1</option>
                      <option value="XII MIPA 3">XII MIPA 3</option>
                      <option value="XII IPS 2">XII IPS 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* DETAILED BOOK / BORROW DIALOG MODAL */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative text-gray-900 animate-scaleIn"
            >
              <button 
                onClick={() => {
                  setSelectedBook(null);
                  setIsBorrowingModalOpen(false);
                }}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!isBorrowingModalOpen ? (
                // VIEW DETAIL MODE
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  <div className="md:col-span-4 aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <img 
                      src={selectedBook.coverUrl || ''} 
                      alt={selectedBook.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase border border-blue-100">
                        {getCategoryName(selectedBook.categoryId)}
                      </span>
                      <h3 className="text-xl font-bold text-gray-950 mt-1.5">{selectedBook.title}</h3>
                      <p className="text-xs text-gray-500">Oleh: <strong className="text-gray-800">{selectedBook.author}</strong></p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-y border-gray-100 py-3">
                      <p className="text-gray-400">Penerbit: <span className="text-gray-700 font-semibold">{selectedBook.publisher}</span></p>
                      <p className="text-gray-400">Tahun Terbit: <span className="text-gray-700 font-semibold">{selectedBook.year}</span></p>
                      <p className="text-gray-400">ISBN: <span className="text-gray-700 font-semibold">{selectedBook.isbn}</span></p>
                      <p className="text-gray-400">Lokasi Rak: <span className="text-blue-600 font-bold flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {selectedBook.rackLocation}</span></p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-500">Sinopsis</h4>
                      <p className="text-xs text-gray-600 leading-relaxed max-h-32 overflow-y-auto pr-1">
                        {selectedBook.synopsis}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Ketersediaan Stok</span>
                        <span className={`text-sm font-bold ${selectedBook.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {selectedBook.stock > 0 ? `${selectedBook.stock} Buku Tersedia` : 'Sedang Habis Dipinjam'}
                        </span>
                      </div>

                      <button
                        disabled={selectedBook.stock === 0}
                        onClick={() => setIsBorrowingModalOpen(true)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shadow-blue-100"
                      >
                        Ajukan Peminjaman
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // BORROW FORM MODE
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-950 mb-2">Formulir Pengajuan Peminjaman</h3>
                  <p className="text-xs text-gray-500 mb-6">Buku: <strong className="text-gray-800">{selectedBook.title}</strong></p>

                  {borrowSuccess ? (
                    <div className="py-8 text-center space-y-3">
                      <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                      <h4 className="text-md font-bold text-gray-950">Pengajuan Berhasil Dikirim!</h4>
                      <p className="text-xs text-gray-500">Silakan temui petugas di perpustakaan sekolah untuk serah terima buku fisik.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBorrowRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Durasi Peminjaman (Maks {settings.maxBorrowDays} Hari)</label>
                        <select
                          value={borrowDays}
                          onChange={(e) => setBorrowDays(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          {Array.from({ length: settings.maxBorrowDays }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{day} Hari</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Catatan Peminjaman (Opsional)</label>
                        <textarea
                          rows={3}
                          value={borrowNotes}
                          onChange={(e) => setBorrowNotes(e.target.value)}
                          placeholder="Contoh: Kebutuhan riset olimpiade fisika..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 text-[11px] text-gray-600 space-y-1">
                        <p className="text-amber-800 font-bold">Penting:</p>
                        <p>1. Buku harus dikembalikan tepat waktu sebelum tanggal jatuh tempo.</p>
                        <p>2. Keterlambatan dikenakan denda administratif sebesar <strong>Rp {settings.finePerDay.toLocaleString()}/hari</strong>.</p>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsBorrowingModalOpen(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Kembali
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shadow-blue-100"
                        >
                          Kirim Pengajuan
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  X, 
  Calendar, 
  ChevronRight,
  LogOut,
  Edit,
  Save,
  Bell,
  Menu,
  BookMarked,
  Info,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles,
  Zap,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, Notification } from '../../types';
import { uploadAvatar } from '../../lib/db';
import Book3D from '../Book3D';
import BookOpen3DModal from '../BookOpen3DModal';
import EBookReader3D from '../EBookReader3D';

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
  const [readingBook3D, setReadingBook3D] = useState<Book | null>(null);
  
  // Borrow form states
  const [borrowDays, setBorrowDays] = useState<number>(settings.maxBorrowDays);
  const [borrowNotes, setBorrowNotes] = useState('');
  const [isBorrowingModalOpen, setIsBorrowingModalOpen] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const url = await uploadAvatar(currentUser.id, file);
    if (url) {
      onUpdateProfile({ avatarUrl: url });
    }
    setIsUploadingAvatar(false);
  };
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editClass, setEditClass] = useState(currentUser.class || '');

  // UI States
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { id: 'home', label: 'Beranda Ringkasan', icon: Home },
    { id: 'books', label: 'Katalog Buku', icon: BookMarked },
    { id: 'history', label: 'Riwayat Pinjam', icon: Clock },
    { id: 'profile', label: 'Profil Saya', icon: UserIcon }
  ];

  return (
    <div className="h-screen bg-slate-950 flex text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white" id="student-dashboard">
      
      {/* ── MODERN GLASS SIDEBAR ── */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 shrink-0 hidden lg:flex flex-col shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-hidden z-20`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          {!sidebarCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 flex-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0 ring-1 ring-white/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black text-white tracking-wider uppercase truncate flex items-center gap-1.5">
                  Siswa Panel <Sparkles className="w-3 h-3 text-cyan-400" />
                </h2>
                <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-widest block">Pustaka Digital</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mx-auto ring-1 ring-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 hidden sm:block border border-slate-800"
            title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 border border-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_12px_#38bdf8]" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 shrink-0 bg-slate-900/40">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-xl border border-slate-750/50">
              <img 
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-blue-500/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-cyan-400 font-semibold truncate mt-0.5">{currentUser.class || 'Siswa'}</p>
              </div>
            </div>
          ) : (
            <img 
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-blue-500/30 mx-auto"
            />
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-xl transition-all cursor-pointer text-xs font-bold shadow-lg shadow-rose-500/5"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white tracking-wider uppercase">Siswa Panel</h2>
                    <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-widest">Pustaka Digital</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-800 space-y-3">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CANVAS BLOCK ── */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-cyan-500/20 tracking-wider">
                Siswa • {currentUser.class}
              </span>
              <h1 className="text-sm lg:text-base font-black text-white mt-1 flex items-center gap-2">
                {currentUser.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white border border-slate-700/60 transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {myUnreadNotifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-750 shadow-2xl rounded-2xl p-4 z-50 max-h-96 overflow-y-auto text-slate-100"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                      <h3 className="text-xs font-bold text-white">Notifikasi</h3>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded-md border border-cyan-500/20">{myUnreadNotifications.length} Baru</span>
                    </div>
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <div className="text-center py-6 text-slate-500">
                        <Bell className="w-7 h-7 mx-auto mb-2 text-slate-700" />
                        <p className="text-xs font-medium">Belum ada notifikasi.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications
                          .filter(n => n.userId === currentUser.id)
                          .map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => onMarkNotifRead(n.id)}
                              className={`p-3 rounded-xl text-left transition-colors cursor-pointer border ${
                                n.read 
                                  ? 'bg-slate-950/40 opacity-60 border-slate-800' 
                                  : 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10'
                              }`}
                            >
                              <h4 className="text-xs font-bold text-white">{n.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-slate-500 block mt-1.5 font-semibold">
                                {new Date(n.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── BODY CONTENT SCROLLER ── */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ── TAB 1: HOME (BERANDA) ── */}
            {activeTab === 'home' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Hero Card */}
                <div className="relative bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 rounded-2xl p-6 lg:p-8 text-white shadow-2xl overflow-hidden border border-blue-500/20 backdrop-blur-xl">
                  <div className="absolute right-[-10%] bottom-[-20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest bg-cyan-500/15 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                    <Zap className="w-3 h-3 text-cyan-400" /> Perpustakaan Digital SMA
                  </span>
                  <h2 className="text-xl lg:text-3xl font-black mt-4 leading-tight max-w-xl text-white">
                    Jelajahi Dunia Lewat Buku & E-Reader 3D
                  </h2>
                  <p className="text-xs text-slate-300 mt-2.5 max-w-lg leading-relaxed font-medium">
                    Pinjam buku pelajaran, modul olimpiade, hingga novel digital secara real-time. Nikmati pengalaman membaca 3D yang interaktif!
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-bold">
                    <div className="bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-slate-300">
                      Maks Peminjaman: <strong className="text-cyan-400">{settings.maxBorrowBooks} Buku</strong>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-slate-300">
                      Denda Terlambat: <strong className="text-rose-400">Rp {settings.finePerDay.toLocaleString()}/hari</strong>
                    </div>
                  </div>
                </div>

                {/* Quick Stat Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { 
                      label: 'Sedang Dipinjam', 
                      val: `${myBorrowings.filter((b) => b.status === 'approved' || b.status === 'overdue').length} Buku`,
                      border: 'border-blue-500/30',
                      badge: 'bg-blue-500/10 text-blue-400'
                    },
                    { 
                      label: 'Menunggu Verifikasi', 
                      val: `${myBorrowings.filter((b) => b.status === 'pending').length} Buku`,
                      border: 'border-amber-500/30',
                      badge: 'bg-amber-500/10 text-amber-400'
                    },
                    { 
                      label: 'Total Denda Aktif', 
                      val: `Rp ${myBorrowings.reduce((sum, b) => sum + (b.finePaid ? 0 : (b.fineAmount ?? 0)), 0).toLocaleString()}`,
                      border: 'border-rose-500/30',
                      badge: 'bg-rose-500/10 text-rose-400'
                    }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -3 }}
                      className={`bg-slate-900/80 backdrop-blur-md border ${stat.border} shadow-lg rounded-2xl p-5 flex items-center justify-between`}
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{stat.label}</span>
                        <h3 className="text-lg lg:text-xl font-black text-white mt-1">{stat.val}</h3>
                      </div>
                      <span className={`p-2.5 rounded-xl font-bold ${stat.badge}`}>
                        <Calendar className="w-5 h-5" />
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Real-time Search Panel */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3.5">
                  <h3 className="text-xs lg:text-sm font-black text-white">Cari Koleksi Buku</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari judul, penulis, penerbit, ISBN, atau kategori..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 placeholder-slate-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Recommended Books */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs lg:text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Rekomendasi Buku
                    </h3>
                    <button 
                      onClick={() => setActiveTab('books')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {books.slice(0, 4).map((book) => (
                      <motion.div 
                        key={book.id} 
                        onClick={() => setSelectedBook(book)}
                        whileHover={{ y: -4 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5"
                      >
                        <div className="aspect-[3/4] bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800 p-4">
                          <Book3D book={book} size="md" />
                          <span className="absolute top-2.5 right-2.5 text-[9px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded-lg font-bold border border-slate-700 z-10">
                            Rak {book.rackLocation}
                          </span>
                        </div>
                        <div className="p-4">
                          <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-black uppercase border border-cyan-500/20">
                            {getCategoryName(book.categoryId)}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{book.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{book.author}</p>
                          
                          <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[9px] font-bold">
                            <span className={book.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              Stok {book.stock}/{book.totalStock || book.stock}
                            </span>
                            <span className="text-slate-500">{book.year}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: BOOKS (KATALOG BUKU) ── */}
            {activeTab === 'books' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Search & Categories */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan judul, penulis, penerbit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 placeholder-slate-500 transition-all font-medium"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-400/30 shadow-lg'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-400/30 shadow-lg'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Books Grid */}
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-bold">Menampilkan {filteredBooks.length} buku pilihan</p>
                  
                  {filteredBooks.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center">
                      <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-white">Buku tidak ditemukan</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">Coba ganti kata kunci pencarian atau kategori.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredBooks.map((book) => (
                        <motion.div 
                          key={book.id} 
                          onClick={() => setSelectedBook(book)}
                          whileHover={{ y: -4 }}
                          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:border-cyan-500/40 hover:shadow-xl"
                        >
                          <div className="aspect-[3/4] bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800 p-4">
                            <Book3D book={book} size="md" />
                            <span className="absolute bottom-2.5 left-2.5 text-[9px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-bold z-10">
                              Rak: {book.rackLocation}
                            </span>
                          </div>
                          <div className="p-4">
                            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-black uppercase border border-cyan-500/20">
                              {getCategoryName(book.categoryId)}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{book.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{book.author}</p>
                            
                            <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[9px] font-bold">
                              <span className={book.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {book.stock > 0 ? `Sisa ${book.stock} Eks` : 'Stok Habis'}
                              </span>
                              <span className="text-slate-500">{book.publisher}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: RIWAYAT PEMINJAMAN ── */}
            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-sm lg:text-base font-black text-white">Riwayat Transaksi Peminjaman</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Daftar sirkulasi buku yang sedang dipinjam, menunggu persetujuan, atau selesai dikembalikan.</p>
                </div>

                {myBorrowings.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center">
                    <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white">Belum ada transaksi peminjaman</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Kunjungi katalog buku untuk mengajukan permohonan sirkulasi perdana.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {myBorrowings.map((b) => {
                      const book = books.find((x) => x.id === b.bookId);
                      return (
                        <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4.5 shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-16 flex items-center justify-center shrink-0 overflow-visible">
                              {book ? <Book3D book={book} size="xs" /> : <div className="w-9 h-12 bg-slate-800 rounded-md animate-pulse" />}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white leading-snug">{book?.title || 'Buku Tidak Diketahui'}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">Penulis: {book?.author}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold mt-2.5">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  Peminjaman: {b.borrowDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  Jatuh Tempo: {b.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800 pt-3.5 md:pt-0 gap-3">
                            <div>
                              {b.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  <Clock className="w-2.5 h-2.5" /> Pending Verifikasi
                                </span>
                              )}
                              {b.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Aktif Dipinjam
                                </span>
                              )}
                              {b.status === 'returned' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Sudah Kembali
                                </span>
                              )}
                              {b.status === 'overdue' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                                  <AlertCircle className="w-2.5 h-2.5" /> Terlambat
                                </span>
                              )}
                              {b.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                                  <X className="w-2.5 h-2.5" /> Ditolak
                                </span>
                              )}
                            </div>

                            {(b.fineAmount ?? 0) > 0 && (
                              <div className="text-right">
                                <span className="text-[10px] text-rose-400 font-extrabold block">
                                  Denda: Rp {(b.fineAmount ?? 0).toLocaleString()}
                                </span>
                                <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 mt-0.5 rounded-md ${b.finePaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                  {b.finePaid ? 'Lunas' : 'Belum Dibayar'}
                                </span>
                              </div>
                            )}

                            {(b.status === 'approved' || b.status === 'overdue') && (
                              <button
                                onClick={() => onRequestReturn(b.id)}
                                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-md"
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
              </motion.div>
            )}

            {/* ── TAB 4: PROFILE ── */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                    <div className="relative group shrink-0">
                      <img 
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                        alt={currentUser.name} 
                        className="w-24 h-24 rounded-2xl ring-4 ring-cyan-500/30 object-cover shadow-xl"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        {isUploadingAvatar ? (
                          <span className="text-white text-[10px] font-bold">Uploading...</span>
                        ) : (
                          <Camera className="w-6 h-6 text-cyan-400" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                          disabled={isUploadingAvatar}
                        />
                      </label>
                    </div>
                    <div className="text-center md:text-left flex-1 space-y-1">
                      <h3 className="text-lg lg:text-xl font-black text-white">{currentUser.name}</h3>
                      <p className="text-xs text-slate-400 font-bold">NISN: {currentUser.nisn || '-'}</p>
                      <p className="text-xs text-cyan-400 font-extrabold">Siswa Kelas {currentUser.class || '-'}</p>
                      <span className="inline-block mt-2 px-3 py-1 text-[9px] font-black bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 uppercase">
                        Akun Terverifikasi
                      </span>
                    </div>
                    <div>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
                        >
                          <Edit className="w-3.5 h-3.5 text-cyan-400" /> Edit Profil
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                        >
                          <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 text-xs font-bold text-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1.5 uppercase">Nama Lengkap</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-cyan-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1.5 uppercase">Email Sekolah</label>
                        <input
                          type="email"
                          disabled
                          value={currentUser.email}
                          className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1.5 uppercase">Nomor Handphone</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-cyan-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1.5 uppercase">Kelas Belajar</label>
                        <select
                          disabled={!isEditingProfile}
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-cyan-500 font-bold"
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
              </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* ── MODALS ── */}
      {selectedBook && !isBorrowingModalOpen && (
        <BookOpen3DModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onReadEbook={(b) => { setSelectedBook(null); setReadingBook3D(b); }}
          onPinjam={() => setIsBorrowingModalOpen(true)}
        />
      )}

      {readingBook3D && (
        <EBookReader3D book={readingBook3D} onClose={() => setReadingBook3D(null)} />
      )}

      <AnimatePresence>
        {selectedBook && isBorrowingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl max-w-lg w-full p-6 relative text-slate-100"
            >
              <button 
                onClick={() => setIsBorrowingModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-2 text-xs font-semibold">
                <h3 className="text-base font-black text-white mb-1">Formulir Pengajuan Peminjaman</h3>
                <p className="text-xs text-slate-400 mb-5 font-bold">Buku: <strong className="text-cyan-400">{selectedBook.title}</strong></p>

                {borrowSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                    <h4 className="text-md font-bold text-white">Pengajuan Berhasil Dikirim!</h4>
                    <p className="text-xs text-slate-400 font-medium">Silakan temui petugas di perpustakaan sekolah untuk serah terima buku fisik.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBorrowRequestSubmit} className="space-y-4">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1.5 uppercase">Durasi Peminjaman (Maks {settings.maxBorrowDays} Hari)</label>
                      <select
                        value={borrowDays}
                        onChange={(e) => setBorrowDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                      >
                        {Array.from({ length: settings.maxBorrowDays }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>{day} Hari</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1.5 uppercase">Catatan Peminjaman (Opsional)</label>
                      <textarea
                        rows={3}
                        value={borrowNotes}
                        onChange={(e) => setBorrowNotes(e.target.value)}
                        placeholder="Contoh: Kebutuhan riset olimpiade fisika..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
                      />
                    </div>

                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-[11px] text-amber-300 space-y-1 font-bold">
                      <p className="text-amber-400 font-black flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Ketentuan Peminjaman:</p>
                      <p>1. Buku wajib dikembalikan sebelum tanggal jatuh tempo.</p>
                      <p>2. Keterlambatan dikenakan denda sebesar <strong>Rp {settings.finePerDay.toLocaleString()}/hari</strong>.</p>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsBorrowingModalOpen(false)}
                        className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-cyan-500/20"
                      >
                        Kirim Pengajuan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

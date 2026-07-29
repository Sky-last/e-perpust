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
  Bell,
  Menu,
  BookMarked,
  Info,
  CheckCircle2,
  AlertCircle,
  Camera
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, Notification } from '../../types';
import { uploadAvatar } from '../../lib/db';
import Book3D from '../Book3D';
import BookOpen3DModal from '../BookOpen3DModal';
import EBookReader3D from '../EBookReader3D';
import { soundFX } from '../../utils/audio';

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

  return (
    <div className="h-screen bg-slate-50 flex text-slate-900 overflow-hidden font-sans" id="student-dashboard">
      
      {/* MODERN DARK SIDEBAR NAVIGATION */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 border-r border-slate-800 shrink-0 hidden lg:flex flex-col shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-hidden z-20`}>
        {/* Logo Brand with Animation */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          {!sidebarCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 flex-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black text-white tracking-wider uppercase truncate">Siswa Panel</h2>
                <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest">Pustaka Digital</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mx-auto">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-all cursor-pointer shrink-0 hidden sm:block"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Beranda Ringkasan', icon: Home },
              { id: 'books', label: 'Katalog Buku', icon: BookMarked },
              { id: 'history', label: 'Riwayat Pinjam', icon: Clock },
              { id: 'profile', label: 'Profil Saya', icon: UserIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {!sidebarCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow" 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" 
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Details - Fixed */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-xl border border-slate-850">
              <img 
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-lg object-cover border border-slate-700 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{currentUser.class || 'Siswa'}</p>
              </div>
            </div>
          ) : (
            <img 
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-lg object-cover border border-slate-700 shadow-sm mx-auto"
            />
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer text-xs font-bold shadow-md shadow-rose-900/10"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Keluar Panel</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
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
              <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white tracking-wider uppercase">Siswa Panel</h2>
                    <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest">Pustaka Digital</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-450 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                {[
                  { id: 'home', label: 'Beranda Ringkasan', icon: Home },
                  { id: 'books', label: 'Katalog Buku', icon: BookMarked },
                  { id: 'history', label: 'Riwayat Pinjam', icon: Clock },
                  { id: 'profile', label: 'Profil Saya', icon: UserIcon }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 p-2.5 bg-slate-800/30 rounded-xl border border-slate-850">
                  <img 
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-lg object-cover border border-slate-700 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{currentUser.class || 'Siswa'}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer text-xs font-bold shadow-md shadow-rose-900/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Panel</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CANVAS BLOCK */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        
        {/* Glassmorphic Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 lg:px-8 py-3.5 lg:py-4.5 flex justify-between items-center sticky top-0 z-10 shadow-xs shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-650 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            <div>
              <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase border border-blue-100/50">
                Siswa • {currentUser.class}
              </span>
              <h1 className="text-sm lg:text-base font-black text-slate-900 mt-1 flex items-center gap-2">
                {currentUser.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 border border-slate-200/60 transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {myUnreadNotifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4.5 z-50 max-h-96 overflow-y-auto text-slate-800"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900">Notifikasi Terbaru</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md">{myUnreadNotifications.length} Baru</span>
                    </div>
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <div className="text-center py-6 text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-slate-250" />
                        <p className="text-xs font-medium">Belum ada notifikasi.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications
                          .filter(n => n.userId === currentUser.id)
                          .map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                onMarkNotifRead(n.id);
                              }}
                              className={`p-3 rounded-xl text-left transition-colors cursor-pointer border ${
                                n.read 
                                  ? 'bg-slate-50/50 opacity-60 border-slate-100' 
                                  : 'bg-blue-50/20 border-blue-100 hover:bg-blue-50/40'
                              }`}
                            >
                              <h4 className="text-xs font-extrabold text-slate-900">{n.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-slate-450 block mt-1.5 font-semibold">
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

            {/* Logout shortcut for mobile */}
            <button 
              onClick={onLogout}
              className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-600 hover:text-rose-700 border border-rose-100 transition-all cursor-pointer lg:hidden"
              title="Keluar"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* BODY CONTENT SCROLLER */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* TAB 1: HOME (BERANDA) */}
            {activeTab === 'home' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Promo Banner / Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-750 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden border border-blue-700/20">
                  <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[9px] uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/10">
                    Sistem Perpustakaan SMA
                  </span>
                  <h2 className="text-xl lg:text-3xl font-black mt-4 leading-tight max-w-xl">
                    Jelajahi Dunia Lewat Lembaran Buku Digital
                  </h2>
                  <p className="text-xs text-blue-100/90 mt-2.5 max-w-lg leading-relaxed font-medium">
                    Pinjam buku pelajaran, modul olimpiade, hingga sastra populer secara real-time. Kembalikan tepat waktu untuk reputasi keanggotaan prima!
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-bold">
                    <div className="bg-white/15 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/5">
                      Maks Peminjaman: {settings.maxBorrowBooks} Buku
                    </div>
                    <div className="bg-white/15 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/5">
                      Denda Terlambat: Rp {settings.finePerDay.toLocaleString()}/hari
                    </div>
                  </div>
                </div>

                {/* Quick Stat Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { 
                      label: 'Sedang Dipinjam', 
                      val: `${myBorrowings.filter((b) => b.status === 'approved' || b.status === 'overdue').length} Buku`,
                      color: 'border-blue-500/20 shadow-blue-500/5', 
                      accent: 'text-blue-600 bg-blue-50' 
                    },
                    { 
                      label: 'Menunggu Verifikasi', 
                      val: `${myBorrowings.filter((b) => b.status === 'pending').length} Buku`,
                      color: 'border-amber-500/20 shadow-amber-500/5', 
                      accent: 'text-amber-600 bg-amber-50' 
                    },
                    { 
                      label: 'Total Denda Aktif', 
                      val: `Rp ${myBorrowings.reduce((sum, b) => sum + (b.finePaid ? 0 : (b.fineAmount ?? 0)), 0).toLocaleString()}`,
                      color: 'border-rose-500/20 shadow-rose-500/5', 
                      accent: 'text-rose-600 bg-rose-50' 
                    }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -4 }}
                      className={`bg-white border ${stat.color} shadow-sm rounded-2xl p-5 flex items-center justify-between transition-all`}
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{stat.label}</span>
                        <h3 className="text-lg lg:text-xl font-black text-slate-800 mt-1">{stat.val}</h3>
                      </div>
                      <span className={`p-2.5 rounded-xl font-bold ${stat.accent}`}>
                        <Calendar className="w-5 h-5" />
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Real-time Search Panel */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs space-y-3.5">
                  <h3 className="text-xs lg:text-sm font-black text-slate-800">Cari Koleksi Buku</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan judul, penulis, penerbit, ISBN, atau kategori..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white placeholder-slate-400 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Recommended / All Books Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs lg:text-sm font-black text-slate-800">Rekomendasi Buku</h3>
                    <button 
                      onClick={() => setActiveTab('books')}
                      className="text-xs text-blue-650 hover:text-blue-750 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {books.slice(0, 4).map((book) => (
                      <motion.div 
                        key={book.id} 
                        onClick={() => setSelectedBook(book)}
                        whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                        className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden cursor-pointer group transition-all"
                      >
                        <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 p-4">
                          <Book3D book={book} size="md" />
                          <span className="absolute top-2.5 right-2.5 text-[9px] bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg font-bold z-10">
                            Rak {book.rackLocation}
                          </span>
                        </div>
                        <div className="p-4">
                          <span className="text-[9px] text-blue-650 bg-blue-50 px-2 py-0.5 rounded font-black uppercase">
                            {getCategoryName(book.categoryId)}
                          </span>
                          <h4 className="text-xs font-bold text-slate-850 mt-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{book.title}</h4>
                          <p className="text-[10px] text-slate-450 font-medium mt-0.5">{book.author}</p>
                          
                          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold">
                            <span className={book.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                              Stok {book.stock}/{book.totalStock || book.stock}
                            </span>
                            <span className="text-slate-400">
                              {book.year}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: BOOKS (KATALOG BUKU) */}
            {activeTab === 'books' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Search and Categories Bar */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4.5 shadow-xs">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan judul, penulis, penerbit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white placeholder-slate-400 transition-all font-semibold"
                    />
                  </div>

                  {/* Horizontal Categories */}
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                        selectedCategory === 'all'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
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
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Books Grid */}
                <div className="space-y-4">
                  <p className="text-xs text-slate-450 font-bold">Menampilkan {filteredBooks.length} buku pilihan</p>
                  
                  {filteredBooks.length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center">
                      <BookOpen className="w-12 h-12 text-slate-250 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-750">Buku tidak ditemukan</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Coba ganti kata kunci pencarian atau klasifikasi kategori.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredBooks.map((book) => (
                        <motion.div 
                          key={book.id} 
                          onClick={() => setSelectedBook(book)}
                          whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                          className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden cursor-pointer group transition-all"
                        >
                          <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 p-4">
                            <Book3D book={book} size="md" />
                            <span className="absolute bottom-2.5 left-2.5 text-[9px] bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded border border-slate-700/50 font-bold shadow-xs z-10">
                              Rak: {book.rackLocation}
                            </span>
                          </div>
                          <div className="p-4">
                            <span className="text-[9px] text-blue-650 bg-blue-50 px-2 py-0.5 rounded font-black uppercase">
                              {getCategoryName(book.categoryId)}
                            </span>
                            <h4 className="text-xs font-bold text-slate-850 mt-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{book.title}</h4>
                            <p className="text-[10px] text-slate-450 font-medium mt-0.5">{book.author}</p>
                            
                            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold">
                              <span className={book.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                                {book.stock > 0 ? `Sisa ${book.stock} Eks` : 'Stok Habis'}
                              </span>
                              <span className="text-slate-400">
                                {book.publisher}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: RIWAYAT PEMINJAMAN (TRANSAKSI) */}
            {activeTab === 'history' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm lg:text-base font-black text-slate-800">Riwayat Transaksi Peminjaman</h3>
                  <p className="text-xs text-slate-450 font-semibold mt-1">Daftar sirkulasi buku yang sedang dipinjam, menunggu persetujuan, atau selesai dikembalikan.</p>
                </div>

                {myBorrowings.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center">
                    <Clock className="w-12 h-12 text-slate-250 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-750">Belum ada transaksi peminjaman</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Kunjungi katalog buku untuk mengajukan permohonan sirkulasi perdana.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {myBorrowings.map((b) => {
                      const book = books.find((x) => x.id === b.bookId);
                      return (
                        <div key={b.id} className="bg-white border border-slate-200/60 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4.5 shadow-xs">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-16 flex items-center justify-center shrink-0 overflow-visible">
                              {book ? (
                                <Book3D book={book} size="xs" />
                              ) : (
                                <div className="w-9 h-12 bg-slate-200 rounded-md animate-pulse" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-850 leading-snug">{book?.title || 'Buku Tidak Diketahui'}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">Penulis: {book?.author}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500 font-semibold mt-2.5">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  Peminjaman: {b.borrowDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-slate-450" />
                                  Jatuh Tempo: {b.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-100 pt-3.5 md:pt-0 gap-3">
                            {/* Status badge */}
                            <div>
                              {b.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-2.5 h-2.5" /> Pending Verifikasi
                                </span>
                              )}
                              {b.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Aktif Dipinjam
                                </span>
                              )}
                              {b.status === 'returned' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Sudah Kembali
                                </span>
                              )}
                              {b.status === 'overdue' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                                  <AlertCircle className="w-2.5 h-2.5" /> Terlambat
                                </span>
                              )}
                              {b.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                  <X className="w-2.5 h-2.5" /> Ditolak
                                </span>
                              )}
                            </div>

                            {/* Fine info */}
                            {(b.fineAmount ?? 0) > 0 && (
                              <div className="text-right">
                                <span className="text-[10px] text-rose-600 font-extrabold block">
                                  Denda: Rp {(b.fineAmount ?? 0).toLocaleString()}
                                </span>
                                <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 mt-0.5 rounded-md ${b.finePaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {b.finePaid ? 'Lunas' : 'Belum Dibayar'}
                                </span>
                              </div>
                            )}

                            {/* Return Action Button */}
                            {(b.status === 'approved' || b.status === 'overdue') && (
                              <button
                                onClick={() => onRequestReturn(b.id)}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm hover:shadow"
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

            {/* TAB 4: PROFILE (PROFIL SISWA) */}
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                    {/* Foto Profil dengan tombol Upload */}
                    <div className="relative group shrink-0">
                      <img 
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                        alt={currentUser.name} 
                        className="w-24 h-24 rounded-2xl border-4 border-slate-100 object-cover shadow-md"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Ganti Foto Profil">
                        {isUploadingAvatar ? (
                          <span className="text-white text-[10px] font-bold text-center px-1">Uploading...</span>
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
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
                      <h3 className="text-lg lg:text-xl font-black text-slate-800">{currentUser.name}</h3>
                      <p className="text-xs text-slate-400 font-bold">NISN: {currentUser.nisn || '-'}</p>
                      <p className="text-xs text-blue-600 font-extrabold">Siswa Kelas {currentUser.class || '-'}</p>
                      <span className="inline-block mt-2 px-3 py-1 text-[9px] font-black bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-150 uppercase">
                        Akun Terverifikasi
                      </span>
                    </div>
                    <div>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border border-slate-200/40"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Profil
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detail Profile & Fields */}
                  <div className="mt-6 space-y-4 text-xs font-bold text-slate-650">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Nama Lengkap</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60 disabled:bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Email Sekolah</label>
                        <input
                          type="email"
                          disabled
                          value={currentUser.email}
                          className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-400 cursor-not-allowed font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Nomor Handphone</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60 disabled:bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Kelas Belajar</label>
                        <select
                          disabled={!isEditingProfile}
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60 disabled:bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-bold"
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

      {/* INTERACTIVE 3D BOOK OPEN MODAL */}
      {selectedBook && !isBorrowingModalOpen && (
        <BookOpen3DModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onReadEbook={(b) => {
            setSelectedBook(null);
            setReadingBook3D(b);
          }}
          onPinjam={() => setIsBorrowingModalOpen(true)}
        />
      )}

      {/* 3D E-READER MODAL */}
      {readingBook3D && (
        <EBookReader3D
          book={readingBook3D}
          onClose={() => setReadingBook3D(null)}
        />
      )}

      {/* BORROW FORM DIALOG MODAL */}
      <AnimatePresence>
        {selectedBook && isBorrowingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-2xl max-w-lg w-full p-6 relative text-slate-800"
            >
              <button 
                onClick={() => {
                  setIsBorrowingModalOpen(false);
                }}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-2 text-xs font-semibold text-slate-750">
                <h3 className="text-base font-bold text-slate-900 mb-1">Formulir Pengajuan Peminjaman</h3>
                <p className="text-xs text-slate-400 mb-5 font-bold">Buku: <strong className="text-slate-700">{selectedBook.title}</strong></p>

                  {borrowSuccess ? (
                    <div className="py-8 text-center space-y-3">
                      <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                      <h4 className="text-md font-bold text-slate-900">Pengajuan Berhasil Dikirim!</h4>
                      <p className="text-xs text-slate-400 font-medium">Silakan temui petugas di perpustakaan sekolah untuk serah terima buku fisik.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBorrowRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Durasi Peminjaman (Maks {settings.maxBorrowDays} Hari)</label>
                        <select
                          value={borrowDays}
                          onChange={(e) => setBorrowDays(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-bold"
                        >
                          {Array.from({ length: settings.maxBorrowDays }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{day} Hari</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1.5 uppercase">Catatan Peminjaman (Opsional)</label>
                        <textarea
                          rows={3}
                          value={borrowNotes}
                          onChange={(e) => setBorrowNotes(e.target.value)}
                          placeholder="Contoh: Kebutuhan riset olimpiade fisika..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-450 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all leading-relaxed"
                        />
                      </div>

                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 text-[11px] text-amber-800 space-y-1 font-bold">
                        <p className="text-amber-800 font-black flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Ketentuan Peminjaman:</p>
                        <p>1. Buku wajib dikembalikan sebelum tanggal jatuh tempo sirkulasi.</p>
                        <p>2. Keterlambatan dikenakan denda administratif sebesar <strong>Rp {settings.finePerDay.toLocaleString()}/hari</strong>.</p>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsBorrowingModalOpen(false)}
                          className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Kembali
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
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

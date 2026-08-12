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
  Bookmark,
  Trophy,
  Star,
  ArrowUpDown,
  AlarmClock,
  Target
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
  const [sortBy, setSortBy] = useState<'populer' | 'abjad' | 'terbaru' | 'tersedia'>('populer');
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

  // Filter & Sort books
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
  }).sort((a, b) => {
    if (sortBy === 'populer') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'abjad') return a.title.localeCompare(b.title);
    if (sortBy === 'terbaru') return (b.year || 0) - (a.year || 0);
    if (sortBy === 'tersedia') return b.stock - a.stock;
    return 0;
  });

  const getCategoryName = (catId: string | undefined) => {
    if (!catId) return 'Lainnya';
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Lainnya';
  };

  const myBorrowings = borrowings.filter((b) => b.studentId === currentUser.id);
  const myUnreadNotifications = notifications.filter(n => n.userId === currentUser.id && !n.read);

  // Reading Goal & Gamification Badges
  const completedCount = myBorrowings.filter(b => b.status === 'returned' || b.status === 'Dikembalikan').length;
  const goalTarget = 5;
  const progressGoalPercent = Math.min(Math.round((completedCount / goalTarget) * 100), 100);

  // Urgent Borrowings (due within 2 days or overdue)
  const urgentBorrowings = myBorrowings.filter(b => {
    if (b.status === 'overdue') return true;
    if (b.status === 'approved' && b.dueDate) {
      const due = new Date(b.dueDate).getTime();
      const now = new Date().getTime();
      const diffDays = (due - now) / (1000 * 3600 * 24);
      return diffDays <= 2;
    }
    return false;
  });

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

                {/* ⚠️ URGENT DUE DATE ALERT BANNER */}
                {urgentBorrowings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-amber-500/5"
                  >
                    <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
                      <AlarmClock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-amber-300">⚠️ Perhatian! Buku Hampir Jatuh Tempo</h4>
                      <p className="text-[10px] text-amber-400/80 mt-0.5 font-medium">Kamu memiliki <strong>{urgentBorrowings.length} buku</strong> yang segera harus dikembalikan. Hindari denda keterlambatan!</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {urgentBorrowings.map(b => (
                          <span key={b.id} className="text-[9px] bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-lg font-bold border border-amber-500/20">
                            📚 {b.bookTitle} — {b.status === 'overdue' ? '🔴 Terlambat!' : `Due: ${b.dueDate}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('history')} className="shrink-0 text-[9px] text-amber-400 hover:text-amber-300 font-black border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                      Lihat
                    </button>
                  </motion.div>
                )}

                {/* Quick Stat Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { 
                      label: 'Sedang Dipinjam', 
                      val: `${myBorrowings.filter((b) => b.status === 'approved' || b.status === 'overdue').length} Buku`,
                      border: 'border-blue-500/30',
                      badge: 'bg-blue-500/10 text-blue-400',
                      Icon: BookOpen
                    },
                    { 
                      label: 'Menunggu Verifikasi', 
                      val: `${myBorrowings.filter((b) => b.status === 'pending').length} Buku`,
                      border: 'border-amber-500/30',
                      badge: 'bg-amber-500/10 text-amber-400',
                      Icon: Clock
                    },
                    { 
                      label: 'Total Denda Aktif', 
                      val: `Rp ${myBorrowings.reduce((sum, b) => sum + (b.finePaid ? 0 : (b.fineAmount ?? 0)), 0).toLocaleString()}`,
                      border: 'border-rose-500/30',
                      badge: 'bg-rose-500/10 text-rose-400',
                      Icon: AlertCircle
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
                        <stat.Icon className="w-5 h-5" />
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* 🏆 READING GOAL & GAMIFICATION */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 rounded-xl">
                        <Target className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white">Target Membaca Bulanan</h3>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{completedCount} dari {goalTarget} buku selesai dibaca</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400">{progressGoalPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressGoalPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    />
                  </div>
                  {/* Achievement Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: 'Pembaca Pemula', min: 1, icon: '📖', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
                      { label: 'Kutu Buku', min: 3, icon: '🐛', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
                      { label: 'Penjelajah Genre', min: 5, icon: '🗺️', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
                      { label: 'Legenda Perpustakaan', min: 10, icon: '🏆', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
                    ].map(badge => {
                      const unlocked = completedCount >= badge.min;
                      return (
                        <div
                          key={badge.label}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-black border transition-all ${
                            unlocked ? badge.color : 'border-slate-800 bg-slate-950 text-slate-600'
                          }`}
                          title={unlocked ? 'Terbuka!' : `Selesaikan ${badge.min} buku untuk membuka`}
                        >
                          <span className={`text-sm ${!unlocked && 'grayscale opacity-40'}`}>{badge.icon}</span>
                          <span>{badge.label}</span>
                          {unlocked && <Trophy className="w-2.5 h-2.5 text-amber-400" />}
                        </div>
                      );
                    })}
                  </div>
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
                
                {/* Search, Sort & Categories */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  {/* Search Input */}
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

                  {/* Sort By Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase shrink-0">
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Urutkan:</span>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {[
                        { key: 'populer', label: '⭐ Terpopuler' },
                        { key: 'abjad',   label: '🔤 A–Z' },
                        { key: 'terbaru', label: '📅 Terbaru' },
                        { key: 'tersedia',label: '✅ Stok Ada' },
                      ].map(s => (
                        <button
                          key={s.key}
                          onClick={() => setSortBy(s.key as any)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all shrink-0 cursor-pointer border ${
                            sortBy === s.key
                              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-400/30 shadow-md'
                              : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter Chips */}
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
                  <p className="text-xs text-slate-400 font-bold">Menampilkan {filteredBooks.length} buku · Diurutkan: <span className="text-cyan-400">{sortBy === 'populer' ? 'Terpopuler' : sortBy === 'abjad' ? 'A–Z' : sortBy === 'terbaru' ? 'Terbaru' : 'Stok Ada'}</span></p>
                  
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
                          whileHover={{ y: -6, scale: 1.02 }}
                          className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] relative"
                        >
                          <div className="aspect-[3/4] bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-800/80 p-4">
                            <Book3D book={book} size="md" />
                            <span className="absolute top-2.5 right-2.5 text-[9px] bg-slate-900/90 backdrop-blur-md text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-500/30 font-extrabold z-10 shadow-md">
                              Rak {book.rackLocation}
                            </span>

                            {/* GLASS HOVER OVERLAY */}
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 gap-2.5 z-20">
                              <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/40">
                                {getCategoryName(book.categoryId)}
                              </span>
                              <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black rounded-xl shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> Lihat 3D & Detail
                              </button>
                            </div>
                          </div>

                          <div className="p-4">
                            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-black uppercase border border-cyan-500/20">
                              {getCategoryName(book.categoryId)}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{book.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{book.author}</p>
                            
                            <div className="mt-3 flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} className={`w-2.5 h-2.5 ${ si < Math.round(book.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                              ))}
                              <span className="text-[9px] text-slate-500 ml-1 font-bold">{(book.rating || 0).toFixed(1)}</span>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-bold">
                              <span className={book.stock > 0 ? 'text-emerald-400 flex items-center gap-1' : 'text-rose-400 flex items-center gap-1'}>
                                <span className={`w-1.5 h-1.5 rounded-full ${book.stock > 0 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-rose-400'}`} />
                                {book.stock > 0 ? `✓ ${book.stock} Eks` : '✗ Habis'}
                              </span>
                              <span className="text-slate-600">{book.year}</span>
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
                  <div className="space-y-4">
                    {myBorrowings.map((b) => {
                      const book = books.find((x) => x.id === b.bookId);

                      // Calculate Stepper State
                      // 1: Diajukan, 2: Diverifikasi/Dipinjam, 3: Selesai
                      let activeStep = 1;
                      if (b.status === 'approved' || b.status === 'overdue') activeStep = 2;
                      if (b.status === 'returned' || b.status === 'Dikembalikan') activeStep = 3;

                      return (
                        <motion.div 
                          key={b.id} 
                          whileHover={{ y: -2 }}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-16 flex items-center justify-center shrink-0 overflow-visible">
                                {book ? <Book3D book={book} size="xs" /> : <div className="w-9 h-12 bg-slate-800 rounded-md animate-pulse" />}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-white leading-snug">{book?.title || b.bookTitle || 'Buku Digital'}</h4>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Penulis: {book?.author || 'Perpustakaan'}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400 font-semibold mt-2">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                    Tgl Pinjam: <strong className="text-white">{b.borrowDate}</strong>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    Jatuh Tempo: <strong className="text-amber-300">{b.dueDate}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 gap-3">
                              <div>
                                {b.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                    Pending Verifikasi
                                  </span>
                                )}
                                {(b.status === 'approved' || b.status === 'Sedang Dipinjam') && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                    Aktif Dipinjam
                                  </span>
                                )}
                                {(b.status === 'returned' || b.status === 'Dikembalikan') && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                    Sudah Dikembalikan
                                  </span>
                                )}
                                {b.status === 'overdue' && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 animate-pulse">
                                    <AlertCircle className="w-3 h-3 text-rose-400" />
                                    Terlambat
                                  </span>
                                )}
                                {b.status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    <X className="w-3 h-3" /> Ditolak
                                  </span>
                                )}
                              </div>

                              {(b.status === 'approved' || b.status === 'overdue' || b.status === 'Sedang Dipinjam') && (
                                <div className="flex flex-wrap items-center gap-2">
                                  {book && (
                                    <button
                                      onClick={() => setReadingBook3D(book)}
                                      className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-1.5"
                                    >
                                      <BookOpen className="w-3.5 h-3.5" /> Baca E-Book 3D
                                    </button>
                                  )}
                                  <button
                                    onClick={() => onRequestReturn(b.id)}
                                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[10px] font-black transition-all cursor-pointer active:scale-95"
                                  >
                                    Ajukan Pengembalian
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4-STEP TRANSACTION STEPPER */}
                          <div className="pt-3 border-t border-slate-800/80">
                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-1">
                              <span className={activeStep >= 1 ? 'text-cyan-400 font-extrabold' : ''}>1. Permohonan</span>
                              <span className={activeStep >= 2 ? 'text-amber-400 font-extrabold' : ''}>2. Persetujuan Staf</span>
                              <span className={activeStep >= 2 ? 'text-emerald-400 font-extrabold' : ''}>3. Peminjaman Aktif</span>
                              <span className={activeStep >= 3 ? 'text-cyan-400 font-extrabold' : ''}>4. Pengembalian</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full mt-1.5 overflow-hidden flex">
                              <div className={`h-full transition-all duration-500 ${activeStep >= 1 ? 'bg-cyan-500 w-1/3' : 'w-0'}`} />
                              <div className={`h-full transition-all duration-500 ${activeStep >= 2 ? 'bg-emerald-400 w-1/3' : 'w-0'}`} />
                              <div className={`h-full transition-all duration-500 ${activeStep >= 3 ? 'bg-cyan-400 w-1/3' : 'w-0'}`} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TAB 4: PROFILE ── */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* MEMBER MINI STATS OVERVIEW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Total Dipinjam</span>
                    <h3 className="text-lg font-black text-white mt-1">{myBorrowings.length} Buku</h3>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Selesai Dibaca</span>
                    <h3 className="text-lg font-black text-emerald-400 mt-1">{completedCount} Buku</h3>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Poin Membaca</span>
                    <h3 className="text-lg font-black text-amber-400 mt-1">{completedCount * 120 + 50} Pts</h3>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Status Anggota</span>
                    <h3 className="text-lg font-black text-cyan-400 mt-1">{currentUser.badge || 'Reguler'}</h3>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                    <div className="relative group shrink-0">
                      <img 
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                        alt={currentUser.name} 
                        className="w-24 h-24 rounded-2xl ring-4 ring-cyan-500/40 object-cover shadow-2xl shadow-cyan-500/20"
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
                      <p className="text-xs text-slate-400 font-bold">NISN: {currentUser.nisn || '3182940291'}</p>
                      <p className="text-xs text-cyan-400 font-extrabold">Siswa Kelas {currentUser.class || 'X MIPA 1'}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                        <span className="px-3 py-1 text-[9px] font-black bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 uppercase">
                          ✓ Akun Terverifikasi
                        </span>
                        <span className="px-3 py-1 text-[9px] font-black bg-cyan-500/10 text-cyan-300 rounded-lg border border-cyan-500/20 uppercase">
                          ⭐ Anggota {currentUser.badge || 'Reguler'}
                        </span>
                      </div>
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

      {/* 📱 MOBILE BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

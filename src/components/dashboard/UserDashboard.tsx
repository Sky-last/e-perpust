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
  Camera,
  Sparkles,
  TrendingUp,
  Trophy,
  Star,
  ArrowUpDown,
  AlarmClock,
  Target,
  Flame,
  BookCheck,
  Compass,
  ShieldCheck,
  BarChart3,
  PieChart,
  Activity,
  Feather,
  Stamp
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, Notification } from '../../types';
import { uploadAvatar } from '../../lib/db';
import Book3D from '../Book3D';
import BookOpen3DModal from '../BookOpen3DModal';
import EBookReader3D from '../EBookReader3D';
import { resolveBookPdfUrl } from '../../utils/pdfResolver';

interface UserDashboardProps {
  currentUser: User;
  onLogout: () => void;
  books: Book[];
  categories: Category[];
  borrowings: Borrowing[];
  notifications: Notification[];
  settings?: LibrarySettings;
  onRequestBorrow: (bookId: string, durationDays: number, notes?: string) => void;
  onRequestReturn: (borrowingId: string) => void;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onMarkNotifRead: (notifId: string) => void;
}

/** Shared type-system + palette, injected once. See design notes at bottom of file. */
function DesignSystemStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      #pemustaka-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      #pemustaka-root .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
      #pemustaka-root .font-mono-lib { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      #pemustaka-root .paper-grain {
        background-image:
          radial-gradient(circle at 1px 1px, rgba(47,69,56,0.06) 1px, transparent 0);
        background-size: 18px 18px;
      }
      #pemustaka-root .catalog-card { position: relative; }
      #pemustaka-root .catalog-card::before {
        content: '';
        position: absolute;
        top: -6px; left: 22px;
        width: 12px; height: 12px;
        border-radius: 9999px;
        background: #F6F1E7;
        border: 1px solid rgba(47,69,56,0.18);
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.12);
      }
      #pemustaka-root .stamp-tilt { transform: rotate(-3deg); }
      #pemustaka-root ::selection { background: #C08B34; color: #F6F1E7; }
    `}</style>
  );
}

export default function UserDashboard({
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
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'books' | 'history' | 'stats' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'populer' | 'abjad' | 'terbaru' | 'tersedia'>('populer');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook3D, setReadingBook3D] = useState<Book | null>(null);

  const maxBorrowDays = settings?.maxBorrowDays ?? 7;
  const maxBorrowBooks = settings?.maxBorrowBooks ?? 5;

  const [borrowDays, setBorrowDays] = useState<number>(maxBorrowDays);
  const [borrowNotes, setBorrowNotes] = useState('');
  const [isBorrowingModalOpen, setIsBorrowingModalOpen] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(currentUser.id, file);
      if (url) {
        onUpdateProfile({ avatarUrl: url, avatar: url });
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editClass, _setEditClass] = useState(currentUser.class || '');
  const [editMemberCategory, setEditMemberCategory] = useState(currentUser.memberCategory || 'Masyarakat Umum');
  const [editIdentityNumber, setEditIdentityNumber] = useState(currentUser.identityNumber || currentUser.nisn || '');

  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (!catId) return 'Umum';
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Umum';
  };

  const myBorrowings = borrowings.filter((b) => !b.studentId || b.studentId === currentUser.id || b.userId === currentUser.id);
  const myUnreadNotifications = notifications.filter(n => (!n.userId || n.userId === currentUser.id) && !n.read);

  const completedCount = myBorrowings.filter(b => b.status === 'returned' || b.status === 'Dikembalikan').length;
  const goalTarget = settings?.maxBorrowBooks ?? 5;
  const progressGoalPercent = Math.min(Math.round((completedCount / goalTarget) * 100), 100);

  const totalBorrowedCount = myBorrowings.length;
  const activeBorrowedCount = myBorrowings.filter(b => b.status === 'approved' || b.status === 'Sedang Dipinjam' || b.status === 'overdue').length;
  const overdueCount = myBorrowings.filter(b => b.status === 'overdue').length;

  const onTimePercentage = totalBorrowedCount > 0
    ? Math.max(0, Math.round(((totalBorrowedCount - overdueCount) / totalBorrowedCount) * 100))
    : 100;

  const estimatedTotalPagesRead = completedCount * 280 + activeBorrowedCount * 95;
  const estimatedReadingHours = Math.round(estimatedTotalPagesRead / 45);

  const categoryBreakdown = categories.map(cat => {
    const catBookIds = books.filter(b => b.categoryId === cat.id).map(b => b.id);
    const count = myBorrowings.filter(b => catBookIds.includes(b.bookId)).length;
    return {
      id: cat.id,
      name: cat.name,
      count,
      percentage: totalBorrowedCount > 0 ? Math.round((count / totalBorrowedCount) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];
  const monthlyActivity = monthsList.map((m, idx) => {
    const val = (idx === monthsList.length - 1)
      ? Math.max(totalBorrowedCount, 2)
      : Math.max((idx % 3) + (completedCount > 0 ? 1 : 0), 1);
    return { month: m, count: val };
  });
  const maxMonthlyVal = Math.max(...monthlyActivity.map(a => a.count), 5);

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
      class: editClass,
      memberCategory: editMemberCategory,
      identityNumber: editIdentityNumber
    });
    setIsEditingProfile(false);
  };

  const navItems = [
    { id: 'home', label: 'Beranda', desc: 'Ringkasan & aktivitas', icon: Home },
    { id: 'books', label: 'Katalog', desc: 'Jelajah koleksi 3D', icon: BookMarked },
    { id: 'history', label: 'Peminjaman', desc: 'Riwayat sirkulasi', icon: Clock },
    { id: 'stats', label: 'Almanak Baca', desc: 'Statistik & capaian', icon: TrendingUp },
    { id: 'profile', label: 'Kartu Anggota', desc: 'Profil & pengaturan', icon: UserIcon }
  ];

  const tabTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
  };

  return (
    <div
      id="pemustaka-root"
      className="h-screen bg-[#F6F1E7] flex text-[#1F2A24] overflow-hidden selection:bg-[#C08B34] selection:text-white"
    >
      <DesignSystemStyles />

      {/* ── SIDEBAR: "the book spine" ── */}
      <aside
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-[#20301F] shrink-0 hidden lg:flex flex-col shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-hidden z-20 border-r-4 border-[#C08B34]/70`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          {!sidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 flex-1"
            >
              <div className="w-10 h-10 rounded-md bg-[#C08B34] flex items-center justify-center shadow-md shrink-0">
                <Feather className="w-5 h-5 text-[#20301F]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-base font-semibold text-[#F6F1E7] tracking-tight truncate">
                  Pustaka Digital
                </h2>
                <span className="font-mono-lib text-[9px] text-[#C08B34] uppercase tracking-[0.2em] block">
                  Ruang Baca Publik
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-[#C08B34] flex items-center justify-center shadow-md mx-auto">
              <Feather className="w-5 h-5 text-[#20301F]" />
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-white/10 rounded-md text-[#C08B34] transition-colors cursor-pointer shrink-0 hidden sm:block"
            title={sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-1 relative">
          <nav className="space-y-1 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 text-xs rounded-lg transition-colors cursor-pointer relative ${
                    isActive ? 'text-[#20301F]' : 'text-[#CBD5C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 bg-[#C08B34] rounded-lg"
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10 shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="text-left min-w-0 relative z-10">
                      <span className="block truncate font-bold text-[11px] tracking-wide">{item.label}</span>
                      <span className={`text-[9px] block truncate font-medium ${isActive ? 'text-[#20301F]/70' : 'text-[#CBD5C9]/60'}`}>
                        {item.desc}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="pt-5 mt-4 border-t border-white/10">
              <div className="bg-[#1A2619] p-3.5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#C08B34] tracking-wide">
                  <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Poin Baca</span>
                  <span className="font-mono-lib text-[#F6F1E7]">{completedCount * 120 + 50}</span>
                </div>
                <div className="mt-2.5 w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C08B34] rounded-full transition-all duration-500"
                    style={{ width: `${progressGoalPercent}%` }}
                  />
                </div>
                <p className="text-[9px] text-[#CBD5C9] font-medium mt-2">
                  {completedCount >= 5 ? 'Tingkat 3 · Pembaca Legenda' : completedCount >= 3 ? 'Tingkat 2 · Penjelajah Buku' : 'Tingkat 1 · Pembaca Baru'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-2.5 bg-[#1A2619] rounded-lg">
              {currentUser.avatarUrl || currentUser.avatar ? (
                <img
                  src={currentUser.avatarUrl || currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-md object-cover ring-2 ring-[#C08B34]/50 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-[#C08B34] text-[#20301F] font-bold text-xs flex items-center justify-center shrink-0">
                  {getInitials(currentUser.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-[#F6F1E7] truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-[#C08B34] font-semibold truncate mt-0.5">{currentUser.memberCategory || 'Pemustaka'}</p>
              </div>
            </div>
          ) : (
            currentUser.avatarUrl || currentUser.avatar ? (
              <img
                src={currentUser.avatarUrl || currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-md object-cover ring-2 ring-[#C08B34]/50 mx-auto"
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-[#C08B34] text-[#20301F] font-bold text-xs flex items-center justify-center mx-auto">
                {getInitials(currentUser.name)}
              </div>
            )
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#B4573F]/20 hover:bg-[#B4573F]/30 text-[#E8A99A] rounded-lg transition-colors cursor-pointer text-xs font-bold active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#20301F] z-50 lg:hidden flex flex-col shadow-2xl border-r-4 border-[#C08B34]/70"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#C08B34] flex items-center justify-center shadow-md">
                    <Feather className="w-5 h-5 text-[#20301F]" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-semibold text-[#F6F1E7]">Pustaka Digital</h2>
                    <span className="font-mono-lib text-[9px] text-[#C08B34] uppercase tracking-widest">Ruang Baca Publik</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-[#CBD5C9] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        isActive ? 'bg-[#C08B34] text-[#20301F]' : 'text-[#CBD5C9] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#B4573F]/20 text-[#E8A99A] rounded-lg text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CANVAS ── */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden paper-grain">

        <header className="bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#1F2A24]/10 px-4 lg:px-8 py-3 flex justify-between items-center sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-[#20301F] rounded-lg text-[#F6F1E7] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('profile')}
                className="w-10 h-10 rounded-md bg-[#20301F] flex items-center justify-center font-bold text-[#C08B34] text-xs ring-1 ring-[#1F2A24]/10 cursor-pointer hover:scale-105 transition-transform overflow-hidden shrink-0"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(currentUser.name)
                )}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-sm lg:text-lg font-semibold text-[#1F2A24] tracking-tight">
                    {getGreeting()}, {currentUser.name}
                  </h1>
                  <span className="font-mono-lib text-[9px] bg-[#20301F] text-[#C08B34] font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
                    {currentUser.memberCategory || currentUser.class || 'Masyarakat Umum'}
                  </span>
                </div>
                <p className="text-[10px] text-[#1F2A24]/60 font-medium mt-0.5">
                  Ruang baca digital siap dipakai hari ini.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('books')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#20301F] hover:bg-[#2A3F27] text-[#F6F1E7] rounded-lg text-xs font-bold transition-colors cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#C08B34]" />
              <span>Jelajahi Katalog</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-white hover:bg-[#EFE8D8] rounded-lg text-[#1F2A24] border border-[#1F2A24]/10 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {myUnreadNotifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B4573F]" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-12 w-80 bg-white border border-[#1F2A24]/10 shadow-xl rounded-xl p-4 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1F2A24]/10">
                      <h3 className="text-xs font-bold text-[#1F2A24]">Notifikasi</h3>
                      <span className="font-mono-lib text-[10px] bg-[#20301F] text-[#C08B34] font-bold px-2 py-0.5 rounded">{myUnreadNotifications.length} Baru</span>
                    </div>
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <div className="text-center py-6 text-[#1F2A24]/40">
                        <Bell className="w-7 h-7 mx-auto mb-2" />
                        <p className="text-xs font-medium">Belum ada notifikasi.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications
                          .filter(n => n.userId === currentUser.id)
                          .map(n => (
                            <button
                              key={n.id}
                              onClick={() => onMarkNotifRead(n.id)}
                              className={`w-full p-3 rounded-lg text-left transition-colors cursor-pointer border ${
                                n.read
                                  ? 'bg-[#F6F1E7]/60 opacity-60 border-[#1F2A24]/10'
                                  : 'bg-[#C08B34]/10 border-[#C08B34]/30 hover:bg-[#C08B34]/15'
                              }`}
                            >
                              <h4 className="text-xs font-bold text-[#1F2A24]">{n.title}</h4>
                              <p className="text-[10px] text-[#1F2A24]/60 mt-1 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-[#1F2A24]/40 block mt-1.5 font-semibold">
                                {new Date(n.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </button>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <AnimatePresence mode="wait">

              {/* ── TAB: HOME ── */}
              {activeTab === 'home' && (
                <motion.div key="home" {...tabTransition} className="space-y-6">

                  {/* Hero: an open book, not a neon banner */}
                  <div className="relative bg-[#20301F] rounded-2xl p-6 lg:p-10 text-[#F6F1E7] shadow-xl overflow-hidden">
                    <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-[#C08B34]/10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="max-w-xl space-y-4">
                        <span className="font-mono-lib inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C08B34] border border-[#C08B34]/40 px-3 py-1 rounded-full">
                          Katalog No. {String(books.length).padStart(4, '0')}
                        </span>

                        <h2 className="font-display text-2xl lg:text-4xl font-semibold leading-tight">
                          Ribuan buku, satu ruang baca digital.
                        </h2>

                        <p className="text-xs lg:text-sm text-[#CBD5C9] leading-relaxed">
                          Baca e-book dengan simulasi halaman 3D, ajukan peminjaman buku fisik, dan pantau kebiasaan membacamu — semua dari satu dasbor.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold">
                          <button
                            onClick={() => setActiveTab('books')}
                            className="px-6 py-3 bg-[#C08B34] hover:bg-[#D19A42] text-[#20301F] rounded-lg transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
                          >
                            <BookOpen className="w-4 h-4" /> Buka Katalog
                          </button>
                          <button
                            onClick={() => setActiveTab('stats')}
                            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-[#F6F1E7] rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                          >
                            <TrendingUp className="w-4 h-4 text-[#C08B34]" /> Lihat Almanak Baca
                          </button>
                        </div>
                      </div>

                      <div className="hidden lg:flex shrink-0 items-center justify-center">
                        <button
                          onClick={() => books[0] && setSelectedBook(books[0])}
                          className="w-52 h-64 bg-[#1A2619] rounded-xl border border-white/10 p-4 flex flex-col items-center justify-between text-center shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="relative w-full flex-1 flex items-center justify-center py-2">
                            {books[0] ? <Book3D book={books[0]} size="md" /> : <BookOpen className="w-16 h-16 text-[#C08B34]" />}
                          </div>
                          <div className="w-full pt-2 border-t border-white/10 flex flex-col items-center gap-1">
                            <span className="text-[11px] font-bold text-[#F6F1E7] line-clamp-1">
                              {books[0]?.title || 'Pilihan Hari Ini'}
                            </span>
                            <span className="font-mono-lib text-[9px] text-[#C08B34]">Maks {maxBorrowBooks} buku aktif</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Continue reading */}
                  {myBorrowings.filter(b => b.status === 'approved' || b.status === 'Sedang Dipinjam').length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#1F2A24]/10 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-3 bg-[#C08B34]/15 text-[#C08B34] rounded-lg shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono-lib text-[9px] text-[#C08B34] uppercase tracking-wide block">Lanjutkan membaca</span>
                          <h4 className="text-xs font-bold text-[#1F2A24] truncate mt-0.5">
                            {myBorrowings.find(b => b.status === 'approved' || b.status === 'Sedang Dipinjam')?.bookTitle || 'Buku Sedang Dipinjam'}
                          </h4>
                          <p className="text-[10px] text-[#1F2A24]/50 font-medium mt-0.5">Tersedia sebagai e-book 3D interaktif.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const activeBorrow = myBorrowings.find(b => b.status === 'approved' || b.status === 'Sedang Dipinjam');
                          if (activeBorrow) {
                            const bObj = books.find(x => x.id === activeBorrow.bookId || x.title === activeBorrow.bookTitle);
                            if (bObj) {
                              setReadingBook3D({
                                ...bObj,
                                pdfUrl: resolveBookPdfUrl(bObj)
                              });
                            } else {
                              const tempBook: Partial<Book> = { id: activeBorrow.bookId, title: activeBorrow.bookTitle, coverUrl: activeBorrow.coverUrl };
                              setReadingBook3D({
                                id: activeBorrow.bookId,
                                title: activeBorrow.bookTitle,
                                coverColor: activeBorrow.coverColor || 'from-blue-600 to-indigo-900',
                                coverUrl: activeBorrow.coverUrl,
                                pdfUrl: resolveBookPdfUrl(tempBook),
                                category: 'Koleksi Pinjaman',
                                author: 'Pustaka Digital',
                                publisher: 'Pustaka Digital',
                                isbn: '000-000-000',
                                description: `E-book digital "${activeBorrow.bookTitle}" koleksi Pustaka Digital.`,
                                year: 2026,
                                rating: 5,
                                status: 'Tersedia',
                                stock: 1
                              });
                            }
                          } else {
                            setActiveTab('history');
                          }
                        }}
                        className="px-4 py-2 bg-[#20301F] hover:bg-[#2A3F27] text-[#F6F1E7] rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-[#C08B34]" /> Buka E-Book
                      </button>
                    </motion.div>
                  )}

                  {/* Urgent due-date alert */}
                  {urgentBorrowings.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 bg-[#B4573F]/10 border border-[#B4573F]/30 rounded-xl p-4"
                    >
                      <div className="p-2.5 bg-[#B4573F]/15 rounded-lg shrink-0">
                        <AlarmClock className="w-5 h-5 text-[#B4573F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#8C3F2C]">Segera jatuh tempo</h4>
                        <p className="text-[10px] text-[#8C3F2C]/80 mt-0.5 font-medium">
                          Kamu punya <strong>{urgentBorrowings.length} buku</strong> yang harus segera dikembalikan agar terhindar dari denda.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {urgentBorrowings.map(b => (
                            <span key={b.id} className="text-[9px] bg-[#B4573F]/10 text-[#8C3F2C] px-2.5 py-1 rounded-md font-bold border border-[#B4573F]/20">
                              {b.bookTitle} — {b.status === 'overdue' ? 'Terlambat' : `Tempo: ${b.dueDate}`}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('history')} className="shrink-0 text-[10px] text-[#8C3F2C] font-bold border border-[#B4573F]/30 bg-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[#B4573F]/5">
                        Lihat Detail
                      </button>
                    </motion.div>
                  )}

                  {/* Stat cards, styled as due-date stub cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Dipinjam Aktif', val: `${activeBorrowedCount}`, unit: 'buku', sub: 'Peminjaman aktif', accent: '#20301F', Icon: BookOpen },
                      { label: 'Menunggu Verifikasi', val: `${myBorrowings.filter((b) => b.status === 'pending').length}`, unit: 'buku', sub: 'Diproses staf', accent: '#C08B34', Icon: Clock },
                      { label: 'Selesai Dikembalikan', val: `${completedCount}`, unit: 'buku', sub: 'Terselesaikan', accent: '#5F7A63', Icon: CheckCircle2 },
                      { label: 'Poin & Rentetan Baca', val: `${completedCount * 120 + 50}`, unit: 'pts', sub: `${Math.min(completedCount + 3, 7)} hari beruntun`, accent: '#B4573F', Icon: Flame }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -3 }}
                        className="catalog-card bg-white border border-[#1F2A24]/10 shadow-sm rounded-xl p-5 flex flex-col justify-between"
                        style={{ borderTop: `3px solid ${stat.accent}` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#1F2A24]/50 font-bold uppercase tracking-wide">{stat.label}</span>
                          <stat.Icon className="w-4 h-4" style={{ color: stat.accent }} />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-mono-lib text-2xl font-semibold text-[#1F2A24]">
                            {stat.val}<span className="text-xs text-[#1F2A24]/40 ml-1">{stat.unit}</span>
                          </h3>
                          <span className="text-[10px] text-[#1F2A24]/50 font-semibold block mt-1">{stat.sub}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Monthly reading target + badges */}
                  <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#C08B34]/10 rounded-xl">
                          <Target className="w-5 h-5 text-[#C08B34]" />
                        </div>
                        <div>
                          <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24]">Target Membaca Bulanan</h3>
                          <p className="text-[10px] text-[#1F2A24]/50 font-semibold mt-0.5">{completedCount} dari {goalTarget} buku selesai dibaca</p>
                        </div>
                      </div>
                      <span className="font-mono-lib text-sm font-semibold text-[#C08B34]">{progressGoalPercent}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-[#F6F1E7] rounded-full overflow-hidden border border-[#1F2A24]/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressGoalPercent}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full bg-[#C08B34]"
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {[
                        { label: 'Pembaca Pemula', min: 1 },
                        { label: 'Kutu Buku', min: 3 },
                        { label: 'Penjelajah Genre', min: 5 },
                        { label: 'Legenda Perpustakaan', min: 10 },
                      ].map(badge => {
                        const unlocked = completedCount >= badge.min;
                        return (
                          <div
                            key={badge.label}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[10px] font-bold border transition-colors ${
                              unlocked ? 'border-[#C08B34]/40 bg-[#C08B34]/10 text-[#8A5F22]' : 'border-[#1F2A24]/10 bg-[#F6F1E7] text-[#1F2A24]/30'
                            }`}
                            title={unlocked ? 'Terbuka' : `Selesaikan ${badge.min} buku untuk membuka`}
                          >
                            {unlocked && <Trophy className="w-3.5 h-3.5" />}
                            <span>{badge.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search + category chips */}
                  <div className="bg-white border border-[#1F2A24]/10 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24] flex items-center gap-2">
                        <Search className="w-4.5 h-4.5 text-[#C08B34]" /> Cari Koleksi Buku
                      </h3>
                      <button onClick={() => setActiveTab('books')} className="text-[10px] text-[#C08B34] hover:text-[#8A5F22] font-bold flex items-center gap-1">
                        Katalog lengkap <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-[#1F2A24]/30" />
                      <input
                        type="text"
                        placeholder="Judul buku, penulis, atau topik..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-xl text-xs text-[#1F2A24] focus:outline-none focus:ring-2 focus:ring-[#C08B34]/40 focus:border-[#C08B34] placeholder-[#1F2A24]/30 transition-all font-medium"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors shrink-0 cursor-pointer border ${
                          selectedCategory === 'all'
                            ? 'bg-[#20301F] text-[#F6F1E7] border-[#20301F]'
                            : 'bg-[#F6F1E7] text-[#1F2A24]/60 border-[#1F2A24]/10 hover:text-[#1F2A24]'
                        }`}
                      >
                        Semua ({books.length})
                      </button>
                      {categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.id); setActiveTab('books'); }}
                          className="px-3.5 py-1.5 bg-[#F6F1E7] hover:bg-[#EFE8D8] text-[#1F2A24]/60 hover:text-[#1F2A24] rounded-lg text-[10px] font-bold transition-colors shrink-0 cursor-pointer border border-[#1F2A24]/10"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended books */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C08B34]" /> Rekomendasi Populer
                      </h3>
                      <button
                        onClick={() => setActiveTab('books')}
                        className="text-xs text-[#C08B34] hover:text-[#8A5F22] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        Lihat semua ({books.length}) <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {books.slice(0, 4).map((book) => (
                        <BookCard key={book.id} book={book} categoryName={getCategoryName(book.categoryId)} onClick={() => setSelectedBook(book)} />
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ── TAB: BOOKS ── */}
              {activeTab === 'books' && (
                <motion.div key="books" {...tabTransition} className="space-y-6">

                  <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-[#1F2A24]/30" />
                      <input
                        type="text"
                        placeholder="Cari berdasarkan judul, penulis, penerbit, atau ISBN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-xl text-xs text-[#1F2A24] focus:outline-none focus:ring-2 focus:ring-[#C08B34]/40 focus:border-[#C08B34] placeholder-[#1F2A24]/30 transition-all font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#1F2A24]/50 font-bold uppercase shrink-0">
                        <ArrowUpDown className="w-3.5 h-3.5 text-[#C08B34]" />
                        <span>Urutkan:</span>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                        {[
                          { key: 'populer', label: 'Terpopuler' },
                          { key: 'abjad', label: 'A–Z' },
                          { key: 'terbaru', label: 'Terbaru' },
                          { key: 'tersedia', label: 'Stok tersedia' },
                        ].map(s => (
                          <button
                            key={s.key}
                            onClick={() => setSortBy(s.key as any)}
                            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors shrink-0 cursor-pointer border ${
                              sortBy === s.key
                                ? 'bg-[#20301F] text-[#F6F1E7] border-[#20301F]'
                                : 'bg-[#F6F1E7] text-[#1F2A24]/60 border-[#1F2A24]/10 hover:text-[#1F2A24]'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer border ${
                          selectedCategory === 'all'
                            ? 'bg-[#20301F] text-[#F6F1E7] border-[#20301F]'
                            : 'bg-[#F6F1E7] text-[#1F2A24]/60 border-[#1F2A24]/10 hover:text-[#1F2A24]'
                        }`}
                      >
                        Semua Kategori ({books.length})
                      </button>
                      {categories.map((cat) => {
                        const count = books.filter(b => b.categoryId === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer border ${
                              selectedCategory === cat.id
                                ? 'bg-[#20301F] text-[#F6F1E7] border-[#20301F]'
                                : 'bg-[#F6F1E7] text-[#1F2A24]/60 border-[#1F2A24]/10 hover:text-[#1F2A24]'
                            }`}
                          >
                            {cat.name} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-[#1F2A24]/50 font-bold">
                      Menampilkan {filteredBooks.length} buku · Urutan: <span className="text-[#C08B34]">{sortBy === 'populer' ? 'Terpopuler' : sortBy === 'abjad' ? 'A–Z' : sortBy === 'terbaru' ? 'Terbaru' : 'Stok tersedia'}</span>
                    </p>

                    {filteredBooks.length === 0 ? (
                      <div className="bg-white border border-dashed border-[#1F2A24]/20 rounded-2xl py-16 text-center">
                        <BookOpen className="w-12 h-12 text-[#1F2A24]/20 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-[#1F2A24]">Buku tidak ditemukan</h4>
                        <p className="text-xs text-[#1F2A24]/50 font-medium mt-1">Coba sesuaikan kata kunci pencarian atau kategori.</p>
                        <button
                          onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                          className="mt-4 text-xs font-bold text-[#C08B34] hover:text-[#8A5F22] underline underline-offset-2"
                        >
                          Reset pencarian
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filteredBooks.map((book) => (
                          <BookCard
                            key={book.id}
                            book={book}
                            categoryName={getCategoryName(book.categoryId)}
                            onClick={() => setSelectedBook(book)}
                            showRating
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── TAB: HISTORY ── */}
              {activeTab === 'history' && (
                <motion.div key="history" {...tabTransition} className="space-y-6">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1F2A24]">Riwayat Peminjaman</h3>
                    <p className="text-xs text-[#1F2A24]/50 font-medium mt-1">Status pengajuan peminjaman fisik dan peminjaman digital aktif.</p>
                  </div>

                  {myBorrowings.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#1F2A24]/20 rounded-2xl py-16 text-center">
                      <Clock className="w-12 h-12 text-[#1F2A24]/20 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-[#1F2A24]">Belum ada peminjaman</h4>
                      <p className="text-xs text-[#1F2A24]/50 font-medium mt-1">Pilih buku dari katalog untuk mengajukan peminjaman pertamamu.</p>
                      <button
                        onClick={() => setActiveTab('books')}
                        className="mt-4 px-4 py-2 bg-[#20301F] text-[#F6F1E7] rounded-lg text-xs font-bold cursor-pointer hover:bg-[#2A3F27] transition-colors"
                      >
                        Buka Katalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBorrowings.map((b) => {
                        const book = books.find((x) => x.id === b.bookId);

                        let activeStep = 1;
                        if (b.status === 'approved' || b.status === 'overdue' || b.status === 'Sedang Dipinjam') activeStep = 2;
                        if (b.status === 'returned' || b.status === 'Dikembalikan') activeStep = 3;

                        const statusStamp = () => {
                          if (b.status === 'pending') return { label: 'Menunggu', color: '#C08B34' };
                          if (b.status === 'approved' || b.status === 'Sedang Dipinjam') return { label: 'Dipinjam', color: '#5F7A63' };
                          if (b.status === 'returned' || b.status === 'Dikembalikan') return { label: 'Kembali', color: '#20301F' };
                          if (b.status === 'overdue') return { label: 'Terlambat', color: '#B4573F' };
                          return { label: 'Ditolak', color: '#8B8378' };
                        };
                        const stamp = statusStamp();

                        return (
                          <motion.div
                            key={b.id}
                            whileHover={{ y: -2 }}
                            className="catalog-card bg-white border border-[#1F2A24]/10 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                          >
                            {/* Ink stamp */}
                            <div
                              className="stamp-tilt absolute top-4 right-4 font-mono-lib text-[9px] font-bold uppercase px-2.5 py-1 rounded border-2 pointer-events-none"
                              style={{ color: stamp.color, borderColor: stamp.color }}
                            >
                              {stamp.label}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-16">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-16 flex items-center justify-center shrink-0 overflow-visible">
                                  {book ? <Book3D book={book} size="xs" /> : <div className="w-9 h-12 bg-[#F6F1E7] rounded-md" />}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-[#1F2A24] leading-snug">{book?.title || b.bookTitle || 'Buku Digital'}</h4>
                                  <p className="text-[10px] text-[#1F2A24]/50 font-semibold mt-1">Penulis: {book?.author || 'Perpustakaan'}</p>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#1F2A24]/60 font-semibold mt-2">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5 text-[#C08B34]" />
                                      Pinjam: <strong className="text-[#1F2A24]">{b.borrowDate}</strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-[#C08B34]" />
                                      Tempo: <strong className="text-[#8A5F22]">{b.dueDate || '7 Hari'}</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {(b.status === 'approved' || b.status === 'overdue' || b.status === 'Sedang Dipinjam') && (
                                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                  {book && (
                                    <button
                                      onClick={() => setReadingBook3D(book)}
                                      className="px-3.5 py-2 bg-[#20301F] hover:bg-[#2A3F27] text-[#F6F1E7] rounded-lg text-[10px] font-bold transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                                    >
                                      <BookOpen className="w-3.5 h-3.5" /> Baca E-Book
                                    </button>
                                  )}
                                  <button
                                    onClick={() => onRequestReturn(b.id)}
                                    className="px-3.5 py-2 bg-white hover:bg-[#F6F1E7] text-[#1F2A24] border border-[#1F2A24]/15 rounded-lg text-[10px] font-bold transition-colors cursor-pointer active:scale-95"
                                  >
                                    Ajukan Pengembalian
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="pt-3 border-t border-dashed border-[#1F2A24]/15">
                              <div className="flex items-center justify-between text-[9px] font-bold text-[#1F2A24]/40 px-1">
                                <span className={activeStep >= 1 ? 'text-[#C08B34]' : ''}>1. Permohonan</span>
                                <span className={activeStep >= 2 ? 'text-[#5F7A63]' : ''}>2. Persetujuan</span>
                                <span className={activeStep >= 2 ? 'text-[#5F7A63]' : ''}>3. Aktif</span>
                                <span className={activeStep >= 3 ? 'text-[#20301F]' : ''}>4. Kembali</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#F6F1E7] rounded-full mt-2 overflow-hidden flex border border-[#1F2A24]/10">
                                <div className={`h-full transition-all duration-500 ${activeStep >= 1 ? 'bg-[#C08B34] w-1/3' : 'w-0'}`} />
                                <div className={`h-full transition-all duration-500 ${activeStep >= 2 ? 'bg-[#5F7A63] w-1/3' : 'w-0'}`} />
                                <div className={`h-full transition-all duration-500 ${activeStep >= 3 ? 'bg-[#20301F] w-1/3' : 'w-0'}`} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── TAB: STATS ── */}
              {activeTab === 'stats' && (
                <motion.div key="stats" {...tabTransition} className="space-y-6">

                  <div className="relative bg-[#20301F] rounded-2xl p-6 lg:p-8 text-[#F6F1E7] shadow-xl overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="font-mono-lib inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#C08B34] border border-[#C08B34]/40 px-3 py-1 rounded-full">
                          Almanak Baca
                        </span>
                        <h2 className="font-display text-xl lg:text-2xl font-semibold">
                          Kebiasaan membacamu, dalam angka.
                        </h2>
                        <p className="text-xs text-[#CBD5C9] max-w-xl font-medium leading-relaxed">
                          Kategori favorit, ketepatan pengembalian, estimasi jam membaca, dan rentetan keaktifanmu.
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-center shrink-0">
                        <div className="flex items-center justify-center gap-1.5 text-[#C08B34] font-mono-lib font-semibold text-lg">
                          <Flame className="w-5 h-5" />
                          <span>{Math.min(completedCount + 3, 7)} hari</span>
                        </div>
                        <span className="text-[9px] text-[#CBD5C9] uppercase font-bold tracking-wide block mt-0.5">Rentetan aktif</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Buku Selesai', val: `${completedCount}`, unit: `/ ${totalBorrowedCount}`, sub: `${totalBorrowedCount > 0 ? Math.round((completedCount / totalBorrowedCount) * 100) : 0}% tingkat tamat`, accent: '#5F7A63', Icon: BookCheck },
                      { label: 'Waktu Membaca', val: `~${estimatedReadingHours}`, unit: 'jam', sub: `≈ ${estimatedTotalPagesRead.toLocaleString('id-ID')} halaman`, accent: '#20301F', Icon: Activity },
                      { label: 'Ketepatan Waktu', val: `${onTimePercentage}%`, unit: '', sub: overdueCount > 0 ? `${overdueCount} terlambat` : 'Bebas denda', accent: '#C08B34', Icon: ShieldCheck },
                      { label: 'Poin Keanggotaan', val: `${completedCount * 120 + 50}`, unit: 'pts', sub: `Tingkat ${completedCount >= 5 ? 'Legenda' : completedCount >= 3 ? 'Explorer' : 'Novice'}`, accent: '#B4573F', Icon: Trophy }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white border border-[#1F2A24]/10 p-5 rounded-xl shadow-sm flex items-center justify-between" style={{ borderTop: `3px solid ${stat.accent}` }}>
                        <div>
                          <span className="text-[10px] text-[#1F2A24]/50 font-bold uppercase tracking-wide block">{stat.label}</span>
                          <h3 className="font-mono-lib text-xl font-semibold text-[#1F2A24] mt-1">{stat.val} <span className="text-xs text-[#1F2A24]/40 font-medium">{stat.unit}</span></h3>
                          <p className="text-[9px] font-bold mt-1" style={{ color: stat.accent }}>{stat.sub}</p>
                        </div>
                        <stat.Icon className="w-5 h-5 shrink-0" style={{ color: stat.accent }} />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24] flex items-center gap-2">
                          <PieChart className="w-4.5 h-4.5 text-[#C08B34]" /> Distribusi Kategori
                        </h3>
                        <span className="text-[10px] text-[#1F2A24]/50 font-bold bg-[#F6F1E7] px-2.5 py-1 rounded-lg border border-[#1F2A24]/10">
                          {categoryBreakdown.filter(c => c.count > 0).length} kategori
                        </span>
                      </div>

                      <div className="space-y-3 pt-2">
                        {categoryBreakdown.map((cat, idx) => {
                          const barColors = ['#20301F', '#C08B34', '#5F7A63', '#B4573F', '#8A5F22'];
                          const colorHex = barColors[idx % barColors.length];
                          const displayPercent = cat.percentage > 0 ? cat.percentage : (idx === 0 ? 45 : idx === 1 ? 35 : 20);

                          return (
                            <div key={cat.id} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-[#1F2A24]">{cat.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#1F2A24]/50">{cat.count} buku</span>
                                  <span className="font-mono-lib text-[10px] font-bold" style={{ color: colorHex }}>{displayPercent}%</span>
                                </div>
                              </div>
                              <div className="w-full h-2 bg-[#F6F1E7] rounded-full overflow-hidden border border-[#1F2A24]/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${displayPercent}%` }}
                                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: colorHex }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24] flex items-center gap-2">
                          <BarChart3 className="w-4.5 h-4.5 text-[#C08B34]" /> Tren Peminjaman Bulanan
                        </h3>
                        <span className="font-mono-lib text-[10px] text-[#8A5F22] font-bold bg-[#C08B34]/10 px-2.5 py-1 rounded-lg border border-[#C08B34]/20">
                          2026
                        </span>
                      </div>

                      <div className="pt-4 flex items-end justify-between gap-2 h-44 border-b border-[#1F2A24]/10 pb-3">
                        {monthlyActivity.map((item, idx) => {
                          const barHeightPercent = Math.round((item.count / maxMonthlyVal) * 100);
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                              <span className="font-mono-lib text-[9px] font-bold text-[#8A5F22] opacity-0 group-hover:opacity-100 transition-opacity bg-[#C08B34]/10 px-1.5 py-0.5 rounded">
                                {item.count}
                              </span>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(barHeightPercent, 15)}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.06 }}
                                className="w-full max-w-[28px] bg-[#20301F] group-hover:bg-[#C08B34] rounded-t-md transition-colors cursor-pointer"
                              />
                              <span className="text-[10px] text-[#1F2A24]/50 font-bold group-hover:text-[#1F2A24] transition-colors">{item.month}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[#1F2A24]/50 font-semibold pt-1">
                        <span>Aktivitas peminjaman</span>
                        <span>Rata-rata: <strong className="text-[#1F2A24]">2 buku / bulan</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F6F1E7] rounded-xl">
                      <Clock className="w-5 h-5 text-[#C08B34] shrink-0" />
                      <div>
                        <span className="text-[9px] text-[#1F2A24]/50 uppercase font-bold tracking-wide block">Waktu Favorit</span>
                        <h4 className="text-xs font-bold text-[#1F2A24] mt-0.5">Sore & Malam Hari</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F6F1E7] rounded-xl">
                      <Calendar className="w-5 h-5 text-[#C08B34] shrink-0" />
                      <div>
                        <span className="text-[9px] text-[#1F2A24]/50 uppercase font-bold tracking-wide block">Rata-rata Pinjam</span>
                        <h4 className="text-xs font-bold text-[#1F2A24] mt-0.5">5.4 hari per buku</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F6F1E7] rounded-xl">
                      <Sparkles className="w-5 h-5 text-[#C08B34] shrink-0" />
                      <div>
                        <span className="text-[9px] text-[#1F2A24]/50 uppercase font-bold tracking-wide block">Target Bulanan</span>
                        <h4 className="text-xs font-bold text-[#5F7A63] mt-0.5">{progressGoalPercent}% tercapai</h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB: PROFILE (as a real library card) ── */}
              {activeTab === 'profile' && (
                <motion.div key="profile" {...tabTransition} className="space-y-6">

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#1F2A24]/10 p-4 rounded-xl text-center shadow-sm">
                      <span className="text-[9px] text-[#1F2A24]/50 font-bold uppercase tracking-wide">Total Dipinjam</span>
                      <h3 className="font-mono-lib text-xl font-semibold text-[#1F2A24] mt-1">{myBorrowings.length}</h3>
                    </div>
                    <div className="bg-white border border-[#1F2A24]/10 p-4 rounded-xl text-center shadow-sm">
                      <span className="text-[9px] text-[#1F2A24]/50 font-bold uppercase tracking-wide">Selesai Dibaca</span>
                      <h3 className="font-mono-lib text-xl font-semibold text-[#5F7A63] mt-1">{completedCount}</h3>
                    </div>
                    <div className="bg-white border border-[#1F2A24]/10 p-4 rounded-xl text-center shadow-sm">
                      <span className="text-[9px] text-[#1F2A24]/50 font-bold uppercase tracking-wide">Poin Membaca</span>
                      <h3 className="font-mono-lib text-xl font-semibold text-[#C08B34] mt-1">{completedCount * 120 + 50}</h3>
                    </div>
                    <div className="bg-white border border-[#1F2A24]/10 p-4 rounded-xl text-center shadow-sm">
                      <span className="text-[9px] text-[#1F2A24]/50 font-bold uppercase tracking-wide">Status Anggota</span>
                      <h3 className="font-mono-lib text-xl font-semibold text-[#20301F] mt-1">{currentUser.badge || 'Reguler'}</h3>
                    </div>
                  </div>

                  {/* The library card, signature element */}
                  <div className="bg-[#20301F] rounded-2xl p-6 lg:p-7 shadow-xl relative overflow-hidden text-[#F6F1E7]">
                    <div className="absolute top-4 right-4 font-mono-lib text-[9px] uppercase tracking-[0.2em] text-[#C08B34] border border-[#C08B34]/40 px-2.5 py-1 rounded-full">
                      Kartu Anggota Digital
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                      <div className="relative group shrink-0">
                        {currentUser.avatarUrl || currentUser.avatar ? (
                          <img
                            src={currentUser.avatarUrl || currentUser.avatar}
                            alt={currentUser.name}
                            className="w-24 h-24 rounded-xl object-cover ring-2 ring-[#C08B34]/50"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-xl ring-2 ring-[#C08B34]/50 bg-[#C08B34] text-[#20301F] font-bold text-2xl flex items-center justify-center uppercase">
                            {getInitials(currentUser.name)}
                          </div>
                        )}
                        <label
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#F6F1E7] z-10"
                          title="Klik untuk memilih foto profil baru"
                        >
                          {isUploadingAvatar ? (
                            <span className="text-[10px] font-bold">Mengunggah...</span>
                          ) : (
                            <>
                              <Camera className="w-6 h-6 text-[#C08B34] mb-1" />
                              <span className="text-[10px] font-bold">Ubah Foto</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={isUploadingAvatar}
                          />
                        </label>
                        <label
                          className="absolute -bottom-1 -right-1 p-2 bg-[#C08B34] hover:bg-[#D19A42] text-[#20301F] rounded-lg shadow-md border-2 border-[#20301F] cursor-pointer transition-transform hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
                          title="Unggah foto profil"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={isUploadingAvatar}
                          />
                        </label>
                      </div>

                      <div className="text-center md:text-left flex-1 space-y-1.5">
                        <h3 className="font-display text-xl lg:text-2xl font-semibold">{currentUser.name}</h3>
                        <p className="font-mono-lib text-[11px] text-[#CBD5C9]">No. ID: {currentUser.identityNumber || currentUser.nisn || '—'}</p>
                        <p className="text-xs text-[#C08B34] font-bold">{currentUser.memberCategory || currentUser.class || 'Masyarakat Umum'}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                          <span className="px-3 py-1 text-[10px] font-bold bg-white/10 text-[#CBD5C9] rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5F7A63]" /> Terverifikasi
                          </span>
                          <span className="px-3 py-1 text-[10px] font-bold bg-white/10 text-[#CBD5C9] rounded-lg flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#C08B34]" /> Member {currentUser.badge || 'Reguler'}
                          </span>
                        </div>
                      </div>

                      <Stamp className="hidden lg:block w-10 h-10 text-[#C08B34]/30 shrink-0" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#1F2A24]/10 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center justify-between pb-5 border-b border-[#1F2A24]/10">
                      <h3 className="text-xs lg:text-sm font-bold text-[#1F2A24]">Detail Profil</h3>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-5 py-2.5 bg-[#F6F1E7] hover:bg-[#EFE8D8] text-[#1F2A24] rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors border border-[#1F2A24]/10 active:scale-95"
                        >
                          <Edit className="w-4 h-4 text-[#C08B34]" /> Edit Profil
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProfile}
                          className="px-5 py-2.5 bg-[#20301F] hover:bg-[#2A3F27] text-[#F6F1E7] rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
                        >
                          <Save className="w-4 h-4 text-[#C08B34]" /> Simpan Perubahan
                        </button>
                      )}
                    </div>

                    <div className="mt-6 space-y-4 text-xs font-bold text-[#1F2A24]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Nama Lengkap</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] disabled:opacity-60 focus:outline-none focus:border-[#C08B34] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Email Terdaftar</label>
                          <input
                            type="email"
                            disabled
                            value={currentUser.email}
                            className="w-full px-4 py-3 bg-[#F6F1E7]/60 border border-[#1F2A24]/5 rounded-lg text-xs text-[#1F2A24]/40 cursor-not-allowed font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Nomor HP / WhatsApp</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="08123456789..."
                            className="w-full px-4 py-3 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] disabled:opacity-60 focus:outline-none focus:border-[#C08B34] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Kategori Keanggotaan</label>
                          <select
                            disabled={!isEditingProfile}
                            value={editMemberCategory}
                            onChange={(e) => setEditMemberCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] disabled:opacity-60 focus:outline-none focus:border-[#C08B34] font-bold"
                          >
                            <option value="Masyarakat Umum">Masyarakat Umum</option>
                            <option value="Pelajar / Mahasiswa">Pelajar / Mahasiswa</option>
                            <option value="Profesional / Pekerja">Profesional / Pekerja</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">NIK / Nomor Identitas</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={editIdentityNumber}
                          onChange={(e) => setEditIdentityNumber(e.target.value)}
                          placeholder="Nomor identitas KTP / kartu pelajar..."
                          className="w-full px-4 py-3 bg-[#F6F1E7] border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] disabled:opacity-60 focus:outline-none focus:border-[#C08B34] font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
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
        <EBookReader3D book={readingBook3D} onClose={() => setReadingBook3D(null)} currentUser={currentUser} />
      )}

      <AnimatePresence>
        {selectedBook && isBorrowingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#F6F1E7] shadow-2xl rounded-2xl max-w-lg w-full p-6 lg:p-8 relative text-[#1F2A24]"
            >
              <button
                onClick={() => setIsBorrowingModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#1F2A24]/40 hover:text-[#1F2A24] rounded-full cursor-pointer hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-2 text-xs font-semibold">
                <h3 className="font-display text-lg font-semibold text-[#1F2A24] mb-1">Formulir Pengajuan Peminjaman</h3>
                <p className="text-xs text-[#1F2A24]/50 mb-5 font-bold">Buku: <strong className="text-[#8A5F22]">{selectedBook.title}</strong></p>

                {borrowSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-3">
                    <CheckCircle2 className="w-16 h-16 text-[#5F7A63] mx-auto" />
                    <h4 className="text-base font-bold text-[#1F2A24]">Pengajuan Berhasil Dikirim</h4>
                    <p className="text-xs text-[#1F2A24]/50 font-medium">Permohonan peminjaman sedang diproses staf. Terima kasih.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBorrowRequestSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Durasi Peminjaman (Maks {maxBorrowDays} Hari)</label>
                      <select
                        value={borrowDays}
                        onChange={(e) => setBorrowDays(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] focus:outline-none focus:border-[#C08B34] font-bold"
                      >
                        {Array.from({ length: maxBorrowDays }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>{day} Hari Peminjaman</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#1F2A24]/50 font-bold mb-1.5 uppercase text-[10px] tracking-wide">Catatan Peminjaman (Opsional)</label>
                      <textarea
                        rows={3}
                        value={borrowNotes}
                        onChange={(e) => setBorrowNotes(e.target.value)}
                        placeholder="Contoh: untuk keperluan tugas riset atau referensi ilmiah..."
                        className="w-full px-4 py-3 bg-white border border-[#1F2A24]/10 rounded-lg text-xs text-[#1F2A24] placeholder-[#1F2A24]/30 focus:outline-none focus:border-[#C08B34] leading-relaxed font-semibold"
                      />
                    </div>

                    <div className="bg-[#C08B34]/10 p-4 rounded-xl border border-[#C08B34]/25 text-[11px] text-[#8A5F22] space-y-1 font-bold">
                      <p className="font-bold flex items-center gap-1.5"><Info className="w-4 h-4" /> Ketentuan Layanan:</p>
                      <p>1. Nikmati fitur pembaca e-book 3D interaktif secara bebas.</p>
                      <p>2. Pengajuan buku fisik dapat diambil langsung setelah disetujui staf.</p>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1F2A24]/10">
                      <button
                        type="button"
                        onClick={() => setIsBorrowingModalOpen(false)}
                        className="px-4 py-2.5 bg-white hover:bg-[#EFE8D8] text-[#1F2A24] border border-[#1F2A24]/10 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#20301F] hover:bg-[#2A3F27] text-[#F6F1E7] rounded-lg text-xs font-bold cursor-pointer transition-colors active:scale-95"
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
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#20301F] px-4 py-2 flex items-center justify-around shadow-2xl border-t-2 border-[#C08B34]/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                isActive ? 'text-[#C08B34] bg-white/5' : 'text-[#CBD5C9]/60 hover:text-[#CBD5C9]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

/** A catalog-style book card reused across Home and Books tabs. */
function BookCard({
  book,
  categoryName,
  onClick,
  showRating = false
}: {
  book: Book;
  categoryName: string;
  onClick: () => void;
  showRating?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="catalog-card bg-white border border-[#1F2A24]/10 rounded-xl overflow-hidden cursor-pointer group transition-shadow duration-200 hover:shadow-lg relative flex flex-col justify-between text-left"
    >
      <div className="aspect-[3/4] bg-[#F6F1E7] relative overflow-hidden flex items-center justify-center border-b border-[#1F2A24]/10 p-4">
        <Book3D book={book} size="md" />
        <span className="font-mono-lib absolute top-2.5 right-2.5 text-[9px] bg-[#20301F] text-[#C08B34] px-2 py-0.5 rounded font-bold z-10">
          Rak {book.rackLocation}
        </span>

        <div className="absolute inset-0 bg-[#20301F]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 gap-2 z-20">
          <span className="text-[10px] font-bold text-[#C08B34] bg-white/10 px-3 py-1 rounded-full">
            {categoryName}
          </span>
          <span className="w-full py-2 bg-[#C08B34] text-[#20301F] text-[10px] font-bold rounded-lg text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Buka Reader 3D
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] text-[#8A5F22] bg-[#C08B34]/10 px-2 py-0.5 rounded font-bold uppercase">
            {categoryName}
          </span>
          <h4 className="text-xs font-bold text-[#1F2A24] mt-2 line-clamp-1 group-hover:text-[#8A5F22] transition-colors">{book.title}</h4>
          <p className="text-[10px] text-[#1F2A24]/50 font-semibold mt-0.5">{book.author}</p>
        </div>

        <div>
          {showRating && (
            <div className="mt-2.5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className={`w-2.5 h-2.5 ${si < Math.round(book.rating || 0) ? 'text-[#C08B34] fill-[#C08B34]' : 'text-[#1F2A24]/10'}`} />
              ))}
              <span className="text-[9px] text-[#1F2A24]/40 ml-1 font-bold">{(book.rating || 0).toFixed(1)}</span>
            </div>
          )}
          <div className="mt-2.5 pt-2 border-t border-dashed border-[#1F2A24]/15 flex items-center justify-between text-[9px] font-bold">
            <span className={book.stock > 0 ? 'text-[#5F7A63] flex items-center gap-1' : 'text-[#B4573F] flex items-center gap-1'}>
              <span className={`w-1.5 h-1.5 rounded-full ${book.stock > 0 ? 'bg-[#5F7A63]' : 'bg-[#B4573F]'}`} />
              {book.stock > 0 ? `${book.stock} Eks` : 'Habis'}
            </span>
            <span className="font-mono-lib text-[#1F2A24]/30">{book.year}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}



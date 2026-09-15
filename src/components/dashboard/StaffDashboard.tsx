/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderClosed, 
  ArrowLeftRight, 
  Users, 
  TrendingUp, 
  LogOut, 
  Plus, 
  Search, 
  Shield,
  FileSpreadsheet,
  X,
  Clock,
  Download,
  BarChart3,
  Package,
  Sparkles,
  Menu,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, UserRole } from '../../types';
import Book3D from '../Book3D';

interface StaffDashboardProps {
  currentUser: User;
  onLogout: () => void;
  books: Book[];
  categories: Category[];
  borrowings?: Borrowing[];
  users: User[];
  settings: LibrarySettings;
  onAddBook: (book: Omit<Book, 'status' | 'category' | 'description' | 'rating' | 'coverColor'> & { status?: Book['status'], category?: string, description?: string, rating?: number, coverColor?: string, coverUrl?: string, pdfUrl?: string }) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onVerifyBorrow?: (borrowingId: string, approve: boolean) => void;
  onVerifyReturn?: (borrowingId: string, approve: boolean) => void;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  onAddUser: (newUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateSettings?: (newSettings: LibrarySettings) => void;
}

export default function StaffDashboard({
  currentUser,
  onLogout,
  books,
  categories,
  borrowings = [],
  users,
  settings,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onVerifyBorrow,
  onVerifyReturn,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  onUpdateSettings
}: StaffDashboardProps) {
  // Check admin dengan role admin
  const isAdmin = React.useMemo(() => {
    const role = currentUser.role;
    const normalizedRole = String(role).toLowerCase();
    return normalizedRole === 'admin' || role === UserRole.ADMIN;
  }, [currentUser.role]);

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'books' | 'categories' | 'transactions' | 'users' | 'reports'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Modals / Editors states
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Forms
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookYear, setBookYear] = useState(2026);
  const [bookCategoryId, setBookCategoryId] = useState('');
  const [bookRack, setBookRack] = useState('');
  const [bookSynopsis, setBookSynopsis] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<UserRole | string>(UserRole.USER);
  const [uBadge, setUBadge] = useState<'Premium' | 'Reguler'>('Reguler');
  const [uNisn, setUNisn] = useState('');
  const [uNip, setUNip] = useState('');
  const [uClass, setUClass] = useState('Umum');
  const [uPhone, setUPhone] = useState('');
  const [uAvatarUrl, setUAvatarUrl] = useState('');

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'returned'>('all');

  // Kumpulkan seluruh data riwayat unduhan buku dari seluruh anggota
  const allDownloads = React.useMemo(() => {
    const list: Array<{
      id: string;
      bookId: string;
      bookTitle: string;
      author?: string;
      category?: string;
      coverUrl?: string;
      coverColor?: string;
      downloadDate: string;
      pdfUrl?: string;
      userId: string;
      userName: string;
      userEmail: string;
      identityNumber?: string;
    }> = [];

    users.forEach(u => {
      if (u.downloads && Array.isArray(u.downloads)) {
        u.downloads.forEach(d => {
          list.push({
            ...d,
            userId: u.id,
            userName: u.name,
            userEmail: u.email,
            identityNumber: u.identityNumber || u.nisn || u.nip || '-'
          });
        });
      }
    });

    // Jika belum ada record unduhan di user, mapping data sirkulasi lama sebagai riwayat unduhan
    if (list.length === 0 && borrowings && borrowings.length > 0) {
      borrowings.forEach(b => {
        const u = users.find(x => x.id === (b.studentId || b.userId));
        const bk = books.find(x => x.id === b.bookId);
        list.push({
          id: b.id,
          bookId: b.bookId,
          bookTitle: bk?.title || b.bookTitle || 'Buku Digital',
          author: bk?.author || 'Penulis',
          category: bk?.category || 'Umum',
          coverUrl: bk?.coverUrl || b.coverUrl,
          coverColor: bk?.coverColor || b.coverColor,
          downloadDate: b.borrowDate,
          pdfUrl: bk?.pdfUrl,
          userId: u?.id || b.studentId || 'u-unknown',
          userName: u?.name || 'Pemustaka',
          userEmail: u?.email || 'pemustaka@perpustakaan.id',
          identityNumber: u?.identityNumber || u?.nisn || u?.nip || '-'
        });
      });
    }

    return list;
  }, [users, borrowings, books]);

  // Stats
  const totalBooks = books.length;
  const availableBooks = books.length;
  const totalDownloads = allDownloads.length;
  const totalMembers = users.filter(u => [UserRole.USER, 'user'].includes(u.role as any)).length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dark-themed Analytics Canvas Chart
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = chartRef.current;
    const containerWidth = canvas.parentElement?.offsetWidth || canvas.offsetWidth || 500;
    canvas.width = containerWidth * 2;
    canvas.height = 480; 
    canvas.style.width = '100%';
    canvas.style.height = '240px';
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, containerWidth, 240);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
    const downloadData = [24, 38, 45, 52, 60, 75, totalDownloads > 0 ? totalDownloads : 80];
    const readerData = [15, 22, 28, 35, 40, 58, totalMembers > 0 ? totalMembers : 62];
    
    const maxValue = Math.max(...downloadData, ...readerData) + 15;
    const padding = 45;
    const chartHeight = 240 - padding * 2;
    const chartWidth = containerWidth - padding * 2;
    const stepX = chartWidth / (months.length - 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(containerWidth - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.textAlign = 'right';
      const labelVal = Math.round(maxValue - (maxValue / 4) * i);
      ctx.fillText(String(labelVal), padding - 10, y + 3.5);
    }
    ctx.setLineDash([]);

    const getCoordinates = (dataList: number[]) => {
      return dataList.map((val, idx) => ({
        x: padding + stepX * idx,
        y: padding + chartHeight - (val / maxValue) * chartHeight
      }));
    };

    const downloadPoints = getCoordinates(downloadData);
    const readerPoints = getCoordinates(readerData);

    const drawAreaCurve = (
      points: { x: number; y: number }[],
      strokeColor: string,
      fillColorStart: string,
      fillColorEnd: string
    ) => {
      if (points.length === 0) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, padding + chartHeight);
      ctx.lineTo(points[0].x, points[0].y);
      
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p1.x, p1.y);
      }
      
      ctx.lineTo(points[points.length - 1].x, padding + chartHeight);
      ctx.closePath();
      
      const grad = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
      grad.addColorStop(0, fillColorStart);
      grad.addColorStop(1, fillColorEnd);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p1.x, p1.y);
      }
      ctx.stroke();

      points.forEach((pt) => {
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawAreaCurve(downloadPoints, '#38bdf8', 'rgba(56, 189, 248, 0.25)', 'rgba(56, 189, 248, 0.01)');
    drawAreaCurve(readerPoints, '#a855f7', 'rgba(168, 85, 247, 0.25)', 'rgba(168, 85, 247, 0.01)');

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    months.forEach((month, idx) => {
      const x = padding + stepX * idx;
      ctx.fillText(month, x, 240 - padding + 22);
    });
  }, [totalDownloads, totalMembers, windowWidth, sidebarCollapsed, activeMenu]);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.includes(searchQuery)
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.nisn && u.nisn.includes(searchQuery)) ||
    (u.nip && u.nip.includes(searchQuery))
  );

  const getCategoryName = (catId: string | undefined) => {
    if (!catId) return 'Lainnya';
    return categories.find(c => c.id === catId)?.name || 'Lainnya';
  };

  const getUserName = (uid: string) => {
    return users.find(u => u.id === uid)?.name || 'Pemustaka';
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar (.jpg, .png, .webp)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Mohon pilih file dokumen dengan ekstensi .pdf');
        return;
      }
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookPdfUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenBookModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      setBookTitle(book.title);
      setBookAuthor(book.author);
      setBookPublisher(book.publisher || '');
      setBookIsbn(book.isbn || '');
      setBookYear(book.year || 2026);
      setBookCategoryId(book.categoryId ?? (categories.find(c => c.name === book.category)?.id || ''));
      setBookRack(book.rackLocation ?? '');
      setBookSynopsis(book.synopsis ?? book.description ?? '');
      setBookCoverUrl(book.coverUrl ?? '');
      setBookPdfUrl(book.pdfUrl ?? '');
      setPdfFileName(book.pdfUrl ? book.pdfUrl.split('/').pop() || 'File PDF Terlampir' : '');
    } else {
      setEditingBook(null);
      setBookTitle('');
      setBookAuthor('');
      setBookPublisher('');
      setBookIsbn('');
      setBookYear(2026);
      setBookCategoryId(categories[0]?.id || '');
      setBookRack('');
      setBookSynopsis('');
      setBookCoverUrl('');
      setBookPdfUrl('');
      setPdfFileName('');
    }
    setIsBookModalOpen(true);
  };

  const handleSaveBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      onUpdateBook({
        ...editingBook,
        title: bookTitle,
        author: bookAuthor,
        publisher: bookPublisher,
        isbn: bookIsbn,
        year: bookYear,
        categoryId: bookCategoryId,
        category: categories.find(c => c.id === bookCategoryId)?.name || editingBook.category,
        rackLocation: bookRack,
        synopsis: bookSynopsis,
        description: bookSynopsis,
        coverUrl: bookCoverUrl || undefined,
        pdfUrl: bookPdfUrl || undefined
      });
    } else {
      onAddBook({
        id: `book-${Date.now()}`,
        title: bookTitle,
        author: bookAuthor,
        category: categories.find(c => c.id === bookCategoryId)?.name || 'Umum',
        description: bookSynopsis,
        publisher: bookPublisher,
        isbn: bookIsbn,
        year: bookYear,
        rating: 0,
        status: 'Tersedia',
        coverColor: 'from-blue-600 to-indigo-900',
        categoryId: bookCategoryId,
        rackLocation: bookRack,
        synopsis: bookSynopsis,
        coverUrl: bookCoverUrl || undefined,
        pdfUrl: bookPdfUrl || undefined
      });
    }
    setIsBookModalOpen(false);
  };

  const handleOpenCategoryModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.description);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: catName,
        description: catDesc
      });
    } else {
      onAddCategory({
        id: `cat-${Date.now()}`,
        name: catName,
        description: catDesc
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleOpenUserModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setUName(user.name);
      const normRole = (user.role === 'admin' || (user.role as any) === UserRole.ADMIN) ? 'admin' : 'user';
      setURole(normRole);
      setUBadge(user.badge || 'Reguler');
      setUNisn(user.identityNumber || user.nisn || '');
      setUNip(user.nip || '');
      setUClass(user.memberCategory || user.class || 'Masyarakat Umum');
      setUPhone(user.phone || '');
      setUAvatarUrl(user.avatarUrl || user.avatar || '');
    } else {
      setEditingUser(null);
      setUName('');
      setUEmail('');
      setURole('user');
      setUBadge('Reguler');
      setUNisn('');
      setUNip('');
      setUClass('Masyarakat Umum');
      setUPhone('');
      setUAvatarUrl('');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isUserRole = ['user', 'siswa', UserRole.USER].includes(String(uRole).toLowerCase());
    if (editingUser) {
      onUpdateUser(editingUser.id, {
        name: uName,
        email: uEmail,
        role: uRole as UserRole,
        badge: uBadge,
        avatarUrl: uAvatarUrl || undefined,
        avatar: uAvatarUrl || undefined,
        identityNumber: isUserRole ? uNisn : undefined,
        nisn: isUserRole ? uNisn : undefined,
        nip: !isUserRole ? uNip : undefined,
        memberCategory: isUserRole ? uClass : undefined,
        class: isUserRole ? uClass : undefined,
        phone: uPhone
      });
    } else {
      onAddUser({
        id: `user-${Date.now()}`,
        email: uEmail,
        name: uName,
        password: 'password123', // Default password
        role: uRole as UserRole,
        badge: uBadge,
        avatarUrl: uAvatarUrl || (isUserRole 
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'),
        avatar: uAvatarUrl || undefined,
        identityNumber: isUserRole ? uNisn : undefined,
        nisn: isUserRole ? uNisn : undefined,
        nip: !isUserRole ? uNip : undefined,
        memberCategory: isUserRole ? uClass : undefined,
        class: isUserRole ? uClass : undefined,
        phone: uPhone,
        status: 'active',
        favorites: [],
        borrowings: []
      });
    }
    setIsUserModalOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'books', label: 'Koleksi Buku', icon: BookOpen },
    { id: 'categories', label: 'Kategori Genre', icon: FolderClosed },
    { id: 'transactions', label: 'Sirkulasi Unduhan', icon: Download },
    { id: 'users', label: 'Kelola Anggota', icon: Users },
    { id: 'reports', label: 'Laporan & Rekap', icon: FileSpreadsheet },
  ];

  return (
    <div className="h-screen bg-slate-950 flex text-slate-100 overflow-hidden font-sans selection:bg-blue-500 selection:text-white" id="staff-dashboard">
      
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 shrink-0 hidden lg:flex flex-col shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-hidden z-20`}>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          {!sidebarCollapsed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 ring-1 ring-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black text-white tracking-wider uppercase truncate flex items-center gap-1.5">
                  Admin Panel <Sparkles className="w-3 h-3 text-cyan-400" />
                </h2>
                <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-widest">{currentUser.role}</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mx-auto ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={sidebarCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as any)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-3 shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-xl border border-slate-750/50">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs ring-2 ring-cyan-500/30">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-cyan-400 font-semibold truncate mt-0.5">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-xl transition-all cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-950 z-40 lg:hidden" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50 lg:hidden flex flex-col shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white uppercase">Admin Panel</h2>
                    <span className="text-[9px] text-cyan-400 font-bold uppercase">{currentUser.role}</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button key={item.id} onClick={() => { setActiveMenu(item.id as any); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                      <Icon className="w-4.5 h-4.5" /> <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-800 shrink-0 space-y-3 bg-slate-900/40">
                <div className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-xl border border-slate-750/50">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs ring-2 ring-cyan-500/30">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                    <p className="text-[9px] text-cyan-400 font-semibold truncate mt-0.5">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-xl transition-all cursor-pointer text-xs font-bold"
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
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="h-16 lg:h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-800 rounded-xl text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"><Menu className="w-5 h-5" /></button>
            <div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-cyan-500/20">
                Administrator • Perpustakaan Kita
              </span>
              <h1 className="text-sm lg:text-base font-black text-white mt-1 flex items-center gap-2">
                {currentUser.name}
              </h1>
            </div>
          </div>

          {/* Tombol Logout Mobile di Navbar */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ── DASHBOARD TAB ── */}
            {activeMenu === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Buku', val: totalBooks, sub: `${availableBooks} Tersedia`, icon: Package, border: 'border-blue-500/30', color: 'text-blue-400 bg-blue-500/10' },
                    { label: 'Total Unduhan', val: totalDownloads, sub: `${totalDownloads} File Diunduh`, icon: Download, border: 'border-cyan-500/30', color: 'text-cyan-400 bg-cyan-500/10' },
                    { label: 'Kategori Genre', val: categories.length, sub: 'Klasifikasi Buku', icon: FolderClosed, border: 'border-amber-500/30', color: 'text-amber-400 bg-amber-500/10' },
                    { label: 'Total Pemustaka', val: totalMembers, sub: 'Anggota Terdaftar', icon: Users, border: 'border-indigo-500/30', color: 'text-indigo-400 bg-indigo-500/10' }
                  ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <motion.div key={i} whileHover={{ y: -3 }} className={`bg-slate-900 border ${c.border} rounded-2xl p-5 shadow-xl flex items-center justify-between`}>
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{c.label}</span>
                          <h3 className="text-2xl font-black text-white mt-1">{c.val}</h3>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">{c.sub}</p>
                        </div>
                        <span className={`p-3 rounded-xl ${c.color}`}><Icon className="w-5 h-5" /></span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Chart Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" /> Tren Unduhan & Aktivitas Pemustaka
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Kumulatif data unduhan buku 7 bulan terakhir</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Unduhan PDF
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Pemustaka Aktif
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-2">
                    <canvas ref={chartRef} className="w-full" style={{ height: 240 }} />
                  </div>
                </div>

                {/* Recent Downloads Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Download className="w-4 h-4 text-cyan-400" /> Aktivitas Unduhan Terkini
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Daftar pemustaka yang baru saja mengunduh e-book</p>
                    </div>
                    <button onClick={() => setActiveMenu('transactions')} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer">
                      Lihat Semua Unduhan →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-extrabold">
                        <tr>
                          <th className="py-3 px-5">Pemustaka</th>
                          <th className="py-3 px-5">Judul Buku</th>
                          <th className="py-3 px-5">Kategori</th>
                          <th className="py-3 px-5">Tanggal Unduh</th>
                          <th className="py-3 px-5 text-center">Format</th>
                          <th className="py-3 px-5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {allDownloads.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-500">
                              Belum ada aktivitas unduhan buku digital.
                            </td>
                          </tr>
                        ) : (
                          allDownloads.slice(0, 5).map((dl, idx) => (
                            <tr key={dl.id || idx} className="hover:bg-slate-800/50">
                              <td className="py-3.5 px-5 font-bold text-white">
                                <div>{dl.userName}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{dl.userEmail}</div>
                              </td>
                              <td className="py-3.5 px-5 font-medium text-white">{dl.bookTitle}</td>
                              <td className="py-3.5 px-5 text-slate-400">
                                <span className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded text-[10px] font-bold">
                                  {dl.category || 'Umum'}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-slate-400">{dl.downloadDate}</td>
                              <td className="py-3.5 px-5 text-center">
                                <span className="px-2 py-0.5 rounded font-extrabold text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                                  PDF
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <span className="px-2.5 py-1 rounded-md font-extrabold text-[10px] uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  Berhasil Diunduh
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ── BOOKS TAB ── */}
            {activeMenu === 'books' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h2 className="text-base lg:text-lg font-black text-white">Kelola Koleksi Buku</h2>
                    <p className="text-xs text-slate-400 font-medium">Tambah, edit, dan kelola buku digital.</p>
                  </div>
                  <button onClick={() => handleOpenBookModal(null)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer">
                    <Plus className="w-4 h-4" /> Tambah Buku
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Cari judul, penulis, ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between gap-3">
                      <div className="aspect-[3/4] bg-slate-950 rounded-xl flex items-center justify-center p-3 relative">
                        <Book3D book={book} size="sm" />
                        <span className="absolute top-2 right-2 text-[9px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-bold">
                          PDF
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-cyan-400 font-extrabold uppercase">{getCategoryName(book.categoryId)}</span>
                        <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">{book.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{book.author}</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button onClick={() => handleOpenBookModal(book)} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[10px] font-bold">
                          Edit
                        </button>
                        <button onClick={() => { if (window.confirm(`Hapus ${book.title}?`)) onDeleteBook(book.id); }} className="flex-1 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded text-[10px] font-bold">
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── CATEGORIES TAB ── */}
            {activeMenu === 'categories' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-black text-white">Kategori Genre</h2>
                    <p className="text-xs text-slate-400">Klasifikasi rak dan genre buku.</p>
                  </div>
                  <button onClick={() => handleOpenCategoryModal(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah Kategori
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                          {books.filter(b => b.categoryId === cat.id).length} Buku
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button onClick={() => handleOpenCategoryModal(cat)} className="px-3 py-1 bg-slate-800 text-cyan-400 text-xs font-bold rounded">Edit</button>
                        <button onClick={() => onDeleteCategory(cat.id)} className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TRANSACTIONS (UNDUHAN) TAB ── */}
            {activeMenu === 'transactions' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <Download className="w-5 h-5 text-cyan-400" /> Sirkulasi & Riwayat Unduhan Buku
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Rekapitulasi dan log pemustaka yang telah mengunduh koleksi buku digital.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4 text-cyan-400" /> Cetak PDF
                    </button>
                    <button 
                      onClick={() => {
                        const headers = ['ID,Nama Pemustaka,Email,No Identitas,Judul Buku,Kategori,Tanggal Unduh,Status'];
                        const rows = allDownloads.map(dl => {
                          return `"${dl.id}","${dl.userName}","${dl.userEmail}","${dl.identityNumber || '-'}","${dl.bookTitle}","${dl.category || '-'}","${dl.downloadDate}","Berhasil Diunduh"`;
                        });
                        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', `laporan_unduhan_buku_${new Date().toISOString().slice(0, 10)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
                    </button>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari pemustaka, email, atau judul buku yang diunduh..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                    >
                      Semua Unduhan ({allDownloads.length})
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-4">Pemustaka</th>
                          <th className="p-4">No. Identitas</th>
                          <th className="p-4">Judul Buku</th>
                          <th className="p-4">Kategori</th>
                          <th className="p-4">Tanggal Unduh</th>
                          <th className="p-4 text-center">Format</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {allDownloads.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-500">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Download className="w-8 h-8 text-slate-600" />
                                <p className="font-bold text-slate-400">Belum ada data unduhan buku</p>
                                <p className="text-[11px] text-slate-600">Ketika pemustaka mengunduh file PDF dari katalog atau detail buku, log unduhan otomatis muncul di sini.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          allDownloads.filter(dl => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            return (
                              dl.userName.toLowerCase().includes(q) ||
                              dl.userEmail.toLowerCase().includes(q) ||
                              dl.bookTitle.toLowerCase().includes(q) ||
                              (dl.category && dl.category.toLowerCase().includes(q)) ||
                              (dl.identityNumber && dl.identityNumber.toLowerCase().includes(q))
                            );
                          }).map(dl => (
                            <tr key={dl.id} className="hover:bg-slate-800/40">
                              <td className="p-4">
                                <div className="font-bold text-white">{dl.userName}</div>
                                <div className="text-[10px] text-slate-400">{dl.userEmail}</div>
                              </td>
                              <td className="p-4 font-mono text-slate-400">{dl.identityNumber || '-'}</td>
                              <td className="p-4 font-semibold text-white">{dl.bookTitle}</td>
                              <td className="p-4 text-slate-400">
                                <span className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded text-[10px] font-bold">
                                  {dl.category || 'Umum'}
                                </span>
                              </td>
                              <td className="p-4 text-slate-400">{dl.downloadDate}</td>
                              <td className="p-4 text-center">
                                <span className="px-2 py-0.5 rounded font-extrabold text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                                  PDF
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="px-2.5 py-1 rounded-md font-extrabold text-[10px] uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  Berhasil Diunduh
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {dl.pdfUrl ? (
                                  <a
                                    href={dl.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all inline-flex items-center gap-1 cursor-pointer text-[10px]"
                                  >
                                    <Download className="w-3 h-3" /> Unduh
                                  </a>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">Tersimpan</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── REPORTS TAB ── */}
            {activeMenu === 'reports' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Laporan & Rekap Statistik
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Unduh dan analisis data perpustakaan dengan detail statistik lengkap.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Koleksi Buku</span>
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{books.length}</h3>
                    <p className="text-[10px] text-slate-500">Total koleksi buku digital</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Unduhan Buku</span>
                      <Download className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{totalDownloads}</h3>
                    <p className="text-[10px] text-slate-500">File e-book berhasil diunduh</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Pemustaka</span>
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{users.length}</h3>
                    <p className="text-[10px] text-slate-500">Pemustaka terdaftar ({totalMembers} anggota)</p>
                  </div>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Download Statistics */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-cyan-400" /> Statistik Aktivitas Koleksi & Unduhan
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                          <span className="text-xs font-bold text-slate-300">Total Judul Buku Tersedia</span>
                        </div>
                        <span className="text-sm font-black text-cyan-400">{totalBooks}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                          <span className="text-xs font-bold text-slate-300">Total File Diunduh Selesai</span>
                        </div>
                        <span className="text-sm font-black text-emerald-400">{totalDownloads}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          <span className="text-xs font-bold text-slate-300">Total Pemustaka Aktif</span>
                        </div>
                        <span className="text-sm font-black text-purple-400">{totalMembers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                          <span className="text-xs font-bold text-slate-300">Kategori Genre Tersedia</span>
                        </div>
                        <span className="text-sm font-black text-amber-400">{categories.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-black text-white">Distribusi Kategori Buku</h3>
                    <div className="space-y-3">
                      {categories.map((cat, idx) => {
                        const count = books.filter(b => b.categoryId === cat.id).length;
                        const percentage = books.length > 0 ? ((count / books.length) * 100).toFixed(1) : '0';
                        const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'];
                        const color = colors[idx % colors.length];
                        return (
                          <div key={cat.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-300">{cat.name}</span>
                              <span className="text-xs font-black text-white">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                              <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Top Downloaded Books */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" /> Buku Paling Populer (Banyak Diunduh)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-extrabold">
                        <tr>
                          <th className="py-3 px-5">Ranking</th>
                          <th className="py-3 px-5">Judul Buku</th>
                          <th className="py-3 px-5">Penulis</th>
                          <th className="py-3 px-5">Kategori</th>
                          <th className="py-3 px-5 text-right">Jumlah Unduhan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {(() => {
                          const bookDownloadCount = books.map(book => ({
                            ...book,
                            downloadCount: allDownloads.filter(d => d.bookId === book.id).length
                          })).sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 10);
                          
                          return bookDownloadCount.map((book, idx) => (
                            <tr key={book.id} className="hover:bg-slate-800/50">
                              <td className="py-3.5 px-5">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-[10px] ${
                                  idx === 0 ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/50' :
                                  idx === 1 ? 'bg-slate-400/20 text-slate-300 border-2 border-slate-400/50' :
                                  idx === 2 ? 'bg-orange-600/20 text-orange-300 border-2 border-orange-600/50' :
                                  'bg-slate-800 text-slate-400'
                                }`}>
                                  #{idx + 1}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 font-bold text-white">{book.title}</td>
                              <td className="py-3.5 px-5 text-slate-400">{book.author}</td>
                              <td className="py-3.5 px-5">
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-bold">
                                  {getCategoryName(book.categoryId)}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-right font-black text-cyan-400">{book.downloadCount}x</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Export Actions */}
                <div className="bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-emerald-600/10 border border-cyan-500/30 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-cyan-400" /> Export Data Laporan Unduhan
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Unduh laporan rekapitulasi unduhan buku dalam berbagai format.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => {
                          const headers = ['ID,Nama Pemustaka,Email,No Identitas,Judul Buku,Kategori,Tanggal Unduh,Status'];
                          const rows = allDownloads.map(dl => {
                            return `"${dl.id}","${dl.userName}","${dl.userEmail}","${dl.identityNumber || '-'}","${dl.bookTitle}","${dl.category || '-'}","${dl.downloadDate}","Berhasil Diunduh"`;
                          });
                          const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement('a');
                          link.setAttribute('href', encodedUri);
                          link.setAttribute('download', `laporan_unduhan_buku_${new Date().toISOString().slice(0, 10)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Export CSV
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Cetak PDF
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── USERS TAB ── */}
            {activeMenu === 'users' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black text-white">Kelola Pengguna</h2>
                    <p className="text-xs text-slate-400 font-medium">Atur hak akses role (Admin & User) dan status keanggotaan.</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleOpenUserModal(null)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all">
                      <Plus className="w-4 h-4" /> User / Anggota Baru
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, email, role, atau NISN/NIP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                        <tr>
                          <th className="p-4">Nama & Email</th>
                          <th className="p-4">Role / Peran</th>
                          <th className="p-4">Keanggotaan</th>
                          <th className="p-4">NISN / NIP / NIK</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredUsers.map(u => {
                          const userRoleStr = String(u.role || 'user').toLowerCase();
                          const normalizedRole = ['admin', 'administrator'].includes(userRoleStr) ? 'admin' : 'user';
                          
                          return (
                            <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-4 font-bold text-white">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-black text-xs text-white uppercase shrink-0">
                                    {u.name ? u.name.substring(0, 2) : 'US'}
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-white text-xs">{u.name}</div>
                                    <span className="text-[10px] text-slate-400 font-normal">{u.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                {isAdmin ? (
                                  <select
                                    value={normalizedRole}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      const newRole = e.target.value;
                                      onUpdateUser(u.id, { role: newRole as any });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] font-extrabold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                                  >
                                    <option value="admin">Administrator (Admin)</option>
                                    <option value="user">User (Pemustaka)</option>
                                  </select>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border ${
                                    normalizedRole === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  }`}>
                                    {normalizedRole === 'admin' ? 'Admin' : 'User'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                {isAdmin ? (
                                  <select
                                    value={u.badge || 'Reguler'}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      const newBadge = e.target.value as 'Premium' | 'Reguler';
                                      console.log('Updating user badge:', { userId: u.id, userName: u.name, newBadge });
                                      try {
                                        onUpdateUser(u.id, { badge: newBadge });
                                      } catch (error) {
                                        console.error('Error updating user badge:', error);
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-slate-950 border border-slate-800 text-amber-300 text-[11px] font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                                  >
                                    <option value="Reguler">Reguler</option>
                                    <option value="Premium">Premium ⭐</option>
                                  </select>
                                ) : (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.badge === 'Premium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                                    {u.badge || 'Reguler'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-slate-400 font-mono">{u.identityNumber || u.nisn || u.nip || '-'}</td>
                              <td className="p-4 text-right">
                                {isAdmin && (
                                  <div className="flex justify-end gap-1.5">
                                    <button onClick={() => handleOpenUserModal(u)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg font-bold transition-all cursor-pointer">Edit</button>
                                    <button onClick={() => { if (window.confirm(`Hapus user ${u.name}?`)) onDeleteUser(u.id); }} className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg font-bold transition-all cursor-pointer">Hapus</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 relative shadow-2xl my-auto max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">{editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h3>
                    <p className="text-[10px] text-slate-400">Lengkapi data informasi, file dokumen PDF, dan cover buku digital.</p>
                  </div>
                </div>
                <button onClick={() => setIsBookModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBookSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
                {/* Informasi Utama */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Informasi Utama Buku
                  </span>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Buku *</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Bumi, Filosofi Teras..." 
                      value={bookTitle} 
                      onChange={e => setBookTitle(e.target.value)} 
                      required 
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500 transition-colors" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Penulis *</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Tere Liye, Henry Manampiring..." 
                        value={bookAuthor} 
                        onChange={e => setBookAuthor(e.target.value)} 
                        required 
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Penerbit</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Gramedia Pustaka Utama..." 
                        value={bookPublisher} 
                        onChange={e => setBookPublisher(e.target.value)} 
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Kategori Genre *</label>
                      <select 
                        value={bookCategoryId} 
                        onChange={e => setBookCategoryId(e.target.value)} 
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Tahun Terbit</label>
                      <input 
                        type="number" 
                        placeholder="2026" 
                        value={bookYear} 
                        onChange={e => setBookYear(Number(e.target.value))} 
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Nomor ISBN</label>
                      <input 
                        type="text" 
                        placeholder="978-602-..." 
                        value={bookIsbn} 
                        onChange={e => setBookIsbn(e.target.value)} 
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section Cover Buku */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Sampul Buku (Cover Image)
                  </span>
                  
                  <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                    {/* Preview Box */}
                    <div className="w-20 aspect-[3/4] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 relative shadow-md">
                      {bookCoverUrl ? (
                        <img 
                          src={bookCoverUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500">
                          <ImageIcon className="w-6 h-6 mb-1 text-slate-600" />
                          <span className="text-[8px] font-bold">Tanpa Sampul</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2.5 w-full">
                      {/* Upload File Gambar */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Upload File Gambar (.jpg, .png, .webp)
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCoverUpload} 
                          className="block w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer file:cursor-pointer transition-all"
                        />
                      </div>

                      {/* Atau Masukkan URL Cover */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Atau Tautan URL Cover Gambar
                        </label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="https://... atau /buku_sampul/cover.jpg" 
                            value={bookCoverUrl} 
                            onChange={e => setBookCoverUrl(e.target.value)} 
                            className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>

                      {bookCoverUrl && (
                        <button
                          type="button"
                          onClick={() => setBookCoverUrl('')}
                          className="px-2.5 py-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus Sampul
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section File Dokumen PDF */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> File Dokumen E-Book (PDF) *
                  </span>

                  <div className="space-y-2.5">
                    {/* Upload File PDF */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Upload File PDF Buku Langsung
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={handlePdfUpload} 
                        className="block w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer file:cursor-pointer transition-all"
                      />
                    </div>

                    {/* Atau Masukkan URL/Path PDF */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Atau Masukkan Jalur / URL File PDF
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Contoh: /buku_digital/Bumi.pdf atau https://domain.com/buku.pdf" 
                          value={bookPdfUrl} 
                          onChange={e => {
                            setBookPdfUrl(e.target.value);
                            setPdfFileName(e.target.value.split('/').pop() || '');
                          }} 
                          className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    {/* Status PDF Attached */}
                    {bookPdfUrl && (
                      <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold truncate">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate">{pdfFileName || 'Dokumen PDF Terpasang'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBookPdfUrl('');
                            setPdfFileName('');
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded transition-colors cursor-pointer"
                          title="Hapus file PDF"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sinopsis */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Sinopsis / Ringkasan Buku</label>
                  <textarea 
                    placeholder="Tuliskan sinopsis singkat mengenai alur cerita atau isi buku..." 
                    value={bookSynopsis} 
                    onChange={e => setBookSynopsis(e.target.value)} 
                    rows={3} 
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  />
                </div>

                {/* Lokasi Rak (Opsional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Lokasi Rak / Label Koleksi (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Rak Digital A-1, Koleksi E-Book Utama..." 
                    value={bookRack} 
                    onChange={e => setBookRack(e.target.value)} 
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsBookModalOpen(false)} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> Simpan Buku
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 relative">
              <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
              <h3 className="text-base font-black">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <form onSubmit={handleSaveCategorySubmit} className="space-y-3 text-xs">
                <input type="text" placeholder="Nama Kategori" value={catName} onChange={e => setCatName(e.target.value)} required className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                <textarea placeholder="Deskripsi Kategori" value={catDesc} onChange={e => setCatDesc(e.target.value)} rows={3} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-xl">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 relative shadow-2xl">
              <button onClick={() => setIsUserModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-base font-black text-white">{editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}</h3>
              <form onSubmit={handleSaveUserSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nama Lengkap</label>
                  <input type="text" placeholder="Nama Lengkap" value={uName} onChange={e => setUName(e.target.value)} required className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Email</label>
                  <input type="email" placeholder="Email" value={uEmail} onChange={e => setUEmail(e.target.value)} required className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Password (Default: password123)</label>
                    <input type="text" placeholder="Biarkan kosong untuk password default" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500 bg-slate-900/50" disabled />
                    <p className="text-[9px] text-slate-500 mt-1">User bisa mengubah password setelah login pertama kali</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Role / Peran</label>
                    <select value={uRole} onChange={e => setURole(e.target.value as UserRole)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 cursor-pointer">
                      <option value="admin">Administrator (Admin)</option>
                      <option value="user">User (Pemustaka)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Keanggotaan</label>
                    <select value={uBadge} onChange={e => setUBadge(e.target.value as any)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 cursor-pointer">
                      <option value="Reguler">Reguler</option>
                      <option value="Premium">Premium ⭐</option>
                    </select>
                  </div>
                </div>
                {(String(uRole).toLowerCase() === 'user' || uRole === UserRole.USER) ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">NIK / No. Identitas</label>
                      <input type="text" placeholder="35150xxxxxxxxxxx" value={uNisn} onChange={e => setUNisn(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Kategori Pemustaka</label>
                      <input type="text" placeholder="Masyarakat Umum / Pelajar" value={uClass} onChange={e => setUClass(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">NIP / Identitas Admin</label>
                    <input type="text" placeholder="NIP" value={uNip} onChange={e => setUNip(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">No. Telepon / WhatsApp</label>
                  <input type="text" placeholder="08xxxxxxxxxx" value={uPhone} onChange={e => setUPhone(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Foto Profil / URL Avatar</label>
                  <div className="flex items-center gap-3">
                    {uAvatarUrl ? (
                      <img src={uAvatarUrl} alt="Preview" className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0 text-[10px]">
                        Foto
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="URL foto / avatar (https://...)"
                      value={uAvatarUrl}
                      onChange={e => setUAvatarUrl(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

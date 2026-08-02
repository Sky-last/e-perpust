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
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Shield,
  Coins,
  FileSpreadsheet,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronDown,
  BarChart3,
  Activity,
  Package,
  UserCheck,
  Bell,
  Calendar,
  RefreshCw,
  Menu
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, UserRole } from '../../types';
import Book3D from '../Book3D';

interface StaffDashboardProps {
  currentUser: User;
  onLogout: () => void;
  books: Book[];
  categories: Category[];
  borrowings: Borrowing[];
  users: User[];
  settings: LibrarySettings;
  onAddBook: (book: Omit<Book, 'status' | 'category' | 'description' | 'rating' | 'coverColor'> & { status?: Book['status'], category?: string, description?: string, rating?: number, coverColor?: string }) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onVerifyBorrow: (borrowingId: string, approve: boolean) => void;
  onVerifyReturn: (borrowingId: string, approve: boolean) => void;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  onAddUser: (newUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateSettings: (newSettings: LibrarySettings) => void;
  onPayFine: (borrowingId: string) => void;
}

export default function StaffDashboard({
  currentUser,
  onLogout,
  books,
  categories,
  borrowings,
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
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'books' | 'categories' | 'transactions' | 'users' | 'reports' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Responsive resize trigger state
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Modals / Editors states
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New Book Form
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookYear, setBookYear] = useState(2026);
  const [bookCategoryId, setBookCategoryId] = useState('');
  const [bookRack, setBookRack] = useState('');
  const [bookStock, setBookStock] = useState(1);
  const [bookSynopsis, setBookSynopsis] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');

  // New Category Form
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // New User Form
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<UserRole>(UserRole.SISWA);
  const [uNisn, setUNisn] = useState('');
  const [uNip, setUNip] = useState('');
  const [uClass, setUClass] = useState('X MIPA 1');
  const [uPhone, setUPhone] = useState('');

  // Settings local state
  const [localMaxDays, setLocalMaxDays] = useState(settings.maxBorrowDays);
  const [localMaxBooks, setLocalMaxBooks] = useState(settings.maxBorrowBooks);
  const [localFinePerDay, setLocalFinePerDay] = useState(settings.finePerDay);

  // Transactions filter state
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'overdue' | 'returned'>('all');

  // Statistics calculations
  const totalBooks = books.reduce((sum, b) => sum + (b.totalStock ?? b.stock), 0);
  const availableBooks = books.reduce((sum, b) => sum + b.stock, 0);
  const activeLoans = borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').length;
  const pendingApprovals = borrowings.filter(b => b.status === 'pending').length;
  const overdueLoansCount = borrowings.filter(b => b.status === 'overdue').length;
  const totalCollectedFines = borrowings.filter(b => b.finePaid).reduce((sum, b) => sum + (b.fineAmount ?? 0), 0);
  const totalMembers = users.filter(u => u.role === UserRole.SISWA).length;
  const returnedBooks = borrowings.filter(b => b.status === 'returned').length;
  const rejectedRequests = borrowings.filter(b => b.status === 'rejected').length;
  
  // Track window resizing for responsive canvas redrawing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas drawing for analytics chart
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = chartRef.current;
    
    // Clear and match visual container bounds
    const containerWidth = canvas.parentElement?.offsetWidth || canvas.offsetWidth || 500;
    canvas.width = containerWidth * 2; // high-dpi density resolution
    canvas.height = 480; 
    canvas.style.width = '100%';
    canvas.style.height = '240px';
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, containerWidth, 240);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
    const borrowData = [45, 52, 48, 65, 58, 72, activeLoans];
    const returnData = [42, 49, 51, 60, 55, 68, returnedBooks];
    
    const maxValue = Math.max(...borrowData, ...returnData) + 15;
    const padding = 45;
    const chartHeight = 240 - padding * 2;
    const chartWidth = containerWidth - padding * 2;
    const stepX = chartWidth / (months.length - 1);

    // Draw beautiful dashed gridlines & Y-axis labels
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(containerWidth - padding, y);
      ctx.stroke();

      // Y-axis value
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 10px Poppins, sans-serif';
      ctx.textAlign = 'right';
      const labelVal = Math.round(maxValue - (maxValue / 4) * i);
      ctx.fillText(String(labelVal), padding - 10, y + 3.5);
    }
    ctx.setLineDash([]); // Reset dashed state

    // Helper: Map data coordinate arrays
    const getCoordinates = (dataList: number[]) => {
      return dataList.map((val, idx) => ({
        x: padding + stepX * idx,
        y: padding + chartHeight - (val / maxValue) * chartHeight
      }));
    };

    const borrowPoints = getCoordinates(borrowData);
    const returnPoints = getCoordinates(returnData);

    // Draw curve function using cubic Bezier interpolation
    const drawAreaCurve = (
      points: { x: number; y: number }[],
      strokeColor: string,
      fillColorStart: string,
      fillColorEnd: string
    ) => {
      if (points.length === 0) return;

      // 1. Draw gradient area fill
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

      // 2. Draw curved stroke line
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

      // 3. Draw dot markers
      points.forEach((pt) => {
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Draw datasets
    drawAreaCurve(borrowPoints, '#3B82F6', 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.01)');
    drawAreaCurve(returnPoints, '#10B981', 'rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.01)');

    // Draw X-axis labels
    ctx.fillStyle = '#64748B';
    ctx.font = '600 11px Poppins, sans-serif';
    ctx.textAlign = 'center';
    months.forEach((month, idx) => {
      const x = padding + stepX * idx;
      ctx.fillText(month, x, 240 - padding + 22);
    });
  }, [activeLoans, returnedBooks, windowWidth, sidebarCollapsed, activeMenu]);

  // Filter lists based on search
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
    return users.find(u => u.id === uid)?.name || 'Siswa';
  };

  const handleOpenBookModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      setBookTitle(book.title);
      setBookAuthor(book.author);
      setBookPublisher(book.publisher);
      setBookIsbn(book.isbn);
      setBookYear(book.year);
      setBookCategoryId(book.categoryId ?? '');
      setBookRack(book.rackLocation ?? '');
      setBookStock(book.totalStock ?? book.stock);
      setBookSynopsis(book.synopsis ?? book.description ?? '');
      setBookCoverUrl(book.coverUrl ?? '');
    } else {
      setEditingBook(null);
      setBookTitle('');
      setBookAuthor('');
      setBookPublisher('');
      setBookIsbn('');
      setBookYear(2026);
      setBookCategoryId(categories[0]?.id || '');
      setBookRack('');
      setBookStock(1);
      setBookSynopsis('');
      setBookCoverUrl('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400');
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
        rackLocation: bookRack,
        totalStock: bookStock,
        stock: bookStock - ((editingBook.totalStock ?? bookStock) - (editingBook.stock ?? bookStock)), // maintain borrowed count
        synopsis: bookSynopsis,
        coverUrl: bookCoverUrl
      });
    } else {
      onAddBook({
        id: `book-${Date.now()}`,
        title: bookTitle,
        author: bookAuthor,
        category: categories.find(c => c.id === bookCategoryId)?.name || '',
        description: bookSynopsis,
        publisher: bookPublisher,
        isbn: bookIsbn,
        year: bookYear,
        rating: 0,
        status: 'Tersedia',
        coverColor: 'from-blue-600 to-indigo-900',
        categoryId: bookCategoryId,
        rackLocation: bookRack,
        stock: bookStock,
        totalStock: bookStock,
        synopsis: bookSynopsis,
        coverUrl: bookCoverUrl
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
      setUEmail(user.email);
      setURole(user.role as UserRole);
      setUNisn(user.nisn || '');
      setUNip(user.nip || '');
      setUClass(user.class || 'X MIPA 1');
      setUPhone(user.phone || '');
    } else {
      setEditingUser(null);
      setUName('');
      setUEmail('');
      setURole(UserRole.SISWA);
      setUNisn('');
      setUNip('');
      setUClass('X MIPA 1');
      setUPhone('');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, {
        name: uName,
        email: uEmail,
        role: uRole,
        nisn: uRole === UserRole.SISWA ? uNisn : undefined,
        nip: uRole !== UserRole.SISWA ? uNip : undefined,
        class: uRole === UserRole.SISWA ? uClass : undefined,
        phone: uPhone
      });
    } else {
      onAddUser({
        id: `user-${Date.now()}`,
        email: uEmail,
        name: uName,
        role: uRole,
        nisn: uRole === UserRole.SISWA ? uNisn : undefined,
        nip: uRole !== UserRole.SISWA ? uNip : undefined,
        class: uRole === UserRole.SISWA ? uClass : undefined,
        phone: uPhone,
        status: 'active',
        avatarUrl: uRole === UserRole.SISWA 
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        favorites: [],
        borrowings: []
      });
    }
    setIsUserModalOpen(false);
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      maxBorrowDays: localMaxDays,
      maxBorrowBooks: localMaxBooks,
      finePerDay: localFinePerDay
    });
    alert('Konfigurasi pengaturan perpustakaan diperbarui!');
  };

  // Helper function to render Dashboard content
  const renderDashboardContent = () => {
    return (
      <div className="space-y-6">
        {/* Hero Stats Grid - Elegant Custom Border Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Books */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:shadow-blue-500/5 hover:border-blue-500/40 transition-all duration-300"
          >
            {/* Soft decorative background radial glow */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50/80 rounded-xl text-blue-600 border border-blue-100/50">
                <Package className="w-5.5 h-5.5" />
              </div>
              <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Koleksi Buku</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalBooks}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Status Ketersediaan</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{availableBooks} Buku</span>
            </div>
          </motion.div>

          {/* Card 2: Active Loans */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
          >
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50/80 rounded-xl text-emerald-600 border border-emerald-100/50">
                <ArrowLeftRight className="w-5.5 h-5.5" />
              </div>
              <Activity className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Peminjaman Aktif</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeLoans}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Keterlambatan</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md ${overdueLoansCount > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                {overdueLoansCount} Siswa
              </span>
            </div>
          </motion.div>

          {/* Card 3: Pending Approvals */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:shadow-amber-500/5 hover:border-amber-500/40 transition-all duration-300"
          >
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50/80 rounded-xl text-amber-600 border border-amber-100/50">
                <Clock className="w-5.5 h-5.5" />
              </div>
              {pendingApprovals > 0 && <Bell className="w-4.5 h-4.5 text-amber-500 animate-bounce" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Menunggu Approval</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingApprovals}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verifikasi Berkas</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md ${pendingApprovals > 0 ? 'text-amber-600 bg-amber-50 animate-pulse' : 'text-slate-500 bg-slate-50'}`}>
                {pendingApprovals > 0 ? 'Perlu Respon' : 'Selesai'}
              </span>
            </div>
          </motion.div>

          {/* Card 4: Total Fines */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:shadow-rose-500/5 hover:border-rose-500/40 transition-all duration-300"
          >
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-50/80 rounded-xl text-rose-600 border border-rose-100/50">
                <Coins className="w-5.5 h-5.5" />
              </div>
              <BarChart3 className="w-4.5 h-4.5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kas Denda Terbayar</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Rp {(totalCollectedFines / 1000).toFixed(0)}K</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Akumulasi Denda</span>
              <span className="font-semibold text-rose-650 bg-rose-50 px-2 py-0.5 rounded-md">Rp {totalCollectedFines.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Analytics Chart & Quick Stats Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elegant Chart Section */}
          <div className="lg:col-span-2 bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-md font-bold text-slate-950 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Tren Aktivitas Peminjaman & Pengembalian
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Data representasi kumulatif 7 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-600">Peminjaman</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Pengembalian</span>
                </div>
              </div>
            </div>
            
            <div className="relative w-full h-[240px] bg-slate-50/20 border border-slate-100 rounded-2xl p-2">
              <canvas ref={chartRef} className="w-full h-full" />
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Members Card */}
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Anggota Terdaftar</h4>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1.5">{totalMembers}</p>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">Akun siswa aktif bersertifikat perpustakaan</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 bg-indigo-50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalMembers / 150) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-indigo-600">{Math.round((totalMembers / 150) * 100)}%</span>
              </div>
            </div>

            {/* Return Rate Card */}
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Pengembalian</h4>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1.5">
                    {borrowings.length > 0 ? Math.round((returnedBooks / borrowings.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">{returnedBooks} sukses diselesaikan dari {borrowings.length} peminjaman</p>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">Sukses: <strong className="text-slate-800">{returnedBooks}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-500">Ditolak: <strong className="text-slate-800">{rejectedRequests}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table - Beautiful Slate styling */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-white/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Aktivitas Peminjaman Terkini
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Daftar verifikasi transaksi sirkulasi aktif</p>
            </div>
            <button 
              onClick={() => setActiveMenu('transactions')} 
              className="px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 rounded-xl border border-blue-100/60 transition-all cursor-pointer self-start sm:self-auto"
            >
              Kelola Semua Sirkulasi ?
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150">
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Nama Siswa</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Judul Buku</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Tgl Pinjam</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Status Denda</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs text-right uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').slice(0, 5).map((b) => {
                  const studentName = getUserName(b.studentId ?? '');
                  const bookObj = books.find(x => x.id === b.bookId);
                  const bookTitleName = bookObj?.title || 'Buku';
                  const isOverdue = b.status === 'overdue';
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {studentName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {b.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 max-w-[240px]">
                        <p className="font-semibold text-slate-900 text-sm truncate">{bookTitleName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">ISBN: {bookObj?.isbn || '-'}</p>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium text-xs">{b.borrowDate}</td>
                      <td className="py-3.5 px-6">
                        <span className={`font-bold text-xs ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                          {b.dueDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-250">
                            <AlertCircle className="w-3 h-3" />
                            Terlambat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-250">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif Pinjam
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => onVerifyReturn(b.id, true)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm hover:shadow transition-all opacity-90 lg:opacity-0 group-hover:opacity-100"
                        >
                          Kembalikan
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-400">Belum ada sirkulasi peminjaman aktif saat ini.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render Books content
  const renderBooksContent = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Kelola Koleksi Buku
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Gudang penyimpanan dan modifikasi metadata buku</p>
        </div>
        <button
          onClick={() => handleOpenBookModal(null)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Buku Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul, penulis, nomor ISBN, atau rak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl border border-white/30 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-350 transition-all duration-300"
          >
            {/* Book Cover */}
            <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4">
              <Book3D book={book} size="sm" />
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-extrabold text-slate-700 shadow-sm border border-slate-100 z-10">
                Stok: {book.stock} / {book.totalStock ?? book.stock}
              </div>
            </div>

            {/* Book Details */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100/50 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                  {getCategoryName(book.categoryId)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-2 leading-snug">{book.title}</h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Oleh: {book.author}</p>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 py-1.5 border-y border-slate-50">
                  <span className="flex items-center gap-1">
                    Rak: <strong className="text-slate-800 font-mono">{book.rackLocation || 'N/A'}</strong>
                  </span>
                  <span>Tahun: <strong className="text-slate-800 font-mono">{book.year}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenBookModal(book)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus buku "${book.title}"?`)) {
                        onDeleteBook(book.id);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-12 border border-white/30 shadow-sm text-center">
          <BookOpen className="w-14 h-14 text-slate-250 mx-auto mb-4" />
          <h3 className="text-md font-bold text-slate-800 mb-1.5">Buku tidak ditemukan</h3>
          <p className="text-xs text-slate-400 font-medium">
            {searchQuery ? 'Gunakan kata kunci pencarian yang lain' : 'Perpustakaan belum memiliki koleksi buku'}
          </p>
        </div>
      )}
    </div>
  );

  // Helper function to render Categories content
  const renderCategoriesContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FolderClosed className="w-6 h-6 text-blue-600" />
            Klasifikasi Kategori
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Pembagian katalog genre buku perpustakaan</p>
        </div>
        <button
          onClick={() => handleOpenCategoryModal(null)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori Baru
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const bookCount = books.filter(b => b.categoryId === cat.id).length;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <FolderClosed className="w-5.5 h-5.5" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-650 rounded-lg text-xs font-bold">
                    {bookCount} Koleksi
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">{cat.description}</p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-50">
                <button
                  onClick={() => handleOpenCategoryModal(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (bookCount > 0) {
                      alert(`Tidak bisa menghapus kategori yang masih memiliki ${bookCount} buku!`);
                      return;
                    }
                    if (window.confirm(`Hapus kategori "${cat.name}"?`)) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Helper function to render Transactions content  
  const renderTransactionsContent = () => {
    const filteredTransactions = borrowings.filter(b => {
      if (filterStatus === 'all') return true;
      return b.status === filterStatus;
    });

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-250">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>;
        case 'approved':
          return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-250">
            <CheckCircle2 className="w-3 h-3" />
            Aktif Pinjam
          </span>;
        case 'overdue':
          return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-250 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Terlambat
          </span>;
        case 'returned':
          return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-250">
            <CheckCircle2 className="w-3 h-3" />
            Kembali
          </span>;
        case 'rejected':
          return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>;
        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            Daftar Sirkulasi Transaksi
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Verifikasi pengajuan peminjaman dan pengembalian sirkulasi buku</p>
        </div>

        {/* Filter Tabs - Premium Pill Bar */}
        <div className="bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/40 inline-flex flex-wrap gap-1">
          {[
            { value: 'all', label: 'Semua', count: borrowings.length },
            { value: 'pending', label: 'Menunggu', count: pendingApprovals },
            { value: 'approved', label: 'Aktif', count: activeLoans },
            { value: 'overdue', label: 'Terlambat', count: overdueLoansCount },
            { value: 'returned', label: 'Kembali', count: returnedBooks }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === filter.value
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {filter.label} <span className="opacity-60">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-white/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150">
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">ID</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Anggota</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Buku Terpinjam</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Tgl Pinjam</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Kas Denda</th>
                  <th className="py-3.5 px-6 font-bold text-slate-500 text-xs text-right uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((b) => {
                  const student = users.find(u => u.id === b.studentId);
                  const book = books.find(bk => bk.id === b.bookId);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-semibold text-slate-500">{b.id.substring(0, 8)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{student?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{student?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-[200px]">
                        <p className="font-semibold text-slate-900 text-sm truncate">{book?.title || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Author: {book?.author}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-650 font-medium text-xs">{b.borrowDate}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold ${b.status === 'overdue' ? 'text-rose-600' : 'text-slate-650'}`}>
                          {b.dueDate}
                        </span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(b.status)}</td>
                      <td className="py-4 px-6">
                        {b.fineAmount && b.fineAmount > 0 ? (
                          <div>
                            <p className="font-extrabold text-rose-600 text-sm">Rp {b.fineAmount.toLocaleString()}</p>
                            {b.finePaid && <p className="text-[9px] font-bold text-emerald-600 mt-0.5">? PAID / Lunas</p>}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => onVerifyBorrow(b.id, true)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-all"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => onVerifyBorrow(b.id, false)}
                                className="px-3.5 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-all"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {(b.status === 'approved' || b.status === 'overdue') && (
                            <button
                              onClick={() => onVerifyReturn(b.id, true)}
                              className="px-3.5 py-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-all"
                            >
                              Kembalikan
                            </button>
                          )}
                          {b.status === 'returned' && (
                            <span className="text-xs font-bold text-slate-400 mr-2">Selesai</span>
                          )}
                          {b.status === 'rejected' && (
                            <span className="text-xs font-bold text-slate-400 mr-2">Ditolak</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <ArrowLeftRight className="w-14 h-14 text-slate-250 mx-auto mb-4" />
                      <h3 className="text-md font-bold text-slate-800 mb-1">Transaksi tidak ditemukan</h3>
                      <p className="text-xs text-slate-400 font-medium">Tidak ada data sirkulasi untuk kategori status ini</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render Users content
  const renderUsersContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Kelola Anggota & Staff
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Registrasi data otorisasi dan profil civitas sekolah</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenUserModal(null)}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Daftarkan User Baru
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari anggota berdasarkan nama lengkap, email, NISN siswa, atau NIP pegawai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-white/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-150">
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Identitas Pengguna</th>
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Hak Akses (Role)</th>
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">NISN / NIP</th>
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Kelas / Unit Kerja</th>
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Status Akun</th>
                <th className="py-3.5 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Buku Dipinjam</th>
                {isAdmin && <th className="py-3.5 px-6 font-bold text-slate-500 text-xs text-right uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const userBorrowings = borrowings.filter(b => b.studentId === user.id && (b.status === 'approved' || b.status === 'overdue'));
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                        user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-200/50' :
                        user.role === UserRole.PETUGAS ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-slate-650">
                        {user.nisn || user.nip || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium text-xs">
                      {user.class || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-950 text-sm">{userBorrowings.length}</span>
                      <span className="text-xs text-slate-400 font-medium"> / {settings.maxBorrowBooks} Buku</span>
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenUserModal(user)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold cursor-pointer transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (user.id === currentUser.id) {
                                alert('Tidak bisa menghapus akun sendiri!');
                                return;
                              }
                              if (window.confirm(`Hapus pengguna "${user.name}"?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold cursor-pointer transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <Users className="w-12 h-12 text-slate-250 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-400">Tidak ada anggota yang sesuai filter pencarian.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Helper function to render Reports content
  const renderReportsContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          Laporan & Statistik Kumulatif
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">Ekstraksi berkas sirkulasi dan rekapitulasi data perpustakaan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-tr from-slate-800 to-slate-950 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[110px]">
          <Package className="w-6 h-6 opacity-60 self-end" />
          <div>
            <p className="text-[10px] opacity-75 font-bold uppercase tracking-wider">Total Koleksi Buku</p>
            <p className="text-2xl font-extrabold mt-1">{totalBooks} Buku</p>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[110px]">
          <Users className="w-6 h-6 opacity-60 self-end" />
          <div>
            <p className="text-[10px] opacity-75 font-bold uppercase tracking-wider">Total Anggota Siswa</p>
            <p className="text-2xl font-extrabold mt-1">{totalMembers} Orang</p>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-850 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[110px]">
          <ArrowLeftRight className="w-6 h-6 opacity-60 self-end" />
          <div>
            <p className="text-[10px] opacity-75 font-bold uppercase tracking-wider">Total Transaksi Sirkulasi</p>
            <p className="text-2xl font-extrabold mt-1">{borrowings.length} Kali</p>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-rose-600 to-red-800 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[110px]">
          <Coins className="w-6 h-6 opacity-60 self-end" />
          <div>
            <p className="text-[10px] opacity-75 font-bold uppercase tracking-wider">Kas Denda Terkumpul</p>
            <p className="text-2xl font-extrabold mt-1">Rp {totalCollectedFines.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrowing Stats */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Statistik Status Sirkulasi
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Peminjaman Berjalan</span>
              <span className="text-sm font-extrabold text-slate-800">{activeLoans} Buku</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Menunggu Persetujuan</span>
              <span className="text-sm font-extrabold text-amber-600">{pendingApprovals} Pengajuan</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Sirkulasi Keterlambatan</span>
              <span className="text-sm font-extrabold text-rose-650">{overdueLoansCount} Buku</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Sukses Dikembalikan</span>
              <span className="text-sm font-extrabold text-emerald-600">{returnedBooks} Buku</span>
            </div>
          </div>
        </div>

        {/* Top Books */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Buku Favorit & Paling Diminati
          </h3>
          <div className="space-y-2.5">
            {books.slice(0, 4).map((book, idx) => (
              <div key={book.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100/50">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-xs shadow-xs border border-blue-100/50 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{book.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Oleh: {book.author}</p>
                </div>
                <span className="text-[10px] font-extrabold text-slate-650 bg-slate-200/50 px-2 py-0.5 rounded-md font-mono">
                  {book.totalStock ?? book.stock} Pcs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-sm text-center max-w-xl mx-auto">
        <Download className="w-12 h-12 text-slate-250 mx-auto mb-3" />
        <h3 className="text-md font-bold text-slate-900 mb-1">Cetak Dokumen Sirkulasi</h3>
        <p className="text-xs text-slate-400 font-medium mb-4">Export tabel laporan sirkulasi saat ini ke format berkas digital (.xlsx / .pdf)</p>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer">
          <Download className="w-4 h-4 inline mr-1.5" />
          Download Rekap Laporan
        </button>
      </div>
    </div>
  );

  // Helper function to render Settings content
  const renderSettingsContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-600" />
          Pengaturan Aturan Perpustakaan
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">Konfigurasi batas sirkulasi peminjaman siswa</p>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Aturan Main Sirkulasi</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Maksimal Tenggat Waktu Pinjam (Hari)
              </label>
              <input
                type="number"
                min="1"
                value={localMaxDays}
                onChange={(e) => setLocalMaxDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Batas jatuh tempo peminjaman untuk kategori umum</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Batas Jumlah Peminjaman Buku Maksimal
              </label>
              <input
                type="number"
                min="1"
                value={localMaxBooks}
                onChange={(e) => setLocalMaxBooks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Batas kuota jumlah peminjaman buku aktif per siswa</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Besar Nominal Denda per Hari (Rupiah)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={localFinePerDay}
                onChange={(e) => setLocalFinePerDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Tarif denda keterlambatan pengembalian buku: Rp {localFinePerDay.toLocaleString()} / hari</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleSaveSettings}
                className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Terapkan Konfigurasi Aturan
              </button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-sm self-start space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Status Aplikasi</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 font-medium">
              <span className="text-slate-500">Versi Rilis</span>
              <span className="font-extrabold text-slate-800">v1.1.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 font-medium">
              <span className="text-slate-500">Total User Terdaftar</span>
              <span className="font-extrabold text-slate-800">{users.length} Account</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 font-medium">
              <span className="text-slate-500">Koleksi Buku</span>
              <span className="font-extrabold text-slate-800">{books.length} Judul</span>
            </div>
            <div className="flex justify-between py-1 font-medium">
              <span className="text-slate-500">Kategori Genre</span>
              <span className="font-extrabold text-slate-800">{categories.length} Klasifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to render content based on active menu
  const renderContentByMenu = () => {
    switch(activeMenu) {
      case 'dashboard':
        return renderDashboardContent();
      case 'books':
        return renderBooksContent();
      case 'categories':
        return renderCategoriesContent();
      case 'transactions':
        return renderTransactionsContent();
      case 'users':
        return renderUsersContent();
      case 'reports':
        return renderReportsContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex text-slate-900 overflow-hidden font-sans relative" id="staff-dashboard">
      
      {/* Animated Background Pattern Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Gradient Orbs - Animated */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Diagonal Lines Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="40" y2="40" stroke="#3B82F6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
        
        {/* Book Icons Pattern (Very Subtle) */}
        <div className="absolute inset-0 opacity-[0.015]">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${(i * 13 + 10) % 90}%`,
                left: `${(i * 17 + 5) % 90}%`,
                transform: `rotate(${(i * 23) % 360}deg)`
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
      
      {/* MODERN SIDEBAR NAVIGATION - With Backdrop Blur */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/90 backdrop-blur-xl border-r border-white/30 shrink-0 hidden lg:flex flex-col shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-hidden z-20 relative`}>
        {/* Subtle gradient overlay for sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-indigo-50/20 pointer-events-none" />
        {/* Logo Brand with Animation */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          {!sidebarCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 flex-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black text-white tracking-wider uppercase truncate">Staff Panel</h2>
                <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest">{currentUser.role}</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-all cursor-pointer shrink-0 hidden sm:block"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </motion.div>
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
              { id: 'books', label: 'Kelola Buku', icon: BookOpen, badge: null },
              { id: 'categories', label: 'Klasifikasi Kategori', icon: FolderClosed, badge: null },
              { id: 'transactions', label: 'Transaksi Sirkulasi', icon: ArrowLeftRight, badge: pendingApprovals },
              { id: 'users', label: 'Anggota & Staff', icon: Users, badge: null },
              { id: 'reports', label: 'Laporan & Chart', icon: FileSpreadsheet, badge: null },
              ...(isAdmin ? [{ id: 'settings' as const, label: 'Aturan Sistem', icon: Settings, badge: null }] : [])
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500 text-slate-900 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && item.badge !== null && item.badge > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Details - Fixed */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 p-2.5 bg-slate-800/30 rounded-xl border border-slate-850">
              <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{currentUser.email}</p>
              </div>
            </div>
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
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
            />
            
            {/* Sliding Mobile Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Header inside drawer */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white uppercase tracking-wider">Staff Panel</h2>
                    <span className="text-[9px] text-blue-400 font-extrabold uppercase">{currentUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside drawer */}
              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
                  { id: 'books', label: 'Kelola Buku', icon: BookOpen, badge: null },
                  { id: 'categories', label: 'Klasifikasi Kategori', icon: FolderClosed, badge: null },
                  { id: 'transactions', label: 'Transaksi Sirkulasi', icon: ArrowLeftRight, badge: pendingApprovals },
                  { id: 'users', label: 'Anggota & Staff', icon: Users, badge: null },
                  { id: 'reports', label: 'Laporan & Chart', icon: FileSpreadsheet, badge: null },
                  ...(isAdmin ? [{ id: 'settings' as const, label: 'Aturan Sistem', icon: Settings, badge: null }] : [])
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id as any);
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
                      {item.badge !== null && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500 text-slate-900 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer info */}
              <div className="p-5 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 p-2.5 bg-slate-800/30 rounded-xl border border-slate-850">
                  <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Glassmorphic Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 lg:px-8 py-3.5 lg:py-4.5 flex justify-between items-center sticky top-0 z-10 shadow-xs shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Burger toggler */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-650 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            <div>
              <h1 className="text-base lg:text-lg font-black text-slate-900 flex items-center gap-2">
                {activeMenu === 'dashboard' && <LayoutDashboard className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'books' && <BookOpen className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'categories' && <FolderClosed className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'transactions' && <ArrowLeftRight className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'users' && <Users className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'reports' && <FileSpreadsheet className="w-5 h-5 text-blue-600" />}
                {activeMenu === 'settings' && <Settings className="w-5 h-5 text-blue-600" />}
                <span>
                  {activeMenu === 'dashboard' && 'Dashboard Analitis'}
                  {activeMenu === 'books' && 'Katalog Buku'}
                  {activeMenu === 'categories' && 'Klasifikasi Kategori'}
                  {activeMenu === 'transactions' && 'Sirkulasi Transaksi'}
                  {activeMenu === 'users' && 'Daftar Anggota'}
                  {activeMenu === 'reports' && 'Laporan Statistik'}
                  {activeMenu === 'settings' && 'Aturan Sistem'}
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Quick Status pills - hidden on mobile */}
            <div className="hidden xl:flex items-center gap-2.5">
              <div className="px-3.5 py-1.5 bg-blue-50/70 rounded-xl border border-blue-100/50 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-extrabold text-blue-700">{activeLoans} Sirkulasi</span>
              </div>
              {pendingApprovals > 0 && (
                <div className="px-3.5 py-1.5 bg-amber-50/70 rounded-xl border border-amber-100/50 flex items-center gap-2 animate-pulse">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] font-extrabold text-amber-700">{pendingApprovals} Tertunda</span>
                </div>
              )}
            </div>

            {/* Refresh Button with Spinner Animation */}
            <button 
              onClick={() => window.location.reload()}
              className="p-2 lg:p-2.5 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer group"
              title="Refresh Halaman"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* User Badge Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-slate-650" />
              <span className="text-xs font-extrabold text-slate-700">{currentUser.name}</span>
            </div>

            {/* Logout Shortcut for mobile layout */}
            <button
              onClick={onLogout}
              className="lg:hidden p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable canvas wrapper */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto">{renderContentByMenu()}</div>
        </div>
      </main>

      {/* POPUP MODAL: KELOLA BUKU FORM */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-1">{editingBook ? 'Modifikasi Data Buku' : 'Tambah Buku Baru'}</h3>
              <p className="text-xs text-slate-400 mb-5 font-semibold">Tulis data deskripsi metadata buku di bawah ini.</p>

              <form onSubmit={handleSaveBookSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Judul Buku</label>
                    <input
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Laskar Pelangi"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Pengarang / Penulis</label>
                    <input
                      type="text"
                      required
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="Andrea Hirata"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Penerbit</label>
                    <input
                      type="text"
                      required
                      value={bookPublisher}
                      onChange={(e) => setBookPublisher(e.target.value)}
                      placeholder="Bentang Pustaka"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">ISBN</label>
                    <input
                      type="text"
                      required
                      value={bookIsbn}
                      onChange={(e) => setBookIsbn(e.target.value)}
                      placeholder="978-979-XXX-X"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Tahun Terbit</label>
                    <input
                      type="number"
                      required
                      value={bookYear}
                      onChange={(e) => setBookYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Kategori Buku</label>
                    <select
                      value={bookCategoryId}
                      onChange={(e) => setBookCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-805 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Lokasi Rak</label>
                    <input
                      type="text"
                      required
                      value={bookRack}
                      onChange={(e) => setBookRack(e.target.value)}
                      placeholder="A-1"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Jumlah Stok</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bookStock}
                      onChange={(e) => setBookStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5 uppercase">URL Cover Depan Buku</label>
                  <input
                    type="url"
                    value={bookCoverUrl}
                    onChange={(e) => setBookCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5 uppercase">Sinopsis Buku</label>
                  <textarea
                    rows={4}
                    value={bookSynopsis}
                    onChange={(e) => setBookSynopsis(e.target.value)}
                    placeholder="Masukkan ringkasan sinopsis singkat..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    Simpan Informasi Buku
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-6 max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-1">{editingCategory ? 'Edit Kategori Buku' : 'Tambah Kategori Baru'}</h3>
              <p className="text-xs text-slate-400 mb-5 font-semibold">Tentukan genre sub-klasifikasi buku perpustakaan.</p>

              <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs font-semibold text-slate-750">
                <div>
                  <label className="block text-slate-500 font-bold mb-1.5 uppercase">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Sains Fiksi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5 uppercase">Deskripsi Ringkas</label>
                  <textarea
                    rows={3}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Genre buku cerita fiktif bertema teknologi..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    Simpan Kategori
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: KELOLA PENGGUNA FORM (ADMIN ONLY) */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-6 max-w-lg w-full max-h-[95vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-1">{editingUser ? 'Edit Data Pengguna' : 'Tambah Anggota Baru'}</h3>
              <p className="text-xs text-slate-400 mb-5 font-semibold">Tentukan hak akses otorisasi log-in sistem perpustakaan.</p>

              <form onSubmit={handleSaveUserSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={uName}
                      onChange={(e) => setUName(e.target.value)}
                      placeholder="Budi Laksono"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={uEmail}
                      onChange={(e) => setUEmail(e.target.value)}
                      placeholder="budi@perpus.sch.id"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Hak Akses (Role)</label>
                    <select
                      value={uRole}
                      onChange={(e) => setURole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    >
                      <option value={UserRole.SISWA}>Siswa</option>
                      <option value={UserRole.PETUGAS}>Petugas</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">Nomor HP</label>
                    <input
                      type="text"
                      required
                      value={uPhone}
                      onChange={(e) => setUPhone(e.target.value)}
                      placeholder="0812XXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  {uRole === UserRole.SISWA ? (
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Kelas Siswa</label>
                      <select
                        value={uClass}
                        onChange={(e) => setUClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                      >
                        <option value="X MIPA 1">X MIPA 1</option>
                        <option value="X IPS 1">X IPS 1</option>
                        <option value="XI MIPA 2">XI MIPA 2</option>
                        <option value="XI IPS 1">XI IPS 1</option>
                        <option value="XII MIPA 3">XII MIPA 3</option>
                        <option value="XII IPS 2">XII IPS 2</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">NIP Pegawai</label>
                      <input
                        type="text"
                        value={uNip}
                        onChange={(e) => setUNip(e.target.value)}
                        placeholder="197801... (opsional)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  )}
                </div>

                {uRole === UserRole.SISWA && (
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase">NISN Siswa</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={uNisn}
                      onChange={(e) => setUNisn(e.target.value)}
                      placeholder="007XXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  PlusCircle,
  X
} from 'lucide-react';
import { User, Book, Category, Borrowing, LibrarySettings, UserRole } from '../../types';

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
  onUpdateSettings,
  onPayFine
}: StaffDashboardProps) {
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'books' | 'categories' | 'transactions' | 'users' | 'reports' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Statistics calculations
  const totalBooks = books.reduce((sum, b) => sum + (b.totalStock ?? b.stock), 0);
  const availableBooks = books.reduce((sum, b) => sum + b.stock, 0);
  const activeLoans = borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').length;
  const pendingApprovals = borrowings.filter(b => b.status === 'pending').length;
  const overdueLoansCount = borrowings.filter(b => b.status === 'overdue').length;
  const totalCollectedFines = borrowings.filter(b => b.finePaid).reduce((sum, b) => sum + (b.fineAmount ?? 0), 0);

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

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900" id="staff-dashboard">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shrink-0 hidden md:flex shadow-xs">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 pb-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900 tracking-wider uppercase">PERPUS PANEL</h2>
              <span className="text-[9px] text-blue-600 font-bold uppercase">{currentUser.role}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Ringkasan
            </button>

            <button
              onClick={() => setActiveMenu('books')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMenu === 'books' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Kelola Buku
            </button>

            <button
              onClick={() => setActiveMenu('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMenu === 'categories' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <FolderClosed className="w-4 h-4" /> Kelola Kategori
            </button>

            <button
              onClick={() => setActiveMenu('transactions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                activeMenu === 'transactions' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" /> Verifikasi Transaksi
              {pendingApprovals > 0 && (
                <span className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[8px] font-bold bg-amber-500 text-white rounded-full">
                  {pendingApprovals}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMenu('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMenu === 'users' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <Users className="w-4 h-4" /> Kelola Anggota
            </button>

            <button
              onClick={() => setActiveMenu('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMenu === 'reports' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Laporan Transaksi
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'settings' ? 'bg-blue-600 text-white shadow-xs shadow-blue-100 font-bold' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
                }`}
              >
                <Settings className="w-4 h-4" /> Pengaturan Sistem
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Profile / Logout */}
        <div className="pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</h4>
              <span className="text-[9px] text-gray-500 block truncate">{currentUser.email}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 rounded-lg border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Panel
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto bg-gray-50">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-xs">
          <div>
            <h1 className="text-md font-bold text-gray-900 capitalize">
              {activeMenu === 'dashboard' ? 'Dashboard Utama' : `Kelola ${activeMenu}`}
            </h1>
            <p className="text-[10px] text-gray-500 mt-0.5">Sistem Pengelolaan Digital Perpustakaan SMA</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Petugas: <strong className="text-gray-800">{currentUser.name}</strong>
            </span>
            <div className="md:hidden">
              <button 
                onClick={onLogout}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 text-xs font-bold cursor-pointer transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 flex-1 space-y-6">
          
          {/* MENU 1: RINGKASAN DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards Bento Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Stok Buku Total</span>
                    <span className="text-2xl font-extrabold text-gray-900 block mt-1">{totalBooks} Pcs</span>
                    <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">{availableBooks} Tersedia</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Peminjaman Aktif</span>
                    <span className="text-2xl font-extrabold text-gray-900 block mt-1">{activeLoans} Sesi</span>
                    <span className="text-[9px] text-rose-600 block mt-0.5 font-semibold">{overdueLoansCount} Terlambat</span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Pending Persetujuan</span>
                    <span className="text-2xl font-extrabold text-gray-900 block mt-1">{pendingApprovals} Antrean</span>
                    <span className="text-[9px] text-amber-600 block mt-0.5 font-semibold">Butuh Verifikasi</span>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                    <TrendingUp className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Kas Denda Terkumpul</span>
                    <span className="text-2xl font-extrabold text-gray-900 block mt-1">Rp {totalCollectedFines.toLocaleString()}</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Dari denda keterlambatan</span>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                    <Coins className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Action Banner / Notification of pending items */}
              {pendingApprovals > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-amber-600 w-5 h-5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">Ada {pendingApprovals} Pengajuan Peminjaman Menunggu Verifikasi</h4>
                      <p className="text-[10px] text-amber-800 mt-0.5">Silakan lakukan konfirmasi di halaman verifikasi transaksi sesegera mungkin.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveMenu('transactions')}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded cursor-pointer transition-all"
                  >
                    Buka Antrean
                  </button>
                </div>
              )}

              {/* Quick Table: Active Loans Overview */}
              <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-5">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Ikhtisar Sesi Peminjaman Aktif</h3>
                  <button onClick={() => setActiveMenu('transactions')} className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-bold">
                    Lihat Semua
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                        <th className="py-2.5">Siswa</th>
                        <th>Buku</th>
                        <th>Tgl Pinjam</th>
                        <th>Tgl Jatuh Tempo</th>
                        <th>Status</th>
                        <th className="text-right">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').slice(0, 5).map((b) => {
                        const studentName = getUserName(b.studentId ?? '');
                        const bookTitleName = books.find(x => x.id === b.bookId)?.title || 'Buku';
                        return (
                          <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-medium text-gray-900">{studentName}</td>
                            <td className="truncate max-w-[150px]">{bookTitleName}</td>
                            <td>{b.borrowDate}</td>
                            <td>{b.dueDate}</td>
                            <td>
                              <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase border ${
                                b.status === 'overdue' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {b.status === 'overdue' ? 'Jatuh Tempo' : 'Dipinjam'}
                              </span>
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => onVerifyReturn(b.id, true)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer transition-all shadow-xs shadow-emerald-100"
                              >
                                Kembalikan
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MENU 2: KELOLA BUKU */}
          {activeMenu === 'books' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari judul atau ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => handleOpenBookModal(null)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-blue-100 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Buku Baru
                </button>
              </div>

              {/* Books Inventory List */}
              <div className="bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 font-semibold">
                      <tr>
                        <th className="p-3">Cover / Info Buku</th>
                        <th>Kategori</th>
                        <th>Rak</th>
                        <th>ISBN</th>
                        <th>Stok Aktif</th>
                        <th className="text-right p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img 
                              src={book.coverUrl || ''} 
                              alt={book.title} 
                              className="w-9 h-12 rounded object-cover border border-gray-200"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900 text-xs">{book.title}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">Penulis: {book.author}</p>
                              <p className="text-[9px] text-gray-400">Penerbit: {book.publisher} • {book.year}</p>
                            </div>
                          </td>
                          <td>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[9px] font-semibold border border-blue-100">
                              {getCategoryName(book.categoryId)}
                            </span>
                          </td>
                          <td className="font-mono text-blue-600 font-bold">{book.rackLocation || '-'}</td>
                          <td className="text-gray-400 font-mono text-[10px]">{book.isbn}</td>
                          <td>
                            <span className={`font-bold ${book.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {book.stock} / {book.totalStock ?? book.stock} Pcs
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleOpenBookModal(book)}
                                className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteBook(book.id)}
                                className="p-1.5 hover:bg-rose-50 rounded text-rose-600 hover:text-rose-800 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MENU 3: KELOLA KATEGORI */}
          {activeMenu === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 font-medium">Total {categories.length} kategori buku terdaftar</p>
                <button
                  onClick={() => handleOpenCategoryModal(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shadow-blue-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Kategori
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const catBooksCount = books.filter(b => b.categoryId === cat.id).length;
                  return (
                    <div key={cat.id} className="bg-white border border-gray-200 shadow-xs rounded-xl p-5 flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                        <span className="inline-block mt-3 px-2 py-0.5 text-[9px] bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">
                          {catBooksCount} Koleksi Buku
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-600 hover:text-rose-850 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MENU 4: TRANSAKSI VERIFIKASI */}
          {activeMenu === 'transactions' && (
            <div className="space-y-6">
              {/* Part 1: Pending Approvals */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-amber-600 tracking-widest">Antrean Persetujuan Peminjaman ({pendingApprovals})</h3>
                {borrowings.filter(b => b.status === 'pending').length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 bg-white rounded-xl border border-dashed border-gray-200 text-center shadow-xs">
                    Tidak ada antrean pengajuan saat ini.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {borrowings.filter(b => b.status === 'pending').map((b) => {
                      const student = users.find(u => u.id === b.studentId);
                      const book = books.find(x => x.id === b.bookId);
                      return (
                        <div key={b.id} className="bg-white border border-gray-200 shadow-xs rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                                MENUNGGU VERIFIKASI
                              </span>
                              <span className="text-[9px] text-gray-400">ID: {b.id}</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-950 mt-1.5">
                              {student?.name} <span className="text-gray-500 font-medium">({student?.class})</span>
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Buku: <strong className="text-blue-600">{book?.title}</strong> oleh {book?.author}
                            </p>
                            {b.notes && (
                              <p className="text-[10px] text-gray-500 mt-1 italic">"Catatan Siswa: {b.notes}"</p>
                            )}
                          </div>

                          <div className="flex gap-2 self-end md:self-center">
                            <button
                              onClick={() => onVerifyBorrow(b.id, false)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-rose-50 border border-gray-200 text-gray-600 hover:text-rose-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => onVerifyBorrow(b.id, true)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shadow-blue-100"
                            >
                              Setujui & Kurangi Stok
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Part 2: Active / Overdue Loans */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-extrabold uppercase text-blue-600 tracking-widest">Daftar Peminjaman Aktif / Terlambat ({activeLoans})</h3>
                {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 bg-white rounded-xl border border-dashed border-gray-200 text-center shadow-xs">
                    Tidak ada transaksi aktif terdaftar.
                  </p>
                ) : (
                  <div className="bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-700">
                        <thead className="bg-gray-50 text-gray-500 font-semibold">
                          <tr>
                            <th className="p-3">Siswa</th>
                            <th>Buku</th>
                            <th>Tgl Pinjam / Jatuh Tempo</th>
                            <th>Status / Denda</th>
                            <th className="text-right p-3">Verifikasi Kembali</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').map((b) => {
                            const student = users.find(u => u.id === b.studentId);
                            const book = books.find(x => x.id === b.bookId);
                            return (
                              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3">
                                  <h4 className="font-bold text-gray-900">{student?.name}</h4>
                                  <p className="text-[10px] text-gray-400">{student?.class}</p>
                                </td>
                                <td>
                                  <h4 className="font-bold truncate max-w-[150px] text-gray-900">{book?.title}</h4>
                                  <p className="text-[9px] text-gray-400 font-mono">ID: {b.id}</p>
                                </td>
                                <td>
                                  <p className="text-gray-700 font-medium">Pinjam: {b.borrowDate}</p>
                                  <p className="text-rose-600 font-bold">Tempo: {b.dueDate}</p>
                                </td>
                                <td>
                                  <div className="space-y-1">
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded border ${
                                      b.status === 'overdue' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                      {b.status === 'overdue' ? 'Jatuh Tempo' : 'Dipinjam'}
                                    </span>
                                    {(b.fineAmount ?? 0) > 0 && (
                                      <p className="text-[10px] text-rose-600 font-extrabold">
                                        Denda: Rp {(b.fineAmount ?? 0).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-right space-y-1.5">
                                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                    {(b.fineAmount ?? 0) > 0 && !b.finePaid && (
                                      <button
                                        onClick={() => onPayFine(b.id)}
                                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] rounded cursor-pointer transition-all"
                                      >
                                        Bayar Denda
                                      </button>
                                    )}
                                    <button
                                      onClick={() => onVerifyReturn(b.id, true)}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded cursor-pointer transition-all shadow-xs shadow-emerald-100"
                                    >
                                      Terima Kembali
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MENU 5: KELOLA ANGGOTA (ADMIN / STAFF) */}
          {activeMenu === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, NISN, NIP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleOpenUserModal(null)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-blue-100 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah Anggota / Petugas
                  </button>
                )}
              </div>

              <div className="bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 font-semibold">
                      <tr>
                        <th className="p-3">Foto / Detail Anggota</th>
                        <th>Role</th>
                        <th>Identitas (NISN / NIP)</th>
                        <th>No HP</th>
                        <th>Kelas (Siswa)</th>
                        <th>Status</th>
                        {isAdmin && <th className="text-right p-3">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img 
                              src={u.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                              alt={u.name} 
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{u.name}</h4>
                              <p className="text-[10px] text-gray-400">{u.email}</p>
                            </div>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                              u.role === UserRole.ADMIN 
                                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                : u.role === UserRole.PETUGAS 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="font-mono text-[10px] text-gray-600">
                            {u.role === UserRole.SISWA ? `NISN: ${u.nisn || '-'}` : `NIP: ${u.nip || '-'}`}
                          </td>
                          <td className="text-gray-500">{u.phone}</td>
                          <td className="font-bold text-gray-900">{u.class || '-'}</td>
                          <td>
                            <button
                              disabled={!isAdmin || u.id === currentUser.id}
                              onClick={() => {
                                onUpdateUser(u.id, { status: u.status === 'active' ? 'inactive' : 'active' });
                              }}
                              className={`px-2 py-0.5 text-[9px] font-bold rounded border cursor-pointer transition-all ${
                                u.status === 'active' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                                  : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {u.status === 'active' ? 'AKTIF' : 'NONAKTIF'}
                            </button>
                          </td>
                          {isAdmin && (
                            <td className="p-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleOpenUserModal(u)}
                                  className="p-1.5 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-700 cursor-pointer transition-all"
                                  title="Edit Anggota"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  disabled={u.id === currentUser.id}
                                  onClick={() => {
                                    if (window.confirm(`Apakah Anda yakin ingin menghapus anggota "${u.name}"?`)) {
                                      onDeleteUser(u.id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={u.id === currentUser.id ? 'Tidak bisa hapus akun sendiri' : 'Hapus Anggota'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MENU 6: LAPORAN & TRANSAKSI */}
          {activeMenu === 'reports' && (
            <div className="space-y-6">
              {/* Stat Bento Widget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Rasio Ketersediaan Buku</span>
                  <span className="text-xl font-bold text-gray-900 mt-1 block">{availableBooks} / {totalBooks} Eks</span>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-3">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${(availableBooks / totalBooks) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Rasio Buku Dipinjam</span>
                  <span className="text-xl font-bold text-gray-900 mt-1 block">
                    {borrowings.filter(b => b.status === 'approved' || b.status === 'overdue').length} Buku Aktif
                  </span>
                  <p className="text-[9px] text-gray-400 mt-2">Buku yang saat ini berada di luar perpustakaan.</p>
                </div>

                <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Jumlah Transaksi Selesai</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">
                    {borrowings.filter(b => b.status === 'returned').length} Transaksi
                  </span>
                  <p className="text-[9px] text-gray-400 mt-2">Peminjaman yang dikembalikan tanpa masalah / lunas denda.</p>
                </div>
              </div>

              {/* Transactions Log table */}
              <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-5">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Jurnal Transaksi Komprehensif</h3>
                  <button 
                    onClick={() => {
                      alert('Mengunduh Laporan Perpustakaan (Excel/PDF)... Contoh Integrasi Laporan Selesai!');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer shadow-xs shadow-blue-100 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Cetak Laporan
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 text-gray-400 font-semibold">
                      <tr>
                        <th className="p-2.5">ID Transaksi</th>
                        <th>Anggota (Siswa)</th>
                        <th>Judul Buku</th>
                        <th>Pinjam / Jatuh Tempo / Kembali</th>
                        <th>Denda</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {borrowings.map((b) => {
                        const s = users.find(u => u.id === b.studentId);
                        const bk = books.find(x => x.id === b.bookId);
                        return (
                          <tr key={b.id} className="hover:bg-gray-50/50 text-gray-700 transition-colors">
                            <td className="p-2.5 font-mono text-[10px] text-gray-400">{b.id}</td>
                            <td className="font-bold text-gray-900">{s?.name} <span className="font-medium text-gray-500">({s?.class})</span></td>
                            <td className="text-gray-800 font-medium">{bk?.title}</td>
                            <td className="text-[10px] text-gray-500">
                              Pinjam: {b.borrowDate} <br />
                              Tempo: {b.dueDate} <br />
                              {b.returnDate && <span className="text-emerald-600 font-bold">Kembali: {b.returnDate}</span>}
                            </td>
                            <td>
                              {(b.fineAmount ?? 0) > 0 ? (
                                <span className={`font-bold ${b.finePaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  Rp {(b.fineAmount ?? 0).toLocaleString()} ({b.finePaid ? 'Lunas' : 'Belum Bayar'})
                                </span>
                              ) : '-'}
                            </td>
                            <td>
                              <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded border ${
                                b.status === 'returned' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : b.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-150 animate-pulse'
                                  : b.status === 'overdue'
                                  ? 'bg-rose-50 text-rose-700 border-rose-100'
                                  : b.status === 'rejected'
                                  ? 'bg-gray-100 text-gray-400 border-gray-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {b.status === 'approved' ? 'DIPINJAM' : b.status === 'returned' ? 'SELESAI' : b.status === 'rejected' ? 'DITOLAK' : b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MENU 7: PENGATURAN PERPUSTAKAAN (ADMIN ONLY) */}
          {activeMenu === 'settings' && isAdmin && (
            <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-6 max-w-2xl">
              <h3 className="text-md font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                <Settings className="text-blue-600 w-5 h-5" />
                Konfigurasi Parameter Perpustakaan Digital SMA
              </h3>
              <p className="text-xs text-gray-500 mb-6">Atur regulasi peminjaman, durasi aktif, dan nilai denda administratif harian.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Durasi Peminjaman Maksimal</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={localMaxDays}
                        onChange={(e) => setLocalMaxDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400 font-medium">Hari</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Batas Maksimal Buku Dipinjam</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={localMaxBooks}
                        onChange={(e) => setLocalMaxBooks(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400 font-medium">Buku</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Denda Keterlambatan Harian (IDR)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold">Rp</span>
                    <input
                      type="number"
                      value={localFinePerDay}
                      onChange={(e) => setLocalFinePerDay(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-gray-400 font-medium">/ Hari</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shadow-blue-100"
                  >
                    Simpan Konfigurasi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* POPUP MODAL: KELOLA BUKU FORM */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-md font-bold text-gray-900 mb-1.5">{editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">Input metadata lengkap buku untuk disalurkan ke katalog digital.</p>

              <form onSubmit={handleSaveBookSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Judul Buku</label>
                    <input
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Laskar Pelangi"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Pengarang / Penulis</label>
                    <input
                      type="text"
                      required
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="Andrea Hirata"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Penerbit</label>
                    <input
                      type="text"
                      required
                      value={bookPublisher}
                      onChange={(e) => setBookPublisher(e.target.value)}
                      placeholder="Bentang Pustaka"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">ISBN</label>
                    <input
                      type="text"
                      required
                      value={bookIsbn}
                      onChange={(e) => setBookIsbn(e.target.value)}
                      placeholder="978-979-XXX-X"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Tahun Terbit</label>
                    <input
                      type="number"
                      required
                      value={bookYear}
                      onChange={(e) => setBookYear(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-500 font-bold mb-1">Kategori Buku</label>
                    <select
                      value={bookCategoryId}
                      onChange={(e) => setBookCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Lokasi Rak</label>
                    <input
                      type="text"
                      required
                      value={bookRack}
                      onChange={(e) => setBookRack(e.target.value)}
                      placeholder="A-1"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Jumlah Stok Buku</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bookStock}
                      onChange={(e) => setBookStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">URL Cover Buku</label>
                  <input
                    type="url"
                    value={bookCoverUrl}
                    onChange={(e) => setBookCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Sinopsis</label>
                  <textarea
                    rows={4}
                    value={bookSynopsis}
                    onChange={(e) => setBookSynopsis(e.target.value)}
                    placeholder="Masukkan ringkasan sinopsis cerita buku..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs shadow-blue-100 transition-all"
                  >
                    Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: KELOLA KATEGORI FORM */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-md font-bold text-gray-900 mb-1.5">{editingCategory ? 'Edit Kategori Buku' : 'Tambah Kategori Buku'}</h3>
              <p className="text-xs text-gray-500 mb-6 font-semibold">Buat klasifikasi sub-katalog buku baru.</p>

              <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Biologi Modern"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Deskripsi Kategori</label>
                  <textarea
                    rows={3}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Buku-buku seputar sains, pembelahan sel, genetika..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs shadow-blue-100 transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-md font-bold text-gray-900 mb-1.5">{editingUser ? 'Edit Data Pengguna' : 'Tambah Anggota / Petugas'}</h3>
              <p className="text-xs text-gray-500 mb-6 font-semibold">Kelola data login dan otorisasi akses aplikasi.</p>

              <form onSubmit={handleSaveUserSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={uName}
                      onChange={(e) => setUName(e.target.value)}
                      placeholder="Budi Laksono"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Email Pengguna</label>
                    <input
                      type="email"
                      required
                      value={uEmail}
                      onChange={(e) => setUEmail(e.target.value)}
                      placeholder="budi@perpus.sch.id"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Hak Akses (Role)</label>
                    <select
                      value={uRole}
                      onChange={(e) => setURole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
                    >
                      <option value={UserRole.SISWA}>Siswa</option>
                      <option value={UserRole.PETUGAS}>Petugas</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Nomor HP</label>
                    <input
                      type="text"
                      required
                      value={uPhone}
                      onChange={(e) => setUPhone(e.target.value)}
                      placeholder="0812XXXXXXXX"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {uRole === UserRole.SISWA ? (
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Kelas</label>
                      <select
                        value={uClass}
                        onChange={(e) => setUClass(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 focus:outline-none focus:border-blue-500"
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
                      <label className="block text-gray-500 font-bold mb-1">NIP (Pegawai)</label>
                      <input
                        type="text"
                        value={uNip}
                        onChange={(e) => setUNip(e.target.value)}
                        placeholder="197508... (opsional)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                {uRole === UserRole.SISWA && (
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">NISN (Siswa)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={uNisn}
                      onChange={(e) => setUNisn(e.target.value)}
                      placeholder="0054321098"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs shadow-blue-100 transition-all"
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

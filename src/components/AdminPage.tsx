import React, { useState } from 'react';
import { Book, User, SystemLog } from '../types';
import { Plus, Trash, Edit, Sparkles, BookOpen, Layers, Users, History, Award, Save, X, RefreshCw, LogOut } from 'lucide-react';

interface AdminPageProps {
  books: Book[];
  users: User[];
  logs: SystemLog[];
  onAddBook: (book: Omit<Book, 'id' | 'status'>) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onUpdateUserRole: (email: string, badge: 'Premium' | 'Reguler') => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onLogout?: () => void;
}

const COLOR_PRESETS = [
  'from-blue-600 to-indigo-900',
  'from-purple-700 to-indigo-950',
  'from-emerald-600 to-teal-900',
  'from-pink-500 to-rose-900',
  'from-amber-600 to-yellow-800',
  'from-red-700 to-zinc-950',
  'from-slate-800 to-neutral-950',
  'from-indigo-600 to-violet-950'
];

export default function AdminPage({
  books,
  users,
  logs,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onUpdateUserRole,
  addToast,
  onLogout
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crud' | 'users' | 'history'>('dashboard');

  // CRUD specific states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Teknologi');
  const [year, setYear] = useState<number>(2024);
  const [stock, setStock] = useState<number>(5);
  const [rating, setRating] = useState<number>(4.5);
  const [coverColor, setCoverColor] = useState(COLOR_PRESETS[0]);
  const [coverUrl, setCoverUrl] = useState('');

  // AI Cover Generation states
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Search/Filters inside Admin crud
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('Semua');

  // Stats
  const totalBooksCount = books.reduce((acc, b) => acc + b.stock, 0);
  const activeBorrowingsCount = users.reduce((acc, u) => {
    return acc + u.borrowings.filter(b => b.status === 'Sedang Dipinjam').length;
  }, 0);

  // Handle book submitting (Add/Edit)
  const handleSubmitBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !isbn || !description) {
      addToast('Judul, Penulis, ISBN, dan Sinopsis wajib diisi!', 'error');
      return;
    }

    if (isEditing) {
      const bookToUpdate: Book = {
        id: editingId,
        title,
        author,
        publisher,
        isbn,
        description,
        category,
        year: Number(year),
        rating: Number(rating),
        status: stock > 0 ? 'Tersedia' : 'Sedang Dipinjam',
        stock: Number(stock),
        coverColor,
        coverUrl: coverUrl || undefined
      };
      onEditBook(bookToUpdate);
      addToast(`Buku "${title}" berhasil diperbarui!`, 'success');
      resetForm();
    } else {
      const newBook = {
        title,
        author,
        publisher,
        isbn,
        description,
        category,
        year: Number(year),
        rating: Number(rating),
        stock: Number(stock),
        coverColor,
        coverUrl: coverUrl || undefined
      };
      onAddBook(newBook);
      addToast(`Buku "${title}" berhasil ditambahkan ke katalog!`, 'success');
      resetForm();
    }
  };

  const handleEditTrigger = (book: Book) => {
    setIsEditing(true);
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setPublisher(book.publisher);
    setIsbn(book.isbn);
    setDescription(book.description);
    setCategory(book.category);
    setYear(book.year);
    setStock(book.stock);
    setRating(book.rating);
    setCoverColor(book.coverColor);
    setCoverUrl(book.coverUrl || '');
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle local image upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
        addToast('Gambar sampul berhasil diunggah!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId('');
    setTitle('');
    setAuthor('');
    setPublisher('');
    setIsbn('');
    setDescription('');
    setCategory('Teknologi');
    setYear(2024);
    setStock(5);
    setRating(4.5);
    setCoverColor(COLOR_PRESETS[0]);
    setCoverUrl('');
    setAiPrompt('');
  };

  // AI Cover Generation triggers
  const handleGenerateAiCover = async () => {
    if (!aiPrompt) {
      addToast('Silakan isi deskripsi konsep cover AI terlebih dahulu!', 'error');
      return;
    }

    setIsGeneratingAi(true);
    addToast('Sedang merancang cover buku dengan Gemini 3.1...', 'info');

    try {
      const response = await fetch('/api/gemini/generate-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCoverUrl(data.coverUrl);
        addToast('Selesai! Cover bertenaga AI berhasil disematkan ke form.', 'success');
      } else {
        // Fallback mock base64/SVG or message
        addToast(data.warning || data.error || 'Gagal memanggil generator AI. Silakan gunakan preset gradient.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      addToast('Koneksi terputus atau API Key tidak disematkan. Menggunakan cover mockup.', 'info');
      // Mock generated cover color change
      const randColor = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)];
      setCoverColor(randColor);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filter books list in CRUD panel
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(adminSearch.toLowerCase()) || b.author.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCategory = adminCategory === 'Semua' || b.category === adminCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and top tab buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-400 text-xs md:text-sm">Kelola katalog buku, kustomisasi cover AI, monitoring keanggotaan user, dan log sistem.</p>
        </div>

        {/* Tab navigations & Logout */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 space-x-1">
            {[
              { id: 'dashboard', label: 'Ringkasan', icon: BookOpen },
              { id: 'crud', label: 'Kelola Buku', icon: Layers },
              { id: 'users', label: 'Anggota', icon: Users },
              { id: 'history', label: 'Riwayat Log', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
                    activeTab === tab.id ? 'bg-white text-blue-600 shadow-xs border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              title="Keluar dari Akun Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: RINGKASAN */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[20px] border border-slate-100 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{books.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Judul Buku</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-slate-100 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{totalBooksCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Stok Buku</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-slate-100 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{users.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Anggota Terdaftar</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-slate-100 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{activeBorrowingsCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Peminjaman Aktif</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick action shortcuts card */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-slate-800 text-base">Pusat Pintasan Admin</h3>
              <p className="text-slate-400 text-xs">Jalankan tugas operasional harian perpustakaan dengan cepat melalui modul di bawah.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setActiveTab('crud')}
                  className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200/40 rounded-2xl text-left space-y-2 cursor-pointer group transition-all"
                >
                  <Plus className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-800 text-sm">Tambah Buku Baru</h4>
                  <p className="text-slate-400 text-[10px]">Input judul, synopsis, dan pasang cover AI.</p>
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200/40 rounded-2xl text-left space-y-2 cursor-pointer group transition-all"
                >
                  <Award className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-800 text-sm">Updgrade Keanggotaan</h4>
                  <p className="text-slate-400 text-[10px]">Ubah level atau status jatah kuota pinjam user.</p>
                </button>
              </div>
            </div>

            {/* Quick logs widget */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Sistem Log Global</h3>
                <p className="text-slate-400 text-xs">Monitoring aktivitas sirkulasi perpus siber real-time.</p>
              </div>

              <div className="space-y-3 mt-4 flex-1">
                {logs.slice(0, 3).map((log) => (
                  <div key={log.id} className="text-xs border-b border-slate-50 pb-2 flex items-start space-x-2.5">
                    <span className="text-slate-400 font-mono text-[9px] mt-0.5 whitespace-nowrap">{log.date.split('T')[0] || log.date}</span>
                    <p className="text-slate-600 flex-1">
                      <span className="font-bold text-slate-800">{log.userName}</span>{' '}
                      {log.type === 'pinjam' && `meminjam buku "${log.bookTitle}"`}
                      {log.type === 'kembali' && `mengembalikan buku "${log.bookTitle}"`}
                      {log.type === 'perpanjang' && `memperpanjang durasi "${log.bookTitle}"`}
                      {log.type === 'register' && `mendaftar ke platform`}
                      {log.type === 'update_profile' && `memperbarui profil`}
                    </p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 text-left hover:underline pt-2 cursor-pointer"
              >
                Lihat seluruh log aktivitas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CRUD BUKU */}
      {activeTab === 'crud' && (
        <div className="space-y-6">
          {/* Add/Edit Form Box */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{isEditing ? 'Perbarui Data Buku' : 'Tambah Buku Baru ke Katalog'}</h3>
                <p className="text-slate-400 text-xs">Pastikan menyematkan ISBN dan cover visual berkualitas agar katalog terlihat modern.</p>
              </div>
              {isEditing && (
                <button onClick={resetForm} className="p-1 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitBook} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Cover & AI generator panel */}
              <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kustomisasi Cover Buku</label>
                  
                  {/* Miniature form cover preview */}
                  <div className="w-full max-w-[160px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-100 mx-auto bg-slate-50 flex items-center justify-center">
                    {coverUrl ? (
                      <img src={coverUrl} alt="Preview Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-tr ${coverColor} p-4 text-white flex flex-col justify-between shadow-inner`}>
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase tracking-wider font-bold opacity-75 font-mono">{category}</span>
                          <h4 className="text-xs font-bold leading-tight line-clamp-3">{title || 'Judul Buku'}</h4>
                        </div>
                        <p className="text-[10px] font-medium opacity-90">{author || 'Penulis'}</p>
                      </div>
                    )}
                  </div>

                  {/* Gradient preset selection */}
                  {!coverUrl && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Gradien Preset</p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {COLOR_PRESETS.map((color, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCoverColor(color)}
                            className={`w-6 h-6 rounded-full bg-gradient-to-tr ${color} border-2 hover:scale-110 transition-transform cursor-pointer ${coverColor === color ? 'border-blue-600 scale-105' : 'border-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local image file upload */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      📁 Upload File Gambar (.jpg, .png)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>

                  {coverUrl && (
                    <button
                      type="button"
                      onClick={() => setCoverUrl('')}
                      className="w-full py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold rounded-xl cursor-pointer"
                    >
                      Hapus Gambar & Gunakan Gradien
                    </button>
                  )}
                </div>

                {/* IMAGE GENERATION TRIGGER */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3.5 mt-4">
                  <div className="flex items-center space-x-1.5 text-blue-700">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">Cover Generator AI Gemini</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Tulis ide konsep visual, model Gemini 3.1 akan melukis cover buku beresolusi 3:4 secara otomatis.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Contoh: neon hologram robot skater cyberpunk"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiCover}
                      disabled={isGeneratingAi}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md shadow-blue-100 cursor-pointer"
                    >
                      {isGeneratingAi ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Cover dengan AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form text fields */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Judul Buku</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    placeholder="Contoh: Arsitektur Cloud Native"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Penulis</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    placeholder="Contoh: Budi Rahardjo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Penerbit</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    placeholder="Contoh: TechPress Indonesia"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kode ISBN</label>
                  <input
                    type="text"
                    required
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    placeholder="Contoh: 978-602-1234-56"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kategori Buku</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    {['Teknologi', 'Novel', 'Pendidikan', 'Bisnis', 'Komputer', 'Sejarah', 'Agama', 'Sains'].map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 grid grid-cols-3 gap-2 sm:col-span-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tahun</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="block w-full px-2 py-2.5 border border-slate-200 rounded-xl text-xs outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Stok</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="block w-full px-2 py-2.5 border border-slate-200 rounded-xl text-xs outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5.0"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="block w-full px-2 py-2.5 border border-slate-200 rounded-xl text-xs outline-none text-center"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Sinopsis Lengkap</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                    placeholder="Tulis synopsis atau sinopsis singkat buku disini..."
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-blue-100 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Buku'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Books List Lookup */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Database Buku Terdaftar</h3>
                <p className="text-slate-400 text-xs">Total terfilter: {filteredBooks.length} buku</p>
              </div>

              {/* Search bar inside CRUD list */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Cari buku..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none w-44"
                />
                <select
                  value={adminCategory}
                  onChange={(e) => setAdminCategory(e.target.value)}
                  className="px-2 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-600"
                >
                  <option value="Semua">Semua Kategori</option>
                  {['Teknologi', 'Novel', 'Pendidikan', 'Bisnis', 'Komputer', 'Sejarah', 'Agama', 'Sains'].map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="p-3 font-bold text-slate-400 font-mono">Buku</th>
                    <th className="p-3 font-bold text-slate-400 font-mono">ISBN</th>
                    <th className="p-3 font-bold text-slate-400 font-mono">Penerbit</th>
                    <th className="p-3 font-bold text-slate-400 font-mono text-center">Tahun</th>
                    <th className="p-3 font-bold text-slate-400 font-mono text-center">Stok</th>
                    <th className="p-3 font-bold text-slate-400 font-mono text-center">Rating</th>
                    <th className="p-3 font-bold text-slate-400 font-mono text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-7 h-9 rounded bg-gradient-to-tr ${book.coverColor} p-0.5 text-white flex flex-col justify-between shadow-sm flex-shrink-0`}>
                            <span className="text-[4px] uppercase font-bold opacity-60 leading-none">{book.category}</span>
                            <span className="text-[5px] font-extrabold leading-none line-clamp-2">{book.title}</span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{book.title}</p>
                            <p className="text-[10px] text-slate-400">{book.author} • <span className="font-semibold text-slate-500">{book.category}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 font-medium font-mono">{book.isbn}</td>
                      <td className="p-3 text-slate-600 font-medium">{book.publisher || 'TechPress'}</td>
                      <td className="p-3 text-center text-slate-600 font-bold">{book.year}</td>
                      <td className="p-3 text-center text-slate-700 font-bold">{book.stock}</td>
                      <td className="p-3 text-center text-amber-500 font-bold">{book.rating}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEditTrigger(book)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg cursor-pointer"
                            title="Edit Buku"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus buku "${book.title}"?`)) {
                                onDeleteBook(book.id);
                                addToast(`Buku "${book.title}" telah dihapus!`, 'success');
                              }
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer"
                            title="Hapus Buku"
                          >
                            <Trash className="w-3.5 h-3.5" />
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

      {/* VIEW: MANAJEMEN USER */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Manajemen Tingkat Anggota</h3>
            <p className="text-slate-400 text-xs">Ubah dan monitoring level keanggotaan (Premium/Reguler) para pembaca.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Anggota</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Alamat Email</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono text-center">Buku Dipinjam</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono text-center">Badge Level</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const activeBorrows = user.borrowings.filter(b => b.status === 'Sedang Dipinjam').length;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium capitalize">Role: {user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium font-mono">{user.email}</td>
                      <td className="p-3.5 text-center text-slate-700 font-bold">{activeBorrows} buku</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.badge === 'Premium' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.badge}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              onUpdateUserRole(user.email, 'Premium');
                              addToast(`Badge "${user.name}" diupdate menjadi Premium!`, 'success');
                            }}
                            disabled={user.badge === 'Premium'}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              user.badge === 'Premium' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            Set Premium
                          </button>
                          <button
                            onClick={() => {
                              onUpdateUserRole(user.email, 'Reguler');
                              addToast(`Badge "${user.name}" diupdate menjadi Reguler!`, 'success');
                            }}
                            disabled={user.badge === 'Reguler'}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              user.badge === 'Reguler' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Set Reguler
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

      {/* VIEW: RIWAYAT LOG */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Laporan Riwayat Peminjaman Lengkap</h3>
            <p className="text-slate-400 text-xs">Merekam audit trail log sistem dari semua transaksi pengguna perpustakaan digital.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Waktu / Tanggal</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Anggota</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Jenis Log</th>
                  <th className="p-3.5 font-bold text-slate-400 font-mono">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 text-slate-500 font-medium font-mono">{log.date}</td>
                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-slate-800">{log.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.userEmail}</p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.type === 'pinjam' ? 'bg-blue-50 text-blue-600' :
                        log.type === 'kembali' ? 'bg-emerald-50 text-emerald-600' :
                        log.type === 'perpanjang' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {log.type === 'pinjam' && `Berhasil meminjam buku "${log.bookTitle}"`}
                      {log.type === 'kembali' && `Berhasil mengembalikan buku "${log.bookTitle}"`}
                      {log.type === 'perpanjang' && `Memperpanjang tenggat waktu buku "${log.bookTitle}"`}
                      {log.type === 'register' && `Mendaftar ke sistem Pustaka Digital`}
                      {log.type === 'update_profile' && `Memperbarui detail profil pribadi`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

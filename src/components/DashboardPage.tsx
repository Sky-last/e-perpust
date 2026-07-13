import { useEffect, useRef } from 'react';
import { Book, User, SystemLog, ViewType } from '../types';
import { Star, Clock, Heart, BookOpen, ChevronRight, Calendar, Award } from 'lucide-react';

interface DashboardPageProps {
  currentUser: User;
  books: Book[];
  logs: SystemLog[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  favorites: string[];
}

export default function DashboardPage({
  currentUser,
  books,
  logs,
  onNavigate,
  favorites
}: DashboardPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter logs for this user
  const userLogs = logs
    .filter(log => log.userEmail === currentUser.email)
    .slice(0, 4);

  // Active borrowings
  const activeBorrowings = currentUser.borrowings.filter(b => b.status === 'Sedang Dipinjam');

  // Favorites books mapping
  const favoriteBooks = books.filter(b => favorites.includes(b.id)).slice(0, 3);

  // Book recommendation
  const recommendedBooks = books.filter(b => !favorites.includes(b.id) && b.rating >= 4.7).slice(0, 2);

  // Draw simple Canvas chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas sizing/retina display
    const width = canvas.parentElement?.clientWidth || 400;
    canvas.width = width;
    canvas.height = 180;

    // Clear background
    ctx.clearRect(0, 0, width, 180);

    // Chart styling
    const padding = 30;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;

    // Dummy statistics data: book borrowed over last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const dataPoints = [3, 5, 2, 7, 4, activeBorrowings.length + 2]; // realistic looking curve
    const maxVal = 10;

    // Draw grid lines
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Draw Y labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padding - 20, y + 3);
    }

    // Draw X labels & data points
    const stepX = chartWidth / (months.length - 1);
    const points: { x: number; y: number }[] = [];

    months.forEach((month, idx) => {
      const x = padding + stepX * idx;
      const val = dataPoints[idx];
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      points.push({ x, y });

      // Draw Month text
      ctx.fillStyle = '#64748B';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(month, x, canvas.height - padding + 15);
    });

    // Draw area under line
    ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Draw data points
    points.forEach((p, idx) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label on top of dots
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(dataPoints[idx]), p.x, p.y - 8);
    });

  }, [activeBorrowings.length]);

  return (
    <div className="space-y-6">
      {/* Greeting banner */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between shadow-xs">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Anggota {currentUser.badge}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang, {currentUser.name}! 👋
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Eksplorasi koleksi, cek durasi pinjaman, dan pinjam buku baru dengan mudah hari ini.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => onNavigate('katalog')} 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[16px] text-xs font-semibold shadow-lg shadow-blue-200/50 transition-all duration-200 cursor-pointer"
          >
            Pinjam Buku Baru
          </button>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{activeBorrowings.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Buku Dipinjam</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{favorites.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Favorit Saya</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {currentUser.borrowings.length}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Riwayat</p>
          </div>
        </div>

        {/* Customized membership card like Sleek Interface */}
        <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[20px] shadow-lg shadow-blue-100/50 flex flex-col justify-center">
          <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Keanggotaan</p>
          <h4 className="text-base font-extrabold">{currentUser.badge === 'Premium' ? 'PRO Member' : 'Reguler Member'}</h4>
          <p className="text-[10px] mt-1 opacity-90 font-medium">Status Akun: Aktif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph section */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs lg:col-span-8 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-extrabold text-slate-800 text-base">Statistik Kunjungan & Pinjaman</h3>
            <p className="text-slate-400 text-xs">Aktivitas peminjaman buku Anda dalam 6 bulan terakhir</p>
          </div>
          <div className="flex-1 min-h-[180px] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-[180px]" />
          </div>
        </div>

        {/* User Log Activity */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Aktivitas Terakhir</h3>
            <p className="text-slate-400 text-xs">Laporan riwayat transaksi personal Anda</p>
          </div>

          <div className="space-y-3.5 flex-1 mt-4">
            {userLogs.length > 0 ? (
              userLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${
                    log.type === 'pinjam' ? 'bg-blue-50 text-blue-600' :
                    log.type === 'kembali' ? 'bg-emerald-50 text-emerald-600' :
                    log.type === 'perpanjang' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      {log.type === 'pinjam' && `Meminjam "${log.bookTitle}"`}
                      {log.type === 'kembali' && `Mengembalikan "${log.bookTitle}"`}
                      {log.type === 'perpanjang' && `Perpanjang "${log.bookTitle}"`}
                      {log.type === 'register' && `Mendaftar ke Pustaka Digital`}
                      {log.type === 'update_profile' && `Memperbarui profil`}
                    </p>
                    <p className="text-[10px] text-slate-400">{log.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-semibold">Belum ada aktivitas baru</p>
                <p className="text-[10px] max-w-xs">Silakan lakukan pencarian di katalog dan pinjam buku pertamamu.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Favorites section */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Favorit Anda</h3>
              <p className="text-slate-400 text-xs">Akses cepat ke buku yang Anda simpan</p>
            </div>
            <button 
              onClick={() => onNavigate('favorit')} 
              className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>Selengkapnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {favoriteBooks.length > 0 ? (
              favoriteBooks.map(book => (
                <div 
                  key={book.id} 
                  onClick={() => onNavigate('detail-buku', book.id)}
                  className="group cursor-pointer bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex flex-col items-center space-y-2.5 text-center hover:shadow-md hover:bg-white transition-all duration-200"
                >
                  <div className={`w-16 h-20 rounded-md bg-gradient-to-tr ${book.coverColor} p-1 text-white flex flex-col justify-between shadow-sm relative group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-[5px] uppercase tracking-wider font-bold opacity-60 font-mono">{book.category}</span>
                    <h5 className="text-[7px] font-extrabold leading-tight line-clamp-3">{book.title}</h5>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-blue-600">{book.title}</h4>
                    <p className="text-[10px] text-slate-400">{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-400 space-y-2">
                <Heart className="w-7 h-7 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs">Favorit masih kosong</p>
                <button 
                  onClick={() => onNavigate('katalog')} 
                  className="px-3 py-1 text-[10px] bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  Cari Buku Favorit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended list */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Rekomendasi Untuk Anda</h3>
              <p className="text-slate-400 text-xs">Dipilih khusus sesuai profil membaca Anda</p>
            </div>
            <button 
              onClick={() => onNavigate('katalog')} 
              className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>Telusuri semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recommendedBooks.map(book => (
              <div 
                key={book.id}
                onClick={() => onNavigate('detail-buku', book.id)}
                className="group cursor-pointer bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center justify-between hover:shadow-md hover:bg-white transition-all duration-200"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-13 rounded-md bg-gradient-to-tr ${book.coverColor} p-1 text-white flex flex-col justify-between shadow-sm relative group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-[4px] uppercase font-bold opacity-60">{book.category}</span>
                    <h5 className="text-[6px] font-extrabold leading-tight line-clamp-3">{book.title}</h5>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs group-hover:text-blue-600">{book.title}</h4>
                    <p className="text-[10px] text-slate-400">Penulis: {book.author}</p>
                    <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-bold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{book.rating}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

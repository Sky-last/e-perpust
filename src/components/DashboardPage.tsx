import { useEffect, useRef } from 'react';
import { Book, User, SystemLog, ViewType } from '../types';
import { BookOpen, Heart, Clock, Star, ChevronRight, Calendar, Award, TrendingUp, Zap, Target } from 'lucide-react';
import Book3D from './Book3D';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  currentUser: User;
  books: Book[];
  logs: SystemLog[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  favorites: string[];
}

export default function DashboardPage({ currentUser, books, logs, onNavigate, favorites }: DashboardPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const userLogs = logs.filter(log => log.userEmail === currentUser.email).slice(0, 5);
  const userBorrowings = currentUser.borrowings || [];
  const activeBorrowings = userBorrowings.filter(b => b.status === 'Sedang Dipinjam');
  const favoriteBooks = books.filter(b => favorites.includes(b.id)).slice(0, 3);
  const recommendedBooks = books.filter(b => !favorites.includes(b.id) && b.rating >= 4.7).slice(0, 3);

  const greetHour = new Date().getHours();
  const greetText = greetHour < 11 ? 'Selamat Pagi' : greetHour < 15 ? 'Selamat Siang' : greetHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  // Draw dark-themed line chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.parentElement?.clientWidth || 500;
    canvas.width = w;
    canvas.height = 200;
    ctx.clearRect(0, 0, w, 200);

    const pad = 40;
    const cw = w - pad * 2;
    const ch = 200 - pad * 2;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const borrowData = [3, 5, 2, 7, 4, activeBorrowings.length + 2];
    const visitData  = [8, 12, 6, 15, 10, 14];
    const maxVal = 16;
    const stepX = cw / (months.length - 1);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 200);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = pad + (ch / 4) * i;
      ctx.strokeStyle = 'rgba(51,65,85,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), pad - 6, y + 4);
    }

    const calcPoints = (data: number[]) =>
      data.map((v, i) => ({ x: pad + stepX * i, y: pad + ch - (v / maxVal) * ch }));

    const bPoints = calcPoints(borrowData);
    const vPoints = calcPoints(visitData);

    const drawArea = (points: {x:number,y:number}[], color: string) => {
      const grad = ctx.createLinearGradient(0, pad, 0, 200 - pad);
      grad.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'));
      grad.addColorStop(1, color.replace(')', ', 0.01)').replace('rgb', 'rgba'));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(points[0].x, 200 - pad);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, 200 - pad);
      ctx.closePath(); ctx.fill();
    };

    const drawLine = (points: {x:number,y:number}[], color: string) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
    };

    drawArea(vPoints, 'rgb(99,102,241)');
    drawLine(vPoints, '#818cf8');
    drawArea(bPoints, 'rgb(16,185,129)');
    drawLine(bPoints, '#34d399');

    // Dots & x-labels
    months.forEach((m, i) => {
      ctx.fillStyle = '#475569'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(m, pad + stepX * i, 200 - pad + 18);
      [[vPoints[i], '#818cf8'], [bPoints[i], '#34d399']].forEach(([p, c]) => {
        const pt = p as {x:number,y:number};
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = c as string; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      });
    });
  }, [activeBorrowings.length]);

  const stats = [
    { label: 'Sedang Dipinjam', value: activeBorrowings.length, icon: BookOpen, color: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20' },
    { label: 'Buku Favorit', value: favorites.length, icon: Heart, color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/20' },
    { label: 'Total Riwayat', value: userBorrowings.length, icon: Clock, color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
    { label: 'Status Akun', value: currentUser.badge, icon: Award, color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
  ];

  const logIcons: Record<string, string> = {
    pinjam: '📚', kembali: '✅', perpanjang: '🔄', register: '🎉', update_profile: '✏️'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
  };

  return (
    <div className="space-y-6 text-white">

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-6 md:p-8 shadow-2xl shadow-indigo-900/40"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/15 border border-white/20 px-3 py-1 rounded-full">
              <Zap className="w-3 h-3" /> {greetText}
            </span>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">
              Halo, <span className="text-blue-200">{currentUser.name}</span> 👋
            </h1>
            <p className="text-sm text-blue-100/80 max-w-md leading-relaxed">
              Eksplorasi ribuan koleksi buku digital dan kelola peminjaman Anda dengan mudah.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('katalog')}
              className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow-lg hover:bg-blue-50 transition-all cursor-pointer hover:scale-105"
            >
              Pinjam Buku Baru
            </button>
            <button
              onClick={() => onNavigate('favorit')}
              className="px-5 py-2.5 bg-white/15 border border-white/25 text-white font-bold text-xs rounded-xl hover:bg-white/25 transition-all cursor-pointer"
            >
              Favorit Saya
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i} initial="hidden" animate="visible" variants={cardVariants}
              className={`relative bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-lg ${s.glow}`}
            >
              <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Statistik 6 Bulan Terakhir
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Kunjungan (ungu) & Peminjaman (hijau)</p>
            </div>
          </div>
          <div className="bg-slate-950 rounded-xl overflow-hidden">
            <canvas ref={canvasRef} className="w-full" style={{ height: 200 }} />
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-sm font-black text-white mb-4">Aktivitas Terakhir</h3>
          <div className="flex-1 space-y-3">
            {userLogs.length > 0 ? userLogs.map((log, i) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-sm">
                  {logIcons[log.type] || '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 font-semibold leading-snug line-clamp-1">
                    {log.type === 'pinjam' && `Meminjam "${log.bookTitle}"`}
                    {log.type === 'kembali' && `Mengembalikan "${log.bookTitle}"`}
                    {log.type === 'perpanjang' && `Perpanjang "${log.bookTitle}"`}
                    {log.type === 'register' && 'Bergabung ke Pustaka Digital'}
                    {log.type === 'update_profile' && 'Memperbarui profil'}
                  </p>
                  <p className="text-slate-600 text-[10px] mt-0.5 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> {log.date}
                  </p>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-2">
                <Clock className="w-8 h-8 text-slate-700" />
                <p className="text-xs text-slate-500">Belum ada aktivitas</p>
                <button onClick={() => onNavigate('katalog')} className="text-[10px] text-blue-400 hover:underline cursor-pointer">
                  Pinjam buku pertama →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Reading Progress ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5">
          <Target className="w-4 h-4 text-amber-400" /> Target Membaca Bulan Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Buku Dibaca', current: userBorrowings.length, max: 10, color: 'from-blue-500 to-indigo-500' },
            { label: 'Jam Membaca', current: activeBorrowings.length * 2, max: 20, color: 'from-emerald-500 to-teal-500' },
          ].map(prog => (
            <div key={prog.label} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">{prog.label}</span>
                <span className="text-white">{prog.current} / {prog.max}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${prog.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min((prog.current / prog.max) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-600">
                {Math.max(prog.max - prog.current, 0)} lagi untuk mencapai target
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Favorites + Recommendations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Favorites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">❤️ Favorit Saya</h3>
            <button onClick={() => onNavigate('favorit')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-bold">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {favoriteBooks.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {favoriteBooks.map(book => (
                <div
                  key={book.id}
                  onClick={() => onNavigate('detail-buku', book.id)}
                  className="group cursor-pointer flex flex-col items-center gap-2 p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-blue-500/40 hover:bg-slate-800/50 transition-all overflow-visible"
                >
                  <div className="overflow-visible"><Book3D book={book} size="xs" /></div>
                  <p className="text-[10px] text-slate-400 font-bold text-center line-clamp-1 group-hover:text-white transition-colors">{book.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center gap-3 text-center">
              <Heart className="w-8 h-8 text-slate-700" />
              <p className="text-xs text-slate-500">Belum ada favorit</p>
              <button onClick={() => onNavigate('katalog')} className="text-[10px] px-3 py-1.5 bg-slate-800 text-blue-400 rounded-lg hover:bg-slate-700 cursor-pointer font-bold">
                Cari Buku Favorit
              </button>
            </div>
          )}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">⭐ Rekomendasi Untuk Kamu</h3>
            <button onClick={() => onNavigate('katalog')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-bold">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recommendedBooks.length > 0 ? recommendedBooks.map(book => (
              <div
                key={book.id}
                onClick={() => onNavigate('detail-buku', book.id)}
                className="group flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/50 transition-all cursor-pointer overflow-visible"
              >
                <div className="overflow-visible shrink-0"><Book3D book={book} size="xs" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1 transition-colors">{book.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{book.author}</p>
                  <div className="flex items-center gap-1 mt-1 text-amber-400 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current" /> {book.rating}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            )) : (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">Belum ada rekomendasi</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* ── Active Borrowings ── */}
      {activeBorrowings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">📖 Sedang Dipinjam</h3>
            <button onClick={() => onNavigate('pinjaman')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-bold">
              Kelola pinjaman <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {activeBorrowings.slice(0, 3).map(borrow => {
              const book = books.find(b => b.id === borrow.bookId);
              const dueDate = new Date(borrow.dueDate);
              const today = new Date();
              const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;
              const isUrgent = daysLeft <= 3 && daysLeft >= 0;

              return (
                <div key={borrow.id} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div className="overflow-visible shrink-0">{book && <Book3D book={book} size="xs" />}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{borrow.bookTitle}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> Jatuh tempo: {borrow.dueDate}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${
                    isOverdue ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    isUrgent  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isOverdue ? `${Math.abs(daysLeft)}h terlambat` : `${daysLeft}h lagi`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

    </div>
  );
}
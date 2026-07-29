import { useEffect, useRef } from 'react';
import { Book, User, SystemLog, ViewType } from '../types';
import { Star, Clock, Heart, BookOpen, ChevronRight, Calendar, Award } from 'lucide-react';
import Book3D from './Book3D';

interface DashboardPageProps {
  currentUser: User;
  books: Book[];
  logs: SystemLog[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  favorites: string[];
}

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";

export default function DashboardPage({
  currentUser,
  books,
  logs,
  onNavigate,
  favorites
}: DashboardPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const userLogs = logs
    .filter(log => log.userEmail === currentUser.email)
    .slice(0, 4);

  const userBorrowings = currentUser.borrowings || [];
  const userFavorites = favorites || [];

  const activeBorrowings = userBorrowings.filter(b => b.status === 'Sedang Dipinjam');
  const favoriteBooks = books.filter(b => userFavorites.includes(b.id)).slice(0, 3);
  const recommendedBooks = books.filter(b => !userFavorites.includes(b.id) && b.rating >= 4.7).slice(0, 2);

  // Draw ledger-style Canvas chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 400;
    canvas.width = width;
    canvas.height = 220;

    ctx.clearRect(0, 0, width, 220);

    const padding = 40;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;

    // Data untuk grafik kunjungan & peminjaman
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const borrowData = [3, 5, 2, 7, 4, activeBorrowings.length + 2]; // Data peminjaman
    const visitData = [8, 12, 6, 15, 10, 14]; // Data kunjungan (simulasi)
    const maxVal = 16;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    bgGradient.addColorStop(0, '#F8FAFC');
    bgGradient.addColorStop(1, '#EFF6FF');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines dengan style yang lebih modern
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#64748B';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padding - 8, y + 4);
    }

    // X-axis labels
    const stepX = chartWidth / (months.length - 1);
    const borrowPoints: { x: number; y: number }[] = [];
    const visitPoints: { x: number; y: number }[] = [];

    months.forEach((month, idx) => {
      const x = padding + stepX * idx;
      
      // Calculate borrow points
      const borrowVal = borrowData[idx];
      const borrowY = padding + chartHeight - (borrowVal / maxVal) * chartHeight;
      borrowPoints.push({ x, y: borrowY });

      // Calculate visit points
      const visitVal = visitData[idx];
      const visitY = padding + chartHeight - (visitVal / maxVal) * chartHeight;
      visitPoints.push({ x, y: visitY });

      // Month labels
      ctx.fillStyle = '#475569';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(month, x, canvas.height - padding + 20);
    });

    // Area fill untuk kunjungan (biru muda)
    const visitGradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    visitGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    visitGradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
    ctx.fillStyle = visitGradient;
    ctx.beginPath();
    ctx.moveTo(visitPoints[0].x, canvas.height - padding);
    visitPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(visitPoints[visitPoints.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Line untuk kunjungan (biru)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(visitPoints[0].x, visitPoints[0].y);
    visitPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Area fill untuk peminjaman (hijau muda)
    const borrowGradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    borrowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
    borrowGradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
    ctx.fillStyle = borrowGradient;
    ctx.beginPath();
    ctx.moveTo(borrowPoints[0].x, canvas.height - padding);
    borrowPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(borrowPoints[borrowPoints.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Line untuk peminjaman (hijau)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(borrowPoints[0].x, borrowPoints[0].y);
    borrowPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Data points untuk kunjungan
    visitPoints.forEach((p, idx) => {
      // Outer circle (shadow)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Value label
      ctx.fillStyle = '#3B82F6';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(visitData[idx]), p.x, p.y - 12);
    });

    // Data points untuk peminjaman
    borrowPoints.forEach((p, idx) => {
      // Outer circle (shadow)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Value label
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(borrowData[idx]), p.x, p.y - 12);
    });

    // Legend
    const legendY = 15;
    const legendX = padding;
    
    // Kunjungan legend
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(legendX, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Kunjungan', legendX + 10, legendY + 4);

    // Peminjaman legend
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(legendX + 90, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.fillText('Peminjaman', legendX + 100, legendY + 4);
  }, [activeBorrowings.length]);

  // Draw Donut Chart untuk distribusi kategori buku
  useEffect(() => {
    const canvas = donutCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 280;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Data kategori dari buku favorit dan yang dipinjam
    const categoryData = {
      'Teknologi': 35,
      'Novel': 25,
      'Pendidikan': 20,
      'Bisnis': 12,
      'Lainnya': 8
    };

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const total = Object.values(categoryData).reduce((a, b) => a + b, 0);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const innerRadius = 50;

    let startAngle = -Math.PI / 2;

    // Draw donut segments
    Object.entries(categoryData).forEach(([category, value], index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Outer arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      // Fill with color
      ctx.fillStyle = colors[index];
      ctx.fill();

      // Add subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;

      startAngle = endAngle;
    });

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Center text
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(total) + '%', centerX, centerY - 5);
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Total Baca', centerX, centerY + 15);

    // Legend
    let legendY = 20;
    Object.entries(categoryData).forEach(([category, value], index) => {
      const legendX = 10;
      
      // Color box
      ctx.fillStyle = colors[index];
      ctx.fillRect(legendX, legendY, 12, 12);
      
      // Text
      ctx.fillStyle = '#475569';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${category} (${value}%)`, legendX + 18, legendY + 9);
      
      legendY += 20;
    });
  }, [favorites, activeBorrowings]);

  // Draw Bar Chart untuk aktivitas mingguan
  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 30;
    const barWidth = 30;
    const maxValue = 20;

    // Data aktivitas per hari
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const values = [15, 12, 18, 8, 14, 6, 10];

    const chartHeight = canvas.height - padding * 2;
    const spacing = (canvas.width - padding * 2 - barWidth * days.length) / (days.length - 1);

    // Draw bars
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + spacing);
      const y = canvas.height - padding - barHeight;

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#1D4ED8');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Value on top
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(value), x + barWidth / 2, y - 5);

      // Day label
      ctx.fillStyle = '#64748B';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(days[index], x + barWidth / 2, canvas.height - padding + 15);
    });

    // Title
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Aktivitas Mingguan', padding, 15);
  }, [userLogs]);

  return (
    <div className="space-y-6" style={{ fontFamily: FONT_BODY }}>
      {/* Greeting banner */}
      <div className="bg-[#FBF7EF] border border-[#E4DFD2] rounded-[24px] p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between">
        <div className="absolute -right-10 -bottom-16 w-72 h-72 bg-[#0F3D3E]/[0.04] rounded-full blur-2xl -z-0" />
        <div
          className="absolute right-6 top-6 hidden sm:block opacity-[0.06]"
          style={{ fontFamily: FONT_DISPLAY, fontSize: '110px', lineHeight: 1, color: '#0F3D3E' }}
        >
          §
        </div>

        <div className="space-y-3 relative z-10">
          {/* Ink-stamp badge */}
          <div
            className="inline-flex items-center space-x-2 border-2 border-dashed border-[#B8860B] text-[#8A6A0F] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest -rotate-3"
            style={{ fontFamily: FONT_MONO }}
          >
            <Award className="w-4 h-4" />
            <span>Anggota · {currentUser.badge}</span>
          </div>
          <h1
            className="text-2xl md:text-4xl font-semibold text-[#1B2A2F] tracking-tight"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Selamat datang, {currentUser.name}
          </h1>
          <p className="text-[#6B6154] text-sm md:text-base max-w-md">
            Eksplorasi koleksi, cek durasi pinjaman, dan pinjam buku baru dengan mudah hari ini.
          </p>
        </div>

        <div className="mt-5 md:mt-0 flex items-center space-x-3 relative z-10">
          <button
            onClick={() => onNavigate('katalog')}
            className="px-6 py-3 bg-[#0F3D3E] hover:bg-[#145556] text-[#FBF7EF] rounded-[14px] text-sm font-semibold shadow-lg shadow-[#0F3D3E]/20 transition-all duration-200 cursor-pointer"
          >
            Pinjam Buku Baru
          </button>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#EDE8DA] flex items-center space-x-4">
          <div className="p-3 bg-[#0F3D3E]/[0.08] text-[#0F3D3E] rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A2F]" style={{ fontFamily: FONT_MONO }}>{activeBorrowings.length}</p>
            <p className="text-xs text-[#9B8F73] font-bold uppercase tracking-wider">Buku Dipinjam</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EDE8DA] flex items-center space-x-4">
          <div className="p-3 bg-[#B5533C]/[0.08] text-[#B5533C] rounded-xl">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A2F]" style={{ fontFamily: FONT_MONO }}>{favorites.length}</p>
            <p className="text-xs text-[#9B8F73] font-bold uppercase tracking-wider">Favorit Saya</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EDE8DA] flex items-center space-x-4">
          <div className="p-3 bg-[#B8860B]/[0.10] text-[#8A6A0F] rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A2F]" style={{ fontFamily: FONT_MONO }}>{userBorrowings.length}</p>
            <p className="text-xs text-[#9B8F73] font-bold uppercase tracking-wider">Total Riwayat</p>
          </div>
        </div>

        {/* Library membership card */}
        <div className="p-5 bg-[#0F3D3E] text-[#FBF7EF] rounded-[20px] shadow-lg shadow-[#0F3D3E]/20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full border-2 border-[#B8860B]/40" />
          <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest" style={{ fontFamily: FONT_MONO }}>Kartu Anggota</p>
          <h4 className="text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
            {currentUser.badge === 'Premium' ? 'PRO Member' : 'Reguler Member'}
          </h4>
          <p className="text-[10px] mt-1 opacity-80" style={{ fontFamily: FONT_MONO }}>STATUS · AKTIF</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph section */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] lg:col-span-8 flex flex-col justify-between shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-[#1B2A2F] text-xl flex items-center space-x-2" style={{ fontFamily: FONT_DISPLAY }}>
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistik Kunjungan & Peminjaman</span>
            </h3>
            <p className="text-[#9B8F73] text-sm mt-1">Aktivitas kunjungan dan peminjaman buku dalam 6 bulan terakhir</p>
          </div>
          <div className="flex-1 min-h-[220px] flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-2xl p-4">
            <canvas ref={canvasRef} className="w-full h-[220px]" />
          </div>
        </div>

        {/* User Log Activity */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-[#1B2A2F] text-lg" style={{ fontFamily: FONT_DISPLAY }}>
              Aktivitas Terakhir
            </h3>
            <p className="text-[#9B8F73] text-sm">Laporan riwayat transaksi personal Anda</p>
          </div>

          <div className="space-y-3.5 flex-1 mt-4">
            {userLogs.length > 0 ? (
              userLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-sm border-b border-dashed border-[#EDE8DA] pb-2.5 last:border-0 last:pb-0">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${
                    log.type === 'pinjam' ? 'bg-[#0F3D3E]/[0.08] text-[#0F3D3E]' :
                    log.type === 'kembali' ? 'bg-emerald-50 text-emerald-700' :
                    log.type === 'perpanjang' ? 'bg-[#B8860B]/[0.10] text-[#8A6A0F]' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-semibold text-[#1B2A2F]">
                      {log.type === 'pinjam' && `Meminjam "${log.bookTitle}"`}
                      {log.type === 'kembali' && `Mengembalikan "${log.bookTitle}"`}
                      {log.type === 'perpanjang' && `Perpanjang "${log.bookTitle}"`}
                      {log.type === 'register' && `Mendaftar ke Pustaka Digital`}
                      {log.type === 'update_profile' && `Memperbarui profil`}
                    </p>
                    <p className="text-[10px] text-[#9B8F73]" style={{ fontFamily: FONT_MONO }}>{log.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9B8F73] space-y-2">
                <Clock className="w-8 h-8 text-[#D8D0BC]" />
                <p className="text-xs font-semibold">Belum ada aktivitas baru</p>
                <p className="text-[10px] max-w-xs">Silakan lakukan pencarian di katalog dan pinjam buku pertamamu.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grafik Tambahan: Donut Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart - Distribusi Kategori Buku */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-[#1B2A2F] text-xl flex items-center space-x-2" style={{ fontFamily: FONT_DISPLAY }}>
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <span>Distribusi Kategori Bacaan</span>
            </h3>
            <p className="text-[#9B8F73] text-sm mt-1">Persentase kategori buku yang Anda baca</p>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-green-50/30 rounded-2xl p-6">
            <canvas ref={donutCanvasRef} className="max-w-full" />
          </div>
        </div>

        {/* Bar Chart - Aktivitas Mingguan */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-[#1B2A2F] text-xl flex items-center space-x-2" style={{ fontFamily: FONT_DISPLAY }}>
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Aktivitas Mingguan</span>
            </h3>
            <p className="text-[#9B8F73] text-sm mt-1">Jumlah kunjungan per hari dalam seminggu terakhir</p>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-purple-50/30 rounded-2xl p-4">
            <canvas ref={barCanvasRef} className="max-w-full" />
          </div>
        </div>
      </div>

      {/* Progress Bars - Target Membaca */}
      <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-[#1B2A2F] text-xl flex items-center space-x-2" style={{ fontFamily: FONT_DISPLAY }}>
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>Target Membaca Bulan Ini</span>
          </h3>
          <p className="text-[#9B8F73] text-sm mt-1">Progres pencapaian target membaca bulanan Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Buku */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-[#6B6154] font-semibold">Buku Dibaca</span>
              <span className="text-[#1B2A2F] font-bold">{userBorrowings.length} / 10 buku</span>
            </div>
            <div className="w-full bg-[#EDE8DA] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${(userBorrowings.length / 10) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-[#9B8F73]">
              {10 - userBorrowings.length} buku lagi untuk mencapai target!
            </p>
          </div>

          {/* Target Waktu Membaca */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-[#6B6154] font-semibold">Waktu Membaca</span>
              <span className="text-[#1B2A2F] font-bold">{activeBorrowings.length * 2} / 20 jam</span>
            </div>
            <div className="w-full bg-[#EDE8DA] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${(activeBorrowings.length * 2 / 20) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-[#9B8F73]">
              {20 - (activeBorrowings.length * 2)} jam lagi untuk mencapai target!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Favorites section */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1B2A2F] text-lg" style={{ fontFamily: FONT_DISPLAY }}>
                Favorit Anda
              </h3>
              <p className="text-[#9B8F73] text-sm">Akses cepat ke buku yang Anda simpan</p>
            </div>
            <button
              onClick={() => onNavigate('favorit')}
              className="text-[#0F3D3E] hover:text-[#145556] text-sm font-bold flex items-center space-x-1 hover:underline cursor-pointer"
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
                  className="group cursor-pointer bg-[#FBF7EF] border border-[#EDE8DA] rounded-xl p-3 flex flex-col items-center space-y-2.5 text-center hover:shadow-md hover:bg-white transition-all duration-200 overflow-visible"
                >
                  <div className="relative overflow-visible">
                    <Book3D book={book} size="xs" />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#B8860B] rounded-full border-2 border-[#FBF7EF] z-10" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#1B2A2F] text-sm line-clamp-1 group-hover:text-[#0F3D3E]">{book.title}</h4>
                    <p className="text-xs text-[#9B8F73]">{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-[#9B8F73] space-y-2">
                <Heart className="w-7 h-7 mx-auto text-[#D8D0BC] animate-pulse" />
                <p className="text-xs">Favorit masih kosong</p>
                <button
                  onClick={() => onNavigate('katalog')}
                  className="px-3 py-1 text-[10px] bg-[#F1EDE1] text-[#6B6154] rounded-lg hover:bg-[#0F3D3E]/[0.08] hover:text-[#0F3D3E] cursor-pointer"
                >
                  Cari Buku Favorit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended list */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EDE8DA] lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1B2A2F] text-lg" style={{ fontFamily: FONT_DISPLAY }}>
                Rekomendasi Untuk Anda
              </h3>
              <p className="text-[#9B8F73] text-sm">Dipilih khusus sesuai profil membaca Anda</p>
            </div>
            <button
              onClick={() => onNavigate('katalog')}
              className="text-[#0F3D3E] hover:text-[#145556] text-sm font-bold flex items-center space-x-1 hover:underline cursor-pointer"
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
                className="group cursor-pointer bg-[#FBF7EF] border border-[#EDE8DA] rounded-xl p-3 flex items-center justify-between hover:shadow-md hover:bg-white transition-all duration-200 overflow-visible"
              >
                <div className="flex items-center space-x-3.5 overflow-visible">
                  <div className="flex-shrink-0">
                    <Book3D book={book} size="xs" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#1B2A2F] text-xs group-hover:text-[#0F3D3E]">{book.title}</h4>
                    <p className="text-[10px] text-[#9B8F73]">Penulis: {book.author}</p>
                    <div className="flex items-center space-x-1 text-[#8A6A0F] text-[10px] font-bold" style={{ fontFamily: FONT_MONO }}>
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{book.rating}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#9B8F73] group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { ViewType, Book } from '../types';
import Book3D from './Book3D';
import { soundFX } from '../utils/audio';

interface RegisterPageProps {
  onNavigate: (view: ViewType) => void;
  onRegister: (name: string, email: string, pass: string) => boolean | Promise<boolean>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function RegisterPage({ onNavigate, onRegister, addToast }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample book for 3D showcase on split screen
  const showcaseBook: Book = {
    id: 'reg-demo',
    title: 'Panduan Literasi Digital Modern',
    author: 'Pustaka Digital Team',
    publisher: 'Pustaka Digital',
    category: 'E-Book',
    description: 'Nikmati akses tak terbatas ke ribuan e-book digital dengan pengalaman membaca yang imersif.',
    coverColor: 'from-blue-600 to-indigo-900',
    rating: 5.0,
    year: 2026,
    stock: 99,
    status: 'Tersedia',
    isbn: '978-602-REG-SYS',
  };

  const getPasswordStrength = () => {
    if (!password) return { label: 'Belum diisi', score: 0, color: 'bg-slate-700', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Lemah', score: 25, color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { label: 'Sedang', score: 50, color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { label: 'Kuat', score: 75, color: 'bg-blue-500', text: 'text-blue-400' };
    return { label: 'Sangat Kuat', score: 100, color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();

    if (!name || !email || !password || !confirmPassword) {
      addToast('Semua kolom formulir harus diisi!', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Format email tidak valid!', 'error');
      return;
    }

    if (password.length < 5) {
      addToast('Password minimal harus 5 karakter!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Konfirmasi password tidak cocok!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onRegister(name, email, password);
      setIsLoading(false);
      if (success) {
        soundFX.playBookOpen();
      }
    } catch (err: any) {
      setIsLoading(false);
      addToast(err.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10">

        {/* LEFT PANEL: 3D Showcase & Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <div>
            {/* Back Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                onNavigate('landing');
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Registrasi Anggota
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                Gabung Ke Komunitas Pustaka
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Nikmati akses tak terbatas ke ribuan e-book digital dengan pengalaman membaca yang imersif.
              </p>
            </div>

            {/* 3D Showcase Book */}
            <div className="hidden sm:flex my-4 lg:my-8 justify-center py-2 lg:py-4">
              <Book3D book={showcaseBook} size="md" />
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
            {[
              'Akses e-reader flipbook interaktif 24/7',
              'Pinjam & simpan buku favorit dalam 1-klik',
              'Rekomendasi bacaan cerdas sesuai minat Anda',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold text-[11px]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Modern Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="space-y-2 mb-6">
            <h3 className="text-2xl font-black text-white">Buat Akun Baru</h3>
            <p className="text-xs text-slate-400 font-medium">
              Sudah memiliki akun?{' '}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('login');
                }}
                className="font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 5 karakter"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Kekuatan Sandi:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password Anda"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <span>Registrasi Sekarang</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
            Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Pustaka Digital.
          </div>
        </div>
      </div>
    </div>
  );
}

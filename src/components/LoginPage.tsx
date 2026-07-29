import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { ViewType, Book } from '../types';
import Book3D from './Book3D';
import { soundFX } from '../utils/audio';

interface LoginPageProps {
  onNavigate: (view: ViewType) => void;
  onLogin: (email: string, password: string) => boolean | Promise<boolean>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function LoginPage({ onNavigate, onLogin, addToast }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Showcase Book for Split Screen
  const showcaseBook: Book = {
    id: 'login-demo',
    title: 'Digital Library 3D Edition',
    author: 'Pustaka Indonesia',
    publisher: 'Pustaka Digital',
    category: 'Sistem 3D',
    description: 'Sistem perpustakaan digital imersif dengan teknologi 3D modern.',
    coverColor: 'from-blue-600 to-slate-900',
    rating: 4.9,
    year: 2026,
    stock: 50,
    status: 'Tersedia',
    isbn: '978-602-LOGIN-3D',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();

    if (!email || !password) {
      addToast('Email dan password wajib diisi!', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Format email tidak valid!', 'error');
      return;
    }

    if (password.length < 4) {
      addToast('Password minimal harus 4 karakter!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      setIsLoading(false);
      if (success) {
        soundFX.playBookOpen();
      }
    } catch (err: any) {
      setIsLoading(false);
      addToast(err.message || 'Gagal masuk ke sistem. Silakan coba lagi.', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    soundFX.playClick();
    setIsLoading(true);
    try {
      const success = await onLogin('siswa@pustaka.com', 'siswa');
      setIsLoading(false);
      if (success) {
        soundFX.playBookOpen();
      }
    } catch (err) {
      setIsLoading(false);
      addToast('Gagal masuk menggunakan Google!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden select-none">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10">

        {/* LEFT PANEL: 3D Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <div>
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
                <Sparkles className="w-3 h-3" /> Sesi Keanggotaan
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                Selamat Datang Kembali di Pustaka 3D
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Masuk ke akun Anda untuk melanjutkan riwayat bacaan dan peminjaman buku.
              </p>
            </div>

            {/* 3D Book Showcase */}
            <div className="my-8 flex justify-center py-4">
              <Book3D book={showcaseBook} size="md" />
            </div>
          </div>

          {/* Security & Encryption Assurance Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-xs">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Keamanan Akun Terjamin</p>
              <p className="text-[10px] text-slate-400">Sesi enkripsi dilindungi oleh Pustaka Digital Indonesia.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="space-y-2 mb-6">
            <h3 className="text-2xl font-black text-white">Masuk ke Akun Anda</h3>
            <p className="text-xs text-slate-400 font-medium">
              Belum punya akun?{' '}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('register');
                }}
                className="font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Daftar akun gratis
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Demo pass: siswa / admin / staf', 'info')}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda..."
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-slate-400 cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.01]"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <span>Masuk ke Perpustakaan</span>
              )}
            </button>
          </form>

          {/* Social Google Login */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                <span className="px-3 bg-slate-900 text-slate-500">Atau Masuk Cepat</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-slate-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.28 1.5-.12 3.01-.97 4.13v3.44h3.83c2.24-2.07 3.53-5.11 3.53-8.68z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.83-3.44c-1.07.72-2.45 1.15-4.13 1.15-3.18 0-5.87-2.15-6.83-5.06H1.18v3.56c2.01 4 6.13 6.7 10.82 6.7z" />
                <path fill="#FBBC05" d="M5.17 14.74c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.6H1.18C.43 8.1.01 9.8.01 11.6c0 1.8.42 3.5 1.17 5l3.99-3.86z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.31 0 3.19 2.7 1.18 6.7l3.99 3.86c.96-2.91 3.65-5.06 6.83-5.06z" />
              </svg>
              <span>Masuk Dengan Google (Demo Siswa)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

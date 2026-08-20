import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { ViewType, Book } from '../types';
import Book3D from './Book3D';
import { soundFX } from '../utils/audio';
import { InteractiveMascot } from './InteractiveMascot';

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
  const [isFocusEmail, setIsFocusEmail] = useState(false);
  const [isFocusPassword, setIsFocusPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Showcase Book for Split Screen
  const showcaseBook: Book = {
    id: 'login-demo',
    title: 'Digital Library Modern',
    author: 'Pustaka Indonesia',
    publisher: 'Pustaka Digital',
    category: 'Sistem Digital',
    description: 'Sistem perpustakaan digital imersif dengan teknologi modern.',
    coverColor: 'from-blue-600 to-slate-900',
    rating: 4.9,
    year: 2026,
    stock: 50,
    status: 'Tersedia',
    isbn: '978-602-LOGIN-SYS',
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
        setIsSuccess(true);
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
      const success = await onLogin('user@pustaka.com', 'user');
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
                Selamat Datang Kembali di Pustaka
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Masuk ke akun Anda untuk melanjutkan riwayat bacaan dan peminjaman buku.
              </p>
            </div>

            {/* Futuristic Holographic Digital Member Pass Animation */}
            <div className="hidden sm:flex my-6 justify-center py-2 relative group cursor-pointer">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />

              {/* Futuristic Pass Card */}
              <div className="relative w-full max-w-[280px] h-[170px] rounded-2xl bg-slate-900/90 border border-blue-500/40 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
                {/* Holographic shimmer line */}
                <div className="absolute -inset-full top-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer" />

                {/* Card Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Digital Member Pass
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Pustaka Digital</h4>
                  </div>
                  {/* Microchip graphic */}
                  <div className="w-8 h-6 rounded bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-300/60 shadow flex items-center justify-center">
                    <div className="w-5 h-3 border-t border-b border-slate-900/60" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="z-10 my-auto">
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider">MEMBER ID: 8820-2026-VIP</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold text-emerald-400">Akses Tanpa Batas 24/7</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end z-10 pt-2 border-t border-slate-800">
                  <span className="text-[9px] text-slate-400">Verified Identity</span>
                  <span className="text-[9px] font-mono text-blue-300 font-bold">PUSTAKA INDONESIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center relative">
          
          {/* Interactive Mascot Reacting to Form Inputs (TikTok VT Style) */}
          <div className="mb-2">
            <InteractiveMascot
              isFocusEmail={isFocusEmail}
              isFocusPassword={isFocusPassword}
              showPassword={showPassword}
              emailLength={email.length}
              isSuccess={isSuccess}
            />
          </div>

          <div className="space-y-1 mb-5 text-center sm:text-left">
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
                  onFocus={() => setIsFocusEmail(true)}
                  onBlur={() => setIsFocusEmail(false)}
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
                  onClick={() => addToast('Demo pass: user / admin / staf', 'info')}
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
                  onFocus={() => setIsFocusPassword(true)}
                  onBlur={() => setIsFocusPassword(false)}
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
              <span>Masuk Dengan Google (Demo User)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import { ViewType } from '../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (!success) {
        addToast('Email atau password salah! Coba admin@pustaka.com (pass: admin), staf@pustaka.com (pass: staf), atau siswa@pustaka.com (pass: siswa).', 'error');
      }
    } catch (err: any) {
      setIsLoading(false);
      addToast(err.message || 'Gagal masuk ke sistem. Silakan coba lagi.', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await onLogin('siswa@pustaka.com', 'siswa');
      setIsLoading(false);
      if (success) {
        addToast('Berhasil masuk menggunakan akun Google!', 'success');
      } else {
        addToast('Gagal masuk menggunakan Google!', 'error');
      }
    } catch (err) {
      setIsLoading(false);
      addToast('Gagal masuk menggunakan Google!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500 text-center">
            Atau{' '}
            <button 
              onClick={() => onNavigate('register')} 
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              buat akun baru di sini gratis
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-100 rounded-[24px] border border-slate-100 space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-3 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => addToast('Akun demo: siswa@pustaka.com (siswa), staf@pustaka.com (staf), atau admin@pustaka.com (admin)', 'info')}
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-10 py-3 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember & Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-200 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 select-none">
                  Ingat saya
                </label>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-100 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <span>Masuk ke Perpustakaan</span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">Atau masuk dengan</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full inline-flex justify-center py-3 px-4 border border-slate-100 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.28 1.5-.12 3.01-.97 4.13v3.44h3.83c2.24-2.07 3.53-5.11 3.53-8.68z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.83-3.44c-1.07.72-2.45 1.15-4.13 1.15-3.18 0-5.87-2.15-6.83-5.06H1.18v3.56c2.01 4 6.13 6.7 10.82 6.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.17 14.74c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.6H1.18C.43 8.1.01 9.8.01 11.6c0 1.8.42 3.5 1.17 5l3.99-3.86z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.31 0 3.19 2.7 1.18 6.7l3.99 3.86c.96-2.91 3.65-5.06 6.83-5.06z"
                />
              </svg>
              <span>Hubungkan dengan Google</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400 font-medium">
            <Shield className="w-4 h-4 text-slate-300" />
            <span>Sesi dienkripsi secara lokal di LocalStorage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

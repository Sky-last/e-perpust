import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { ViewType } from '../types';

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

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { label: 'Kosong', score: 0, color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Lemah', score: 25, color: 'bg-red-500', text: 'text-red-500' };
    if (score === 2) return { label: 'Sedang', score: 50, color: 'bg-yellow-500', text: 'text-yellow-600' };
    if (score === 3) return { label: 'Kuat', score: 75, color: 'bg-blue-500', text: 'text-blue-500' };
    return { label: 'Sangat Kuat', score: 100, color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        addToast('Registrasi berhasil! Sesi login Anda telah aktif.', 'success');
        onNavigate('dashboard');
      } else {
        addToast('Email ini telah terdaftar! Silakan gunakan email lain.', 'error');
      }
    } catch (err: any) {
      setIsLoading(false);
      addToast(err.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
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
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500 text-center">
            Atau{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              sudah punya akun? Masuk di sini
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-100 rounded-[24px] border border-slate-100 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4.5 h-4.5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-10 py-2.5 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Minimal 5 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-semibold">
                    <span className="text-slate-500">Kekuatan Sandi:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-500`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-100 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <span>Registrasi Sekarang</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

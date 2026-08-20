import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Star, Phone } from 'lucide-react';
import { ViewType, Book } from '../types';
import Book3D from './Book3D';
import { soundFX } from '../utils/audio';
import { InteractiveMascot } from './InteractiveMascot';

interface RegisterPageProps {
  onNavigate: (view: ViewType) => void;
  onRegister: (name: string, email: string, pass: string, extraData?: { phone?: string }) => boolean | Promise<boolean>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function RegisterPage({ onNavigate, onRegister, addToast }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusEmail, setIsFocusEmail] = useState(false);
  const [isFocusPassword, setIsFocusPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      addToast('Semua kolom utama harus diisi!', 'error');
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
      const success = await onRegister(name, email, password, {
        phone
      });
      setIsLoading(false);
      if (success) {
        setIsSuccess(true);
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
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10 my-6">

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Keanggotaan Umum
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                Pustaka Digital Untuk Masyarakat Umum
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Nikmati akses gratis ke ribuan e-book, flipbook 3D, dan koleksi literasi untuk seluruh lapisan masyarakat.
              </p>
            </div>

            {/* Futuristic Holographic Digital Member Pass Animation */}
            <div className="hidden sm:flex my-6 justify-center py-2 relative group cursor-pointer">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-indigo-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />

              {/* Futuristic Pass Card */}
              <div className="relative w-full max-w-[280px] h-[170px] rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
                {/* Holographic shimmer line */}
                <div className="absolute -inset-full top-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer" />

                {/* Card Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      KARTU ANGGOTA PUBLIK
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
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider">PUBLIC MEMBER PASS</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-bold text-cyan-300">Masyarakat Umum & Pelajar</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end z-10 pt-2 border-t border-slate-800">
                  <span className="text-[9px] text-slate-400">Akses Publik 24/7</span>
                  <span className="text-[9px] font-mono text-cyan-300 font-bold">LITERASI BANGSA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
            {[
              'Bebas baca e-book 3D interaktif kapan saja',
              'Tanpa biaya pendaftaran — 100% Gratis!',
              'Terbuka untuk Umum, Pelajar, & Profesional',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="font-semibold text-[11px]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Modern Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center relative max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Interactive Mascot Reacting to Form Inputs */}
          <div className="mb-2">
            <InteractiveMascot
              isFocusEmail={isFocusEmail}
              isFocusPassword={isFocusPassword}
              showPassword={showPassword}
              emailLength={email.length || name.length}
              isSuccess={isSuccess}
            />
          </div>

          <div className="space-y-1 mb-5 text-center sm:text-left">
            <h3 className="text-2xl font-black text-white">Pendaftaran Anggota Umum</h3>
            <p className="text-xs text-slate-400 font-medium">
              Sudah memiliki akun?{' '}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('login');
                }}
                className="font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
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
                  onFocus={() => setIsFocusEmail(true)}
                  onBlur={() => setIsFocusEmail(false)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Grid 2 kolom: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  No. Telepon / WA
                </label>
                <div className="relative">
                  <Phone className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                  />
                </div>
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
                  onFocus={() => setIsFocusPassword(true)}
                  onBlur={() => setIsFocusPassword(false)}
                  placeholder="Minimal 5 karakter"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <span>Daftar Anggota Umum</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
            Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Pustaka Digital Publik.
          </div>
        </div>
      </div>
    </div>
  );
}


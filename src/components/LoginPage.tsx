import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Sparkles, CheckCircle2, AlertCircle, X, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewType, Book } from '../types';
import Book3D from './Book3D';
import { soundFX } from '../utils/audio';
import { InteractiveMascot } from './InteractiveMascot';
import { supabase, isSupabaseConfigured } from '../lib/supabase';


interface LoginPageProps {
  onNavigate: (view: ViewType) => void;
  onLogin: (email: string, password: string) => Promise<boolean | { success: boolean; message?: string }> | boolean | { success: boolean; message?: string };
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onGoogleAuth?: () => Promise<void>;
}

export default function LoginPage({ onNavigate, onLogin, addToast, onGoogleAuth }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusEmail, setIsFocusEmail] = useState(false);
  const [isFocusPassword, setIsFocusPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'password' | 'both' | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Forgot Password Modal States
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isLocalResetStep, setIsLocalResetStep] = useState(false);
  const [newLocalPassword, setNewLocalPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleOpenForgotPassword = (initialEmail?: string) => {
    soundFX.playClick();
    setResetEmail(initialEmail || email || '');
    setResetStatus('idle');
    setResetMessage(null);
    setIsLocalResetStep(false);
    setNewLocalPassword('');
    setIsForgotPasswordModalOpen(true);
  };

  const handleSendResetInstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setResetMessage(null);
    setResetStatus('idle');

    const trimmedResetEmail = resetEmail.trim();
    if (!trimmedResetEmail) {
      setResetStatus('error');
      setResetMessage('Silakan masukkan alamat email Anda terlebih dahulu.');
      soundFX.playError();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedResetEmail)) {
      setResetStatus('error');
      setResetMessage('Format email tidak valid (contoh: user@pustaka.com).');
      soundFX.playError();
      return;
    }

    setIsResetLoading(true);

    let supabaseSent = false;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedResetEmail, {
          redirectTo: `${window.location.origin}/?view=login`
        });
        if (!error) {
          supabaseSent = true;
        }
      } catch (err) {
        console.warn('Supabase reset password error:', err);
      }
    }

    setIsResetLoading(false);

    if (supabaseSent) {
      setResetStatus('success');
      setResetMessage(`Instruksi & tautan pemulihan kata sandi telah dikirim ke ${trimmedResetEmail}. Silakan periksa inbox atau folder spam email Anda.`);
      soundFX.playBookOpen();
      addToast('Tautan reset password berhasil dikirim ke email!', 'success');
      return;
    }

    // Check if user exists in local storage / demo users
    const savedUsersStr = localStorage.getItem('digital_library_users');
    let localUsers: any[] = [];
    try {
      if (savedUsersStr) localUsers = JSON.parse(savedUsersStr);
    } catch (e) {}

    const defaultDemoEmails = ['user@pustaka.com', 'admin@pustaka.com', 'staf@pustaka.com'];
    const existsLocally = localUsers.some((u: any) => u.email.toLowerCase() === trimmedResetEmail.toLowerCase()) ||
      defaultDemoEmails.includes(trimmedResetEmail.toLowerCase());

    if (existsLocally) {
      setIsLocalResetStep(true);
      setResetStatus('idle');
      setResetMessage('Akun terverifikasi. Masukkan kata sandi baru untuk akun Anda di bawah ini:');
      addToast('Akun ditemukan. Silakan buat password baru Anda.', 'info');
    } else {
      setResetStatus('success');
      setResetMessage(`Jika email ${trimmedResetEmail} terdaftar di sistem kami, instruksi pemulihan kata sandi telah dikirimkan ke email tersebut.`);
      soundFX.playBookOpen();
    }
  };

  const handleUpdateLocalPassword = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    if (!newLocalPassword || newLocalPassword.length < 4) {
      setResetStatus('error');
      setResetMessage('Password baru minimal harus 4 karakter!');
      soundFX.playError();
      return;
    }

    try {
      const savedUsersStr = localStorage.getItem('digital_library_users');
      let localUsers: any[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      const trimmedResetEmail = resetEmail.trim().toLowerCase();

      let userFound = false;
      localUsers = localUsers.map((u: any) => {
        if (u.email.toLowerCase() === trimmedResetEmail) {
          userFound = true;
          return { ...u, password: newLocalPassword };
        }
        return u;
      });

      if (!userFound) {
        localUsers.push({
          id: 'user-' + Date.now(),
          name: trimmedResetEmail.split('@')[0],
          email: trimmedResetEmail,
          password: newLocalPassword,
          role: trimmedResetEmail.includes('admin') ? 'admin' : trimmedResetEmail.includes('staf') ? 'staf' : 'siswa',
          badge: 'Reguler'
        });
      }

      localStorage.setItem('digital_library_users', JSON.stringify(localUsers));

      setPassword(newLocalPassword);
      setEmail(resetEmail);

      setResetStatus('success');
      setIsLocalResetStep(false);
      setResetMessage('Kata sandi Anda berhasil diperbarui! Silakan gunakan kata sandi baru ini untuk masuk.');
      soundFX.playBookOpen();
      addToast('Password berhasil diperbarui! Silakan masuk.', 'success');
    } catch (err: any) {
      setResetStatus('error');
      setResetMessage('Gagal memperbarui kata sandi. Silakan coba lagi.');
    }
  };

  // Pre-fill email from pending verification or previous login
  useEffect(() => {
    const pendingEmail = localStorage.getItem('pending_verification_email') || localStorage.getItem('digital_library_active_user') || '';
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  // Disable body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Showcase Book for Split Screen
  const showcaseBook: Book = {
    id: 'login-demo',
    title: 'Digital Library Modern',
    author: 'Pustaka Indonesia',
    publisher: 'Perpustakaan Kita',
    category: 'Sistem Digital',
    description: 'Sistem Perpustakaan Kita imersif dengan teknologi modern.',
    coverColor: 'from-blue-600 to-slate-900',
    rating: 4.9,
    year: 2026,
    status: 'Tersedia',
    isbn: '978-602-LOGIN-SYS',
  };

  const triggerError = (msg: string, field: 'email' | 'password' | 'both') => {
    setErrorMessage(msg);
    setErrorField(field);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    soundFX.playError();
    addToast(msg, 'error');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setErrorMessage(null);
    setErrorField(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail && !password) {
      triggerError('Email dan password wajib diisi!', 'both');
      return;
    }

    if (!trimmedEmail) {
      triggerError('Alamat email belum diisi!', 'email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      triggerError('Format email tidak valid (contoh: user@pustaka.com)!', 'email');
      return;
    }

    if (!password) {
      triggerError('Kata sandi / password wajib diisi!', 'password');
      return;
    }

    if (password.length < 4) {
      triggerError('Password minimal harus 4 karakter!', 'password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await onLogin(trimmedEmail, password);
      setIsLoading(false);

      const isSuccessResult = typeof result === 'boolean' ? result : result?.success;
      const responseMsg = typeof result === 'object' && result?.message ? result.message : undefined;

      if (isSuccessResult) {
        setIsSuccess(true);
        setErrorMessage(null);
        setErrorField(null);
        soundFX.playBookOpen();
      } else {
        const failureMessage = responseMsg || 'Email atau password yang Anda masukkan salah. Silakan periksa kembali.';
        const lower = failureMessage.toLowerCase();
        let targetField: 'email' | 'password' | 'both' = 'both';
        if (lower.includes('password') || lower.includes('kata sandi')) {
          targetField = 'password';
        } else if (lower.includes('email') || lower.includes('belum terdaftar')) {
          targetField = 'email';
        }

        triggerError(failureMessage, targetField);
      }
    } catch (err: any) {
      setIsLoading(false);
      const errText = err?.message || 'Gagal masuk ke sistem. Silakan periksa kembali kredensial Anda.';
      triggerError(errText, 'both');
    }
  };

  const handleGoogleLogin = async () => {
    soundFX.playClick();
    setErrorMessage(null);
    setErrorField(null);
    setIsLoading(true);
    try {
      if (onGoogleAuth) {
        await onGoogleAuth();
      } else {
        const result = await onLogin('user@pustaka.com', 'user');
        const isSuccessResult = typeof result === 'boolean' ? result : result?.success;
        if (isSuccessResult) {
          soundFX.playBookOpen();
        }
      }
    } catch (err: any) {
      triggerError(err.message || 'Gagal masuk menggunakan Google!', 'both');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex items-center justify-center p-2 sm:p-4 lg:p-8 font-sans relative overflow-hidden select-none">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10 my-2 sm:my-6 max-h-[98vh]">

        {/* LEFT PANEL: 3D Showcase */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
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
                Selamat Datang Kembali di Perpustakaan Kita
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Masuk ke akun Anda untuk melanjutkan riwayat bacaan dan unduhan buku.
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
                    <h4 className="text-sm font-black text-white mt-1">Perpustakaan Kita</h4>
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
                  <span className="text-[9px] font-mono text-blue-300 font-bold">PERPUSTAKAAN KITA</span>
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
              isError={Boolean(errorMessage)}
            />
          </div>

          <div className="space-y-1 mb-4 text-center sm:text-left">
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

          {/* ALERT NOTIFIKASI ERROR (SALAH PASSWORD / EMAIL) */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="alert"
                aria-live="assertive"
                className={`mb-4 p-3.5 sm:p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 shadow-xl shadow-rose-950/40 backdrop-blur-md flex items-start gap-3 relative overflow-hidden ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-rose-500 to-red-600 rounded-l" />
                <div className="p-1.5 rounded-xl bg-rose-500/25 text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xs sm:text-sm text-rose-300 tracking-tight">
                      {errorField === 'password'
                        ? 'Password Tidak Sesuai!'
                        : errorField === 'email'
                        ? 'Email Belum Sesuai!'
                        : 'Kredensial Login Salah!'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setErrorField(null);
                      }}
                      className="text-rose-400/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-rose-500/20 cursor-pointer"
                      aria-label="Tutup pesan peringatan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-rose-200/90 font-medium mt-1 leading-relaxed">
                    {errorMessage}
                  </p>
                  
                  {/* Actionable quick hints inside the alert */}
                  {errorField === 'password' && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-rose-300/80">Lupa kata sandi Anda?</span>
                      <button
                        type="button"
                        onClick={() => handleOpenForgotPassword(email)}
                        className="font-bold text-rose-300 hover:text-white underline cursor-pointer"
                      >
                        Reset Kata Sandi
                      </button>
                    </div>
                  )}

                  {errorField === 'email' && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-rose-300/80">Belum pernah mendaftar?</span>
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playClick();
                          onNavigate('register');
                        }}
                        className="font-bold text-rose-300 hover:text-white underline cursor-pointer"
                      >
                        Daftar Akun Baru
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className={`w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  errorField === 'email' || errorField === 'both' ? 'text-rose-400' : 'text-slate-500'
                }`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) {
                      setErrorMessage(null);
                      setErrorField(null);
                    }
                  }}
                  onFocus={() => setIsFocusEmail(true)}
                  onBlur={() => setIsFocusEmail(false)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-medium ${
                    errorField === 'email' || errorField === 'both'
                      ? 'border-rose-500/80 ring-2 ring-rose-500/25 bg-rose-950/20 text-rose-100 placeholder-rose-300/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              </div>
              {(errorField === 'email' || errorField === 'both') && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Pastikan alamat email Anda sudah terdaftar dan pengetikannya benar.</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleOpenForgotPassword(email)}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className={`w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  errorField === 'password' || errorField === 'both' ? 'text-rose-400' : 'text-slate-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) {
                      setErrorMessage(null);
                      setErrorField(null);
                    }
                  }}
                  onFocus={() => setIsFocusPassword(true)}
                  onBlur={() => setIsFocusPassword(false)}
                  placeholder="Masukkan password Anda..."
                  className={`w-full pl-10 pr-10 py-3 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-medium ${
                    errorField === 'password' || errorField === 'both'
                      ? 'border-rose-500/80 ring-2 ring-rose-500/25 bg-rose-950/20 text-rose-100 placeholder-rose-300/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(errorField === 'password' || errorField === 'both') && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Kata sandi tidak sesuai. Periksa huruf besar/kecil atau spasi.</span>
                </p>
              )}
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
              <span>Masuk dengan Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {isForgotPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => {
              setIsForgotPasswordModalOpen(false);
              setResetStatus('idle');
              setIsLocalResetStep(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 relative overflow-hidden"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsForgotPasswordModalOpen(false);
                  setResetStatus('idle');
                  setIsLocalResetStep(false);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Icon & Title */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Lupa Kata Sandi?</h3>
                  <p className="text-xs text-slate-400 font-medium">Pemulihan akses akun Perpustakaan Kita</p>
                </div>
              </div>

              {/* Feedback messages */}
              {resetMessage && (
                <div className={`mb-4 p-3.5 rounded-2xl text-xs font-medium border flex items-start gap-2.5 ${
                  resetStatus === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                    : resetStatus === 'error'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    : 'bg-blue-500/15 border-blue-500/30 text-blue-200'
                }`}>
                  {resetStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : resetStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 leading-relaxed">{resetMessage}</div>
                </div>
              )}

              {/* Form step 1: Request Reset */}
              {!isLocalResetStep && resetStatus !== 'success' && (
                <form onSubmit={handleSendResetInstruction} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Alamat Email Terdaftar
                    </label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="contoh: user@pustaka.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setIsForgotPasswordModalOpen(false);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isResetLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isResetLoading ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Kirim Instruksi Reset</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Form step 2: Direct Reset for Local/Demo accounts */}
              {isLocalResetStep && (
                <form onSubmit={handleUpdateLocalPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newLocalPassword}
                        onChange={(e) => setNewLocalPassword(e.target.value)}
                        placeholder="Masukkan password baru..."
                        className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Minimal 4 karakter.</p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setIsLocalResetStep(false);
                        setResetStatus('idle');
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan Password Baru</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Done / Success Close action */}
              {resetStatus === 'success' && !isLocalResetStep && (
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setIsForgotPasswordModalOpen(false);
                      setResetStatus('idle');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Kembali ke Form Login
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

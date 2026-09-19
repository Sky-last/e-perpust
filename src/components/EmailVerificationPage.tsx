import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink,
  Edit2,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { ViewType } from '../types';
import { supabase } from '../lib/supabase';
import { soundFX } from '../utils/audio';

interface EmailVerificationPageProps {
  onNavigate: (view: ViewType) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function EmailVerificationPage({ onNavigate, addToast }: EmailVerificationPageProps) {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmailValue, setEditEmailValue] = useState('');

  // Pastikan body scroll tidak terkunci secara permanen
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Muat email yang sedang menunggu verifikasi
  useEffect(() => {
    const pendingEmail = localStorage.getItem('pending_verification_email') || '';
    setEmail(pendingEmail);
    setEditEmailValue(pendingEmail);
  }, []);

  // Timer countdown untuk tombol kirim ulang
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Simpan perubahan email jika user salah ketik saat registrasi
  const handleSaveEditedEmail = () => {
    const trimmed = editEmailValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      addToast('Format email tidak valid!', 'error');
      return;
    }
    setEmail(trimmed);
    localStorage.setItem('pending_verification_email', trimmed);
    setIsEditingEmail(false);
    addToast('Alamat email diperbarui. Klik kirim ulang untuk mengirim verifikasi ke email baru.', 'info');
  };

  // Kirim ulang email verifikasi
  const handleResendEmail = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      addToast('Silakan masukkan alamat email yang valid!', 'error');
      setIsEditingEmail(true);
      return;
    }

    if (!canResend) return;

    soundFX.playClick();
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        // Terjemahkan pesan error agar ramah dan informatif bagi pengguna
        if (error.message.includes('rate limit') || (error as any).code === 'over_email_send_rate_limit') {
          addToast('⏳ Batas pengiriman email tercapai (kebijakan keamanan). Mohon tunggu beberapa saat sebelum mencoba lagi atau periksa folder Spam.', 'error');
          setCountdown(120);
        } else if (error.message.includes('already confirmed') || error.message.includes('already registered')) {
          addToast('✅ Email ini sudah terverifikasi sebelumnya! Anda dapat langsung login.', 'success');
        } else {
          addToast('Gagal mengirim ulang email: ' + error.message, 'error');
        }
      } else {
        addToast('✅ Email verifikasi berhasil dikirim ulang! Cek inbox atau folder Spam Anda.', 'success');
        setCountdown(60);
      }
    } catch (err: any) {
      addToast('Terjadi kesalahan: ' + (err.message || 'Gagal terhubung ke server'), 'error');
    } finally {
      setIsResending(false);
    }
  };

  // Cek status verifikasi secara mandiri
  const handleCheckStatus = async () => {
    soundFX.playClick();
    setIsCheckingStatus(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        addToast('🎉 Selamat! Email Anda sudah terverifikasi. Mengalihkan...', 'success');
        localStorage.removeItem('pending_verification_email');
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
        return;
      }

      if (error) {
        console.log('Verification check status note:', error.message);
      }

      // Jika session lokal belum diperbarui, beri panduan untuk login langsung
      addToast('Status: Menunggu konfirmasi email. Pastikan Anda telah mengklik link yang dikirim ke email, atau coba Login sekarang.', 'info');
    } catch (err: any) {
      addToast('Gagal memeriksa status: ' + err.message, 'error');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 py-12 relative overflow-y-auto font-sans selection:bg-blue-500 selection:text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-32 -left-32 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Bar / Back Button */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            soundFX.playClick();
            onNavigate('login');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl backdrop-blur-md border border-slate-700/60 transition-all text-xs font-semibold cursor-pointer shadow-sm hover:scale-[1.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
          <span>Kembali ke Halaman Login</span>
        </button>

        <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
          Perpustakaan Kita Digital
        </span>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* Icon Header */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/25"
          >
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl -z-10 opacity-60 animate-pulse" />
          </motion.div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-white text-center mb-1.5 tracking-tight">
            Verifikasi Email Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 text-center mb-6 max-w-md mx-auto leading-relaxed">
            Link aktivasi telah dikirimkan. Silakan periksa kotak masuk email Anda untuk mengaktifkan akun.
          </p>

          {/* Email Box with Edit Capability */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-5 shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Alamat Email Terdaftar
              </span>
              {!isEditingEmail && (
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {isEditingEmail ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="email"
                  value={editEmailValue}
                  onChange={(e) => setEditEmailValue(e.target.value)}
                  placeholder="Masukkan email yang benar..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-blue-500/50 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveEditedEmail}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Simpan"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditEmailValue(email);
                    setIsEditingEmail(false);
                  }}
                  className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                  title="Batal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-white font-bold tracking-wide break-all mt-0.5">
                {email || <span className="text-amber-400 font-normal italic text-xs">Belum ada email yang ditentukan. Klik 'Ubah' untuk mengisi.</span>}
              </p>
            )}
          </div>

          {/* Critical Warning: Check Spam / Junk */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <p className="font-bold text-amber-300 text-xs mb-0.5">
                Email verifikasi belum masuk ke Inbox?
              </p>
              <p>
                Sistem otomatis sering dialihkan ke folder <strong className="text-amber-300 underline font-extrabold">Spam</strong>, <strong className="text-amber-300 underline font-extrabold">Junk</strong>, atau <strong className="text-amber-300 font-extrabold">Promosi</strong>. Silakan periksa folder tersebut dan klik <em>"Bukan Spam"</em>.
              </p>
            </div>
          </div>

          {/* Quick Webmail Shortcuts */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Buka Penyedia Email Anda:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Gmail</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://mail.yahoo.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Yahoo</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Outlook</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Step Instructions */}
          <div className="space-y-2.5 mb-6 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Langkah 1:</strong> Buka email konfirmasi dari sistem perpustakaan.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Langkah 2:</strong> Klik tombol atau tautan <em>"Confirm your email"</em> di dalamnya.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-purple-400" />
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Langkah 3:</strong> Akun Anda akan langsung aktif dan otomatis siap digunakan membaca buku!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Cek Status Button */}
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>{isCheckingStatus ? 'Memeriksa Status Akun...' : 'Saya Sudah Klik Link (Cek Status)'}</span>
            </button>

            {/* Kirim Ulang Email Button */}
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border ${
                canResend && !isResending
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-600 cursor-pointer shadow-md'
                  : 'bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed'
              }`}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Mengirim Ulang...</span>
                </>
              ) : canResend ? (
                <>
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Kirim Ulang Email Verifikasi</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-400/80" />
                  <span>Kirim ulang tersedia dalam {countdown} detik</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Note & Direct Login */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>Sudah melakukan verifikasi?</span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onNavigate('login');
              }}
              className="text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>Masuk ke Akun Anda &rarr;</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { ViewType } from '../types';
import { supabase } from '../lib/supabase';
import { soundFX } from '../utils/audio';

interface EmailVerificationPageProps {
  onNavigate: (view: ViewType) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onBypassVerification?: (email: string) => void;
}

export default function EmailVerificationPage({ onNavigate, addToast, onBypassVerification }: EmailVerificationPageProps) {
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
        if (error.message.includes('rate limit') || (error as any).code === 'over_email_send_rate_limit') {
          addToast('⏳ Kuota pengiriman email Supabase tercapai (3 email/jam). Mohon periksa folder SPAM atau gunakan tombol Masuk Langsung di bawah.', 'error');
          setCountdown(120);
        } else if (error.message.includes('already confirmed') || error.message.includes('already registered')) {
          addToast('✅ Email ini sudah terverifikasi sebelumnya! Anda dapat langsung login.', 'success');
        } else {
          addToast('Gagal mengirim ulang email: ' + error.message, 'error');
        }
      } else {
        addToast('✅ Email verifikasi telah dikirim ulang! Buka folder SPAM jika tidak ada di Inbox.', 'success');
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
        }, 1000);
        return;
      }

      if (error) {
        console.log('Verification check status note:', error.message);
      }

      addToast('Status: Belum terverifikasi. Pastikan Anda telah mengklik link di dalam email (cek folder Spam), atau gunakan tombol Masuk Langsung di bawah.', 'info');
    } catch (err: any) {
      addToast('Gagal memeriksa status: ' + err.message, 'error');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const isGmail = email.toLowerCase().includes('@gmail.com');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 py-10 relative overflow-y-auto font-sans selection:bg-blue-500 selection:text-white">
      {/* Ambient glowing background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl -top-32 -left-32 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Navigation back bar */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('login');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl backdrop-blur-md border border-slate-700/60 transition-all text-xs font-semibold cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Kembali ke Halaman Login</span>
          </button>

          <span className="text-[11px] font-bold text-slate-400">
            Perpustakaan Kita Digital
          </span>
        </div>

        <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Gradient Top Header */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* Mail Animated Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/25"
          >
            <Mail className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl -z-10 opacity-60 animate-pulse" />
          </motion.div>

          {/* Header Title */}
          <h1 className="text-xl sm:text-2xl font-black text-white text-center mb-1.5 tracking-tight">
            Verifikasi Email Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 text-center mb-5 max-w-sm mx-auto leading-relaxed">
            Link aktivasi telah dikirimkan ke alamat email Anda.
          </p>

          {/* Registered Email Display Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-5 shadow-inner">
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
                  className="flex-1 px-3 py-2 bg-slate-900 border border-blue-500/60 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveEditedEmail}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
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
                {email || <span className="text-amber-400 font-normal italic text-xs">Belum ada email. Klik 'Ubah' untuk mengisi.</span>}
              </p>
            )}
          </div>

          {/* SPAM / JUNK CRITICAL ALERT */}
          <div className="bg-amber-500/10 border border-amber-500/35 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <p className="font-bold text-amber-300 text-xs mb-1">
                  Email tidak ada di Inbox utama?
                </p>
                <p>
                  Sistem otomatis dari Supabase sering kali masuk ke folder <strong className="text-amber-200 underline font-black">SPAM</strong> atau <strong className="text-amber-200 underline font-black">JUNK</strong>.
                </p>
              </div>
            </div>

            {/* Direct Open Spam Button for Gmail */}
            {isGmail && (
              <a
                href="https://mail.google.com/mail/u/0/#spam"
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Buka Folder Spam Gmail Sekarang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Webmail Shortcuts Grid */}
          <div className="mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Buka Penyedia Email:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Gmail</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://mail.yahoo.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Yahoo</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>Outlook</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 mb-5">
            {/* Cek Status Button */}
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>{isCheckingStatus ? 'Memeriksa Status Akun...' : 'Saya Sudah Klik Link (Cek Status)'}</span>
            </button>

            {/* Kirim Ulang Email Button */}
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border ${
                canResend && !isResending
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-600 cursor-pointer shadow-md'
                  : 'bg-slate-950/80 text-slate-500 border-slate-800/80 cursor-not-allowed'
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
                  <span>Kirim ulang tersedia dalam {countdown}s</span>
                </>
              )}
            </button>
          </div>

          {/* BYPASS / FALLBACK OPTION IF SUPABASE SMTP FAILS */}
          {onBypassVerification && (
            <div className="pt-3 border-t border-slate-800/90 text-center">
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3 mb-2">
                <p className="text-[11px] text-blue-200 mb-2 leading-relaxed">
                  Email tetap tidak kunjung masuk karena batas server email Supabase?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onBypassVerification(email || 'user@pustaka.com');
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Aktifkan Akun & Masuk Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Note & Direct Login */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Sudah pernah verifikasi?</span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onNavigate('login');
              }}
              className="text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>Masuk ke Akun &rarr;</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

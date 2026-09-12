import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Clock, Shield, Sparkles } from 'lucide-react';
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
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get pending email from localStorage
    const pendingEmail = localStorage.getItem('pending_verification_email');
    if (pendingEmail) {
      setEmail(pendingEmail);
    }

    // Countdown timer for resend button
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendEmail = async () => {
    if (!email || !canResend) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        addToast('Gagal mengirim ulang email: ' + error.message, 'error');
      } else {
        addToast('✅ Email verifikasi berhasil dikirim ulang! Cek inbox Anda.', 'success');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err: any) {
      addToast('Error: ' + err.message, 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          soundFX.playClick();
          localStorage.removeItem('pending_verification_email');
          onNavigate('login');
        }}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all text-sm font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Login</span>
      </button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative"
          >
            <Mail className="w-10 h-10 text-white" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl -z-10"
            />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-black text-white text-center mb-2">
            Verifikasi Email Anda
          </h2>
          <p className="text-sm text-slate-400 text-center mb-6">
            Kami telah mengirim link verifikasi ke email Anda
          </p>

          {/* Email Display */}
          {email && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Terdaftar</p>
                <p className="text-sm text-white font-bold truncate">{email}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Cek Inbox Email</p>
                <p className="text-xs text-slate-400 mt-0.5">Buka email dari Perpustakaan Kita</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Klik Link Verifikasi</p>
                <p className="text-xs text-slate-400 mt-0.5">Link valid selama 24 jam</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Login & Mulai Baca!</p>
                <p className="text-xs text-slate-400 mt-0.5">Akses ribuan buku digital gratis</p>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-400">Tidak Menerima Email?</p>
                <p className="text-xs text-amber-300/80 mt-1">
                  Periksa folder <span className="font-bold">Spam/Junk</span> atau klik tombol kirim ulang di bawah
                </p>
              </div>
            </div>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            disabled={!canResend || isResending}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              canResend && !isResending
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : canResend ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Kirim Ulang Email Verifikasi</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span>Kirim Ulang dalam {countdown}s</span>
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-6">
            Sudah verifikasi?{' '}
            <button
              onClick={() => {
                soundFX.playClick();
                localStorage.removeItem('pending_verification_email');
                onNavigate('login');
              }}
              className="text-blue-400 hover:text-blue-300 font-bold cursor-pointer underline"
            >
              Login sekarang
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

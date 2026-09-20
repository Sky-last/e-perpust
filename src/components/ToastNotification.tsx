import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastNotificationProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed top-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto sm:max-w-md z-[99999] flex flex-col gap-2.5 pointer-events-none font-sans">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-500/10 text-emerald-300',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300'
    },
    error: {
      bg: 'bg-slate-900/95 border-rose-500/40 shadow-rose-500/10 text-rose-300',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300'
    },
    info: {
      bg: 'bg-slate-900/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-300',
      icon: Info,
      iconColor: 'text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300'
    }
  }[toast.type];

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-center justify-between p-3.5 sm:p-4 border rounded-2xl shadow-2xl backdrop-blur-xl ${config.bg} w-full`}
    >
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
          <Icon className={`w-4.5 h-4.5 ${config.iconColor}`} />
        </div>
        <p className="text-xs font-bold text-white leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer ml-2"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { key?: string; toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: 'bg-white border-emerald-100 shadow-emerald-50',
      text: 'text-emerald-800',
      icon: CheckCircle,
      iconColor: 'text-emerald-500'
    },
    error: {
      bg: 'bg-white border-red-100 shadow-red-50',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    info: {
      bg: 'bg-white border-blue-100 shadow-blue-50',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className={`pointer-events-auto flex items-center justify-between p-3.5 border rounded-2xl shadow-lg ${config.bg} transition-all duration-300 transform translate-y-0 scale-100 animate-slideIn`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`text-xs font-bold ${config.text}`}>{toast.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 pl-3 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

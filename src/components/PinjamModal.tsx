import React, { useState } from 'react';
import { Book, User } from '../types';
import { X, Calendar, Shield, Sparkles } from 'lucide-react';

interface PinjamModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  currentUser: User | null;
  onConfirmPinjam: (bookId: string, durationDays: number) => void;
}

export default function PinjamModal({
  isOpen,
  onClose,
  book,
  currentUser,
  onConfirmPinjam
}: PinjamModalProps) {
  const [duration, setDuration] = useState(7);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen || !book || !currentUser) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onConfirmPinjam(book.id, duration);
  };

  const isPremium = currentUser.badge === 'Premium';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Overlay backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Modal box */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-md rounded-[24px] border border-slate-100 p-6 shadow-2xl space-y-6 animate-fadeIn">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="space-y-1 pr-6">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Formulir Peminjaman Digital</h3>
            <p className="text-slate-400 text-xs">Silakan tentukan durasi pengembalian buku di bawah.</p>
          </div>

          {/* Miniature book info card */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-[16px] flex items-center space-x-3.5">
            <div className={`w-10 h-13 rounded bg-gradient-to-tr ${book.coverColor} p-1 text-white flex flex-col justify-between shadow-xs flex-shrink-0`}>
              <span className="text-[4px] uppercase font-bold opacity-60 leading-none">{book.category}</span>
              <span className="text-[6px] font-extrabold leading-tight line-clamp-3">{book.title}</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{book.title}</h4>
              <p className="text-[10px] text-slate-500">Penulis: {book.author}</p>
              <p className="text-[9px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
            </div>
          </div>

          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Duration select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Durasi Pinjam</label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDuration(7)}
                  className={`py-2.5 px-4 border rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${duration === 7 ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>7 Hari Kalender</span>
                  <span className="text-[9px] font-medium opacity-75">Jatah Reguler</span>
                </button>

                <button
                  type="button"
                  disabled={!isPremium}
                  onClick={() => setDuration(14)}
                  className={`py-2.5 px-4 border rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 relative ${
                    !isPremium 
                      ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60' 
                      : duration === 14 ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={!isPremium ? "Tersedia khusus Anggota Premium" : "Dua minggu"}
                >
                  {!isPremium && (
                    <span className="absolute -top-2 right-2 bg-blue-600 text-white text-[7px] font-extrabold px-1 rounded-full flex items-center space-x-0.5">
                      <Sparkles className="w-2 h-2 fill-current" />
                      <span>PRO</span>
                    </span>
                  )}
                  <span>14 Hari Kalender</span>
                  <span className="text-[9px] font-medium opacity-75">Spesial Premium</span>
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start space-x-2.5 pt-2">
              <input
                id="agreed"
                name="agreed"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="agreed" className="text-[11px] text-slate-500 leading-normal cursor-pointer select-none">
                Saya menyetujui seluruh syarat & ketentuan peminjaman siber perpustakaan digital, serta bersedia mengembalikan buku tepat waktu sebelum batas tempo.
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!agreed}
                className={`w-full py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-100 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  agreed 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Calendar className="w-4.5 h-4.5" />
                <span>Konfirmasi Peminjaman Buku</span>
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 text-center">
            <Shield className="w-3.5 h-3.5" />
            <span>Hak baca digital dilindungi oleh enkripsi server.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

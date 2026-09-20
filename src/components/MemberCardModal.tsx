/**
 * MemberCardModal - Kartu Anggota Perpustakaan (Print-Ready)
 */

import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CreditCard, BookOpen, CheckCircle, Star, Award, Shield } from 'lucide-react';
import { User } from '../types';
import { resolveUserMemberId } from '../utils/memberId';

interface MemberCardModalProps {
  user: User;
  libraryName?: string;
  onClose: () => void;
}

function fmtDate(): string {
  return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function expiryDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 3);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function BarcodeStripes({ value }: { value: string }) {
  const stripes: boolean[] = [];
  for (let i = 0; i < 60; i++) {
    const code = value.charCodeAt(i % value.length);
    stripes.push((code + i) % 3 !== 0);
  }
  return (
    <svg viewBox="0 0 60 20" className="w-full h-5" preserveAspectRatio="none">
      {stripes.map((thick, i) => (
        <rect key={i} x={i} y={0} width={thick ? 0.7 : 0.35} height={20} fill="currentColor" opacity={thick ? 1 : 0.5} />
      ))}
    </svg>
  );
}

export default function MemberCardModal({ user, libraryName = 'Perpustakaan Kita', onClose }: MemberCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const memberId = resolveUserMemberId(user);
  const isPremium = user.badge === 'Premium';

  const handlePrint = useCallback(() => {
    const originalTitle = document.title;
    document.title = `Kartu Anggota - ${user.name}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  }, [user.name]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">Kartu Anggota</h2>
                <p className="text-[10px] text-slate-400 font-semibold">Pratinjau &amp; Cetak</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Preview */}
          <div className="p-5 bg-gradient-to-b from-slate-50 to-white">
            <div
              ref={cardRef}
              id="member-card-print"
              className={`relative rounded-2xl overflow-hidden shadow-xl select-none ${isPremium ? 'bg-gradient-to-br from-[#1a1209] via-[#2d1f06] to-[#0f0d08]' : 'bg-gradient-to-br from-[#0f1f10] via-[#1a2f1b] to-[#0a180b]'}`}
              style={{ aspectRatio: '85.6/54', minHeight: 195 }}
            >
              {/* Decorative glows */}
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20 blur-2xl" style={{ background: isPremium ? '#D4A74A' : '#4CAF82' }} />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-15 blur-xl" style={{ background: isPremium ? '#F59E0B' : '#22C55E' }} />

              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${isPremium ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400' : 'bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400'}`} />

              <div className="relative z-10 p-4 sm:p-5 h-full flex flex-col justify-between">

                {/* TOP ROW */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}>
                      <BookOpen className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none ${isPremium ? 'text-amber-300' : 'text-emerald-300'}`}>{libraryName}</p>
                      <p className="text-[7px] text-white/40 font-semibold uppercase tracking-wider leading-tight mt-0.5">Kartu Anggota Resmi</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-wide border ${isPremium ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30'}`}>
                    {isPremium ? <Star className="w-2.5 h-2.5 fill-current" /> : <CheckCircle className="w-2.5 h-2.5" />}
                    {user.badge || 'Reguler'}
                  </div>
                </div>

                {/* MIDDLE ROW */}
                <div className="flex items-center gap-3 mt-3">
                  <div className={`relative shrink-0 w-12 h-12 rounded-xl overflow-hidden ring-2 ${isPremium ? 'ring-amber-400/60' : 'ring-emerald-400/50'} shadow-lg`}>
                    {user.avatarUrl || user.avatar ? (
                      <img src={user.avatarUrl || user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-xl font-black ${isPremium ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-amber-100' : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-emerald-100'}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-black text-[11px] leading-tight truncate">{user.name}</h3>
                    <p className={`text-[9px] font-bold mt-0.5 truncate ${isPremium ? 'text-amber-300' : 'text-emerald-300'}`}>{user.memberCategory || user.class || 'Masyarakat Umum'}</p>
                    <p className="text-white/50 text-[8px] font-semibold mt-0.5 truncate">{user.institution || user.occupation || user.address || 'Anggota Perpustakaan'}</p>
                  </div>
                  <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${isPremium ? 'bg-amber-400/20' : 'bg-emerald-400/15'}`}>
                    {isPremium ? <Award className="w-4 h-4 text-amber-400" /> : <Shield className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-[7px] uppercase tracking-wider font-bold mb-0.5">No. Anggota</p>
                    <p className={`font-mono font-black text-sm leading-none tracking-wider ${isPremium ? 'text-amber-300' : 'text-emerald-300'}`}>{memberId}</p>
                    <div className="flex gap-3 mt-1.5">
                      <div>
                        <p className="text-white/30 text-[6px] uppercase tracking-wider font-bold">Berlaku Dari</p>
                        <p className="text-white/60 text-[8px] font-bold">{fmtDate()}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[6px] uppercase tracking-wider font-bold">Berlaku s.d.</p>
                        <p className="text-white/60 text-[8px] font-bold">{expiryDate()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 w-24 text-right">
                    <div className={isPremium ? 'text-amber-400/70' : 'text-emerald-400/70'}>
                      <BarcodeStripes value={memberId} />
                    </div>
                    <p className="text-[6px] font-mono text-white/30 mt-0.5 tracking-widest text-right">{memberId}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-3 font-semibold">
              Kartu anggota ini merupakan identitas resmi pemustaka • {libraryName}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/30'}`}
            >
              <Printer className="w-4 h-4" />
              Cetak Kartu
            </button>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #member-card-print,
          #member-card-print * { visibility: visible !important; }
          #member-card-print {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 85.6mm !important;
            height: 54mm !important;
            border-radius: 4mm !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Phone, 
  CreditCard, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { User } from '../types';
import { soundFX } from '../utils/audio';

interface CompleteProfileModalProps {
  user: User;
  onSave: (data: {
    name: string;
    memberCategory: string;
    identityNumber: string;
    phone: string;
    institution: string;
    address: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  user,
  onSave,
  isLoading = false,
}) => {
  const [name, setName] = useState(user.name || '');
  const [memberCategory, setMemberCategory] = useState<'Mahasiswa' | 'Pelajar / Siswa' | 'Masyarakat Umum'>(
    (user.memberCategory as any) || 'Mahasiswa'
  );
  const [identityNumber, setIdentityNumber] = useState(user.identityNumber || user.nisn || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [institution, setInstitution] = useState(user.institution || user.class || '');
  const [address, setAddress] = useState(user.address || '');
  const [errorMessage, setErrorMessage] = useState('');

  const isGoogleUser = user.authProvider === 'google' || Boolean(user.avatarUrl?.includes('googleusercontent.com'));

  const getIdentityConfig = () => {
    switch (memberCategory) {
      case 'Mahasiswa':
        return {
          label: 'Nomor Induk Mahasiswa (NIM)',
          placeholder: 'Contoh: 2110512048 / 202611009',
          institutionLabel: 'Universitas & Program Studi',
          institutionPlaceholder: 'Contoh: Universitas Indonesia - Teknik Informatika',
        };
      case 'Pelajar / Siswa':
        return {
          label: 'Nomor Induk Siswa Nasional (NISN)',
          placeholder: 'Contoh: 0054321987',
          institutionLabel: 'Nama Sekolah & Tingkat Kelas',
          institutionPlaceholder: 'Contoh: SMAN 1 Bandung - Kelas 12 IPA',
        };
      default:
        return {
          label: 'Nomor Induk Kependudukan (NIK / KTP)',
          placeholder: 'Contoh: 3271012304980005',
          institutionLabel: 'Instansi / Profesi / Perusahaan',
          institutionPlaceholder: 'Contoh: Kementerian / Swasta / Freelance',
        };
    }
  };

  const config = getIdentityConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    soundFX.playClick();

    if (!name.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    if (!identityNumber.trim()) {
      setErrorMessage(`${config.label} wajib diisi sebagai identitas resmi keanggotaan.`);
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp / HP wajib diisi untuk kontak notifikasi.');
      return;
    }

    if (phone.trim().length < 9) {
      setErrorMessage('Format nomor telepon / WhatsApp tidak valid.');
      return;
    }

    if (!institution.trim()) {
      setErrorMessage(`${config.institutionLabel} wajib diisi.`);
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        memberCategory,
        identityNumber: identityNumber.trim(),
        phone: phone.trim(),
        institution: institution.trim(),
        address: address.trim(),
      });
      soundFX.playBookOpen();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan profil. Silakan coba lagi.');
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient effects */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-slate-900/95 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-blue-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
                  {user.avatarUrl || user.avatar ? (
                    <img 
                      src={user.avatarUrl || user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Lengkapi Profil Anggota
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3 h-3" /> Wajib
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Satu langkah lagi sebelum mengakses katalog buku digital dan dashboard
                  </p>
                </div>
              </div>

              {/* Google Verified Account pill */}
              <div className="flex items-center gap-2 bg-slate-800/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left leading-none">
                  <span className="text-[10px] font-bold text-emerald-400 block">
                    {isGoogleUser ? 'Akun Google Terverifikasi' : 'Email Terverifikasi'}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate block max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Nama Lengkap (Sesuai Kartu Identitas) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Kategori Keanggotaan & Nomor Identitas (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kategori Keanggotaan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kategori Keanggotaan <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={memberCategory}
                    onChange={(e) => setMemberCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="Mahasiswa" className="bg-slate-900 text-white">Mahasiswa (Perguruan Tinggi)</option>
                    <option value="Pelajar / Siswa" className="bg-slate-900 text-white">Pelajar / Siswa (SD/SMP/SMA)</option>
                    <option value="Masyarakat Umum" className="bg-slate-900 text-white">Masyarakat Umum</option>
                  </select>
                </div>
              </div>

              {/* Nomor Identitas Dinamis (NIM/NISN/NIK) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {config.label} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Instansi / Jurusan & WhatsApp (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instansi / Jurusan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {config.institutionLabel} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder={config.institutionPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Nomor WhatsApp / HP */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Nomor WhatsApp / HP Aktif <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Domisili */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Alamat Domisili / Kota Tempat Tinggal
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Sudirman No. 45, Jakarta Selatan"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Privasi dan Info */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Data keanggotaan ini digunakan untuk penerbitan <strong>Kartu Anggota Digital</strong> dan hak akses penuh ke koleksi e-book di Perpustakaan Kita.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 text-xs hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Simpan & Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompleteProfileModal;

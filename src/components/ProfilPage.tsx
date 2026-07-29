import React, { useState } from 'react';
import { User } from '../types';
import { Award, Shield, User as UserIcon, Mail, Lock, Check, Save } from 'lucide-react';

interface ProfilPageProps {
  currentUser: User;
  onUpdateProfile: (name: string, email: string) => void;
  onChangePassword: (password: string) => void;
  favoritesCount: number;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ProfilPage({
  currentUser,
  onUpdateProfile,
  onChangePassword,
  favoritesCount,
  addToast
}: ProfilPageProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Nama dan email wajib diisi!', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Format email tidak valid!', 'error');
      return;
    }

    onUpdateProfile(name, email);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      addToast('Silakan isi kata sandi baru dan konfirmasi kata sandi!', 'error');
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

    onChangePassword(password);
    setPassword('');
    setConfirmPassword('');
  };

  const userBorrowings = currentUser.borrowings || [];
  const activeBorrowCount = userBorrowings.filter(b => b.status === 'Sedang Dipinjam').length;
  const historyBorrowCount = userBorrowings.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Profil Pengguna</h1>
        <p className="text-slate-400 text-xs md:text-sm">Kelola informasi pribadi, amankan akun, dan pantau status keanggotaan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 text-center space-y-4 relative overflow-hidden shadow-xs">
            {/* Gradient decoration */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-extrabold uppercase shadow-xs">
              {currentUser.name.substring(0, 2)}
            </div>

            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-800 text-lg">{currentUser.name}</h2>
              <p className="text-slate-400 text-xs">{currentUser.email}</p>
            </div>

            <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              <Award className="w-4 h-4" />
              <span>Anggota {currentUser.badge}</span>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-slate-800">{activeBorrowCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Aktif Pinjam</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{favoritesCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Favorit</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{historyBorrowCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Pinjam</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 rounded-[20px] space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono text-slate-400">Tingkat Anggota</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Batas Pinjam 5 Buku</h4>
                  <p className="text-slate-500 text-[10px]">Sebagai anggota {currentUser.badge}, Anda berhak meminjam hingga maksimal 5 buku sekaligus.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Akses Eksklusif Cover AI</h4>
                  <p className="text-slate-500 text-[10px]">Nikmati cover buku digital bertenaga AI visual yang menakjubkan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Info Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Perbarui Informasi Profil</h3>
              <p className="text-slate-400 text-xs">Edit informasi personal dasar Anda di database perpustakaan.</p>
            </div>

            <form onSubmit={handleUpdateInfo} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800"
                    placeholder="Nama Lengkap"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Alamat Email</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800"
                    placeholder="Alamat Email"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-100 cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Informasi</span>
                </button>
              </div>
            </form>
          </div>

          {/* Edit Password Form */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Amankan Akun & Sandi</h3>
              <p className="text-slate-400 text-xs">Ganti kata sandi lama Anda demi menjaga keamanan hak baca digital.</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi Baru</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800"
                    placeholder="Kata sandi baru"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Ulangi Sandi Baru</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10.5 pr-4 py-2.5 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none text-slate-800"
                    placeholder="Konfirmasi sandi baru"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-100 cursor-pointer flex items-center space-x-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Amankan Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

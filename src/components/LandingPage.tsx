import { BookOpen, Star, Heart, ArrowRight, Shield, Award, Users, BookMarked, CheckCircle } from 'lucide-react';
import { Book, ViewType } from '../types';

interface LandingPageProps {
  books: Book[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

export default function LandingPage({
  books,
  onNavigate,
  onToggleFavorite,
  favorites
}: LandingPageProps) {
  // Take 4 popular books (rating >= 4.8)
  const popularBooks = books.filter(b => b.rating >= 4.8).slice(0, 4);

  // Stats calculation
  const totalBooksCount = books.reduce((acc, b) => acc + b.stock, 0);
  const totalUniqueBooks = books.length;
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-32 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Award className="w-4 h-4" />
              <span>Platform Peminjaman Buku No.1 di Indonesia</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Eksplorasi Dunia Lewat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pustaka Digital</span> Terlengkap.
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Dapatkan akses instan ke lebih dari {totalUniqueBooks} judul buku berkualitas. Pinjam buku, simpan favorit, dan pantau durasi peminjaman dalam satu dashboard yang modern dan intuitif.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => onNavigate('katalog')} 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-100 hover:shadow-blue-200 flex items-center justify-center space-x-2 transition-all cursor-pointer group"
              >
                <span>Mulai Pinjam Buku</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('katalog')} 
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <span>Lihat Katalog</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            {/* Elegant Floating UI Card Mockup */}
            <div className="relative w-full max-w-sm aspect-[3/4] bg-gradient-to-tr from-blue-600 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Abstract decorative graphic */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-400/20 blur-xl" />
              
              <div className="h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider">
                    REKOMENDASI BULAN INI
                  </div>
                  <BookOpen className="w-7 h-7 text-blue-300" />
                </div>

                <div className="space-y-3">
                  <span className="text-blue-300 text-xs font-mono tracking-widest uppercase block">Kategori: Teknologi</span>
                  <h3 className="text-2xl font-bold leading-tight">Arsitektur Microservices Modern</h3>
                  <p className="text-white/75 text-xs line-clamp-2">Buku terlaris bagi pengembang software berskala global yang ingin menguasai arsitektur cloud native dan Kubernetes.</p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/65 uppercase tracking-wide">Penulis</p>
                    <p className="text-sm font-semibold">Sky last</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-amber-400 text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BookMarked className="w-6 h-6" />
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{totalUniqueBooks}+</p>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Total Judul Buku</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900">12,480+</p>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Total Anggota Aktif</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900">48,930+</p>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Total Peminjaman</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{totalBooksCount}</p>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Buku Tersedia di Stok</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">Daftar Kategori</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Telusuri Kategori Terpopuler</h2>
          <p className="text-slate-500 text-sm">Temukan materi bacaan yang dikelompokkan khusus untuk mempermudah navigasi literasi Anda.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Teknologi', count: '12 Buku', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' },
            { name: 'Novel', count: '15 Buku', color: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100' },
            { name: 'Pendidikan', count: '10 Buku', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
            { name: 'Bisnis', count: '9 Buku', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' },
            { name: 'Komputer', count: '8 Buku', color: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100' },
            { name: 'Sejarah', count: '6 Buku', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' },
            { name: 'Agama', count: '8 Buku', color: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100' },
            { name: 'Sains', count: '7 Buku', color: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' },
          ].map((cat, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate('katalog')} 
              className={`p-6 rounded-2xl border text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${cat.color}`}
            >
              <h3 className="font-bold text-base md:text-lg">{cat.name}</h3>
              <p className="text-xs mt-1 opacity-85 font-medium">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="bg-slate-100/50 py-20 px-6 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2 mb-4 md:mb-0">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">Buku Terbaik</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Paling Populer & Terfavorit</h2>
              <p className="text-slate-500 text-sm max-w-md">Koleksi buku dengan rating tinggi yang menjadi rekomendasi wajib para pembaca kami.</p>
            </div>
            <button 
              onClick={() => onNavigate('katalog')} 
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1 cursor-pointer hover:underline"
            >
              <span>Lihat semua katalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => {
              const isFav = favorites.includes(book.id);
              return (
                <div 
                  key={book.id} 
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Book cover representational container */}
                  <div className="aspect-[3/4] relative overflow-hidden flex items-center justify-center p-6 bg-slate-50 border-b border-slate-100">
                    {book.coverUrl ? (
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-3/4 h-5/6 rounded-xl bg-gradient-to-tr ${book.coverColor} p-4 text-white flex flex-col justify-between shadow-md relative group-hover:scale-102 transition-transform`}>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wider font-semibold opacity-75 font-mono">{book.category}</p>
                          <h4 className="text-sm font-bold leading-tight line-clamp-3">{book.title}</h4>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-[10px] font-medium opacity-85">{book.author}</p>
                        </div>
                      </div>
                    )}

                    {/* Quick actions overlays */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(book.id);
                        }}
                        className={`p-2 bg-white rounded-xl shadow-md border hover:scale-110 transition-transform cursor-pointer ${isFav ? 'text-rose-500 border-rose-100' : 'text-slate-400 border-slate-100 hover:text-rose-500'}`}
                        title="Simpan ke Favorit"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Book details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold tracking-wide">
                          {book.category}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{book.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500">Penulis: {book.author}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">Stok: {book.stock} buku</span>
                      <button 
                        onClick={() => onNavigate('detail-buku', book.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Detail Buku
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">Tentang Platform</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Misi Kami Meningkatkan Budaya Literasi di Era Digital
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Pustaka Digital adalah inisiatif perpustakaan online modern yang memungkinkan siapa saja meminjam dan membaca buku favorit mereka dari mana saja. Dengan integrasi local storage, peminjaman buku dapat dioperasikan secara penuh langsung melalui peramban web Anda tanpa jeda.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { title: 'Akses 24/7 Tanpa Batas', desc: 'Pinjam buku kapan saja di mana saja tanpa khawatir jam tutup perpustakaan fisik.' },
                { title: 'Sistem Terintegrasi Penuh', desc: 'Pemberitahuan jatuh tempo otomatis dan pemantauan riwayat secara personal.' },
                { title: 'Fitur Pintar Penunjang', desc: 'Generator sampul bertenaga kecerdasan buatan (AI) serta sistem bookmark interaktif.' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3.5">
                  <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60 grid grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl" />
            <div className="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm space-y-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Privasi Aman</h3>
              <p className="text-slate-400 text-[11px]">Seluruh data preferensi dan riwayat Anda disimpan di peramban pribadi.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm space-y-3">
              <Star className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">Rating Terintegrasi</h3>
              <p className="text-slate-400 text-[11px]">Beri bintang dan tulis preferensi bacaan Anda pada katalog kami.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm space-y-3">
              <Award className="w-8 h-8 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">Badge Keanggotaan</h3>
              <p className="text-slate-400 text-[11px]">Selesaikan kuota membaca Anda untuk naik tingkat menjadi Anggota Premium.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm space-y-3">
              <Users className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">Responsif 100%</h3>
              <p className="text-slate-400 text-[11px]">Akses navigasi katalog dan kelola akun secara lancar di semua perangkat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20 px-6 bg-slate-50 max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="bg-white rounded-3xl p-8 md:p-16 border border-slate-200/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10" />
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">Hubungi Layanan</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Butuh Bantuan atau Memiliki Pertanyaan?</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Tim support Pustaka Digital siap membantu Anda 24 jam mengenai prosedur pendaftaran, masalah peminjaman, atau pengajuan penambahan buku baru ke katalog.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pt-2 text-xs font-semibold text-slate-700">
              <p>Email: <span className="text-blue-600 font-medium">support@pustakadigital.com</span></p>
              <p>Telepon: <span className="text-blue-600 font-medium">+62 (21) 5092-1244</span></p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Kirim Feedback / Pertanyaan</h3>
              <div className="space-y-2.5">
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Alamat Email" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
                <textarea 
                  placeholder="Tulis pesan Anda disini..." 
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none resize-none"
                />
                <button 
                  onClick={() => alert('Terima kasih! Pesan Anda telah diterima.')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-blue-100"
                >
                  Kirim Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-8 mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Pustaka<span className="text-blue-500">Digital</span></span>
              <p className="text-[8px] text-slate-400 tracking-wider uppercase font-mono font-semibold">Modern Library</p>
            </div>
          </div>
          <div className="flex space-x-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate('katalog')} className="hover:text-white transition-colors">Katalog</button>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang</a>
            <a href="#kontak" className="hover:text-white transition-colors">Kontak</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Pustaka Digital Indonesia. Hak Cipta Dilindungi.</p>
          <p>Mendukung literasi digital di seluruh Nusantara.</p>
        </div>
      </footer>
    </div>
  );
}

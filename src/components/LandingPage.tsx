import { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Star, Heart, ArrowRight, Users, BookMarked, CheckCircle, Sun, Moon, Sparkles, Mail, Phone, MapPin, Clock, Send, MessageSquare, Menu, X, ChevronDown } from 'lucide-react';
import { Book, ViewType } from '../types';
import Book3D from './Book3D';
import BookShelf3D from './BookShelf3D';
import FloatingParticles from './FloatingParticles';
import Library3DRoom from './Library3DRoom';
import BookOpen3DModal from './BookOpen3DModal';
import EBookReader3D from './EBookReader3D';
import VT3DImmersiveExperience from './VT3DImmersiveExperience';
import { soundFX } from '../utils/audio';

interface LandingPageProps {
  books: Book[];
  onNavigate: (view: ViewType, selectedId?: string) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

export default function LandingPage({ books, onNavigate, onToggleFavorite, favorites }: LandingPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'katalog' | 'tentang' | 'kontak'>('home');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Interactive 3D Modals State
  const [selectedBook3D, setSelectedBook3D] = useState<Book | null>(null);
  const [readingBook3D, setReadingBook3D] = useState<Book | null>(null);
  const [showVTMode, setShowVTMode] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // Typing effect for hero headline
  const fullText = 'Pustaka Digital';
  useEffect(() => {
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setCursorVisible(true);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Cursor glow trail
  useEffect(() => {
    const glow = cursorGlowRef.current;
    if (!glow) return;
    const move = (e: MouseEvent) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Section scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) { setActiveSection('home'); return; }
      const tentang = document.getElementById('tentang');
      const kontak = document.getElementById('kontak');
      const pos = scrollY + 150;
      if (kontak && pos >= kontak.offsetTop) setActiveSection('kontak');
      else if (tentang && pos >= tentang.offsetTop) setActiveSection('tentang');
      else setActiveSection('home');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const popularBooks = books.filter(b => b.rating >= 4.7).slice(0, 6);
  const shelfBooks = books.slice(0, 18);
  const totalUniqueBooks = books.length;
  const featuredBook = books.find(b => b.id === 'eb-4') || books[0];

  const handleOpen3DBook = (id: string) => {
    const b = books.find(item => item.id === id);
    if (b) setSelectedBook3D(b);
  };

  const dk = darkMode;
  const bg = dk ? 'bg-slate-950' : 'bg-slate-50';
  const text = dk ? 'text-white' : 'text-slate-900';
  const sub = dk ? 'text-slate-400' : 'text-slate-500';
  const card = dk ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200';
  const nav = dk ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200';

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans antialiased transition-colors duration-300 relative`}>

      {/* === CURSOR GLOW TRAIL === */}
      <div
        ref={cursorGlowRef}
        className="fixed pointer-events-none z-0 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          willChange: 'transform',
          transition: 'transform 0.12s ease-out',
        }}
      />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { soundFX.playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-black tracking-tight">
              Pustaka<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {(['Home', 'Katalog', 'Tentang', 'Kontak'] as const).map(item => {
              const key = item.toLowerCase() as typeof activeSection;
              const isActive = activeSection === key;
              return (
                <button key={item}
                  onClick={() => {
                    soundFX.playHover();
                    if (item === 'Katalog') { onNavigate('katalog'); return; }
                    if (item === 'Home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-sm font-semibold transition-colors relative ${isActive ? 'text-blue-400' : `${sub} hover:text-blue-400`}`}
                >
                  {item}
                  {isActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />}
                </button>
              );
            })}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => { soundFX.playClick(); setDarkMode(!dk); }}
              className={`p-2 rounded-xl border transition-all ${dk ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}
              title={dk ? 'Mode Terang' : 'Mode Gelap'}
            >
              {dk ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button onClick={() => { soundFX.playClick(); onNavigate('login'); }}
              className={`hidden sm:block px-4 py-2 text-sm font-semibold rounded-xl transition-all ${dk ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}
            >Masuk</button>
            <button onClick={() => { soundFX.playClick(); onNavigate('register'); }}
              className="hidden sm:block px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all cursor-pointer"
            >Daftar</button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={`md:hidden p-2 rounded-xl border transition-all ${dk ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'}`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 py-4 space-y-3 shadow-2xl animate-fadeIn ${dk ? 'border-slate-800 bg-slate-950/95 text-white' : 'border-slate-200 bg-white/95 text-slate-900'}`}>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-between ${activeSection === 'home' ? 'bg-blue-600/20 text-blue-400' : `${sub} hover:bg-slate-800/40`}`}
              >
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  onNavigate('katalog');
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-between ${sub} hover:bg-slate-800/40`}
              >
                <span>Katalog Buku</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-between ${activeSection === 'tentang' ? 'bg-blue-600/20 text-blue-400' : `${sub} hover:bg-slate-800/40`}`}
              >
                <span>Tentang</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-between ${activeSection === 'kontak' ? 'bg-blue-600/20 text-blue-400' : `${sub} hover:bg-slate-800/40`}`}
              >
                <span>Kontak</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className={`w-full py-3 text-center text-sm font-bold rounded-xl border transition-all ${dk ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-800'}`}
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  onNavigate('register');
                }}
                className="w-full py-3 text-center text-sm font-extrabold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
              >
                Daftar Gratis Sekarang
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
        {/* Dark background with grid */}
        {dk && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,58,138,0.3)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(rgba(59,130,246,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.15) 1px,transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </>
        )}

        {/* Floating particles */}
        <FloatingParticles count={30} />

        {/* Parallax orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              width: '600px', height: '600px',
              background: 'radial-gradient(circle, #3b82f6, #6366f1)',
              left: `${20 + mousePos.x * 5}%`, top: `${10 + mousePos.y * 5}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.5s ease-out, top 0.5s ease-out',
            }}
          />
          <div className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: '400px', height: '400px',
              background: 'radial-gradient(circle, #a855f7, #ec4899)',
              left: `${75 - mousePos.x * 6}%`, top: `${60 + mousePos.y * 4}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.7s ease-out, top 0.7s ease-out',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8">
          <div className="animate-badge-pop inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 mx-auto gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Platform Literasi Digital Modern
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Eksplorasi Dunia Lewat{' '}
            <span className="animate-gradient-text">
              {typedText}
            </span>
            <span className={`inline-block w-[3px] h-[0.9em] ml-1 bg-blue-400 align-middle ${typedText.length < fullText.length ? 'animate-pulse' : 'opacity-0'}`} />
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${sub}`}>
            Akses <span className="font-bold text-blue-400">{totalUniqueBooks}+ judul</span> buku dengan e-reader page flip interaktif serta ruang etalase koleksi unggulan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button onClick={() => { soundFX.playClick(); onNavigate('katalog'); }}
              className="btn-glow flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all cursor-pointer w-full sm:w-auto text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Jelajahi Katalog
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => { soundFX.playClick(); onNavigate('register'); }}
              className={`flex items-center justify-center gap-2 px-8 py-4 font-extrabold rounded-2xl border-2 transition-all hover:scale-105 cursor-pointer w-full sm:w-auto text-sm ${dk ? 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-blue-500 hover:text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-blue-500 hover:text-blue-600'}`}
            >
              Daftar Gratis
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 justify-center">
            {[
              { val: `${totalUniqueBooks}+`, label: 'Judul Buku', color: 'from-blue-500 to-blue-600' },
              { val: '24/7', label: 'E-Reader Interaktif', color: 'from-emerald-500 to-emerald-600' },
              { val: '100%', label: 'Audio SFX', color: 'from-purple-500 to-purple-600' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg`}>{s.val}</div>
                <span className={`text-xs sm:text-sm font-semibold ${sub}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-scroll-bounce cursor-pointer"
          onClick={() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}>Gulir ke bawah</span>
          <ChevronDown className={`w-5 h-5 ${sub}`} />
        </div>

        {/* 3D Bookshelf */}
        <div className="relative z-10 mt-16 px-0">
          <div className="max-w-7xl mx-auto px-6 mb-4">
            <p className={`text-xs font-bold uppercase tracking-widest ${sub}`}>
              Drag rak buku untuk memilih koleksi
            </p>
          </div>
          <div className={`border-t border-b py-6 ${dk ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-100/50'}`}>
            <div className="max-w-7xl mx-auto px-6">
              <BookShelf3D books={shelfBooks} onBookClick={handleOpen3DBook} />
            </div>
          </div>
        </div>
      </section>

      {/* 3D ROOM SHOWCASE SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <Library3DRoom books={books} onSelectBook={handleOpen3DBook} />
      </section>

      {/* STATS */}
      <section className={`py-16 px-6 border-y ${dk ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookMarked, val: `${totalUniqueBooks}+`, label: 'Judul Buku', color: 'text-blue-400 bg-blue-950/50', delay: 'delay-100' },
            { icon: Users, val: '12,480+', label: 'Anggota Aktif', color: 'text-emerald-400 bg-emerald-950/50', delay: 'delay-200' },
            { icon: Star, val: '48,930+', label: 'Peminjaman', color: 'text-purple-400 bg-purple-950/50', delay: 'delay-300' },
            { icon: CheckCircle, val: '4.9/5', label: 'Rating Platform', color: 'text-amber-400 bg-amber-950/50', delay: 'delay-400' },
          ].map((s, i) => (
            <div key={i} className={`reveal-scale ${s.delay} text-center space-y-3 group cursor-default`}>
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`w-7 h-7 ${s.color.split(' ')[0]}`} />
              </div>
              <p className={`text-3xl md:text-4xl font-black ${text} group-hover:text-blue-400 transition-colors duration-300`}>{s.val}</p>
              <p className={`text-xs font-semibold ${sub}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR BOOKS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="reveal flex items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Koleksi Pilihan</span>
              <h2 className={`text-3xl md:text-4xl font-black ${text}`}>Buku Terpopuler</h2>
            </div>
            <button onClick={() => { soundFX.playClick(); onNavigate('katalog'); }}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-bold transition-all hover:gap-2.5 cursor-pointer"
            >Lihat Semua <ArrowRight className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularBooks.map((book, idx) => {
              const isFav = favorites.includes(book.id);
              const delays = ['delay-100','delay-200','delay-300','delay-400','delay-500','delay-600'];
              return (
                <div key={book.id}
                  className={`reveal-scale ${delays[idx] || ''} book-hover-3d group rounded-2xl border overflow-hidden card-gradient-border ${dk ? 'hover:shadow-blue-500/20' : ''} ${card}`}
                  onMouseEnter={() => { setHoveredCard(book.id); soundFX.playHover?.(); }}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => handleOpen3DBook(book.id)}
                  >
                    <Book3D book={book} size="sm" />
                    {/* Hover overlay glow */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <button onClick={e => { e.stopPropagation(); soundFX.playClick(); onToggleFavorite(book.id); }}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${isFav ? 'bg-rose-500/20 text-rose-400' : `${dk ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'} hover:text-rose-400`}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${dk ? 'text-blue-400' : 'text-blue-600'}`}>{book.category}</p>
                    <h3 className={`text-xs font-bold line-clamp-2 mt-1 group-hover:text-blue-400 transition-colors ${text}`}>{book.title}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className={`text-[10px] font-bold ${sub}`}>{book.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className={`py-20 px-6 border-t ${dk ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal-left space-y-6">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Tentang Platform</span>
            <h2 className={`text-3xl md:text-4xl font-black leading-tight ${text}`}>
              Misi Kami: Literasi Digital 3D untuk Semua
            </h2>
            <p className={`text-sm leading-relaxed ${sub}`}>
              Pustaka Digital adalah platform perpustakaan online modern. Dengan animasi buku 3D interaktif, e-reader flipbook, serta efek suara futuristik.
            </p>
            <div className="space-y-4">
              {[
                { t: 'Animasi Buku Terbuka 3D', d: 'Visualisasi cover buku berputar 3D dan membungkus halaman secara dinamis.' },
                { t: 'E-Reader Page Flip 3D', d: 'Membaca e-book PDF dengan efek membalik halaman dan suara kertas yang sintetis.' },
                { t: '3D Showcase Room', d: 'Putar kamera 360° untuk melihat panggung buku pada pedestal bercahaya.' },
              ].map((item, i) => {
                const delays = ['delay-100', 'delay-300', 'delay-500'];
                return (
                  <div key={i} className={`reveal ${delays[i]} flex gap-3.5 group cursor-default`}>
                    <div className={`mt-0.5 w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 ${dk ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${text}`}>{item.t}</h4>
                      <p className={`text-xs mt-0.5 ${sub}`}>{item.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="kontak" className={`py-20 px-6 border-t ${dk ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="reveal text-center max-w-2xl mx-auto space-y-3">
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              Hubungi Kami
            </span>
            <h2 className={`text-3xl md:text-4xl font-black ${text}`}>
              Layanan Informasi &amp; Layanan Anggota
            </h2>
            <p className={`text-sm ${sub}`}>
              Punya pertanyaan mengenai koleksi e-book, peminjaman fisik, atau akun keanggotaan? Tim pustakawan kami siap membantu Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              {[
                {
                  icon: MapPin,
                  title: 'Alamat Perpustakaan',
                  desc: 'Jl. Pemuda No. 123, Kompleks Pendidikan Utama, Jakarta Pusat 10110',
                  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                },
                {
                  icon: Phone,
                  title: 'Telepon & WhatsApp',
                  desc: '+62 812-3456-7890 / (021) 555-0192',
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  icon: Mail,
                  title: 'Email Resmi',
                  desc: 'layanan@pustakadigital.sch.id / info@pustakadigital.id',
                  color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                },
                {
                  icon: Clock,
                  title: 'Jam Layanan Operasional',
                  desc: 'Senin - Jumat: 07.30 - 16.00 WIB | Sabtu: 08.00 - 13.00 WIB',
                  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                },
              ].map((c, i) => (
                <div key={i} className={`p-5 rounded-2xl border flex items-start gap-4 transition-all hover:scale-[1.02] ${card}`}>
                  <div className={`p-3 rounded-xl border flex-shrink-0 ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold ${text}`}>{c.title}</h4>
                    <p className={`text-xs mt-1 leading-relaxed ${sub}`}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Interactive Message Form */}
            <div className={`lg:col-span-7 p-8 rounded-3xl border shadow-xl flex flex-col justify-between ${card}`}>
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h3 className={`text-xl font-black ${text}`}>Kirim Pesan atau Pertanyaan</h3>
                </div>

                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className={`text-xl font-bold ${text}`}>Pesan Anda Berhasil Terkirim!</h4>
                    <p className={`text-xs max-w-md mx-auto ${sub}`}>
                      Tanggapan akan dikirimkan ke email Anda dalam waktu 1x24 jam kerja. Terima kasih telah menghubungi Pustaka Digital.
                    </p>
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setContactSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      soundFX.playClick();
                      setContactSubmitted(true);
                      setContactName('');
                      setContactEmail('');
                      setContactMessage('');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${sub}`}>Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          placeholder="Masukkan nama Anda..."
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-xs outline-none font-medium transition-all ${
                            dk ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${sub}`}>Email Aktif</label>
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-xs outline-none font-medium transition-all ${
                            dk ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${sub}`}>Pesan / Masukan</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tuliskan pertanyaan atau kendala peminjaman Anda di sini..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-xs outline-none font-medium transition-all leading-relaxed ${
                          dk ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t py-12 px-6 ${dk ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className={`font-black text-base ${text}`}>Pustaka<span className="text-blue-400">Digital 3D</span></span>
          </div>
          <p className={`text-xs ${sub}`}>© 2026 Pustaka Digital Indonesia</p>
        </div>
      </footer>

      {/* INTERACTIVE 3D MODALS */}
      {selectedBook3D && (
        <BookOpen3DModal
          book={selectedBook3D}
          onClose={() => setSelectedBook3D(null)}
          onReadEbook={(book) => {
            setSelectedBook3D(null);
            setReadingBook3D(book);
          }}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(selectedBook3D.id)}
        />
      )}

      {readingBook3D && (
        <EBookReader3D
          book={readingBook3D}
          onClose={() => setReadingBook3D(null)}
        />
      )}
    </div>
  );
}

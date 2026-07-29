import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { X, Sparkles, ChevronLeft, ChevronRight, Volume2, VolumeX, Eye, RotateCcw, Maximize2, BookOpen, Layers } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface VT3DImmersiveExperienceProps {
  books: Book[];
  onClose: () => void;
  onSelectBookForBorrow?: (book: Book) => void;
}

export default function VT3DImmersiveExperience({
  books,
  onClose,
  onSelectBookForBorrow
}: VT3DImmersiveExperienceProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotation, setRotation] = useState({ x: 10, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [inspectMode, setInspectMode] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentBook = books[selectedIndex] || books[0];

  // Particle Starfield Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 120 star/particle objects
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      size: Math.random() * 2.5 + 0.5,
      color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#ffffff'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.z -= p.speed * 2;
        if (p.z <= 0) p.z = width;

        const k = 256 / p.z;
        const px = (p.x - width / 2) * k + width / 2;
        const py = (p.y - height / 2) * k + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = (1 - p.z / width);
          ctx.beginPath();
          ctx.arc(px, py, p.size * k * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto-rotate 3D carousel
  useEffect(() => {
    if (!autoRotate || isDragging || inspectMode) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({ ...prev, y: (prev.y + 0.4) % 360 }));
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging, inspectMode]);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    setRotation((prev) => ({
      x: Math.max(-45, Math.min(60, prev.x - dy * 0.4)),
      y: (prev.y + dx * 0.4) % 360,
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const radius = Math.min(380, Math.max(260, window.innerWidth * 0.25));
  const bookCount = Math.min(12, books.length);
  const displayBooks = books.slice(0, bookCount);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white overflow-hidden select-none animate-fadeIn font-sans">
      {/* 3D Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* TOP HEADER CONTROLS */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              VT 3D Immersive Library Experience
            </h2>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              Futuristic 3D Carousel & Interactive Page Flip
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoRotate ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Auto Rotate</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              const res = soundFX.toggleSound();
              setSoundOn(res);
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundOn ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Exit VT Mode */}
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl border border-rose-500/30 transition-all cursor-pointer"
            title="Keluar Mode VT 3D"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MAIN 3D DISPLAY SCENE */}
      <div
        className={`w-full h-full flex items-center justify-center cursor-${isDragging ? 'grabbing' : 'grab'}`}
        style={{ perspective: '2000px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {!inspectMode ? (
          /* 3D CIRCULAR FLOATING CAROUSEL MODE */
          <div
            className="relative transition-transform duration-100 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {/* Center Core Light Aura */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 80%)',
              }}
            />

            {/* Floating Books Array placed along 3D Circle */}
            {displayBooks.map((b, idx) => {
              const angle = (idx / bookCount) * Math.PI * 2;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={b.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playBookOpen();
                    setSelectedIndex(idx);
                    setInspectMode(true);
                  }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer group ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-10'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${(angle * 180) / Math.PI}deg)`,
                  }}
                >
                  {/* 3D FLOATING BOOK COVER CARD */}
                  <div
                    className="w-40 h-56 rounded-xl border-2 shadow-2xl flex flex-col justify-between p-4 overflow-hidden relative transition-all duration-300"
                    style={{
                      background: b.coverColor ? `linear-gradient(135deg, ${b.coverColor.replace('from-', '').replace('to-', '')})` : 'linear-gradient(135deg, #1e3a8a, #312e81)',
                      borderColor: isSelected ? '#60a5fa' : 'rgba(255,255,255,0.2)',
                      boxShadow: isSelected
                        ? '0 0 40px rgba(59, 130, 246, 0.8), 0 20px 40px rgba(0,0,0,0.8)'
                        : '0 10px 30px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Spine highlight */}
                    <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent" />

                    <div className="space-y-2 z-10">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-black/40 text-amber-300 rounded border border-amber-400/30">
                        {b.category}
                      </span>
                      <h4 className="text-xs font-black text-white leading-tight line-clamp-3 drop-shadow">
                        {b.title}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-white/20 z-10 flex justify-between items-center text-[10px]">
                      <span className="text-white/80 truncate font-semibold">{b.author}</span>
                      <span className="text-amber-300 font-bold">★ {b.rating}</span>
                    </div>

                    {/* Hover Inspect Tag */}
                    <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center gap-2">
                      <Eye className="w-6 h-6 text-blue-300 animate-bounce" />
                      <span className="text-[10px] font-extrabold text-white">Inspeksi Buku 3D</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* INSPECT & OPEN BOOK MODE (INSPECTION STUDIO) */
          <div className="relative w-full max-w-4xl h-[560px] flex items-center justify-center z-20 animate-scaleUp">

            {/* THE 3D OPENING BOOK */}
            <div
              className="relative w-[320px] md:w-[640px] h-[460px] transition-all duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: bookOpen ? 'rotateX(10deg) rotateY(0deg)' : 'rotateX(20deg) rotateY(-25deg)',
              }}
            >
              {/* LEFT PAGE */}
              <div
                className={`absolute top-0 left-0 w-1/2 h-full bg-slate-900 border border-slate-800 rounded-l-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between transition-opacity duration-500 ${
                  bookOpen ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  boxShadow: 'inset -20px 0 30px rgba(0,0,0,0.5)',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      {currentBook.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400">★ {currentBook.rating}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{currentBook.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold">Penulis: {currentBook.author}</p>
                  <div className="h-px bg-slate-800 my-2" />
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {currentBook.description || 'Pustaka Digital Indonesia menghadirkan koleksi literasi terbaik dengan teknologi 3D interaktif futuristik.'}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-3">
                  <span>Pustaka 3D VT Studio</span>
                  <span>Halaman {page}</span>
                </div>
              </div>

              {/* RIGHT PAGE */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-full bg-slate-900 border border-slate-800 rounded-r-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between transition-opacity duration-500 ${
                  bookOpen ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  boxShadow: 'inset 20px 0 30px rgba(0,0,0,0.5)',
                }}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1 text-xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Penerbit & Tahun</p>
                    <p className="font-extrabold text-white">{currentBook.publisher} ({currentBook.year})</p>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1 text-xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Lokasi Rak & Stok</p>
                    <p className="font-extrabold text-emerald-400">{currentBook.rackLocation || 'Rak A-01'} • {currentBook.stock} Buku Tersedia</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundFX.playPageFlip();
                        setPage((prev) => Math.max(1, prev - 1));
                      }}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Hal. Sebelumnya
                    </button>
                    <button
                      onClick={() => {
                        soundFX.playPageFlip();
                        setPage((prev) => prev + 1);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Hal. Selanjutnya
                    </button>
                  </div>

                  {onSelectBookForBorrow && (
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        onSelectBookForBorrow(currentBook);
                        onClose();
                      }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all"
                    >
                      Ajukan Peminjaman Buku Ini
                    </button>
                  )}
                </div>
              </div>

              {/* FRONT COVER (FLIPS OPEN 3D) */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full rounded-l-2xl shadow-2xl origin-right transition-transform duration-700 ease-in-out p-8 flex flex-col justify-between text-white overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: bookOpen ? 'rotateY(-170deg)' : 'rotateY(0deg)',
                  background: currentBook.coverColor
                    ? `linear-gradient(135deg, ${currentBook.coverColor.replace('from-', '').replace('to-', '')})`
                    : 'linear-gradient(135deg, #1e3a8a, #0f172a)',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
                }}
              >
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-black/40 rounded-full border border-white/20">
                    {currentBook.category}
                  </span>
                  <h2 className="text-2xl font-black leading-tight drop-shadow">{currentBook.title}</h2>
                  <p className="text-xs font-bold opacity-80">{currentBook.author}</p>
                </div>

                <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xs font-mono">
                  <span>Pustaka Digital</span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* CONTROLS BAR BELOW INSPECTION */}
            <div className="absolute -bottom-16 flex items-center gap-4">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setInspectMode(false);
                  setBookOpen(false);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 shadow-xl cursor-pointer"
              >
                Kembali ke 3D Carousel
              </button>

              <button
                onClick={() => {
                  soundFX.playBookOpen();
                  setBookOpen(!bookOpen);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{bookOpen ? 'Tutup Cover Buku' : 'Buka Sampul Buku (3D Cover Flip)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER BAR NAVIGATION HINT */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 font-semibold pointer-events-none">
        <span>💡 Petunjuk: Klik dan tahan mouse untuk rotasi 3D 360° • Klik buku untuk masuk mode inspeksi</span>
        <span>Buku {selectedIndex + 1} dari {displayBooks.length}</span>
      </div>
    </div>
  );
}

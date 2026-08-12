import { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Minimize2, Bookmark, Sparkles, FileText, Download, ZoomIn, ZoomOut, RotateCcw, Mic, Play, Square, Music, CloudRain, Coffee, Waves } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface EBookReader3DProps {
  book: Book;
  onClose: () => void;
}

export default function EBookReader3D({ book, onClose }: EBookReader3DProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // New Enhanced Features
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  // Ambient Soundscape state
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'library' | 'waves'>('off');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<any>(null);

  const toggleAmbientSoundscape = (type: 'off' | 'rain' | 'library' | 'waves') => {
    if (ambientSound === type) type = 'off';
    setAmbientSound(type);

    if (ambientNodeRef.current) {
      try { ambientNodeRef.current.stop(); } catch (e) {}
      ambientNodeRef.current = null;
    }

    if (type === 'off') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      } else if (type === 'library') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(550, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      }

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start();

      ambientNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn('Audio synth failed:', e);
    }
  };

  useEffect(() => {
    return () => {
      if (ambientNodeRef.current) {
        try { ambientNodeRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const totalPages = 12;

  const samplePages = [
    { chapter: 'Bab I: Pendahuluan', title: 'Awal Mula Petualangan', text: `${book.title} diawali dengan kisah menarik yang memberikan pemahaman mendasar mengenai topik yang diangkat. Dalam bab ini, penulis ${book.author} memaparkan landasan berpikir dan visi besar dari karya ini.` },
    { chapter: 'Bab I: Pendahuluan', title: 'Konsep Dasar & Teori', text: 'Konsep-konsep penting diperkenalkan satu demi satu secara sistematis. Pembaca diajak untuk memahami prinsip dasar yang akan menjadi pijakan pada bab-bab selanjutnya.' },
    { chapter: 'Bab II: Pemikiran Utama', title: 'Studi Kasus & Implementasi', text: 'Di bab kedua ini, teori yang telah dibahas mulai diterapkan dalam studi kasus nyata. Analisis mendalam diberikan untuk memperlihatkan bagaimana prinsip tersebut bekerja di dunia nyata.' },
    { chapter: 'Bab II: Pemikiran Utama', title: 'Tantangan & Solusi', text: 'Setiap proses tentu menghadapi berbagai rintangan. Penulis menyajikan berbagai strategi dan metode efisien untuk mengatasi masalah umum yang sering dijumpai.' },
    { chapter: 'Bab III: Pendalaman', title: 'Teknik Lanjutan', text: 'Menyelami aspek-aspek lanjutan secara lebih detail. Bab ini cocok bagi pembaca yang ingin memperdalam keahlian dan menguasai teknik secara komprehensif.' },
    { chapter: 'Bab III: Pendalaman', title: 'Kiat & Best Practices', text: 'Kumpulan pengalaman berharga dan praktis yang dikumpulkan oleh penulis. Berbagai tips bermanfaat ini memberikan efisiensi tinggi dalam penerapan sehari-hari.' },
    { chapter: 'Bab IV: Analisis Dampak', title: 'Evaluasi & Hasil', text: 'Menganalisis hasil penerapan dari berbagai pendekatan. Data dan contoh konkrit disajikan untuk memberikan kesimpulan yang terukur.' },
    { chapter: 'Bab IV: Analisis Dampak', title: 'Perspektif Masa Depan', text: 'Melihat tren perkembangan ke depan. Bagaimana teknologi dan metode ini akan berkembang dalam kurun waktu beberapa tahun mendatang.' },
    { chapter: 'Bab V: Penutup', title: 'Rangkuman & Kesimpulan', text: 'Merangkum poin-poin penting yang telah dibahas dari bab pertama hingga bab terakhir. Mengisi lembar gagasan utama bagi pembaca.' },
    { chapter: 'Bab V: Penutup', title: 'Langkah Selanjutnya', text: 'Panduan aksi nyata setelah menyelesaikan buku ini. Pembaca didorong untuk mempraktikkan langsung pengetahuan yang telah didapat.' },
  ];

  const pageData = samplePages[(currentPage - 1) % samplePages.length];

  // Stop TTS voice on unmount or page change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage >= totalPages || isFlipping) return;
    stopSpeech();
    setFlipDirection('next');
    setIsFlipping(true);
    soundFX.playPageFlip();
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsFlipping(false);
    }, 400);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || isFlipping) return;
    stopSpeech();
    setFlipDirection('prev');
    setIsFlipping(true);
    soundFX.playPageFlip();
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
      setIsFlipping(false);
    }, 400);
  };

  const toggleSound = () => {
    const newState = soundFX.toggleSound();
    setSoundEnabled(newState);
  };

  const toggleBookmark = () => {
    let updated: number[];
    if (bookmarkedPages.includes(currentPage)) {
      updated = bookmarkedPages.filter(p => p !== currentPage);
    } else {
      updated = [...bookmarkedPages, currentPage];
      soundFX.playClick();
    }
    setBookmarkedPages(updated);
    localStorage.setItem(`digital_library_bookmark_${book.id}`, JSON.stringify(updated));
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      stopSpeech();
    } else {
      const textToRead = `${pageData.title}. ${pageData.text}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const isCurrentBookmarked = bookmarkedPages.includes(currentPage);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl text-white font-sans ${isFullScreen ? 'p-0' : 'p-3 md:p-6'}`}>

      {/* HEADER CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs md:text-sm text-white max-w-xs md:max-w-md truncate">{book.title}</h3>
            <p className="text-[10px] text-cyan-400 font-semibold">{book.author} — Interactive 3D E-Reader</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Voice Reader (Text To Speech) */}
          <button
            onClick={toggleTextToSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isSpeaking ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
            title="AI Voice Reader (Membacakan Teks)"
          >
            {isSpeaking ? <Square className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Berhentikan Suara' : 'Baca Teks AI'}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isCurrentBookmarked ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={isCurrentBookmarked ? 'Hapus Penanda Halaman' : 'Tandai Halaman Ini'}
          >
            <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button onClick={handleZoomOut} className="p-1.5 text-slate-300 hover:text-white" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[10px] font-mono px-1 font-bold text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 text-slate-300 hover:text-white" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
            {zoomLevel !== 1 && (
              <button onClick={handleResetZoom} className="p-1.5 text-cyan-400 hover:text-cyan-300" title="Reset Zoom"><RotateCcw className="w-3.5 h-3.5" /></button>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={soundEnabled ? 'Matikan Suara SFX' : 'Aktifkan Suara SFX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Layar Penuh"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* AMBIENT SOUNDSCAPES BAR */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-[9px] font-extrabold text-slate-400">
            <span className="px-1.5 text-[8px] uppercase tracking-wider text-cyan-400 font-black">Ambient:</span>
            <button
              onClick={() => toggleAmbientSoundscape('rain')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                ambientSound === 'rain' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
              }`}
              title="Suara Hujan & Gemericik Air"
            >
              <CloudRain className="w-3 h-3 text-cyan-300" /> Hujan
            </button>
            <button
              onClick={() => toggleAmbientSoundscape('library')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                ambientSound === 'library' ? 'bg-indigo-600 text-white shadow-md' : 'hover:text-white'
              }`}
              title="Suara Suasana Perpustakaan"
            >
              <Coffee className="w-3 h-3 text-amber-300" /> Perpus
            </button>
            <button
              onClick={() => toggleAmbientSoundscape('waves')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                ambientSound === 'waves' ? 'bg-cyan-600 text-white shadow-md' : 'hover:text-white'
              }`}
              title="Suara Ombak Laut Relaksasi"
            >
              <Waves className="w-3 h-3 text-teal-300" /> Laut
            </button>
          </div>

          {/* Close Reader */}
          <button
            onClick={() => {
              stopSpeech();
              soundFX.playClick();
              onClose();
            }}
            className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl border border-rose-500/30 transition-all cursor-pointer"
            title="Keluar Pembaca"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D BOOK FLIPBOOK WORKSPACE */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
        <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* FLIPBOOK CONTAINER WITH ZOOM */}
        <div
          className="relative w-full max-w-4xl h-[500px] flex justify-center items-center select-none transition-transform duration-200"
          style={{ 
            perspective: '2200px',
            transform: `scale(${zoomLevel})`
          }}
        >
          {/* THE 3D BOOK BOOKSPREAD */}
          <div className="relative w-full h-full flex bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

            {/* LEFT SPREAD (EVEN PAGE) */}
            <div className="w-1/2 h-full bg-slate-900 border-r border-slate-800/80 p-8 flex flex-col justify-between relative shadow-inner">
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest border-b border-slate-800 pb-3">
                  <span>{pageData.chapter}</span>
                  <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-white">{pageData.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {pageData.text}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-normal pt-2">
                  Halaman ini disajikan dalam format e-reader 3D interaktif. Seluruh bab dikembangkan secara khusus untuk memberikan kenyamanan membaca terbaik bagi pengguna platform Pustaka Digital.
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-800/80 pt-4">
                <span>Pustaka Digital E-Reader</span>
                <span>Halaman {currentPage * 2 - 1}</span>
              </div>
            </div>

            {/* RIGHT SPREAD (ODD PAGE) */}
            <div className="w-1/2 h-full bg-slate-900 p-8 flex flex-col justify-between relative shadow-inner">
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-800 pb-3">
                  <span>Modul Pembelajaran</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Catatan Penting</h4>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">💡 Ringkasan Poin Utama:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Pemahaman konsep secara menyeluruh</li>
                    <li>Penerapan praktis dalam kehidupan sehari-hari</li>
                    <li>Evaluasi mandiri secara berkala</li>
                  </ul>
                </div>
                {isSpeaking && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span className="font-bold text-[11px]">AI Voice Reader sedang membaca teks...</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-800/80 pt-4">
                <span>Halaman {currentPage * 2}</span>
                <span>Dokumen Digital</span>
              </div>
            </div>

            {/* 3D PAGE FLIP ANIMATION OVERLAY */}
            {isFlipping && (
              <div
                className="absolute top-0 bottom-0 w-1/2 bg-slate-850 border border-slate-700 shadow-2xl transition-transform duration-400 ease-in-out flex items-center justify-center p-8 overflow-hidden z-30"
                style={{
                  left: flipDirection === 'next' ? '50%' : '0%',
                  transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                  transform: flipDirection === 'next' ? 'rotateY(-180deg)' : 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                }}
              >
                <div className="text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <span className="text-xs font-bold text-slate-300 block">Membalik Halaman...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER NAVIGATION CONTROL */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 rounded-b-2xl shrink-0">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isFlipping}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Halaman Sebelumnya</span>
        </button>

        {/* Page indicator & progress */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-extrabold text-slate-300">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isFlipping}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          <span>Halaman Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

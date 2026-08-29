import React, { useState, useEffect, useRef } from 'react';
import { Book, User } from '../types';
import { 
  X, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Minimize2, 
  Bookmark, Sparkles, FileText, Download, ZoomIn, ZoomOut, Mic, Play, 
  Square, CloudRain, Coffee, Waves, Lock, Moon, Sun, BookOpen, AlignLeft,
  List, Settings, Check
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { resolveBookPdfUrl } from '../utils/pdfResolver';
import { getBookReadingPages, PageContent } from '../data/bookChaptersData';

interface EBookReader3DProps {
  book: Book;
  onClose: () => void;
  currentUser?: User | null;
}

type ReaderTheme = 'sepia' | 'dark' | 'light' | 'oled';
type FontFamily = 'serif' | 'sans' | 'mono';

export default function EBookReader3D({ book, onClose, currentUser }: EBookReader3DProps) {
  // Mode Switcher: 'read' (Interactive Kindle Reader) vs 'pdf' (PDF Viewer)
  const [mode, setMode] = useState<'read' | 'pdf'>('read');
  const pdfUrl = resolveBookPdfUrl(book);

  // Pages & Chapter Data
  const readingPages: PageContent[] = getBookReadingPages(book);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  
  // Customization States
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Audio & Voice States
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'library' | 'waves'>('off');
  
  // Bookmarks
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>(() => {
    const saved = localStorage.getItem(`digital_library_bookmark_${book.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<any>(null);

  // Current active page content
  const activePage = readingPages[(currentPage - 1) % readingPages.length] || readingPages[0];
  const totalPages = readingPages.length;

  // Keyboard arrow shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'read') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, mode, isFlipping]);

  // Clean TTS voice on page change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentPage]);

  // Ambient soundscape generator
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
        filter.frequency.setValueAtTime(750, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      } else if (type === 'library') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
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

  const handleNextPage = () => {
    if (currentPage >= totalPages || isFlipping) return;
    stopSpeech();
    setFlipDirection('next');
    setIsFlipping(true);
    if (soundEnabled) soundFX.playPageFlip();
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsFlipping(false);
    }, 300);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || isFlipping) return;
    stopSpeech();
    setFlipDirection('prev');
    setIsFlipping(true);
    if (soundEnabled) soundFX.playPageFlip();
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
      setIsFlipping(false);
    }, 300);
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
      if (soundEnabled) soundFX.playClick();
    }
    setBookmarkedPages(updated);
    localStorage.setItem(`digital_library_bookmark_${book.id}`, JSON.stringify(updated));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullScreen(false);
      }
    }
  };

  // AI Voice Reader TTS
  const speakPageText = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${activePage.chapterTitle}. ${activePage.subTitle}. ${activePage.text}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Theme Styling Classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return {
          bg: 'bg-[#FBF0D9]',
          text: 'text-[#362B22]',
          accent: 'text-[#8C5D3B]',
          card: 'bg-[#F4E4C1] border-[#E2D2B0]',
          header: 'bg-[#F4E4C1]/90 border-[#E5D4B2]',
          sidebar: 'bg-[#F4E4C1] text-[#362B22]',
        };
      case 'dark':
        return {
          bg: 'bg-[#181E29]',
          text: 'text-[#E2E8F0]',
          accent: 'text-[#38BDF8]',
          card: 'bg-[#1E2638] border-[#2D374D]',
          header: 'bg-[#1E2638]/90 border-[#2D374D]',
          sidebar: 'bg-[#1E2638] text-[#E2E8F0]',
        };
      case 'oled':
        return {
          bg: 'bg-black',
          text: 'text-[#D1D5DB]',
          accent: 'text-[#A855F7]',
          card: 'bg-[#111111] border-[#222222]',
          header: 'bg-[#111111]/90 border-[#222222]',
          sidebar: 'bg-[#111111] text-[#D1D5DB]',
        };
      default: // light
        return {
          bg: 'bg-[#FFFFFF]',
          text: 'text-[#1F2937]',
          accent: 'text-[#2563EB]',
          card: 'bg-[#F9FAFB] border-[#E5E7EB]',
          header: 'bg-[#F3F4F6]/90 border-[#E5E7EB]',
          sidebar: 'bg-[#F3F4F6] text-[#1F2937]',
        };
    }
  };

  const themeStyles = getThemeClasses();

  const getFontFamilyClass = () => {
    if (fontFamily === 'serif') return 'font-serif';
    if (fontFamily === 'mono') return 'font-mono';
    return 'font-sans';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full h-full max-w-6xl max-h-[96vh] bg-slate-900 rounded-none sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* HEADER TOOLBAR */}
        <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-20">
          {/* Left: Book Meta Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-12 rounded overflow-hidden shadow shrink-0 hidden xs:block bg-slate-800">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-[8px] text-white font-bold">
                  EBOOK
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-white truncate drop-shadow">{book.title}</h2>
              <p className="text-[11px] text-slate-400 truncate">{book.author} • {book.category}</p>
            </div>
          </div>

          {/* Center: Mode Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setMode('read')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'read' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Baca E-Book</span>
            </button>

            <button
              onClick={() => setMode('pdf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'pdf' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dokumen PDF</span>
            </button>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {mode === 'read' && (
              <>
                <button
                  onClick={() => setShowToc(!showToc)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    showToc ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Daftar Bab & Isi"
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    showSettings ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Pengaturan Tampilan & Tema"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={speakPageText}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSpeaking ? 'bg-amber-500/30 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={isSpeaking ? 'Hentikan AI Voice Reader' : 'Bacakan Naskah (AI Voice Reader)'}
                >
                  {isSpeaking ? <Square className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    bookmarkedPages.includes(currentPage)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={bookmarkedPages.includes(currentPage) ? 'Hapus Penanda' : 'Tandai Halaman Ini'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedPages.includes(currentPage) ? 'fill-amber-400' : ''}`} />
                </button>
              </>
            )}

            {/* Download Button (Premium Members) */}
            {currentUser?.badge === 'Premium' && (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
                title="Unduh PDF — Khusus Member Premium"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={toggleFullScreen}
              className="hidden md:flex p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Layar Penuh"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl border border-rose-500/30 transition-all cursor-pointer"
              title="Tutup Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 w-full h-full relative flex overflow-hidden min-h-0">
          
          {/* TOC / CHAPTER SIDEBAR DRAWER */}
          {showToc && mode === 'read' && (
            <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-30 animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <List className="w-4 h-4 text-indigo-400" />
                  <span>Daftar Bab & Lembaran</span>
                </h3>
                <button onClick={() => setShowToc(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {readingPages.map((page, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = pNum === currentPage;
                  const isBookmarked = bookmarkedPages.includes(pNum);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentPage(pNum);
                        setShowToc(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 text-xs font-semibold cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-[10px] uppercase tracking-wider ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {page.chapterTitle}
                        </p>
                        <p className="font-bold truncate mt-0.5">{page.subTitle}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isBookmarked && <Bookmark className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isCurrent ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          Hal {pNum}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* SETTINGS DRAWER */}
          {showSettings && mode === 'read' && (
            <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-30 absolute right-0 top-0 bottom-0 shadow-2xl animate-in slide-in-from-right duration-200 p-4 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Pengaturan Pengalaman Baca</span>
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Tema Warna Pembaca</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme('sepia')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'sepia' ? 'bg-[#F4E4C1] text-[#362B22] border-[#8C5D3B] ring-2 ring-[#8C5D3B]' : 'bg-[#FBF0D9] text-[#362B22] border-slate-700'
                    }`}
                  >
                    <span>☕ Sepia Warm</span>
                    {theme === 'sepia' && <Check className="w-4 h-4 text-[#8C5D3B]" />}
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'dark' ? 'bg-[#1E2638] text-white border-sky-500 ring-2 ring-sky-500' : 'bg-[#181E29] text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>🌙 Night Dark</span>
                    {theme === 'dark' && <Check className="w-4 h-4 text-sky-400" />}
                  </button>

                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'light' ? 'bg-white text-slate-900 border-blue-600 ring-2 ring-blue-600' : 'bg-slate-100 text-slate-800 border-slate-700'
                    }`}
                  >
                    <span>☀️ Light Clean</span>
                    {theme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => setTheme('oled')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'oled' ? 'bg-black text-white border-purple-500 ring-2 ring-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>🖤 OLED Black</span>
                    {theme === 'oled' && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Gaya Tipografi (Font)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFontFamily('serif')}
                    className={`p-2.5 rounded-xl border text-xs font-serif font-bold text-center transition-all ${
                      fontFamily === 'serif' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Book Serif
                  </button>

                  <button
                    onClick={() => setFontFamily('sans')}
                    className={`p-2.5 rounded-xl border text-xs font-sans font-bold text-center transition-all ${
                      fontFamily === 'sans' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Modern Sans
                  </button>

                  <button
                    onClick={() => setFontFamily('mono')}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold text-center transition-all ${
                      fontFamily === 'mono' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-700 border-slate-700'
                    }`}
                  >
                    Code Mono
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Ukuran Huruf</span>
                  <span className="text-indigo-400 font-mono">{fontSize}px</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-400">A</span>
                  <input
                    type="range"
                    min="14"
                    max="26"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-lg font-bold text-white">A</span>
                </div>
              </div>

              {/* Ambient Soundscape */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Suara Suasana (Ambient Soundscape)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleAmbientSoundscape('rain')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      ambientSound === 'rain' ? 'bg-cyan-600/30 text-cyan-400 border-cyan-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <CloudRain className="w-4 h-4" />
                    <span>Hujan Hening</span>
                  </button>

                  <button
                    onClick={() => toggleAmbientSoundscape('library')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      ambientSound === 'library' ? 'bg-amber-600/30 text-amber-400 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Kafe Pustaka</span>
                  </button>

                  <button
                    onClick={() => toggleAmbientSoundscape('waves')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      ambientSound === 'waves' ? 'bg-blue-600/30 text-blue-400 border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                    <span>Ombak Laut</span>
                  </button>

                  <button
                    onClick={() => toggleAmbientSoundscape('off')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      ambientSound === 'off' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Hening (Mute)
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* MAIN CANVAS */}
          {mode === 'read' ? (
            <div className={`flex-1 w-full h-full ${themeStyles.bg} flex flex-col justify-between p-4 sm:p-10 transition-colors duration-300 overflow-y-auto relative`}>
              
              {/* PAGE CONTENT CONTAINER */}
              <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between my-auto space-y-6">
                
                {/* Chapter Subheader */}
                <div className="border-b border-current/10 pb-3 flex justify-between items-center text-xs opacity-75">
                  <span className="font-bold tracking-widest uppercase text-[11px]">
                    {activePage.chapterTitle}
                  </span>
                  <span className="font-mono font-bold text-[11px]">
                    Halaman {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-2">
                  <h1 className={`${getFontFamilyClass()} font-black ${themeStyles.text} tracking-tight leading-tight`} style={{ fontSize: `${fontSize * 1.5}px` }}>
                    {activePage.subTitle}
                  </h1>
                </div>

                {/* Body Text Paragraphs */}
                <div className={`space-y-4 ${getFontFamilyClass()} ${themeStyles.text} leading-relaxed text-justify`} style={{ fontSize: `${fontSize}px` }}>
                  {activePage.text.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="indent-6 leading-loose">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Optional Quote Card */}
                {activePage.quote && (
                  <div className={`p-5 rounded-2xl ${themeStyles.card} border italic border-current/10 my-4 text-sm font-serif ${themeStyles.accent}`}>
                    "{activePage.quote}"
                  </div>
                )}

                {/* Bottom Footer Progress Bar */}
                <div className="pt-6 border-t border-current/10 flex items-center justify-between text-xs opacity-75">
                  <span>{book.title}</span>
                  <div className="w-32 bg-current/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono">{Math.round((currentPage / totalPages) * 100)}% Selesai</span>
                </div>
              </div>

              {/* PAGE NAVIGATION BUTTONS */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 cursor-pointer ${
                  currentPage <= 1
                    ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-110'
                }`}
                title="Halaman Sebelumnya (Panah Kiri)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 cursor-pointer ${
                  currentPage >= totalPages
                    ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-110'
                }`}
                title="Halaman Selanjutnya (Panah Kanan / Spasi)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          ) : (
            /* PDF VIEWER MODE */
            <div className="flex-1 w-full h-full bg-slate-950 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                <span className="truncate">📄 Menampilkan Dokumen PDF Resmi Perpustakaan ({book.title})</span>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                >
                  Buka Tab Baru ↗
                </a>
              </div>
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                className="w-full h-full bg-slate-900 border-none flex-1 min-h-0"
                title={book.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

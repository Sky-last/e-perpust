import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Mic, 
  MicOff, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { Book, User } from '../types';
import { soundFX } from '../utils/audio';
import EBookReader3D from './EBookReader3D';

interface AILibrarianAssistantProps {
  books: Book[];
  onNavigate: (view: any, bookId?: string) => void;
  currentUser?: User | null;
  onDownloadBook?: (book: Book) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  fullText?: string;       // target teks final untuk animasi typing
  isStreaming?: boolean;   // apakah sedang dalam proses streaming
  suggestedBooks?: Book[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: '📖 Rekomendasi Populer', query: 'Rekomendasi buku paling populer dan terbaik' },
  { label: '📱 Cara Download ke HP', query: 'Bagaimana cara mendownload buku ke handphone saya?' },
  { label: '🪪 Cetak Kartu Anggota', query: 'Bagaimana cara membuat dan mencetak kartu anggota?' },
  { label: '💻 Buku IT & Teknologi', query: 'Cari buku teknologi, pemrograman, dan koding' },
  { label: '📚 Novel & Sastra', query: 'Rekomendasi novel dan karya sastra seru' },
  { label: '🔥 Cara Naikkan Poin Baca', query: 'Bagaimana sistem poin baca dan level pemustaka?' },
  { label: '💡 Tips Membaca Efektif', query: 'Berikan tips membaca buku efektif untuk pemula' },
];

// Karakter per "tick" — makin besar makin cepat
const CHARS_PER_TICK = 3;
// Interval dalam ms
const TYPING_INTERVAL_MS = 18;

export default function AILibrarianAssistant({ books, onNavigate, currentUser, onDownloadBook }: AILibrarianAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamingMsgIdRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Halo! 👋 Saya Pustakawan AI Perpustakaan Kita.\n\nAda yang bisa saya bantu hari ini? Kamu bisa tanya rekomendasi buku, cara download file ke HP, cetak kartu anggota resmi, atau cara membaca e-book 3D!',
      suggestedBooks: books.slice(0, 2),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isStreaming, scrollToBottom]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamingRef.current) clearInterval(streamingRef.current);
    };
  }, []);

  const toggleAssistant = () => {
    soundFX.playClick();
    setIsOpen(!isOpen);
  };

  const handleResetChat = () => {
    if (streamingRef.current) {
      clearInterval(streamingRef.current);
      streamingRef.current = null;
    }
    setIsStreaming(false);
    soundFX.playClick();
    setMessages([
      {
        id: 'welcome_reset_' + Date.now(),
        sender: 'ai',
        text: 'Percakapan telah direset. ✨ Silakan ketik pertanyaan atau pilih topik cepat di bawah!',
        suggestedBooks: books.slice(0, 2),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  /**
   * Mulai streaming teks karakter per karakter ke pesan tertentu
   */
  const startStreamingMessage = useCallback((msgId: string, fullText: string, suggestedBooks?: Book[]) => {
    if (streamingRef.current) clearInterval(streamingRef.current);
    streamingMsgIdRef.current = msgId;
    setIsStreaming(true);

    let charIndex = 0;

    streamingRef.current = setInterval(() => {
      charIndex += CHARS_PER_TICK;
      const currentText = fullText.slice(0, charIndex);
      const isDone = charIndex >= fullText.length;

      setMessages(prev =>
        prev.map(m =>
          m.id === msgId
            ? {
                ...m,
                text: isDone ? fullText : currentText,
                isStreaming: !isDone,
                suggestedBooks: isDone ? suggestedBooks : undefined,
              }
            : m
        )
      );

      if (isDone) {
        clearInterval(streamingRef.current!);
        streamingRef.current = null;
        streamingMsgIdRef.current = null;
        setIsStreaming(false);
        soundFX.playPageFlip();
      }
    }, TYPING_INTERVAL_MS);
  }, []);

  const handleSend = useCallback((textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isStreaming) return;

    soundFX.playClick();

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Buat placeholder pesan AI (kosong, akan diisi streaming)
    const aiMsgId = 'ai_' + Date.now() + '_' + Math.random();
    const aiPlaceholder: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Delay kecil sebelum AI mulai "berpikir" dan streaming
    setTimeout(() => {
      const reply = generateSmartLibrarianResponse(text, books);
      setMessages(prev => [...prev, { ...aiPlaceholder, text: '' }]);
      setTimeout(() => {
        startStreamingMessage(aiMsgId, reply.fullText || reply.text, reply.suggestedBooks);
      }, 80);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputQuery, isStreaming, books, startStreamingMessage]);

  const startSpeechRecognition = () => {
    soundFX.playHover();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung input suara. Gunakan Google Chrome atau Edge versi desktop/mobile terbaru.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  /**
   * Smart Knowledge Engine untuk Pustakawan AI
   */
  const generateSmartLibrarianResponse = (query: string, bookList: Book[]): ChatMessage => {
    const q = query.toLowerCase();
    let replyText = '';
    let matchedBooks: Book[] = [];

    // 1. CARA DOWNLOAD BUKU KE HP
    if (q.includes('download') || q.includes('unduh') || q.includes('simpan ke hp') || q.includes('ke handphone') || q.includes('ke ponsel') || q.includes('offline')) {
      replyText = `📱 **Panduan Download Buku ke Penyimpanan HP:**\n\n1. Pilih buku yang ingin kamu baca di **Katalog** atau **Beranda**.\n2. Klik tombol **"Download PDF"**.\n3. Sistem akan memproses file secara streaming dan langsung menyimpannya ke folder **Download** memori HP kamu.\n4. Buku yang sudah diunduh juga tercatat di tab **"Buku Diunduh"** agar kamu bisa membacanya kapan saja tanpa internet!`;
      matchedBooks = bookList.slice(0, 2);
    } 
    // 2. CARA CETAK KARTU ANGGOTA
    else if (q.includes('kartu') || q.includes('cetak') || q.includes('id card') || q.includes('member card') || q.includes('nomor anggota')) {
      replyText = `🪪 **Panduan Cetak Kartu Anggota Resmi:**\n\n1. Buka tab **"Kartu Anggota"** di dasbor pemustaka.\n2. Klik tombol **"Cetak Kartu"** di pojok kanan atas kartu digitalmu.\n3. Pratinjau kartu anggota fisik (standar ID Card 85.6mm × 54mm) lengkap dengan foto, barcode dinamis, dan nomor ID resmi akan muncul.\n4. Klik tombol **"Cetak Kartu"** untuk mencetak langsung via printer atau simpan sebagai file PDF beresolusi tinggi!`;
    }
    // 3. E-BOOK READER 3D
    else if (q.includes('3d') || q.includes('reader') || q.includes('baca ebook') || q.includes('baca buku') || q.includes('lembar')) {
      replyText = `📖 **Fitur Pembaca E-Book 3D Interaktif:**\n\nKamu bisa membaca buku digital layaknya membalik halaman buku fisik sungguhan! Cukup klik tombol **"Buka Reader"** pada buku pilihanmu. Dilengkapi dengan zoom fleksibel, mode malam yang ramah mata, dan daftar bab interaktif.`;
      matchedBooks = bookList.slice(0, 2);
    }
    // 4. POIN BACA & TINGKATAN / STREAK
    else if (q.includes('poin') || q.includes('streak') || q.includes('tingkat') || q.includes('level') || q.includes('almanak')) {
      replyText = `🔥 **Sistem Poin Baca & Tingkatan Pemustaka:**\n\n- Setiap kamu menyelesaikan buku, kamu akan memperoleh **+120 Poin Baca**!\n- Buka buku setiap hari untuk menjaga **Daily Reading Streak** kamu.\n- Tingkat anggota akan naik bertahap: **Pembaca Baru** → **Penjelajah Buku** → **Pembaca Legenda**.\n- Pantau seluruh statistikmu di tab **"Almanak Baca"**!`;
    }
    // 5. TEKNOLOGI / CODING / IT
    else if (q.includes('teknologi') || q.includes('coding') || q.includes('koding') || q.includes('program') || q.includes('web') || q.includes('komputer') || q.includes('python') || q.includes('react') || q.includes('ai')) {
      matchedBooks = bookList.filter(b => {
        const cat = (b.category || '').toLowerCase();
        const t = (b.title || '').toLowerCase();
        return cat.includes('teknologi') || cat.includes('komputer') || t.includes('web') || t.includes('python') || t.includes('koding') || t.includes('javascript') || t.includes('data');
      }).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);

      replyText = `💻 **Koleksi Teknologi & Pemrograman Terbaik:**\n\nBerikut rekomendasi buku seputar dunia teknologi dan software engineering untuk meningkatkan keahlian digitalmu:`;
    }
    // 6. NOVEL / FIKSI / SASTRA
    else if (q.includes('novel') || q.includes('fiksi') || q.includes('cerita') || q.includes('sastra') || q.includes('roman')) {
      matchedBooks = bookList.filter(b => {
        const cat = (b.category || '').toLowerCase();
        const t = (b.title || '').toLowerCase();
        return cat.includes('novel') || cat.includes('fiksi') || cat.includes('sastra') || t.includes('hujan') || t.includes('negeri') || t.includes('laskar');
      }).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);

      replyText = `📚 **Pilihan Novel & Karya Fiksi Terpopuler:**\n\nMenyelami kisah inspiratif dan alur cerita mendalam bersama pilihan novel terbaik di perpustakaan kita:`;
    }
    // 7. BISNIS / PENGEMBANGAN DIRI / MOTIVASI
    else if (q.includes('bisnis') || q.includes('keuangan') || q.includes('sukses') || q.includes('motivasi') || q.includes('kebiasaan') || q.includes('habits')) {
      matchedBooks = bookList.filter(b => {
        const cat = (b.category || '').toLowerCase();
        const t = (b.title || '').toLowerCase();
        return cat.includes('bisnis') || cat.includes('keuangan') || cat.includes('pengembangan') || t.includes('habits') || t.includes('kaya') || t.includes('uang');
      }).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);

      replyText = `💡 **Koleksi Bisnis, Keuangan & Pengembangan Diri:**\n\nInvestasi terbaik adalah menambah wawasan pola pikir finansial dan pembentukan kebiasaan produktif:`;
    }
    // 8. TIPS MEMBACA EFEKTIF
    else if (q.includes('tips') || q.includes('cara baca') || q.includes('cepat') || q.includes('malas') || q.includes('fokus')) {
      replyText = `✨ **Tips Membaca Efektif untuk Pemustaka:**\n\n1. **Gunakan Aturan 20 Menit**: Luangkan 20 menit tanpa gangguan smartphone di pagi atau malam hari.\n2. **Gunakan Fitur Timer Fokus**: Di tab *Almanak Baca*, aktifkan sesi fokus membaca terpandu.\n3. **Tulis Catatan Singkat**: Simpan intisari ide dari buku yang kamu baca di fitur buku catatan digital.\n\n*"Buku adalah pesawat, kereta, dan jalan. Mereka adalah tujuan dan perjalanan itu sendiri."* — Anna Quindlen`;
      matchedBooks = bookList.slice(0, 2);
    }
    // 9. REKOMENDASI UMUM / POPULER
    else if (q.includes('rekomendasi') || q.includes('populer') || q.includes('bagus') || q.includes('terbaik') || q.includes('favorit')) {
      matchedBooks = [...bookList].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
      replyText = `🌟 **Rekomendasi Buku Terpopuler (Rating Tertinggi):**\n\nBuku-buku ini mendapatkan ulasan bintang tertinggi dari para pembaca di Perpustakaan Kita:`;
    }
    // 10. SAPAAN RAMAH
    else if (q.includes('halo') || q.includes('hai') || q.includes('pagi') || q.includes('siang') || q.includes('malam') || q.includes('assalamualaikum')) {
      replyText = `Halo! Senang bertemu denganmu di Perpustakaan Kita! 😊 Ada topik khusus yang sedang ingin kamu pelajari hari ini, atau butuh rekomendasi bacaan santai?`;
      matchedBooks = bookList.slice(0, 2);
    }
    // 11. PENCARIAN FLEKSIBEL (SEMANTIC & KEYWORD SEARCH)
    else {
      const searchTerms = q.split(/\s+/).filter(t => t.length > 2);
      matchedBooks = bookList.filter(b => {
        const titleMatch = b.title?.toLowerCase() || '';
        const authorMatch = b.author?.toLowerCase() || '';
        const catMatch = b.category?.toLowerCase() || '';
        const descMatch = b.description?.toLowerCase() || '';

        return searchTerms.some(term => 
          titleMatch.includes(term) || 
          authorMatch.includes(term) || 
          catMatch.includes(term) || 
          descMatch.includes(term)
        );
      }).slice(0, 3);

      if (matchedBooks.length > 0) {
        replyText = `🔍 Saya menemukan **${matchedBooks.length} buku** yang relevan dengan pertanyaanmu:`;
      } else {
        replyText = `Saya belum menemukan buku dengan kata kunci spesifik tersebut, namun kamu bisa menjelajahi katalog lengkap kami atau memilih salah satu buku pilihan populer berikut:`;
        matchedBooks = bookList.slice(0, 3);
      }
    }

    return {
      id: 'ai_' + Date.now(),
      sender: 'ai',
      text: '',
      fullText: replyText,
      suggestedBooks: matchedBooks.length > 0 ? matchedBooks : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-5 sm:right-6 z-[45]">
        <button
          onClick={toggleAssistant}
          onMouseEnter={() => soundFX.playHover()}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer"
          aria-label="Buka Pustakawan AI"
          title="Tanya Pustakawan AI"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse -z-10" />
          {isOpen ? (
            <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Floating Chat Window */}
      {isOpen && (
        <div
          className="fixed right-3 left-3 sm:left-auto sm:right-6 w-auto sm:w-[420px] z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ bottom: '90px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#20301F] via-[#2d3e2c] to-[#1a2619] border-b border-amber-500/20 flex items-center justify-between text-[#F6F1E7]">
            <div className="flex items-center space-x-3">
              {/* Animated Avatar with streaming indicator */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                <Bot className="w-5 h-5 text-white" />
                {isStreaming && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-sm">Pustakawan AI Cerdas</h3>
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded-full border transition-all duration-300 ${
                    isStreaming
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {isStreaming ? 'Mengetik...' : 'Online'}
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/80 font-medium">Asisten Pintar Perpustakaan Digital</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset Percakapan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700 max-h-[380px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* AI label */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400">Pustakawan AI</span>
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {/* Teks + blinking cursor saat streaming */}
                  <p className="leading-relaxed whitespace-pre-line text-xs">
                    {msg.text}
                    {msg.isStreaming && (
                      <span
                        className="inline-block w-0.5 h-3.5 bg-amber-400 ml-0.5 align-middle"
                        style={{ animation: 'blink 0.7s step-end infinite' }}
                      />
                    )}
                  </p>

                  {/* Suggested Books — hanya muncul setelah streaming selesai */}
                  {msg.suggestedBooks && msg.suggestedBooks.length > 0 && !msg.isStreaming && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> Rekomendasi Pilihan:
                      </p>
                      {msg.suggestedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center space-x-3 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-amber-500/50 transition-all duration-200 group"
                        >
                          <div className={`w-9 h-12 rounded-lg bg-gradient-to-br ${book.coverColor || 'from-amber-600 to-orange-800'} shrink-0 flex items-center justify-center text-[8px] font-black text-white shadow overflow-hidden`}>
                            {book.coverUrl ? (
                              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              book.title.slice(0, 4)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                            <span className="text-[9px] text-amber-400 font-bold">★ {book.rating || '4.8'}</span>
                          </div>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setReadingBook(book);
                              setIsOpen(false);
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500 rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            title="Baca E-Book Sekarang"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Baca Buku</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* "Berpikir" dot loader sebelum streaming dimulai */}
            {isStreaming && messages[messages.length - 1]?.text === '' && (
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 bg-slate-900/80 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex space-x-2 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.query)}
                disabled={isStreaming}
                className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={startSpeechRecognition}
              disabled={isStreaming}
              className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title="Voice Input (Bicara)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleSend()}
              placeholder={isStreaming ? 'AI sedang mengetik...' : 'Tanyakan buku, cara download, cetak kartu...'}
              disabled={isStreaming}
              className="flex-1 bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 placeholder-slate-500 font-medium disabled:opacity-60"
            />
            <button
              onClick={() => handleSend()}
              disabled={isStreaming || !inputQuery.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Inline CSS untuk blink cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* 3D E-Book Reader Modal (Langsung render pembaca buku tanpa buka detail page) */}
      {readingBook && (
        <EBookReader3D
          book={readingBook}
          onClose={() => setReadingBook(null)}
          currentUser={currentUser}
          onNavigate={onNavigate}
          onDownloadBook={onDownloadBook}
        />
      )}
    </>
  );
}

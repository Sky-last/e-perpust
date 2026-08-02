import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, Mic, MicOff, BookOpen, Search, ThumbsUp, Volume2, ArrowRight } from 'lucide-react';
import { Book } from '../types';
import { soundFX } from '../utils/audio';

interface AILibrarianAssistantProps {
  books: Book[];
  onNavigate: (view: any, bookId?: string) => void;
  onOpenPinjamModal?: (book: Book) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedBooks?: Book[];
  timestamp: string;
}

export default function AILibrarianAssistant({ books, onNavigate, onOpenPinjamModal }: AILibrarianAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Halo! 👋 Saya Pustakawan AI Anda. Bingung mau baca buku apa hari ini atau butuh bantuan menelusuri koleksi digital?',
      suggestedBooks: books.slice(0, 2),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleAssistant = () => {
    soundFX.playClick();
    setIsOpen(!isOpen);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    soundFX.playClick();

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate AI response synthesis
    setTimeout(() => {
      soundFX.playPageFlip();
      const reply = generateAiResponse(text, books);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const startSpeechRecognition = () => {
    soundFX.playHover();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung fitur Voice Input. Gunakan Google Chrome atau Edge versi terbaru.');
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

  const generateAiResponse = (query: string, bookList: Book[]): ChatMessage => {
    const q = query.toLowerCase();
    let replyText = '';
    let matchedBooks: Book[] = [];

    if (q.includes('rekomendasi') || q.includes('saran') || q.includes('bagus') || q.includes('populer')) {
      replyText = 'Berikut adalah beberapa buku populer & sangat direkomendasikan untuk Anda baca:';
      matchedBooks = bookList.filter(b => b.rating >= 4.5).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 3);
    } else if (q.includes('teknologi') || q.includes('coding') || q.includes('komputer') || q.includes('ai') || q.includes('pemrograman')) {
      replyText = 'Berikut buku seputar Teknologi & Pemrograman di perpustakaan kita:';
      matchedBooks = bookList.filter(b => b.category?.toLowerCase().includes('teknologi') || b.title?.toLowerCase().includes('web') || b.title?.toLowerCase().includes('python') || b.title?.toLowerCase().includes('react') || b.title?.toLowerCase().includes('koding')).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
    } else if (q.includes('fiksi') || q.includes('novel') || q.includes('cerita')) {
      replyText = 'Berikut pilihan novel & fiksi yang seru untuk mengisi waktu luang Anda:';
      matchedBooks = bookList.filter(b => b.category?.toLowerCase().includes('fiksi') || b.category?.toLowerCase().includes('novel')).slice(0, 3);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
    } else if (q.includes('pinjam') || q.includes('cara')) {
      replyText = 'Untuk meminjam buku, Anda cukup memilih buku dari Katalog, lalu klik tombol **"Pinjam Sekarang"**. Masa peminjaman standar adalah 7 - 14 hari!';
    } else if (q.includes('3d') || q.includes('ruang') || q.includes('tour')) {
      replyText = 'Anda bisa menikmati pengalaman membaca 3D interaktif dan mengunjungi Ruang Perpustakaan 3D Imersif melalui menu Katalog & Fitur 3D!';
    } else {
      // General search filter
      matchedBooks = bookList.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      ).slice(0, 3);

      if (matchedBooks.length > 0) {
        replyText = `Saya menemukan ${matchedBooks.length} buku yang cocok dengan pencarian "${query}":`;
      } else {
        replyText = `Maaf, saya belum menemukan buku spesifik untuk "${query}". Coba kata kunci seperti *teknologi*, *fiksi*, *rekomendasi*, atau jelajahi halaman Katalog secara penuh!`;
        matchedBooks = bookList.slice(0, 2);
      }
    }

    return {
      id: Math.random().toString(),
      sender: 'ai',
      text: replyText,
      suggestedBooks: matchedBooks.length > 0 ? matchedBooks : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleAssistant}
          onMouseEnter={() => soundFX.playHover()}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Pustakawan AI"
        >
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
        <div className="fixed bottom-20 sm:bottom-24 right-3 left-3 sm:left-auto sm:right-6 w-auto sm:w-[400px] h-[520px] max-h-[75vh] z-50 flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-900/80 via-slate-900 to-indigo-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-sm">Pustakawan AI</h3>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-400">Asisten Interaktif Pustaka Digital</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Suggested Books Cards inside Chat */}
                  {msg.suggestedBooks && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/50">
                      {msg.suggestedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center space-x-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all duration-200 group"
                        >
                          <div className={`w-10 h-12 rounded bg-gradient-to-br ${book.coverColor || 'from-blue-600 to-indigo-800'} flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow`}>
                            {book.title.slice(0, 6)}..
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                            <span className="text-[10px] text-amber-400">★ {book.rating || '4.5'}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => {
                                soundFX.playClick();
                                onNavigate('detail', book.id);
                                setIsOpen(false);
                              }}
                              className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-blue-600 rounded transition-colors"
                              title="Lihat Detail"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 bg-slate-800/60 p-3 rounded-2xl rounded-bl-none w-fit border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex space-x-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSend('Rekomendasi buku terbaik')}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600/40 border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Rekomendasi</span>
            </button>
            <button
              onClick={() => handleSend('Buku teknologi terbaru')}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600/40 border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <Search className="w-3 h-3 text-blue-400" />
              <span>Teknologi</span>
            </button>
            <button
              onClick={() => handleSend('Bagaimana cara meminjam buku?')}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600/40 border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <ThumbsUp className="w-3 h-3 text-emerald-400" />
              <span>Cara Pinjam</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={startSpeechRecognition}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Voice Input (Bicara)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan buku atau topik..."
              className="flex-1 bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

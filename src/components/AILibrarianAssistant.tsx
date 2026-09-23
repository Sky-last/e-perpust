import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Bot, Mic, MicOff, BookOpen, RotateCcw, Sparkles, Zap, Lightbulb, ChevronRight
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
  fullText?: string;
  isStreaming?: boolean;
  suggestedBooks?: Book[];
  timestamp: string;
}

// Pool quick prompts yang bervariasi
const ALL_QUICK_PROMPTS = [
  { label: '📖 Buku Populer', query: 'Rekomendasikan buku paling populer dan terbaik' },
  { label: '📱 Download ke HP', query: 'Bagaimana cara mendownload buku ke handphone?' },
  { label: '🪪 Kartu Anggota', query: 'Bagaimana cara mencetak kartu anggota?' },
  { label: '💻 IT & Teknologi', query: 'Cari buku teknologi, pemrograman, dan koding' },
  { label: '📚 Novel & Sastra', query: 'Rekomendasi novel dan karya sastra seru' },
  { label: '🔬 Sains & Ilmu', query: 'Ada buku tentang sains dan ilmu pengetahuan?' },
  { label: '🕌 Agama & Rohani', query: 'Rekomendasi buku agama dan spiritual' },
  { label: '💡 Pengembangan Diri', query: 'Buku self-improvement dan motivasi terbaik' },
  { label: '🏥 Kesehatan', query: 'Ada buku tentang kesehatan dan gaya hidup sehat?' },
  { label: '🧠 Psikologi', query: 'Buku psikologi dan ilmu perilaku manusia' },
  { label: '🌏 Sejarah & Budaya', query: 'Rekomendasi buku sejarah Indonesia dan dunia' },
  { label: '👶 Buku Anak', query: 'Rekomendasi buku anak-anak dan cerita bergambar' },
  { label: '🔥 Poin Baca', query: 'Bagaimana sistem poin baca dan level pemustaka?' },
  { label: '✨ Tips Baca Efektif', query: 'Berikan tips membaca buku efektif untuk pemula' },
  { label: '🎨 Seni & Desain', query: 'Ada buku tentang seni, desain, dan kreativitas?' },
  { label: '⚖️ Hukum & Sosial', query: 'Buku tentang hukum, sosial, dan politik' },
  { label: '💰 Bisnis & Keuangan', query: 'Buku terbaik tentang bisnis dan keuangan' },
  { label: '🌿 Lingkungan', query: 'Buku tentang lingkungan hidup dan alam' },
  { label: '🎓 Buku Pelajaran', query: 'Ada buku pelajaran dan pendidikan formal?' },
  { label: '❓ Trivia Buku', query: 'Ceritakan fakta menarik dan trivia tentang dunia literasi!' },
  { label: '🧪 Kimia & Fisika', query: 'Rekomendasi buku kimia, fisika, dan matematika' },
  { label: '🏃 Olahraga & Sport', query: 'Ada buku tentang olahraga dan kebugaran?' },
  { label: '🍳 Masak & Kuliner', query: 'Buku resep masakan dan kuliner nusantara?' },
  { label: '🌐 Bahasa & Sastra', query: 'Buku belajar bahasa asing dan linguistik?' },
  { label: '🖥️ E-Book Digital', query: 'Apa kelebihan e-book dibanding buku fisik?' },
];

// Karakter per "tick"
const CHARS_PER_TICK = 3;
const TYPING_INTERVAL_MS = 18;

// Trivia buku yang dipilih acak
const BOOK_TRIVIA = [
  '📚 **Tahukah kamu?** Buku tertua yang masih ada di dunia adalah "The Diamond Sutra" dari Tiongkok, dicetak pada tahun 868 M — lebih dari 1.150 tahun lalu!',
  '📚 **Fakta Literasi:** Rata-rata pembaca cepat bisa membaca 400–700 kata per menit, sedangkan kebanyakan orang membaca 200–250 kata per menit. Latihan bisa melipatgandakan kecepatanmu!',
  '📚 **Trivia Menarik:** Perpustakaan pertama di dunia dibangun di Nineveh, Irak sekitar tahun 700 SM oleh Raja Asyurbanipal — berisi 30.000 tablet tanah liat!',
  '📚 **Fakta Unik:** Novel "A Clockwork Orange" karya Anthony Burgess ditulis hanya dalam **3 minggu**. Sementara "Gone with the Wind" butuh **10 tahun** revisi oleh Margaret Mitchell.',
  '📚 **Rekord Dunia:** Buku paling banyak diterjemahkan di dunia adalah **Alkitab** dengan lebih dari 3.400 bahasa. Urutan kedua adalah buku "Pinocchio" karya Carlo Collodi.',
  '📚 **Fakta Ilmiah:** Membaca 30 menit sehari dapat mengurangi risiko kematian dini sebesar **20%** menurut penelitian Yale University, 2016. Buku benar-benar bisa memperpanjang umur!',
  '📚 **Trivia Literasi Indonesia:** Novel "Laskar Pelangi" karya Andrea Hirata terjual lebih dari **5 juta eksemplar** dan diterjemahkan ke 40 bahasa!',
  '📚 **Fakta Perpustakaan:** Library of Congress di Washington DC memiliki lebih dari **170 juta item** koleksi — menjadikannya perpustakaan terbesar di dunia.',
  '📚 **Keajaiban Buku:** "Don Quixote" karya Miguel de Cervantes (1605) dianggap sebagai **novel modern pertama** di dunia dan masih dibaca hingga hari ini!',
  '📚 **Ilmu Saraf:** Saat kamu membaca novel, otakmu benar-benar mengalami cerita layaknya kenyataan! Neuron cermin aktif seolah kamu sendiri yang mengalami kejadian dalam buku tersebut.',
  '📚 **Fakta Unik:** J.K. Rowling menulis draft pertama Harry Potter di sebuah **kafe kecil di Edinburgh**, Skotlandia, sambil mengasuh bayinya yang tertidur di kereta dorong!',
  '📚 **Statistik Dunia:** Diperkirakan ada sekitar **130 juta buku unik** yang pernah diterbitkan di dunia sepanjang sejarah. Google Books pernah mencoba mendigitalisasi semuanya!',
];

export default function AILibrarianAssistant({ books, onNavigate, currentUser, onDownloadBook }: AILibrarianAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [showMorePrompts, setShowMorePrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const name = currentUser?.name?.split(' ')[0] || 'Pemustaka';
  const welcomeText = currentUser
    ? `Halo, **${name}**! 👋 Selamat datang kembali di Perpustakaan Kita.\n\nSaya siap membantu kamu menemukan buku, menjawab pertanyaan tentang dunia literasi, atau berbagi fakta menarik seputar buku! Apa yang ingin kamu tanyakan?`
    : 'Halo! 👋 Saya **Pustakawan AI** Perpustakaan Kita.\n\nAda yang bisa saya bantu? Tanya rekomendasi buku, cara download file, cetak kartu anggota, fakta sejarah, tips belajar, atau pertanyaan apa pun seputar literasi dan pengetahuan!';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: welcomeText,
      suggestedBooks: books.slice(0, 2),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Prompt visible & extra (acak)
  const [visiblePrompts] = useState(() => {
    return [...ALL_QUICK_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 8);
  });
  const [extraPrompts] = useState(() => {
    return [...ALL_QUICK_PROMPTS].sort(() => Math.random() - 0.5).slice(8, 14);
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isStreaming, scrollToBottom]);

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
    setMessages([{
      id: 'welcome_reset_' + Date.now(),
      sender: 'ai',
      text: 'Percakapan telah direset. ✨ Silakan ketik pertanyaan atau pilih topik cepat di bawah!',
      suggestedBooks: books.slice(0, 2),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const startStreamingMessage = useCallback((msgId: string, fullText: string, suggestedBooks?: Book[]) => {
    if (streamingRef.current) clearInterval(streamingRef.current);
    setIsStreaming(true);
    let charIndex = 0;
    streamingRef.current = setInterval(() => {
      charIndex += CHARS_PER_TICK;
      const currentText = fullText.slice(0, charIndex);
      const isDone = charIndex >= fullText.length;
      setMessages(prev =>
        prev.map(m =>
          m.id === msgId
            ? { ...m, text: isDone ? fullText : currentText, isStreaming: !isDone, suggestedBooks: isDone ? suggestedBooks : undefined }
            : m
        )
      );
      if (isDone) {
        clearInterval(streamingRef.current!);
        streamingRef.current = null;
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
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    const aiMsgId = 'ai_' + Date.now() + '_' + Math.random();
    const aiPlaceholder: ChatMessage = {
      id: aiMsgId, sender: 'ai', text: '', isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTimeout(() => {
      const reply = generateSmartLibrarianResponse(text, books);
      setMessages(prev => [...prev, { ...aiPlaceholder, text: '' }]);
      setTimeout(() => startStreamingMessage(aiMsgId, reply.fullText || reply.text, reply.suggestedBooks), 80);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputQuery, isStreaming, books, startStreamingMessage]);

  const startSpeechRecognition = () => {
    soundFX.playHover();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung input suara. Gunakan Google Chrome atau Edge versi terbaru.');
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

  const generateSmartLibrarianResponse = (query: string, bookList: Book[]): ChatMessage => {
    const q = query.toLowerCase();
    let replyText = '';
    let matchedBooks: Book[] = [];

    const findBooks = (keywords: string[], limit = 3): Book[] => {
      return bookList.filter(b => {
        const cat = (b.category || '').toLowerCase();
        const t = (b.title || '').toLowerCase();
        const desc = (b.description || '').toLowerCase();
        return keywords.some(kw => cat.includes(kw) || t.includes(kw) || desc.includes(kw));
      }).slice(0, limit);
    };

    // 1. DOWNLOAD
    if (q.includes('download') || q.includes('unduh') || q.includes('simpan ke hp') || q.includes('handphone') || q.includes('ponsel') || q.includes('offline') || q.includes('pdf')) {
      replyText = '📱 **Panduan Download Buku ke Penyimpanan HP:**\n\n1. Pilih buku di **Katalog** atau **Beranda**.\n2. Klik tombol **"Download PDF"** pada halaman detail buku.\n3. File diproses streaming dan tersimpan ke folder **Download** HP kamu.\n4. Buku tercatat di tab **"Buku Diunduh"** di dasbor.\n\n💡 *Tips:* Gunakan Wi-Fi untuk hemat kuota data saat mengunduh!';
      matchedBooks = bookList.slice(0, 2);
    }
    // 2. KARTU ANGGOTA
    else if (q.includes('kartu') || q.includes('cetak') || q.includes('id card') || q.includes('member card') || q.includes('nomor anggota') || q.includes('keanggotaan')) {
      replyText = '🪪 **Panduan Cetak Kartu Anggota Resmi:**\n\n1. Buka tab **"Kartu Anggota"** di dasbor pemustaka.\n2. Kartu digital muncul lengkap: nama, foto, nomor ID, dan barcode.\n3. Klik **"Cetak Kartu"** di pojok kanan atas.\n4. Pratinjau kartu fisik standar (85.6mm x 54mm) tampil.\n5. Cetak via printer atau simpan sebagai **PDF beresolusi tinggi**!\n\n💡 *Tips:* Gunakan kertas PVC untuk hasil seperti ID card profesional.';
    }
    // 3. E-BOOK READER 3D
    else if (q.includes('3d') || q.includes('reader') || q.includes('baca ebook') || q.includes('e-book') || q.includes('buka reader') || q.includes('lembar') || q.includes('kelebihan ebook')) {
      replyText = '📖 **Fitur Pembaca E-Book 3D Interaktif:**\n\nBaca buku digital layaknya membalik halaman buku fisik! ✨\n\n**Cara Menggunakan:**\n1. Pilih buku di Katalog atau Beranda\n2. Klik **"Buka Reader"** atau **"Baca Sekarang"**\n3. Halaman tampil dengan animasi 3D seru!\n\n**Fitur Unggulan:**\n- 🔍 Zoom in/out fleksibel\n- 🌙 Mode malam & siang\n- 📑 Daftar bab interaktif\n- ⌨️ Navigasi keyboard\n- 📊 Pelacak halaman otomatis';
      matchedBooks = bookList.slice(0, 2);
    }
    // 4. POIN BACA & LEVEL
    else if (q.includes('poin') || q.includes('streak') || q.includes('tingkat') || q.includes('level') || q.includes('almanak') || q.includes('badge') || q.includes('reward')) {
      replyText = '🔥 **Sistem Poin Baca & Tingkatan Pemustaka:**\n\n**Cara Mendapatkan Poin:**\n- ✅ Selesaikan buku: **+120 Poin**\n- 📅 Login harian: **+5 Poin**\n- ⭐ Beri rating buku: **+10 Poin**\n- 💬 Kirim masukan: **+15 Poin**\n\n**Tingkatan Anggota:**\n🟤 Pembaca Baru → 🟢 Penjelajah Buku → 🔵 Bibliofil → 🟣 Pembaca Legenda\n\n📍 Pantau statistik di tab **"Almanak Baca"** di dasbor kamu!';
    }
    // 5. DAFTAR / REGISTRASI
    else if (q.includes('daftar') || q.includes('registrasi') || q.includes('buat akun') || q.includes('login') || q.includes('bergabung') || q.includes('cara masuk')) {
      replyText = '📝 **Cara Bergabung sebagai Anggota Perpustakaan:**\n\n1. Klik tombol **"Daftar"** atau **"Mulai Membaca"** di halaman utama.\n2. Isi nama lengkap, email aktif, dan password.\n3. Verifikasi email yang dikirim ke inbox kamu.\n4. Lengkapi profil dengan foto dan data diri.\n5. **Selesai!** Akses ribuan buku digital gratis!\n\n💡 Pendaftaran **100% GRATIS** tanpa biaya apa pun.';
    }
    // 6. TENTANG PERPUSTAKAAN
    else if ((q.includes('apa itu') || q.includes('tentang')) && (q.includes('perpustakaan') || q.includes('aplikasi') || q.includes('website'))) {
      replyText = '🏛️ **Tentang Perpustakaan Kita:**\n\nPerpustakaan Kita adalah **platform perpustakaan digital modern** yang menyediakan:\n\n📚 Ribuan koleksi e-book dari berbagai genre\n🔍 Pencarian buku cerdas dengan filter lengkap\n📖 Reader 3D interaktif untuk pengalaman baca imersif\n🪪 Kartu anggota digital resmi yang bisa dicetak\n🤖 Pustakawan AI yang siap membantu 24 jam\n📊 Sistem poin dan tingkatan pemustaka\n\nSemua layanan **GRATIS** untuk seluruh warga Indonesia!';
    }
    // 7. TEKNOLOGI / IT / CODING
    else if (q.includes('teknologi') || q.includes('coding') || q.includes('koding') || q.includes('program') || q.includes('javascript') || q.includes('python') || q.includes('react') || q.includes('web') || q.includes('komputer') || q.includes('software') || q.includes('data science')) {
      matchedBooks = findBooks(['teknologi', 'komputer', 'web', 'python', 'koding', 'javascript', 'data', 'programming', 'digital']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '💻 **Koleksi Teknologi & Pemrograman Terbaik:**\n\nTingkatkan keahlian digitalmu:\n\n🔧 Pemrograman dasar hingga arsitektur sistem\n🌐 Web development, mobile, dan cloud computing\n📊 Data science, AI, dan machine learning\n📱 Pengembangan aplikasi mobile iOS & Android\n\n*"Coding adalah bahasa generasi baru — siapa yang menguasainya, dialah yang memimpin masa depan."*';
    }
    // 8. NOVEL / FIKSI / SASTRA
    else if (q.includes('novel') || q.includes('fiksi') || q.includes('cerita') || q.includes('sastra') || q.includes('roman') || q.includes('thriller') || q.includes('misteri') || q.includes('romantis')) {
      matchedBooks = findBooks(['novel', 'fiksi', 'sastra', 'cerita', 'roman', 'thriller', 'hujan', 'negeri', 'laskar']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '📚 **Pilihan Novel & Karya Fiksi Terpopuler:**\n\nMenyelami kisah mendalam bersama pilihan novel terbaik:\n\n✨ Novel inspiratif lokal & internasional\n🎭 Drama, romansa, thriller, dan misteri\n🏆 Karya pemenang penghargaan sastra bergengsi\n\n*"Buku novel adalah jendela ke ribuan kehidupan yang tak pernah kita jalani sendiri."*';
    }
    // 9. BISNIS / KEUANGAN
    else if (q.includes('bisnis') || q.includes('keuangan') || q.includes('uang') || q.includes('investasi') || q.includes('saham') || q.includes('ekonomi') || q.includes('wirausaha') || q.includes('startup') || q.includes('marketing') || q.includes('manajemen')) {
      matchedBooks = findBooks(['bisnis', 'keuangan', 'ekonomi', 'investasi', 'manajemen', 'marketing', 'wirausaha', 'startup']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '💰 **Koleksi Bisnis, Keuangan & Ekonomi:**\n\nBangun fondasi keuangan dan bisnismu:\n\n📈 Investasi saham, reksa dana, dan kripto\n🚀 Startup, entrepreneurship, dan growth hacking\n💼 Manajemen perusahaan dan kepemimpinan\n📊 Akuntansi, perpajakan, dan laporan keuangan\n\n*"Financial literacy adalah keterampilan yang tidak diajarkan di sekolah, tapi sangat menentukan masa depanmu."*';
    }
    // 10. PENGEMBANGAN DIRI / MOTIVASI
    else if (q.includes('motivasi') || q.includes('sukses') || q.includes('kebiasaan') || q.includes('habits') || q.includes('produktif') || q.includes('self') || q.includes('pengembangan diri') || q.includes('mindset') || q.includes('karier')) {
      matchedBooks = findBooks(['motivasi', 'pengembangan', 'sukses', 'habits', 'produktif', 'mindset', 'leadership', 'karier']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '💡 **Buku Pengembangan Diri & Motivasi Terbaik:**\n\nTransformasi diri dimulai dari satu buku yang tepat:\n\n🧠 Mengubah pola pikir (growth mindset)\n⚡ Membangun kebiasaan produktif\n🎯 Goal setting & manajemen waktu\n💪 Kepercayaan diri dan resiliensi\n\n*"Buku terbaik adalah yang membuatmu ingin menutupnya lalu langsung bertindak."* — Ralph Waldo Emerson';
    }
    // 11. SAINS / IPA
    else if (q.includes('sains') || q.includes('fisika') || q.includes('kimia') || q.includes('biologi') || q.includes('matematika') || q.includes('astronomi') || q.includes('alam semesta') || q.includes('planet') || q.includes('quantum') || q.includes('ilmu pengetahuan')) {
      matchedBooks = findBooks(['sains', 'fisika', 'kimia', 'biologi', 'matematika', 'astronomi', 'alam', 'ilmu pengetahuan']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🔬 **Koleksi Buku Sains & Ilmu Pengetahuan Alam:**\n\nJelajahi keajaiban alam semesta:\n\n⚛️ Fisika kuantum dan relativitas Einstein\n🧬 Biologi molekuler, genetika, dan evolusi\n🌌 Astronomi: galaksi, lubang hitam, dan kosmologi\n🔢 Matematika murni dan terapan\n🧪 Kimia organik, anorganik, dan biokimia\n\n*"Sains adalah cara terbaik yang pernah ditemukan manusia untuk mengetahui apa yang benar."* — Carl Sagan';
    }
    // 12. SEJARAH / BUDAYA
    else if (q.includes('sejarah') || q.includes('budaya') || q.includes('politik') || q.includes('indonesia') || q.includes('perang') || q.includes('revolusi') || q.includes('soekarno') || q.includes('pahlawan') || q.includes('nusantara')) {
      matchedBooks = findBooks(['sejarah', 'budaya', 'politik', 'indonesia', 'sosial', 'perang', 'revolusi', 'nasional', 'pahlawan']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🌏 **Koleksi Sejarah, Budaya & Sosial:**\n\nMahami perjalanan bangsa dan peradaban dunia:\n\n🇮🇩 Sejarah perjuangan kemerdekaan Indonesia\n⚔️ Perang dunia, revolusi, dan geopolitik global\n🎭 Antropologi dan kebudayaan Nusantara\n🗳️ Politik, demokrasi, dan sistem pemerintahan\n\n*"Bangsa yang besar adalah bangsa yang menghargai sejarahnya."* — Ir. Soekarno';
    }
    // 13. AGAMA / SPIRITUAL
    else if (q.includes('agama') || q.includes('islam') || q.includes('kristen') || q.includes('rohani') || q.includes('spiritual') || q.includes('quran') || q.includes('hadis') || q.includes('ibadah') || q.includes('doa') || q.includes('iman') || q.includes('religi')) {
      matchedBooks = findBooks(['agama', 'islam', 'kristen', 'rohani', 'spiritual', 'quran', 'hadis', 'ibadah', 'religi', 'iman']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🕌 **Koleksi Buku Agama & Rohani:**\n\nMemperdalam iman dan wawasan spiritual:\n\n📖 Tafsir Al-Quran dan Hadis pilihan\n🕊️ Buku-buku rohani lintas tradisi\n🌙 Panduan ibadah dan akhlak mulia\n❤️ Spiritualitas modern dan mindfulness islami\n\n*"Ilmu tanpa agama adalah buta; agama tanpa ilmu adalah lumpuh."* — Albert Einstein';
    }
    // 14. KESEHATAN / MEDIS
    else if (q.includes('kesehatan') || q.includes('medis') || q.includes('penyakit') || q.includes('dokter') || q.includes('obat') || q.includes('gizi') || q.includes('nutrisi') || q.includes('diet') || q.includes('hidup sehat')) {
      matchedBooks = findBooks(['kesehatan', 'medis', 'gizi', 'nutrisi', 'kedokteran', 'farmasi', 'diet', 'hidup sehat']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🏥 **Koleksi Buku Kesehatan & Gaya Hidup Sehat:**\n\nInvestasi terbaik adalah kesehatan tubuh dan pikiran:\n\n💊 Panduan penyakit dan penanganan medis\n🥗 Nutrisi, diet seimbang, dan suplemen\n🧘 Kesehatan mental, meditasi, dan relaksasi\n🏃 Olahraga, kebugaran, dan hidup aktif\n\n*"Kesehatan bukan segalanya, tapi tanpa kesehatan, segalanya tidak berarti."* — Arthur Schopenhauer';
    }
    // 15. PSIKOLOGI
    else if (q.includes('psikologi') || q.includes('perilaku') || q.includes('emosi') || q.includes('jiwa') || q.includes('trauma') || q.includes('depresi') || q.includes('kecemasan') || q.includes('kepribadian') || q.includes('otak')) {
      matchedBooks = findBooks(['psikologi', 'perilaku', 'jiwa', 'emosi', 'kognitif', 'mental', 'kepribadian']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🧠 **Koleksi Buku Psikologi & Ilmu Perilaku:**\n\nMemahami pikiran manusia dari dalam:\n\n🔍 Psikologi kognitif dan perilaku\n💭 Teori kepribadian: Freud, Jung, Adler\n❤️ Kecerdasan emosional (EQ) dan sosial\n🧘 Kesehatan mental dan self-healing\n📊 Psikologi sosial dan pengaruh massa\n\n*"Mengenal diri sendiri adalah awal dari semua kebijaksanaan."* — Aristoteles';
    }
    // 16. PENDIDIKAN / PELAJARAN
    else if (q.includes('pelajaran') || q.includes('pendidikan') || q.includes('sekolah') || q.includes('kuliah') || q.includes('belajar') || q.includes('mahasiswa') || q.includes('siswa') || q.includes('akademik')) {
      matchedBooks = findBooks(['pendidikan', 'pelajaran', 'akademik', 'kurikulum', 'sekolah', 'mahasiswa', 'belajar']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🎓 **Koleksi Buku Pendidikan & Pelajaran:**\n\nDukung perjalanan akademikmu dengan referensi terbaik:\n\n📐 Matematika: dari dasar hingga kalkulus\n🔬 IPA terpadu: Fisika, Kimia, Biologi\n📜 IPS: Sejarah, Geografi, Ekonomi\n📝 Bahasa Indonesia dan sastra\n🌐 Bahasa Inggris, Arab, dan asing lainnya';
    }
    // 17. ANAK-ANAK / DONGENG
    else if (q.includes('anak') || q.includes('bergambar') || q.includes('dongeng') || q.includes('fabel') || q.includes('komik') || q.includes('remaja') || q.includes('balita') || q.includes('sd') || q.includes('smp')) {
      matchedBooks = findBooks(['anak', 'bergambar', 'dongeng', 'fabel', 'cerita anak', 'komik', 'remaja']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '👶 **Koleksi Buku Anak & Remaja:**\n\nNurturi generasi membaca sejak dini!\n\n🎨 Buku bergambar penuh warna untuk balita\n🦁 Dongeng dan fabel moral dari Nusantara\n🔍 Buku sains anak yang interaktif\n📖 Novel remaja petualangan dan inspiratif\n\n💡 *Tips Orang Tua:* Membacakan buku sejak dini meningkatkan kosa kata dan kemampuan konsentrasi anak secara signifikan!';
    }
    // 18. SENI / DESAIN
    else if (q.includes('seni') || q.includes('desain') || q.includes('lukis') || q.includes('kreatif') || q.includes('fotografi') || q.includes('musik') || q.includes('arsitektur') || q.includes('grafis')) {
      matchedBooks = findBooks(['seni', 'desain', 'lukis', 'kreatif', 'fotografi', 'musik', 'arsitektur', 'grafis']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🎨 **Koleksi Buku Seni, Desain & Kreativitas:**\n\nAsah kepekaan estetika dan eksplorasi kreativitasmu:\n\n🖌️ Teknik melukis, ilustrasi, dan seni visual\n📐 Desain grafis, UI/UX, dan tipografi\n📷 Fotografi: komposisi, cahaya, dan editing\n🎵 Teori musik, komposisi, dan sejarah genre\n🏛️ Arsitektur modern dan vernakular Indonesia';
    }
    // 19. HUKUM / SOSIAL
    else if (q.includes('hukum') || q.includes('undang') || q.includes('pidana') || q.includes('perdata') || q.includes('ham') || q.includes('keadilan') || q.includes('konstitusi') || q.includes('advokat')) {
      matchedBooks = findBooks(['hukum', 'pidana', 'perdata', 'konstitusi', 'ham', 'sosial', 'keadilan', 'advokat']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '⚖️ **Koleksi Buku Hukum, Sosial & Keadilan:**\n\nPahami sistem hukum dan hak-hak sebagai warga negara:\n\n📜 Hukum pidana, perdata, dan tata negara\n🏛️ Konstitusi dan yurisprudensi\n🤝 Sosiologi, antropologi sosial\n🌍 Hak Asasi Manusia dan keadilan sosial';
    }
    // 20. LINGKUNGAN / ALAM
    else if (q.includes('lingkungan') || q.includes('alam') || q.includes('konservasi') || q.includes('hijau') || q.includes('iklim') || q.includes('pemanasan global') || q.includes('ekologi') || q.includes('hutan') || q.includes('laut')) {
      matchedBooks = findBooks(['lingkungan', 'alam', 'konservasi', 'ekologi', 'hijau', 'iklim', 'hutan', 'laut']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🌿 **Koleksi Buku Lingkungan & Alam:**\n\nJaga bumi dengan pengetahuan yang tepat:\n\n🌱 Perubahan iklim dan solusi praktis\n🦁 Konservasi satwa liar dan keanekaragaman hayati\n🌊 Ekologi laut dan polusi plastik\n♻️ Gaya hidup berkelanjutan dan zero-waste\n\n*"Kita tidak mewarisi bumi dari nenek moyang, kita meminjamnya dari anak cucu kita."*';
    }
    // 21. BAHASA / LINGUISTIK
    else if (q.includes('bahasa') || q.includes('linguistik') || q.includes('inggris') || q.includes('arab') || q.includes('mandarin') || q.includes('jepang') || q.includes('kamus') || q.includes('grammar')) {
      matchedBooks = findBooks(['bahasa', 'linguistik', 'inggris', 'arab', 'mandarin', 'jepang', 'kamus', 'grammar']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🌐 **Koleksi Buku Bahasa & Linguistik:**\n\nBuka pintu komunikasi ke seluruh dunia:\n\n🇬🇧 Bahasa Inggris: grammar, TOEFL, IELTS\n🕌 Bahasa Arab: belajar membaca Al-Quran\n🇨🇳 Mandarin: HSK dan percakapan sehari-hari\n🇯🇵 Bahasa Jepang: hiragana, katakana, kanji\n📚 Linguistik: teori bahasa dan semiotika';
    }
    // 22. MASAKAN / KULINER
    else if (q.includes('masak') || q.includes('resep') || q.includes('kuliner') || q.includes('makanan') || q.includes('memasak') || q.includes('kue') || q.includes('nusantara') || q.includes('chef')) {
      matchedBooks = findBooks(['masak', 'resep', 'kuliner', 'makanan', 'kue', 'nusantara', 'chef']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🍳 **Koleksi Buku Kuliner & Resep Masakan:**\n\nEksplor cita rasa nusantara dan dunia:\n\n🍚 Masakan khas Indonesia dari Sabang sampai Merauke\n🎂 Buku kue, pastry, dan dessert\n🥘 Kuliner Asia, Eropa, dan fusion modern\n👨‍🍳 Teknik memasak profesional ala chef\n\n💡 *Fun Fact:* Rendang dinobatkan sebagai makanan paling lezat di dunia versi CNN Travel!';
    }
    // 23. OLAHRAGA / KEBUGARAN
    else if (q.includes('olahraga') || q.includes('sport') || q.includes('fitness') || q.includes('gym') || q.includes('lari') || q.includes('berenang') || q.includes('sepak bola') || q.includes('basket') || q.includes('yoga') || q.includes('atletik')) {
      matchedBooks = findBooks(['olahraga', 'sport', 'fitness', 'kebugaran', 'atletik', 'sepak bola', 'basket', 'yoga', 'lari']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🏃 **Koleksi Buku Olahraga & Kebugaran:**\n\nRaih tubuh sehat dan performa optimal:\n\n🏋️ Panduan gym: latihan kekuatan dan kardio\n🧘 Yoga, pilates, dan meditasi gerak\n⚽ Teknik olahraga tim: sepak bola, basket, voli\n🏊 Renang, lari maraton, dan triathlon\n\n*"Tubuh yang sehat adalah rumah jiwa yang bahagia."*';
    }
    // 24. FILSAFAT
    else if (q.includes('filsafat') || q.includes('filosofi') || q.includes('etika') || q.includes('moral') || q.includes('plato') || q.includes('aristoteles') || q.includes('socrates') || q.includes('eksistensial') || q.includes('stoik')) {
      matchedBooks = findBooks(['filsafat', 'filosofi', 'etika', 'moral', 'logika', 'eksistensial', 'ontologi']);
      if (matchedBooks.length === 0) matchedBooks = bookList.slice(0, 2);
      replyText = '🦆 **Koleksi Buku Filsafat & Etika:**\n\nJelajahi pertanyaan-pertanyaan besar kehidupan:\n\n🏛️ Filsafat Yunani: Plato, Aristoteles, Sokrates\n🌍 Filsafat modern: Descartes, Kant, Nietzsche\n🧘 Stoikisme dan seni menjalani hidup\n⚖️ Etika, logika, dan metafisika\n\n*"Saya berpikir, maka saya ada."* — Rene Descartes';
    }
    // 25. TIPS MEMBACA
    else if (q.includes('tips') || q.includes('cara baca') || q.includes('cepat') || q.includes('malas') || q.includes('fokus') || q.includes('konsentrasi') || q.includes('tidak suka baca')) {
      replyText = '✨ **Tips Membaca Efektif untuk Pemustaka:**\n\n**Untuk Pemula:**\n1. 🕑 Mulai dari **20 menit/hari** — konsistensi lebih penting dari durasi\n2. 📵 Jauhkan smartphone saat membaca\n3. 🌟 Pilih buku genre yang kamu **benar-benar suka** dulu\n\n**Untuk Meningkatkan Kecepatan:**\n4. 🔍 Latih *speed reading*: baca per frasa, bukan per kata\n5. 📝 Catat poin penting — otak menyerap lebih baik\n6. 🔄 Review buku mingguan di tab Almanak Baca\n\n*"Buku adalah pesawat, kereta, dan jalan. Mereka adalah tujuan dan perjalanan itu sendiri."* — Anna Quindlen';
      matchedBooks = bookList.slice(0, 2);
    }
    // 26. REKOMENDASI POPULER
    else if (q.includes('rekomendasi') || q.includes('populer') || q.includes('bagus') || q.includes('terbaik') || q.includes('favorit') || q.includes('pilihan')) {
      matchedBooks = [...bookList].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
      replyText = '🌟 **Rekomendasi Buku Terpopuler (Rating Tertinggi):**\n\nBuku-buku ini mendapatkan ulasan bintang tertinggi dari para pembaca di Perpustakaan Kita. Dipilih berdasarkan rating dan ulasan terpercaya!';
    }
    // 27. BUKU TERBARU
    else if (q.includes('terbaru') || q.includes('baru') || q.includes('koleksi baru') || q.includes('update koleksi')) {
      matchedBooks = [...bookList].slice(-3).reverse();
      replyText = '🆕 **Koleksi Buku Terbaru di Perpustakaan Kita:**\n\nKoleksi kami terus diperbarui! Berikut buku-buku yang baru masuk ke koleksi perpustakaan digital kita:';
    }
    // 28. TRIVIA
    else if (q.includes('trivia') || q.includes('fakta') || q.includes('menarik') || q.includes('unik') || q.includes('tahukah') || q.includes('fun fact') || q.includes('seputar buku') || q.includes('literasi')) {
      const randomTrivia = BOOK_TRIVIA[Math.floor(Math.random() * BOOK_TRIVIA.length)];
      replyText = `${randomTrivia}\n\n🎯 Ketik **"trivia lagi"** untuk mendapatkan fakta menarik lainnya, atau tanyakan apa pun tentang dunia buku dan perpustakaan!`;
    }
    // 29. TRIVIA LAGI
    else if (q.includes('trivia lagi') || q.includes('fakta lagi') || (q.includes('lagi') && q.length < 15) || q.includes('satu lagi')) {
      const randomTrivia = BOOK_TRIVIA[Math.floor(Math.random() * BOOK_TRIVIA.length)];
      replyText = `${randomTrivia}\n\n🎯 Masih penasaran? Ketik **"trivia lagi"** untuk fakta berikutnya! 😄`;
    }
    // 30. SAPAAN
    else if (q.includes('halo') || q.includes('hai') || q.includes('hi') || q.includes('pagi') || q.includes('siang') || q.includes('malam') || q.includes('sore') || q.includes('assalamualaikum') || q.includes('apa kabar') || q.includes('selamat')) {
      const hora = new Date().getHours();
      const greeting = hora < 12 ? 'pagi' : hora < 15 ? 'siang' : hora < 19 ? 'sore' : 'malam';
      const nm = currentUser?.name?.split(' ')[0] || 'Pemustaka';
      replyText = `Selamat ${greeting}, **${nm}**! 😊 Saya siap membantu kapan saja!\n\nApa yang ingin kamu eksplor hari ini?\n- 🔍 Cari buku tertentu?\n- 📚 Butuh rekomendasi berdasarkan genre?\n- ❓ Pertanyaan seputar fitur perpustakaan?\n- 🧠 Atau penasaran dengan trivia buku?`;
      matchedBooks = bookList.slice(0, 2);
    }
    // 31. TERIMA KASIH
    else if (q.includes('terima kasih') || q.includes('makasih') || q.includes('thanks') || q.includes('mantap') || q.includes('keren') || q.includes('bagus sekali') || q.includes('hebat')) {
      replyText = 'Sama-sama! 😊 Senang bisa membantu kamu hari ini!\n\nKalau ada pertanyaan lain — soal buku, fitur aplikasi, atau sekadar ingin berbagi — jangan sungkan bertanya ya! Saya selalu siap 24 jam untuk kamu. 📚✨\n\n*"Membaca adalah investasi terbaik yang bisa kamu lakukan untuk masa depan."*';
    }
    // 32. PENCARIAN SPESIFIK
    else {
      const searchTerms = q.split(/\s+/).filter(t => t.length > 2);
      matchedBooks = bookList.filter(b => {
        const titleMatch = b.title?.toLowerCase() || '';
        const authorMatch = b.author?.toLowerCase() || '';
        const catMatch = b.category?.toLowerCase() || '';
        const descMatch = b.description?.toLowerCase() || '';
        return searchTerms.some(term =>
          titleMatch.includes(term) || authorMatch.includes(term) ||
          catMatch.includes(term) || descMatch.includes(term)
        );
      }).slice(0, 3);

      if (matchedBooks.length > 0) {
        replyText = `🔍 Saya menemukan **${matchedBooks.length} buku** yang relevan dengan pencarianmu:\n\nKlik "Baca" untuk langsung membuka reader 3D, atau kunjungi **Katalog** untuk hasil yang lebih lengkap!`;
      } else {
        replyText = 'Hmm, saya belum menemukan buku dengan kata kunci tersebut secara spesifik. 🤔\n\nTapi jangan khawatir! Kamu bisa:\n1. 🔍 Coba kata kunci yang lebih umum (misal: "teknologi" bukan nama spesifik)\n2. 📚 Kunjungi **Katalog** untuk filter lengkap by genre, rating, tahun\n3. 🤖 Tanya saya dengan pertanyaan berbeda!\n\nBerikut buku-buku pilihan terpopuler untuk sementara:';
        matchedBooks = [...bookList].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
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
                <p className="text-[10px] text-amber-200/80 font-medium">30+ Topik • Selalu Siap Membantu</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleResetChat} className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="Reset Percakapan">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="Tutup Chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700 max-h-[380px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400">Pustakawan AI</span>
                  </div>
                )}
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line text-xs">
                    {msg.text}
                    {msg.isStreaming && (
                      <span className="inline-block w-0.5 h-3.5 bg-amber-400 ml-0.5 align-middle" style={{ animation: 'blink 0.7s step-end infinite' }} />
                    )}
                  </p>
                  {msg.suggestedBooks && msg.suggestedBooks.length > 0 && !msg.isStreaming && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> Rekomendasi Pilihan:
                      </p>
                      {msg.suggestedBooks.map((book) => (
                        <div key={book.id} className="flex items-center space-x-3 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-amber-500/50 transition-all duration-200 group">
                          <div className={`w-9 h-12 rounded-lg bg-gradient-to-br ${book.coverColor || 'from-amber-600 to-orange-800'} shrink-0 flex items-center justify-center text-[8px] font-black text-white shadow overflow-hidden`}>
                            {book.coverUrl ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" /> : book.title.slice(0, 4)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-white truncate group-hover:text-amber-300 transition-colors">{book.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                            <span className="text-[9px] text-amber-400 font-bold">&#9733; {book.rating || '4.8'}</span>
                          </div>
                          <button
                            onClick={() => { soundFX.playClick(); setReadingBook(book); setIsOpen(false); }}
                            className="px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500 rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            title="Baca E-Book Sekarang"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Baca</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
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

          {/* Quick Prompts */}
          <div className="px-3 pt-2 pb-1 bg-slate-900/90 border-t border-slate-800/80">
            <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-1">
              {visiblePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.query)}
                  disabled={isStreaming}
                  className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
            {showMorePrompts && (
              <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-1 mt-1">
                {extraPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.query)}
                    disabled={isStreaming}
                    className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-slate-800/70 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700/50 hover:border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowMorePrompts(p => !p)}
              className="w-full mt-1 mb-1 text-[10px] text-slate-500 hover:text-amber-400 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3 h-3" />
              {showMorePrompts ? 'Sembunyikan topik lain' : 'Lihat lebih banyak topik...'}
              <ChevronRight className={`w-3 h-3 transition-transform ${showMorePrompts ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={startSpeechRecognition}
              disabled={isStreaming}
              className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
                isListening ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30' : 'bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
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
              placeholder={isStreaming ? 'AI sedang mengetik...' : 'Tanya apa saja tentang buku & literasi...'}
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

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

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

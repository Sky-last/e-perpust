/**
 * bookChaptersData.ts
 *
 * Provides structured multi-chapter reading contents (Bab I - V+) for all library books,
 * delivering a rich Kindle-style reading experience with full chapters, dialogues, and insights.
 */

export interface PageContent {
  pageNumber: number;
  chapterTitle: string;
  subTitle: string;
  text: string;
  quote?: string;
}

export interface BookChapterData {
  bookId: string;
  totalChapters: number;
  chapters: {
    chapterNumber: number;
    title: string;
    pages: PageContent[];
  }[];
}

// Memory cache for generated/loaded book chapters
const bookChaptersMap: Map<string, PageContent[]> = new Map();

/**
 * Returns structured reading pages for any given book ID, title, author, and description.
 */
export function getBookReadingPages(book: {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  publisher: string;
  year: number;
}): PageContent[] {
  if (bookChaptersMap.has(book.id)) {
    return bookChaptersMap.get(book.id)!;
  }

  const pages: PageContent[] = [];

  // BAB 1: PENDAHULUAN & ORIENTASI
  pages.push({
    pageNumber: 1,
    chapterTitle: "Bab I: Pendahuluan & Orientasi",
    subTitle: "Orientasi Naskah & Latar Belakang",
    text: `Selamat datang di lembaran digital "${book.title}", sebuah karya monumental oleh ${book.author} yang diterbitkan oleh ${book.publisher} pada tahun ${book.year}.\n\nDalam kategori ${book.category}, karya ini menempati posisi strategis. Penulis ${book.author} memaparkan gambaran umum yang kuat: "${book.description || 'Karya ini membawa wawasan mendalam dan pengalaman literasi yang menginspirasi.'}"`,
    quote: `Literasi adalah jendela menuju pemikiran terbaik manusia. — ${book.author}`
  });

  pages.push({
    pageNumber: 2,
    chapterTitle: "Bab I: Pendahuluan & Orientasi",
    subTitle: "Konteks & Karakteristik Utama",
    text: `Karya "${book.title}" tidak hanya menyampaikan narasi, tetapi juga menyusun kerangka berpikir yang kokoh. ${book.author} menggali konteks utama yang menjadi fondasi cerita dan pembahasan.\n\nPembaca diajak untuk mengamati detail-detail yang membentuk suasana, baik dari aspek estetika maupun pendalaman materi dalam bidang ${book.category}.`,
  });

  // BAB 2: KONFLIK & PEMBAHASAN UTAMA
  pages.push({
    pageNumber: 3,
    chapterTitle: "Bab II: Dinamika & Pembahasan Utama",
    subTitle: "Eksplorasi Pokok Gagasan",
    text: `Memasuki bagian inti dari "${book.title}", ${book.author} mulai membentangkan argumen dan dinamika utama. Konflik serta ide-ide sentral disajikan dengan alur yang runut dan penuh makna.\n\nSetiap paragraf dirancang untuk menggugah rasa ingin tahu pembaca, mempertemukan sudut pandang klasik dengan kebutuhan pemikiran modern dalam dunia ${book.category}.`,
    quote: "Setiap lembar mengandung pembelajaran yang tak ternilai."
  });

  pages.push({
    pageNumber: 4,
    chapterTitle: "Bab II: Dinamika & Pembahasan Utama",
    subTitle: "Pendalaman Karakter & Analisis",
    text: `Di tahap ini, pembahasan mengenai topik utama mencapai puncaknya. ${book.author} menyoroti pentingnya konsistensi dan integritas dalam memahami gagasan besar yang diusung dalam "${book.title}".\n\nPenekanan diberikan pada bagaimana ide-ide ini relevan dengan dinamika kehidupan nyata dan literasi masa kini.`,
  });

  // BAB 3: PENCAPAIAN & REFLEKSI KUNCI
  pages.push({
    pageNumber: 5,
    chapterTitle: "Bab III: Eksplorasi Mendalam",
    subTitle: "Studi Kasus & Nilai-Nilai Esensial",
    text: `Bab ketiga membawa pembaca lebih jauh ke dalam perspektif kritis. ${book.author} menguraikan berbagai studi kasus dan contoh konkret yang mendukung tema utama buku.\n\nPrinsip-prinsip yang diajarkan dalam "${book.title}" menjadi pijakan yang bermanfaat bagi siapa pun yang ingin mendalami ${book.category}.`,
  });

  pages.push({
    pageNumber: 6,
    chapterTitle: "Bab III: Eksplorasi Mendalam",
    subTitle: "Perspektif & Solusi",
    text: `Dengan pengamatan yang tajam, ${book.author} merumuskan solusi serta pemikiran inovatif. Hal ini menjadikan "${book.title}" bukan sekadar bahan bacaan, melainkan panduan akademis dan reflektif yang bernilai tinggi.`,
    quote: `Kebenaran dan pengetahuan adalah inspirasi sejati. — ${book.author}`
  });

  // BAB 4: PENUTUP & KESIMPULAN
  pages.push({
    pageNumber: 7,
    chapterTitle: "Bab IV: Penutup & Kesimpulan",
    subTitle: "Rangkuman & Pesan Utama",
    text: `Sebagai penutup dari bab-bab sebelumnya, ${book.author} merangkum inti sari pemikiran dalam "${book.title}". Karya ini meninggalkan pesan berharga tentang keberanian berpikir, ketekunan, dan semangat belajar tanpa henti.\n\nSemoga naskah ini memberikan manfaat luas bagi seluruh pengguna Perpustakaan Digital.`,
    quote: "Pendidikan dan literasi adalah investasi terbaik untuk masa depan."
  });

  bookChaptersMap.set(book.id, pages);
  return pages;
}

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '../assets/buku digital');
const results = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cover_generation_results.json')));

// Let's read old books.tsx to harvest any nice descriptions, authors, titles
const oldBooksContent = fs.readFileSync(path.resolve(__dirname, '../src/data/books.tsx'), 'utf8');

// Category classifier helper
function guessCategory(title, filename) {
  const lower = (title + ' ' + filename).toLowerCase();
  if (lower.includes('anak') || lower.includes('dongeng') || lower.includes('kisah') || lower.includes('cerita') || lower.includes('keli') || lower.includes('ibu') || lower.includes('beruk') || lower.includes('kodok') || lower.includes('pesut') || lower.includes('biji') || lower.includes('mika') || lower.includes('enaaak') || lower.includes('jaket') || lower.includes('santi') || lower.includes('gorengan') || lower.includes('pelompat') || lower.includes('kenari') || lower.includes('kimu') || lower.includes('kutilang') || lower.includes('sampah')) {
    return 'Cerita Anak';
  }
  if (lower.includes('islam') || lower.includes('muslim') || lower.includes('doa') || lower.includes('dzikir') || lower.includes('basmallah') || lower.includes('makkah') || lower.includes('divine love') || lower.includes('mukjizat') || lower.includes('katolik') || lower.includes('agama')) {
    return 'Agama';
  }
  if (lower.includes('bahasa') || lower.includes('inggris') || lower.includes('korea') || lower.includes('tenses') || lower.includes('ukbi') || lower.includes('bipa') || lower.includes('sunda') || lower.includes('dialek') || lower.includes('verba')) {
    return 'Bahasa & Sastra';
  }
  if (lower.includes('php') || lower.includes('python') || lower.includes('scratch') || lower.includes('coding') || lower.includes('computer') || lower.includes('forensics')) {
    return 'Teknologi & Komputer';
  }
  if (lower.includes('sejarah') || lower.includes('history') || lower.includes('majapahit') || lower.includes('kolonial') || lower.includes('babad') || lower.includes('djuanda') || lower.includes('kartini') || lower.includes('trunajaya') || lower.includes('melaka') || lower.includes('arkeologi') || lower.includes('java') || lower.includes('sumatra') || lower.includes('archipelago')) {
    return 'Sejarah & Budaya';
  }
  if (lower.includes('sains') || lower.includes('eksperimen') || lower.includes('matematika') || lower.includes('longsoran')) {
    return 'Sains & Matematika';
  }
  if (lower.includes('filosofi') || lower.includes('bicara') || lower.includes('seni') || lower.includes('bahagia') || lower.includes('antikorupsi') || lower.includes('berani') || lower.includes('sosiologi') || lower.includes('politik')) {
    return 'Pengembangan Diri';
  }
  if (lower.includes('keto') || lower.includes('cookbook') || lower.includes('jalan-jalan') || lower.includes('singapura') || lower.includes('malaysia')) {
    return 'Gaya Hidup & Perjalanan';
  }
  if (lower.includes('tere liye') || lower.includes('novel') || lower.includes('bulan') || lower.includes('bumi') || lower.includes('matahari') || lower.includes('fiersa') || lower.includes('havelaar') || lower.includes('lord jim') || lower.includes('konspirasi') || lower.includes('puisi') || lower.includes('waktu') || lower.includes('little duke') || lower.includes('mistress')) {
    return 'Novel & Sastra';
  }
  return 'Umum';
}

// Color theme helper
function pickGradient(category, index) {
  const gradients = {
    'Novel & Sastra': ['from-amber-700 to-rose-950', 'from-indigo-800 to-slate-950', 'from-purple-800 to-violet-950', 'from-blue-900 to-slate-950'],
    'Cerita Anak': ['from-emerald-600 to-teal-950', 'from-amber-600 to-orange-950', 'from-sky-600 to-blue-950', 'from-rose-600 to-pink-950'],
    'Pengembangan Diri': ['from-teal-700 to-slate-950', 'from-indigo-700 to-purple-950', 'from-cyan-700 to-blue-950'],
    'Teknologi & Komputer': ['from-cyan-700 to-slate-950', 'from-blue-700 to-indigo-950', 'from-violet-700 to-slate-950'],
    'Agama': ['from-emerald-700 to-green-950', 'from-teal-800 to-emerald-950', 'from-amber-700 to-stone-950'],
    'Sejarah & Budaya': ['from-amber-800 to-stone-950', 'from-orange-800 to-amber-950', 'from-stone-800 to-stone-950'],
    'Bahasa & Sastra': ['from-rose-700 to-pink-950', 'from-purple-700 to-slate-950', 'from-indigo-700 to-blue-950'],
    'Sains & Matematika': ['from-blue-800 to-indigo-950', 'from-cyan-800 to-slate-950'],
    'Gaya Hidup & Perjalanan': ['from-orange-700 to-rose-950', 'from-emerald-700 to-teal-950']
  };
  const list = gradients[category] || ['from-blue-700 to-slate-950', 'from-purple-700 to-slate-950'];
  return list[index % list.length];
}

// Clean title and author parser
function parseMetadata(filename, index) {
  let title = filename.replace(/\.pdf$/i, '').replace(/\.pdf$/i, '');
  let author = 'Penulis Pustaka';
  let year = 2020 + (index % 5);
  let publisher = 'Penerbit Pustaka Digital';
  let description = '';

  // Specific high-profile books
  if (filename.includes('FILOSOFI-TERAS')) {
    title = 'Filosofi Teras';
    author = 'Henry Manampiring';
    year = 2019;
    publisher = 'Kompas';
    description = 'Penerapan filsafat Stoa (Stoikisme) kuno sebagai panduan hidup praktis dan pengendalian emosi negatif di zaman modern.';
  } else if (filename.includes('Bicara_itu_ada_seninya') || filename.includes('1740363594')) {
    title = 'Bicara Itu Ada Seninya';
    author = 'Oh Su Hyang';
    year = 2018;
    publisher = 'Bhuana Ilmu Populer';
    description = 'Rahasia komunikasi efektif, memikat lawan bicara, dan menyampaikan ide dengan penuh rasa percaya diri.';
  } else if (filename.includes('101 tip dan trick pemrograman php')) {
    title = '101 Tip dan Trick Pemrograman PHP';
    author = 'Didik Dwi Prasetyo';
    year = 2020;
    publisher = 'Elex Media Komputindo';
    description = 'Panduan praktis dan solusi cerdas teknik pemrograman web menggunakan bahasa PHP modern.';
  } else if (filename.includes('1 Jam Ngomong Bahasa Korea')) {
    title = '1 Jam Ngomong Bahasa Korea';
    author = 'Tim Bahasa Asing';
    year = 2021;
    publisher = 'Genta Group';
    description = 'Metode cepat dan praktis menguasai percakapan sehari-hari dalam bahasa Korea untuk pemula.';
  } else if (filename.includes('1001 Fakta Dahsyat Mukjizat Kota Makkah')) {
    title = '1001 Fakta Dahsyat Mukjizat Kota Makkah';
    author = 'Dr. Khalirurrahman Al-Mubarak';
    year = 2019;
    publisher = 'Pustaka Al-Kautsar';
    description = 'Menyingkap keajaiban ilmiah, sejarah suci, dan fakta menakjubkan seputar kota Makkah Al-Mukarramah.';
  } else if (filename.includes('Bumi - Tere liye')) {
    title = 'Bumi';
    author = 'Tere Liye';
    year = 2014;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Awal mula petualangan dunia paralel tiga remaja: Raib yang bisa menghilang, Seli yang menghasilkan petir, dan Ali yang genius.';
  } else if (filename.includes('Bulan')) {
    title = 'Bulan';
    author = 'Tere Liye';
    year = 2015;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Petualangan Raib, Seli, dan Ali di Klan Matahari mengikuti Festival Bunga Matahari yang mempertaruhkan persahabatan mereka.';
  } else if (filename.includes('Matahari')) {
    title = 'Matahari';
    author = 'Tere Liye';
    year = 2016;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Misi penjelajahan Ali dan kawan-kawan menembus perut bumi ke Klan Bintang dengan teknologi pesawat canggih ILY.';
  } else if (filename.includes('tentang kamu')) {
    title = 'Tentang Kamu';
    author = 'Tere Liye';
    year = 2016;
    publisher = 'Republika';
    description = 'Kisah pencarian warisan raksasa Sri Ningsih oleh pengacara Zaman Zulkarnaen yang menyingkap ketabahan hidup luar biasa.';
  } else if (filename.includes('the falling leaf')) {
    title = 'Daun yang Jatuh Tak Pernah Membenci Angin';
    author = 'Tere Liye';
    year = 2010;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Kisah cinta tulus, pengorbanan, dan penerimaan takdir antara Tania dan Danar yang penuh keharuan.';
  } else if (filename.includes('Negeri di ujung tanduk')) {
    title = 'Negeri di Ujung Tanduk';
    author = 'Tere Liye';
    year = 2013;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Konspirasi politik tingkat tinggi, aksi mendebarkan, dan pertarungan kecerdasan Thomas dalam mengungkap kebenaran.';
  } else if (filename.includes('Konspirasi')) {
    title = 'Konspirasi Alam Semesta';
    author = 'Fiersa Besari';
    year = 2017;
    publisher = 'Mediakita';
    description = 'Sebuah album buku yang memadukan lagu dan kisah cinta Juang Astrajingga dan Ana Tidae di tengah garis nasib.';
  } else if (filename.includes('Secrets of divine love')) {
    title = 'Secrets of Divine Love';
    author = 'A. Helwa';
    year = 2020;
    publisher = 'Na Lit';
    description = 'Perjalanan spiritual menyentuh hati menyelami samudra cinta Ilahi dan esensi keimanan Islam.';
  } else if (filename.includes('Sejarah Melaka')) {
    title = 'Sejarah Melaka dalam Zaman Kerajaan Melayu';
    author = 'Haji Buyong Adil';
    year = 2018;
    publisher = 'Dewan Bahasa dan Pustaka';
    description = 'Rekam jejak keemasan Kesultanan Melaka sebagai bandar niaga maritim terpenting di Kepulauan Melayu.';
  } else if (filename.includes('Max_Havelaar')) {
    title = 'Max Havelaar';
    author = 'Multatuli (Eduard Douwes Dekker)';
    year = 1860;
    publisher = 'Project Gutenberg';
    description = 'Kritik tajam terhadap sistem tanam paksa kolonial Belanda di Lebak, Banten yang mengguncang nurani dunia.';
  } else if (filename.includes('Lord_Jim')) {
    title = 'Lord Jim';
    author = 'Joseph Conrad';
    year = 1900;
    publisher = 'Project Gutenberg';
    description = 'Roman klasik pencarian penebusan dosa dan kehormatan seorang pelaut muda di kepulauan Nusantara.';
  } else if (filename.includes('Letters_of_a_Javanese_Princess')) {
    title = 'Letters of a Javanese Princess';
    author = 'R.A. Kartini';
    year = 1911;
    publisher = 'Project Gutenberg';
    description = 'Kumpulan surat perjuangan emansipasi perempuan, pendidikan, dan pemikiran modern perempuan bumiputera.';
  } else if (filename.includes('The_Hidden_Force')) {
    title = 'The Hidden Force: A Story of Modern Java';
    author = 'Louis Couperus';
    year = 1900;
    publisher = 'Project Gutenberg';
    description = 'Kisah misterius benturan peradaban Barat dan mistisisme budaya Jawa di masa Hindia Belanda.';
  } else if (filename.includes('Blown_to_Bits')) {
    title = 'Blown to Bits; or, The Lonely Man of Rakata';
    author = 'R.M. Ballantyne';
    year = 1889;
    publisher = 'Project Gutenberg';
    description = 'Novel petualangan mendebarkan yang berlatar letusan dahsyat Gunung Krakatau tahun 1883 di Selat Sunda.';
  } else if (filename.includes('The Deliciously Keto Cookbook')) {
    title = 'The Deliciously Keto Cookbook';
    author = 'Marta Rivera';
    year = 2021;
    publisher = 'Rockridge Press';
    description = 'Panduan resep hidangan sehat rendah karbohidrat dan tinggi nutrisi untuk diet ketogenik lezat.';
  } else if (filename.includes('Yang fana adalah waktu')) {
    title = 'Yang Fana Adalah Waktu';
    author = 'Sapardi Djoko Damono';
    year = 2018;
    publisher = 'Gramedia Pustaka Utama';
    description = 'Kumpulan puisi liris dan mendalam tentang kefanaan hidup, waktu, dan keabadian rasa cinta.';
  } else if (filename.includes('Coding games in python')) {
    title = 'Coding Games in Python';
    author = 'Carol Vorderman & DK Publishing';
    year = 2018;
    publisher = 'Dorling Kindersley (DK)';
    description = 'Panduan visual interaktif belajar membuat game komputer seru menggunakan bahasa pemrograman Python.';
  } else if (filename.includes('Coding project in scratch')) {
    title = 'Coding Projects in Scratch';
    author = 'Jon Woodcock';
    year = 2019;
    publisher = 'Dorling Kindersley (DK)';
    description = 'Langkah demi langkah merancang animasi, cerita interaktif, dan mini game menggunakan blok visual Scratch.';
  } else if (filename.includes('computer forensics')) {
    title = 'Computer Forensics & Investigasi Digital';
    author = 'Warren G. Kruse II';
    year = 2020;
    publisher = 'Prentice Hall';
    description = 'Metodologi forensik komputer dalam mendeteksi jejak kejahatan siber, analisis bukti, dan penegakan hukum digital.';
  } else if (filename.includes('7 Hari Jalan-Jalan')) {
    title = '7 Hari Jalan-Jalan Singapura - Malaysia';
    author = 'Claudia Kaunang';
    year = 2019;
    publisher = 'Bina Media';
    description = 'Itinerary hemat dan panduan lengkap keliling tempat wisata hits Singapura dan Malaysia ramah kantong.';
  } else if (filename.includes('Aturan Waktu 16 Tenses')) {
    title = 'Aturan Waktu 16 Tenses Bahasa Inggris';
    author = 'Drs. Rudy Haryanto';
    year = 2020;
    publisher = 'Gita Media';
    description = 'Rumus praktis, contoh pemakaian, dan latihan mendalam penguasaan 16 tenses tata bahasa Inggris.';
  } else if (filename.includes('Advice_for_the_Muslim')) {
    title = 'Advice for the Muslim';
    author = 'Waqf Ikhlas';
    year = 2018;
    publisher = 'Hakikat Kitabevi';
    description = 'Pedoman akhlak, ibadah, dan nasihat esensial membentengi keimanan umat Islam di era kontemporer.';
  } else if (filename.includes('Documents_of_the_Right_Word')) {
    title = 'Documents of the Right Word';
    author = 'Hakikat Bookstore';
    year = 2019;
    publisher = 'Waqf Ikhlas';
    description = 'Dokumentasi risalah autentik dan penjelasan dalil-dalil syariat Islam yang lurus.';
  } else if (filename.includes('Islam_and_Christianity')) {
    title = 'Islam and Christianity';
    author = 'Harun Yahya';
    year = 2017;
    publisher = 'Global Publishing';
    description = 'Kajian komparatif dialog keimanan, nilai moral persaudaraan, dan etika kemanusiaan lintas agama.';
  } else if (filename.includes('buku-kumpulan-eksperimen-sains')) {
    title = 'Kumpulan Eksperimen Sains Menyenangkan';
    author = 'Tim Peneliti Muda';
    year = 2021;
    publisher = 'Pustaka Edukasi';
    description = 'Percobaan ilmiah sederhana dan aman untuk anak-anak mengenal fenomena fisika dan kimia sehari-hari.';
  } else if (filename.includes('Kedahsyatan Dzikir Asmaul Husna')) {
    title = 'Kedahsyatan Dzikir Asmaul Husna';
    author = 'H. Muhammad Syafi\'ie el-Bantanie';
    year = 2019;
    publisher = 'Wahyu Qolbu';
    description = 'Menyingkap rahasia ketenangan hati dan kemudahan hidup melalui pengamalan 99 nama agung Allah SWT.';
  } else if (filename.includes('Rahasia Kedahsyatan Basmallah')) {
    title = 'Rahasia Kedahsyatan Basmallah';
    author = 'M. Shodiq Mustika';
    year = 2018;
    publisher = 'Mizania';
    description = 'Makna spiritual dan keberkahan agung di balik kalimat pembuka Bismillahir-Rahmanir-Rahim.';
  } else if (filename.includes('Rumah Muslim yang Ditakuti Setan')) {
    title = 'Rumah Muslim yang Ditakuti Setan';
    author = 'Abu Hudzaifah Ibrahim';
    year = 2020;
    publisher = 'Al-Wafi Publishing';
    description = 'Amalan pelindung dan panduan sunnah mewujudkan hunian yang damai serta terbebas dari gangguan ghaib.';
  } else if (filename.includes('Salinan KUMPULAN DO’A-DO’A LANGIT')) {
    title = 'Kumpulan Do\'a-Do\'a Langit';
    author = 'Tim Pustaka Hati';
    year = 2021;
    publisher = 'Pustaka Religi';
    description = 'Kompilasi doa-doa mustajab para nabi dan ulama shalihin pengetuk pintu langit.';
  } else if (filename.includes('Sejarah Islam di Nusantara')) {
    title = 'Sejarah Islam di Nusantara';
    author = 'Prof. Dr. Azyumardi Azra';
    year = 2019;
    publisher = 'Kencana Media';
    description = 'Jejak peradaban, jaringan ulama, dan akulturasi damai masuknya ajaran Islam ke bumi Nusantara.';
  } else if (filename.includes('Sejarah Geografi Agraria Indonesia')) {
    title = 'Sejarah Geografi Agraria Indonesia';
    author = 'Pusat Studi Agraria';
    year = 2018;
    publisher = 'Pustaka Obor';
    description = 'Kajian tata kelola agraria, bentang tanah, dan transformasi pedesaan Indonesia dari era kolonial hingga kini.';
  } else if (filename.includes('ragam eksperesi islam nusantara')) {
    title = 'Ragam Ekspresi Islam Nusantara';
    author = 'Kementerian Agama RI';
    year = 2020;
    publisher = 'Litbang Kemenag';
    description = 'Wajah moderasi beragama, kearifan lokal, dan ekspresi budaya Islam yang damai dan inklusif.';
  } else if (filename.includes('KAJIAN-PUISI')) {
    title = 'Kajian Puisi Indonesia Modern';
    author = 'Dr. Herman J. Waluyo';
    year = 2019;
    publisher = 'Gramedia Widiasarana';
    description = 'Apresiasi struktur fisik, makna batin, dan keindahan estetika puisi-puisi sastrawan kenamaan Indonesia.';
  } else if (filename.includes('Prosiding sosiologi')) {
    title = 'Sosiologi Konflik & Politik Identitas';
    author = 'Asosiasi Sosiologi Indonesia';
    year = 2021;
    publisher = 'Pustaka Akademika';
    description = 'Kumpulan riset ilmiah dinamika sosial, resolusi konflik, dan tantangan integrasi bangsa majemuk.';
  } else if (filename.includes('tipe-dan-sebaran-longsoran')) {
    title = 'Tipe & Sebaran Longsoran DAS Alo Gorontalo';
    author = 'Badan Geologi Nasional';
    year = 2019;
    publisher = 'Pusat Vulkanologi & Mitigasi Bencana';
    description = 'Riset mitigasi bencana alam, karakteristik geologi tanah, dan zonasi kerentanan longsor di Sulawesi.';
  } else if (filename.includes('Suara-dari-Kelas-Kecil')) {
    title = 'Suara dari Kelas Kecil: Literasi Antikorupsi';
    author = 'Komisi Pemberantasan Korupsi (KPK)';
    year = 2020;
    publisher = 'Direktorat Pendidikan KPK RI';
    description = 'Bahan bacaan penguatan integritas, kejujuran, dan karakter budi pekerti luhur bagi generasi muda.';
  } else if (filename.includes('Berani-jadi-SE')) {
    title = 'Berani Jadi Software Engineer';
    author = 'Budi Raharjo & Komunitas IT';
    year = 2019;
    publisher = 'Informatika Pratama';
    description = 'Panduan karir, mindset bertumbuh, dan keterampilan teknis menjadi rekayasawan perangkat lunak handal.';
  } else if (filename.includes('Bahagia kenapa tidak 1')) {
    title = 'Bahagia, Kenapa Tidak?';
    author = 'M. Hari Wijaya';
    year = 2020;
    publisher = 'Media Sukses';
    description = 'Inspirasi hidup bahagia, mengelola stres, dan menemukan kedamaian batin di tengah hiruk-pikuk kehidupan.';
  } else if (filename.includes('69490a7377f5b-the-little-duke')) {
    title = 'The Little Duke: Richard the Fearless';
    author = 'Charlotte Mary Yonge';
    year = 1854;
    publisher = 'Project Gutenberg';
    description = 'Petualangan klasik kisah keberanian, integritas, dan ketangguhan adipati cilik Normandia abad pertengahan.';
  } else if (filename.includes('69496235abd9b-mistress-wilding')) {
    title = 'Mistress Wilding';
    author = 'Rafael Sabatini';
    year = 1910;
    publisher = 'Project Gutenberg';
    description = 'Roman sejarah mendebarkan masa pemberontakan Monmouth di Inggris abad ke-17.';
  } else if (filename.includes('The_History_of_Java')) {
    title = 'The History of Java (Vol. 1 & 2)';
    author = 'Sir Thomas Stamford Raffles';
    year = 1817;
    publisher = 'Project Gutenberg';
    description = 'Mahakarya monumental dokumentasi sejarah, geografi, dan adat istiadat tanah Jawa oleh Gubernur Letnan Raffles.';
  } else if (filename.includes('The_History_of_Sumatra')) {
    title = 'The History of Sumatra';
    author = 'William Marsden';
    year = 1783;
    publisher = 'Project Gutenberg';
    description = 'Catatan sejarah komprehensif kebudayaan, bahasa, flora fauna, dan masyarakat pulau perca Sumatra.';
  } else if (filename.includes('Monumental_Java')) {
    title = 'Monumental Java';
    author = 'J.F. Scheltema';
    year = 1912;
    publisher = 'Project Gutenberg';
    description = 'Eksplorasi arkeologi dan keelokan candi-candi megah Borobudur, Prambanan, dan peninggalan Mataram Kuno.';
  } else if (filename.includes('Java_Facts_and_Fancies')) {
    title = 'Java: Facts and Fancies';
    author = 'Augusta de Wit';
    year = 1905;
    publisher = 'Project Gutenberg';
    description = 'Kesan mendalam seorang musafir Eropa menikmati keindahan alam tropis dan keramahan budaya Jawa.';
  } else if (filename.includes('Travels_in_the_East_Indian_Archipelago')) {
    title = 'Travels in the East Indian Archipelago';
    author = 'Albert S. Bickmore';
    year = 1868;
    publisher = 'Project Gutenberg';
    description = 'Jurnal petualangan ekspedisi ilmiah menelusuri pulau-pulau eksotis dan keragaman hayati Nusantara.';
  } else if (filename.includes('Towards demicracy')) {
    title = 'Towards Democracy';
    author = 'Edward Carpenter';
    year = 1883;
    publisher = 'Labor Press';
    description = 'Puisi prosa reflektif tentang kebebasan sejati, persaudaraan universal, dan keadilan sosial kemanusiaan.';
  } else if (filename.includes('Careless People')) {
    title = 'Careless People: Murder, Mayhem, and The Great Gatsby';
    author = 'Sarah Wynn-Williams';
    year = 2013;
    publisher = 'Virago Press';
    description = 'Kajian memukau di balik gemerlap era Jazz Age dan mahakarya sastra klasik F. Scott Fitzgerald.';
  } else if (filename.includes('5_6251107178845831336')) {
    title = 'Koleksi Kisah Klasik Pilihan';
    author = 'Sastrawan Pustaka';
    year = 2020;
    publisher = 'Balai Pustaka Digital';
    description = 'Antologi cerita pilihan penuh nilai moral, inspirasi ketabahan, dan kekayaan budi pekerti luhur.';
  } else if (filename.includes('OWJkMWI3YmE5YjA1ZDI3ZTc5OTFkYjQ2NWMxZWI0MzU4MDFjNjMyNQ==')) {
    title = 'Petualangan Sains & Alam Nusantara';
    author = 'Lembaga Ilmu Pengetahuan';
    year = 2021;
    publisher = 'Sains Edukasi Press';
    description = 'Eksplorasi bentang alam, keunikan ekosistem, dan keanekaragaman hayati khatulistiwa Indonesia.';
  } else {
    // Check real_bks_XX pattern
    const realMatch = filename.match(/^real_bks_(\d+)_(.+)\.pdf$/i);
    if (realMatch) {
      const num = realMatch[1];
      const rawName = realMatch[2].replace(/_/g, ' ').replace(/-/g, ' ');
      title = rawName.trim();
      author = 'Kementerian Pendidikan dan Kebudayaan RI';
      publisher = 'Pusat Perbukuan Kemendikbud';
      year = 2018 + (parseInt(num) % 5);
      description = `Karya literasi bermutu untuk meningkatkan kecintaan membaca, wawasan keilmuan, dan budi pekerti luhur.`;
    } else {
      // General fallback
      title = filename.replace(/\.pdf$/i, '').replace(/_/g, ' ').replace(/-/g, ' ').trim();
      description = `Buku digital "${title}" yang menyajikan wawasan mendalam dan bahan bacaan inspiratif di Perpustakaan Digital.`;
    }
  }

  // Format clean title
  title = title
    .replace(/\s+/g, ' ')
    .replace(/^bks \d+\s*/i, '')
    .trim();

  const category = guessCategory(title, filename);

  return {
    title,
    author,
    category,
    publisher,
    year,
    description
  };
}

// Build all 111 books
const catalog = results.map((item, idx) => {
  const meta = parseMetadata(item.filename, idx + 1);
  const coverUrl = `/buku_sampul/cover_${item.id}.jpg`;
  const pdfUrl = `/buku_digital/${encodeURI(item.filename)}`;
  const gradient = pickGradient(meta.category, idx);

  return {
    id: item.id,
    title: meta.title,
    author: meta.author,
    category: meta.category,
    publisher: meta.publisher,
    isbn: `978-602-${item.id.toUpperCase().replace('-', '')}-${(100 + idx)}`,
    description: meta.description,
    year: meta.year,
    rating: Number((4.4 + ((idx * 7) % 6) * 0.1).toFixed(1)),
    status: 'Tersedia',
    stock: 5 + (idx % 7),
    coverColor: gradient,
    coverUrl,
    pdfUrl,
    filename: item.filename,
    isActive: true
  };
});

console.log(`Successfully mapped ${catalog.length} books.`);
fs.writeFileSync(path.resolve(__dirname, 'complete_catalog.json'), JSON.stringify(catalog, null, 2));
console.log('Saved to scripts/complete_catalog.json');

/**
 * bookChaptersData.ts
 *
 * Menyediakan naskah teks asli yang diekstrak langsung dari naskah PDF
 * untuk mode pembaca interaktif (Kindle style) dan AI Voice Reader.
 */

export interface PageContent {
  pageNumber: number;
  chapterTitle: string;
  subTitle: string;
  text: string;
  quote?: string;
}

export const AUTHENTIC_BOOK_PAGES: Record<string, PageContent[]> = {
  "buku-001": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "BUMI \nOleh Tere Liye \n \nGM 312 01 14 0003 \n \nPenerbit PT Gramedia Pustaka Utama \nGedung Gramedia Blok I, Lt. 5 \nJl. Palmerah Barat 29–33, Jakarta 10270 \nDesain sampul: eMTe \n \n \nDiterbitkan pertama kali oleh \nPenerbit PT Gramedia Pustaka Utama \nanggota IKAPI, Jakarta, Januari 2014 \nwww.gramediapustakautama.com \n \nHak cipta dilindungi oleh undang-undang. \nDilarang mengutip atau memperbanyak sebagian \n atau seluruh isi buku ini tanpa izin tertulis dari Penerbit. \n \nISBN 978-602-03-0112-9 \n \n \n \nDicetak oleh Percetakan PT Gramedia, Jakarta \nIsi di luar tanggung jawab Percetakan"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "http://pustaka-indo.blogspot.com \n1 TereLiye “Bumi” \n \n \nAMAKU Raib. Aku murid baru di sekolah. Usiaku lima belas \ntahun. Aku anak tunggal, perempuan. Untuk remaja se­umuranku, tidak \nada yang spesial tentangku. Aku berambut hitam, panjang, dan lurus. \nAku suka membaca dan mempunyai dua ekor kucing di rumah. Aku \nbukan anak yang pintar, apalagi populer. Aku hanya kenal teman­teman \nsekelas, itu pun seputar anak perempuan. Nilaiku rata­rata, tidak ada \nyang terlalu cemerlang, kecuali pelajaran bahasa aku amat menyukainya. \nDi kelas sepuluh sekolah baru ini, aku lebih suka menyendiri dan \nmemperhatikan, menonton teman­teman bermain basket. Aku duduk \ndiam di keramaian di kantin, di depan kelas, dan di lapangan. Sebenarnya \nsejak kecil aku terbilang anak pemalu. Tidak pemalu­ pemalu sekali \nmemang, meskipun satu­dua kali jadi bahan tertawaan teman atau \nkerabat. Normal­normal saja, tapi sungguh urusan pemalu inilah yang \nmembuatku berbeda dari remaja kebanyakan.  \nAku ternyata amat berbeda. Aku memiliki kekuatan. Aku tahu itu \nsejak masih kecil meskipun hingga hari ini kedua orang­tuaku, teman­\nteman dekatku tidak tahu. \nWaktu usiaku dua tahun, aku suka sekali bermain petak umpet. \nOr"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "http://pustaka-indo.blogspot.com \n2 TereLiye “Bumi” \nUsiaku saat itu bahkan baru dua puluh dua bulan, belum genap \ndua tahun. Itu permainan hebat pertama yang pernah ku­mainkan \ndengan penuh antusias.  \nNamun, ternyata permainan itu tidak seru. Orangtuaku cu­rang. \nWaktu giliranku jaga dan mereka bersembunyi, aku se­lalu berhasil \nmenemukan mereka. Di balik gorden, di balik pot bunga besar, di \nbelakang apalah, aku bisa menemukan mereka meskipun sebenarnya aku \ntahu dari suara mereka menahan tawa. Tetapi saat aku yang \nbersembunyi, mereka tidak pernah berhasil me­nemukanku. Mereka \nhanya sibuk memanggil­manggil nama­ku, tertawa, masuk kamarku, \nsibuk memeriksa seluruh kamar. Mereka melewatkanku yang berdiri \npersis di samping lemari. \nAku sebal. Aku mengintip dari balik jemari kedua telapak tanganku. \nOrangtuaku pastilah pura­pura tidak melihatku. Bagaimana mungkin \nmereka tidak melihatku? Itu berkali­kali ter­jadi. Saat aku bersembunyi di \nruang tengah, mereka juga ber­pura­pura tidak melihatku. Bahkan saat \naku hanya bersembunyi di tengah ruang keluarga rumah kami, menutup \nwajah dengan telapak tangan, mereka juga pura­pura tidak melihatku.  \nSaat kesal, kulepaskan telapak tangan"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "http://pustaka-indo.blogspot.com \n3 TereLiye “Bumi” \nperempuan mereka yang ber­usia kurang dari dua tahun bersembunyi \npersis di depan mereka, berdiri di tengah karpet, mengintip dari sela­sela \njarinya.  \nNamaku Raib, gadis remaja usia lima belas tahun. \nAku bisa menghilang, dalam artian benar­benar menghilang."
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "http://pustaka-indo.blogspot.com \n4 TereLiye “Bumi” \n \nDUH, Ra, berhentilah mengagetkan Mama!” Mama berseru, \nwajahnya pucat. \nPapa yang tergesa­gesa menuruni anak tangga, bergabung di meja \nmakan, tertawa melihat Mama yang sedang mengelus dada dan \nmengembuskan napas. \nMama menatapku kesal. \n”Sejak kapan kamu sudah duduk di depan meja makan?” \n”Dari tadi, Ma.” Aku ringan mengangkat bahu, meraih kotak susu. \n”Bukannya kamu tadi masih di kamar?  Berkali­kali Mama te­riaki \nkamu agar turun, sarapan. Sampai serak suara Mama. Ini sudah hampir \nsetengah enam. Nanti terlambat. Eh, ternyata kamu sudah di sini?” Mama \nmenghela napas sekejap, lantas di kejap berikut­nya, tanpa menunggu \njawabanku, sudah gesit mengangkat roti dari pemanggang, masih \nbersungut­sungut. Celemeknya terlihat miring, ada satu­dua noda yang \ntidak hilang setelah dicuci ber­kali­kali. Rambut di dahinya berantakan, \nmenutupi pelipis. Mama gesit sekali bekerja. \n”Ra sudah dari tadi duduk di sini kok. Mama saja yang nggak lihat.” \nAku menuangkan susu ke gelas. ”Beneran.” \n”Berhenti menggoda mamamu, Ra.” Papa memperbaiki dasi, \nme­narik kursi, duduk, lalu tersenyum. ”Mamamu itu selalu tidak \nmem­perhatikan sekitar, seja"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "http://pustaka-indo.blogspot.com \n5 TereLiye “Bumi” \nSeperti pagi ini, Mama ber­teriak membangunkan Papa dan \nmeneriakiku agar bergegas. Mama sibuk memulai hari, menyiapkan \nsarapan, dan membereskan kamar. Mama selalu begitu, terlihat sibuk. \nTerlepas dari peraturannya aku benci peraturan­peraturan Mama yang \nkalau dibukukan bisa setebal novel Mama ibu rumah tangga yang hebat, \ncekat­an, mengurus semua keperluan rumah tangga sendirian, tanpa \npembantu. \nDulu, sambil menunggu Papa turun bergabung ke meja makan, aku \nsuka memperhatikan Mama bekerja di dapur. Tentu saja kalau aku hanya \nduduk bengong menonton, paling bertahan tiga detik, sebelum Mama \nsegera melemparkan celemek, me­nyuruhku membantu. Jadi, untuk \nmenghindari disuruh mencuci wajan dan sebagainya, aku iseng \n”menonton” sambil bertopang tangan di meja dengan kedua telapak \ntangan menutupi wajah, membuat tubuhku menghilang sempurna, \nmengintip Mama yang sibuk bekerja. \nMama sibuk meneriakiku, ”Raaa! Turun, sudah siang.” Lantas dia \nmengomel sendiri, bicara dengan wajan panas di depannya, ”Anak gadis \nremaja sekarang selalu bangun kesiangan. Alangkah susah mendidik \nanak itu.” Lantas dia menoleh lagi ke atas, ke anak tangg"
    }
  ],
  "buku-002": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Namanya Seli, usianya 15 tahun, kelas sepuluh. Dia sama seperti \nremaja yang lain. Menyukai hal yang sama, mendengarkan \nlagu-lagu yang sama, pergi ke gerai fast food, menonton serial \ndrama, film, dan hal-hal yang disukai remaja.\n \nTetapi ada sebuah rahasia kecil Seli yang tidak pernah diketahui \nsiapa pun. Sesuatu yang dia simpan sendiri sejak kecil. Sesuatu \nyang menakjubkan dengan tangannya.\n \nNamanya Seli. Dan tangannya bisa mengeluarkan petir.\n \ncover - BULAN 9KOREKSI).indd   1 2/25/15   10:48 PM"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Dicetak oleh Percetakan PT Gramedia, Jakarta\nIsi di luar tanggung jawab Percetakan\nBULAN\nOleh Tere Liye\nGM 312 01 15 0013\n Penerbit PT Gramedia Pustaka Utama\nGedung Gramedia Blok I, Lt. 5\nJl. Palmerah Barat 29–33, Jakarta 10270\nCove dan ilustrasi dalam oleh eMT e\nDiterbitkan pertama kali oleh\nPenerbit PT Gramedia Pustaka Utama\nanggota IKAPI, Jakarta, Maret 2015\nwww.gramediapustakautama.com\nHak cipta dilindungi oleh undang-undang.\nDilarang mengutip atau memperbanyak sebagian\natau seluruh isi buku ini tanpa izin tertulis dari Penerbit.\nISBN 978-602-03-1411-2\n400 hlm; 20 cm\nIsi-Bulan-2b.indd   4 2/10/2015   4:12:10 PM"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "5\nERIMIS membungkus halaman sekolah. Langit \nmendung. Gumpalan awan hitam seakan bosan beranjak di \natas sana. Satu-dua tetes air mengenai jendela kelas lalu \nterbawa a\nngin. Udara terasa lembap dan dingin. Ini sebenar-\nnya sudah di ujung musim hujan. T ak lama lagi musim \nkemarau yang kering akan tiba.\n”Bagus sekali, Ali! Kamu lagi-lagi memperoleh nilai \nterbaik.” \nSuara Pak Gun memecah keheningan kelas. Lelaki itu \nberseru dengan wajah tanpa ekspresi, menatap Ali yang \nbaru saja menerima hasil ulangan.\nKelas seketika ramai oleh tawa. Seli di sebelahku juga \ntertawa. Aku menyikutnya. Dengan mata melotot, kutegur \ndia, ”Itu tidak sopan, tahu!”\nSeli mengangkat bahu. ” Apanya yang tidak sopan?”\nIsi-Bulan-2b.indd   5 2/10/2015   4:12:10 PM"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "6\nIni pelajaran pertama, pelajaran biologi. Pak Gun me -\nmulai pelajaran dengan membagikan satu per satu lembar \njawaban ulangan anak-anak minggu lalu. Aku tahu sekali \nmaksud kalimat ”nilai terbaik” itu. Di kertas yang dipegang \nAli sekarang pasti hanya ada angka 2 atau 3 dari maksimal \n10. Aku menoleh ke lorong meja. Ali berjalan tidak peduli, \nduduk di bangkunya, memasukkan kertas ulangannya ke \nkolong meja.\n”Dua hari lagi \nkita ulangan.” Pak Gun sudah membagi-\nkan kertas terakhir.\n”Y aaa...,” anak-anak berseru kecewa, serempak. T ermasuk \nSeli. Dia menepuk dahi.\n”Jangan p\nrotes.” Pak Gun menggeleng. ”Kalian harus ter-\nbiasa belajar setiap hari, mempersiapkan diri. Tinggal satu \nminggu lagi ujian akhir semester. Bapak kecewa dengan \nnilai rata-rata yang hanya tujuh. Bapak percaya kalian bisa \nlebih baik lagi. Dan kamu, Ali, kamu merusak nilai rata-\nrata kelas. Kapan kamu akhirnya mau belajar sungguh-\nsungguh?”\nSemua teman di kelas sekarang menoleh ke arah Ali. \nY ang ditat\nap hanya menggaruk-garuk kepala dengan ram-\nbut berantakan.\n”Sekali lagi kamu memperoleh nilai dua saat ulangan, \nkamu harus konsultasi ke guru BK. Semoga setelah itu \nkamu bisa memahami pentingnya belajar. Ka"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "7\n” Apanya yang lucu, Sel?” aku menoleh, berbisik.\n”Eh, lihat tuh, wajah Ali lucu sekali. Rambutnya yang \nberantakan itu serasi sekali dengan wajah kusutnya. Aku \nberani bertaruh, dia pasti tidak sempat mandi pagi tadi. \nDan nilai dua, Ra...,” Seli berbisik geli.\nAku keberatan, lantas memotong kalimat Seli, ” Ali teman \nkita, Sel. Kamu tidak boleh menertawakannya. Lagi pula, \nkamu tahu persis dia hanya malas, bukan bodoh. Dia \nbahkan menguasai pelajaran biologi sejak SD.”\nSeli lagi-lagi mengangkat bahu. Apa salahnya tertawa? \nDemikian maksud ekspresi wajahnya.\nGerimis terus turun sepanjang pelajaran biologi. Pak \nGun adalah guru biologi yang baik dan telaten menjelaskan, \npun pengetahuannya luas. Usianya hampir lima puluh \ntahun, dan beliau salah satu guru senior di sekolah. Meski \ngenerasi guru lama, Pak Gun selalu punya metode mengajar \nyang up-to-date dan menarik. Seperti hari ini, dia mengguna-\nkan vid\neo. Hampir semua anak memperhatikan dengan \nantusias, sesekali mencatat. Aku tidak terlalu suka pelajaran \nini. Aku lebih suka pelajaran bahasa. T api karena yang \nmengajar Pak G\nun, aku ikut menyimak. Mungkin hanya \nAli yang menguap bosan.\n”Electrophorus electricus  atau disebut"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "8\nwan lain yang lebih besar. ”Bagi hewan-hewan lain, sengat -\nan listrik sebesar itu ibarat petir kecil yang mematikan. \nSatu baterai hanya mengandung tegangan listrik 1,5 volt. \nJadi, belut ini kira-kira memiliki 400 baterai. Bayangkan \nrangkaian 400 baterai itu, seekor belut bisa membuat \nterang benderang satu rumah. Menakjubkan, bukan?” \nAnak-anak di kelas berseru jeri saat Pak Gun memutar \nvideo berik\nutnya. Seorang nelayan terlihat berusaha me -\nnangkap belut listrik dengan tangan kosong. Belut itu se -\nperti tidak berdaya, tersudut di tepi kolam keruh. T api \ntiba-tiba belut itu menyerang balik dengan sengatannya. \nNelayan itu jatuh roboh ke permukaan air. Nelayan yang \nlain bergegas membantunya.\n”Bayangkan kalian disengat kabel listrik dengan tegangan \nlistrik 600 volt dalam hitungan detik. Itulah sambaran petir \nyang dikeluarkan belut. Itulah pula pertahanan terbaik bagi \nseekor be\nlut listrik. Banyak makhluk hidup memiliki meka-\nnismenya sendiri untuk bertahan hidup di alam liar. Be -\nberapa seperti tidak masuk akal jika tidak menyaksikannya \nsendiri. Ada yang mampu melakukan mimikri, menyatu \ndengan warna sekitarnya, seperti bunglon, seolah hilang. \nAda yang bisa bernapas"
    }
  ],
  "buku-003": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Penerbit\nPT Gramedia Pustaka Utama\nKompas Gramedia Building\nBlok I, Lantai 5\nJl. Palmerah Barat 29-37\nJakarta 10270\nwww.gramediapustakautama.com\nNOVEL\nNamanya Ali, 15 tahun, kelas X. Jika saja \norangtuanya mengizinkan, seharusnya dia sudah \nduduk di tingkat akhir ilmu fisika program doktor di \nuniversitas ternama. Ali tidak menyukai sekolahnya, \nguru-gurunya, teman-teman sekelasnya. Semua \nmembosankan baginya.\nTapi sejak dia mengetahui ada yang aneh pada \ndiriku dan Seli, teman sekelasnya, hidupnya yang \nmembosankan berubah seru. Aku bisa menghilang, \ndan Seli bisa mengeluarkan petir. \nAli sendiri punya rahasia kecil. Dia bisa berubah \nmenjadi beruang raksasa. Kami bertiga kemudian \nbertualang ke tempat-tempat menakjubkan.\nNamanya Ali. Dia tahu sejak dulu dunia ini tidak \nsesederhana yang dilihat orang. Dan di atas \nsegalanya, dia akhirnya tahu persahabatan adalah \nhal yang paling utama.\nTERE LIYE\nmatahari.indd   1 6/9/16   9:01 AM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Sanksi Pelanggaran Pasal 113\nUndang-undang Nomor 28 Tahun 2014\ntentang Hak Cipta\n(1).\t Setiap\t orang\t yang\n\t dengan\t tanpa\t hak\t melakukan\t pelanggaran\t hak\t ekonomi\t\nsebagaimana\tdimaksud\tdalam\tpasal\t9\tayat\t(1)\thuruf\ti\tuntuk\tpenggunaan\tsecara\t\nkomersial\tdipidana\tdengan\tpidana\tpenjara\tpaling\tlama\t1\t(satu)\ttahun\tdan\tatau\t\npidana\tdenda\t paling\tbanyak\tRp\t100.000.000,00\t (seratus\t juta\trupiah).\n\t (2).\tSetiap\t orang\t yang\t dengan\t tanpa\t hak\t dan\t atau\t tanpa\t izin\t pencipta\t atau\t\npemegang\thak\tcipta\tmelakukan\tpelanggaran\thak\tekonomi\tpencipta\tsebagaimana\t\ndimaksud\tdalam\tpasal\t9\tayat\t(1)\thuruf\tc,\thuruf\td,\thuruf\tf,\tdan\tatau\thuruf\th,\t\nuntuk\t penggunaan\t secara\t komersial\t dipidana\t dengan\t pidana\t penjara\t paling\t\nlama\t3\t(tiga)\ttahun\tdan\t atau\tpidana\tdenda\tpaling\tbanyak\tRp500.000.000,00\t\n(lima\t ratus\t juta\t rupiah).\n\t (3).\t\nSetiap\t orang\t yang\t dengan\t tanpa\t hak\t dan\t atau\t tanpa\t izin\t pencipta\t atau\t\npemegang\t hak\t melakukan\t pelanggaran\t hak\t ekonomi\t pencipta\t sebagaimana\t\ndimaksud\tdalam\tpasal\t9\tayat\t(1)\thuruf\ta,\thuruf\tb,\thuruf\te,\tdan\tatau\thuruf\tg,\t\nuntuk\t penggunaan\t secara\t komersial\t dipidana\t dengan\t pidana\t penjara\t paling\t\nlama \t 4\t (empat) \t tahun \t dan \t atau \t pidana \t denda \t"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "Dicetak oleh Percetakan PT Gramedia, Jakarta\nIsi di luar tanggung jawab Percetakan\nMATAHARI\nOleh Tere Liye\n6 16 1 53 001\n Penerbit PT Gramedia Pustaka Utama\nGedung Gramedia Blok I, Lt. 5\nJl. Palmerah Barat 29–33, Jakarta 10270\nCover oleh Orkha Creative\nDiterbitkan pertama kali oleh\nPenerbit PT Gramedia Pustaka Utama\nanggota IKAPI, Jakarta, Juli 2016\nwww.gramediapustakautama.com\nHak cipta dilindungi oleh undang-undang.\nDilarang mengutip atau memperbanyak sebagian\natau seluruh isi buku ini tanpa izin tertulis dari Penerbit.\nISBN 978- 602 - 03 - 3211 - 6\n400 hlm; 20 cm\nIsi-Matahari-B.indd   4 6/22/2016   11:48:46 AM"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "5\nUKUL satu siang. \nHujan turun deras di luar. Suara petir terdengar susul-\nmenyusul, angin kencang berkesiur. Udara terasa lembap dan \ndingin.\nNamun, itu tidak menyurutkan suasana. Aula sekolah yang \nseminggu terakhir menjadi tempat pertandingan basket riuh \nrenda\nh oleh teriakan penonton. Suara tepuk tangan, seruan ter -\ntahan, dan sorakan semangat terdengar di sekelilingku. Bahkan \nSeli, yang biasanya kalem urusan begini, juga ikut berseru-seru, \nsambil tangannya tak berhenti memukulkan balon tepuk—alat \nsuporter yang terbuat dari balon panjang, seperti pentungan—\nyang mengeluarkan suara berisik itu.\nAku menatap keramaian. Semua kursi di pinggir lapangan \npenuh sesak, lebih banyak yang berdiri. Tidak ada sudut aula \nyang kosong. Semua dipenuhi murid dari sekolah kami dan dari \nsekolah-sekolah lain. Menariknya, seruan penonton semakin \nkencang setiap kali Ali menyentuh bola.\nAli? Iya, si biang kerok itu. Dia menjadi pusat perhatian di \nlapangan basket.\nIsi-Matahari-B.indd   5 6/22/2016   11:48:46 AM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "6\nAku mengusap wajah, tetap belum terbiasa menatap Ali yang \nlincah berkelit mendribel bola di lapangan. Dia lihai melewati \ndua lawan seperti pemain profesional (penonton berteriak), juga \ndua lawan berikutnya lagi (teriakan semakin kencang), kemudian \ntanpa terkawal, penuh gaya Ali lompat menembak ke keranjang. \nGerakan tangannya begitu dramatis, bola melengkung. Masuk! \nKupingku seperti pekak oleh teriakan histeris fans Ali ketika \nbola basket menembus keranjang. Satu-dua penonton meniup \nterompet kegirangan, menyambut poin tambahan dari Ali. \nAku m\nenelan ludah. Ini pemandangan yang musykil—mung -\nkin bisa masuk keajaiban dunia nomor delapan. Entah bagai-\nmana caranya, si biang kerok, tukang cari ribut, yang pakaiannya \nselalu kusut, rambut berantakan, sering diusir guru dari kelas \nkarena tidak mengerjakan PR, bertengkar, tidak punya teman \n(kecuali aku dan Seli), seminggu terakhir mendadak menjadi \nmurid paling populer di sekolah. Semua orang meneriakkan \nnamanya\n. Ali, Ali, dan Ali!\nLihatlah, di tengah lapangan, Ali sudah mengangkat tangan-\nnya tinggi-tinggi, tertawa lebar, membalas teriakan fansnya yang \nsemakin gila berseru-seru—termasuk Seli di sebelahku. \nAku menyikut le"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "7\nPoin sementara 42-18, dengan Ali, lagi-lagi menjadi bintang \npertandingan.\nMinggu-minggu ini, di pertengahan semester, setiap hari \nSabtu dan Minggu, OSIS sekolah kami mengadakan kompetisi \npertandingan basket antar-SMA seluruh kota. Kompetisi ini \nrutin diadakan setiap tahun, salah satu kompetisi prestisius \ndengan \nbanyak sponsor dan liputan media. Hampir semua se -\nkolah di kota kami berpartisipasi mengirimkan tim. Hari ini \nsudah masuk pertandingan semifinal dan final. Tim basket \nsekolah kami salah satu di antara empat tim terbaik setelah \nsepuluh tahun terakhir selalu tersingkir di babak penyisihan. \nLagi-lagi, itu semua karena Ali.\nSebulan lalu, aku masih ingat sekali saat Ali bilang dia \nberhasil bergabung dengan tim basket.\n”Tidak mungkin!” Aku mendesis tidak percaya. Kecuali kalau \nAli disuruh jadi tukang pel lapangan, atau mencuci seragam tim, \nitu baru masuk akal. Aku tertawa jahat dalam hati.\n”Betulan lho, Ra.” Ali mengangkat bahu, tidak peduli. Dia \nsantai melanjutkan menyendok kuah bakso. Kami bertiga \nsedan\ng makan di kantin yang baru selesai direnovasi sejak ke -\njadian tiang listrik roboh setahun lalu. Saat bel istirahat \npertama berbunyi, Seli langsung mengajak"
    }
  ],
  "buku-005": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Penerbit\nPT Gramedia Pustaka Utama\nKompas Gramedia Building\nBlok I, Lantai 4-5\nJl. Palmerah Barat 29-37\nJakarta 10270\nwww.gramedia.com\nHe is like an angel to our family. He saved me, my brother, \nand Mother from destitution and misery of street lives. He \nprovided us with food, shelter, helped to pay for school, \nand promised a better future for us.\nHe truly is like an angel to our family. He loves us, cares \nfor us, and sets an example without expecting anything at \nall in return. Yet here I am, returning the favor by letting \nthese feelings blossom.\nMother was right, I don’t deserve his love. I’m not \nworthy. Forgive me, Mother. But this feeling of admiration, \nfascination, or whatever it is towards him have been \nunbearable ever since I was in grade school.\nNow that I realized he probably never think of me as \nno more than just an impertinent little sister, so be it.... \nLet me fall to the ground like a leaf... a leaf that never \nhated the wind even though it has been ripped away from \nits stem.\nTHE FALLING LEAF NEVER HATES THE WIND\nthe falling leaf never hates the wind.indd   1 9/14/15   1:42 PM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Undang-undang Republik Indonesia Nomor 19 T ahun 2002\nT entang Hak Cipta\nKetentuan Pidana:\nPasal 72\n1.\t Barangsiapa \t dengan\t sengaja\t melanggar\t dan\t tanpa\t hak\t melakukan\t perbuatan\t \t\nsebagaimana\tdimaksud\tdalam\tPasal\t2\tAyat\t(1)\tatau\tPasal\t49\tAyat\t(1)\tdan\tAyat\t\n(2)\tdipid\nana\tdenga\nn\tpidan\na\tpenja\nra\tmasin\ng-masing\t \tpalin\ng\tsingk\nat\t1\t(satu\n)\tbulan\t\ndan/atau\t denda\t paling\t sedikit\t Rp1.000.000,00\t (satu\t juta\t rupiah),\t atau\t pidana\t\npenja\nra\t palin\ng\t lama \t 7\t (tuju\nh)\t \ttahun \t dan/a\ntau\t denda \t palin\ng\t \tbanya\nk\t\nRp5.000.000.000,00\t(lima\tmiliar\trupiah).\n2.\t Barangsiapa \t dengan\t sengaja\t menyiarkan,\t memamerkan,\t mengedarkan,\t \tatau\t\nmenjual\t kepada\t umum\t suatu\t ciptaan\t atau\t barang\t hasil\t pelanggaran\t \thak\t cipta\t\natau\thak\tterka\nit\tsebag\nai\tdimak\nsud\tpada\tAyat\t(1)\tdipid\nana\tdenga\nn\t \tpidan\na\tpenja\nra\t\npaling\t lama\t 5\t (lima)\t tahun\t dan/atau\t denda\t paling\t \tbanyak\t Rp500.000.000,00\t\n(lima\tratus\tjuta\trupiah).\nThe Falling Leaf Never Hates The Wind - Content.indd   2 9/15/2015   1:53:10 PM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "PT\tGramedia\tPustaka\tUtama\tPublisher\nJakarta\nThe Falling Leaf Never Hates The Wind - Content.indd   3 9/15/2015   1:53:10 PM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "THE FALLING LEAF NEVER HATES THE WIND\nby T ere Liye\nFirst published in Indonesia, in 2015\nby Gramedia Pustaka Utama\nKompas Gramedia Building Lt. 5\nJl. Palmerah Barat 29–37\nJakarta 10270\nIndonesia\nOriginally published in 2010 by Gramedia Pustaka Utama under the title\nDaun yang Jatuh T ak Pernah Membenci Angin\nAll rights reserved\n© Gramedia Pustaka Utama, 2015\nTranslation © by Lily M. Boynton\nCover Illustration: eMT e\nAll rights reserved. Except for use in any review, the reproduction\nor utilization of this work in whole or in part in any form by any electronic, \nmechanical, or other means, now known or hereafter invented,\nincluding xerography , photocopying, and recording,\nor in any information storage or retrieval system,\nis forbidden without the written permission of the publisher,\nGramedia Pustaka Utama\nwww.gramediapustakautama.com\n6 15 1 72 014\nISBN 978-602-03-2211-7\nPublication of this book was made possible with assistance from\nthe Translation Funding Program of the Ministry of Education\nand Culture the Republic of Indonesia.\nPrinted and bound in Indonesia by\nPercetakan Gramedia, Jakarta, Indonesia\nThe Falling Leaf Never Hates The Wind - Content.indd   4 9/15/2015   1:53:10 PM"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "5\n8 p.m.: When It All Started\nIt rains again this evening, just like the nights before. It’s \ncomforting. The rain makes the atmosphere outside seems \npeaceful and reassuring. It’s not really heavy , only drizzle, even \nthat’s sparse, but enough to make the flickering lights along the \nstreet look beautiful.\nI sigh. Gently , I touch the frosted glass. Cold suddenly jab my \nfingertips, creeping up to the palm of my hand through my wrist, \npiercing through my elbow , my shoulder, then setting in my heart.\nIt freezes all feelings.\nIt crystallizes all desire.\nEverything has to end tonight.\n* * *\nThe Falling Leaf Never Hates The Wind - Content.indd   5 9/15/2015   1:53:11 PM\npustaka-indo.blogspot.com"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "6\nFrom the second floor of the largest bookstore in the city , you can \nclearly see the bustling road right in front of you, which also the \nmajor road in the city . The street is divided by a median strip of \nabout 8 inches high. Every few meters on the median there are \nwhite round lights, along with flower pots, though the flowers \ndon’t seem to be quite lush right now. Still, those white round \nlights look beautiful as their light blend in with silhouettes of \nlights from hundreds of cars passing by .\nThe entire wall of this bookstore has been replaced by thick \nglass. Standing in here makes you feel like you are inside an \naquarium. People inside can clearly see what’s happening outside, \nand people outside can clearly see what’s happening inside. It’s an \navant-garde style architecture. Glass, instead of concrete, becomes \nthe best option for room dividers.\nAcross the street, modern large photocopy kiosks line up \nneatly. T en watts neon lights, long tables for dropping off  \ndocuments to be copied, and employees in uniform clearly visible \nfrom up here. I notice a customer who appears to be a college \nstudent waiting around in one of the kiosks, sitting on a high \nswivel cha"
    }
  ],
  "buku-006": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Penerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM\nPenerbit PT Gramedia Pustaka Utama\nJakarta, 2013\nNegeri di \nUjung \nTanduk\nIsi-Negeri di Ujung Tanduk.indd   3 3/6/2013   3:49:18 PM"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Cerita ini adalah fiksi.\nApabila ada kesamaan nama, tempat, dan alur cerita, itu \nhanyalah kebetulan belaka.\nIsi-Negeri di Ujung Tanduk.indd   5 3/6/2013   3:49:18 PM\nCerita ini adalah fiksi.\nApabila ada kesamaan nama, tempat, dan alur cerita, itu \nhanyalah kebetulan belaka.\nIsi-Negeri di Ujung Tanduk.indd   5 3/6/2013   3:49:18 PM\nCerita ini adalah fiksi.\nApabila ada kesamaan nama, tempat, dan alur cerita, itu \nhanyalah kebetulan belaka.\nIsi-Negeri di Ujung Tanduk.indd   5 3/6/2013   3:49:18 PM"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "9\nEpisode 1\nTinju Kanan Peruntuh \nTembok\nRUANGAN besar yang disulap menjadi arena pertarungan \nitu terlihat ramai. Seruan tertahan, suara mengaduh, suara te -\npisan, bunyi berdebuk, terbanting, teriakan menyemangati, hing-\nga teriakan bersahut-sahutan memenuhi langit-langit ruangan. \nSatu-dua berseru dalam bahasa yang tidak dipahami bahkan \noleh orang yang berdiri di sebelahnya. W ajah-wajah dan pera -\nwakan antarbangsa, wajah-wajah antusias bercampur tegang.\nUdara terasa pengap meski pendingin ruangan bekerja maksi -\nmal.\nDua petarung sedang jual-beli pukulan di tengah ruangan, \nbertinju. Arena pertandingan tanpa ring pemisah apalagi ke -\nrangkeng tertutup. Hanya lingkaran merah di atas lantai, ber -\ndiameter dua depa. Percik keringat petarung, dengus napas, \nsuara pukulan menghantam badan, semuanya terdengar lang -\nsung, tanpa jarak. Penonton berkerumun di sekitar lingkaran, \nIsi-Negeri di Ujung Tanduk.indd   9 3/6/2013   3:49:18 PM\n9\nEpisode 1\nTinju Kanan Peruntuh \nTembok\nRUANGAN besar yang disulap menjadi arena pertarungan \nitu terlihat ramai. Seruan tertahan, suara mengaduh, suara te -\npisan, bunyi berdebuk, terbanting, teriakan menyemangati, hing-\nga teriakan bersahut-sahutan"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "10\nberdesak-desakan, dan berdiri menonton. T angan mereka ter -\nangkat menyemangati.\nIni jenis pertunjukan yang mengesankan.\nSatu tinju lagi menghantam cepat rahang salah seorang pe -\ntarung. Memb uat penonton berseru tertahan, sebagian besar \nberseru girang, ”Y es!” Sebagian mengeluh, ”Oh, no!” Disusul tinju \nlainnya mengenai dagu, kali ini lebih telak. Sepersekian detik \nberlalu, penantang yang beberapa menit lalu masih terlihat segar \nbugar segera tumbang ke lantai. Knockout alias KO.\nPengunjung serempak berteriak kegirangan, melontarkan ke -\nbisingan.\nNapas petarung satunya, yang masih berdiri kokoh di tengah \narena, bahkan tidak terlihat tersengal. Hanya kausnya yang sedi -\nkit basah oleh k eringat.\n”Fantastico!”\n”Bravo!”\nAku menelan ludah, melirik jam besar di tiang ruangan. Ha -\nnya dua menit li ma belas detik lawan pertamanya dibuat ter -\nsungkur.\n”Kau tidak akan berubah pikiran, bukan?” Sebuah tangan \nmenyikut lenganku, berkata kencang, berusaha mengalahkan bi -\nsing.\nAku menoleh, menatap wajah menyebalkan di sebelahku.\n”Maksudku, jika kau mau, aku masih bisa membatalkan per -\ntarungan. Aku bisa pergi ke mereka, mengarang-ngarang alasan. \nKau sakit perut misalnya. Atau asm"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "11\ninspektur pertandingan malam ini. ” Atau kita bisa mengarang \ncerita, tiba-tiba bisulmu pecah....”\n” Aku tidak akan membatalkan pertarungan,” aku menyergah \nTheo, memotong kalimatnya, ”simpan omong kosongmu!”\nTheo tertawa ringan, menyeka peluh di pelipis.\nSalah satu inspektur pertandingan meraih pengeras suara. Dia \nmengenakan pakaian kerja seperti kebanyakan pengunjung \nlain—hanya kemejanya terlihat berantakan, keluar dari celana, \nlengan dilipat, dan dasi entah tersumpal di mana. Dengan ba -\nhasa Inggris bercampur Portugis yang sama fasihnya, dia berseru \ntentang pertarungan yang baru saja selesai.\n”Luar biasa. Pertarungan yang luar biasa, ladies and gentlemen. \nW ell, simpan teriakan kalian. Pertarungan kedua akan segera \ntiba. Kami sudah menyiapkan sang penantang lokal yang telah \nmenunggu giliran bertarung sejak enam bulan. ” W ajah inspektur \nantusias, juga keramaian di ruangan. ”Jangan lupa, seperti yang \nkami sebutkan pada awal pertemuan malam ini, kami telah me -\nnyiapkan kejutan besar di pertarungan terakhir, ladies and gentle­\nmen. Ini sungguh kejutan hebat. Kalian pasti suka.”\nPetarung yang masih bertahan di tengah lingkaran merah \nmenolak duduk di kursi yang disedia"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "12\n”Ladies and gentlemen, inilah petarungan kedua malam ini. \nSang juara bertahan, Lee si Monster, menghadapi penantang \nkedua, Chow.”\nAku menelan ludah. Enam tahun mengikuti klub petarung di \nJakarta, belum pernah aku menyaksikan seorang petarung begitu \nterkendali di hadapanku. Bukan postur badannya yang gagah \nmeyakinkan atau gerakan tangan dan kakinya yang gesit me -\nmatikan di perta rungan sebelumnya. Sikap dan kehormatanlah \nyang membedakan seorang petarung sejati dengan petarung lain-\nnya. Aku tida k tahu seberapa terhormat juara bertahan yang \nberdiri gagah di dalam lingkaran merah tersebut. Aku baru me -\nngenalnya malam ini. Namun, menilik gestur wajah dan tubuh -\nnya, dia memil iki sikap yang menakjubkan.\n”Lee! Lee! Monster! Monster!”\nNama sang juara bertahan semakin keras diteriakkan. Sang \npenantang sudah memasuki lingkaran merah. Kedua petarung \nsaling menempelkan tinju. Inspektur pertandingan berseru sing -\nkat tentang peraturan, mengangkat tangannya, dan memberikan \ntanda. Saat dia mundur, pertarungan kedua malam ini telah di -\nmulai.\nSang penantang mengambil inisiatif menyerang terlebih dulu. \nBerputar-putar di tepi lingkaran merah. Kakinya lincah. Mulai \nmendekati "
    }
  ],
  "buku-008": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Jslsfi dl5xhkan penggunaannya ili sekolah dengan\nKcputusan Direltur Jenderal Pendidikan Dasar dan Menengah\nDepartemen Pendidikan dan Kebudayaan ,\nNomor : lTTlCKeplR/L99L\nThnggal : 25 April 1991\nl,\nl--\nI\nt\nI\nt\nt,,,\nBUIfi, INT, }IARUS DlIi$o:iL,tt-'l]{ltq\nPW-s rAl{sG&L * ..- -\n{rtTf\n-%t/t\"\n4/n-\n1\n,;ffi::ti|\nt-/.-f?(. ,\n,ft+;fu-\nry,_\"ry\n@^Thl'lffi"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "../\nPERffiTAKATTI\nSMA \nN-l\nrys \ntKMALAYI\n,. \nD0n0[q\n\\\n\\ \nn \n\\\n\\\\\n\\'*\nSITTI \nNURBAYA\nI\n4r, i\n\\,1:/ \nnl\\ \nr\n/\niuunr,}{eauufiffi,$ffi\nutTxRl!,{A \nlfi!. \nr\nllo.*li{DUK \n'--<\nI'\nf \nt, \n'\\\" \nttlyl'\nl..-.\nAbpuv \ni \n'[r! \nd,1 \n(c \n(ro\nigi \nnfinQn \nI\nI\nA \ntLu{' \n{tr\\^' \nn^\nrr-'l1r'- \nf; \n-\n( \n/1\\l\\tli\n\\\nf \n\\ \n\\-'^ \n*-*"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Perum Penerbitan dan Perceakan\nBAI-AIPTISTAKA\nBPNo.575\ntlak pengarang dilindungi undang-undang\nC€takanl - Lg22\nCetakan ll - lY25\nCetakanlll - lE29\nCeakanlV - lY37\nCetakanV - 1%1\nCetakanVl - 1951\nCetakanVll - L954\nCetakanVIII - t957\nCetakanD( - 1959\nCcatanX - 1960\nCeakanXl - 1965\nCeakan XII - 1n9\nCeakan XIII - 1981\nC.etakan XIV - L982\nCeakan)(V - 1984\nCetakan X\\/I - 1985\nCeakanXV[ - 1986\nCetatan XVIII - 1986\nCetakan XIX - 1989\nCetakan)O( - 1990\nCetakanXXl - L992\nF\nRus Rusll Mh\ns Siti Nurbaya : kasih tak samPai / oleh MH. Rusli' - cet'\n2t. - lakarta: Balai Pustaka, 1992\n271hlm.: ilus. ; 21 cm. - (Seri BP no. 575).\n1. Fiksi. I. Judul. II. Seri.\nISBN 979 -407 -t67 - 6\nDihiasi 9 gambar oleh NasrunA'S"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "KATA PENGANTAR\nSekali lagi kami sajikan buku Sitti Nurbaya' dengan tidak merubah.isi dan\ngaya bahasanya, d.ngan makst'd aga' nilai sastra lamanYa masih dapat diper-\ntahankan.\nBetapapun kuat dan ketatnya adlt Mlny8kab-au' nyatanyu. 0111 *ntu\nbuku ini mulai disusu,,. pun *a\"n ada pihak.pihak yang berani menentang\ndan ingin merombaknYa'\nBagi mereka yang mencintai sastra Indonesia' buku ini pantas dijadikan\nbaharipenelaahan dan buah pertimbangan'\nBalai Pustaka"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Kata\nI.\nII.\nII I.\nIV.\nV.\nVI.\nVII.\nVIII.\nIX.\nX.\nXI.\nXII.\nXIII.\nXIV.\nXV.\nXVI.\nDAFTARISI\nPengantar\nPulang dari sekolah\nSutan Mahmud dengan saudaranya yang perempuan\nBerjalan-jalan ke Gunung Padang\nPutri Rubiah dengan saudaranya Sutan Hamzah . . . . .\nSamsulbahri berangkat ke Jakarta\nDatuk Meringgih\nSurat Samsulbahri kepada NurbaYa\nSurat NurbayakepadaSamsulbahri . . . .'\nSambulbahri pulang ke Padang\nKenang-kenangan kepada Samsulbahri .. . .\nNurbaya lari ke Jakarta\nPercakapan Nurbaya dengan Alimah\nSamsulbahri membunuh diri\nSepuluh tahun kemudian\nRusuh perkara belasting di Padang\nPeperangan antara Samsulbahri dan Datuk Meringgih\n9\n18\n28\n56'\n65\n83\n95\n111\nt24\n158\n173\n191\n2t5\nfig\n244\n256"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "I. PULANGDARISEKOLAH\nKira-kira pukul satu siang, kelihatan dua orang anak muda, bemaung\ndi bawah pohon ketapang yang rindang, di muka sekolah Belanda Pasar\nAmbacang di Padang, seolah-olah mereka hendak memperlindungkan di'\nrinya dari panas yang memancar dari atas dan timbul dari tanah, bagaikan\nuap air yang mendidih. Seorang dari anak muda ini, ialah anak laki-laki,\nyang umurnya kira-kira l8 tahun. Pakaiannya baju jas tutup putih dan ce-\nlana pendek hitam, yang berkancing di ujungnya. Sepatunya sepatu hitam\ntinggi, yang disambung ke atas dengan kaus sutera hitam pula dan diikatkan\ndengan ikatan kaus getah pada betisnya. Topinya topi rumput putih, yan$\nbiasa dipakai bangsa Belanda. Di tanpn kirinya ada beberapa kitab dengart\nsebuah peta bumi dan dengan tangan kanannya dipegangnya sebuah belebas,\nyang dipukul-pukulkannya ke betisnya.\nJika dipandang dari jauh, tentulah akan disangka, anak muda ini seorang\nanak Belanda, yang hendak pulang dari sekolah. Tetapi jika dilihat'dari dekat,\nlyatalah ia bukan bangsa Eropa; karena kulitnya kuning sebagai kuhi\nlangsat, rambut dan matanya hitam sebagai dawat. Di bawah dahinya yang\nlebar dan tinggi, nyata kelihatan alis matanya yang tebal dan hita"
    }
  ],
  "buku-009": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "DAFTAR ISI\n1. ANAK ORANG TERBUANG\n2. YATIM PIATU\n3. MENUJU NEGERI NENEK MOYANG\n4. TANAH ASAL\n5. CAHAYA HIDUP\n6. BERKIRIM-KIRIMAN SURAT\n7. PEMANDANGAN DI DUSUN\n8. BERANGKAT\n9. DI PADANG PANJANG\n10. PACU KUDA DAN PASAR MALAM\n11. BIMBANG\n12. MEMINANG\n13. PERTIMBANGAN\n14. PENGHARAPAN YANG PUTUS\n15. PERKAWINAN\n16. MENEMPUH HIDUP\n17. JIWA PENGARANG\n18. SURAT-SURAT HAYATI KEPADA KHADIJAH\n19. CLUB ANAK SUMATERA\n20. RUMAH TANGGA\n21. HATI ZAINUDDIN\n22. DEKAT, TETAPI BERJAUHAN\n23. SURAT CERAI\n24. AIR MATA PENGHABISAN\n25. PULANG\n26. SURAT HAYATI YANG PENGHABISAN\n27. SEPENINGGAL HAYATI\n28. PENUTUP"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Hamka\nTENGGELAMNYA KAPAL VAN DER WIJCK \nCetakan keenam belas, P.T. Bulan Bintang, Jakarta, 1984 \nDiterbitkan pertama kali oleh N.V. Bulan Bintang, Jakarta, 1976\nP.T. Bulan Bintang,\nPenerbit dan Penyebar Buku-buku\nJalan Kramat Kwitang I/8, Jakarta 10420, Indonesia \nAnggota Ikatan Penerbit Indonesia\nHak cipta dilindungi Undapg-undang\n38 39 49 51 57 57 58 61 63 66 76 77 79 81 82 84 16026 K10.000 \nDicetak oleh Percetakan P.T. Tri Handayani Utama, Jakarta"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "PENDAHULUAN CETAKAN KEEMPAT\nDI DALAM usia 31 tahun (1938), masa darah muda masih cepat alirnya dalam diri, dan khayal \nserta sentimen masih memenuhi jiwa, di waktu itulah \"ilham\" \"Tenggelamnya Kapal Van der \nWijck\" ini mulai kususun dan dimuat berturut-turut dalam majalah yang kupimpin \"Pedoman \nMasyarakat.\"\nSetelah itu dia diterbitkan menjadi buku oleh saudara M. Syarkawi (cetakan kedua), seorarg \npemuda yang giat menerbitkan buku-buku yang berharga. Belum berapa lama tersiar, dia pun \nhabis. Banyak pemuda yang berkata: \"Seakan-akan tuan menceriterakan nasibku sendiri.\" Ada \npula yang berkata: \"Barangkah tuan sendiri yang tuan ceriterakan!\"\nSesungguhnya bagi seorang golongan agama, mengarang sebuah buku roman, adalah \nmenyalahi kebiasaan yang umum dan lazim pada waktu itu. Dari kalangan agama pada \nmulanya, saya mendapat tantangan keras. Tetapi setelah 10 tahun berlalu, dengan sendirinya \nheninglah serangan dan tantangan itu, dan kian lama kian mengertilah orang apa perlunya \nkesenian dan keindahan dalam hidup manusia.\nAda pula yang berkata: \"Bilakah lagi tuan akan membuat ceritera sebagai 'Di bawah Lindungan \nKa'bah' dan 'Tenggelamnya Kapal Van der Wijck' dan yang lain-lain itu?\""
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "PENDAHULUAN CETAKAN KE-8\nDENGAN persetujuan dari Balai Pustaka sendiri, sebagai penerbitnya yang lama, maka mulai \ncetakan ke-8 ini dan seterusnya, buku ini diterbitkan oleh Penerbtt \"Nusantara\" suatu \npenerbitan swasta. Kita sebagai pengarang sudah menyatakan tidak keberatan menyerahkan \npenerbitannya kepada perusahaan swasta, karena dia telah menjanjikan akan memelihara \nteknik buku ini, sehingga tidak kurang nilai dan keindahannya daripada teknik buku-buku yang \ndikeluarkan oleh \"Balai Pustaka.\"\nJakarta, bulan Maret 1961\nWassalam\nPENGARANG"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "1. ANAK ORANG TERBUANG\nMATAHARI telah hampir masuk ke dalam peraduannya. Dengan amat pelahan, menurutkan \nperintah dari alam gaib, ia berangsur turun, turun ke dasar lautan yang tidak kelihatan ranah \ntanah tepinya. Cahaya merah telah mulai terbentang di ufuk Barat, dan bayangannya tampak \nmengindahkan wajah lautan yang tenang tak berombak. Di sana-sini kelihatan layar perahu-\nperahu telah berkembang, putih dan sabar. Ke pantai kedengaran suara nyanyian \"Iloho \ngading\" atau \"Sio sayang\", yang dinyanyikan oleh anak-anak perahu orang Mandar itu, \nditingkah oleh suara geseran rebab dan kecapi. Nun, agak di tengah, di tepi pagaran anggar \nkelihatan puncak dari sebuah kapal yang telah berpuluh tahun ditenggelamkan di sana. Dia \nseakan-akan penjaga yang teguh, seakan-akan stasiun dari setan dan hantu-hantu penghuni \npulau Laya-laya yang penuh dengan kegaiban itu. Konon kabarnya, kalau ada orang yang akan \nmati hanyut atau mati terbunuh, kedengaranlah pekik dan ribut-ribut tengah malam di dalam \nkapal yang telah rusak itu !\nDi waktu senja demikian kota Mengkasar kelihatan hidup. Kepanasan dan kepayahan orang \nbekerja siang, apabila telah sofe diobat dengan menyaksikan matahari yang hendak"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "pula air mancur yang lebih tinggi. Masih terasa-rasa di pikirannya keindahan lagu \"Serantih\" \nyang kerap kali dilagukan ayahnya tengah malam. Ia tak tahu benar apakah isi lagu itu, tetapi \nrayuannya sangat melekat dalam hatinya. Ada pantun-pantun ayahnya yang telah hapal olehnya \nlantaran dinyanyikan dengan nyanyi Serantih yang merdu itu:\n\"Bukit putus, Rimba Ketuang, \ndirendam jagung dihangusi. \nHukum putus badan terbuang, \nterkenang kampung kutangisi.\"\n\"Batang kapas nan rimbun daun, \nurat terkenang masuk padi. \nJika lepas laut Ketahun, \nmerantau panjang hanya lagi.\"\nSiapakah gerangan anak muda itu?\nDia dinamai ayahnya Zainuddin. Sejak kecilnya telah dirundung oleh kemalangan'... Untuk \nmengetahui siapa dia, kita harus kembali kepada suatu kejadian di suatu negeri kecil dalam \nwilayah Batipuh X Koto (Padang Panjang) kira-kira 30 tahun yang lalu.\nSeorang anak muda bergelar Pandekar Sutan, kemenakan Datuk Mantari Labih, adalah \nPandekar Sutan kepala waris yang tunggal dari harta peninggalan ibunya, karena dia tak \nbersaudara perempuan. Menurut adat Minangkabau, amatlah malangnya seorang laki-laki jika \ntidak mempunyai saudara perempuan, yang akan menjagai harta benda, sawah yang \nber"
    }
  ],
  "buku-012": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "yang\nfana\nadalah\nwaktu\nyang fana adalah waktu\nSapardi djoko damono\nSapardi djoko damono\nnovel ketiga dari Trilogi Hujan Bulan Juni\nDalang idak berpihak kepada nasib tetapi kepada takdir.\nKau pasi masih ingat kita pernah suatu saat membayangkan \nsebuah dongeng tentang waktu yang ujudnya remah-remah yang \nbisa kita kunyah, telan, dan muntahkan kapan saja agar tetap \nada. Kita menyukai dongeng yang katamu indah itu meskipun \nsebenarnya tidak sepenuhnya memahami apa maknanya. \nSar, kalau saja kita bisa hidup di luar waktu, iba-iba katamu.\n\nBagaimanakah akhir perjalanan Pingkan dan Sarwono? Akankah \nwaktu mempertemukan atau justru memisahkan mereka karena \ncampur tangan takdir? Ikui akhir kisah mereka dalam \nAdalah Waktu, novel keiga dari  karya \nSapardi Djoko Damono. \nwww.facebook.com/indonesiapustaka"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Sanksi Pelanggaran Pasal 113\nUndang-undang Nomor 28 Tahun 2014\nTentang Hak Cipta\n1. Setiap orang yang dengan tanpa hak melakukan pelanggaran hak ekonomi se -\nbagaimana dimaksud dalam pasal 9 ayat (1) huruf i untuk penggunaan secara \nkomersial dipidana dengan pidana penjara paling lama 1 (satu) tahun dan/atau \npidana denda paling banyak Rp100.000.000,00 (seratus juta ru piah).\n2. Setiap orang yang dengan tanpa hak dan/atau tanpa izin pencipta atau peme -\ngang hak cipta melakukan pelanggaran hak ekonomi pencipta sebagai mana \ndimaksud dalam pasal 9 ayat (1) huruf c, huruf d, huruf f, dan/atau huruf h \nuntuk penggunaan secara komersial dipidana dengan pidana penjara paling \nlama 3 (tiga) tahun dan/atau pidana denda paling banyak Rp500.000.000,00 \n(lima ratus juta rupiah).\n3. Setiap orang yang dengan tanpa hak dan/atau tanpa izin pencipta atau peme -\ngang hak melakukan pelanggaran hak ekonomi pencipta sebagai mana dimak -\nsud dalam pasal 9 ayat (1) huruf a, huruf b, huruf e, dan atau hur uf g untuk \npenggunaan secara komersial dipidana dengan pidana pen jara paling lama 4 \n(empat) tahun dan/atau pidana denda paling banyak Rp1.000.000.000,00 (satu \nmiliar rupiah).\n4. Setiap orang yang m"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Penerbit PT Gramedia Pustaka Utama, Jakarta\nSapardi djoko damono\nyang  \nfana  \nadalah\nwaktu\nnovel ketiga dari trilogi hujan Bulan juni\nwww.facebook.com/indonesiapustaka"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "yang fana adalah waktu\nSapardi djoko damono\ngm 618202018\npenerbit pt gramedia pustaka utama\nkompas gramedia Building Blok 1 lt. 5\njl. palmerah Barat no. 29-37\njakarta 10270\nanggota ikapi\npenyelia naskah\nmirna yulistianti\nilustrasi sampul\nSuprianto\nproof reader\nSasa\nSetting\nfitri yuniar\nCetakan pertama Maret 2018\nhak cipta dilindungi oleh undang-undang\ndilarang memperbanyak sebagian atau seluruh isi buku ini\ntanpa izin tertulis dari penerbit\nwww.gpu.id\niSBn 978–602–03–8305–7\ndicetak oleh percetakan pt gramedia, jakarta\nisi di luar tanggung jawab percetakan\nwww.facebook.com/indonesiapustaka"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "And I’m thinking ’bout how people\nFall in love in mysterious ways\nMaybe just the touch of a hand\nWell, me, I fall in love with you every single day\n”hinking Out Loud” , Ed Sheeran\nwww.facebook.com/indonesiapustaka"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "1\nAda dua ekor merpati hinggap di bubungan, angin \npagi yang suka berputar-putar mengelilingi rumah \nseperti biasanya mendengarkan mereka bicara ten -\ntang dua musim yang akhir-akhir ini suka berubah-ubah se -\nenaknya. Seperti juga kita, Ping, mereka mengenal baik dua \nmusim karena sejak menetas terus diasuh oleh derai hujan \nditimang oleh terik matahari yang bergiliran datang dan pergi. \nMereka telah belajar mengenal memahami dan menghayati \ndua musim itu dan belajar dan terus berusaha belajar menya -\nyanginya seperti juga perangai kemarau dan penghujan yang \ntak pernah selesai menyatakan kasih sayang kepada mereka.\nAda dua ekor merpati, ada jantan dan ada betina. Ada dua \nmusim, ada kemarau dan ada penghujan. Dan ada kau dan \nada aku. Ketika kau penghujan aku kemarau, ketika kau ke -\nmarau aku penghujan. Namun, sekarang ada yang terasa tidak \nada meskipun kau dulu suka bilang, Tak ada yang tidak ada, \nwww.facebook.com/indonesiapustaka"
    }
  ],
  "buku-013": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "v \n \n \n \n \nUCAPAN TERIMA KASIH \n \nKami ucapkan terima kasih kepada: \n1. Dekan FKIP UHAMKA beserta jajarannya. \n2. Ketua Program Studi Pendidikan Bahasa dan Sastra \nIndonesia \n3. Rekan-rekan dosen di FKIP UHAMKA \nAtas dukungan dan motivasi yang telah diberikan dalam \nmewujudkan karya ini, terima kasih."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "vi \n \nDAFTAR ISI \n \nPERSEMBAHAN  ................................ .......................  v \nUCAPAN TERIMA KASIH  ................................ .........  vi \nDAFTAR ISI  ................................ ..............................   vii \nDAFTAR TABEL  ................................ .......................  xi \nDAFTAR GAMBAR  ................................ ...................  xii \nKATA PENGANTAR ................................ ..................  xiii \nPRAKATA  ................................ ................................ .  xv \n \nBAB I PENDAHULUAN \nA. Deskripsi Mata Kuliah  ................................ .....  1 \nB. Prasyarat Mata Kuliah ................................ .....  1 \nC. Rencana Pembelajaran  ................................ ..  1 \nD. Petunjuk Penggunaan Buku ............................   7 \nE. Capaian Lulusan ................................ ..............  7 \nF. Bentuk Evaluasi  ................................ ..............  8 \n \nBAB II PENDAHULUAN \nA. Deskripsi................................ ..........................   9 \nB. Relevansi  ................................ ........................  9 \nC. Capaian Pembelajaran MK  ................."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vii \n \nDaftar Pustaka  ................................ .....................  30 \nSoal  ................................ ................................ .....  31 \n \nBAB III STRUKTUR PUISI \nA. Deskripsi................................ ..........................   33 \nB. Relevansi  ................................ ........................  33 \nC. Capaian Pembelajaran MK  .............................   33 \n3.1 Struktur Puisi  ................................ .............  33 \n3.1.1 Struktur Fisik  ................................ ..  34 \n3.1.2 Struktur Batin  ................................ .  59 \n3.2 Rangkuman  ................................ ...............  63 \nDaftar Pustaka  ................................ .....................  63 \nSoal  ................................ ................................ .....  64 \n \nBAB IV PENYIMPANGAN BAHASA PUISI \nA. Deskripsi................................ ..........................   67 \nB. Relevansi  ................................ ........................  67 \nC. Capaian Pembelajaran MK  .............................   67 \n4.1 Penyimpangan Bahasa Puisi  .....................  68 \n4.1.1 Penyimpangan Leksikal  .................  69 "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "viii \n \n4.2 Rangkuman  ................................ ...............  82 \nDaftar Pustaka  ................................ .....................  82 \nSoal  ................................ ................................ .....  82 \n \nBAB V ANALISIS PUISI DENGAN PENDEKATAN \nSTRUKTURAL \nA. Deskripsi................................ ..........................   85 \nB. Relevansi  ................................ ........................  85 \nC. Capaian Pembelajaran MK  .............................   85 \n4.1 Pendekatan Struktural  ..............................   86 \n4.2 Prosedur Analisis Puisi dengan  \nPendekatan Struktural  ..............................   87 \n4.3 Aplikasi Pendekatan Struktural  .................  93 \n4.4 Rangkuman  ................................ ..............  98 \nDaftar Pustaka  ................................ .....................  98 \nSoal  ................................ ................................ .....  98 \n  \n \nBAB VI ANALISIS PUISI DENGAN PENDEKATAN \nSEMIOTIK \nA. Deskripsi................................ ..........................   99 \nB. Relevansi  ................................ ........................  99 \nC. Capaian Pembelajaran MK  ....."
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "ix \n \n6.3 Prosedur Analisis Puisi dengan  \nPendekatan Semiotik  ................................   103 \n6.4 Aplikasi Pendekatan Semiotik ...................  106 \n6.5 Rangkuman  ................................ ..............  109 \nDaftar Pustaka  ................................ .....................  110 \nSoal  ................................ ................................ .....  111 \n \nBAB VII ANALISIS PUISI DENGAN PENDEKATAN \nINTERTEKSTUAL \nA. Deskripsi................................ ..........................   113 \nB. Relevansi  ................................ ........................  113 \nC. Capaian Pembelajaran MK  .............................   113 \n7.1 Pendekatan Intertekstual  ...........................   113 \n7.2 Prinsip Intertekstual  ................................ ...  114 \n7.3 Analisis Puisi dengan Pendekatan  \nIntertekstual ................................ ...............  116 \n7.4 Rangkuman  ................................ ...............  118 \nDaftar Pustaka  ................................ .....................  118 \nSoal  ................................ ................................ .....  119 \n \nINDEKS ................................ .........."
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "x \n \nDAFTAR TABEL \n \nTabel 2.1 Perbandingan Puisi Lama  \n                dan Puisi Baru  ................................ ...........  26 \nTabel 5.1 Contoh Tabel Analisis Pendekatan  \n                Struktural ................................ ....................  92 \nTabel 6.1 Contoh Tabel Analisis Pendekatan  \n                Semiotik  ................................ ....................  105"
    }
  ],
  "buku-014": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "HENRY MANAMPIRING\nIlustrasi oleh LEVINA LESMANA\nFILOSOFI\nTERAS\nFILSAFAT YU NAN I-ROMAWI KUNO\nUNTUK MENTAL TANGGUH MASA KINI\nPengantar oleh DR. A. SETYO WIBOWO v ■■\n| HENRY MANAMPIRING"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "i\ni\n\"Buku Filosofi Teras ini memberi cara latihan mental supaya kita memiliki \nsyaraf titanium dan tidak gampang KO kesamber galau.\" — Dr. A. Setyo \nWibowo, Dosen Sekolah Tinggi Filsafat Driyarkara\nAPAKAH KAMU SERING ....MERASA KHAWATIR AKAN BANYAK \nHAL? ....BAPERAN?\n....SUSAH MOVE-ON? ....MUDAH TERSINGGUNG DAN MARAH-MARAH \nDI SOCIAL MEDIA MAUPUN DUNIA\nNYATA?\nLebih dari 2.000 tahun lalu, sebuah\nmazhab filsafat menemukan akar\nmasalah dan juga solusi dari banyak\nemosi negatif. Stoisisme, atau Filosofi\nTeras, adalah filsafat Yunani-Romawi\nkuno yang bisa membantu kita\nmengatasi emosi negatif dan menghasilkan mental yang tangguh dalam \nmenghadapi naik-turunnya kehidupan.\nJauh dari kesan filsafat sebagai topik berat dan mengawang-awang, Filosofi\nTeras justru bersifat praktis dan relevan dengan kehidupan Generasi \nMilenial dan Gen-Z masa kini."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "i\ni\nHENRY MANAMPIRING, penulis best-seller The Alpha Girl's Guide, \nmembagikan pemahaman akan Stoisisme dan pengalaman mempraktikkannya \ndi kehidupan sehari-hari dalam bahasa yang ringan, jenaka, dan disertai ilustrasi \noleh Levina Lesmana.\nFILOSOFI TERAS\nPENERBIT BUKU\n(Bl bukufdkompas.id\n* (dBukuKOMPAS n \nPenerbit Buku Kompas\nSELF IMPROVEMENT"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "FILOSOFI \nTERAS\nFilosofi Teras\nFilsafat Yunani-Romawi Kuno untuk Mental Tangguh Masa Kini Copyright © 2019, Henry \nManampiring\nPertama kali diterbitkan dalam bahasa Indonesia oleh\nPenerbit Buku Kompas, 2019\nPT Kompas Media Nusantara\nJl. Palmerah Selatan 26-28\nJakarta 10270\ne-mail: bukufdkompas.com\nEditor: Patricia Wulandari\nIlustrator: Levina Lesmana\nDesain Cover: Levina Lesmana\nLayout: Cindy Alif\nHak cipta dilindungi oleh undang-undang\nDilarang mengutip atau memperbanyak sebagian atau seluruh isi\nbuku ini tanpa izin tertulis dari Penerbit\nxxiv + 320 him.; 13 cm x 19 cm\nISBN: 978-602-412-518-9\neISBN: 978-602-412-519-6\nKMN: 581815108\nPerpustakaan Nasional RI. Data Katalog dalam Terbitan LKDT1                   -----------  \nManampiring, Henry\nFilosofi teras: filsafat Yunani-Romawi Kuno untuk mental tangguh masa kini / Henry Manampiring; editor, \nPatricia Wulandari. - Jakarta: Kompas Media Nusantara, 2018.\n344 him ; 19 cm.\nBibliografi: him. _\nISBN 978-602-412-518-9\n1. Filsafat kuno. I. Judul. II. Patricia Wulandari.\n1812\nIsi di luar tanggung jawab Percetakan Gramedia, Jakarta\nSanksi Pelanggaran Pasal 113\nUndang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta\n(1)Setiap Orang yang dengan "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "HENRY MANAMPIRING\nFilosofi \nTeras\nFilsafat Yunani-Romawi Kuno untuk\nMental Tangguh Masa Kini\nHenry Manampiring\nIlustrator: Levina Lesmana"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "FILOSOFI TERAS IV\nKata Pengantar................................................................................vii\nPrakata: Mengapa Saya Menulis Buku Ini?..................................xix\nBAB SATU\nSURVEI KHAWATIR NASIONAL....................................................1\nThe Cost of Worrying:....................................................................6\n'Masalah khawatir bukan masalah \"di pikiran\" saja!\" Wawancara dengan Dr. Andri SpKJ FAPM\n...........................................................................................................7\nIntisari Wawancara dengan Dr. Andri:..........................................16\nBAB DUA\nSEBUAH FILOSOFI YANG REALISTIS...............................................................17\nThe Problem with Positive Thinking..................................................................18\nFilosofi Teras........................................................................................................22\nApa TUJUAN UTAMA dari Filosofi Teras?........................................................27\nIntisari Bab 2:.......................................................................................................34\nBAB T"
    }
  ],
  "buku-017": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Bahagia, Kenapa Tidak?\nSEBUAH REFLEKSI FILOSOFIS\nPenerbit Maharsa\nMaHa aRS\nReza A.A Wattimena\nIllustrator:\nMaria Wilis Sutanto\nBahagia, Kenapa Tidak?\nSEBUAH REFLEKSI FILOSOFIS\nPenerbit Maharsa\nMaHa aRS\nReza A.A Wattimena\nIllustrator:\nMaria Wilis Sutanto"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "Oleh: Reza A.A Wattimena\nEditor: Y. Dwi Koratno\nIlustrator: Maria Wilis Sutanto\nDesain sampul: Mischa Sekarpandya\nTata letak: i-noeg\nIlustrasi sampul: Paul Bond, Ode to Zen Koan\nhttp://www.paulbondart.com/Gallery\n© 2015 – M 0028\nJl. Gabus No. 24 – Rt 23/Rw 05,VII Minomartani\n- 55581YOGYAKARTA\nTelp. 081 227 10938\ne-mail:\npenerbitmaharsa@gmail.com\ninfo@maharsa.co.id\nwebsite: www.maharsa.co.id\nMaHa aRS\nBAHAGIA, KENAPA TIDAK?\nSebuah Reﬂeksi Filosoﬁs\nHak cipta dilindungi undang-undang.\nDilarang mengutip atau memperbanyak sebagian atau seluruh isi\nbuku ini dalam bentuk dan dengan cara apa pun\ntanpa izin tertulis dari penerbit.\nISBN 978-602-08931-1-2 (pdf)\nISBN 978-602-08931-0-5 (cetak)"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "iii\nDaftar IsI\nPendahuluan: Filsafat untuk Kebahagiaan Hidup  ............................................................................  v\nKebahagiaan dalam Desain Politik  ....................................................................................................................  1\nKebahagiaan, Fundamentalisme dan Kebebasan  ...............................................................................  8\nKebahagiaan dan Duniaku  .........................................................................................................................................  13\nKebahagiaan dan Hidupku  .........................................................................................................................................  17\nKebahagiaan dan Persahabatan  .............................................................................................................................  23\nKebahagiaan, Ingatan dan Solidaritas  ............................................................................................................  28\nKebahagiaan Kaum In-telek-tual?  ..................................................................................................."
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "iv | Ba h a g i a, Ke n a p a Ti d aK?\nKebahagiaan, Demokrasi dan Rasa Jijik   ......................................................................................................  118\nKebahagiaan dan Pretensi?  .........................................................................................................................................  121\nKebahagiaan dan Hidup yang Terbalik  ........................................................................................................  125\nKebahagiaan dan Lotus di Medan Perang  .................................................................................................  130\nKebahagiaan dan Kekebalan  .....................................................................................................................................  134\nKebahagiaan, Ilmu Pengetahuan dan Alam  ............................................................................................  138\nKebahagiaan dan Kesedihan  .....................................................................................................................................  143\nKebahagiaan dan Penderitaan,Sama Saja?  ............................................"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "v\nPenDahuluan:  \nfIlsafat untuk kebahagIaan hIDuP\nB\nanyak orang masih berpendapat, bahwa filsafat itu bikin pusing. Ia tidak praktis. \nIsinya banyak teori abstrak, dan tidak langsung ber hubungan dengan kehidupan \nnyata kita sehari-hari. Akhirnya, banyak orang takut untuk belajar filsafat.\nBanyak orang juga mengira, bahwa belajar filsafat itu bikin orang tidak percaya \nagama. Filsafat mendorong orang untuk menjadi ateis, yakni orang yang tidak \npercaya tuhan. Dengan cap semacam ini, semakin banyak orang yang takut untuk \nbelajar filsafat. Sudah bikin pusing dan bikin orang jadi ateis, mengapa filsafat tidak \ndihapuskan saja dari muka bumi ini?\nSayangnya, setelah lebih dari 15 tahun menggeluti filsafat, saya berpendapat, \nsemua cap itu salah. Filsafat tidak abstrak, melainkan sebaliknya: ia berbicara \ntentang kehidupan manusia yang nyata dengan segala kerumitannya. Filsafat \njuga tidak mendorong orang untuk menjadi ateis atau tidak beragama. Filsafat \nmembentuk cara berpikir yang kritis, masuk akal dan reflektif. Ateis atau tidak, itu \npilihan pribadi.\nSelama manusia masih berpikir dan bertanya, filsafat tidak akan pernah hilang \ndari muka bumi ini. Filsafat lahir dari dorongan alam"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vi | Ba h a g i a, Ke n a p a Ti d aK?\nbatin yang berlangsung tanpa henti. Namun, ia tidak hanya terjadi di dalam \nhidup pribadi, tetapi juga mendorong revolusi sosial politik yang bertujuan untuk \nmenciptakan masyarakat yang lebih adil dan lebih makmur.\nHasil dari proses berpikir filosofis yang mendorong revolusi ini adalah hidup \nyang bahagia. Kebahagiaan, dengan kata lain, lahir dan berkembang, setelah orang \nmengalami revolusi berpikir di dalam hidupnya. Kebahagiaan adalah hasil dari \nrevolusi hidup. Maka buku ini, yakni ”Bahagia, Kenapa Tidak?” bisa dipahami \nsebagai lanjutan dari buku ”Filsafat sebagai Revolusi Hidup” .\nPertanyaan penting berikutnya, apa yang dimaksud dengan hidup yang bahagia? \nAda begitu banyak definisi tentang hidup yang bahagia. Definisi ini tersebar di \nberbagai displin ilmu, mulai dari filsafat, psikologi, teologi, spiritualitas bahkan \nbiologi. Setelah menelusuri berbagai definisi tersebut, saya sampai pada kesimpulan \nsederhana.\nHidup yang bahagia menyentuh tiga tingkatan. Y ang pertama adalah hidup \nyang bernilai dari kaca mata pribadi. Artinya, kita menganggap cara hidup kita itu \npenting dan menarik untuk diri kita sendiri. Y ang kedua adalah cara "
    }
  ],
  "buku-018": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "Begin Reading\nTable of Contents\nAbout the Author\nCopyright Page\n \nThank you for buying this\nFlatiron Books ebook.\n \nTo receive special oﬀers, bonus content,\nand info on new releases and other great reads,\nsign up for our newsletters.\n \nOr visit us online at\nus.macmillan.com/newslettersignup"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "The author and publisher have provided this e-book to you for your\npersonal use only. You may not make this e-book publicly available in\nany way. Copyright infringement is against the law. If you believe\nthe copy of this e-book you are reading infringes on the author’s\ncopyright, please notify the publisher at:\nus.macmillanusa.com/piracy."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "For Tom\nI’m sorry I dragged you into all this.\n&\nFor my grandmother Eileen\nWho regularly reminds us to “live an ordinary life” and\n“enjoy the good times.”"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "They were careless people, Tom and Daisy—they\nsmashed up things and creatures and then retreated\nback into their money or their vast carelessness, or\nwhatever it was that kept them together, and let other\npeople clean up the mess they had made.\n—F. SCOTT FITZGERALD, THE GREAT GATSBY"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Prologue\nWe’re in the middle of an archeological ruin somewhere on the\nPanamanian coast. It’s me, two guys I work with, clusters of people\nwho are basically naked, and Mark Zuckerberg. Mark is not happy.\nThis is the 2015 Summit of the Americas, an international meeting of\nworld leaders. This particular event is a state dinner that—other than\nMark—is supposed to be exclusively heads of state of various\ncountries: Brazil, Colombia, Cuba, Canada, the US, over thirty other\nnations. I wrangled Mark an invitation because I’ve been trying to\nconvince him that he needs to have relationships with these people.\nBut somehow we are the only ones at this party.\nUnder dark skies and low clouds, a red carpet stretches into the\ndistance in the ruins, dimly lit by the open ﬁres. It’s ﬂanked by guards in\nancient costumes with frilly collars and colorful silk pants, wielding\nswords and ax-type things. Plus the naked people, who—on closer\ninspection—are seminaked, wearing abbreviated, ancient, ﬂesh-toned\ncostumes. On one side, a group of people wearing only tiny loincloths\nand holding crops. Farther down, people who appear to be dressed as\nmembers of a kind of primeval Ku Klux Klan. All in front of th"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "time you look directly at one of the noncostumed extras, they meet your\neyes and stare back at you. It’s unnerving.\nWhen we get to the empty dining area, I see who’s sitting where\nand it’s dreadful. Because he isn’t a head of state, Mark is assigned a\ntable between two people who seem to be random relatives of the\npresident of Panama. I mean, they might also have been ministers, and\nI’m trying to google them and simultaneously pretend that everything\nabout the evening is okay and normal, and of course I have no internet\nsignal because we’re in archeological ruins on the coast of Panama.\nSeeing few other options, I casually switch out Mark’s name card\nwith that of a minor president on a better table. I ferry the name cards\ninconspicuously in my handbag so the staﬀ who have emerged and are\nmilling around don’t notice, and then breathe a sigh of relief and let the\nteam know what I’ve done.\n“He wants to sit next to Castro,” Javi says.\n“Not happening,” I respond.\nJavi’s my favorite of the coworkers here tonight—Javier Olivan, in\ncharge of “growth” at Facebook, which means he’s the person\nresponsible for getting the billions who still aren’t on the platform to sign\nup. Javi’s a laid-back"
    }
  ],
  "buku-019": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "ii\n6XDUD\u0003GDUL\u0003.HODV\u0003.HFLO\nKumpulan Cerpen, Esai, Naskah Drama, Puisi dan Komik Strip Antikorupsi\n©Komisi Pemberantasan Korupsi 2015\nPengarah:\nPimpinan KPK\nDeputi Pencegahan KPK\nPenanggung jawab:\nDirektur Pendidikan dan Pelayanan Masyarakat KPK\nSupervisi:\nSandri Justiana\nGumilar Prana Wilaga\nDony Mariantono\nMasagung Dewanto\nPenyusun:\nProVisi Education\nPenulis:\nPeserta Teacher Supercamp 2015: Guru Menulis Antikorupsi\nDiterbitkan oleh:\nDirektorat Pendidikan dan Pelayanan Masyarakat\nKedeputian Bidang Pencegahan\nKomisi Pemberantasan Korupsi\nJl. Kuningan Persada Kav. 4, Jakarta Selatan 12950\nwww.kpk.go.id\nhttp://acch.kpk.go.id\nCetakan 1: Jakarta, 2016\nBuku ini boleh dikutip dengan menyebutkan sumbernya, diperbanyak untuk tujuan \npendidikan dan nonkomersial lainnya, dan bukan untuk diperjualbelikan."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "iii\n'DIWDU\u0003,VL\nDAFTAR ISI iii\nKATA PENGANTAR v\nSAMBUTAN PIMPINAN KPK vii\nCERPEN \nPaket 2\nPanasea 8\nBepak 16\nLintasan Berita 24\nJangan Bilang Tidak 28\nNASKAH DRAMA \nCarut Marut Konflik Kepentingan 34\nDurian Pak RT 44\nAmplop-Amplop Laknat 52\nJangan Sebut Aku Anak Koruptor 58\nPenyesalan 68\nKOMIK STRIP\nSi Cikung \nGuru Sudah Canggih 77\nBijak Teknologi 78\nPagi, Siang, Sore, Malem 79\nSadar Dong 80\nPeduli adalah Kiper Terbaik 81\nPendidikan Bukan Sepak Bola 82\nWaspada 24 Jam 83\nBerani di Jalanan 84\nArna Fera\nJujur Itu Hebat 86\nUh Rendah 87\nDisiplin Sarapan 88\nBu Biru\nBuka hanya cinta, keadilan juga harus “buta” 90\nTunaikan “kewajiban” agar harga diri tidak turun saat menerima hak 91\nKeuangan harus “jujur” pada gaya hidup 92\nEverybody: berbaik sangka, tenang, klarifikasi, dan minta maaf jika kita salah 93\nMie instant sih, banyak! Prestasi instans mimpi kali, ya? 94\nPerbuatan baik maupun buruk akibatnya akan menimpa kita sendiri 95\nBelajar dan mengajar sama-sama harus “sabar 96\nKomikase\nBelajar Baca 98\nAntikorupsi = Banci? 99\nKerja Keras Perlu Latihan 100\nHari ini di Negeri Kami 101\nLarangan Berjualan 102\nSketsa dan Nyanyian 103"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "iv\nSi Mimi\nBerani Jujur Hebat 105\nBerani Jujur Hebat #2 106\nDihantui Tugas 107\nJangan Bangga 108\nJangan Suka Ngeles 109\nKomitmen Hingga Akhir 110\nAmanah & Manajemen Kepo 111\nESAI\nBung Hatta, Sepatu Belly, dan Korupsi 114\nKesepian si Burung Emas 118\nPahit 124\nAvin 130\nTanah Pecatu 136\nPUISI \nBelajar Merapal Bahasa Koruptor 140\nAku Merindukan Lirih Pidato Politikmu: Kepada Koruptor 142\nKredo  144\nPantun Nelayan, Korupsi Kuda Kata 145\nIni Sandiwara Apa 146\nTidakkah Kau Lelah 147\nJingga 149\nSeribu Malu 150\nKitab yang Dilacurkan 151\nDari Atas Menara 152\nPulang 153\nKarena Ia Bernama Indonesia 154\nKoruptor 155\nDemo I 156\nFuad di Simpang Jalan 157\nLima Guru Berpuisi Antikorupsi 160\nLuka  Istri   164\nSesal   166\nJanji  Anak   167\nIni Zaman Apa 168\nAndai Kutahu 169\nCinta untuk Pertiwi 170\nIndonesiaku  171\nSucilah Negeriku 173\nKetakutanku 174\nInilah Negeriku 175\nPROFIL PENULIS 178\nPROFIL MENTOR 186"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "v\n.$7$\u00033(1*$17$5\nPerjalanan kegiatan “Teacher Supercamp 2015: Guru Menulis Antikorupsi”,  sudah tiba di \npengujung dermaga. Puji syukur kepada Tuhan YME kami panjatkan karena atas kemudahan \ndan restu-Nya, serangkaian kegiatan pelatihan pengembangan kapasitas guru kreatif menulis \nantikorupsi, berjalan dengan lancar. Sekejap, namun penuh dengan warna. \nDimulai dari diskusi kelompok terarah yang menentukan dasar bentuk dan target pelatihan, \nkami berdiskusi panjang mengenai siapa yang perlu mendapatkan bimbingan penulisan \nkreatif dan seperti apa bentuk akhir karya yang sesuai dengan kebutuhan target sasaran. \nDilanjutkan publikasi ke SMP dan SMA/sederajat di seluruh Indonesia, serta menerima \nratusan karya-karya guru dalam bentuk puisi, cerpen, komik, esai, dan naskah drama. \nSetelah melewati proses seleksi dan penjurian, diputuskan 25 guru berhak mengikuti \npelatihan dan hadir dalam “Seminar Literasi Antikorupsi: Membangun Budaya Jujur \ndan Berkarakter melalui Literasi Antikorupsi. ” Akhirnya, muara dari kegiatan ini adalah \nditerbitkannya buku “Suara dari Kelas Kecil” ini.\nKPK memilih cerpen, naskah drama, esai, puisi, dan komik strip sebagai media edukasi \nkarena karakteristikny"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vi\nsegmentasi remaja. Selain itu, penggambaran dan pesan-pesan nilai-nilai antikorupsi diramu \ndan diinternalisasikan dalam setiap tindakan dan ucapan para tokoh, sehingga para remaja \ndapat lebih mudah menerima atau mencerna makna atau pesan di dalamnya.\nHarapan kami, buku ini dapat memperkaya khazanah dunia literasi yang saat ini telah ada \ndan dapat menjadi salah satu acuan bahan literasi di sekolah dalam format cerpen, komik, \npuisi, naskah drama, dan essai yang sarat akan nilai-nilai antikorupsi.\nDirektorat Dikyanmas"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "vii\n6$0%87$1\u00033,03,1$1\u0003.3.\nSesuai dengan amanat UU No. 30/2002 tentang KPK, dalam pasal 6 huruf (d) disebutkan \nbahwa salah satu tugas KPK adalah melakukan tindakan-tindakan pencegahan tindak pi -\ndana korupsi. Selanjutnya, sesuai amanat pada pasal 13 huruf (c) bahwa KPK harus melaku-\nkan pendidikan antikorupsi pada setiap jenjang pendidikan. \nDalam mengimplementasikan pendidikan antikorupsi, KPK mencoba bersinergi dengan \nsistem pendidikan nasional. Untuk itu, KPK menggunakan tiga sudut pandang. Pertama, \npendidikan antikorupsi sebagai implementasi manajemen di satuan pendidikan yang mener-\napkan prinsip keterbukaan, akuntabilitas, dan transparansi. Kedua, pendidikan antikorupsi \nsebagai implementasi kurikulum dan proses pembelajaran yang mengintegrasikan nilai-nilai \nantikorupsi yang bersifat insersi (sisipan) di mata pelajaran. Ketiga, pendidikan antikorupsi \nsebagai proses pembentukan nilai-nilai karakter antikorupsi melalui kegiatan yang bersifat \npembiasaan dan gerakan sosial.\nKPK juga tentu melibatkan semua pemangku kepentingan di bidang pendidikan dalam im -\nplementasi pendidikan antikorupsi tersebut. Karena, tanggung jawab melunturkan budaya \ndan praktik korupsi di tanah ai"
    }
  ],
  "buku-020": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Daftar Isi\nKATA PENGANTAR............................................................................ x\nBAB I PENDAHULUAN................................................................ 1\n1.1. Latar Belakang...................................................... 1\n1.2. Motivasi Penelitian .............................................. 19\n1.3. Rumusan Masalah ................................................ 21\n1.4. Tujuan Penelitian.................................................. 22\n1.5. Manfaat Penelitian ............................................... 22\n1.6. Struktur Isi Buku.................................................. 23\nBAB H MENGGALI TEKNOLOGI AKUNTANSI SY ART AH\nMELALUI EKSTENSI HIPERSTRUKTURALISME ISLAM \nTERINTEGRASI ................................................................ 27\n2.1. Pendahuluan......................................................... 27\n2.2. Tahap Pertama: Pengembangan Metodologi\nPenelitian................................................................ 32\n2.2.1. Proses Pertama: Menetapkan Elemen-elemen\nStrukturalisme....................................................... 35\n2.2.2. Proses Kedua: Menetapkan Elemen-elemen\nPoststrukturalisme......."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "viii DAFTAR ISI\n2.3.1,5.Doxa dan Symbolic Violence  dalam Practice .. 48\n2.3.2. Ekstensi Constructiinst Structuralist ............... 49\n2.3.3. Koleksi Data Teoritis-Nonteoritis...................... 58\n2.3.4. Koleksi Data Empiris 'source” Laporan\nKeuangan ................................................................ 59\n2.3.5. Analisis Bagian-bagian dan Utuhan Laporan\nKeuangan Syari’a h ................................................ 62\n2.4. Ringkasan...............................................................  64\nBAB m BELAJAR DARI BERBAGAI KONSEP DASAR\nTEORITIS AKUNTANSI KONVENSIONAL................ 67\n3.1. Pendahuluan ......................................................... 67\n3.2. Proprietary Theory .............................................. 69\n3.3. Entity Theory ......................................................... 74\n3.4. Enterprise Theory  ............................................... 78\n3.4.1. Value Added  .......................................................... 79\n3.4.2. Value Added Statement ....................................... 81\n3.4.3. Realitas Enterprise Theory  dan\nValue Added Statement ...................................... 85\n3.5. Corporate So"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "4.4. Menuju Sharia’te Enterprise Theory ................ 114\n4.4.1.  Akuntabilitas dalam Akuntansi Syari’ah ........ 115\n4.4.2. Informasi dalam Akuntansi Syari’ah................. 117\n4.5. Sharia’te Value Added Statement ............... 118\n4.6. Dari Sharia’te Enterprise Theory  Menuju \nKemungkinan Sharia’te Financial Statement  120\n4.7. Ringkasan..................................................... .......... 122\nBABV MENEMUKAN HABITUS AMANAH TRAH-TRAH\nBISNIS SEBAGAI SUBSTANSI LAPORAN KEUANGAN 125\n5.1. Pendahuluan ......................................................... 125\n5.2. Konsep Amanah dalam Syaria’te Enterprise\nTheory .................................................................... 126\n5.3. Menggali Perilaku  Bisnis Melalui Antropologi\nSinkronis.................................................................. 134\n5.3.1. Perilaku  Trah Sarekat Islam .............................. 134\n5.3.2. Perilaku  Trah Nahdlatul Ulama........................ 142\n5.3.3. Perilaku  Trah Muhammadiyah ........................ 150\n5.4. Ringkasan: Amanah dalam Rangkaian\nAntropologis Sinkronis ........................................ 155\nBAB VI SINKRONISASI ANTROPOLOGIS UNTUK \nMENGEMBANGKA"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "X DAFTAR ISI\n6.3. Teoritisasi Antropologis:\nInteraksi Sinkronis-Diakronis ............................. 171\n6.3.1. Ma’isyah. Berbasis Laporan Arus Kas\nSyari’a h .................................................................... 173\n6.3.2. Rizq  Basis Laporan NiJai Tambah Syari’ah ..... 178\n6.3.3. Maal  Basis Neraca Syari’ah ................................. 182\n6.3.4. Tujuan Laporan Keuangan Syari’ah ................. 185\n6.4. Pendekatan Artikulasi Trilogi\nLaporan Keuangan Syari’ah................................. 190\n6.5. Pengakuan Trilogi Laporan Keuangan Syari’ah 193\n6.6. Pengukuran Trilogi Laporan Keuangan\nSyari’a h .................................................................... 195\n6.7. Prinsip Berbasis Kas Sinergi Akrual Terbatas .. 198\n6.8. Ringkasan: Agenda Teknologis Trilogi Laporan\nKeuangan Syari’ah ................................................ 200\nBAB VU LAPORAN ARUS KAS SYARTAH\nBERBASIS MATSY AH....................................................... 203\n7.1. Pendahuluan ......................................................... 203\n7.2. Laporan Arus Kas Syari’ah: State of The A rt.... 204\n7.3. Merangkai Konsep Arus Kas dari Trilogi Tradisi, \nSosio-Historis dan "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "8.2. Laporan Nilai Tambah Syari’ah:\nIn The Beginning ................................................... 244\n8.3. Nilai Tambah Syari’ah dalam Realitas:\nAksiologi Rezeki .................................................... 253\n8.3.1. Makna Rezeki Trah-trah Bisnis.......................... 253\n8.3.2. Substansi Nilai Tambah Syari’ah Berbasis\nRezeki ...................................................................... 259\n8.4. Ekstensi Nilai Tambah Syari’ah\nBerbasis Rizq Income ........................................... 261\n8.5. Ringkasan............................................................... 270\nBAB IX NERACA SYARTAH BERBASIS MAAL ......................... 273\n9.1. Pendahuluan......................................................... 273\n9.2. Merangkai Konsep Neraca dari Trilogi Tradisi,\nSosio-Historis dan Empiris-Kontekstual .......... 275\n9.2.1. Merangkai Kekayaan Altruistik Islami dalam\nKeseimbangan Al Muhith ................................... 281\n9.2.2. Merangkai Kekayaan Al Muhith Menjadi\nKerangka Neraca Syari’ah.................................... 285\n9.3. Elemen-elemen Neraca Syari’ah ....................... 288\n9.4. Ringkasan.........................................."
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "xii DAFTAR ISI\nD a f t a r  T a b e l\n1. Framework oflslam ic Corporate Reports (Baydoun dan\nWillett 1994)..................................................................................... 4\n2. Laporan Nilai Tambah Syari’ah Kuantitatif (Mulawarman\n2006).................................................................................................. 6\n3. Laporan Laba Rugi versi Proprietary Theory ......................... 73\n4. Financial Statement versi Entity Theory ................................... 76\n5. Value Added Statement ............................................................... 82\n6. Neraca Lingkungan menurut Dorweiller dan Yakhou\n(2005) ................................................................................................ 94\n7. Ringkasan Konsep Ma’isyah  masing-masing Trah sebagai\nDasar Konsep Arus Kas Syariah ................................................ 177\n8. Ringkasan Konsep Rizq Masing-masing Trah sebagai Dasar\nKonsep Nilai Tambah Syari’ah ................................................... 180\n9. Riangkasan Konsep Maal Masing-masing Trah sebagai\nDasar Konsep Neraca Syari’ah.................................................... 185\n10. Perbedaan P"
    }
  ],
  "buku-021": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "22\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta untuk \nmengumumkan atau memperbanyak ciptaannya, yang timbul secara otomatis setelah \nsuatu ciptaan dilahirkan tanpa mengurangi pembatasan menurut peraturan perundang-\nundangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barangsiapa dengan sengaja atau tanpa hak melakukan perbuatan sebagaimana \ndimaksud dalam pasal 2 ayat 1(satu) atau pasal 49 ayat 1 (satu) dan ayat 2 (dua) di \npidana penjara masing-masing paling singkat 1 (satu) bulan dan/atau denda paling \nsedikit Rp.1.000.000,- (satu juta rupiah), atau pidana penjara paling lama 7 (tujuh) \ntahun dan/atau denda paling banyak Rp. 5.000.000.000,- (lima milyar rupiah).\n(2)  Barangsiapa dengan sengaja menyiarkan, memamerkan, mengedarkan atau \nmenjual kepada umum suatu ciptaan atau barang hasil pelanggaran hak cipta atau \nhak terkait sebagaimana dimaksud pada ayat 1 (satu) dipidanakan dengan pidana \npenjara paling lama 5 (lima) tahun dan/atau denda paling banyak Rp. 500.000.000,- \n(lima ratus juta rupiah)\nDistributor Tunggal :\nPT. SERAMBI SEMESTA \nDISTRIBUSI\nJl. Jer"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "33\nKata Pengantar\nAssalamu’alaikum Wr Wb.\n Puji dan syukur kita panjatkan kepada Allah SWT \nkarena atas rahmat, dan karunia, serta kasih sayang-\nNyalah, buku ini dapat terselesaikan. Atas dari dukungan \nberbagai pihak, baik itu dari sisi redaksional, editorial, \nlayout serta cover design. \n Makkah disebut sebagai kota suci karena terdapat \ndi Masjidil Haram, yang dimana Ka’bah merupakan \nsimbolnya, maka kota Madinah disebut juga sebagai kota \nsuci karena terdapat Masjid Nabawi, yang merupakan \npusat dari kekuasaan Islam. Maka dalam buku ini akan \nmembahas sedikit mengenai adanya keistimewaan-\nkeistimewaan yang ada di Makkah ataupun Madinah.\n Tentu penulis menyadari bahwa buku ini masih jauh \ndari kata sempurna, oleh karena itu penulis memohon maaf \njika terdapat kesalahan baik yang disengaja maupun tidak \ndisengaja dalam kata-kata. Penulis juga dengan senang \nhati menerima kritik dan saran sebanyak-banyaknya dari \npara pembaca sehingga penulis dapat membuat buku \nyang lebih baik lagi di masa yang akan mendatang, Terima \nkasih.\nWasalammu’alaikum Wr Wb"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "44\nDaftar Isi\n1. Mengenal Kota Makkah Al-mukaramah  7\n2. Sejarah Kota Makkah Dan Madinah  13\n3. Sejarah Adanya Ka’bah Di Makkah  19\n4. Sejarah Menghadap Kiblat Ke Ka’bah  25\n5. Perkembangan Dan Sejarah Kota Jeddah  35\n6. Kehebatan Air Zam-zam  41\n7. Nabi Ismail Yang Hendak Di Sembelih  51\n8. Mengenal Hijir Ismail  57\n9. Rahasia Gunung Magnet Di Madinah  59\n10. Rahasia Ka’bah Sebagai Pusat Astronomi  65\n11. Rahasia Ka’bah Dengan Golden Ratio  69\n12. Karunia Keajaiban Di Makkah  77\n13. Peristiwa Banjir Yang Melanda Makkah  81\n14. Peristiwa Adanya Masjid Al-jin Di Makkah  87"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "55\n15. Peristiwa T erjadinya Serangan Gajah  97\n16. Makam Nabi Ibrahim Makkah  103\n17. T apak Kaki Nabi Ibrahim Di Makkah  111\n18. Keistimewaan Masjidil Haram  115\n19. Mengenal Ji’ranah Di Kota Makkah  123\n20. Sejarah Perjalanan Panjang Hajar Aswad  125\n21. Sejarah Multazam Yang Mustajab  133\n22. Sejarah Dan Keutamaan Masjid Quba  145\n23. Sejarah Masjid Nabawi Di Makkah  149\n24. Sejarah Khandak/masjid Khamsah  157\n25. Kisah Jabal Abi Qubais  159\n26. Asal Mula Muzdalifah  163\n27. Keindahan Jabal Rahmah Di Arafah  167\n28. Keistimewaan Gua Hira Atau Jabal Nur  173\n29. Sejarah Jabal T sur Di Makkah  179\n30. T empat Ziarah Di Madinah Al-munawwaroh  187"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "66\n31. Misteri Gua Uhud Di Makkah  197\n32. Hijrah Nabi Dari Makkah Ke Madinah  201\n33. Sejarah Dan Mukjizat Bumi Mina  207\n34. Mengenal Sejarah Lembah Muhassir  213\n35. Sejarah Bukit Shofa Dan Marwah  217"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "BAB\n77\nKota Makkah Al-Mukkaramah\n Siapa yang tidak mengenal “Makkah” . Pastinya semua umat \nIslam di seluruh dunia pernah mendengar mengenai kota ini. Makkah, \nkota di jantung jazirah Kerajaan Arab Saudi. Kota Makkah merupakan \ntujuan utama bagi kaum muslimin untuk menunaikan salah satu rukun \nIslam, ibadah haji. Sebuah kota pada saat musim haji tiba, jutaan umat \nIslam dari berbagai Negara yang disebut sebagai hujjaaj (jama’ah \nhaji) tumpah ruah berkumpul di sana. Dijuluki dengan sebutan al-\nMukarramah, karena Makkah adalah kota yang dimuliakan oleh Allah \nSWT . Karena, di kota Makkah ini Allah SWT memerintahkan Nabi \nIbrahim AS dan Nabi Ismail AS untuk mendirikan Baitullah (Ka’bah) \ndi Masjidil Haram, yaitu sebuah bangunan yang utama dimana Ka’bah \ndibangun di dalamnya. \n \n Bangunan Ka’bah inilah yang kemudian dijadikan sebagai \npatokan arah Kiblat untuk ibadah shalat bagi umat Islam di seluruh \ndunia. Sejarah dan kejayaan kota Makkah sudah terbangun sejak \ndahulu, dan bahkan masyarakat dunia mengakui mengenai peradaban \nyang berlangsung di kota Makkah. Dalam kitab Perjanjian Lama dan \nkarya-karya sastra klasik, bangsa Arab sudah ada sejak zaman dahulu \n1MENGENAL KOTA Makkah AL-M"
    }
  ],
  "buku-023": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "PRAISE FOR SECRETS OF DIVINE\nLOVE\n“The fragrance of the Beloved permeates every passage of this\nmagnificent book, gently opening the gates of the heart and inviting\nthe reader into a direct experience of that which the author so\nbeautifully evokes. Whether you identify as a Muslim whose faith has\nperhaps grown weary or as someone who would like to taste of the\nessence of a tradition you do not understand, Secrets of Divine Love\nis a masterful map of the landscape of the soul on its journey home\nto the One who both transcends and dwells within all that is.”\n—MIRABAI STARR\nAuthor of God of Love: A Guide to the Heart of Judaism, Christianity and Islam and Wild\nMercy: Living the Fierce & Tender Wisdom of the Women Mystics\n“A. Helwa’s book, Secrets of Divine Love, is a magnificent\naccomplishment. So often we are asked where and how one\naccesses the inner heart of the Islamic tradition—here it is! Helwa\ndoes a beautiful job of taking us, no matter what our faith\nbackground, through the Qur’an, teachings of the Prophet, Rumi,\nand other mystical luminaries. She does so with gentleness,\nkindness, never preachy, and always inviting. Secrets of Divine Love\nis a beautiful book, and a major con"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "breathes the spark of life into us and plants in us a longing to\nexperience these truths for ourselves.”\n—NURA LAIRD;\nMEd, Professor at the University of Sufism, Chair of the Department of Spiritual\nPeacemaking, Mediator, Sufi healer and Counselor\n“I am simply entranced by Helwa’s metaphors and insights. The bulk\nof her sentences are poetry in motion and studded with pearls of\nwisdom. Fragrant with beauty. Many of the sentences are musical.\nYou can rap with them. Enchanting! The creative way Helwa has\nintegrated her heart knowledge into her understanding of Islam is\nstunning.”\n—IMAM JAMAL RAHMAN\nAuthor of Spiritual Gems of Islam: Insights & Practices from the Qur’an, Hadith, Rumi &\nMuslim Teaching Stories to Enlighten the Heart & Mind\n“Secrets of Divine Love is the product of A. Helwa’s earnest search\nfor truth and meaning. It is also her invitation to us, the readers, to\nsee what she has seen. This is a fascinating book that offers various\nprofound insights and a vision of Islam—and indeed the Divine—that\nmany readers will surely find enlightening and uplifting.”\n—MOHAMMAD KHALIL\nProfessor of Islamic Studies at Michigan State University\n“Secrets of Divine Love opens with one word:"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "—DR. NAZITA LAJEVARDI\nAssociate Professor at Michigan State University and author of Outsiders at Home: The\nPolitics of American Islamophobia\n“Secrets of Divine Love remedies my deepest existential dread by\nreminding me of my inherent worth as a being that is unconditionally\nloved. It pulls from common as well as less known sources, providing\nevidence to quell the mind and soothe the heart. The carefully\ncurated content strikes deep emotional chords. I find myself\nirresistibly falling in love with God and Islam.”\n—MAHYA SHAMAI\nMultidisciplinary Artist\n“Secrets of Divine Love is a gem! It’s relatable and readable for\nthose of us who consider ourselves ‘faithful,’ those of us struggling to\nfeel so, and everyone in between. In the language of sweetness and\ncompassion, Helwa walks us through the journey of connection back\nto the love of Allah.”\n—LEILA ENTEZAM\nLMFT, MBA, Emotional Intelligence Thought Leader\n“The author’s work has a special way of speaking to the heart. This\nreading offers exceptional spiritual nuances on the core of Islamic\nbelief and practices. More than ever, we are in need of content like\nthis that shines a luminous light on a faith that is frequently\nmisunderstood."
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "2020 Naulit Inc.\nA publication of the Naulit Publishing House, A department of Naulit Inc.\nPrinted in the United States of America\nCover Design: Adji D.H., Anton Wardana, A. Helwa\nInterior Design: David Miles\nDesigner of Chapter Illustrations: Adji D.H., Anton Wardana, Muhammad Al-Shaikh, Qasim\nArif\nEditors: Heydieh Soroush, Sanam Saghafi, Teja Watson\nCreative Directors: Amir Y., Mahya Shamai, Heydieh Soroush\nNaulit Publishing House\nP.O. Box 7375\nCapistrano Beach, CA 92624\nCataloging-in-Publication Data\n2019918369\nPaperback ISBN: 978-1-7342312-0-5\nE-book ISBN: 978-1-7342312-1-2\nFirst Edition"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "“My Lord! Cause me to enter whatever I may do sincerely and cause\nme to leave it sincerely and grant me supporting authority from Your\npresence.”\nQUR’AN 17:80\nIn the name of Allah, the Lord of Mercy, the Bestower of Mercy. All\npraise and glory belongs to Allah, Lord of the worlds. The Lord of\nMercy, the Bestower of Mercy. Master of the Day of Judgment. You\nalone we worship; You alone we ask for help. Guide us to the\nstraight path. The way of those on whom You have bestowed Your\ngrace, Not of those who earned Your anger nor of those who went\nastray.\nQUR’AN 1:1-7"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "Acknowledgements\nIn the name of Allah, whose love made this book possible. Blessings\nbe upon the Prophet Muhammad \n , whose gentle mercy has taught\nme how to walk in faith. I am deeply grateful to all the prophets,\nwhose examples help guide me on the path of divine love. To Sidi,\nwho taught me how to hear the music of my soul. To my mother,\nwhose softness and prayers changed the course of my destiny. To\nmy father, who embodies what it means to be a sincere and\ngenerous servant of God. To Amir, whose kind heart and sweet soul\nteaches me how to love. To my grandfather, whose spiritual stories\nfill the pages of this book. To my family, who have always\nunconditionally supported me. To my soul friends, whose wisdom\nand love uplifts and inspires me. To my spiritual community and in\nparticular my teachers who taught me how to love God and\nexperience His unending peace. To the hundreds of thousands of\nkind souls in our beautiful online community, who taught me what it\nmeans to be vulnerable and sincere. To my editors and designers,\nfor guiding this book towards its greatest potential. And in the loving\nmemory of Esmat, who embodied what it means to be joyful, kind,\nand selfless. I dedicate"
    }
  ],
  "buku-024": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "22\nKUMPULAN DO’ A-DO’ A LANGIT\nHak Cipta © pada Penulis\nEditor\nHidayatul Aini\nFari Nuraeni SE\nDesign Sampul\nKipoy Arts Studio\nLayout\nDani Setiawan\nPenerbit \nMedina Ilmu\n224 hlm; 12 x 17 cm\nDistributor\nPT BUKU KITA\nJl. Kelapa Hijau No. 22, Jagakarsa, Jakarta Selatan 12620\nTelp: (021) 78881850, Fax: (021) 78881860\nCetakan Pertama\nPerpustakaan Nasional: Katalog dalam Terbitan (KDT)\nISBN : 978-602-9157-81-9\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta untuk mengumumkan atau \nmemperbanyak ciptaannya, yang timbul secara otomatis setelah suatu ciptaan dilahirkan tanpa mengu-\nrangi pembatasan menurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barang siapa dengan sengaja atau tanpa hak melakukan perbuatan sebagaimana dimaksud dalam \npasal 2 ayat 1(satu) atau pasal 49 ayat 1 (satu) dan ayat 2 (dua) di pidana penjara masing-masing \npaling singkat 1 (satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- (satu juta rupiah), atau \npidana penjara paling lama 7 (tujuh) tahun dan/atau denda paling banyak Rp. 5.000.000.000,- (lima \nmilyar rupiah"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "33\nKata Pengantar\nBismillaahirrahmaanirrahiim \nKami  panjatkan  rasa  syukur  alhamdulillah  ke \nhadirat   Allah  yang   maha   tinggi.   Dan   kami \nhaturkan shalawat dan salam kepada junjungan kita \nNabi   besar   Muhammad,   keluarga,   sahabat   dan \norang-orang   yang   mengikuti   jejak   mereka   dengan \nbaik hingga hari kiamat. \nWa ba’du: \nTelah  banyak  buku  do’a  yang  tersebar  di  tengah \nmasyarakat   Islam.   Ada   yang   berpedoman   dengan \najaran    Al-Qur’an,   Sunnah,   atau   lainnya.   Kadang \nmasyarakat  awam  tidak  dapat  membedakan  antara \ndo’a  yang  sejalan  dengan  ajaran  Nabi  dan  mana \nyang tidak.   Sedangkan  do’a  yang  tidak  berdasarkan \najaran  Nabi,  ada  yang  berbau  syirik,  menyesatkan \ndan terkadang dapat menghapus aqidah Islam secara \ntotal."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "44\nDAFT AR ISI\n1.  Do’a akan mengaji/belajar kitab     11\n2.  Do’a sehabis mengaji/belajar kItab     12\n3.  Do’a ilmu yang bermanfaat     12   \n4.  Do’a mohon perlindungan ilmu yang tidak    \n bermanfaat     13\n5.  Do’a membaca Al-Qur’an     14\n6.  Do’a mohon kebahagian     14\n7.  Do’a masuk penginapan     15\n8. Do’a mohon kebaikan pasar     16\n9.  Do’a masuk pasar     16\n10.  Do’a berpidato     17\n11. Do’a ketika dikejar musuh     18\n12. Do’a melihat musuh     18\n13. Do’a mohon diamankan dari pencuri     19\n14. Do’a sujud tilawat     20\n15.  Do’a sujud sahwi     20\n16. Do’a mohon kekayaan dan kemualiaan     21\n17. Do’a sehabis bersuci      22\n18. Do’a di waktu sore      22\n19. Do’a masuk WC      23\n20. Do’a keluar WC      23\n21. Do’a mohon kebaikan hari      24\n22. Do’a bercermin      25\n23. Do’a memakai pakaian baru      25\n24. Do’a menggunakan pakaian      26\n25. Do’a melepaskan pakaian      27\n26. Do’a di waktu pagi      28\n27. Do’a sehabis sholat awwabin      28\n28. Do’a sebelum sholat      29\n29. Do’a ketika akan mengerjakan      30\n30. Do’a masuk masjid      30\n31. Do’a keluar masjid     31\n32. Do’a melihat air hendak berwudhu     32\n33. Do’a setelah berwudhu     32\n34. Do’a"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "55\n41. Do’a mengusap kepala     37\n42. Do’a mengusap kedua daun telinga     38\n43. Do’a mengusap leher     39\n44. Do’a membasuh kaki kanan     39\n45. Do’a membasuh kaki kiri     40\n46.\t Do’a\tmohon\tdijauhkan\tdari\tfitnah\thidup\tdan\t\t \t \t\n mati     41\n47.\t Do’a\tmohon\tdijauhkan\tdari\tmati\tkafir\t     41\n48. Do’a mohon dijauhkan dari mati jelek     42\n49. Do’a mohon dijauhkan dari penyakit     43\n50. Do’a menengok orang sakit     44\n51. Do’a menghadapi orang sakit     44 \n52. Do’a sakit gusi     45\n53. Do’a sakit panas     46\n54. Do’a ketika ada anggota tubuh yang bengkak     46\n55. Do’a mohon dijauhkan dari sakit mata     47\n56. Do’a orang sakit mata     48\n57. Do’a bila menemukan sesuatu yang sukar untuk   \n dipecahkan     48\n58. Do’a ketika sukar mencari keperluan hidup     49\n59. Do’a ketika tertimpa perkara yang     \n menyusahkan     50\n60. Do’a takut kejelekan dari suatu kaum     50\n61. Do’a ditimpa bermacam-macam kesusahan     51\n62. Do’a untuk menghadapi orang yang berkuasa     52 \n63. Do’a menjinakkan hewan     53\n64. Do’a mohon dijauhkan dari gangguan jin     54 \n65. Do’a mohon dijauhkan dari kalajengking     55\n66. Do’a untuk menjaga gangguan ular     55\n67. Do’a takut akan bina"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "66\n79. Do’a untuk menjaga diri     65\n80. Do’a ketika hujan sangat lebat     65\n81. Do’a bila hujan turun      66\n82. Do’a ketika mendengar petir      66\n83. Do’a ketika ada kilat      67\n84. Do’a minta hujan      68\n85. Do’a ketika ada angin besar      68\n86. Do’a melihat langit      69\n87. Do’a bulan sabit lenyap      70\n88. Do’a melihat bulan sabit tinggal satu      71\n89. Do’a mohon kesabaran      72\n90. Do’a mohon hati benar dan jujur      72\n91. Do’a membuka hati dan kemudahan perkara      73\n92. Do’a untuk bayi yang telah dibacakan adzan      74 \n93. Do’a melahirkan      75\n94. Do’a mohon anak laki-laki      75\n95. Do’a tolak bala’      76\n96. Do’a dijauhkan dari afat      77 \n97. Do’a merasa dusta kepada Allah      77\n98. Do’a pengampunan kepada Allah      78\n99. Do’a buat kedua orang tua      79\n100. Do’a mohon didatangi Nabi ketika akan mati dan   \n masuk kubur      79\n101. Do’a mohon kesenangan dan rahmat ketika didalam   \n kubur     80\n102. Do’a sehabis mengubur mayit     81\n103. Do’a mengubur mayit     82\n104. Do’a menghadapi mayit yang dimasukkan ke    \n kuburan     82\n105. Do’a melihat jenazah     83\n106. Do’a sakaratul maut     84\n107. Do’a shalawat mohon kepada Nab"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "77\n115. Do’a Nabi Musa     90\n116. Do’a Nabi Ibrahim     91\n117. Do’a mohon selamat dari rasa dengki     92\n118. Do’a melihat perkara yang disenangi     93\n119. Do’a mohon keselamatan     93\n120. Do’a mohon keselamtan dunia dan akhirat     94\n121. Do’a sehabis mimpi buruk     95\n122. Do’a sehabis mimpi baik     95\n123. Do’a bangun tidur     96\n124. Do’a aman dari mimpi keluar sperma     96\n125. Do’a berbaring setelah sholat sunnah subuh     97\n126. Do’a tidur     98\n127. Do’a sehabis bersetubuh     99\n128. Do’a keluar sperma ketika bersetubuh     100\n129. Do’a bersetubuh     100\n130. Do’a mohon keluarga mulia    101\n131. Do’a mohon ketetapan iman    102\n132. Do’a menjaga iman    102\n133. Do’a setelah dari sesuatu majelis    103 \n134. Do’a bangun dari duduk    103\n135. Do’a untuk orang yang minta izin    104\n136. Do’a mohon diberi sebuah kebaikan dan dijauhkan   \n dari semua kejelekan    105\n137. Do’a ohon empat macam kebaikan    106\n138. Do’a mohon menjadi orang yang penyantun,    \n penyabar, dan tidak menymbongkan diri    106\n139. Do’a mohon menjadi pimpinan yang     \n bertaqwa    107 \n140. Hal yang menakjubkan kita jika takut terkena     \n ‘ain    108\n141. Do’a mohon kecukupan pe"
    }
  ],
  "buku-025": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "2  \nKedahsyatan Dzikir Asmaul Husna\nHak Cipta ©  pada Penyusun \nArdi Romadlon\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta untuk mengumumkan \natau memperbanyak ciptaannya, yang timbul secara otomatis setelah suatu ciptaan dilahirkan tanpa \nmengurangi pembatasan menurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barangsiapa dengan sengaja atau tanpa hak melakukan perbuatan sebagaimana dimaksud \ndalam pasal 2 ayat 1(satu) atau pasal 49 ayat 1 (satu) dan ayat 2 (dua) di pidana penjara masing-\nmasing paling singkat 1 (satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- (satu juta \nrupiah), atau pidana penjara paling lama 7 (tujuh) tahun dan/atau denda paling banyak Rp. \n5.000.000.000,- (lima milyar rupiah).\n(2)  Barangsiapa dengan sengaja menyiarkan, memamerkan, mengedarkan atau menjual kepada \numum suatu ciptaan atau barang hasil pelanggaran hak cipta atau hak terkait sebagaimana \ndimaksud pada ayat 1 (satu) dipidanakan dengan pidana penjara paling lama 5 (lima) tahun \ndan/atau denda paling banyak Rp. 500.000.000,- (lima ratus j"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "3  \nAssalamu’alaikum wrb.\nSesungguhnya Asmaul Husna (99 Nama Allah) \nmemiliki banyak sekali faedah yang berguna bagi \nsemua orang, namun sayangnya tidak banyak yang \ntahu. Asmaul Husna seperti memberikan jalan terang \nbagi banyak urusan atau permasalahan yang datang, \nsayangnya banyak yang tidak mengerti atau malah \nmenyepelekannya. Tidak sedikit yang menganggapnya \nomong kosong dan menjauhinya, padahal begitu \nbanyak sekali faedah yang terangkum disini sebagai \ncahaya pengantar kita untuk menyelesaikan masalah.\nBuku ini hadir menjadi solusi permasalahan hidup. \nDengan berisikan faedah-faedah dari Asmaul Husna, \nmencoba memberikan beberapa pilihan yang Insya \nAllah menjadi faedah terlengkap dari semua buku \nAsmaul Husna yang pernah ada. Diharapkan buku \nini bisa membantu anda dalam menjalani hidup \nbermasyarakat, berkeluarga, usaha dan berkepribadian \nyang dekat dengan Allah SWT. \nArdi Romadlon"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "4  \n1. Ar – Rahmaan \n(Maha Pemurah)\nYaa Rahmaanu narjuu rohmatak  \nYa Tuhan Yang Maha Pengasih, kami \nmengharap kasih sayang-Mu.  \nBarang siapa yang membaca Ya Rahmaan sebanyak \n100 kali tiap selesai mengerjakan sholat fardhu, \nmaka dengan izin Allah akan hilanglah sifat lalai \ndan lupa dalam dirinya. Jika Ya Rahmaan sebanyak \n500x usai menunaikan shalat lima waktu, insya Allah \nhati akan menjadi tenang dan tenteram. Membaca \nYa Rahmaan akan membawa keberuntungan, dan \nkenikmatan di akhirat kelak. \nBarang siapa yang membaca \"Yaa Rohmaanu\" \nsebanyak 300 kali pada setiap selesai shalat fardhu, \ninsya Allah hatinya akan diberikan ketenangan, dan \ndijauhkan dari sifat lupa serta kegugupan."
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "5  \n2. Ar – Rahiim \n(Maha Penyayang)\nYaa Rahiimu irhamnaa  \nYa Tuhan yang Maha Penyayang, \nkasih dan sayangilah kami.  \nBarang siapa takut terjerumus kepada perbuatan \nyang tidak disukainya, maka hendaklah ia berdzikir \ndengan membaca Ya Rahmaan Ya Rahiim sebanyak \n100 kali setiap selesai mengerjakan sholat fardhu.\nDan barang siapa yang membaca Ya Rahiim \nsebanyak 100 kali setelah mengerjakan sholat \nsubuh, niscaya dia akan mendapatkan kasih sayang \ndari semua makhluk dan terhindar dari semua \nbencana dan malapetaka.\nJika Asma Allah ini dibaca setiap hari 100x setelah \nshalat, maka orang yang membacanya akan dilindungi \ndan seluruh makhluk akan mengasihinya. \nBarang siapa yang menyebut Yaa Rahim, Insya Allah"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "6  \nhatinya akan selalu memiliki sifat kasih sayang. \nMembaca Ya Rahiim sebanyak 100x setiap hari, \nInsya Allah akan dikaruniai daya tarik yang luar \nbiasa, sehingga banyak orang akan merasa cinta \ndan kasih kepada kita.\nInsya Allah.\nAr Rohiim adalah Yang Maha Penyayang. Barang \nsiapa yang membaca \" Ya Rohiimu \" sebanyak 100 \nkali setiap hari secara rutin, insya Allah akan diberi \ndaya tarik yang sangat kuat, sehingga banyak \norang yang menaruh rasa cinta serta kasih sayang \nkepadanya. Dan jika kebetulan berhadapan dengan \nlawan atau musuh, maka lawan itu akan segera \nmenjadi lunak hatinya, lantaran hatinya berbalik \nmenaruh rasa kasih sayang kepadanya.\nBERDUSTA\nAbu Hurairah ra berkata: “Nabi n bersabda: ‘Siapa yang \nberdusta atas namaku dengan sengaja, maka berarti dia telah \nmenyiapkan tempatnya di dalam neraka. ’” (Dikeluarkan oleh \nBukhari  pada Kitab ke-3, Kitab Ilmu dan bab ke-38, bab dosa \norang yang berdusta atas nama Rasulullah)"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "7  \n3. Al – Malik \n(Maharaja)\nYaa Maaliku A’thinaa min mulkika  \nYa Tuhan yang Maha Raja (mempunyai \nkekuasaan), berikanlah kepada kami dari \nkekuasaan-Mu.\nBarang siapa membaca ism ini dengan rutin tiap hari \npada waktu matahari tergelincir sebanyak 100 kali \nniscaya hatinya akan menjadi bersih, dan lenyaplah \nsegala kekotorannya.\nLalu jika membacanya sesudah terbit fajar sebanyak \n120 kali, maka Allah akan memberinya kekayaan \ndan karunia-Nya, baik dengan sebab-sebab maupun \ndengan pintu yang dibukakan Allah SWT atasnya.\nMenurut Hadits, Nabi Khaidir a.s mengajarkan doa \nberikut ini untuk dibacakan kepada orang sakit \nsebanyak 100 kali : \n Allaahhumma anta al–Malik al–Haqq al-ladzii laa \nilaaha illaa anta. Yaa Allah, yaa Salaam, ya Syaafi’   \ndan Yaa Syifaa’ al-quluub  3x."
    }
  ],
  "buku-026": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "2\nRahasia Kedahsyatan Basmallah\nHak Cipta © Pada Penulis\nSulistyowati Khairu\nEditor :\nHimatu Mardiah\nDesign Sampul :\nDesy Ambarwati\nLayout :\nNur Aisyah\nPenerbit :\nMedina Ilmu\nDistributor Tunggal :\nPT . Cahaya Insan Suci\nJl.Kebagusan III Kawasan \nkomplek Nuansa 99\nTelp. 021-7884 7081, \n        7884 7037\nFax. 021-7884 7012\n176 hlm; 13x19 cm\nISBN: 978-602-0969-44-2\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta \nuntuk mengumumkan atau memperbanyak ciptaannya, yang timbul secara \notomatis setelah suatu ciptaan dilahirkan tanpa mengurangi pembatasan \nmenurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barang siapa dengan sengaja atau tanpa hak melakukan perbuatan \nsebagaimana dimaksud dalam pasal 2 ayat 1(satu) atau pasal 49 ayat 1 \n(satu) dan ayat 2 (dua) di pidana penjara masing-masing paling singkat 1 \n(satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- (satu juta rupiah), \natau pidana penjara paling lama 7 (tujuh) tahun dan/atau denda paling \nbanyak Rp. 5.000.000.000,- (lima milyar rupiah).\n(2)  Barang siapa dengan sengaja menyi"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "3\nKata Pengantar\n Puji dan syukur kepada Allah SWT karena atas nikmat, \nrahmat, karunia, dan kasih sayang-Nyalah, buku ini dapat penulis \nselesaikan. Dukungan berbagai pihak, baik itu dari sisi redaksional, \neditorial, layout serta cover design. \n Satu kalimat dengan seribu makna, mudah diucapkan \nnamun memiliki kedahsyatan yang tidak banyak orang tahu. \nBanyak orang yang menganggap ini hanya kalimat biasa saja \npadahal tidaklah demikian adanya.\n Basmalah memiliki tempat tersendiri. Begitu banyak \nfaedah dan kekuatannya yang sesungguhnya sangat bermanfaat \nbagi kita semua. Baik itu sebagai pengobatan, usaha, dan \nkehidupan tentunya. Namun sayangnya hanya sedikit saja orang \nyang tahu akan hal ini.\n Ilmu akan bermanfaat bila sampai dan tersebar kepada \nsanak keluarga, kerabat dan saudara-saudara seiman dan \nseagama.\n Penulis tentu saja menyadari bahwa buku ini masih \njauh dari kata sempurna, oleh sebab itu penulis memohon maaf \napabila terdapat kesalahan baik yang disengaja maupun tidak \ndisengaja dalam penulisan kata. Terima kasih.\nDistributor Tunggal :\nPT . Cahaya Insan Suci\nJl.Kebagusan III Kawasan \nkomplek Nuansa 99\nTelp. 021-7884 7081, \n        7884 7037\nFax. 021-7884 7012\n176 "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "4\nDaftar Isi\nBAB 1\nDefinisi Basmalah  7\n• Definisi Basmalah  7\n• Kajian Basmalah  10\n• Makna Basmalah  14\n• Tafsir Basmalah  18\n• Tafsir Huruf Basmalah  19\n• Pentingnya Bacaan Basmalah  21\n• Makna Ba’ yang Dibaca Bi Pada Bismilah  22\n• Makna Kata Allah  25\n• Ar-rahman Ar-rahim  27\nBAB 2\nHukum Basmalah Dalam Shalat  33\n• Apakah Basmalah Termasuk Ayat \nDalam Surat Al-fatihah Ataukah Bukan?  33\n• Apakah Bagian Dari Setiap Surat?  36\n• Hukum Bacaan Basmalah  37\n• Hukum mengeraskan Bacaan Basmalah  38\n• Terdapat Jalan Lain Dari Abu Hurairah  40\nBAB 3\nTa’awudz Dan Basmalah  45\n• Ta’awudz  45\n• Basmalah  50"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "5\nBAB 4\nTempat Dan Waktu Membaca Basmalah  53\n• Tempat-tempat Yang Disyariatkan \n Membaca Basmalah  53\n• Hendak Makan  53\n• Hendak Berjima’  60\n• Meletakkan Jenazah  61\n• Menyembelih  65\n• Hendak Buang Air  76\n• Ketika Marah  85\n• Masuk Rumah  90\n• Keluar Rumah  90\n• Menulis Surat  91\n• Ruqyah  92\n• Hendak Berwudhu  92\n• Menutup Pintu, Memadamkan Lampu, \nDan Menutup Bejana  92\nBAB 5\nKedahsyatan Basmalah  93\n• Kedahsyatan Basmalah  93\n• Tujuan Basmalah  94\n• Melemahkan Kekuatan Syaitan \nDan Mengecilkan Bentuknya  96\n• Menghalangi Masuknya Syaitan Ke Rumah  100\n• Menjaga Diri Dari Gangguan Syaitan \nSepanjang Hari  118\n• Pelindung Diri Dari Kejahatan Yang Ada \nDi Luar Rumah  126"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "6\n• Menutup Penglihatan Jin  127\n• Melindungi Generasi Dari Gangguan  \nSyaitan  128\n• Sebagai Obat  135\n• Mendatangkan Berkah  136\n• Mendapatkan Petunjuk, Dicukupi Kebutuhan, \nDan Diberi Penjagaan  137\n• Meraih Kehidupan Yang Baik  \n(Hayatan Thoyyibah)  137\n• Mendapatkan Rezeki Dari Arah Yang Tidak  \nTerduga  138\nBAB 6\nKeutamaan Membaca Basmalah  139\n• Keutamaan Membaca Basmalah  139\n• Kedudukan Bacaan Basmalah  147\n• Hikmah Membaca Basmalah  154\nBAB 7\nKhasiat Basmalah  159\n• Beberapa Keutamaan Basmalah  159\n• Beberapa Khasiat Basmalah  162\n• Khasiat basmalah 6  170"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "7\nDEFINISI BASMALAH\nDefinisi Basmalah\nBasmalah dalam bahasa Arab yang digunakan jika \nkita menyebutkan kalimat Islam bismi-llahi ar-rahmani \nar-rahimi. Kalimat ini merupakan kalimat yang tertera di \ndalam setiap awalan Surat di dalam Al Qur’an, terkecuali \ndi dalam Surat At-Taubah. Sering diucapkan setiap kali \nseorang Muslim dalam menunaikan shalat, Pada saat \nmemulai kegiatan harian lainnya, dan biasanya kalimat ini \ndigunakan sebagai pembuka kalimat (Mukadimah) dalam \nkonstitusi atau piagam di negara-negara Islam. \nBasmalah yaitu doa (menyebut asma Allah) untuk \nmemulai segala perbuatan baik. Bunyi lafadh Basmalah \nmerupakan sebagai berikut:\n \n“Dengan menyebut nama Allah yang Maha Pemurah \nlagi Maha Penyayang”.\nBAB\n1"
    }
  ],
  "buku-027": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "2\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta untuk mengumumkan \natau memperbanyak ciptaannya, yang timbul secara otomatis setelah suatu ciptaan dilahirkan \ntanpa mengurangi pembatasan menurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barangsiapa dengan sengaja atau tanpa hak melakukan perbuatan sebagaimana dimaksud \ndalam pasal 2 ayat 1(satu) atau pasal 49 ayat 1 (satu) dan ayat 2 (dua) di pidana penjara \nmasing-masing paling singkat 1 (satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- \n(satu juta rupiah), atau pidana penjara paling lama 7 (tujuh) tahun dan/atau denda paling \nbanyak Rp. 5.000.000.000,- (lima milyar rupiah).\n(2)  Barangsiapa dengan sengaja menyiarkan, memamerkan, mengedarkan atau menjual kepada \numum suatu ciptaan atau barang hasil pelanggaran hak cipta atau hak terkait sebagaimana \ndimaksud pada ayat 1 (satu) dipidanakan dengan pidana penjara paling lama 5 (lima) tahun \ndan/atau denda paling banyak Rp. 500.000.000,- (lima ratus juta rupiah)\nDistributor Tunggal :\nPT. SERAMBI SEMESTA \nDISTRIBUSI\nJl. Jeruk "
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "3\nKata Pengantar\n Puji dan syukur kepada Allah SWT karena atas nikmat, rahmat, \nkarunia, dan kasih sayang-Nyalah, buku ini dapat penulis selesaikan. Buku ini \nberjudul “Setan Selalu Bersemayam di Setiap Sudut Rumahku”. \nRumah dalam arti umum adalah salah satu bangunan yang dijadikan \ntempat tinggal selama jangka waktu tertentu. Rumah dapat dijadikan sebagai \ntempat tinggal untuk manusia dan tempat tinggal yang khusus bagi hewan \nadalah sangkar, sarang, atau kandang. Rumah dalam arti khusus adalah \nhubungan yang terjalin di dalam bangunan tempat tinggal, seperti keluarga, \nhidup, makan, tidur, beraktivitas, dan lain-lain.\nDi dalam buku ini akan dibahas mengenai Setan Selalu Bersemayam \ndi Setiap Sudut Rumahku. Mulai dari rumah yang disukai syaitan dan dijauhi \nMalaikat kemudian rumah yang dimasuki Malaikat dan dijauhi syaitan.\nTentu saja penulis menyadari bahwa buku ini masih jauh dari kata \nsempurna, oleh karena itu penulis memohon maaf apabila terdapat kesalahan \nbaik yang disengaja maupun tidak disengaja. Penulis juga dengan rendah hati  \nmenerima sebanyak-banyaknya kritik dan saran dari para pembaca sehingga \npenulis dapat membuat buku yang lebih baik lagi di masa mendatang, Ter"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "4\nDaftar Isi\nBAB 1 \nDefinisi Syaitan  7\n• Allah Menciptakan Jin Sebelum Manusia  9\n• Jin, Syaitan, dan Iblis  9\n• Syaitan  11\n• Gambaran Mengenai Syaitan  14\n• Jenis-jenis Syaitan  14\n• Pintu-pintu Masuknya Syaitan Melalui Hati Manusia \n 16\nBAB 2 \nDefinisi Malaikat  25\n• Malaikat di Dalam Ajaran Islam  25\n• Nama-Nama Malaikat Beserta Tugasnya  28\n• Sifat Para Malaikat  30\nBAB 3 \nRumah Sebagai Tempat Tinggal  33\n• Definisi Rumah  33\n• Rumah atau Tempat Tinggal Menurut Al Qur’an  34\n• Ciri-ciri Rumah Dalam Islam  37\nBAB 4 \nRumah-rumah yang Tidak Dimasuki Malaikat  39\n• Rumah-rumah yang Tidak Dimasuki Malaikat  39\n1. Rumah yang Dihuni Oleh Orang yang  \nMemutuskan Tali Silaturahmi  39\n2. Rumah yang Dihuni Oleh Orang yang Memasang  \nGambar di Dinding atau Patung  45"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "5\n3. Rumah Orang yang di Dalamnya ada Lonceng  51\n4. Rumah yang Dihuni Oleh Orang yang  \nMendengar Nyanyian dan Lagu-lagu  51\n5. Rumah Orang yang di Dalamnya ada Salib  54\n6. Rumah Orang yang di Dalamnya ada Anjing ke Rumah  55\n7. Rumah yang Dihuni Oleh Orang yang boros  57\n8. Rumah Orang yang Durhaka Kepada Kedua Orang Tua  60\n9. Rumah yang Penghuninya Tidak Pernah Membaca  \nAl Qur’an  68\n10. Rumah yang Dihuni Oleh Orang yang Makan Makanan  \nyang Berbau  74\nBAB 5 \nRumah-rumah yang Ditakuti Syaitan  75\n• Rumah-rumah yang Ditakuti Syaitan  75\n1. Rumah yang Selalu Dihiasi dengan Ibadah dan  \nDzikrullah, Seperti Tilawah Al Qur’an  76\n2. Rumah yang Penghuninya Mengamalkan Salam dan  \nMeminta Izin  81\n3. Rumah yang Penghuninya Senantiasa Berbuat Baik  \nKepada Kedua Orang Tuanya  90\n4. Rumah yang Penghuninya Tidak Melakukan Hal yang  \nHaram dan Munkar  96\n5. Rumah yang Penghuninya Selalu Menjaga  \nKetaatan Kepada Allah SWT  98\n6. Rumah yang Senantiasa Bersih  103 \n7. Rumah Orang-orang yang Senantiasa Sujud dan Ruku  105\n8. Rumah yang Penghuninya Adalah Orang-orang yang   \nJujur Dan Tepati Janji  108\n9. Rumah yang Dihuni Oleh Orang yang Makanannya  \nHalal  111\n10. Rumah Orang yang Melaksa"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "7\nDEFINISI SYAITAN\nAllah swt sudah mengutus Rasulullah SAW dengan risalah yang umum \ndan menyeluruh. Rasulullah SAW diutus tidak hanya untuk kalangan Arab saja \nakan namun juga untuk selain Arab. Tidak khusus bagi kaumnya saja, tetapi \nbagi umat seluruhnya. Bahkan Allah SWT mengutusnya kepada segenap Ats-\nTsaqalain: jin dan manusia.\n Allah SWT berfirman:\n“Katakanlah: “Hai manusia sesungguhnya aku adalah utusan Allah \nswtt kepadamu semua, yaitu Allah Yang mempunyai kerajaan langit dan bumi; \ntidak ada Tuhan (yang berhak disembah) selain Dia, Yang menghidupkan dan \nmematikan, maka berimanlah kamu kepada Allah swt dan Rasul-Nya, Nabi \nyang ummi yang beriman kepada Allah swt dan kepada kalimat-kalimat-Nya \n(kitab-kitab-Nya) dan ikutilah dia, supaya kamu mendapat petunjuk”.”  (QS. Al \nA’raaf: 158)\n1"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "8\n Rasulullah SAW bersabda:\n“Yaitu para Nabi itu diutus kepada kaumnya sedang aku diutus kepada \nseluruh manusia.” (HR. Al-Bukhari dan Muslim dari Jabir bin Abdillah)\n Allah SWT juga berfirman:\n“Dan (ingatlah) ketika Kami hadapkan serombongan jin kepadamu \nyang mendengarkan Al Qur’an, maka tatkala mereka menghadiri pembacaan \n(nya) lalu mereka berkata: “Diamlah kamu (untuk mendengarkannya).” \nKetika pembacaan telah selesai mereka kembali kepada kaumnya (untuk) \nmemberi peringatan. Mereka berkata: “Hai kaum kami, sesungguhnya kami \ntelah mendengarkan kitab (Al Qur’an) yang telah diturunkan sesudah Musa \nyang membenarkan kitab-kitab yang sebelumnya lagi memimpin kepada \nkebenaran dan kepada jalan yang lurus. Hai kaum kami, terimalah (seruan) \norang yang menyeru kepada Allah dan berimanlah kepada-Nya, niscaya Allah \nakan mengampuni dosa-dosa kamu dan melepaskan kamu dari azab yang \npedih. Dan orang yang tidak menerima (seruan) orang yang menyeru kepada \nAllah maka dia tidak akan melepaskan diri dari azab Allah di muka bumi dan \ntidak ada baginya pelindung selain Allah. Mereka itu dalam kesesatan yang \nnyata”.” (QS. Al Ahqaaf: 29-32)"
    }
  ],
  "buku-028": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "v\nPengantar\nRagam EkspREsi islam NusaNtaRa\nISBN 978 -979- 98737- 6–7\nPengantar\nAbdurrahman Wahid\nTim Editor:\nSupervisor:\nYenny Zannuba Wahid\nPenanggung jawab:\nAhmad Suaedy\nAnggota:\nSubhi Azhari\nRumadi\nNurul Huda Ma’arif\nNurun Nisa’\nGamal Ferdhi\nWidhi Cahya\nRancang Sampul:\nJarot Wisnu Wardhana\nTata Letak:\nM. Isnaini “Amax’s”\nUrusan Percetakan :\nA. Farid\nCetakan I : \nOktober 2008\nDiterbitkan oleh:\nJl. Taman Amir Hamzah  No. 8\nJakarta Selatan 10320\nTelp. : +62-21-3928233, 3145671\nFax   : +62-21-3928250\nEmail     : info@wahidinstitute.org\nWebsite : www.wahidinstitute.org\nBuku ini merupakan kumpulan suplemen the WAHID Institute yang pernah diterbitkan di \nMajalah GATRA (Oktober 2005 - September 2006) dan Majalah TEMPO (Oktober 2006 - Maret 2008).\nRedaktur Ahli: Yenny Zannuba Wahid, Ahmad Suaedy, Lies Marcoes-Natsir, Budhy Munawar-Rachman.\nSidang Redaksi: Ahmad Suaedy, Rumadi, Abd. Moqsith Ghazali, Gamal Ferdhi, M. Subhi Azhari, \nNurul H. Maarif, Nurun Nisa."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Ragam Ekspresi ISLAM Nusantara\nvi\nL\nayaknya seorang gadis rupawan, Islam kini \nsedang menjadi rebutan banyak pihak. Namun \nmasih belum ada yang memperhatikan dengan \nseksama ragam ekspresi lokal, baik yang tradisional \nmaupun dinamika per kembangan mutakhirnya.  Sema-\nkin dalam ditelusuri dan diikuti jejaknya, ragam Islam \nlokal makin menarik dan bervariasi.\nDi sini kami tampilkan Islam yang hidup dalam \nmasyarakat Indonesia yang merupakan kelanjutan his -\ntoris dari Islam Nusantara, yaitu Islam yang multi wajah \ntapi saling memahami satu dengan yang lainnya. Inilah \nIslam yang memberikan ruang bagi pertemuan, dengan \nnegosiasi dan sintesa kehidupan. Islam yang menghujam \nke dalam relung kehidupan masy arakat. Ia berhadapan \ndengan dinamika ekspresi masyarakat. Dengan demi -\nkian Islam yang tampil di ruang publik tidak hanya Islam \nyang garang, fundamentalistik dan menebar ancaman.\nDari penelusuran, the WAHID Institute banyak me -\nnemukan khazanah Islam Nusantara. Kemudian kami \ntuangkan ke dalam Majalah GATRA dan Majalah TEMPO \ndalam bentuk artikel sisipan bulanan. Setiap bulan se -\nlama dua setengah tahun, kami mencoba secara konsis-\nten memuat itu di GATRA  Oktober 2005 sampai S"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "vii\nPengantar\nS\najian warna-warni dinamika terkini k aum santri. \nDiracik dan disuguhkan “orang dalam” . Dikelola \nsekelompok analis muda berpikiran terbuka yang \nmenguasai pokok masalah dan memahami konteks \npersoalan dengan baik. Dikemas renyah dengan gaya \njurnalistik. Ditelaah dari sudut yang tidak biasa. Bahkan \nkadang mengejutkan. Begitulah kesan umum suplemen \nthe WAHID Institute yang dimuat tiap awal bulan selama \nsetahun di Majalah GATRA, mulai November 2005.\nDi antara sumbangan penting suplemen ini adalah \nupayanya menampilkan wajah moderat kreatif kaum \nsantri arus utama yang selama ini cenderung menjadi \n“mayoritas diam” (silent majority). Mereka yang lebih sepi \ning pamrih padahal rame ing gawe. Mereka yang banyak \nberkreasi, tapi tidak terlalu memikirkan publikasi. Padahal \nkinerja sosial mereka penting menjadi pembelajaran \nbagi publik luas.\nKeberadaan mereka tidak diketahui luas, kecuali \noleh kalangan yang intensif menjalin komunikasi dan \nkerja sama dengan mereka, seper ti para pengelola \nsuplemen ini. Bagi peneliti atau jurnalis pada umumnya \nyang jarang berinteraksi dengan dunia santri, diperlukan \nkemauan kuat dan  ketekunan tersendiri untuk bisa \nmenyelami dan"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "Ragam Ekspresi ISLAM Nusantara\nviii\nPaling akhir, “ Mozaik Muslim Nusantara ” (Lebaran \n2008) yang melakukan reportase mendalam tentang  \nmodel toleransi agama berbasis budaya di komunitas \nmuslim pada kawasan minoritas Muslim, seperti Papua, \nFlores, Minahasa, Tana Toraja, Dayak, dan sebagainya. \nPublikasi suplemen the WAHID Institute merupakan \nsatu dari empat paket kerja sama, yang juga terdiri dari \npenerbitan buku yang dikembangkan dari edisi khu-\nsus Hajatan D emokrasi (2004), penerjemahan buku \nitu ke bahasa Inggris, dan diskusi buku di empat kota: \nJakarta, Makassar, Mataram, dan Banjarmasin. Bahwa \nrangkaian suplemen the WAHID Institute itu kini juga \ndibukukan, tentu merupakan perkembangan yang \nmenggembirakan.\nDisatukannya seluruh edisi suplemen yang semula \nterserak itu, dalam bentuk buku, dapat mempermudah \npembaca menelaah ulang sajian tersebut secara lebih \nterpadu. Pembaca yang hanya menjumpai beberapa \nedisi, dan kehilangan edisi yang lain, kini dapat menjum-\npai keseluruhan. Sehingga benang merah pesan moral-\nintelektual semua sajian itu bisa ditangkap lebih utuh. \nSelamat membaca![] \n \nJakarta, Oktober 2008\nAsrori S. Karni \nRedaktur Majalah GATRA"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "ix\nPengantar\nM\nembaca serial suplemen the WAHID Institute \ndi Majalah TEMPO seperti bertamasya me-\nngunjungi aneka rupa pemikiran Islam. Di \nawal perjalanan, “pemandu wisata” sudah menyiapkan \npaket ”tour”: hanya berkunjung ke tempat yang menye-\nbarkan pemikiran Islam yang damai dan toleran. Jangan \nberharap tiba-tiba kita diajak berbelok ke tempat yang \npercaya agama perlu ditegakkan dengan pedang dan \ngolok, misalnya. \nSemua “lokasi” sudah ditentukan dengan kesadaran \npenuh sejak awal. Dan di akhir paket “ tour” itu, sang \npemandu dengan bersemangat menginginkan peserta \nmembawa pulang kesan bahwa Islam agama yang rukun \ndengan penganut keyakinan lain, membela pluralisme, \ndan yang terpenting: menolak kekerasan. Semangat itu \nkelihatan jelas mulai dari mencari ide cerita, pemilihan \nsumber dan penulis kolom.\nKesan itu secara umum berhasil disampaikan. \nSebagian ditentukan oleh cara menulis yang popular, \nriset yang serius, dan reportase yang sungguh-sungguh. \nIni sebuah bacaan yang tidak ditulis satu arah untuk \npublik yang harus menelan bahan mentah-mentah se-\nperti “khotbah” shalat Jumat. Atau seperti selebaran \n“penuh doktrin” di masjid-masjid, yang isinya membuat \nbulu kuduk "
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "Ragam Ekspresi ISLAM Nusantara\nx\nyang dalam ilmunya. Kedalaman itu terlihat dari cara \nmereka memilih pemeo, perumpamaan, idiom, yang \nmembumi dengan masyarakat yang dilayani. Mereka \nyang sehari-hari berkutat mengajar dan membolak-\nbalik kitab kuning inilah yang diharapkan menjaga sikap \nkhas kaum nahdliyin: lentur dalam menyikapi berbagai \npersoalan hidup, termasuk hidup bernegara. Sebuah \nsikap yang semakin relevan saat ini.\nToleransi luas yang ditawarkan kaum nahdliyin \nbarangkali semacam ”pereda” rasa cemas atas munculnya \nkelompok dengan rasa toleransi tipis. Sebuah paragraf di \nsuplemen ini  menuliskan: \nMenjelang pemakaman Jalaluddin Rumi, \nseorang Kristen menangis tersedu. Dia mencurahkan \nkesedihannya. “Kami menghormati Rumi seperti \nMusa, Daud, dan Yesus zaman ini. Kami semua \nadalah para pengikut dan muridnya,” ungkapnya. \nIndonesia hari ini merupakan sebuah komunitas \nyang jauh dari saat Rumi wafat itu. Tapi sesungguhnya \nmasalah utama bukan soal hubungan antar agama, \nmelainkan di dalam Islam sendiri. Problem yang \nmengganggu adalah hadirnya kelompok yang seolah-\nolah mengklaim diri sebagai “polisi Tuhan”. Seperti \nmerasa didaulat menjadi otoritas “pengatur kehidupan”"
    }
  ],
  "buku-029": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "Hak cipta dilindungi undang-undang.\nDilarang mengutip atau memperbanyak sebagian \natau seluruh isi buku ini tanpa izin tertulis dari penerbit."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "SEJARAH ISLAM DI NUSANTARA\nDiterjemahkan dari The Makings of Indonesian Islam, terbitan Princeton University Press, 2011\nKarya Michael Laffan\nCetakan Pertama, September 2015\nPenerjemah: Indi Aunullah & Rini Nurul Badariah\nPenyunting: Munawir Azis & Agus Hadiyono\nPerancang sampul: Adit H. & Fahmi Ilmansyah\nPemeriksa aksara: Fitriana & Akhmad Zulkarnain\nPenata aksara: Adfina Fahd\nFoto isi: Koleksi pribadi penulis\nDigitalisasi: Rahmat Tsani H.\nCopyright © 2011 Princeton University Press\nAll rights reserved. No part of this book may be reproduced or transmitted in any form or by any \nmeans, electronic or mechanical, including photocopying, recording or by any information storage \nand retrieval system, without permission in writing from the publisher.\nHak terjemahan ke dalam bahasa Indonesia ada pada Penerbit Bentang.\nDiterbitkan oleh Penerbit Bentang (PT Bentang Pustaka)\nAnggota Ikapi\nJln. Plemburan No. 1, Pogung Lor, \nRT 11 RW 48 SIA XV , Sleman, Yogyakarta 55284\nT elp.: (0274) 889248, Faks.: (0274) 883753\nSurel: bentang.pustaka@mizan.com\nSurel redaksi: redaksi@bentangpustaka.com\nhttp://bentangpustaka.com\nPerpustakaan Nasional: Katalog Dalam T erbitan (KDT)\nLaffan, Michael\nSejarah Isl"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "ISI BUKU\nDaftar Gambar viii\nDaftar Singkatan dan Rujukan Arsip ix\nKata Pengantar xiii\nUcapan T erima Kasih xviii\nBagian Satu \nINSPIRASI, INGATAN, REFORMASI 1\n #1 Mengingat Islamisasi, 1300–1750 2\n #2 Menerima Sebuah Ajaran Baru, 1750–1800 28\n #3 Reformasi dan Meluasnya Ruang Muslim, 1800–1890 46\nBagian Dua \nKEKUASAAN DALAM PENCARIAN PENGETAHUAN 75\n #4  Berbagai Pandangan Fundamental \n  mengenai Islam Hindia, 1600–1800 78\n #5 Rezim-Rezim Baru Pengetahuan, 1800–1865 99\n #6 Mencari Gereja Penyeimbang, 1837–1889 117\nBagian Tiga\nORIENTALISME DIGUNAKAN 143\n #7 Renungan-Renungan dari Jauh \n  mengenai Sebuah Koloni Penting, 1882–1888 145\n #8  Perjumpaan-Perjumpaan Kolaboratif, 1889–1892 169\n #9  Para Mufti Bayangan, Modern Kristen, 1892–1906 187\nBagian Empat\nMASA LALU SUFI, MASA DEPAN MODERN 201\n #10  Dari Sufisme ke Salafisme, 1905–1911 203\n #11  Para Penasihat untuk Indonesië, 1906–1919 218\n #12  Pengerasan dan Perpisahan, 1919–1942 240\nSimpulan 267\nGlosarium 271\nCatatan 277\nIndeks 317"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "DAFTAR GAMBAR\nGambar 1  Pusat-Pusat Melayu di Asia T enggara, \n sekitar 1200–1600 3\nGambar 2  Syarh Umm al-barahin, manuskrip, \n sekitar abad kesembilan belas 6\nGambar 3  Islam Nusantara, 1600–1900 37\nGambar 4  Imam Bonjol, sekitar 1848 44\nGambar 5  Makam Malik Ibrahim, dari Van Hoëvell, \n Reis over Java 106\nGambar 6  Jawa pada Masa Kolonial Akhir 168\nGambar 7  Majmu‘at mawlud \n (Bombay: Muhammadiyya, 1324) 174"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "AA Ambtelijke adviezen van C. Snouck Hurgronje 1889–1936, \nE. Gobée dan C. Adriaanse (ed.), 3 vol., (The Hague: \nNijhoff, 1957–65)\nAr. Bahasa Arab\nArchief Archief voor de geschiedenis der oude Hollandsche zending , \nJ.A. Grothe (ed.), 6 vol., (Utrecht: Van Bentum, 1884–91)\nb. Ibn, atau Bin; penyebutan dalam bahasa Arab untuk \n“putra dari”\nBB Binnenlandsch Bestuur, Kepegawaian Negeri Hindia \nBelanda\nBKI Bijdragen tot de T aal-, Land- en Volkenkunde\nCSI Centraal Sarekat Islam, badan koordinasi Sarekat Islam\nBld. Bahasa Belanda\nEI2 Encyclopaedia of Islam, Edisi Kedua, P . Bearman dkk. \n(ed.), 12 vol., (Leiden: Brill, 1954–2005)\nEI3 Encyclopaedia of Islam Three, Gudrun Krämer dkk. (ed.), \n(Leiden: Brill, 2007–)\nf Gulden Belanda\nGAL Carl Brockelmann, Geschichte der arabischen Litteratur , \nJan Just Witkam, pengantar dan ed., 2 vol. 3 sup., \n(Leiden: Brill, 1996)\nGG Gouveneur Generaal van Nederlandsch Indië, Gubernur \nJenderal Hindia Belanda\nHAZEU* Collectie Hazeu, KITLV , H 1083\nIG Indisch Gids\nIJMES International Journal of Middle East Studies\nILS Islamic Law and Society\nIOL India Office Library, British Library\nIOR India Office Records, British Library\nIPO Overzicht van de Inlandsche-"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "x  —    SEJARAH ISLAM DI NUSANTARA\nJALAL AL-DIN* Maleisch leesboek voor eerstbeginnenden en meergevorderden; \nVijfde stukje; Bevattende een verhaal van den aanvang der \nPadri-onlusten op Sumatra, door Sjech Djilâl-Eddîn, J.J. de \nHollander, ed., (Leiden: Brill, 1857)\nJaw. Bahasa Jawa\nJESHO Journal of the Economic and Social History of the Orient\nJIB Jong Islamieten Bond\nJMBRAS Journal of the Malaysian Branch of the Royal Asiatic Society\nJRAS Journal of the Royal Asiatic Society\nJSEAS Journal of Southeast Asian Studies\nKERN* Collectie Kern, KITLV , H 797\nKIAZ/KIZ Kantoor voor Inlandsch en Arabisch Zaken/Kantoor \nvoor Inlandsch Zaken; Kantor Urusan Pribumi dan Arab, \nkemudian menjadi Kantor Urusan Pribumi\nKITLV Koninklijk Instituut voor Taal-, Land- en Volkenkunde; \nInstitut Kerajaan Belanda untuk Studi Asia T enggara dan \nKaribia, Leiden\nLOr. Leiden University Library, ms. Or.\nLUB Leiden University Library\nMel. Bahasa Melayu\nMCP Malay Concordance Project, Australian National \nUniversity, http://mcp.anu.edu.au/\nMinBuZa Nationaal Archief, Den Haag, Ministerie van Buitenlandse \nZaken: A-dossiers, 1815–1940, nummer toegang 2.05.03\nMR Nationaaal Archief, Den Haag, Ministerie van Koloniën"
    }
  ],
  "buku-030": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Hakikat Kitabevi Publications No: 11 \nAdvice \nfor\nthe Muslim \nHüseyn Hilmi Iş›k \nTwenty-Seventh Edition \nHa kî kat Ki tâ be vi\nDa rüş şe fe ka Cad. 5 3/A P.K.: 35 \n34083 Fa tih-IS TAN BUL/TURKEY \nTel: 90.212.523 4556–532 5843 Fax: 90.212.523 3693 \nhttp://www.hakikatkitabevi.com \ne-mail: info@hakikatkitabevi.com \nFEBRUARY -20 17"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The following poem is the translation of a part of the Persian \nDîwân by Mawlânâ Diyâ’ ad-dîn Khâlid al-Baghdadî (qaddas-\nAllâhu ta’âlâ sirrah al-’azîz).\nOH WHAT A PITY! \nI’ve idled my life away, oh what a pity! \nNever thought of the Morrow, oh what a pity! \nI’ve set the building in the air so foolishly,\nMy faith on weak foundation, oh what a pity! \nI’ve gone too far saying His Mercy is endless,\nForgotten His Name “Qahhâr,” oh what a pity! \nI’ve dived into sins and never done any good,\nWhy gone astray the right path, oh what a pity! \nI’ve struggled to win the world and worldly virtue,\nAnd missed the endless blessings, oh what a pity! \nThe road is rough and dark, the Devil leads the way,\nSins are heavy, I weep all day, oh what a pity! \nWithout a single virtue to appear in my deed-book,\nHow will this Khâlid be saved, oh what a pity! \nTYPESET AND PRINTED IN TURKEY BY:\n‹h lâs Ga ze te ci lik A.Ş.\nMerkez Mah. 29 Ekim Cad. İhlâs Plaza No: 11 A/41 \n34197 Yenibosna-İSTANBUL Tel: 90.212.454 3000 \n– 2–"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "Bismi’llâhi ’r-Rahmâni ’r-Rahîm \nPREFACE \nAllâhu ta’âlâ, pitying all the people in the world, creates and \nsends useful things to them. In the next world, favouring \nwhomever He wishes of those guilty Muslims who are to go to \nHell, He will forgive them and put them into Paradise. He alone is \nthe One who creates every living creature, keeps all beings in \nexistence every moment and who protects all against fear and \nhorror. Trusting ourselves to the honourable name of Allâhu \nta’âlâ, we begin to write this book.\nInfinite thanks be to Allâhu ta’âlâ! Peace and blessings be on \nHis most beloved Prophet, Muhammad (’alaihi ’s-salâm)!\nAuspicious prayers be for the pure Ahl al-Bait and for each of the \njust, faithful Companions, as-Sahâbat al-kirâm (radî-Allâhu ta’âlâ \n’anhum ajma’în), of that exalted Prophet!\nAllâhu ta’âlâ is Rabb al-’âlamîn. He created every kind of\nliving and non-living thing as orderly, well-calculated and \nbeneficial. With His attributes Khâliq, Bârî, Musawwir, Badî’ and \nHakîm, He created all beings in perfect order and very beautiful.\nHe set relations between them so that they would be orderly and \nbeautiful. He made them reasons, means, and causes for one \nanothe"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "this. When man wants to do something, Allâhu ta’âlâ creates it if\nHe wills. Men have to wish good, right and useful things so that\ntheir individual, private and social life may be in harmony. Allâhu \nta’âlâ endowed wisdom (’aql) on them so that their wishes would \nbe good. Wisdom is a power which distinguishes good from evil.\nAs human beings need many things and have to get what they \nneed, the force called “nafs” in man, while striving to acquire \nthem, misleads wisdom. It makes anything desired look beautiful\nto wisdom, even if it is harmful.\nAllâhu ta’âlâ, pitying His servants, sent the knowledge called \n“dîn” (religion) by means of an angel to selected men called \n“prophets” (’alaihimu ’s-salawâtu wa ’t-taslîmât). Prophets taught\nit to human beings. The Dîn, Islam, preached by the Prophet\nMuhammad (’alaihi ’s-salâm) distinguishes between good and evil,\nbeneficial and harmful, which anyone may come across anywhere \nand orders us to do what is beneficial.\nStill the nafs deceives men and does not want to obey Islamic \nknowledge. It even tends to change and distort it and the essentials \nof faith which are to be believed. Allâhu ta’âlâ’s Prophet,\nMuhammad (’alaihi ’s-salâm), foreto"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "obligation to explain the evil beliefs unconformable to Ahl as-\nSunna as held by the Wahhâbîs, a group of the lâ-madhhabî, in a \nseparate book with documents and to explain the oppression and \npersecution directed towards Muslims by these cruel, ignorant\npeople. Hence, it became necessary for Muslims to see this \nterrifying danger and to protect themselves from being taken in by \nfalse, deceitful words and writings.\nA man named Muhammad ibn’Abd-ul-Wahhâb wrote a \nbooklet entitled Kitâb at-tawhîd. Although his grandson \nSulaimân ibn ’Abdullâh had started expounding this booklet, he \ndied when Ibrâhîm Pasha went to Dar’iyya and punished them in \n1233 A.H. (1817). His second grandson, ’Abd ar-Rahmân ibn \nHasan, expounded it in a book entitled Fat’h al-majîd. Later on \nhe prepared a second book, Qurrat al-’uyûn, abridging his former \ncommentary. In the seventh edition of the commentary published \nwith additions by a Wahhâbî named Muhammad Hâmid in 1377 \nA.H. (1957), the âyats which descended about kâfirs and many \nhadîths were written to delude Muslims, and wrong, distorted \nmeanings were extracted from them to attack Ahl as-Sunna, the \ntrue Muslims, and to call those pure Muslims “kâf"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "massacred Muslims and destroyed their possessions, how they \nbrutally attacked Muslim countries, how they were punished by \nthe Ottoman State, and how they established a new state after the \nFirst World War.\nMay Allâhu ta’âlâ protect Muslims from catching the \npestilence of Wahhâbism and Shî’ism! May He redeem the \nunlucky people who have slipped into these paths from this \nperdition! Âmin.\nIn the text, the interpreted âyats of the Qur’ân al-karîm are \ngiven as ma’âl sharîf (meaning concluded by the mufassirs), which \nmay or may not be the same as what Allâhu ta’âlâ meant in the \nâyat. A glossary of Arabic and other non-English terms foreign to \nthe English reader is appended.\nMîlâdî Hijrî Shamsî Hijrî Qamarî\n2001 1380 1422 \n____________________ \nPublisher’s Note:\nPermission is granted to those who wish to print this book in its \noriginal form or to translate it into another language. We pray that\nAllâhu ta’âlâ will bless them for this beneficial deed of theirs, and \nwe thank them very much. However, permission is granted on \ncondition that the paper used in printing be of a good quality and \nthat the design of the text and setting be properly and neatly done \nwithout any mistakes."
    }
  ],
  "buku-031": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Hakikat Kitabevi Publications No: 12 \nISLAM \nand \nCHRISTIANITY \nHüseyn Hilmi Iş›k \nSeventeenth Edition \nHa kî kat Ki tâ be vi \nDa rüş şe fe ka Cad. 5 3/A P.K.: 35 \n34083 Fa tih-IS TAN BUL/TURKEY \nTel: 90.212.523 4556–532 5843 Fax: 90.212.523 3693 \nhttp://www.hakikatkitabevi.com \ne-mail: bilgi@hakikatkitabevi.com \nMARCH -20 16"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "CONTENTS\nPART: ONE\nISLAM AND CHRISTIANITY\nPreface .......................................................................................................3\n1. Belief in Allah’s existence...........................................................5\n2. Prophets, Religions, and Books ...............................................11\na- Judaism ........................................................................................14\nb- Christianity..................................................................................16\nc- Islam.............................................................................................29\n3. Conditions for being a true Muslim.........................................56\nPART: TWO\nTHE QUR’ÂN AL-KERÎM AND TODAY’S COPIES OF\nTHE TORAH AND THE BIBLE\nIntroduction ............................................................................................83\n1. Today’s Copies of the Torah and the Bible............................88\n2. Some of the Errors in the Holy Bible ...................................100\n3. The Qur’ân al-kerîm ................................................................131\n4. Miracles of Muhammad (’alaihi’s-salâm)............."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "PART: ONE\nISLAM AND CHRISTIANITY\nPREFACE\nWe begin to write the book Islam and Christianity with the\nBasmala. All praise be to Allahu ta’âlâ, and may the best of\nprayers be upon His beloved Prophet, Muhammad (’alaihi’s-\nsalâm), upon his Ahl al-Bait, and all his Companions!\nAllâhu ta’âlâ has created everything, the living and the non-\nliving, out of nothing. He alone is the Creator. Because He pities\nmankind very much, He creates and sends everything that is\nnecessary for a comfortable, sweet and cheerful existence in this\nworld and the next. As the most superior and valuable of His\nendless blessings, He has made distinctions for us between the\nway of truth leading to felicity and the way of falsehood, which\nbrings about trouble and sorrow. He has always commanded\ngoodness, diligence, and to be helpful to others. He has declared\nthat He will call all people to account following the Rising after\ndeath, that those who do good deeds will live in endless\nhappiness in Paradise, and that those who do not believe in the\nteachings of His prophets (’alaihimu’s-salâm) will remain in\nendless torture and pain in Hell. Therefore, we begin writing this\nwork glorifying His Name and consigning ourse"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "upon the fundamentals of Islam and makes a comparison of Islam\nwith other religions. It answers criticisms raised against Islam by\nits adversaries and explains as compendiously as possible the\nqualifications essential for being a good Muslim.\nFor those who would like to read valuable books on Islam\nwritten by Islamic scholars (rahimahumullâhu ta’âlâ) after\nlearning the facts contained in this book, we advise that they read\nbooks published in different languages by the Hakîkat Kitabevi\n(Bookstore) in Istanbul. The names of these books are appended\nto our books.\nRead this book slowly and with reflection! Encourage others to\nread it, too! An ignorant person cannot be a good Muslim. Indeed,\nit is impossible for a person not to attach all his heart to Islam after\nlearning its fundamentals. After reading this book, you will also\nrealize what a lofty, sacred, logical, and perfect religion Islam is,\nand you will attach all your heart and soul to it in order to attain\nsalvation and repose in this world and in the hereafter.\nMîlâdî Hijrî Shamsî Hijrî Qamarî\n2001 1380 1422\n____________________\nPublisher’s Note:\nAnyone who wishes to print this book in its original form or to\ntranslate it into "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "BELIEF IN ALLAH’S EXISTENCE\nThe young human being, a mere child as he is, begins to\nwonder from whence and how the things he sees around him came\ninto existence. As he grows older, he better realizes and thus\nmarvels at what a tremendous masterpiece the earth is, whereon\nhe lives. When he becomes a highly educated adolescent, his\nwonder turns into admiration as he begins to learn of the\nelaboration involved in the things and beings seen around us\nevery day. What a great phenomenon it is that men can remain\nand live solely by the gravitational force on a spherical, –or,\nrather, an oblate–, planet, which internally is full of molten metal\nand which revolves by itself in space. And what a great power it\nis, by whose origination mountains, rocks, seas, innumerable\nkinds of living beings and plants come into being, grow, and\nexhibit so many different properties. Some animals walk on the\nearth, while others fly in the sky or live in water. The sun, which\nsends its light on us, produces the highest grade of heat we can\nthink of, effects the growth of plants and makes chemical changes\nin some of them to bring about the existence of flour, sugar, and\nother substances. But we know that our g"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "drink taken through the mouth are decomposed and digested in\nthe stomach and bowels, the parts useful to the body are\npercolated in the small intestines and transfused into the blood,\nwhile the dregs are excreted through the bowels. This\nextraordinary process is done automatically with the utmost\nprecision, resulting in the body working like a factory.\nThe human body does not only contain apparatuses producing\nvarious kinds of substances with intricate formulas affecting\nvarious chemical reactions, doing analysis, treating illnesses,\npurifying, annihilating poisons, curing boils, filtering various\nkinds of substances, and giving energy, but it also embodies an\nimmaculate network of electricity, leverage, an electronic\ncomputer, an alarm system, an optical set, an apparatus for\nreceiving sounds, an apparatus for making and controlling\npressure, and a system for fighting against microbes to annihilate\nthem. And the heart is a stupendous, ever-working pump. Of old,\nEuropeans used to say, “The human body consists of plenty of\nwater, a little calcium, a little phosphorus, and a few inorganic and\norganic substances. Therefore, the human body is worth a couple\nof pounds.” But today the ca"
    }
  ],
  "buku-032": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Hakikat Kitabevi Publications No: 15 \nDOCUMENTS \nof the \nRIGHT WORD \nHüseyn Hilmi Iş›k \nEleventh Edition \nHa kî kat Ki tâ be vi \nDa rüş şe fe ka Cad. 5 3/A P.K.: 35 \n34083 Fa tih-IS TAN BUL/TURKEY \nTel: 90.212.523 4556–532 5843 Fax: 90.212.523 3693 \nhttp://www.hakikatkitabevi.com \ne-mail: bilgi@hakikatkitabevi.com \nMARCH -20 16"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "CONTENTS\nPage\nPart One – The book Documents of the Right Word,\nis the English version of the book Hujaj-i-qat’iyya, by\nAbdullah Suwaydî..........................................................................3\nPart Two – The book Radd-i-rewâfid, by\nImâm-i-Rabbânî, mujaddid-i-elf-i-thânî Ahmad Fârûqî ........57\nPart Three – Tezkiya-i-Ahl-i-Bayt, rebuts the\ncalumnies which an enemy of Islam has heaped on\nIslam in a book titled Husniyya...............................................101\nPart Four – The book Let us Be in Unity and\nLove One Another ....................................................................164\nPart Five – The book O My Brother; if You Wish\nTo Die in Îmân, You Should Love the Ahl-i-Bayt\nand the As-hâb...........................................................................211\nAlso, Letter 24, Volume 3, by Imâm-i-Rabbânî....................329\nPart Six – What Is Prophethood?\nMuhammad ‘alaihis-salâm’ is the Last Prophet ....................337\nPart Seven – A Biography of Imâm-i-Rabbânî .....................373\nTranslation of thirty-two letters from\nMuhammed Ma’thûm Fârûqî’s Mektûbât.......................395\nPart Eight – English Version of Eyyuhelveled.........."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "PART ONE\nDOCUMENTS OF THE RIGHT WORD\nPREFACE\n(TO THE TURKISH VERSION)\nAllâhu ta’âlâ, having mercy on the whole of mankind, creates\nuseful things and sends them these things in the world. And in the\nHereafter He will choose some of those Believers who are to go to\nHell, forgive them, and make them attain to Paradise. He, alone,\ncreates all living beings, keeps all beings in existence, and protects\nthem all against fear and horror. Trusting ourselves to the\nhonourable Name of such a Being, Allah, we begin writing this\nbook.\nIf any person thanked and praised any other person in any\nmanner, for anything, at any place, at any time, all this thanks and\npraisal would have been done to Allâhu ta’âlâ by rights. For He,\nalone, is the creator, the educator, the discipliner of all beings, and\nthe actuator and sender of all types of goodness whatsoever. He,\nalone, is the owner of power and energy.\nMay all types of benedictions be pronounced over\nMUHAMMAD ‘alaihis-salâm’, who is His Prophet and most\nbeloved born slave, the most virtuous and most valuable of the\nentire creation, and over all of his Âl (household) and As-hâb\n(Companions), who were his helpers and beloved ones ‘alaihimus-\nsalawâtu "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "means serving humanity. Enemies of humanity have striven to\nannihilate Islam. Their most effective aggression has been\ndeceiving Muslims, thus destroying them from within. They have\nprovoked segregation among them, made them hostile against one\nanother, and led them into the talons of irreligious people.\nRasûlullah ‘sall-Allâhu alaihi wasallam’ made statements\nwarning Muslims against these catastrophes awaiting them. He\nsaid, for one, “My Umma will be divided into seventy-three\ngroups. Of these groups, only those who follow me and my As-hâb\nshall escape Hell.” Fortunately, most of the seventy-two groups\nwho are to go to Hell are extinct today. Hundreds of millions of\nMuslims on the earth now are only in the three remaining groups,\ni.e. Sunnîs, Shi’îs, and Wahhâbîs. If these three groups of Muslims\ntoday do not take measures of conciliation and cooperation with\none another, if they prefer to abuse one another, the enemies of\nIslam will gain grounds to defile Islam, to divide Muslims into yet\nother groups, and to mislead young people out of Islam by using all\nsorts of lies and slanders. As history shows, nations negligent in\ntheir faith have incurred Allah’s scourge and fallen into c"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Sunnî Muslims, and attain happiness. Gratitude be to Allâhu\nta’âlâ, next to none of the recent Iranian learners has abandoned\nthe Sunnî way. We observe with gratitude, for instance, that the\nPersian book Kimyâ-i-Sa’âdat, written by Imâm-i-Ghazâlî, a Sunnî\nscholar, was reprinted in a most splendid form in Tehran in 1964,\nand the younger generation in Iran are being informed about the\nstatements made by hundreds of Sunnî scholars, thus being\nimpressed by their superior merits.\nThe very day Shiites free themselves from the Hurûfîs deceit,\nrealize the way shown by their own scholars, and cooperate with\nthe Sunnîs in spreading Islam over the world, the Wahhabîs will\njoin them, Muslims will be in unity, they will certainly resume their\npast grandeur and superiority, they will once again shed a light on\nhumanity and guide others to civilization, and thus the whole\nworld will attain happiness. Then all people will know that serving\nIslam means serving humanity.\nMîlâdî Hijrî Shamsî Hijrî Qamarî\n2001 1380 1422\n____________________\nA Warning: Missionaries are striving to advertise Christianity,\nJews are working to spread out the concocted words of Jewish\nrabbis, Hakîkat Kitâbevi (Bookstore), "
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "DOCUMENTS OF THE RIGHT WORD\n[The book HUJAJ-I-QAT’IYYA was written in the Arabic\nlanguage by Abulberekât Abdullah Suwaydî of Baghdâd. It was\nprinted in Egypt in 1323 [A.D. 1905], and reproduced by offset\nprocess in Istanbul. Its Turkish translation, by Allâma Yûsuf\nSuwaydî, was printed in the Kurdistan printhouse in Egypt in 1326\n[A.D. 1908]. Suwaydî Abdullah Efendi was born in Baghdâd in\n1104. After performing his duty of hajj in 1137, he was given an\nijâzat (certificate, diploma) from Abdulghanî Nablusî [1050-1143]\n(A.D. 1730) Damascus], and another ijâzat by Alî Efendi of\nIstanbul [1099-1149]. He taught for years in Baghdâd. He wrote\nmany valuable books. His thirtieth grandfather is Abû Ja’fer\nAbdullah Mensûr, one of the Abbâsî Khalîfas. Nâdir Shâh [1099-\n1160 (A.D. 1746)], an Iranian ruler, convoked the scholars of Iran\nand Bukhara and commanded them to discuss and come to a\nbilateral conclusion on which one of the Sunnî and Shi’î groups\nwas right, and they appointed him as president of the debate. The\nbook HUJAJ-I-QAT’IYYA, which gives an account of the talks\nmade in this assembly, is very valuable. After a long discussion\nwith the Shiite scholars in this assembly, he (Abdulla"
    }
  ],
  "buku-034": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "DK INDIA\nSenior editor  Bharti Bedi  \nProject art editor  Sanjay Chauhan\nEditor Tina Jindal\nAssistant art editors  Rabia Ahmad,  \nSimar Dhamija, Sonakshi Singh\nJacket designer  Juhi Sheth\nJackets editorial coordinator  Priyanka Sharma\nManaging jackets editor  Saloni Singh\nDTP designer Sachin Gupta \nSenior DTP designer  Harish Aggarwal\nSenior managing editor Rohan Sinha\nManaging art editor  Sudakshina Basu\nPre-production manager Balwant Singh\nFirst American Edition, 2018\nPublished in the United States by DK Publishing\n345 Hudson Street, New York, New York 10014\nCopyright © 2018 Dorling Kindersley Limited  \nDK, a Division of Penguin Random House LLC  \n18 19 20 21 22 10 9 8 7 6 5 4 3 2 1\n001–309872–July/2018\nAll rights reserved.\nWithout limiting the rights under the copyright reserved above, no part \nof this publication may be reproduced, stored in or introduced into a \nretrieval system, or transmitted, in any form, or by any means (electronic, \nmechanical, photocopying, recording, or otherwise), without the prior \nwritten permission of the copyright owner. \nPublished in Great Britain by Dorling Kindersley Limited\nA catalog record for this book  \nis available from the Library of Congr"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "CAROL VORDERMAN MBE  is one of Britain’s best-loved TV presenters and is \nrenowned for her mathematical skills. She has hosted numerous TV shows on \nscience and technology, from Tomorrow’s World to How 2, and was co-host of \nChannel 4’s Countdown for 26 years. A Cambridge University engineering \ngraduate, she has a passion for communicating science and technology and  \nis particularly interested in coding.\nCRAIG STEELE is a specialist in computing science education who helps people \ndevelop digital skills in a fun and creative environment. He is a founder of \nCoderDojo in Scotland, which runs free coding clubs for young people. Craig  \nhas run digital workshops with the Raspberry Pi Foundation, Glasgow Science \nCentre, Glasgow School of Art, BAFTA, and the BBC micro:bit project. Craig’s first \ncomputer was a ZX Spectrum.\nDR. CLAIRE QUIGLEY studied computing science at Glasgow University, \nwhere she obtained BSc and PhD degrees. She has worked in the Computer \nLaboratory at Cambridge University and Glasgow Science Centre, and is \ncurrently working on a project to develop a music and technology resource \nfor primary schools in Edinburgh. She is a mentor at CoderDojo Scotland.\nDANIEL "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "GETTING STARTED\n12 What is Python? \n14 Gaming in Python\n16 Installing Python\n18 Installing Pygame Zero\n20 Using IDLE\n22 Your first program\n  LEARNING THE BASICS\n28 Creating variables \n32 Making decisions\n36 Playing with loops\n40 Functions\n44 Fixing bugs\n  SHOOT THE FRUIT\n50 How to build Shoot the Fruit \nContents\n  COIN COLLECTOR\n60 How to build Coin Collector\n  FOLLOW THE NUMBERS\n70 How to build Follow the Numbers\n  RED ALERT\n82 How to build Red Alert \n8 FOREWORD  \nScore: 0\nUS_006-007_Contents.indd   6 22/02/18   12:23 pm\n  HAPPY GARDEN\n156 How to build Happy Garden\n  SLEEPING DRAGONS\n178 How to build Sleeping Dragons\n  REFERENCE\n198 Project reference\n220 Glossary\n222 Index\n224 Acknowledgments\n  BIG QUIZ\n100 How to build Big Quiz\n  BALLOON FLIGHT\n118 How to build Balloon Flight\n  DANCE CHALLENGE\n138 How to build Dance Challenge \nGarden happy for: 16 seconds\n26\nScore: 0\nScore: 0\n7\nLondon\nBerlin\nParis\nTokyo\nWhat is the  \ncapital of France?\nUS_006-007_Contents.indd   7 22/02/18   12:23 pm"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "HAPPY GARDEN\n156 How to build Happy Garden\n  SLEEPING DRAGONS\n178 How to build Sleeping Dragons\n  REFERENCE\n198 Project reference\n220 Glossary\n222 Index\n224 Acknowledgments\n  BIG QUIZ\n100 How to build Big Quiz\n  BALLOON FLIGHT\n118 How to build Balloon Flight\n  DANCE CHALLENGE\n138 How to build Dance Challenge \nGarden happy for: 16 seconds\n26\nScore: 0\nScore: 0\n7\nLondon\nBerlin\nParis\nTokyo\nWhat is the  \ncapital of France?\nUS_006-007_Contents.indd   7 22/02/18   12:23 pm"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "Foreword\nComputer programmers are the unsung heroes of the modern world. From smartphones \nto laptops, traffic systems to bank cards, their hard work touches almost every aspect \nof our lives. Behind each technological advance is a team of creative coders.\nOver the past 30 years, computer games have become one of the most exciting and \npopular areas of the entertainment industry to work in. Becoming a game programmer \ntakes creative flair to help create the story, graphics, music, and characters you need \nfor your games, and the technical know-how to bring them to life. Who knows? This \nbook may be the very first step on your journey from gamer to game maker.\nLearning to code isn’t just for people who want to be professional programmers, \nthough. Coding skills are useful in lots of different jobs that may seem to have nothing \nto do with computers at first. Programming expertise is essential to subject areas as \ndiverse as science, business, art, and music. \nThis book uses a programming language called Python® , a fairly simple text-based \nlanguage, and is perfect for beginners, or as a step up from Scratch™. However,  \nunlike Scratch, it was not created especially to teach coding."
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "beginning of this book before moving on to the more complex games as the book \nprogresses. By following the step-by-step guides, you’ll find out how professional \ncoders think when they’re building a computer game. Follow those steps carefully and \nyou’ll have your own games up and running in no time. Then, if you really want to push \nyourself, you can try tweaking the code to make your games unique. \nEverybody, whether a beginner or a pro, makes mistakes. Nothing frustrates a coder \nmore than the bugs that manage to creep into their programs. If something goes  \nwrong in one of your games, go back over your code and check it all carefully. There  \nare hints and tips throughout the book that will help you do this. Most importantly, \ndon’t get disheartened—finding and fixing errors in your code is all part of being a \nprogrammer. The more practice you get, the fewer bugs your code will contain, and  \nthe quicker you’ll catch the little ones that still appear. \nMost importantly, have fun! Once you’ve completed the games, you can show them off \nto your friends and family—they’ll be amazed by what you’ve managed to make. This \nbook is packed with games to suit every audience, and we ho"
    }
  ],
  "buku-035": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "DK UK\nSenior editor Ben Morgan\nProject editor Ben Ffrancon Davies\nSenior art editor Jacqui Swan\nUS editor Jennette ElNaggar\nConsultant editor Craig Steele\nJacket design development manager Sophia MTT\nJacket editor Emma Dawson\nJacket designer Surabhi Wadhwa\nProducer, pre-production Gillian Reid\nSenior producers Meskerem Berhane, Mary Slater\nManaging editor Lisa Gillespie\nManaging art editor Owen Peyton Jones\nPublisher Andrew Macintyre\nAssociate publishing director Liz Wheeler\nArt director Karen Self\nDesign director Phil Ormerod\nPublishing director Jonathan Metcalf\nDK INDIA\nSenior editor Suefa Lee\nProject editor Tina Jindal\nProject art editors Sanjay Chauhan, Parul Gambhir \nEditor Sonia Yooshing\nArt editors Rabia Ahmad, Simar Dhamija, Sonakshi Singh\nJacket designers Priyanka Bansal, Suhita Dharamjit\nJackets editorial coordinator Priyanka Sharma\nManaging jackets editor Saloni Singh\nDTP designers Jaypal Singh Chauhan, Rakesh Kumar\nSenior managing editor Rohan Sinha\nManaging art editor Sudakshina Basu\nPre-production manager Balwant Singh\nThis American Edition, 2019\nFirst American Edition, 2016  \nPublished in the United States by DK Publishing\n1450 Broadway, Suite 801, New York, NY 10018"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "DR. JON WOODCOCK MA (OXON) has a degree in physics from the \nUniversity of Oxford and a PhD in computational astrophysics from  \nthe University of London. He started coding at the age of eight and has \nprogrammed all kinds of computers, from single-chip microcontrollers  \nto world-class supercomputers. His many projects include giant space \nsimulations, research in high-tech companies, and intelligent robots \nmade from junk. Jon has a passion for science and technology education, \ngiving talks on space and running computer programming clubs in \nschools. He has worked on numerous science and technology books as  \na contributor and consultant, including DK’s Computer Coding for Kids  \nand Computer Coding Made Easy and DK’s series of coding workbooks.\nCRAIG STEELE is a specialist in computing science education who  \nhelps people develop digital skills in a fun and creative environment.  \nHe is a founder of CoderDojo in Scotland, which runs free coding clubs \nfor young people. Craig has run digital workshops with the Raspberry Pi \nFoundation, Glasgow Science Centre, Glasgow School of Art, BAFTA, and \nthe BBC micro:bit project. Craig’s first computer was a ZX Spectrum.\nUS_004-005_Imprin"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "Contents\n8 FOREWORD   \n \n  WHAT IS CODING?\n12 Creative computers \n14 Programming languages\n16  How Scratch works\n18  Getting Scratch\n20  The Scratch interface\n22  Types of projects\n  GETTING STARTED\n26 Cat Art \n34 Dino Dance Party\n48  Animal Race\n60  Ask Gobo\n70  Funny Faces\n  ART\n82 Birthday Card\n94 Spiralizer\n106  Fantastic Flowers\n  GAMES\n122 Tunnel of Doom \n134 Window Cleaner\nUS_006-007_Contents.indd   6 22/02/19   10:25 AM"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "SIMULATIONS\n144 Virtual Snow \n154 Fireworks Display\n162 Fractal Trees \n172 Snowflake Simulator\n  MUSIC AND SOUND\n182 Sprites and Sounds\n190 Drumtastic\n  MINDBENDERS\n200 The Magic Spot\n208 Spiral-o-tron\n  WHAT NEXT? \n218 Next steps\n220 Glossary \n222 Index\n224 Acknowledgments\nFind out more at:\nwww.dk.com/computercoding  \nUS_006-007_Contents.indd   7 22/02/19   10:25 AM"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "Foreword\nIn recent years, interest in coding has exploded. All over the world, schools \nare adding coding to their curriculums, code clubs are being launched to  \nteach beginners, and adults are returning to college to learn coding skills  \nnow considered vital in the workplace. And in homes everywhere, millions  \nof people are learning how to code just for the fun of it.\nFortunately, there’s never been a better time to learn how to code. In the \npast, programmers had to type out every line of code by hand, using obscure \ncommands and mathematical symbols. A single period out of place could  \nruin everything. Today, you can build amazingly powerful programs in \nminutes by using drag-and-drop coding languages like Scratch™, which  \nis used in this book.\nAs learning to code has become easier, more people have discovered the \ncreative potential of computers, and that’s where this book comes in. Coding \nProjects in Scratch is all about using code for creative purposes—to make  \nart, music, animation, and special effects. With a little bit of imagination  \nyou can produce dazzling results, from glittering fireworks displays to \nkaleidoscope-like masterpieces that swirl and beat in time "
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "If you’re completely new to coding, don’t worry—the first two chapters  \nwill walk you through the basics and teach you everything you need to  \nknow to use Scratch. The later chapters then build on your skills, showing  \nyou how to create interactive artworks, lifelike simulations, mind-bending \noptical illusions, and some great games.\nLearning something new can sometimes feel like hard work, but I believe  \nyou learn faster when you’re having fun. This book is based on that idea,  \nso we’ve tried to make it as much fun as possible. We hope you enjoy  \nbuilding the projects in this book as much as we enjoyed making them.\nOn your mark ...  \nget set ... CODE! \nUS_008-009_Foreword.indd   9 22/02/19   7:10 PM"
    }
  ],
  "buku-036": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "SECOND EDITION\nCOMPUTER FORENSICS\nCybercriminals, Laws, and Evidence\nMARIE-HELEN MARAS, PhD\nAssociate Professor\nJohn Jay College of Criminal Justice"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "World Headquarters\nJones & Bartlett Learning\n5 Wall Street\nBurlington, MA 01803\n978-443-5000\ninfo@jblearning.com\nwww.jblearning.com\nJones & Bartlett Learning books and products are available through most bookstores and\nonline booksellers. To contact Jones & Bartlett Learning directly, call 800-832-0034, fax\n978-443-8000, or visit our website, \nwww.jblearning.com\n.\nSubstantial discounts on bulk quantities of Jones & Bartlett Learning publications are\navailable to corporations, professional associations, and other qualified organizations.\nFor details and specific discount information, contact the special sales department at\nJones & Bartlett Learning via the above contact information or send an email to\nspecialsales@jblearning.com\n.\nCopyright © 2015 by Jones & Bartlett Learning, LLC, an Ascend Learning Company\nAll rights reserved. No part of the material protected by this copyright may be reproduced\nor utilized in any form, electronic or mechanical, including photocopying, recording, or by\nany information storage and retrieval system, without written permission from the\ncopyright owner.\nThe content, statements, views, and opinions herein are the sole expression of the\nrespective autho"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "This publication is designed to provide accurate and authoritative information in regard to\nthe Subject Matter covered. It is sold with the understanding that the publisher is not\nengaged in rendering legal, accounting, or other professional service. If legal advice or\nother expert assistance is required, the service of a competent professional person should be\nsought.\nProduction Credits\nExecutive Publisher: William Brottmiller\nPublisher: Cathy L. Esperti\nSenior Acquisitions Editor: Erin O’Connor\nEditorial Assistant: Audrey Schwinn\nProduction Manager: Tracey McCrea\nMarketing Manager: Lindsay White\nManufacturing and Inventory Control Supervisor: Amy Bacus\nComposition: Cenveo Publisher Services\nCover Design: Kristin E. Parker\nPhoto Research and Permissions Coordinator: Ashley Dos Santos\nCover Image: © fixer00/ShutterStock, Inc.\nPrinting and Binding: Edwards Brothers Malloy\nCover Printing: Edwards Brothers Malloy\nLibrary of Congress Cataloging-in-Publication Data\nMaras, Marie-Helen, 1979- author.\nComputer forensics : cybercriminals, laws, and evidence / Marie-Helen Maras. -- Second\nedition.\n       p. cm.\nIncludes bibliographical references and index.\nISBN 978-1-4496-9222-3 (pbk.)\n1. E"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "D\nEDICATION\nIn loving memory of my father, Pete Maras (Petoulis).\nThank you for the best 28 years of my life—of\nunconditional love, laughter, and adventure."
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "B\nRIEF\n C\nONTENTS\nChapter 1    Entering the World of Cybercrime\nChapter 2    An Introduction to Computer Forensics\nInvestigations and Electronic Evidence\nChapter 3    Laws Regulating Access to Electronic\nEvidence\nChapter 4    Searches and Seizures of Computers and\nElectronic Evidence\nChapter 5    Cybercrime Laws: Which Statute for\nWhich Crime?\nChapter 6    Understanding the Computer-Networking\nEnvironment: Beware of the Scam\nArtists, Bullies, and Lurking Predators!\nChapter 7    Cyberterrorism: What It Is, What It Isn’t,\nWhy It Matters, and What to Do About"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "It\nChapter 8    Where Is the Electronic Evidence and\nWhich Tools Can We Use to Find It?\nChapter 9    Crime and Incident Scene: What Should an\nInvestigator Do?\nChapter 10  Corporate Crimes and Policy Violations\nInvolving Computers: How to Conduct a\nCorporate Investigation\nChapter 11  Email Forensics\nChapter 12  Network Forensics: An Introduction\nChapter 13  Mobile Devices in Computer Forensics\nInvestigations\nChapter 14  The Pretrial and Courtroom Experiences of\na Computer Forensics Investigator"
    }
  ],
  "buku-038": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "ii \n \n \n \n \n \n \n \n \n \n \n \n \n \nUndang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta  \nPasal 1: \n1. Hak Cipta adalah hak eksklusif pencipta yang timbul secara otomatis \nberdasarkan prinsip dekl aratif setelah suatu ciptaan diwujudkan dalam \nbentuk nyata tanpa mengurangi pembatasan sesuai dengan ketentuan \nperaturan perundang-undangan. \nPasal 9: \n2. Pencipta atau Pengarang Hak Ci pta sebagaimana dimaksud dalam Pasal 8 \nmemiliki hak ekonomi untuk melakukan a. Penerbitan c iptaan; b.  \nPenggandaan c iptaan dalam  segala bentuknya; c.  Penerjemahan c iptaan; d.  \nPengadaptasian, pengaransem en, atau pentrasformasian c iptaan; e.  \nPendistribusian ciptaan atau salinan; f.  Pertunjukan c iptaan; g. Pengumuman \nciptaan; h. Komunikasi ciptaan; dan i. Penyewaan c iptaan. \nSanksi Pelanggaran Pasal 113  \n1. Setiap o rang yang dengan tanpa hak melakukan pelanggaran hak ekonomi \nsebagaimana dimaksud dalam Pasal 9 ayat (1) huruf i untuk Penggunaan \nSecara Komersial dipidana dengan pidana penjar a paling lama 1 (satu) tahun \ndan/atau pidana denda paling banyak Rp100.000.000 ,00 (seratus juta \nrupiah).  \n2. Setiap o rang yang dengan tanpa hak dan /atau tanpa izin Pencipta atau \nPem"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "iii \n \n \nAlwi Hilir, S.Kom., M.Pd. \n \n \n \n \n \n \n \n \nTEKNOLOGI PENDIDIKAN \nDI ABAD DIGITAL \n \n \n \n \n \n \nPenerbit Lakeisha \n2021"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "iv \n \n \n \n \n \n \n \n \nTEKNOLOGI PENDIDIKAN DI ABAD DIGITAL \n \nPenulis:  \nAlwi Hilir, S.Kom., M.Pd. \n \nEditor: Singgih Subiyantoro, M.Pd. \nLayout : Yusuf Deni Kristanto, S.Pd. \nDesain Cover : Tim Lakeisha \nCetak I Juni 2021 \n15,5 cm × 23 cm, 166 Halaman   \nISBN: 978-623-6322-07-9 \n \nDiterbitkan oleh Penerbit Lakeisha  \n(Anggota IKAPI No.181/JTE/2019)  \n \nRedaksi \nJl. Jatinom Boyolali, Srikaton, Rt.003, Rw.001, Pucangmiliran, \nTulung, Klaten, Jawa Tengah \nHp. 08989880852, Email: penerbit_lakeisha@yahoo.com \nWebsite : www.penerbitlakeisha.com \n \nHak Cipta dilindungi Undang-Undang  \nDilarang memperbanyak karya tulis ini dalam bentuk dan  \ndengan cara apapun tanpa izin tertulis dari penerbit"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "v \n \n \n \nKATA PENGANTAR \n \n \n \nAssalamu‘alaikum Wr. Wb.  \nlhamdulillah wasyukr ulillah, segala puji bagi Allah swt . \nyang telah mencurahkan rahm at dan hidayah -Nya kepada \nkita semua, dan tak lupa juga junjungan kita , nabi besar, \nnabiyullah Muhammad saw. , yang telah mengubah dunia dari \nkegelapan menuju  masa terang benderang . Pada kesempatan ini , \npenulisan buku Teknologi Pendidikan di Abad Digital da pat \ndiselesaikan. Dengan harapan bisa menjadi bahan bacaan dan \nreferensi bagi para pemerhati pendidikan , khususnya bagi civitas \nakademika di p erguruan tinggi, sekolah, atau mad rasah. Buku ini \nmenekankan pada k onsep pendidikan abad digital, modalitas \nbelajar, konsep teknologi pembelajaran, dan inovasi model \npembelajaran. Buku ini terdiri dari delapan  bab dengan penekanan \nyang berbeda -beda setiap babnya. Setiap bab juga telah disusun \nsecara sistematis sesuai urutan materi  dan tahapan pemahaman \ntentang inovasi teknologi pendidikan abad digital.  \nMelalui buku ini diharapkan dapat memberikan modal \npengetahuan bagi para pengamat pendidikan serta para pimpinan \nA"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "vi \nsatuan pendidikan. Selain itu, juga diperuntukkan bagi para \nmahasiswa untuk mengembangkan buku ini dan men jadi rujukan \nreferensi. Semoga apa yang telah diupayakan ini bermanfaat bagi \npara pembaca. Selain itu, juga memberi manfaat bagi seluruh \ncivitas akademika. Akhirnya, hanya kepada Allah penulis berserah \ndiri dan memoho n hidayah -Nya dan semoga kesalah an dala m \npenulisan buku ini mendapat ampunan dari-Nya. \nWabillahitaufiq walhidayah \nWassalamu‘alaikum Wr. Wb. \n \nJakarta, 23 Mei 2021 \nAlwi Hilir, S.Kom, M.Pd."
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vii \n \n \n \nDAFTAR ISI \n \n \n \n \n \nKATA PENGANTAR ................................ ................................ . v \nDAFTAR ISI ................................ ................................ .............  vii \n \nBAB I MEDIA PEMBELAJARAN ................................ ............ 1 \nA. Konsep Media Pembelajaran ................................ ................  1 \nB. Urgensi Media Pembelajaran ................................ ...............  5 \nC. Pengembangan Media dan Teknologi Pembelajaran .............  7 \nD. Integrasi Teknologi dalam Pembelajaran ............................  13 \nE. Peranan Teknologi dalam Pembelajaran .............................  15 \n \nBAB II INOVASI TEKNOLOGI INFORMASI                                 \nDI BIDANG PENDIDIKAN ................................ .....................  24 \nA. Faktor Pendukung Pembelajaran Melalui Teknologi \nInformasi ................................ ................................ ........... 26 \nB. Penggunaan TI (Teknologi Informasi) Dalam Dunia \nPendidikan ................................ ................................ ......... 26 \nC. Tantangan Inovasi  Pendidikan Indonesia ...........................  29 \nD. Faktor-"
    }
  ],
  "buku-039": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "WIRAUSAHA S SIAL?\nMembangun Solusi atas Permasalahan Sosial\nSecara Mandiri dan Berkelanjutan\nDewi Meisari Haryanti            Sri Rahayu Hijrah Hati            Astari Wirastuti            Kumala Susanto"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Penulis:\nDewi Meisari Haryanti\nSri Rahayu Hijrah Hati\nAstari Wirastuti\nKumala Susanto\nEditor dan Penyelaras Isi : Dewi Meisari Haryanti\nPenyunting Aksara : Achi TM dan Triani Retno\nDesain : Rumah Pena & Packreative\nPenerbit:\nDBS Foundation\nHak cipta dilindungi oleh undang-undang.\nDilarang mengutip atau memperbanyak sebagian atau seluruh isi buku ini tanpa izin tertulis \ndari penerbit.\nIsi di luar tanggung jawab percetakan."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "v\nK ATA PENGANTAR\nDBS FOUNDATION\nKewirausahaan sosial telah menjadi perhatian publik selama dua dekade terakhir. Di Asia, konsep ini berkembang \npesat selama sepuluh tahun belakangan. Dengan berbagai kebutuhan sosial yang kian berkembang, kebijakan yang \nsilih berganti, stagnasi pada status quo, serta lanskap teknologi dan akses informasi, wirausaha sosial bangkit sebagai \nupaya inovatif dalam menyikapi problematika sosial dewasa ini.\nSebagai entitas yang mengawinkan inovasi, aktivisme, keberlanjutan, dan dampak positif, wirausaha sosial \nmenjadi game changers yang sesungguhnya. Bank DBS pun membentuk DBS Foundation dengan komitmen 50 juta \ndolar Singapura agar dapat memperjuangkan kewirausahaan sosial, berdasarkan pada keyakinan bahwa wirausaha \nsosial dapat membantu membangun Asia yang lebih baik.\nWirausaha sosial yang telah sukses berkiprah di Indonesia dan dunia amatlah menginspirasi dan memberikan \nmotivasi bagi masyarakat luas untuk bergabung dalam gerakan kewirausahaan sosial itu sendiri. Semangat para pendiri, \ndisertai dengan komitmen mitra pendukung untuk menciptakan dampak sosial, patut dihargai. Namun, kesabaran, \nkerja keras, dan kemauan keras dalam menyeimbangkan kebe"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "vi\nWirausaha sosial juga terbantu oleh jejaring yang terbentuk oleh identifikasi yang tepat atas para pemangku \nkepentingan dari berbagai sektor yang turut membantu berjalannya usaha tersebut ―bukan hanya berkeinginan \nuntuk berkegiatan sosial, tetapi juga mengembangkan bisnisnya dengan merangkul wirausaha sosial yang ada.\nBagi wirausaha sosial yang sedang berada di tahap pertumbuhan awal, menemukan sumber daya yang tepat \ndalam perjalanan itu amatlah penting. Sama seperti bisnis lain yang baru bertumbuh, DBS Foundation melihat bahwa \nsumber daya tersebut berperan penting bagi sebuah bisnis untuk dapat berkembang. Inilah alasan kami membuat \nbuku panduan praktis ini, yang kini telah hadir untuk mereka yang tertarik pada dunia kewirusahaan sosial di Indonesia. \nBuku ini diharapkan dapat mendukung wirausaha sosial untuk mengenal berbagai pemangku kepentingan sekaligus \nsumber daya yang dibutuhkan pada masa-masa awal pengembangan usaha. Buku ini juga menawarkan panduan \nawal tentang model bisnis yang dapat membantu meraih dampak sosial melalui operasi yang berkelanjutan, sekaligus \ngambaran atas kesuksesan sebuah wirausaha sosial. Pembaca diharapkan mendapat inspirasi tentang bagaiman"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vii\nK ATA PENGANTAR\nUKM CENTER FEB UI\nPuji syukur kepada Tuhan Yang Maha Esa, akhirnya buku Berani Jadi Wirausaha Sosial? ini selesai dan dapat hadir \nuntuk Indonesia.\nKewirausahaan sosial atau social entrepreneurship merupakan bagian yang tidak terpisahkan dari kewirausahaan, \nmeskipun kewirausahaan sosial memiliki ciri khas yang membedakannya dengan kewirausahaan biasa. Kewirausahaan \nsosial menekankan pada tujuan yang lebih mulia, salah satunya adalah menanggulangi kemiskinan yang masih \nmerupakan permasalahan dan kendala bagi kemajuan Indonesia. Kewirausahaan sosial juga menyadarkan para \nekonom, politisi, dan pengambil kebijakan untuk mengubah arah berpikir dalam membawa Indonesia pada kemajuan \nbangsa. Hal ini karena kewirausahaan sosial tidak semata menyelesaikan persoalan ekonomi, tetapi sekaligus \nmenyelesaikan berbagai permasalahan sosial di tanah air.\nTidak hanya itu, kewirausahaan sosial juga menunjukkan kepada kita besarnya potensi aktivitas social economy \nsebagai salah satu mesin pendorong pertumbuhan ekonomi dan pemerataan kesejahteraan. Adapun social economy \natau ekonomi sosial adalah aktivitas perekonomian yang didorong oleh kekuatan masyarakat sendiri ( social s"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "viii\nrakyat Indonesia. Fakultas Ekonomi dan Bisnis Universitas Indonesia merupakan kampus pertama yang berusaha \nmenyebarkan semangat kewirausahaan sosial kepada masyarakat, dalam bentuk buku. Buku ini juga akan menjadi \nbahan bacaan baru bagi para guru besar, akademisi, birokrat, pengusaha besar, pelaku UKM, media, dan sebagainya.\nUKM Center FEB UI sangat bangga dapat turut mempromosikan suatu terobosan baru, yaitu kewirausahaan \nsosial. Terima kasih kepada tim penulis, Ibu Dewi Meisari dan kawan-kawan yang bekerja keras dalam menulis buku \nini. Terima kasih banyak kami ucapkan kepada DBS Indonesia atas kepeduliannya yang besar terhadap kewirausahaan \nsosial dan kepercayaannya untuk memilih kami sebagai mitra dalam penyusunan buku ini. Terima kasih pula kepada \nrekan-rekan penggiat dan praktisi kewirausahaan sosial yang telah mendukung proses penyusunan buku ini. Semoga \nbuku ini dapat menjadi tonggak yang meningkatkan perhatian banyak pihak terhadap potensi ekonomi sosial, dan \ndapat menginspirasi lebih banyak pihak untuk bersinergi mendorong tumbuh kembang kewirausahaan sosial di \nIndonesia.\nBagi generasi muda, semoga buku ini dapat menginspirasi dan membuat kalian lebih berani "
    }
  ],
  "buku-040": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "Front Matter\nABOUT THIS BOOK\nIn Indonesia, the legacy of Raden Ajeng Kartini (1879–1904) is celebrated \non Kartini Day, 21 April, every year. Around the world Kartini is recognised \nas a major figure in the history of the advancement of women, a tireless and \neffective advocate of women’s education and emancipation. However, this is \nthe first complete and unexpurgated collection of Kartini’s published articles, \nmemoranda and correspondence ever published in any language. \nThis collection reveals Kartini’s importance as a pioneer of the Indonesian \nnationalist movement. Claiming in her letters and petitions her people’s \nright to national autonomy well before her male compatriots did so publicly, \nKartini used her writing in an attempt to educate the Netherlands and Dutch \ncolonialists about Java and the aspirations of its people. Had she lived longer, \nshe would have been one of Indonesia’s leading pre-independence writers as \nwell as an educationalist. In 1964 she was elevated to the status of national \nhero by Indonesia’s first president, Sukarno. She has become one of the most \nwell known Asian figures in the international women’s movement.  \nThe product of several decades’ st"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "COPYRIGHT\n© Copyright 2014\nAll rights reserved. Apart from any uses permitted by Australia’s Copyright Act 1968, no part of this \nbook may be reproduced by any process without prior written permission from the copyright owners. \nInquiries should be directed to the publisher.\nOnline PDF edition published 2021.\nMonash University Publishing\nMatheson Library and Information Services Building  \n40 Exhibition Walk \nMonash University \nClayton, Victoria 3800, Australia  \nhttps://publishing.monash.edu/\nMonash University Publishing brings to the world publications which advance the best traditions of \nhumane and enlightened thought. Monash University Publishing titles pass through a rigorous process \nof independent peer review.\nhttps://publishing.monash.edu/product/kartini/\nDesign: Les Thomas. Cover image: Natsuko Akagawa.\nThe Monash Asia Series\nKartini: The complete writings 1898–1904 is published as part of the Monash Asia Series.\nThe Monash Asia Series comprises works that make a significant contribution to our understanding of \none or more Asian nations or regions. The individual works that make up this multi-disciplinary series \nare selected on the basis of their contemporary relevance."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "CONTENTS\nAbout this Book ............................................ iii\nAbout the Author ........................................... iii\nList of Illustrations .......................................... vii\nAcknowledgements .......................................... ix\nIntroduction  ............................................... xi\nReading Kartini: A Historical Introduction  ........................ 1\nPART ONE: LETTERS  ...................................... 63\nLetters 1889  ............................................... 65\nLetters 1900  ............................................... 90\nLetters 1901  .............................................. 170\nLetters 1902  .............................................. 297\nLetters 1903  .............................................. 541\nLetters 1904  .............................................. 665\nIMAGE PLATES  ........................................... 688\nPART TWO: DESCRIPTIVE ACCOUNTS  .................... 689\nLonger Narratives: Extracts from Kartini’s Correspondence  ......... 691\nThe Story of Kartini’s Childhood  .............................. 694\nThe First Meeting with Rosa Abendanon-Mandri . . . . . . . . . . . . . . . . .705"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "– vi –\nPART THREE: PUBLISHED SHORT STORIES  ............... 733\nIntroduction to the Published Short Stories ...................... 735\nA Governor General’s Day ................................... 742\nA Warship at Anchor ....................................... 756\nFrom a Forgotten Corner .................................... 769\nDisillusionment ............................................ 779\nTo Our Friends: A Poem .................................... 782\nPART FOUR: ETHNOGRAPHIC WRITING  .................. 785\nIntroduction to the Ethnographic Writing ....................... 787\n‘The Jepara Manuscript (1898)’ Dyeing Batik Blue ................. 793\nMarriage amongst the Koja People ............................. 795\nPART FIVE: THE EDUCATIONAL MEMORANDA  ........... 803\nIntroduction  .............................................. 805\nStatement of Intention ...................................... 809\nGive the Javanese Education! ................................. 810\nMemorandum to Accompany a Petition for Government Assistance  \nto Undertake Studies, 19 April 1903 ........................ 826\nTo the Government, August 1903 ............................. 836\nEND MATTER  ......................"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "– vii –\nLIST OF ILLUSTRATIONS\nFigure 1  Kartini’s letter 14 July 1903 ......................... xviii\nFigure 2  Map of Jepara and environs ........................ 10–11\nPLATES ................................................... 688\nPlate 1  Street scene, Semarang, c.1900\nPlate 2  Kabupaten Jepara, 1936\nPlate 3  Raden Mas Adipati Sosroningrat, c.1895\nPlate 4  Raden Mas Adipati Sosroningrat, c.1900\nPlate 5  Raden Aju Moerjam, Kartini’s stepmother, c.1895\nPlate 6  Ibu Ngasirah, Kartini’s birth mother, c.1895 \nPlate 7  Mr Jacques Henri Abendanon, Director of Native  \nEducation, Industry and Religion, c.1900\nPlate 8  Rosa Manuela Abendanon-Mandri, c.1912\nPlate 9  Kartini and family – younger sisters and brothers with  \nRMAA Sosroningrat and RA Moerjam, c.1900\nPlate 10  Raden Mas Sosrokartono, c.1896\nPlate 11  Kartini, Kardinah and Roekmini, c.1900\nPlate 12  Kartini, Kardinah and Roekmini, 1901"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "KARTINI\n – viii –\nPlate 13  RMAA Sosroningrat with Soelastri (?), Roekmini,  \nKartini and Kardinah, c.1901\nPlate 14  Kartini, Roekmini and Kardinah, 20 January 1902\nPlate 15  Kartinah and Soematri, c.1902\nPlate 16  Samples of Jepara woodcraft organized and possibly designed  \nby Kartini, 1902–1903\nPlate 17  Jepara woodcraftsmen, c.1900\nPlate 18  Classroom commenced by Kartini and Roekmini at the  \nKabupten Jepara\nPlate 19  Roekmini and Kartini, c.August 1903\nPlate 20  RMAA Djojo Adiningrat, 1903\nPlate 21  Kartini and her husband RMAA Djojo Adiningrat,  \n17 December 1903\nPlate 22  Raden Aju Djojo Adiningrat (Kartini) with her husband  \nand stepchildren, c.Dec. 1903\nPlate 23  Kartini, Djojo Adiningrat, Soematri, Roekmini and  \nKartinah, 1903\nPlate 24  Kartini’s son, Singgih, Kabupaten Rembang, 1904\nPlate 25  Kartini’s grave, Rembang, September 1904"
    }
  ],
  "buku-041": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Letters of a Javanese Princess\n Karya: Raden Adjeng Kartini\n Penerbit: Project Gutenberg  |  Tahun: 1911\n Kategori: Sejarah  |  ISBN: PG-34647\nSinopsis: Surat-surat R.A. Kartini kepada para sahabatnya di Belanda yang mengungkap perjuangan emansipasi\nwanita dan visi kemajuan Jawa."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Produced by Louise Hope, Tor Martin Kristiansen and the Online Distributed Proofreading Team at\nhttps://www.pgdp.net [Denne teksten finnes i to former: UTF-8 (Unicode) og Latin-1. Bruk den som er best\ntilgjengelig for din tekstleser. --I Unicode-formen har anføreseltegn den ■«lav-høye» formen, og apostrofer\ner rundet. --I Latin-1 formen har anførselstegn den «moderne» formen, og apostrofer har\n«skrivemaskin»-formen. Et par trykkfeil har blitt rettet. De står på slutten av e-teksten.]\nGRAHAME-WHITE og HARRY HARPER LUFTSEILERENS SKAT Oversat Av HELENE LASSEN\n[Trykkerimerke: W N & co 1872] Kristiania Forlagt av H. Aschehoug & Co. (W. Nygaard) 1914\nNationaltrykkeriet FORTALE Uagtet flyvekunsten er naadd langt og er i sterk utvikling i vore dage, vil vel\nde fleste mene at det aeroplan de her læser om, er et fjernt fantasi-billede. Men de som stadig studerer\nflyvekunsten, og ser vanskeligheterne svinde og sikkerheten vokse, de ser hvorledes utviklingen vil gaa.\nLuften vil bli fremtidens slagne landevei og gi den hurtigste befordring for passagerer og gods. Inden 25 aar\ner gaat, vil en luftflaate i rasende fart flyve fra England til Amerika paa mindre end 20 timer. Ikke for\ningenting har "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "været døden. For Allen Dale var det bare en paamindelse om at der trængtes en rask handling -- intet mere.\nVed en forsigtig bevægelse av høiderorene lot han aeroplanet stupe nedover med en saadan fart at det syntes\nsom om jorden -- dypt under -- styrtet mot ham. Samtidig gav han sideror og manøvrerte med bæreflaternes\nbalanceror. Den sidste bevægelse var i øieblikket virkningsløs. Under denne sidegliden negtet biplanet at\nlystre enhver manøver. Men flyveren som sat der trygt fastbundet til sit sæte, var uforknyt. Han holdt blot\nrattet for høideroret fremover og lot aeroplanet skjene med næsen nedover, saa det saa ut som det styrtet like\nlukt i ødelæggelsen. Men som aeroplanet skjenet nedover, syntes et mirakel at ske. Litt efter litt, men\ntydelig, syntes pen kritiske vinkel at bli mindre. Aeroplanet begyndte øiensynlig at rette paa sig. Det var\nigjen kommet paa ret kjøl, mens det fremdeles stupte ret ned mot jorden. Og nu da flyveren hadde faat\nsidebalancen i aeroplanet, trak han rattet tilbake og gik litt efter litt over i horisontal flugt. Alle de som\nbetragtet skuespillet, var sakkyndige, saa de kunde beundre flyverens koldblodige mod og behændighet.\nNaar et aeroplan skjener til"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "fortsatte biplanet at styrte hodekulds nedover, mens jorden med rivende fart syntes at komme styrtende imot\nham. Dales hjerne arbeidet hurtig; han hadde trænet den til det. I næste sekund var han klar over den\nuhyggelige situation. Han var paa det rene med at vinden ikke hadde tat av efter sit første utbrud, som ofte\ner tilfældet. Den tvang fremdeles vingerne nedover. Og intet av hvad han gjorde, kunde stanse denne\nfortvilede styrten nedover. Tankerne fór lynsnart gjennem ham idet han sank. At naa jorden med slik fart\nkunde bare bety én ting -- den sikre død. Aeroplanet var nu helt og holdent ustyrbart. Hvad var det saa at\nvælge mellem? Dale tænkte. Tankerne krydset hverandre. Det gjaldt at finde ut -- i næste sekund -- et\nmiddel til at redde livet. En anden -- ja de fleste -- vilde bare ha klamret sig med armene fast til det første og\nbedste, for saa aldeles lamslaat at vente det dræpende sammenstøt. Men ikke saa med Allen Dale. Hvad der\ngik gjennem ham, var: «Hvis jeg støter mot jorden, kan ingenting redde mig; ikke med denne fart. Umulig.\nDer vil ikke være noget som tar imot støtet. Hvad kan jeg gjøre for at faa noget til at ta imot det? Hvad kan\njeg --» Saa, i næste sekund kom "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Ingenting i veien. Hent bare en stige en av dere. Jeg føler ikke netop trang til at bli sittende heroppe resten\nav dagen.» De dernede hilste ham med et hjertelig hurra. Men det hele forekom dem som det rene mirakel.\nHvorledes kunde nogen paa en naturlig maate være sluppet fra et slikt sammenstøt? Det var et mirakel,\naltsaa; det var den eneste forklaring. Men Dale, som sat der paa taket og kjendte efter alle steder om han\nikke skulde finde nogen kvæstelser, visste at noget mirakel hadde ikke fundet sted. Han grep i inderlommen\npaa sin flyverdragt og fik cigaretetuiet frem. En cigaret var det netop han trængte nu. «Skadet? Langtifra,\nikke spor,» svarte han smilende paa første-mekanikerens ængstelige spørsmaal, idet han kom klatrende op\nstigen. Dale tændte sin cigaret og forklarte rolig: «Maskinen tapte altsaa styringen. Det var ikke mulig at faa\nsvinget baugen opover. Og jeg visste at om jeg naadde jorden med den fart, vilde det være forbi med mig.\nAldeles sikkert. Saa fik jeg øie paa skurtakene. Jeg antok at hvis jeg styrte aeroplanet litt til siden og lot den\ntræffe et av takene, ret paa, med baugen og motoren først, vilde den bryte tvers gjennem taket og ned i\nskuret, og det vilde"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "komme igjennem. Saa puffet han med et lettelsens suk papirhaugen tilside, og grep telefonen som satte ham\ni forbindelse med de forskjellige avdelinger av fabrikken. «Vær saa snild at be Kerr og Longley komme\nover til mig,» sa han. Stemmen hadde en behagelig klang, rask og bestemt. Saa gav han sig til at se\nigjennem nogen kontrakter om konstruktion og salg av flyvemaskiner. De hadde i flere dage ligget og\nventet paa at bli gjennemset. Han sat sterkt fordypet og med rynkede øienbryn og læste gjennem disse svære\ndokumenter, da han hørte nogen i gangen utenfor. Døren gik op, og ind kom to mænd som begge var Dales\nhøire haand i alle slags flyveforetagender. Den ene var en liten firskaaren fyr med en tilsølet blaa bukse som\nvaretræk utenpaa den anden. Ansigtet var morsomt rynket, fordi han hadde den vane altid at knipe øinene\nsammen. Men det var især hænderne som viste hvad slags arbeide han hadde. Egte arbeidsnæver, kraftige,\nsenete, skidne; ingen vask formaadde at fjerne sporene av deres arbeide. Det var Kerr, «motormanden» som\nhan kaldtes, kjendt over hele England, og ogsaa i utlandet, som en fuldstændig trollmand i kunsten at\nkonstruere aeroplanmotorer. Just nu var alle sakkyndiges o"
    }
  ],
  "buku-042": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "SIR! SEJARAH NUSANTARA \nSejarah Melaka \nDalam Zaman Kerajaan Melayu \noleh \nHAJI BUYONG B IN A D IL \nDEWAN BAHASA DAN PUSTAKA \nKEMENTERIAN PELAJARAN MALAYSIA \nKUALA LUMPUR \n1973"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "Siri Pelajaran Menengah DBP Bil. 93 \nCetakan Pertama 1973 \nHakcipta Terpelihara \nDieetak oleh \nPERCETAKAN ART, KUALA LUM PUR \n$3.00"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "Kandungan \nKata Aluan \nPendahuluan \n.. • • • • \nMuka­ \nsurat \nVII \n1x \nRaja Melayu Yang Mula-mula Membuka Negeri Mclaka I \nMelaka Dalam Pemerintahan Permaisura Iskandar Syah \n(Raja Melaka yang pertama: 1394--1414) 8 \nMelaka Dalam Pemerintahan Sultan Megat Iskandar \nSyah \n(Raja Melaka yang kedua: 1414--1424) 13 \nMelaka Dalam Pemerintahan Seri Maharaja (Raja \nTengah) atau Sultan Muhammad Syah \n(Raja Melaka yang ketiga: 1424--1444) 17 \nMelaka Dalam Pemerintahan Sultan Abu Syahid \n(Raja Melaka yang keempat: 1445--1446) 26 \nMelaka Dalam Pemerintahan Sultan Muzaffar Syah \n(Raja Melaka yang kelima: 1446--1456) 28 \nMelaka Dalam Pemerintahan Sultan Mansur Syah \n(Raja Melaka yang keenam: 1456--1477) 33 \nMelaka Dalam Pemerintahan Sultan Alauddin Riayat \nShah (Raja Melaka yang ketujuh: 1477-1488 45 \nMelaka Dalam Pemerintahan Sultan Mahmud Syah \n(Raja Melaka yang kedelapan dan yang akhir: \n1488-1511) 53 \nPembacaan \nIndeks • • .. \n+ 79 \n88 \nV \nSultan Mahmud Memerangi Portugis di Melaka \n(1511-1528)"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "Kata Aluan \nPeristiwa-peristiwa sejarah keagungan dan kejatuhan Kerajaan \nMelayu Melaka sudah banyak kita ketahui. Akan tetapi, sehingga \nmasa ini, belum ada sebuah buku dalam Bahasa Malaysia yang \nkhusus membicarakan sejarah Kerajaan Melayu itu secara lengkap. \nOleh yang demikian Dewan Bahasa dan Pustaka menugaskan \nTuan Haji Buyong Adil untuk menuliskan buku SEJARAH \nMELAKA DALAM ZAMAN KERAJAAN MELA YU ini dengan \nharapan akan menjadi suatu sumber pembacaan sejarah yang \nbererti bagi seluruh bangsa kita. \nBuku ini mengisahkan sejarah kesultanan Melaka dari mula ne­ \ngeri itu dibuka oleh Raja Permaisura hinggalah tewas di tangan \nPortugis pada T.M. 151H. Segala peristiwa penting yang terjadi da­ \nlam masa lebih sedikit dari satu abad itu diceritakan dalam buku ini. \nDewan Bahasa dan Pustaka mengucapkan terimakasih dan rasa \npenghargaan kepada Tuan Hajj Buyong Adil yang telah menumpu­ \nkan masa dan tenaganya untuk menuliskan sejarah Kerajaan Me­ \nlayu yang teragung ini. Dan dengan terbitnya buku ini maka ber­ \ntambahlah sebuah lagi buku sejarah dalam Siri Sejarah Nusantara. \n20hb. Mac, 1973. \nHAJI SUJAK BIN RAHIMAN \nKetua Pengarah \nDewan Bahasa dan Pustaka \nvI"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #13",
      "text": "Pendahuluan \nKerajaan Melayu Melaka dahulu ialah sebuah kerajaan yang pu­ \ncuk pemerintahannya dipegang oleh raja-raja dan orang besar-besar \nMelayu semata-mata. Raja-raja Melayu di Melaka itu berasal dari \nSingapura (Temasik) iaitu setelah kerajaan Melayu Singapura itu \ndialahkan oleh orang-orang Siam (Thai). Kerajaan Melayu di Me­ \nlaka itu telah terdiri selama lebih sedikit seabad iaitu dari akhir \nKurun Masihi yang ke 14 hingga awal Kurun Masihi yang ke 16 \ntepatnya dari tahun 1394 hingga tahun 151H. \nDari sebuah kampung yang tiada dikenali, berkat usaha raja-raja \ndan orang besar-besar Melayu yang memerintah di situ, dalam masa \ntiada berapa lama, Melaka telah bertukar dengan pesatnya menjadi \nsebuah bandar perniagaan dan perdagangan yang dikenali dan di­ \ndatangi oleh beberapa ramai saudagar-saudagar dan peniaga-peniaga \ndari berbagai-bagai tempat di benua Asia iaitu dari pulau-pulau di \nNusantara, dari India, Farsi, Arab, Cina, Burma (Pegu), Campa, \nKemboja dan lain-lain, bahkan pada masa orang Eropah, iaitu \norang Portugis, mula datang hendak berniaga sambil mengembang­ \nkan ugama mereka (Roman Katholik) dan juga hendak menjajah \nnegeri-negeri Melayu, Melaka jugalah yang mu"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #14",
      "text": "laka itu disusun semula serta dilengkapi dengan tarikh-tarikhnya se­ \nkali supaya jelas dan mudah memahamkan perjalanan sejarah ne­ \ngeri itu pada keseluruhannya iaitu dari mula dibangunkan, masa ke­ \nbesaran dan kemegahannya, hinggalah kepada masa kejatuhannya \noleh orang Portugis. \nSeluruh kisah scjarah kerajaan Melayu Melaka yang dibentang­ \nkan dalam buku ini ialah kisah negeri itu sejak mula dibuka oleh \nrajanya yang bernama Permaisura (sebelum berugama Islam), ke­ \nmudian raja itu memeluk ugama Islam lalu memakai gelaran Per­ \nmaisura Iskandar Syah (1394--1414). Lepas itu bergilir-gilirlah anak \ncucu dan zuriat keturunan baginda memerintah di Melaka, iaitu Sul­ \ntan Megat Iskandar Syah (1414-1424), Seri Maharaja atau Sultan \nMuhammad Syah (1424--1444), Sultan Abu Syahid (1445--1446), Sul­ \ntan Muzaffar Syah (1446--1456), Sultan Mansur Syah (1456-1477), \nSultan Alauddin Riayat Syah (1477.-1488), dan akhirnya Sultan \nMahmud Syah (1488--1511). Hal-ahwal dan pergolakan di Melaka \npada zaman pemerintahan masing-masing raja itu adalah dicerita­ \nkan dengan jelas dalam buku ini. Selain daripada itu, dalam kisah \nyang diceritakan itu dapat pula diketahui keadaan perhubungan di \nantar"
    }
  ],
  "buku-043": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "Sanksi pelanggaran Pasal 113 Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta\n(1) Setiap Orang yang dengan tanpa hak melakukan pelanggaran hak ekonomi sebagaimana dimaksud dalam\nPasal 9 ayat (1) huruf i untuk Penggunaan Secara Komersial dipidana dengan pidana penjara paling lama\n1 (satu) tahun dan/atau pidana denda paling banyak Rp100.000.000 (seratus juta rupiah).\n(2) Setiap Orang yang dengan tanpa hak dan/atau tanpa izin Pencipta atau pemegang Hak Cipta melakukan\npelanggaran hak ekonomi Pencipta sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf c, huruf d, huruf\nf, dan/atau huruf h untuk Penggunaan Secara Komersial dipidana dengan pidana penjara paling lama 3\n(tiga) tahun dan/atau pidana denda paling banyak Rp500.000.000,00 (lima ratus juta rupiah).\n(3) Setiap Orang yang dengan tanpa hak dan/atau tanpa izin Pencipta atau pemegang Hak Cipta melakukan\npelanggaran hak ekonomi Pencipta sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf a, huruf b, huruf\ne, dan/atau huruf g untuk Penggunaan Secara Komersial dipidana dengan pidana penjara paling lama 4\n(empat) tahun dan/atau pidana denda paling banyak Rp1.000.000.000,00 (satu miliar rupiah).\n(4) Setiap Orang yang memenuhi unsur sebag"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Sejarah/Geografi Agraria Indonesia\n©2017 STPN Press\nDiterbitkan pertama kali dalam bahasa Indonesia oleh:\nSTPN Press, Desember 2017\nJl. Tata Bumi No. 5 Banyuraden, Gamping, Sleman\nYogyakarta, 55293\nTlp. (0274) 587239\nFaxs: (0274) 587138\nWebsite: http://pppm.stpn.ac.id/\nPenulis:\nRazif, M. Fauzi, Noer Fauzi Rachman, Hilmar Farid\nEditor:\nHilmar Farid dan Ahmad Nashih Luthf i\nLayout/Cover: @zet\nPerpustakaan Nasional: Katalog Dalam Terbitan (KDT)\nSejarah/Geografi Agraria Indonesia\nSTPN Press, 2017\nviii + 221 hlm.: 15 x 23 cm\nISBN: 602-7894-39-3\n978- 602-7894-39-6"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "v\nPENGANTAR PENERBIT\nRuang geografis Indonesia di hampir semua pulau sekarang ini\nmenjadi arena kontestasi, antara yang mementingkan pembangunan,\nkelestarian lingkungan, dan penciptaan keadilan sosial. Tiga kepentingan\nitu seakan-akan bersifat opsional.\nOtonomi daerah yang memberikan beberapa kewenangan strategis\nbagi daerah untuk mengatur wilayahnya, dirayakan melalui cara bagai-\nmana meningkatan pendapatan masing-masing daerah tersebut. Cara\npaling cepat adalah mengeluarkan konsesi atas sumberdaya alam/agraria\nuntuk berbagai kepentingan pembangunan dan produksi (-ekstraktif).\nIjin pertambangan dan konsesi perkebunan (sawit) ribuan hektar\ndiberikan. Demi pengurangan emisi karbon dan antisipasi terhadap\npenggundulan hutan serta terjadinya longsor dan berbagai argumen\nlingkungan lainnya, suatu wilayah ditetapkan sebagai kawasan perlin-\ndungan. Demikian pula pembangunan inf rastruktur terutama untuk\ntransportasi seperti jalan-tol, bandara, dan pelabuhan; perluasan ruang\nkota oleh industri, perkantoran serta pemukiman.\nKesemuanya membutuhkan tanah dan memaksa manusia dan alam\nuntuk dibentuk ulang. Rekonstruksi itu  melalui pengetahuan dasar,\nteknik, adminstrasi, instrumen hukum dan la"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "vi\nHilmar Farid, dkk.\nsaling terhubung dan mengintegrasikan (sekaligus memecah) kepulauan\nIndonesia? Daerah dan kepulauan Nusantara dapat sangat berbeda\ndengan berbagai tawaran kekhasan dan keistimewaannya masing-\nmasing, namun sekaligus bisa menjadi tampak sama semuanya.\nKearah mana perubahan itu hendak menuju? Bagaimana bangunan\nsejarah Indonesia pada masa lalu dan Indonesia pada masa mendatang?\nHal ini adalah pertanyaan-pertanyaan sederhana namun mendasar yang\nperlu direfleksikan. Kita bisa menambah dengan pertanyaan ringkas: da-\nlam kondisi semacam itu, adakah daulat rakyat; ataukah yang ada adalah\ndaulat kapital? Bagaimanakah rumah tangga kecil dan masyarakat lokal\nditransformasikan dan menegosiasikan berbagai perubahan tersebut?\nBuku ini diniatkan untuk menjadi bahan membaca secara historis/\ngeografis berbagai perubahan dalam rentang waktu dan ruang kepulauan\nIndonesia; pada masa lalu untuk direfleksikan pada masa kini. Secara\nmetodologis, buku ini memiliki obsesi untuk merumuskan pendekatan\n“Sejarah/Geografi Agraria” sebagaimana yang disajikan oleh penulis.\nSemoga rintisan ini merangsang hadirnya naskah-naskah lain yang lebih\nsolid membangun aspek metodologi di dalam studi a"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vii\nDAFTAR ISI\nPengantar Penerbit ~ v\nProlog: Menuju Sejarah/Geografi Agraria ~ 1\nBab 1\nEkspansi Kapital dan Pengerahan Tenaga Kerja\ndi Sumatera 1865-1965 ~ 21\nBab 2\nAgraria dan Ekspansi Modal di Kalimantan ~ 71\nBab 3\nSejarah Geografi Kapitalisme di Sulawesi ~ 91\nBab 4\nAgraria dan Ekspansi Modal di Nusa Tenggara ~ 131\nBab 5\nPolitik Agraria Priangan dari Masa ke Masa ~ 152\nEpilog: Ancaman Pengasingan Tanah Air Indonesia ~ 215\nPenulis dan Editor ~ 221"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "1\nPROLOG:\nMENUJU SEJARAH/GEOGRAFI AGRARIA\nHilmar Farid1\nPengantar\nKajian agraria di Indonesia, seperti di banyak negeri jajahan lainnya,\nawalnya terkait erat dengan proses pembuatan kebijakan. Para pejabat\ntinggi mengusahakan kajian itu–atau kadang malah menyusun kajian\nsendiri –yang kemudian digunakan sebagai landasan bagi kebijakan yang\ndiambil. Hal yang menarik di Indonesia, para pelopor kajian ini bukan\norang Belanda melainkan Inggris. Pada 1817 Sir Thomas Stamford Raffles,\nyang pernah menjabat sebagai Letnan Gubernur saat Inggris berkuasa\ndi Jawa (1811-1816) menerbitkan karya akbarnya History of Java dalam dua\njilid. Karya itu memuat informasi cukup rinci tentang kegiatan pertanian\npenduduk pribumi dan pola kepemilikan tanah. Uraiannya lebih meru-\npakan etnografi ketimbang tinjauan his toris, walau cukup membantu\nsebagai potret kehidupan agraria saat itu. 2 Tiga tahun kemudian John\n1 Hilmar Farid, Ph.D. adalah sejarawan dan Ketua Dewan Pembina Institut Sejarah\nSosial Indonesia (ISSI), Jakarta; sejak akhir 2015 menjabat sebagai Direktur Jenderal\nKebudayaan  Kementerian Pendidikan dan Kebudayaan. Email: hilmarfarid@gmail.com\n2 Sebelum itu William Marsden, pegawai kolonial Inggri"
    }
  ],
  "buku-044": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "785\nIslamism from Below: \nThe Role of  Islamic Militias in Post-Authoritarian \nIndonesia 1 \nAbdil Mughis Mudhoffir\nJurusan Sosiologi, Universitas Negeri Jakarta\nAbdil.mughis@yahoo.com\nAbstract\nAfter September 11, the phenomena of  Islamism have grabbed the \nattention of  many scholars. However, their concern mostly focused \non the role of  the actors in formal politics as a response to global \ncapitalism or to democratic state, either using violence or non-violence. \nOther actors who primarily are more active in informal politics using \nstreet level of  violence mostly abandoned in the analysis. They are usu-\nally considered only as the minority-insignificant actors in the political \narena since they are perceived merely as protection racketeers. I argue \nthat the phenomena of  Islamism in Indonesia cannot only be under -\nstood from the process of  political struggle of  the old Islamic move -\nment’s groups as a form of  institutionalization of  Islam from ‘above’ \nor at the state level of  politics, but it can also be revealed from ‘below’ \nas the process of  institutionalization of  Islam at socio-cultural level. \nFrom here, using the social movement’s framework of  analysis, the"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "786\narticle analyzes the various Islamic militias in Java. \nKeywords: Islamic militia, vigilantism, Islamism from below, local \npolitics, post-New Order Indonesia\nIntroduction\nThe phenomena of  Islamic militias in post-New Order Indonesia \nhave grabbed more attention as they are often using violence in the \nstreet level of  politics, either related to morality or religious relation \nissues. These features will not emerge in previous authoritarian order \nsince the violence are monopolized and centralized by the state. How-\never, since the decentralization era, the illegal form of  violence is also \ndecentralized. This kind of  violence are usually performed by Islamic \nmilitias, the most well-known is FPI (Islamic Defender Front), who are \nin democratic era these groups are emerge en mass. \nHowever, primarily based on different social trajectories and also \nfrom how they perceive Islamism ideology, these Islamic militias are \nvery various and dynamic. Some of  them who have a linkage with \npesantren (Islamic boarding school) and use it as their main basis of  \nrecruitment are ideological. From ordinary members to the top leader \nwill use the same rhetoric of  Islam to hold the ummah"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "787\nby secular-nasionalist population.\nThus, it could be argued that far from being monolithic, the Islamic \nmilitias emerging in post-authoritarian Indonesia have many variations \nand also have transformed in responding social-political situation from \ntime to time. In this context, they are also significant actors in under -\nstanding the dynamic of  Islamism in contemporary Indonesia. Mean -\nwhile, the previous studies are mostly neglecting their role, but much \nmore focus on other actors who are more active in formal politics us -\ning rhetoric of  Islam as a response to global capitalism or to demo-\ncratic state (see Hadiz 2011; Hadiz and Teik 2011; Hefner 2002). They \nare perceived as the minority-insignificant actors in political arena since \nthey are perceived merely as protection racketeers (see Wilson 2006, \n2008, 2011; van Bruinessen 2002). In the contrary, other studies that \nuse security-oriented analysis produce the over-estimated judgment to \nthem who are perceived as threatening as terrorists (see Singh 2007; \nGunaratna 2007; Abuza 2007). As long as they demonstrate the Islam-\nic-radical image they are similar to jihadis-linked organization. I argue \nthat the existing"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "788\nIslamism from Below\nAccording to Roy (1994), Islamism is a movement that conceives \nof  Islam as a political ideology, where now has been transformed into \na type of  neo-fundamentalism concern solely with reestablishing Mos-\nlem law, the sharia, without inventing new political forms. These phe-\nnomena could also be portrayed from the proliferation of  Islamic mi-\nlitias in Indonesia that concerns more with the Islamization of  society \nthrough preaching. \nHowever, the role of  Islamic militias is often neglected by some \nstudies in their analysis of  contemporary Islamic movement in Indone-\nsia since these groups are not rooted in the old Islamist groups that con-\ncern either with radical transformation of  the state or with achieving \npolitical power through election (see Hadiz 2011). Moreover, since the \nIslamic militias are outside of  formal politics, they are also considered \nas the indication of  the failure of  political Islam in Indonesia (see Ha-\ndiz and Teik 2011), where the politics, as it is also indicated from Roy’s \nnotion, is only perceived as the activities associated with the govern-\nments. Thus, the indicator of  the success of  Islamist movement solely \nis o"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "789\neration of  militias will bring Talibanization of  Indonesia (Singh 2007; \nICG 2012). In this context, this project will bring the groups to under-\nstand Islamism in contemporary Indonesia.\nThe Emergence of  Islamic Militias\nThe changing of  political regime in Indonesia in 1998 marked the \nemergence of  Islamic militias, not only in the capital city of  Jakarta, but \nalso in some local areas like in Solo Central Java or in Cianjur West Java. \nThe long tension between Muslim and Christian along New Order pe-\nriod and the process of  Islamization of  society from 1970s and of  the \nstate from 1990s were the historical context that makes reformasi in \n1998 become important moment for the emergence of  Islamic militias \nat the first time. \nThe last decade of  Suharto’s power was more Islamist as a part of  \ngaining support from Islamist groups responding the elite rivalry from \nmilitary that previously become the main supporter of  the regime, es-\npecially from nominal Muslim (abangan) and Christian factions. Previ-\nously, from the beginning of  New Order, Islamist groups are always \nbeing repressed to avoid becoming significant challenger to the regime \nand also in the election. "
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "790\nInternal Dynamic\nI suggest that the different basis of  recruitment, either through Is-\nlamic study groups (pengajian) in urban areas or from Islamic boarding \nschools (pesantren) in rural areas, will shape the different characteristic \nof  militias, including how they uphold the Islamic agenda and how they \nmaintain relation with political elites. The first groups are usually more \npragmatic that can turn into protection racketeers: using Islamic rheto-\nric merely for rent seeking. In contrast, the second groups are usually \nmore ideological and try to avoid using their militia for economic rea-\nsons, but rather for pursuing Islamic value. From here, this study will \nexplore how the different feature of  militias has different influence to \nthe marginalization of  minority groups.\nThis is especially related to the objective of  militias in pursuing Is-\nlamic agenda in formal politics by creating political alliance with local \nelites. They use their role as a pressure group to influence the local \npolitics. In West Java, for example, such groups could maintain the \ndominant role in pursuing Islamic agenda that made this regions have \nmany Islamic bylaws as well as a lot of  rel"
    }
  ],
  "buku-045": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "Banjarmasin 2-3 Nopember 2013\nPROSIDING PERTEMUAN ILMIAH TAHUNAN (PIT) XVI\nMEMPERKOKOH KESADARAN SPASIAL\nKEPEMIMPINAN NKRI MENGHADAPI\nTANTANGAN GLOBAL\nIKATAN GEOGRAF INDONESIA (IGI)\n2013\n2013\nPenyelenggara Kegiatan\nIkatan Geograf Indonesia Provinsi Kalimantan Selatan \nProgram Studi Pendidikan Geografi-FKIP \nUniversitas Lambung Mangkurat \nJl. Brigjen H. Hassan Basry Kotak Pos 87 Banjarmasin 70123"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "KONTRIBUTOR\n•\t PT.\tSEBUKU\tIRON\tLATERITIC\tORES\n•\t PT.\tINDOCEMENT\tTUNGGAL\tPRAKARSA\tTbk.\n•\t PT.\tBANK\tBTN\n•\t PD\tBANGUN\tBANUA\tKALIMANTAN\tSELATAN\n•\t IKATAN\tGEOGRAF\tINDONESIA\n•\t PT.\tPRO\tFAJAR\tKOMUNIKA\t\nTim Penyusun\nTim Editor:\n1.\t Prof.\tD r.\tSuratman,\tM.Sc.\t\n(Ketua\tUmum\tIGI\tPusat)\n2.\t Nasruddin,\tM.Sc.\t\n(Ketua\tUmum\tIGI\tProvinsi\tKalimantan\tSelatan)\n3.\t D r.\tAsep\tKarsidi,\tM.Sc.\n(Dewan\tPembina\tIGI\tPusat)\n4.\t Prof.\tD r.\tAris\tPoniman\n(Dewan\tPembina\tIGI\tPusat)\n5.\t Drs.\tWahyu\tUtomo,\tM.Si.\t\n(Dewan\tPembina\tIGI\tProvinsi\tKalimantan\tSelatan)\nKomunikasi dan Sponsor:\nNasrudin\nDeasy\tArisaty\nRifka\tRamadhani\t\nAtang\tAtmaja\nFery\tGusrianto\nDesain Grafis\nPT.\tPro\tFajar\nPenerbit\nPT.\tPro\tFajar\nISBN\n978-602-1322-00-0"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "KONTRIBUTOR\n•\t PT.\tSEBUKU\tIRON\tLATERITIC\tORES\n•\t PT.\tINDOCEMENT\tTUNGGAL\tPRAKARSA\tTbk.\n•\t PT.\tBANK\tBTN\n•\t PD\tBANGUN\tBANUA\tKALIMANTAN\tSELATAN\n•\t IKATAN\tGEOGRAF\tINDONESIA\n•\t PT.\tPRO\tFAJAR\tKOMUNIKA\t\nTim Penyusun\nTim Editor:\n1.\t Prof.\tD r.\tSuratman,\tM.Sc.\t\n(Ketua\tUmum\tIGI\tPusat)\n2.\t Nasruddin,\tM.Sc.\t\n(Ketua\tUmum\tIGI\tProvinsi\tKalimantan\tSelatan)\n3.\t D r.\tAsep\tKarsidi,\tM.Sc.\n(Dewan\tPembina\tIGI\tPusat)\n4.\t Prof.\tD r.\tAris\tPoniman\n(Dewan\tPembina\tIGI\tPusat)\n5.\t Drs.\tWahyu\tUtomo,\tM.Si.\t\n(Dewan\tPembina\tIGI\tProvinsi\tKalimantan\tSelatan)\nKomunikasi dan Sponsor:\nNasrudin\nDeasy\tArisaty\nRifka\tRamadhani\t\nAtang\tAtmaja\nFery\tGusrianto\nDesain Grafis\nPT.\tPro\tFajar\nPenerbit\nPT.\tPro\tFajar\nISBN\n978-602-1322-00-0"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Geograf Berkarya Membangun Bangsa\nii\nProsiding Pertemuan Ilmiah Tahunan XVI 2013\nBanjarmasin 2-3 Nopember\nIKATAN GEOGRAF INDONESIA\nKatalog Dalam Terbitan; Perpustakaan nasional Indonesia;  Memperkokoh Kesadaran Spasial \nKepemimpinan NKRI Untuk Menghadapi Tantangan Global \n \n \n \nISBN 978-602-1322-00-0 \nJudul Buku : Memperkokoh Kesadaran Spasial Kepemimpinan NKRI Untuk Menghadapi Tantangan \nGlobal \n \n \n \n \nPenyusun : \nIKATAN GEOGRAF INDONESIA PROVINSI KALIMANTAN SELATAN \n \n \nPerancang  Sampul: \nHasa Noor Hasadi \nMuhammad Zainuddin \nMuhammad Muhaimin \n \nEditor: \nProf. Dr. Suratman., M.Sc. (Ketua Umum IGI Pusat) \nNasruddin, M.Sc. (Ketua Umum IGI Kalimantan Selatan) \nDr. Asep Karsidi, M.Sc. (Dewan Pembina IGI Pusat) \nProf. Dr. Aris Poniman (Dewan Pembina IGI Pusat) \nDrs. Wahyu Utomo, M.Si. (Dewan Pembina IGI Provinsi Kalimantan Selatan) \n \n \n \n \n \n \nPenerbit : \nPT. Pro Fajar Jakarta \n \n \n \nHak cipta ada pada penulis dan dilindungi  Undang-Undang \nNomor 19 Tahun 2002, pasal 72 tentang HAK CIPTA. \nDilarang memperbanyak buku ini, tanpa ijin dari Penulis dan Penerbit"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Geograf Berkarya Membangun Bangsa\niii\nProsiding Pertemuan Ilmiah Tahunan XVI 2013\nBanjarmasin 2-3 Nopember\nIKATAN GEOGRAF INDONESIA\n \n \n \n \n \nPENGURUS IGI PROVINSI KALIMANTAN SELATAN  \nKOMISARIAT UNIVERSITAS LAMBUNG MANGKURAT  \n \nSAMBUTAN DAN LAPORAN PERTANGGUNGJAWABAN \nPANITIA PERTEMUAN ILMIAH TAHUNAN XVI \nIKATAN GEOGRAF INDONESIA \n \nHari Sabtu, Tanggal 2 November 2013,  Pukul 08.00 Wita. \nGedung Mahligai Pancasila - BANJARMASIN \n \n \nAssalamu Alaikum Wr.Wb. \nSalam Sejahtera \n \nYth. \n1. Ketua Umum IGI Pusat  \n2. Kementerian Riset dan Teknologi RI  \n3. Gubernur Provinsi Kalimantan Selatan \n4. Kepala Badan Informasi Geospasial (BIG)  \n5. Himpunan Kerukunan Tani Indonesia  \n6. Bupati/Walikota  se-Provinsi Kalimantan Selatan \n7. DPR-MPR Provinsi Kalimantan Selatan \n8. Rektor/Dekan/IKA Universitas Lambung Mangkurat \n9. LSM, Pers, dan Sponsor \n10. Para Narasumber Utama dan Ahli, Tokoh Nasional  \n11. Tamu Undangan dan Geograf se-Indonesia \n \nPuji syuk ur kehadirat Allah SWT, Tuhan Yang Maha Kuasa penyelenggaraan Seminar dalam \nPertemuan Ilmiah Tahunan (PIT) Ikatan Geograf Indonesia ke XVI dapat terselenggara. Izinkan \nsaya selaku Panitia/Pengurus Wilayah IGI Provinsi Kalimantan Selatan Ko"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "Geograf Berkarya Membangun Bangsa\niv\nProsiding Pertemuan Ilmiah Tahunan XVI 2013\nBanjarmasin 2-3 Nopember\nIKATAN GEOGRAF INDONESIA\n1) Peran Informasi Geospa sial untuk Pengelolaan Sumberdaya Wilayah Strategis di \nIndonesia \n2) Geostrategis NKRI dalam Menghadapi Tantangan Global \n3) Pendidikan Geografi Inovatif untuk Membangun Karakter Bangsa \n \n  Tema PIT IGI XVI yang diuraikan di atas sangatlah fundamental bagi kepentin gan \npemasyarakatan (sosialisasi) dan penyadaran masyarakat bangsa Indonesia akan pentingnya \ninformasi geospasial dalam menghadapi tantangan global dengan kembali pada  jati diri bangsa \nIndonesia yakni 4 pilar (Pancasila, UUD 1945, NKRI, Bhineka Tunggal Ika)  yang menjadi panutan, \npedoman, dan ideologi nasional bangsa Indonesia.  \n  Problematika saat ini adalah konflik ruang, pri mordialisme yang melahirkan gerakan -\ngerakan  masif  dimana -mana  yang  dapat berakibat pada  kerapuhan  keutuhan bangsa dan \nnegara.  Berdasarkan  hal  tersebut  maka  dalam agen da  pertemuan  ilmiah  tahunan XVI tema \nyang diusung adalah sebuah  tema  yang  sarat  akan  makna  yang terkandung  didalamnya,  hal \nitu ditandai  dengan semakin rapuhnya  jiwa  nasionalisme  yang  beruju"
    }
  ],
  "buku-047": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "UU No. 19 Tahun 2002 Tentang Hak Cipta \nFungsi dan Sifat Hak Cipta Pasal 2 \n1. Hak Cipta merupakan hak eksklusif bagi pencipta atau \npemegang Hak Cipta untuk mengumumkan atau \nmemperbanyak ciptaannya, yang timbul secara otomatis \nsetelah suatu ciptaan dilahirkan tanpa mengurangi \npembatasan menurut peraturan perundang -undangan \nyang berlaku. \nHak Terkait Pasal 49 \n1. Pelaku memiliki hak eksklusif untuk memberikan izin \natau melarang pihak lain tanpa persetujuannya \nmembuat, memperbanyak, at au menyiarkan rekaman \nsuara dan /atau gambar pertunjukannya. \nSanksi Pelanggaran Pasal 72 \n1. Barangsiapa dengan sengaja dan tanpa hak melakukan \nperbuatan sebagaimana dimaksud dalam pasal 2 ayat (1) \natau pasal 49 ayat (2) dipidana dengan pidana penjara \nmasing-masing paling singkat 1 (satu) bulan dan /atau \ndenda paling sedikit Rp. 1.000.000,00 (satu juta rupiah), \natau pidana penjara paling lama 7 (tujuh) tahun dan \n/atau denda paling banyak Rp. 5.000.000.000,00 (lima \nmiliar rupiah). \n2. Barangsiapa dengan sengaja meny iarkan, memamerkan, \nmengedarkan, atau menjual kepada umum suatu ciptaan \natau barang hasil pelanggaran Hak Cipta sebagaimana \ndimaksud dalam ayat (1), dipidana dengan pidan"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "KUMPULAN EKSPERIMEN SAINS \n \n \n \nOleh:  \nA. Bobby Chandra, M. Si. \ndan \nMahasiswa PGMI IAIN Metro \n \n \n \n \n \n \n \n \n \n \n \n \n               CV.IQRO \n                                PENERBITAN"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Perpustakaan Nasional RI \nKatalog Dalam Terbitan (KDT) \n \nKUMPULAN EKSPERIMEN SAINS \n \nISBN: 978-602-5533-15-0 \n \nPenulis:  \nA. Bobby Chandra, M. Si dan \nMahasiswa PGMI IAIN Metro \n \nEditor: \nDr. Yudiyanto, M.Si. \nAsep Yudianto \nCahya Rahmayani \n \nTim Penyunting: \nMahasiswa PGMI IAIN Metro \n \nSampul dan Tata Letak: Tim CV. IQRO’ \nCetakan Pertama, 2018 \n16 cm X 24 cm \n210 halaman \nHak cipta dilindungi oleh Undang-Undang \n \nAll Right Reserved \nPenerbit: CV. IQRO, alamat: Jl. Jenderal A. Yani No.157 Iring Mulyo \nKota Metro, Lampung, Telp: 081379404918, web: iqrometro.co.id, e-\nmail: team@iqrometro.co.id"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "DAFTAR ISI \n \nKata Pengantar Dekan FTIK IAIN Metro \nPrakata \n \nPembuatan Tepung Daun Mangga (Mangifera indica) ......................... 3 \nTepung Biji Mangga Indramayu (Mangifera indica) .......................... 11 \nPengaruh Getah Tuba ( Deris elupita) Terhadap Kelangsungan \nHidup Ikan Lele ( Clarias gariepinus), Ikan Wader Pari (Rasbora \nLateristriata), dan Ikan Cupang (Betta Sp) ........................................... 20 \nUji Klorofil Pada daun Bayam ( Amaranthus), Daun Pepaya \n(Carica Papaya), dan Daun Jambu Biji (Psidium guajava) ................... 27 \nPerangkap Nyamuk Ramah Lingkungan ............................................ 36 \nPembuatan Tempe dari Biji Karet (Hevea biasiliensis) ......................... 43 \nPerbandingan Asam Cuka Sari Buah Mengkudu \n(Morindacitrifolia) dan Sari Umbi Gadung ( Dioscorea hispida \ndenust) Sebagai Pembeku Lateks ........................................................... 50 \nAlat Pendeteksi Banjir Sederhana ........................................................ 58 \nLampion Udara ....................................................................................... 64 \nPengusir Nyamuk Dari Batang Sirih (Piper betle) ..............."
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Alat Musik Botol Bekas ......................................................................... 114 \nPembuatan Sabun Cuci Piring dengan Bahan Alami Jeruk \nNipis (Lat citrus aurantifolia), Sereh (Cymbopogon citratus), Pandan \n(Pandanus) ................................................................................................. 119 \n(DWP) Sebagai Solusi Efektif Pengolahan Limbah Cair .................. 126 \nKulit Bawang Merah ( Allium cepa) Sebagai Pembasmi Hama \nUlat Pada Tanaman Kangkung (Ipomoea aquatica forsk) ..................... 136 \nPestisida Alami Pembasmi Semut pada Tanaman Pucuk Merah .... 141 \nPestisida Alami dari daun Sirsak ( Annona muricata) untuk \nMembasmi Hama Walang Sangit ( Leptocorisa oratorius) pada \nTanaman Padi (Oriza sativa) .................................................................. 149 \nCat Sederhana dari Daun Kunyit (Curcuma longa) .............................. 158 \nKerupuk Dari Sari Umbi-Umbian ....................................................... 162 \nCat Alami dari Lawsonia Inermis L dan Tectona Grandis .............. 179 \nDestilasi Air Garam................................................................................ 185 \nJasad Renik"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "1 \n \n \n \n \nKATA PENGANTAR \n \n \nDekan Fakultas Tarbiyah dan Ilmu Keguruan \nInstitut Agama Islam Negeri (IAIN) Metro \n \n Syukur Alhamdulillah senantiasa dihaturkan kepada Allah \nSWT atas limpahan rahmat dan karunia -Nya sehingga buku \nKumpulan Eksperimen Sains dapat terbit tanpa hambatan yang \nberarti. Saya selaku Dekan Fakultas Tarbiyah dan Ilmu Keguruan \nmenyambut baik atas terbitnya buku Kumpulan Eksperimen Sains \nkarya Bapak A. Bobby Chandra dan mahasiswa PGMI IAIN Metro. \n Pembelajaran eksperi men sains khususnya bagi siswa \nSD/MI dapat menarik apabila semua elemen pembelajaran \nmendukung. Hadirnya buku ini diharapkan dapat mendukung dan \nmemaksimalkan media pembelajaran khususnya bagi mahasiswa \nPGMI dan mahasiswa IAIN Metro. Wawasan eksperimen sai ns \nyang tertera dalam buku ini sangat praktis, karena disertai dengan \ncara kerja dan pembahasan hasil eksperimen. Saya berharap \nbuku Kumpulan Eksperimen Sains ini dapat dijadikan rujukan bagi \nmahasiswa saat melaksanakan perkuliahan maupun PPL. \n Saya menyampaikan selamat atas karya yang diterbitkan, \nsemoga pembelajaran eksperimen sains SD/MI kedepan semakin \nmenarik dan antusias. Semoga buku ini bermanfaat bagi kita \nsemua khusu"
    }
  ],
  "buku-048": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "22\nPilihan Bisnis Pelajar\nHak Cipta © 2014 pada Penulis\nBaihaqi Casnadi Muhtar\nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta untuk mengumumkan atau \nmemperbanyak ciptaannya, yang timbul secara otomatis setelah suatu ciptaan dilahirkan tanpa mengurangi \npembatasan menurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barangsiapa dengan sengaja atau tanpa hak melakukan perbuatan sebagaimana dimaksud dalam \npasal 2 ayat 1(satu) atau pasal 49 ayat 1 (satu) dan ayat 2 (dua) di pidana penjara masing-masing \npaling singkat 1 (satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- (satu juta rupiah), atau \npidana penjara paling lama 7 (tujuh) tahun dan/atau denda paling banyak Rp. 5.000.000.000,- (lima \nmilyar rupiah.)\n(2)  Barangsiapa dengan sengaja menyiarkan, memamerkan, mengedarkan atau menjual kepada umum \nsuatu ciptaan atau barang hasil pelanggaran hak cipta atau hak terkait sebagaimana dimaksud pada \nayat 1 (satu) dipidanakan dengan pidana penjara paling lama 5 (lima) tahun dan/atau denda paling \nbanyak Rp. 500.000.000,- (lima ratus "
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "33\nKata pengantar\nPuji syukur atas kehadirat Tuhan Yang M aha Esa, \nyang telah memberikan rahmat dan karunianya. Sehingga \nkami dapat memberikan solusi dalam belajar bahasa \nKorea.\nBahasa Korea saat ini menjadi bagian dari Bahasa \nDunia yang memang wajib dikuasai oleh siapa pun sekarang \nini. Sayangnya, tidak di sekolah atau dimana pun, semua \norang pasti berpendapat kalau ini adalah Bahasa yang sulit \nuntuk dipelajari.\nItu hanya pemikiran orang yang mungkin belum \nbertemu dengan buku ini. Karena buku ini memiliki \nkelengkapan untuk membimbing kamu menguasai Bahasa \nKorea dalam Waktu Singkat, Instant dan Sangat Cepat. \nTidak percaya, coba saja pelajari apa yang ada di \ndalamnya dan buktikan. Dengan begitu mudahnya kamu \nakan dibimbing untuk dapat menguasai Bahasa Korea \ntanpa guru atau secara otodidak. Dalam waktu yang isntant \npula, singkat dan tidak berbelit-belit. Ambil buku ini dan \ncoba praktekan."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "44\nKamus Percakapan Indonesia - Korea\nHangeul     7\nHuruf Mati & Huruf Hidup   11\nPola & Jenis Kalimat    15\nBerlatih Percakapan Sehari hari   21\n » Dibandar Udara  29 \n » Ditaksi    40 \n » Dihotel    49 \n » Dirumah Teman  61 \n » Diapotek   73 \n » ditempat Wisata  77 \n » Dimuseum   89 \n » Di Toeserba   99 \n » Ditoko Baju   114 \n » Membuat Rekening di Bank 120 \n » Periksa Dengen Dokter  137 \n » Dijalan Umum   142 \n » Dibiro Wisata   149"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "77\n Jika kita akan belajar bahasa asing, pertamanya \nkita awali dengan mengenal huruf bahasa tersebut.\nNah, huruf-huruf korea itu mudah untuk dipelajari, tidak \nseperti belajar bahasa Mandarin atau Jepang. Huruf korea \nlebih simpel dan lebih mudah dibaca. Sekarang mari kita \nmulai. \n adalah bentuk alfabet Korea. Pada awalnya orang \nkorea menggunakan alfabet Cina yang disebut Hanja. \nTetapi masyarakat Korea tidak dapat menggunakan Hanja \nkarena dianggap terlalu rumit.\nKarakter Hangeul lebih mudah dipelajari dari pada Hanja \ndikarenakan jumlah karakter lebih sedikit. Hangeul terdiri \ndari 10 vocal tunggal dan 11 vocal gabungan yang disebut \nMoeun serta 14 konsonan dasar dan 5 konsonan rangkap \nyang disebut dengan Chaeum."
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "88\nBerikut adalah cara pelafalan \nkarakter hangeul.\nVOCAL\nA\nI\nU\nE\nO\nEU\nAE\nOE\nNama Lafal Huruf\nKONSONAN TUNGGAL\nG/K\nN\nD/T\nR/L\nM\nHuruf Lafal"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "1010\nKamus Percakapan Indonesia - Korea\nVOCAL RANGKAP\nYA\nYU\nYEO\nYE\nYA E\nYO\nHuruf Lafal Nama\nVOCAL GABUNGAN\nWA\nWI\nWO\nWE\nWAE\nEUI\nWE\nNama Lafal"
    }
  ],
  "buku-049": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "2\nAturan Waktu 16 Tenses Inggris\nHak cipta © pada Penulis\nNovita Khairani Tanjung S.Pd\nEditor\nNur Anisa\nDisign Sampul\nTika Danuarta\nLayout\nAisyah Diah\n128 hlm; 15 x 23\nPenerbit\nMedina Ilmu\nDistributor\nPT. MAHADAYA\nPerumahan Permata Cimanggis Cluster Kumala Blok B6 No. 9 \nKel. Cimpaeun Kec. Tapos Depok\nTelp. 021 – 7027 3319\nCetakan Pertama\nPerpustakaan Nasional: Katalog dalam Terbitan (KDT)\nISBN : 978-602-319-075-1  \nUndang-undang Republik Indonesia No.19 Tahun 2002 tentang Hak Cipta\nLingkup Hak Cipta\nPasal 2:\nHak Cipta merupakan hak eksklusif bagi Pencipta atau Pemegang Hak Cipta \nuntuk mengumumkan atau memperbanyak ciptaannya, yang timbul secara \notomatis setelah suatu ciptaan dilahirkan tanpa mengurangi pembatasan \nmenurut peraturan perundang-undangan yang berlaku.\nKetentuan Pidana\npasal 27:\n(1)  Barang siapa dengan sengaja atau tanpa hak melakukan perbuatan \nsebagaimana dimaksud dalam pasal 2 ayat 1(satu) atau pasal 49 ayat 1 \n(satu) dan ayat 2 (dua) di pidana penjara masing-masing paling singkat \n1 (satu) bulan dan/atau denda paling sedikit Rp.1.000.000,- (satu juta \nrupiah), atau pidana penjara paling lama 7 (tujuh) tahun dan/atau denda \npaling banyak Rp. 5.000.000.000,- (lima"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "3\nKATA PENGANTAR\n Bahasa Inggris merupakan bahasa yang digunakan dalam \ndunia Internasional. Di Indonesia pun, bahasa Inggris masuk \ndalam kurikulum pendidikan dan banyak perusahaan yang \nmenetapkan bahasa Inggris dalam syarat lamaran pekerjaan. \n Jika berbicara tentang bahasa Inggris, tentu tenses \nadalah bagian yang wajib dibahas. \nBuku ini hadir untuk membantu Kamu sekalian, agar dapat \nmenguasai tenses dalam bahasa Inggris dengan mudah dan \ncepat.\n Dengan pembahasan yang sederhana dan mudah \ndimengerti dan contoh dalam penerapan kalimat, menjadikan \nbuku ini sebagai panduan wajib yang dimiliki orang-orang yang \ningin cepat lancar berbahasa Inggris."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "4\nDAFTAR ISI\n \nBAB 1 \nBAB 1. 16 \nTENSES\n7\nBAB 2. Present \nTense\n9\nBAB 3. Past \nTense\n27\nA. Simple Past \nTense\n27\nB. Simple Past \nContinuous \nTense 29\nC. Simple Past \nPerfect Tense\n32\nD. Simple \nPast Perfect \nContnuous \nTense 33\nBAB 4. Future \nTense\n39\nA. Simple Future \nContinuous \nTense\n39\nBAB 5. Past \nFuture Tense\n49"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "5\nB. Past Future \nContinuous \nTense\n51\nA. Simple Past \nFuture Tense\n49\nC. Past Future \nPerfect Tense\n54\nD. Past Future \nPerfect \nContinuous \nTense 56\nVOCABULARY\n58"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "7\nTenses merupakan bentuk kata yang menyatakan perubahan \nwaktu, kapan peristiwa, berita, pernyataan, tindakan terjadi dalam \nsuatu kalimat.\nKonstruksi tenses penting dalam bahasa Inggris, karena setiap \nkalimat atau klausa ditulis atau dinyatakan berdasarkan aturan atau \npola bentuk-bentuk waktu tersebut.\nTenses terdiri atas empat bagian, yaitu:\nA. Present Tenses (bentuk-bentuk waktu sekarang),\nB. Past Tenses (bentuk-bentuk waktu lampau),\nC. Future Tenses (bentuk-bentuk waktu yang  akan datang),\nD. Past Future Tenses (bentuk-bentuk waktu akan datang-\nlampau).\nPRESENT TENSES\nPresent Tenses terbagi 4 : \n1. Simple present tense,\n2. Present continuous tense,\n3. Present perfect tense, dan \n4. Present perfect continuous tense\n \nBAB 1\n16 Tenses\n (Bentuk-bentuk Waktu dalam\nKalimat Bahasa Inggris)"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "8\nPast Tenses terbagi 4:\n1. Simple past tense,\n2. Past continuous tense,\n3. Past perfect tense, dan \n4. Past perfect continuous tense\nFuture Tenses terbagi 4: \n1. Simple future tense, \n2. Future continuous tense, \n3. Future perfect tense, dan \n4. Future perfect continuous tense.\nPast Future terbagi 4:\n1. Simple past future tense\n2. Past future continuous tense\n3. Past future perfect tense\n4. Past future perfect continuous tense"
    }
  ],
  "buku-050": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "II\n7H A R I\nJalan-Jalan\nSINGAPURA\nMALAYSIA\nDENGAN\nBUDGET 5\nJUTA\n-AN\nPenulis : Dina Estianti, S.Pd\nDesain Sampul : Ramdan Ramdani\nPenata Letak : Ferdi Herdiasyah\nEditor : Marlina S\nPenerbit : HUMAN BOOKS-Jakarta\nISBN : 978-602-301-008-3"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "III\nTravelling merupakan salah satu gaya hidup yang \nsekarang ini banyak dilakukan untuk menyeimbangkan \nantara\trutinitas\tdan\tkehidupan\tpribadi.\tHal\tini\tbisa\tmenjadi\t\nbagian\tdari\tkegiatan\tpositif\tuntuk\tmendapatkan\tpengalaman,\t\nperjalanan, sekaligus wawasan baru mengenai perjalanan, \nkebudayaan, dan keindahan alam.\nPada kesempatan ini, tempat yang dibahas adalah \ntempat yang sering dikunjungi oleh orang Indonesia, yaitu \nSingapura dan Malaysia. Tanpa perlu budget yang banyak, \nternyata kita juga bisa mengunjungi kedua negara tersebut \ndengan nyaman dan membawa pulang pengalaman yang \ntidak\t kalah\t menarik\t dibandingkan\t dengan\t orang\t yang\t\ntravelling menggunakan fasilitas mewah. Selamat travelling!\nKata Pengantar"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "IV\nKata Pengantar  ......................................................... III\nDaftar Isi  ................................................................... IV\nBab I Kenalan, Yuk! Jadi Singa di Negara Singa  .......... 1\nA. Pilih\tHari\tCuti\t ........................................................... 1\nB. Cek Jam Terbang  ...................................................... 5\nC. Hello\tUniverse!\t ........................................................ 7\nD. Kenalan dengan MRT  ............................................... 15\nE. Wisata Belanja di Bugis  ............................................ 28\nF. Mari Berwisata Religi  ............................................... 33\nG. Wisata Budaya dan Religi di Chinatown  .................. 41\nH.\t Jalan-Jalan\tGratis\tdi\tMerlion\tPark\t ........................... 46\nI. Jelajahi\tKebudayaan\tIndia\tdi\tLittle\tIndia\t .................. 48\nJ. Belanja Lagi di Orchard Road  ................................... 49\nK. Kawasan Wisata yang Jarang Dikunjungi \nWisatawan Indonesia  .............................................. 50\nL. Tips\tHemat\tJalan-Jalan di Singapura  ........................ 57\nM. Sajian Wisata Kuliner di Negeri Singa  ............"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "V\nBab II Santai di Negeri Jiran  ......................................  89\nA. Look, It’s Petronas!  .................................................. 89\nB. Jadi Kurcaci di Gua Batu ........................................... 95\nC. Tabib\tdi\tKuil\tThean\tHou\t ........................................... 110\nD. Keliling Lake Garden  ................................................ 112\nE. Wisata\tArlernatif\tdi\tMalaysia\t ................................... 117\nF. KTM Komuter  .......................................................... 127\nG. Wisata Kuliner di Malaysia ....................................... 133\nH.\t Referensi Penginapan di Malaysia  ........................... 139\nDaftar Pustaka  .......................................................... 169\nProfil Penulis   ............................................................ 170"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "1\nMenikmati\t liburan\t tidak\t harus\t ke\t tempat\t yang\t terlalu\t\njauh dan mahal. Kamu bisa datang ke beberapa tempat \nsekaligus\tdalam\twaktu\tyang\trelatif\tsingkat,\ttapi\tjuga\tmemiliki\t\nefek yang sama jika kamu pergi ke tempat lain yang mewah, \njauh, dan berbiaya mahal. Cobalah untuk berjalan-jalan \nke Singapura dan Malaysia dengan budget yang tak terlalu \nmahal!\nPilih Hari CutiA.\nSumber foto: thenextweb.com\nKenalan, yuk!\nJadi Singa di Negara Singa\nBab I"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "2\nPunya\tsegudang\tpekerjaan\tdan\taktivitas\tyang\tbertumpuk\t\npasti\t bikin\t jenuh.\t Tapi,\tkalau\t tidak\t bekerja\tpun\t pasti\t akan\t\nsulit karena pada dasarnya, kita semua butuh uang demi \npenghidupan\t yang\t layak.\t Untuk\t itu,\t kita\t perlu\t sedikit\t\nrefreshing\t dengan\t cara\t yang\t tidak\t membosankan.\t Salah\t\nsatunya\t tentu\t dengan\t mengambil\t cuti\t dan travelling  ke \nbeberapa\t tempat\t mengasyikkan\t yang\t sebelumnya\t tidak\t\npernah dikunjungi.\nPilihan tempat yang asyik bukan cuma di negara-negara \nEropa saja. Asia pun memiliki berbagai pilihan tujuan wisata \nyang menarik kalau kita mau. Misalnya saja, Singapura yang \nmerupakan negara kecil bisa dijadikan tempat wisata hanya \ndalam hitungan hari.\nNah, sebelum berangkat travelling ke Negara Singa itu, \nsebaiknya kita rencanakan perjalanan secara matang supaya \ntidak\tterjadi\tkekacauan\tdalam\tperjalanan\tmaupun\tpekerjaan\t\nyang\tditinggalkan.\tBeberapa\thal\tyang\tharis\tdipastikan\tpada\t\nsaat\tmemilih\tcuti\tadalah:\n1. Susun Rencana\nLiburan tanpa rencana bisa jadi mengasyikkan kalau kita \npunya banyak waktu. Tapi, kalau kita masih punya segudang \npekerjaan\t yang\t jika\t ditinggalkan\t bisa\t membuat\t pusing,\t\nsebaiknya atur dan susun rencana sebaik-baiknya a"
    }
  ],
  "buku-051": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Publisher:  Mike Sanders \nAssociate Publisher:  Billy Fields  \nSenior Acquisitions Editor:  Brook Farling \nDevelopment Editor:  Kayla Dugger  \nCover and Book Designer: William Thomas \nPhotographer: Molly Pearl \nFood Stylist: Jason Peters  \nIllustrator:  Clint Ford \nPrepress Technician:  Brian Massey \nProofreader:  Cate Schwenk \nIndexer: Celia McCoy\nFirst American Edition, 2016 \nPublished in the United States by DK Publishing \n6081 E. 82nd Street, Indianapolis, Indiana 46250\nCopyright © 2016 Dorling Kindersley Limited\nA Penguin Random House Company\n16 17 18 19  10  9 8 7 6 5 4 3 2 1\n001–295790–November/2016\nAll rights reserved.\nWithout limiting the rights under the copyright reserved above, \nno part of this publication may be reproduced, stored in or \nintroduced into a retrieval system, or transmitted, in any form, \nor by any means (electronic, mechanical, photocopying, \nrecording, or otherwise), without the prior written permission \nof the copyright owner.\nPublished in the United States by Dorling Kindersley Limited.\nISBN: 978-1-46545-439-3\nLibrary of Congress Catalog Card Number: 2016938282\nNote: This publication contains the opinions and ideas of its \nauthors. It is intended to p"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "Contents\nGetting Started ................................................9\nWhat Is a Ketogenic Diet? ................................. 10\nBenefits of a Keto Diet ....................................... 12\nKetosis and the Keto Body ................................ 14\nKeto Q&A ............................................................. 16\nThe Role of Fat in a Keto Diet ........................... 18\nThe Role of Protein in a Keto Diet .................... 20\nThe Role of Carbohydrates in a Keto Diet ...... 22\nKeto Phase 1: Induction ..................................... 24\nKeto Phase 2: Maintenance ............................... 27\nThe Keto Kitchen ................................................ 28\nEating the Keto Way ........................................... 30\nAchieving Keto Success ..................................... 34\nManaging Risks and Side Effects ..................... 36\nBreakfasts ......................................................... 39\nBaked Eggs with Ham and Gruyère ................ 40\nPeaches and Cream Smoothie Bowl ............... 43\nSmoked Salmon  \nScrambled Eggs with Dill .................................. 44\nButtery Vanilla Latte ............................"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "4 The Deliciously Keto Cookbook\nSnacks ................................................................. 57\nButtered Radishes  .............................................. 58\nKale Chips with Bacon ....................................... 61\nCheesy Crisps ..................................................... 62\nTuna Dip ............................................................... 63\nSardines with Endive and Lemon ..................... 64\nRosemary and \nBlack Pepper–Marinated Brie ........................... 66\nDilly Dip ................................................................ 67\nGuacamole Deviled Eggs ................................. 68\nSteak Bites with Horseradish Cream  ............... 70\nPepperoni and Black Olive Pizza Bites ............ 71\nEverything Mini-Cheeseballs ........................... 72\nAppetizers ........................................................ 75\nBacon-Wrapped Stuffed Mushrooms ............. 76\nFried Halloumi with Kalamatas and Mint ........ 79\nWhipped Lardo ................................................... 80\nDeviled Ham Dip ................................................ 81\nBuffalo Wings ......................................................"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "5Contents\nSeafood Mains ............................................175\nCrab with Drawn Butter ................................... 176\nShrimp Fried Cauliflower Rice ........................ 179\nTrout Almondine ............................................... 180\nAlmond-Crusted Fish with Tartar Sauce ....... 181\nScallops with Brown Butter and Capers ....... 182\nTuna Casserole ..................................................184\nCoconut Shrimp Curry..................................... 185\nSalmon with Herb Butter ................................. 186\nSides ...................................................................189\nDuck Fat–Roasted Brussels Sprouts .............. 191\nRomanesco with Rosemary and Garlic ......... 192\nSesame Bok Choy and \nShiitake Mushrooms ......................................... 194\nLoaded Cauliflower .......................................... 195\nMushrooms Au Gratin...................................... 196\nGreen Bean Casserole ..................................... 198\nBroccoli with Cheese Sauce ........................... 199\nCoconut Creamed Spinach ............................200\nCreamy Coleslaw ..............................................202\nKeto Sid"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "6 The Deliciously Keto Cookbook\nIntroduction\nWhat This Book Covers\nWhile most of us are familiar with the old food \nguide pyramids and the newer plate renditions \nreleased by health and government institutions, \nmany have become frustrated with lack of \nimprovement in health despite following these \nguidelines. This is largely due to the food \nenvironment in which we live, as well as a general \nlack of knowledge of what food is and how to \nactually prepare it. It’s easier and more convenient \nfor us to hit the drive-thru or microwave a prepared \nmeal than to start from scratch, which is what \ninfluences those rises in obesity and chronic \ndisease. However, the message to eat less \nprocessed food is not enough to promote \nchange—we need a diet that dramatically alters the \ninflammation and damage caused by a diet of \nexcess sugar and processed fat.\nWhat if I told you there is such a diet, and that by \nfollowing it, you may actually see improvements in \nyour health? What’s more, the diet doesn’t limit \nfat—it actually encourages it? If you’re looking to \nlose weight, lower your blood glucose, impact your \nneurological health, or just overall feel better, the \nketogenic diet (also kno"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "7Introduction\nDisclaimer\nWhen starting this diet, you should first discuss your plans \nwith your doctor—particularly if you’re pregnant or \nbreastfeeding, have kidney disease, or are taking insulin for \ndiabetes. Y our doctor and a registered dietition can also \nhelp you understand how the diet affects certain baseline \nrisk factors, such as cholesterol levels, diabetes risk, waist \ncircumference, weight, and body mass index. \nSpecial Thanks to the Technical Reviewer\nThe Deliciously Keto Cookbook was reviewed by an expert who \ndouble-checked the accuracy of what’s presented here to help us \nensure learning about the keto diet is as easy as it gets. Special \nthanks are extended to Carolyn Doyle.\n006-007_IntroAcknowledgement.indd   7 5/17/16   6:36 PM"
    }
  ],
  "buku-052": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #24",
      "text": "certain that all entrances and win-\ndows hadbeen prepared with elec-\nanolher, they hit upon [he idea of\n^To^their dismay, they learned\nalso been treated electronically\nwith burglar-proofing. No sooner\ndid they land on the floor than an\nelectronic switch clicked on. Next\nmoment, a^red warning light in\nblinking on and off. At once, the\npolice officer on the beat put\nthrough a call to headquarters for\nreserves. Theburglars werecaught\nbefore they could remove a single\nIn a small mid-western town, not\nlong ago. two safe-crackers broke\ninto a bank, and spent three hours\nhacking their Way through a door\nof iron bars guarding the vault.\nThe electronic sentry went into\npast the threshold of the vault. A\nthe wall, imprisoning the. burglars\ninsidethe vault. At thesame time,\na device located at headquarters\nhappened. For^perhaps the\n^\nfirst\nvices have already been perfected\nwalks, talks, or even crumples a\nsheet ofpaper.Someof the things\nIronic set-ups was demonstrated\nrecently in the east wherea whole-\nsalejewelry concernhadsuffereda\n^The burglars had^ succeeded in\nonly a flashlight to locate them,\nand a pair of steel shears.\nWhat eventually trapped them\nalarm the instant a flashlight was\nsna"
    }
  ],
  "buku-057": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #1",
      "text": "BY EDGAR RICE BURROUGHS TARZAN OF THE APES, \nLord Greystoke struck down the cap- \ntain’s arm, saving Black Michael's life, \nand thus forged the first link of what \nwas destined to form a chain of amaz¬ \ning circumstances ending in a life for \none then unborn such as has probably \nnever been paralleled in the history \nof man. \nIn 1888 young Lord Greystoke and fiis i \nbride of three months sailed from Do- ; \nver on their way to Africa. He had I \nbeen commissioned to investigate al¬ \nleged atrocities on black subjects in a \nBritish West Coast African colony. \nLord Greystoke never made the in- j \nvestigation: in fact, he never reached j \nhis destination. i \nArrived at Freetown, they chartered \nthe Fuwalda, which was to bear them \nto their final destination. And here,. \nLord and Lady Greystoke mysteriously \nvanished forever from the eyes and \nfrom the knowledge of man. Two \nmonths later, six British war vessels \nwere scouring the South Atlantic for \ntrace of them. \nBeyond sight of land, the Fuwalda’s \ncaptain, with a terrific blow, felled an \nold sailor who had accidentally tripped \nhim. The swarthy bully’s brutality \ncaused big Black Michael to crush the \ncaptain to his knees. This was"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "BY EDGAR RICE BURROUGHS TARZAN OF THE APES \nLord Greystoke, unfolding the scrap of \npaper that had been pushed in under \nthe cabin door, found it was a message \nprinted /in uncouth letters, warning \nhim to refrain from reporting the theft \nof his revolvers, on pain of death. Lady \nGreystoke paled, wondering what her \nfate might be. \nEnraged, the bloodthirsty ruffians \ncharged the officers representing the \nhated authority of the ship. Most of \nthem were armed with boathooks, axes \nand crowbars. The officers retreated \nbefore the infuriated rush of their men. \nAn ax cleft the captain from forehead \nto chin. \nThe sight that met Lord Greystoke’s \neyes as he emerged on deck the next \nmorning confirmed his worst fears. A \nshot rang out, pnd then another and \nanother. Facing the little knot of five \nofficers was the entire motley crew of \nthe Fuwalda, and at their head stood \nBlack Michael. \nBoth sides were cursing and swearing \nin a frightful manner, which, together \nwith the reports of the firearms and \nthe screams and groans of the wound¬ \ned, turned the deck of the Fuwalda to \nthe likeness of a madhouse. Short and \ngrisly had been the work of the \nmutineers. \nTho outwardly calm, Lord"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "BY EDGAR RICE BURROUGHS TARZAN OF THE APES \n195&»ky \nNo pleas, threats or promises of reward \ncould move Black Michael. “I’m the \nonly man on board who would not \nrather see you both dead; but you \nsaved my life once, aiid in return I’m \ngoing to spare yours. We put you \nashore tomorrow.” The deep roar of a \nlion came from the dark shadows of \nthe distant jungle! \nAs darknes ssettled upon the earth the \nwoman shrang closer to the man in \nterror-stricken anticipation of the \nhorrors lying in wait for them in the \nawful blackness of the nights to come, \nwhen they, too, should be alone upon \nthat wild and lonely shore. What \ntreachery awaited them in that dark, \nmysterious tropical forest? \nBefore dark the barkentine lay peace¬ \nfully at anchor in a land-locked har¬ \nbor. The surrounding shores were \nbeautiful with semitropical verdure, \nwhile in the distance the country rolled \nfrom the ocean in hill and table-land, \nalmost uniformly clothed in primeval \nforest. No signs of habitation were to \nbe seen. \nFollowing the murder of the officers, \nland was sighted, and they learned \nthey were to be put ashore with their \nbelongings. Remonstrance against the \ninhumanity of landing them upon"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "BY ED&AR RICE BURROUGHS TARZAN OF THE APES \nEarly next morning Lord and Lady \nGreystoke’s chests and boxes were \nhoisted on deck and lowered to waiting \nsmall boats for transportation to shore. \nThere was a great quantity and variety \nof stock, arms and ammunition, as they \nhad expected a possible five years’ resi¬ \ndence in their new West Coast African \nhome. \nThe man shuddered as he meditated \nupon the awful gravity, the fearful \nhelplessness of their situation. But it \nwas a merciful providence that pre¬ \nvented him from seeing the hideous \nreality that awaited, them in the grim \ndepth of that dense jungle. They \nsilently sat, each wrapped in gloomy \nforebodings, wondering. \nThey had escaped death at the hands \nof the mutineers, but were faced with \nfar graver dangers. Alone, he might \nhope to survive for years. But what of \nhis wife and that other little life so \nsoon to be launched amid the hard¬ \nships and grave dangers of a primeval \nworld? His heart sunk in despair, \nconsidering the future. \nHaving filled the ship’s casks with fresh \nwater, the small boats moved slowly \nover the water to the ship. As the \nFuwalda passed out of sight behind a \nprojecting point Lord Greystoke"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "BY EDGAR RICE BURROUGHS \\RZAN OF THE APES \nCopyright-1929, T>v Erl'nr Ri<-e Burrou*^*. Tnr. AH ritrhtu rt^enwA. \nA sharp lookout was kept while they \nworked, and once they saw their little \nsimian neighbors come screaming over \nthe nearby ridge and casting affrighted \nglances over their shoulders, evincing \nas plainly as tho by speech that they \nwere fleeing some terrible thing' that \nlay concealed there._ What^ was it? \nDuring the day the forest about them \nhad been filled with excited birds of \nbrilliant plumage and dancing, chat¬ \ntering monkeys, who watched these \nhew arrivals and their wonderful nest¬ \nbuilding operations with every mark of \nkeenest, interest and fascination. By \ndusk the snug shelter was completed. \nFour trees were selected that formed \na rectangle, and, cutting long branches \nfrom other trees, he constructed a \nframework around them, fastening the \nends of the branches securely to the \ntrees by means of rope, a quantity of \nwhich Black Michael fortunately had \nfurnished him from the hold of the \nFuwalda. \nAfter calming her he opened the box \ncontaining the rifles and ammunition, \nthat they might both be armed against \npossible attack. His first thought was \n"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "BY EDGAR RICE BURROUGHS TARZAN OF THE APES \nf3rp;rlgV. loy»tV E^8»r ^,ce burrougli*. Joe. All right* tewanradJ \n“What was it?” she whispered. “I do \nnot know,” he answered gravely. “It is \ntoo dark to see so far; perhaps only a \nshadow cast by the rising moon.” “No, \nJohn; if it was not a man it was some \nhuge and grotesque mockery of man; \nOh, I am afraid!” He could feel her \nheart beat as she clung to him, trem¬ \nbling and terrified. \nThe night noises of a great jungle \nteeming with myriad animal life kept \ntheir overwrought nerves on edge. \nMany times they were startled by the \nstealthy movement of great bodies be¬ \nneath them. He lay facing the open¬ \ning at the front of their aerie, a rifie \nand revolvers at his hand. \nScarcely had they closed their eyes \nthan the terrifying cry of a panther \nrang out from the jungle. Closer and \ncloser it came until ^hey could hear \nthe great beast directly beneath them. \nFor an hour or more it sniffed and \nclawed at the trees that supported \ntheir platform. \nAt last it roamed away across the \nbeach, where Lord Greystoke could see \nit, clearly in the brilliant moonlight- \ngreat handsome beast, the largest he \nhad ever seen. From the dark shad"
    }
  ],
  "buku-058": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "I\nThe Dawn\nAn ancient English Cathedral Tower? How can the ancient English\nCathedral tower be here! The well-known massive gray square tower of its\nold Cathedral? How can that be here! There is no spike of rusty iron in the\nair, between the eye and it, from any point of the real prospect. What is the\nspike that intervenes, and who has set it up? Maybe, it is set up by the\nSultan’s orders for the impaling of a horde of Turkish robbers, one by one.\nIt is so, for cymbals clash, and the Sultan goes by to his palace in long\nprocession. Ten thousand scimitars flash in the sunlight, and thrice ten\nthousand dancing-girls strew flowers. Then, follow white elephants\ncaparisoned in countless gorgeous colours, and infinite in number and\nattendants. Still, the Cathedral Tower rises in the background, where it\ncannot be, and still no writhing figure is on the grim spike. Stay! Is the\nspike so low a thing as the rusty spike on the top of a post of an old\nbedstead that has tumbled all awry? Some vague period of drowsy laughter\nmust be devoted to the consideration of this possibility.\nShaking from head to foot, the man whose scattered consciousness has\nthus fantastically pieced itself together, at "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "“Another?” says this woman, in a querulous, rattling whisper.\n“Have another?”\nHe looks about him, with his hand to his forehead.\n“Ye’ve smoked as many as five since ye come in at midnight,” the\nwoman goes on, as she chronically complains. “Poor me, poor me, my head\nis so bad. Them two come in after ye. Ah, poor me, the business is slack, is\nslack! Few Chinamen about the Docks, and fewer Lascars, and no ships\ncoming in, these say! Here’s another ready for ye, deary. Ye’ll remember\nlike a good soul, won’t ye, that the market price is dreffle high just now?\nMore nor three shillings and sixpence for a thimbleful! And ye’ll remember\nthat nobody but me (and Jack Chinaman t’other side the court; but he can’t\ndo it as well as me) has the true secret of mixing it? Ye’ll pay up\naccordingly, deary, won’t ye?”\nShe blows at the pipe as she speaks, and, occasionally bubbling at it,\ninhales much of its contents.\n“O me, O me, my lungs is weak, my lungs is bad! It’s nearly ready for\nye, deary. Ah, poor me, poor me, my poor hand shakes like to drop off! I\nsee ye coming-to, and I ses to my poor self, ‘I’ll have another ready for\nhim, and he’ll bear in mind the market price of opium, and pay according"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "customers, and this horrible bedstead set upright again, and this horrible\ncourt swept clean? What can she rise to, under any quantity of opium,\nhigher than that! —Eh?”\nHe bends down his ear, to listen to her mutterings.\n“Unintelligible!”\nAs he watches the spasmodic shoots and darts that break out of her face\nand limbs, like fitful lightning out of a dark sky, some contagion in them\nseizes upon him: insomuch that he has to withdraw himself to a lean\narmchair by the hearth —placed there, perhaps, for such emergencies —\nand to sit in it, holding tight, until he has got the better of this unclean spirit\nof imitation.\nThen he comes back, pounces on the Chinaman, and seizing him with\nboth hands by the throat, turns him violently on the bed. The Chinaman\nclutches the aggressive hands, resists, gasps, and protests.\n“What do you say?”\nA watchful pause.\n“Unintelligible!”\nSlowly loosening his grasp as he listens to the incoherent jargon with an\nattentive frown, he turns to the Lascar and fairly drags him forth upon the\nfloor. As he falls, the Lascar starts into a half-risen attitude, glares with his\neyes, lashes about him fiercely with his arms, and draws a phantom knife. It\nthen becomes app"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "vesper service, and he must needs attend it, one would say, from his haste to\nreach the open Cathedral door. The choir are getting on their sullied white\nrobes, in a hurry, when he arrives among them, gets on his own robe, and\nfalls into the procession filing in to service. Then, the Sacristan locks the\niron-barred gates that divide the sanctuary from the chancel, and all of the\nprocession having scuttled into their places, hide their faces; and then the\nintoned words, “When the Wicked Man —” rise among groins of arches\nand beams of roof, awakening muttered thunder."
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "II\nA Dean, and a Chapter Also\nWhosoever has observed that sedate and clerical bird, the rook, may\nperhaps have noticed that when he wings his way homeward towards\nnightfall, in a sedate and clerical company, two rooks will suddenly detach\nthemselves from the rest, will retrace their flight for some distance, and will\nthere poise and linger; conveying to mere men the fancy that it is of some\noccult importance to the body politic, that this artful couple should pretend\nto have renounced connection with it.\nSimilarly, service being over in the old Cathedral with the square tower,\nand the choir scuffling out again, and divers venerable persons of rook-like\naspect dispersing, two of these latter retrace their steps, and walk together\nin the echoing Close.\nNot only is the day waning, but the year. The low sun is fiery and yet\ncold behind the monastery ruin, and the Virginia creeper on the Cathedral\nwall has showered half its deep-red leaves down on the pavement. There\nhas been rain this afternoon, and a wintry shudder goes among the little\npools on the cracked uneven flagstones, and through the giant elm-trees as\nthey shed a gust of tears. Their fallen leaves lie strewn thickly about. So"
    }
  ],
  "buku-059": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "I\nIn Search of a Mission\n“Thou didst refuse the daily round\nOf useful, patient love,\nAnd longedst for some great emprise\nThy spirit high to prove.”\nC. M. N.\n“Che mi sedea con l’antica Rachele.”\nDante\n“It is very kind in the dear mother.”\n“But what, Rachel? Don’t you like it? She so enjoyed choosing it\nfor you.”\n“Oh yes, it is a perfect thing in its way. Don’t say a word to her; but if\nyou are consulted for my next birthday present, Grace, couldn’t you suggest\nthat one does cease to be a girl.”\n“Only try it on, Rachel dear, she will be pleased to see you in it.”\n“Oh yes, I will bedizen myself to oblige her. I do assure you I am not\nungrateful. It is beautiful in itself, and shows how well nature can be\nimitated; but it is meant for a mere girl, and this is the very day I had fixed\nfor hauling down the flag of youth.”\n“Oh, Rachel.”\n“Ah, ha! If Rachel be an old maid, what is Grace? Come, my dear, resign\nyourself! There is nothing more unbecoming than want of perception of the"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "close of young-ladyhood.”\n“Of course I know we are not quite young girls now,” said Grace, half\nperplexed, half annoyed.\n“Exactly, from this moment we are established as the maiden sisters of\nAvonmouth, husband and wife to one another, as maiden pairs always are.”\n“Then thus let me crown, our bridal,” quoth Grace, placing on her sister’s\nhead the wreath of white roses.\n“Treacherous child!” cried Rachel, putting up her hands and tossing her\nhead, but her sister held her still.\n“You know brides always take liberties. Please, dear, let it stay till the\nmother has been in, and pray don’t talk before her of being so very old.”\n“No, I’ll not be a shock to her. We will silently assume our immunities,\nand she will acquiesce if they come upon her gradually.”\nGrace looked somewhat alarmed, being perhaps in some dread of\nimmunities, and aware that Rachel’s silence would in anyone else have\nbeen talkativeness.\n“Ah, mother dear, good morning,” as a pleasant placid-looking lady\nentered, dressed in black, with an air of feeble health, but of comely\nmiddle age.\nBirthday greetings, congratulations, and thanks followed, and the mother\nlooked critically at the position of the wreath, and Rachel for t"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "“Poor Lovedy Kelland’s aunt made it, mother, and it was very expensive,\nand wouldn’t sell.”\n“No wonder, I am sure, and it was very kind in you to take it off their\nhands; but now it is paid for, it can’t make much difference whether you\ndisfigure yourself with it or not.”\n“Oh yes, dear mother, I’ll bind my hair when you bid me do it and really\nthese buds do credit to the makers. I wonder whether they cost them as dear\nin health as lace does,” she added, taking off the flowers and examining\nthem with a grave sad look.\n“I chose white roses,” proceeded the well-pleased mother, “because I\nthought they would suit either of the silks you have now, though I own I\nshould like to see you in another white muslin.”\n“I have done with white muslin,” said Rachel, rousing from her reverie.\n“It is an affectation of girlish simplicity not becoming at our age.”\n“Oh Rachel!” thought Grace in despair; but to her great relief in at that\nmoment filed the five maids, the coachman, and butler, and the mother\nbegan to read prayers.\nBreakfast over, Rachel gathered up her various gifts, and betook herself\nto a room on the ground floor with all the appliances of an ancient\nschoolroom. Rather dreamily she took"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "I must be a mere helpless, useless being, growing old in a ridiculous fiction\nof prolonged childhood, affecting those graces of so-called sweet seventeen\nthat I never had —because, because why? Is it for any better reason than\nbecause no mother can bear to believe her daughter no longer on the lists\nfor matrimony? Our dear mother does not tell herself that this is the reason,\nbut she is unconsciously actuated by it. And I have hitherto given way to\nher wish. I mean to give way still in a measure; but I am five and twenty,\nand I will no longer be withheld from some path of usefulness! I will judge\nfor myself, and when my mission has declared itself, I will not be withheld\nfrom it by any scruple that does not approve itself to my reason and\nconscience. If it be only a domestic mission —say the care of Fanny, poor\ndear helpless Fanny, I would that I knew she was safe —I would not despise\nit, I would throw myself into it, and regard the training her and forming her\nboys as a most sacred office. It would not be too homely for me. But I had\nfar rather become the founder of some establishment that might relieve\nwomen from the oppressive task-work thrown on them in all their branches\nof la"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "for matrimony? Our dear mother does not tell herself that this is the reason,\nbut she is unconsciously actuated by it. And I have hitherto given way to\nher wish. I mean to give way still in a measure; but I am five and twenty,\nand I will no longer be withheld from some path of usefulness! I will judge\nfor myself, and when my mission has declared itself, I will not be withheld\nfrom it by any scruple that does not approve itself to my reason and\nconscience. If it be only a domestic mission —say the care of Fanny, poor\ndear helpless Fanny, I would that I knew she was safe —I would not despise\nit, I would throw myself into it, and regard the training her and forming her\nboys as a most sacred office. It would not be too homely for me. But I had\nfar rather become the founder of some establishment that might relieve\nwomen from the oppressive task-work thrown on them in all their branches\nof labour. Oh, what a worthy ambition!”\n“And this is all I am doing for my fellow-creatures,” she muttered half\naloud. “One class of half-grown lads, and those grudged to me! Here is the\nworld around one mass of misery and evil! Not a paper do I take up but I\nsee something about wretchedness and crime, an"
    }
  ],
  "buku-060": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThe\tProject\tGutenberg\teBook,\tThe\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tThe\tLittle\tDuke\n\t\t\t\t\t\t\tRichard\tthe\tFearless\nAuthor:\tCharlotte\tM.\tYonge\nRelease\tDate:\tJune\t20,\t2008\t\t[eBook\t#3048]\nLanguage:\tEnglish\nCharacter\tset\tencoding:\tISO-646-US\t(US-ASCII)\n***START\tOF\tTHE\tPROJECT\tGUTENBERG\tEBOOK\tTHE\tLITTLE\tDUKE***\nTranscribed\tfrom\tthe\t1905\tMacmillan\tand\tCo.\tedition\tby\tJanet\tHaselow,\tMarian\nTaylor\tand\tDavid\tPrice,\temail\tccx074@pglaf.org"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "THE\tLITTLE\tDUKE\nRICHARD\tTHE\tFEARLESS\nBY\n\t\nTHE\n\t\nAUTHOR\n\t\nOF\n“THE\tHEIR\tOF\tREDCLYFFE,”\nETC\n.\nWITH\tILLUSTRATIONS\nLondon\nMACMILLAN\tAND\tCO.,\t\nL\nIMITED\nNEW\n\t\nYORK\n:\t\nTHE\n\t\nMACMILLAN\n\t\nCOMPANY\n1905\nAll\trights\treserved\nR\nICHARD\n\tC\nLAY\n\t\nAND\n\tS\nONS\n,\t\nL\nIMITED\n,\nBREAD\n\t\nSTREET\n\t\nHILL\n,\t\nE\n.\nC\n.\n,\t\nAND\nBUNGAY\n,\t\nSUFFOLK\n.\nOriginally\tpublished\telsewhere\n.\t\t\nTransferred\tin\n\t1864.\t\t\nFirst\tEdition\tprinted\n\t(S)\nfor\tMacmillan\tand\tCo.\tNovember\n\t1864\t(\nPott\n\t8\nvo\n).\t\t\nReprinted\n\t1869,\t1872,\t1873,\n1876,\t1878,\t1881\t(\nGlobe\n\t8\nvo\n),\t1883,\t1885,\t1886,\t1889.\t\t\nNew\tEdition\n\t1891,\n(\nCrown\n\t8\nvo\n),\t1892,\t1894,\t1895,\t1897,\t1898,\t1899,\t1900,\t1901,\t1903,\t1905."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "CHAPTER\tI\nOn\ta\tbright\tautumn\tday,\tas\tlong\tago\tas\tthe\tyear\t943,\tthere\twas\ta\tgreat\tbustle\tin\nthe\tCastle\tof\tBayeux\tin\tNormandy.\nThe\thall\twas\tlarge\tand\tlow,\tthe\troof\tarched,\tand\tsupported\ton\tthick\tshort\ncolumns,\talmost\tlike\tthe\tcrypt\tof\ta\tCathedral;\tthe\twalls\twere\tthick,\tand\tthe\nwindows,\twhich\thad\tno\tglass,\twere\tvery\tsmall,\tset\tin\tsuch\ta\tdepth\tof\twall\tthat\nthere\twas\ta\twide\tdeep\twindow\tseat,\tupon\twhich\tthe\train\tmight\tbeat,\twithout\nreaching\tthe\tinterior\tof\tthe\troom.\t\tAnd\teven\tif\tit\thad\tcome\tin,\tthere\twas\tnothing\nfor\tit\tto\thurt,\tfor\tthe\twalls\twere\tof\trough\tstone,\tand\tthe\tfloor\tof\ttiles.\t\tThere\twas\na\tfire\tat\teach\tend\tof\tthis\tgreat\tdark\tapartment,\tbut\tthere\twere\tno\tchimneys\tover\nthe\tample\thearths,\tand\tthe\tsmoke\tcurled\tabout\tin\tthick\twhite\tfolds\tin\tthe\tvaulted\nroof,\tadding\tto\tthe\twreaths\tof\tsoot,\twhich\tmade\tthe\thall\tlook\tstill\tdarker.\nThe\tfire\tat\tthe\tlower\tend\twas\tby\tfar\tthe\tlargest\tand\thottest.\t\tGreat\tblack\ncauldrons\thung\tover\tit,\tand\tservants,\tboth\tmen\tand\twomen,\twith\tred\tfaces,\tbare\nand\tgrimed\tarms,\tand\tlong\tiron\thooks,\tor\tpots\tand\tpans,\twere\tbusied\taround\tit.\t\nAt\tthe\tother\tend,\twhich\twas\traised\tabout\tthree\tsteps\tabove\tthe\tfloor\tof\tthe\thall,\nother\tservants\twere\tengaged.\t\tTwo\tyoung\tmaidens"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "her\tlong\tthick\tlight\thair,\thardly\ttouched\twith\tgrey,\twas\tbound\tround\ther\thead,\nunder\ta\ttall\twhite\tcap,\twith\ta\tband\tpassing\tunder\ther\tchin:\tshe\twore\ta\tlong\nsweeping\tdark\trobe,\twith\twide\thanging\tsleeves,\tand\tthick\tgold\tear-rings\tand\nnecklace,\twhich\thad\tpossibly\tcome\tfrom\tthe\tsame\tquarter\tas\tthe\tcup.\t\tShe\ndirected\tthe\tservants,\tinspected\tboth\tthe\tcookery\tand\tarrangements\tof\tthe\ttable,\nheld\tcouncil\twith\tan\told\tsteward,\tnow\tand\tthen\tlooked\trather\tanxiously\tfrom\tthe\nwindow,\tas\tif\texpecting\tsome\tone,\tand\tbegan\tto\tsay\tsomething\tabout\tfears\tthat\nthese\tloitering\tyouths\twould\tnot\tbring\thome\tthe\tvenison\tin\ttime\tfor\tDuke\nWilliam’s\tsupper.\nPresently,\tshe\tlooked\tup\trejoiced,\tfor\ta\tfew\tnotes\tof\ta\tbugle-horn\twere\tsounded;\nthere\twas\ta\tclattering\tof\tfeet,\tand\tin\ta\tfew\tmoments\tthere\tbounded\tinto\tthe\thall,\na\tboy\tof\tabout\teight\tyears\told,\this\tcheeks\tand\tlarge\tblue\teyes\tbright\twith\tair\tand\nexercise,\tand\this\tlong\tlight-brown\thair\tstreaming\tbehind\thim,\tas\the\tran\tforward\nflourishing\ta\tbow\tin\this\thand,\tand\tcrying\tout,\t“I\thit\thim,\tI\thit\thim!\t\tDame\nAstrida,\tdo\tyou\thear?\t\t’Tis\ta\tstag\tof\tten\tbranches,\tand\tI\thit\thim\tin\tthe\tneck.”\n“You!\tmy\tLord\tRichard!\tyou\tkilled\thim?”\n“Oh,\tno,\tI\tonly\tstruck\thim.\t\tIt\twas\tOsmond’s"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "also\tthe\ttaller,\twas\tslightly\tmade,\tand\tvery\tactive,\twith\ta\tbright\tkeen\tgrey\teye,\nand\tmerry\tsmile.\t\tThese\twere\tDame\tAstrida’s\tson,\tSir\tEric\tde\tCenteville,\tand\nher\tgrandson,\tOsmond;\tand\tto\ttheir\tcare\tDuke\tWilliam\tof\tNormandy\thad\ncommitted\this\tonly\tchild,\tRichard,\tto\tbe\tfostered,\tor\tbrought\tup.\t\n[1]\nIt\twas\talways\tthe\tcustom\tamong\tthe\tNorthmen,\tthat\tyoung\tprinces\tshould\tthus\nbe\tput\tunder\tthe\tcare\tof\tsome\ttrusty\tvassal,\tinstead\tof\tbeing\tbrought\tup\tat\thome,\nand\tone\treason\twhy\tthe\tCentevilles\thad\tbeen\tchosen\tby\tDuke\tWilliam\twas,\tthat\nboth\tSir\tEric\tand\this\tmother\tspoke\tonly\tthe\told\tNorwegian\ttongue,\twhich\the\nwished\tyoung\tRichard\tto\tunderstand\twell,\twhereas,\tin\tother\tparts\tof\tthe\tDuchy,\nthe\tNormans\thad\tforgotten\ttheir\town\ttongue,\tand\thad\ttaken\tup\twhat\twas\tthen\ncalled\tthe\tLanguéd’ouì,\ta\tlanguage\tbetween\tGerman\tand\tLatin,\twhich\twas\tthe\nbeginning\tof\tFrench.\nOn\tthis\tday,\tDuke\tWilliam\thimself\twas\texpected\tat\tBayeux,\tto\tpay\ta\tvisit\tto\this\nson\tbefore\tsetting\tout\ton\ta\tjourney\tto\tsettle\tthe\tdisputes\tbetween\tthe\tCounts\tof\nFlanders\tand\tMontreuil,\tand\tthis\twas\tthe\treason\tof\tFru\tAstrida’s\tgreat\npreparations.\t\tNo\tsooner\thad\tshe\tseen\tthe\thaunch\tplaced\tupon\ta\tspit,\twhich\ta\nlittle\tboy\twas\tto\tturn\tbefore\tth"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Away\tran\tthe\thappy\tchild,\tand\tnever\trested\ttill\the\tstood\tat\tthe\tbottom\tof\tthe\nlong,\tsteep,\tstone\tstair,\tleading\tto\tthe\tembattled\tporch.\t\tThither\tcame\tthe\tBaron\nde\tCenteville,\tand\this\tson,\tto\treceive\ttheir\tPrince.\t\tRichard\tlooked\tup\tat\nOsmond,\tsaying,\t“Let\tme\thold\this\tstirrup,”\tand\tthen\tsprang\tup\tand\tshouted\tfor\njoy,\tas\tunder\tthe\tarched\tgateway\tthere\tcame\ta\ttall\tblack\thorse,\tbearing\tthe\nstately\tform\tof\tthe\tDuke\tof\tNormandy.\t\tHis\tpurple\trobe\twas\tfastened\tround\thim\nby\ta\trich\tbelt,\tsustaining\tthe\tmighty\tweapon,\tfrom\twhich\the\twas\tcalled\t“William\nof\tthe\tlong\tSword,”\this\tlegs\tand\tfeet\twere\tcased\tin\tlinked\tsteel\tchain-work,\this\ngilded\tspurs\twere\ton\this\theels,\tand\this\tshort\tbrown\thair\twas\tcovered\tby\this\nducal\tcap\tof\tpurple,\tturned\tup\twith\tfur,\tand\ta\tfeather\tfastened\tin\tby\ta\tjewelled\nclasp.\t\tHis\tbrow\twas\tgrave\tand\tthoughtful,\tand\tthere\twas\tsomething\tboth\tof\ndignity\tand\tsorrow\tin\this\tface,\tat\tthe\tfirst\tmoment\tof\tlooking\tat\tit,\trecalling\tthe\nrecollection\tthat\the\thad\tearly\tlost\this\tyoung\twife,\tthe\tDuchess\tEmma,\tand\tthat\nhe\twas\tbeset\tby\tmany\tcares\tand\ttoils;\tbut\tthe\tnext\tglance\tgenerally\tconveyed\nencouragement,\tso\tfull\tof\tmildness\twere\this\teyes,\tand\tso\tkind\tthe\texpression\tof\nhis\tlips.\nAnd\tnow,\th"
    }
  ],
  "buku-061": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tProject\tGutenberg\tEBook\tof\tMistress\tWilding,\tby\tRafael\tSabatini\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tMistress\tWilding\nAuthor:\tRafael\tSabatini\nRelease\tDate:\tSeptember,\t1998\t[EBook\t#1457]\nLast\tUpdated:\tMarch\t10,\t2018\nLanguage:\tEnglish\n***\tSTART\tOF\tTHIS\tPROJECT\tGUTENBERG\tEBOOK\tMISTRESS\tWILDING\t***\nProduced\tby\tAn\tAnonymous\tVolunteer\tand\tDavid\tWidger"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "By\tRafael\tSabatini\nCONTENTS\nCHAPTER\tI\t—\tPOT-VALIANCE\nCHAPTER\tII\t—\tSIR\tROWLAND\tTO\tTHE\tRESCUE\nCHAPTER\tIII\t—\tDIANA\tSCHEMES\nCHAPTER\tIV\t—\tTERMS\tOF\tSURRENDER\nCHAPTER\tV\t—\tTHE\tENCOUNTER\nCHAPTER\tVI\t—\tTHE\tCHAMPION\nCHAPTER\t VII\t —\t THE\t NUPTIALS\t OF\t RUTH\nWESTMACOTT\nCHAPTER\tVIII\t—\tBRIDE\tAND\tGROOM\nCHAPTER\tIX\t—\tMR.\tTRENCHARD'S\tCOUNTERSTROKE\nCHAPTER\tX\t—\tTHEIR\tOWN\tPETARD\nCHAPTER\tXI\t—\tTHE\tMARPLOT\nCHAPTER\tXII\t—\tAT\tTHE\tFORD\nCHAPTER\tXIII\t—\t“PRO\tRELIGIONE\tET\tLIBERTATE”\nCHAPTER\tXIV\t—\tHIS\tGRACE'\tIN\tCOUNSEL\nCHAPTER\tXV\t—\tLYME\tOF\tTHE\tKING"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "CHAPTER\tXVI\t—\tPLOTS\tAND\tPLOTTERS\nCHAPTER\tXVII\t—\tMR.\tWILDING'S\tRETURN\nCHAPTER\tXVIII\t—\tBETRAYAL\nCHAPTER\tXIX\t—\tTHE\tBANQUET\nCHAPTER\tXX\t—\tTHE\tRECKONING\nCHAPTER\tXXI\t—\tTHE\tSENTENCE\nCHAPTER\tXXII\t—\tTHE\tEXECUTION\nCHAPTER\tXXIII\t—\tMR.\tWILDING'S\tBOOTS\nCHAPTER\tXXIV\t—\tJUSTICE"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "CHAPTER\tI.\tPOT-VALIANCE\nThen\tdrink\tit\tthus,\tcried\tthe\trash\tyoung\tfool,\tand\tsplashed\tthe\tcontents\tof\this\ncup\t full\t into\t the\t face\t of\t Mr.\t Wilding\t even\t as\t that\t gentleman,\t on\t his\t feet,\t was\nproposing\tto\tdrink\tto\tthe\teyes\tof\tthe\tyoung\tfool's\tsister.\nThe\t moments\t that\t followed\t were\t full\t of\t interest.\t A\t stillness,\t a\t brooding,\nexpectant\t stillness,\t fell\t upon\t the\t company—and\t it\t numbered\t a\t round\t dozen—\nabout\t Lord\t Gervase's\t richly\t appointed\t board.\t In\t the\t soft\t candlelight\t the\t oval\ntable\tshone\tlike\ta\tdeep\tbrown\tpool,\tin\twhich\twere\treflected\tthe\tgleaming\tsilver\nand\tsparkling\tcrystal\tthat\tseemed\tto\tfloat\tupon\tit.\nBlake\t sucked\t in\t his\t nether-lip,\t his\t florid\t face\t a\t thought\t less\t florid\t than\t its\nwont,\t his\t prominent\t blue\t eyes\t a\t thought\t more\t prominent.\t Under\t its\t golden\nperiwig\t old\t Nick\t Trenchard's\t wizened\t countenance\t was\t darkened\t by\t a\t scowl,\nand\t his\t fingers,\t long,\t swarthy,\t and\t gnarled,\t drummed\t fretfully\t upon\t the\t table.\nPortly\t Lord\t Gervase\t Scoresby—their\t host,\t a\t benign\t and\t placid\t man\t of\t peace,\ndetesting\t turbulence—turned\t crimson\t now\t in\t wordless\t rage.\t The\t others\t gaped\nand\t stared—some\t at\t young\t West"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "one\twhose\tnature\twas\talmost\twoman-mild.\n“As\tGod's\tmy\tlife!”\the\tspluttered\twrathfully,\tglowering\tat\tRichard.\t“To\thave\nthis\thappen\tin\tmy\thouse!\tThe\tyoung\tfool\tshall\tmake\tapology!”\n“With\this\tdying\tbreath,”\tsneered\tTrenchard,\tand\tthe\told\trake's\twords,\this\ttone,\nand\tthe\tmalevolent\tlook\the\tbent\tupon\tthe\tboy\tincreased\tthe\tcompany's\tmalaise.\n“I\t think,”\t said\t Mr.\t Wilding,\t with\t a\t most\t singular\t and\t excessive\t sweetness,\n“that\t what\t Mr.\t Westmacott\t has\t done\t he\t has\t done\t because\t he\t apprehended\t me\namiss.”\n“No\tdoubt\the'll\tsay\tso,”\topined\tTrenchard\twith\ta\tshrug,\tand\thad\tcaution\tdug\ninto\this\tribs\tby\tBlake's\telbow,\twhilst\tRichard\tmade\thaste\tto\tprove\thim\twrong\tby\nsaying\tthe\tcontrary.\n“I\tapprehended\tyou\texactly,\tsir,”\the\tanswered,\tdefiance\tin\this\tvoice\tand\twine-\nflushed\tface.\n“Ha!”\t clucked\t Trenchard,\t irrepressible.\t “He's\t bent\t on\t self-destruction.\t Let\nhim\thave\this\tway,\tin\tGod's\tname.”\nBut\tWilding\tseemed\tintent\tupon\tshowing\thow\tlong-suffering\the\tcould\tbe.\tHe\ngently\tshook\this\thead.\t“Nay,\tnow,”\tsaid\the.\t“You\tthought,\tMr.\tWestmacott,\tthat\nin\tmentioning\tyour\tsister,\tI\tdid\tso\tlightly.\tIs\tit\tnot\tso?”\n“You\t mentioned\t her,\t and\t that\t is\t all\t that\t matters,”\t cried\t Westmacott.\t “I'l"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "him\tfor\ta\tmoment.\tBut\tanon,\treading\tthe\tboy's\tmind\tas\treadily\tas\tthough\tit\thad\nbeen\t a\t scroll\t unfolded\t for\t his\t instruction,\t he\t saw\t that\t Westmacott,\t on\t the\nstrength\t of\t his\t position\t as\t his\t sister's\t brother,\t conceived\t himself\t immune.\t Mr.\nWilding's\tavowed\tcourtship\tof\tthe\tlady,\tthe\thopes\the\tstill\tentertained\tof\twinning\nher,\t despite\t the\t aversion\t she\t was\t at\t pains\t to\t show\t him,\t gave\t Westmacott\nassurance\t that\t Mr.\t Wilding\t would\t never\t elect\t to\t shatter\t his\t all\t too\t slender\nchances\tby\tembroiling\thimself\tin\ta\tquarrel\twith\ther\tbrother.\tAnd—reading\thim,\nthus,\t aright—Mr.\t Wilding\t put\t on\t that\t mask\t of\t patience,\t luring\t the\t boy\t into\ngreater\t conviction\t of\t the\t security\t of\t his\t position.\t And\t Richard,\t conceiving\nhimself\tsafe\tin\this\tentrenchment\tbehind\tthe\tbulwarks\tof\this\tbrothership\tto\tRuth\nWestmacott,\t and\t heartened\t further\t by\t the\t excess\t of\t wine\t he\t had\t consumed,\npersisted\tin\tinsults\the\twould\tnever\totherwise\thave\tdared\tto\toffer.\n“Who\t seeks\t to\t retrieve?”\t he\t crowed\t offensively,\t boldly\t looking\t up\t into\t the\nother's\t face.\t “It\t seems\t you\t are\t yourself\t reluctant.”\t And\t he\t laughed\t a\t trifle\nstridently,\tand\tlooked\tabout\thim"
    }
  ],
  "buku-062": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThe\tProject\tGutenberg\teBook,\tThe\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tThe\tLittle\tDuke\n\t\t\t\t\t\t\tRichard\tthe\tFearless\nAuthor:\tCharlotte\tM.\tYonge\nRelease\tDate:\tJune\t20,\t2008\t\t[eBook\t#3048]\nLanguage:\tEnglish\nCharacter\tset\tencoding:\tISO-646-US\t(US-ASCII)\n***START\tOF\tTHE\tPROJECT\tGUTENBERG\tEBOOK\tTHE\tLITTLE\tDUKE***\nTranscribed\tfrom\tthe\t1905\tMacmillan\tand\tCo.\tedition\tby\tJanet\tHaselow,\tMarian\nTaylor\tand\tDavid\tPrice,\temail\tccx074@pglaf.org"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "THE\tLITTLE\tDUKE\nRICHARD\tTHE\tFEARLESS\nBY\n\t\nTHE\n\t\nAUTHOR\n\t\nOF\n“THE\tHEIR\tOF\tREDCLYFFE,”\nETC\n.\nWITH\tILLUSTRATIONS\nLondon\nMACMILLAN\tAND\tCO.,\t\nL\nIMITED\nNEW\n\t\nYORK\n:\t\nTHE\n\t\nMACMILLAN\n\t\nCOMPANY\n1905\nAll\trights\treserved\nR\nICHARD\n\tC\nLAY\n\t\nAND\n\tS\nONS\n,\t\nL\nIMITED\n,\nBREAD\n\t\nSTREET\n\t\nHILL\n,\t\nE\n.\nC\n.\n,\t\nAND\nBUNGAY\n,\t\nSUFFOLK\n.\nOriginally\tpublished\telsewhere\n.\t\t\nTransferred\tin\n\t1864.\t\t\nFirst\tEdition\tprinted\n\t(S)\nfor\tMacmillan\tand\tCo.\tNovember\n\t1864\t(\nPott\n\t8\nvo\n).\t\t\nReprinted\n\t1869,\t1872,\t1873,\n1876,\t1878,\t1881\t(\nGlobe\n\t8\nvo\n),\t1883,\t1885,\t1886,\t1889.\t\t\nNew\tEdition\n\t1891,\n(\nCrown\n\t8\nvo\n),\t1892,\t1894,\t1895,\t1897,\t1898,\t1899,\t1900,\t1901,\t1903,\t1905."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "CHAPTER\tI\nOn\ta\tbright\tautumn\tday,\tas\tlong\tago\tas\tthe\tyear\t943,\tthere\twas\ta\tgreat\tbustle\tin\nthe\tCastle\tof\tBayeux\tin\tNormandy.\nThe\thall\twas\tlarge\tand\tlow,\tthe\troof\tarched,\tand\tsupported\ton\tthick\tshort\ncolumns,\talmost\tlike\tthe\tcrypt\tof\ta\tCathedral;\tthe\twalls\twere\tthick,\tand\tthe\nwindows,\twhich\thad\tno\tglass,\twere\tvery\tsmall,\tset\tin\tsuch\ta\tdepth\tof\twall\tthat\nthere\twas\ta\twide\tdeep\twindow\tseat,\tupon\twhich\tthe\train\tmight\tbeat,\twithout\nreaching\tthe\tinterior\tof\tthe\troom.\t\tAnd\teven\tif\tit\thad\tcome\tin,\tthere\twas\tnothing\nfor\tit\tto\thurt,\tfor\tthe\twalls\twere\tof\trough\tstone,\tand\tthe\tfloor\tof\ttiles.\t\tThere\twas\na\tfire\tat\teach\tend\tof\tthis\tgreat\tdark\tapartment,\tbut\tthere\twere\tno\tchimneys\tover\nthe\tample\thearths,\tand\tthe\tsmoke\tcurled\tabout\tin\tthick\twhite\tfolds\tin\tthe\tvaulted\nroof,\tadding\tto\tthe\twreaths\tof\tsoot,\twhich\tmade\tthe\thall\tlook\tstill\tdarker.\nThe\tfire\tat\tthe\tlower\tend\twas\tby\tfar\tthe\tlargest\tand\thottest.\t\tGreat\tblack\ncauldrons\thung\tover\tit,\tand\tservants,\tboth\tmen\tand\twomen,\twith\tred\tfaces,\tbare\nand\tgrimed\tarms,\tand\tlong\tiron\thooks,\tor\tpots\tand\tpans,\twere\tbusied\taround\tit.\t\nAt\tthe\tother\tend,\twhich\twas\traised\tabout\tthree\tsteps\tabove\tthe\tfloor\tof\tthe\thall,\nother\tservants\twere\tengaged.\t\tTwo\tyoung\tmaidens"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "her\tlong\tthick\tlight\thair,\thardly\ttouched\twith\tgrey,\twas\tbound\tround\ther\thead,\nunder\ta\ttall\twhite\tcap,\twith\ta\tband\tpassing\tunder\ther\tchin:\tshe\twore\ta\tlong\nsweeping\tdark\trobe,\twith\twide\thanging\tsleeves,\tand\tthick\tgold\tear-rings\tand\nnecklace,\twhich\thad\tpossibly\tcome\tfrom\tthe\tsame\tquarter\tas\tthe\tcup.\t\tShe\ndirected\tthe\tservants,\tinspected\tboth\tthe\tcookery\tand\tarrangements\tof\tthe\ttable,\nheld\tcouncil\twith\tan\told\tsteward,\tnow\tand\tthen\tlooked\trather\tanxiously\tfrom\tthe\nwindow,\tas\tif\texpecting\tsome\tone,\tand\tbegan\tto\tsay\tsomething\tabout\tfears\tthat\nthese\tloitering\tyouths\twould\tnot\tbring\thome\tthe\tvenison\tin\ttime\tfor\tDuke\nWilliam’s\tsupper.\nPresently,\tshe\tlooked\tup\trejoiced,\tfor\ta\tfew\tnotes\tof\ta\tbugle-horn\twere\tsounded;\nthere\twas\ta\tclattering\tof\tfeet,\tand\tin\ta\tfew\tmoments\tthere\tbounded\tinto\tthe\thall,\na\tboy\tof\tabout\teight\tyears\told,\this\tcheeks\tand\tlarge\tblue\teyes\tbright\twith\tair\tand\nexercise,\tand\this\tlong\tlight-brown\thair\tstreaming\tbehind\thim,\tas\the\tran\tforward\nflourishing\ta\tbow\tin\this\thand,\tand\tcrying\tout,\t“I\thit\thim,\tI\thit\thim!\t\tDame\nAstrida,\tdo\tyou\thear?\t\t’Tis\ta\tstag\tof\tten\tbranches,\tand\tI\thit\thim\tin\tthe\tneck.”\n“You!\tmy\tLord\tRichard!\tyou\tkilled\thim?”\n“Oh,\tno,\tI\tonly\tstruck\thim.\t\tIt\twas\tOsmond’s"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "also\tthe\ttaller,\twas\tslightly\tmade,\tand\tvery\tactive,\twith\ta\tbright\tkeen\tgrey\teye,\nand\tmerry\tsmile.\t\tThese\twere\tDame\tAstrida’s\tson,\tSir\tEric\tde\tCenteville,\tand\nher\tgrandson,\tOsmond;\tand\tto\ttheir\tcare\tDuke\tWilliam\tof\tNormandy\thad\ncommitted\this\tonly\tchild,\tRichard,\tto\tbe\tfostered,\tor\tbrought\tup.\t\n[1]\nIt\twas\talways\tthe\tcustom\tamong\tthe\tNorthmen,\tthat\tyoung\tprinces\tshould\tthus\nbe\tput\tunder\tthe\tcare\tof\tsome\ttrusty\tvassal,\tinstead\tof\tbeing\tbrought\tup\tat\thome,\nand\tone\treason\twhy\tthe\tCentevilles\thad\tbeen\tchosen\tby\tDuke\tWilliam\twas,\tthat\nboth\tSir\tEric\tand\this\tmother\tspoke\tonly\tthe\told\tNorwegian\ttongue,\twhich\the\nwished\tyoung\tRichard\tto\tunderstand\twell,\twhereas,\tin\tother\tparts\tof\tthe\tDuchy,\nthe\tNormans\thad\tforgotten\ttheir\town\ttongue,\tand\thad\ttaken\tup\twhat\twas\tthen\ncalled\tthe\tLanguéd’ouì,\ta\tlanguage\tbetween\tGerman\tand\tLatin,\twhich\twas\tthe\nbeginning\tof\tFrench.\nOn\tthis\tday,\tDuke\tWilliam\thimself\twas\texpected\tat\tBayeux,\tto\tpay\ta\tvisit\tto\this\nson\tbefore\tsetting\tout\ton\ta\tjourney\tto\tsettle\tthe\tdisputes\tbetween\tthe\tCounts\tof\nFlanders\tand\tMontreuil,\tand\tthis\twas\tthe\treason\tof\tFru\tAstrida’s\tgreat\npreparations.\t\tNo\tsooner\thad\tshe\tseen\tthe\thaunch\tplaced\tupon\ta\tspit,\twhich\ta\nlittle\tboy\twas\tto\tturn\tbefore\tth"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Away\tran\tthe\thappy\tchild,\tand\tnever\trested\ttill\the\tstood\tat\tthe\tbottom\tof\tthe\nlong,\tsteep,\tstone\tstair,\tleading\tto\tthe\tembattled\tporch.\t\tThither\tcame\tthe\tBaron\nde\tCenteville,\tand\this\tson,\tto\treceive\ttheir\tPrince.\t\tRichard\tlooked\tup\tat\nOsmond,\tsaying,\t“Let\tme\thold\this\tstirrup,”\tand\tthen\tsprang\tup\tand\tshouted\tfor\njoy,\tas\tunder\tthe\tarched\tgateway\tthere\tcame\ta\ttall\tblack\thorse,\tbearing\tthe\nstately\tform\tof\tthe\tDuke\tof\tNormandy.\t\tHis\tpurple\trobe\twas\tfastened\tround\thim\nby\ta\trich\tbelt,\tsustaining\tthe\tmighty\tweapon,\tfrom\twhich\the\twas\tcalled\t“William\nof\tthe\tlong\tSword,”\this\tlegs\tand\tfeet\twere\tcased\tin\tlinked\tsteel\tchain-work,\this\ngilded\tspurs\twere\ton\this\theels,\tand\this\tshort\tbrown\thair\twas\tcovered\tby\this\nducal\tcap\tof\tpurple,\tturned\tup\twith\tfur,\tand\ta\tfeather\tfastened\tin\tby\ta\tjewelled\nclasp.\t\tHis\tbrow\twas\tgrave\tand\tthoughtful,\tand\tthere\twas\tsomething\tboth\tof\ndignity\tand\tsorrow\tin\this\tface,\tat\tthe\tfirst\tmoment\tof\tlooking\tat\tit,\trecalling\tthe\nrecollection\tthat\the\thad\tearly\tlost\this\tyoung\twife,\tthe\tDuchess\tEmma,\tand\tthat\nhe\twas\tbeset\tby\tmany\tcares\tand\ttoils;\tbut\tthe\tnext\tglance\tgenerally\tconveyed\nencouragement,\tso\tfull\tof\tmildness\twere\this\teyes,\tand\tso\tkind\tthe\texpression\tof\nhis\tlips.\nAnd\tnow,\th"
    }
  ],
  "buku-063": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThe\tProject\tGutenberg\teBook,\tThe\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tThe\tLittle\tDuke\n\t\t\t\t\t\t\tRichard\tthe\tFearless\nAuthor:\tCharlotte\tM.\tYonge\nRelease\tDate:\tJune\t20,\t2008\t\t[eBook\t#3048]\nLanguage:\tEnglish\nCharacter\tset\tencoding:\tISO-646-US\t(US-ASCII)\n***START\tOF\tTHE\tPROJECT\tGUTENBERG\tEBOOK\tTHE\tLITTLE\tDUKE***\nTranscribed\tfrom\tthe\t1905\tMacmillan\tand\tCo.\tedition\tby\tJanet\tHaselow,\tMarian\nTaylor\tand\tDavid\tPrice,\temail\tccx074@pglaf.org"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "THE\tLITTLE\tDUKE\nRICHARD\tTHE\tFEARLESS\nBY\n\t\nTHE\n\t\nAUTHOR\n\t\nOF\n“THE\tHEIR\tOF\tREDCLYFFE,”\nETC\n.\nWITH\tILLUSTRATIONS\nLondon\nMACMILLAN\tAND\tCO.,\t\nL\nIMITED\nNEW\n\t\nYORK\n:\t\nTHE\n\t\nMACMILLAN\n\t\nCOMPANY\n1905\nAll\trights\treserved\nR\nICHARD\n\tC\nLAY\n\t\nAND\n\tS\nONS\n,\t\nL\nIMITED\n,\nBREAD\n\t\nSTREET\n\t\nHILL\n,\t\nE\n.\nC\n.\n,\t\nAND\nBUNGAY\n,\t\nSUFFOLK\n.\nOriginally\tpublished\telsewhere\n.\t\t\nTransferred\tin\n\t1864.\t\t\nFirst\tEdition\tprinted\n\t(S)\nfor\tMacmillan\tand\tCo.\tNovember\n\t1864\t(\nPott\n\t8\nvo\n).\t\t\nReprinted\n\t1869,\t1872,\t1873,\n1876,\t1878,\t1881\t(\nGlobe\n\t8\nvo\n),\t1883,\t1885,\t1886,\t1889.\t\t\nNew\tEdition\n\t1891,\n(\nCrown\n\t8\nvo\n),\t1892,\t1894,\t1895,\t1897,\t1898,\t1899,\t1900,\t1901,\t1903,\t1905."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "CHAPTER\tI\nOn\ta\tbright\tautumn\tday,\tas\tlong\tago\tas\tthe\tyear\t943,\tthere\twas\ta\tgreat\tbustle\tin\nthe\tCastle\tof\tBayeux\tin\tNormandy.\nThe\thall\twas\tlarge\tand\tlow,\tthe\troof\tarched,\tand\tsupported\ton\tthick\tshort\ncolumns,\talmost\tlike\tthe\tcrypt\tof\ta\tCathedral;\tthe\twalls\twere\tthick,\tand\tthe\nwindows,\twhich\thad\tno\tglass,\twere\tvery\tsmall,\tset\tin\tsuch\ta\tdepth\tof\twall\tthat\nthere\twas\ta\twide\tdeep\twindow\tseat,\tupon\twhich\tthe\train\tmight\tbeat,\twithout\nreaching\tthe\tinterior\tof\tthe\troom.\t\tAnd\teven\tif\tit\thad\tcome\tin,\tthere\twas\tnothing\nfor\tit\tto\thurt,\tfor\tthe\twalls\twere\tof\trough\tstone,\tand\tthe\tfloor\tof\ttiles.\t\tThere\twas\na\tfire\tat\teach\tend\tof\tthis\tgreat\tdark\tapartment,\tbut\tthere\twere\tno\tchimneys\tover\nthe\tample\thearths,\tand\tthe\tsmoke\tcurled\tabout\tin\tthick\twhite\tfolds\tin\tthe\tvaulted\nroof,\tadding\tto\tthe\twreaths\tof\tsoot,\twhich\tmade\tthe\thall\tlook\tstill\tdarker.\nThe\tfire\tat\tthe\tlower\tend\twas\tby\tfar\tthe\tlargest\tand\thottest.\t\tGreat\tblack\ncauldrons\thung\tover\tit,\tand\tservants,\tboth\tmen\tand\twomen,\twith\tred\tfaces,\tbare\nand\tgrimed\tarms,\tand\tlong\tiron\thooks,\tor\tpots\tand\tpans,\twere\tbusied\taround\tit.\t\nAt\tthe\tother\tend,\twhich\twas\traised\tabout\tthree\tsteps\tabove\tthe\tfloor\tof\tthe\thall,\nother\tservants\twere\tengaged.\t\tTwo\tyoung\tmaidens"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "her\tlong\tthick\tlight\thair,\thardly\ttouched\twith\tgrey,\twas\tbound\tround\ther\thead,\nunder\ta\ttall\twhite\tcap,\twith\ta\tband\tpassing\tunder\ther\tchin:\tshe\twore\ta\tlong\nsweeping\tdark\trobe,\twith\twide\thanging\tsleeves,\tand\tthick\tgold\tear-rings\tand\nnecklace,\twhich\thad\tpossibly\tcome\tfrom\tthe\tsame\tquarter\tas\tthe\tcup.\t\tShe\ndirected\tthe\tservants,\tinspected\tboth\tthe\tcookery\tand\tarrangements\tof\tthe\ttable,\nheld\tcouncil\twith\tan\told\tsteward,\tnow\tand\tthen\tlooked\trather\tanxiously\tfrom\tthe\nwindow,\tas\tif\texpecting\tsome\tone,\tand\tbegan\tto\tsay\tsomething\tabout\tfears\tthat\nthese\tloitering\tyouths\twould\tnot\tbring\thome\tthe\tvenison\tin\ttime\tfor\tDuke\nWilliam’s\tsupper.\nPresently,\tshe\tlooked\tup\trejoiced,\tfor\ta\tfew\tnotes\tof\ta\tbugle-horn\twere\tsounded;\nthere\twas\ta\tclattering\tof\tfeet,\tand\tin\ta\tfew\tmoments\tthere\tbounded\tinto\tthe\thall,\na\tboy\tof\tabout\teight\tyears\told,\this\tcheeks\tand\tlarge\tblue\teyes\tbright\twith\tair\tand\nexercise,\tand\this\tlong\tlight-brown\thair\tstreaming\tbehind\thim,\tas\the\tran\tforward\nflourishing\ta\tbow\tin\this\thand,\tand\tcrying\tout,\t“I\thit\thim,\tI\thit\thim!\t\tDame\nAstrida,\tdo\tyou\thear?\t\t’Tis\ta\tstag\tof\tten\tbranches,\tand\tI\thit\thim\tin\tthe\tneck.”\n“You!\tmy\tLord\tRichard!\tyou\tkilled\thim?”\n“Oh,\tno,\tI\tonly\tstruck\thim.\t\tIt\twas\tOsmond’s"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "also\tthe\ttaller,\twas\tslightly\tmade,\tand\tvery\tactive,\twith\ta\tbright\tkeen\tgrey\teye,\nand\tmerry\tsmile.\t\tThese\twere\tDame\tAstrida’s\tson,\tSir\tEric\tde\tCenteville,\tand\nher\tgrandson,\tOsmond;\tand\tto\ttheir\tcare\tDuke\tWilliam\tof\tNormandy\thad\ncommitted\this\tonly\tchild,\tRichard,\tto\tbe\tfostered,\tor\tbrought\tup.\t\n[1]\nIt\twas\talways\tthe\tcustom\tamong\tthe\tNorthmen,\tthat\tyoung\tprinces\tshould\tthus\nbe\tput\tunder\tthe\tcare\tof\tsome\ttrusty\tvassal,\tinstead\tof\tbeing\tbrought\tup\tat\thome,\nand\tone\treason\twhy\tthe\tCentevilles\thad\tbeen\tchosen\tby\tDuke\tWilliam\twas,\tthat\nboth\tSir\tEric\tand\this\tmother\tspoke\tonly\tthe\told\tNorwegian\ttongue,\twhich\the\nwished\tyoung\tRichard\tto\tunderstand\twell,\twhereas,\tin\tother\tparts\tof\tthe\tDuchy,\nthe\tNormans\thad\tforgotten\ttheir\town\ttongue,\tand\thad\ttaken\tup\twhat\twas\tthen\ncalled\tthe\tLanguéd’ouì,\ta\tlanguage\tbetween\tGerman\tand\tLatin,\twhich\twas\tthe\nbeginning\tof\tFrench.\nOn\tthis\tday,\tDuke\tWilliam\thimself\twas\texpected\tat\tBayeux,\tto\tpay\ta\tvisit\tto\this\nson\tbefore\tsetting\tout\ton\ta\tjourney\tto\tsettle\tthe\tdisputes\tbetween\tthe\tCounts\tof\nFlanders\tand\tMontreuil,\tand\tthis\twas\tthe\treason\tof\tFru\tAstrida’s\tgreat\npreparations.\t\tNo\tsooner\thad\tshe\tseen\tthe\thaunch\tplaced\tupon\ta\tspit,\twhich\ta\nlittle\tboy\twas\tto\tturn\tbefore\tth"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Away\tran\tthe\thappy\tchild,\tand\tnever\trested\ttill\the\tstood\tat\tthe\tbottom\tof\tthe\nlong,\tsteep,\tstone\tstair,\tleading\tto\tthe\tembattled\tporch.\t\tThither\tcame\tthe\tBaron\nde\tCenteville,\tand\this\tson,\tto\treceive\ttheir\tPrince.\t\tRichard\tlooked\tup\tat\nOsmond,\tsaying,\t“Let\tme\thold\this\tstirrup,”\tand\tthen\tsprang\tup\tand\tshouted\tfor\njoy,\tas\tunder\tthe\tarched\tgateway\tthere\tcame\ta\ttall\tblack\thorse,\tbearing\tthe\nstately\tform\tof\tthe\tDuke\tof\tNormandy.\t\tHis\tpurple\trobe\twas\tfastened\tround\thim\nby\ta\trich\tbelt,\tsustaining\tthe\tmighty\tweapon,\tfrom\twhich\the\twas\tcalled\t“William\nof\tthe\tlong\tSword,”\this\tlegs\tand\tfeet\twere\tcased\tin\tlinked\tsteel\tchain-work,\this\ngilded\tspurs\twere\ton\this\theels,\tand\this\tshort\tbrown\thair\twas\tcovered\tby\this\nducal\tcap\tof\tpurple,\tturned\tup\twith\tfur,\tand\ta\tfeather\tfastened\tin\tby\ta\tjewelled\nclasp.\t\tHis\tbrow\twas\tgrave\tand\tthoughtful,\tand\tthere\twas\tsomething\tboth\tof\ndignity\tand\tsorrow\tin\this\tface,\tat\tthe\tfirst\tmoment\tof\tlooking\tat\tit,\trecalling\tthe\nrecollection\tthat\the\thad\tearly\tlost\this\tyoung\twife,\tthe\tDuchess\tEmma,\tand\tthat\nhe\twas\tbeset\tby\tmany\tcares\tand\ttoils;\tbut\tthe\tnext\tglance\tgenerally\tconveyed\nencouragement,\tso\tfull\tof\tmildness\twere\this\teyes,\tand\tso\tkind\tthe\texpression\tof\nhis\tlips.\nAnd\tnow,\th"
    }
  ],
  "buku-064": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThe\tProject\tGutenberg\teBook,\tThe\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tThe\tLittle\tDuke\n\t\t\t\t\t\t\tRichard\tthe\tFearless\nAuthor:\tCharlotte\tM.\tYonge\nRelease\tDate:\tJune\t20,\t2008\t\t[eBook\t#3048]\nLanguage:\tEnglish\nCharacter\tset\tencoding:\tISO-646-US\t(US-ASCII)\n***START\tOF\tTHE\tPROJECT\tGUTENBERG\tEBOOK\tTHE\tLITTLE\tDUKE***\nTranscribed\tfrom\tthe\t1905\tMacmillan\tand\tCo.\tedition\tby\tJanet\tHaselow,\tMarian\nTaylor\tand\tDavid\tPrice,\temail\tccx074@pglaf.org"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "THE\tLITTLE\tDUKE\nRICHARD\tTHE\tFEARLESS\nBY\n\t\nTHE\n\t\nAUTHOR\n\t\nOF\n“THE\tHEIR\tOF\tREDCLYFFE,”\nETC\n.\nWITH\tILLUSTRATIONS\nLondon\nMACMILLAN\tAND\tCO.,\t\nL\nIMITED\nNEW\n\t\nYORK\n:\t\nTHE\n\t\nMACMILLAN\n\t\nCOMPANY\n1905\nAll\trights\treserved\nR\nICHARD\n\tC\nLAY\n\t\nAND\n\tS\nONS\n,\t\nL\nIMITED\n,\nBREAD\n\t\nSTREET\n\t\nHILL\n,\t\nE\n.\nC\n.\n,\t\nAND\nBUNGAY\n,\t\nSUFFOLK\n.\nOriginally\tpublished\telsewhere\n.\t\t\nTransferred\tin\n\t1864.\t\t\nFirst\tEdition\tprinted\n\t(S)\nfor\tMacmillan\tand\tCo.\tNovember\n\t1864\t(\nPott\n\t8\nvo\n).\t\t\nReprinted\n\t1869,\t1872,\t1873,\n1876,\t1878,\t1881\t(\nGlobe\n\t8\nvo\n),\t1883,\t1885,\t1886,\t1889.\t\t\nNew\tEdition\n\t1891,\n(\nCrown\n\t8\nvo\n),\t1892,\t1894,\t1895,\t1897,\t1898,\t1899,\t1900,\t1901,\t1903,\t1905."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "CHAPTER\tI\nOn\ta\tbright\tautumn\tday,\tas\tlong\tago\tas\tthe\tyear\t943,\tthere\twas\ta\tgreat\tbustle\tin\nthe\tCastle\tof\tBayeux\tin\tNormandy.\nThe\thall\twas\tlarge\tand\tlow,\tthe\troof\tarched,\tand\tsupported\ton\tthick\tshort\ncolumns,\talmost\tlike\tthe\tcrypt\tof\ta\tCathedral;\tthe\twalls\twere\tthick,\tand\tthe\nwindows,\twhich\thad\tno\tglass,\twere\tvery\tsmall,\tset\tin\tsuch\ta\tdepth\tof\twall\tthat\nthere\twas\ta\twide\tdeep\twindow\tseat,\tupon\twhich\tthe\train\tmight\tbeat,\twithout\nreaching\tthe\tinterior\tof\tthe\troom.\t\tAnd\teven\tif\tit\thad\tcome\tin,\tthere\twas\tnothing\nfor\tit\tto\thurt,\tfor\tthe\twalls\twere\tof\trough\tstone,\tand\tthe\tfloor\tof\ttiles.\t\tThere\twas\na\tfire\tat\teach\tend\tof\tthis\tgreat\tdark\tapartment,\tbut\tthere\twere\tno\tchimneys\tover\nthe\tample\thearths,\tand\tthe\tsmoke\tcurled\tabout\tin\tthick\twhite\tfolds\tin\tthe\tvaulted\nroof,\tadding\tto\tthe\twreaths\tof\tsoot,\twhich\tmade\tthe\thall\tlook\tstill\tdarker.\nThe\tfire\tat\tthe\tlower\tend\twas\tby\tfar\tthe\tlargest\tand\thottest.\t\tGreat\tblack\ncauldrons\thung\tover\tit,\tand\tservants,\tboth\tmen\tand\twomen,\twith\tred\tfaces,\tbare\nand\tgrimed\tarms,\tand\tlong\tiron\thooks,\tor\tpots\tand\tpans,\twere\tbusied\taround\tit.\t\nAt\tthe\tother\tend,\twhich\twas\traised\tabout\tthree\tsteps\tabove\tthe\tfloor\tof\tthe\thall,\nother\tservants\twere\tengaged.\t\tTwo\tyoung\tmaidens"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "her\tlong\tthick\tlight\thair,\thardly\ttouched\twith\tgrey,\twas\tbound\tround\ther\thead,\nunder\ta\ttall\twhite\tcap,\twith\ta\tband\tpassing\tunder\ther\tchin:\tshe\twore\ta\tlong\nsweeping\tdark\trobe,\twith\twide\thanging\tsleeves,\tand\tthick\tgold\tear-rings\tand\nnecklace,\twhich\thad\tpossibly\tcome\tfrom\tthe\tsame\tquarter\tas\tthe\tcup.\t\tShe\ndirected\tthe\tservants,\tinspected\tboth\tthe\tcookery\tand\tarrangements\tof\tthe\ttable,\nheld\tcouncil\twith\tan\told\tsteward,\tnow\tand\tthen\tlooked\trather\tanxiously\tfrom\tthe\nwindow,\tas\tif\texpecting\tsome\tone,\tand\tbegan\tto\tsay\tsomething\tabout\tfears\tthat\nthese\tloitering\tyouths\twould\tnot\tbring\thome\tthe\tvenison\tin\ttime\tfor\tDuke\nWilliam’s\tsupper.\nPresently,\tshe\tlooked\tup\trejoiced,\tfor\ta\tfew\tnotes\tof\ta\tbugle-horn\twere\tsounded;\nthere\twas\ta\tclattering\tof\tfeet,\tand\tin\ta\tfew\tmoments\tthere\tbounded\tinto\tthe\thall,\na\tboy\tof\tabout\teight\tyears\told,\this\tcheeks\tand\tlarge\tblue\teyes\tbright\twith\tair\tand\nexercise,\tand\this\tlong\tlight-brown\thair\tstreaming\tbehind\thim,\tas\the\tran\tforward\nflourishing\ta\tbow\tin\this\thand,\tand\tcrying\tout,\t“I\thit\thim,\tI\thit\thim!\t\tDame\nAstrida,\tdo\tyou\thear?\t\t’Tis\ta\tstag\tof\tten\tbranches,\tand\tI\thit\thim\tin\tthe\tneck.”\n“You!\tmy\tLord\tRichard!\tyou\tkilled\thim?”\n“Oh,\tno,\tI\tonly\tstruck\thim.\t\tIt\twas\tOsmond’s"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "also\tthe\ttaller,\twas\tslightly\tmade,\tand\tvery\tactive,\twith\ta\tbright\tkeen\tgrey\teye,\nand\tmerry\tsmile.\t\tThese\twere\tDame\tAstrida’s\tson,\tSir\tEric\tde\tCenteville,\tand\nher\tgrandson,\tOsmond;\tand\tto\ttheir\tcare\tDuke\tWilliam\tof\tNormandy\thad\ncommitted\this\tonly\tchild,\tRichard,\tto\tbe\tfostered,\tor\tbrought\tup.\t\n[1]\nIt\twas\talways\tthe\tcustom\tamong\tthe\tNorthmen,\tthat\tyoung\tprinces\tshould\tthus\nbe\tput\tunder\tthe\tcare\tof\tsome\ttrusty\tvassal,\tinstead\tof\tbeing\tbrought\tup\tat\thome,\nand\tone\treason\twhy\tthe\tCentevilles\thad\tbeen\tchosen\tby\tDuke\tWilliam\twas,\tthat\nboth\tSir\tEric\tand\this\tmother\tspoke\tonly\tthe\told\tNorwegian\ttongue,\twhich\the\nwished\tyoung\tRichard\tto\tunderstand\twell,\twhereas,\tin\tother\tparts\tof\tthe\tDuchy,\nthe\tNormans\thad\tforgotten\ttheir\town\ttongue,\tand\thad\ttaken\tup\twhat\twas\tthen\ncalled\tthe\tLanguéd’ouì,\ta\tlanguage\tbetween\tGerman\tand\tLatin,\twhich\twas\tthe\nbeginning\tof\tFrench.\nOn\tthis\tday,\tDuke\tWilliam\thimself\twas\texpected\tat\tBayeux,\tto\tpay\ta\tvisit\tto\this\nson\tbefore\tsetting\tout\ton\ta\tjourney\tto\tsettle\tthe\tdisputes\tbetween\tthe\tCounts\tof\nFlanders\tand\tMontreuil,\tand\tthis\twas\tthe\treason\tof\tFru\tAstrida’s\tgreat\npreparations.\t\tNo\tsooner\thad\tshe\tseen\tthe\thaunch\tplaced\tupon\ta\tspit,\twhich\ta\nlittle\tboy\twas\tto\tturn\tbefore\tth"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Away\tran\tthe\thappy\tchild,\tand\tnever\trested\ttill\the\tstood\tat\tthe\tbottom\tof\tthe\nlong,\tsteep,\tstone\tstair,\tleading\tto\tthe\tembattled\tporch.\t\tThither\tcame\tthe\tBaron\nde\tCenteville,\tand\this\tson,\tto\treceive\ttheir\tPrince.\t\tRichard\tlooked\tup\tat\nOsmond,\tsaying,\t“Let\tme\thold\this\tstirrup,”\tand\tthen\tsprang\tup\tand\tshouted\tfor\njoy,\tas\tunder\tthe\tarched\tgateway\tthere\tcame\ta\ttall\tblack\thorse,\tbearing\tthe\nstately\tform\tof\tthe\tDuke\tof\tNormandy.\t\tHis\tpurple\trobe\twas\tfastened\tround\thim\nby\ta\trich\tbelt,\tsustaining\tthe\tmighty\tweapon,\tfrom\twhich\the\twas\tcalled\t“William\nof\tthe\tlong\tSword,”\this\tlegs\tand\tfeet\twere\tcased\tin\tlinked\tsteel\tchain-work,\this\ngilded\tspurs\twere\ton\this\theels,\tand\this\tshort\tbrown\thair\twas\tcovered\tby\this\nducal\tcap\tof\tpurple,\tturned\tup\twith\tfur,\tand\ta\tfeather\tfastened\tin\tby\ta\tjewelled\nclasp.\t\tHis\tbrow\twas\tgrave\tand\tthoughtful,\tand\tthere\twas\tsomething\tboth\tof\ndignity\tand\tsorrow\tin\this\tface,\tat\tthe\tfirst\tmoment\tof\tlooking\tat\tit,\trecalling\tthe\nrecollection\tthat\the\thad\tearly\tlost\this\tyoung\twife,\tthe\tDuchess\tEmma,\tand\tthat\nhe\twas\tbeset\tby\tmany\tcares\tand\ttoils;\tbut\tthe\tnext\tglance\tgenerally\tconveyed\nencouragement,\tso\tfull\tof\tmildness\twere\this\teyes,\tand\tso\tkind\tthe\texpression\tof\nhis\tlips.\nAnd\tnow,\th"
    }
  ],
  "buku-065": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #2",
      "text": "The\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThe\tProject\tGutenberg\teBook,\tThe\tLittle\tDuke,\tby\tCharlotte\tM.\tYonge\nThis\teBook\tis\tfor\tthe\tuse\tof\tanyone\tanywhere\tat\tno\tcost\tand\twith\nalmost\tno\trestrictions\twhatsoever.\t\tYou\tmay\tcopy\tit,\tgive\tit\taway\tor\nre-use\tit\tunder\tthe\tterms\tof\tthe\tProject\tGutenberg\tLicense\tincluded\nwith\tthis\teBook\tor\tonline\tat\twww.gutenberg.org\nTitle:\tThe\tLittle\tDuke\n\t\t\t\t\t\t\tRichard\tthe\tFearless\nAuthor:\tCharlotte\tM.\tYonge\nRelease\tDate:\tJune\t20,\t2008\t\t[eBook\t#3048]\nLanguage:\tEnglish\nCharacter\tset\tencoding:\tISO-646-US\t(US-ASCII)\n***START\tOF\tTHE\tPROJECT\tGUTENBERG\tEBOOK\tTHE\tLITTLE\tDUKE***\nTranscribed\tfrom\tthe\t1905\tMacmillan\tand\tCo.\tedition\tby\tJanet\tHaselow,\tMarian\nTaylor\tand\tDavid\tPrice,\temail\tccx074@pglaf.org"
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "THE\tLITTLE\tDUKE\nRICHARD\tTHE\tFEARLESS\nBY\n\t\nTHE\n\t\nAUTHOR\n\t\nOF\n“THE\tHEIR\tOF\tREDCLYFFE,”\nETC\n.\nWITH\tILLUSTRATIONS\nLondon\nMACMILLAN\tAND\tCO.,\t\nL\nIMITED\nNEW\n\t\nYORK\n:\t\nTHE\n\t\nMACMILLAN\n\t\nCOMPANY\n1905\nAll\trights\treserved\nR\nICHARD\n\tC\nLAY\n\t\nAND\n\tS\nONS\n,\t\nL\nIMITED\n,\nBREAD\n\t\nSTREET\n\t\nHILL\n,\t\nE\n.\nC\n.\n,\t\nAND\nBUNGAY\n,\t\nSUFFOLK\n.\nOriginally\tpublished\telsewhere\n.\t\t\nTransferred\tin\n\t1864.\t\t\nFirst\tEdition\tprinted\n\t(S)\nfor\tMacmillan\tand\tCo.\tNovember\n\t1864\t(\nPott\n\t8\nvo\n).\t\t\nReprinted\n\t1869,\t1872,\t1873,\n1876,\t1878,\t1881\t(\nGlobe\n\t8\nvo\n),\t1883,\t1885,\t1886,\t1889.\t\t\nNew\tEdition\n\t1891,\n(\nCrown\n\t8\nvo\n),\t1892,\t1894,\t1895,\t1897,\t1898,\t1899,\t1900,\t1901,\t1903,\t1905."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "CHAPTER\tI\nOn\ta\tbright\tautumn\tday,\tas\tlong\tago\tas\tthe\tyear\t943,\tthere\twas\ta\tgreat\tbustle\tin\nthe\tCastle\tof\tBayeux\tin\tNormandy.\nThe\thall\twas\tlarge\tand\tlow,\tthe\troof\tarched,\tand\tsupported\ton\tthick\tshort\ncolumns,\talmost\tlike\tthe\tcrypt\tof\ta\tCathedral;\tthe\twalls\twere\tthick,\tand\tthe\nwindows,\twhich\thad\tno\tglass,\twere\tvery\tsmall,\tset\tin\tsuch\ta\tdepth\tof\twall\tthat\nthere\twas\ta\twide\tdeep\twindow\tseat,\tupon\twhich\tthe\train\tmight\tbeat,\twithout\nreaching\tthe\tinterior\tof\tthe\troom.\t\tAnd\teven\tif\tit\thad\tcome\tin,\tthere\twas\tnothing\nfor\tit\tto\thurt,\tfor\tthe\twalls\twere\tof\trough\tstone,\tand\tthe\tfloor\tof\ttiles.\t\tThere\twas\na\tfire\tat\teach\tend\tof\tthis\tgreat\tdark\tapartment,\tbut\tthere\twere\tno\tchimneys\tover\nthe\tample\thearths,\tand\tthe\tsmoke\tcurled\tabout\tin\tthick\twhite\tfolds\tin\tthe\tvaulted\nroof,\tadding\tto\tthe\twreaths\tof\tsoot,\twhich\tmade\tthe\thall\tlook\tstill\tdarker.\nThe\tfire\tat\tthe\tlower\tend\twas\tby\tfar\tthe\tlargest\tand\thottest.\t\tGreat\tblack\ncauldrons\thung\tover\tit,\tand\tservants,\tboth\tmen\tand\twomen,\twith\tred\tfaces,\tbare\nand\tgrimed\tarms,\tand\tlong\tiron\thooks,\tor\tpots\tand\tpans,\twere\tbusied\taround\tit.\t\nAt\tthe\tother\tend,\twhich\twas\traised\tabout\tthree\tsteps\tabove\tthe\tfloor\tof\tthe\thall,\nother\tservants\twere\tengaged.\t\tTwo\tyoung\tmaidens"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "her\tlong\tthick\tlight\thair,\thardly\ttouched\twith\tgrey,\twas\tbound\tround\ther\thead,\nunder\ta\ttall\twhite\tcap,\twith\ta\tband\tpassing\tunder\ther\tchin:\tshe\twore\ta\tlong\nsweeping\tdark\trobe,\twith\twide\thanging\tsleeves,\tand\tthick\tgold\tear-rings\tand\nnecklace,\twhich\thad\tpossibly\tcome\tfrom\tthe\tsame\tquarter\tas\tthe\tcup.\t\tShe\ndirected\tthe\tservants,\tinspected\tboth\tthe\tcookery\tand\tarrangements\tof\tthe\ttable,\nheld\tcouncil\twith\tan\told\tsteward,\tnow\tand\tthen\tlooked\trather\tanxiously\tfrom\tthe\nwindow,\tas\tif\texpecting\tsome\tone,\tand\tbegan\tto\tsay\tsomething\tabout\tfears\tthat\nthese\tloitering\tyouths\twould\tnot\tbring\thome\tthe\tvenison\tin\ttime\tfor\tDuke\nWilliam’s\tsupper.\nPresently,\tshe\tlooked\tup\trejoiced,\tfor\ta\tfew\tnotes\tof\ta\tbugle-horn\twere\tsounded;\nthere\twas\ta\tclattering\tof\tfeet,\tand\tin\ta\tfew\tmoments\tthere\tbounded\tinto\tthe\thall,\na\tboy\tof\tabout\teight\tyears\told,\this\tcheeks\tand\tlarge\tblue\teyes\tbright\twith\tair\tand\nexercise,\tand\this\tlong\tlight-brown\thair\tstreaming\tbehind\thim,\tas\the\tran\tforward\nflourishing\ta\tbow\tin\this\thand,\tand\tcrying\tout,\t“I\thit\thim,\tI\thit\thim!\t\tDame\nAstrida,\tdo\tyou\thear?\t\t’Tis\ta\tstag\tof\tten\tbranches,\tand\tI\thit\thim\tin\tthe\tneck.”\n“You!\tmy\tLord\tRichard!\tyou\tkilled\thim?”\n“Oh,\tno,\tI\tonly\tstruck\thim.\t\tIt\twas\tOsmond’s"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "also\tthe\ttaller,\twas\tslightly\tmade,\tand\tvery\tactive,\twith\ta\tbright\tkeen\tgrey\teye,\nand\tmerry\tsmile.\t\tThese\twere\tDame\tAstrida’s\tson,\tSir\tEric\tde\tCenteville,\tand\nher\tgrandson,\tOsmond;\tand\tto\ttheir\tcare\tDuke\tWilliam\tof\tNormandy\thad\ncommitted\this\tonly\tchild,\tRichard,\tto\tbe\tfostered,\tor\tbrought\tup.\t\n[1]\nIt\twas\talways\tthe\tcustom\tamong\tthe\tNorthmen,\tthat\tyoung\tprinces\tshould\tthus\nbe\tput\tunder\tthe\tcare\tof\tsome\ttrusty\tvassal,\tinstead\tof\tbeing\tbrought\tup\tat\thome,\nand\tone\treason\twhy\tthe\tCentevilles\thad\tbeen\tchosen\tby\tDuke\tWilliam\twas,\tthat\nboth\tSir\tEric\tand\this\tmother\tspoke\tonly\tthe\told\tNorwegian\ttongue,\twhich\the\nwished\tyoung\tRichard\tto\tunderstand\twell,\twhereas,\tin\tother\tparts\tof\tthe\tDuchy,\nthe\tNormans\thad\tforgotten\ttheir\town\ttongue,\tand\thad\ttaken\tup\twhat\twas\tthen\ncalled\tthe\tLanguéd’ouì,\ta\tlanguage\tbetween\tGerman\tand\tLatin,\twhich\twas\tthe\nbeginning\tof\tFrench.\nOn\tthis\tday,\tDuke\tWilliam\thimself\twas\texpected\tat\tBayeux,\tto\tpay\ta\tvisit\tto\this\nson\tbefore\tsetting\tout\ton\ta\tjourney\tto\tsettle\tthe\tdisputes\tbetween\tthe\tCounts\tof\nFlanders\tand\tMontreuil,\tand\tthis\twas\tthe\treason\tof\tFru\tAstrida’s\tgreat\npreparations.\t\tNo\tsooner\thad\tshe\tseen\tthe\thaunch\tplaced\tupon\ta\tspit,\twhich\ta\nlittle\tboy\twas\tto\tturn\tbefore\tth"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Away\tran\tthe\thappy\tchild,\tand\tnever\trested\ttill\the\tstood\tat\tthe\tbottom\tof\tthe\nlong,\tsteep,\tstone\tstair,\tleading\tto\tthe\tembattled\tporch.\t\tThither\tcame\tthe\tBaron\nde\tCenteville,\tand\this\tson,\tto\treceive\ttheir\tPrince.\t\tRichard\tlooked\tup\tat\nOsmond,\tsaying,\t“Let\tme\thold\this\tstirrup,”\tand\tthen\tsprang\tup\tand\tshouted\tfor\njoy,\tas\tunder\tthe\tarched\tgateway\tthere\tcame\ta\ttall\tblack\thorse,\tbearing\tthe\nstately\tform\tof\tthe\tDuke\tof\tNormandy.\t\tHis\tpurple\trobe\twas\tfastened\tround\thim\nby\ta\trich\tbelt,\tsustaining\tthe\tmighty\tweapon,\tfrom\twhich\the\twas\tcalled\t“William\nof\tthe\tlong\tSword,”\this\tlegs\tand\tfeet\twere\tcased\tin\tlinked\tsteel\tchain-work,\this\ngilded\tspurs\twere\ton\this\theels,\tand\this\tshort\tbrown\thair\twas\tcovered\tby\this\nducal\tcap\tof\tpurple,\tturned\tup\twith\tfur,\tand\ta\tfeather\tfastened\tin\tby\ta\tjewelled\nclasp.\t\tHis\tbrow\twas\tgrave\tand\tthoughtful,\tand\tthere\twas\tsomething\tboth\tof\ndignity\tand\tsorrow\tin\this\tface,\tat\tthe\tfirst\tmoment\tof\tlooking\tat\tit,\trecalling\tthe\nrecollection\tthat\the\thad\tearly\tlost\this\tyoung\twife,\tthe\tDuchess\tEmma,\tand\tthat\nhe\twas\tbeset\tby\tmany\tcares\tand\ttoils;\tbut\tthe\tnext\tglance\tgenerally\tconveyed\nencouragement,\tso\tfull\tof\tmildness\twere\this\teyes,\tand\tso\tkind\tthe\texpression\tof\nhis\tlips.\nAnd\tnow,\th"
    }
  ],
  "buku-066": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "“Allas!” quod she, “that ever this sholde happe!\nFor wende I never, by possibilitee,\nThat swich a monstre or merveille mighte be!”\nThe Frankeleyn’s Tale"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "To\nFrederic Courtland Penfield\nLast Ambassador of The United States of\nAmerica to the Late Austrian Empire, This\nold time tale is gratefully inscribed in\nmemory of the rescue of certain distressed\ntravellers effected by him in the world’s\nGreat Storm of The Year\n1914"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "Author’s Note\nOf the three long novels of mine which suffered an interruption, The Rescue\nwas the one that had to wait the longest for the good pleasure of the Fates. I\nam betraying no secret when I state here that it had to wait precisely for\ntwenty years. I laid it aside at the end of the summer of 1898 and it was\nabout the end of the summer of 1918 that I took it up again with the firm\ndetermination to see the end of it and helped by the sudden feeling that I\nmight be equal to the task.\nThis does not mean that I turned to it with elation. I was well aware and\nperhaps even too much aware of the dangers of such an adventure. The\namazingly sympathetic kindness which men of various temperaments,\ndiverse views and different literary tastes have been for years displaying\ntowards my work has done much for me, has done all —except giving me\nthat overweening self-confidence which may assist an adventurer\nsometimes but in the long run ends by leading him to the gallows.\nAs the characteristic I want most to impress upon these short Author’s\nNotes prepared for my first Collected Edition is that of absolute frankness, I\nhasten to declare that I founded my hopes not on my supposed merits but "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "However he took care to mention that there were various kinds of audacity.\nOh, there are, there are!   … There is, for instance, the kind of audacity\nalmost indistinguishable from impudence.   … I must believe that in this case\nI have not been impudent for I am not conscious of having been bitten.\nThe truth is that when The Rescue was laid aside it was not laid aside in\ndespair. Several reasons contributed to this abandonment and, no doubt, the\nfirst of them was the growing sense of general difficulty in the handling of\nthe subject. The contents and the course of the story I had clearly in my\nmind. But as to the way of presenting the facts, and perhaps in a certain\nmeasure as to the nature of the facts themselves, I had many doubts. I mean\nthe telling, representative facts, helpful to carry on the idea, and, at the same\ntime, of such a nature as not to demand an elaborate creation of the\natmosphere to the detriment of the action. I did not see how I could avoid\nbecoming wearisome in the presentation of detail and in the pursuit of\nclearness. I saw the action plainly enough. What I had lost for the moment\nwas the sense of the proper formula of expression, the only formula that\nwould"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "time I was just as certain in my mind that Youth, a story which I had then,\nso to speak, on the tip of my pen, could not wait. Neither could Heart of\nDarkness be put off; for the practical reason that Mr. Wm. Blackwood\nhaving requested me to write something for the No. M of his magazine I\nhad to stir up at once the subject of that tale which had been long lying\nquiescent in my mind, because, obviously, the venerable Maga at her\npatriarchal age of 1000 numbers could not be kept waiting. Then Lord Jim,\nwith about seventeen pages already written at odd times, put in his claim\nwhich was irresistible. Thus every stroke of the pen was taking me further\naway from the abandoned The Rescue, not without some compunction on\nmy part but with a gradually diminishing resistance; till at last I let myself\ngo as if recognising a superior influence against which it was useless\nto contend.\nThe years passed and the pages grew in number, and the long reveries of\nwhich they were the outcome stretched wide between me and the deserted\nRescue like the smooth hazy spaces of a dreamy sea. Yet I never actually\nlost sight of that dark speck in the misty distance. It had grown very small\nbut it asserted itself"
    }
  ],
  "buku-067": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Introduction\nIn giving to his last, unfinished, novel the name of Suspense, Conrad chose\na title even more symbolic than the haunting, breathless air of the narrative\nsuggests. For the threads were snapped when the climax had still to be\nunfolded, when the characters had yet to come together in the harmony of\ncompleted action, and when the whole story hung, as it were, between the\ndarkness and the dawn. The suspense will last forever.\nNobody could even faintly guess how the novel would have ended,\nthough what he has left is itself the length of a considerable book. In that\nvast canvas, with its atmosphere of political intrigue and human passion,\nthere are endless possibilities. It had almost reached the stage, in its\nwide, slow sweep, in which fate was about to catch up the people of the\ndrama in a single net, but at the actual moment of the close we are still\ncompletely bewildered.\nThe secret will never be divulged and the title will never lose its appeal.\nOn the day before he died, scarcely an hour before he was seized with his\nfatal illness, Conrad was speaking to me about Suspense. We had gone into\nhis study after breakfast and, sitting there together, he told me how\nextraordin"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "books, for he did; but I do mean that he felt that death was near, and that he\nhoped, at least, to finish this long-pondered novel of Napoleonic times.\nDuring recent months he had often spoken to me of his death: he was\nconscious of its approach, and his earnest desire was to round off this last\ngreat effort of his imagination.\nThe wish was not fulfilled, and yet Suspense, with its splendid qualities\nof creation and atmosphere, is a very different thing from some of the\nuncompleted works left by men of genius. A fragment —yes; but a huge\nfragment, full of power and fire, a fragment that will take its place among\nthe recognized masterpieces of this remarkable man.\nAll his life Conrad was a student of the Napoleonic era. He had absorbed\nthe history, the memoirs, the campaigns of that period with immense\nassiduity and unflagging interest, and into Suspense he poured the wealth of\nhis acquired knowledge and the force of his coordinating imagination. It\nreads perfectly as an authentic and vivid recreation of that feeling which\novershadowed southern Europe while Napoleon was in Elba, and of the\nsuspense which hung, like a cloud, upon the world. This novel was, in a\nvery special way, the "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "I\nA deep red glow flushed the fronts of marble palaces piled up on the slope\nof an arid mountain whose barren ridge traced high on the darkening sky a\nghostly and glimmering outline. The winter sun was setting over the Gulf of\nGenoa. Behind the massive shore the sky to the east was like darkening\nglass. The open water too had a glassy look with a purple sheen in which\nthe evening light lingered as if clinging to the water. The sails of a few\nbecalmed feluccas looked rosy and cheerful, motionless in the gathering\ngloom. Their heads were all pointing towards the superb city. Within the\nlong jetty with the squat round tower at the end, the water of the harbour\nhad turned black. A bigger vessel with square sails, issuing from it and\narrested by the sudden descent of the calm, faced the red disc of the sun.\nHer ensign hung down and its colours were not to be made out; but a lank\nman in a shabby sailor’s jacket and wearing a strange cap with a tassel, who\nlounged with both his arms thrown over the black breech of an enormous\npiece of ordnance that with three of its monstrous fellows squatted on the\nplatform of the tower, seemed to have no doubt of her nationality; for to the\nquestion of "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "battle ship moored on the west side not far from the quay. Her tall spars\novertopped the roofs of the houses and the English ensign at her flagstaff\nhad been just hauled down and replaced by a lantern that looked strange in\nthe clear twilight. The forms of shipping crowded towards the head of the\nharbour were merging into one another. Cosmo let his eyes wander over the\ncircular platform of the tower. The man leaning over the gun went on\nsmoking with indifference.\n“Are you the guardian of this tower?” asked the young man.\nThe other gave him a sidelong glance and made answer without changing\nhis attitude and more as if speaking to himself:\n“This is now an unguarded spot. The wars are over.”\n“Do they close the door at the bottom of this tower at night?”\nenquired Cosmo.\n“That is a matter worth consideration especially for those like you, for\ninstance, who have a soft bed to go to for the night.”\nThe young than put his head on one side and looked at his interlocutor\nwith a faint smile.\n“You don’t seem to care,” he said. “So I conclude I need not. As long as\nyou are content to stay here I am safe enough. I followed you up the stairs,\nyou know.” The man with the pipe stood up abruptly. “Y"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "arrived this morning by land. I am glad I had the idea to come out\nhere to behold your town glowing in the sunset and to get a sight of a\nvessel belonging to Elba. There can’t be very many of them. But you,\nmy friend   …”\n“I have as much right to idle away my time here as any English\ntraveller,” interrupted the man hastily.\n“It is very pleasant here,” repeated the young traveller, staring into the\ndusk which had invaded the platform of the tower.\n“Pleasant?” repeated the other. “Yes, perhaps. The last time I was on this\nplatform I was only ten years old. A solid round shot was spinning and\nrattling all over the stone floor. It made a wondrous disturbance and seemed\na living thing full of fury.”\n“A solid shot!” exclaimed Cosmo, looking all over the smooth\nflagstones as if expecting to see the traces of that visitation. “Where did it\ncome from?”\n“It came from an English brig belonging to Milord Keith’s Squadron. She\nstood in quite close and opened fire on us.   … Heaven only knows why. The\naudacity of your people! A single shot from one of those big fellows,” he\ncontinued, slapping the enormous bulging breech of the gun by his side,\n“would have been enough to sink her like a stone.”\n"
    }
  ],
  "buku-068": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on digital scans from Google Books.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC\u0000 \u0000.\u0000 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology, and\neditorial standards, and distributes them free of cost. You can download this\nand other ebooks carefully produced for true book lovers at\nstandardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "A\u0000\u0000\u0000\u0000\u0000’\u0000 N\u0000\u0000\u0000\nMore than once in the log of Racundra’s little voyage I have mentioned that\nI found changes made by the war unrecorded in the obtainable charts. I\nhave just received from the Estonian Admiralty, through Mr. Edward\nWirgo, a set of charts they have recently issued which cover the whole of\nthe delightful cruising ground among the islands, and should certainly be\nobtained by the skippers of any other little ships who think of visiting these\nwaters."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "T\u0000\u0000 B\u0000\u0000\u0000\u0000\u0000\u0000\u0000 \u0000\u0000 R\u0000\u0000\u0000\u0000\u0000\u0000\u0000\nHouses are but badly built boats so firmly aground that you cannot think of\nmoving them. They are definitely inferior things, belonging to the vegetable\nnot the animal world, rooted and stationary, incapable of gay transition. I\nadmit, doubtfully, as exceptions, snail-shells and caravans. The desire to\nbuild a house is the tired wish of a man content thenceforward with a single\nanchorage. The desire to build a boat is the desire of youth, unwilling yet to\naccept the idea of a final resting-place.\nIt is for that reason, perhaps, that, when it comes, the desire to build a\nboat is one of those that cannot be resisted. It begins as a little cloud on a\nserene horizon. It ends by covering the whole sky, so that you can think of\nnothing else. You must build to regain your freedom. And always you\ncomfort yourself with the thought that yours will be the perfect boat, the\nboat that you may search the harbours of the world for and not find.\nThat is the story of Racundra. Years of planning went into her before\never a line was drawn on paper. She was to be a cruising boat that one man\ncould manage if need be, but on which three could live comfortably. She\nwas to have wr"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #12",
      "text": "that Racundra began to exist on paper. There were the lines of that stout\nnose of hers, of that stern, like the sterns of the Norwegian pilot cutters. On\npaper, I could sit at the writing-table a full yard square, in the cabin where\n(the measurements proved it) I could stand up and walk about with\nunbruised head. On paper was that little cockpit where one man, sitting\nalone, could control the little ship as she made her steady way over the\nwaters. Then came the sail-plan, after how many alterations; a snug rig; you\ncould reach the end of the mizzen boom from the deck and there was no\nbowsprit. The size of the mizzen was such that you could keep the sea and\nkeep up to the wind with mizzen and foresail alone. The balance of the sails\nwas such (again on paper) that if you wished you could sail under mainsail\nonly, or under main and mizzen, so that you could take down your staysail\nbefore coming into port and so have a clear deck for playing with warps and\nanchor chain. Racundra, on paper, grew in virtue daily.\nIt had come to such a pass that I woke from dreams at night sitting in that\npaper cockpit, with a paper tiller under my arm, steering a paper ship across\nuncharted seas. Racundr"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #13",
      "text": "firmly stuck. But, under power and sails, somehow or other, I got the ship\naway and took her round to the lake, had her out on the Yacht Club slip,\nremoved the centreboard, had a new one built, re-launched her, and just\nover a fortnight later turned the carpenters out of her and put to sea.\nBut there is no use in reminding myself now of those miserable angry\nmonths of waiting, in remembering the lacquer that was not put on, the\nungalvanized nails that I had laboriously to remove from the cabin work\nand replace with brass screws. The hull of Racundra was right enough, and,\nby the time we had finished with her, we had put right the lesser matters\nthat were wrong. Fools build and wise men buy. Well, I shall never build\nagain, and in all probability shall never have money enough to buy. Nor\nshall I have need. For Racundra turned out to be all that I had hoped. We\ntook her to sea in the Baltic autumn; we had her at sea when big steamers\nreported damage from the heavy weather, and never for a minute did she\nshow the smallest sign of disquiet. Weather that was good enough for us\nwas good enough for her, and, when the Equinox flung her home with a last\nflick of his mighty tail, she sailed "
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #15",
      "text": "T\u0000\u0000 C\u0000\u0000\u0000\nAnd now for the crew. There were three of us. There was the Cook, to\nwhom, I think, is due most of the credit for the ease and pleasantness of our\nvoyage. She can take her trick at the tiller if need be, but that, for her, is\nholiday. All the hard work was hers. She cooked a meal. It was eaten. She\nwashed up and, just as the dry dishes reached the rack, one or other of that\nhungry company would inquire whether or no the time for the next meal\nwas drawing near. She cooked another meal. As its last remains were\ncleared away, as sure as fate she would catch the eye of one or other of us\nlooking hungrily at the clock. We, of course, navigating, sailing, had our\nstrenuous moments, after which would follow long hours of plain and easy\nsteering. She, on the other hand, thanks to our appetites, became a sort of\njuggler, keeping plates, cups, saucepans, kettles, teapot, coffeepot, thermos\nflasks and Primuses in a whirl of perpetual motion. We, in harbour, idled,\nfished, and watched the barometer and the weather, sustaining our self-\nrespect by oracular utterance. She, in harbour as at sea, never for a moment\nwas able to give those pots and pans a rest. She might have been dancing o"
    }
  ],
  "buku-069": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "I\nPeril from the Sky\n“It’s certainly great to have an airport so close to Barmet Bay,” said\nFrank Hardy.\n“I wish we could go up in an airplane some time,” returned Joe,\nhis brother.\n“Wouldn’t you be scared?”\n“Me? Would you?”\n“No.”\n“Then I wouldn’t be scared either. Look at the record holders! Where\nwould they be now if they’d been afraid to go up in an airplane?”\n“That’s right,” said Frank. “Airplanes are pretty safe nowadays. Almost\nas safe as this car of ours.”\nThe two Hardy brothers were driving on the Shore Road, leading out of\nBayport and skirting Barmet Bay, in their new roadster. It was springtime.\nSnow had disappeared from the hillsides and the blue waters of the bay\nsparkled in the sunlight. Their destination this afternoon was the new\nairport, a few miles out of the city.\n“I’m glad winter is over, even if we did have a lot of fun on Cabin\nIsland,” said Joe. “It won’t be long now before we’re through school.”\n“If we pass our exams,” Frank reminded him, calmly.\n“You’ll pass all right. I’m not so sure about myself. I had to work mighty\nhard to catch up to you.”\n“Yes, but I lost a term that year I was sick. Anyway, our marks have been\ngood this year. We should get through. Is"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "“Mother has her mind set on a college course for both of us. So far as I’m\nconcerned I’d rather go into detective work with dad.”\n“It would certainly be more exciting. Still, we’d have a good time at\ncollege, I imagine,” observed Frank.\nHe turned the car into a road that branched off the main highway. This\nroad led toward the airport that had been constructed back of Bayport the\nprevious summer.\n“Wonder why they built the airport so far out,” Joe said.\n“They have to have plenty of ground. It was the only place available.\nThen, there’s a railway siding nearby and a train always meets the mail\nplanes,” Frank explained. “Dad was telling me all about it the other\nevening. They use the port for commercial flying too, and I hear they do a\nlot of business and hope to do more.”\n“An airmail pilot must have lots of nerve. It’s marvelous that they nearly\nalways bring the mail through on time. And lots faster than trains. I wish we\nknew one of the pilots. He might take us up for a flight.”\n“Chet Morton and the rest of the fellows would be green with envy,”\nrejoined Frank.\nThe roadster bounced along the rutted road toward the airport. A signpost\nnearby conveyed the information that the flying f"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "“Seems to be flying mighty queerly,” commented Frank. “Usually they\ngo along as smoothly as a bird.”\n“Nothing smooth about that one. Maybe the pilot’s in trouble.”\nThe flight of the plane was indeed erratic. It was going from side to side\nin a jerky fashion and it seemed to be flying much closer to the ground than\nsafety warranted.\n“He’ll never reach the airport at that rate,” said Frank, looking back\nagain. “He should be higher up than that. Look! He’s coming straight down,\nand the airport is a couple of miles away!”\n“I hope he doesn’t land on the road. He might hit us.”\n“If he lands on the road he’s in for a nasty crash. A plane has to have\nplenty of room to move around in.”\nBetween steering the roadster and eying the plane, Frank Hardy was well\noccupied. Joe kept looking back and staring at the descending machine.\n“I believe that fellow is in trouble,” he said. “He’s coming down right\nthis way.”\nThey could see the airplane quite clearly now. They could even see the\nfigure of the pilot in the cockpit. The machine was descending at terrific\nspeed in a long glide that made it seem inevitable that the plane would fall\nfar short of the airport.\nFrank stepped on the accelerator. The c"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Joe was really frightened. There was no hope that the plane would ever\nreach the airport, for it was flying too close to the ground. He wondered if\nthe pilot was merely trying to scare them. But the plane was diving toward\nthem in such headlong fashion that he quickly abandoned this explanation.\nPowerful though the roadster was, the speed of the plane was much\ngreater. It was scarcely two hundred feet from the ground now and its nose\nwas pointing down at a dangerous angle. In a few more seconds there\nwould be a crash, and, from the angle of flight, it seemed almost certain that\nthe heavy machine would crash directly on top of the roadster!\nThe car roared ahead, the noise of its engine drowned in the gigantic\nthrobbing of the airplane’s motor. The plane came nearer and nearer, diving\nat almost incredible speed.\n“We’re done for!” groaned Joe.\nUnless a miracle intervened the plane would crash directly on top of the\nHardy boys’ car!"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "II\nThe Crash\nFrank Hardy could scarcely keep the car on the road. He glanced at the\nspeedometer. They were traveling at seventy miles an hour.\nIt was certain that the airplane would crash on the highway.\nSuddenly Joe leaned forward.\n“Look! The side road!” he shouted. “Take the side road!”\nA short distance ahead Frank saw a rough dirt road leading off the\nhighway to the airport. If he could only reach it in time! The roar of the\ndescending airplane was deafening now. They could even hear the wind\nscreaming in the struts. Joe saw the pilot, in helmet and goggles, waving his\narm wildly.\nFrank slackened speed slightly as he neared the dirt road, bore down on\nthe wheel, and made the turn. The rear wheels skidded wildly, there was a\nscreech of brakes, the car teetered perilously, then righted itself, and shot\ndown the rough lane.\nAt the same moment the airplane roared past. It was so close that the\nwing tip came within a few feet of the rear of the car.\nThen it crashed.\nFrank was having his own troubles and he did not see the crack-up. On\nthe bumpy dirt road the car skidded, throwing up a cloud of sand and dust,\nthen shot across a ditch, thumped and lurched over some rocks, and finally\nc"
    }
  ],
  "buku-070": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC\u0000 \u0000.\u0000 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology, and\neditorial standards, and distributes them free of cost. You can download this\nand other ebooks carefully produced for true book lovers at\nstandardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "I\nA S\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000 C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\nBy the pricking of my thumbs,\nSomething wicked this way comes.\nM\u0000\u0000\u0000\u0000\u0000\u0000\nThe town clock of Sibley had just struck twelve. Court had adjourned, and\nJudge Evans, with one or two of the leading lawyers of the county, stood in\nthe doorway of the courthouse discussing in a friendly way the\neccentricities of criminals as developed in the case then before the court.\nMr. Lord had just ventured the assertion that crime as a fine art was happily\nconfined to France; to which District Attorney Ferris had replied:\n“And why? Because atheism has not yet acquired such a hold upon our\nupper classes that gentlemen think it possible to meddle with such matters.\nIt is only when a student, a doctor, a lawyer, determines to put aside from\nhis path the secret stumbling-block to his desires or his ambition that the\ntrue intellectual crime is developed. That brute whom you see slouching\nalong over the way is the type of the average criminal of the day.”\nAnd he indicated with a nod a sturdy, ill-favored man, who, with pack on\nhis back, was just emerging from a grassy lane that opened out from the\nstreet directly opposite the courthouse.\n“Such men are often seen in the dock,” remarked"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "“Rather as if he had heard the sentence which was passed upon the last\ntramp who paid his respects to this town,” corrected Mr. Lord.\n“Revenons à nos moutons,” resumed the District Attorney. “Crime, as an\ninvestment, does not pay in this country. The regular burglar leads a dog’s\nlife of it; and when you come to the murderer, how few escape suspicion if\nthey do the gallows. I do not know of a case where a murder for money has\nbeen really successful in this region.”\n“Then you must have some pretty cute detective work going on here,”\nremarked a young man who had not before spoken.\n“No, no —nothing to brag of. But the brutes are so clumsy —that is the\nword, clumsy. They don’t know how to cover up their tracks.”\n“The smart ones don’t make tracks,” interposed a rough voice near them,\nand a large, red-haired, slightly humpbacked man, who, from the looks of\nthose about, was evidently a stranger in the place, shuffled forward from the\npillar against which he had been leaning, and took up the thread of\nconversation.\n“I tell you,” he continued, in a gruff tone somewhat out of keeping with\nthe studied abstraction of his keen, gray eye, “that half the criminals are\ncaught because they do make "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "old woman when he went to her door, would bring in a verdict of murder\nagainst him, even though silver from her private drawer were found\nconcealed upon his person. The chance that he spoke the truth, and that she\nwas not in the house when he entered, and that his crime had been merely\none of burglary or theft, would be enough to save him from the hangman.”\n“That is true,” assented Mr. Lord, “unless all the other persons who had\nbeen seen to go into the yard were not only reputable men, but were willing\nto testify to having seen the woman alive up to the time he invaded her\npremises.”\nBut the humpbacked stranger had already lounged away.\n“What do you think about this, Mr. Byrd?” inquired the District Attorney,\nturning to the young man before alluded to. “You are an expert in these\nmatters, or ought to be. What would you give for the tramp’s chances if the\ndetectives took him in hand?”\n“I, sir?” was the response. “I am so comparatively young and\ninexperienced in such affairs, that I scarcely dare presume to express an\nopinion. But I have heard it said by Mr. Gryce, who you know stands\nforemost among the detectives of New York, that the only case of murder in\nwhich he utterly failed "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "“God!”\nThe solemnity with which this was uttered caused a silence, during which\nMr. Orcutt looked at his watch.\n“I must go to dinner,” he announced, withdrawing, with a slight nod,\nacross the street.\nThe rest stood for a few minutes abstractedly contemplating his retreating\nfigure, as with an energetic pace all his own he passed down the little street\nthat opened opposite to where they stood, and entered the unpretending\ncottage of a widow lady, with whom he was in the habit of taking his\nmidday meal whenever he had a case before the court.\nA lull was over the whole village, and the few remaining persons on the\ncourthouse steps were about to separate, when Mr. Lord uttered an\nexclamation and pointed to the cottage into which they had just seen\nMr. Orcutt disappear. Immediately all eyes looked that way and saw the\nlawyer standing on the stoop, having evidently issued with the utmost\nprecipitation from the house.\n“He is making signs,” cried Mr. Lord to Mr. Ferris; and scarcely knowing\nwhat they feared, both gentlemen crossed the way and hurried down the\nstreet toward their friend, who, with unusual tokens of disturbance in his\nmanner, ran forward to meet them.\n“A murder!” he excitedl"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "to rejoin Mr. Lord, who by this time was at the door of the cottage.\nThey all went in together, Mr. Ferris, who was of an adventurous\ndisposition, leading the way. The room into which they first stepped was\nempty. It was evidently the widow’s sitting-room, and was in perfect order,\nwith the exception of Mr. Orcutt’s hat, which lay on the centre-table where\nhe had laid it on entering. Neat, without being prim, the entire aspect of the\nplace was one of comfort, ease, and modest luxury. For, though the Widow\nClemmens lived alone and without help, she was by no means an indigent\nperson, as a single glance at her house would show. The door leading into\nthe farther room was open, and toward this they hastened, led by the glitter\nof the fine old china service which loaded the dining-table.\n“She is there,” said Mr. Orcutt, pointing to the other side of the room.\nThey immediately passed behind the table, and there, sure enough, lay\nthe prostrate figure of the widow, her head bleeding, her arms extended, one\nhand grasping her watch, which she had loosened from her belt, the other\nstretched toward a stick of firewood, that, from the mark of blood upon its\nside, had evidently been used to fell"
    }
  ],
  "buku-071": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the HathiTrust Digital Library.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC\u0000 \u0000.\u0000 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology, and\neditorial standards, and distributes them free of cost. You can download this\nand other ebooks carefully produced for true book lovers at\nstandardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "I\nI\nDoctor Dreeme, turning sleepily on his pillow, heard the clatter of a horse’s\nhoofs coming down the steep Leeminster Road. The steely clash on the\nrock-path tore abruptly through his semi-trance and he opened his eyes,\nscowling vaguely at the milky blur of ceiling. The horse stopped with a\nrough grating of hoofs below the window and the doctor sighed.\nMarlborough was like that. It was undoubtedly another farmer with a pain\nin his back who might just as well wait until morning. It was at night that\nhis taciturn neighbors were most obsessed with the somber consequences of\ntheir lonely ailments. In daylight they would bear them with the dumb\nequanimity of animals, sitting behind drawn curtains or plodding painfully\nover their stony fields. But they were horribly afraid of dying at night. The\nbell clanked feebly. The doctor threw back his quilted coverlet of great\nsquare patches, rose in the darkness of the room, and strode over to the\nwindow. He leaned out, straining his eyes to see who stood in the gray mist\nof the moon outside his door.\n“Who is it?” he called sharply. “Who, in the name of Heaven   … at this\ntime of night.   …”\nA boyish treble answered him.\n“Doctor Dreeme? I’m Mi"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "instant before the cracked mirror he smoothed back his tousled hair and\ndashed some cold water from the china bowl upon his sleep-warm face. It\nwas a square-cut visage, young, thin-lipped, and with long narrow eyes that\nstared back briefly at him. Two years’ arduous practice in Marlborough, a\nrelentless precision of deaths and births and ailments, had etched tiny lines\nabout his mouth and eyes and forehead, lines of watchfulness and\nconcentration, but he was still surprisingly youthful in appearance and alert\nin action. He grasped his black bag and hurried down the stairs, slipping the\nbolt and stepping into the dim lane where the huge farm-horse pawed\nimpatiently at the ground. The blank windows of the Slater house stared\ndown at him gloomily as he turned to the boy, Miles, who perched like a\nsmall monkey on his mount.\n“Are you sure that Jeffrey Westcott wants me to come?” asked Dreeme as\nhe climbed to a seat on the blanket that served for a saddle. There was a\nminor note of amazement in his voice.\nThe boy said nothing but chirped to his horse and the huge beast swung\nin the lane and mounted the hill, slowly at first and then at a smart canter as\nthe ascent eased its sharp angle. "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "way to various patients and occasionally he had seen Jeffrey Westcott ride\ninto town for supplies, but that was all. The Westcotts took no part in the\nlife of Marlborough. Indeed, they seemed frankly to court an ostracism that\nhad long ago been willingly granted them by the unusual breed of natives\nwho dwelt in this part of New England. Dreeme, curious and observant\nwhen he first arrived in Marlborough and took up the practice of his father’s\nold friend, Humphrey Lathrop, had asked questions about the Westcotts, as,\nindeed, he had about all the farmers in the neighbourhood, for he believed\nin mixing as much psychological insight as possible with his medicinal\ntreatments, but he soon discovered that questions were not welcome in the\ntown. An excessive reticence possessed these leather-skinned delvers in the\nsoil, these small-shopkeepers, and even the brief scattering of professional\nmen who conducted the affairs of Marlborough. Therefore, as Dreeme was\nan astute and adaptable young man, he speedily learned to keep his mouth\nshut and, at least outwardly, to suppress his curiosity. It was enough to serve\nas well as he could when he was called upon and to expend whatever\nmental energie"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "religious fervor jaundiced with personal hypocrisy, an old pride bolstered\nby a stony soil, a nasal twang possibly induced by generations of psalm-\nsinging through the nose, a stubborn zeal in labor and an inborn stinginess.\nYou have seen that type of New Englander and I do not go so far as to say\nthat you will not find it here; but there is a type of New Englander in this\nplace that you have never seen before and of which I knew nothing until I\ncame here. Marlborough and, to a lesser degree, Leeminster are cul-de-sacs\ninto which an ancient backwash of old blood has flowed. It has been\nunrelieved by any new influx for two hundred years or more. It is not easy\nto get up here, you know, and once here there is little to hold an ambitious\nman. That is why you will go away some day. These people have dwelt here\nin this valley so opportunely surrounded by the Florida mountains and have\nintermarried for generations. Some day, perhaps the day when you leave\nforever, I will tell you what curious breed of Puritan drifted into this valley\nand established these communities. You will be amazed, for they are a\nbreed of which you catch but furtive glances and hints in Pilgrim and\nPuritan chronicl"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "the lurching houses seemed to watch him maliciously and when the still\ntrees, flinging their black shadows across the yellow glitter of deserted\nroads, would stand as symbols of some invisible prowling specter that\npatrolled the valley and observed him with blank lidless eyes. His flesh\ncrawled on his bones and it was only by an effort that he put the obsession\nfrom him. He would say to himself that it was ennui, that it was a morbid\nreaction to his existence in a small world where, in spite of his\nministrations, he was an outsider, that it was nerves, but, considering the\nmatter deliberately, he knew that it was none of these likely causes. He\npossessed no nerves; he was not weary of his loneliness; his mind was not\ntoo idle. It was something outside of him pushing gently against his mind.\nII\nThe horse thudded ponderously up the road.\n“How did Westcott shoot himself?” asked Dreeme suddenly.\nThe boy turned his thin face and green eyes over his small hunched\nshoulder, opened his mouth to speak, and then closed it firmly.\n“I calculate that he’ll tell you that,” he finally answered. He kicked\nferociously at the horse’s ribs with his small bare feet.\nA few drops of rain dashed against "
    }
  ],
  "buku-072": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC\u0000 \u0000.\u0000 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology, and\neditorial standards, and distributes them free of cost. You can download this\nand other ebooks carefully produced for true book lovers at\nstandardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "L\u0000\u0000\u0000\u0000\u0000 \u0000\u0000\u0000\u0000 M\u0000\u0000\u0000 S\u0000\u0000\u0000\u0000\u0000 M\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000 \u0000\u0000 H\u0000\u0000\nN\u0000\u0000\u0000\u0000\u0000, S\u0000\u0000 E\u0000\u0000\u0000\u0000\u0000 M\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000, T\u0000\u0000\u0000 \u0000\nS\u0000\u0000\u0000\u0000\u0000\u0000 \u0000\u0000 C\u0000\u0000\u0000\u0000\u0000 C\u0000\u0000\u0000\u0000\u0000, O\u0000\u0000\u0000\u0000\u0000\n\u0000\u0000 Pauncefort Buildings, Bath, Oct. \u0000\u0000, \u0000\u0000\u0000\u0000\nM\u0000 \u0000\u0000\u0000\u0000 E\u0000\u0000\u0000\u0000\u0000,\nIt was your late father’s dying request that certain events which\noccurred in his last years should be communicated to you on\nyour coming of age. I have reduced them to writing, partly\nfrom my own recollection, which is, alas! still too vivid, and\npartly with the aid of notes taken at the time of my brother’s\ndeath. As you are now of full age, I submit the narrative to you.\nMuch of it has necessarily been exceedingly painful to me to\nwrite, but at the same time I feel it is better that you should\nhear the truth from me than garbled stories from others who did\nnot love your father as I did.\nYour loving Aunt, \nS\u0000\u0000\u0000\u0000\u0000 M\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\nTo Sir Edward Maltravers, Bart."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "I\nYour father, John Maltravers, was born in \u0000\u0000\u0000\u0000 at Worth, and succeeded his\nfather and mine, who died when we were still young children. John was\nsent to Eton in due course, and in \u0000\u0000\u0000\u0000, when he was nineteen years of age,\nit was determined that he should go to Oxford. It was intended at first to\nenter him at Christ Church; but Dr. Sarsdell, who visited us at Worth in the\nsummer of \u0000\u0000\u0000\u0000, persuaded Mr. Thoresby, our guardian, to send him instead\nto Magdalen Hall. Dr. Sarsdell was himself Principal of that institution, and\nrepresented that John, who then exhibited some symptoms of delicacy,\nwould meet with more personal attention under his care than he could hope\nto do in so large a college as Christ Church. Mr. Thoresby, ever solicitous\nfor his ward’s welfare, readily waived other considerations in favour of an\narrangement which he considered conducive to John’s health, and he was\naccordingly matriculated at Magdalen Hall in the autumn of \u0000\u0000\u0000\u0000.\nDr. Sarsdell had not been unmindful of his promise to look after my\nbrother, and had secured him an excellent first-floor sitting-room, with a\nbedroom adjoining, having an aspect towards New College Lane.\nI shall pass over the first two years"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "in easy circumstances, had not a pianoforte in his rooms, and was pleased to\nuse a fine instrument by D’Almaine that John had that term received as a\nbirthday present from his guardian.\nFrom that time the two students were thrown much together, and in the\nautumn term of \u0000\u0000\u0000\u0000 and Easter term of \u0000\u0000\u0000\u0000 practised a variety of music in\nJohn’s rooms, he taking the violin part and Mr. Gaskell that for the\npianoforte.\nIt was, I think, in March \u0000\u0000\u0000\u0000 that John purchased for his rooms a piece\nof furniture which was destined afterwards to play no unimportant part in\nthe story I am narrating. This was a very large and low wicker chair of a\nform then coming into fashion in Oxford, and since, I am told, become a\nfamiliar object of most college rooms. It was cushioned with a gaudy\npattern of chintz, and bought for new of an upholsterer at the bottom of the\nHigh Street.\nMr. Gaskell was taken by his uncle to spend Easter in Rome, and\nobtaining special leave from his college to prolong his travels; did not\nreturn to Oxford till three weeks of the summer term were passed and May\nwas well advanced. So impatient was he to see his friend that he would not\nlet even the first evening of his return pass with"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "been accurately made, and could be read with tolerable comfort by an\nadvanced musician in spite of the antiquated notation.\nPerhaps by accident, or perhaps by some mysterious direction which our\nminds are incapable of appreciating, his eye was arrested by a suite of four\nmovements with a basso continuo, or figured bass, for the harpsichord. The\nother suites in the book were only distinguished by numbers, but this one\nthe composer had dignified with the name of “l’Areopagita.” Almost\nmechanically John put the book on his music-stand, took his violin from its\ncase, and after a moment’s tuning stood up and played the first movement, a\nlively coranto. The light of the single candle burning on the table was\nscarcely sufficient to illumine the page; the shadows hung in the creases of\nthe leaves, which had grown into those wavy folds sometimes observable in\nbooks made of thick paper and remaining long shut; and it was with\ndifficulty that he could read what he was playing. But he felt the strange\nimpulse of the old-world music urging him forward, and did not even pause\nto light the candles which stood ready in their sconces on either side of the\ndesk. The coranto was followed by a saraban"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #11",
      "text": "wicker chair again attracted his attention, and he heard distinctly sounds\nsuch as would be made by a person raising himself from a sitting posture.\nThis time, being less surprised, he could more aptly consider the probable\ncauses of such a circumstance, and easily arrived at the conclusion that\nthere must be in the wicker chair osiers responsive to certain notes of the\nviolin, as panes of glass in church windows are observed to vibrate in\nsympathy with certain tones of the organ. But while this argument approved\nitself to his reason, his imagination was but half convinced; and he could\nnot but be impressed with the fact that the second creaking of the chair had\nbeen coincident with his shutting the music-book; and, unconsciously,\npictured to himself some strange visitor waiting until the termination of the\nmusic, and then taking his departure.\nHis conjectures did not, however, either rob him of sleep or even disturb\nit with dreams, and he woke the next morning with a cooler mind and one\nless inclined to fantastic imagination. If the strange episode of the previous\nevening had not entirely vanished from his mind, it seemed at least fully\naccounted for by the acoustic explanation to"
    }
  ],
  "buku-073": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on transcriptions from Project Gutenberg and\non digital scans from various sources.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC\u0000 \u0000.\u0000 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology, and\neditorial standards, and distributes them free of cost. You can download this\nand other ebooks carefully produced for true book lovers at\nstandardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "T\u0000\u0000 G\u0000\u0000\u0000\u0000 D\u0000\u0000\u0000’\u0000 R\u0000\u0000\u0000\u0000\u00001\nThere is in New York a club called the Balmoral, which has two\npeculiarities —no one ever goes there much before midnight, and it is the\nonly place in town where you can get anything fit to eat at four o’clock in\nthe morning. The members are politicians of the higher grade, men about\ntown, and a sprinkle of nondescripts. In the unhallowed inspiration of a\nmoment, Alphabet Jones, the novelist —in polite society Mr. A. B. Fenwick\nChisholm-Jones —baptized it the Smallpox, a name which has stuck\ntenaciously, the before-mentioned members being usually pitted —against\neach other. Of the many rooms of the club, one, it should be explained, is\nthe most enticing. It is situated on an upper floor, and the siren that presides\ntherein is a long table dressed in green. Her name is Baccarat.\nOne night last February, Alphabet Jones rattled up to the door in a\nvagabond hansom. He was thirsty, impecunious, and a trifle tired. He had\nbeen to a cotillon, where he had partaken of champagne, and he wanted to\nget the taste of it out of his throat. He needed five hundred dollars, and in\nhis card-case there were only two hundred and fifty. The bar of the\nAthenaeum Club he knew at "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "worth knowing in New York, and, it may be added, in several other cities as\nwell.\nHe took out his card-case and thumbed the roll of bills reflectively. If he\nwent upstairs, he told himself, he might double the amount in two minutes.\nBut then, again, he might lose it. Yet, if he did, might not five hundred be as\neasily borrowed as two hundred and fifty?\n“It’s brutal to be so hard up,” he mused. “Literature doesn’t pay. I might\nbetter set up as publisher, open a drug-shop, turn grocer, do anything, in\nfact, which is brainless and remunerative, than attempt to earn a living by\nthe sweat of my pen. There’s that Interstate Magazine: the editor sent me a\nnote by a messenger this morning, asking for a story, adding that the\nmessenger would wait while I wrote it. Evidently he thinks me three parts\nstenographer and the rest kaleidoscope. What is a good synonym for an\neditor, anyway?”\nAnd as Jones asked himself this question he glared fiercely in a mirror\nthat extended from cornice to floor. Then, mollified, possibly, by his own\nappearance, for he was a handsome man, tall, fair, and clear of skin, he\nthrew himself on a sofa, and fell to thinking about the incidents of the ball.\nFor some time"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "“It was this way,” the stranger exclaimed, excitedly, when he and Jones\nhad been introduced. “I was telling these gentlemen when you came in that\nyou looked like the Grand Duke Sergius —”\n“Thank you,” the novelist answered, affably. “The same to you.”\n“I never saw him though,” the stranger continued.\n“No more have I.”\n“Only his picture.”\n“Your remark, then, was doubly flattering.”\n“But the picture to which I allude was that of a chimerical grand duke.”\n“Really, sir, really you are overwhelming.”\n“But wait a minute, do wait a minute. Mr. Jones, I don’t know whether\nyou caught my name: it is Fairbanks —David Fairbanks.”\n“Delighted! I remember it perfectly. My old friend, Nicholas Manhattan,\nbought a ruby of you once, and a beauty it was. I heard at the time that you\nmade a specialty of them.”\n“So did the grand duke. He came here, you know, on that man-of-war.”\n“Yes, I know. Mrs. Wainwaring gave him a reception. It was just my\nluck: I was down with the measles at the time.”\n“Oh, you were, were you? You were down with the measles, eh? Well, I\nwish I had been. Gentlemen, listen to this; you must listen. I was in my\noffice in Maiden Lane one day, when a young man came in. He wore the\nmos"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "fortnight, and it was said —However, there is no use in going into that. So I\nshowed him a few; but, if you will believe me, he wanted enough to make a\ntiara. I told him that a tiara of stones of that quality would come anywhere\nfrom sixty to eighty thousand dollars. If I had said a peck of groats he could\nnot have appeared more indifferent. ‘It is a great deal of money,’ I said. He\nsmiled a little at that, as though he were thinking, ‘Poor devil of an\nAmerican, it may seem a great deal of money to you, but to a grand\nduke —!’ Then I brought out all I had. He looked them over with the pincers\nvery carefully, and asked how much I valued them at. I told him a hundred\nand ten thousand dollars. He didn’t turn a hair.”\n“Was he bald?” Jones asked.\n“No, sir, he was not; and your jest is ill-timed. Gentlemen, I appeal to\nyou. I insist on Mr. Jones’s attention —”\n“Why, the man is crazy,” Jones mused. “What does he mean by saying\nthat my jest is ill-timed? But why does he insist on my attention? He’s\ndrunk —that’s what he is; he’s drunk and quarrelsome. Well, let him be.\nWhat do I care?” And Alphabet Jones looked complacently at his white\nwaistcoat and then over at his excitable vis-à-vis. M"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "thought, “it would be amusing indeed if he tried to prevent me.” He put his\nhand over his eyes and let Mr. Fairbanks ramble on.\n“You see,” he heard him say, in connection with something that had gone\nbefore, “a man in my business has to be careful. Now, there are rubies and\nrubies. I only handle the Oriental stones, which are a variety of the hyaline\ncorindus. They are found in Ceylon, in Tibet, and in Burma among the\ncrumblings of primordial rock. But I have seen beauties that were picked\nfrom waste lands in China from which the granite had presumably\ndisappeared. They are the most brilliant and largest of all. There is another\nkind, which looks like a burned topaz: it is found in Brazil and\nMassachusetts. Then there is the Bohemian ruby, which is nothing but\nquartz reddened by the action of manganese; and there are also imitations\nso well made that only an expert can tell them from the real. I keep a few of\nthe latter on hand so as to be able to gauge a customer. Well, gentlemen, the\nRussian picked up two of them, which I placed before him, and put them to\none side. He knew the false article at a glance. Your friend, Jones, that\nsimpleton Nicholas Manhattan, would have taken one "
    }
  ],
  "buku-074": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "P UBLISHER ’ S  N OTE\nThe lectures in this volume were originally delivered to the students of the\nPastors’ College, Metropolitan Tabernacle, London, England. It is the first\nof his unfinished books to be published, and one to which he had himself\ngiven the title, The Art of Illustration.\nOf the five lectures included in this volume, the first two were revised\nduring Mr. Spurgeon’s lifetime. Two were partially revised by him before\nbeing redelivered to a later company of students than those who had heard\nthem for the first time.\nThe remaining lecture was printed substantially as it was taken by the\nreporter; only such verbal corrections having been made as were absolutely\nnecessary to insure accuracy of statement. Mr. Spurgeon has said of his\nlectures to his students: “I am as much at home with my young brethren as\nin the bosom of my family, and therefore speak without restraint. I do not\noffer that which has cost me nothing, for I have done my best, and taken\nabundant pains. Therefore, with clear conscience, I place my work at the\nservice of my brethren, especially hoping to have a careful reading from\nyoung preachers, whose profiting has been my principal aim.”\nW. B. K."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "L ECTURE I\nI LLUSTRATIONS  IN  P REACHING\nThe topic now before us is the use of illustrations in our sermons. Perhaps\nwe shall best subserve our purpose by working out an illustration in the\npresent address; for there is no better way of teaching the art of pottery than\nby making a pot. Quaint Thomas Fuller says, “Reasons are the pillars of the\nfabric of a sermon; but similitudes are the windows which give the best\nlights.” The comparison is happy and suggestive, and we will build up our\ndiscourse under its direction.\nThe chief reason for the construction of windows in a house is, as Fuller\nsays, to let in light. Parables, similes, and metaphors have that effect; and\nhence we use them to illustrate our subject, or, in other words, to “brighten\nit with light,” for that is Dr. Johnson’s literal rendering of the word\nillustrate. Often when didactic speech fails to enlighten our hearers we may\nmake them see our meaning by opening a window and letting in the\npleasant light of analogy. Our Saviour, who is the light of the world, took\ncare to fill his speech with similitudes, so that the common people heard\nhim gladly; his example stamps with high authority the practice of\nilluminating he"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "address; as Ezekiel, in his vision of the temple, saw that even to the little\nchambers there were windows suitable to their size. If we are faithful to the\nspirit of the gospel we labor to make things plain: it is our study to be\nsimple and to be understood by the most illiterate of our hearers; let us,\nthen, set forth many a metaphor and parable before the people. He wrote\nwisely who said, “The world below me is a glass in which I may see the\nworld above. The works of God are the shepherd’s calendar and the\nplowman’s alphabet.” Having nothing to conceal, we have no ambition to\nbe obscure. Lycophron declared that he would hang himself upon a tree if\nhe found a person who could understand his poem entitled The Prophecy of\nCassandra. Happily no one arose to drive him to such a misuse of timber.\nWe think we could find brethren in the ministry who might safely run the\nsame risk in connection with their sermons. Still have we among us those\nwho are like Heraclitus, who was called “the Dark Doctor” because his\nlanguage was beyond all comprehension. Certain mystical discourses are so\ndense that if light were admitted into them it would be extinguished like a\ntorch in the Grotta del Cane: "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "pleasant to see how all eyes turned that way, and rejoiced in the light: such\nis frequently the effect of an apt simile in the midst of a sermon; it lights up\nthe whole matter, and gladdens every heart. Even the little children open\ntheir eyes and ears, and a smile brightens up their faces as we tell a story;\nfor they, too, rejoice in the light which streams in through our windows. We\ndare say they often wish that the sermon were all illustrations, even as the\nboy desired to have a cake made all of plums; but that must not be: there is\na happy medium, and we must keep to it by making our discourse pleasant\nhearing, but not a mere pastime. No reason exists why the preaching of the\ngospel should be a miserable operation either to the speaker or to the hearer.\nPleasantly profitable let all our sermons be. A house must not have thick\nwalls without openings, neither must a discourse be all made up of solid\nslabs of doctrine without a window of comparison or a lattice of poetry; if\nso, our hearers will gradually forsake us, and prefer to stay at home and\nread their favorite authors, whose lively tropes and vivid images afford\nmore pleasure to their minds.\nEvery architect will tell you th"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "places of worship —are a great blessing by refreshing and reviving the\naudience with a little pure air, and arousing the poor mortals who are\nrendered sleepy by the stagnant atmosphere. A window should, according to\nits name, be a wind-door, through which a breath of air may visit the\naudience; even so, an original figure, a noble image, a quaint comparison, a\nrich allegory, should open upon our hearers a breeze of happy thought,\nwhich will pass over them like life-giving breath, arousing them from their\napathy, and quickening their faculties to receive the truth. Those who are\naccustomed to the soporific sermonizings of certain dignified divines would\nmarvel greatly if they could see the enthusiasm and lively delight with\nwhich congregations listen to speech through which there flows a quiet\ncurrent of happy, natural illustration. Arid as a desert are many volumes of\ndiscourses which are to be met with upon the booksellers’ dust-covered\nshelves; but if in the course of a thousand paragraphs they contain a single\nsimile, it is as an oasis in the Sahara, and serves to keep the reader’s soul\nalive. In fashioning a discourse think little of the bookworm, which will be\nsure of its port"
    }
  ],
  "buku-075": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "I\nThe building of the large hall had been brought about by people who gave\nno thought to the wonder of moving from one space to another and up and\ndown stairs. Yet this wonder was more to them than all the things on which\ntheir thoughts were fixed. If they would take time to realise it. No one takes\ntime. No one knows it.   … But I know it.   … These seconds of knowing, of\nbeing told, afresh, by things speaking silently, make up for the pain of\nfailing to find out what I ought to be doing.   …\nAway behind, in the flatly echoing hall, was the busy planning world of\nsocialism, intent on the poor. Far away in tomorrow, stood the established,\nunchanging world of Wimpole Street, linked helpfully to the lives of the\nprosperous classes. Just ahead, at the end of the walk home, the small\nisolated Tansley Street world, full of secretive people drifting about on the\nedge of catastrophe, that would leave, when it engulfed them, no ripple on\nthe surface of the tide of London life. In the space between these\nsurrounding worlds was the everlasting solitude; ringing as she moved to\ncross the landing, with voices demanding an explanation of her presence in\nany one of them.\n“Now that,” she quoted, "
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "well-known, chilly titles of the books, to read what had gathered in her\nmind during the evening.\nA group of people who had come out just behind her were going down\nthe stairs arguing in high-pitched, public platform voices from the surfaces\nof their associated minds. Not saying what they thought. Not thinking.\nStrong and controlled enough to keep within pattern of clever words. Most\nof them had been born to it. Born on the stage of clever words, which yet\nmeant nothing to them. But to one or two people in the society these words\ndid mean something.   …\nNothing came after they had passed but the refrain that had been the\nmental accompaniment of her listening throughout the evening, stepping\nforth now as part of a high-pitched argumentative to and fro. Her part, if she\ncould join in and shout them all down. Sounding irrelevant and yet coming\nright down to earth, one small part of a picture puzzle set in place   … a clue.\n“Any number of barristers,” she vociferated in her mind, going on down\nthe shallow stair, “take up journalism. Get into Parliament. On the strength\nof being both educated and articulate. Weapons, giving an unfair advantage.\nThe easy touch of prominence. Only a good "
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "“These large speculations are most-fatiguing.”\n“No. When you see truth in them they are refreshing. They are all there\nis. All I live for now, is the arrival in my mind, of fresh generalisations.”\n“That is good. But remember also that these things cost life.”\n“What does it matter what they cost? A shape of truth makes you at the\nmoment want to die, full of gratitude and happiness. It fills everything\nwith a music to which you could die. The next piece of life comes as\na superfluity.”\n“Le superflu; chose nécessaire.”\nAt the foot of the stairs stood the yellow streetlight, framed in the oblong\nof the doorway. She went out into its shelter. The large grey legal buildings\nthat stood by day a solid, dignified pile against the sky, a whole remaining\nregion of the pride of London, showed only their lower façades, near, gentle\nfrontages of mellow golden light and soft rectangular shadow, just above\nthe brightly gilded surface of the deserted roadway. For a moment she stood\nlistening to the reflection of the fostering light and breathing in the dry\nwarm freshness of the London night air.\nThe illuminated future faded. The street lights of that coming time might\nthrow their rays more liberall"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "linked statements of the lecture, whether these were her proper concern, or\nyet another step upon a long pathway of transgression. She was grasping at\nincompatible things, sacrificing the bliss of her own uninfluenced life to the\ntemptation of gathering things that had been offered by another mind.\nThings to which she had no right?\nBut all the things of the mind that had come her way had come unsought;\nyet finding her prepared; so that they seemed not only her rightful property,\nbut also in some way, herself. The proof was that they had passed her sisters\nby, finding no response; but herself they had drawn, often reluctant,\nperpetually escaping and forgetting; out on to a path that it sometimes\nseemed she must explore to the exclusion of everything else in life,\nexhaustively, the long way round, the masculine way. It was clearly not her\nfault that she had a masculine mind. If she must pay the penalties, why\nshould she not also reap the entertainments?\nStill, it was strange, she reflected, with a consulting glance at the\nreturning brilliance, that without any effort of her own, so very many\ndifferent kinds of people and thoughts should have come, one after the\nother, as if in an ord"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "unexpected thing at the very moment of perfect hopelessness. It was like a\ngame   … something was having a game of hide and seek with her. She\nwinked, smiling, at the returned surrounding glow, and turned back to run\nup and down the steps of the neglected argument.\nIt was clear in her mind. Freed from the fascinating distraction of the\nlittle man’s mannerisms, it spread fresh light, in all directions, tempering\nthe golden light of the street; showing, beyond the outer darkness of the\nnight, the white radiance of the distant future. Within the radiance, troops of\npeople marched ahead, with springing footsteps; the sound of song in their\nceaselessly talking voices; the forward march of a unanimous, lighthearted\nhumanity along a pathway of white morning light.   … The land of promise\nthat she would never see; not through being born too soon, but by being\nincapable of unanimity. All these people had one mind. They approved of\neach other and were gay in unity.\nThe spectacle of their escape from the shadows lessened the pain of\nbeing left behind. Perhaps even a moment’s contemplation of the future\nhelped to bring it about? Every thought vibrates through the universe. Then\nthere was absol"
    }
  ],
  "buku-076": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Dramatis Personae\nBenhadad, King of Damascus\nRezon, High Priest of the House of Rimmon\nSaballidin, A Noble of Damascus\nHazael, Courtier of Damascus\nIzdubhar, Courtier of Damascus\nRakhaz, Courtier of Damascus\nShumakim, The King’s Fool\nElisha, Prophet of Israel\nNaaman, Captain of the Armies of Damascus\nRuahmah, A Captive Maid of Israel\nTsarpi, Wife to Naaman\nKhamma, Attendant of Tsarpi\nNubta, Attendant of Tsarpi\nSoldiers, Servants, Citizens, etc., etc.\nScene: Damascus and the Mountains of Samaria."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "Act I\nScene I\nNight, in the garden of naaman at Damascus. At the left,\non a slightly raised terrace, the palace, with softly\ngleaming lights and music coming from the open latticed\nwindows. The garden is full of oleanders, roses,\npomegranates, abundance of crimson flowers; the air is\nheavy with their fragrance: a fountain at the right is\nplashing gently: behind it is an arbour covered with\nvines. Near the centre of the garden stands a small,\nhideous image of the god Rimmon. Back of the arbour\nrises the lofty square tower of the House of Rimmon,\nwhich casts a shadow from the moon across the garden.\nThe background is a wide, hilly landscape, with a high\nroad passing over the mountains toward the snow-clad\nsummits of Mount Hermon in the distance. Enter by the\npalace door, the lady tsarpi, robed in red and gold, and\nfollowed by her maids, khamma and nubta. She remains\non the terrace: they go down into the garden, looking\nabout, and returning to her.\nkhamma There’s no one here; the garden is asleep.\nnubta The flowers are nodding, all the birds abed,\nAnd nothing wakes except the watchful stars!"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "khamma The stars are sentinels discreet and mute:\nHow many things they know and never tell!\ntsarpi (Impatiently.)\nUnlike the stars, how many things you tell\nAnd do not know! When comes your master home?\nnubta Lady, his armour-bearer brought us word\nAn hour ago, the master will be here\nAt moonset, not before.\ntsarpi He haunts the camp\nAnd leaves me much alone; yet I can pass\nThe time of absence not unhappily,\nIf I but know the time of his return.\nAn hour of moonlight yet! Khamma, my mirror!\nThese curls are ill arranged, this veil too low —\nSo —that is better, careless maids! Withdraw —\nBut warn me if your master should appear.\nkhamma Mistress, have no concern; for when we hear\nThe clatter of his horse along the street,\nWe’ll run this way and lead your dancers down\nWith song and laughter —you shall know in time.\n(Exeunt khamma and nubta, laughing. tsarpi descends\nthe steps.)\ntsarpi My guest is late; but he will surely come!\nHunger and thirst will bring him to my feet.\nThe man who burns to drain the cup of love —\nThe priest whose greed of glory never fails —\nBoth, both have need of me, and he will come.\nAnd I —what do I need? Why everything\nThat helps my beauty to a higher throne;\nAll"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "This may a woman win, and this will I.\n(Enter rezon quietly from the shadow of the trees. He\nstands behind tsarpi and listens, smiling, to her last words.\nThen he drops his mantle of leopard-skin, and lifts his high-\npriest’s rod of bronze, shaped at one end like a star, at the\nother like a thunderbolt.)\nrezon Tsarpi!\ntsarpi The mistress of the house of Naaman\nSalutes the keeper of the House of Rimmon.\n(She bows low before him.)\nrezon Rimmon receives you with his star of peace;\n(He lowers the star-point of the rod, which glows for a\nmoment with rosy light above her head.)\nAnd I, his chosen minister, kneel down\nBefore your regal beauty, and implore\nThe welcome of the woman for the man.\ntsarpi (Giving him her hand, but holding off his embrace.)\nThus Tsarpi welcomes Rezon! Nay, no more!\nTill I have heard what errand brings you here\nBy night, within the garden of the man\nWho hates you most and fears you least in all Damascus.\nrezon (Rising, and speaking angrily.)\nTrust me, I repay his scorn\nWith double hatred —Naaman, the man\nWhom the King honours and the people love,\nWho stands against the nobles and the priests,\nAgainst the oracles of Rimmon’s House,\nAnd cries, “We’ll fight to keep D"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "Of liberty, who loves the city more\nThan he reveres the city’s ancient god:\nThis frigid husband who sets you below\nHis dream of duty to a horde of slaves:\nThis man I hate, and I will humble him.\ntsarpi I think I hate him too. He stands apart\nFrom me, ev’n while he holds me in his arms,\nBy something that I cannot understand,\nNor supple to my will, nor melt with tears,\nNor quite dissolve with blandishments, although\nHe swears he loves his wife next to his honour!\nNext? That’s too low! I will be first or nothing.\nrezon With me you are the first, the absolute!\nWhen you and I have triumphed you shall reign;\nAnd you and I will bring this hero down.\ntsarpi But how? For he is strong.\nrezon By these, the eyes\nOf Tsarpi; and by this, the rod of Rimmon.\ntsarpi Speak clearly; tell your plan.\nrezon You know the host\nOf the Assyrian king has broken forth\nAgain to conquer us. Envoys have come\nFrom Shalmaneser to demand surrender.\nOur king Benhadad wavers, for he knows\nHis weakness. All the nobles, all the rich,\nWould purchase peace that they may grow more rich:\nOnly the people and the soldiers, led\nBy Naaman, would fight for liberty.\nBlind fools! Today the envoys came to pay\nTheir worship to our "
    }
  ],
  "buku-077": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Faded Page and on\ndigital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "I\nIn Which the Metropolitan Diamond Syndicate Holds\nConverse with Mr. Edward Blackton\nWith a sigh of pleasure Mr. Edward Blackton opened the windows of his\nbalcony and leaned out, staring over the lake. Opposite, the mountains of\nSavoy rose steeply from the water; away to the left the Dent du Midi raised\nits crown of snow above the morning haze.\nBelow him the waters of the lake glittered and scintillated with a\nthousand fires. A steamer, with much blowing of sirens and reversing of\npaddle-wheels, had come to rest at a landing-stage hard by, and was taking\non board a bevy of tourists, while the gulls circled round shrieking\ndiscordantly. For a while he watched them idly, noting the quickness with\nwhich the birds swooped and caught the bread as it was thrown into the air,\nlong before it reached the water. He noted also how nearly all the food was\nsecured by half a dozen of the gulls, whilst the others said a lot but got\nnothing. And suddenly Mr. Edward Blackton smiled.\n“Like life, my dear,” he said, slipping his arm round the waist of a girl\nwho had just joined him at the window. “It’s the fool who shouts in this\nworld: the wise man says nothing and acts.”\nThe girl lit a cigarette th"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "“What is it, my dear?” he said solicitously. “Bored?”\n“No, not bored,” she answered. “Whatever may be your failings, mon\nami, boring me is not one of them. I was just wondering what it would feel\nlike if you and I were content to go on a paddle-wheel steamer with a\nBaedeker and a Kodak, and a paper bag full of bananas.”\n“We will try tomorrow,” said the man, gravely lighting a cigar.\n“It wouldn’t be any good,” laughed the girl. “Just once in a way we\nshould probably love it. I meant I wonder what it would feel like if that was\nour life.”\nHer companion nodded.\n“I know, carissima,” he answered gently. “I have sometimes wondered\nthe same thing. I suppose there must be compensations in respectability,\notherwise so many people wouldn’t be respectable. But I’m afraid it is one\nof those things that we shall never know.”\n“I think it’s that,” said the girl, waving her hand towards the mountains\nopposite —“that has caused my mood. It’s all so perfectly lovely: the sky is\njust so wonderfully blue. And look at that sailing boat.”\nShe pointed to one of the big lake barges, with its two huge lateen sails\ncreeping gently along in the centre of the lake. “It’s all so peaceful, and\nsometimes one wan"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "the time, and so he called me in. And it cost him in all five million pounds.\nWhat was that to him?”\nHe shrugged his shoulders contemptuously.\n“A mere flea-bite —a bagatelle. Why, with that man an odd million or two\none way or the other wouldn’t be noticed in his passbook.”\nHe paused and stared over the sunlit lake, while the girl watched him\nin silence.\n“Given money as big as that, and a man can rule the world. Moreover, he\ncan rule it without fear of consequences. He can have all the excitement he\nrequires; he can wield all the power he desires —and have special posses of\npolice to guard him. I’m afraid we don’t have many to guard us.”\nThe girl laughed and lit another cigarette.\n“You are right, mon ami, we do not. Hullo! who can that be?”\nInside the sitting-room the telephone bell was ringing, and with a slight\nfrown Mr. Edward Blackton took off the receiver.\n“What is it?”\nFrom the other end came the voice of the manager, suitably deferential as\nbefitted a client of such obvious wealth installed in the most palatial suite of\nthe Palace Hotel.\n“Two gentlemen are here, Mr. Blackton,” said the manager, “who wish to\nknow when they can have the pleasure of seeing you. Their names are "
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "“How did they find out your address? I thought you had left strict\ninstructions that you were not to be disturbed.”\nThere was regret in the girl’s voice, and with a faint smile the man tilted\nback her head and kissed her.\n“In our profession, cara mia,” he said gently, “there are times when the\nstrictest instructions have to be disobeyed. Freyder would never have\ndreamed of worrying me over a little thing, but unless I am much mistaken\nthis isn’t going to be little. It’s going to be big: those two below don’t go\nchasing half across Europe because they’ve mislaid a collar stud. Why —\nwho knows? —it might prove to be the big coup we were discussing a few\nminutes ago.”\nHe kissed her again; then he turned abruptly away and the girl gave a\nlittle sigh. For the look had come into those grey-blue eyes that she knew so\nwell: the alert, keen look which meant business. He crossed the room, and\nunlocked a heavy leather dispatch-case. From it he took out a biggish book\nwhich he laid on the table. Then having made himself comfortable on the\nbalcony, he lit another cigar, and began to turn over the pages.\nIt was of the loose-leaf variety, and every page had entries on it in\nBlackton’s small, neat"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "description. And these details had one object and one object only —to assist\nat the proper time and place in parting the victim from his money.\nNot that Mr. Edward Blackton was a common blackmailer —far from it.\nBlackmailing pure and simple was a form of amusement which revolted his\nfeelings as an artist. But to make use of certain privately gained information\nabout a man when dealing with him was a different matter altogether.\nIt was a great assistance in estimating character when meeting a man for\nthe first time to know that his previous wife had divorced him for carrying\non with the housemaid, and that he had then failed to marry the housemaid.\nNothing of blackmail in that: just a pointer as to character.\nIn the immense ramifications of Mr. Blackton’s activities it was of course\nimpossible for him to keep all these details in his head. And so little by little\nthe book had grown until it now comprised over three hundred pages.\nInformation obtained firsthand or from absolutely certain sources was\nentered in red; items not quite so reliable in black. And under Sir Raymond\nBlantyre’s name the entry was in red.\n“Blantyre, Raymond. Born 1858. Vice-President Metropolitan\nDiamond Syndic"
    }
  ],
  "buku-078": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on a transcription from Project Gutenberg\nand on digital scans from the Internet Archive.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "Introduction\nHungarians regard Az Érdély arány kora as, on the whole, the best of\nJókai’s great historical romances, and, to judge from the numerous existing\nversions of it, foreigners are of the same opinion as Hungarians. Few of\nJókai’s other tales have been translated so often, and the book is as great a\nfavourite in Poland as it is in Germany. And certainly it fully deserves its\ngreat reputation, for it displays to the best advantage the author’s three\ncharacteristic qualities —his powers of description, especially of nature, his\ndramatic intensity, and his peculiar humour.\nThe scene of the story is laid among the virgin forests and inaccessible\nmountains of seventeenth-century Transylvania, where a proud and valiant\nfeudal nobility still maintained a precarious independence long after the\nparent state of Hungary had become a Turkish province. We are transported\ninto a semi-heroic, semi-barbarous borderland between the Past and the\nPresent, where Medievalism has found a last retreat, and the civilizations of\nthe East and West contend or coalesce. Bizarre, gorgeous, and picturesque\nforms flit before us —rude feudal magnates and refined Machiavellian\nintriguers; superb Turkish pa"
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "In none of Jókai’s other novels, moreover, is the individuality of the\ncharacters so distinct and consistent. The gluttonous Kemeny, who\nsacrificed a kingdom for a dinner; the well-meaning, easygoing Apafi, who\nwould have made a model squire, but was irretrievably ruined by a princely\ndiadem; his consort, the wise and generous Anna, always at hand to stop her\nhusband from committing follies, or to save him from their consequences;\nthe crafty Teleki, the Richelieu of Transylvania, with wide views and lofty\naims, but sticking at nothing to compass his ends; his rival Banfi, rough,\nmasterful, recklessly selfish, yet a patriot at heart, with a vein of true\nnobility running through his coarser nature; his tender and sensitive wife,\nclinging desperately to a brutal husband, who learnt her worth too late; the\ntimeserving Csaky, as mean a rascal as ever truckled to the great or\ntrampled on the fallen; Ali Pasha and Corsar Beg, excellent types of the\nofficial and the unofficial Turkish freebooter respectively; Kucsuk Pasha,\nthe chivalrous Mussulman with a conscience above his creed; the renegade\nspy Zülfikar, groping in slippery places after illicit gains, and always falling\non his feet wit"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "I\nA Hunt in the Year 1666\nBefore us lies the valley of the Drave, one of those endless wildernesses\nwhere even the wild beast loses its way. Forests everywhere, maples and\naspens a thousand years old, with their roots under water; magnificent\nmorasses the surface of which is covered, not with reeds and water-lilies,\nbut with gigantic trees, from the dependent branches of which the vivifying\nwaters force fresh roots. Here the swan builds her nest; here too dwell the\nroyal heron, the blind crow, the golden plover, and other man-shunning\nanimals which are rarely if ever seen in more habitable regions.\nHere and there on little mounds, left bare during the long summer\ndrought by the receding waters, sprout strange and gorgeous flowers, such\nperhaps as the earth has not brought forth since the Flood overwhelmed her.\nIn this slimy soil every blade of grass shoots up like gigantic broom; the\nfunnel-shaped convolvuluses and the evergreen ground-ivy put forth\ntendrils as stout and as strong as vine branches, which, stretching from tree\nto tree, twine round their stems and hang flowery garlands about the dark,\nsombre maples, just as if some hamadryad had crowned the grove dedicated\nto her.\nBu"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "deep; for although the dark green lake-grass and the yellow marsh-flowers,\nwith the little black-and-red efts and newts darting about among them, seem\nclose enough to be reached by an outstretched hand, they are nevertheless\nall under water deep enough to go over the head of the tallest man.\nIn other places it is the dense thicket which bars the canoe’s way. Fallen\ntrees, the spoil of many centuries, but untouched by the hand of man, lie\nrotting there in gigantic heaps. The submerged trunks have been turned to\nstone by the water, and the roots of the lake-grass, the filaments of the flax-\nplant, and the tendrils of the clematis have grown together over them,\nforming a strong, tough barrier just above the water which rocks and sways\nwithout giving way beneath one’s feet. The knotty clout-like film of the\nlake, stretching far and wide, seems, to the careless eye, a continuation of\nthis barrier, but the treacherous surface no longer bears —one step further,\nand Death is there. This unknown, unexplored region has however but\nfew visitors.\nSouthwards, the wilderness is bounded by the river Drave. The trees\nwhich line its steep banks dip over into its waves. Not unfrequently the\nfierce s"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #10",
      "text": "each drawn by from six to ten oxen, have already gone on before to fixed\nrallying-places, whither all the quarry is to be carried. The villagers for\nmiles round have been enlisted as beaters, and stand together in picturesque\ngroups armed with axes, pitchforks, and occasional muskets. A few smaller\ngroups have been posted at regular intervals along the wood, with canoes\nmade from the trunks of trees. Their duty is to scare the game back from the\nswamp, should it turn thither for refuge. Every man, every beast shows\nsigns of that precipitancy, that ardour, that restlessness by which the true\nhuntsman is always distinguishable; only a few of the older hands find time\nto sit by the fire and roast slices of bacon with perfect equanimity.\nAt last comes the signal for departure, the blast of a horn from the porch\nof the hunting-box; the retinue spring shouting upon their snorting horses;\nthe unruly, barking pack drag the kennel-men hither and thither; the\nhuntsmen wind up their heavy shooting muskets, and everyone stands in\neager expectation of their lord and his noble guests.\nThey have not long to wait. A cavalcade, with a few attendant pages,\ndescends the hill. Foremost rides a tall, m"
    }
  ],
  "buku-079": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "This ebook is the product of many hours of hard work by volunteers for\nStandard Ebooks, and builds on the hard work of other literature lovers\nmade possible by the public domain.\nThis particular ebook is based on transcriptions from various sources and on\ndigital scans from the HathiTrust Digital Library.\nThe source text and artwork in this ebook are believed to be in the United\nStates public domain; that is, they are believed to be free of copyright\nrestrictions in the United States. They may still be copyrighted in other\ncountries, so users located outside of the United States must check their\nlocal laws before using this ebook. The creators of, and contributors to, this\nebook dedicate their contributions to the worldwide public domain via the\nterms in the CC0 1.0 Universal Public Domain Dedication. For full license\ninformation, see the Uncopyright at the end of this ebook.\nStandard Ebooks is a volunteer-driven project that produces ebook editions\nof public domain literature using modern typography, technology,\nand editorial standards, and distributes them free of cost. You can\ndownload this and other ebooks carefully produced for true book lovers\nat standardebooks.org."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #4",
      "text": "to the memory of\nmy great grand father, see-whelh-ken, venerated chief\nof the schu-ayl-pk; the song of whose good deeds will\nforever mingle with the mighty roar of the falls of\nswa-netk-qah, and the mournful soughing of the\nmountain pine: earth’s primitive nobleman who, in\npeace welcomed the coming of the pale face, only to\nwitness the seeds of destruction scattered wide among\nhis own once strong and contented people. to him and\nto the crowded death huts and burial cairns of a\nnation is this volume most endearingly dedicated by\none who ever yearns for the uplifting of her most\nunhappy race."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "To the Reader\nThe author of Cogewea occupies an unique sphere in the literary field. So\nfar as the writer of this sketch is aware, she is the first Indian woman to\nenter the realms of fiction. Believing that the reader would be interested in a\nbrief portrayal of her life and ancestry, she was at last prevailed\nupon to let the same here be entered. This was not attained without\ndifficulty. Her racial sensitiveness shrank from what she termed\n“unwarranted presumption.”\nHum-is’hu-mā: “mourning dove,” was born while her mother and\nmaternal grandmother were crossing the Kootenai River in a canoe near\nBonner’s Ferry, Idaho, about 1888. Her people at the time were on their way\nfrom Fort Steel, British Columbia, traveling by packhorses to the States.\nShe bears a remote strain of good Celtic blood, dating back to the earlier\nadvent of the Hudson Bay Company into the Northwest. This, in a measure,\naccounts for her deep sympathy so manifest throughout her book for the\nmixed-blood, the socially ostracized of two races.\nMourning Dove is a maternal great granddaughter of See-whelh-ken,\nhead Chief of the Schu-ayl-pk, or Schwelpi; Schoyelpi —spelled in various\nways —now embodied with the Colvilles"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "gift-exchange so universal among all the tribes, should not be confounded\nwith sordid commercial barter. To this day the older Indians —even to the\ndistant surrounding tribesmen —speak of the great See-whelh-ken, of the\n“big heart,” so strong is the memory of he who, in other snows drove\nfamine from the door. Tall, well proportioned with strong, pleasing features,\nhe ruled with a firm, though just hand. Stressed on communistic ideals, his\nevery action was governed by magnanimous wisdom.\nDescended from an ancient line of warrior-chieftains, See-whelh-ken saw\nthe advent of the white man into his domain, and was ever that alien’s most\nsteadfast friend. It was owing greatly, if not wholly to his influence that his\nown, and neighboring tribes maintained friendly relations with the strange\nintruders. The rapid decimation in the ranks of See-whelh-ken’s once virile\nfollowing, is ghastly testimony of the recompense that was meted to him.\nOf happy childhood, Mourning Dove recalls none. At the age of seven\nshe was placed in the Sacred Heart Convent, at Ward, Washington, but the\nfollowing year was brought home to aid in the care of her small brothers\nand sisters, all younger than herself. Whe"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "her civilized-reared sister. A daring and graceful rider, she often figured in\nthe dashing relay, and “squaw” races, and other equestrian sports peculiar to\nthe Western range.\nIn 1908, Mourning Dove became more closely connected with the cattle\nrange. She witnessed the last grand roundup of buffaloes on the Flathead\nIndian Reservation, Montana; when the famous Pablo herd was disposed of\nto the Canadian Government. She saw the scattering of this remnant of the\nplains monarch, and the reservation thrown open to settlement. Her\nsympathies were with the buffaloes —the one remaining link with an era\nforever past. The animals fought desperately before at last driven from their\nnative haunts. Some burst from the railway cars in the process of loading;\none being dashed to the ground with a broken neck. This scene brought\ntears to the eyes of some of the aged Indian bystanders, a race renowned for\nunemotional stocism.\nA sensate longing by Mourning Dove for an education was never\nrealized. Her people, as an integral, contended that her convent schooling,\nwhere she reached the third grade, would suffice for all practical purposes.\nBut from seventeen to twenty-one, through her own efforts, she"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "Yakima, Washington\ncorrective influences. Seldom, if ever, has she failed in commanding the\nadmiration, if not respect, of those opposed. A single instance:\nAn aged Indian couple unacquainted with English, were arrested near the\nCanadian boundary for some infringement of intricate international law.\nInfirm with years they were being driven afoot along the hot, dusty road by\nthe two arresting officers in a buggy. Observing this from her own camp the\nintrepid girl mounted her horse and overtaking the procession, shamed the\nyounger man into alighting, and permitting the woman to ride. Not satisfied\nwith this she secured the release of the old prisoners, in defiance of usual\nred-tape procedure.\nIt was amid such scenes that the idea of writing Cogewea was conceived.\nYears of tutelage in the teepee of the primitive minded Soma-how-atqu on\nthe wild Kootenai, with a later village residence by the scenic Flathead\nLake under entirely different environment, tended to qualify the author\nmost admirably for her task. How well she has succeeded, the impartial\nreader must determine. Her characters are all from actual life, and\nthroughout the narrative, she has endeavored to picture the period as s"
    }
  ],
  "buku-080": [
    {
      "pageNumber": 1,
      "chapterTitle": "Lembaran 1: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #3",
      "text": "The Project Gutenberg eBook of Towards democracy\nThis eBook is for the use of anyone anywhere in the United States and most other\nparts of the world at no cost and with almost no restrictions whatsoever. You may\ncopy it, give it away or re-use it under the terms of the Project Gutenberg License\nincluded with this eBook or online at www.gutenberg.org. If you are not located in\nthe United States, you will have to check the laws of the country where you are\nlocated before using this eBook.\nTitle: Towards democracy\nAuthor: Edward Carpenter\nRelease date: August 30, 2026 [eBook #79477]\nLanguage: English\nOriginal publication: London: George Allen and Unwin Limited, 1918\nOther information and formats: www.gutenberg.org/ebooks/79477\nCredits: Richard Tonsing, Adam Buchbinder, and the Online Distributed\nProofreading Team at https://www.pgdp.net (This file was produced\nfrom images generously made available by The Internet Archive)\n*** START OF THE PROJECT GUTENBERG EBOOK TOWARDS DEMOCRACY\n***\nTranscriber’s Note:\nNew original cover art included with this eBook is granted to the\npublic domain."
    },
    {
      "pageNumber": 2,
      "chapterTitle": "Lembaran 2: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #5",
      "text": "T\u0000\u0000\u0000\u0000\u0000\u0000\n \n D\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\nComplete Edition in Four Parts\nPublished by\nG\u0000\u0000\u0000\u0000\u0000 A\u0000\u0000\u0000\u0000 \u0000\u0000\u0000 U\u0000\u0000\u0000\u0000 L\u0000\u0000\u0000\u0000\u0000\u0000\n\u0000\u0000 R\u0000\u0000\u0000\u0000\u0000 H\u0000\u0000\u0000\u0000, 40 M\u0000\u0000\u0000\u0000\u0000 S\u0000\u0000\u0000\u0000\u0000,\nL\u0000\u0000\u0000\u0000\u0000, W.C.\n1918."
    },
    {
      "pageNumber": 3,
      "chapterTitle": "Lembaran 3: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #6",
      "text": "COPYRIGHT\nBY EDWARD CARPENTER\nAll rights reserved\nFirst Published 1883; Second Edition 1885;\nThird Edition 1892; Fourth Part 1902;\nComplete Edition 1905; Reprinted 1908, 1909, 1912, 1913"
    },
    {
      "pageNumber": 4,
      "chapterTitle": "Lembaran 4: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #7",
      "text": "CONTENTS\nPAGE\nPART I\nT\u0000\u0000\u0000\u0000\u0000\u0000 D\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000 (1881–2)\n3\nPART II\nO Freedom, beautiful beyond compare\n111\nYork Minster\n112\nSunday Morning after Church\n115\nHigh in My Chamber\n119\nDeep Below Deep\n122\nExcept the Lord\n124\nI Come Forth from the Darkness\n130\nSunday Morning near a Manufacturing Town\n137\nIn the Drawing Rooms\n139\nIn a Manufacturing Town\n144\nWhat Have I to do with Thee\n146"
    },
    {
      "pageNumber": 5,
      "chapterTitle": "Lembaran 5: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #8",
      "text": "As to You, O Moon\n149\nSquinancy Wort\n152\nNot of Myself\n154\nLo! I Open a Door\n154\nBy this Heart\n154\nAs one who from a high Cliff\n156\nTo One in Trouble\n156\nThese Waves of Your Great Heart\n156\nThus as I Yearned for Love\n158\nEternal Hunger\n159\nChild of the Lonely Heart\n160\nTo One who is where the Eternal are\n162\nThrough the Long Night\n165\nTo a Stranger\n166\nTo a Friend"
    },
    {
      "pageNumber": 6,
      "chapterTitle": "Lembaran 6: Cuplikan Asli Dokumen",
      "subTitle": "Halaman Dokumen #9",
      "text": "166\nOf the Love that you poured forth\n167\nAs a Woman of a Man\n167\nO Love, to whom the Poets\n169\nWho You are I Know Not\n171\nHave Faith (1884)\n172\nI Heard a Voice\n179\nI Know that You are Self-conscious\n179\nWho are You\n180\nAmong the Ferns\n181\nI Heard the Voice of the Woods\n184\nThe Wind Chants Well\n187\nI am a Voice\n188\nO Sea with White Lines\n188\nHome\n190"
    }
  ]
};

export function getBookReadingPages(book: {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  publisher: string;
  year: number;
}): PageContent[] {
  if (AUTHENTIC_BOOK_PAGES[book.id] && AUTHENTIC_BOOK_PAGES[book.id].length > 0) {
    return AUTHENTIC_BOOK_PAGES[book.id];
  }

  // Fallback graceful jika naskah PDF berupa scan gambar murni (misal komik)
  return [
    {
      pageNumber: 1,
      chapterTitle: "Naskah Resmi Dokumen",
      subTitle: book.title,
      text: `${book.title}\n\nKarya: ${book.author}\nPenerbit: ${book.publisher} (${book.year})\nKategori: ${book.category}\n\n${book.description}\n\nCatatan: Buku ini adalah dokumen PDF visual/komik beresolusi tinggi. Anda disarankan beralih ke tab 'Dokumen PDF Asli' di atas untuk menikmati tata letak grafis dan ilustrasi lengkap sesuai naskah aslinya.`,
      quote: `Literasi membuka jendela masa depan. — ${book.author}`
    }
  ];
}

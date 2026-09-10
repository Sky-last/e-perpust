// 🌐 PDF BASE URL CONFIGURATION
// Menggunakan VITE_PDF_BASE_URL jika diisi di .env (misal untuk hosting eksternal: Cloudinary, GitHub Pages, Supabase Storage)
// Default string kosong '' agar menggunakan path lokal/relatif (/buku_digital/...)
const PDF_BASE_URL = (import.meta.env.VITE_PDF_BASE_URL as string) || '';

export const BOOK_PDF_MAP: Record<string, string> = {
  "buku-001": "/buku_digital/Bumi.pdf",
  "Bumi": "/buku_digital/Bumi.pdf",
  "Bumi.pdf": "/buku_digital/Bumi.pdf",
  "buku-002": "/buku_digital/Bulan.pdf",
  "Bulan": "/buku_digital/Bulan.pdf",
  "Bulan.pdf": "/buku_digital/Bulan.pdf",
  "buku-003": "/buku_digital/Matahari.pdf",
  "Matahari": "/buku_digital/Matahari.pdf",
  "Matahari.pdf": "/buku_digital/Matahari.pdf",
  "buku-004": "/buku_digital/Tentang_Kamu.pdf",
  "Tentang Kamu": "/buku_digital/Tentang_Kamu.pdf",
  "Tentang_Kamu.pdf": "/buku_digital/Tentang_Kamu.pdf",
  "buku-005": "/buku_digital/Daun_Yang_Jatuh_Tak_Pernah_Membenci_Angin.pdf",
  "Daun yang Jatuh Tak Pernah Membenci Angin": "/buku_digital/Daun_Yang_Jatuh_Tak_Pernah_Membenci_Angin.pdf",
  "Daun_Yang_Jatuh_Tak_Pernah_Membenci_Angin.pdf": "/buku_digital/Daun_Yang_Jatuh_Tak_Pernah_Membenci_Angin.pdf",
  "buku-006": "/buku_digital/Negeri_di_Ujung_Tanduk.pdf",
  "Negeri di Ujung Tanduk": "/buku_digital/Negeri_di_Ujung_Tanduk.pdf",
  "Negeri_di_Ujung_Tanduk.pdf": "/buku_digital/Negeri_di_Ujung_Tanduk.pdf",
  "buku-007": "/buku_digital/Konspirasi_Alam_Semesta.pdf",
  "Konspirasi Alam Semesta": "/buku_digital/Konspirasi_Alam_Semesta.pdf",
  "Konspirasi_Alam_Semesta.pdf": "/buku_digital/Konspirasi_Alam_Semesta.pdf",
  "buku-008": "/buku_digital/Siti_Nurbaya_Kasih_Tak_Sampai.pdf",
  "Siti Nurbaya: Kasih Tak Sampai": "/buku_digital/Siti_Nurbaya_Kasih_Tak_Sampai.pdf",
  "Siti_Nurbaya_Kasih_Tak_Sampai.pdf": "/buku_digital/Siti_Nurbaya_Kasih_Tak_Sampai.pdf",
  "buku-009": "/buku_digital/Tenggelamnya_Kapal_Van_Der_Wijck.pdf",
  "Tenggelamnya Kapal Van Der Wijck": "/buku_digital/Tenggelamnya_Kapal_Van_Der_Wijck.pdf",
  "Tenggelamnya_Kapal_Van_Der_Wijck.pdf": "/buku_digital/Tenggelamnya_Kapal_Van_Der_Wijck.pdf",
  "buku-010": "/buku_digital/Senja_di_Kota_Jogja.pdf",
  "Senja di Kota Jogja": "/buku_digital/Senja_di_Kota_Jogja.pdf",
  "Senja_di_Kota_Jogja.pdf": "/buku_digital/Senja_di_Kota_Jogja.pdf",
  "buku-011": "/buku_digital/Upik_Abuku_Ratu_Hatiku.pdf",
  "Upik Abuku, Ratu Hatiku": "/buku_digital/Upik_Abuku_Ratu_Hatiku.pdf",
  "Upik_Abuku_Ratu_Hatiku.pdf": "/buku_digital/Upik_Abuku_Ratu_Hatiku.pdf",
  "buku-012": "/buku_digital/Yang_Fana_Adalah_Waktu.pdf",
  "Yang Fana Adalah Waktu": "/buku_digital/Yang_Fana_Adalah_Waktu.pdf",
  "Yang_Fana_Adalah_Waktu.pdf": "/buku_digital/Yang_Fana_Adalah_Waktu.pdf",
  "buku-013": "/buku_digital/Kajian_Puisi.pdf",
  "Kajian Puisi: Teori dan Analisis": "/buku_digital/Kajian_Puisi.pdf",
  "Kajian_Puisi.pdf": "/buku_digital/Kajian_Puisi.pdf",
  "buku-014": "/buku_digital/Filosofi_Teras.pdf",
  "Filosofi Teras": "/buku_digital/Filosofi_Teras.pdf",
  "Filosofi_Teras.pdf": "/buku_digital/Filosofi_Teras.pdf",
  "buku-015": "/buku_digital/Bicara_Itu_Ada_Seninya.pdf",
  "Bicara Itu Ada Seninya": "/buku_digital/Bicara_Itu_Ada_Seninya.pdf",
  "Bicara_Itu_Ada_Seninya.pdf": "/buku_digital/Bicara_Itu_Ada_Seninya.pdf",
  "buku-016": "/buku_digital/Berani_Tidak_Disukai.pdf",
  "Berani Tidak Disukai": "/buku_digital/Berani_Tidak_Disukai.pdf",
  "Berani_Tidak_Disukai.pdf": "/buku_digital/Berani_Tidak_Disukai.pdf",
  "buku-017": "/buku_digital/Bahagia_Kenapa_Tidak.pdf",
  "Bahagia Kenapa Tidak?": "/buku_digital/Bahagia_Kenapa_Tidak.pdf",
  "Bahagia_Kenapa_Tidak.pdf": "/buku_digital/Bahagia_Kenapa_Tidak.pdf",
  "buku-018": "/buku_digital/Careless_People.pdf",
  "Careless People: Memoir & Inside Silicon Valley": "/buku_digital/Careless_People.pdf",
  "Careless_People.pdf": "/buku_digital/Careless_People.pdf",
  "buku-019": "/buku_digital/Suara_dari_Kelas_Kecil.pdf",
  "Suara dari Kelas Kecil: Kumpulan Bahan Literasi Antikorupsi": "/buku_digital/Suara_dari_Kelas_Kecil.pdf",
  "Suara_dari_Kelas_Kecil.pdf": "/buku_digital/Suara_dari_Kelas_Kecil.pdf",
  "buku-020": "/buku_digital/Akuntansi_Syariah.pdf",
  "Akuntansi Syariah: Teori, Konsep dan Laporan Keuangan": "/buku_digital/Akuntansi_Syariah.pdf",
  "Akuntansi_Syariah.pdf": "/buku_digital/Akuntansi_Syariah.pdf",
  "buku-021": "/buku_digital/1001_Fakta_Dahsyat_Mukjizat_Kota_Makkah.pdf",
  "1001 Fakta Dahsyat Mukjizat Kota Makkah": "/buku_digital/1001_Fakta_Dahsyat_Mukjizat_Kota_Makkah.pdf",
  "1001_Fakta_Dahsyat_Mukjizat_Kota_Makkah.pdf": "/buku_digital/1001_Fakta_Dahsyat_Mukjizat_Kota_Makkah.pdf",
  "buku-022": "/buku_digital/Sains_dan_Peradaban_di_Dalam_Islam.pdf",
  "Sains dan Peradaban di Dalam Islam": "/buku_digital/Sains_dan_Peradaban_di_Dalam_Islam.pdf",
  "Sains_dan_Peradaban_di_Dalam_Islam.pdf": "/buku_digital/Sains_dan_Peradaban_di_Dalam_Islam.pdf",
  "buku-023": "/buku_digital/Secrets_of_Divine_Love.pdf",
  "Secrets of Divine Love: A Spiritual Journey into the Heart": "/buku_digital/Secrets_of_Divine_Love.pdf",
  "Secrets_of_Divine_Love.pdf": "/buku_digital/Secrets_of_Divine_Love.pdf",
  "buku-024": "/buku_digital/Kumpulan_Doa_Doa_Langit.pdf",
  "Kumpulan Do'a-Do'a Langit": "/buku_digital/Kumpulan_Doa_Doa_Langit.pdf",
  "Kumpulan_Doa_Doa_Langit.pdf": "/buku_digital/Kumpulan_Doa_Doa_Langit.pdf",
  "buku-025": "/buku_digital/Kedahsyatan_Dzikir_Asmaul_Husna.pdf",
  "Kedahsyatan Dzikir Asmaul Husna": "/buku_digital/Kedahsyatan_Dzikir_Asmaul_Husna.pdf",
  "Kedahsyatan_Dzikir_Asmaul_Husna.pdf": "/buku_digital/Kedahsyatan_Dzikir_Asmaul_Husna.pdf",
  "buku-026": "/buku_digital/Rahasia_Kedahsyatan_Basmallah.pdf",
  "Rahasia Kedahsyatan Basmallah": "/buku_digital/Rahasia_Kedahsyatan_Basmallah.pdf",
  "Rahasia_Kedahsyatan_Basmallah.pdf": "/buku_digital/Rahasia_Kedahsyatan_Basmallah.pdf",
  "buku-027": "/buku_digital/Rumah_Muslim_yang_Ditakuti_Setan.pdf",
  "Rumah Muslim yang Ditakuti Setan": "/buku_digital/Rumah_Muslim_yang_Ditakuti_Setan.pdf",
  "Rumah_Muslim_yang_Ditakuti_Setan.pdf": "/buku_digital/Rumah_Muslim_yang_Ditakuti_Setan.pdf",
  "buku-028": "/buku_digital/Ragam_Ekspresi_Islam_Nusantara.pdf",
  "Ragam Ekspresi Islam Nusantara": "/buku_digital/Ragam_Ekspresi_Islam_Nusantara.pdf",
  "Ragam_Ekspresi_Islam_Nusantara.pdf": "/buku_digital/Ragam_Ekspresi_Islam_Nusantara.pdf",
  "buku-029": "/buku_digital/Sejarah_Islam_di_Nusantara.pdf",
  "Sejarah Islam di Nusantara": "/buku_digital/Sejarah_Islam_di_Nusantara.pdf",
  "Sejarah_Islam_di_Nusantara.pdf": "/buku_digital/Sejarah_Islam_di_Nusantara.pdf",
  "buku-030": "/buku_digital/Advice_for_the_Muslim.pdf",
  "Advice for the Muslim": "/buku_digital/Advice_for_the_Muslim.pdf",
  "Advice_for_the_Muslim.pdf": "/buku_digital/Advice_for_the_Muslim.pdf",
  "buku-031": "/buku_digital/Islam_and_Christianity.pdf",
  "Islam and Christianity in History": "/buku_digital/Islam_and_Christianity.pdf",
  "Islam_and_Christianity.pdf": "/buku_digital/Islam_and_Christianity.pdf",
  "buku-032": "/buku_digital/Documents_of_the_Right_Word.pdf",
  "Documents of the Right Word": "/buku_digital/Documents_of_the_Right_Word.pdf",
  "Documents_of_the_Right_Word.pdf": "/buku_digital/Documents_of_the_Right_Word.pdf",
  "buku-033": "/buku_digital/101_Tip_dan_Trick_Pemrograman_PHP.pdf",
  "101 Tip dan Trick Pemrograman PHP": "/buku_digital/101_Tip_dan_Trick_Pemrograman_PHP.pdf",
  "101_Tip_dan_Trick_Pemrograman_PHP.pdf": "/buku_digital/101_Tip_dan_Trick_Pemrograman_PHP.pdf",
  "buku-034": "/buku_digital/Coding_Games_in_Python.pdf",
  "Coding Games in Python": "/buku_digital/Coding_Games_in_Python.pdf",
  "Coding_Games_in_Python.pdf": "/buku_digital/Coding_Games_in_Python.pdf",
  "buku-035": "/buku_digital/Coding_Projects_in_Scratch.pdf",
  "Coding Projects in Scratch": "/buku_digital/Coding_Projects_in_Scratch.pdf",
  "Coding_Projects_in_Scratch.pdf": "/buku_digital/Coding_Projects_in_Scratch.pdf",
  "buku-036": "/buku_digital/Computer_Forensics_Investigating_Network_Intrusions.pdf",
  "Computer Forensics: Investigating Network Intrusions": "/buku_digital/Computer_Forensics_Investigating_Network_Intrusions.pdf",
  "Computer_Forensics_Investigating_Network_Intrusions.pdf": "/buku_digital/Computer_Forensics_Investigating_Network_Intrusions.pdf",
  "buku-037": "/buku_digital/Teknologi_Informasi_dan_Komunikasi_untuk_Mahasiswa.pdf",
  "Teknologi Informasi dan Komunikasi untuk Mahasiswa": "/buku_digital/Teknologi_Informasi_dan_Komunikasi_untuk_Mahasiswa.pdf",
  "Teknologi_Informasi_dan_Komunikasi_untuk_Mahasiswa.pdf": "/buku_digital/Teknologi_Informasi_dan_Komunikasi_untuk_Mahasiswa.pdf",
  "buku-038": "/buku_digital/Teknologi_Pendidikan_di_Abad_Digital.pdf",
  "Teknologi Pendidikan di Abad Digital": "/buku_digital/Teknologi_Pendidikan_di_Abad_Digital.pdf",
  "Teknologi_Pendidikan_di_Abad_Digital.pdf": "/buku_digital/Teknologi_Pendidikan_di_Abad_Digital.pdf",
  "buku-039": "/buku_digital/Berani_Jadi_Software_Engineer.pdf",
  "Berani Jadi Software Engineer": "/buku_digital/Berani_Jadi_Software_Engineer.pdf",
  "Berani_Jadi_Software_Engineer.pdf": "/buku_digital/Berani_Jadi_Software_Engineer.pdf",
  "buku-040": "/buku_digital/Kartini_The_Complete_Writings_1898-1904.pdf",
  "Kartini: The Complete Writings 1898-1904": "/buku_digital/Kartini_The_Complete_Writings_1898-1904.pdf",
  "Kartini_The_Complete_Writings_1898-1904.pdf": "/buku_digital/Kartini_The_Complete_Writings_1898-1904.pdf",
  "buku-041": "/buku_digital/Letters_of_a_Javanese_Princess.pdf",
  "Letters of a Javanese Princess": "/buku_digital/Letters_of_a_Javanese_Princess.pdf",
  "Letters_of_a_Javanese_Princess.pdf": "/buku_digital/Letters_of_a_Javanese_Princess.pdf",
  "buku-042": "/buku_digital/Sejarah_Melaka_Zaman_Kerajaan_Melayu.pdf",
  "Sejarah Melaka dalam Zaman Kerajaan Melayu": "/buku_digital/Sejarah_Melaka_Zaman_Kerajaan_Melayu.pdf",
  "Sejarah_Melaka_Zaman_Kerajaan_Melayu.pdf": "/buku_digital/Sejarah_Melaka_Zaman_Kerajaan_Melayu.pdf",
  "buku-043": "/buku_digital/Sejarah_Geografi_Agraria_Indonesia.pdf",
  "Sejarah Geografi Agraria Indonesia": "/buku_digital/Sejarah_Geografi_Agraria_Indonesia.pdf",
  "Sejarah_Geografi_Agraria_Indonesia.pdf": "/buku_digital/Sejarah_Geografi_Agraria_Indonesia.pdf",
  "buku-044": "/buku_digital/Konflik_dan_Politik_Identitas.pdf",
  "Konflik dan Politik Identitas di Indonesia": "/buku_digital/Konflik_dan_Politik_Identitas.pdf",
  "Konflik_dan_Politik_Identitas.pdf": "/buku_digital/Konflik_dan_Politik_Identitas.pdf",
  "buku-045": "/buku_digital/Prosiding_PIT_XVI_Ikatan_Geograf_Indonesia.pdf",
  "Prosiding PIT XVI: Mitigasi Bencana & Geografi Indonesia": "/buku_digital/Prosiding_PIT_XVI_Ikatan_Geograf_Indonesia.pdf",
  "Prosiding_PIT_XVI_Ikatan_Geograf_Indonesia.pdf": "/buku_digital/Prosiding_PIT_XVI_Ikatan_Geograf_Indonesia.pdf",
  "buku-046": "/buku_digital/Teknologi_Budidaya_Pascapanen_Kelapa_Sawit.pdf",
  "Teknologi Budidaya & Pascapanen Kelapa Sawit": "/buku_digital/Teknologi_Budidaya_Pascapanen_Kelapa_Sawit.pdf",
  "Teknologi_Budidaya_Pascapanen_Kelapa_Sawit.pdf": "/buku_digital/Teknologi_Budidaya_Pascapanen_Kelapa_Sawit.pdf",
  "buku-047": "/buku_digital/Buku_Kumpulan_Eksperimen_Sains.pdf",
  "Buku Kumpulan Eksperimen Sains Seru": "/buku_digital/Buku_Kumpulan_Eksperimen_Sains.pdf",
  "Buku_Kumpulan_Eksperimen_Sains.pdf": "/buku_digital/Buku_Kumpulan_Eksperimen_Sains.pdf",
  "buku-048": "/buku_digital/1_Jam_Ngomong_Bahasa_Korea.pdf",
  "1 Jam Ngomong Bahasa Korea": "/buku_digital/1_Jam_Ngomong_Bahasa_Korea.pdf",
  "1_Jam_Ngomong_Bahasa_Korea.pdf": "/buku_digital/1_Jam_Ngomong_Bahasa_Korea.pdf",
  "buku-049": "/buku_digital/Aturan_Waktu_16_Tenses_Inggris.pdf",
  "Aturan Waktu 16 Tenses Bahasa Inggris": "/buku_digital/Aturan_Waktu_16_Tenses_Inggris.pdf",
  "Aturan_Waktu_16_Tenses_Inggris.pdf": "/buku_digital/Aturan_Waktu_16_Tenses_Inggris.pdf",
  "buku-050": "/buku_digital/7_Hari_Jalan_Jalan_Singapura_Malaysia.pdf",
  "7 Hari Jalan-Jalan Singapura-Malaysia Budget 5 Jutaan": "/buku_digital/7_Hari_Jalan_Jalan_Singapura_Malaysia.pdf",
  "7_Hari_Jalan_Jalan_Singapura_Malaysia.pdf": "/buku_digital/7_Hari_Jalan_Jalan_Singapura_Malaysia.pdf",
  "buku-051": "/buku_digital/The_Deliciously_Keto_Cookbook.pdf",
  "The Deliciously Keto Cookbook": "/buku_digital/The_Deliciously_Keto_Cookbook.pdf",
  "The_Deliciously_Keto_Cookbook.pdf": "/buku_digital/The_Deliciously_Keto_Cookbook.pdf",
  "buku-052": "/buku_digital/Batman_Issue_100.pdf",
  "Batman Issue #100: The Milestone Edition": "/buku_digital/Batman_Issue_100.pdf",
  "Batman_Issue_100.pdf": "/buku_digital/Batman_Issue_100.pdf",
  "buku-053": "/buku_digital/Whiz_Comics_No_2.pdf",
  "Whiz Comics No. 2 (Debut of Captain Marvel / Shazam)": "/buku_digital/Whiz_Comics_No_2.pdf",
  "Whiz_Comics_No_2.pdf": "/buku_digital/Whiz_Comics_No_2.pdf",
  "buku-054": "/buku_digital/All_Negro_Comics.pdf",
  "All-Negro Comics (Historic 1947 First Edition)": "/buku_digital/All_Negro_Comics.pdf",
  "All_Negro_Comics.pdf": "/buku_digital/All_Negro_Comics.pdf",
  "buku-055": "/buku_digital/Buck_Rogers_Daily_Strips_1929.pdf",
  "Buck Rogers 2429 A.D. Daily Newspaper Strips (1929)": "/buku_digital/Buck_Rogers_Daily_Strips_1929.pdf",
  "Buck_Rogers_Daily_Strips_1929.pdf": "/buku_digital/Buck_Rogers_Daily_Strips_1929.pdf",
  "buku-056": "/buku_digital/Tarzan_Comic_Strip_1930.pdf",
  "Tarzan Comic Strips Collection (1930)": "/buku_digital/Tarzan_Comic_Strip_1930.pdf",
  "Tarzan_Comic_Strip_1930.pdf": "/buku_digital/Tarzan_Comic_Strip_1930.pdf",
  "buku-057": "/buku_digital/Tarzan_of_The_Apes_First_Comic_Strips.pdf",
  "Tarzan of The Apes & The Return of Tarzan": "/buku_digital/Tarzan_of_The_Apes_First_Comic_Strips.pdf",
  "Tarzan_of_The_Apes_First_Comic_Strips.pdf": "/buku_digital/Tarzan_of_The_Apes_First_Comic_Strips.pdf",
  "buku-058": "/buku_digital/The_Mystery_of_Edwin_Drood.pdf",
  "The Mystery of Edwin Drood": "/buku_digital/The_Mystery_of_Edwin_Drood.pdf",
  "The_Mystery_of_Edwin_Drood.pdf": "/buku_digital/The_Mystery_of_Edwin_Drood.pdf",
  "buku-059": "/buku_digital/The_Clever_Woman_of_the_Family.pdf",
  "The Clever Woman of the Family": "/buku_digital/The_Clever_Woman_of_the_Family.pdf",
  "The_Clever_Woman_of_the_Family.pdf": "/buku_digital/The_Clever_Woman_of_the_Family.pdf",
  "buku-060": "/buku_digital/The_Little_Duke.pdf",
  "The Little Duke: Richard the Fearless": "/buku_digital/The_Little_Duke.pdf",
  "The_Little_Duke.pdf": "/buku_digital/The_Little_Duke.pdf",
  "buku-061": "/buku_digital/Mistress_Wilding.pdf",
  "Mistress Wilding: A Romance": "/buku_digital/Mistress_Wilding.pdf",
  "Mistress_Wilding.pdf": "/buku_digital/Mistress_Wilding.pdf",
  "buku-062": "/buku_digital/Max_Havelaar.pdf",
  "Max Havelaar: Lelang Kopi Maskapai Dagang Belanda": "/buku_digital/Max_Havelaar.pdf",
  "Max_Havelaar.pdf": "/buku_digital/Max_Havelaar.pdf",
  "buku-063": "/buku_digital/Lord_Jim.pdf",
  "Lord Jim": "/buku_digital/Lord_Jim.pdf",
  "Lord_Jim.pdf": "/buku_digital/Lord_Jim.pdf",
  "buku-064": "/buku_digital/The_Hidden_Force.pdf",
  "The Hidden Force (De Stille Kracht)": "/buku_digital/The_Hidden_Force.pdf",
  "The_Hidden_Force.pdf": "/buku_digital/The_Hidden_Force.pdf",
  "buku-065": "/buku_digital/Blown_to_Bits.pdf",
  "Blown to Bits: The Lonely Man of Rakata": "/buku_digital/Blown_to_Bits.pdf",
  "Blown_to_Bits.pdf": "/buku_digital/Blown_to_Bits.pdf",
  "buku-066": "/buku_digital/The_Rescue.pdf",
  "The Rescue: A Romance of the Shallows": "/buku_digital/The_Rescue.pdf",
  "The_Rescue.pdf": "/buku_digital/The_Rescue.pdf",
  "buku-067": "/buku_digital/Suspense_A_Napoleonic_Novel.pdf",
  "Suspense: A Napoleonic Novel": "/buku_digital/Suspense_A_Napoleonic_Novel.pdf",
  "Suspense_A_Napoleonic_Novel.pdf": "/buku_digital/Suspense_A_Napoleonic_Novel.pdf",
  "buku-068": "/buku_digital/Racundras_First_Cruise.pdf",
  "Racundra's First Cruise": "/buku_digital/Racundras_First_Cruise.pdf",
  "Racundras_First_Cruise.pdf": "/buku_digital/Racundras_First_Cruise.pdf",
  "buku-069": "/buku_digital/The_Great_Airport_Mystery.pdf",
  "The Great Airport Mystery (The Hardy Boys #9)": "/buku_digital/The_Great_Airport_Mystery.pdf",
  "The_Great_Airport_Mystery.pdf": "/buku_digital/The_Great_Airport_Mystery.pdf",
  "buku-070": "/buku_digital/Hand_and_Ring.pdf",
  "Hand and Ring": "/buku_digital/Hand_and_Ring.pdf",
  "Hand_and_Ring.pdf": "/buku_digital/Hand_and_Ring.pdf",
  "buku-071": "/buku_digital/The_Place_Called_Dagon.pdf",
  "The Place Called Dagon": "/buku_digital/The_Place_Called_Dagon.pdf",
  "The_Place_Called_Dagon.pdf": "/buku_digital/The_Place_Called_Dagon.pdf",
  "buku-072": "/buku_digital/The_Lost_Stradivarius.pdf",
  "The Lost Stradivarius": "/buku_digital/The_Lost_Stradivarius.pdf",
  "The_Lost_Stradivarius.pdf": "/buku_digital/The_Lost_Stradivarius.pdf",
  "buku-073": "/buku_digital/Short_Fiction_Edgar_Saltus.pdf",
  "Short Fiction of Edgar Saltus": "/buku_digital/Short_Fiction_Edgar_Saltus.pdf",
  "Short_Fiction_Edgar_Saltus.pdf": "/buku_digital/Short_Fiction_Edgar_Saltus.pdf",
  "buku-074": "/buku_digital/The_Art_of_Illustration.pdf",
  "The Art of Illustration": "/buku_digital/The_Art_of_Illustration.pdf",
  "The_Art_of_Illustration.pdf": "/buku_digital/The_Art_of_Illustration.pdf",
  "buku-075": "/buku_digital/Revolving_Lights.pdf",
  "Revolving Lights (Pilgrimage Series)": "/buku_digital/Revolving_Lights.pdf",
  "Revolving_Lights.pdf": "/buku_digital/Revolving_Lights.pdf",
  "buku-076": "/buku_digital/The_House_of_Rimmon.pdf",
  "The House of Rimmon: A Drama in Four Acts": "/buku_digital/The_House_of_Rimmon.pdf",
  "The_House_of_Rimmon.pdf": "/buku_digital/The_House_of_Rimmon.pdf",
  "buku-077": "/buku_digital/The_Third_Round.pdf",
  "The Third Round (Bulldog Drummond)": "/buku_digital/The_Third_Round.pdf",
  "The_Third_Round.pdf": "/buku_digital/The_Third_Round.pdf",
  "buku-078": "/buku_digital/Midst_the_Wild_Carpathians.pdf",
  "'Midst the Wild Carpathians": "/buku_digital/Midst_the_Wild_Carpathians.pdf",
  "Midst_the_Wild_Carpathians.pdf": "/buku_digital/Midst_the_Wild_Carpathians.pdf",
  "buku-079": "/buku_digital/Cogewea_the_Half_Blood.pdf",
  "Cogewea, the Half-Blood: A Depiction of the Great Montana Range": "/buku_digital/Cogewea_the_Half_Blood.pdf",
  "Cogewea_the_Half_Blood.pdf": "/buku_digital/Cogewea_the_Half_Blood.pdf",
  "buku-080": "/buku_digital/Towards_Democracy.pdf",
  "Towards Democracy": "/buku_digital/Towards_Democracy.pdf",
  "Towards_Democracy.pdf": "/buku_digital/Towards_Democracy.pdf",
};

/**
 * Sanitize and secure PDF file path to prevent Directory Traversal,
 * malformed URLs, and character encoding bugs.
 */
export const sanitizePdfPath = (rawUrl: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '/buku_digital/Bumi.pdf';

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return encodeURI(rawUrl);
  }

  let clean = rawUrl
    .replace(/\0/g, '')
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '')
    .replace(/%2e%2e%2f/gi, '')
    .replace(/%2e%2e\//gi, '');

  clean = clean.replace(/\.pdf\.pdf$/i, '.pdf');

  if (!clean.startsWith('/buku_digital/')) {
    const filename = clean.split('/').pop() || clean;
    clean = `/buku_digital/${filename}`;
  }

  try {
    clean = decodeURI(clean);
  } catch (e) {}

  // 🌐 Apply external base URL if configured
  if (PDF_BASE_URL) {
    return encodeURI(PDF_BASE_URL.replace(/\/$/, '') + clean);
  }

  return encodeURI(clean);
};

export const getPdfUrlByBookId = (id: string, defaultTitle: string = ''): string => {
  if (BOOK_PDF_MAP[id]) {
    return sanitizePdfPath(BOOK_PDF_MAP[id]);
  }
  return sanitizePdfPath(`/buku_digital/${id}.pdf`);
};

export const resolveBookPdfUrl = (book: { id: string; title?: string; pdfUrl?: string }): string => {
  if (!book) return sanitizePdfPath('');

  if (book.id && BOOK_PDF_MAP[book.id]) {
    return sanitizePdfPath(BOOK_PDF_MAP[book.id]);
  }

  if (book.title && BOOK_PDF_MAP[book.title]) {
    return sanitizePdfPath(BOOK_PDF_MAP[book.title]);
  }

  if (book.pdfUrl) {
    return sanitizePdfPath(book.pdfUrl);
  }

  return getPdfUrlByBookId(book.id || '', book.title || '');
};

export const checkPdfAvailability = async (pdfUrl: string): Promise<{ ok: boolean; status: number; message: string }> => {
  try {
    const sanitized = sanitizePdfPath(pdfUrl);
    const response = await fetch(sanitized, { method: 'HEAD' });

    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) < 100) {
        return { ok: false, status: 200, message: 'File PDF kosong atau korup (< 100 bytes)' };
      }
      return { ok: true, status: response.status, message: 'PDF file valid' };
    }
    return { ok: false, status: response.status, message: `Status HTTP ${response.status}` };
  } catch (error: any) {
    return { ok: false, status: 0, message: error?.message || 'Gagal terhubung ke file PDF' };
  }
};

import { Book } from '../types';
import { INITIAL_BOOKS } from '../data/books';

export const BOOK_PDF_MAP: Record<string, string> = {
  'bks-50': '/buku_digital/real_bks_50_Verba_Taktransitif_Bahasa_Sunda.pdf',
  'bks-49': '/buku_digital/real_bks_49_Pedoman_Penelitian_Sosiologi_Sastra.pdf',
  'bks-48': '/buku_digital/real_bks_48_Sistem_Sapaan_Dialek_Jakarta.pdf',
  'bks-47': '/buku_digital/real_bks_47_Kidung_Megat_Kung.pdf',
  'bks-46': '/buku_digital/real_bks_46_Supraba_Lan_Suminten.pdf',
  'bks-45': '/buku_digital/real_bks_45_Ancimun_Tuminggang_Dui_Mentimun_Menimpa_Duri.pdf',
  'bks-44': '/buku_digital/real_bks_44_Ceritera_Panji_Pakang_Raras.pdf',
  'bks-43': '/buku_digital/real_bks_43_Babad_Majapahit.pdf',
  'bks-42': '/buku_digital/real_bks_42_Carita_Badak_Pamalang_Carita_Pantun_Sunda.pdf',
  'bks-41': '/buku_digital/real_bks_41_Purnama_Alam_I.pdf',
  'bks-40': '/buku_digital/real_bks_40_Ungkapan_Tradisional_Daerah_Istimewa_Aceh.pdf',
  'bks-39': '/buku_digital/real_bks_39_Ceritera_Rakyat_Daerah_Jambi.pdf',
  'bks-38': '/buku_digital/real_bks_38_Bahasa_Daerah_di_Indonesia_Kebersamaan_dalam_Keberagaman.pdf',
  'bks-37': '/buku_digital/real_bks_37_Asal-Usul_Danau_Maninjau.pdf',
  'bks-36': '/buku_digital/real_bks_36_Kepahlawanan_Trunajaya.pdf',
  'bks-35': '/buku_digital/real_bks_35_Kebhinekaan_Budaya_Papua_Perspektif_Arkeologi_Prasejarah.pdf',
  'bks-34': '/buku_digital/real_bks_34_Tinggalan_Kolonial_di_Jawa_Timur.pdf',
  'bks-33': '/buku_digital/real_bks_33_Sisingamangaraja_Pemersatu_Batak_di_Toba.pdf',
  'bks-32': '/buku_digital/real_bks_32_1957_Deklarasi_Djuanda_dan_Kedaulatan_Laut_Kita.pdf',
  'bks-31': '/buku_digital/real_bks_31_History_of_Indonesia_A_Resource_Book.pdf',
  'bks-30': '/buku_digital/real_bks_30_Tata_Bahasa_Baku_Bahasa_Indonesia.pdf',
  'bks-29': '/buku_digital/real_bks_29_Seri_Pelatihan_UKBI.pdf',
  'bks-28': '/buku_digital/real_bks_28_Latihan_Soal_Kemahiran_Berbahasa_Indonesia.pdf',
  'bks-27': '/buku_digital/real_bks_27_Glosarium_Matematika.pdf',
  'bks-26': '/buku_digital/real_bks_26_Pendidikan_Agama_Katolik_dan_Budi_Pekerti_SD_Kelas_IV.pdf',
  'bks-25': '/buku_digital/real_bks_25_Bahasa_Indonesia_Buku_Guru_SMPMTs_Kelas_VIII.pdf',
  'bks-24': '/buku_digital/real_bks_24_Buku_Praktis_Bahasa_Indonesia_2.pdf',
  'bks-23': '/buku_digital/real_bks_23_Buku_Praktis_Bahasa_Indonesia_1.pdf',
  'bks-22': '/buku_digital/real_bks_22_Sahabatku_Indonesia_Tingkat_C2.pdf',
  'bks-21': '/buku_digital/real_bks_21_Sahabatku_Indonesia_Tingkat_A1_BIPA_1.pdf',
  'bks-20': '/buku_digital/real_bks_20_Kue_Kimu.pdf',
  'bks-19': '/buku_digital/real_bks_19_Fao_Si_Pelompat_Batu.pdf',
  'bks-18': '/buku_digital/real_bks_18_Dua_Potong_Gorengan.pdf',
  'bks-17': '/buku_digital/real_bks_17_Dongeng_untuk_Santi.pdf',
  'bks-16': '/buku_digital/real_bks_16_Dina_Bisa_Cerita.pdf',
  'bks-15': '/buku_digital/real_bks_15_Di_Mana_Keli.pdf',
  'bks-14': '/buku_digital/real_bks_14_Di_Mana_Ibu.pdf',
  'bks-13': '/buku_digital/real_bks_13_Rewako_Ammang_Beranilah_Ammang.pdf',
  'bks-12': '/buku_digital/real_bks_12_Kisah_Beruk_dan_Hewan_Lainnya.pdf',
  'bks-11': '/buku_digital/real_bks_11_Jaket_Pinjaman.pdf',
  'bks-10': '/buku_digital/real_bks_10_Hmm_Enaaak.pdf',
  'bks-9': '/buku_digital/real_bks_9_Gambar_Lucu_Mika.pdf',
  'bks-8': '/buku_digital/real_bks_8_Biji_Merah_Luna.pdf',
  'bks-7': '/buku_digital/real_bks_7_Pesut_Tak_Lapar_Lagi.pdf',
  'bks-6': '/buku_digital/real_bks_6_Operasi_Sampah_di_Taman.pdf',
  'bks-5': '/buku_digital/real_bks_5_Kutilang_yang_Suka_Bernyanyi.pdf',
  'bks-4': '/buku_digital/real_bks_4_Bumi_Ayo_Bangun.pdf',
  'bks-3': '/buku_digital/real_bks_3_Lepu_pun_Tersenyum.pdf',
  'bks-2': '/buku_digital/real_bks_2_Rusaknya_Suara_Kodok.pdf',
  'bks-1': '/buku_digital/real_bks_1_Syifa_dan_Burung_Kenari.pdf',
  'eb-1': '/buku_digital/eb-1_The_Little_Duke_or_Richard_the_Fearless.pdf',
  'eb-2': '/buku_digital/eb-2_Mistress_Wilding.pdf',
  'eb-9': '/buku_digital/eb-9_Konspirasi_Alam_Semesta.pdf',
  'eb-10': '/buku_digital/eb-10_Negeri_di_Ujung_Tanduk.pdf',
  'eb-14': '/buku_digital/eb-14_Bulan.pdf',
  'eb-15': '/buku_digital/eb-15_Tentang_Kamu.pdf',
  'eb-16': '/buku_digital/eb-16_Matahari.pdf',
  'gut-2': '/buku_digital/gut-2_Max_Havelaar.pdf',
  'gut-4': '/buku_digital/gut-4_Lord_Jim.pdf',
  'gut-6': '/buku_digital/gut-6_The_Hidden_Force_A_Story_of_Modern_Java.pdf',
  'gut-8': '/buku_digital/gut-8_Blown_to_Bits_or_The_Lonely_Man_of_Rakata.pdf',
  'eb-19': '/buku_digital/eb-19_Laskar_Pelangi.pdf',
  'eb-20': '/buku_digital/eb-20_Bumi_Manusia.pdf',
  'eb-21': '/buku_digital/eb-21_Anak_Semua_Bangsa.pdf',
  'eb-22': '/buku_digital/eb-22_Jejak_Langkah.pdf',
  'eb-23': '/buku_digital/eb-23_Rumah_Kaca.pdf',
  'eb-24': '/buku_digital/eb-24_Ronggeng_Dukuh_Paruk.pdf',
  'eb-25': '/buku_digital/eb-25_Cantik_Itu_Luka.pdf',
  'eb-26': '/buku_digital/eb-26_Lelaki_Harimau.pdf',
  'eb-27': '/buku_digital/eb-27_Perahu_Kertas.pdf',
  'eb-28': '/buku_digital/eb-28_Supernova_Ksatria_Puteri_dan_Bintang_Jatuh.pdf',
  'eb-29': '/buku_digital/eb-29_Pulang.pdf',
  'eb-30': '/buku_digital/eb-30_Laut_Bercerita.pdf',
  'eb-31': '/buku_digital/eb-31_Hujan.pdf',
  'eb-32': '/buku_digital/eb-32_Bumi.pdf',
  'eb-33': '/buku_digital/eb-33_Bintang.pdf',
  'eb-34': '/buku_digital/eb-34_Ceros_dan_Batozar.pdf',
  'eb-35': '/buku_digital/eb-35_Komet.pdf',
  'eb-4': '/buku_digital/eb-4_Berani_Jadi_Software_Engineer.pdf',
  'eb-5': '/buku_digital/eb-5_Coding_Projects_in_Scratch.pdf',
  'eb-18': '/buku_digital/eb-18_Computer_Forensics_and_Cyber_Investigation.pdf',
  'eb-36': '/buku_digital/eb-36_Clean_Code_A_Handbook_of_Agile_Software_Craftsmanship.pdf',
  'eb-37': '/buku_digital/eb-37_The_Pragmatic_Programmer.pdf',
  'eb-38': '/buku_digital/eb-38_Design_Patterns_Elements_of_Reusable_Object-Oriented_Software.pdf',
  'eb-39': '/buku_digital/eb-39_Artificial_Intelligence_A_Modern_Approach.pdf',
  'eb-40': '/buku_digital/eb-40_Introduction_to_Algorithms_CLRS.pdf',
  'eb-41': '/buku_digital/eb-41_You_Dont_Know_JS_Yet.pdf',
  'eb-42': '/buku_digital/eb-42_Python_Crash_Course.pdf',
  'eb-43': '/buku_digital/eb-43_Designing_Data-Intensive_Applications.pdf',
  'eb-3': '/buku_digital/eb-3_Advice_for_the_Muslim.pdf',
  'eb-6': '/buku_digital/eb-6_Documents_of_the_Right_Word.pdf',
  'eb-7': '/buku_digital/eb-7_Islam_and_Christianity.pdf',
  'eb-44': '/buku_digital/eb-44_Ihya_Ulumuddin_Kebangkitan_Ilmu_Agama.pdf',
  'eb-45': '/buku_digital/eb-45_Sirah_Nabawiyah_Sejarah_Hidup_Nabi_Muhammad_SAW.pdf',
  'eb-8': '/buku_digital/eb-8_Kajian_Puisi_Indonesia_Modern.pdf',
  'eb-11': '/buku_digital/eb-11_Prosiding_Sosiologi_Konflik_dan_Politik_Identitas.pdf',
  'eb-13': '/buku_digital/eb-13_Suara_dari_Kelas_Kecil_Kumpulan_Bahan_Literasi_Antikorupsi.pdf',
  'eb-46': '/buku_digital/eb-46_Pedoman_Umum_Ejaan_Bahasa_Indonesia_PUEBI.pdf',
  'eb-12': '/buku_digital/eb-12_Sejarah_Geografi_Agraria_Indonesia.pdf',
  'gut-1': '/buku_digital/gut-1_Letters_of_a_Javanese_Princess.pdf',
  'gut-3': '/buku_digital/gut-3_The_History_of_Sumatra.pdf',
  'gut-5': '/buku_digital/gut-5_The_History_of_Java_Vol_1_2.pdf',
  'eb-17': '/buku_digital/eb-17_The_Deliciously_Keto_Cookbook.pdf',
  'gut-7': '/buku_digital/gut-7_Monumental_Java.pdf',
  'gut-9': '/buku_digital/gut-9_Java_Facts_and_Fancies.pdf',
  'gut-10': '/buku_digital/gut-10_Travels_in_the_East_Indian_Archipelago.pdf',
  'eb-47': '/buku_digital/eb-47_Keamanan_Jaringan_Ethical_Hacking.pdf',
  'eb-48': '/buku_digital/eb-48_Pengantar_Machine_Learning.pdf',
  'eb-49': '/buku_digital/eb-49_Arsitektur_Microservices_Modern.pdf',
  'eb-50': '/buku_digital/eb-50_Manajemen_Basis_Data_SQL_NoSQL.pdf',
  'eb-51': '/buku_digital/eb-51_Rekayasa_Perangkat_Lunak_Agile.pdf',
  'eb-52': '/buku_digital/eb-52_Pengembangan_Aplikasi_Mobile_React_Native.pdf',
  'eb-53': '/buku_digital/eb-53_Cloud_Computing_DevOps_Guide.pdf',
  'eb-54': '/buku_digital/eb-54_Tafsir_Al-Mishbah_Vol_1.pdf',
  'eb-55': '/buku_digital/eb-55_Fiqih_Sunnah_Wanita.pdf',
  'eb-56': '/buku_digital/eb-56_Biografi_Empat_Mazhab.pdf',
  'eb-57': '/buku_digital/eb-57_Ensiklopedia_Hadits_Shahih.pdf',
  'eb-58': '/buku_digital/eb-58_Metodologi_Penelitian_Pendidikan.pdf',
  'eb-59': '/buku_digital/eb-59_Psikologi_Perkembangan_Anak.pdf',
  'eb-60': '/buku_digital/eb-60_Teori_Belajar_Pembelajaran.pdf',
  'eb-61': '/buku_digital/eb-61_Sejarah_Peradaban_Islam.pdf',
  'eb-62': '/buku_digital/eb-62_Nusantara_Sejarah_Indonesia.pdf',
  'eb-63': '/buku_digital/eb-63_Sejarah_Kebudayaan_Jawa.pdf',
  'eb-64': '/buku_digital/eb-64_Fisika_Dasar_untuk_Universitas.pdf',
  'eb-65': '/buku_digital/eb-65_Kimia_Organik_Modern.pdf',
  'eb-66': '/buku_digital/eb-66_Biologi_Molekuler_Genetik.pdf',
  'eb-67': '/buku_digital/eb-67_Matematika_Diskrit_Komputasi.pdf',
  'eb-68': '/buku_digital/eb-68_Manajemen_Keuangan_Perusahaan.pdf',
  'eb-69': '/buku_digital/eb-69_Pemasaran_Digital_Branding.pdf',
  'eb-70': '/buku_digital/eb-70_Kewirausahaan_Inovasi_Startup.pdf',
  'eb-71': '/buku_digital/eb-71_Sejarah_Seni_Rupa_Indonesia.pdf',
  'eb-72': '/buku_digital/eb-72_Arsitektur_Nusantara_Rumah_Adat.pdf',
  'eb-73': '/buku_digital/eb-73_Nutrisi_Gaya_Hidup_Sehat.pdf',
  'eb-74': '/buku_digital/eb-74_Panduan_Pertolongan_Pertama_P3K.pdf',
  'eb-75': '/buku_digital/eb-75_Petualangan_di_Taman_Nasional_Komodo.pdf',
  'eb-76': '/buku_digital/eb-76_Pesona_Raja_Ampat_Papua.pdf',
  'eb-77': '/buku_digital/eb-77_Filosofi_Teras.pdf',
  'eb-78': '/buku_digital/eb-78_Atom_Habits.pdf',
  'eb-79': '/buku_digital/eb-79_Psychology_of_Money.pdf',
  'eb-80': '/buku_digital/eb-80_Sapiens_Riwayat_Singkat_Umat_Manusia.pdf',
  'eb-81': '/buku_digital/eb-81_Homo_Deus_Masa_Depan_Umat_Manusia.pdf',
  'eb-82': '/buku_digital/eb-82_21_Pelajaran_untuk_Abad_ke-21.pdf',
  'eb-83': '/buku_digital/eb-83_Rich_Dad_Poor_Dad.pdf',
  'eb-84': '/buku_digital/eb-84_Sebuah_Seni_untuk_Bersikap_Bodo_Amat.pdf',
  'eb-85': '/buku_digital/eb-85_Gadis_Kretek.pdf',
  'eb-86': '/buku_digital/eb-86_Bumi_Manusia_Jilid_II.pdf',
  'eb-87': '/buku_digital/eb-87_Orang-Orang_Biasa.pdf',
  'eb-88': '/buku_digital/eb-88_Dua_Garis_Biru.pdf',
  'eb-89': '/buku_digital/eb-89_Nanti_Kita_Ceritakan_Tentang_Hari_Ini.pdf',
  'eb-90': '/buku_digital/eb-90_Dilan_1990.pdf',
  'eb-91': '/buku_digital/eb-91_Milea_Suara_dari_Dilan_Edisi_Kolektor.pdf',
  'eb-92': '/buku_digital/eb-92_Ancika_Dia_yang_Bersamaku_Tahun_1995_Edisi_Kolektor.pdf',
  'eb-93': '/buku_digital/eb-93_Pulang_-_Pergi_Edisi_Kolektor.pdf',
  'eb-94': '/buku_digital/eb-94_Selamat_Tinggal_Edisi_Kolektor.pdf',
  'eb-95': '/buku_digital/eb-95_Janji_Edisi_Kolektor.pdf',
  'eb-96': '/buku_digital/eb-96_Rasa_Edisi_Kolektor.pdf',
  'eb-97': '/buku_digital/eb-97_Si_Anak_Kuat_Edisi_Kolektor.pdf',
  'eb-98': '/buku_digital/eb-98_Si_Anak_Spesial_Edisi_Kolektor.pdf',
  'eb-99': '/buku_digital/eb-99_Si_Anak_Pintar_Edisi_Kolektor.pdf',
  'eb-100': '/buku_digital/eb-100_Si_Anak_Pemberani_Edisi_Kolektor.pdf',
  'eb-101': '/buku_digital/eb-101_Si_Anak_Savana_Edisi_Kolektor.pdf',
  'eb-102': '/buku_digital/eb-102_Dasar-Dasar_Pemrograman_Web_Edisi_Kolektor.pdf',
  'eb-103': '/buku_digital/eb-103_Pemrograman_Berorientasi_Objek_Java_Edisi_Kolektor.pdf',
  'eb-104': '/buku_digital/eb-104_Struktur_Data_Algoritma_Python_Edisi_Kolektor.pdf',
  'eb-105': '/buku_digital/eb-105_Keamanan_Jaringan_Ethical_Hacking_Edisi_Kolektor.pdf',
  'eb-106': '/buku_digital/eb-106_Pengantar_Machine_Learning_Edisi_Kolektor.pdf',
  'eb-107': '/buku_digital/eb-107_Arsitektur_Microservices_Modern_Edisi_Kolektor.pdf',
  'eb-108': '/buku_digital/eb-108_Manajemen_Basis_Data_SQL_NoSQL_Edisi_Kolektor.pdf',
  'eb-109': '/buku_digital/eb-109_Rekayasa_Perangkat_Lunak_Agile_Edisi_Kolektor.pdf',
  'eb-110': '/buku_digital/eb-110_Pengembangan_Aplikasi_Mobile_React_Native_Edisi_Kolektor.pdf',
  'eb-111': '/buku_digital/eb-111_Cloud_Computing_DevOps_Guide_Edisi_Kolektor.pdf',
  'eb-112': '/buku_digital/eb-112_Tafsir_Al-Mishbah_Vol_1_Edisi_Kolektor.pdf',
  'eb-113': '/buku_digital/eb-113_Fiqih_Sunnah_Wanita_Edisi_Kolektor.pdf',
  'eb-114': '/buku_digital/eb-114_Biografi_Empat_Mazhab_Edisi_Kolektor.pdf',
  'eb-115': '/buku_digital/eb-115_Ensiklopedia_Hadits_Shahih_Edisi_Kolektor.pdf',
  'eb-116': '/buku_digital/eb-116_Metodologi_Penelitian_Pendidikan_Edisi_Kolektor.pdf',
  'eb-117': '/buku_digital/eb-117_Psikologi_Perkembangan_Anak_Edisi_Kolektor.pdf',
  'eb-118': '/buku_digital/eb-118_Teori_Belajar_Pembelajaran_Edisi_Kolektor.pdf',
  'eb-119': '/buku_digital/eb-119_Sejarah_Peradaban_Islam_Edisi_Kolektor.pdf',
  'eb-120': '/buku_digital/eb-120_Nusantara_Sejarah_Indonesia_Edisi_Kolektor.pdf',
  'eb-121': '/buku_digital/eb-121_Sejarah_Kebudayaan_Jawa_Edisi_Kolektor.pdf',
  'eb-122': '/buku_digital/eb-122_Fisika_Dasar_untuk_Universitas_Edisi_Kolektor.pdf',
  'eb-123': '/buku_digital/eb-123_Kimia_Organik_Modern_Edisi_Kolektor.pdf',
  'eb-124': '/buku_digital/eb-124_Biologi_Molekuler_Genetik_Edisi_Kolektor.pdf',
  'eb-125': '/buku_digital/eb-125_Matematika_Diskrit_Komputasi_Edisi_Kolektor.pdf',
  'eb-126': '/buku_digital/eb-126_Manajemen_Keuangan_Perusahaan_Edisi_Kolektor.pdf',
  'eb-127': '/buku_digital/eb-127_Pemasaran_Digital_Branding_Edisi_Kolektor.pdf',
  'eb-128': '/buku_digital/eb-128_Kewirausahaan_Inovasi_Startup_Edisi_Kolektor.pdf',
  'eb-129': '/buku_digital/eb-129_Sejarah_Seni_Rupa_Indonesia_Edisi_Kolektor.pdf',
  'eb-130': '/buku_digital/eb-130_Arsitektur_Nusantara_Rumah_Adat_Edisi_Kolektor.pdf',
  'eb-131': '/buku_digital/eb-131_Nutrisi_Gaya_Hidup_Sehat_Edisi_Kolektor.pdf',
  'eb-132': '/buku_digital/eb-132_Panduan_Pertolongan_Pertama_P3K_Edisi_Kolektor.pdf',
  'eb-133': '/buku_digital/eb-133_Petualangan_di_Taman_Nasional_Komodo_Edisi_Kolektor.pdf',
  'eb-134': '/buku_digital/eb-134_Pesona_Raja_Ampat_Papua_Edisi_Kolektor.pdf',
  'eb-135': '/buku_digital/eb-135_Filosofi_Teras_Edisi_Kolektor.pdf',
  'eb-136': '/buku_digital/eb-136_Atom_Habits_Edisi_Kolektor.pdf',
  'eb-137': '/buku_digital/eb-137_Psychology_of_Money_Edisi_Kolektor.pdf',
  'eb-138': '/buku_digital/eb-138_Sapiens_Riwayat_Singkat_Umat_Manusia_Edisi_Kolektor.pdf',
  'eb-139': '/buku_digital/eb-139_Homo_Deus_Masa_Depan_Umat_Manusia_Edisi_Kolektor.pdf',
  'eb-140': '/buku_digital/eb-140_21_Pelajaran_untuk_Abad_ke-21_Edisi_Kolektor.pdf',
  'eb-141': '/buku_digital/eb-141_Rich_Dad_Poor_Dad_Edisi_Kolektor.pdf',
  'eb-142': '/buku_digital/eb-142_Sebuah_Seni_untuk_Bersikap_Bodo_Amat_Edisi_Kolektor.pdf',
  'eb-143': '/buku_digital/eb-143_Gadis_Kretek_Edisi_Kolektor.pdf',
  'eb-144': '/buku_digital/eb-144_Bumi_Manusia_Jilid_II_Edisi_Kolektor.pdf',
  'eb-145': '/buku_digital/eb-145_Orang-Orang_Biasa_Edisi_Kolektor.pdf',
  'eb-146': '/buku_digital/eb-146_Dua_Garis_Biru_Edisi_Kolektor.pdf',
  'eb-147': '/buku_digital/eb-147_Nanti_Kita_Ceritakan_Tentang_Hari_Ini_Edisi_Kolektor.pdf',
  'eb-148': '/buku_digital/eb-148_Dilan_1990_Edisi_Kolektor.pdf',
  'eb-149': '/buku_digital/eb-149_Milea_Suara_dari_Dilan_Edisi_Kolektor.pdf',
  'eb-150': '/buku_digital/eb-150_Ancika_Dia_yang_Bersamaku_Tahun_1995_Edisi_Kolektor.pdf',
};

// Populate map with all 160+ INITIAL_BOOKS
INITIAL_BOOKS.forEach(b => {
  if (b.id && b.pdfUrl) {
    BOOK_PDF_MAP[b.id] = b.pdfUrl;
  }
});

const defaultPdfs = [
  '/buku_digital/Berani-jadi-SE-24Jun2015-final.pdf',
  '/buku_digital/Tere Liye - Bulan.pdf',
  '/buku_digital/Konspirasi alam semesta - fiersa besari.pdf',
  '/buku_digital/Letters_of_a_Javanese_Princess.pdf',
  '/buku_digital/Coding project in scratch.pdf',
  '/buku_digital/The_History_of_Java.pdf',
  '/buku_digital/KAJIAN-PUISI.pdf',
  '/buku_digital/The Deliciously Keto Cookbook.pdf',
  '/buku_digital/computer forensics.pdf'
];

/**
 * Resolves the accurate PDF URL for any book object or parameters across all 160+ books.
 * Priority: BOOK_PDF_MAP by ID > book.pdfUrl > INITIAL_BOOKS lookup > fuzzy match > hash fallback
 */
export function resolveBookPdfUrl(book?: Partial<Book> | null): string {
  let rawUrl = defaultPdfs[0];

  if (!book) {
    rawUrl = defaultPdfs[0];
  } else if (book.id && BOOK_PDF_MAP[book.id]) {
    // 1. Direct ID lookup in BOOK_PDF_MAP — highest priority (most accurate)
    rawUrl = BOOK_PDF_MAP[book.id];
  } else if (book.pdfUrl && (book.pdfUrl.startsWith('/buku_digital/') || book.pdfUrl.startsWith('http') || book.pdfUrl.startsWith('data:'))) {
    // 2. Explicit pdfUrl property on book object
    rawUrl = book.pdfUrl;
  } else if (book.id || book.title) {
    // 3. Search in INITIAL_BOOKS by ID or title match
    const foundByInitial = INITIAL_BOOKS.find(b => 
      (book.id && b.id === book.id) || 
      (book.title && b.title.toLowerCase().trim() === book.title.toLowerCase().trim())
    );
    if (foundByInitial?.pdfUrl) {
      rawUrl = foundByInitial.pdfUrl;
    } else if (book.title) {
      // 4. Fuzzy title matching
      const titleLower = book.title.toLowerCase();
      if (titleLower.includes('little duke') || titleLower.includes('richard')) rawUrl = BOOK_PDF_MAP['eb-1'];
      else if (titleLower.includes('mistress wilding')) rawUrl = BOOK_PDF_MAP['eb-2'];
      else if (titleLower.includes('advice for the muslim')) rawUrl = BOOK_PDF_MAP['eb-3'];
      else if (titleLower.includes('software engineer') || titleLower.includes('berani jadi')) rawUrl = BOOK_PDF_MAP['eb-4'];
      else if (titleLower.includes('scratch') || titleLower.includes('coding project')) rawUrl = BOOK_PDF_MAP['eb-5'];
      else if (titleLower.includes('documents of the right word')) rawUrl = BOOK_PDF_MAP['eb-6'];
      else if (titleLower.includes('islam and christianity')) rawUrl = BOOK_PDF_MAP['eb-7'];
      else if (titleLower.includes('puisi')) rawUrl = BOOK_PDF_MAP['eb-8'];
      else if (titleLower.includes('konspirasi alam semesta')) rawUrl = BOOK_PDF_MAP['eb-9'];
      else if (titleLower.includes('negeri di ujung tanduk')) rawUrl = BOOK_PDF_MAP['eb-10'];
      else if (titleLower.includes('sosiologi') || titleLower.includes('politik identitas')) rawUrl = BOOK_PDF_MAP['eb-11'];
      else if (titleLower.includes('agraria') || titleLower.includes('geografi')) rawUrl = BOOK_PDF_MAP['eb-12'];
      else if (titleLower.includes('kelas kecil') || titleLower.includes('antikorupsi')) rawUrl = BOOK_PDF_MAP['eb-13'];
      else if (titleLower.includes('bulan')) rawUrl = BOOK_PDF_MAP['eb-14'];
      else if (titleLower.includes('tentang kamu')) rawUrl = BOOK_PDF_MAP['eb-15'];
      else if (titleLower.includes('matahari')) rawUrl = BOOK_PDF_MAP['eb-16'];
      else if (titleLower.includes('keto')) rawUrl = BOOK_PDF_MAP['eb-17'];
      else if (titleLower.includes('forensics') || titleLower.includes('cyber')) rawUrl = BOOK_PDF_MAP['eb-18'];
      else if (titleLower.includes('kartini') || titleLower.includes('javanese princess')) rawUrl = BOOK_PDF_MAP['gut-1'];
      else if (titleLower.includes('max havelaar')) rawUrl = BOOK_PDF_MAP['gut-2'];
      else if (titleLower.includes('history of sumatra')) rawUrl = BOOK_PDF_MAP['gut-3'];
      else if (titleLower.includes('lord jim')) rawUrl = BOOK_PDF_MAP['gut-4'];
      else if (titleLower.includes('history of java')) rawUrl = BOOK_PDF_MAP['gut-5'];
      else if (titleLower.includes('hidden force')) rawUrl = BOOK_PDF_MAP['gut-6'];
      else if (titleLower.includes('monumental java')) rawUrl = BOOK_PDF_MAP['gut-7'];
      else if (titleLower.includes('blown to bits') || titleLower.includes('rakata')) rawUrl = BOOK_PDF_MAP['gut-8'];
      else if (titleLower.includes('facts and fancies')) rawUrl = BOOK_PDF_MAP['gut-9'];
      else if (titleLower.includes('archipelago') || titleLower.includes('bickmore')) rawUrl = BOOK_PDF_MAP['gut-10'];
      else {
        // 5. Hash code deterministic pick from default PDFs for new custom books
        let hash = 0;
        for (let i = 0; i < book.title.length; i++) {
          hash = (hash << 5) - hash + book.title.charCodeAt(i);
          hash |= 0;
        }
        const idx = Math.abs(hash) % defaultPdfs.length;
        rawUrl = defaultPdfs[idx];
      }
    }
  }

  // Ensure URI component encoding for spaces or special characters
  if (rawUrl.startsWith('/buku_digital/')) {
    const fileName = rawUrl.replace('/buku_digital/', '');
    return `/buku_digital/${encodeURIComponent(fileName)}`;
  }
  return rawUrl;
}

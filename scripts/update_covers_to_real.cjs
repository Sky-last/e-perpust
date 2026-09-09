const fs = require('fs');
const path = require('path');

// Mapping from old cover -> new real cover for bks books
// Old: cover_bks-N_Title.jpg or cover_bks-N.jpg  
// New: cover_bks_N_Title.jpg
const coverUpdates = {
  // bks books - update to use real covers from PDF pages
  'cover_bks-10_Hmm__Enaaak.jpg': 'cover_bks_10_Hmm__Enaaak.jpg',
  'cover_bks-11_Jaket_Pinjaman.jpg': 'cover_bks_11_Jaket_Pinjaman.jpg',
  'cover_bks-12_Kisah_Beruk_dan_Hewan_Lainnya.jpg': 'cover_bks_12_Kisah_Beruk_dan_Hewan_Lainnya.jpg',
  'cover_bks-13_Rewako__Ammang____Beranilah__Ammang.jpg': 'cover_bks_13_Rewako__Ammang____Beranilah__Ammang.jpg',
  'cover_bks-14_Di_Mana_Ibu.jpg': 'cover_bks_14_Di_Mana_Ibu.jpg',
  'cover_bks-15_Di_Mana_Keli.jpg': 'cover_bks_15_Di_Mana_Keli.jpg',
  'cover_bks-16_Dina_Bisa_Cerita.jpg': 'cover_bks_16_Dina_Bisa_Cerita.jpg',
  'cover_bks-17_Dongeng_untuk_Santi.jpg': 'cover_bks_17_Dongeng_untuk_Santi.jpg',
  'cover_bks-18_Dua_Potong_Gorengan.jpg': 'cover_bks_18_Dua_Potong_Gorengan.jpg',
  'cover_bks-19_Fao_Si_Pelompat_Batu.jpg': 'cover_bks_19_Fao_Si_Pelompat_Batu.jpg',
  'cover_bks-1_Syifa_dan_Burung_Kenari.jpg': 'cover_bks_1_Syifa_dan_Burung_Kenari.jpg',
  'cover_bks-20_Kue_Kimu.jpg': 'cover_bks_20_Kue_Kimu.jpg',
  'cover_bks-21_Sahabatku_Indonesia__Tingkat_A1__BIPA_1.jpg': 'cover_bks_21_Sahabatku_Indonesia__Tingkat_A1__BIPA_1.jpg',
  'cover_bks-22_Sahabatku_Indonesia__Tingkat_C2.jpg': 'cover_bks_22_Sahabatku_Indonesia__Tingkat_C2.jpg',
  'cover_bks-23_Buku_Praktis_Bahasa_Indonesia_1.jpg': 'cover_bks_23_Buku_Praktis_Bahasa_Indonesia_1.jpg',
  'cover_bks-24_Buku_Praktis_Bahasa_Indonesia_2.jpg': 'cover_bks_24_Buku_Praktis_Bahasa_Indonesia_2.jpg',
  'cover_bks-25_Bahasa_Indonesia__Buku_Guru_SMP_MTs_Kelas_VIII.jpg': 'cover_bks_25_Bahasa_Indonesia__Buku_Guru_SMP_MTs_Kelas_VIII.jpg',
  'cover_bks-26_Pendidikan_Agama_Katolik_dan_Budi_Pekerti_SD_Kelas_IV.jpg': 'cover_bks_26_Pendidikan_Agama_Katolik_dan_Budi_Pekerti_SD_Kelas_IV.jpg',
  'cover_bks-27_Glosarium_Matematika.jpg': 'cover_bks_27_Glosarium_Matematika.jpg',
  'cover_bks-28_Latihan_Soal_Kemahiran_Berbahasa_Indonesia.jpg': 'cover_bks_28_Latihan_Soal_Kemahiran_Berbahasa_Indonesia.jpg',
  'cover_bks-29_Seri_Pelatihan_UKBI.jpg': 'cover_bks_29_Seri_Pelatihan_UKBI.jpg',
  'cover_bks-2_Rusaknya_Suara_Kodok.jpg': 'cover_bks_2_Rusaknya_Suara_Kodok.jpg',
  'cover_bks-30_Tata_Bahasa_Baku_Bahasa_Indonesia.jpg': 'cover_bks_30_Tata_Bahasa_Baku_Bahasa_Indonesia.jpg',
  'cover_bks-31_History_of_Indonesia__A_Resource_Book.jpg': 'cover_bks_31_History_of_Indonesia__A_Resource_Book.jpg',
  'cover_bks-32_1957__Deklarasi_Djuanda_dan_Kedaulatan_Laut_Kita.jpg': 'cover_bks_32_1957__Deklarasi_Djuanda_dan_Kedaulatan_Laut_Kita.jpg',
  'cover_bks-33_Sisingamangaraja__Pemersatu_Batak_di_Toba.jpg': 'cover_bks_33_Sisingamangaraja__Pemersatu_Batak_di_Toba.jpg',
  'cover_bks-34_Tinggalan_Kolonial_di_Jawa_Timur.jpg': 'cover_bks_34_Tinggalan_Kolonial_di_Jawa_Timur.jpg',
  'cover_bks-35_Kebhinekaan_Budaya_Papua__Perspektif_Arkeologi_Prasejarah.jpg': 'cover_bks_35_Kebhinekaan_Budaya_Papua__Perspektif_Arkeologi_Prasejarah.jpg',
  'cover_bks-36_Kepahlawanan_Trunajaya.jpg': 'cover_bks_36_Kepahlawanan_Trunajaya.jpg',
  'cover_bks-37_Asal_Usul_Danau_Maninjau.jpg': 'cover_bks_37_Asal_Usul_Danau_Maninjau.jpg',
  'cover_bks-38_Bahasa_Daerah_di_Indonesia__Kebersamaan_dalam_Keberagaman.jpg': 'cover_bks_38_Bahasa_Daerah_di_Indonesia__Kebersamaan_dalam_Keberagaman.jpg',
  'cover_bks-39_Ceritera_Rakyat_Daerah_Jambi.jpg': 'cover_bks_39_Ceritera_Rakyat_Daerah_Jambi.jpg',
  'cover_bks-3_Lepu_pun_Tersenyum.jpg': 'cover_bks_3_Lepu_pun_Tersenyum.jpg',
  'cover_bks-40_Ungkapan_Tradisional_Daerah_Istimewa_Aceh.jpg': 'cover_bks_40_Ungkapan_Tradisional_Daerah_Istimewa_Aceh.jpg',
  'cover_bks-41_Purnama_Alam_I.jpg': 'cover_bks_41_Purnama_Alam_I.jpg',
  'cover_bks-42_Carita_Badak_Pamalang__Carita_Pantun_Sunda.jpg': 'cover_bks_42_Carita_Badak_Pamalang__Carita_Pantun_Sunda.jpg',
  'cover_bks-43_Babad_Majapahit.jpg': 'cover_bks_43_Babad_Majapahit.jpg',
  'cover_bks-44_Ceritera_Panji_Pakang_Raras.jpg': 'cover_bks_44_Ceritera_Panji_Pakang_Raras.jpg',
  'cover_bks-45_Ancimun_Tuminggang_Dui__Mentimun_Menimpa_Duri.jpg': 'cover_bks_45_Ancimun_Tuminggang_Dui__Mentimun_Menimpa_Duri.jpg',
  'cover_bks-46_Supraba_Lan_Suminten.jpg': 'cover_bks_46_Supraba_Lan_Suminten.jpg',
  'cover_bks-47_Kidung_Megat_Kung.jpg': 'cover_bks_47_Kidung_Megat_Kung.jpg',
  'cover_bks-48_Sistem_Sapaan_Dialek_Jakarta.jpg': 'cover_bks_48_Sistem_Sapaan_Dialek_Jakarta.jpg',
  'cover_bks-49_Pedoman_Penelitian_Sosiologi_Sastra.jpg': 'cover_bks_49_Pedoman_Penelitian_Sosiologi_Sastra.jpg',
  'cover_bks-4_Bumi__Ayo_Bangun.jpg': 'cover_bks_4_Bumi__Ayo_Bangun.jpg',
  'cover_bks-50_Verba_Taktransitif_Bahasa_Sunda.jpg': 'cover_bks_50_Verba_Taktransitif_Bahasa_Sunda.jpg',
  'cover_bks-5_Kutilang_yang_Suka_Bernyanyi.jpg': 'cover_bks_5_Kutilang_yang_Suka_Bernyanyi.jpg',
  'cover_bks-6_Operasi_Sampah_di_Taman.jpg': 'cover_bks_6_Operasi_Sampah_di_Taman.jpg',
  'cover_bks-7_Pesut_Tak_Lapar_Lagi.jpg': 'cover_bks_7_Pesut_Tak_Lapar_Lagi.jpg',
  'cover_bks-8_Biji_Merah_Luna.jpg': 'cover_bks_8_Biji_Merah_Luna.jpg',
  'cover_bks-9_Gambar_Lucu_Mika.jpg': 'cover_bks_9_Gambar_Lucu_Mika.jpg',
  // gut books - use real covers that were extracted from PDFs
  'cover_gut-1.jpg': 'cover_gut-1_Letters_of_a_Javanese_Princess.jpg',
  'cover_gut-2.jpg': 'cover_gut-2_Max_Havelaar.jpg',
  'cover_gut-4.jpg': 'cover_gut-4_Lord_Jim.jpg',
  'cover_gut-6.jpg': 'cover_gut-6_The_Hidden_Force__A_Story_of_Modern_Java.jpg',
  'cover_gut-8.jpg': 'cover_gut-8_Blown_to_Bits__or__The_Lonely_Man_of_Rakata.jpg',
};

const booksFile = 'src/data/books.tsx';
let content = fs.readFileSync(booksFile, 'utf8');
let changed = 0;

for (const [oldCover, newCover] of Object.entries(coverUpdates)) {
  const oldPath = `/buku_sampul/${oldCover}`;
  const newPath = `/buku_sampul/${newCover}`;
  
  // Check if new cover exists
  const newCoverPath = path.join('public/buku_sampul', newCover);
  if (!fs.existsSync(newCoverPath)) {
    console.log('WARNING: New cover does not exist: ' + newCoverPath);
    continue;
  }
  
  if (content.includes(oldPath)) {
    content = content.split(oldPath).join(newPath);
    console.log('Updated: ' + oldCover + ' -> ' + newCover);
    changed++;
  }
}

fs.writeFileSync(booksFile, content);
console.log('\nTotal updates: ' + changed);

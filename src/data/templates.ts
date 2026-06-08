import { SavedDocument, SchoolConfig, SyllabusData, RPPData } from "../types";

export const DEFAULT_SCHOOL_CONFIG: SchoolConfig = {
  sekolah: "SD Negeri Merdeka Jakarta",
  npsn: "20103245",
  alamat: "Jl. Pendidikan No. 45, Jakarta Pusat, DKI Jakarta",
  guru: "Budi Santoso, S.Pd.",
  nip: "198805122015031002",
  kepalaSekolah: "Dra. Hajah Siti Aminah, M.Pd.",
  nipKepalaSekolah: "197410201999032001",
  tahunAjaran: "2025/2026",
  semester: "Ganjil",
  kelas: "4",
  fase: "B",
  mapel: "Matematika",
};

export const SYLLABUS_TEMPLATES: Record<string, { config: SchoolConfig; data: SyllabusData }> = {
  "math-4": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "4",
      fase: "B",
      mapel: "Matematika",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik dapat menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000, melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100 menggunakan benda-benda konkret serta menyelesaikan masalah berkaitan dengan kehidupan sehari-hari.",
      alokasiWaktuTotal: "15 JP (5 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Membaca dan menulis bilangan cacah sampai 10.000 dengan benar sesuai nilai tempatnya.",
          materiPokok: "Bilangan Cacah Besar",
          kegiatanPembelajaran: "Mengamati gambar blok dienes atau papan nilai tempat, membandingkan bilangan menggunakan lambang pembanding, serta memainkan game kartu angka secara berpasangan.",
          profilPancasila: "Bernalar Kritis, Mandiri",
          penilaian: "Tes Tertulis (Lembar soal nilai tempat) & Observasi Kinerja berpasangan",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Buku Siswa Matematika Kelas IV Volume 1 (Kemendikbudristek 2021), Kartu Angka"
        },
        {
          tujuanPembelajaran: "Melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 100 dengan teknik menyimpan/meminjam.",
          materiPokok: "Penjumlahan & Pengurangan Bilangan",
          kegiatanPembelajaran: "Mendiskusikan metode penyelesaian soal cerita pasar tradisional, berlatih menggunakan sempoa atau lidi warna-warni, serta presentasi kelompok.",
          profilPancasila: "Gotong Royong, Bernalar Kritis",
          penilaian: "Asesmen Formatif (Keaktifan Diskusi) & Kuis Individu",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Buku Panduan Guru Matematika Kelas IV, Kelereng/Lidi manipulatif"
        },
        {
          tujuanPembelajaran: "Menentukan hasil kali bilangan cacah satu angka dengan dua angka menggunakan model luas.",
          materiPokok: "Perkalian Bilangan Cacah",
          kegiatanPembelajaran: "Menggambar kisi-kisi atau matriks kotak pada buku berpetak, mempartisi bilangan puluhan dan satuan, serta melakukan kalkulasi perkalian bersusun pendek.",
          profilPancasila: "Kreatif, Mandiri",
          penilaian: "Tugas Portofolio menggambar representasi visual perkalian",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Modul Ajar Matematika Relasi Operasi, Kertas Grid Kotak"
        },
        {
          tujuanPembelajaran: "Menyelesaikan masalah sehari-hari yang berkaitan dengan pembagian bilangan cacah dua digit.",
          materiPokok: "Pembagian Bilangan Cacah",
          kegiatanPembelajaran: "Mensimulasikan pembagian pulpen/buku secara merata dalam kelompok kecil, menuliskan kalimat matematika, serta mengecek jawaban dengan perkalian.",
          profilPancasila: "Bernalar Kritis, Gotong Royong",
          penilaian: "Asesmen Sumatif Lingkup Materi (Tes Pilihan Ganda dan Esai)",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku Matematika K-Merdeka Kelas IV, Lembar Kasus Masalah Reallistis"
        }
      ]
    }
  },
  "indo-1": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "1",
      fase: "A",
      mapel: "Bahasa Indonesia",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, sesuai dengan tujuan, kepada teman sebaya dan orang dewasa di sekitar tentang diri dan lingkungannya. Peserta didik mampu merespons instruksi lisan sederhana, menceritakan kembali ide pokok, dan merangkai suku kata menjadi kata sederhana.",
      alokasiWaktuTotal: "12 JP (4 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Mengenal bunyi huruf abjad (A-Z) dan melafalkan vokal serta konsonan dasar secara fasih.",
          materiPokok: "Bunyi Huruf dan Abjad",
          kegiatanPembelajaran: "Menyanyikan lagu alfabet, meraba huruf dari bahan pasir/karton kasar, serta bermain menebak arah pandang bibir guru saat menyebut sebuah huruf.",
          profilPancasila: "Mandiri, Bernalar Kritis",
          penilaian: "Observasi lisan individu dalam menyebutkan huruf acak",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Buku Siswa Bahasa Indonesia Kelas I 'Aku Bisa!', Kartu Huruf Pelangi"
        },
        {
          tujuanPembelajaran: "Merangkai suku kata berawalan huruf 'b' (bo-bi-bu-ba-be) membentuk kata-kata bermakna.",
          materiPokok: "Membaca Suku Kata",
          kegiatanPembelajaran: "Menempel kartu suku kata dengan gambar objek yang tepat (bola, biru, buku, baju, bebek), membaca nyaring bersama, serta mencari suku kata di sekeliling kelas.",
          profilPancasila: "Kreatif, Gotong Royong",
          penilaian: "Lembar Kerja Menghubungkan Kata dengan Gambar",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Big Book Bergambar 'Boni Gemar Membaca', Papan Suku Kata"
        }
      ]
    }
  },
  "ipa-5": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "5",
      fase: "C",
      mapel: "IPA",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik menganalisis hubungan antara bentuk serta fungsi organ tubuh pada manusia (pencernaan, pernapasan, peredaran darah). Peserta didik melakukan simulasi dengan menggunakan gambar/bagan/alat peraga sederhana untuk menggambarkan siklus hidup, ekosistem, serta pengaruh manusia terhadap keseimbangan alam.",
      alokasiWaktuTotal: "16 JP (4 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Menganalisis sistem organ pencernaan manusia beserta fungsi masing-masing kelenjar pencernaan.",
          materiPokok: "Organ Pencernaan Manusia",
          kegiatanPembelajaran: "Menonton video animasi perjalanan makanan di dalam tubuh, menyusun puzzle organ pencernaan secara berkelompok, serta membuat simulasi gerakan peristaltik usus Menggunakan balon.",
          profilPancasila: "Bernalar Kritis, Gotong Royong",
          penilaian: "Tes Tulis (Mengisi label organ tubuh) & Unjuk Kerja Presentasi Puzzle",
          alokasiWaktu: "4 JP",
          sumberBelajar: "Buku IPA Kelas V Kemendikbud, Video Animasi Organ Pencernaan, Celemek Puzzle Organ"
        },
        {
          tujuanPembelajaran: "Menjelaskan mekanisme pernapasan dada dan perut serta mendiagnosis gangguan sistem pernapasan.",
          materiPokok: "Sistem Pernapasan Manusia",
          kegiatanPembelajaran: "Membuat alat peraga paru-paru buatan menggunakan botol plastik bekas, balon, dan sedotan. Melakukan eksperimen frekuensi denyut nadi saat istirahat vs berlari.",
          profilPancasila: "Kreatif, Bernalar Kritis",
          penilaian: "Penilaian Laporan Praktikum & Demonstrasi Alat Peraga",
          alokasiWaktu: "4 JP",
          sumberBelajar: "Buku Guru IPAS Kelas V, Botol Plastik bekas, Balon elastis, Plastisin"
        }
      ]
    }
  },
  "ips-4": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "4",
      fase: "B",
      mapel: "IPS",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik mengenal konsep sejarah perkembangan wilayah tempat tinggalnya, mengidentifikasi aktivitas ekonomi masyarakat setempat, ragam bentang alam, serta interaksi manusia dengan lingkungan sekitarnya.",
      alokasiWaktuTotal: "12 JP (4 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Mengidentifikasi ragam bentang alam (pantai, dataran rendah, dataran tinggi) di lingkungan sekitar beserta potensi ekonominya secara berkelanjutan.",
          materiPokok: "Bentang Alam dan Kegiatan Ekonomi",
          kegiatanPembelajaran: "Membaca peta tematik daerah setempat, berdiskusi kelompok mengidentifikasi mata pencaharian dominan di dataran tinggi vs pantai, serta membuat peta konsep ekonomi.",
          profilPancasila: "Bernalar Kritis, Gotong Royong",
          penilaian: "Presentasi Kelompok & Tes Gambar Bentang Alam",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku IPS Kelas IV Kemendikbud, Peta Administratif Daerah"
        },
        {
          tujuanPembelajaran: "Menjelaskan peninggalan sejarah kerajaan Hindu, Buddha, dan Islam di wilayah provinsi tempat tinggal.",
          materiPokok: "Sejarah Lokal & Peninggalannya",
          kegiatanPembelajaran: "Mengamati foto candi, prasasti, atau masjid kuno, berdiskusi mengenai nilai luhur kepemimpinan raja masa lalu, serta menyusun lini masa sejarah sederhana.",
          profilPancasila: "Berkebinekaan Global, Mandiri",
          penilaian: "Portofolio Lini Masa Sejarah & Tes tertulis",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku IPS Kurikulum Merdeka Kelas IV, Gambar Peninggalan Sejarah"
        }
      ]
    }
  },
  "ppkn-3": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "3",
      fase: "B",
      mapel: "PPKn",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik mampu memahami simbol-simbol Pancasila, menerapkan nilai-nilai luhur Pancasila dalam kehidupan sehari-hari secara konsisten, memahami aturan di rumah dan di sekolah, serta menghormati keberagaman di lingkungan sekitarnya.",
      alokasiWaktuTotal: "10 JP (3 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Mengidentifikasi hubungan antara simbol-simbol dengan sila-sila Pancasila secara runtut.",
          materiPokok: "Simbol dan Sila Pancasila",
          kegiatanPembelajaran: "Mengamati gambar Garuda Pancasila, bermain mencocokkan kartu simbol (bintang, rantai, pohon beringin, kepala banteng, padi & kapas) dengan bunyian sila Pancasila.",
          profilPancasila: "Beriman, Bertakwa kepada Tuhan YME, Bernalar Kritis",
          penilaian: "Penilaian Lisan (Menghafal Sila) & Tes tulis menjodohkan simbol",
          alokasiWaktu: "4 JP",
          sumberBelajar: "Buku Pendidikan Pancasila Kelas III, Gambar Garuda Pancasila"
        },
        {
          tujuanPembelajaran: "Mencontohkan perbuatan baik di rumah dan sekolah yang sesuai dengan nilai-nilai Pancasila sila pertama sampai kelima.",
          materiPokok: "Penerapan Nilai-Nilai Pancasila",
          kegiatanPembelajaran: "Simulasi bermain peran perilaku berbagi makanan (Sila 5), berdiskusi tentang sikap toleransi beribadah (Sila 1), serta menulis jurnal kebaikan harian.",
          profilPancasila: "Gotong Royong, Mandiri",
          penilaian: "Observasi Perilaku Sosial & Jurnal Penilaian diri pribadi",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku Pendidikan Pancasila Kurikulum Merdeka Kelas III, Lembar Jurnal Kebaikan"
        }
      ]
    }
  },
  "pjok-6": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "6",
      fase: "C",
      mapel: "PJOK",
      semester: "Ganjil"
    },
    data: {
      capaianPembelajaran: "Peserta didik dapat menunjukkan kemahirannya dalam berbagai pola gerak dasar lokomotor, non-lokomotor, dan manipulatif secara mandiri atau berkelompok, serta mempraktikkan konsep kebugaran jasmani untuk kesehatan tubuh.",
      alokasiWaktuTotal: "12 JP (3 Pertemuan)",
      tabelSilabus: [
        {
          tujuanPembelajaran: "Mempraktikkan variasi dan kombinasi gerak dasar lokomotor (berlari, melompat) dan manipulatif (melempar, menangkap) dalam permainan bola kasti.",
          materiPokok: "Kombinasi Gerak Dasar Bola Kasti",
          kegiatanPembelajaran: "Melakukan pemanasan peregangan sendi, melatih teknik melempar bola lambung, mendatar, dan menggelinding ke sasaran, serta berpasangan melatih ayunan pukulan kayu.",
          profilPancasila: "Mandiri, Gotong Royong",
          penilaian: "Uji Kinerja Praktik melempar dan menangkap sejauh 5 meter",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku Guru dan Siswa PJOK Kelas VI, Lapangan Sekolah, Bola Kasti, Kayu Pemukul"
        },
        {
          tujuanPembelajaran: "Menganalisis dan melakukan latihan sirkuit tingkat sedang untuk melatih kelincahan, kekuatan otot lengan, dan daya tahan jantung.",
          materiPokok: "Kebugaran Jasmani (Circuit Training)",
          kegiatanPembelajaran: "Melakukan demonstrasi gerakan dasar push-up, sit-up, shuttle run, dan skipping di stasiun sirkuit olahraga, mencatat denyut nadi sebelum dan sesudah latihan.",
          profilPancasila: "Bernalar Kritis, Kreatif",
          penilaian: "Penilaian unjuk kekuatan (jumlah repetisi push-up) & Log latihan fisik",
          alokasiWaktu: "6 JP",
          sumberBelajar: "Buku Kebugaran Jasmani, Stopwatch, Cone pembatas lapangan"
        }
      ]
    }
  }
};

export const RPP_TEMPLATES: Record<string, { config: SchoolConfig; data: RPPData }> = {
  "math-4": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "4",
      fase: "B",
      mapel: "Matematika",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Peserta didik sudah mengenali bilangan 1-100 dan memahami konsep dasar penjumlahan dua digit.",
      profilPancasila: ["Bernalar Kritis", "Mandiri", "Gotong Royong"],
      saranaPrasarana: "Papan tulis, Proyektor, Kartu angka, Blok dienes manipulatif, Smartphone (opsional).",
      targetPesertaDidik: "Regular/Khas (Umum, Tidak ada kesulitan belajar khusus)",
      modelPembelajaran: "Problem Based Learning (PBL) terintegrasi metode diskusi kelompok.",
      tujuanPembelajaran: [
        "Peserta didik dapat mengidentifikasi nilai tempat ribuan, ratusan, puluhan, dan satuan pada bilangan cacah hingga 10.000 dengan tepat.",
        "Peserta didik dapat membaca dan menulis nominal angka dalam bentuk kata Bahasa Indonesia secara presisi."
      ],
      pemahamanBermakna: "Memahami nilai tempat membantu kita menghitung uang jajan, menyusun anggaran belanja, dan membaca jumlah penduduk atau luas suatu daerah secara presisi.",
      pertanyaanPemantik: [
        "Mana yang lebih besar, angka 5 pada bilangan 500 atau angka 5 pada bilangan 5.000?",
        "Jika kalian punya lembaran uang 2 ribu sebanyak lima lembar, bagaimana kalian menuliskan angka total harganya?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Guru menyapa peserta didik dengan hangat, berdoa bersama, mengecek kehadiran, dan melantunkan yel-yel penyemangat.\n2. Guru memberikan apersepsi dengan memegang dua lembar uang mainan nominal Rp1.000 dan Rp10.000. Meminta siswa memilih uang mana yang paling disukai dan mengapa.\n3. Guru menyampaikan tujuan pembelajaran hari ini mengenai rahasia nilai tempat bilangan cacah besar.",
          alokasiWaktu: "15 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "Sintaks 1: Orientasi Siswa Pada Masalah\n1. Guru menampilkan infografis jumlah siswa SD di kecamatan mereka pada layar lcd (Misal: 4.321 siswa).\n2. Siswa ditanya: 'Berapa banyak jumlah ribuan di sana? Berapa jumlah ratusannya?'\n\nSintaks 2: Mengorganisasi Siswa\n3. Siswa dibagi ke dalam kelompok yang terdiri dari 4-5 anak secara heterogen.\n4. Guru membagikan LKPD lembar kerja dan satu set kartu angka (0-9).\n\nSintaks 3: Membimbing Penyelidikan Kelompok\n5. Siswa diminta memainkan peran kasir bank. Mereka merangkai angka acak membentuk nilai tempat tertentu berdasarkan kasus pinjaman uang atau nasabah bank.\n6. Guru berkeliling memberi bimbingan taktis kepada kelompok yang kesulitan mengisi bagan penempatan kolom.\n\nSintaks 4: Mengembangkan dan Menyajikan Hasil Karya\n7. Setiap perwakilan kelompok menempelkan bagan nilai tempat di kelas menggunakan papan pintar.\n8. Kelompok lain mendengarkan dan mencocokkan nominal penulisan dengan sebutan bahasa baku.\n\nSintaks 5: Menganalisis dan Mengevaluasi Masalah\n9. Guru memberikan penguatan materi berupa konsep perpindahan posisi angka satu kolum ke kiri melambangkan kelipatan sepuluh.",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Siswa bersama guru menyimpulkan poin penting pembelajaran hari ini tentang Nilai Tempat.\n2. Guru membagikan lembar kuis evaluasi tertulis mandiri selama 5 menit.\n3. Melakukan refleksi bersama: 'Apa kegiatan yang paling menyenangkan?', 'Bagan mana yang kalian anggap paling sulit?'\n4. Kelas ditutup dengan berdoa bersama dipimpin ketua kelas dan membersihkan sisa kertas.",
          alokasiWaktu: "10 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Pertanyaan lisan acak di awal kelas mengenai bilangan ratusan untuk mengecek kesiapan belajar.",
        formatif: "Lembar penilaian kerja kelompok selama permainan simulasi kasir bank (kolaboratif).",
        sumatif: "Tes esai pendek berdurasi 10 menit berisi 5 butir soal mengubah angka ke tulisan kata dan sebaliknya."
      },
      remedialAndPengayaan: {
        remedial: "Bimbingan individu atau peer-tutoring menggunakan blok dienes fisik untuk siswa yang belum menguasai pemisahan bilangan ribuan dan puluhan.",
        pengayaan: "Diberikan soal analisis bilangan teka-teki misteri angka dengan pola tertentu di atas 10.000."
      },
      lkpd: "PANDUAN LEMBAR KERJA PESERTA DIDIK (LKPD)\nMata Pelajaran: Matematika (Fase B/IV)\nKelompok: .....................\nAnggota: \n1. ....................\n2. ....................\n\nTUGAS SIMULASI KASIR BANK PINDAH\nAlat: Kartu Angka 0-9, Papan Bagan.\nPetunjuk Kegiatan:\n1. Ambil 4 buah kartu angka secara acak dari kantong guru (Misal: 7, 2, 9, 1).\n2. Susun angka-angka tersebut agar membentuk:\n   a. Bilangan terbesar yang kalian bisa.\n   b. Bilangan terkecil yang kalian bisa.\n3. Masukkan ke dalam tabel kosong di bawah ini:\n   [ Ribuan | Ratusan | Puluhan | Satuan ]\n4. Tuliskan sebutan nominal bahasa Indonesia yang benar dari bilangan tersebut!",
      rubrikPenilaian: "RUBRIK EVALUASI PENILAIAN SIKAP & KOGNITIF\n\n1. Penilaian Kognitif (Asesmen Sumatif):\n- Nilai 4 (Sangat Baik): Mengubah, menempatkan, dan menyebutkan seluruh nilai tempat dengan tanpa kesalahan sedikit pun.\n- Nilai 3 (Baik): Ada 1-2 kesalahan kecil tetapi logika penulisan kata angka tetap benar.\n- Nilai 2 (Cukup): Mengetahui posisi ribuan tetapi keliru membedakan puluhan dan satuan.\n- Nilai 1 (Perlu Pendampingan): Tidak paham meletakkan angka di kolom kolom.\n\n2. Penilaian Sikap (Profil Pelajar Pancasila):\n- Bernalar Kritis: Menunjukkan antusiasme bertanya dan menganalisis pola bilangan.\n- Gotong Royong: Membantu teman satu kelompok menyelesaikan LKPD secara harmonis."
    }
  },
  "indo-1": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "1",
      fase: "A",
      mapel: "Bahasa Indonesia",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Siswa telah mengetahui cara memegang pensil dan melafalkan beberapa huruf vokal mayoritas.",
      profilPancasila: ["Mandiri", "Kreatif"],
      saranaPrasarana: "Kartu Suku Kata (bo-bi-bu-ba-be), Buku Cerita Bergambar Besar (Big Book), Lem Perekat.",
      targetPesertaDidik: "Umum/Reguler",
      modelPembelajaran: "Metode ceramah interaktif, menyanyi, dan belajar sambil bermain menebak gambar.",
      tujuanPembelajaran: [
        "Peserta didik dapat membaca suku kata berawalan huruf 'b' dengan benar.",
        "Peserta didik mampu menyebutkan setidaknya 3 nama hewan atau benda yang diawali huruf 'b'."
      ],
      pemahamanBermakna: "Mampu membaca suku kata adalah kunci utama untuk menjelajahi dunia buku cerita menarik yang menyenangkan.",
      pertanyaanPemantik: [
        "Siapa yang suka makan Buah? Sebutkan buah apa yang disukai?",
        "Benda apa di dalam kelas kita yang berbunyi kring-kring atau menggelinding?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Mengucapkan salam pembuka kondusif, menyanyi lagu 'Dua Mata Saya' bersama-sama.\n2. Memberikan teka-teki: 'Aku punya sayap cantik, hinggap di bunga, namaku berawalan huruf B, siapa aku?'\n3. Memperkenalkan tema petualangan huruf 'B' hari ini.",
          alokasiWaktu: "10 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "1. Guru membacakan Big Book 'Kisah Boni si Beruang'. Ketika kata berawal 'B' lewat, siswa mengetuk meja bersama.\n2. Guru menaruh kartu suku kata bo-bi-bu-ba-be di papan tulis.\n3. Siswa maju secara acak untuk memadukan suku kata tersebut membentuk kata bermakna (Contoh: bo-la, bu-ku, ba-ju).\n4. Siswa difasilitasi mewarnai gambar barang berawal 'B' kemudian menempelkan suku kata yang cocok di bawahnya.",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Guru mengulas cepat bunyian huruf ba, bi, bu, be, bo.\n2. Siswa diberikan tepuk apresiasi meriah.\n3. Menugaskan siswa di rumah mencari benda berawal dari rumah.\n4. Salam penutup rapi.",
          alokasiWaktu: "15 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Tanya jawab lisan huruf dasar sebelum pelajaran dimulai.",
        formatif: "Membaca suku kata acak yang ditunjuk oleh guru dengan fasih.",
        sumatif: "Menyalin 3 kata berawalan B di buku tulis masing-masing dengan rapi."
      },
      remedialAndPengayaan: {
        remedial: "Pendampingan individu dalam mengeja vokal ganda 'o' dan 'e'.",
        pengayaan: "Diberi tantangan membaca buku cerita pendek bergambar secara mandiri."
      },
      lkpd: "LEMBAR KERJA ANAK - PETUALANGAN HURUF B\nNama: .....................\nKelas: 1\n\nTugas: Pasangkan garis dari kata miring ke gambar yang benar!\n[ BOLA ]  -----> (Gambar Buku)\n[ BUKU ]  -----> (Gambar Bola)\n[ BAJU ]  -----> (Gambar Baju)\n\nTulis kembali huruf 'B' sebanyak 5 kali dengan cantik di bawah!",
      rubrikPenilaian: "RUBRIK ASESMEN BAHASA INDONESIA KELAS I\n\nSikap Mandiri:\n- Skor 3 (Sangat Baik): Mengambil kartu dan mengerjakan tugas tanpa bergantung pada teman lain.\n- Skor 2 (Sedang): Membutuhkan sesekali penegasan dari guru.\n- Skor 1 (Kurang): Menangis atau enggan bergerak sendiri.\n\nKeterampilan Membaca Suku Kata:\n- Membaca tanpa mengeja (Lancar): 100\n- Mengucapkan terbata-bata tetapi benar: 80\n- Masih keliru membedakan b dan d: 60"
    }
  },
  "ipa-5": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "5",
      fase: "C",
      mapel: "IPA",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Peserta didik telah mengetahui bahwa tubuh memerlukan makanan untuk menghasilkan energi, serta mengenal nama beberapa organ tubuh.",
      profilPancasila: ["Bernalar Kritis", "Gotong Royong", "Kreatif"],
      saranaPrasarana: "Video pencernaan manusia, celemek plastik organ, kartu puzzle berpasangan, LKPD.",
      targetPesertaDidik: "Regular/Khas (Umum)",
      modelPembelajaran: "Contextual Teaching and Learning (CTL)",
      tujuanPembelajaran: [
        "Peserta didik mampu mengurutkan 6 saluran organ pencernaan dari mulut hingga anus dengan tepat.",
        "Peserta didik mendiagnosis dampak buruk penundaan makan terhadap stabilitas lambung."
      ],
      pemahamanBermakna: "Mengetahui cara tubuh mengolah nutrisi membuat kita lebih menghargai makanan sehat dan berdisiplin menjaga pola makan agar tidak terkena sakit maag.",
      pertanyaanPemantik: [
        "Pernahkah kamu berpikir ke mana perginya nasi goreng yang kamu makan tadi pagi setelah masuk mulut?",
        "Mengapa perut kita terasa melilit dan kembung jika kita sering lupa sarapan?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Orientasi kelas hangat, berdoa, dan absen pagi.\n2. Apersepsi: Guru mengunyah sepotong biskuit di depan kelas, berakting menelannya, lalu menanyakan: 'Di mana biskuit ini sekarang?'\n3. Menyampaikan outline kerja berkelompok tentang petualangan biskuit.",
          alokasiWaktu: "15 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "Sintaks 1: Mengamati Fenomena (Modeling)\n1. Guru menyajikan video animasi singkat mengenai organ pencernaan manusia.\n2. Menugaskan perwakilan siswa memakai celemek bergambar organ pencernaan.\n\nSintaks 2: Bertanya (Questioning)\n3. Siswa merumuskan pertanyaan: Apa bedanya usus halus dengan usus besar?\n\nSintaks 3: Konstruktivisme & Eksplorasi\n4. Siswa berkumpul secara berpasangan mencocokkan puzzle fungsi kelenjar ludah, lambung, pankreas, usus.\n5. Mensimulasikan gerakan meremas-remas makanan di kantong plastik elastis (layaknya enzim lambung).\n\nSintaks 4: Berdiskusi (Learning Community)\n6. Mengisi bagan rute perjalanan makanan lurus hingga keluar.\n\nSintaks 5: Refleksi Akhir\n7. Siswa memberikan simpulan fungsi peristaltik kerongkongan.",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Pemberian kuis isian peta sistem usus.\n2. Refleksi manfaat menjaga asupan sehat.\n3. Berdoa bersama penutup yang tenang.",
          alokasiWaktu: "15 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Tanya jawab verbal nama organ yang menempel di perut.",
        formatif: "Lembar penilaian mencocokan fungsi kelenjar pencernaan.",
        sumatif: "Soal pilihan ganda 5 butir mengenai fungsi enzim amilase, cairan empedu, dan klorida lambung."
      },
      remedialAndPengayaan: {
        remedial: "Mengulas kembali bagan sederhana menyusun puzzle organ dibantu guru.",
        pengayaan: "Tugas menyusun kliping jenis-jenis penyakit pencernaan dan solusinya."
      },
      lkpd: "LEMBAR KERJA SISWA (LKPD) - PETUALANGAN BISKUIT SEHAT\n\nNama Siswa: ....................\nKelas: V\n\nLengkapi rute saluran pencernaan di bawah ini menggunakan angka urut 1 sampai 6!\n[  ] Lambung\n[  ] Mulut\n[  ] Usus Besar\n[  ] Kerongkongan\n[  ] Anus\n[  ] Usus Halus\n\nSebutkan satu penyakit pencernaan yang terjadi di organ Lambung beserta pencegahannya!",
      rubrikPenilaian: "RUBRIK PENILAIAN IPA GERAK PENGERNAAN\n\nKognitif (Urutan rute pencernaan):\n- Nilai 100: Berhasil mengurutkan 6 rute dengan sempurna tanpa silang balik.\n- Nilai 80: Ada 1 kesalahan penempatan usus halus/besar.\n- Nilai 60: Paham mulut dan anus tetapi terbalik meletakkan lambung dan kerongkongan."
    }
  },
  "ips-4": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "4",
      fase: "B",
      mapel: "IPS",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Peserta didik sudah mengenal sekeliling lingkungan tempat tinggal dan memahami jenis-jenis pekerjaan sederhana.",
      profilPancasila: ["Berkebinekaan Global", "Bernalar Kritis", "Gotong Royong"],
      saranaPrasarana: "LCD Proyektor, Gambar bentang alam dan candi sejarah, kertas karton, gunting, lem.",
      targetPesertaDidik: "Regular/Khas (Umum)",
      modelPembelajaran: "Project Based Learning (PjBL) sederhana",
      tujuanPembelajaran: [
        "Peserta didik mampu mengidentifikasi korelasi antara bentang alam dengan mata pencaharian warga setempat dengan logis.",
        "Peserta didik mampu mendeskripsikan 3 contoh peninggalan sejarah bernilai tinggi di daerahnya."
      ],
      pemahamanBermakna: "Mempelajari lingkungan dan sejarah membantu kita menghargai warisan budaya dan memanfaatkan kekayaan alam sekitar dengan bijaksana.",
      pertanyaanPemantik: [
        "Mengapa orang yang tinggal di dekat pantai cenderung bekerja sebagai nelayan sedangkan di gunung menanam teh?",
        "Siapa yang pernah berkunjung ke candi atau tempat ibadah bersejarah? Mengapa tempat itu perlu dijaga?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Guru mengucapkan salam pembuka, memeriksa kesiapan belajar dan berdoa bersama.\n2. Mengaitkan materi pembelajaran dengan menunjukkan sebuah kelapa dan sekotak teh, menanyakan asalnya.\n3. Menyampaikan tujuan serta langkah kegiatan berkelompok.",
          alokasiWaktu: "15 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "Sintaks 1: Penentuan Proyek\n1. Guru membagi siswa ke dalam kelompok heterogen berisi 4 anak.\n2. Setiap kelompok diberikan kertas karton besar bertema 'Diorama Ekonomi Alam'.\n\nSintaks 2: Merancang Langkah-Langkah\n3. Siswa berdiskusi merancang gambar bentang pantai atau gunung serta menempelkan gambar profesi yang cocok (nelayan, petani, pemandu wisata).\n\nSintaks 3: Menyusun Jadwal\n4. Guru memberikan durasi waktu pengerjaan 25 menit.\n\nSintaks 4: Memonitor Perkembangan Proyek\n5. Guru berkeliling mendampingi siswa yang kesulitan menata visualisasi diorama kertas.\n\nSintaks 5: Menguji Hasil & Evaluasi\n6. Setiap kelompok mempresentasikan karya mini di depan kelas.\n7. Tanya jawab antar kelompok untuk memperkuat pemahaman jenis pekerjaan alam.",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Refleksi bersama mengenai apa yang dipelajari dan bagian paling disukai.\n2. Guru memberikan kuis cepat (3 pertanyaan pilihan ganda).\n3. Berdoa bersama dan menutup kelas dengan pesan moral untuk mencintai produk lokal.",
          alokasiWaktu: "15 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Tanya jawab lisan mengenai tempat wisata daerah pegunungan atau pantai sekitar.",
        formatif: "Lembar penilaian proyek kolaboratif membuat diorama bentang alam.",
        sumatif: "Kuis tertulis esai singkat tentang keterkaitan bentang alam dan ekonomi warga."
      },
      remedialAndPengayaan: {
        remedial: "Bimbingan terfokus dengan kartu visual asosiasi pekerjaan berkelompok.",
        pengayaan: "Tantangan membuat artikel atau cerita pendek satu halaman tentang petualangan di daerah peninggalan sejarah."
      },
      lkpd: "TUGAS LEMBAR KERJA (LKPD) - BENTANG ALAM & EKONOMI\n\nPetunjuk:\n1. Tuliskan nama kelompok Anda.\n2. Jodohkan bentang alam berikut dengan jenis pekerjaan yang paling sesuai dengan menarik garis:\n   - Dataran Tinggi  -----> Berkebun Teh / Petani Kopi\n   - Pantai         -----> Nelayan / Petani Garam\n   - Dataran Rendah -----> Pekerja Kantoran / Buruh Pabrik\n3. Tuliskan 2 peninggalan sejarah di daerah serta penjelasannya singkat!",
      rubrikPenilaian: "RUBRIK PENILAIAN IPS\n\n1. Penilaian Kognitif (Ketepatan korelasi bentang alam dan pekerjaan):\n- Sangat Baik (4): Mengorelasikan seluruh bentang alam dengan mata pencaharian secara akurat disertai alasan logis.\n- Baik (3): Menghubungkan semua dengan benar tapi alasan penulisan kurang lengkap.\n- Cukup (2): Ada 1-2 kesalahan dalam menjodohkan kolom.\n- Perlu bimbingan (1): Tidak mampu membedakan jenis pekerjaan wilayah pegunungan dan pantai.\n\n2. Penilaian Produk Proyek Diorama:\n- Desain rapi dan akademis: Skor 4 (Kreatif penuh)\n- Cukup rapi tapi kurang detail: Skor 2"
    }
  },
  "ppkn-3": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "3",
      fase: "B",
      mapel: "PPKn",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Peserta didik telah mengetahui bunyi teks 5 sila Pancasila.",
      profilPancasila: ["Beriman, Bertakwa Kepada Tuhan YME", "Gotong Royong", "Mandiri"],
      saranaPrasarana: "Poster besar Garuda Pancasila, Puzzle simbol Pancasila, LKPD bergambar.",
      targetPesertaDidik: "Regular/Khas (Umum)",
      modelPembelajaran: "Cooperative Learning tipe Jigsaw",
      tujuanPembelajaran: [
        "Peserta didik mampu melafalkan hubungan simbol sila Pancasila secara lancar.",
        "Peserta didik mampu melisankan 2 contoh tindakan jujur dan rukun dalam berteman."
      ],
      pemahamanBermakna: "Menerapkan nilai Pancasila membuat hidup kita rukun, damai, disayangi teman, dan menciptakan suasana sekolah yang menyenangkan.",
      pertanyaanPemantik: [
        "Mengapa di dada burung Garuda terdapat perisai bergambar bintang, pohon, sampai banteng?",
        "Bagaimana sikap kita jika teman yang berbeda agama hendak beribadah saat kita sedang asyik bermain?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Menyambut siswa dengan ceria, berdoa bersama, dan melantunkan lagu wajib nasional 'Garuda Pancasila' bersama.\n2. Apersepsi: Guru menanyakan ikon bintang di HP/buku, lalu mengaitkannya dengan simbol sila kesatu.\n3. Menjelaskan instruksi permainan menyusun puzzle gambar Pancasila.",
          alokasiWaktu: "15 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "Sintaks 1: Penyajian Informasi Dasar\n1. Guru memaparkan sekilas makna lima simbol Pancasila menggunakan media poster besar.\n\nSintaks 2: Pengelompokan & Penyelidikan\n2. Siswa dibagi menjadi beberapa kelompok (Kelompok Asal).\n3. Setiap anggota kelompok mendapat nomor tugas spesifik untuk mempelajari satu simbol tertentu di 'Kelompok Ahli'.\n4. Siswa di Kelompok Ahli berdiskusi memahami esensi simbol tersebut (Contoh: Rantai melambangkan persahabatan/kemanusiaan).\n\nSintaks 3: Berbagi Pengetahuan\n5. Siswa kembali ke kelompok asal masing-masing untuk saling mengajarkan simbol yang mereka kuasai.\n\nSintaks 4: Evaluasi & Unjuk Kerja\n6. Perwakilan kelompok secara acak diminta memimpin permainan lisan menebak simbol sila Pancasila.",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Menyimpulkan pentingnya hidup bersatu di atas keragaman.\n2. Pemberian kuis isian singkat (5 nomor) untuk melengkapi kalimat sila dan simbolnya.\n3. Berdoa penutup dipimpin siswa yang aktif hari ini.",
          alokasiWaktu: "15 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Tepuk Pancasila lisan mengecek memori sila-sila dasar.",
        formatif: "Penilaian kecakapan diskusi saat bertukar informasi di kelompok ahli.",
        sumatif: "Kuis tertulis memasangkan nama sila dengan simbol grafis yang sesuai."
      },
      remedialAndPengayaan: {
        remedial: "Peer tutoring dengan bantuan flashcards bergambar simbol sederhana.",
        pengayaan: "Tugas mendemonstrasikan tindakan tolong-menolong di depan kamera atau menulis cerita pendek aksi gotong royong."
      },
      lkpd: "LEMBAR KERJA PESERTA DIDIK (LKPD) - PUZZLE PANCASILA\n\nNama: ...................\nKelas: III\n\nTugas: \n1. Isilah titik-titik di bawah ini:\n   - Sila ke-1 bunyinya: Ketuhanan Yang Maha Esa. Simbolnya: ................\n   - Sila ke-2 bunyinya: .................................. Simbolnya: Rantai\n   - Sila ke-3 bunyinya: Persatuan Indonesia. Simbolnya: ................\n2. Tuliskan 1 tindakan positif di rumahmu yang mencerminkan sila ke-4!",
      rubrikPenilaian: "RUBRIK ASESMEN PPKN KELAS III\n\nKriteria Ketuntasan:\n- Skor 4 (Amat Baik): Menyebutkan kelima sila beserta simbolnya secara tanpa ragu dan tepat.\n- Skor 3 (Baik): Menyebutkan 4 sila dan simbolnya dengan akurat.\n- Skor 2 (Cukup): Hanya menyebutkan 2-3 sila dan simbol secara mandiri.\n- Skor 1 (Kurang): Perlu panduan penuh dari guru untuk mengeja simbol dasar."
    }
  },
  "pjok-6": {
    config: {
      ...DEFAULT_SCHOOL_CONFIG,
      kelas: "6",
      fase: "C",
      mapel: "PJOK",
      semester: "Ganjil"
    },
    data: {
      kompetensiAwal: "Peserta didik telah menguasai gerak dasar berlari cepat dan melempar sasaran statis menggunakan tangan kanan.",
      profilPancasila: ["Gotong Royong", "Mandiri", "Kreatif"],
      saranaPrasarana: "Bola kasti (atau bola tenis), pemukul kayu berpinggiran datar, mark pembatas stasiun, tiang hinggap, lapangan luas sekolah.",
      targetPesertaDidik: "Regular/Khas (Umum)",
      modelPembelajaran: "Direct Instruction (Pengajaran Langsung) & Game-Based Learning",
      tujuanPembelajaran: [
        "Peserta didik terampil melempar bola kasti dengan akurasi lemparan lurus mendatar setinggi dada pasangan.",
        "Peserta didik mampu memukul bola kasti yang dilempar dari lawan minimal sejauh 3 meter ke arah depan."
      ],
      pemahamanBermakna: "Keterampilan koordinasi tangan-mata dalam kasti melatih refleks kita, dan berolahraga aktif menjaga stamina serta menjalin kebersamaan yang sportif.",
      pertanyaanPemantik: [
        "Mengapa saat memukul bola kasti, pandangan mata kita sama sekali tidak boleh lepas dari laju bola?",
        "Bagaimana perasaanmu jika anggota tim mengoper bola kepadamu secara cepat dan kamu berhasil menangkapnya?"
      ],
      kegiatanPembelajaran: [
        {
          kategori: "Pendahuluan",
          deskripsi: "1. Guru mengumpulkan siswa di lapangan dalam barisan saf, mengecek kesehatan fisik lisan, memimpin doa kelancaran.\n2. Mengadakan permainan kecil pemanasan: 'Kucing dan Tikus' dengan mengoper bola elastis.\n3. Menjelaskan teknik keselamatan penggunaan kayu pemukul agar tidak mencederai teman sekeliling.",
          alokasiWaktu: "15 Menit"
        },
        {
          kategori: "Kegiatan Inti",
          deskripsi: "Sintaks 1: Penjelasan & Demonstrasi Teknis\n1. Guru beserta satu siswa mencontohkan cara memegang pemukul kasti dengan dua tangan lurus.\n2. Mendemonstrasikan 3 jenis lemparan (melambung, menyusur tanah, mendatar).\n\nSintaks 2: Latihan Terbimbing Berpasangan\n3. Siswa berpasangan sejauh 4 meter melakukan lempar-tangkap bola mendatar sebanyak 10 kali.\n4. Guru mengamati kelenturan pergelangan tangan siswa dan memberikan feedback perbaikan postural secara langsung.\n\nSintaks 3: Latihan Memukul Bola\n5. Guru melemparkan umpan bola pelan, siswa mencoba mengayunkan pemukul kasti mendatar.\n6. Setiap siswa mendapat kesempatan melakukan 5 kali pukulan bergantian.\n\nSintaks 4: Game Aplikasi Taktis\n7. Siswa dibagi dua tim melakukan koordinasi permainan bola kasti modifikasi dengan aturan sederhana (tiang aman dikurangi).",
          alokasiWaktu: "45 Menit"
        },
        {
          kategori: "Penutup",
          deskripsi: "1. Siswa berbaris rapi melakukan gerakan pendinginan otot (stretching relaksasi).\n2. Guru melakukan evaluasi teknis kesalahan pukulan umum (enggan mengayun penuh).\n3. Pengumuman tim pemenang yang paling sportif dan disiplin.\n4. Berdoa penutup kemudian siswa mencuci tangan untuk kembali belajar di kelas akademik.",
          alokasiWaktu: "15 Menit"
        }
      ],
      asesmen: {
        diagnostik: "Identifikasi fisik dasar (menanyakan apakah ada siswa yang cedera atau sedang asma/sakit jantung).",
        formatif: "Observasi gerakan lemparan mendatar (apakah melangkah dengan kaki berlawanan saat melempar).",
        sumatif: "Uji keterampilan praktik (skor akurasi lemparan mendatar ke dalam target lingkaran di dinding lapangan)."
      },
      remedialAndPengayaan: {
        remedial: "Latihan melempar bola tenis ukuran besar ke sasaran sedekat 2 meter secara berulang.",
        pengayaan: "Tantangan memicu laju bola lempar kasti dengan gaya memilin (spin-throw) atau berlatih kepemimpinan wasit."
      },
      lkpd: "LEMBAR KERJA AKTIVITAS KESEHATAN (LKPD) - BOLA KASTI\n\nNama Siswa: ....................\nKelas: VI\n\nTugas Pengamatan Mandiri:\n1. Tuliskan 3 posisi melempar bola kasti yang sudah dipraktikkan hari ini beserta gunanya!\n2. Gambar sketsa lapangan bola kasti sederhana lengkap dengan arah letak tiang pertolongan dan tiang hinggap!",
      rubrikPenilaian: "RUBRIK PENILAIAN COMBINASI GERAK BOLA KASTI\n\n1. Aspek Keterampilan Motorik (Melempar Mendatar):\n- Nilai 4 (Sangat Baik): Lemparan stabil mengarah lurus ke dada pasangan tanpa kesalahan gerak kaki.\n- Nilai 3 (Baik): Lemparan terarah ke pasangan namun lintasan bola melengkung.\n- Nilai 2 (Cukup): Bola sering keluar jangkauan pasangan atau lepas di udara.\n- Nilai 1 (Perlu Bimbingan): Tidak kuat melempar bola sampai jarak tujuan.\n\n2. Sikap Sportivitas & Gotong Royong:\n- Menghargai keputusan wasit dan menyemangati rekan satu tim: Skor 4 (Sangat Positif)\n- Sering memarahi rekan tim yang gagal menangkap bola: Skor 1"
    }
  }
};

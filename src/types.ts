export interface SchoolConfig {
  sekolah: string;
  npsn: string;
  alamat: string;
  guru: string;
  nip: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunAjaran: string;
  semester: "Ganjil" | "Genap";
  kelas: string;
  fase: "A" | "B" | "C";
  mapel: string;
}

export interface SyllabusItem {
  tujuanPembelajaran: string;
  materiPokok: string;
  kegiatanPembelajaran: string;
  profilPancasila: string;
  penilaian: string;
  alokasiWaktu: string;
  sumberBelajar: string;
}

export interface SyllabusData {
  capaianPembelajaran: string;
  alokasiWaktuTotal: string;
  tabelSilabus: SyllabusItem[];
}

export interface KegiatanPembelajaranItem {
  kategori: string; // "Pendahuluan" | "Kegiatan Inti" | "Penutup"
  deskripsi: string;
  alokasiWaktu: string;
}

export interface RPPData {
  kompetensiAwal: string;
  profilPancasila: string[];
  saranaPrasarana: string;
  targetPesertaDidik: string;
  modelPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  kegiatanPembelajaran: KegiatanPembelajaranItem[];
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
  remedialAndPengayaan: {
    remedial: string;
    pengayaan: string;
  };
  lkpd: string;
  rubrikPenilaian: string;
}

export interface GenericDocData {
  title: string;
  description: string;
  content: string;
  tables?: {
    headers: string[];
    rows: string[][];
  }[];
}

export interface SavedDocument {
  id: string;
  type: "syllabus" | "rpp" | "atp" | "cp" | "prota" | "promes" | "kktp" | "jurnal";
  title: string;
  subject: string;
  grade: string;
  semester: string;
  topic?: string;
  updatedAt: string;
  config: SchoolConfig;
  data: SyllabusData | RPPData | GenericDocData;
}

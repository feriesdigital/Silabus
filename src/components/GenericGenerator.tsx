import React, { useState, useEffect } from "react";
import { SchoolConfig, GenericDocData, SavedDocument } from "../types";
import { 
  Sparkles, Save, Download, Eye, Table as TableIcon, 
  Trash2, Plus, Edit3, ClipboardList, RefreshCw, FileSpreadsheet, FileText,
  CheckCircle2, ChevronDown, FolderOpen
} from "lucide-react";
import { exportGenericToDocx, exportGenericToXlsx, exportGenericToPdf } from "../utils/exportDocs";
import { RichTextEditor } from "./RichTextEditor";
import PreviewModal from "./PreviewModal";

interface GenericGeneratorProps {
  type: "atp" | "cp" | "prota" | "promes" | "kktp" | "jurnal";
  schoolConfig: SchoolConfig;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  onSaveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => void;
  savedDocs: SavedDocument[];
  darkMode: boolean;
}

export default function GenericGenerator({
  type,
  schoolConfig,
  onUpdateSchoolConfig,
  onSaveDocument,
  savedDocs,
  darkMode
}: GenericGeneratorProps) {

  const [activeDocId, setActiveDocId] = useState<string | undefined>(undefined);
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [topic, setTopic] = useState("Kombinasi Gerak Dasar Lokomotor, Non-Lokomotor dan Alat Manipulatif");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showGuide, setShowGuide] = useState(true);

  // Real-time Save Status Indicators
  const [saveStatus, setSaveStatus] = useState<"clean" | "saving" | "saved">("clean");
  const [isInitialMount, setIsInitialMount] = useState(true);

  const [docData, setDocData] = useState<GenericDocData>({
    title: "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)",
    description: "Panduan evaluasi ketercapaian kompetensi pembelajaran siswa di kelas.",
    content: "Penilaian dilakukan secara holistik mencakup aspek pemahaman konsep, pengerjaan tugas mandiri, serta karakter profil pancasila bergotong royong di sela simulasi kelas.",
    tables: [
      {
        headers: ["Nama Siswa", "Kriteria Pemahaman", "Keterampilan Maket", "Ketuntasan", "Rencana Tindak Lanjut"],
        rows: [
          ["Ahmad Fauzi", "Sangat Baik (92)", "Baik (85)", "Tuntas", "Pengayaan materi lanjutan"],
          ["Clara Amelia", "Cukup (72)", "Perlu Bimbingan (60)", "Belum Tuntas", "Remedial asistensi sore hari"]
        ]
      }
    ]
  });

  // Debounced auto save whenever form contents or configs change
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    setSaveStatus("saving");
    const saveTimer = setTimeout(() => {
      const targetId = activeDocId || "generic_" + Math.random().toString(36).substr(2, 9);
      if (!activeDocId) {
        setActiveDocId(targetId);
      }
      onSaveDocument({
        id: targetId,
        type: type,
        title: `${type.toUpperCase()} - ${schoolConfig.mapel} Kelas ${schoolConfig.kelas} - ${topic}`,
        subject: schoolConfig.mapel,
        grade: schoolConfig.kelas,
        semester: schoolConfig.semester,
        topic: topic,
        config: schoolConfig,
        data: docData
      });
      setSaveStatus("saved");
    }, 1200);

    return () => clearTimeout(saveTimer);
  }, [topic, customInstructions, docData, schoolConfig, type]);

  // Responsive design helper to swap between table and card forms on touch screens
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Keep screen-width listener active
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode("cards");
      } else {
        setViewMode("table");
      }
    };
    handleResize(); // trigger initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get localized terms
  const titleMap = {
    atp: "Alur Tujuan Pembelajaran (ATP)",
    cp: "Analisis Capaian Pembelajaran (CP)",
    prota: "Program Tahunan (PROTA) Kelas SD",
    promes: "Program Semester (PROMES) Kelas SD",
    kktp: "KKTP (Kriteria Ketuntasan)",
    jurnal: "Jurnal Harian Mengajar Guru"
  };

  const getDocTitle = () => titleMap[type] || "Administrasi Pembelajaran";

  // Auto-generate some default placeholders when switching 'type' on client first load
  useEffect(() => {
    setActiveDocId(undefined);
    setErrorMsg("");
    
    // Check if there is an existing saved document of this type to load
    const matches = savedDocs.filter(d => d.type === type);
    if (matches.length > 0) {
      handleLoadSaved(matches[0]);
      return;
    }

    // fallback default mock structures
    if (type === "atp") {
      setDocData({
        title: "Alur Tujuan Pembelajaran (ATP)",
        description: "Rencana perancangan fase A/B/C dalam rincian alur kompetensi.",
        content: "Alur diatur linear vertikal dengan memperhatikan prasyarat kognitif dasar sebelum melompati materi tingkat lanjut.",
        tables: [{
          headers: ["Tujuan Pembelajaran", "Uraian Capaian", "Asesmen Sumatif", "Alokasi Waktu"],
          rows: [
            ["Membedakan bangun datar", "Siswa mengetahui sisi, sudut datar", "Tes Gambar", "6 JP"],
            ["Menyusun pola bangun", "Siswa menata pola lantai tegel", "Tugas Portfolio", "6 JP"]
          ]
        }]
      });
    } else if (type === "cp") {
      setDocData({
        title: "Analisis Capaian Pembelajaran (CP)",
        description: "Pembedahan elemen CP kurikulum merdeka ke sub-elemen kompetensi.",
        content: "Analisis bertujuan mempermudah penuangan ide KBM harian ke Modul Ajar terstruktur rincian.",
        tables: [{
          headers: ["Elemen Merdeka", "Kalimat CP Asli", "Kompetensi Utama", "Materi Pendukung"],
          rows: [
            ["Pancasila", "Siswa mengenal simbol dan arti sila", "Mengidentifikasi, Menerapkan", "Lambang negara Garuda Pancasila"],
            ["UUD 1945", "Siswa mengerti aturan di keluarga", "Menjelaskan, Mematuhi", "Aturan kebersamaan sore hari"]
          ]
        }]
      });
    } else if (type === "prota") {
      setDocData({
        title: "Program Tahunan (PROTA)",
        description: "Siklus pembagian materi pelajaran sepanjang satu tahun pelajaran kurikulum berjalan.",
        content: "Program disesuaikan kalender akademik dinas daerah setempat, dikurangi jatah libur nasional resmi.",
        tables: [{
          headers: ["No", "Semester / Bab Utama", "Cakupan Materi", "Alokasi Waktu (JP)"],
          rows: [
            ["1", "Semester I / Bab 1: Bilangan Cacah", "Membaca, menulis, nilai tempat", "16 JP"],
            ["2", "Semester I / Bab 2: Geometri", "Pengenalan sisi, rusuk kubus", "12 JP"],
            ["3", "Semester II / Bab 3: Pengukuran", "Satuan kilogram, liter praktis", "18 JP"]
          ]
        }]
      });
    } else if (type === "promes") {
      setDocData({
        title: "Program Semester (PROMES)",
        description: "Rincian bulanan dan mingguan pelaksanaan jam mengajar guru semester berjalan.",
        content: "Angka menyatakan jumlah Jam Pelajaran (JP) yang dituangkan di sela pekan KBM aktif.",
        tables: [{
          headers: ["No", "Uraian Tujuan", "Alokasi JP", "Juli (Wk)", "Agustus (Wk)", "September (Wk)"],
          rows: [
            ["1", "TP 1.1 Nilai tempat cacah", "6 JP", "3 JP (Wk 1)", "3 JP (Wk 2)", "-"],
            ["2", "TP 1.2 Membandingkan angka", "6 JP", "-", "3 JP (Wk 3)", "3 JP (Wk 4)"]
          ]
        }]
      });
    } else if (type === "jurnal") {
      setDocData({
        title: "Jurnal Harian Mengajar Guru",
        description: "Catatan riwayat kegiatan kelas, materi sampaikan, kehadiran, and hambatan belajar harian.",
        content: "Jurnal wajib diisi secara berkala sesudah jam bel sekolah berbunyi.",
        tables: [{
          headers: ["Hari / Tanggal", "Materi Pokok Penyampaian", "Kehadiran Siswa", "Hambatan / Tindakan"],
          rows: [
            ["Senin, 01 Juni", "Simulasi siklus air menggunakan botol", "31/32 (Ahmad Sakit)", "Siswa antusias, es batu sempat meleleh sebelum demo"],
            ["Rabu, 03 Juni", "Praktek lembar LKPD menghubungkan garis", "32/32 (Lengkap)", "Semua lancar tuntas tepat waktu"]
          ]
        }]
      });
    }
  }, [type]);

  const handleLoadSaved = (doc: SavedDocument) => {
    setActiveDocId(doc.id);
    onUpdateSchoolConfig(doc.config);
    setDocData(doc.data as GenericDocData);
    if (doc.topic) {
      setTopic(doc.topic);
    } else if (doc.title && doc.title.includes(" - ")) {
      setTopic(doc.title.split(" - ").pop() || "");
    }
    setSaveStatus("saved");
  };

  const handleGenerateAI = async () => {
    if (!topic.trim() || !schoolConfig.mapel.trim() || !schoolConfig.kelas.trim()) {
      setErrorMsg("Harap periksa kembali: Kolom Mapel, Kelas, dan Pokok Materi wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          subject: schoolConfig.mapel,
          grade: schoolConfig.kelas,
          semester: schoolConfig.semester,
          phase: schoolConfig.fase,
          topic,
          customInstructions,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghasilkan dokumen dari AI.");
      }

      setDocData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi AI Server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    onSaveDocument({
      id: activeDocId,
      type,
      title: `${getDocTitle()} - Kelas ${schoolConfig.kelas} - ${schoolConfig.mapel}`,
      subject: schoolConfig.mapel,
      grade: schoolConfig.kelas,
      semester: schoolConfig.semester,
      topic: topic,
      config: schoolConfig,
      data: docData
    });
    setSaveStatus("saved");
    alert("Dokumen berhasil disimpan ke riwayat!");
  };

  const handleUpdateTableCell = (tableIdx: number, rowIdx: number, cellIdx: number, value: string) => {
    if (!docData.tables) return;
    const updatedTables = [...docData.tables];
    updatedTables[tableIdx].rows[rowIdx][cellIdx] = value;
    setDocData({ ...docData, tables: updatedTables });
  };

  const handleAddTableRow = (tableIdx: number) => {
    if (!docData.tables) return;
    const updatedTables = [...docData.tables];
    const columnsCount = updatedTables[tableIdx].headers.length;
    updatedTables[tableIdx].rows.push(Array(columnsCount).fill("Baris baru"));
    setDocData({ ...docData, tables: updatedTables });
  };

  const handleRemoveTableRow = (tableIdx: number, rowIdx: number) => {
    if (!docData.tables) return;
    const updatedTables = [...docData.tables];
    updatedTables[tableIdx].rows = updatedTables[tableIdx].rows.filter((_, idx) => idx !== rowIdx);
    setDocData({ ...docData, tables: updatedTables });
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-slate-700/10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] block">{getDocTitle()}</h2>
            
            {/* Real-time Save Status Indicators */}
            {saveStatus === "saving" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                <RefreshCw size={9} className="animate-spin" />
                <span>Sedang menyimpan...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse font-bold">
                <CheckCircle2 size={9} />
                <span>Draft tersimpan</span>
              </span>
            )}
          </div>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500 font-medium"}`}>
            Sistem penyusunan kelengkapan administrasi mengajar Sekolah Dasar otomatis.
          </p>
        </div>

        {/* Load dropdown */}
        {savedDocs.filter(d => d.type === type).length > 0 && (
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">Muat Dokumen:</span>
            
            <div className="relative w-full sm:w-64">
              <button
                type="button"
                onClick={() => setIsDraftMenuOpen(!isDraftMenuOpen)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-tight border text-left cursor-pointer transition-all duration-150 ${
                  darkMode 
                    ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-750 focus:border-[#FBBF24]" 
                    : "bg-white border-[#014AAD]/10 text-slate-700 hover:bg-slate-50 shadow-sm focus:border-[#014AAD]"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <FolderOpen size={13} className="text-[#014AAD] dark:text-[#FBBF24] shrink-0" />
                  <span className="truncate">
                    {activeDocId 
                      ? savedDocs.find(d => d.id === activeDocId)?.title || "Draft Aktif"
                      : "-- Pilih Tersimpan --"}
                  </span>
                </span>
                <ChevronDown size={13} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isDraftMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isDraftMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDraftMenuOpen(false)} 
                  />
                  
                  <div className={`absolute right-0 top-full mt-1.5 w-full sm:w-80 max-h-64 overflow-y-auto rounded-xl border p-1 shadow-xl z-50 animate-fade-in ${
                    darkMode 
                      ? "bg-[#0f1d3a] border-slate-800 text-white" 
                      : "bg-white border-slate-100 text-slate-800"
                  }`}>
                    <div className="px-2 py-1.5 border-b border-slate-500/10 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Riwayat Dokumen ({savedDocs.filter(d => d.type === type).length})</span>
                    </div>
                    
                    <div className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDocId(undefined);
                          setIsDraftMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-tight flex items-center gap-2 transition-colors ${
                          !activeDocId
                            ? "bg-[#014AAD]/10 text-[#014AAD] dark:bg-amber-500/10 dark:text-amber-400"
                            : darkMode
                              ? "hover:bg-slate-800 text-slate-300"
                              : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Mulai Baru (Kostumisasi)</span>
                      </button>

                      {savedDocs.filter(d => d.type === type).map((doc) => {
                        const isActive = doc.id === activeDocId;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              handleLoadSaved(doc);
                              setIsDraftMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex flex-col gap-0.5 transition-colors ${
                              isActive
                                ? "bg-[#014AAD] text-white"
                                : darkMode
                                  ? "hover:bg-slate-800/80 text-slate-200"
                                  : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 w-full">
                              <span className="truncate">{doc.title}</span>
                              {isActive && <CheckCircle2 size={11} className="shrink-0" />}
                            </div>
                            <div className={`text-[8px] uppercase tracking-wide font-extrabold ${isActive ? "text-white/70" : "text-slate-400"}`}>
                              {doc.subject} • Kelas {doc.grade} • Sem. {doc.semester}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Configurations Form (Col 1) */}
        <div className="space-y-4 lg:col-span-1">
          {/* Collapsible Guidance Panel for New Teachers */}
          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            darkMode 
              ? "bg-[#0f1d3a] border-slate-700/55" 
              : "bg-amber-500/5 border-amber-500/20 text-neutral-800"
          }`}>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between font-black uppercase text-xs tracking-wider text-amber-600 dark:text-amber-400 cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-left">
                <Sparkles size={13} className="animate-pulse shrink-0" />
                <span>Asisten Guru Baru: Langkah AI Akurat</span>
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                {showGuide ? "Sembunyikan" : "Buka Tips"}
              </span>
            </button>
            
            {showGuide && (
              <div className="mt-3.5 space-y-3.5 pt-3 border-t border-dashed border-amber-500/20 text-xs text-slate-600 dark:text-slate-300">
                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">1</span>
                    Sesuaikan Administrasi
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Pilih Mapel, Kelas, dan Semester dengan tepat agar keselarasan format kurikulum dengan struktur lainnya tetap sinkron.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">2</span>
                    Buat Topik Fokus
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Gunakan pokok bahasan atau bab yang spesifik, contoh: <span className="italic font-semibold text-[#014AAD] dark:text-blue-300">"Gerak Dasar Lokomotor"</span> untuk hasil dokumen yang padat dan akurat.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">3</span>
                    Tambahkan Detail Penilaian
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Sebutkan instruksi khusus seperti format tabel yang diinginkan, kriteria skala nilai, atau target pencapaian guru untuk murid.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm accent-shadow ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10"
          } space-y-4`}>
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24]">Konfigurasi Target</h3>

          <div className="grid grid-cols-1 gap-3.5 text-xs text-slate-400">
            <div className="space-y-1">
              <label className="font-bold">Mata Pelajaran (Mapel)</label>
              <select 
                value={schoolConfig.mapel}
                onChange={(e) => onUpdateSchoolConfig({...schoolConfig, mapel: e.target.value})}
                className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
                  !schoolConfig.mapel.trim() ? "border-red-500 ring-1 ring-red-500" : ""
                } ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <option value="">-- Pilih Mapel --</option>
                {["Bahasa Indonesia", "Matematika", "IPA", "IPS", "PPKn", "PJOK", "Seni Budaya", "Pendidikan Agama"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold">Kelas</label>
                <select 
                  value={schoolConfig.kelas}
                  onChange={(e) => onUpdateSchoolConfig({...schoolConfig, kelas: e.target.value})}
                  className={`w-full p-2.5 rounded-xl border focus:border-blue-500 ${
                    !schoolConfig.kelas.trim() ? "border-red-500 ring-1 ring-red-500" : ""
                  } ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="">-- Pilih --</option>
                  {["1", "2", "3", "4", "5", "6"].map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Semester</label>
                <select 
                  value={schoolConfig.semester}
                  onChange={(e) => onUpdateSchoolConfig({...schoolConfig, semester: e.target.value as "Ganjil" | "Genap"})}
                  className={`w-full p-2.5 rounded-xl border focus:border-blue-500 ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold flex items-center justify-between">
                <span>Materi Pokok / Bahasan Utama</span>
                <span className="text-[9px] text-[#014AAD] dark:text-blue-400 font-extrabold bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Penting</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
                  !topic.trim() ? "border-red-500 ring-1 ring-red-500" : ""
                } ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Tips: Tulis tema secara spesifik (cth: "Pengenalan Ekosistem Hutan") untuk hasil dokumen yang maksimal.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-bold flex items-center justify-between">
                <span>Permintaan Tambahan (AI)</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Kreatif</span>
              </label>
              <textarea
                placeholder="Misal: Tambahkan rubrik skala bertingkat dari angka 1 hingga 4..."
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:border-blue-500 focus:outline-none ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Cth: "Sertakan rentang kriteria ketuntasan 0-100" atau "Tambahkan deskripsi mingguan".
              </p>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs bg-[#014AAD] hover:bg-[#00337A] text-white hover:shadow-lg hover:shadow-[#014AAD]/20 cursor-pointer transition disabled:opacity-50 active:scale-98 border-transparent"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Meramu Form AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#FBBF24]" />
                  <span>Hasilkan Dokumen AI</span>
                </>
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Live A4 Sheet Preview (Cols 2-3) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-500/5 p-3 rounded-xl border border-dashed border-slate-500/20 text-xs">
            <span className="font-black text-[#014AAD] dark:text-[#FBBF24] uppercase tracking-wider flex items-center gap-1.5">
              <TableIcon size={14} /> Kertas Guru
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-1.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Eye size={12} className="stroke-[2.5]" />
                <span>Pratinjau</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:opacity-95 cursor-pointer"
              >
                <Save size={12} /> Simpan Draft
              </button>
              <button
                onClick={() => exportGenericToDocx(schoolConfig, getDocTitle(), docData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Download size={12} /> Word (DOCX)
              </button>
              <button
                onClick={() => exportGenericToXlsx(schoolConfig, getDocTitle(), docData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-[#10b981] cursor-pointer"
              >
                <FileSpreadsheet size={12} /> Excel (XLSX)
              </button>
              <button
                onClick={() => exportGenericToPdf(schoolConfig, getDocTitle(), docData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                <FileText size={12} /> PDF Dokumen
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-blue-500/20 bg-slate-500/5 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin mx-auto"></div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-blue-500">AI sedang memproses standardisasi dokumen {getDocTitle()}...</p>
                <p className="text-[11px] text-slate-400">Merakit narasi akademik kurikulum indonesia resmi Sekolah Dasar.</p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border space-y-5 shadow-sm text-xs font-sans leading-relaxed ${
              darkMode ? "bg-slate-900 border-[#014AAD]/20 text-slate-100" : "bg-white border-[#014AAD]/10 text-slate-800"
            }`}>
              
              <div className="text-center space-y-1 border-b pb-4 border-slate-400/20">
                <h4 className="text-sm font-bold uppercase">{getDocTitle()} SD</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{schoolConfig.sekolah}</p>
              </div>

              {/* Profiles */}
              <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-500/5 p-3 rounded-lg border border-slate-700/5">
                <p><span className="font-bold inline-block w-24 text-slate-400">Guru Kelas</span>: {schoolConfig.guru || "Budi"}</p>
                <p><span className="font-bold inline-block w-24 text-slate-400">Tahun Ajaran</span>: {schoolConfig.tahunAjaran || "2025/2026"}</p>
                <p><span className="font-bold inline-block w-24 text-slate-400">Mata Pelajaran</span>: {schoolConfig.mapel || "Matematika"}</p>
                <p><span className="font-bold inline-block w-24 text-slate-400">Kelas / Fase</span>: Kelas {schoolConfig.kelas || "4"} / Fase {schoolConfig.fase || "B"}</p>
              </div>

              {/* Description block */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">Uraian / Deskripsi Konsep</label>
                <input
                  type="text"
                  value={docData.description}
                  onChange={(e) => setDocData({ ...docData, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              {/* Narratives Content editable */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">Analisis & Landasan Akademik</label>
                <RichTextEditor
                  value={docData.content}
                  onChange={(val) => setDocData({ ...docData, content: val })}
                  darkMode={darkMode}
                  className="font-mono text-[11px] leading-relaxed max-w-full"
                />
              </div>

              {/* Tables editable if exist */}
              {docData.tables && docData.tables.map((tableData, tableIdx) => (
                <div key={tableIdx} className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2 border-slate-500/10">
                    <h5 className="font-bold text-[#014AAD] dark:text-[#FBBF24] uppercase">TABEL RANCANGAN ADMINISTRASI ({type.toUpperCase()})</h5>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-slate-500/10 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                          viewMode === "table"
                            ? "bg-[#014AAD] text-white shadow-md shadow-[#014AAD]/20"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Tabel
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("cards")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                          viewMode === "cards"
                            ? "bg-[#014AAD] text-white shadow-md shadow-[#014AAD]/20"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Kartu
                      </button>
                    </div>
                  </div>
                  
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-500/20">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className={`border-b ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                            {tableData.headers.map((h, i) => (
                              <th key={i} className="p-2 border-r border-slate-500/20 font-bold">{h}</th>
                            ))}
                            <th className="p-2 text-center w-8 font-bold">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-500/15">
                          {tableData.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="align-top hover:bg-slate-500/5">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="p-1 border-r border-slate-500/20">
                                  <RichTextEditor
                                    value={cell}
                                    onChange={(val) => handleUpdateTableCell(tableIdx, rowIdx, cellIdx, val)}
                                    darkMode={darkMode}
                                    hideToolbar={true}
                                    className="text-[11px]"
                                  />
                                </td>
                              ))}
                              <td className="p-1.5 text-center">
                                <button
                                  onClick={() => handleRemoveTableRow(tableIdx, rowIdx)}
                                  className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tableData.rows.map((row, rowIdx) => (
                        <div 
                          key={rowIdx} 
                          className={`p-4 rounded-xl border space-y-3 transition group relative ${
                            darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between border-b pb-2 border-slate-400/20">
                            <span className="font-extrabold text-xs text-blue-500">Materi Pokok / Baris #{rowIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTableRow(tableIdx, rowIdx)}
                              className="p-1 px-2.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/25 cursor-pointer text-[10px] font-bold flex items-center gap-1 transition"
                              title="Hapus Baris"
                            >
                              <Trash2 size={11} /> Hapus Baris
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            {row.map((cell, cellIdx) => (
                              <div key={cellIdx} className="space-y-1">
                                <label className="font-bold text-slate-400 uppercase text-[10px] tracking-wide">
                                  {tableData.headers[cellIdx] || `Kolom ${cellIdx + 1}`}
                                </label>
                                <RichTextEditor
                                  value={cell}
                                  onChange={(val) => handleUpdateTableCell(tableIdx, rowIdx, cellIdx, val)}
                                  darkMode={darkMode}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddTableRow(tableIdx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-blue-500/40 text-blue-600 text-[10px] font-bold hover:bg-blue-500/10 cursor-pointer"
                  >
                    <Plus size={12} /> Tambah Baris Baru
                  </button>

                </div>
              ))}

              {/* Signature block */}
              <div className="pt-6 border-t border-dashed border-slate-700/10 flex justify-between font-semibold text-slate-400">
                <div className="space-y-12">
                  <p>Mengetahui,</p>
                  <p className="font-bold underline text-slate-300">{schoolConfig.kepalaSekolah}</p>
                </div>
                <div className="space-y-12 text-right">
                  <p>Pendidik Kelas,</p>
                  <p className="font-bold underline text-slate-300">{schoolConfig.guru}</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Formal A4 Document Print Preview Modal Pop-up */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        type={type}
        title={getDocTitle()}
        schoolConfig={schoolConfig}
        data={docData}
        darkMode={darkMode}
      />

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { SchoolConfig, RPPData, SavedDocument, KegiatanPembelajaranItem } from "../types";
import { 
  Sparkles, Save, Download, Eye, Plus, Trash2, 
  AlertCircle, RefreshCw, FileSpreadsheet, LayoutList, ClipboardCheck, FileText,
  Maximize2, Minimize2, CheckCircle2, ChevronDown, FolderOpen
} from "lucide-react";
import { exportRPPToDocx, exportRPPToXlsx, exportRPPToPdf } from "../utils/exportDocs";
import { RichTextEditor } from "./RichTextEditor";
import PreviewModal from "./PreviewModal";

interface RPPGeneratorProps {
  schoolConfig: SchoolConfig;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  onSaveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => void;
  savedRPPs: SavedDocument[];
  darkMode: boolean;
  focusMode?: boolean;
  setFocusMode?: (mode: boolean) => void;
}

export default function RPPGenerator({
  schoolConfig,
  onUpdateSchoolConfig,
  onSaveDocument,
  savedRPPs,
  darkMode,
  focusMode = false,
  setFocusMode
}: RPPGeneratorProps) {

  const [activeDocId, setActiveDocId] = useState<string | undefined>(undefined);
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // UI form parameters
  const [topic, setTopic] = useState("Siklus Air dan Kehidupan di Bumi");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showGuide, setShowGuide] = useState(true);

  // Real-time Save Status Indicators
  const [saveStatus, setSaveStatus] = useState<"clean" | "saving" | "saved">("clean");
  const [isInitialMount, setIsInitialMount] = useState(true);

  // RPP Loaded state
  const [rppData, setRppData] = useState<RPPData>({
    kompetensiAwal: "Siswa telah mengetahui adanya zat cair di permukaan bumi dan konsep dasar evaporasi.",
    profilPancasila: ["Bernalar Kritis", "Kreatif", "Gotong Royong"],
    saranaPrasarana: "LCD Proyektor, Gelas kimia, kompor listrik, es batu, wadah kaca.",
    targetPesertaDidik: "Umum/Reguler (32 Siswa)",
    modelPembelajaran: "Project Based Learning (PjBL)",
    tujuanPembelajaran: [
      "Mengidentifikasi tahapan evaporasi, kondensasi, dan presipitasi pada siklus air.",
      "Menyajikan hasil karya visual bagan siklus air bumi dengan keterangan lengkap."
    ],
    pemahamanBermakna: "Air di bumi sifatnya kekal dan senantiasa berputar melalui proses alam yang harus dijaga dari kontaminasi zat polutan.",
    pertanyaanPemantik: [
      "Mengapa jemuran pakaian basah bisa kering saat ditaruh di bawah sinar matahari?",
      "Darimana air hujan terbentuk dan apakah air bumi bisa habis?"
    ],
    kegiatanPembelajaran: [
      {
        kategori: "Pendahuluan",
        deskripsi: "1. Guru mengucapkan salam pembuka, menyanyikan lagu Indonesia Raya bersama.\n2. Guru memegang es batu di dalam wadah transparan, meminta siswa mengamati butiran uap air di sekitar dinding kaca (apersepsi).\n3. Menyampaikan tujuan pokok kegiatan modul hari ini.",
        alokasiWaktu: "15 Menit"
      },
      {
        kategori: "Kegiatan Inti",
        deskripsi: "Sintaks 1: Pertanyaan Mendasar\n- Guru menunjukkan video dampak deforestasi terhadap kekeringan waduk air. Bertanya bagaimana siklus air bermula.\n\nSintaks 2: Mendesain Perencanaan Proyek\n- Siswa berkumpul di kelompok kecil. Menyepakati tugas pembuatan maket siklus air mini dan wadah hias.\n\nSintaks 3: Menyusun Jadwal Pembuatan\n- Siswa meriset alur pengerjaan maket dari buku siswa.\n\nSintaks 4: Memonitor Keaktifan & Perkembangan\n- Siswa mencocokkan desain maket dengan sketsa.",
        alokasiWaktu: "45 Menit"
      },
      {
        kategori: "Penutup",
        deskripsi: "1. Tiap kelompok menyajikan hasil maket air.\n2. Guru memberikan kuis feedback esai singkat.\n3. Doa penutup dan kelas berakhir rapi.",
        alokasiWaktu: "10 Menit"
      }
    ],
    asesmen: {
      diagnostik: "Tanya jawab pemantik verbal di awal bab.",
      formatif: "Pengamatan kinerja kolaborasi kelompok di kelas.",
      sumatif: "Tes esai deskripsi tahapan siklus air."
    },
    remedialAndPengayaan: {
      remedial: "Menjelaskan bab dasar siklus air menggunakan kartu ilustrasi.",
      pengayaan: "Membuat mini kliping artikel dampak polusi udara ke siklus asam hujan."
    },
    lkpd: "LEMBAR KERJA PESERTA DIDIK (LKPD)\nMateri: Siklus Presipitasi Air\n\nLangkah Kegiatan:\n1. Siapkan mangkok air panas dan letakkan piring kecil di atasnya berisi es batu.\n2. Amati tetesan air yang menetes di dasar piring.\n3. Jelaskan hubungan peristiwa ini dengan terbentuknya Air Hujan!",
    rubrikPenilaian: "Kriteria Rubrik:\n1. Kognitif: Ketepatan bagan (Skor 1-4)\n2. Sikap: Bernalar kritis & gotong royong (Skor 1-4)"
  });

  // Debounced auto save whenever form contents or configs change
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    setSaveStatus("saving");
    const saveTimer = setTimeout(() => {
      const targetId = activeDocId || "rpp_" + Math.random().toString(36).substr(2, 9);
      if (!activeDocId) {
        setActiveDocId(targetId);
      }
      onSaveDocument({
        id: targetId,
        type: "rpp",
        title: `RPP/Modul ${schoolConfig.mapel} Kelas ${schoolConfig.kelas} - ${topic}`,
        subject: schoolConfig.mapel,
        grade: schoolConfig.kelas,
        semester: schoolConfig.semester,
        topic: topic,
        config: schoolConfig,
        data: rppData
      });
      setSaveStatus("saved");
    }, 1200);

    return () => clearTimeout(saveTimer);
  }, [topic, customInstructions, rppData, schoolConfig]);

  const handleLoadSaved = (doc: SavedDocument) => {
    setActiveDocId(doc.id);
    onUpdateSchoolConfig(doc.config);
    setRppData(doc.data as RPPData);
    if (doc.topic) {
      setTopic(doc.topic);
    } else if (doc.title && doc.title.includes(" - ")) {
      setTopic(doc.title.split(" - ").pop() || "");
    }
    setSaveStatus("saved");
  };

  // Auto-load template or latest document when the config mapped parameters match
  useEffect(() => {
    if (!activeDocId && savedRPPs.length > 0) {
      const sortedMatching = [...savedRPPs]
        .filter(doc => 
          doc.config.mapel.toLowerCase() === schoolConfig.mapel.toLowerCase() && 
          doc.config.kelas === schoolConfig.kelas && 
          doc.config.semester === schoolConfig.semester
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      if (sortedMatching.length > 0) {
        handleLoadSaved(sortedMatching[0]);
      }
    }
  }, [schoolConfig.mapel, schoolConfig.kelas, schoolConfig.semester, savedRPPs, activeDocId]);

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
          type: "rpp",
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
        throw new Error(data.error || "Gagal menghasilkan RPP dari AI.");
      }

      setRppData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    onSaveDocument({
      id: activeDocId,
      type: "rpp",
      title: `RPP/Modul ${schoolConfig.mapel} Kelas ${schoolConfig.kelas} - ${topic}`,
      subject: schoolConfig.mapel,
      grade: schoolConfig.kelas,
      semester: schoolConfig.semester,
      topic: topic,
      config: schoolConfig,
      data: rppData
    });
    setSaveStatus("saved");
    alert("Draft RPP / Modul Ajar berhasil disimpan!");
  };

  const handleAddTP = () => {
    setRppData({ ...rppData, tujuanPembelajaran: [...rppData.tujuanPembelajaran, "Tujuan Pembelajaran tambahan..."] });
  };

  const handleAddPemantik = () => {
    setRppData({ ...rppData, pertanyaanPemantik: [...rppData.pertanyaanPemantik, "Apakah kalian tahu bahwa...?"] });
  };

  const handleUpdateStep = (index: number, key: keyof KegiatanPembelajaranItem, value: string) => {
    const updated = [...rppData.kegiatanPembelajaran];
    updated[index] = { ...updated[index], [key]: value };
    setRppData({ ...rppData, kegiatanPembelajaran: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-slate-700/10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] block">RPP & Modul Ajar Generator</h2>
            
            {/* Real-time Save Status Indicators */}
            {saveStatus === "saving" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RefreshCw size={9} className="animate-spin" />
                <span>Sedang menyimpan...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse">
                <CheckCircle2 size={9} />
                <span>Draft tersimpan</span>
              </span>
            )}
          </div>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500 font-medium"}`}>
            Tegakkan perencanaan pembelajaran harian, langkah interaktif, asesmen diagnostik/sumatif, serta rubrik evaluasi Indonesia yang siap dicetak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Focus Mode Custom Toggle Button */}
          {setFocusMode && (
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all duration-150 ${
                focusMode
                  ? "bg-amber-500 text-slate-900 border-amber-500 shadow-md"
                  : darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              }`}
            >
              {focusMode ? (
                <>
                  <Minimize2 size={12} className="stroke-[2.5]" />
                  <span>Keluar Mode Fokus</span>
                </>
              ) : (
                <>
                  <Maximize2 size={12} className="stroke-[2.5]" />
                  <span>Mode Fokus</span>
                </>
              )}
            </button>
          )}

          {/* Load dropdown */}
          {savedRPPs.length > 0 && (
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">Muat Draft:</span>
              
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
                        ? savedRPPs.find(d => d.id === activeDocId)?.title || "Draft Aktif"
                        : "-- Pilih Draft RPP --"}
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
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Riwayat Draft RPP ({savedRPPs.length})</span>
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

                        {savedRPPs.map((doc) => {
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
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2 border border-red-500/20 text-xs font-semibold">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Param Panel */}
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
                    Format kurikulum rincian, seperti Kompetensi Awal, Profil Pancasila, dan Asesmen akan diselaraskan otomatis.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">2</span>
                    Buat Materi Lebih Fokus
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Lebih baik menulis tema atau sub-bab spesifik, contoh: <span className="italic font-semibold text-[#014AAD] dark:text-blue-300">"Siklus Air & Kehidupan"</span> daripada umum seperti "Ilmu Pengetahuan Alam".
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">3</span>
                    Sebutkan Media di Kelas
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Masukkan model belajar pilihan (seperti *PjBL* atau *Inkuiri*) dan media dalam kelas agar draf langkah terinci lengkap.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm accent-shadow ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10"
          } space-y-4`}>
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24]">Parameter Modul</h3>
          
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
                placeholder="Misal: Magnet, Cerita Pendek"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Tips: Tulis materi pokok dengan spesifik (cth: "Eksperimen Gaya Magnet") untuk hasil RPP yang lebih mendalam.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Instruksi Opsional AI
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Kreatif</span>
              </label>
              <textarea
                placeholder="Misal: Sediakan materi eksperimen balon gas, fokuskan pada pengerjaan gotong royong..."
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Cth: "Fokus kurikulum merdeka dengan kegiatan demonstrasi berkelompok" atau "Gunakan alat konkrit di kelas".
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
                  <span>Meramu RPP Kemendikbud...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#FBBF24]" />
                  <span>Hasilkan RPP dengan AI</span>
                </>
              )}
            </button>

          </div>
        </div>
        </div>

        {/* Live Preview / Editable Form section */}
        <div className="lg:col-span-2 space-y-4 text-xs font-sans">
          
          {/* Output Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-500/5 p-3 rounded-xl border border-dashed border-slate-500/20">
            <span className="font-black text-[#014AAD] dark:text-[#FBBF24] uppercase tracking-wider flex items-center gap-1.5">
              <LayoutList size={14} /> PRATINJAU RPP & LAMPIRAN PENILAIAN
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
                onClick={() => exportRPPToDocx(schoolConfig, rppData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Download size={12} /> Word (DOCX)
              </button>
              <button
                onClick={() => exportRPPToXlsx(schoolConfig, rppData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-[#10b981] cursor-pointer"
              >
                <FileSpreadsheet size={12} /> Excel (XLSX)
              </button>
              <button
                onClick={() => exportRPPToPdf(schoolConfig, rppData)}
                className="flex items-center gap-1 font-black uppercase px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                <FileText size={12} /> PDF Dokumen
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-blue-500/20 bg-slate-500/5 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin mx-auto"></div>
              <div className="space-y-1">
                <p className="font-bold text-blue-500">AI sedang memproses modul ajar guru secara utuh...</p>
                <p className="text-[11px] text-slate-400">Merumuskan Kompetensi Awal, Pertanyaan Pemantik, LKPD, dan Asesmen Kurikulum Merdeka.</p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border space-y-5 shadow-sm leading-relaxed ${
              darkMode ? "bg-slate-900 border-[#014AAD]/20 text-slate-100" : "bg-white border-[#014AAD]/10 text-slate-800"
            }`}>
              
              {/* Header */}
              <div className="text-center space-y-1 border-b pb-4 border-slate-400/20">
                <h4 className="text-sm font-bold uppercase">RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR</h4>
                <h5 className="font-bold uppercase text-slate-400">KURIKULUM MERDEKA SD</h5>
              </div>

              {/* SECTION I IDENTITAS */}
              <div className="space-y-2">
                <h5 className="font-bold text-blue-500 uppercase flex items-center gap-1">
                  <ClipboardCheck size={14} /> I. IDENTITAS DOKUMEN
                </h5>
                <div className="grid grid-cols-2 gap-3 pl-3">
                  <p><span className="font-bold inline-block w-28 text-slate-400">Nama Sekolah</span>: {schoolConfig.sekolah}</p>
                  <p><span className="font-bold inline-block w-28 text-slate-400">Mata Pelajaran</span>: {schoolConfig.mapel}</p>
                  <p><span className="font-bold inline-block w-28 text-slate-400">Fase / Kelas</span>: {schoolConfig.fase} / Kelas {schoolConfig.kelas}</p>
                  <p><span className="font-bold inline-block w-28 text-slate-400">Penyusun</span>: {schoolConfig.guru}</p>
                </div>
              </div>

              {/* SECTION II KOMPETENSI AWAL */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">II. KOMPETENSI AWAL</label>
                <RichTextEditor
                  value={rppData.kompetensiAwal}
                  onChange={(val) => setRppData({ ...rppData, kompetensiAwal: val })}
                  darkMode={darkMode}
                />
              </div>

              {/* III PROFIL PANCASILA */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">III. PROFIL PELAJAR PANCASILA</label>
                <input
                  type="text"
                  value={rppData.profilPancasila.join(", ")}
                  onChange={(e) => setRppData({ ...rppData, profilPancasila: e.target.value.split(", ") })}
                  className={`w-full p-2.5 rounded-xl border ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              {/* IV & V SARPRAS / TARGET */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-blue-500 uppercase">IV. SARANA DAN PRASARANA</label>
                  <input
                    type="text"
                    value={rppData.saranaPrasarana}
                    onChange={(e) => setRppData({ ...rppData, saranaPrasarana: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${
                      darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-blue-500 uppercase">V. TARGET PESERTA DIDIK</label>
                  <input
                    type="text"
                    value={rppData.targetPesertaDidik}
                    onChange={(e) => setRppData({ ...rppData, targetPesertaDidik: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${
                      darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* VI MODEL PEMBELAJARAN */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">VI. MODEL & METODE PEMBELAJARAN</label>
                <input
                  type="text"
                  value={rppData.modelPembelajaran}
                  onChange={(e) => setRppData({ ...rppData, modelPembelajaran: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              {/* VII TUJUAN PEMBELAJARAN */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-blue-500 uppercase">VII. TUJUAN PEMBELAJARAN (TP)</label>
                  <button onClick={handleAddTP} className="text-blue-500 text-[10px] font-bold hover:underline cursor-pointer">+ Tambah</button>
                </div>
                {rppData.tujuanPembelajaran.map((tp, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={tp}
                    onChange={(e) => {
                      const updated = [...rppData.tujuanPembelajaran];
                      updated[idx] = e.target.value;
                      setRppData({ ...rppData, tujuanPembelajaran: updated });
                    }}
                    className={`w-full p-2 rounded-xl mb-1.5 border ${
                      darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* VIII PEMAHAMAN BERMAKNA */}
              <div className="space-y-1.5">
                <label className="font-bold text-blue-500 uppercase">VIII. PEMAHAMAN BERMAKNA</label>
                <RichTextEditor
                  value={rppData.pemahamanBermakna}
                  onChange={(val) => setRppData({ ...rppData, pemahamanBermakna: val })}
                  darkMode={darkMode}
                />
              </div>

              {/* IX PERTANYAAN PEMANTIK */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-blue-500 uppercase">IX. PERTANYAAN PEMANTIK</label>
                  <button onClick={handleAddPemantik} className="text-blue-500 text-[10px] font-bold hover:underline cursor-pointer">+ Tambah</button>
                </div>
                {rppData.pertanyaanPemantik.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...rppData.pertanyaanPemantik];
                      updated[idx] = e.target.value;
                      setRppData({ ...rppData, pertanyaanPemantik: updated });
                    }}
                    className={`w-full p-2 rounded-xl mb-1.5 border ${
                      darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* X KEGIATAN PEMBELAJARAN */}
              <div className="space-y-3">
                <label className="font-bold text-blue-500 uppercase">X. LANGKAH / KEGIATAN PEMBELAJARAN</label>
                {rppData.kegiatanPembelajaran.map((keg, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-400 uppercase">{keg.kategori}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Waktu:</span>
                        <input
                          type="text"
                          value={keg.alokasiWaktu}
                          onChange={(e) => handleUpdateStep(idx, "alokasiWaktu", e.target.value)}
                          className={`p-1 text-center w-20 font-bold rounded border ${
                            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                          }`}
                        />
                      </div>
                    </div>
                    <RichTextEditor
                      value={keg.deskripsi}
                      onChange={(val) => handleUpdateStep(idx, "deskripsi", val)}
                      darkMode={darkMode}
                      className="text-[11px] font-mono leading-relaxed max-w-full"
                    />
                  </div>
                ))}
              </div>

              {/* XI ASESMEN */}
              <div className="space-y-2">
                <label className="font-bold text-blue-500 uppercase">XI. PENILAIAN / ASESMEN</label>
                {["diagnostik", "formatif", "sumatif"].map((key) => (
                  <div key={key} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{key}</span>
                    <input
                      type="text"
                      value={(rppData.asesmen as any)[key]}
                      onChange={(e) => {
                        const updated = { ...rppData.asesmen, [key]: e.target.value };
                        setRppData({ ...rppData, asesmen: updated });
                      }}
                      className={`w-full p-2 rounded-xl border ${
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* XII REMEDIAL & PENGAYAAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase">Remedial</label>
                  <RichTextEditor
                    value={rppData.remedialAndPengayaan.remedial}
                    onChange={(val) => {
                      const updated = { ...rppData.remedialAndPengayaan, remedial: val };
                      setRppData({ ...rppData, remedialAndPengayaan: updated });
                    }}
                    darkMode={darkMode}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase">Pengayaan</label>
                  <RichTextEditor
                    value={rppData.remedialAndPengayaan.pengayaan}
                    onChange={(val) => {
                      const updated = { ...rppData.remedialAndPengayaan, pengayaan: val };
                      setRppData({ ...rppData, remedialAndPengayaan: updated });
                    }}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* XIII LKPD & XIV RUBRIK */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-blue-500 uppercase">XIII. LAMPIRAN LEMBAR KERJA PESERTA DIDIK (LKPD)</label>
                  <RichTextEditor
                    value={rppData.lkpd}
                    onChange={(val) => setRppData({ ...rppData, lkpd: val })}
                    darkMode={darkMode}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-blue-500 uppercase">XIV. RUBRIK & LEMBAR PENILAIAN</label>
                  <RichTextEditor
                    value={rppData.rubrikPenilaian}
                    onChange={(val) => setRppData({ ...rppData, rubrikPenilaian: val })}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex justify-between text-slate-400 font-semibold border-t border-dashed border-slate-700/10">
                <div className="space-y-12">
                  <p>Mengetahui,</p>
                  <p className="font-bold underline text-slate-300">{schoolConfig.kepalaSekolah}</p>
                </div>
                <div className="space-y-12 text-right">
                  <p>Guru Kelas, </p>
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
        type="rpp"
        title={`Pratinjau Modul Ajar RPP ${schoolConfig.mapel}`}
        schoolConfig={schoolConfig}
        data={rppData}
        darkMode={darkMode}
      />

    </div>
  );
}

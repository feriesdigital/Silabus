import React, { useState, useEffect } from "react";
import { SchoolConfig, SyllabusData, SyllabusItem, SavedDocument } from "../types";
import { 
  Sparkles, Save, FileText, Download, Eye, Plus, Trash2, 
  ChevronRight, AlertCircle, RefreshCw, Printer, FileSpreadsheet,
  CheckCircle2, ChevronDown, FolderOpen
} from "lucide-react";
import { exportSyllabusToDocx, exportSyllabusToXlsx, exportSyllabusToPdf } from "../utils/exportDocs";
import { RichTextEditor } from "./RichTextEditor";
import PreviewModal from "./PreviewModal";

interface SyllabusGeneratorProps {
  schoolConfig: SchoolConfig;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  onSaveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => void;
  savedSyllabi: SavedDocument[];
  darkMode: boolean;
}

export default function SyllabusGenerator({
  schoolConfig,
  onUpdateSchoolConfig,
  onSaveDocument,
  savedSyllabi,
  darkMode
}: SyllabusGeneratorProps) {

  // Current active draft id if loaded
  const [activeDocId, setActiveDocId] = useState<string | undefined>(undefined);
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form Fields
  const [topic, setTopic] = useState("Pecahan dan Penjumlahan Desimal");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showGuide, setShowGuide] = useState(true);

  // Real-time Save Status Indicators
  const [saveStatus, setSaveStatus] = useState<"clean" | "saving" | "saved">("clean");
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Loaded state
  const [syllabusData, setSyllabusData] = useState<SyllabusData>({
    capaianPembelajaran: "Peserta didik dapat mengurutkan, membandingkan, serta melakukan penjumlahan dan pengurangan pecahan desimal secara lancar.",
    alokasiWaktuTotal: "12 JP (4 Pertemuan)",
    tabelSilabus: [
      {
        tujuanPembelajaran: "Mengidentifikasi konsep dasar pecahan desimal dan kaitannya dengan pecahan biasa.",
        materiPokok: "Pengenalan Pecahan Desimal",
        kegiatanPembelajaran: "Melakukan demonstrasi memotong buah apel menjadi sepuluh bagian rata, menyalin tabel persepuluhan.",
        profilPancasila: "Mandiri, Bernalar Kritis",
        penilaian: "Tes Tulis (Esai nilai persepuluhan)",
        alokasiWaktu: "3 JP",
        sumberBelajar: "Buku Siswa Matematika Kelas IV Vol. 1"
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
      const targetId = activeDocId || "syllabus_" + Math.random().toString(36).substr(2, 9);
      if (!activeDocId) {
        setActiveDocId(targetId);
      }
      onSaveDocument({
        id: targetId,
        type: "syllabus",
        title: `Silabus ${schoolConfig.mapel} Kelas ${schoolConfig.kelas} - ${topic}`,
        subject: schoolConfig.mapel,
        grade: schoolConfig.kelas,
        semester: schoolConfig.semester,
        topic: topic,
        config: schoolConfig,
        data: syllabusData
      });
      setSaveStatus("saved");
    }, 1200);

    return () => clearTimeout(saveTimer);
  }, [topic, customInstructions, syllabusData, schoolConfig]);

  // View mode for responsive devices (spreadsheets are hard to edit on mobile)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Auto detect viewport width to set default viewMode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode("cards");
      } else {
        setViewMode("table");
      }
    };
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load existing saved documents if selected
  const handleLoadSaved = (doc: SavedDocument) => {
    setActiveDocId(doc.id);
    onUpdateSchoolConfig(doc.config);
    setSyllabusData(doc.data as SyllabusData);
    if (doc.topic) {
      setTopic(doc.topic);
    } else if (doc.title && doc.title.includes(" - ")) {
      setTopic(doc.title.split(" - ").pop() || "");
    }
    setSaveStatus("saved");
  };

  // Auto-load template or latest document when the config mapped parameters match
  useEffect(() => {
    if (!activeDocId && savedSyllabi.length > 0) {
      const sortedMatching = [...savedSyllabi]
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
  }, [schoolConfig.mapel, schoolConfig.kelas, schoolConfig.semester, savedSyllabi, activeDocId]);

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
          type: "syllabus",
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
        throw new Error(data.error || "Gagal menghasilkan Silabus dari AI.");
      }

      setSyllabusData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    onSaveDocument({
      id: activeDocId,
      type: "syllabus",
      title: `Silabus ${schoolConfig.mapel} Kelas ${schoolConfig.kelas} - ${topic}`,
      subject: schoolConfig.mapel,
      grade: schoolConfig.kelas,
      semester: schoolConfig.semester,
      topic: topic,
      config: schoolConfig,
      data: syllabusData
    });
    setSaveStatus("saved");
    alert("Draft Silabus berhasil disimpan!");
  };

  // Local Table Actions
  const handleUpdateTableRow = (index: number, key: keyof SyllabusItem, value: string) => {
    const updated = [...syllabusData.tabelSilabus];
    updated[index][key] = value;
    setSyllabusData({ ...syllabusData, tabelSilabus: updated });
  };

  const handleAddTableRow = () => {
    setSyllabusData({
      ...syllabusData,
      tabelSilabus: [
        ...syllabusData.tabelSilabus,
        {
          tujuanPembelajaran: "Tujuan Pembelajaran baru",
          materiPokok: "Materi baru",
          kegiatanPembelajaran: "Kegiatan pembelajaran praktis",
          profilPancasila: "Gotong Royong",
          penilaian: "Formatif",
          alokasiWaktu: "3 JP",
          sumberBelajar: "Buku siswa"
        }
      ]
    });
  };

  const handleRemoveTableRow = (index: number) => {
    const updated = syllabusData.tabelSilabus.filter((_, idx) => idx !== index);
    setSyllabusData({ ...syllabusData, tabelSilabus: updated });
  };

  const triggerExportDocx = () => {
    exportSyllabusToDocx(schoolConfig, syllabusData);
  };

  const triggerExportXlsx = () => {
    exportSyllabusToXlsx(schoolConfig, syllabusData);
  };

  const triggerExportPdf = () => {
    exportSyllabusToPdf(schoolConfig, syllabusData);
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-slate-700/10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] block">Syllabus & ATP Generator</h2>
            
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
            Bentuk program pembelajaran semesteran dan tahunan (Alur Tujuan Pembelajaran) berbasis Kurikulum Merdeka atau Kurikulum 2013 Sekolah Dasar.
          </p>
        </div>
        
        {/* Document Load Draft dropdown */}
        {savedSyllabi.length > 0 && (
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
                      ? savedSyllabi.find(d => d.id === activeDocId)?.title || "Draft Aktif"
                      : "-- Pilih Draft Silabus --"}
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
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Riwayat Draft Silabus ({savedSyllabi.length})</span>
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

                      {savedSyllabi.map((doc) => {
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
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2 border border-red-500/20 text-xs font-semibold">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generator Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Input parameters panel (Cols 1) */}
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
                    Sistem otomatis menyelaraskan format kurikulum, semester, dan fase (A-C) dengan standar Kemendikbud.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">2</span>
                    Buat Topik Spesifik
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Deskripsikan materi pokok secara fokus, misal: <span className="italic font-semibold text-[#014AAD] dark:text-blue-300">"Pecahan dan Desimal"</span> daripada umum seperti "Matematika".
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-[#014AAD] dark:text-amber-300 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[9px] font-black">3</span>
                    Gunakan Instruksi Khusus
                  </p>
                  <p className="pl-5 text-[11px] leading-relaxed">
                    Masukkan gaya mengajar pilihan, media peraga, atau kriteria khusus untuk menyesuaikan modul kelas.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm accent-shadow ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10"
          } space-y-4`}>
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24]">Parameter Administrasi</h3>
          
          <div className="grid grid-cols-1 gap-3.5 text-xs">
            {/* Subject */}
            <div className="space-y-1">
              <label className="font-bold text-slate-400">Mata Pelajaran (Mapel)</label>
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

            {/* Class & Phase */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Kelas SD</label>
                <select 
                  value={schoolConfig.kelas}
                  onChange={(e) => onUpdateSchoolConfig({...schoolConfig, kelas: e.target.value})}
                  className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
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
                <label className="font-bold text-slate-400">Kurikulum Fase</label>
                <select 
                  value={schoolConfig.fase}
                  onChange={(e) => onUpdateSchoolConfig({...schoolConfig, fase: e.target.value as "A" | "B" | "C"})}
                  className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="A">Fase A (Kls 1-2)</option>
                  <option value="B">Fase B (Kls 3-4)</option>
                  <option value="C">Fase C (Kls 5-6)</option>
                </select>
              </div>
            </div>

            {/* Semester */}
            <div className="space-y-1">
              <label className="font-bold text-slate-400">Semester</label>
              <div className="flex gap-2">
                {["Ganjil", "Genap"].map(sem => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => onUpdateSchoolConfig({...schoolConfig, semester: sem as "Ganjil" | "Genap"})}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition ${
                      schoolConfig.semester === sem 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : `${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"}`
                    }`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Pokok Bahasan / Topik */}
            <div className="space-y-1">
              <label className="font-bold text-slate-400 flex items-center justify-between">
                <span>Pokok Materi / Bab / Topik</span>
                <span className="text-[9px] text-[#014AAD] dark:text-blue-400 font-extrabold bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Penting</span>
              </label>
              <input
                type="text"
                placeholder="Misal: Pecahan, Magnet, Pancasila"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full p-2.5 rounded-xl border focus:border-blue-500 focus:outline-none ${
                  !topic.trim() ? "border-red-500 ring-1 ring-red-500" : ""
                } ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Tips: Tulis tema secara spesifik (cth: "Pecahan Senilai & Campuran") agar silabus lebih fokus dan mendalam.
              </p>
            </div>

            {/* AI Custom Prompt Instructions */}
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Instruksi Tambahan AI <span className="text-[10px] text-blue-500 font-semibold">(Opsional)</span>
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Kreatif</span>
              </label>
              <textarea
                placeholder="Misal: Integrasikan metode pembelajaran luar kelas ke langkah-langkah, tambahkan korelasi anti-bullying..."
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:border-blue-500 focus:outline-none ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                💡 Cth: "Masukkan ice-breaking pancasila bernyanyi" atau "Fokus ke metode eksperimen konkrit".
              </p>
            </div>

            {/* Generate Trigger */}
            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs bg-[#014AAD] hover:bg-[#00337A] text-white hover:shadow-lg hover:shadow-[#014AAD]/20 cursor-pointer transition disabled:opacity-50 active:scale-98 border-transparent"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Meramu Kurikulum AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#FBBF24]" />
                  <span>Hasilkan Silabus dengan AI</span>
                </>
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Live Preview & Interactive Table (Cols 2-3) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-500/5 p-3 rounded-xl border border-dashed border-slate-500/20">
            <span className="text-[11px] font-black tracking-wider text-[#014AAD] dark:text-[#FBBF24] uppercase flex items-center gap-1">
              <Eye size={12} /> PRATINJAU DOKUMEN SILABUS (ATP)
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
                className="flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:opacity-95 cursor-pointer"
              >
                <Save size={12} /> Simpan Draft
              </button>
              <button
                onClick={triggerExportDocx}
                className="flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Download size={12} /> Word (DOCX)
              </button>
              <button
                onClick={triggerExportXlsx}
                className="flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-[#10b981] cursor-pointer"
              >
                <FileSpreadsheet size={12} /> Excel (XLSX)
              </button>
              <button
                onClick={triggerExportPdf}
                className="flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                <FileText size={12} /> PDF Dokumen
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-blue-500/20 bg-slate-500/5 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin mx-auto"></div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-500">AI sedang memproses standar kurikulum terbaru...</p>
                <p className="text-[11px] text-slate-400">Merangkai Capaian Pembelajaran, Profil Pancasila, dan rincian alokasi waktu SD.</p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border font-sans leading-relaxed ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
            } max-w-4xl mx-auto shadow-sm space-y-5 print:p-0 print:border-none print:shadow-none`}>
              
              {/* Header Surat Sekolah */}
              <div className="text-center space-y-1 border-b-2 border-double pb-4 border-slate-500/30">
                <h4 className="text-sm font-bold tracking-tight text-center uppercase">ALUR TUJUAN PEMBELAJARAN (ATP) / SILABUS</h4>
                <h5 className="text-xs font-semibold uppercase">TAHUN AJARAN {schoolConfig.tahunAjaran} - {schoolConfig.semester.toUpperCase()}</h5>
                <h6 className="text-[11px] font-medium text-slate-400 uppercase">{schoolConfig.sekolah}</h6>
              </div>

              {/* Sekolah profile block */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p><span className="font-bold inline-block w-28">Nama Sekolah</span> : {schoolConfig.sekolah || "-"}</p>
                  <p><span className="font-bold inline-block w-28">NPSN / Kab</span> : {schoolConfig.npsn || "-"} / Jakarta</p>
                  <p><span className="font-bold inline-block w-28">Mata Pelajaran</span> : {schoolConfig.mapel || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-bold inline-block w-28">Kelas / Fase</span> : {schoolConfig.kelas || "-"} / {schoolConfig.fase || "-"}</p>
                  <p><span className="font-bold inline-block w-28">Nama Pendidik</span> : {schoolConfig.guru || "-"}</p>
                  <p><span className="font-bold inline-block w-28">NIP Pendidik</span> : {schoolConfig.nip || "-"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-blue-500">A. Capaian Pembelajaran (CP)</h4>
                <RichTextEditor
                  value={syllabusData.capaianPembelajaran}
                  onChange={(val) => setSyllabusData({ ...syllabusData, capaianPembelajaran: val })}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold border-b pb-2 border-slate-400/10">
                <span className="text-blue-500 uppercase">B. Rincian Alur Tujuan Pembelajaran</span>
                <div className="flex flex-wrap items-center gap-3">
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

                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Total Alokasi:</span>
                    <input
                      type="text"
                      value={syllabusData.alokasiWaktuTotal}
                      onChange={(e) => setSyllabusData({ ...syllabusData, alokasiWaktuTotal: e.target.value })}
                      className={`p-1.5 text-center text-xs font-bold rounded-lg ${
                        darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Table rendering or Card list rendering depending on viewMode state */}
              {viewMode === "table" ? (
                <div className="overflow-x-auto rounded-xl border border-slate-500/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`border-b ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                        <th className="p-2 border-r border-slate-500/20 text-center w-8">No</th>
                        <th className="p-2 border-r border-slate-500/20 w-32">Mata Pelajaran & TP</th>
                        <th className="p-2 border-r border-slate-500/20 w-28">Materi Pokok</th>
                        <th className="p-2 border-r border-slate-500/20">Kegiatan Pembelajaran</th>
                        <th className="p-2 border-r border-slate-500/20 w-24">Profil Pancasila</th>
                        <th className="p-2 border-r border-slate-500/20 w-24">Penilaian</th>
                        <th className="p-2 border-r border-slate-500/20 w-16">Waktu</th>
                        <th className="p-2 text-center w-8">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/15">
                      {syllabusData.tabelSilabus.map((row, index) => (
                        <tr key={index} className="align-top hover:bg-slate-500/5">
                          <td className="p-2 border-r border-slate-500/20 text-center font-bold text-slate-500">{index + 1}</td>
                          <td className="p-1 border-r border-slate-500/20">
                            <RichTextEditor
                              value={row.tujuanPembelajaran}
                              onChange={(val) => handleUpdateTableRow(index, "tujuanPembelajaran", val)}
                              darkMode={darkMode}
                              hideToolbar={true}
                              className="text-[11px]"
                            />
                          </td>
                          <td className="p-1 border-r border-slate-500/20">
                            <RichTextEditor
                              value={row.materiPokok}
                              onChange={(val) => handleUpdateTableRow(index, "materiPokok", val)}
                              darkMode={darkMode}
                              hideToolbar={true}
                              className="text-[11px]"
                            />
                          </td>
                          <td className="p-1 border-r border-slate-500/20">
                            <RichTextEditor
                              value={row.kegiatanPembelajaran}
                              onChange={(val) => handleUpdateTableRow(index, "kegiatanPembelajaran", val)}
                              darkMode={darkMode}
                              hideToolbar={true}
                              className="text-[11px]"
                            />
                          </td>
                          <td className="p-1 border-r border-slate-500/20">
                            <textarea
                              value={row.profilPancasila}
                              onChange={(e) => handleUpdateTableRow(index, "profilPancasila", e.target.value)}
                              rows={2}
                              className={`w-full p-1 border-none text-[11px] focus:ring-1 focus:ring-blue-500 rounded ${
                                darkMode ? "bg-transparent" : "bg-transparent"
                              }`}
                            />
                          </td>
                          <td className="p-1 border-r border-slate-500/20">
                            <textarea
                              value={row.penilaian}
                              onChange={(e) => handleUpdateTableRow(index, "penilaian", e.target.value)}
                              rows={2}
                              className={`w-full p-1 border-none text-[11px] focus:ring-1 focus:ring-blue-500 rounded ${
                                darkMode ? "bg-transparent" : "bg-transparent"
                              }`}
                            />
                          </td>
                          <td className="p-1 border-r border-slate-500/20">
                            <input
                              type="text"
                              value={row.alokasiWaktu}
                              onChange={(e) => handleUpdateTableRow(index, "alokasiWaktu", e.target.value)}
                              className={`w-full p-1 text-center text-[11px] border-none focus:ring-1 focus:ring-blue-500 rounded ${
                                darkMode ? "bg-transparent text-slate-100" : "bg-transparent text-slate-800"
                              }`}
                            />
                          </td>
                          <td className="p-1 text-center">
                            <button
                              onClick={() => handleRemoveTableRow(index)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                              title="Hapus Baris"
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
                  {syllabusData.tabelSilabus.map((row, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border space-y-3 transition group relative ${
                        darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-2 border-slate-400/20">
                        <span className="font-extrabold text-xs text-[#014AAD] dark:text-[#FBBF24] uppercase tracking-wide">Mata Pelajaran & TP #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTableRow(index)}
                          className="p-1 px-2.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/25 cursor-pointer text-[10px] font-bold flex items-center gap-1 transition"
                          title="Hapus Baris"
                        >
                          <Trash2 size={11} /> Hapus Baris
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Tujuan Pembelajaran</label>
                          <RichTextEditor
                            value={row.tujuanPembelajaran}
                            onChange={(val) => handleUpdateTableRow(index, "tujuanPembelajaran", val)}
                            darkMode={darkMode}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Materi Pokok</label>
                          <RichTextEditor
                            value={row.materiPokok}
                            onChange={(val) => handleUpdateTableRow(index, "materiPokok", val)}
                            darkMode={darkMode}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-slate-400">Kegiatan Pembelajaran</label>
                          <RichTextEditor
                            value={row.kegiatanPembelajaran}
                            onChange={(val) => handleUpdateTableRow(index, "kegiatanPembelajaran", val)}
                            darkMode={darkMode}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Profil Pancasila</label>
                          <input
                            type="text"
                            value={row.profilPancasila}
                            onChange={(e) => handleUpdateTableRow(index, "profilPancasila", e.target.value)}
                            className={`w-full p-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                              darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Penilaian / Asesmen</label>
                          <input
                            type="text"
                            value={row.penilaian}
                            onChange={(e) => handleUpdateTableRow(index, "penilaian", e.target.value)}
                            className={`w-full p-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                              darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                            }`}
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-400">Alokasi Waktu</label>
                          <input
                            type="text"
                            value={row.alokasiWaktu}
                            onChange={(e) => handleUpdateTableRow(index, "alokasiWaktu", e.target.value)}
                            className={`w-full p-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                              darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Table Row trigger */}
              <button
                type="button"
                onClick={handleAddTableRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-blue-500/40 text-blue-600 text-xs font-bold hover:bg-blue-500/10 cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Kolom TP Baru</span>
              </button>

              {/* Tanda Tangan */}
              <div className="pt-8 flex justify-between text-xs font-semibold gap-12 text-slate-400">
                <div className="space-y-12">
                  <p>Mengetahui,</p>
                  <p className="font-bold underline text-slate-300">{schoolConfig.kepalaSekolah || "..................."}</p>
                  <p>NIP. {schoolConfig.nipKepalaSekolah || "..................."}</p>
                </div>
                <div className="space-y-12 text-right">
                  <p>Jakarta, {new Date().toLocaleDateString("id-ID")}</p>
                  <p className="font-bold underline text-slate-300">{schoolConfig.guru || "..................."}</p>
                  <p>NIP. {schoolConfig.nip || "..................."}</p>
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
        type="syllabus"
        title={`Pratinjau Silabus ${schoolConfig.mapel}`}
        schoolConfig={schoolConfig}
        data={syllabusData}
        darkMode={darkMode}
      />

    </div>
  );
}

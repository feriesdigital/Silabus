import React, { useState } from "react";
import { SavedDocument } from "../types";
import { 
  FileText, BookOpen, Milestone, Award, 
  Calendar, CheckCircle, ClipboardList, Plus, 
  Sparkles, Trash2, CalendarDays, ExternalLink, RefreshCw,
  Search, X, Check, CheckSquare, Square, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  savedDocuments: SavedDocument[];
  setActiveSection: (section: string) => void;
  onSelectDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onDeleteDocumentsBulk?: (ids: string[]) => void;
  darkMode: boolean;
  onStartTour?: () => void;
}

export default function Dashboard({
  savedDocuments,
  setActiveSection,
  onSelectDocument,
  onDeleteDocument,
  onDeleteDocumentsBulk,
  darkMode,
  onStartTour
}: DashboardProps) {

  // Counts
  const totalDocs = savedDocuments.length;
  const numSyllabus = savedDocuments.filter(d => d.type === "syllabus").length;
  const numRPP = savedDocuments.filter(d => d.type === "rpp").length;
  const numOthers = totalDocs - numSyllabus - numRPP;

  // Filter state
  const [filterType, setFilterType] = useState<"all" | "syllabus" | "rpp" | "other">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState<"none" | "semester" | "tahun">("none");

  // Bulk selection states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sync selectedIds with existing savedDocuments
  React.useEffect(() => {
    setSelectedIds(prev => prev.filter(id => savedDocuments.some(doc => doc.id === id)));
  }, [savedDocuments]);

  // Handle toggle selection for individual document
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredDocs = savedDocuments.filter(doc => {
    // 1. Category Filter
    let matchesCategory = true;
    if (filterType === "syllabus") matchesCategory = doc.type === "syllabus";
    else if (filterType === "rpp") matchesCategory = doc.type === "rpp";
    else if (filterType === "other") matchesCategory = doc.type !== "syllabus" && doc.type !== "rpp";

    // 2. Search Term Filter (title or subject matching)
    let matchesSearch = true;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const titleMatches = doc.title ? doc.title.toLowerCase().includes(term) : false;
      const subjectMatches = doc.subject ? doc.subject.toLowerCase().includes(term) : false;
      matchesSearch = titleMatches || subjectMatches;
    }

    return matchesCategory && matchesSearch;
  });

  const sortedAndFilteredDocs = [...filteredDocs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Show up to 10 matching documents for better rich list
  const docsToShow = sortedAndFilteredDocs.slice(0, 10);

  // Dynamic Grouping of Documents to display
  let groupedDocsArray: { groupName: string; docs: SavedDocument[]; key: string }[] = [];

  if (groupBy === "semester") {
    const groups: Record<string, SavedDocument[]> = {
      "Semester Ganjil": [],
      "Semester Genap": [],
      "Semester Lainnya": []
    };
    
    sortedAndFilteredDocs.forEach((doc) => {
      const sem = doc.config?.semester || doc.semester || "Ganjil";
      if (sem.toLowerCase().includes("ganjil")) {
        groups["Semester Ganjil"].push(doc);
      } else if (sem.toLowerCase().includes("genap")) {
        groups["Semester Genap"].push(doc);
      } else {
        groups["Semester Lainnya"].push(doc);
      }
    });

    groupedDocsArray = [
      { groupName: "Semester Ganjil", docs: groups["Semester Ganjil"], key: "ganjil" },
      { groupName: "Semester Genap", docs: groups["Semester Genap"], key: "genap" },
      { groupName: "Semester Lainnya", docs: groups["Semester Lainnya"], key: "lainnya" }
    ].filter(g => g.docs.length > 0);
  } else if (groupBy === "tahun") {
    const groups: Record<string, SavedDocument[]> = {};
    
    sortedAndFilteredDocs.forEach((doc) => {
      const year = doc.config?.tahunAjaran || "Lainnya";
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(doc);
    });

    const sortedYears = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    groupedDocsArray = sortedYears.map(year => ({
      groupName: year === "Lainnya" ? "Tahun Ajaran Lainnya" : `Tahun Ajaran ${year}`,
      docs: groups[year],
      key: year
    }));
  }

  // Row Renderer with semantic tags
  const renderDocRow = (doc: SavedDocument) => {
    const isSelected = selectedIds.includes(doc.id);
    return (
      <div 
        key={doc.id}
        className={`py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 group px-4 rounded-2xl border transition-all duration-150 cursor-pointer mb-2.5 ${
          isSelectionMode 
            ? isSelected
              ? darkMode
                ? "bg-amber-500/10 border-amber-500/40 text-white shadow-md shadow-amber-500/2"
                : "bg-[#014AAD]/5 border-[#014AAD]/20 text-slate-800 shadow-sm border-l-4 border-l-[#014AAD]"
              : darkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
            : darkMode
              ? "bg-slate-900/60 border-slate-800 text-slate-350 hover:bg-slate-800 hover:border-slate-700 hover:shadow-xs hover:text-white"
              : "bg-white border-slate-100 text-slate-700 hover:bg-[#014AAD]/5 hover:border-[#014AAD]/15 hover:shadow-xs"
        }`}
        onClick={() => {
          if (isSelectionMode) {
            handleToggleSelect(doc.id);
          } else {
            onSelectDocument(doc);
          }
        }}
      >
        <div className="flex items-center gap-3.5 w-full min-w-0">
          {isSelectionMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSelect(doc.id);
              }}
              className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer border ${
                isSelected 
                  ? "bg-[#014AAD] dark:bg-[#FBBF24] border-transparent text-white dark:text-slate-950 shadow-md shadow-[#014AAD]/20 dark:shadow-amber-500/10 scale-105"
                  : "border-slate-300 dark:border-slate-600 hover:border-[#014AAD] dark:hover:border-[#FBBF24] bg-transparent"
              }`}
            >
              {isSelected ? (
                <Check size={12} className="stroke-[3]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          )}

          <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-105 ${
            doc.type === "syllabus" 
              ? "bg-emerald-500/10 text-emerald-500" 
              : "bg-sky-500/10 text-sky-500"
          }`}>
            {doc.type === "syllabus" ? <BookOpen size={16} /> : <FileText size={16} />}
          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 hover:text-[#014AAD] dark:hover:text-[#FBBF24] transition-colors truncate">
              {doc.title}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide border ${
                darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>{doc.subject}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wide bg-[#014AAD]/10 text-[#014AAD] dark:bg-blue-950/40 dark:text-blue-300">
                Kelas {doc.grade}
              </span>
              {/* Automatic Semester Tagging */}
              <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                Smtr {doc.config?.semester || doc.semester || "Ganjil"}
              </span>
              {/* Automatic Academic Year (Kurikulum) Tagging */}
              <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide bg-[#014AAD]/10 text-[#014AAD] dark:bg-sky-950/30 dark:text-sky-350">
                TA {doc.config?.tahunAjaran || "2025/2026"}
              </span>
              <span className={`text-[9px] font-semibold flex items-center justify-center h-full self-center ${darkMode ? "text-slate-550" : "text-slate-450"}`}>
                Diperbarui: {new Date(doc.updatedAt).toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
          {!isSelectionMode && (
            <button
              onClick={() => onSelectDocument(doc)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#014AAD] dark:text-[#FBBF24] hover:bg-[#014AAD] hover:text-white dark:hover:bg-amber-500 dark:hover:text-slate-950 rounded-xl border border-[#014AAD]/20 dark:border-amber-500/20 cursor-pointer transition-all"
            >
              Buka
            </button>
          )}
          <button
            onClick={() => onDeleteDocument(doc.id)}
            className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/25 rounded-xl cursor-pointer transition-colors"
            title="Hapus Dokumen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  const tipsOfToday = [
    "Sesuaikan Alokasi Waktu dengan kerumitan materi bab untuk menghindari kegiatan terburu-buru.",
    "Pastikan kriteria Penilaian/Asesmen mencakup Asesmen Formatif sepanjang KBM agar evaluasi transparan.",
    "Kurikulum Merdeka menekankan integrasi nilai Profil Pelajar Pancasila di sela-sela Kegiatan Inti.",
    "Gunakan LKPD interaktif dan pertanyaan pemantik kontekstual saat memulai pokok topik baru."
  ];

  const randomTip = tipsOfToday[new Date().getDate() % tipsOfToday.length];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div id="tour-welcome-banner" className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden accent-shadow ${
        darkMode ? "bg-slate-900 border-[#014AAD]/20 text-white" : "sidebar-gradient text-white border-transparent"
      }`}>
        <div className="space-y-1.5 z-10">
          <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">Hub Guru Administrasi</h1>
          <p className={`text-xs ${darkMode ? "text-[#FBBF24]" : "text-[#FBBF24] font-bold"}`}>
            Sistem Generator Silabus & RPP Sekolah Dasar Indonesia. Kurikulum Merdeka & K13 otomatis dengan dukungan kecerdasan AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 z-10 flex-shrink-0">
          {onStartTour && (
            <button 
              onClick={onStartTour}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight shadow-md cursor-pointer transition-transform duration-100 active:scale-95 flex items-center gap-1.5 ${
                darkMode ? "bg-blue-600 hover:bg-blue-550 text-white border border-transparent" : "bg-white text-[#014AAD] hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sparkles size={13} className="text-[#FBBF24] fill-[#FBBF24] animate-pulse" />
              <span>Tur Panduan Guru</span>
            </button>
          )}
          <button 
            onClick={() => setActiveSection("settings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight shadow-md cursor-pointer transition-transform duration-100 active:scale-95 ${
              darkMode ? "bg-slate-800 hover:bg-slate-755 text-white border border-slate-700" : "bg-[#FBBF24] text-slate-900 hover:bg-[#FBBF24]/90"
            }`}
          >
            Ubah Profil Sekolah
          </button>
        </div>
        {/* Glow effect */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Metrics Grid */}
      <div id="tour-metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Dokumen dibuat</span>
            <div className={`p-2 rounded-xl ${darkMode ? "bg-[#FBBF24]/10 text-[#FBBF24]" : "bg-[#014AAD]/10 text-[#014AAD]"}`}><ClipboardList size={18} /></div>
          </div>
          <span className="text-2xl font-black tracking-tight block">{totalDocs}</span>
          <span className={`text-[10px] block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400 font-medium"}`}>Semua administrasi mengajar</span>
        </div>

        {/* Syllabus Count */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Jumlah Silabus</span>
            <div className={`p-2 rounded-xl ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-[#014AAD]/10 text-[#014AAD]"}`}><BookOpen size={18} /></div>
          </div>
          <span className="text-2xl font-black tracking-tight block">{numSyllabus}</span>
          <span className={`text-[10px] block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400 font-medium"}`}>Alur Tujuan Pembelajaran (ATP)</span>
        </div>

        {/* RPP Count */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Jumlah RPP</span>
            <div className={`p-2 rounded-xl ${darkMode ? "bg-sky-500/10 text-sky-400" : "bg-[#014AAD]/10 text-[#014AAD]"}`}><FileText size={18} /></div>
          </div>
          <span className="text-2xl font-black tracking-tight block">{numRPP}</span>
          <span className={`text-[10px] block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400 font-medium"}`}>Modul Ajar Pembelajaran</span>
        </div>

        {/* Other Docs Count */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Dokumen Lain</span>
            <div className={`p-2 rounded-xl ${darkMode ? "bg-[#FBBF24]/10 text-[#FBBF24]" : "bg-[#014AAD]/10 text-[#014AAD]"}`}><Milestone size={18} /></div>
          </div>
          <span className="text-2xl font-black tracking-tight block">{numOthers}</span>
          <span className={`text-[10px] block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400 font-medium"}`}>CP, Prota, Promes, KKTP, Jurnal</span>
        </div>
      </div>

      {/* Quick Actions & Tips Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-[#014AAD]"}`}>Buat Dokumen Baru</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Action 1: Create Syllabus */}
            <button
              id="tour-syllabus-btn"
              onClick={() => setActiveSection("syllabus")}
              className={`p-5 rounded-2xl border text-left group hover:shadow-lg hover:border-[#014AAD] hover:-translate-y-0.5 cursor-pointer transition-all duration-150 relative overflow-hidden ${
                darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-[#014AAD]/10 shadow-sm"
              }`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 group-hover:bg-[#FBBF24] group-hover:text-[#014AAD] transition-all ${
                darkMode ? "bg-[#014AAD]/20 text-[#FBBF24]" : "bg-[#014AAD]/5 text-[#014AAD]"
              }`}>
                <BookOpen size={20} />
              </div>
              <h4 className="font-extrabold text-sm mb-1 group-hover:text-[#014AAD] transition-colors uppercase tracking-tight">Tulis Silabus Baru</h4>
              <p className={`text-[11px] leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Buat program pembelajaran, alokasi waktu, serta uraian materi pokok sesuai anjuran kurikulum secara utuh.
              </p>
              <div className="flex items-center gap-1 text-[11px] font-black uppercase text-[#014AAD] dark:text-[#FBBF24]">
                <span>Mulai Sekarang</span>
                <Plus size={14} />
              </div>
            </button>

            {/* Action 2: Create RPP */}
            <button
              id="tour-rpp-btn"
              onClick={() => setActiveSection("rpp")}
              className={`p-5 rounded-2xl border text-left group hover:shadow-lg hover:border-[#014AAD] hover:-translate-y-0.5 cursor-pointer transition-all duration-150 relative overflow-hidden ${
                darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-[#014AAD]/10 shadow-sm"
              }`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 group-hover:bg-[#FBBF24] group-hover:text-[#014AAD] transition-all ${
                darkMode ? "bg-[#014AAD]/20 text-[#FBBF24]" : "bg-[#014AAD]/5 text-[#014AAD]"
              }`}>
                <FileText size={20} />
              </div>
              <h4 className="font-extrabold text-sm mb-1 group-hover:text-[#014AAD] transition-colors uppercase tracking-tight">Buat RPP / Modul Ajar</h4>
              <p className={`text-[11px] leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Gubah rencana KBM, tujuan pembelajaran, kriteria asesmen sumatif, remedial, dan lampiran evaluasi lengkap.
              </p>
              <div className="flex items-center gap-1 text-[11px] font-black uppercase text-[#014AAD] dark:text-[#FBBF24]">
                <span>Mulai Sekarang</span>
                <Plus size={14} />
              </div>
            </button>

          </div>

          {/* Quick links to general tools inside grid */}
          <div id="tour-extra-tools" className="space-y-2 pt-2">
            <h4 className={`text-[11px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-[#014AAD]"}`}>Administrasi Tambahan Guru</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "atp", label: "ATP (Alur)", icon: Milestone },
                { id: "cp", label: "Hasil CP", icon: Award },
                { id: "prota", label: "PROTA", icon: Calendar },
                { id: "promes", label: "PROMES", icon: CalendarDays },
                { id: "kktp", label: "KKTP", icon: CheckCircle },
                { id: "jurnal", label: "Jurnal Mengajar", icon: ClipboardList }
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveSection(tool.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold hover:border-[#014AAD] hover:bg-[#014AAD]/5 transition-all cursor-pointer ${
                    darkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <tool.icon size={14} className="text-[#014AAD] dark:text-amber-400 animate-pulse" />
                  <span className="truncate">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Tip of the day & AI Smart widget */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-[#014AAD]"}`}>Pojok Literasi Guru</h3>
          
          {/* Tip Card */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-[#014AAD]/10 shadow-sm"
          }`}>
            <div className="flex items-center gap-2 mb-3 text-[#FBBF24]">
              <Sparkles size={16} />
              <span className="text-xs font-black uppercase tracking-wide">Tips Kinerja Kemendikbud</span>
            </div>
            <p className={`text-xs leading-relaxed italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              &ldquo;{randomTip}&rdquo;
            </p>
          </div>

          {/* Quick templates shortcut widget */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? "bg-slate-900 border-[#014AAD]/20 text-slate-200" : "bg-white border-[#014AAD]/10 shadow-sm text-slate-800"
          }`}>
            <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-[#014AAD] uppercase tracking-tight">
              <Plus size={14} className="text-[#FBBF24]" /> Gunakan Template Instan
            </h4>
            <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Buka menu Pustaka Template untuk memuat silabus dan RPP terstandarisasi untuk semua kelas.
            </p>
            <button
              onClick={() => setActiveSection("templates")}
              className="text-xs font-black uppercase tracking-tight text-[#014AAD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Intip Galeri Template <ExternalLink size={12} />
            </button>
          </div>

          {/* AI Chat Assistant Promo Card */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? "bg-slate-900 border-[#014AAD]/25 text-slate-200" : "bg-white border-[#014AAD]/10 shadow-sm text-slate-800"
          }`}>
            <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-[#014AAD] dark:text-[#FBBF24] uppercase tracking-tight">
              <MessageSquare size={14} className="text-[#FBBF24]" /> Pojok Tanya Jawab AI
            </h4>
            <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Selesaikan masalah administrasi, rancangan kurikulum, hingga dinamika manajemen kelas langsung bersama AI.
            </p>
            <button
              onClick={() => setActiveSection("chat")}
              className="text-xs font-black uppercase tracking-tight text-[#014AAD] dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Diskusi Bersama AI <ExternalLink size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* History of Saved Documents with Category Filters */}
      <div id="tour-saved-docs" className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-[#014AAD]/10"} shadow-md accent-shadow`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b pb-4 border-dashed border-slate-700/20">
          <div className="leading-tight flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h3 className="font-black text-sm tracking-tight uppercase text-[#014AAD] dark:text-[#FBBF24] flex items-center gap-2 flex-wrap">
                <span>Daftar Dokumen Tersimpan</span>
              </h3>
              <p className={`text-[11px] mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                {isSelectionMode ? "Pilih beberapa dokumen di bawah untuk tindakan kelompok" : "Koleksi rancangan yang telah Anda buat di sistem ini"}
              </p>
            </div>
          </div>
          
          {/* Search and Category Filter Row */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative min-w-[200px] w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari judul atau mata pelajaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2 pl-8 pr-8 text-xs font-semibold rounded-xl border outline-none transition-all ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#014AAD] focus:ring-1 focus:ring-[#014AAD]"
                }`}
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 cursor-pointer"
                  title="Reset pencarian"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Semua", count: totalDocs },
                { id: "syllabus", label: "Silabus", count: numSyllabus },
                { id: "rpp", label: "RPP", count: numRPP },
                { id: "other", label: "Lainnya", count: numOthers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                    filterType === tab.id
                      ? "bg-[#014AAD] text-white border-[#014AAD]"
                      : darkMode
                        ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-400 hover:text-slate-200"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Group By Selector */}
            <div className="flex items-center gap-1.5 sm:ml-auto">
              <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Kelompokkan:
              </span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as "none" | "semester" | "tahun")}
                className={`py-1.5 px-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border outline-none cursor-pointer transition-all ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-[#FBBF24] focus:border-blue-500"
                    : "bg-slate-50 border-slate-200 text-[#014AAD] focus:border-[#014AAD]"
                }`}
              >
                <option value="none">Tanpa Pengelompokkan</option>
                <option value="semester">Semester</option>
                <option value="tahun">Tahun Ajaran</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inline Selection Mode Guide */}
        {isSelectionMode && sortedAndFilteredDocs.length > 0 && (
          <div className={`p-3.5 rounded-2xl mb-4 border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2.5 animate-fade-in ${
            darkMode 
              ? "bg-[#014AAD]/10 border-[#014AAD]/30 text-amber-400" 
              : "bg-amber-500/5 border-amber-500/20 text-slate-800"
          }`}>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-center sm:text-left">
              <span className="font-extrabold uppercase text-[#014AAD] dark:text-[#FBBF24]">Mode Seleksi Aktif:</span> Klik pada baris dokumen di bawah untuk memilih, kemudian gunakan menu melayang di bawah layar untuk melakukan penghapusan secara masal.
            </span>
          </div>
        )}

        {/* Floating Bulk Action Controls Bar using Framer Motion */}
        <AnimatePresence>
          {isSelectionMode && sortedAndFilteredDocs.length > 0 && (
            <motion.div
              initial={{ y: 100, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 100, x: "-50%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="fixed bottom-6 left-1/2 z-55 w-[calc(100%-2rem)] max-w-2xl rounded-[24px] border p-4 shadow-2xl backdrop-blur-md"
              style={{
                backgroundColor: darkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.96)",
                borderColor: darkMode ? "rgba(1, 74, 173, 0.35)" : "rgba(1, 74, 173, 0.2)",
                boxShadow: darkMode 
                  ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5), 0 0 0 1px rgba(1, 74, 173, 0.2)" 
                  : "0 20px 25px -5px rgb(1 74 173 / 0.1), 0 8px 10px -6px rgb(1 74 173 / 0.1)"
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Information Area */}
                <div className="flex items-center gap-3 w-full md:w-auto text-left">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    darkMode ? "bg-amber-500/10 text-[#FBBF24]" : "bg-[#014AAD]/10 text-[#014AAD]"
                  }`}>
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
                        Seleksi Grup
                      </span>
                      {selectedIds.length > 0 && (
                        <span className="bg-rose-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full animate-bounce">
                          {selectedIds.length} Aktif
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Pilihan: <span className="font-extrabold text-[#014AAD] dark:text-[#FBBF24]">{selectedIds.length}</span> dari {sortedAndFilteredDocs.length} dok disaring
                    </p>
                  </div>
                </div>

                {/* Quick actions for all viewports (Mobile, Tablet, Desktop) */}
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const allVisibleIds = sortedAndFilteredDocs.map(d => d.id);
                      const isAllSelected = allVisibleIds.every(id => selectedIds.includes(id));
                      if (isAllSelected) {
                        setSelectedIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
                      } else {
                        setSelectedIds(prev => Array.from(new Set([...prev, ...allVisibleIds])));
                      }
                    }}
                    className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      darkMode 
                        ? "bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs"
                    }`}
                  >
                    {sortedAndFilteredDocs.every(d => selectedIds.includes(d.id)) ? (
                      <>
                        <Square size={12} className="stroke-[2.5]" />
                        <span>Batal Semua</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare size={12} className="stroke-[2.5]" />
                        <span>Pilih Semua</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={() => {
                      if (onDeleteDocumentsBulk) {
                        onDeleteDocumentsBulk(selectedIds);
                      }
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all ${
                      selectedIds.length === 0
                        ? "bg-slate-700/30 dark:bg-slate-800/20 border-transparent text-slate-450 dark:text-slate-605 cursor-not-allowed"
                        : "bg-rose-600 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-600/20 active:scale-95 duration-100 font-extrabold"
                    }`}
                  >
                    <Trash2 size={13} className="stroke-[2.5]" />
                    <span>Hapus Terpilih ({selectedIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedIds([]);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border transition-all ${
                      darkMode
                        ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-rose-550/10 hover:text-rose-400 hover:border-rose-550/30"
                        : "bg-slate-100 border-transparent text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                    }`}
                    title="Batal mode seleksi"
                  >
                    <X size={13} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {totalDocs > 0 && (
          <div className="flex justify-end mb-4 pb-3 border-b border-dashed border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (isSelectionMode) {
                  setSelectedIds([]);
                }
                setIsSelectionMode(!isSelectionMode);
              }}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelectionMode
                  ? "bg-rose-500 hover:bg-rose-600 border-rose-500 text-white active:scale-95 shadow-md shadow-rose-500/10"
                  : darkMode
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-[#FBBF24]"
                    : "bg-[#014AAD]/5 hover:bg-[#014AAD]/10 border-[#014AAD]/20 text-[#014AAD]"
              }`}
            >
              <CheckSquare size={13} className="stroke-[2.5]" />
              <span>{isSelectionMode ? "Batal Pilih" : "Pilih Masal"}</span>
            </button>
          </div>
        )}

        {totalDocs === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileText size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400">Belum ada dokumen yang disimpan.</p>
            <p className="text-[11px] text-slate-400">Klik &ldquo;Generator Silabus&rdquo; atau &ldquo;RPP Generator&rdquo; di atas untuk melahirkan karya.</p>
          </div>
        ) : sortedAndFilteredDocs.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileText size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400">Tidak ada dokumen di kategori ini.</p>
            <p className="text-[11px] text-slate-450">Silakan buat dokumen baru atau pilih filter kategori lainnya.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {groupBy === "none" ? (
              <>
                {docsToShow.map((doc) => renderDocRow(doc))}
                {sortedAndFilteredDocs.length > 10 && (
                  <p className="text-[10px] text-center pt-2 text-slate-400 font-medium">Dan {sortedAndFilteredDocs.length - 10} dokumen kategori ini lainnya.</p>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {groupedDocsArray.map((group) => (
                  <div key={group.key} className="space-y-2 pt-2 first:pt-0">
                    <div className={`flex items-center justify-between border-b pb-1.5 ${
                      darkMode ? "border-slate-800/60 text-slate-200" : "border-slate-100 text-slate-800"
                    }`}>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-[#014AAD] dark:text-[#FBBF24] animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-tight">{group.groupName}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}>
                        {group.docs.length} Dokumen
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {group.docs.map((doc) => renderDocRow(doc))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

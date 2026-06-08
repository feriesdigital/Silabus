import React, { useState } from "react";
import { SYLLABUS_TEMPLATES, RPP_TEMPLATES } from "../data/templates";
import { SavedDocument, SchoolConfig, SyllabusItem, KegiatanPembelajaranItem } from "../types";
import { 
  Search, BookOpen, FileText, Check, ArrowRight, Sparkles,
  Eye, X, Clock, ClipboardCheck, Compass, HelpCircle, Activity, Award
} from "lucide-react";

interface TemplatesPageProps {
  onLoadTemplate: (type: "syllabus" | "rpp", config: SchoolConfig, data: any) => void;
  darkMode: boolean;
}

export default function TemplatesPage({
  onLoadTemplate,
  darkMode
}: TemplatesPageProps) {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");

  // Quick-Preview Modal states
  const [previewTemplate, setPreviewTemplate] = useState<{
    key: string;
    type: "syllabus" | "rpp";
    title: string;
    config: SchoolConfig;
    data: any;
  } | null>(null);

  const [activeTab, setActiveTab ] = useState<string>("info");

  const syllabusList = Object.entries(SYLLABUS_TEMPLATES).map(([key, value]) => ({
    key,
    type: "syllabus" as const,
    title: `Silabus ${value.config.mapel} Kelas ${value.config.kelas} (${value.config.semester})`,
    config: value.config,
    data: value.data
  }));

  const rppList = Object.entries(RPP_TEMPLATES).map(([key, value]) => ({
    key,
    type: "rpp" as const,
    title: `RPP / Modul Ajar ${value.config.mapel} Kelas ${value.config.kelas}`,
    config: value.config,
    data: value.data
  }));

  const allTemplates = [...syllabusList, ...rppList];

  const filteredTemplates = allTemplates.filter(tpl => {
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.config.sekolah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMapel = selectedMapel ? tpl.config.mapel === selectedMapel : true;
    return matchesSearch && matchesMapel;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] block">Pustaka Template Mengajar</h2>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500 font-medium"}`}>
          Pilih dari daftar template standar Kemendikbud kelas 1 - 6 SD yang siap Anda pakai, edit, atau gubah sesuka hati.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className={`relative flex-1 w-full flex items-center border rounded-xl px-3 py-2.5 transition-all ${
          darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-[#014AAD]/10 text-slate-800 focus-within:border-[#014AAD] shadow-sm"
        }`}>
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Cari kata kunci template, sekolah, atau bab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs outline-none w-full font-medium"
          />
        </div>

        <select
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          className={`p-2.5 rounded-xl text-xs font-black uppercase tracking-tight border focus:outline-none w-full sm:w-56 cursor-pointer ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#014AAD]/10 text-slate-700 shadow-sm"
          }`}
        >
          <option value="">Semua Mata Pelajaran</option>
          {["Bahasa Indonesia", "Matematika", "IPA", "IPS", "PPKn", "PJOK"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Grid of cards */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-xs font-bold text-slate-400">Tidak ada template yang cocok dengan pencarian Anda.</p>
          <p className="text-[11px] text-slate-400">Coba hapus saringan filter atau ubah kata kunci.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={`${tpl.type}-${tpl.key}`}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between group transition hover:shadow-lg accent-shadow relative overflow-hidden ${
                darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-[#014AAD]/10"
              }`}
            >
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    tpl.type === "syllabus" ? "bg-emerald-500/10 text-emerald-600" : "bg-[#014AAD]/10 text-[#014AAD]"
                  }`}>
                    {tpl.type === "syllabus" ? "SILABUS (ATP)" : "RPP / MODUL"}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fase {tpl.config.fase}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs group-hover:text-[#014AAD] transition-colors leading-snug">
                    {tpl.title}
                  </h4>
                  <p className={`text-[11px] leading-relaxed line-clamp-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {tpl.type === "syllabus" 
                      ? (tpl.data.capaianPembelajaran) 
                      : (tpl.data.kompetensiAwal)
                    }
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-500/10 flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTemplate(tpl);
                    setActiveTab("info");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    darkMode 
                      ? "bg-slate-800 border-slate-700 text-[#FBBF24] hover:bg-slate-750" 
                      : "bg-slate-100 border-slate-200 text-[#014AAD] hover:bg-slate-200"
                  }`}
                >
                  <Eye size={12} />
                  <span>Pratinjau</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLoadTemplate(tpl.type, tpl.config, tpl.data)}
                  className="flex items-center gap-1 text-[11px] font-black uppercase text-[#014AAD] dark:text-[#FBBF24] hover:opacity-80 cursor-pointer ml-auto"
                >
                  <span>Gunakan</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Little corner decorations */}
              <div className="absolute right-0 bottom-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-[#FBBF24]/20 w-full h-full transform rotate-45 translate-x-4 translate-y-4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 scale-100 ${
            darkMode ? "bg-[#0b1329] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            
            {/* Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${
              darkMode ? "bg-[#0f1d3a] border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  previewTemplate.type === "syllabus" ? "bg-emerald-500/10 text-emerald-500" : "bg-sky-500/10 text-sky-500"
                }`}>
                  {previewTemplate.type === "syllabus" ? <BookOpen size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      previewTemplate.type === "syllabus" ? "bg-emerald-500/10 text-emerald-500" : "bg-sky-500/10 text-sky-500"
                    }`}>
                      {previewTemplate.type === "syllabus" ? "Silabus & ATP" : "RPP / Modul Ajar"}
                    </span>
                    <span className={`text-[9px] font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Kelas {previewTemplate.config.kelas} / Fase {previewTemplate.config.fase}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm line-clamp-1 mt-0.5">{previewTemplate.title}</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
                  darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-Header Tabs Row */}
            <div className={`px-6 py-2.5 flex items-center gap-1.5 border-b text-[11px] font-black uppercase tracking-wider overflow-x-auto select-none ${
              darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-100"
            }`}>
              {previewTemplate.type === "syllabus" ? (
                <>
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      activeTab === "info"
                        ? "bg-[#014AAD] text-white border-[#014AAD]"
                        : darkMode
                          ? "bg-slate-850 hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Informasi Umum
                  </button>
                  <button
                    onClick={() => setActiveTab("struktur")}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      activeTab === "struktur"
                        ? "bg-[#014AAD] text-white border-[#014AAD]"
                        : darkMode
                          ? "bg-slate-850 hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Struktur Silabus (ATP)
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      activeTab === "info"
                        ? "bg-[#014AAD] text-white border-[#014AAD]"
                        : darkMode
                          ? "bg-slate-850 hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Informasi & Tujuan
                  </button>
                  <button
                    onClick={() => setActiveTab("kegiatan")}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      activeTab === "kegiatan"
                        ? "bg-[#014AAD] text-white border-[#014AAD]"
                        : darkMode
                          ? "bg-slate-850 hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Langkah Pembelajaran
                  </button>
                  <button
                    onClick={() => setActiveTab("asesmen")}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      activeTab === "asesmen"
                        ? "bg-[#014AAD] text-white border-[#014AAD]"
                        : darkMode
                          ? "bg-slate-850 hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Asesmen & Lampiran
                  </button>
                </>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-custom space-y-5">
              
              {/* --- SYLLABUS PREVIEW --- */}
              {previewTemplate.type === "syllabus" && (
                <>
                  {activeTab === "info" && (
                    <div className="space-y-4">
                      {/* CP Box */}
                      <div className={`p-4 rounded-xl border ${
                        darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-emerald-500/5 border-emerald-500/10"
                      }`}>
                        <div className="flex items-center gap-2 mb-2 text-emerald-500">
                          <Compass size={16} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Capaian Pembelajaran (CP)</span>
                        </div>
                        <p className="text-[11px] leading-relaxed font-semibold">
                          {previewTemplate.data.capaianPembelajaran}
                        </p>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Mata Pelajaran</span>
                          <span className="text-xs font-bold">{previewTemplate.config.mapel}</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Total Alokasi Waktu</span>
                          <span className="text-xs font-bold text-[#014AAD] dark:text-[#FBBF24]">{previewTemplate.data.alokasiWaktuTotal}</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Fase / Kelas/ Semester</span>
                          <span className="text-xs font-bold">Fase {previewTemplate.config.fase} - Kelas {previewTemplate.config.kelas} ({previewTemplate.config.semester})</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Penyusun Referensi</span>
                          <span className="text-xs font-bold">{previewTemplate.config.guru}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "struktur" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-[#014AAD] dark:text-[#FBBF24]" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Alur & Kelengkapan KBM</span>
                      </div>

                      <div className="space-y-3">
                        {previewTemplate.data.tabelSilabus.map((item: SyllabusItem, idx: number) => (
                          <div 
                            key={idx}
                            className={`p-4 rounded-xl border text-left space-y-2.5 hover:border-[#014AAD]/20 transition-colors ${
                              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 border-b pb-1.5 border-slate-500/10">
                              <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase bg-[#014AAD]/10 text-[#014AAD] dark:text-amber-400 dark:bg-amber-500/10">
                                Unit {idx + 1}: {item.materiPokok}
                              </span>
                              <span className="text-[9px] font-extrabold text-slate-400 flex items-center gap-1">
                                <Clock size={10} />
                                {item.alokasiWaktu}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 block">Tujuan Pembelajaran (TP)</span>
                                <p className="text-[11px] leading-relaxed font-bold">{item.tujuanPembelajaran}</p>
                              </div>
                              <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 block">Metode Pembelajaran / Aktivitas KBM</span>
                                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.kegiatanPembelajaran}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-500/10">
                              <span className="text-[9px] font-bold uppercase tracking-tight py-0.5 px-1.5 rounded bg-amber-500/10 text-amber-600 font-black">
                                Pp: {item.profilPancasila}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-tight py-0.5 px-1.5 rounded bg-pink-500/10 text-pink-600 font-black">
                                Asesmen: {item.penilaian}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* --- RPP PREVIEW --- */}
              {previewTemplate.type === "rpp" && (
                <>
                  {activeTab === "info" && (
                    <div className="space-y-4">
                      {/* General Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border text-left ${darkMode ? "bg-slate-900 border-slate-800" : "bg-[#014AAD]/5 border-[#014AAD]/10"}`}>
                          <div className="flex items-center gap-1.5 text-[#014AAD] dark:text-[#FBBF24] mb-1.5">
                            <Compass size={14} />
                            <span className="text-[9px] font-black uppercase tracking-wider">Kompetensi Awal</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            {previewTemplate.data.kompetensiAwal}
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl border text-left ${darkMode ? "bg-slate-900 border-slate-800" : "bg-[#014AAD]/5 border-[#014AAD]/10"}`}>
                          <div className="flex items-center gap-1.5 text-emerald-500 mb-1.5">
                            <Award size={14} />
                            <span className="text-[9px] font-black uppercase tracking-wider">Pendekatan & Model</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            {previewTemplate.data.modelPembelajaran}
                          </p>
                        </div>
                      </div>

                      {/* TP Box */}
                      <div className={`p-4 rounded-xl border text-left ${darkMode ? "bg-slate-900 border-[#014AAD]/20" : "bg-white border-slate-100 shadow-xs"}`}>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Tujuan Utama Pembelajaran</span>
                        <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed font-bold">
                          {previewTemplate.data.tujuanPembelajaran.map((tpCount: string, tpIdx: number) => (
                            <li key={tpIdx}>{tpCount}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
                      <div className={`p-4 rounded-xl border text-left ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Pemahaman Bermakna</span>
                            <p className="text-[11px] font-medium leading-relaxed">{previewTemplate.data.pemahamanBermakna}</p>
                          </div>
                          <div className="pt-2.5 border-t border-slate-500/10">
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Pertanyaan Pemantik</span>
                            <div className="space-y-1">
                              {previewTemplate.data.pertanyaanPemantik.map((pemCount: string, pemIdx: number) => (
                                <p key={pemIdx} className="text-[11px] font-bold text-[#014AAD] dark:text-[#FBBF24]">💡 {pemCount}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "kegiatan" && (
                    <div className="space-y-4 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-[#014AAD]" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Tahapan Kegiatan Belajar Mengajar (KBM)</span>
                      </div>

                      <div className="space-y-3">
                        {previewTemplate.data.kegiatanPembelajaran.map((act: KegiatanPembelajaranItem, actIdx: number) => (
                          <div
                            key={actIdx}
                            className={`p-4 rounded-xl border overflow-hidden ${
                              act.kategori.toLowerCase().includes("pendahuluan")
                                ? "border-emerald-500/10 bg-emerald-500/5 dark:bg-slate-900/60 dark:border-emerald-500/10"
                                : act.kategori.toLowerCase().includes("inti")
                                  ? "border-sky-500/10 bg-sky-500/5 dark:bg-slate-900/60 dark:border-[#014AAD]/20"
                                  : "border-amber-500/10 bg-amber-500/5 dark:bg-slate-900/60 dark:border-amber-500/10"
                            }`}
                          >
                            <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-500/10">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-[#FBBF24]">
                                {act.kategori}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-tight py-0.5 px-2 bg-slate-500/10 rounded-md text-slate-500">
                                ⌛ {act.alokasiWaktu}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed whitespace-pre-wrap font-medium">
                              {act.deskripsi}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "asesmen" && (
                    <div className="space-y-4 text-left">
                      {/* Asesmen Card */}
                      <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xs"}`}>
                        <div className="flex items-center gap-1.5 text-[#014AAD] dark:text-[#FBBF24] mb-3">
                          <ClipboardCheck size={15} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Desain Penilaian (Asesmen)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-pink-500/5 rounded-xl border border-pink-500/10">
                            <span className="text-[9px] font-black uppercase text-pink-600 block mb-0.5">Diagnostik</span>
                            <p className="text-[11px] leading-relaxed">{previewTemplate.data.asesmen.diagnostik}</p>
                          </div>
                          <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                            <span className="text-[9px] font-black uppercase text-purple-600 block mb-0.5">Formatif</span>
                            <p className="text-[11px] leading-relaxed">{previewTemplate.data.asesmen.formatif}</p>
                          </div>
                          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                            <span className="text-[9px] font-black uppercase text-indigo-600 block mb-0.5">Sumatif</span>
                            <p className="text-[11px] leading-relaxed">{previewTemplate.data.asesmen.sumatif}</p>
                          </div>
                        </div>
                      </div>

                      {/* Rubrik Penilaian */}
                      <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Rubrik Penilaian & Evaluasi</span>
                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap font-medium">
                          {previewTemplate.data.rubrikPenilaian}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Footer actions */}
            <div className={`px-6 py-4 flex items-center justify-end gap-3 border-t ${
              darkMode ? "bg-[#0f1d3a] border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                  darkMode 
                    ? "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-850" 
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                Tutup Pratinjau
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadTemplate(previewTemplate.type, previewTemplate.config, previewTemplate.data);
                  setPreviewTemplate(null);
                }}
                className="px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white bg-[#014AAD] hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-[0.98]"
              >
                <Sparkles size={11} className="text-[#FBBF24]" />
                <span>Gunakan & Muat ke Form</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


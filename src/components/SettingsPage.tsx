import React from "react";
import { SchoolConfig } from "../types";
import { Save, School, GraduationCap, Clock, CheckCircle } from "lucide-react";

interface SettingsPageProps {
  schoolConfig: SchoolConfig;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  darkMode: boolean;
}

export default function SettingsPage({
  schoolConfig,
  onUpdateSchoolConfig,
  darkMode
}: SettingsPageProps) {

  const handleFieldChange = (field: keyof SchoolConfig, value: string) => {
    onUpdateSchoolConfig({
      ...schoolConfig,
      [field]: value
    });
  };

  const triggerSaveNotification = () => {
    alert("Profil Sekolah & Pendidik berhasil disinkronisasi untuk seluruh generator secara global!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] block">Profil Guru & Sekolah</h2>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500 font-medium"}`}>
          Konfigurasikan identitas dinas pendidikan Anda untuk mengisi Kepala Surat (Kop), rincian administrasi mengajar, dan panel Tanda Tangan cetak secara otomatis.
        </p>
      </div>

      <div id="tour-settings-view" className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
        
        {/* Identitas Sekolah Card */}
        <div className={`p-5 rounded-2xl border space-y-4 shadow-sm accent-shadow ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10"
        }`}>
          <h4 className="font-extrabold text-sm tracking-tight text-[#014AAD] dark:text-[#FBBF24] uppercase flex items-center gap-1.5 border-b pb-2.5 border-slate-500/10">
            <School size={16} className="text-[#014AAD] dark:text-amber-400" /> Identitas Satuan Pendidikan
          </h4>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">Nama Sekolah Dasar (SD)</label>
              <input
                type="text"
                value={schoolConfig.sekolah}
                onChange={(e) => handleFieldChange("sekolah", e.target.value)}
                placeholder="Misal: SD Negeri 1 Menteng"
                className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">NPSN Sekolah (Nomor Registrasi)</label>
              <input
                type="text"
                value={schoolConfig.npsn}
                onChange={(e) => handleFieldChange("npsn", e.target.value)}
                placeholder="Misal: 20104123"
                className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">Alamat Sekolah Lengkap</label>
              <textarea
                value={schoolConfig.alamat}
                onChange={(e) => handleFieldChange("alamat", e.target.value)}
                rows={3}
                placeholder="Misal: Jl. Salemba Raya No. 12, Menteng, DKI Jakarta"
                className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Identitas Guru & Kepala Sekolah Card */}
        <div className={`p-5 rounded-2xl border space-y-4 shadow-sm accent-shadow ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#014AAD]/10"
        }`}>
          <h4 className="font-extrabold text-sm tracking-tight text-[#014AAD] dark:text-[#FBBF24] uppercase flex items-center gap-1.5 border-b pb-2.5 border-slate-500/10">
            <GraduationCap size={16} className="text-[#014AAD] dark:text-amber-400" /> Data Guru & Kepala Urusan
          </h4>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">Nama Lengkap Guru</label>
                <input
                  type="text"
                  value={schoolConfig.guru}
                  onChange={(e) => handleFieldChange("guru", e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">NIP Guru</label>
                <input
                  type="text"
                  value={schoolConfig.nip}
                  onChange={(e) => handleFieldChange("nip", e.target.value)}
                  placeholder="Isi '-' jika non-PNS"
                  className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolConfig.kepalaSekolah}
                  onChange={(e) => handleFieldChange("kepalaSekolah", e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolConfig.nipKepalaSekolah}
                  onChange={(e) => handleFieldChange("nipKepalaSekolah", e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-black uppercase tracking-wider text-[10px] text-slate-400">Tahun Ajaran Aktif</label>
              <input
                type="text"
                value={schoolConfig.tahunAjaran}
                onChange={(e) => handleFieldChange("tahunAjaran", e.target.value)}
                placeholder="2025/2026"
                className={`w-full p-2.5 rounded-xl border focus:border-[#014AAD] focus:outline-none font-medium ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Synchronize Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={triggerSaveNotification}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase tracking-wider sidebar-gradient text-[#FBBF24] shadow-md shadow-[#014AAD]/10 cursor-pointer active:scale-98 transition text-xs"
        >
          <Save size={14} /> Synchronize Global Data
        </button>
      </div>

      {/* Sync success confirmation notes */}
      <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${
        darkMode ? "bg-slate-900 border-[#014AAD]/20 text-[#FBBF24]/80" : "bg-[#014AAD]/5 border-[#014AAD]/10 text-[#014AAD]"
      }`}>
        <CheckCircle size={16} className="mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="font-black text-[10px] uppercase tracking-wider">Pemberitahuan Otomatisasi (Auto-Sync)</p>
          <p className="text-[11px] leading-relaxed font-medium">
            Data sekolah, NPSN, nama Guru dsb yang Anda isi di halaman ini akan secara dinamis menyelinap masuk mengisi seluruh generator di panel kiri secara real-time. Anda tidak perlu mengetik nama sekolah berulang kali!
          </p>
        </div>
      </div>

    </div>
  );
}

import React, { useRef } from "react";
import { X, Printer, Download, Eye, Calendar, Award, Compass, BookOpen } from "lucide-react";
import { SchoolConfig, SyllabusData, RPPData, GenericDocData } from "../types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  title: string;
  schoolConfig: SchoolConfig;
  data: any; // Can be SyllabusData | RPPData | GenericDocData
  darkMode: boolean;
}

export default function PreviewModal({
  isOpen,
  onClose,
  type,
  title,
  schoolConfig,
  data,
  darkMode
}: PreviewModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    
    // Create print-specific minimal page layout
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                margin: 20mm 15mm 20mm 15mm;
                color: #000;
                background: #fff;
                font-size: 11pt;
                line-height: 1.5;
              }
              h1, h2, h3, h4, h5, h6 {
                font-family: Arial, Helvetica, sans-serif;
                margin: 6px 0;
                text-transform: uppercase;
                text-align: center;
              }
              .letterhead {
                border-bottom: 3px double #000;
                padding-bottom: 12px;
                margin-bottom: 20px;
                text-align: center;
              }
              .letterhead h2 { font-size: 14pt; font-weight: bold; }
              .letterhead h3 { font-size: 12pt; }
              .letterhead p { font-size: 9pt; margin: 3px 0; font-style: italic; }
              .doc-title {
                text-align: center;
                font-size: 13pt;
                font-weight: bold;
                margin: 20px 0 15px 0;
                text-decoration: underline;
              }
              .meta-table {
                width: 100%;
                margin-bottom: 15px;
                font-size: 10pt;
              }
              .meta-table td {
                padding: 3px 6px;
                vertical-align: top;
              }
              .meta-label {
                font-weight: bold;
                width: 150px;
              }
              .meta-dots {
                width: 15px;
                text-align: center;
              }
              table.data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 9.5pt;
              }
              table.data-table th, table.data-table td {
                border: 1px solid #000;
                padding: 6px 8px;
                vertical-align: top;
              }
              table.data-table th {
                background-color: #f2f2f2 !important;
                font-weight: bold;
                text-align: center;
              }
              .section-title {
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bold;
                font-size: 11pt;
                margin-top: 15px;
                margin-bottom: 5px;
                text-transform: uppercase;
              }
              .signature-container {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: 10.5pt;
              }
              .signature-block {
                width: 250px;
                text-align: center;
              }
              .signature-space {
                height: 70px;
              }
              .rt-content {
                margin-bottom: 8px;
              }
              @media print {
                body { margin: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const removeHtmlTags = (str: string) => {
    if (!str) return "";
    return str.replace(/<[^>]*>/g, "");
  };

  // Render Syllabus specific structures
  const renderSyllabusData = () => {
    const sData = data as SyllabusData;
    if (!sData) return null;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Capaian Pembelajaran (CP)</h4>
          <div 
            className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
            dangerouslySetInnerHTML={{ __html: sData.capaianPembelajaran }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Rincian Alur Pembelajaran</h4>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#014AAD]/10 text-[#014AAD] dark:text-amber-400">
              Total Alokasi: {sData.alokasiWaktuTotal}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-250 dark:border-slate-750 font-bold text-slate-600 dark:text-slate-300">
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-center w-8">No</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 w-44">Tujuan Pembelajaran</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 w-32">Materi Pokok</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800">Kegiatan Pembelajaran</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 w-28">Profil Pancasila</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 w-28">Penilaian</th>
                  <th className="p-2.5 w-16 text-center">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {sData.tabelSilabus?.map((row, idx) => (
                  <tr key={idx} className="align-top hover:bg-slate-50/40 dark:hover:bg-slate-900/30">
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-400">{idx+1}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                      <div dangerouslySetInnerHTML={{ __html: row.tujuanPembelajaran }} />
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                      <div dangerouslySetInnerHTML={{ __html: row.materiPokok }} />
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                      <div dangerouslySetInnerHTML={{ __html: row.kegiatanPembelajaran }} />
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{row.profilPancasila}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{row.penilaian}</td>
                    <td className="p-2.5 text-center text-[#014AAD] dark:text-amber-400 font-bold">{row.alokasiWaktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render RPP specific structures
  const renderRppData = () => {
    const rData = data as RPPData;
    if (!rData) return null;

    return (
      <div className="space-y-4 grid grid-cols-1 gap-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 space-y-2">
            <h5 className="font-extrabold uppercase text-[#014AAD] dark:text-amber-400 tracking-wider">I. Informasi Umum</h5>
            <p className="font-medium"><span className="text-slate-400 mr-1 font-bold">Kompetensi Awal:</span> {rData.kompetensiAwal}</p>
            <p className="font-medium">
              <span className="text-slate-400 mr-1 font-bold">Profil Pancasila:</span> 
              {rData.profilPancasila?.map((p, i) => (
                <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 mr-1 text-[10px] font-bold">
                  {p}
                </span>
              ))}
            </p>
            <p className="font-medium"><span className="text-slate-400 mr-1 font-bold">Sarana & Prasarana:</span> {rData.saranaPrasarana}</p>
            <p className="font-medium"><span className="text-slate-400 mr-1 font-bold">Target Peserta:</span> {rData.targetPesertaDidik}</p>
            <p className="font-medium"><span className="text-slate-400 mr-1 font-bold">Model Pembelajaran:</span> {rData.modelPembelajaran}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 space-y-2">
            <h5 className="font-extrabold uppercase text-[#014AAD] dark:text-amber-400 tracking-wider">II. Komponen Inti</h5>
            <div>
              <span className="text-slate-400 font-bold block mb-1">Tujuan Pembelajaran:</span>
              <ul className="list-disc pl-4 space-y-1">
                {rData.tujuanPembelajaran?.map((tp, idx) => (
                  <li key={idx} className="font-medium">{tp}</li>
                ))}
              </ul>
            </div>
            <p className="font-medium"><span className="text-slate-400 mr-1 font-bold">Pemahaman Bermakna:</span> {rData.pemahamanBermakna}</p>
            <div>
              <span className="text-slate-400 font-bold block mb-1">Pertanyaan Pemantik:</span>
              <ul className="list-disc pl-4 space-y-1">
                {rData.pertanyaanPemantik?.map((pp, idx) => (
                  <li key={idx} className="font-medium italic text-slate-600 dark:text-slate-350">"{pp}"</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Langkah Pembelajaran */}
        <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3">
          <h5 className="font-extrabold uppercase text-[#014AAD] dark:text-amber-400 tracking-wider">III. Langkah-Langkah Pembelajaran</h5>
          <div className="space-y-3">
            {rData.kegiatanPembelajaran?.map((keg, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${
                keg.kategori.toLowerCase().includes("inti") 
                  ? "bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100/50 dark:border-blue-900/30" 
                  : "bg-slate-50/45 dark:bg-slate-900/40"
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-xs text-[#014AAD] dark:text-amber-400 uppercase tracking-wide">{keg.kategori}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full">{keg.alokasiWaktu}</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300 font-medium" dangerouslySetInnerHTML={{ __html: keg.deskripsi }} />
              </div>
            ))}
          </div>
        </div>

        {/* Asesmen */}
        <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3">
          <h5 className="font-extrabold uppercase text-[#014AAD] dark:text-amber-400 tracking-wider">IV. Asesmen Penilaian</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded bg-slate-100/50 dark:bg-slate-900/50">
              <span className="font-bold text-[#014AAD] dark:text-amber-400 block mb-1">1. Diagnostik</span>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rData.asesmen?.diagnostik}</p>
            </div>
            <div className="p-2.5 rounded bg-slate-100/50 dark:bg-slate-900/50">
              <span className="font-bold text-[#014AAD] dark:text-amber-400 block mb-1">2. Formatif</span>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rData.asesmen?.formatif}</p>
            </div>
            <div className="p-2.5 rounded bg-slate-100/50 dark:bg-slate-900/50">
              <span className="font-bold text-[#014AAD] dark:text-amber-400 block mb-1">3. Sumatif</span>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rData.asesmen?.sumatif}</p>
            </div>
          </div>
        </div>

        {/* Remedial & LKPD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[#014AAD] dark:text-amber-400 uppercase tracking-wide block">V. Tindak Lanjut</span>
            <p><strong className="text-slate-400 font-bold block">Remedial:</strong> {rData.remedialAndPengayaan?.remedial}</p>
            <p className="mt-2"><strong className="text-slate-400 font-bold block">Pengayaan:</strong> {rData.remedialAndPengayaan?.pengayaan}</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[#014AAD] dark:text-amber-400 uppercase tracking-wide block">VI. Lembar Kerja Siswa & Rubrik</span>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded font-mono text-[10px] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto" dangerouslySetInnerHTML={{ __html: rData.lkpd }} />
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded font-mono text-[10px] whitespace-pre-wrap leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: rData.rubrikPenilaian }} />
          </div>
        </div>
      </div>
    );
  };

  // Render Generic educational documents (PROTA, PROMES, KKTP, ATP, CP, Jurnal)
  const renderGenericData = () => {
    const gData = data as GenericDocData;
    if (!gData) return null;

    return (
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80">
          <h4 className="font-black text-xs text-[#014AAD] dark:text-amber-400 uppercase mb-1">{gData.title}</h4>
          <p className="text-[11px] text-slate-450 dark:text-slate-400 mb-2 font-semibold italic">{gData.description}</p>
          <div className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: gData.content }} />
        </div>

        {gData.tables?.map((tbl, tIdx) => (
          <div key={tIdx} className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  <th className="p-2.5 border-r border-slate-150 dark:border-slate-850 text-center w-8">No</th>
                  {tbl.headers.map((h, hIdx) => (
                    <th key={hIdx} className="p-2.5 border-r border-slate-150 dark:border-slate-850 font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                {tbl.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="align-top hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-2.5 border-r border-slate-150 dark:border-slate-850 text-center font-bold text-slate-400">{rIdx + 1}</td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 border-r border-slate-150 dark:border-slate-850 font-semibold text-slate-700 dark:text-slate-250">
                        <div dangerouslySetInnerHTML={{ __html: cell }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const getCleanPrintType = () => {
    switch (type) {
      case "syllabus": return "ALUR TUJUAN PEMBELAJARAN (ATP) / SILABUS";
      case "rpp": return "RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR";
      case "atp": return "ALUR TUJUAN PEMBELAJARAN (ATP)";
      case "cp": return "ANALISIS CAPAIAN PEMBELAJARAN (CP)";
      case "prota": return "PROGRAM TAHUNAN (PROTA)";
      case "promes": return "PROGRAM SEMESTER (PROMES)";
      case "kktp": return "KRITERIA KETUNTASAN TUJUAN PEMBELAJARAN (KKTP)";
      case "jurnal": return "JURNAL HARIAN MENGAJAR GURU";
      default: return title.toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div 
        id="document-preview-modal"
        className={`relative w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all border ${
          darkMode 
            ? "bg-slate-950 border-slate-800 text-slate-100" 
            : "bg-white border-slate-100 text-slate-800"
        }`}
      >
        {/* Modal Top Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#014AAD] dark:text-amber-400">
              <Eye size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#014AAD] dark:text-amber-400">Pratinjau Cetak Formal</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Format Dokumen Negara / Sekolah</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase bg-[#014AAD] hover:bg-[#003480] text-white transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center"
              title="Cetak Dokumen / Simpan PDF"
            >
              <Printer size={13} className="stroke-[2.5]" />
              <span>Cetak Hasil</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto px-6 py-8 bg-slate-100 dark:bg-slate-900/60 scrollbar-custom">
          
          {/* Printable White-Sheet Simulation A4 */}
          <div 
            ref={printRef}
            className="w-full max-w-4xl mx-auto p-8 sm:p-12 md:p-14 bg-white text-black shadow-xl rounded-2xl font-serif text-sm border border-slate-200 leading-relaxed pr-8 pl-8 select-text"
            style={{ 
              fontFamily: "'Times New Roman', Times, serif",
              color: "#000000"
            }}
          >
            {/* Indonesian Formal Letterhead (KOP SURAT) */}
            <div className="text-center space-y-1 pb-4 mb-5 border-b-4 border-double border-black" style={{ borderBottom: "4px double black" }}>
              <h4 className="text-sm font-bold tracking-tight uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt" }}>
                PEMERINTAH KABUPATEN / KOTA ADMINISTRASI
              </h4>
              <h3 className="text-base font-extrabold uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "14pt" }}>
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h3>
              <h2 className="text-lg font-black uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "16pt", textDecoration: "underline" }}>
                {schoolConfig.sekolah || "SD NEGERI MERDEKA UTAMA"}
              </h2>
              <p className="text-[10px] italic font-medium" style={{ fontFamily: "Arial, sans-serif", fontSize: "9pt", fontStyle: "italic" }}>
                NPSN: {schoolConfig.npsn || "10293847"} | Alamat: Rukun Tetangga No. 04, Jakarta Raya | Email: info@sekolahdasar.sch.id
              </p>
            </div>

            {/* Document formal Title */}
            <div className="text-center space-y-1 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-tight" style={{ fontFamily: "Arial, sans-serif", fontSize: "13pt", textDecoration: "underline" }}>
                {getCleanPrintType()}
              </h3>
              <h4 className="text-xs font-semibold uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt" }}>
                TAHUN AJARAN {schoolConfig.tahunAjaran || "2025/2026"}
              </h4>
            </div>

            {/* Profil Sekolah / Meta parameters block */}
            <table className="w-full mb-6 text-xs" style={{ fontSize: "10pt" }}>
              <tbody>
                <tr>
                  <td className="font-bold py-1 w-40" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Mata Pelajaran</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1">{schoolConfig.mapel || "Tematik Terpadu"}</td>

                  <td className="font-bold py-1 w-40 pl-8" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Kelas / Fase</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1">{schoolConfig.kelas || "IV"} / {schoolConfig.fase || "B"}</td>
                </tr>
                <tr>
                  <td className="font-bold py-1" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Semester</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1 uppercase">{schoolConfig.semester || "Ganjil"}</td>

                  <td className="font-bold py-1 pl-8" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Alokasi Waktu</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1">Sesuai Rincian Kegiatan</td>
                </tr>
                <tr>
                  <td className="font-bold py-1" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Kurikulum</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1">Kurikulum Merdeka Mandiri Belajar</td>

                  <td className="font-bold py-1 pl-8" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>Pendidik / NIP</td>
                  <td className="text-center px-2 py-1">:</td>
                  <td className="py-1">{schoolConfig.guru || "Guru Kelas"} / NIP. {schoolConfig.nip || "-"}</td>
                </tr>
              </tbody>
            </table>

            {/* Main Interactive render Area */}
            <div className="mt-4 text-xs select-text text-black prose prose-sm max-w-none" style={{ fontFamily: "Georgia, serif", fontSize: "10pt", color: "#000000" }}>
              {type === "syllabus" ? renderSyllabusData() : null}
              {type === "rpp" ? renderRppData() : null}
              {!["syllabus", "rpp"].includes(type) ? renderGenericData() : null}
            </div>

            {/* Signature Block (Tanda Tangan) */}
            <div className="mt-12 w-full flex justify-between" style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt" }}>
              <div className="text-center w-60">
                <p>Mengetahui,</p>
                <p className="font-bold uppercase">Kepala Sekolah</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{schoolConfig.kepalaSekolah || "Nama Kepala Sekolah, S.Pd"}</p>
                <p className="text-[10px] text-slate-500">NIP. {schoolConfig.nipKepalaSekolah || "19830219 201012 1 002"}</p>
              </div>

              <div className="text-center w-60">
                <p>Jakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="font-bold uppercase">Guru Mata Pelajaran</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{schoolConfig.guru || "Guru Kelas Utama, S.Pd"}</p>
                <p className="text-[10px] text-slate-500">NIP. {schoolConfig.nip || "-"}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Info Panel */}
        <div className={`px-6 py-3 border-t text-[10px] font-bold text-slate-400 flex flex-col sm:flex-row justify-between items-center shrink-0 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
        }`}>
          <span>💡 Pembelajaran Merdeka SD - Pratinjau Dokumen Siap Cetak</span>
          <span>Tahun Penerbitan: {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

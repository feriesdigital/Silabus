import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, TextRun } from "docx";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SchoolConfig, SyllabusData, RPPData, GenericDocData } from "../types";

// Helper to remove HTML tags and format newlines and lists from rich text
const stripHtml = (htmlContent: string) => {
  if (!htmlContent) return "";
  let text = htmlContent;
  text = text.replace(/<p><br><\/p>/g, '\n');
  text = text.replace(/<\/p><p>/g, '\n');
  text = text.replace(/<br\s*\/?>/g, '\n');
  text = text.replace(/<\/li><li>/g, '\n- ');
  text = text.replace(/<li>/g, '- ');
  text = text.replace(/<\/p>/g, '');
  text = text.replace(/<[^>]*>?/gm, '');
  
  // HTML entities decoding basic
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  return text.trim();
};

// Helper to save blobs in browser
const saveFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 1. Generate DOCX for Syllabus
export const exportSyllabusToDocx = async (config: SchoolConfig, data: SyllabusData) => {
  const tableRows = [
    new TableRow({
      children: [
        "No", "Tujuan Pembelajaran (TP)", "Materi Pokok", "Kegiatan Pembelajaran", 
        "Profil Pelajar Pancasila", "Asesmen/Penilaian", "Alokasi Waktu", "Sumber Belajar"
      ].map(text => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
        width: { size: text === "No" ? 5 : 15, type: WidthType.PERCENTAGE }
      }))
    }),
    ...data.tabelSilabus.map((item, index) => new TableRow({
      children: [
        `${index + 1}`,
        stripHtml(item.tujuanPembelajaran),
        stripHtml(item.materiPokok),
        stripHtml(item.kegiatanPembelajaran),
        stripHtml(item.profilPancasila),
        stripHtml(item.penilaian),
        stripHtml(item.alokasiWaktu),
        stripHtml(item.sumberBelajar)
      ].map(text => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text })] })],
        width: { size: 12, type: WidthType.PERCENTAGE }
      }))
    }))
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "SILABUS / ALUR TUJUAN PEMBELAJARAN (ATP) SD", bold: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `TAHUN AJARAN ${config.tahunAjaran} - SEMESTER ${config.semester}`, bold: true })]
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: "Nama Sekolah : ", bold: true }), new TextRun({ text: config.sekolah || "-" })] }),
        new Paragraph({ children: [new TextRun({ text: "Mata Pelajaran: ", bold: true }), new TextRun({ text: config.mapel || "-" })] }),
        new Paragraph({ children: [new TextRun({ text: "Kelas / Fase : ", bold: true }), new TextRun({ text: `${config.kelas || "-"} / ${config.fase || "-"}` })] }),
        new Paragraph({ children: [new TextRun({ text: "Nama Guru     : ", bold: true }), new TextRun({ text: config.guru || "-" })] }),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: "Capaian Pembelajaran (CP):", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: stripHtml(data.capaianPembelajaran) })] }),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: `Alokasi Waktu Total: ${data.alokasiWaktuTotal || "-"}`, bold: true })] }),
        new Paragraph({ text: "" }),
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        // Signatures Row
        new Paragraph({ text: `Mengetahui,\t\t\t\t\t\tJakarta Utara, ${new Date().toLocaleDateString("id-ID")}` }),
        new Paragraph({ text: `Kepala Sekolah,\t\t\t\t\tGuru Mata Pelajaran,` }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: `${config.kepalaSekolah || "..................."}\t\t\t\t\t${config.guru || "..................."}` }),
        new Paragraph({ text: `NIP. ${config.nipKepalaSekolah || "-"}\t\t\t\t\tNIP. ${config.nip || "-"}` }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveFile(blob, `Silabus_${config.mapel}_Kelas_${config.kelas}.docx`);
};

// 2. Generate DOCX for RPP
export const exportRPPToDocx = async (config: SchoolConfig, data: RPPData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR", bold: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "KURIKULUM MERDEKA SD", bold: true })]
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "I. IDENTITAS MODUL", bold: true })] }),
        new Paragraph({ text: `Nama Sekolah        : ${config.sekolah}` }),
        new Paragraph({ text: `Mata Pelajaran      : ${config.mapel}` }),
        new Paragraph({ text: `Kelas / Semester    : ${config.kelas} / ${config.semester}` }),
        new Paragraph({ text: `Fase                : ${config.fase}` }),
        new Paragraph({ text: `Alokasi Waktu       : ${data.kegiatanPembelajaran.reduce((acc, curr) => acc + " + " + curr.alokasiWaktu, "").substring(3) || "Sesuai Jadwal"}` }),
        new Paragraph({ text: `Nama Guru           : ${config.guru}` }),
        new Paragraph({ text: "" }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "II. KOMPETENSI AWAL", bold: true })] }),
        new Paragraph({ text: stripHtml(data.kompetensiAwal) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "III. PROFIL PELAJAR PANCASILA", bold: true })] }),
        new Paragraph({ text: stripHtml(data.profilPancasila.join(", ")) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "IV. SARANA DAN PRASARANA", bold: true })] }),
        new Paragraph({ text: stripHtml(data.saranaPrasarana) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "V. TARGET PESERTA DIDIK", bold: true })] }),
        new Paragraph({ text: stripHtml(data.targetPesertaDidik) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "VI. MODEL PEMBELAJARAN", bold: true })] }),
        new Paragraph({ text: stripHtml(data.modelPembelajaran) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "VII. TUJUAN PEMBELAJARAN (TP)", bold: true })] }),
        ...data.tujuanPembelajaran.map(tp => new Paragraph({ text: `- ${tp}` })),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "VIII. PEMAHAMAN BERMAKNA", bold: true })] }),
        new Paragraph({ text: stripHtml(data.pemahamanBermakna) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "IX. PERTANYAAN PEMANTIK", bold: true })] }),
        ...data.pertanyaanPemantik.map(p => new Paragraph({ text: `? ${p}` })),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "X. KEGIATAN PEMBELAJARAN", bold: true })] }),
        ...data.kegiatanPembelajaran.flatMap(keg => [
          new Paragraph({ children: [new TextRun({ text: `■ ${keg.kategori} (${keg.alokasiWaktu})`, bold: true })] }),
          new Paragraph({ text: stripHtml(keg.deskripsi) }),
          new Paragraph({ text: "" })
        ]),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "XI. ASESMEN & EVALUASI", bold: true })] }),
        new Paragraph({ text: `1. Diagnostik: ${data.asesmen.diagnostik}` }),
        new Paragraph({ text: `2. Formatif: ${data.asesmen.formatif}` }),
        new Paragraph({ text: `3. Sumatif: ${data.asesmen.sumatif}` }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "XII. REMEDIAL & PENGAYAAN", bold: true })] }),
        new Paragraph({ text: `Remedial: ${stripHtml(data.remedialAndPengayaan.remedial)}` }),
        new Paragraph({ text: `Pengayaan: ${stripHtml(data.remedialAndPengayaan.pengayaan)}` }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "XIII. LAMPIRAN LKPD", bold: true })] }),
        new Paragraph({ text: stripHtml(data.lkpd) }),
        new Paragraph({ text: "" }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "XIV. RUBRIK PENILAIAN", bold: true })] }),
        new Paragraph({ text: stripHtml(data.rubrikPenilaian) }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "" }),
        new Paragraph({ text: `Mengetahui,\t\t\t\t\t\t\tGuru Kelas,` }),
        new Paragraph({ text: `${config.kepalaSekolah || "..................."}\t\t\t\t\t${config.guru || "..................."}` }),
        new Paragraph({ text: `NIP. ${config.nipKepalaSekolah || "-"}\t\t\t\t\tNIP. ${config.nip || "-"}` }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveFile(blob, `RPP_${config.mapel}_Kelas_${config.kelas}.docx`);
};

// 3. Export Syllabus to Excel XLSX
export const exportSyllabusToXlsx = async (config: SchoolConfig, data: SyllabusData) => {
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet("Data Sekolah");
  
  // Format info
  sheet1.columns = [{ width: 25 }, { width: 50 }];
  sheet1.addRow(["IDENTITAS SILABUS SD"]).font = { size: 14, bold: true };
  sheet1.addRow([]);
  sheet1.addRow(["Nama Sekolah", config.sekolah]);
  sheet1.addRow(["NPSN", config.npsn]);
  sheet1.addRow(["Alamat", config.alamat]);
  sheet1.addRow(["Tahun Ajaran", config.tahunAjaran]);
  sheet1.addRow(["Semester", config.semester]);
  sheet1.addRow(["Kelas / Fase", `${config.kelas} / ${config.fase}`]);
  sheet1.addRow(["Mata Pelajaran", config.mapel]);
  sheet1.addRow(["Nama Guru", config.guru]);
  sheet1.addRow(["NIP Guru", config.nip]);
  sheet1.addRow(["Kepala Sekolah", config.kepalaSekolah]);
  sheet1.addRow(["Capaian Pembelajaran (CP)", stripHtml(data.capaianPembelajaran)]);

  const sheet2 = workbook.addWorksheet("Silabus");
  sheet2.addRow(["TABEL SILABUS / ALUR TUJUAN PEMBELAJARAN (ATP)"]).font = { bold: true, size: 13 };
  sheet2.addRow([]);
  
  const headers = ["No", "Tujuan Pembelajaran", "Materi Pokok", "Kegiatan Pembelajaran", "Profil Pancasila", "Kriteria Penilaian", "Alokasi Waktu", "Sumber Belajar"];
  sheet2.addRow(headers).font = { bold: true };
  
  data.tabelSilabus.forEach((item, index) => {
    sheet2.addRow([
      index + 1,
      stripHtml(item.tujuanPembelajaran),
      stripHtml(item.materiPokok),
      stripHtml(item.kegiatanPembelajaran),
      stripHtml(item.profilPancasila),
      stripHtml(item.penilaian),
      stripHtml(item.alokasiWaktu),
      stripHtml(item.sumberBelajar)
    ]);
  });

  sheet2.columns = [
    { width: 5 }, { width: 30 }, { width: 20 }, { width: 35 }, { width: 20 }, { width: 20 }, { width: 12 }, { width: 25 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  saveFile(new Blob([buffer]), `Silabus_${config.mapel}_Kelas_${config.kelas}.xlsx`);
};

// 4. Export RPP to Excel XLSX
export const exportRPPToXlsx = async (config: SchoolConfig, data: RPPData) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("RPP");
  
  sheet.columns = [{ width: 28 }, { width: 65 }];
  
  sheet.addRow(["MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)"]).font = { size: 14, bold: true };
  sheet.addRow([]);
  
  sheet.addRow(["A. IDENTITAS UMUM", ""]).font = { bold: true };
  sheet.addRow(["Nama Sekolah", config.sekolah]);
  sheet.addRow(["Mata Pelajaran", config.mapel]);
  sheet.addRow(["Kelas / Semester / Fase", `${config.kelas} / ${config.semester} / ${config.fase}`]);
  sheet.addRow(["Penyusun", config.guru]);
  sheet.addRow(["NIP", config.nip]);
  sheet.addRow([]);
  
  sheet.addRow(["B. KOMPETENSI INTI", ""]).font = { bold: true };
  sheet.addRow(["Kompetensi Awal", data.kompetensiAwal]);
  sheet.addRow(["Profil Pelajar Pancasila", data.profilPancasila.join(", ")]);
  sheet.addRow(["Sarana Prasarana", data.saranaPrasarana]);
  sheet.addRow(["Target Peserta Didik", data.targetPesertaDidik]);
  sheet.addRow(["Model Pembelajaran", data.modelPembelajaran]);
  sheet.addRow(["Tujuan Pembelajaran", data.tujuanPembelajaran.join("\n")]);
  sheet.addRow(["Pemahaman Bermakna", stripHtml(data.pemahamanBermakna)]);
  sheet.addRow(["Pertanyaan Pemantik", data.pertanyaanPemantik.join("\n")]);
  sheet.addRow([]);
  
  sheet.addRow(["C. LANGKAH PEMBELAJARAN", ""]).font = { bold: true };
  data.kegiatanPembelajaran.forEach(keg => {
    sheet.addRow([`Kategori: ${keg.kategori} (${keg.alokasiWaktu})`, stripHtml(keg.deskripsi)]);
  });
  sheet.addRow([]);

  sheet.addRow(["D. ASESMEN & EVALUASI", ""]).font = { bold: true };
  sheet.addRow(["Asesmen Diagnostik", data.asesmen.diagnostik]);
  sheet.addRow(["Asesmen Formatif", data.asesmen.formatif]);
  sheet.addRow(["Asesmen Sumatif", data.asesmen.sumatif]);
  sheet.addRow([]);

  sheet.addRow(["E. REMEDIAL & PENGAYAAN", ""]).font = { bold: true };
  sheet.addRow(["Remedial", stripHtml(data.remedialAndPengayaan.remedial)]);
  sheet.addRow(["Pengayaan", stripHtml(data.remedialAndPengayaan.pengayaan)]);

  const buffer = await workbook.xlsx.writeBuffer();
  saveFile(new Blob([buffer]), `RPP_${config.mapel}_Kelas_${config.kelas}.xlsx`);
};

// 5. Export Generic Documents (ATP, CP, Prota, Promes, KKTP, Jurnal) to Docx
export const exportGenericToDocx = async (config: SchoolConfig, title: string, data: GenericDocData) => {
  const tableRows: TableRow[] = [];
  if (data.tables && data.tables.length > 0) {
    const tableData = data.tables[0];
    tableRows.push(
      new TableRow({
        children: tableData.headers.map(h => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
          width: { size: 100 / tableData.headers.length, type: WidthType.PERCENTAGE }
        }))
      })
    );
    tableData.rows.forEach(row => {
      tableRows.push(
        new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: stripHtml(cell) })] })],
            width: { size: 100 / tableData.headers.length, type: WidthType.PERCENTAGE }
          }))
        })
      );
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${title.toUpperCase()} SD`, bold: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `KURIKULUM MERDEKA - TAHUN AJARAN ${config.tahunAjaran}`, bold: true })]
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: "Nama Sekolah : ", bold: true }), new TextRun({ text: config.sekolah || "-" })] }),
        new Paragraph({ children: [new TextRun({ text: "Mata Pelajaran: ", bold: true }), new TextRun({ text: config.mapel || "-" })] }),
        new Paragraph({ children: [new TextRun({ text: "Kelas / Fase : ", bold: true }), new TextRun({ text: `${config.kelas || "-"} / ${config.fase || "-"}` })] }),
        new Paragraph({ children: [new TextRun({ text: "Nama Guru     : ", bold: true }), new TextRun({ text: config.guru || "-" })] }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: `Deskripsi: ${data.description}` }),
        new Paragraph({ text: "" }),
        ...stripHtml(data.content).split("\n").map(line => new Paragraph({ text: line })),
        new Paragraph({ text: "" }),
        ...(tableRows.length > 0 ? [new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })] : []),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: `Kepala Sekolah,\t\t\t\t\t\tPendidik,` }),
        new Paragraph({ text: `${config.kepalaSekolah || "..................."}\t\t\t\t\t${config.guru || "..................."}` }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveFile(blob, `${title.replace(/\s+/g, "_")}_${config.mapel}_Kelas_${config.kelas}.docx`);
};

// 6. Export Generic Documents inside Excel Sheets
export const exportGenericToXlsx = async (config: SchoolConfig, title: string, data: GenericDocData) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title.substring(0, 30));
  sheet.columns = [{ width: 25 }, { width: 70 }];

  sheet.addRow([`${title.toUpperCase()} SD`]).font = { size: 13, bold: true };
  sheet.addRow(["Sekolah", config.sekolah]);
  sheet.addRow(["Guru", config.guru]);
  sheet.addRow(["Kelas / Fase / Mapel", `${config.kelas} / ${config.fase} / ${config.mapel}`]);
  sheet.addRow([]);

  sheet.addRow(["Deskripsi", data.description]);
  sheet.addRow([]);

  sheet.addRow(["NARASI AKADEMIK / ANALISIS"]).font = { bold: true };
  stripHtml(data.content).split("\n").forEach(line => {
    if (line.trim()) sheet.addRow(["", line]);
  });

  if (data.tables && data.tables.length > 0) {
    sheet.addRow([]);
    sheet.addRow(["TABEL ADMINISTRASI"]).font = { bold: true };
    const tableData = data.tables[0];
    sheet.addRow(tableData.headers).font = { bold: true };
    tableData.rows.forEach(row => {
      sheet.addRow(row.map(cell => stripHtml(cell)));
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveFile(new Blob([buffer]), `${title.replace(/\s+/g, "_")}_${config.mapel}.xlsx`);
};

// 7. Export Syllabus to PDF using jsPDF & jspdf-autotable
export const exportSyllabusToPdf = (config: SchoolConfig, data: SyllabusData) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
  // Title Header (Kop Surat & Title)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SILABUS / ALUR TUJUAN PEMBELAJARAN (ATP) SD", 148.5, 15, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(`TAHUN AJARAN ${config.tahunAjaran || "-"} - SEMESTER ${config.semester || "-"}`, 148.5, 20, { align: "center" });
  
  // Horizontal divider line
  doc.setLineWidth(0.5);
  doc.line(15, 23, 282, 23);
  
  // School and teacher info (Metadata grid)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  
  const col1Left = 15;
  const col2Left = 110;
  const col3Left = 200;
  
  doc.text(`Nama Sekolah : ${config.sekolah || "-"}`, col1Left, 29);
  doc.text(`Mata Pelajaran: ${config.mapel || "-"}`, col1Left, 33.5);
  doc.text(`Kelas / Fase  : ${config.kelas || "-"} / ${config.fase || "-"}`, col1Left, 38);
  
  doc.text(`NPSN Sekolah : ${config.npsn || "-"}`, col2Left, 29);
  doc.text(`Nama Guru     : ${config.guru || "-"}`, col2Left, 33.5);
  doc.text(`NIP Guru      : ${config.nip || "-"}`, col2Left, 38);

  doc.text(`Alamat Sekolah: ${config.alamat || "-"}`, col3Left, 29);
  doc.text(`Alokasi Waktu : ${data.alokasiWaktuTotal || "-"}`, col3Left, 33.5);
  
  // Capaian Pembelajaran (CP) Segment
  doc.setFont("helvetica", "bold");
  doc.text("Capaian Pembelajaran (CP):", 15, 45);
  doc.setFont("helvetica", "normal");
  const cpText = doc.splitTextToSize(data.capaianPembelajaran || "-", 267);
  doc.text(cpText, 15, 49);
  
  const cpHeight = cpText.length * 4;
  let tableStartY = 52 + cpHeight;
  if (tableStartY < 56) tableStartY = 56;

  // Render Table of ATP using jspdf-autotable
  const headers = [["No", "Tujuan Pembelajaran (TP)", "Materi Pokok", "Kegiatan Pembelajaran", "Profil Pancasila", "Asesmen", "Waktu", "Sumber Belajar"]];
  const body = data.tabelSilabus.map((item, idx) => [
    idx + 1,
    stripHtml(item.tujuanPembelajaran),
    stripHtml(item.materiPokok),
    stripHtml(item.kegiatanPembelajaran),
    stripHtml(item.profilPancasila),
    stripHtml(item.penilaian),
    stripHtml(item.alokasiWaktu),
    stripHtml(item.sumberBelajar)
  ]);
  
  autoTable(doc, {
    startY: tableStartY,
    head: headers,
    body: body,
    theme: "grid",
    headStyles: { fillColor: [1, 74, 173], textColor: 255, fontStyle: "bold", halign: "center", fontSize: 8 },
    bodyStyles: { fontSize: 8, font: "helvetica" },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 50 },
      2: { cellWidth: 32 },
      3: { cellWidth: 65 },
      4: { cellWidth: 28 },
      5: { cellWidth: 32 },
      6: { cellWidth: 15, halign: "center" },
      7: { cellWidth: 37 }
    },
    styles: { overflow: "linebreak", cellPadding: 2 },
  });
  
  // Put signature lines
  let finalY = (doc as any).lastAutoTable.finalY + 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  if (finalY + 30 > pageHeight) {
    doc.addPage();
    finalY = 20;
  }
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Mengetahui,", 15, finalY);
  doc.text("Kepala Sekolah SD,", 15, finalY + 5);
  doc.text(config.kepalaSekolah || "...................", 15, finalY + 23);
  doc.text(`NIP. ${config.nipKepalaSekolah || "-"}`, 15, finalY + 27);
  
  doc.text(`Jakarta, ${new Date().toLocaleDateString("id-ID")}`, 200, finalY);
  doc.text("Guru Kelas/Mata Pelajaran,", 200, finalY + 5);
  doc.text(config.guru || "...................", 200, finalY + 23);
  doc.text(`NIP. ${config.nip || "-"}`, 200, finalY + 27);
  
  // Footer page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.text(`Halaman ${i} dari ${totalPages}`, 282, pageHeight - 8, { align: "right" });
  }
  
  doc.save(`Silabus_${config.mapel.replace(/\s+/g, "_")}_Kelas_${config.kelas}.pdf`);
};

// 8. Export RPP to PDF using jsPDF & jspdf-autotable
export const exportRPPToPdf = (config: SchoolConfig, data: RPPData) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = 15;
  
  const addNewPageIfOverflow = (heightNeeded: number) => {
    if (currentY + heightNeeded > 280) {
      doc.addPage();
      currentY = 15;
      return true;
    }
    return false;
  };
  
  // Title Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RENCANA PELAKSANAAN PEMBELAJARAN (RPP)", 105, currentY, { align: "center" });
  currentY += 5;
  doc.setFontSize(11);
  doc.text("MODUL AJAR KURIKULUM MERDEKA SD", 105, currentY, { align: "center" });
  currentY += 6;
  
  // Divider split line
  doc.setLineWidth(0.5);
  doc.line(15, currentY, 195, currentY);
  currentY += 6;
  
  // I. Identitas Modul
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("I. IDENTITAS MODUL", 15, currentY);
  currentY += 5;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  
  const leftCol = 15;
  const midCol = 110;
  
  doc.text(`Nama Sekolah     : ${config.sekolah || "-"}`, leftCol, currentY);
  doc.text(`Mata Pelajaran   : ${config.mapel || "-"}`, leftCol, currentY + 4.5);
  doc.text(`Kelas / Semester : ${config.kelas || "-"} / ${config.semester || "-"}`, leftCol, currentY + 9);
  doc.text(`Fase             : ${config.fase || "-"}`, leftCol, currentY + 13.5);
  
  doc.text(`NPSN Sekolah     : ${config.npsn || "-"}`, midCol, currentY);
  doc.text(`Nama Guru        : ${config.guru || "-"}`, midCol, currentY + 4.5);
  doc.text(`NIP Guru         : ${config.nip || "-"}`, midCol, currentY + 9);
  doc.text(`Tahun Ajaran     : ${config.tahunAjaran || "-"}`, midCol, currentY + 13.5);
  
  currentY += 20;
  
  // Standard structured text fields
  const sections = [
    { title: "II. KOMPETENSI AWAL", text: data.kompetensiAwal },
    { title: "III. PROFIL PELAJAR PANCASILA", text: data.profilPancasila.join(", ") },
    { title: "IV. SARANA DAN PRASARANA", text: data.saranaPrasarana },
    { title: "V. TARGET PESERTA DIDIK", text: data.targetPesertaDidik },
    { title: "VI. MODEL PEMBELAJARAN", text: data.modelPembelajaran },
    { title: "VII. PEMAHAMAN BERMAKNA", text: stripHtml(data.pemahamanBermakna) }
  ];
  
  sections.forEach(sec => {
    addNewPageIfOverflow(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(sec.title, 15, currentY);
    currentY += 4.5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const wrapText = doc.splitTextToSize(sec.text || "-", 180);
    doc.text(wrapText, 15, currentY);
    currentY += (wrapText.length * 4) + 4.5;
  });

  // VIII. TUJUAN PEMBELAJARAN
  addNewPageIfOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("VIII. TUJUAN PEMBELAJARAN (TP)", 15, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  data.tujuanPembelajaran.forEach(tp => {
    addNewPageIfOverflow(10);
    const wrapTp = doc.splitTextToSize(`- ${tp}`, 180);
    doc.text(wrapTp, 15, currentY);
    currentY += (wrapTp.length * 4) + 1.5;
  });
  currentY += 3;

  // IX. PERTANYAAN PEMANTIK
  addNewPageIfOverflow(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("IX. PERTANYAAN PEMANTIK", 15, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  data.pertanyaanPemantik.forEach(p => {
    addNewPageIfOverflow(10);
    const wrapP = doc.splitTextToSize(`? ${p}`, 180);
    doc.text(wrapP, 15, currentY);
    currentY += (wrapP.length * 4) + 1.5;
  });
  currentY += 3;

  // X. KEGIATAN PEMBELAJARAN
  addNewPageIfOverflow(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("X. KEGIATAN PEMBELAJARAN (ALUR KERJA AKTIF)", 15, currentY);
  currentY += 5;
  
  // Render subtable of activities (kegiatan) nicely
  const kegHeaders = [["Langkah Pembelajaran", "Waktu", "Deskripsi Kegiatan Inti"]];
  const kegBody = data.kegiatanPembelajaran.map(keg => [
    keg.kategori,
    keg.alokasiWaktu,
    stripHtml(keg.deskripsi)
  ]);
  
  autoTable(doc, {
    startY: currentY,
    head: kegHeaders,
    body: kegBody,
    theme: "grid",
    headStyles: { fillColor: [1, 74, 173], textColor: 255, fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 120 }
    },
    styles: { overflow: "linebreak", cellPadding: 2.5 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // XI. ASESMEN & EVALUASI
  addNewPageIfOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("XI. ASESMEN & EVALUASI", 15, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const diagText = doc.splitTextToSize(`1. Diagnostik: ${data.asesmen.diagnostik}`, 180);
  const formText = doc.splitTextToSize(`2. Formatif: ${data.asesmen.formatif}`, 180);
  const sumText = doc.splitTextToSize(`3. Sumatif: ${data.asesmen.sumatif}`, 180);
  
  addNewPageIfOverflow(diagText.length * 4 + formText.length * 4 + sumText.length * 4 + 5);
  doc.text(diagText, 15, currentY);
  currentY += (diagText.length * 4) + 1.5;
  doc.text(formText, 15, currentY);
  currentY += (formText.length * 4) + 1.5;
  doc.text(sumText, 15, currentY);
  currentY += (sumText.length * 4) + 5;

  // XII. REMEDIAL & PENGAYAAN
  addNewPageIfOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("XII. REMEDIAL & PENGAYAAN", 15, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const remText = doc.splitTextToSize(`- Remedial: ${stripHtml(data.remedialAndPengayaan.remedial)}`, 180);
  const pengText = doc.splitTextToSize(`- Pengayaan: ${stripHtml(data.remedialAndPengayaan.pengayaan)}`, 180);
  
  addNewPageIfOverflow(remText.length * 4 + pengText.length * 4 + 5);
  doc.text(remText, 15, currentY);
  currentY += (remText.length * 4) + 1.5;
  doc.text(pengText, 15, currentY);
  currentY += (pengText.length * 4) + 5;

  // XIII. LAMPIRAN LKPD & XIV. RUBRIK PENILAIAN
  const finalSections = [
    { title: "XIII. LAMPIRAN LKPD", text: stripHtml(data.lkpd) },
    { title: "XIV. RUBRIK PENILAIAN", text: stripHtml(data.rubrikPenilaian) }
  ];

  finalSections.forEach(sec => {
    addNewPageIfOverflow(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(sec.title, 15, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const wrapSef = doc.splitTextToSize(sec.text || "-", 180);
    doc.text(wrapSef, 15, currentY);
    currentY += (wrapSef.length * 4) + 6;
  });

  // Signature Block
  addNewPageIfOverflow(35);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Mengetahui,", 15, currentY);
  doc.text("Kepala Sekolah SD,", 15, currentY + 5);
  doc.text(config.kepalaSekolah || "...................", 15, currentY + 23);
  doc.text(`NIP. ${config.nipKepalaSekolah || "-"}`, 15, currentY + 27);
  
  doc.text(`Jakarta, ${new Date().toLocaleDateString("id-ID")}`, 130, currentY);
  doc.text("Guru Kelas/Mata Pelajaran,", 130, currentY + 5);
  doc.text(config.guru || "...................", 130, currentY + 23);
  doc.text(`NIP. ${config.nip || "-"}`, 130, currentY + 27);
  
  // Set accurate footer page numbers across pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.text(`Halaman ${i} dari ${totalPages}`, 195, 287, { align: "right" });
  }

  doc.save(`RPP_${config.mapel.replace(/\s+/g, "_")}_Kelas_${config.kelas}.pdf`);
};

// 9. Export Generic Documents (Prota, Promes, KKTP, CP, Jurnal) to PDF
export const exportGenericToPdf = (config: SchoolConfig, title: string, data: GenericDocData) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = 15;

  const addNewPageIfOverflow = (heightNeeded: number) => {
    if (currentY + heightNeeded > 280) {
      doc.addPage();
      currentY = 15;
      return true;
    }
    return false;
  };

  // Header Title and Alignment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${title.toUpperCase()} SD`, 105, currentY, { align: "center" });
  currentY += 5;
  doc.setFontSize(11);
  doc.text(`TAHUN AJARAN ${config.tahunAjaran || "-"}`, 105, currentY, { align: "center" });
  currentY += 6;

  // Divider line
  doc.setLineWidth(0.5);
  doc.line(15, currentY, 195, currentY);
  currentY += 6;

  // Identitas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("I. INFORMASI UMUM", 15, currentY);
  currentY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Nama Sekolah    : ${config.sekolah || "-"}`, 15, currentY);
  doc.text(`Mata Pelajaran  : ${config.mapel || "-"}`, 15, currentY + 4.5);
  doc.text(`Kelas / Semester: ${config.kelas || "-"} / ${config.semester || "-"}`, 15, currentY + 9);
  doc.text(`Fase            : ${config.fase || "-"}`, 15, currentY + 13.5);

  doc.text(`Nama Guru   : ${config.guru || "-"}`, 110, currentY);
  doc.text(`NIP Guru    : ${config.nip || "-"}`, 110, currentY + 4.5);
  doc.text(`NPSN Sekolah: ${config.npsn || "-"}`, 110, currentY + 9);
  doc.text(`Tanggal     : ${new Date().toLocaleDateString("id-ID")}`, 110, currentY + 13.5);

  currentY += 22;

  // Description rekapitulator
  addNewPageIfOverflow(20);
  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi / Orientasi Kurikulum SD:", 15, currentY);
  currentY += 4.5;
  doc.setFont("helvetica", "normal");
  const descText = doc.splitTextToSize(data.description || "-", 180);
  doc.text(descText, 15, currentY);
  currentY += (descText.length * 4) + 6;

  // Content Paragraphs
  addNewPageIfOverflow(20);
  doc.setFont("helvetica", "bold");
  doc.text("II. ANALISIS & REKAPITULASI PROGRAM", 15, currentY);
  currentY += 4.5;

  doc.setFont("helvetica", "normal");
  const paragraphs = stripHtml(data.content).split("\n");
  paragraphs.forEach(p => {
    if (p.trim()) {
      addNewPageIfOverflow(15);
      const wrapP = doc.splitTextToSize(p, 180);
      doc.text(wrapP, 15, currentY);
      currentY += (wrapP.length * 4) + 2;
    }
  });
  currentY += 4;

  // Structured table inclusion inside Generic generated content
  if (data.tables && data.tables.length > 0) {
    addNewPageIfOverflow(30);
    doc.setFont("helvetica", "bold");
    doc.text("III. TABEL IDENTIFIKASI ADMINISTRASI", 15, currentY);
    currentY += 5;

    const tableData = data.tables[0];
    const pdfRows = tableData.rows.map(row => row.map(cell => stripHtml(cell)));
    autoTable(doc, {
      startY: currentY,
      head: [tableData.headers],
      body: pdfRows,
      theme: "grid",
      headStyles: { fillColor: [1, 74, 173], textColor: 255, fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      styles: { overflow: "linebreak", cellPadding: 2 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Signatures split
  addNewPageIfOverflow(35);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Mengetahui,", 15, currentY);
  doc.text("Kepala Sekolah SD,", 15, currentY + 5);
  doc.text(config.kepalaSekolah || "...................", 15, currentY + 23);
  doc.text(`NIP. ${config.nipKepalaSekolah || "-"}`, 15, currentY + 27);

  doc.text(`Jakarta, ${new Date().toLocaleDateString("id-ID")}`, 130, currentY);
  doc.text("Guru Kelas/Pendidik SD,", 130, currentY + 5);
  doc.text(config.guru || "...................", 130, currentY + 23);
  doc.text(`NIP. ${config.nip || "-"}`, 130, currentY + 27);

  // Footer page numbering
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.text(`Halaman ${i} dari ${totalPages}`, 195, 287, { align: "right" });
  }

  doc.save(`${title.replace(/\s+/g, "_")}_${config.mapel.replace(/\s+/g, "_")}_Kelas_${config.kelas}.pdf`);
};


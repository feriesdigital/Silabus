import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initializer for Google Gen AI SDK
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Global school/teacher state stored in-memory (and backed up/restored in Frontend localStorage)
// This preserves server-side API logic and standard full-stack interactions
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running perfectly." });
});

// AI Chat Assistant Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Kolom riwayat pesan (messages) wajib diisi!" });
    }

    const ai = getAI();

    const systemInstruction = 
      "Anda adalah Asisten AI Pendidikan Guru SD Merdeka & K13 Indonesia. " +
      "Tugas Anda adalah memandu guru meningkatkan kualitas pembelajaran di Sekolah Dasar (SD). " +
      "Bantu guru merespon pertanyaan terkait penyusunan materi kurikulum, metodologi pengajaran yang kreatif dan menyenangkan, " +
      "aspek psikologi siswa, tip manajemen kelas yang kondusif, rancangan ice-breaking, hingga pembinaan karakter Pancasila. " +
      "Berikan tanggapan yang solutif, inspiratif, penuh empati, dan sangat mudah diterapkan dalam praktik nyata di lapangan. " +
      "Gunakan bahasa Indonesia baku yang sopan, ramah, dan bersahabat (panggil lawan bicara dengan 'Bapak Guru' atau 'Ibu Guru'). " +
      "Format jawaban Anda secara terstruktur menggunakan bullet-point, format teks tebal, dan pargraf yang rapi agar nyaman dibaca.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages,
      config: {
        systemInstruction,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan internal ketika memproses obrolan dengan asisten AI.",
    });
  }
});

// AI Generation Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { type, subject, grade, semester, phase, topic, customInstructions } = req.body;

    if (!subject || !grade || !topic) {
      return res.status(400).json({ error: "Kolom Mata Pelajaran, Kelas, dan Tema/Topik wajib diisi!" });
    }

    const ai = getAI();

    let systemInstruction = "Anda adalah Ahli Kurikulum Pendidikan Sekolah Dasar (SD) Indonesia, spesialis kurikulum Merdeka dan K13. " +
      "Hasilkan rancangan kurikulum yang lengkap, operasional, realistis untuk guru di Indonesia, menggunakan tata bahasa Indonesia formal (EYD) yang baku, santun, dan mudah dipraktikkan.";

    if (type === "syllabus") {
      const prompt = `Buatkan Silabus/ATP lengkap untuk Mata Pelajaran: ${subject}, Kelas: ${grade}, Semester: ${semester}, Fase: ${phase}, Topik/Materi: ${topic}. ${customInstructions ? `Instruksi Tambahan: ${customInstructions}` : ""}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              capaianPembelajaran: {
                type: Type.STRING,
                description: "Deskripsi Capaian Pembelajaran (CP) Resmi untuk fase dan materi ini"
              },
              alokasiWaktuTotal: {
                type: Type.STRING,
                description: "Misal: 12 JP (4 Pertemuan)"
              },
              tabelSilabus: {
                type: Type.ARRAY,
                description: "Daftar alur tujuan pembelajaran",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    tujuanPembelajaran: { type: Type.STRING, description: "Tujuan pembelajaran spesifik (TP)" },
                    materiPokok: { type: Type.STRING, description: "Materi inti" },
                    kegiatanPembelajaran: { type: Type.STRING, description: "Langkah / interaksi utama guru dan murid" },
                    profilPancasila: { type: Type.STRING, description: "Contoh: Mandiri, Bernalar Kritis, Gotong Royong" },
                    penilaian: { type: Type.STRING, description: "Metode evaluasi/asesmen formatif/sumatif" },
                    alokasiWaktu: { type: Type.STRING, description: "Misal: 3 JP" },
                    sumberBelajar: { type: Type.STRING, description: "Buku siswa, lingkungan sekitar, media digital" }
                  },
                  required: ["tujuanPembelajaran", "materiPokok", "kegiatanPembelajaran", "profilPancasila", "penilaian", "alokasiWaktu", "sumberBelajar"]
                }
              }
            },
            required: ["capaianPembelajaran", "alokasiWaktuTotal", "tabelSilabus"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Gagal menerima respon dari AI.");
      return res.json(JSON.parse(responseText));

    } else if (type === "rpp") {
      const prompt = `Buatkan Rencana Pelaksanaan Pembelajaran (RPP) / Modul Ajar lengkap sesuai standar Kemendikbud Merdeka Belajar untuk Mata Pelajaran: ${subject}, Kelas: ${grade}, Semester: ${semester}, Fase: ${phase}, Topik/Materi Pokok: ${topic}. Buatlah langkah pembelajaran yang detail dan terstruktur (Pendahuluan, Inti dengan sintaks model pembelajaran, Penutup), serta sertakan Pertanyaan Pemantik, LKPD, dan Rubrik Penilaian. ${customInstructions ? `Instruksi Tambahan: ${customInstructions}` : ""}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kompetensiAwal: { type: Type.STRING },
              profilPancasila: { type: Type.ARRAY, items: { type: Type.STRING } },
              saranaPrasarana: { type: Type.STRING },
              targetPesertaDidik: { type: Type.STRING },
              modelPembelajaran: { type: Type.STRING },
              tujuanPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
              pemahamanBermakna: { type: Type.STRING },
              pertanyaanPemantik: { type: Type.ARRAY, items: { type: Type.STRING } },
              kegiatanPembelajaran: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    kategori: { type: Type.STRING, description: "Pendahuluan / Kegiatan Inti / Penutup" },
                    deskripsi: { type: Type.STRING, description: "Rangkaian instruksi detail" },
                    alokasiWaktu: { type: Type.STRING }
                  },
                  required: ["kategori", "deskripsi", "alokasiWaktu"]
                }
              },
              asesmen: {
                type: Type.OBJECT,
                properties: {
                  diagnostik: { type: Type.STRING },
                  formatif: { type: Type.STRING },
                  sumatif: { type: Type.STRING }
                },
                required: ["diagnostik", "formatif", "sumatif"]
              },
              remedialAndPengayaan: {
                type: Type.OBJECT,
                properties: {
                  remedial: { type: Type.STRING },
                  pengayaan: { type: Type.STRING }
                },
                required: ["remedial", "pengayaan"]
              },
              lkpd: { type: Type.STRING, description: "Panduan Lembar Kerja Peserta Didik (LKPD)" },
              rubrikPenilaian: { type: Type.STRING, description: "Rubrik lembar penilaian kognitif, afektif, psikomotorik" }
            },
            required: [
              "kompetensiAwal", "profilPancasila", "saranaPrasarana", "targetPesertaDidik", 
              "modelPembelajaran", "tujuanPembelajaran", "pemahamanBermakna", 
              "pertanyaanPemantik", "kegiatanPembelajaran", "asesmen", 
              "remedialAndPengayaan", "lkpd", "rubrikPenilaian"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Gagal menerima respon dari AI.");
      return res.json(JSON.parse(responseText));

    } else {
      // General tools like ATP, CP, Prota, Promes, KKTP, Jurnal Mengajar
      const prompt = `Buatkan rincian administrasi mengajar berukuran padat dalam format terstruktur untuk: Jenis Dokumen: ${type}, Mata Pelajaran: ${subject}, Kelas: ${grade}, Semester: ${semester}, Fase: ${phase}, Topik/Materi: ${topic}. ${customInstructions ? `Instruksi Tambahan: ${customInstructions}` : ""}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              content: { type: Type.STRING, description: "Isi dokumen terstruktur dengan list markdown atau narasi akademik yang mudah dipahami" },
              tables: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
                  },
                  required: ["headers", "rows"]
                }
              }
            },
            required: ["title", "description", "content"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Gagal menerima respon dari AI.");
      return res.json(JSON.parse(responseText));
    }

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan internal ketika memproses dokumen menggunakan AI.",
      needApiKey: !process.env.GEMINI_API_KEY
    });
  }
});

// Configure Vite integration for Dev or serve static builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

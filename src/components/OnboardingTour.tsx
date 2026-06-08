import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, FileText, Milestone, Award, Sparkles, X, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";

interface TourStep {
  title: string;
  content: string;
  section: string;
  selector: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
}

interface OnboardingTourProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingTour({
  activeSection,
  setActiveSection,
  darkMode,
  isOpen,
  onClose
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const steps: TourStep[] = [
    {
      title: "Selamat Datang Guru Hebat! 👋",
      content: "Asisten AI Guru SD siap membantu Anda melahirkan perangkat ajar berkualitas Kurikulum Merdeka & K13 secara instan. Ayo meluncur dalam tur 1 menit ini!",
      section: "dashboard",
      selector: "#tour-welcome-banner",
      placement: "bottom"
    },
    {
      title: "Monitor Administrasi Ajar 📊",
      content: "Pantau jumlah kumulatif dokumen (Silabus, RPP, CP, PROTA) yang telah Anda susun di sistem untuk melacak kemajuan administrasi.",
      section: "dashboard",
      selector: "#tour-metrics-grid",
      placement: "bottom"
    },
    {
      title: "Rumuskan Silabus Instan 📖",
      content: "Butuh silabus mingguan terintegrasi? Klik tombol ini untuk mengakses Generator Silabus otomatis bertenaga AI kami.",
      section: "dashboard",
      selector: "#tour-syllabus-btn",
      placement: "top"
    },
    {
      title: "Rancang RPP & Modul Ajar 📝",
      content: "Klik ini untuk melahirkan rencana KBM, tujuan pembelajaran, kriteria asesmen formatif-sumatif, remedi-pengayaan, hingga lembar kerja siswa (LKPD).",
      section: "dashboard",
      selector: "#tour-rpp-btn",
      placement: "top"
    },
    {
      title: "Alat Administrasi Tambahan 🛠️",
      content: "Berbagai shortcut instan untuk menyusun CP/TP, Alur Pembelajaran (ATP), Program Tahunan (PROTA), Program Semester (PROMES), KKTP, dan Jurnal Harian Guru.",
      section: "dashboard",
      selector: "#tour-extra-tools",
      placement: "top"
    },
    {
      title: "Pencarian & Arsip Tersimpan 🔍",
      content: "Ketikkan kata sandi atau judul/mata pelajaran di input pencarian baru ini untuk melacak serta mengedit dokumen Anda secara kilat.",
      section: "dashboard",
      selector: "#tour-saved-docs",
      placement: "top"
    },
    {
      title: "Ubah Parameter Sekolah 🏫",
      content: "Sesuaikan nama sekolah standar, nama guru, kelas SD, semester, dan fase kurikulum. AI akan otomatis menyesuaikan isi draf dengan parameter ini!",
      section: "settings",
      selector: "#tour-settings-view",
      placement: "left"
    },
    {
      title: "Selamat Berkarya! 🎉",
      content: "Semua fitur telah Anda ketahui. Mari mulai membuat draf pertama Anda atau gunakan Pustaka Template yang telah disediakan. Sukses mengajar para penerus bangsa!",
      section: "dashboard",
      selector: "#tour-welcome-banner",
      placement: "center"
    }
  ];

  // Monitor window resize to recalculate coordinates
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Run synchronization when active step or page changes
  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    
    // 1. programmatic section redirection
    if (activeSection !== step.section) {
      setActiveSection(step.section);
      // Give a tiny moment for layout mounting before calculation
      const timer = setTimeout(() => {
        calculatePosition(step);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        calculatePosition(step);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, activeSection, windowSize]);

  // Recalculate coordinates based on target elements
  const calculatePosition = (step: TourStep) => {
    if (step.placement === "center" || !step.selector) {
      setTargetRect(null);
      // Center of viewport positioning
      setTooltipPos({
        top: window.innerHeight / 2 - 120,
        left: Math.max(16, window.innerWidth / 2 - 200)
      });
      return;
    }

    const element = document.querySelector(step.selector);
    if (!element) {
      // Element not found - mobile display layout might have hidden it. Fallback to center modal.
      setTargetRect(null);
      setTooltipPos({
        top: window.innerHeight / 2 - 120,
        left: Math.max(16, window.innerWidth / 2 - 180)
      });
      return;
    }

    // Scroll element into view smoothly if hidden offscreen
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    const rect = element.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });

    // Tooltip offset calculations
    let calculatedTop = 0;
    let calculatedLeft = 0;
    const tooltipWidth = 360; // Approximate max width of tooltip
    const tooltipHeight = 180; // Approximate height

    if (step.placement === "bottom") {
      calculatedTop = rect.bottom + 12;
      calculatedLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    } else if (step.placement === "top") {
      calculatedTop = rect.top - tooltipHeight - 12;
      calculatedLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    } else if (step.placement === "left") {
      calculatedTop = rect.top + rect.height / 2 - tooltipHeight / 2;
      calculatedLeft = rect.left - tooltipWidth - 12;
    } else if (step.placement === "right") {
      calculatedTop = rect.top + rect.height / 2 - tooltipHeight / 2;
      calculatedLeft = rect.right + 12;
    }

    // Bound box screen safety guides
    if (calculatedLeft < 16) {
      calculatedLeft = 16;
    } else if (calculatedLeft + tooltipWidth > window.innerWidth - 16) {
      calculatedLeft = window.innerWidth - tooltipWidth - 16;
    }

    if (calculatedTop < 16) {
      calculatedTop = rect.bottom + 12; // flip to bottom if top cuts off
    } else if (calculatedTop + tooltipHeight > window.innerHeight - 16) {
      calculatedTop = rect.top - tooltipHeight - 12; // flip to top if bottom cuts off
    }

    setTooltipPos({ top: calculatedTop, left: calculatedLeft });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_seen", "true");
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Semi-transparent dark background backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
        onClick={handleComplete}
      />

      {/* Spotlight highlight drawing overlay */}
      {targetRect && (
        <motion.div
          animate={{
            x: targetRect.left - 8,
            y: targetRect.top - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="fixed bg-transparent border-4 border-[#FBBF24] shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_25px_#FBBF24] rounded-2xl z-40 pointer-events-none"
        />
      )}

      {/* Floating Tooltip dialogue modal box */}
      <motion.div
        ref={tooltipRef}
        animate={{
          x: tooltipPos.left,
          y: tooltipPos.top,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className={`fixed z-45 w-[90vw] sm:w-[380px] rounded-[24px] border shadow-2xl p-5 md:p-6 ${
          darkMode 
            ? "bg-slate-900 border-slate-800 text-white shadow-black/80" 
            : "bg-white border-[#014AAD]/10 text-slate-800 shadow-slate-900/10"
        }`}
        style={{ top: 0, left: 0 }}
      >
        {/* Header indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Panduan Mengajar SD &bull; Langkah {currentStep + 1} dari {steps.length}
          </span>
          <button 
            onClick={handleComplete}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full cursor-pointer"
            title="Lewati Tutorial"
          >
            <X size={14} />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase tracking-tight text-[#014AAD] dark:text-[#FBBF24] flex items-center gap-1.5 leading-tight">
            <Sparkles size={14} className="text-[#FBBF24] animate-bounce" />
            {currentStepData.title}
          </h4>
          <p className={`text-xs font-semibold leading-relaxed ${
            darkMode ? "text-slate-300" : "text-slate-650"
          }`}>
            {currentStepData.content}
          </p>
        </div>

        {/* Footer/Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed border-slate-700/10 dark:border-slate-800/60">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentStep
                    ? "w-4 bg-[#014AAD] dark:bg-[#FBBF24]"
                    : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                <ChevronLeft size={12} />
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#014AAD] hover:bg-[#00337A] dark:bg-[#FBBF24] dark:hover:bg-[#FBBF24]/90 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#014AAD]/10 dark:shadow-[#FBBF24]/10 cursor-pointer transition-all"
            >
              <span>{currentStep === steps.length - 1 ? "Selesai" : "Mengerti"}</span>
              {currentStep < steps.length - 1 && <ChevronRight size={12} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

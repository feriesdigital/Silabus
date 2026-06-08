import React, { useState } from "react";
import { Lock, Unlock, GraduationCap, Eye, EyeOff, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginPageProps {
  onSuccess: () => void;
  darkMode: boolean;
}

export default function LoginPage({ onSuccess, darkMode }: LoginPageProps) {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "silabusgen01") {
      onSuccess();
    } else {
      setShowErrorModal(true);
    }
  };

  const handleActivationClick = () => {
    window.open("https://bioqu.id/fd-aktivasiBannerAds-AI", "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-200 ${
      darkMode 
        ? "bg-[#0b1329] text-slate-100" 
        : "bg-slate-50 text-slate-800"
    }`}>
      {/* Decorative ambient background blur vectors */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#014AAD]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#014AAD] text-white shadow-lg shadow-[#014AAD]/15 mb-4">
            <GraduationCap size={40} className="stroke-[1.75]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Silabus & RPP AI
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#014AAD] dark:text-[#FBBF24] mt-1.5">
            Sekolah Dasar - Kurikulum Merdeka
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
            Masukkan kode akses untuk membuka kecanggihan asisten AI pembuat administrasi ajar.
          </p>
        </div>

        {/* Card Form */}
        <div className={`p-6 md:p-8 rounded-3xl border shadow-xl transition-all ${
          darkMode 
            ? "bg-slate-900/90 border-slate-800 shadow-black/20" 
            : "bg-white border-slate-100 shadow-slate-100/50"
        }`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Kode Akses / Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Masukkan passcode Anda"
                  className={`w-full py-3 pl-10 pr-10 text-sm font-medium rounded-xl border outline-none transition-all ${
                    darkMode 
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#014AAD] focus:ring-1 focus:ring-[#014AAD]"
                  }`}
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#014AAD] hover:bg-[#013580] text-[#FBBF24] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#014AAD]/20 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
            >
              <Unlock size={14} className="stroke-[2.5]" />
              <span>Buka Akses Sekarang</span>
            </button>
          </form>
        </div>

        {/* Footer info in the login layout */}
        <p className="text-[10px] text-center font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-8">
          Powered by ©️ FD Studio
        </p>
      </motion.div>

      {/* ERROR MODAL WINDOW */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative z-55 w-full max-w-sm rounded-3xl border shadow-2xl p-6 md:p-7 text-center ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Lock size={26} className="stroke-[2]" />
              </div>

              <h3 className="text-base font-extrabold text-red-500 uppercase tracking-tight mb-2">
                Akses Ditolak
              </h3>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Silahkan Aktifkan Kode akses disini 👇
              </p>

              <button
                onClick={handleActivationClick}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#01409B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Unlock size={14} className="stroke-[2.5]" />
                <span>Aktifkan Kode Akses</span>
                <ExternalLink size={13} className="opacity-70" />
              </button>

              <button
                onClick={() => setShowErrorModal(false)}
                className="mt-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
              >
                Coba Lagi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SyllabusGenerator from "./components/SyllabusGenerator";
import RPPGenerator from "./components/RPPGenerator";
import GenericGenerator from "./components/GenericGenerator";
import TemplatesPage from "./components/TemplatesPage";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import OnboardingTour from "./components/OnboardingTour";
import ChatAssistant from "./components/ChatAssistant";
import { SchoolConfig, SavedDocument } from "./types";
import { DEFAULT_SCHOOL_CONFIG } from "./data/templates";
import { Menu, GraduationCap, X, LogOut, Sun, Moon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication passcode status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("app_authenticated") === "true";
  });

  // State to manage React-based logout modal without browser-blocking API (window.confirm)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // State to manage React-based delete document modal
  const [documentToDelete, setDocumentToDelete] = useState<SavedDocument | null>(null);

  // State to manage React-based block/bulk delete document modal
  const [documentsToDeleteBulk, setDocumentsToDeleteBulk] = useState<string[] | null>(null);

  // Navigation active state
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // State to manage global floating chat widget
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleSetActiveSection = (section: string) => {
    if (section === "chat") {
      setChatOpen(true);
    } else {
      setActiveSection(section);
    }
  };

  // Collapse sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Mobile sidebar open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Light/Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Global synchronized school / teacher configurations
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem("rpp_school_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SCHOOL_CONFIG;
      }
    }
    return DEFAULT_SCHOOL_CONFIG;
  });

  // History list of saved / draft documents
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => {
    const saved = localStorage.getItem("rpp_saved_documents");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Guided walkthrough tour state and automatic triggers
  const [showTour, setShowTour] = useState<boolean>(false);

  // Focus Mode state
  const [rppFocusMode, setRppFocusMode] = useState<boolean>(false);

  useEffect(() => {
    if (activeSection !== "rpp") {
      setRppFocusMode(false);
    }
  }, [activeSection]);

  useEffect(() => {
    if (isAuthenticated) {
      const tourSeen = localStorage.getItem("onboarding_seen") === "true";
      if (!tourSeen) {
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);

  // Automatically save school config whenever updated
  useEffect(() => {
    localStorage.setItem("rpp_school_config", JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  // Automatically save documents roster to local storage on change
  useEffect(() => {
    localStorage.setItem("rpp_saved_documents", JSON.stringify(savedDocuments));
  }, [savedDocuments]);

  // Handle saving / updating a document draft
  const handleSaveDocument = (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => {
    if (doc.id) {
      // Update existing
      setSavedDocuments(prev => prev.map(item => 
        item.id === doc.id 
          ? { 
              ...item, 
              title: doc.title,
              config: doc.config, 
              data: doc.data, 
              updatedAt: new Date().toISOString() 
            } 
          : item
      ));
    } else {
      // Create new
      const newDoc: SavedDocument = {
        id: "doc_" + Math.random().toString(36).substr(2, 9),
        type: doc.type,
        title: doc.title,
        subject: doc.subject,
        grade: doc.grade,
        semester: doc.semester,
        config: doc.config,
        data: doc.data,
        updatedAt: new Date().toISOString()
      };
      setSavedDocuments(prev => [newDoc, ...prev]);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const doc = savedDocuments.find(d => d.id === id);
    if (doc) {
      setDocumentToDelete(doc);
    }
  };

  const handleDeleteDocumentsBulk = (ids: string[]) => {
    if (ids && ids.length > 0) {
      setDocumentsToDeleteBulk(ids);
    }
  };

  const handleSelectDocument = (doc: SavedDocument) => {
    setActiveSection(doc.type);
    setSchoolConfig(doc.config);
    // Let sub-generators hook or handle by matching active doc ID inside the generator's internal state
  };

  // Callback to load templates
  const handleLoadTemplate = (type: "syllabus" | "rpp", config: SchoolConfig, data: any) => {
    setSchoolConfig(config);
    setActiveSection(type);
    
    // Auto save a draft copy of the template so it shows on the dashboard
    handleSaveDocument({
      type,
      title: `${type === "syllabus" ? "Silabus" : "RPP/Modul"} ${config.mapel} Kelas ${config.kelas} (Template)`,
      subject: config.mapel,
      grade: config.kelas,
      semester: config.semester,
      config,
      data
    });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            savedDocuments={savedDocuments}
            setActiveSection={handleSetActiveSection}
            onSelectDocument={handleSelectDocument}
            onDeleteDocument={handleDeleteDocument}
            onDeleteDocumentsBulk={handleDeleteDocumentsBulk}
            darkMode={darkMode}
            onStartTour={() => setShowTour(true)}
          />
        );
      case "syllabus":
        return (
          <SyllabusFormWithHeader
            schoolConfig={schoolConfig}
            onUpdateSchoolConfig={setSchoolConfig}
            onSaveDocument={handleSaveDocument}
            savedSyllabi={savedDocuments.filter(d => d.type === "syllabus")}
            darkMode={darkMode}
          />
        );
      case "rpp":
        return (
          <RPPGenerator
            schoolConfig={schoolConfig}
            onUpdateSchoolConfig={setSchoolConfig}
            onSaveDocument={handleSaveDocument}
            savedRPPs={savedDocuments.filter(d => d.type === "rpp")}
            darkMode={darkMode}
            focusMode={rppFocusMode}
            setFocusMode={setRppFocusMode}
          />
        );
      case "atp":
      case "cp":
      case "prota":
      case "promes":
      case "kktp":
      case "jurnal":
        return (
          <GenericGenerator
            type={activeSection as any}
            schoolConfig={schoolConfig}
            onUpdateSchoolConfig={setSchoolConfig}
            onSaveDocument={handleSaveDocument}
            savedDocs={savedDocuments}
            darkMode={darkMode}
          />
        );
      case "chat":
        // Fallback: If somehow navigated directly to section "chat", redirect back to dashboard
        setTimeout(() => setActiveSection("dashboard"), 0);
        return null;
      case "templates":
        return (
          <TemplatesPage
            onLoadTemplate={handleLoadTemplate}
            darkMode={darkMode}
          />
        );
      case "settings":
        return (
          <SettingsPage
            schoolConfig={schoolConfig}
            onUpdateSchoolConfig={setSchoolConfig}
            darkMode={darkMode}
          />
        );
      default:
        return <div className="text-center py-12 text-slate-400">Section not found.</div>;
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("app_authenticated");
    setActiveSection("dashboard");
    setShowLogoutConfirm(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onSuccess={() => {
          setIsAuthenticated(true);
          localStorage.setItem("app_authenticated", "true");
        }}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-150 ${darkMode ? "bg-[#0b1329] text-slate-100" : "bg-[#F8FAFC] text-[#1E293B]"}`}>
      
      {/* Sidebar - Desktop Layout */}
      {!rppFocusMode && (
        <div className="hidden md:block">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Floating Header on Mobile */}
      {!rppFocusMode && (
        <header className={`md:hidden sticky top-0 z-40 border-b flex items-center justify-between px-4 py-3 shadow-md ${
          darkMode ? "bg-[#0f1d3a] border-slate-800 text-white" : "sidebar-gradient text-white border-transparent"
        }`}>
          <div className="flex items-center gap-2">
            <div className="bg-[#FBBF24] text-[#014AAD] p-1.5 rounded-lg shadow-sm">
              <GraduationCap size={16} />
            </div>
            <span className={`font-bold text-xs uppercase tracking-tight ${darkMode ? "text-white" : "text-[#FBBF24]"}`}>RPP & Silabus SD</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick dark mode toggle for mobile devices */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/10 rounded-xl cursor-pointer text-slate-300 hover:text-white transition-colors"
              title={darkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {darkMode ? <Sun size={15} className="text-[#FBBF24]" /> : <Moon size={15} />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-xl cursor-pointer text-rose-300 hover:text-white transition-colors"
              title="Keluar Aplikasi"
            >
              <LogOut size={16} className="stroke-[2.5]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-white"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-50 w-72 h-screen flex flex-col overflow-y-auto shadow-2xl border-r border-white/10"
            >
              <Sidebar
                activeSection={activeSection}
                setActiveSection={(section) => {
                  handleSetActiveSection(section);
                  setMobileMenuOpen(false);
                }}
                collapsed={false}
                setCollapsed={() => {}}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                isMobile={true}
                onClose={() => setMobileMenuOpen(false)}
                onLogout={handleLogout}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main viewport Container */}
      <div 
        className={`transition-all duration-300 ${
          rppFocusMode ? "pl-0 md:pl-0" : sidebarCollapsed ? "md:pl-[70px]" : "md:pl-[260px]"
        } pl-0 min-h-screen flex flex-col`}
      >
        {/* Desktop Top Header Bar */}
        {!rppFocusMode && (
          <header className={`hidden md:flex items-center justify-between px-8 py-4 border-b sticky top-0 z-30 backdrop-blur-md ${
            darkMode 
              ? "bg-[#0b1329]/85 border-slate-800/60 text-white" 
              : "bg-white/95 border-slate-100 text-[#1E293B]"
          }`}>
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-[#FBBF24]" : "text-[#014AAD]"}`}>
                ASISTEN AI GURU SD
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-light text-xs">|</span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {activeSection === "dashboard" ? "RANGKUMAN AKTIVITAS" : activeSection.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick Dark Mode toggle next to logout */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-slate-800/80 border-slate-700 text-[#FBBF24] hover:bg-slate-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title={darkMode ? "Mode Terang" : "Mode Gelap"}
              >
                {darkMode ? <Sun size={13} /> : <Moon size={13} />}
              </button>

              {/* EXIT APPLICATION BUTTON */}
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/15 hover:border-transparent cursor-pointer shadow-sm"
                title="Keluar Aplikasi"
              >
                <LogOut size={13} className="stroke-[2.5]" />
                <span>Keluar</span>
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
          {renderActiveSection()}

          <footer className={`pt-12 pb-4 text-center text-[11px] font-semibold tracking-widest uppercase transition-colors duration-150 ${
            darkMode ? "text-slate-650" : "text-slate-400"
          }`}>
            Powered by ©️ FD Studio
          </footer>
        </main>
      </div>

      {/* CUSTOM LOGOUT CONFIRM MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={`relative z-55 w-full max-w-sm rounded-[24px] border shadow-2xl p-6 text-center ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <LogOut size={22} className="stroke-[2.5]" />
              </div>

              <h3 className="text-base font-black text-rose-550 dark:text-rose-400 uppercase tracking-tight mb-2">
                Keluar Aplikasi?
              </h3>

              <p className={`text-xs font-semibold leading-relaxed mb-6 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Apakah Anda yakin ingin keluar dari aplikasi dan mengunci kembali asisten AI ini?
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300"
                      : "bg-[#F8FAFC] hover:bg-slate-100 border-slate-200 text-slate-650"
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {documentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocumentToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={`relative z-55 w-full max-w-sm rounded-[24px] border shadow-2xl p-6 text-center ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trash2 size={22} className="stroke-[2.5]" />
              </div>

              <h3 className="text-base font-black text-rose-550 dark:text-rose-400 uppercase tracking-tight mb-2">
                Hapus Dokumen?
              </h3>

              <p className={`text-xs font-semibold leading-relaxed mb-6 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Apakah Anda yakin ingin menghapus draft <span className="font-extrabold text-[#014AAD] dark:text-[#FBBF24]">{documentToDelete.title}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setDocumentToDelete(null)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300"
                      : "bg-[#F8FAFC] hover:bg-slate-100 border-slate-200 text-slate-650"
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setSavedDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
                    setDocumentToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM BULK DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {documentsToDeleteBulk && documentsToDeleteBulk.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocumentsToDeleteBulk(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={`relative z-55 w-full max-w-sm rounded-[24px] border shadow-2xl p-6 text-center ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trash2 size={22} className="stroke-[2.5]" />
              </div>

              <h3 className="text-base font-black text-rose-550 dark:text-rose-455 uppercase tracking-tight mb-2">
                Hapus Terpilih?
              </h3>

              <p className={`text-xs font-semibold leading-relaxed mb-6 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Apakah Anda yakin ingin menghapus sebanyak <span className="font-extrabold text-rose-600 dark:text-rose-400">{documentsToDeleteBulk.length}</span> draft dokumen terpilih secara masal? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setDocumentsToDeleteBulk(null)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300"
                      : "bg-[#F8FAFC] hover:bg-slate-100 border-slate-200 text-slate-650"
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setSavedDocuments(prev => prev.filter(doc => !documentsToDeleteBulk.includes(doc.id)));
                    setDocumentsToDeleteBulk(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GURU ASD ONBOARDING WALKTHROUGH TOUR OVERLAYS */}
      <OnboardingTour
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />

      {/* GLOBAL FLOATING LIVE CHAT ASSISTANT WIDGET */}
      <ChatAssistant
        darkMode={darkMode}
        isOpen={chatOpen}
        setIsOpen={setChatOpen}
      />

    </div>
  );
}

// Simple adapter for child component naming sync inside App.tsx
function SyllabusFormWithHeader(props: any) {
  return <SyllabusGenerator {...props} />;
}

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, BookOpen, FileText, Milestone, Award, 
  CalendarRange, CalendarFold, CheckCircle2, ClipboardList, 
  FileSpreadsheet, Settings, ChevronLeft, Menu, GraduationCap,
  Sun, Moon, X, LogOut, MessageSquare
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isMobile?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
  isMobile = false,
  onClose,
  onLogout
}: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "syllabus", label: "Silabus Generator", icon: BookOpen },
    { id: "rpp", label: "RPP Generator / Modul", icon: FileText },
    { id: "atp", label: "ATP (Alur Tujuan)", icon: Milestone },
    { id: "cp", label: "CP (Capaian Pembel.)", icon: Award },
    { id: "prota", label: "Program Tahunan", icon: CalendarRange },
    { id: "promes", label: "Program Semester", icon: CalendarFold },
    { id: "kktp", label: "KKTP Kurikulum", icon: CheckCircle2 },
    { id: "jurnal", label: "Jurnal Mengajar", icon: ClipboardList },
    { id: "chat", label: "Tanya Jawab AI", icon: MessageSquare },
    { id: "templates", label: "Template Guru", icon: FileSpreadsheet },
    { id: "settings", label: "Pengaturan Profil", icon: Settings },
  ];

  return (
    <motion.div
      animate={isMobile ? { width: "100%" } : { width: collapsed ? "70px" : "260px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="tour-sidebar"
      className={`h-screen flex flex-col select-none sidebar-gradient text-white ${
        isMobile ? "relative w-full" : "fixed top-0 left-0 z-45 border-r border-[#014AAD]/10 shadow-xl"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="bg-[#FBBF24] text-[#014AAD] p-2 rounded-xl shadow-lg shadow-[#FBBF24]/10">
                <GraduationCap size={20} />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm block tracking-tighter text-white uppercase font-sans">RPP & SILABUS</span>
                <span className="text-[10px] text-[#FBBF24] font-bold uppercase tracking-wider block">Kurikulum SD</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && !isMobile && (
          <div className="bg-[#FBBF24] text-[#014AAD] p-2 rounded-xl mx-auto shadow-lg shadow-[#FBBF24]/10">
            <GraduationCap size={20} />
          </div>
        )}

        {isMobile && onClose ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer text-[#FBBF24] transition-colors"
            title="Tutup Menu"
          >
            <X size={18} />
          </button>
        ) : (
          !isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1.5 rounded-lg hover:bg-white/10 cursor-pointer ${collapsed ? "hidden" : "block"}`}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronLeft size={16} />
            </button>
          )
        )}
      </div>

      {/* Nav Link List */}
      <div className="flex-1 overflow-y-auto px-2 pr-1 py-4 space-y-1.5 scrollbar-custom scroll-smooth">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer group relative ${
                isActive
                  ? "bg-white/15 text-white font-bold border-l-4 border-[#FBBF24] shadow-md shadow-[#FBBF24]/5"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? "text-[#FBBF24]" : "text-white/50 group-hover:text-white"}`}>
                <IconComponent size={20} />
              </div>
              
              {(!collapsed || isMobile) && (
                <span className="text-xs font-semibold tracking-wide truncate">{item.label}</span>
              )}

              {/* Tooltip for Collapsed view */}
              {collapsed && !isMobile && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#00337A] text-white text-[11px] font-bold px-2.5 py-1.5 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 border border-white/10">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

       {/* Footer Toggles */}
      {collapsed && !isMobile && (
        <div className="p-4 border-t border-white/10 w-full flex flex-col gap-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-white/50 hover:text-[#FBBF24] cursor-pointer transition-colors"
            title="Sembunyikan / Tampilkan Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

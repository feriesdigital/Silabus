import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Send, Bot, User, Trash2, ArrowRight,
  GraduationCap, Lightbulb, Compass, Users, Sparkles, Copy, Check,
  X, Minus, Minimize2, MessageCircle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

interface ChatAssistantProps {
  darkMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ChatAssistant({ darkMode, isOpen, setIsOpen }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("rpp_chat_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [pastQuestions, setPastQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("rpp_past_questions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Auto hide prompt tooltip helper after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Save chat logs
  useEffect(() => {
    localStorage.setItem("rpp_chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isLoading, isOpen]);

  // Quick suggestion chips
  const suggestions = [
    {
      title: "Ide Pecahan",
      desc: "Materi pecahan kelas 4",
      icon: Lightbulb,
      prompt: "Berikan 3 ide metode pembelajaran kreatif menggunakan media konkrit untuk mengajarkan materi 'Pecahan Senilai' pada siswa kelas IV SD."
    },
    {
      title: "Kelas Gaduh",
      desc: "Mengontrol kelas saat diskusi kelompok",
      icon: Users,
      prompt: "Bagaimana strategi praktis manajemen kelas bagi guru SD untuk mengkondisikan siswa kelas III yang sangat gaduh saat kerja kelompok?"
    },
    {
      title: "Ice Breaking",
      desc: "Ice breaker seru di pelajaran matematika",
      icon: Sparkles,
      prompt: "Tuliskan 3 alternatif ice-breaking singkat, mendidik, dan seru yang bisa dimainkan siswa SD Kelas V untuk memulihkan fokus pelajaran."
    }
  ];

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || inputValue).trim();
    if (!queryText) return;

    if (!textToSend) {
      setInputValue("");
    }
    setErrorMsg(null);

    // Save query to past questions list
    setPastQuestions(prev => {
      const updated = [queryText, ...prev.filter(q => q !== queryText)].slice(0, 15);
      localStorage.setItem("rpp_past_questions", JSON.stringify(updated));
      return updated;
    });

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      role: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const updatedHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedHistory })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menghubungi asisten AI.");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1) + "_" + Math.random().toString(36).substring(2, 6),
        role: "model",
        text: data.text || "Mohon maaf, saya mengalami kendala teknis saat menyusun saran.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Koneksi terputus. Mohon pastikan server Anda online.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChatHistory = () => {
    setShowConfirmClear(true);
    setShowHistoryPanel(false);
  };

  const confirmAndClearChats = () => {
    setMessages([]);
    localStorage.removeItem("rpp_chat_messages");
    setErrorMsg(null);
    setIsLoading(false);
    setShowConfirmClear(false);
  };

  const reloadChatHistory = () => {
    setShowHistoryPanel(prev => !prev);
    setShowConfirmClear(false);
  };

  const parseInlineStyles = (rawText: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = rawText;
    let keyIdx = 0;

    while (remaining) {
      const boldIndex = remaining.indexOf("**");
      const codeIndex = remaining.indexOf("`");

      if (boldIndex === -1 && codeIndex === -1) {
        parts.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
        if (boldIndex > 0) {
          parts.push(<span key={keyIdx++}>{remaining.substring(0, boldIndex)}</span>);
        }
        
        const secondBold = remaining.indexOf("**", boldIndex + 2);
        if (secondBold !== -1) {
          const innerText = remaining.substring(boldIndex + 2, secondBold);
          parts.push(
            <strong key={keyIdx++} className="font-extrabold text-[#014AAD] dark:text-[#FBBF24]">
              {innerText}
            </strong>
          );
          remaining = remaining.substring(secondBold + 2);
        } else {
          parts.push(<span key={keyIdx++}>**</span>);
          remaining = remaining.substring(boldIndex + 2);
        }
      } else {
        if (codeIndex > 0) {
          parts.push(<span key={keyIdx++}>{remaining.substring(0, codeIndex)}</span>);
        }
        
        const secondCode = remaining.indexOf("`", codeIndex + 1);
        if (secondCode !== -1) {
          const innerText = remaining.substring(codeIndex + 1, secondCode);
          parts.push(
            <code key={keyIdx++} className="font-mono text-[10px] bg-sky-100 dark:bg-slate-800 text-[#014AAD] dark:text-[#FBBF24] px-1 py-0.5 rounded font-bold">
              {innerText}
            </code>
          );
          remaining = remaining.substring(secondCode + 1);
        } else {
          parts.push(<span key={keyIdx++}>`</span>);
          remaining = remaining.substring(codeIndex + 1);
        }
      }
    }

    return parts;
  };

  const renderMessageContent = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    let inList = false;
    let listType: "bullet" | "number" | null = null;
    const renderedNodes: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (inList) {
          inList = false;
          listType = null;
        }
        renderedNodes.push(<div key={`space-${index}`} className="h-1.5" />);
        return;
      }

      let isHeader = false;
      let headerLevel = 0;
      if (line.startsWith("### ")) {
        isHeader = true;
        headerLevel = 3;
      } else if (line.startsWith("## ")) {
        isHeader = true;
        headerLevel = 2;
      } else if (line.startsWith("# ")) {
        isHeader = true;
        headerLevel = 1;
      }

      if (isHeader) {
        if (inList) {
          inList = false;
          listType = null;
        }
        const rest = line.substring(headerLevel + 1);
        const textClass = headerLevel === 1 
          ? "text-xs font-black text-[#014AAD] dark:text-[#FBBF24] mt-3 mb-1 border-b dark:border-slate-800 pb-0.5 uppercase"
          : headerLevel === 2 
            ? "text-[11px] font-black text-[#014AAD] dark:text-[#FBBF24] mt-2.5 mb-1"
            : "text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 mb-0.5 inline-block";
        renderedNodes.push(<h5 key={`header-${index}`} className={textClass}>{parseInlineStyles(rest)}</h5>);
        return;
      }

      const isBullet = line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ");
      if (isBullet) {
        if (!inList || listType !== "bullet") {
          inList = true;
          listType = "bullet";
        }
        const rest = line.substring(2);
        renderedNodes.push(
          <div key={`bullet-${index}`} className="flex items-start gap-1 ml-2 my-0.5">
            <span className="text-[#014AAD] dark:text-[#FBBF24] font-black shrink-0 text-xs">•</span>
            <span className="text-[11px] font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
              {parseInlineStyles(rest)}
            </span>
          </div>
        );
        return;
      }

      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        if (!inList || listType !== "number") {
          inList = true;
          listType = "number";
        }
        const num = numMatch[1];
        const rest = numMatch[2];
        renderedNodes.push(
          <div key={`num-${index}`} className="flex items-start gap-1 ml-2 my-0.5">
            <span className="text-[#014AAD] dark:text-[#FBBF24] font-black shrink-0 text-[10px]">{num}.</span>
            <span className="text-[11px] font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
              {parseInlineStyles(rest)}
            </span>
          </div>
        );
        return;
      }

      if (inList) {
        inList = false;
        listType = null;
      }
      renderedNodes.push(
        <p key={`p-${index}`} className="text-[11px] font-semibold leading-relaxed my-1 text-slate-750 dark:text-slate-300">
          {parseInlineStyles(line)}
        </p>
      );
    });

    return renderedNodes;
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Subtle tooltip help speech bubble */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`mb-3 mr-1 p-3 rounded-2xl shadow-xl border text-[11px] font-bold w-48 relative ${
                darkMode 
                  ? "bg-slate-900 border-slate-700 text-[#FBBF24]" 
                  : "bg-white border-slate-100 text-[#014AAD] shadow-blue-500/5"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="animate-spin text-amber-500 shrink-0" />
                <span>Ada Pertanyaan, Guru? Tanya AI di sini! ✨</span>
              </div>
              {/* Arrow pointing down */}
              <div className={`absolute bottom-[-6px] right-6 w-3 h-3 rotate-45 border-r border-b ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Button glow effect */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#014AAD]/40 ${
            isOpen 
              ? "bg-rose-500 text-white" 
              : "bg-[#014AAD] text-[#FBBF24] dark:text-amber-300 hover:bg-[#003480] dark:bg-slate-800"
          }`}
          style={{ width: "60px", height: "60px" }}
          id="global-chat-fab"
          title="Tanya Jawab AI Guru"
        >
          {isOpen ? (
            <X size={26} className="stroke-[2.5]" />
          ) : (
            <>
              <Bot size={26} className="stroke-[2.2] animate-pulse" />
              {/* Pulsing indicator badge */}
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full animate-bounce" />
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Box Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className={`fixed bottom-24 right-5 sm:right-6 z-45 w-[calc(100vw-32px)] sm:w-[420px] h-[550px] max-h-[80vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-100 shadow-slate-950/60" 
                : "bg-white border-slate-200/80 text-slate-800 shadow-slate-300/40"
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-sky-50/75 border-slate-100"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#014AAD]/10 text-[#014AAD] dark:text-[#FBBF24] shrink-0">
                  <GraduationCap size={18} className="stroke-[2.5]" />
                </div>
                <div className="leading-tight">
                  <h3 className="text-xs font-black tracking-tight text-[#014AAD] dark:text-amber-400 uppercase">
                    Asisten AI Guru
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Pribadi Anda
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={reloadChatHistory}
                  className={`p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-[#014AAD] dark:hover:text-[#FBBF24] transition-colors cursor-pointer`}
                  title="Muat Ulang Riwayat Pertanyaan"
                >
                  <RefreshCw size={12} className="stroke-[2.5]" />
                </button>
                {messages.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className={`p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer`}
                    title="Hapus Semua Riwayat Chat"
                  >
                    <Trash2 size={13} className="stroke-[2]" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer`}
                  title="Minimize Chat"
                >
                  <Minimize2 size={13} className="stroke-[2]" />
                </button>
              </div>
            </div>

            {/* INLINE CONFIRMATION OVERLAY FOR TRASH DELETE */}
            <AnimatePresence>
              {showConfirmClear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500 text-white text-[11px] font-bold p-3.5 flex flex-col items-center justify-center text-center gap-2 z-30 shrink-0 select-none shadow-md"
                >
                  <p>Hapus seluruh riwayat obrolan dengan asisten AI dan kembali ke menu awal?</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={confirmAndClearChats}
                      className="px-3 py-1.5 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors uppercase text-[9px] font-black cursor-pointer shadow-sm animate-pulse"
                    >
                      Ya, Hapus Chat
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="px-3 py-1.5 bg-rose-600/50 border border-white/20 hover:bg-rose-600/70 rounded-lg text-white transition-colors uppercase text-[9px] font-black cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RECURRING PAST QUESTIONS HISTORY OVERLAY DRAWER */}
            <AnimatePresence>
              {showHistoryPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "100%" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className={`absolute left-0 right-0 top-[65px] bottom-0 z-30 p-4 border-b flex flex-col justify-between shadow-2xl overflow-hidden ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                  }`}
                  style={{ height: "calc(100% - 65px)" }}
                >
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800 shrink-0">
                      <div className="flex items-center gap-1.5 text-[#014AAD] dark:text-[#FBBF24]">
                        <RefreshCw size={13} className="animate-spin text-amber-500 text-xs shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Muat Pertanyaan Guru</span>
                      </div>
                      <button
                        onClick={() => setShowHistoryPanel(false)}
                        className="p-1 rounded-md hover:bg-slate-500/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        <X size={14} className="stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-custom select-none">
                      {pastQuestions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                          <div className="w-9 h-9 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center">
                            <MessageSquare size={16} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400">Belum ada riwayat pertanyaan.</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed px-5">Pertanyaan baru yang Anda tanyakan akan disimpan secara otomatis di sini.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Muat ulang pertanyaan yang pernah ditanyakan:</p>
                          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                            {pastQuestions.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setInputValue(q);
                                  setShowHistoryPanel(false);
                                }}
                                className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-semibold leading-relaxed transition-all cursor-pointer active:scale-98 flex items-start gap-2 ${
                                  darkMode
                                    ? "bg-slate-900 border-slate-850 hover:bg-slate-800 hover:border-[#014AAD]/40"
                                    : "bg-slate-50 border-slate-150 hover:bg-white hover:border-[#014AAD]/30 hover:shadow-xs"
                                }`}
                                title="Salin pertanyaan ini ke input chat"
                              >
                                <span className="text-slate-400 font-bold text-[10px] shrink-0">{idx + 1}.</span>
                                <span className="break-words text-slate-700 dark:text-slate-300 line-clamp-3">{q}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {pastQuestions.length > 0 && (
                      <div className="pt-3 border-t border-slate-150 dark:border-slate-800 shrink-0">
                        <button
                          onClick={() => {
                            setPastQuestions([]);
                            localStorage.removeItem("rpp_past_questions");
                          }}
                          className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-transparent transition-all text-center cursor-pointer active:scale-95"
                        >
                          Hapus Daftar Riwayat Guru
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Pane Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-custom">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center text-center space-y-5 py-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-blue-500/10 text-[#014AAD] dark:text-blue-400 flex items-center justify-center mb-1">
                      <Bot size={22} className="animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#014AAD] dark:text-[#FBBF24]">
                      Asisten Merdeka SD
                    </span>
                    <p className={`text-[11px] font-semibold leading-relaxed px-5 mb-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                      Halo Bapak/Ibu Guru! Saya siap membantu merancang RPP, silabus, manajemen kelas, atau ice breaking mengajar di SD. 
                      Silakan ketik pertanyaan Anda atau pilih pintasan berikut:
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-col gap-2 px-2">
                    {suggestions.map((sug, idx) => {
                      const Icon = sug.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug.prompt)}
                          className={`p-2.5 rounded-xl border text-left flex gap-2.5 transition-all duration-150 group cursor-pointer active:scale-98 ${
                            darkMode 
                              ? "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-[#014AAD]/40" 
                              : "bg-slate-50 border-slate-150 hover:bg-white hover:border-[#014AAD]/35 hover:shadow-xs"
                          }`}
                        >
                          <div className="p-1.5 h-fit rounded-lg bg-blue-500/10 text-[#014AAD] dark:text-amber-400 group-hover:bg-[#014AAD] group-hover:text-white transition-colors shrink-0">
                            <Icon size={13} />
                          </div>
                          <div className="truncate space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase text-[#014AAD] dark:text-amber-400 flex items-center gap-1">
                              <span>{sug.title}</span>
                              <ArrowRight size={8} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h4>
                            <p className={`text-[9px] font-semibold leading-tight text-slate-450 dark:text-slate-400`}>
                              {sug.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Past Questions History list in landing view */}
                  {pastQuestions.length > 0 && (
                    <div className="mt-4 px-2 space-y-1.5 border-t border-dashed border-slate-200 dark:border-slate-800/80 pt-3 text-left">
                      <div className="flex items-center justify-between pl-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-1">
                          <RefreshCw size={9} className="text-amber-500 shrink-0" />
                          <span>Riwayat Pertanyaan Anda</span>
                        </span>
                        <button
                          onClick={() => {
                            setPastQuestions([]);
                            localStorage.removeItem("rpp_past_questions");
                          }}
                          className="text-[9px] font-extrabold text-rose-500 hover:underline cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto scrollbar-custom pr-0.5 text-left">
                        {pastQuestions.slice(0, 3).map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className={`p-2 text-left text-[10px] font-semibold rounded-lg border leading-snug transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 ${
                              darkMode 
                                ? "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800"
                                : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50 hover:border-[#014AAD]/20"
                            }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                            <span className="break-words line-clamp-1 italic text-slate-600 dark:text-slate-350">"{q}"</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 max-w-[92%] ${
                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Round icon */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                        msg.role === "user"
                          ? "bg-[#014AAD] text-white"
                          : "bg-[#FBBF24]/10 text-[#014AAD] dark:text-[#FBBF24] border border-[#FBBF24]/20"
                      }`}>
                        {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                      </div>

                      {/* Msg Wrap */}
                      <div className="flex flex-col gap-0.5 max-w-[85%]">
                        <div className={`p-3 rounded-2xl relative ${
                          msg.role === "user"
                            ? "bg-[#014AAD] text-white rounded-tr-none"
                            : darkMode 
                              ? "bg-slate-900 border border-slate-850 text-slate-100 rounded-tl-none" 
                              : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none"
                        }`}>
                          
                          {/* Inner Content Parse */}
                          <div className="space-y-0.5 select-text">
                            {msg.role === "user" ? (
                              <p className="text-[11px] font-semibold leading-relaxed break-words">{msg.text}</p>
                            ) : (
                              renderMessageContent(msg.text)
                            )}
                          </div>

                          {/* Quick copy buttons */}
                          {msg.role === "model" && (
                            <div className="absolute right-1.5 top-1.5 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.text)}
                                className={`p-1 rounded bg-slate-800/10 hover:bg-slate-800/20 text-slate-400 hover:text-slate-650 dark:hover:text-white border border-transparent transition-all`}
                                title="Salin Teks"
                              >
                                {copiedId === msg.id ? <Check size={9} className="text-emerald-500" /> : <Copy size={9} />}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className={`flex items-center gap-1 text-[8px] font-bold text-slate-400 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}>
                          <span>{msg.timestamp}</span>
                          {msg.role === "model" && (
                            <>
                              <span>•</span>
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.text)}
                                className="hover:text-[#014AAD] dark:hover:text-[#FBBF24] transition-colors"
                              >
                                {copiedId === msg.id ? "Tersalin!" : "Salin"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading dot-animation for text streaming */}
                  {isLoading && (
                    <div className="flex gap-2 mr-auto max-w-[80%]">
                      <div className="w-7 h-7 rounded-full bg-[#FBBF24]/10 text-[#014AAD] dark:text-[#FBBF24] border border-[#FBBF24]/20 flex items-center justify-center shrink-0">
                        <Bot size={12} />
                      </div>
                      <div className="flex flex-col gap-0.5 w-[90%]">
                        <div className={`p-3 rounded-2xl rounded-tl-none flex items-center ${
                          darkMode ? "bg-slate-900 border border-slate-850" : "bg-slate-50 border border-slate-150"
                        }`}>
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#014AAD] dark:bg-[#FBBF24] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-1 rounded-full bg-[#014AAD] dark:bg-[#FBBF24] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-1 rounded-full bg-[#014AAD] dark:bg-[#FBBF24] animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                        <span className="text-[8px] font-extrabold text-slate-400 select-none animate-pulse">Menghubungi server pendidikan...</span>
                      </div>
                    </div>
                  )}

                  {/* Error Notification Block */}
                  {errorMsg && (
                    <div className={`p-3 rounded-2xl border text-[10px] text-rose-500 font-semibold max-w-sm mx-auto flex flex-col gap-1 ${
                      darkMode ? "bg-rose-500/10 border-rose-500/20" : "bg-rose-50 border-rose-100"
                    }`}>
                      <p className="font-extrabold">Ada kesalahan:</p>
                      <p>{errorMsg}</p>
                      <button
                        onClick={() => handleSend()}
                        className="text-[9px] font-black uppercase text-left tracking-wide mt-0.5 text-[#014AAD] dark:text-amber-400 hover:underline"
                      >
                        Coba lagi
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input Bar */}
            <div className={`p-3.5 border-t ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50/70 border-slate-100"
            }`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan kurikulum/manajemen mengajar..."
                  disabled={isLoading}
                  className={`flex-1 py-2.5 pl-3.5 pr-11 text-[11px] font-semibold rounded-xl border transition-all outline-none focus:ring-1 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/40"
                      : "bg-white border-slate-200 text-slate-800 focus:border-[#014AAD] focus:ring-[#014AAD]/20 shadow-xs"
                  }`}
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={`absolute right-1.5 p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    !inputValue.trim() || isLoading
                      ? "text-slate-400 bg-transparent cursor-not-allowed"
                      : "bg-[#014AAD] hover:bg-opacity-90 dark:bg-[#FBBF24] text-white dark:text-[#014AAD]"
                  }`}
                  title="Kirim"
                >
                  <Send size={12} className="stroke-[2.5]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

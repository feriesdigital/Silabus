import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  darkMode?: boolean;
  hideToolbar?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, className = "", darkMode = false, hideToolbar = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Synchronize incoming value with DOM, preserving cursor position if edit was made here
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (e: React.MouseEvent, command: string, val: string = "") => {
    e.preventDefault();
    e.stopPropagation();
    document.execCommand(command, false, val);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  // Determine if empty
  const isEmpty = !value || value === "<p><br></p>" || value === "<br>" || value === "" || value === "<div><br></div>";

  return (
    <div className={`flex flex-col rounded-xl border transition-all duration-150 relative rich-text-wrapper ${
      darkMode 
        ? `bg-slate-900 border-slate-700 ${isFocused ? 'ring-1 ring-blue-500 border-blue-500' : ''}` 
        : `bg-slate-50 border-slate-200 ${isFocused ? 'ring-1 ring-blue-600 border-blue-600' : ''}`
    } ${className}`}>
      
      {/* Toolbar */}
      {!hideToolbar && (
        <div className={`flex items-center gap-1.5 p-1.5 border-b rounded-t-xl transition-colors duration-150 ${
          darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "bold")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Tebal (Bold)"
          >
            <Bold size={13} className="stroke-[2.5]" />
          </button>
          
          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "italic")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Miring (Italic)"
          >
            <Italic size={13} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "underline")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Garis Bawah (Underline)"
          >
            <Underline size={13} className="stroke-[2.5]" />
          </button>

          <div className={`w-[1px] h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "insertUnorderedList")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Daftar Bulet (Bullet List)"
          >
            <List size={13} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "insertOrderedList")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Daftar Angka (Numbered List)"
          >
            <ListOrdered size={13} className="stroke-[2.5]" />
          </button>

          <div className={`w-[1px] h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

          <button
            type="button"
            onMouseDown={(e) => execCommand(e, "removeFormat")}
            className="p-1 rounded-md hover:bg-slate-500/20 active:bg-slate-500/40 transition-colors cursor-pointer"
            title="Hapus Format"
          >
            <Type size={13} />
          </button>
        </div>
      )}

      {/* Editable Field */}
      <div className="relative flex-1 min-h-[80px] w-full flex flex-col">
        {isEmpty && placeholder && (
          <div className="absolute top-2 left-2 text-slate-400 dark:text-slate-500 text-xs select-none pointer-events-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          className={`flex-1 p-2 text-xs leading-relaxed focus:outline-none overflow-y-auto max-w-full text-left ${
            darkMode ? "text-slate-200 bg-slate-900" : "text-slate-800 bg-white"
          } ${hideToolbar ? 'rounded-xl' : 'rounded-b-xl'}`}
          style={{ minHeight: "80px" }}
        />
      </div>
    </div>
  );
}

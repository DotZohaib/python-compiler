"use client";

import { useEffect, useRef } from "react";
import type { OutputLine } from "@/app/page";

interface TerminalProps {
  lines: OutputLine[];
  isRunning: boolean;
  onClear: () => void;
}

export default function Terminal({ lines, isRunning, onClear }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, isRunning]);

  return (
    <div className="flex flex-col h-full font-mono relative bg-[#09090b]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-5 h-11 bg-white/[0.01] border-b border-white/[0.04] flex-shrink-0 z-10">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 border-b-[2px] border-blue-500 h-full pt-0.5">
            <span className="text-[11.5px] font-semibold text-white tracking-widest uppercase">Terminal</span>
          </div>
          <div className="flex items-center gap-2 h-full pt-0.5 border-b-[2px] border-transparent cursor-not-allowed group">
            <span className="text-[11.5px] font-medium text-white/30 tracking-widest uppercase group-hover:text-white/50 transition-colors">Output</span>
          </div>
          <div className="flex items-center gap-2 h-full pt-0.5 border-b-[2px] border-transparent cursor-not-allowed group">
            <span className="text-[11.5px] font-medium text-white/30 tracking-widest uppercase group-hover:text-white/50 transition-colors">Problems</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="flex items-center gap-2.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <span className="text-[10.5px] font-bold text-blue-400 tracking-wider uppercase">Executing</span>
            </div>
          )}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-medium text-white/40 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all duration-200"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 overflow-y-auto p-5 selection:bg-blue-500/30 text-[13.5px] leading-relaxed">
        {lines.length === 0 && !isRunning ? (
          <EmptyState />
        ) : (
          <div className="space-y-1.5 pb-6">
            {lines.map((line) => (
              <OutputRow key={line.id} line={line} />
            ))}

            {isRunning && (
              <div className="flex items-center gap-3 mt-3 px-3">
                <span className="text-blue-500 font-bold opacity-80">❯</span>
                <span className="text-white/50 cursor-blink font-mono tracking-wide">python main.py</span>
              </div>
            )}
            <div ref={bottomRef} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
}

function OutputRow({ line }: { line: OutputLine }) {
  const styles = getLineStyle(line.type);

  return (
    <div className={`flex items-start gap-4 px-3 py-2 rounded-lg animate-fade-in hover:bg-white/[0.02] transition-colors border border-transparent ${styles.rowBg}`}>
      <span className={`mt-0.5 flex-shrink-0 text-[14px] font-bold ${styles.prefix}`}>{styles.glyph}</span>
      <pre className={`flex-1 whitespace-pre-wrap break-all font-mono m-0 ${styles.text}`}>
        {line.content}
      </pre>
      <span className="text-[10px] text-white/20 mt-1 flex-shrink-0 font-sans font-medium tracking-wider">
        {line.timestamp}
      </span>
    </div>
  );
}

function getLineStyle(type: OutputLine["type"]) {
  switch (type) {
    case "stdout":
      return { glyph: "›", prefix: "text-white/30", text: "text-white/80", rowBg: "" };
    case "stderr":
      return { glyph: "✕", prefix: "text-red-400", text: "text-red-400 font-medium", rowBg: "bg-red-500/[0.03] !border-red-500/10" };
    case "error":
      return { glyph: "●", prefix: "text-red-500", text: "text-red-500 font-medium", rowBg: "bg-red-500/[0.05] !border-red-500/20" };
    case "success":
      return { glyph: "✓", prefix: "text-emerald-400", text: "text-emerald-400", rowBg: "bg-emerald-500/[0.02] !border-emerald-500/10" };
    case "info":
    default:
      return { glyph: "ℹ", prefix: "text-blue-400", text: "text-blue-200", rowBg: "" };
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 opacity-40 select-none animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
      </div>
      <div className="text-center font-sans">
        <p className="text-[14px] text-white font-medium mb-1.5 tracking-wide">Terminal is Ready</p>
        <p className="text-[12.5px] text-white/50">
          Press <kbd className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-[11px] font-medium mx-1 shadow-sm">Ctrl</kbd> + <kbd className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-[11px] font-medium mx-1 shadow-sm">Enter</kbd> to run your code
        </p>
      </div>
    </div>
  );
}

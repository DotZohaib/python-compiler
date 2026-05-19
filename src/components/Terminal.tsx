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
    <div className="flex flex-col h-full font-mono relative bg-[#0A0A0A]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.08] flex-shrink-0 z-10 bg-[#121212]">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 border-b border-white h-full pt-px">
            <span className="text-xs font-medium text-[#EDEDED] tracking-wide uppercase">Terminal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRunning && (
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08]">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-semibold text-[#EDEDED] tracking-wider uppercase">Executing</span>
            </div>
          )}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#71717A] hover:text-[#EDEDED] hover:bg-white/[0.08] active:scale-95 transition-all duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path></svg>
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 overflow-y-auto p-4 selection:bg-white/[0.15] text-[13px] leading-relaxed">
        {lines.length === 0 && !isRunning ? (
          <EmptyState />
        ) : (
          <div className="space-y-1 pb-4">
            {lines.map((line) => (
              <OutputRow key={line.id} line={line} />
            ))}

            {isRunning && (
              <div className="flex items-center gap-3 mt-2 px-2">
                <span className="text-[#EDEDED] font-medium opacity-50">❯</span>
                <span className="text-[#A1A1AA] cursor-blink font-mono tracking-wide">python main.py</span>
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
    <div className={`flex items-start gap-4 px-2 py-1 rounded animate-fade-in hover:bg-white/[0.03] transition-colors border border-transparent ${styles.rowBg}`}>
      <span className={`mt-0.5 flex-shrink-0 text-sm font-medium ${styles.prefix}`}>{styles.glyph}</span>
      <pre className={`flex-1 whitespace-pre-wrap break-all font-mono m-0 ${styles.text}`}>
        {line.content}
      </pre>
      <span className="text-[10px] text-[#71717A] mt-1 flex-shrink-0 font-sans tracking-wider">
        {line.timestamp}
      </span>
    </div>
  );
}

function getLineStyle(type: OutputLine["type"]) {
  switch (type) {
    case "stdout":
      return { glyph: "›", prefix: "text-[#71717A]", text: "text-[#A1A1AA]", rowBg: "" };
    case "stderr":
      return { glyph: "✕", prefix: "text-[#EF4444]", text: "text-[#EF4444]", rowBg: "" };
    case "error":
      return { glyph: "●", prefix: "text-[#EF4444]", text: "text-[#EF4444]", rowBg: "" };
    case "success":
      return { glyph: "✓", prefix: "text-[#10B981]", text: "text-[#10B981]", rowBg: "" };
    case "info":
    default:
      return { glyph: "ℹ", prefix: "text-[#3B82F6]", text: "text-[#3B82F6]", rowBg: "" };
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40 select-none animate-fade-in">
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EDEDED]"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
      </div>
      <div className="text-center font-sans">
        <p className="text-sm text-[#EDEDED] font-medium mb-1 tracking-wide">Terminal Ready</p>
        <p className="text-xs text-[#71717A]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-medium mx-1 shadow-sm">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-medium mx-1 shadow-sm">Enter</kbd> to run
        </p>
      </div>
    </div>
  );
}

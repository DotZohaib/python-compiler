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
    <div className="flex flex-col h-full font-mono relative">
      {/* Glossy overlay effect for the top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 h-10 bg-[#121214] border-b border-white/[0.05] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-b-2 border-blue-500 h-full px-1">
            <span className="text-[12px] font-medium text-zinc-100 tracking-wider">TERMINAL</span>
          </div>
          <div className="flex items-center gap-2 h-full px-1 cursor-not-allowed opacity-50">
            <span className="text-[12px] font-medium text-zinc-500 tracking-wider">PROBLEMS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRunning && (
            <div className="flex items-center gap-2 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
              <span className="text-[11px] font-medium text-blue-400 tracking-wide uppercase">Executing</span>
            </div>
          )}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#09090b] selection:bg-blue-500/30 text-[13.5px] leading-relaxed">
        {lines.length === 0 && !isRunning ? (
          <EmptyState />
        ) : (
          <div className="space-y-1 pb-4">
            {lines.map((line) => (
              <OutputRow key={line.id} line={line} />
            ))}

            {isRunning && (
              <div className="flex items-start gap-3 mt-2 opacity-80">
                <span className="text-blue-500 font-bold mt-0.5">❯</span>
                <span className="text-zinc-400 cursor-blink">python main.py</span>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

function OutputRow({ line }: { line: OutputLine }) {
  const styles = getLineStyle(line.type);

  return (
    <div className={`flex items-start gap-3 px-2 py-1.5 rounded-md animate-fade-in hover:bg-white/[0.02] transition-colors ${styles.rowBg}`}>
      <span className={`mt-0.5 flex-shrink-0 text-[14px] font-bold ${styles.prefix}`}>{styles.glyph}</span>
      <pre className={`flex-1 whitespace-pre-wrap break-all font-mono m-0 ${styles.text}`}>
        {line.content}
      </pre>
      <span className="text-[10px] text-zinc-600 mt-1 flex-shrink-0 font-sans tracking-wide">
        {line.timestamp}
      </span>
    </div>
  );
}

function getLineStyle(type: OutputLine["type"]) {
  switch (type) {
    case "stdout":
      return { glyph: "›", prefix: "text-zinc-600", text: "text-zinc-300", rowBg: "" };
    case "stderr":
      return { glyph: "✕", prefix: "text-red-400", text: "text-red-400", rowBg: "bg-red-500/5 border border-red-500/10" };
    case "error":
      return { glyph: "●", prefix: "text-red-500", text: "text-red-500", rowBg: "bg-red-500/10 border border-red-500/20" };
    case "success":
      return { glyph: "✓", prefix: "text-emerald-400", text: "text-emerald-400", rowBg: "bg-emerald-500/5 border border-emerald-500/10" };
    case "info":
    default:
      return { glyph: "ℹ", prefix: "text-blue-400", text: "text-blue-200", rowBg: "" };
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40 select-none">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
      <div className="text-center font-sans">
        <p className="text-[14px] text-zinc-400 font-medium mb-1">Terminal is ready</p>
        <p className="text-[12px] text-zinc-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] mx-1">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] mx-1">Enter</kbd> to run your code
        </p>
      </div>
    </div>
  );
}

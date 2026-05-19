"use client";

import { useState, useCallback, useEffect } from "react";
import IDEHeader from "@/components/IDEHeader";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import ResizableDivider from "@/components/ResizableDivider";
import { runPythonCode, getPyodide } from "@/lib/pyodide";

export type OutputLine = {
  id: string;
  type: "stdout" | "stderr" | "info" | "success" | "error";
  content: string;
  timestamp: string;
};

const PYTHON_STARTER_CODE = `# Welcome to PyCompile 🐍
# A next-generation Python execution environment in your browser.

`;

function makeLine(type: OutputLine["type"], content: string): OutputLine {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    timestamp: new Date().toLocaleTimeString([], { hour12: false }),
  };
}

export default function HomePage() {
  const [code, setCode] = useState<string>(PYTHON_STARTER_CODE);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalHeight, setTerminalHeight] = useState<number>(320);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value ?? "");
  }, []);

  useEffect(() => {
    getPyodide().catch((err) => {
      console.error("Failed to preload Pyodide:", err);
    });
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    const trimmed = code.trim();
    if (!trimmed) {
      setOutputLines([makeLine("error", "✕ Cannot run empty code.")]);
      return;
    }

    setIsRunning(true);
    const newLines: OutputLine[] = [makeLine("info", "▶ Starting execution environment...")];
    setOutputLines(newLines);

    try {
      const { success, execution_time_ms } = await runPythonCode(code, (line) => {
        newLines.push(line);
        setOutputLines([...newLines]);
      });

      if (success) {
        newLines.push(makeLine("success", `✓ Process finished with exit code 0 (${execution_time_ms} ms)`));
      } else {
        newLines.push(makeLine("error", `✕ Process exited with errors (${execution_time_ms} ms)`));
      }
      setOutputLines([...newLines]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      setOutputLines([...newLines, makeLine("error", `✕ Execution failed: ${msg}`)]);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code]);

  const handleClearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#09090b] text-zinc-50 font-sans selection:bg-blue-500/30">
      <IDEHeader isRunning={isRunning} onRun={handleRun} />

      <div className="flex flex-1 overflow-hidden pt-2 pb-3 px-3 gap-3">
        {/* Slim Activity Bar */}
        <div className="w-12 flex flex-col items-center py-4 gap-6 bg-zinc-900/50 rounded-xl border border-white/5 backdrop-blur-md">
          <button className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-all hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </button>
          <button className="p-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="p-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </button>
          <div className="flex-1" />
          <button className="p-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-col flex-1 overflow-hidden bg-[#121214] rounded-xl border border-white/[0.08] shadow-2xl relative">
          {/* File Tab */}
          <div className="flex items-center px-4 h-11 bg-[#18181b] border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#27272a]/50 rounded-md border border-white/[0.05]">
              <span className="text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </span>
              <span className="text-[13px] font-medium text-zinc-300 font-mono">main.py</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden" style={{ minHeight: "200px" }}>
            <CodeEditor code={code} onChange={handleCodeChange} onRun={handleRun} />
          </div>

          <ResizableDivider terminalHeight={terminalHeight} onResize={setTerminalHeight} />

          <div
            className="flex flex-col flex-shrink-0 bg-[#09090b] border-t border-white/[0.05] relative"
            style={{ height: `${terminalHeight}px`, minHeight: "120px", maxHeight: "70vh" }}
          >
            <Terminal lines={outputLines} isRunning={isRunning} onClear={handleClearOutput} />
          </div>
        </div>
      </div>
    </div>
  );
}

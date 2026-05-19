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
  const [terminalWidth, setTerminalWidth] = useState<number>(500);

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
    const newLines: OutputLine[] = [makeLine("info", "▶ Initializing environment...")];
    setOutputLines(newLines);

    try {
      const { success, execution_time_ms } = await runPythonCode(code, (line) => {
        newLines.push(line);
        setOutputLines([...newLines]);
      });

      if (success) {
        newLines.push(makeLine("success", `✓ Execution successful (${execution_time_ms} ms)`));
      } else {
        newLines.push(makeLine("error", `✕ Execution failed with errors (${execution_time_ms} ms)`));
      }
      setOutputLines([...newLines]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      setOutputLines([...newLines, makeLine("error", `✕ Critical Error: ${msg}`)]);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code]);

  const handleClearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#000000] text-[#EDEDED] font-sans">
      <IDEHeader isRunning={isRunning} onRun={handleRun} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace Container */}
        <main className="flex flex-row flex-1 overflow-hidden bg-[#0A0A0A] relative">
          
          <div className="flex-1 overflow-hidden" style={{ minWidth: "200px" }}>
            <CodeEditor code={code} onChange={handleCodeChange} onRun={handleRun} />
          </div>

          <ResizableDivider terminalWidth={terminalWidth} onResize={setTerminalWidth} />

          <div
            className="flex flex-col flex-shrink-0 bg-[#0A0A0A] relative z-20"
            style={{ width: `${terminalWidth}px`, minWidth: "200px", maxWidth: "70vw" }}
          >
            <Terminal lines={outputLines} isRunning={isRunning} onClear={handleClearOutput} />
          </div>
        </main>
      </div>
    </div>
  );
}

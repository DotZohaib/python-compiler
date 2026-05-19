"use client";

import { useState, useCallback, useEffect } from "react";
import IDEHeader from "@/components/IDEHeader";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import ResizableDivider from "@/components/ResizableDivider";
import { runPythonCode, getPyodide } from "@/lib/pyodide";

// ── Types shared with Terminal component ──────────────────────────────────────
export type OutputLine = {
  id: string;
  type: "stdout" | "stderr" | "info" | "success" | "error";
  content: string;
  timestamp: string;
};

// Response shape returned by FastAPI /execute
type ApiResponse = {
  success: boolean;
  exit_code: number;
  stdout: string;
  stderr: string;
  timed_out: boolean;
  execution_time_ms: number;
  lines: { type: "stdout" | "stderr" | "info" | "success" | "error"; content: string }[];
};

// ── Starter code shown in the editor on first load ────────────────────────────
const PYTHON_STARTER_CODE = `# Welcome to PyCompile 🐍
# Write your Python code here and click "Run" (or press Ctrl+Enter).

def greet(name: str) -> str:
    """Return a personalized greeting."""
    return f"Hello, {name}! Welcome to PyCompile."

def fibonacci(n: int) -> list[int]:
    """Generate the first n Fibonacci numbers."""
    if n <= 0:
        return []
    seq = [0, 1]
    for _ in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


# --- Main ---
print(greet("World"))

fib = fibonacci(10)
print(f"First 10 Fibonacci numbers: {fib}")

for i, num in enumerate(fib):
    print(f"  fib({i}) = {num}")
`;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://python-compiler-backend.vercel.app";

// ── Helper: make a unique OutputLine ─────────────────────────────────────────
function makeLine(
  type: OutputLine["type"],
  content: string
): OutputLine {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    timestamp: new Date().toLocaleTimeString(),
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const [code, setCode] = useState<string>(PYTHON_STARTER_CODE);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalHeight, setTerminalHeight] = useState<number>(280);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value ?? "");
  }, []);

  // Preload Pyodide when the page loads
  useEffect(() => {
    getPyodide().catch((err) => {
      console.error("Failed to preload Pyodide:", err);
    });
  }, []);

  // ── Run handler — calls Pyodide in the browser ──────────────────────────
  const handleRun = useCallback(async () => {
    if (isRunning) return;

    const trimmed = code.trim();
    if (!trimmed) {
      setOutputLines([makeLine("error", "✕ Cannot run empty code.")]);
      return;
    }

    setIsRunning(true);
    // Clear previous output and show running state
    const newLines: OutputLine[] = [makeLine("info", "▶ Running Python code (Pyodide)…")];
    setOutputLines(newLines);

    try {
      const { success, execution_time_ms } = await runPythonCode(code, (line) => {
        newLines.push(line);
        // Force a re-render to stream output if needed, but for now we just 
        // update the state. Since we are mutating the array, we need to create a new one.
        setOutputLines([...newLines]);
      });

      if (success) {
        newLines.push(
          makeLine("success", `✓ Process finished with exit code 0  (${execution_time_ms} ms)`)
        );
      } else {
        newLines.push(
          makeLine("error", `✕ Process exited with errors  (${execution_time_ms} ms)`)
        );
      }
      setOutputLines([...newLines]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      setOutputLines([
        ...newLines,
        makeLine("error", `✕ Execution failed: ${msg}`),
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code]);

  const handleClearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-workspace)" }}
    >
      {/* ── Top Header ── */}
      <IDEHeader
        isRunning={isRunning}
        onRun={handleRun}
        onClear={handleClearOutput}
      />

      {/* ── Workspace: Editor + Divider + Terminal ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Editor — takes all remaining vertical space */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: "200px" }}>
          <CodeEditor code={code} onChange={handleCodeChange} onRun={handleRun} />
        </div>

        {/* Drag-to-resize divider */}
        <ResizableDivider
          terminalHeight={terminalHeight}
          onResize={setTerminalHeight}
        />

        {/* Terminal — fixed height, user-resizable via divider */}
        <div
          style={{
            height: `${terminalHeight}px`,
            minHeight: "120px",
            maxHeight: "70vh",
            backgroundColor: "var(--bg-terminal)",
            borderTop: "1px solid var(--border-primary)",
            flexShrink: 0,
          }}
        >
          <Terminal
            lines={outputLines}
            isRunning={isRunning}
            onClear={handleClearOutput}
          />
        </div>
      </div>
    </div>
  );
}

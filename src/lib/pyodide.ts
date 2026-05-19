"use client";

import type { OutputLine } from "@/app/page";

let pyodideInstance: any = null;
let isLoading = false;

// We will inject the pyodide script dynamically
export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isLoading) {
    // wait for it to load
    while (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return pyodideInstance;
  }
  
  isLoading = true;
  
  if (typeof window !== "undefined" && !(window as any).loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide script."));
      document.head.appendChild(script);
    });
  }

  pyodideInstance = await (window as any).loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
  });
  
  isLoading = false;
  return pyodideInstance;
}

export async function runPythonCode(
  code: string,
  onOutput: (line: OutputLine) => void
): Promise<{ success: boolean; execution_time_ms: number }> {
  const pyodide = await getPyodide();

  const start = performance.now();
  let success = true;

  // We override stdout and stderr to capture print statements
  pyodide.setStdout({
    batched: (text: string) => {
      onOutput({
        id: crypto.randomUUID(),
        type: "stdout",
        content: text,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
  });

  pyodide.setStderr({
    batched: (text: string) => {
      onOutput({
        id: crypto.randomUUID(),
        type: "stderr",
        content: text,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
  });

  try {
    // Run the code
    await pyodide.runPythonAsync(code);
  } catch (error: any) {
    success = false;
    onOutput({
      id: crypto.randomUUID(),
      type: "error",
      content: error.message || String(error),
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  const execution_time_ms = Math.round(performance.now() - start);
  return { success, execution_time_ms };
}

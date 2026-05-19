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

  // Auto-scroll to bottom when new output arrives or running state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, isRunning]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
    >
      {/* ── Terminal Titlebar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 select-none"
        style={{
          height: "36px",
          backgroundColor: "var(--bg-panel)",
          borderBottom: "1px solid var(--border-primary)",
          flexShrink: 0,
        }}
      >
        {/* Left: title + status */}
        <div className="flex items-center gap-2">
          <TerminalIcon />
          <span
            style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "inherit" }}
          >
            OUTPUT
          </span>

          {/* Running indicator */}
          {isRunning && (
            <div className="flex items-center gap-1.5 ml-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                style={{ backgroundColor: "var(--terminal-prompt)" }}
              />
              <span style={{ fontSize: "11px", color: "var(--terminal-prompt)" }}>
                executing
              </span>
            </div>
          )}
        </div>

        {/* Right: line count + clear */}
        <div className="flex items-center gap-3">
          {lines.length > 0 && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {lines.length} line{lines.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            id="btn-terminal-clear"
            onClick={onClear}
            title="Clear output"
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-secondary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)")
            }
          >
            clear
          </button>
        </div>
      </div>

      {/* ── Output Scroll Area ────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-auto p-4"
        style={{ backgroundColor: "var(--bg-terminal)" }}
      >
        {lines.length === 0 && !isRunning ? (
          <EmptyState />
        ) : (
          <div className="space-y-0.5">
            {lines.map((line) => (
              <OutputRow key={line.id} line={line} />
            ))}

            {/* Running spinner row */}
            {isRunning && (
              <div className="flex items-center gap-2 mt-1" style={{ opacity: 0.7 }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--terminal-prompt)",
                    fontFamily: "inherit",
                  }}
                >
                  $
                </span>
                <span
                  className="cursor-blink"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontFamily: "inherit",
                  }}
                >
                  python main.py
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Single output line ──────────────────────────────────────────── */
function OutputRow({ line }: { line: OutputLine }) {
  const styles = getLineStyle(line.type);

  return (
    <div
      className="flex items-start gap-2 px-1 animate-fade-in"
      style={{
        padding: "2px 4px",
        borderRadius: "3px",
        backgroundColor: styles.rowBg,
      }}
    >
      {/* Prefix glyph */}
      <span
        style={{
          fontSize: "12px",
          color: styles.prefix,
          flexShrink: 0,
          lineHeight: "20px",
          userSelect: "none",
          minWidth: "14px",
        }}
      >
        {styles.glyph}
      </span>

      {/* Content */}
      <pre
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: styles.text,
          fontFamily: "inherit",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          margin: 0,
          flex: 1,
        }}
      >
        {line.content}
      </pre>

      {/* Timestamp */}
      <span
        style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          flexShrink: 0,
          lineHeight: "20px",
          paddingLeft: "8px",
          userSelect: "none",
        }}
      >
        {line.timestamp}
      </span>
    </div>
  );
}

/* ── Style map per output type ───────────────────────────────────── */
function getLineStyle(type: OutputLine["type"]) {
  switch (type) {
    case "stdout":
      return {
        glyph: "›",
        prefix: "var(--text-muted)",
        text: "var(--terminal-stdout)",
        rowBg: "transparent",
      };
    case "stderr":
      return {
        glyph: "✕",
        prefix: "var(--terminal-stderr)",
        text: "var(--terminal-stderr)",
        rowBg: "rgba(248, 81, 73, 0.06)",
      };
    case "error":
      return {
        glyph: "●",
        prefix: "#f85149",
        text: "#f85149",
        rowBg: "rgba(248, 81, 73, 0.08)",
      };
    case "success":
      return {
        glyph: "✓",
        prefix: "var(--text-success)",
        text: "var(--text-success)",
        rowBg: "rgba(63, 185, 80, 0.06)",
      };
    case "info":
    default:
      return {
        glyph: "·",
        prefix: "var(--text-accent)",
        text: "var(--text-secondary)",
        rowBg: "transparent",
      };
  }
}

/* ── Empty state (no output yet) ─────────────────────────────────── */
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3"
      style={{ minHeight: "80px", opacity: 0.5 }}
    >
      <div
        style={{
          fontSize: "28px",
          lineHeight: 1,
          filter: "grayscale(0.3)",
        }}
      >
        🐍
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
        }}
      >
        Run your code to see output here
        <br />
        <span style={{ fontSize: "11px" }}>
          Press <kbd
            style={{
              padding: "1px 5px",
              borderRadius: "3px",
              backgroundColor: "var(--bg-panel)",
              border: "1px solid var(--border-primary)",
              fontSize: "10px",
            }}
          >
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd
            style={{
              padding: "1px 5px",
              borderRadius: "3px",
              backgroundColor: "var(--bg-panel)",
              border: "1px solid var(--border-primary)",
              fontSize: "10px",
            }}
          >
            Enter
          </kbd>{" "}
          to run
        </span>
      </div>
    </div>
  );
}

/* ── Terminal icon ───────────────────────────────────────────────── */
function TerminalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-muted)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

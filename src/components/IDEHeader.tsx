"use client";

interface IDEHeaderProps {
  isRunning: boolean;
  onRun: () => void;
  onClear: () => void;
}

export default function IDEHeader({ isRunning, onRun, onClear }: IDEHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 select-none"
      style={{
        height: "52px",
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border-primary)",
        flexShrink: 0,
      }}
    >
      {/* ── Left: Logo ── */}
      <div className="flex items-center gap-3">
        {/* Decorative circles like macOS traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
        </div>

        <div
          className="w-px"
          style={{ height: "20px", backgroundColor: "var(--border-primary)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <PythonLogo />
          <span
            className="font-semibold tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: "var(--text-primary)",
            }}
          >
            Py
            <span style={{ color: "var(--text-accent)" }}>Compile</span>
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-xs font-medium"
            style={{
              backgroundColor: "rgba(31, 111, 235, 0.15)",
              color: "var(--text-accent)",
              border: "1px solid rgba(31, 111, 235, 0.3)",
              fontSize: "10px",
            }}
          >
            v0.1
          </span>
        </div>
      </div>

      {/* ── Center: File tab ── */}
      <div className="hidden sm:flex items-center gap-1">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded"
          style={{
            backgroundColor: "var(--bg-panel-secondary)",
            border: "1px solid var(--border-primary)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span style={{ color: "#e5c07b" }}>🐍</span>
          <span>main.py</span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--text-accent)" }}
            title="Unsaved changes"
          />
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">
        {/* Clear button */}
        <button
          id="btn-clear-output"
          onClick={onClear}
          title="Clear terminal output"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-primary)",
            fontSize: "13px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--bg-panel-secondary)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
        >
          <TrashIcon />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Run button */}
        <button
          id="btn-run-code"
          onClick={onRun}
          disabled={isRunning}
          title={isRunning ? "Running…" : "Run Python code (Ctrl+Enter)"}
          className="flex items-center gap-2 px-4 py-1.5 rounded font-semibold transition-all duration-150"
          style={{
            backgroundColor: isRunning
              ? "rgba(35, 134, 54, 0.4)"
              : "var(--bg-button)",
            color: "#ffffff",
            border: isRunning
              ? "1px solid var(--border-success)"
              : "1px solid transparent",
            fontSize: "13px",
            cursor: isRunning ? "not-allowed" : "pointer",
            boxShadow: isRunning ? "none" : "var(--glow-green)",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--bg-button-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--bg-button)";
            }
          }}
        >
          {isRunning ? (
            <>
              <SpinnerIcon />
              <span>Running…</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

/* ── Inline SVG Icons ─────────────────────────────────────────────── */

function PythonLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.9 2C8.1 2 8.4 3.6 8.4 3.6V5.3H12V5.8H6.2S4 5.5 4 9.4c0 3.8 2.1 3.7 2.1 3.7H7.4v-1.8s-.1-2.1 2.1-2.1h3.6s2 0 2-1.9V4.1c0 0 .3-2.1-3.2-2.1zm-1.8 1.2c.4 0 .6.3.6.6 0 .4-.2.6-.6.6-.3 0-.6-.2-.6-.6 0-.3.3-.6.6-.6z"
        fill="#3776ab"
      />
      <path
        d="M12.1 22c3.8 0 3.5-1.6 3.5-1.6v-1.7H12v-.5h5.8s2.2.3 2.2-3.6c0-3.8-2.1-3.7-2.1-3.7H16.6v1.8s.1 2.1-2.1 2.1h-3.6s-2 0-2 1.9v3.2s-.3 2.1 3.2 2.1zm1.8-1.2c-.4 0-.6-.3-.6-.6 0-.4.2-.6.6-.6.3 0 .6.2.6.6 0 .3-.3.6-.6.6z"
        fill="#ffd343"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin-slow 0.8s linear infinite" }}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

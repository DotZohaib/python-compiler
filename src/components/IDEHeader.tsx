"use client";

interface IDEHeaderProps {
  isRunning: boolean;
  onRun: () => void;
}

export default function IDEHeader({ isRunning, onRun }: IDEHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-[#0A0A0A] border-b border-white/[0.08] z-10 select-none sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <PythonLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-[#EDEDED] leading-tight">PyCompile</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center left-20px gap-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 active:scale-[0.98] ${
            isRunning
              ? "bg-[#1A1A1A] text-[#71717A] cursor-not-allowed border border-white/[0.08]"
              : "bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm"
          }`}
        >
          {isRunning ? (
            <>
              <SpinnerIcon />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function PythonLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11.9 2C8.1 2 8.4 3.6 8.4 3.6V5.3H12V5.8H6.2S4 5.5 4 9.4c0 3.8 2.1 3.7 2.1 3.7H7.4v-1.8s-.1-2.1 2.1-2.1h3.6s2 0 2-1.9V4.1c0 0 .3-2.1-3.2-2.1zm-1.8 1.2c.4 0 .6.3.6.6 0 .4-.2.6-.6.6-.3 0-.6-.2-.6-.6 0-.3.3-.6.6-.6z" fill="#000000" />
      <path d="M12.1 22c3.8 0 3.5-1.6 3.5-1.6v-1.7H12v-.5h5.8s2.2.3 2.2-3.6c0-3.8-2.1-3.7-2.1-3.7H16.6v1.8s.1 2.1-2.1 2.1h-3.6s-2 0-2 1.9v3.2s-.3 2.1 3.2 2.1zm1.8-1.2c-.4 0-.6-.3-.6-.6 0-.4.2-.6.6-.6.3 0 .6.2.6.6 0 .3-.3.6-.6.6z" fill="#000000" opacity="0.8" />
    </svg>
  );
}

function PlayIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>;
}

function SpinnerIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
}

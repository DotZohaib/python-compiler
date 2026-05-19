"use client";

interface IDEHeaderProps {
  isRunning: boolean;
  onRun: () => void;
}

export default function IDEHeader({ isRunning, onRun }: IDEHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 h-[60px] bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.04] z-10 select-none sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.25)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all duration-300">
            <PythonLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] tracking-tight text-white/95 leading-tight">PyCompile</span>
            <span className="text-[11.5px] text-white/40 font-medium leading-tight">World-Class Environment</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Share
        </button>
        
        <div className="h-4 w-px bg-white/[0.08]" />
        
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2.5 px-6 py-2 rounded-xl font-semibold text-[13px] transition-all duration-300 active:scale-[0.97] ${
            isRunning
              ? "bg-white/[0.03] text-white/40 cursor-not-allowed border border-white/[0.05]"
              : "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] border border-white/20"
          }`}
        >
          {isRunning ? (
            <>
              <SpinnerIcon />
              <span className="tracking-wide">Executing...</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span className="tracking-wide">Run Code</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function PythonLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M11.9 2C8.1 2 8.4 3.6 8.4 3.6V5.3H12V5.8H6.2S4 5.5 4 9.4c0 3.8 2.1 3.7 2.1 3.7H7.4v-1.8s-.1-2.1 2.1-2.1h3.6s2 0 2-1.9V4.1c0 0 .3-2.1-3.2-2.1zm-1.8 1.2c.4 0 .6.3.6.6 0 .4-.2.6-.6.6-.3 0-.6-.2-.6-.6 0-.3.3-.6.6-.6z" fill="#ffffff" />
      <path d="M12.1 22c3.8 0 3.5-1.6 3.5-1.6v-1.7H12v-.5h5.8s2.2.3 2.2-3.6c0-3.8-2.1-3.7-2.1-3.7H16.6v1.8s.1 2.1-2.1 2.1h-3.6s-2 0-2 1.9v3.2s-.3 2.1 3.2 2.1zm1.8-1.2c-.4 0-.6-.3-.6-.6 0-.4.2-.6.6-.6.3 0 .6.2.6.6 0 .3-.3.6-.6.6z" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

function PlayIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>;
}

function SpinnerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
}

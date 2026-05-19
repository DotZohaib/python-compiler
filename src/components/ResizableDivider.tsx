"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableDividerProps {
  terminalHeight: number;
  onResize: (height: number) => void;
}

export default function ResizableDivider({
  terminalHeight,
  onResize,
}: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      startY.current = e.clientY;
      startHeight.current = terminalHeight;
    },
    [terminalHeight]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (ev: MouseEvent) => {
      const delta = startY.current - ev.clientY;
      const newHeight = Math.min(
        Math.max(startHeight.current + delta, 120),
        window.innerHeight * 0.7
      );
      onResize(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <div
      role="separator"
      aria-label="Drag to resize terminal panel"
      onMouseDown={handleMouseDown}
      className={`group flex items-center justify-center cursor-row-resize select-none h-1.5 transition-all duration-300 flex-shrink-0 z-30 relative ${
        isDragging ? "bg-blue-500/20" : "bg-[#09090b] hover:bg-white/[0.04]"
      }`}
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.01)",
      }}
    >
      {/* Glow line when dragging */}
      <div className={`absolute inset-0 bg-blue-500/10 blur-[4px] transition-opacity duration-300 ${isDragging ? "opacity-100" : "opacity-0"}`} />

      <div
        className={`flex gap-[3px] transition-all duration-300 relative z-10 ${
          isDragging ? "opacity-100 scale-y-125" : "opacity-20 group-hover:opacity-80"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-6 h-[2px] rounded-full transition-colors duration-300 ${
              isDragging ? "bg-blue-400" : "bg-zinc-400 group-hover:bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

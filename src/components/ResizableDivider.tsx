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
      className={`group flex items-center justify-center cursor-row-resize select-none h-1.5 transition-colors duration-200 flex-shrink-0 z-30 relative ${
        isDragging ? "bg-white/[0.05]" : "bg-transparent hover:bg-white/[0.02]"
      }`}
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className={`w-8 h-1 rounded-full transition-colors duration-200 ${
          isDragging ? "bg-white/[0.3]" : "bg-white/[0.1] group-hover:bg-white/[0.2]"
        }`}
      />
    </div>
  );
}

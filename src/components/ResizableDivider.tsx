"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableDividerProps {
  terminalWidth: number;
  onResize: (width: number) => void;
}

export default function ResizableDivider({
  terminalWidth,
  onResize,
}: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      startX.current = e.clientX;
      startWidth.current = terminalWidth;
    },
    [terminalWidth]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (ev: MouseEvent) => {
      const delta = startX.current - ev.clientX;
      const newWidth = Math.min(
        Math.max(startWidth.current + delta, 200),
        window.innerWidth * 0.7
      );
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.body.style.cursor = "col-resize";
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
      className={`group flex items-center justify-center cursor-col-resize select-none w-1.5 transition-colors duration-200 flex-shrink-0 z-30 relative ${
        isDragging ? "bg-white/[0.05]" : "bg-transparent hover:bg-white/[0.02]"
      }`}
      style={{
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className={`h-8 w-1 rounded-full transition-colors duration-200 ${
          isDragging ? "bg-white/[0.3]" : "bg-white/[0.1] group-hover:bg-white/[0.2]"
        }`}
      />
    </div>
  );
}

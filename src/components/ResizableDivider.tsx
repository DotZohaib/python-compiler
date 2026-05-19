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
      className="group flex items-center justify-center cursor-row-resize select-none"
      style={{
        height: "8px",
        backgroundColor: "var(--bg-panel)",
        borderTop: "1px solid var(--border-primary)",
        borderBottom: "1px solid var(--border-primary)",
        transition: "background-color 0.15s ease",
        flexShrink: 0,
      }}
    >
      {/* Drag handle visual */}
      <div
        className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-150"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "32px",
              height: "2px",
              borderRadius: "2px",
              backgroundColor: "var(--text-muted)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

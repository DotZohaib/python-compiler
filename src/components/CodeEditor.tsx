"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun?: () => void;
}

export default function CodeEditor({ code, onChange, onRun }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monacoInstance: typeof import("monaco-editor")
  ) => {
    editorRef.current = editorInstance;

    // ── Custom PyCompile dark theme ──────────────────────────────────
    monacoInstance.editor.defineTheme("pycompile-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        // Keywords
        { token: "keyword",              foreground: "ff79c6", fontStyle: "bold" },
        { token: "keyword.control",      foreground: "ff79c6", fontStyle: "bold" },
        // Strings
        { token: "string",               foreground: "f1fa8c" },
        { token: "string.escape",        foreground: "ffb86c" },
        // Numbers
        { token: "number",               foreground: "bd93f9" },
        { token: "number.float",         foreground: "bd93f9" },
        // Comments
        { token: "comment",              foreground: "6272a4", fontStyle: "italic" },
        // Built-ins & identifiers
        { token: "identifier",           foreground: "f8f8f2" },
        { token: "type.identifier",      foreground: "8be9fd" },
        // Decorators
        { token: "tag",                  foreground: "50fa7b" },
        // Operators
        { token: "operator",             foreground: "ff79c6" },
        // Functions / methods
        { token: "function",             foreground: "50fa7b" },
        // Class names
        { token: "class-name",           foreground: "8be9fd", fontStyle: "bold" },
        // Constants (True, False, None)
        { token: "constant.language",    foreground: "bd93f9" },
      ],
      colors: {
        // Editor background
        "editor.background":             "#0d1117",
        "editor.foreground":             "#f8f8f2",
        // Line numbers
        "editorLineNumber.foreground":   "#484f58",
        "editorLineNumber.activeForeground": "#8b949e",
        // Cursor
        "editorCursor.foreground":       "#f8f8f2",
        // Selection
        "editor.selectionBackground":    "#264f78",
        "editor.inactiveSelectionBackground": "#1e3a5f",
        // Current line
        "editor.lineHighlightBackground": "#161b22",
        "editor.lineHighlightBorderColor": "#30363d",
        // Gutter
        "editorGutter.background":       "#0d1117",
        // Scrollbar
        "scrollbar.shadow":              "#00000080",
        "scrollbarSlider.background":    "#30363d80",
        "scrollbarSlider.hoverBackground": "#484f5880",
        "scrollbarSlider.activeBackground": "#6e768180",
        // Minimap
        "minimap.background":            "#0d1117",
        "minimapSlider.background":      "#30363d60",
        // Indent guides
        "editorIndentGuide.background1": "#21262d",
        "editorIndentGuide.activeBackground1": "#30363d",
        // Match brackets
        "editorBracketMatch.background": "#264f7840",
        "editorBracketMatch.border":     "#1f6feb",
        // Widget (autocomplete)
        "editorWidget.background":       "#161b22",
        "editorWidget.border":           "#30363d",
        "editorSuggestWidget.background": "#161b22",
        "editorSuggestWidget.border":    "#30363d",
        "editorSuggestWidget.selectedBackground": "#1f6feb40",
        // Error / warning squiggles
        "editorError.foreground":        "#f85149",
        "editorWarning.foreground":      "#d29922",
        // Ruler
        "editorRuler.foreground":        "#21262d",
      },
    });

    monacoInstance.editor.setTheme("pycompile-dark");

    // ── Keyboard shortcut: Ctrl+Enter = Run ─────────────────────────
    editorInstance.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        if (onRun) onRun();
      }
    );

    // Focus the editor on mount
    editorInstance.focus();
  };

  return (
    <div className="w-full h-full overflow-hidden" style={{ backgroundColor: "#0d1117" }}>
      <MonacoEditor
        height="100%"
        defaultLanguage="python"
        language="python"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          // Font
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontSize: 14,
          fontLigatures: true,
          lineHeight: 22,
          letterSpacing: 0.3,

          // Behaviour
          wordWrap: "on",
          tabSize: 4,
          insertSpaces: true,
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,

          // UI
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "mouseover",
          rulers: [80],
          renderLineHighlight: "all",
          cursorStyle: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          mouseWheelZoom: true,

          // Minimap
          minimap: {
            enabled: true,
            maxColumn: 60,
            renderCharacters: false,
            scale: 1,
          },

          // Scrollbar
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
            useShadows: true,
          },

          // IntelliSense / suggestions
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          parameterHints: { enabled: true },

          // Misc
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
          accessibilitySupport: "auto",
        }}
      />
    </div>
  );
}

/* ── Loading skeleton shown while Monaco JS bundle loads ── */
function EditorSkeleton() {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: "#0d1117", padding: "16px 0" }}
    >
      {/* Line number + code skeleton rows */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4"
          style={{ height: "22px", marginBottom: "0px" }}
        >
          {/* Line number */}
          <div
            style={{
              width: "28px",
              height: "12px",
              borderRadius: "2px",
              backgroundColor: "#21262d",
              flexShrink: 0,
              opacity: 0.6,
            }}
          />
          {/* Code line */}
          <div
            style={{
              height: "12px",
              borderRadius: "2px",
              backgroundColor: "#21262d",
              width: `${Math.random() * 40 + 20}%`,
              opacity: 0.4,
              backgroundImage:
                "linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}

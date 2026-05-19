"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";

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

    monacoInstance.editor.defineTheme("modern-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "c678dd", fontStyle: "bold" },
        { token: "string", foreground: "a5d6ff" }, /* softer blue for strings */
        { token: "number", foreground: "d19a66" },
        { token: "comment", foreground: "71717a", fontStyle: "italic" }, /* zinc-500 */
        { token: "identifier", foreground: "e06c75" },
        { token: "type.identifier", foreground: "e5c07b" },
        { token: "operator", foreground: "56b6c2" },
        { token: "function", foreground: "61afef" },
        { token: "class-name", foreground: "e5c07b", fontStyle: "bold" },
        { token: "constant.language", foreground: "d19a66" },
      ],
      colors: {
        "editor.background": "#0A0A0A", /* Matches the page.tsx workspace container exactly */
        "editor.foreground": "#EDEDED",
        "editorLineNumber.foreground": "#3F3F46", /* zinc-700 */
        "editorLineNumber.activeForeground": "#A1A1AA", /* zinc-400 */
        "editorCursor.foreground": "#EDEDED", /* White cursor */
        "editor.selectionBackground": "#FFFFFF1A", /* 10% white */
        "editor.inactiveSelectionBackground": "#FFFFFF0D", /* 5% white */
        "editor.lineHighlightBackground": "#FFFFFF05", /* extremely subtle highlight */
        "editorGutter.background": "#0A0A0A",
        "scrollbarSlider.background": "#FFFFFF10",
        "scrollbarSlider.hoverBackground": "#FFFFFF20",
        "scrollbarSlider.activeBackground": "#FFFFFF30",
        "editorWidget.background": "#121212", /* surface level 1 */
        "editorWidget.border": "#FFFFFF14", /* 8% white */
        "editorSuggestWidget.background": "#121212",
        "editorSuggestWidget.border": "#FFFFFF14",
        "editorSuggestWidget.selectedBackground": "#FFFFFF0D",
        "editorError.foreground": "#EF4444",
        "editorWarning.foreground": "#F59E0B",
      },
    });

    monacoInstance.editor.setTheme("modern-dark");

    monacoInstance.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: "print",
            kind: monacoInstance.languages.CompletionItemKind.Function,
            insertText: "print(${1:value})",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Prints the values to a stream, or to sys.stdout by default.",
            range,
          },
          {
            label: "def",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "def ${1:function_name}(${2:args}):\n\t${3:pass}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Function definition snippet",
            range,
          },
          {
            label: "class",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${2:pass}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Class definition snippet",
            range,
          },
          {
            label: "if",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "if ${1:condition}:\n\t${2:pass}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "for",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "for ${1:item} in ${2:iterable}:\n\t${3:pass}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "while",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "while ${1:condition}:\n\t${2:pass}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "try",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:raise}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "import",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "import ${1:module}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "from",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "from ${1:module} import ${2:name}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "main",
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: "if __name__ == '__main__':\n\t${1:main()}",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "if __name__ == '__main__':",
            range,
          },
          {
            label: "len",
            kind: monacoInstance.languages.CompletionItemKind.Function,
            insertText: "len(${1:obj})",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Return the number of items in a container.",
            range,
          },
          {
            label: "range",
            kind: monacoInstance.languages.CompletionItemKind.Function,
            insertText: "range(${1:stop})",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "enumerate",
            kind: monacoInstance.languages.CompletionItemKind.Function,
            insertText: "enumerate(${1:iterable})",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "zip",
            kind: monacoInstance.languages.CompletionItemKind.Function,
            insertText: "zip(${1:iter1}, ${2:iter2})",
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
        ];
        return { suggestions };
      },
    });

    editorInstance.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        if (onRun) onRun();
      }
    );

    editorInstance.focus();
  };

  return (
    <div className="w-full h-full relative group bg-transparent">
      <MonacoEditor
        height="100%"
        language="python"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontSize: 14,
          fontLigatures: true,
          lineHeight: 24,
          letterSpacing: 0.5,
          wordWrap: "on",
          tabSize: 4,
          insertSpaces: true,
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          lineNumbers: "on",
          lineNumbersMinChars: 4,
          glyphMargin: false,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "mouseover",
          renderLineHighlight: "all",
          cursorStyle: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          mouseWheelZoom: true,
          minimap: { enabled: false },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          quickSuggestions: { other: true, comments: true, strings: true },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: "currentDocument",
          parameterHints: { enabled: true },
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          padding: { top: 24, bottom: 24 },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="w-full h-full flex flex-col p-6 space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-6 h-4 bg-white/[0.03] rounded" />
          <div 
            className="h-4 bg-white/[0.03] rounded animate-pulse" 
            style={{ width: `${Math.max(20, Math.random() * 80)}%`, animationDelay: `${i * 100}ms` }} 
          />
        </div>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PyCompile — Python Online IDE",
  description:
    "A blazing-fast, browser-based Python IDE. Write, run, and debug Python code instantly — no setup required.",
  keywords: ["python", "online compiler", "python ide", "code editor", "online python"],
  authors: [{ name: "PyCompile" }],
  openGraph: {
    title: "PyCompile — Python Online IDE",
    description: "Write and run Python code instantly in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google Fonts — Inter (UI) + JetBrains Mono (code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}

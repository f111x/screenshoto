import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Screensho.to | 截图即代码 — AI 截图转前端代码",
  description:
    "截图任意 UI，AI 秒生成 HTML / Tailwind / React / Vue 代码。免费在线工具，拖拽即用。",
  keywords: [
    "screenshot to code",
    "截图转代码",
    "AI code generator",
    "screenshot to html",
    "screenshot to tailwind",
    "UI to code",
  ],
  openGraph: {
    title: "Screensho.to — 截图即代码",
    description: "截图任意 UI，AI 秒生成前端代码",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCP Korea - 모델 컨텍스트 프로토콜",
  description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
  keywords: ["Model Context Protocol", "MCP", "모델 컨텍스트 프로토콜", "AI", "LLM", "Claude", "Anthropic", "Cursor", "OpenAI", "GPT", "인공지능", "대규모 언어 모델", "한국 AI", "LLM 도구"],
  openGraph: {
    title: "MCP Korea - 모델 컨텍스트 프로토콜",
    description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
    url: "https://mcpkorea.com",
    siteName: "MCP Korea",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Korea - 모델 컨텍스트 프로토콜",
    description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
  },
  alternates: {
    canonical: "https://mcpkorea.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: '구글_인증_코드를_여기에_입력하세요',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      'naver-site-verification': '네이버_인증_코드를_여기에_입력하세요',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}

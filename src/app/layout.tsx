import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCP Korea - 모델 컨텍스트 프로토콜",
  description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
  keywords: ["Model Context Protocol", "MCP", "mcp", "모델 컨텍스트 프로토콜", "AI", "LLM", "Claude", "Anthropic", "Cursor", "OpenAI", "GPT", "클로드", "Claude mcp", "클로드 mcp", "커서 mcp", "openai mcp", "오픈ai mcp", "인공지능", "대규모 언어 모델", "한국 AI", "LLM 도구", "AI 기술", "AI 프로토콜", "AI 개발", "인공지능 도구"],
  authors: [{ name: "MCP Korea Team" }],
  creator: "MCP Korea",
  publisher: "MCP Korea",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://mcpkorea.com"),
  openGraph: {
    title: "MCP Korea - 모델 컨텍스트 프로토콜",
    description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
    url: "https://mcpkorea.com",
    siteName: "MCP Korea",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "MCP Korea 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Korea - 모델 컨텍스트 프로토콜",
    description: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
    images: ["/android-chrome-512x512.png"],
    creator: "@mcpkorea",
    site: "@mcpkorea",
  },
  alternates: {
    canonical: "https://mcpkorea.com",
    languages: {
      "ko": "https://mcpkorea.com",
      "en": "https://mcpkorea.com/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: 'google59b2a0d6bfd03958',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      'naver-site-verification': '4ca1bbf7372952e751d827b2d22602a0654147b1',
    },
  },
  category: "Technology",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/android-chrome-192x192.png',
      },
    ],
  },
  applicationName: "MCP Korea",
  other: {
    'charset': 'utf-8',
    'msapplication-TileColor': '#0E0E0E',
    'theme-color': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-title': 'MCP Korea',
    'application-name': 'MCP Korea',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="charset" content="utf-8" />
        <meta property="og:article:author" content="MCP Korea Team" />
        <meta property="article:published_time" content={new Date().toISOString()} />
        <meta property="og:regDate" content={new Date().toISOString().split('T')[0].replace(/-/g, '')} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/manifest.json" />
        <script id="mode-toggle" dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.isDarkMode === 'true') {
                document.documentElement.classList.add('dark');
              } else if (localStorage.isDarkMode === 'false') {
                document.documentElement.classList.remove('dark');
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

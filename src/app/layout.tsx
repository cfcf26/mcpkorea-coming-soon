import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCPKorea - Coming Soon",
  description: "MCP의 대중화, 간단한 클릭으로 세팅하는 MCP를 만나보세요.",
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

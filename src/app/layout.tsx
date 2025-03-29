import type { Metadata } from "next";
import "../globals.css";
import { Header, Footer } from '../../components/layout';
import Providers from './providers';

export const metadata: Metadata = {
  title: "MCP Korea",
  description: "한국 개발자들을 위한 Model Context Protocol(MCP) 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-vscode-light-bg text-vscode-light-text dark:bg-vscode-bg dark:text-vscode-text min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 
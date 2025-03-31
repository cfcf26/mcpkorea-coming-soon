import ThemeToggle from "@/components/ThemeToggle";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-12 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            MCPKorea Coming Soon
          </h1>
          
          <h2 className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
            MCP의 대중화를 위한 첫걸음, 간단한 클릭으로 세팅하는 MCP를 곧 만나보실 수 있습니다.
          </h2>
        </div>
        
        <div className="w-full p-6 bg-foreground/5 rounded-xl border border-foreground/10">
          <h3 className="text-xl font-semibold mb-4">MCP 뉴스레터 구독하기</h3>
          <NewsletterForm />
        </div>
        
        <div className="mt-12 text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} MCPKorea. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}

import ThemeToggle from "@/components/ThemeToggle";
import NewsletterForm from "@/components/NewsletterForm";
import Script from "next/script";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MCP Korea",
    "url": "https://mcpkorea.com",
    "logo": "https://mcpkorea.com/android-chrome-512x512.png",
    "description": "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
    "sameAs": [
      "https://open.kakao.com/o/gpxy27nh"
    ],
    "keywords": [
      "Model Context Protocol", "MCP", "모델 컨텍스트 프로토콜", "AI", 
      "LLM", "Claude", "Anthropic", "Cursor", "OpenAI", "GPT"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Script
        id="schema-org-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ThemeToggle />
      
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-16 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            MCPKorea Coming Soon
          </h1>
          
          <h2 className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-medium">
            MCP의 대중화를 위한 첫걸음, 간단한 클릭으로 세팅하는 MCP를 곧 만나보실 수 있습니다.
          </h2>
        </div>
        
        <div className="w-full p-8 bg-foreground/5 rounded-xl border border-foreground/10 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">MCP 대기자 등록하고 뉴스레터 받아보기</h3>
          <NewsletterForm />
        </div>
        
        <div className="w-full p-8 bg-foreground/5 rounded-xl border border-foreground/10 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">MCP 오픈 카톡방 참여하기</h3>
          <p className="text-foreground/80 mb-6">
            MCP 관련 질문과 정보 공유를 위한 오픈 카톡방에 참여해보세요. 함께 배우고 성장하는 커뮤니티입니다.
          </p>
          <a 
            href="https://open.kakao.com/o/gpxy27nh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all hover:shadow-md"
          >
            카카오톡 오픈채팅방 참여하기
          </a>
        </div>
        
        <div className="mt-16 text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} MCPKorea. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}

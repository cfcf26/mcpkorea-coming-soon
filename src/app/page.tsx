import ThemeToggle from "@/components/ThemeToggle";
import NewsletterForm from "@/components/NewsletterForm";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Metadata } from 'next';

// 정적 메타데이터 설정
export const metadata: Metadata = {
  title: 'MCP Korea - 모델 컨텍스트 프로토콜',
  description: 'Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. MCP의 대중화를 위한 첫걸음.',
  keywords: 'MCP, Model Context Protocol, 모델 컨텍스트 프로토콜, AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT',
  openGraph: {
    title: 'MCP Korea - 모델 컨텍스트 프로토콜',
    description: 'Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다.',
    url: 'https://mcpkorea.com',
    siteName: 'MCP Korea',
    locale: 'ko_KR',
    type: 'website',
    images: [{
      url: 'https://mcpkorea.com/android-chrome-512x512.png',
      width: 512,
      height: 512,
      alt: 'MCP Korea 로고',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Korea - 모델 컨텍스트 프로토콜',
    description: 'Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다.',
    images: ['https://mcpkorea.com/android-chrome-512x512.png'],
  },
  verification: {
    google: 'ygeCUc8WZuix4vuDyGTZIvHFusAEOMZmVe__DmwiOhc', // 실제 Google 인증 코드
    other: {
      'naver-site-verification': '4ca1bbf7372952e751d827b2d22602a0654147b1', // 네이버 인증 코드
    },
  },
  alternates: {
    canonical: 'https://mcpkorea.com',
    languages: {
      'ko-KR': 'https://mcpkorea.com',
      'en-US': 'https://mcpkorea.com/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MCP Korea",
    "alternateName": "모델 컨텍스트 프로토콜 코리아",
    "url": "https://mcpkorea.com",
    "logo": "https://mcpkorea.com/android-chrome-512x512.png",
    "description": "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. AI, LLM, Claude, Anthropic, Cursor, OpenAI, GPT 등의 최신 기술을 활용한 솔루션을 제공합니다.",
    "sameAs": [
      "https://open.kakao.com/o/gpxy27nh"
    ],
    "keywords": [
      "Model Context Protocol", "MCP", "모델 컨텍스트 프로토콜", "AI", 
      "LLM", "Claude", "Anthropic", "Cursor", "OpenAI", "GPT"
    ],
    "foundingDate": "2024-03",
    "founder": {
      "@type": "Person",
      "name": "MCP Korea Team"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressLocality": "Seoul"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@mcpkorea.com"
    },
    "potentialAction": {
      "@type": "JoinAction",
      "name": "MCP 대기자 등록",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mcpkorea.com/#newsletter"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mcpkorea.com"
    }
  };

  // 웹사이트 정보 JSON-LD
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://mcpkorea.com",
    "name": "MCP Korea - 모델 컨텍스트 프로토콜",
    "description": "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mcpkorea.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mcpkorea.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "MCP",
        "item": "https://mcpkorea.com/mcp"
      }
    ]
  };

  // MCP 관련 주제 키워드 (Google 트렌드에서 가져올 수 있는 관련 주제를 정적으로 포함)
  const relatedTopicsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MCP 관련 주제",
    "description": "Model Context Protocol(MCP)과 관련된 인기 주제 및 키워드",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Anthropic",
        "url": "https://mcpkorea.com/topics/anthropic"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Large Language Model",
        "url": "https://mcpkorea.com/topics/llm"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Claude",
        "url": "https://mcpkorea.com/topics/claude"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "인공지능 도구",
        "url": "https://mcpkorea.com/topics/ai-tools"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "AI API",
        "url": "https://mcpkorea.com/topics/ai-api"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="schema-org-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id="schema-org-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="external-schema-link"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var link = document.createElement('link');
            link.rel = 'schema.org';
            link.href = '/mcp-schema.json';
            document.head.appendChild(link);
          `
        }}
      />
      
      {/* KaTeX 스타일 로드 */}
      <Script
        id="load-katex"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!document.querySelector('link[href*="katex"]')) {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css';
              link.integrity = 'sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC';
              link.crossOrigin = 'anonymous';
              document.head.appendChild(link);
            }
          `
        }}
      />
      
      {/* 새로운 관련 주제 JSON-LD 추가 */}
      <Script
        id="schema-org-related-topics"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedTopicsJsonLd) }}
      />
      
      {/* Google 트렌드 데이터를 메타태그로 변환하여 추가 */}
      <Script
        id="trend-meta-tags"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // 메타 태그로 트렌드 관련 키워드 추가
            const trendKeywords = [
              "MCP", "Model Context Protocol", "모델 컨텍스트 프로토콜", 
              "Anthropic", "Claude", "AI 도구", "AI Tools", "LLM", 
              "인공지능 API", "AI 개발", "대규모 언어 모델", "인공지능 상호작용"
            ];
            
            // 키워드 메타 태그 생성
            const metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            metaKeywords.content = trendKeywords.join(', ');
            document.head.appendChild(metaKeywords);
            
            // 추가 SEO 메타 태그
            const trendingTopics = [
              { name: "topic:name", content: "Model Context Protocol" },
              { name: "topic:related", content: "Anthropic" },
              { name: "topic:related", content: "Claude" },
              { name: "topic:related", content: "AI Tools" },
              { name: "topic:related", content: "Large Language Models" },
              { property: "article:tag", content: "MCP" },
              { property: "article:tag", content: "인공지능" },
              { property: "article:tag", content: "AI 개발" }
            ];
            
            // 메타 태그 추가
            trendingTopics.forEach(topic => {
              const meta = document.createElement('meta');
              if(topic.name) meta.name = topic.name;
              if(topic.property) meta.setAttribute('property', topic.property);
              meta.content = topic.content;
              document.head.appendChild(meta);
            });
          `
        }}
      />
      
      <ThemeToggle />
      
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-16 text-center p-4">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            MCP Korea Coming Soon
          </h1>
          
          <h2 className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-medium">
            MCP의 대중화를 위한 첫걸음, 클릭 한번으로 간단하게 세팅하는 MCP를 곧 만나보실 수 있습니다.
          </h2>
        </div>
        
        <div id="newsletter" className="w-full p-8 bg-foreground/5 rounded-xl border border-foreground/10 shadow-sm">
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
      </main>
      
      <Footer />
    </div>
  );
}

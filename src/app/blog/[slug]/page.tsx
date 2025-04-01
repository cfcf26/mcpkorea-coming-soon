import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { markdownToSafeHtml } from '@/utils/markdown';
import Script from 'next/script';

// 임시 블로그 포스트 데이터
// 나중에 Contentful이 설정되면 교체됩니다
const TEMP_BLOG_POSTS = [
  {
    id: "1",
    fields: {
      title: "MCP란 무엇인가? Model Context Protocol 소개",
      slug: "mcp-introduction",
      excerpt: "Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. 이 글에서는 MCP가 무엇인지, 어떻게 작동하는지 알아봅니다.",
      content: `
# MCP란 무엇인가? Model Context Protocol 소개

Model Context Protocol(MCP)은 인공지능과 도구 간의 상호작용을 위한 표준 프로토콜입니다. 대규모 언어 모델(LLM)이 다양한 도구와 상호작용할 수 있도록 하는 통일된 인터페이스를 제공합니다.

## MCP의 주요 특징

1. **표준화된 통신 방식**: MCP는 AI와 도구 간의 통신을 위한 표준화된 형식과 프로토콜을 제공합니다.
2. **확장성**: 다양한 AI 모델과 도구를 통합할 수 있도록 설계되었습니다.
3. **상호 운용성**: 서로 다른 시스템 간의 원활한 상호 작용을 가능하게 합니다.
4. **효율성**: 통일된 인터페이스를 통해 개발 및 구현 과정을 단순화합니다.

## MCP의 활용 분야

- **개발 자동화**: 코드 작성, 디버깅, 배포 과정 자동화
- **콘텐츠 생성**: 글쓰기, 이미지 생성, 동영상 편집 등
- **데이터 분석**: 데이터 쿼리, 시각화, 인사이트 도출
- **업무 자동화**: 일정 관리, 이메일 작성, 문서 요약 등

MCP Korea는 한국에서 MCP 기술의 보급과 활용을 위해 노력하고 있습니다. 더 많은 정보와 업데이트를 원하시면 계속해서 MCP Korea 블로그를 방문해 주세요.
      `,
      author: "MCP Korea Team",
      tags: ["MCP", "소개", "프로토콜"]
    },
    sys: {
      id: "1",
      createdAt: "2024-04-01T00:00:00Z",
      updatedAt: "2024-04-01T00:00:00Z"
    }
  }
];

// 임시 데이터에서 포스트 가져오기
async function getPostData(slug: string) {
  return TEMP_BLOG_POSTS.find(post => post.fields.slug === slug) || null;
}

// 모든 슬러그 가져오기
async function getAllSlugs() {
  return TEMP_BLOG_POSTS.map(post => ({
    slug: post.fields.slug
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostData(params.slug);
  
  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 - MCP Korea',
    };
  }
  
  const { fields } = post;
  
  return {
    title: `${fields.title} - MCP Korea 블로그`,
    description: fields.excerpt,
    keywords: [...fields.tags, 'MCP 블로그', 'AI 블로그', '모델 컨텍스트 프로토콜'],
    openGraph: {
      title: `${fields.title} - MCP Korea 블로그`,
      description: fields.excerpt,
      url: `https://mcpkorea.com/blog/${fields.slug}`,
      type: 'article',
      publishedTime: post.sys.createdAt,
      authors: [fields.author],
      tags: fields.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fields.title,
      description: fields.excerpt,
    },
  };
}

// 정적 경로 생성을 위한 함수
export async function generateStaticParams() {
  return await getAllSlugs();
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostData(params.slug);
  
  // 포스트가 없으면 404 페이지로 리디렉션
  if (!post) {
    notFound();
  }

  const { fields, sys } = post;
  const contentHtml = markdownToSafeHtml(fields.content);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      
      <article className="flex-1 w-full max-w-4xl mx-auto px-4 py-16">
        <div className="mb-6">
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            블로그 목록으로 돌아가기
          </Link>
        </div>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{fields.title}</h1>
          <div className="flex text-sm text-foreground/60 mb-4">
            <span>{fields.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={sys.createdAt}>{new Date(sys.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          {fields.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {fields.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="inline-block px-3 py-1 text-xs bg-foreground/10 rounded-full text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      
      {/* 구조화된 데이터 */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": fields.title,
            "description": fields.excerpt,
            "author": {
              "@type": "Person",
              "name": fields.author
            },
            "datePublished": sys.createdAt,
            "dateModified": sys.updatedAt,
            "publisher": {
              "@type": "Organization",
              "name": "MCP Korea",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mcpkorea.com/android-chrome-512x512.png"
              }
            },
            "keywords": fields.tags.join(", "),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://mcpkorea.com/blog/${fields.slug}`
            }
          })
        }}
      />
      
      <Footer />
    </div>
  );
} 
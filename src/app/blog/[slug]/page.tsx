import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/utils/contentful';
import { markdownToSafeHtml } from '@/utils/markdown';
import Script from 'next/script';

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
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
  const posts = await getAllBlogPosts();
  
  return posts.map((post) => ({
    slug: post.fields.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  
  // 포스트가 없으면 404 페이지로 리디렉션
  if (!post) {
    notFound();
  }

  const { fields, sys } = post;
  const contentHtml = markdownToSafeHtml(fields.content); // 마크다운을 HTML로 변환

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
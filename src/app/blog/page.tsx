import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllBlogPosts } from '@/utils/contentful';

export const metadata: Metadata = {
  title: "블로그 - MCP Korea",
  description: "MCP Korea 블로그에서 Model Context Protocol과 AI 관련 최신 정보를 확인하세요.",
  keywords: ["MCP 블로그", "AI 블로그", "모델 컨텍스트 프로토콜 블로그", "AI 소식", "AI 팁", "인공지능 블로그", "LLM 블로그"],
  openGraph: {
    title: "블로그 - MCP Korea",
    description: "MCP Korea 블로그에서 Model Context Protocol과 AI 관련 최신 정보를 확인하세요.",
    url: "https://mcpkorea.com/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  // Contentful에서 블로그 포스트 가져오기
  const posts = await getAllBlogPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">MCP Korea 블로그</h1>
          <p className="text-foreground/80 text-lg">
            Model Context Protocol과 AI 관련 최신 정보, 유용한 팁을 확인하세요.
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => {
              const { fields, sys } = post;
              return (
                <article 
                  key={sys.id} 
                  className="p-6 bg-foreground/5 rounded-xl border border-foreground/10 hover:border-foreground/20 transition-all"
                >
                  <Link href={`/blog/${fields.slug}`}>
                    <h2 className="text-2xl font-semibold mb-3 hover:text-blue-600 transition-colors">{fields.title}</h2>
                  </Link>
                  <div className="flex text-sm text-foreground/60 mb-4">
                    <span>{fields.author}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={sys.createdAt}>{new Date(sys.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  </div>
                  <p className="text-foreground/80 mb-4">{fields.excerpt}</p>
                  {fields.tags && (
                    <div className="flex flex-wrap gap-2">
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
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">아직 작성된 블로그 포스트가 없습니다.</p>
            <p className="text-foreground/50 mt-2">곧 새로운 콘텐츠가 추가될 예정입니다.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 
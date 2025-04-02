import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts, type BlogPost } from '@/utils/contentful';
import { formatDate, isRecentDate } from '@/utils/date';
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

// Contentful API 응답 항목 타입
interface ContentfulResponseItem {
  sys: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  fields: {
    title?: string;
    content?: unknown;
    summary?: string;
    author?: string;
    publishDate?: string;
    tags?: string[];
    seoTitle?: string;
    featured?: boolean;
    featuredImage?: {
      sys: { id: string };
    };
    [key: string]: unknown;
  };
}

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

// 명시적 캐싱 설정으로 블로그 포스트 데이터를 가져오는 함수
async function getPostsData(): Promise<BlogPost[]> {
  try {
    // Next.js 15에서는 명시적 캐싱 설정 필요
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=mcpKoreaBlogPost&order=-fields.publishDate,-sys.createdAt&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&include=2`,
      {
        // 5분간 캐시 유지 (300초)
        next: { revalidate: 300 }
      }
    );
    
    // 백업: fetch가 실패하면 SDK 사용
    if (!response.ok) {
      console.error('Contentful API 호출 실패:', response.status);
      const posts = await getAllBlogPosts();
      return posts.filter(post => post.fields && post.fields.title);
    }
    
    const data = await response.json();
    
    // 에셋 맵 생성
    const assets: Record<string, any> = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach((asset: any) => {
        let imageUrl = asset.fields.file?.url ? `https:${asset.fields.file.url}` : '';
        
        // 이미지 URL 최적화
        if (imageUrl && imageUrl.includes('ctfassets.net')) {
          imageUrl = optimizeContentfulImageUrl(imageUrl);
        }
        
        assets[asset.sys.id] = {
          url: imageUrl,
          title: asset.fields.title || '',
          description: asset.fields.description || '',
          width: asset.fields.file?.details?.image?.width || 800,
          height: asset.fields.file?.details?.image?.height || 450
        };
      });
    }
    
    // Contentful API 응답 데이터를 BlogPost 형식으로 변환
    return data.items
      .filter((item: { fields?: { title?: string } }) => item.fields && item.fields.title)
      .map((item: ContentfulResponseItem) => {
        // 게시물의 대표 이미지 정보 가져오기
        let featuredImageUrl = '';
        let featuredImageAlt = '';
        
        if (item.fields.featuredImage?.sys?.id) {
          const assetId = item.fields.featuredImage.sys.id;
          if (assets[assetId]) {
            featuredImageUrl = assets[assetId].url;
            featuredImageAlt = assets[assetId].title || assets[assetId].description || item.fields.title || '';
          }
        }
        
        return {
          fields: {
            title: item.fields.title || '',
            content: item.fields.content || '',
            summary: item.fields.summary || '',
            author: item.fields.author || '',
            publishDate: item.fields.publishDate || '',
            tags: item.fields.tags || [],
            seoTitle: item.fields.seoTitle || '',
            featured: item.fields.featured || false,
            featuredImage: featuredImageUrl ? {
              url: featuredImageUrl,
              alt: featuredImageAlt
            } : undefined
          },
          sys: {
            id: item.sys.id,
            createdAt: item.sys.createdAt || new Date().toISOString(),
            updatedAt: item.sys.updatedAt || new Date().toISOString()
          }
        };
      });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  // Contentful에서 블로그 포스트 가져오기
  const posts = await getPostsData();
  
  // 특별히 표시할 포스트와 일반 포스트로 분류
  const featuredPosts = posts.filter(post => post.fields.featured);
  const regularPosts = posts.filter(post => !post.fields.featured);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <ThemeToggle />
      
      <main className="flex-1">
        {/* 헤더 섹션 */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6">
              MCP Korea 블로그
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/90">
              Model Context Protocol과 AI 관련 최신 정보, 유용한 팁을 확인하세요.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link href="/" 
                className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50">
                홈으로 가기
              </Link>
              <a href="#posts" 
                className="inline-flex items-center rounded-md border border-white border-opacity-40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
                포스트 보기
              </a>
            </div>
          </div>
        </div>
        
        {/* 콘텐츠 컨테이너 */}
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* 인기 포스트 섹션 */}
          {featuredPosts.length > 0 && (
            <section id="featured" className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">인기 포스트</h2>
                <a href="#posts" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">모든 포스트 보기 →</a>
              </div>
              
              <div className="grid gap-8 lg:grid-cols-2">
                {featuredPosts.slice(0, 2).map((post) => (
                  <FeaturedPostCard key={post.sys.id} post={post} />
                ))}
              </div>
            </section>
          )}
          
          {/* 최신 포스트 섹션 */}
          <section id="posts">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">최신 포스트</h2>
              {posts.length > 9 && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">총 {posts.length}개의 포스트</span>
                </div>
              )}
            </div>
            
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-gray-500 dark:text-gray-400 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-medium mb-2">아직 포스트가 없습니다</h3>
                <p>곧 새로운 포스트가 업로드될 예정입니다. 잠시만 기다려주세요.</p>
              </div>
            ) : (
              <div className="grid gap-x-6 gap-y-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// 특별 포스트 카드 컴포넌트
function FeaturedPostCard({ post }: { post: BlogPost }) {
  const { fields, sys } = post;
  const dateStr = fields.publishDate || sys.createdAt;
  const formattedDate = formatDate(dateStr);
  const isRecent = isRecentDate(dateStr, 14); // 14일 이내 포스트
  
  return (
    <Link href={`/blog/${sys.id}`} className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      {/* 배경 이미지 (있는 경우) */}
      <div className="relative h-64 w-full bg-blue-100 dark:bg-gray-700 overflow-hidden">
        {fields.featuredImage && 'url' in fields.featuredImage ? (
          <div className="absolute inset-0">
            <img
              src={fields.featuredImage.url}
              alt={fields.featuredImage.alt || String(fields.title)}
              className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800"></div>
        )}
        
        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* 태그 */}
          {fields.tags && fields.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {fields.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {fields.tags.length > 2 && (
                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                  +{fields.tags.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* 제목 */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">
            {fields.title}
            {isRecent && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">NEW</span>
            )}
          </h3>
          
          {/* 요약 */}
          {fields.summary && (
            <p className="text-white/90 line-clamp-2 mb-3 text-sm">
              {String(fields.summary)}
            </p>
          )}
          
          {/* 작성자 및 날짜 */}
          <div className="flex items-center text-sm text-white/80">
            <span className="font-medium">{fields.author || 'MCP Korea Team'}</span>
            <span className="mx-2">•</span>
            <time dateTime={dateStr}>{formattedDate}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Contentful 이미지 URL 최적화 유틸리티 함수
function optimizeContentfulImageUrl(url: string): string {
  if (!url) return '';
  
  // URL이 Contentful CDN인지 확인
  if (url.includes('ctfassets.net')) {
    // HTTPS 프로토콜 추가
    let optimizedUrl = url.startsWith('//') ? `https:${url}` : url;
    
    // 웹 최적화 파라미터만 추가 (no-cookie 제거)
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}fm=webp&fit=fill&q=85`;
  }
  
  return url;
}

// 일반 블로그 포스트 카드 컴포넌트
function BlogPostCard({ post }: { post: BlogPost }) {
  const { fields, sys } = post;
  const dateStr = fields.publishDate || sys.createdAt;
  const formattedDate = formatDate(dateStr);
  const isRecent = isRecentDate(dateStr, 7); // 7일 이내 게시물
  
  return (
    <Link href={`/blog/${sys.id}`} className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      {/* 대표 이미지 (있는 경우) */}
      {fields.featuredImage && 'url' in fields.featuredImage && (
        <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={optimizeContentfulImageUrl(fields.featuredImage.url)}
            alt={fields.featuredImage.alt || String(fields.title)}
            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      
      {/* 콘텐츠 */}
      <div className="flex flex-col flex-grow p-5">
        {/* 태그 */}
        {fields.tags && fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {fields.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {fields.tags.length > 2 && (
              <span className="inline-block px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{fields.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {fields.title}
          {isRecent && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">New</span>
          )}
        </h3>
        
        {/* 요약 */}
        {fields.summary && (
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 text-sm flex-grow">
            {String(fields.summary)}
          </p>
        )}
        
        {/* 작성자 및 날짜 정보 */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="font-medium">{fields.author || 'MCP Korea Team'}</span>
          <span className="mx-2">•</span>
          <time dateTime={dateStr}>{formattedDate}</time>
        </div>
      </div>
    </Link>
  );
} 
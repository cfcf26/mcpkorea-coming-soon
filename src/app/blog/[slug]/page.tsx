import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, isRecentDate } from '@/utils/date';
import { getBlogPostById, getAllBlogPosts, type BlogPost } from '@/utils/contentful';
import Script from 'next/script';
import RichTextRenderer from '@/components/blog/RichTextRenderer';
import { Document } from '@contentful/rich-text-types';

// Contentful API 응답 타입
interface ContentfulEntry {
  sys: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  fields: Record<string, unknown>;
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

// 특정 ID의 블로그 포스트 데이터를 가져오는 함수 (명시적 캐싱 적용)
async function getPostData(id: string): Promise<BlogPost | null> {
  try {
    // 블로그 포스트 가져오기
    const entryResponse = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${id}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      {
        next: { revalidate: 300 }
      }
    );
    
    if (!entryResponse.ok) {
      console.error('블로그 포스트 가져오기 실패:', entryResponse.status);
      return await getBlogPostById(id);
    }
    
    const entryData = await entryResponse.json();
    
    // 임베디드 에셋 ID 추출
    const embeddedAssetIds: string[] = [];
    
    // 리치 텍스트 콘텐츠 분석
    if (entryData.fields?.content && typeof entryData.fields.content === 'object') {
      const findAssets = (nodes: any[]) => {
        if (!nodes || !Array.isArray(nodes)) return;
        
        nodes.forEach(node => {
          if (node.nodeType === 'embedded-asset-block' && node.data?.target?.sys?.id) {
            embeddedAssetIds.push(node.data.target.sys.id);
          }
          
          if (node.content && Array.isArray(node.content)) {
            findAssets(node.content);
          }
        });
      };
      
      if (entryData.fields.content.content) {
        findAssets(entryData.fields.content.content);
      }
    }
    
    console.log('추출된 에셋 ID들:', embeddedAssetIds);
    
    // 각 에셋을 개별적으로 가져오기
    const assets: Record<string, any> = {};
    
    // 추출된 에셋이 있는 경우에만 가져오기
    if (embeddedAssetIds.length > 0) {
      const assetPromises = embeddedAssetIds.map(async (assetId) => {
        try {
          const assetResponse = await fetch(
            `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/assets/${assetId}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
            {
              next: { revalidate: 300 }
            }
          );
          
          if (!assetResponse.ok) {
            console.error(`에셋 가져오기 실패: ${assetId}`, assetResponse.status);
            return null;
          }
          
          const assetData = await assetResponse.json();
          return assetData;
        } catch (assetError) {
          console.error(`에셋 가져오기 오류: ${assetId}`, assetError);
          return null;
        }
      });
      
      const assetResults = await Promise.all(assetPromises);
      
      // 유효한 에셋만 맵에 추가
      assetResults.forEach(asset => {
        if (asset && asset.sys && asset.sys.id) {
          // RichTextRenderer 컴포넌트에 맞는 형식으로 변환
          assets[asset.sys.id] = {
            sys: {
              id: asset.sys.id
            },
            fields: {
              title: asset.fields?.title || '',
              description: asset.fields?.description || '',
              file: {
                url: optimizeContentfulImageUrl(asset.fields?.file?.url || ''),
                details: {
                  size: asset.fields?.file?.details?.size || 0,
                  image: asset.fields?.file?.details?.image || {
                    width: 800,
                    height: 450
                  }
                },
                fileName: asset.fields?.file?.fileName || '',
                contentType: asset.fields?.file?.contentType || 'image/jpeg'
              }
            }
          };
        }
      });
    }
    
    console.log('가져온 에셋 키:', Object.keys(assets));
    
    // 포스트 데이터 반환
    return {
      fields: {
        title: entryData.fields?.title || '',
        content: entryData.fields?.content || '',
        summary: entryData.fields?.summary || '',
        author: entryData.fields?.author || '',
        publishDate: entryData.fields?.publishDate || '',
        tags: entryData.fields?.tags || [],
        seoTitle: entryData.fields?.seoTitle || '',
        featured: entryData.fields?.featured || false,
        assets: assets
      },
      sys: {
        id: entryData.sys?.id || id,
        createdAt: entryData.sys?.createdAt || new Date().toISOString(),
        updatedAt: entryData.sys?.updatedAt || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// 모든 블로그 포스트 ID를 가져오는 함수 (명시적 캐싱 적용)
async function getAllPostIds() {
  try {
    // Next.js 15에서는 명시적 캐싱 설정 필요
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=mcpKoreaBlogPost&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      { 
        // 1시간 캐시 유지 (3600초)
        next: { revalidate: 3600 } 
      }
    );
    
    // 백업: fetch가 실패하면 SDK 사용
    if (!response.ok) {
      const posts = await getAllBlogPosts();
      return posts
        .filter((post: any) => post.sys && post.sys.id)
        .map((post: any) => ({
          slug: post.sys.id,
        }));
    }
    
    const data = await response.json();
    
    // 유효한 ID가 있는 항목만 필터링
    return data.items
      .filter((item: ContentfulEntry) => item.sys && item.sys.id)
      .map((item: ContentfulEntry) => ({
        slug: item.sys.id,
      }));
  } catch (error) {
    console.error('Error fetching post IDs:', error);
    // 오류 발생 시 기본값 반환
    return [];
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Next.js 15에서는 params가 Promise일 수 있음
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  if (!slug) {
    return {
      title: '포스트를 찾을 수 없습니다 - MCP Korea',
    };
  }
  
  const post = await getPostData(slug);
  
  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 - MCP Korea',
    };
  }
  
  const { fields } = post;
  
  return {
    title: `${fields.seoTitle || fields.title} - MCP Korea 블로그`,
    description: fields.summary,
    keywords: [...(fields.tags || []), 'MCP 블로그', 'AI 블로그', '모델 컨텍스트 프로토콜'],
    openGraph: {
      title: `${fields.title} - MCP Korea 블로그`,
      description: fields.summary,
      url: `https://mcpkorea.com/blog/${slug}`,
      type: 'article',
      publishedTime: fields.publishDate || post.sys.createdAt,
      authors: [fields.author || 'MCP Korea Team'],
      tags: fields.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fields.title,
      description: fields.summary,
    },
  };
}

// 정적 경로 생성을 위한 함수
export async function generateStaticParams() {
  return await getAllPostIds();
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Next.js 15에서는 params가 Promise일 수 있음
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  if (!slug) {
    notFound();
  }
  
  const post = await getPostData(slug);
  
  // 포스트가 없으면 404 페이지로 리디렉션
  if (!post) {
    notFound();
  }

  const { fields, sys } = post;
  const dateStr = fields.publishDate || sys.createdAt;
  const formattedDate = formatDate(dateStr);
  const isRecent = isRecentDate(dateStr, 14); // 14일 이내면 최신 글

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      
      <article className="flex-1 w-full max-w-4xl mx-auto px-4 py-16">
        {/* 상단 네비게이션 */}
        <div className="mb-8">
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
        
        {/* 블로그 헤더 */}
        <header className="mb-12">
          {/* 태그 */}
          {fields.tags && fields.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
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
          
          {/* 제목 */}
          <h1 className="text-4xl font-bold mb-6">{fields.title}</h1>
          
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center text-sm text-foreground/60 mb-6">
            <span className="font-medium">{fields.author || 'MCP Korea Team'}</span>
            <span className="mx-2">•</span>
            <time dateTime={dateStr} className="flex items-center">
              {formattedDate}
              {isRecent && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">New</span>
              )}
            </time>
          </div>
          
          {/* 요약 */}
          {fields.summary && (
            <p className="text-lg text-foreground/80 mb-6 font-medium border-l-4 border-blue-500 pl-4 py-2">
              {fields.summary}
            </p>
          )}
        </header>
        
        {/* 본문 내용 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {typeof fields.content === 'object' ? (
            <RichTextRenderer content={fields.content as Document} assets={fields.assets} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: fields.content as string || '' }} />
          )}
        </div>
        
        {/* 작성자 정보 */}
        <div className="mt-16 pt-8 border-t border-foreground/10">
          <div className="flex items-center">
            <div>
              <h3 className="font-bold">작성자</h3>
              <p className="text-foreground/80">{fields.author || 'MCP Korea Team'}</p>
            </div>
          </div>
        </div>
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
            "description": fields.summary,
            "author": {
              "@type": "Person",
              "name": fields.author || 'MCP Korea Team'
            },
            "datePublished": fields.publishDate || sys.createdAt,
            "dateModified": sys.updatedAt,
            "publisher": {
              "@type": "Organization",
              "name": "MCP Korea",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mcpkorea.com/android-chrome-512x512.png"
              }
            },
            "keywords": (fields.tags || []).join(", "),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://mcpkorea.com/blog/${slug}`
            }
          })
        }}
      />
      
      <Footer />
    </div>
  );
} 
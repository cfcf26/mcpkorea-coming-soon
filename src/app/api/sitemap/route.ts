import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/utils/contentful';

// Next.js 15에서는 기본적으로 빌드 시 정적으로 생성됩니다.
export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 86400; // 하루에 한 번 재검증 (초 단위)

export async function GET() {
  const baseUrl = 'https://mcpkorea.com';
  
  // 정적 URL들 - 주요 페이지들
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    // MCP 관련 주제 페이지들
    {
      url: `${baseUrl}/topics/anthropic`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topics/llm`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topics/claude`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topics/ai-tools`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topics/ai-api`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    }
  ];

  // 블로그 게시물 URL들을 동적으로 가져오기
  let blogPostRoutes = [];
  try {
    const posts = await getAllBlogPosts();
    blogPostRoutes = posts
      .filter(post => post?.sys?.id)
      .map(post => ({
        url: `${baseUrl}/blog/${post.sys.id}`,
        lastModified: post.sys.updatedAt || post.sys.createdAt || new Date().toISOString(),
        priority: 0.6,
      }));
  } catch (error) {
    console.error('사이트맵 생성 중 블로그 포스트 가져오기 오류:', error);
    // 오류 발생 시 예시 블로그 포스트로 대체
    blogPostRoutes = [
      {
        url: `${baseUrl}/blog/mcp-introduction`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      },
      {
        url: `${baseUrl}/blog/ai-tools-with-mcp`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      }
    ];
  }

  // 모든 경로 합치기
  const allRoutes = [...staticRoutes, ...blogPostRoutes];
  
  // XML 형식으로 변환
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date(route.lastModified).toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.url === baseUrl ? 'daily' : 'weekly'}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;

  // XML 형식으로 응답
  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
} 
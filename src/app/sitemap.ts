import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/utils/contentful';

// 정적 내보내기에 필요한 동적 옵션 추가
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mcpkorea.com";
  
  // 정적 URL들 - 주요 페이지들
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    // MCP 관련 주제 페이지들 (JSON-LD에서 언급된 페이지들)
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
  return [...staticRoutes, ...blogPostRoutes];
} 
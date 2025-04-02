import { MetadataRoute } from 'next';

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
    {
      url: `${baseUrl}/mcp`,
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
    {
      url: `${baseUrl}/topics/ai-api`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    }
  ];

  // TODO: 블로그 게시물 URL들을 동적으로 가져올 수 있는 로직 추가
  // 이는 데이터베이스나 파일 시스템에서 블로그 게시물을 가져오는 로직이 필요합니다
  // 예시:
  /*
  const posts = await getBlogPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt,
    priority: 0.6,
  }));
  */
  
  // 현재는 예시 블로그 게시물로 대체
  const examplePostRoutes = [
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

  // 모든 경로 합치기
  return [...staticRoutes, ...examplePostRoutes];
} 
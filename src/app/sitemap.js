export default function sitemap() {
  const baseUrl = "https://mcpkorea.com";
  
  // 기본 URL
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    }
  ];

  // 추후 추가될 페이지들을 위한 동적 사이트맵 생성
  // 예: 블로그 게시물, 문서화, 튜토리얼 등

  return routes;
} 
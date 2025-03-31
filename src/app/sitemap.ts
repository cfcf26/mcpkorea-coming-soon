import { MetadataRoute } from 'next';

// 정적 내보내기에 필요한 동적 옵션 추가
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mcpkorea.com";
  
  // 기본 URL
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      priority: 1,
    }
  ];
} 
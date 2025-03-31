import { MetadataRoute } from 'next';

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
import { MetadataRoute } from 'next';

// 정적 내보내기에 필요한 동적 옵션 추가
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mcpkorea.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*.json$',
          '/private/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: '/admin/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 
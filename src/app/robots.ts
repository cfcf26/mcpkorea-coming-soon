import { MetadataRoute } from 'next';

// Next.js 15에서는 기본적으로 빌드 시 정적으로 생성됩니다.
// 명시적으로 설정하여 확실히 합니다.
export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 86400; // 하루에 한 번 재검증 (초 단위)

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
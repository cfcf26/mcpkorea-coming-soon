import { MetadataRoute } from 'next';

// 정적 내보내기에 필요한 동적 옵션 추가
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://mcpkorea.com/sitemap.xml',
  };
} 
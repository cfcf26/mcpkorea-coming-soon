import { NextResponse } from 'next/server';

// Next.js 15에서는 기본적으로 빌드 시 정적으로 생성됩니다.
export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 86400; // 하루에 한 번 재검증 (초 단위)

export async function GET() {
  const baseUrl = 'https://mcpkorea.com';

  // robots.txt 내용
  const robotsTxt = `# MCP Korea 웹사이트 robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /private/

User-agent: Googlebot
Allow: /
Disallow: /admin/

User-agent: Bingbot
Allow: /
Disallow: /admin/

# 사이트맵 위치 명시
Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}
`;

  // 텍스트 형식으로 응답
  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
} 
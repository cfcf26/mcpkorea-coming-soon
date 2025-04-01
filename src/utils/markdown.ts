import { marked } from 'marked';

// 마크다운을 HTML로 변환
export function markdownToHtml(markdown: string): string {
  return marked(markdown);
}

// HTML을 안전하게 변환 (XSS 방지 기능 추가)
export function sanitizeHtml(html: string): string {
  // 간단한 예시로, 실제 프로덕션에서는 DOMPurify 같은 라이브러리 사용 권장
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
}

// 마크다운에서 안전한 HTML로 변환
export function markdownToSafeHtml(markdown: string): string {
  const html = markdownToHtml(markdown);
  return sanitizeHtml(html);
} 
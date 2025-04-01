import { marked } from 'marked';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';

// 마크다운을 HTML로 변환
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return marked(markdown);
}

// Contentful RichText 문서를 HTML로 변환
export function richTextToHtml(document: Document): string {
  if (!document) return '';
  return documentToHtmlString(document);
}

// HTML을 안전하게 변환 (XSS 방지)
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // 간단한 예시로, 실제 프로덕션에서는 DOMPurify 같은 라이브러리 사용 권장
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
}

// 마크다운에서 안전한 HTML로 변환
export function markdownToSafeHtml(markdown: string | Document): string {
  if (!markdown) return '';
  
  // RichText 문서인 경우 (객체)
  if (typeof markdown === 'object') {
    const html = richTextToHtml(markdown as Document);
    return sanitizeHtml(html);
  }
  
  // 일반 마크다운 문자열인 경우
  const html = markdownToHtml(markdown as string);
  return sanitizeHtml(html);
} 
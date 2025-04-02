'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document, Node } from '@contentful/rich-text-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 이미지 컴포넌트는 자주 사용되므로 정적 임포트 유지
import Image from 'next/image';

// 타입 정의 개선
interface Asset {
  url: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  contentType?: string;
}

interface RichTextRendererProps {
  content: Document;
  assets?: Record<string, Asset>;
}

// 동적 임포트를 통한 컴포넌트 최적화 (상대 경로 사용)
const VideoComponent = dynamic(
  () => import('./media/VideoComponent'), 
  { ssr: false, loading: () => <div className="my-6 p-4 border border-gray-200 bg-gray-50 rounded-lg">비디오 로딩 중...</div> }
);

const FileComponent = dynamic(
  () => import('./media/FileComponent'), 
  { ssr: false, loading: () => <div className="my-6 p-4 border border-gray-200 bg-gray-50 rounded-lg">파일 정보 로딩 중...</div> }
);

// Contentful 이미지 URL 최적화 유틸리티 함수
function optimizeContentfulImageUrl(url: string): string {
  if (!url) return '';
  
  // URL이 Contentful CDN인지 확인
  if (url.includes('ctfassets.net')) {
    // HTTPS 프로토콜 추가 (//images.ctfassets.net → https://images.ctfassets.net)
    let optimizedUrl = url.startsWith('//') ? `https:${url}` : url;
    
    // 웹 최적화 파라미터만 추가 (no-cookie 제거)
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}fm=webp&fit=fill&q=85`;
  }
  
  return url;
}

// 메인 컴포넌트 
export default function RichTextRenderer({ content, assets = {} }: RichTextRendererProps) {
  // 리치 텍스트 렌더링 옵션 설정
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="px-1 py-0.5 rounded bg-gray-100 font-mono text-sm">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: Node, children: React.ReactNode) => (
        <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (_node: Node, children: React.ReactNode) => (
        <h1 className="mb-4 text-3xl font-bold">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node: Node, children: React.ReactNode) => (
        <h2 className="mb-3 text-2xl font-bold">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node: Node, children: React.ReactNode) => (
        <h3 className="mb-3 text-xl font-bold">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node: Node, children: React.ReactNode) => (
        <h4 className="mb-2 text-lg font-bold">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node: Node, children: React.ReactNode) => (
        <h5 className="mb-2 text-base font-bold">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node: Node, children: React.ReactNode) => (
        <h6 className="mb-2 text-sm font-bold">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (_node: Node, children: React.ReactNode) => (
        <ul className="mb-4 pl-6 list-disc space-y-1">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node: Node, children: React.ReactNode) => (
        <ol className="mb-4 pl-6 list-decimal space-y-1">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node: Node, children: React.ReactNode) => (
        <li className="leading-relaxed">{children}</li>
      ),
      [BLOCKS.QUOTE]: (_node: Node, children: React.ReactNode) => (
        <blockquote className="pl-4 border-l-4 border-gray-300 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-gray-200" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
        if (!assets) {
          return <div className="text-red-500">[에셋 정보 누락]</div>;
        }

        // 에셋 ID 추출 (타입 변환)
        const assetId = (node as any).data?.target?.sys?.id;
        if (!assetId || !assets[assetId]) {
          return <div className="text-red-500">[에셋 ID 불일치]</div>;
        }

        const asset = assets[assetId];
        const { url, title, description, width, height, contentType } = asset;

        if (!url) {
          return <div className="text-red-500">[에셋 URL 누락]</div>;
        }

        // 이미지 표시
        if (url.match(/\.(jpg|jpeg|png|webp|gif)$/i) || (contentType && contentType.startsWith('image/'))) {
          // Contentful 이미지 URL 처리
          let imageUrl = url;
          
          // Contentful CDN URL 감지 및 처리
          if (imageUrl.includes('ctfassets.net')) {
            // 이미지 URL 최적화 함수 사용
            imageUrl = optimizeContentfulImageUrl(imageUrl);
          }
          
          return (
            <div className="my-6">
              <Image
                src={imageUrl}
                alt={description || title || '블로그 이미지'}
                width={width || 800}
                height={height || 450}
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
                unoptimized={imageUrl.includes('ctfassets.net')} // Contentful 이미지는 이미 최적화되어 있음
              />
              {title && <p className="text-sm text-gray-500 mt-1">{title}</p>}
            </div>
          );
        }

        // 비디오 표시
        if (url.match(/\.(mp4|webm|ogg)$/i) || (contentType && contentType.startsWith('video/'))) {
          const fileType = url.split('.').pop() || '';
          return (
            <VideoComponent 
              url={url} 
              title={title}
              type={fileType}
            />
          );
        }

        // 기타 파일 표시
        const fileName = url.split('/').pop() || '첨부 파일';
        return (
          <FileComponent 
            url={url} 
            title={title || ''} 
            fileName={fileName} 
          />
        );
      },
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => {
        const uri = (node as any).data.uri;
        const isInternal = uri.startsWith('/');

        if (isInternal) {
          return (
            <Link href={uri} className="text-blue-600 hover:underline">
              {children}
            </Link>
          );
        }

        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        );
      },
      [INLINES.ENTRY_HYPERLINK]: (node: Node, children: React.ReactNode) => {
        // 내부 문서 링크 처리
        const target = (node as any).data.target;
        const contentType = target?.sys?.contentType?.sys?.id;
        const entryId = target?.sys?.id;

        if (contentType === 'mcpKoreaBlogPost' && entryId) {
          return (
            <Link href={`/blog/${entryId}`} className="text-blue-600 hover:underline">
              {children}
            </Link>
          );
        }

        return <span className="text-blue-600">{children}</span>;
      },
    },
  };

  // Document 타입인지 확인
  if (!content || typeof content !== 'object' || !('nodeType' in content)) {
    return <div className="prose text-red-500">유효하지 않은 컨텐츠 포맷입니다.</div>;
  }

  return (
    <div className="prose max-w-none">
      {documentToReactComponents(content, options)}
    </div>
  );
} 
import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

interface RichTextRendererProps {
  content: Document;
  assets?: Record<string, any>;
}

export default function RichTextRenderer({ content, assets }: RichTextRendererProps) {
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
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="mb-4 text-3xl font-bold">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="mb-3 text-2xl font-bold">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="mb-3 text-xl font-bold">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="mb-2 text-lg font-bold">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="mb-2 text-base font-bold">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="mb-2 text-sm font-bold">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="mb-4 pl-6 list-disc space-y-1">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="mb-4 pl-6 list-decimal space-y-1">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="leading-relaxed">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="pl-4 border-l-4 border-gray-300 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-gray-200" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        if (!assets) {
          return <div className="text-red-500">[에셋 정보 누락]</div>;
        }

        // 에셋 ID 추출
        const assetId = node.data?.target?.sys?.id;
        if (!assetId || !assets[assetId]) {
          return <div className="text-red-500">[에셋 ID 불일치]</div>;
        }

        const asset = assets[assetId];
        const { url, title, description, width, height } = asset;

        // 이미지 표시
        if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp') || url.endsWith('.gif'))) {
          return (
            <div className="my-6">
              <Image
                src={url}
                alt={description || title || '블로그 이미지'}
                width={width || 800}
                height={height || 450}
                className="rounded-lg max-w-full h-auto"
              />
              {title && <p className="text-sm text-gray-500 mt-1">{title}</p>}
            </div>
          );
        }

        // 비디오 표시
        if (url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'))) {
          return (
            <div className="my-6">
              <video
                controls
                className="rounded-lg max-w-full"
                style={{ maxHeight: "450px" }}
              >
                <source src={url} type={`video/${url.split('.').pop()}`} />
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
              {title && <p className="text-sm text-gray-500 mt-1">{title}</p>}
            </div>
          );
        }

        // 기타 파일 표시
        return (
          <div className="my-6">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>{title || url.split('/').pop() || '첨부 파일'}</span>
            </a>
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data;
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
      [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
        // 내부 문서 링크 처리
        const { target } = node.data;
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
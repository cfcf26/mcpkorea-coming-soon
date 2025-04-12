'use client';

import React, { useEffect } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 동일한 스타일 테마 사용

// 동적 임포트를 통한 무거운 컴포넌트 최적화
const VideoPlayer = dynamic(() => import('./media/VideoPlayer'), { ssr: false });
const AudioPlayer = dynamic(() => import('./media/AudioPlayer'), { ssr: false });
const FileDownloader = dynamic(() => import('./media/FileDownloader'), { ssr: false });

interface Asset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

interface RichTextRendererProps {
  content: Document;
  className?: string;
  assets?: {
    [key: string]: Asset;
  };
}

// Contentful 이미지 URL 최적화 유틸리티 함수
function optimizeContentfulImageUrl(url: string): string {
  if (!url) return '';
  
  // URL이 Contentful CDN인지 확인
  if (url.includes('ctfassets.net')) {
    // HTTPS 프로토콜 추가
    let optimizedUrl = url.startsWith('//') ? `https:${url}` : url;
    
    // 웹 최적화 파라미터만 추가 (no-cookie 제거)
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}fm=webp&fit=fill&q=85`;
  }
  
  return url;
}

// 마크다운 코드 블록 감지 함수
const isMarkdownCodeBlock = (text: string): boolean => {
  // 앞뒤 공백을 제거하고 처음과 끝이 ```로 감싸져 있는지 확인
  const trimmedText = text.trim();
  // 시작이 ```이고 끝도 ```인 경우만 코드 블록으로 처리
  return trimmedText.startsWith('```') && trimmedText.endsWith('```');
};

// 마크다운 코드 블록 처리 함수
const renderMarkdownCodeBlock = (text: string): React.ReactNode => {
  // 마크다운 형식에서 코드와 언어 추출
  const trimmedText = text.trim();
  const firstLineMatch = trimmedText.match(/^```(\w+)?/);
  const language = firstLineMatch?.[1] || '';
  
  // ```언어 부분과 끝의 ``` 제거
  let codeContent = trimmedText;
  codeContent = codeContent.replace(/^```(\w+)?/, ''); // 시작 부분 제거
  codeContent = codeContent.replace(/```$/, ''); // 끝 부분 제거
  codeContent = codeContent.trim(); // 앞뒤 공백 제거
  
  // 복사 상태 관리를 위한 커스텀 컴포넌트
  const CodeBlockWithCopy = () => {
    const [copied, setCopied] = React.useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      
      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };
    
    return (
      <div className="mb-6 relative group">
        {language && (
          <div className="absolute top-0 right-0 px-3 py-1 text-xs font-mono bg-foreground/10 text-foreground/80 rounded-bl">
            {language}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 p-2 text-sm text-foreground/60 hover:text-foreground/90 transition-colors rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="코드 복사"
          style={{ right: language ? '60px' : '0px' }}
        >
          {copied ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
          )}
        </button>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <pre className="p-0 bg-[#0d1117] rounded-lg overflow-hidden border border-foreground/10">
                  <code className={`${className || ''} p-4 pt-8 block overflow-x-auto text-sm font-mono`}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="px-1 py-0.5 bg-foreground/10 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };
  
  return <CodeBlockWithCopy />;
};

export default function RichTextRenderer({ content, className = '', assets = {} }: RichTextRendererProps) {
  if (!content) {
    return null;
  }

  // 구문 강조 초기화
  useEffect(() => {
    // highlight.js 초기화 및 직접 추가된 코드 블록에만 적용
    // (마크다운으로 처리되는 코드 블록은 rehype-highlight이 처리)
    hljs.configure({ languages: ['javascript', 'typescript', 'python', 'jsx', 'tsx', 'json', 'css', 'html', 'bash'] });
    
    // 마크다운 코드 블록이 아닌 일반 코드 블록에만 적용
    document.querySelectorAll('pre code:not(.language-*)').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  // 디버깅: 에셋 정보 로깅
  console.log('전달된 에셋 키:', Object.keys(assets));

  // 콘텐츠에서 임베디드 에셋을 찾아 테이블 생성
  let assetMap: Record<string, Asset> = {};
  
  // 전달받은 assets가 있으면 사용
  if (assets && Object.keys(assets).length > 0) {
    assetMap = assets;
  } 
  // Contentful의 응답을 직접 파싱해서 에셋 추출
  else if (
    content && 
    (content as any).links && 
    (content as any).links.assets && 
    (content as any).links.assets.block
  ) {
    const embeddedAssets = (content as any).links.assets.block;
    embeddedAssets.forEach((asset: Asset) => {
      assetMap[asset.sys.id] = asset;
    });
  }

  // 텍스트 렌더링 옵션
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <span className="underline">{text}</span>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="px-1 py-0.5 bg-foreground/10 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => {
        // 마크다운 코드 블록 처리
        const plainText = documentToPlainTextString(node);
        if (isMarkdownCodeBlock(plainText)) {
          return renderMarkdownCodeBlock(plainText);
        }
        return <p className="mb-6 text-foreground/90 leading-relaxed">{children}</p>;
      },
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="text-4xl font-bold mt-12 mb-6">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="text-3xl font-bold mt-10 mb-4">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="text-lg font-bold mt-6 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="text-base font-bold mt-6 mb-2">{children}</h6>
      ),
      [BLOCKS.CODE]: (node: any) => {
        // 코드 블록 렌더링
        const codeContent = node.content[0].value || '';
        const language = node.data?.language || '';
        const languageClass = language ? `language-${language}` : '';
        
        // 복사 상태 관리
        const [copied, setCopied] = React.useState(false);
        
        // 복사 함수
        const handleCopy = () => {
          navigator.clipboard.writeText(codeContent);
          setCopied(true);
          
          // 2초 후 복사 상태 초기화
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        };
        
        return (
          <div className="mb-6 relative group">
            {language && (
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-mono bg-foreground/10 text-foreground/80 rounded-bl">
                {language}
              </div>
            )}
            <button
              onClick={handleCopy}
              className="absolute top-0 right-0 p-2 text-sm text-foreground/60 hover:text-foreground/90 transition-colors rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="코드 복사"
              style={{ right: language ? '60px' : '0px' }}
            >
              {copied ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              )}
            </button>
            <pre className="p-0 bg-[#0d1117] rounded-lg overflow-hidden border border-foreground/10">
              <code className={`hljs ${languageClass} p-4 pt-8 block overflow-x-auto text-sm font-mono`}>
                {codeContent}
              </code>
            </pre>
          </div>
        );
      },
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="list-disc pl-10 mb-6 space-y-2">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-10 mb-6 space-y-2">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="text-foreground/90">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-6 italic text-foreground/80">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-10 border-foreground/10" />,
      [BLOCKS.TABLE]: (node: any, children: React.ReactNode) => (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-foreground/10 border border-foreground/10 rounded-lg">
            <tbody className="divide-y divide-foreground/10">{children}</tbody>
          </table>
        </div>
      ),
      [BLOCKS.TABLE_ROW]: (node: any, children: React.ReactNode) => <tr>{children}</tr>,
      [BLOCKS.TABLE_CELL]: (node: any, children: React.ReactNode) => (
        <td className="px-4 py-2 whitespace-nowrap text-sm">{children}</td>
      ),
      [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: React.ReactNode) => (
        <th className="px-4 py-2 text-left text-sm font-medium bg-foreground/5">{children}</th>
      ),
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <Link href={node.data.uri} className="text-blue-600 hover:underline">
          {children}
        </Link>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        // 디버깅: 노드 구조 확인
        console.log('임베디드 에셋 노드:', node.data?.target?.sys?.id);
        
        if (!node.data?.target?.sys?.id) {
          return (
            <div className="my-6 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700/50 rounded-lg">
              <p className="text-foreground/60 text-center text-sm italic">
                [잘못된 미디어 참조]
              </p>
            </div>
          );
        }
        
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];

        if (!asset) {
          // 디버깅: 사용 가능한 에셋 목록
          console.log('사용 가능한 에셋 키:', Object.keys(assetMap));
          
          return (
            <div className="my-6 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700/50 rounded-lg">
              <p className="text-foreground/60 text-center text-sm italic">
                [미디어를 찾을 수 없습니다: ID {assetId}]
              </p>
            </div>
          );
        }

        // 에셋 필드 확인
        const { title, file } = asset.fields;
        
        // 디버깅: 에셋 구조 확인
        console.log('에셋 필드:', JSON.stringify({
          id: assetId,
          hasFile: !!file,
          url: file?.url,
          contentType: file?.contentType
        }));
        
        // URL이 없는 경우 오류 표시
        if (!file || !file.url) {
          return (
            <div className="my-6 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700/50 rounded-lg">
              <p className="text-foreground/60 text-center text-sm italic">
                [미디어 URL이 없습니다: {title || 'Untitled'}]
              </p>
            </div>
          );
        }
        
        // URL 정규화 (https: 접두사 추가)
        const url = file.url.startsWith('//') ? `https:${file.url}` : 
                  file.url.startsWith('/') ? `https:/${file.url}` : 
                  file.url.startsWith('http') ? file.url : `https:${file.url}`;
                  
        // 쿠키 없는 최적화된 URL 생성
        const optimizedUrl = optimizeContentfulImageUrl(url);
        
        const contentType = file.contentType;

        // 이미지인 경우
        if (contentType.startsWith('image/')) {
          const { width, height } = file.details.image || { width: 800, height: 600 };
          
          return (
            <div className="my-6">
              <figure className="flex flex-col items-center">
                <div className="overflow-hidden rounded-lg border border-foreground/10">
                  <Image
                    src={optimizedUrl}
                    alt={title || '이미지'}
                    width={width}
                    height={height}
                    className="max-w-full h-auto"
                    loading="lazy"
                    unoptimized={true} // Contentful 이미지는 이미 최적화되어 있음
                  />
                </div>
                {title && title !== file.fileName && (
                  <figcaption className="mt-2 text-sm text-foreground/60 text-center">
                    {title}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        }
        
        // 비디오인 경우
        else if (contentType.startsWith('video/')) {
          return (
            <div className="my-6">
              <figure className="flex flex-col items-center">
                <video 
                  controls 
                  className="max-w-full rounded-lg border border-foreground/10"
                  preload="none"
                >
                  <source src={optimizedUrl} type={contentType} />
                  브라우저에서 비디오를 지원하지 않습니다.
                </video>
                {title && title !== file.fileName && (
                  <figcaption className="mt-2 text-sm text-foreground/60 text-center">
                    {title}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        }
        
        // 오디오인 경우
        else if (contentType.startsWith('audio/')) {
          return (
            <div className="my-6">
              <figure className="flex flex-col items-center">
                <audio 
                  controls 
                  className="w-full max-w-md"
                  preload="none"
                >
                  <source src={optimizedUrl} type={contentType} />
                  브라우저에서 오디오를 지원하지 않습니다.
                </audio>
                {title && (
                  <figcaption className="mt-2 text-sm text-foreground/60 text-center">
                    {title}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        }
        
        // PDF나 기타 파일인 경우
        else {
          return (
            <FileDownloader 
              url={optimizedUrl} 
              title={title || file.fileName} 
              fileDetails={file.details} 
              contentType={file.contentType} 
            />
          );
        }
      },
    },
  };

  return (
    <div className={`rich-text-content ${className}`}>
      {documentToReactComponents(content, options)}
    </div>
  );
} 
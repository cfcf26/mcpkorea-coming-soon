'use client';

import React from 'react';

interface FileComponentProps {
  url: string;
  title?: string;
  fileName: string;
}

const FileComponent: React.FC<FileComponentProps> = ({ url, title, fileName }) => {
  return (
    <div className="my-6">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        download={fileName}
        onClick={(e) => {
          // 파일 다운로드 이벤트 추적 (필요시)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'download', {
              event_category: 'file',
              event_label: fileName,
              value: 1
            });
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0"
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
        <span className="overflow-hidden text-ellipsis">{title || fileName}</span>
      </a>
    </div>
  );
};

// React.memo로 감싸서 불필요한 리렌더링 방지
export default React.memo(FileComponent); 
'use client';

import React from 'react';

interface VideoComponentProps {
  url: string;
  title?: string;
  type: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ url, title, type }) => {
  // URL에서 타입을 추출하고 유효성 검사
  const videoType = type || url.split('.').pop() || '';
  const mimeType = videoType ? `video/${videoType}` : 'video/mp4';
  
  return (
    <div className="my-6">
      <video
        controls
        className="rounded-lg max-w-full"
        style={{ maxHeight: "450px" }}
        preload="none" // 성능 최적화를 위해 추가
        loading="lazy" // 추가 속성 (일부 브라우저 지원)
        poster="/video-poster.jpg" // 비디오 썸네일 (필요시 실제 경로로 변경)
      >
        <source src={url} type={mimeType} />
        브라우저에서 비디오를 지원하지 않습니다.
      </video>
      {title && <p className="text-sm text-gray-500 mt-1">{title}</p>}
    </div>
  );
};

// React.memo로 감싸서 불필요한 리렌더링 방지
export default React.memo(VideoComponent); 
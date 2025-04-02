import React from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  contentType: string;
  fileName?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, contentType, fileName }) => {
  return (
    <div className="my-6">
      <figure className="flex flex-col items-center">
        <video 
          controls 
          className="max-w-full rounded-lg border border-foreground/10"
          preload="none" // 성능 최적화를 위해 preload 속성 추가
        >
          <source src={url} type={contentType} />
          브라우저에서 비디오를 지원하지 않습니다.
        </video>
        {title && title !== fileName && (
          <figcaption className="mt-2 text-sm text-foreground/60 text-center">
            {title}
          </figcaption>
        )}
      </figure>
    </div>
  );
};

export default VideoPlayer; 
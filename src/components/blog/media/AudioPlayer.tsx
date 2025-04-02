'use client';

import React from 'react';

interface AudioPlayerProps {
  url: string;
  title?: string;
  contentType: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, contentType }) => {
  return (
    <div className="my-6">
      <figure className="flex flex-col items-center">
        <audio 
          controls 
          className="w-full max-w-md"
          preload="none" // 성능 최적화를 위해 preload 속성 추가
        >
          <source src={url} type={contentType} />
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
};

export default React.memo(AudioPlayer); 
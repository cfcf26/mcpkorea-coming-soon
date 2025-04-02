import React from 'react';

interface FileDownloaderProps {
  url: string;
  title: string;
  fileDetails: {
    size: number;
  };
  contentType: string;
}

const FileDownloader: React.FC<FileDownloaderProps> = ({ url, title, fileDetails, contentType }) => {
  return (
    <div className="my-6">
      <div className="p-4 border border-foreground/10 rounded-lg bg-foreground/5">
        <div className="flex items-center">
          <div className="mr-4 text-3xl">📎</div>
          <div className="flex-1">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-foreground/60">
              {(fileDetails.size / 1024 / 1024).toFixed(2)} MB • {contentType}
            </p>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            download={title}
          >
            다운로드
          </a>
        </div>
      </div>
    </div>
  );
};

export default FileDownloader; 
import React from 'react';
import { Container, Card, Button } from '../common';
import Image from 'next/image';
import Link from 'next/link';

const VideoPreview: React.FC = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">곧 공개됩니다</h2>
          
          <Card className="overflow-hidden">
            <div className="relative">
              {/* 영상 썸네일 이미지 */}
              <div className="relative h-64 md:h-80 lg:h-96 bg-vscode-bg-secondary dark:bg-vscode-bg rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-7xl opacity-50 text-vscode-light-text-secondary dark:text-vscode-text-secondary">▶</div>
                </div>
                
                {/* Coming Soon 배너 */}
                <div className="absolute top-0 right-0 bg-vscode-accent text-white py-1 px-4 rounded-bl-lg">
                  Coming Soon
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  MCP를 활용한 랜딩페이지 제작 과정
                </h3>
                <p className="text-vscode-light-text-secondary dark:text-vscode-text-secondary mb-6">
                  MCP를 활용하여 효율적으로 랜딩페이지를 개발하는 방법을 단계별로 소개합니다.
                  이 영상에서는 MCP의 실제 활용 사례와 개발자들이 얻을 수 있는 이점을 자세히 다룹니다.
                </p>
                
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="text-vscode-light-text-secondary dark:text-vscode-text-secondary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>예상 소요 시간: 20분</span>
                  </div>
                  
                  <div className="text-vscode-light-text-secondary dark:text-vscode-text-secondary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>난이도: 중급</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="#subscribe">
                    <Button>구독하고 출시 알림 받기</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default VideoPreview; 
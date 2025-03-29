import React from 'react';
import { Container, Button } from '../common';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-6">
            <span className="text-vscode-accent dark:text-vscode-accent">Model Context Protocol</span>
            <br />
            한국 커뮤니티
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-vscode-light-text-secondary dark:text-vscode-text-secondary">
            AI 모델과 애플리케이션을 쉽게 연결하는 표준 프로토콜
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="#subscribe">
              <Button size="lg">PDF 가이드 받기</Button>
            </Link>
            <Link href="#learn-more">
              <Button variant="secondary" size="lg">더 알아보기</Button>
            </Link>
          </div>
          <div className="mt-12 text-sm text-vscode-light-text-secondary dark:text-vscode-text-secondary">
            <p className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              MCP는 AI 애플리케이션 개발을 위한 개방형 프로토콜입니다.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero; 
import React from 'react';
import { Container, Card } from '../common';
import { CodeBlock } from '../ui';

const McpIntro: React.FC = () => {
  const mcpSampleCode = `// MCP 클라이언트 초기화
const mcp = new MCPClient({
  provider: "openai",
  model: "gpt-4",
  apiKey: process.env.API_KEY
});

// 컨텍스트 추가
mcp.addContext({
  type: "document",
  content: "MCP는 AI 모델과 데이터 소스를 연결하는 표준 프로토콜입니다."
});

// 질의 수행
const response = await mcp.query({
  question: "MCP는 무엇인가요?",
  temperature: 0.7
});

console.log(response.text);`;

  return (
    <section id="learn-more" className="py-16 bg-vscode-light-bg-secondary dark:bg-vscode-bg-secondary">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">MCP(Model Context Protocol)란?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold mb-4">MCP의 특징</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vscode-accent-secondary dark:text-vscode-accent-secondary mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>다양한 LLM 모델 간 호환성</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vscode-accent-secondary dark:text-vscode-accent-secondary mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>쉬운 데이터 소스 통합</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vscode-accent-secondary dark:text-vscode-accent-secondary mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>컨텍스트 전달 표준화</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vscode-accent-secondary dark:text-vscode-accent-secondary mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>보안 및 개인정보 보호 내장</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vscode-accent-secondary dark:text-vscode-accent-secondary mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>개방형 및 커뮤니티 주도</span>
                </li>
              </ul>
            </Card>
            
            <div>
              <h3 className="text-xl font-bold mb-4">코드로 보는 MCP</h3>
              <CodeBlock 
                code={mcpSampleCode} 
                language="javascript" 
                title="mcp-example.js"
              />
            </div>
          </div>
          
          <Card className="mb-8">
            <h3 className="text-xl font-bold mb-4">MCP가 해결하는 문제</h3>
            <p>
              MCP는 AI 개발자들이 직면하는 다음과 같은 문제를 해결합니다:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>LLM 제공자 종속성 (공급업체 고착화)</li>
              <li>데이터 소스 연결의 복잡성</li>
              <li>컨텍스트 처리 비표준화</li>
              <li>멀티모달 입력 처리의 어려움</li>
              <li>보안 및 규정 준수 관리</li>
            </ul>
          </Card>
          
          <div className="text-center">
            <p className="text-vscode-light-text-secondary dark:text-vscode-text-secondary">
              MCP Korea 커뮤니티에 가입하여 더 많은 정보를 받아보세요.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default McpIntro; 
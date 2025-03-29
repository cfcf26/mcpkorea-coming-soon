import React from 'react';
import { Container } from '../common';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-vscode-bg-secondary dark:border-vscode-bg-secondary">
      <Container>
        <div className="text-center text-vscode-text-secondary dark:text-vscode-text-secondary text-sm">
          <p>&copy; {new Date().getFullYear()} MCP Korea. All rights reserved.</p>
          <p className="mt-2">
            <a 
              href="https://mcp.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-vscode-accent hover:underline"
            >
              Model Context Protocol
            </a>
            {' '}
            공식 문서에서 더 많은 정보를 확인하세요.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 
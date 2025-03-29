import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  className = '',
}) => {
  return (
    <div className={`font-mono rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="bg-vscode-bg-secondary dark:bg-vscode-bg-secondary px-4 py-2 text-sm border-b border-gray-700 flex items-center">
          <span className="text-vscode-text-secondary">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-vscode-bg dark:bg-vscode-bg p-4 overflow-x-auto text-vscode-text dark:text-vscode-text text-sm leading-relaxed border-l-2 border-vscode-accent">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock; 
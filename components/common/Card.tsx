import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-vscode-bg-secondary dark:bg-vscode-bg-secondary p-6 rounded-lg shadow-none dark:shadow-none light:shadow-vscode-light ${className}`}>
      {children}
    </div>
  );
};

export default Card; 
'use client';

import React from 'react';
import { Container } from '../common';
import { ThemeToggle } from '../ui';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-vscode-bg-secondary dark:border-vscode-bg-secondary">
      <Container>
        <div className="flex justify-between items-center">
          <Link href="/" className="text-vscode-accent font-mono text-xl font-bold">
            MCP Korea
          </Link>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
};

export default Header; 
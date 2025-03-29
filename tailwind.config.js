/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VS Code 다크 테마 색상
        'vscode-bg': '#1e1e1e',
        'vscode-bg-secondary': '#252526',
        'vscode-text': '#d4d4d4',
        'vscode-text-secondary': '#808080',
        'vscode-accent': '#007acc',
        'vscode-accent-secondary': '#6a9955',
        'vscode-warning': '#f14c4c',
        
        // VS Code 라이트 테마 색상
        'vscode-light-bg': '#ffffff',
        'vscode-light-bg-secondary': '#f3f3f3',
        'vscode-light-text': '#333333',
        'vscode-light-text-secondary': '#616161',
        'vscode-light-accent': '#0078d7',
        'vscode-light-accent-secondary': '#388a34',
        'vscode-light-warning': '#e51400',
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      boxShadow: {
        'vscode-light': '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
} 
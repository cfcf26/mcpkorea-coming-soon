# MCP Korea 랜딩페이지 - 파일/폴더 구조 문서

## 프로젝트 루트 구조

```
mcpkorea-landing/
├── app/                    # Next.js App Router 구조
├── components/             # 재사용 가능한 UI 컴포넌트
├── lib/                    # 유틸리티 및 설정 파일
├── public/                 # 정적 자산 (이미지, 폰트 등)
├── styles/                 # 글로벌 스타일 및 테마 설정
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
├── .env.local              # 환경 변수 (로컬 개발용)
├── .env.example            # 환경 변수 예제
├── .eslintrc.json          # ESLint 설정
├── .gitignore              # Git 무시 파일 설정
├── next.config.js          # Next.js 설정
├── package.json            # 의존성 및 스크립트
├── postcss.config.js       # PostCSS 설정
├── README.md               # 프로젝트 설명
├── tailwind.config.js      # Tailwind CSS 설정
└── tsconfig.json           # TypeScript 설정
```

## 주요 디렉토리 상세 구조

### `app/` 디렉토리 (Next.js App Router)

```
app/
├── api/                    # API 라우트
│   ├── send-pdf/           # PDF 전송 API
│   │   └── route.ts        # API 라우트 핸들러
│   └── subscribe/          # 구독 API
│       └── route.ts        # 이메일 저장 핸들러
├── favicon.ico             # 파비콘
├── globals.css             # 글로벌 CSS
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 메인 랜딩 페이지
└── providers.tsx           # 테마, 상태 등 프로바이더
```

### `components/` 디렉토리

```
components/
├── common/                 # 공통 UI 컴포넌트
│   ├── Button.tsx          # 버튼 컴포넌트
│   ├── Card.tsx            # 카드 컴포넌트
│   ├── Container.tsx       # 컨테이너 레이아웃
│   └── index.ts            # 컴포넌트 내보내기
├── layout/                 # 레이아웃 관련 컴포넌트
│   ├── Footer.tsx          # 푸터 컴포넌트
│   ├── Header.tsx          # 헤더 컴포넌트
│   └── index.ts            # 레이아웃 내보내기
├── sections/               # 페이지 섹션 컴포넌트
│   ├── EmailForm.tsx       # 이메일 수집 폼
│   ├── Hero.tsx            # 히어로 섹션
│   ├── McpIntro.tsx        # MCP 소개 섹션
│   ├── VideoPreview.tsx    # 영상 미리보기 섹션
│   └── index.ts            # 섹션 내보내기
└── ui/                     # 특수 UI 컴포넌트
    ├── CodeBlock.tsx       # VS Code 스타일 코드 블록
    ├── ThemeToggle.tsx     # 다크/라이트 모드 토글
    └── index.ts            # UI 컴포넌트 내보내기
```

### `lib/` 디렉토리

```
lib/
├── supabase.ts             # Supabase 클라이언트 설정
└── theme.ts                # 테마 관련 설정
```

### `public/` 디렉토리

```
public/
├── fonts/                  # 웹 폰트 파일
├── images/                 # 이미지 파일
│   ├── logo.svg            # 로고
│   ├── mcp-diagram.svg     # MCP 개념 다이어그램
│   └── video-placeholder.jpg # 비디오 자리 표시자
└── docs/                   # 다운로드 가능한 문서
    └── mcp-guide.pdf       # 구독자에게 제공할 PDF
```

### `styles/` 디렉토리

```
styles/
├── globals.css             # 전역 스타일 (app/globals.css와 연결)
└── theme.css               # 테마 변수 정의
```

### `types/` 디렉토리

```
types/
├── index.ts                # 타입 내보내기
└── supabase.ts             # Supabase 관련 타입
```

### `utils/` 디렉토리

```
utils/
├── email.ts                # 이메일 처리 유틸리티
├── validation.ts           # 폼 유효성 검사 유틸리티
└── analytics.ts            # 간단한 분석 유틸리티
```

## 핵심 파일 설명

### `package.json`

```json
{
  "name": "mcpkorea-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.1",
    "@supabase/supabase-js": "^2.33.1",
    "next": "^13.4.19",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.46.1",
    "zod": "^3.22.2"
  },
  "devDependencies": {
    "@types/node": "^20.5.9",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "autoprefixer": "^10.4.15",
    "eslint": "^8.48.0",
    "eslint-config-next": "^13.4.19",
    "postcss": "^8.4.29",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.2.2"
  }
}
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
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
```

### `.env.example`

```
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 이메일 전송 서비스 (선택적)
EMAIL_SERVICE_API_KEY=your-email-service-api-key
```

## 컴포넌트 import/export 구조

### 컴포넌트 내보내기 방식

```typescript
// components/index.ts
export * from './common';
export * from './layout';
export * from './sections';
export * from './ui';

// components/common/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Container } from './Container';
```

### 컴포넌트 가져오기 예제

```typescript
// app/page.tsx
import { 
  Hero, 
  McpIntro, 
  EmailForm, 
  VideoPreview 
} from '@/components/sections';

import { 
  Container 
} from '@/components/common';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <McpIntro />
      <EmailForm />
      <VideoPreview />
    </Container>
  );
}
```

## 주요 환경 설정 파일

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
``` 
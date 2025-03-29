# MCP Korea 랜딩페이지 - 테스트 및 품질 관리 문서

## 테스트 전략

### 테스트 유형별 접근법

#### 1. 단위 테스트
- **범위**: 개별 컴포넌트, 유틸리티 함수, API 핸들러
- **도구**: Jest, React Testing Library
- **목표 커버리지**: 핵심 기능 80% 이상

```jsx
// components/ui/Button.test.tsx 예시
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button 컴포넌트', () => {
  test('기본 렌더링 테스트', () => {
    render(<Button>테스트 버튼</Button>);
    const buttonElement = screen.getByText('테스트 버튼');
    expect(buttonElement).toBeInTheDocument();
  });

  test('클릭 이벤트 발생 테스트', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>클릭 테스트</Button>);
    
    const buttonElement = screen.getByText('클릭 테스트');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('비활성화 상태 테스트', () => {
    render(<Button disabled>비활성화 버튼</Button>);
    const buttonElement = screen.getByText('비활성화 버튼');
    
    expect(buttonElement).toBeDisabled();
  });
});
```

#### 2. 통합 테스트
- **범위**: 컴포넌트 간 상호작용, 폼 제출 처리, API 연동
- **도구**: Jest, React Testing Library, MSW(Mock Service Worker)
- **핵심 시나리오**: 이메일 구독 프로세스, 다크/라이트 모드 전환

```jsx
// integration/EmailSubscription.test.tsx 예시
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import EmailForm from '@/components/sections/EmailForm';

// API 모킹 설정
const server = setupServer(
  rest.post('/api/subscribe', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('이메일 구독 프로세스', () => {
  test('유효한 이메일 제출 처리', async () => {
    render(<EmailForm />);
    
    // 이메일 입력
    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // 폼 제출
    const submitButton = screen.getByRole('button', { name: /구독/i });
    fireEvent.click(submitButton);
    
    // 성공 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/구독해 주셔서 감사합니다/i)).toBeInTheDocument();
    });
  });
  
  test('유효하지 않은 이메일 오류 처리', async () => {
    render(<EmailForm />);
    
    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /구독/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/유효한 이메일을 입력해주세요/i)).toBeInTheDocument();
    });
  });
});
```

#### 3. E2E(End-to-End) 테스트
- **범위**: 전체 사용자 흐름, 브라우저 호환성
- **도구**: Cypress, Playwright
- **주요 시나리오**: 랜딩 페이지 탐색, 이메일 입력, PDF 다운로드 링크 수신

```js
// cypress/e2e/landing-page.cy.js 예시
describe('랜딩 페이지 E2E 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('페이지 로드 및 주요 섹션 표시 확인', () => {
    // 헤더 확인
    cy.get('header').should('be.visible');
    
    // 히어로 섹션 확인
    cy.get('[data-testid="hero-section"]').should('be.visible');
    
    // MCP 소개 섹션 확인
    cy.get('[data-testid="mcp-intro-section"]').should('be.visible');
    
    // 이메일 폼 섹션 확인
    cy.get('[data-testid="email-form-section"]').should('be.visible');
    
    // 비디오 미리보기 섹션 확인
    cy.get('[data-testid="video-preview-section"]').should('be.visible');
  });

  it('이메일 구독 전체 흐름 테스트', () => {
    // 이메일 입력
    cy.get('[data-testid="email-input"]').type('test@example.com');
    
    // 약관 동의 체크
    cy.get('[data-testid="terms-checkbox"]').check();
    
    // 제출 버튼 클릭
    cy.get('[data-testid="submit-button"]').click();
    
    // 성공 메시지 확인
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('다크 모드 전환 테스트', () => {
    // 기본 라이트 모드 확인
    cy.get('html').should('not.have.class', 'dark');
    
    // 다크 모드 토글 클릭
    cy.get('[data-testid="theme-toggle"]').click();
    
    // 다크 모드 적용 확인
    cy.get('html').should('have.class', 'dark');
  });
});
```

#### 4. 접근성 테스트
- **범위**: WCAG 2.1 AA 준수
- **도구**: axe-core, @testing-library/jest-dom
- **핵심 검사 영역**: 키보드 탐색, 스크린 리더 호환성, 색상 대비

```jsx
// accessibility/a11y.test.jsx 예시
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import HomePage from '@/app/page';

expect.extend(toHaveNoViolations);

describe('접근성 테스트', () => {
  it('랜딩 페이지 접근성 위반 없음', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

### 테스트 설정 및 실행

#### Jest 설정
```js
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

#### Cypress 설정
```js
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
  },
});
```

#### 테스트 스크립트
```json
// package.json의 scripts 섹션
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:a11y": "jest -c jest.a11y.config.js"
  }
}
```

## 품질 관리 프로세스

### 코드 품질 관리

#### ESLint 설정
```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

#### Prettier 설정
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### TypeScript 엄격 모드 설정
```json
// tsconfig.json의 compilerOptions 섹션
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 지속적 통합(CI) 설정

#### GitHub Actions 워크플로우
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Run tests
        run: npm test
      - name: Run accessibility tests
        run: npm run test:a11y
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npm run test:e2e
```

### 코드 리뷰 프로세스

#### 풀 리퀘스트 템플릿
```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## 개요
<!-- 이 PR이 무엇을 위한 것인지 간략히 설명해주세요 -->

## 변경사항
<!-- 주요 변경사항을 나열해주세요 -->

## 테스트 방법
<!-- 이 변경사항을 테스트하는 방법을 설명해주세요 -->

## 스크린샷
<!-- 해당되는 경우 스크린샷을 첨부해주세요 -->

## 체크리스트
- [ ] 테스트가 추가/수정됨
- [ ] 문서가 업데이트됨
- [ ] 코드가 lint 규칙을 준수함
- [ ] 접근성 검사를 통과함
```

#### 코드 리뷰 지침
1. **기능 검증**: 구현된 기능이 요구사항을 충족하는지 확인
2. **코드 품질**: 코드 스타일, 성능, 재사용성 검토
3. **테스트 커버리지**: 적절한 테스트가 포함되었는지 확인
4. **접근성**: WCAG 지침 준수 여부 점검
5. **보안**: 잠재적 보안 취약점 검토

### 성능 모니터링

#### Core Web Vitals 측정
- Lighthouse CI를 통한 성능 지표 모니터링
- Web Vitals 라이브러리를 통한 실사용자 측정(RUM)

```js
// app/layout.tsx에 추가
import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  // 성능 지표를 분석 서비스로 전송
  console.log(metric);
}
```

#### 성능 최적화 기준
- **FCP(First Contentful Paint)**: 1.8초 이하
- **LCP(Largest Contentful Paint)**: 2.5초 이하
- **CLS(Cumulative Layout Shift)**: 0.1 이하
- **TTI(Time to Interactive)**: 3.8초 이하

### 출시 전 체크리스트

#### 기능 검증
- [ ] 모든 핵심 기능이 모든 지원 브라우저에서 정상 작동
- [ ] 반응형 레이아웃이 모든 타겟 디바이스에서 올바르게 표시
- [ ] 필수 폼 유효성 검사 정상 작동

#### 성능 검증
- [ ] WebPageTest 검사 완료 (모바일 3G 조건)
- [ ] Lighthouse 성능 점수 90점 이상
- [ ] 이미지 최적화 확인

#### 접근성 검증
- [ ] WAVE 도구를 사용한 접근성 검사 완료
- [ ] 키보드 전용 사용자를 위한 탐색 테스트
- [ ] 고대비 모드 테스트

#### 보안 검증
- [ ] OWASP Top 10 취약점 검사
- [ ] CSP(Content Security Policy) 설정 확인
- [ ] 민감한 환경 변수 보호 확인

## 모니터링 및 사후 관리

### 오류 모니터링
- Sentry를 통한 프론트엔드 오류 추적
- 서버리스 함수 로그 모니터링

```js
// app/layout.tsx에 Sentry 설정 추가
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 사용자 피드백 수집
- 간단한 피드백 폼 구현
- 이메일을 통한 사용자 의견 수집
- 웹사이트 사용성 이슈 추적

### 정기 유지보수 계획
- 월간 의존성 업데이트 및 보안 패치
- 분기별 성능 및 접근성 감사
- 사용자 피드백 기반 UX 개선 
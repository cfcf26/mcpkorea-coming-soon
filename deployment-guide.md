# MCP Korea 랜딩페이지 - 배포 및 CI/CD 가이드

## 배포 환경 개요

### 주요 배포 환경
- **개발(Development)**: 개발자 로컬 환경 및 개발용 Netlify 사이트
- **스테이징(Staging)**: 테스트 및 검증용 Netlify 사이트
- **프로덕션(Production)**: 사용자 대상 공개 Netlify 사이트

### 배포 인프라
- **호스팅 플랫폼**: Netlify
- **데이터베이스**: Supabase
- **CDN**: Netlify Edge Network
- **CI/CD**: GitHub Actions + Netlify CI

## 개발 환경 설정

### 로컬 개발 환경
```bash
# 프로젝트 복제
git clone https://github.com/mcpkorea/landing-page.git
cd landing-page

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 환경 변수 추가

# 개발 서버 실행
npm run dev
```

### 개발 환경 접속 정보
- **개발 서버 URL**: http://localhost:3000
- **API 엔드포인트**: http://localhost:3000/api
- **Supabase 개발 프로젝트**: https://app.supabase.io/projects/mcpkorea-dev

## 배포 파이프라인

### CI/CD 워크플로우
1. **코드 커밋 및 푸시**: GitHub 저장소에 코드 변경사항 푸시
2. **자동 테스트 실행**: GitHub Actions를 통한 자동 테스트 수행
3. **빌드 프로세스**: 테스트 통과 시 Next.js 빌드 수행
4. **Netlify 배포**: 브랜치에 따라 적절한 환경에 자동 배포
5. **배포 후 테스트**: 자동화된
E2E 테스트 실행

### 브랜치 기반 배포 전략
- **`develop` 브랜치**: 개발 환경에 자동 배포
- **`staging` 브랜치**: 스테이징 환경에 자동 배포
- **`main` 브랜치**: 프로덕션 환경에 수동 승인 후 배포

## GitHub Actions 설정

### 테스트 및 빌드 워크플로우
```yaml
# .github/workflows/ci.yml
name: Test and Build

on:
  push:
    branches: [ develop, staging, main ]
  pull_request:
    branches: [ develop, staging, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint check
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Unit tests
        run: npm run test
      - name: Build project
        run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v2
        with:
          name: build-output
          path: .next/
```

### 개발 환경 자동 배포
```yaml
# .github/workflows/deploy-dev.yml
name: Deploy to Development

on:
  push:
    branches: [ develop ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --site ${{ secrets.NETLIFY_SITE_ID_DEV }} --auth ${{ secrets.NETLIFY_AUTH_TOKEN }} --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID_DEV }}
```

### 스테이징 환경 자동 배포
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [ staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --site ${{ secrets.NETLIFY_SITE_ID_STAGING }} --auth ${{ secrets.NETLIFY_AUTH_TOKEN }} --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID_STAGING }}
```

### 프로덕션 환경 배포 (수동 승인)
```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://mcpkorea.com
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --site ${{ secrets.NETLIFY_SITE_ID_PROD }} --auth ${{ secrets.NETLIFY_AUTH_TOKEN }} --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID_PROD }}
```

## Netlify 설정

### 사이트 설정
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
  
[build.environment]
  NODE_VERSION = "18.x"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# 개발 환경 설정
[context.develop]
  environment = { NODE_ENV = "development", NEXT_PUBLIC_API_URL = "https://develop.mcpkorea.com/api" }

# 스테이징 환경 설정
[context.staging]
  environment = { NODE_ENV = "staging", NEXT_PUBLIC_API_URL = "https://staging.mcpkorea.com/api" }

# 프로덕션 환경 설정
[context.production]
  environment = { NODE_ENV = "production", NEXT_PUBLIC_API_URL = "https://mcpkorea.com/api" }

# 리다이렉트 규칙
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 환경 변수 설정
각 Netlify 사이트에서 다음 환경 변수 설정:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 클라이언트 키
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키 (서버 측 기능용)
- `EMAIL_SERVICE_API_KEY`: 이메일 서비스 API 키

## 도메인 및 SSL 설정

### 도메인 설정
1. **개발 환경**: develop.mcpkorea.com
2. **스테이징 환경**: staging.mcpkorea.com
3. **프로덕션 환경**: mcpkorea.com, www.mcpkorea.com

### DNS 설정 (Netlify DNS 사용 시)
```
mcpkorea.com                 A      104.198.14.52
www.mcpkorea.com             CNAME  mcpkorea.netlify.app
develop.mcpkorea.com         CNAME  mcpkorea-dev.netlify.app
staging.mcpkorea.com         CNAME  mcpkorea-staging.netlify.app
```

### SSL 인증서
- Netlify의 자동 Let's Encrypt 인증서 활용
- HTTPS 강제 리디렉션 활성화

## 배포 전략

### 기능 브랜치 워크플로우
1. **기능 개발**: 
   - 새로운 기능 브랜치 생성 (`feature/feature-name`)
   - 기능 개발 및 테스트 완료
   - PR을 통해 `develop` 브랜치로 병합

2. **개발 환경 테스트**:
   - `develop` 브랜치에 병합된 코드 자동 배포
   - 개발 환경에서 기능 검증

3. **스테이징 배포**:
   - `develop`에서 `staging` 브랜치로 PR 생성 및 병합
   - 스테이징 환경에 자동 배포
   - QA 팀 테스트 및 검증

4. **프로덕션 배포**:
   - `staging`에서 `main` 브랜치로 PR 생성
   - 코드 리뷰 및 승인 후 병합
   - 수동 승인 후 프로덕션 배포

### 롤백 절차
프로덕션 배포 후 문제 발생 시:

1. Netlify 대시보드에서 이전 배포 선택
2. "Publish deploy" 버튼 클릭하여 롤백
3. GitHub의 `main` 브랜치 상태 복원
   ```bash
   git revert [문제가 된 커밋 해시]
   git push origin main
   ```

## 모니터링 및 알림

### 배포 알림
- Slack 채널을 통한 배포 상태 알림 설정
- 이메일을 통한 배포 실패 알림

```yaml
# .github/workflows/notify.yml (일부)
- name: Slack Notification
  uses: rtCamp/action-slack-notify@v2
  if: always()
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_CHANNEL: deployments
    SLACK_COLOR: ${{ job.status }}
    SLACK_TITLE: "배포 상태"
    SLACK_MESSAGE: "환경: ${{ github.ref }} | 상태: ${{ job.status }}"
```

### 성능 모니터링
- Netlify Analytics를 통한 트래픽 및 성능 모니터링
- Google Analytics를 통한 사용자 행동 분석

## 보안 고려사항

### 배포 보안
- GitHub 저장소 액세스 제한
- Netlify 배포 권한 관리
- 환경 변수 안전한 저장 (GitHub Secrets 및 Netlify 환경 변수)

### 프런트엔드 보안 헤더
```toml
# netlify.toml에 추가
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com"
```

## 배포 체크리스트

### 배포 전 확인사항
- [ ] 모든 테스트 통과 확인
- [ ] 코드 리뷰 완료
- [ ] 환경 변수 설정 확인
- [ ] 빌드 성공 확인

### 배포 후 확인사항
- [ ] 웹사이트 접속 및 기본 기능 확인
- [ ] 폼 제출 기능 테스트
- [ ] 다크/라이트 모드 전환 확인
- [ ] 모바일 레이아웃 확인
- [ ] 주요 브라우저 호환성 확인
- [ ] 성능 지표 확인 (Lighthouse)

## 트러블슈팅 가이드

### 일반적인 배포 문제
1. **빌드 실패**: 
   - 의존성 문제 확인
   - TypeScript 오류 확인
   - 환경 변수 설정 확인

2. **API 연결 문제**:
   - CORS 설정 확인
   - Supabase 연결 문제 디버깅
   - API 경로 및 핸들러 확인

3. **스타일 깨짐**:
   - CSS 빌드 확인
   - 브라우저 호환성 이슈 확인

### 로그 확인 방법
- Netlify 배포 로그 확인 방법
- 서버리스 함수 로그 확인 방법
- Supabase 로그 확인 방법 
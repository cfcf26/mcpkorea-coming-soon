# MCP Korea 랜딩페이지 - 백엔드 및 인프라 문서

## 백엔드 기술 스택

### 주요 서비스
- **Supabase**: 백엔드 데이터베이스 및 인증 서비스
- **Netlify**: 웹 호스팅 및 서버리스 함수 실행 환경

## Supabase 설정

### 데이터베이스 스키마

#### `subscribers` 테이블
```sql
CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  verification_token UUID DEFAULT uuid_generate_v4(),
  metadata JSONB DEFAULT '{}'
);

-- 이메일 인덱스 생성
CREATE INDEX idx_subscribers_email ON subscribers(email);
```

### 보안 정책 설정
```sql
-- 익명 사용자 구독자 추가 허용 정책
CREATE POLICY "익명 사용자가 구독자 추가 가능" 
ON subscribers FOR INSERT 
TO anon 
WITH CHECK (true);

-- 구독자 읽기는 인증된 관리자만 가능
CREATE POLICY "인증된 관리자만 구독자 읽기 가능" 
ON subscribers FOR SELECT 
TO authenticated 
USING (auth.uid() IN (
  SELECT user_id FROM admin_users
));
```

### 스토리지 설정
```sql
-- PDF 문서를 위한 스토리지 버킷
CREATE POLICY "PDF 문서 공개 읽기 허용" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'documents' AND path LIKE 'public/%');
```

## Netlify 설정

### 배포 설정
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18.17.0"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 환경 변수 설정
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY`: 서버리스 함수용 서비스 역할 키 (안전하게 보관)
- `EMAIL_SERVICE_API_KEY`: 이메일 서비스 API 키

## 서버리스 함수

### PDF 전송 함수
```js
// functions/send-pdf.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // POST 요청만 처리
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    // Supabase 클라이언트 초기화
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 이메일 서비스 API 설정
    const emailService = require('./utils/email-service');
    
    // PDF 문서 URL 생성
    const { data } = await supabaseAdmin
      .storage
      .from('documents')
      .createSignedUrl('public/mcp-guide.pdf', 60 * 60 * 24); // 24시간 유효
    
    // 이메일 전송
    await emailService.sendEmail({
      to: email,
      subject: 'MCP Korea - MCP 가이드 문서',
      template: 'pdf-delivery',
      variables: {
        download_url: data.signedUrl
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('PDF 전송 오류:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: '이메일 전송 중 오류가 발생했습니다.' 
      })
    };
  }
};
```

## 이메일 서비스 통합

### 이메일 템플릿 설정
```html
<!-- email-templates/pdf-delivery.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.5; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      background-color: #007acc; 
      color: white; 
      padding: 10px 20px; 
      text-decoration: none; 
      border-radius: 4px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>MCP Korea - MCP 가이드 문서</h1>
    <p>안녕하세요,</p>
    <p>MCP Korea 커뮤니티에 관심을 가져주셔서 감사합니다. 요청하신 MCP 가이드 문서를 아래 링크에서 다운로드하실 수 있습니다.</p>
    <p>
      <a href="{{download_url}}" class="button">가이드 다운로드</a>
    </p>
    <p>링크는 24시간 동안 유효합니다.</p>
    <p>MCP Korea 팀 드림</p>
  </div>
</body>
</html>
```

## 백엔드 보안 설정

### CORS 설정
```js
// netlify.toml에 추가
[[headers]]
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Origin, X-Requested-With, Content-Type, Accept"
```

### 데이터 유효성 검증
```js
// functions/utils/validation.js
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const sanitizeInput = (input) => {
  // HTML 태그 및 스크립트 제거
  return input.replace(/<[^>]*>?/gm, '');
};

module.exports = {
  validateEmail,
  sanitizeInput
};
```

## 모니터링 및 로깅

### Netlify 애널리틱스 설정
```js
// netlify.toml에 추가
[build.environment]
  NETLIFY_ANALYTICS_ENABLED = "true"
```

### 오류 로깅
```js
// functions/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'mcpkorea-landing' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
```

## 백업 및 복구 전략

### Supabase 데이터 백업
```sql
-- 매일 자동 백업 설정
SELECT cron.schedule(
  'daily-backup',
  '0 0 * * *',  -- 매일 자정에 실행
  $$
  SELECT pg_dump_command()
  $$
);
```

### 백업 저장소 설정
- AWS S3 버킷을 사용하여 백업 파일 저장
- 7일간의 일일 백업 및 1년간의 월간 백업 보관

## 인프라 확장성 계획

### 트래픽 증가 대응
- Netlify의 CDN을 통한 정적 자산 캐싱
- Supabase의 자동 스케일링 설정 활성화

### 지역 최적화
- 아시아 리전 Netlify 엣지 노드 활용
- 한국 근접 지역의 Supabase 인스턴스 선택

## 배포 파이프라인

### CI/CD 워크플로우
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 서드파티 서비스 통합

### Google Analytics 설정
```js
// app/layout.tsx에 추가
export const metadata = {
  // ...기존 메타데이터
  verification: {
    google: 'Google-Site-Verification-ID',
  },
};

// Google Analytics 스크립트 컴포넌트
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
``` 
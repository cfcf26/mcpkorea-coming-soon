# MCPKorea Coming Soon 페이지

MCPKorea의 Coming Soon 페이지 프로젝트입니다. Next.js 15와 Tailwind CSS v4.0을 사용하여 구현되었습니다.

## 기능

- 라이트/다크 모드 지원
- 관심 있는 사용자를 위한 대기자 명단 이메일 수집
- Supabase를 이용한 데이터 저장
- 반응형 디자인

## 기술 스택

- Next.js 15 (React 19)
- Tailwind CSS v4.0
- Supabase
- Netlify 배포

## 개발 환경 설정

1. 저장소 복제

```bash
git clone <repository-url>
cd mcpkorea
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

`.env.local.example` 파일을 `.env.local`로 복사하고 Supabase 관련 정보를 입력합니다.

```bash
cp .env.local.example .env.local
```

4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하면 애플리케이션을 확인할 수 있습니다.

## Supabase 설정

1. Supabase 프로젝트 생성
2. `waitlist` 테이블 생성:
   - `email` (text, primary key)
   - `created_at` (timestamp with time zone)
3. `.env.local` 파일에 Supabase URL과 Anon Key 입력

## 배포

Netlify를 통해 배포할 수 있습니다.

```bash
npm run build
```

빌드된 파일은 `.next` 디렉토리에 생성됩니다.

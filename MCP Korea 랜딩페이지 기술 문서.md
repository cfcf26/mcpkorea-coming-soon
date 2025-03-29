# MCP Korea 랜딩페이지 MVP 기술 문서

## 개요
이 문서는 MCP Korea 커뮤니티 구축을 위한 초기 랜딩페이지 개발의 기술적 구성을 정의합니다.

## MCP 간단 소개
Model Context Protocol (MCP)는 애플리케이션이 LLM(대규모 언어모델)에 컨텍스트를 제공하는 방식을 표준화하는 개방형 프로토콜입니다. MCP는 AI 응용 프로그램을 위한 USB-C 포트와 같은 역할을 하며, 다양한 데이터 소스 및 도구에 AI 모델을 연결할 수 있는 표준 방식을 제공합니다.

### MCP의 장점
- 사전 구축된 다양한 데이터 소스 및 도구와의 직접 연결 지원
- LLM 공급자 및 벤더 간의 자유로운 전환 가능
- 인프라 내 데이터 보안을 위한 모범 사례 제공

## 목표
- MCP 개념을 명확히 소개하고, 초기 사용자 이메일을 수집
- 랜딩페이지 제작에 MCP 활용 (설명 수준)
- 영상 Placeholder로 MCP 활용 결과 예고

## 페이지 구성

### 1. MCP 간단 소개
- MCP란 무엇인가?
- MCP 사용 시 얻는 핵심적인 장점
- 명료하고 기술적으로 간결한 문구로 작성

### 2. 이메일 수집 폼
- 이메일 주소 입력 필드
- CTA 버튼 (문구 임시 적용, 추후 변경)
- Supabase DB와 연결하여 이메일 저장 및 관리
- 이메일 입력 즉시 PDF 전달을 위한 API 엔드포인트 호출 기능 구현

### 3. 영상 예고 공간
- 초기 단계에서는 Placeholder 형태로 구성
- 명확한 "Coming Soon" 문구 포함
- 영상 소개 간략 문구 삽입:
  - 예시: "MCP를 활용한 랜딩페이지 제작 과정과 성과를 곧 영상으로 공개합니다."

## 디자인 가이드
- VSCode 기본 색상 팔레트 사용
- VSCode 기본 폰트 적용
- 다크 모드와 라이트 모드 지원

## 기술 스택

### 프론트엔드
- Next.js (App Router 방식)
- React
- Tailwind CSS
- React-hook-form + Zod (폼 유효성 관리)

### 백엔드 및 인프라
- Netlify (호스팅 및 CI/CD)
- Supabase (DB 관리, 이메일 저장)

## 구현 단계

### 1단계: 초기 세팅
- Next.js 프로젝트 초기화
  ```sh
  npx create-next-app@latest mcpkorea-landing
  ```
- Tailwind CSS 설치 및 초기화
  ```sh
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- Supabase 설정 (DB 스키마, 이메일 테이블)
- Netlify 프로젝트 생성 및 연결

### 2단계: 페이지 개발
- MCP 소개 섹션 UI 및 텍스트 적용
- 이메일 수집 폼 구성 및 Supabase와 데이터 연결
- 이메일 입력 시 자동으로 이메일 전달 API 엔드포인트 호출 연동
- 영상 Placeholder 공간 개발 (임시 문구와 레이아웃 구성)
- VSCode 스타일의 다크 모드 및 라이트 모드 스타일 적용

### 3단계: 테스트 및 배포
- 이메일 수집 데이터 저장 및 검증
- 이메일 자동 발송 API 엔드포인트 호출 기능 검증
- Netlify를 통한 랜딩페이지 배포 및 도메인 연결

## 추후 확장 계획
- 실제 영상 촬영 후 Placeholder 교체
- 최종 CTA 문구 결정 및 적용
- 로고 디자인 적용 및 디자인 요소 개선

이 문서를 기준으로 단계적으로 개발을 진행하면 명확하고 빠른 MVP 구축이 가능합니다.
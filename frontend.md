# MCP Korea 랜딩페이지 - 프론트엔드 기술 문서

## 기술 스택
- **Next.js (App Router)**: 서버 사이드 렌더링 및 정적 사이트 생성을 위한 React 프레임워크
- **React**: UI 구성을 위한 JavaScript 라이브러리
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **React-hook-form**: 폼 상태 관리 및 유효성 검사
- **Zod**: 타입스크립트 유효성 검증 라이브러리

## 초기 설정
```sh
# Next.js 프로젝트 생성
npx create-next-app@latest mcpkorea-landing --typescript

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 폼 관리 라이브러리 설치
npm install react-hook-form zod @hookform/resolvers

# Supabase 클라이언트 설치
npm install @supabase/supabase-js
```

## 핵심 컴포넌트

### 1. 헤더 컴포넌트
- 로고 및 네비게이션
- 다크/라이트 모드 토글 기능

### 2. MCP 소개 섹션
- 주요 정보 표시 레이아웃
- VSCode 스타일의 코드 블록 디자인

### 3. 이메일 수집 폼
```tsx
// 예시 코드
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요')
});

type FormValues = z.infer<typeof schema>;

export default function EmailForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  
  const onSubmit = async (data: FormValues) => {
    // Supabase에 이메일 저장
    // PDF 전송 API 호출
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 폼 필드 구현 */}
    </form>
  );
}
```

### 4. 영상 플레이스홀더 섹션
- 영상 썸네일 및 설명 텍스트
- "Coming Soon" 배너 표시

## API 연동

### Supabase 연결 설정
```tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 이메일 저장 함수
```tsx
// utils/email.ts
import { supabase } from '../lib/supabase';

export async function saveEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email, subscribed_at: new Date() }]);
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving email:', error);
    return { success: false, error };
  }
}
```

### PDF 전송 API 엔드포인트
```tsx
// app/api/send-pdf/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // 이메일로 PDF 전송 로직 구현
    // 외부 이메일 서비스 API 호출 등
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'PDF 전송 실패' },
      { status: 500 }
    );
  }
}
```

## 다크/라이트 모드 구현
```tsx
// components/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
```

## SEO 최적화
- Next.js 메타데이터 API 활용
- OG 이미지 및 메타 태그 구성

## 성능 최적화
- 이미지 최적화 (Next.js Image 컴포넌트)
- 코드 스플리팅
- 점진적 향상 기법 적용 
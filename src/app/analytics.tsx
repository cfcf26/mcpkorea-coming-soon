'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { loadGTMWhenVisible, pageView } from '@/utils/gtm';
import { Suspense } from 'react';

const GA_TRACKING_ID = 'G-E72Y65YPBM';
const GTM_ID = 'GTM-NJ24QHLL';

// 실제 Analytics 기능을 처리하는 내부 컴포넌트
function AnalyticsImpl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 컴포넌트 마운트 시 GTM 초기화 (유저 상호작용 시 로드)
  useEffect(() => {
    // 지연 로드 함수 호출 (유저 상호작용 시 로드)
    loadGTMWhenVisible(GTM_ID);
    
    // 애플리케이션 중요 경로 방문 시 prefetch를 통한 최적화
    return () => {
      // 컴포넌트 언마운트 시 정리 코드 (필요 시)
    };
  }, []);

  // 페이지 변경 감지 및 이벤트 발송
  useEffect(() => {
    if (!pathname) return;

    // URL이 변경될 때마다 페이지뷰 이벤트 발생
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // 페이지 변경 시 페이지뷰 이벤트 발송 (큐 시스템 활용)
    pageView(url);
  }, [pathname, searchParams]);

  return null;
}

// Suspense로 감싸서 내보내는 래퍼 컴포넌트
export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsImpl />
    </Suspense>
  );
} 
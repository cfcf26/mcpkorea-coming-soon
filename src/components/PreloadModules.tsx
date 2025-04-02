'use client';

import { useEffect } from 'react';

/**
 * 중요한 모듈을 사전 로드하는 컴포넌트
 * - 중요 모듈의 동적 임포트를 미리 준비하여 성능 개선
 * - 사용자 상호작용 이후에 중요 모듈을 미리 로드
 */
export default function PreloadModules() {
  useEffect(() => {
    // 사용자 상호작용 발생 후 미리 로드할 함수
    const preloadAfterInteraction = () => {
      // 상호작용 이벤트 제거
      window.removeEventListener('mousemove', preloadOnIdle);
      window.removeEventListener('scroll', preloadOnIdle);
      window.removeEventListener('keydown', preloadOnIdle);
      
      // requestIdleCallback 이용하여 브라우저 유휴 시간에 로드
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // 중요한 컴포넌트/모듈 미리 로드
          import('../components/media/VideoComponent');
          import('../components/media/FileComponent');
          import('../components/blog/media/AudioPlayer');
        });
      } else {
        // requestIdleCallback을 지원하지 않는 브라우저
        setTimeout(() => {
          import('../components/media/VideoComponent');
          import('../components/media/FileComponent');
          import('../components/blog/media/AudioPlayer');
        }, 1000);
      }
    };
    
    // 유저 상호작용 기반 사전 로드
    const preloadOnIdle = () => {
      preloadAfterInteraction();
    };
    
    // 유저 상호작용 이벤트 리스너 등록 
    window.addEventListener('mousemove', preloadOnIdle, { once: true, passive: true });
    window.addEventListener('scroll', preloadOnIdle, { once: true, passive: true });
    window.addEventListener('keydown', preloadOnIdle, { once: true, passive: true });
    
    // 5초 후 자동 사전 로드 (백업)
    const timer = setTimeout(preloadAfterInteraction, 5000);
    
    return () => {
      // 컴포넌트 언마운트 시 정리
      clearTimeout(timer);
      window.removeEventListener('mousemove', preloadOnIdle);
      window.removeEventListener('scroll', preloadOnIdle);
      window.removeEventListener('keydown', preloadOnIdle);
    };
  }, []);
  
  // UI 렌더링 없음
  return null;
} 
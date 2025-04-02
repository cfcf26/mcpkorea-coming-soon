// Google Tag Manager 이벤트 처리를 위한 유틸리티

// GTM 데이터 레이어 타입 정의
declare global {
  interface Window {
    dataLayer: any[];
    gtmDidInit: boolean; // GTM 초기화 여부 추적
    gtmQueue: Array<Record<string, any>>; // 이벤트 큐
  }
}

// 이벤트 푸시 함수 - 지연 로딩 및 큐 지원
export const pushEvent = (event: Record<string, any>) => {
  // 브라우저 환경인지 확인
  if (typeof window === 'undefined') return;
  
  // 큐 준비
  window.gtmQueue = window.gtmQueue || [];
  
  // GTM이 아직 초기화되지 않았으면 이벤트를 큐에 추가
  if (!window.gtmDidInit) {
    window.gtmQueue.push(event);
    return;
  }
  
  // GTM이 초기화된 경우 직접 데이터 레이어에 푸시
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
};

// 페이지 뷰 이벤트 - Next.js 라우트 변경 시 호출
export const pageView = (url: string) => {
  pushEvent({
    event: 'pageview',
    page: url,
  });
};

// 사용자 상호작용 이벤트
export const userInteraction = (category: string, action: string, label?: string, value?: number) => {
  pushEvent({
    event: 'user_interaction',
    event_category: category,
    event_action: action,
    event_label: label,
    event_value: value,
  });
};

// Intersection Observer를 사용한 GTM 지연 로드
export const loadGTMWhenVisible = (gtmId: string): void => {
  if (typeof window === 'undefined' || !gtmId) return;
  
  // 이미 초기화된 경우 중복 로드 방지
  if (window.gtmDidInit) return;
  
  // 유저 인터랙션 감지 함수
  const loadGTMOnInteraction = () => {
    // GTM 스크립트 로드
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    
    // 스크립트 로드 완료 이벤트
    script.onload = () => {
      // GTM 초기화 완료 표시
      window.gtmDidInit = true;
      
      // 데이터 레이어 초기화
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      
      // 큐에 있는 이벤트 처리
      if (window.gtmQueue && window.gtmQueue.length > 0) {
        window.gtmQueue.forEach(event => window.dataLayer.push(event));
        window.gtmQueue = []; // 큐 비우기
      }
    };
    
    // DOM에 추가
    document.head.appendChild(script);
    
    // 이벤트 리스너 제거
    window.removeEventListener('scroll', loadGTMOnInteraction);
    window.removeEventListener('mousemove', loadGTMOnInteraction);
    window.removeEventListener('touchstart', loadGTMOnInteraction);
  };
  
  // 유저 상호작용 이벤트에 GTM 로딩 연결
  window.addEventListener('scroll', loadGTMOnInteraction, { passive: true, once: true });
  window.addEventListener('mousemove', loadGTMOnInteraction, { passive: true, once: true });
  window.addEventListener('touchstart', loadGTMOnInteraction, { passive: true, once: true });
  
  // 백업: 5초 후에도 로드되지 않았다면 강제 로드
  setTimeout(loadGTMOnInteraction, 5000);
};

// 이전 방식 (하위 호환성 유지)
export const loadGTM = (gtmId: string): void => {
  // 새로운 방식 호출
  loadGTMWhenVisible(gtmId);
}; 
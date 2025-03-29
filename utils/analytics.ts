/**
 * 이벤트 추적 함수
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Google Analytics나 다른 분석 도구로 이벤트 전송
  // 이 함수는 실제 분석 도구가 설정된 후 구현될 예정
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  } else {
    console.log('이벤트 추적 (개발 모드):', eventName, properties);
  }
};

// 분석용 Window 인터페이스 확장
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: any) => void;
  }
} 
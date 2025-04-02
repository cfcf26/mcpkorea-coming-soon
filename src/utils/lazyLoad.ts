/**
 * 외부 자원을 지연 로드하는 유틸리티 함수
 */

// 스크립트 지연 로드
export const loadScript = (src: string, id?: string, async: boolean = true, defer: boolean = false): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    // 이미 스크립트가 로드된 경우 확인
    if (id && document.getElementById(id)) {
      resolve(document.getElementById(id) as HTMLScriptElement);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    if (id) script.id = id;
    script.async = async;
    script.defer = defer;

    // 로드 이벤트 핸들러
    script.onload = () => {
      resolve(script);
    };

    // 에러 핸들러
    script.onerror = () => {
      reject(new Error(`스크립트 로드 실패: ${src}`));
    };

    // DOM에 추가
    document.head.appendChild(script);
  });
};

// 스타일시트 지연 로드
export const loadStylesheet = (href: string, id?: string): Promise<HTMLLinkElement> => {
  return new Promise((resolve, reject) => {
    // 이미 스타일시트가 로드된 경우 확인
    if (id && document.getElementById(id)) {
      resolve(document.getElementById(id) as HTMLLinkElement);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (id) link.id = id;

    // 로드 이벤트 핸들러
    link.onload = () => {
      resolve(link);
    };

    // 에러 핸들러
    link.onerror = () => {
      reject(new Error(`스타일시트 로드 실패: ${href}`));
    };

    // DOM에 추가
    document.head.appendChild(link);
  });
};

// 인터섹션 옵저버를 사용한 요소 가시성 기반 로딩
export const observeAndLoad = (
  element: HTMLElement, 
  callback: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px', threshold: 0 }
): () => void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // 브라우저가 IntersectionObserver를 지원하지 않으면 바로 실행
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);

  observer.observe(element);

  // 옵저버 해제 함수 반환
  return () => observer.disconnect();
}; 
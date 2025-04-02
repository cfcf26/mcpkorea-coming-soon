// 전역 타입 선언 파일

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  gtmDidInit: boolean;
  gtmQueue: Array<Record<string, any>>;
}

// requestIdleCallback 타입 정의 (일부 브라우저에서 지원하지 않을 수 있음)
interface RequestIdleCallbackOptions {
  timeout: number;
}

interface RequestIdleCallbackDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

interface Window {
  requestIdleCallback: (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: RequestIdleCallbackOptions
  ) => number;
  cancelIdleCallback: (handle: number) => void;
} 
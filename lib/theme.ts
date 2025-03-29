// 테마 관련 설정 및 유틸리티 함수

// 테마 이름
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// 시스템 테마 감지 함수
export const getSystemTheme = (): string => {
  if (typeof window === 'undefined') return THEMES.DARK; // 서버 사이드에서는 다크 모드 기본값
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}; 
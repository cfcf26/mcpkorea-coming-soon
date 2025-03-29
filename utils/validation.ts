/**
 * 이메일 유효성 검사 함수
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * 입력값 정제 함수 - HTML 태그 및 스크립트 제거
 */
export const sanitizeInput = (input: string): string => {
  // HTML 태그 및 스크립트 제거
  return input.replace(/<[^>]*>?/gm, '');
}; 
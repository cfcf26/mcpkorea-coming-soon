/**
 * 날짜 문자열을 포맷팅하는 함수
 * @param dateString ISO 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: 2023년 4월 1일)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 없음';
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '날짜 없음';
  }
}

/**
 * 날짜를 ISO 8601 형식으로 포맷팅하는 함수
 * @param dateString 날짜 문자열
 * @returns ISO 형식 날짜 문자열
 */
export function formatDateISO(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

/**
 * 날짜가 최근인지 확인하는 함수 (30일 이내)
 * @param dateString 날짜 문자열
 * @returns 최근 날짜 여부
 */
export function isRecentDate(dateString: string, days: number = 30): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= days;
  } catch (error) {
    return false;
  }
} 
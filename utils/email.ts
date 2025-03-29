import { supabase } from '../lib/supabase';

/**
 * 이메일 구독 저장 함수
 */
export async function saveEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email, subscribed_at: new Date() }]);
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('이메일 저장 오류:', error);
    return { success: false, error };
  }
}

/**
 * PDF 전송 요청 함수
 */
export async function sendPdf(email: string) {
  try {
    const response = await fetch('/api/send-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
    
    return { success: true, data };
  } catch (error) {
    console.error('PDF 전송 요청 오류:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
    };
  }
} 
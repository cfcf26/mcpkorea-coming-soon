import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateEmail, sanitizeInput } from '../../../../utils/validation';

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 이메일 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 입력값 정제
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    
    // Supabase 클라이언트 초기화
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // 이메일 구독자 테이블에 추가
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ 
        email: sanitizedEmail, 
        subscribed_at: new Date().toISOString(),
        is_verified: false,
        metadata: { source: 'landing_page' }
      }]);
    
    if (error) {
      // 이미 구독한 사용자 처리
      if (error.code === '23505') { // 중복 키 오류
        return NextResponse.json(
          { success: true, message: '이미 구독 중인 이메일입니다.', data },
          { status: 200 }
        );
      }
      
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: '구독이 완료되었습니다.',
      data
    });
    
  } catch (error) {
    console.error('구독 오류:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 
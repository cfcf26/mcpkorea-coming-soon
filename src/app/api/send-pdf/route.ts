import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    
    // Supabase 클라이언트 초기화
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // PDF 문서 URL 생성 (실제 구현에서는 스토리지에서 서명된 URL을 생성)
    // 현재는 더미 URL을 반환
    const pdfUrl = "https://example.com/pdf/mcp-guide.pdf";
    
    // 이메일 전송 (실제 이메일 발송 서비스를 구현해야 함)
    // 이 예제에서는 이메일 전송 성공을 가정
    
    console.log(`PDF 전송 요청: ${email}`);
    
    return NextResponse.json({
      success: true,
      message: `${email}로 PDF가 전송되었습니다.`,
      data: {
        email,
        pdfUrl
      }
    });
    
  } catch (error) {
    console.error('PDF 전송 오류:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 
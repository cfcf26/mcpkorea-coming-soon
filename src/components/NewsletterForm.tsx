'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!consentChecked) {
      setError('이메일 발송에 동의해야 등록이 가능합니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Attempting to insert email:', email);
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email, 
          nickname: nickname || null,
          created_at: new Date().toISOString(),
          email_consent: consentChecked
        }]);

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }

      setIsSuccess(true);
      setEmail('');
      setNickname('');
      setConsentChecked(false);
    } catch (err: unknown) {
      console.error('Error inserting email:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError(`이메일 등록에 실패했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {isSuccess ? (
        <div className="text-center p-6 bg-green-100 dark:bg-green-900/50 rounded-lg shadow-inner">
          <p className="text-green-700 dark:text-green-300 font-medium">
            등록해 주셔서 감사합니다! MCP 관련 최신 소식을 이메일로 전해드리겠습니다.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-foreground/80">
            대기자 명단에 이메일을 등록하시면 MCP 자료를 매주 순차적으로 보내드립니다.
            </p>
            <p className="text-sm text-foreground/60 mt-1">
              * 언제든지 구독을 취소할 수 있으며, 개인정보는 안전하게 보호됩니다.
            </p>
            <p className="text-sm text-foreground/60 mt-1">
              * 최신 MCP 기술 동향과 활용 사례도 함께 받아보세요!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요 (필수)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-foreground/10 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-foreground/20"
              required
            />
            <input
              type="text"
              placeholder="닉네임을 입력하세요 (선택)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-foreground/10 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-foreground/20"
            />
            <button
              type="submit"
              disabled={isSubmitting || !consentChecked}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all disabled:opacity-70 hover:shadow-md"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
          
          <div className="flex items-start mt-1">
            <div className="flex items-center h-5">
              <input
                id="email-consent"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4 border border-foreground/20 rounded bg-background focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <label htmlFor="email-consent" className="ml-2 text-sm text-foreground/80">
              MCP 뉴스레터 및 정보 이메일 수신에 동의합니다. (필수)
            </label>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </form>
      )}
    </div>
  );
} 
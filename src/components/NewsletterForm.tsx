'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!email || !email.includes('@')) {
      setError('유효한 이메일을 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) throw error;

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Error inserting email:', err);
      setError('이메일 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {isSuccess ? (
        <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-green-700 dark:text-green-300 font-medium">
            등록해 주셔서 감사합니다! MCP 관련 최신 소식을 이메일로 전해드리겠습니다.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="text-center mb-2">
            <p className="text-foreground/80">
              대기자 명단에 등록하면 MCP 사용법/활용법 뉴스레터를 일주일에 1번 이메일로 받아보실 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-foreground/10 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </form>
      )}
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container, Button, Card } from '../common';
import { saveEmail, sendPdf } from '../../utils/email';
import { trackEvent } from '../../utils/analytics';

// 폼 검증 스키마
const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  consent: z.boolean().refine(val => val === true, {
    message: '개인정보 수집에 동의해주세요',
  }),
});

type FormValues = z.infer<typeof schema>;

const EmailForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      consent: false,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // 이메일 저장
      const saveResult = await saveEmail(data.email);
      
      if (!saveResult.success) {
        throw new Error('이메일 저장 중 오류가 발생했습니다.');
      }
      
      // PDF 전송
      const sendResult = await sendPdf(data.email);
      
      if (!sendResult.success) {
        throw new Error('PDF 전송 중 오류가 발생했습니다.');
      }
      
      // 성공 상태 설정
      setIsSuccess(true);
      reset();
      
      // 이벤트 추적
      trackEvent('email_subscription', { email: data.email });
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      console.error('폼 제출 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="subscribe" className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              MCP 가이드 무료로 받기
            </h2>
            
            {isSuccess ? (
              <div className="text-center p-6 bg-vscode-accent-secondary bg-opacity-10 rounded-md">
                <svg 
                  className="h-16 w-16 mx-auto text-vscode-accent-secondary mb-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-bold mb-2">구독해 주셔서 감사합니다!</h3>
                <p>입력하신 이메일로 MCP 가이드 PDF를 발송했습니다.</p>
                <p className="mt-2 text-sm">메일이 도착하지 않았다면 스팸함을 확인해주세요.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    이메일 주소
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    className={`w-full px-4 py-2 rounded-md bg-vscode-light-bg-secondary dark:bg-vscode-bg-secondary border ${
                      errors.email 
                        ? 'border-vscode-warning focus:ring-vscode-warning' 
                        : 'border-gray-300 dark:border-gray-700 focus:ring-vscode-accent'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-vscode-warning">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-vscode-accent focus:ring-vscode-accent"
                      {...register('consent')}
                      data-testid="terms-checkbox"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="consent" className="font-medium">
                      개인정보 수집 및 이용에 동의합니다
                    </label>
                    <p className="text-vscode-light-text-secondary dark:text-vscode-text-secondary">
                      이메일은 PDF 전송 및 MCP 업데이트 알림에만 사용됩니다.
                    </p>
                    {errors.consent && (
                      <p className="mt-1 text-sm text-vscode-warning">{errors.consent.message}</p>
                    )}
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-vscode-warning bg-opacity-10 border border-vscode-warning rounded-md">
                    <p className="text-sm text-vscode-warning">{errorMessage}</p>
                  </div>
                )}
                
                <div>
                  <Button 
                    type="submit" 
                    fullWidth 
                    disabled={isSubmitting}
                    data-testid="submit-button"
                  >
                    {isSubmitting ? '처리 중...' : 'PDF 가이드 받기'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default EmailForm; 
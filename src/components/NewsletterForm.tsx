'use client';

export default function NewsletterForm() {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/50 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          서비스 준비 중
        </h3>
        <p className="text-blue-700 dark:text-blue-300 font-medium mb-4">
          곧 메인 페이지 업데이트가 진행됩니다.
        </p>
        <p className="text-blue-600 dark:text-blue-400 mb-6">
          카톡방으로 입장해주세요.
        </p>
        <a 
          href="https://open.kakao.com/o/gpxy27nh" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all hover:shadow-md"
        >
          카카오톡 오픈채팅방 참여하기
        </a>
      </div>
    </div>
  );
} 
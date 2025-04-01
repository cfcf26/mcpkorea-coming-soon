import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-foreground/10 mt-auto">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-foreground/60">
            <p>© {new Date().getFullYear()} MCPKorea. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              홈
            </Link>
            <Link 
              href="/blog"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              블로그
            </Link>
            <a 
              href="https://open.kakao.com/o/gpxy27nh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              오픈 카톡방
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
import { BlogPost } from '@/utils/contentful';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  // 포스트 없음
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-foreground/60 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 text-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-medium mb-2">아직 포스트가 없습니다</h3>
        <p>곧 새로운 포스트가 업로드될 예정입니다. 잠시만 기다려주세요.</p>
      </div>
    );
  }

  // 피처드 포스트와 일반 포스트 분류
  const featuredPosts = posts.filter(post => post.fields.featured);
  const regularPosts = posts.filter(post => !post.fields.featured);

  return (
    <div className="space-y-12">
      {/* 피처드 포스트 섹션 (존재하는 경우에만) */}
      {featuredPosts.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">주목할 만한 글</h2>
          <div className="grid grid-cols-1 gap-8">
            {featuredPosts.map(post => (
              <BlogCard key={post.sys.id} post={post} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* 모든 포스트 섹션 */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">최신 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map(post => (
            <BlogCard key={post.sys.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
} 
import Link from 'next/link';
import { BlogPost } from '@/utils/contentful';
import { formatDate, isRecentDate } from '@/utils/date';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const { fields, sys } = post;
  const dateStr = fields.publishDate || sys.createdAt;
  const formattedDate = formatDate(dateStr);
  const isRecent = isRecentDate(dateStr, 7); // 7일 이내 게시물

  // 출력되는 요약 텍스트 길이 제한
  const summaryText = fields.summary
    ? fields.summary.length > 150
      ? `${fields.summary.substring(0, 150)}...`
      : fields.summary
    : '';

  return (
    <Link 
      href={`/blog/${sys.id}`}
      className={`
        block group
        ${featured 
          ? 'bg-foreground/5 hover:bg-foreground/10 p-6 rounded-xl transition overflow-hidden' 
          : 'bg-transparent hover:bg-foreground/5 rounded-lg transition p-4'
        }
      `}
    >
      <article>
        {/* 태그 */}
        {fields.tags && fields.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {fields.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-foreground/10 rounded-full text-foreground/80"
              >
                {tag}
              </span>
            ))}
            {fields.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-foreground/10 rounded-full text-foreground/80">
                +{fields.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 제목 */}
        <h3 className={`font-bold group-hover:text-blue-600 transition-colors ${featured ? 'text-xl mb-3' : 'text-lg mb-2'}`}>
          {fields.title}
          {isRecent && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">New</span>
          )}
        </h3>

        {/* 요약 */}
        {summaryText && (
          <p className={`text-foreground/70 line-clamp-3 ${featured ? 'mb-4' : 'mb-3'}`}>
            {summaryText}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="flex items-center text-sm text-foreground/60">
          <span className="font-medium">{fields.author || 'MCP Korea Team'}</span>
          <span className="mx-2">•</span>
          <time dateTime={dateStr}>{formattedDate}</time>
        </div>
      </article>
    </Link>
  );
} 
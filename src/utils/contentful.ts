import { createClient } from 'contentful';

// Contentful 클라이언트 생성
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// 블로그 포스트 전체 가져오기
export async function getAllBlogPosts() {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    order: '-sys.createdAt',
  });

  return entries.items;
}

// 특정 블로그 포스트 가져오기
export async function getBlogPostBySlug(slug: string) {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  return entries.items[0] || null;
}

// 특정 태그를 가진 블로그 포스트 가져오기
export async function getBlogPostsByTag(tag: string) {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    'fields.tags[in]': tag,
    order: '-sys.createdAt',
  });

  return entries.items;
} 
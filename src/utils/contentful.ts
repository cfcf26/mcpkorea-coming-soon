import { createClient } from 'contentful';

// Contentful 클라이언트 생성
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// 프리뷰 클라이언트 (초안을 위한 클라이언트)
export const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
  host: 'preview.contentful.com',
});

// 환경에 따라 적절한 클라이언트 선택
export const getClient = (preview: boolean = false) => {
  return preview ? previewClient : contentfulClient;
};

// 블로그 포스트 전체 가져오기
export async function getAllBlogPosts(preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: '-sys.createdAt',
  });

  return entries.items;
}

// 특정 블로그 포스트 가져오기
export async function getBlogPostBySlug(slug: string, preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  return entries.items[0] || null;
}

// 특정 태그를 가진 블로그 포스트 가져오기
export async function getBlogPostsByTag(tag: string, preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags[in]': tag,
    order: '-sys.createdAt',
  });

  return entries.items;
} 
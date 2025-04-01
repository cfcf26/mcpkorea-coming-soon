import { createClient, Entry, EntryCollection } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// 블로그 포스트 인터페이스 정의
export interface BlogPost {
  fields: {
    title: string;
    content?: string | Document;
    summary?: string;
    author?: string;
    publishDate?: string;
    tags?: string[];
    seoTitle?: string;
    featured?: boolean;
    assets?: Record<string, any>; // 미디어 에셋 정보를 위한 필드
    featuredImage?: {
      url: string;
      alt: string;
    };
    [key: string]: unknown;
  };
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
}

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

// Contentful 항목을 BlogPost 타입으로 안전하게 변환하는 함수
function convertEntryToBlogPost(entry: Entry<any>): BlogPost {
  return {
    fields: {
      title: typeof entry.fields.title === 'string' ? entry.fields.title : '',
      content: typeof entry.fields.content === 'string' || 
               (entry.fields.content && typeof entry.fields.content === 'object') ? 
               entry.fields.content : undefined,
      summary: typeof entry.fields.summary === 'string' ? entry.fields.summary : '',
      author: typeof entry.fields.author === 'string' ? entry.fields.author : '',
      publishDate: typeof entry.fields.publishDate === 'string' ? entry.fields.publishDate : '',
      tags: Array.isArray(entry.fields.tags) ? entry.fields.tags : [],
      seoTitle: typeof entry.fields.seoTitle === 'string' ? entry.fields.seoTitle : '',
      featured: typeof entry.fields.featured === 'boolean' ? entry.fields.featured : false
    },
    sys: {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt
    }
  };
}

// 블로그 포스트 전체 가져오기
export async function getAllBlogPosts(preview: boolean = false): Promise<BlogPost[]> {
  try {
    const client = getClient(preview);
    const entries: EntryCollection<any> = await client.getEntries({
      content_type: 'mcpKoreaBlogPost',
      order: '-sys.createdAt',
      include: 10
    });

    return entries.items.map(convertEntryToBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// 특정 블로그 포스트 가져오기 (ID 기반)
export async function getBlogPostById(id: string, preview: boolean = false): Promise<BlogPost | null> {
  try {
    const client = getClient(preview);
    const entry = await client.getEntry(id, { include: 10 });
    return convertEntryToBlogPost(entry);
  } catch (error) {
    console.error('Error fetching entry by ID:', error);
    return null;
  }
}

// 포스트 ID로 블로그 포스트 가져오기 (호환성 유지용)
export async function getBlogPostBySlug(slug: string, preview: boolean = false): Promise<BlogPost | null> {
  return await getBlogPostById(slug, preview);
}

// 특정 태그를 가진 블로그 포스트 가져오기
export async function getBlogPostsByTag(tag: string, preview: boolean = false): Promise<BlogPost[]> {
  try {
    const client = getClient(preview);
    const entries: EntryCollection<any> = await client.getEntries({
      content_type: 'mcpKoreaBlogPost',
      'fields.tags[in]': tag,
      order: '-sys.createdAt',
      include: 10
    });

    return entries.items.map(convertEntryToBlogPost);
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
} 
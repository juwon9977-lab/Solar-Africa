export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  readMinutes: number;
}

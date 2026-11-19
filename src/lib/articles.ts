import { getCollection, render, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

export interface EnrichedArticle {
  entry: ArticleEntry;
  slug: string;
  readingTime: string;
  minutesRead: number;
  wordCount: number;
  diagramCount: number;
}

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getEnrichedArticles(): Promise<EnrichedArticle[]> {
  const entries = await getPublishedArticles();
  return Promise.all(
    entries.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        entry,
        slug: entry.id,
        readingTime: (remarkPluginFrontmatter.readingTime as string) || '5 min read',
        minutesRead: (remarkPluginFrontmatter.minutesRead as number) || 5,
        wordCount: (remarkPluginFrontmatter.wordCount as number) || 0,
        diagramCount: (remarkPluginFrontmatter.diagramCount as number) || 0,
      };
    })
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

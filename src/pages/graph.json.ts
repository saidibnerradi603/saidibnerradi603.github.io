import type { APIRoute } from 'astro';
import { getEnrichedArticles, slugifyTag, formatDate } from '../lib/articles';

export interface GraphNode {
  id: string;
  type: 'article' | 'category' | 'tag';
  label: string;
  url: string;
  description?: string;
  category?: string;
  readingTime?: string;
  diagramCount?: number;
  date?: string;
  degree: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'category' | 'tag' | 'related';
}

export const GET: APIRoute = async () => {
  const articles = await getEnrichedArticles();

  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const linkSet = new Set<string>();
  const articleSlugs = new Set(articles.map((a) => a.slug));

  const addLink = (source: string, target: string, type: GraphLink['type']) => {
    if (source === target) return;
    const key = [source, target].sort().join('::') + '::' + type;
    if (linkSet.has(key)) return;
    linkSet.add(key);
    links.push({ source, target, type });
  };

  for (const item of articles) {
    const { entry, slug, readingTime, diagramCount } = item;
    const articleId = `article:${slug}`;

    nodesMap.set(articleId, {
      id: articleId,
      type: 'article',
      label: entry.data.title,
      url: `/articles/${slug}`,
      description: entry.data.description,
      category: entry.data.category,
      readingTime,
      diagramCount,
      date: formatDate(entry.data.publishedAt),
      degree: 0,
    });

    // Category hub node
    const catSlug = slugifyTag(entry.data.category);
    const catId = `category:${catSlug}`;
    if (!nodesMap.has(catId)) {
      nodesMap.set(catId, {
        id: catId,
        type: 'category',
        label: entry.data.category,
        url: `/topics/${catSlug}`,
        degree: 0,
      });
    }
    addLink(articleId, catId, 'category');

    // Tag nodes
    for (const tag of entry.data.tags) {
      const tSlug = slugifyTag(tag);
      const tagId = `tag:${tSlug}`;
      if (!nodesMap.has(tagId)) {
        nodesMap.set(tagId, {
          id: tagId,
          type: 'tag',
          label: tag,
          url: `/topics/${tSlug}`,
          degree: 0,
        });
      }
      addLink(articleId, tagId, 'tag');
    }

    // Explicit frontmatter related slugs
    for (const relSlug of entry.data.related) {
      if (articleSlugs.has(relSlug)) {
        addLink(articleId, `article:${relSlug}`, 'related');
      }
    }

    // Auto-detect internal Markdown links (/articles/<slug>) or [[<slug>]] wiki-links
    const body = entry.body || '';
    const mdLinkRegex = /\/articles\/([a-zA-Z0-9_-]+)/g;
    const wikiLinkRegex = /\[\[([a-zA-Z0-9_-]+)(?:\|[^\]]+)?\]\]/g;

    for (const match of body.matchAll(mdLinkRegex)) {
      const targetSlug = match[1];
      if (articleSlugs.has(targetSlug)) {
        addLink(articleId, `article:${targetSlug}`, 'related');
      }
    }
    for (const match of body.matchAll(wikiLinkRegex)) {
      const targetSlug = match[1];
      if (articleSlugs.has(targetSlug)) {
        addLink(articleId, `article:${targetSlug}`, 'related');
      }
    }
  }

  // Compute node degree for sizing
  for (const link of links) {
    const s = nodesMap.get(link.source);
    const t = nodesMap.get(link.target);
    if (s) s.degree += 1;
    if (t) t.degree += 1;
  }

  return new Response(
    JSON.stringify({
      nodes: Array.from(nodesMap.values()),
      links,
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
};

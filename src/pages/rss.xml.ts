import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedArticles } from '../lib/articles';
import { SITE } from '../config/site';

export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();
  return rss({
    title: SITE.name,
    description: SITE.tagline,
    site: context.site || SITE.url,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishedAt,
      description: article.data.description,
      link: `/articles/${article.id}/`,
      categories: [article.data.category, ...article.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}

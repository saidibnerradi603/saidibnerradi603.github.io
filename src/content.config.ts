import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      category: z.enum([
        'Generative AI',
        'Computer Science',
        'Backend',
        'Data Engineering',
        'Notes',
      ]),
      tags: z.array(z.string()).default([]),
      related: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      companionUrl: z.string().url().optional(),
      companionLabel: z.string().optional(),
    }),
});

export const collections = { articles };

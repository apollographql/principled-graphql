import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'zod';

const pages = defineCollection({
  loader: glob({pattern: '*.md', base: './src/content/pages'}),
  schema: z.object({
    path: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number(),
    // Served straight from public/ so raw <img> tags in the prose resolve too.
    image: z.string().optional()
  })
});

export const collections = {pages};

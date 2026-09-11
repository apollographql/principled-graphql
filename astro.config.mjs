// @ts-check
import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {unified} from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// The octicon gatsby-remark-autolink-headers rendered, kept so the anchor
// affordance on each principle looks the way it always has.
const linkIcon = {
  type: 'element',
  tagName: 'svg',
  properties: {
    ariaHidden: 'true',
    focusable: 'false',
    height: 16,
    width: 16,
    version: '1.1',
    viewBox: '0 0 16 16'
  },
  children: [
    {
      type: 'element',
      tagName: 'path',
      properties: {
        fillRule: 'evenodd',
        d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z'
      },
      children: []
    }
  ]
};

export default defineConfig({
  site: 'https://principledgraphql.com',
  integrations: [sitemap()],
  // Heading ids come from Astro's default github-slugger, which reproduces the
  // anchor format the Gatsby site published (e.g. #1-one-graph).  Don't swap it.
  markdown: {
    // rehype plugins need the unified processor; Astro's default (satteri)
    // doesn't run them.
    processor: unified(),
    shikiConfig: {theme: 'github-light'},
    rehypePlugins: [
      // rehype-autolink-headings only annotates headings that already carry an
      // id, and Astro's own slugger runs after user plugins — so slug here.
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {behavior: 'prepend', properties: {class: 'anchor before'}, content: linkIcon}
      ]
    ]
  }
});

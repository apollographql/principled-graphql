// @ts-check
import {defineConfig} from 'astro/config';

export default defineConfig({
  site: 'https://principledgraphql.com',
  // Heading ids come from Astro's default github-slugger, which reproduces the
  // anchor format the Gatsby site published (e.g. #1-one-graph).  Don't swap it.
  markdown: {
    shikiConfig: {theme: 'github-light'}
  }
});

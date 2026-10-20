import type {APIRoute} from 'astro';

// Netlify sets CONTEXT; anything other than a production build is a branch or
// preview deploy on a netlify.app host, which must not be indexed alongside
// the real site.
const isProduction = process.env.CONTEXT === 'production';

export const GET: APIRoute = ({site}) =>
  new Response(
    isProduction
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    {headers: {'Content-Type': 'text/plain; charset=utf-8'}}
  );

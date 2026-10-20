# Principled GraphQL

This website highlights best practices for implementing and scaling a graph.  It's built with [Astro](https://astro.build).

## Developing locally

```bash
npm install
npm start
```

The content lives in `src/content/pages/`.  Each page's URL comes from its `path` frontmatter, and `order` drives the sidebar and the prev/next links.

Every `##` heading is a principle, and the blockquote directly beneath it is the summary shown in the sidebar and on the overview page — so keep that pairing intact when editing.

## Deploying

`master` deploys to production via [Netlify](https://netlify.com) on every commit.  Build settings live in `netlify.toml`.

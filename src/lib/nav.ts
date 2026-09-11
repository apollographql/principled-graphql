import {getCollection, type CollectionEntry} from 'astro:content';

export type Section = {
  path: string;
  title: string;
  description: string;
};

export type Chapter = {
  path: string;
  title: string;
  description: string;
  image?: string;
  sections: Section[];
};

/**
 * Each `##` heading is a principle, and the blockquote directly beneath it is
 * its one-line summary.  Both the sidebar and the overview page's chapter list
 * are built from those pairs, so they stay in sync with the prose.
 */
function sectionsOf(entry: CollectionEntry<'pages'>): Section[] {
  const sections: Section[] = [];
  const lines = entry.body?.split('\n') ?? [];

  lines.forEach((line, i) => {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (!heading) return;

    const title = heading[1];
    const quote = lines
      .slice(i + 1, i + 4)
      .find(candidate => candidate.startsWith('>'));

    sections.push({
      path: `${entry.data.path}#${slug(title)}`,
      title,
      description: quote ? quote.replace(/^>\s*/, '').replace(/\*/g, '') : ''
    });
  });

  return sections;
}

/** Mirrors Astro's own heading ids (github-slugger) so anchors line up. */
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function getPages(): Promise<CollectionEntry<'pages'>[]> {
  const pages = await getCollection('pages');
  return pages.sort((a, b) => a.data.order - b.data.order);
}

/** The numbered chapters — everything except the overview page. */
export async function getChapters(): Promise<Chapter[]> {
  const pages = await getPages();
  return pages
    .filter(page => page.data.order > 0)
    .map(page => ({
      path: page.data.path,
      title: page.data.title ?? '',
      description: page.data.description ?? '',
      image: page.data.image,
      sections: sectionsOf(page)
    }));
}

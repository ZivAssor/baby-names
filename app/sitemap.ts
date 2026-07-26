import type { MetadataRoute } from 'next';
import { FIRST_YEAR, GROUPS, groupPath, LAST_YEAR, letterPath, namePath, SITE_URL } from '@/lib/constants';
import { allNames, letterIndex } from '@/lib/data';
import { STORIES } from '@/lib/stories';

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    ...GROUPS.filter((g) => g !== 'jewish').map((g) => ({
      url: `${SITE_URL}${groupPath(g)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/names`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/boys`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/girls`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/unisex`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/rare`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/trending`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/years`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/stories`, changeFrequency: 'monthly', priority: 0.8 },
    ...STORIES.map(({ slug }) => ({
      url: `${SITE_URL}/stories/${encodeURIComponent(slug)}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => ({
      url: `${SITE_URL}/year/${FIRST_YEAR + i}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.6 },
    ...letterIndex().map(({ letter }) => ({
      url: `${SITE_URL}${letterPath(letter)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  const names: MetadataRoute.Sitemap = allNames().map(({ name }) => ({
    url: `${SITE_URL}${namePath(name)}`,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...core, ...names];
}

import type { MetadataRoute } from 'next';
import { GROUPS, groupPath, letterPath, namePath, SITE_URL } from '@/lib/constants';
import { allNames, letterIndex } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    ...GROUPS.filter((g) => g !== 'jewish').map((g) => ({
      url: `${SITE_URL}${groupPath(g)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/names`, changeFrequency: 'monthly', priority: 0.8 },
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

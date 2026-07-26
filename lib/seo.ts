import type { Metadata } from 'next';
import { SITE_NAME } from './constants';

/**
 * Page-level metadata with a complete OpenGraph block. Next.js merges metadata
 * shallowly per top-level key: a page that sets `openGraph` at all replaces the
 * layout's entire openGraph object (and og:title does NOT fall back to the page
 * title), so every page builds the full block through this helper.
 */
export function pageMetadata({
  title,
  description,
  canonical,
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'he_IL',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

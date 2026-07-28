import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  ...pageMetadata({
    title: `כמה אנשים בישראל נושאים את השם שלכם? | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    canonical: '/',
  }),
  title: { absolute: `כמה אנשים בישראל נושאים את השם שלכם? | ${SITE_NAME}` },
};

export default function HomePage() {
  return <HomeView group="jewish" />;
}

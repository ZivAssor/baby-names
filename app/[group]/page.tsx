import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';
import { GROUP_LABELS, GROUPS, SITE_NAME, type Group } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

// Jewish is the site root; the other groups get their own path.
const SUBPAGE_GROUPS = GROUPS.filter((g) => g !== 'jewish');

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBPAGE_GROUPS.map((group) => ({ group }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}): Promise<Metadata> {
  const { group } = await params;
  const label = GROUP_LABELS[group as Group];
  return pageMetadata({
    title: `שמות ${label}`,
    description: `השמות הנפוצים והנדירים בקרב ${label} בישראל, מגמות לאורך השנים והתפלגות בין בנים לבנות - על בסיס נתוני הלמ״ס 1949-2024. | ${SITE_NAME}`,
    canonical: `/${group}`,
  });
}

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  return <HomeView group={group as Group} />;
}

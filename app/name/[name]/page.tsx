import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NameCharts from '@/components/name/NameCharts';
import {
  GROUP_LABELS,
  letterPath,
  namePath,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants';
import { getNameDetail, getSearchIndex, relatedNames } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';
import { nameFacts, nameMetaDescription } from '@/lib/text';

// Prerender the 6,000 most common names (nearly all human traffic); the rare
// long tail renders on first visit and stays cached until the next deploy.
// Full prerendering of all ~20k names crashes Vercel's deployment pipeline
// ("Maximum call stack size exceeded" post-build), and on-demand-heavy setups
// burn the free ISR-write quota when crawlers walk the sitemap after every
// deploy - so: big static head, small dynamic tail, and deploy sparingly.
export const dynamicParams = true;

export function generateStaticParams() {
  return getSearchIndex()
    .slice(0, 6000)
    .map(([name]) => ({ name }));
}

async function detailFromParams(params: Promise<{ name: string }>) {
  const { name } = await params;
  let decoded: string;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    return null;
  }
  return getNameDetail(decoded.trim());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const detail = await detailFromParams(params);
  if (!detail) return { title: 'שם לא נמצא' };
  return pageMetadata({
    title: `כמה אנשים נושאים את השם ${detail.name}?`,
    description: nameMetaDescription(detail),
    canonical: namePath(detail.name),
  });
}

export default async function NamePage({ params }: { params: Promise<{ name: string }> }) {
  const detail = await detailFromParams(params);
  if (!detail) notFound();

  const facts = nameFacts(detail);
  const related = relatedNames(detail.name);
  const letter = detail.name[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'כל השמות', item: `${SITE_URL}/names` },
      {
        '@type': 'ListItem',
        position: 3,
        name: detail.name,
        item: `${SITE_URL}${namePath(detail.name)}`,
      },
    ],
  };

  return (
    <article className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="פירורי לחם" className="pb-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          ראשי
        </Link>{' '}
        ›{' '}
        <Link href="/names" className="hover:underline">
          כל השמות
        </Link>{' '}
        ›{' '}
        <Link href={letterPath(letter)} className="hover:underline">
          שמות ב-{letter}
        </Link>{' '}
        › <span className="text-foreground/90">{detail.name}</span>
      </nav>

      <h1 className="pb-1 text-3xl font-bold">השם {detail.name}</h1>
      <p className="pb-4 text-muted-foreground">
        סטטיסטיקות ומגמות על בסיס נתוני הלשכה המרכזית לסטטיסטיקה, 1949-2024
      </p>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">כמה אנשים נושאים את השם {detail.name}?</h2>
        <ul className="list-inside list-disc space-y-1.5 text-foreground">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      <NameCharts detail={detail} />

      <section className="mt-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">שמות בפופולריות דומה</h2>
        <ul className="flex flex-wrap gap-2">
          {related.map(({ name, totalAll }) => (
            <li key={name}>
              <Link
                href={namePath(name)}
                className="inline-block rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-accent hover:text-primary"
              >
                {name}
                <span className="ms-1.5 text-xs text-muted-foreground">{formatNumber(totalAll)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          מקור הנתונים: קובץ השמות הפרטיים של הלמ״ס. קבוצות אוכלוסייה שבהן השם מופיע:{' '}
          {detail.groups.map((g) => GROUP_LABELS[g]).join(', ')}.{' '}
          <Link href="/about" className="text-primary hover:underline">
            על הנתונים והמתודולוגיה
          </Link>
        </p>
      </section>
    </article>
  );
}

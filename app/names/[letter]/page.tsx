import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { namePath, SITE_NAME } from '@/lib/constants';
import { letterIndex, namesByLetter } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';
import { formatNumber } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams() {
  return letterIndex().map(({ letter }) => ({ letter }));
}

async function letterFromParams(params: Promise<{ letter: string }>) {
  const { letter } = await params;
  try {
    return decodeURIComponent(letter);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ letter: string }>;
}): Promise<Metadata> {
  const letter = await letterFromParams(params);
  return pageMetadata({
    title: `שמות שמתחילים באות ${letter}`,
    description: `כל השמות הפרטיים בישראל שמתחילים באות ${letter}, מסודרים לפי פופולריות - עם סטטיסטיקות מלאות לכל שם. | ${SITE_NAME}`,
    canonical: `/names/${encodeURIComponent(letter ?? '')}`,
  });
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ letter: string }>;
}) {
  const letter = await letterFromParams(params);
  if (!letter) notFound();
  const names = namesByLetter(letter);
  if (names.length === 0) notFound();

  return (
    <div className="py-4">
      <nav aria-label="פירורי לחם" className="pb-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          ראשי
        </Link>{' '}
        ›{' '}
        <Link href="/names" className="hover:underline">
          כל השמות
        </Link>{' '}
        › <span className="text-foreground/90">האות {letter}</span>
      </nav>
      <h1 className="pb-1 text-3xl font-bold">שמות שמתחילים באות {letter}</h1>
      <p className="pb-4 text-muted-foreground">
        {formatNumber(names.length)} שמות, מסודרים לפי מספר בעלי השם בישראל.
      </p>
      <section className="rounded-xl border border-border bg-card shadow-sm p-6">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {names.map(({ name, totalAll }) => (
            <li key={name}>
              <Link href={namePath(name)} className="text-foreground/90 hover:text-primary hover:underline">
                {name}
              </Link>
              <span className="ms-1.5 text-xs text-muted-foreground">{formatNumber(totalAll)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

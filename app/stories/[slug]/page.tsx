import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButton from '@/components/ShareButton';
import StoryChart from '@/components/story/StoryChart';
import { namePath, SITE_NAME, SITE_URL } from '@/lib/constants';
import { getNameDetail } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';
import { getStory, STORIES } from '@/lib/stories';

export const dynamicParams = false;

export function generateStaticParams() {
  return STORIES.map(({ slug }) => ({ slug }));
}

async function storyFromParams(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  try {
    return getStory(decodeURIComponent(slug));
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const story = await storyFromParams(params);
  if (!story) return { title: 'סיפור לא נמצא' };
  return pageMetadata({
    title: story.title,
    description: story.hook,
    canonical: `/stories/${encodeURIComponent(story.slug)}`,
  });
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = await storyFromParams(params);
  if (!story) notFound();

  const detail = getNameDetail(story.name);
  const series = detail?.series.find((s) => s.group === story.group && s.gender === story.gender);
  if (!detail || !series) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.hook,
    inLanguage: 'he',
    author: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/stories/${encodeURIComponent(story.slug)}`,
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
        <Link href="/stories" className="hover:underline">
          סיפורי שמות
        </Link>{' '}
        › <span className="text-foreground/90">{story.name}</span>
      </nav>

      <h1 className="pb-2 text-3xl font-bold">{story.title}</h1>
      <p className="pb-3 text-lg text-muted-foreground">{story.hook}</p>
      <div className="pb-4">
        <ShareButton
          shareText={`${story.hook} הסיפור המלא:`}
          path={`/stories/${encodeURIComponent(story.slug)}`}
        />
      </div>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <StoryChart
          name={story.name}
          gender={story.gender}
          counts={series.counts}
          eventYear={story.eventYear}
          eventLabel={story.eventLabel}
        />
      </section>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        {story.paragraphs.map((p) => (
          <p key={p.slice(0, 30)} className="mb-3 leading-relaxed text-foreground">
            {p}
          </p>
        ))}
        <p className="mt-4 text-sm text-muted-foreground">
          חשוב לומר: נתוני שמות מראים מתאם בין אירועים תרבותיים לבחירות של הורים - לא הוכחה
          לסיבתיות. הנתונים עצמם רשמיים ומדויקים (למ״ס), הפרשנות היא שלנו.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={namePath(story.name)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          לעמוד המלא של השם {story.name} ←
        </Link>
        <Link
          href="/stories"
          className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-accent"
        >
          לכל סיפורי השמות
        </Link>
      </div>

      <section className="mt-6 text-sm text-muted-foreground">
        <h2 className="mb-1 font-semibold text-muted-foreground">מקורות</h2>
        <ul className="list-inside list-disc">
          <li>הלשכה המרכזית לסטטיסטיקה - קובץ השמות הפרטיים 1949-2024</li>
          {story.sources.map(({ label, url }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

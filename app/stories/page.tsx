import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';
import { STORIES } from '@/lib/stories';

export const metadata: Metadata = pageMetadata({
  title: 'סיפורי שמות - כשהתרבות פוגשת את חדר הלידה',
  description: `מה עשה זוהר ארגוב לשם אלינור? איך בת הים הקטנה שינתה את אריאל? סיפורים אמיתיים מנתוני השמות של ישראל. | ${SITE_NAME}`,
  canonical: '/stories',
});

export default function StoriesIndexPage() {
  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">סיפורי שמות</h1>
      <p className="pb-4 text-muted-foreground">
        להיט רדיו, סרט של דיסני או רגע לאומי - לפעמים אפשר לראות את התרבות הישראלית בתוך נתוני
        השמות. כל סיפור כאן מגובה בנתונים אמיתיים של הלמ״ס.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {STORIES.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${encodeURIComponent(story.slug)}`}
            className="block rounded-xl border border-border bg-card shadow-sm p-6 transition-shadow hover:shadow-md"
          >
            <p className="mb-1 text-sm font-semibold text-primary">{story.eventYear}</p>
            <h2 className="mb-2 text-xl font-bold">{story.title}</h2>
            <p className="text-muted-foreground">{story.hook}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

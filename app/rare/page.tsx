import type { Metadata } from 'next';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import { GENDER_LABELS, LAST_YEAR, namePath, SITE_NAME, SITE_URL, type Gender } from '@/lib/constants';
import { rareNames, siteTotals } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

// Search Console (14d to 2026-07-26) shows two separate rare-name intents:
// "how rare is MY name" (~370 impressions, homepage answers it, position ~2.6)
// and the browse list - "שמות נדירים", "השמות הכי נדירים בישראל" (~150
// impressions, position ~7.5). The browse queries were landing on the homepage
// because this page was 60 names and five sentences; it took 18 impressions in
// 90 days. The sections below give each browse phrasing its own heading.
export const metadata: Metadata = pageMetadata({
  title: 'שמות נדירים בישראל - השמות הכי נדירים לבנים ולבנות',
  description:
    'רשימת השמות הנדירים בישראל מנתוני הלמ״ס - שמות שעד 30 תושבים נושאים, בנפרד לבנים ולבנות. כמה נדיר השם שלכם? יש עמוד לכל שם. | ' +
    SITE_NAME,
  canonical: '/rare',
});

// rareNames() walks the whole directory whatever the limit, so asking for all
// of them costs the same as asking for 60 and lets the copy below quote exact
// counts instead of hedging.
const ALL = 100_000;
const HEADLINE_COUNT = 48;
const PER_GENDER = 36;

const GENDER_TAG: Record<string, string> = {
  m: GENDER_LABELS.m,
  f: GENDER_LABELS.f,
  both: 'בנים ובנות',
};

function NameGrid({
  names,
  showGender = false,
}: {
  names: { name: string; totalAll: number; gender: Gender | 'both' }[];
  showGender?: boolean;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
      {names.map(({ name, totalAll, gender }) => (
        <li key={name}>
          <Link href={namePath(name)} className="text-foreground hover:text-primary hover:underline">
            {name}
          </Link>
          <span className="ms-1.5 text-xs text-muted-foreground">
            {formatNumber(totalAll)}
            {showGender ? ` · ${GENDER_TAG[gender]}` : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RarePage() {
  const pool = rareNames(ALL);
  const totals = siteTotals();
  // The pool is sorted by total ascending, so pool[0] sets the floor - the
  // smallest number of bearers that still appears in the CBS file at all.
  const floor = pool.length > 0 ? pool[0].totalAll : 5;
  // Headline list is exactly the names AT the floor, so "only N bearers each"
  // is true of every name shown rather than only of the first few.
  const atFloor = pool.filter((n) => n.totalAll === floor);
  const headline = atFloor.slice(0, HEADLINE_COUNT);
  const girls = pool.filter((n) => n.gender === 'f' || n.gender === 'both').slice(0, PER_GENDER);
  const boys = pool.filter((n) => n.gender === 'm' || n.gender === 'both').slice(0, PER_GENDER);

  const faq = [
    {
      q: 'מהו השם הכי נדיר בישראל?',
      a: `אין תשובה אחת. יש בישראל ${formatNumber(atFloor.length)} שמות שעדיין בשימוש ושאת כל אחד מהם נושאים ${formatNumber(floor)} תושבים בלבד, וכולם נדירים באותה מידה. שמות שפחות מ-5 תושבים נושאים אותם אינם נכללים בקובץ הלמ״ס כלל, כך שהנדירים באמת אינם מופיעים בשום רשימה ציבורית.`,
    },
    {
      q: 'כמה השם שלי נדיר?',
      a: 'לכל אחד מכ-20,000 השמות באתר יש עמוד משלו עם המספר המדויק של נושאי השם בישראל, הפילוח לבנים ולבנות והשנים שבהן ניתן. חפשו את השם בתיבת החיפוש כדי לראות את הנתונים שלו.',
    },
    {
      q: 'איך נבחרו השמות שברשימה?',
      a: `הרשימה כוללת שמות שעד 30 תושבי ישראל נושאים בסך הכול, ושניתנו לפחות פעם אחת ב-15 השנים האחרונות (${LAST_YEAR - 14}-${LAST_YEAR}). שמות נדירים שיצאו מכלל שימוש אינם מופיעים כאן.`,
    },
    {
      q: 'למה יש קטעים חסרים בגרף של שם נדיר?',
      a: 'הלמ״ס מסתירה מטעמי פרטיות ספירות שנתיות של 1 עד 4. בגרפים באתר שנים כאלה מוצגות כקטע חסר, ובטבלאות כטווח 1-4 או כחסם תחתון - לעולם לא כאפס ולא כמספר מדויק. בשמות נדירים זה קורה כמעט בכל שנה שבה השם ניתן.',
    },
    {
      q: 'אפשר לבדוק כמה נדיר שם המשפחה שלי?',
      a: 'לא - האתר מכסה שמות פרטיים בלבד. קובץ השמות שהלמ״ס מפרסמת אינו כולל שמות משפחה, ולכן אין באתר נתונים על נדירות של שמות משפחה.',
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'שמות נדירים', item: `${SITE_URL}/rare` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <div className="py-4">
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <h1 className="pb-1 text-3xl font-bold">שמות נדירים בישראל</h1>
      <p className="pb-3 text-muted-foreground">
        את כל אחד מהשמות ברשימה נושאים עד 30 תושבי ישראל בסך הכול - אבל כולם היו בשימוש ב-15 השנים
        האחרונות, כך שאלה שמות חיים ולא שמות שנעלמו. מתוך {formatNumber(totals.names)} השמות
        בקובץ השמות הפרטיים של הלשכה המרכזית לסטטיסטיקה, {formatNumber(pool.length)} עונים
        להגדרה הזאת.
      </p>
      <div className="pb-4">
        <ShareButton
          shareText="שמות נדירים בישראל - השמות שכמעט אף אחד לא נושא, מנתוני הלמ״ס 👶"
          path="/rare"
        />
      </div>

      <section className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-xl font-bold">השמות הכי נדירים בישראל</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {formatNumber(floor)} תושבים בלבד נושאים כל אחד מהשמות האלה. המספר לצד כל שם הוא סך
          נושאי השם בישראל כיום.
        </p>
        <NameGrid names={headline} showGender />
      </section>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-pink-600">שמות נדירים לבנות</h2>
          <NameGrid names={girls} />
        </section>
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-blue-600">שמות נדירים לבנים</h2>
          <NameGrid names={boys} />
        </section>
      </div>

      <section className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">שאלות על שמות נדירים</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold text-foreground">{q}</dt>
              <dd className="text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-muted-foreground">
        מעדיפים דווקא את הבטוח?{' '}
        <Link href="/top-names" className="text-primary hover:underline">
          השמות הפופולריים בישראל
        </Link>{' '}
        ·{' '}
        <Link href="/boys" className="text-primary hover:underline">
          שמות לבנים
        </Link>{' '}
        ·{' '}
        <Link href="/girls" className="text-primary hover:underline">
          שמות לבנות
        </Link>{' '}
        ·{' '}
        <Link href="/unisex" className="text-primary hover:underline">
          שמות יוניסקס
        </Link>{' '}
        ·{' '}
        <Link href="/names" className="text-primary hover:underline">
          כל השמות לפי א״ב
        </Link>
      </p>
    </div>
  );
}

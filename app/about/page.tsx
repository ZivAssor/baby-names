import type { Metadata } from 'next';
import Link from 'next/link';
import { FIRST_YEAR, GROUP_LABELS, GROUPS, LAST_YEAR, SITE_NAME, SITE_URL } from '@/lib/constants';
import { getMeta, groupStats, siteTotals } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';
import { formatNumber } from '@/lib/format';

export const metadata: Metadata = pageMetadata({
  title: 'על הנתונים והמתודולוגיה',
  description: `מאיפה מגיעים הנתונים על שמות פרטיים בישראל, איך מטופלים ערכים מוסתרים של הלמ״ס, ומה בדיוק אפשר ללמוד מהם. | ${SITE_NAME}`,
  canonical: '/about',
});

const FAQ = [
  {
    q: 'מאיפה מגיעים הנתונים?',
    a: `הנתונים מבוססים על קובץ "השמות הנוכחיים של ילידי ${FIRST_YEAR}–${LAST_YEAR}" שמפרסמת הלשכה המרכזית לסטטיסטיקה (למ״ס). הקובץ מפרט, לכל שם פרטי, כמה מתושבי ישראל שנולדו בכל שנה נושאים את השם — בחלוקה למגדר ולקבוצת אוכלוסייה.`,
  },
  {
    q: 'למה יש שנים בלי נתון לשם מסוים?',
    a: 'כאשר פחות מ-5 נולדים בשנה מסוימת קיבלו שם, הלמ״ס מסתירה את הערך מטעמי צנעת הפרט. באתר אנחנו מסמנים שנים כאלה כחסרות (ולא כאפס), ומציינים ליד סכומים חלקיים שמדובר בערך מינימלי.',
  },
  {
    q: 'למה הסך הכולל של שם גדול מסכום השנים בגרף?',
    a: `שתי סיבות: ראשית, שנים מוסתרות (פחות מ-5) אינן נכללות בסכום הגלוי. שנית, הסך הכולל של הלמ״ס כולל גם תושבים שנולדו לפני ${FIRST_YEAR} — למשל עולים שנולדו בחו״ל — שאין להם עמודת שנה בקובץ.`,
  },
  {
    q: 'האם הנתונים כוללים את כל תושבי ישראל?',
    a: 'הנתונים כוללים את מי שרשומים במרשם האוכלוסין נכון למועד פרסום הקובץ, בחלוקה לקבוצות האוכלוסייה: יהודים, מוסלמים, נוצרים ערבים ודרוזים. שמות נדירים מאוד (פחות מ-5 בעלי שם בסך הכול) אינם מופיעים בקובץ כלל.',
  },
  {
    q: 'באיזו תדירות מתעדכנים הנתונים?',
    a: 'הלמ״ס מפרסמת את קובץ השמות אחת לשנה בערך. האתר מתעדכן עם פרסום קובץ חדש.',
  },
];

export default function AboutPage() {
  const meta = getMeta();
  const totals = siteTotals();

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `שמות פרטיים בישראל ${FIRST_YEAR}–${LAST_YEAR}`,
    description: meta.sourceDescription,
    url: `${SITE_URL}/about`,
    inLanguage: 'he',
    creator: {
      '@type': 'GovernmentOrganization',
      name: 'הלשכה המרכזית לסטטיסטיקה',
      url: 'https://www.cbs.gov.il',
    },
    temporalCoverage: `${FIRST_YEAR}/${LAST_YEAR}`,
    spatialCoverage: { '@type': 'Country', name: 'ישראל' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="pb-4 text-3xl font-bold">על הנתונים והמתודולוגיה</h1>

      <section className="mb-4 rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-xl font-bold">מקור הנתונים</h2>
        <p className="mb-2">
          כל הנתונים באתר מבוססים על קובץ השמות הפרטיים הרשמי של{' '}
          <a
            href="https://www.cbs.gov.il/he/Pages/search/TableMaps.aspx?CbsSubject=שמות"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            הלשכה המרכזית לסטטיסטיקה
          </a>
          : ״{meta.sourceDescription}״.
        </p>
        <p className="mb-2">
          הקובץ מכסה את ילידי {FIRST_YEAR}–{LAST_YEAR} וכולל {formatNumber(totals.names)} שמות
          ייחודיים של כ-{formatNumber(totals.people)} תושבים, בחלוקה למגדר ולארבע קבוצות
          אוכלוסייה: {GROUPS.map((g) => GROUP_LABELS[g]).join(', ')}.
        </p>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          {GROUPS.map((g) => {
            const s = groupStats(g);
            return (
              <li key={g}>
                {GROUP_LABELS[g]}: {formatNumber(s.boyNames)} שמות בנים,{' '}
                {formatNumber(s.girlNames)} שמות בנות
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mb-4 rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-xl font-bold">איך אנחנו מטפלים בערכים מוסתרים</h2>
        <p className="mb-2">
          כשפחות מ-5 נולדים קיבלו שם בשנה מסוימת, הלמ״ס מסתירה את הערך (מסומן ״..״ בקובץ
          המקורי). באתר:
        </p>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          <li>שנים מוסתרות מוצגות בגרפים כקטעים חסרים — לא כאפס.</li>
          <li>
            בסכומים על פני טווח שנים, שנה מוסתרת נספרת כ-1 לפחות, והסכום מסומן ב-+ כערך
            מינימלי.
          </li>
          <li>
            ״הסך הכולל״ של שם הוא המספר הרשמי של הלמ״ס, שכולל גם את השנים המוסתרות וגם תושבים
            שנולדו לפני {FIRST_YEAR}.
          </li>
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-xl font-bold">שאלות נפוצות</h2>
        <dl className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold">{q}</dt>
              <dd className="text-gray-700">{a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-gray-500">
          יש שאלה שלא עניתי עליה?{' '}
          <Link href="/" className="text-blue-700 hover:underline">
            חזרה לדשבורד הראשי
          </Link>
        </p>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { FIRST_YEAR, LAST_YEAR } from '@/lib/constants';

export default function DataInfoCard() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">כמה מילים על הדאטה</h2>
      <p className="mb-2 text-base">
        האתר מציג נתונים על שמות פרטיים של תושבי ישראל שנולדו בין {FIRST_YEAR} ל-{LAST_YEAR},
        בכל קבוצות האוכלוסייה: יהודים, מוסלמים, נוצרים ערבים ודרוזים.
      </p>
      <p className="mb-2 text-base">
        המידע מבוסס על קובץ השמות הפרטיים שמפרסמת הלשכה המרכזית לסטטיסטיקה, וניתן להוריד אותו{' '}
        <a
          href="https://www.cbs.gov.il/he/Pages/search/TableMaps.aspx?CbsSubject=שמות"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          כאן
        </a>
        .
      </p>
      <p className="text-base">
        בשנים שבהן שם ניתן פחות מ-5 פעמים, הלמ״ס מסתירה את הערך מטעמי פרטיות. בניגוד לגרסה
        הקודמת של האתר, אנחנו לא סופרים שנים כאלה כאפס אלא מסמנים אותן בנפרד - פרטים מלאים{' '}
        <Link href="/about" className="text-primary underline hover:text-primary/80">
          בעמוד על הנתונים
        </Link>
        .
      </p>
    </section>
  );
}

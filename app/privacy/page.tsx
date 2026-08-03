import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'מדיניות פרטיות',
  description: `אילו נתונים נאספים בעת גלישה באתר, לאילו מטרות הם משמשים, ואיך אפשר לחסום עוגיות אנליטיקה. | ${SITE_NAME}`,
  canonical: '/privacy',
});

const LAST_UPDATED = '3 באוגוסט 2026';

export default function PrivacyPage() {
  return (
    <article className="py-4">
      <h1 className="pb-4 text-3xl font-bold">מדיניות פרטיות</h1>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">על מה העמוד הזה</h2>
        <p className="mb-2">
          {SITE_NAME} הוא אתר סטטיסטיקה על שמות פרטיים בישראל, המופעל באופן עצמאי על ידי
          אדם פרטי (דרכי יצירת קשר בתחתית העמוד). אין באתר הרשמה, אין טפסים,
          ואיננו מבקשים או אוספים שמות, כתובות דוא״ל או פרטים מזהים אחרים מהמבקרים. השימוש
          באתר אינו כרוך במסירת מידע אישי כלשהו מצדכם.
        </p>
        <p>
          העמוד הזה מפרט אילו נתונים כן נאספים באופן אוטומטי בעת גלישה, לאילו מטרות הם
          משמשים, ומהן האפשרויות והזכויות שלכם.
        </p>
      </section>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">אילו נתונים נאספים בעת גלישה</h2>
        <ul className="list-inside list-disc space-y-2 text-foreground/90">
          <li>
            <strong>נתוני שימוש ללא עוגיות (Vercel Web Analytics):</strong> צפיות בעמודים,
            עמוד מפנה, מדינה, סוג דפדפן ומכשיר. הכלי אינו משתמש בעוגיות, אינו שומר מזהה קבוע
            בדפדפן ואינו מאפשר לעקוב אחרי מבקר בין ימים שונים.
          </li>
          <li>
            <strong>Google Analytics (באמצעות Google Tag Manager):</strong> סטטיסטיקות שימוש
            מצטברות - אילו עמודים נצפים, משך הביקור ומקור ההגעה לאתר. הכלי משתמש בעוגיות
            (כגון _ga) המציבות מזהה אקראי בדפדפן כדי להבחין בין מבקרים ולזהות ביקורים
            חוזרים לאורך זמן. הנתונים מעובדים על
            ידי Google, לרבות בשרתים מחוץ לישראל, בהתאם ל
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              מדיניות הפרטיות של Google
            </a>
            .
          </li>
          <li>
            <strong>לוגים תפעוליים של שרתי האירוח (Vercel):</strong> כמו בכל אתר, כתובת
            ה-IP מעובדת באופן זמני על ידי ספקית האירוח לצורך הצגת העמודים, אבטחה ומניעת
            שימוש לרעה.
          </li>
        </ul>
      </section>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">למה הנתונים משמשים</h2>
        <p className="mb-2">
          מטרה אחת: להבין אילו עמודים ותכנים מעניינים את המבקרים כדי לשפר את האתר. הנתונים
          נצפים ברמה מצטברת בלבד.
        </p>
        <ul className="list-inside list-disc space-y-1 text-foreground/90">
          <li>איננו מזהים מבקרים ספציפיים ואיננו מצליבים נתונים עם מקורות חיצוניים.</li>
          <li>איננו מוכרים או מעבירים מידע לצדדים שלישיים למטרות שיווק.</li>
          <li>אין באתר פרסום ממוקד ואין בניית פרופילים אישיים.</li>
        </ul>
      </section>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">עוגיות ואיך לחסום אותן</h2>
        <p className="mb-2">
          עוגיות האנליטיקה של Google Analytics אינן חיוניות לפעולת האתר, וחסימתן אינה פוגעת
          בגלישה. אפשר:
        </p>
        <ul className="list-inside list-disc space-y-1 text-foreground/90">
          <li>לחסום או למחוק עוגיות דרך הגדרות הפרטיות של הדפדפן.</li>
          <li>לגלוש במצב פרטי (גלישה בסתר), שבו עוגיות נמחקות בסיום הגלישה ולא נשמר מזהה בין ביקורים.</li>
          <li>
            להתקין את{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              התוסף הרשמי של Google לביטול Google Analytics
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">זכויות ופניות</h2>
        <p className="mb-2">
          לפי חוק הגנת הפרטיות, התשמ״א-1981, עומדת לכם זכות עיון, תיקון ומחיקה במידע אישי. מאחר
          שהאתר אינו שומר מידע המזוהה עם מבקר מסוים, בפועל אין בידינו מידע אישי הניתן לשיוך
          אליכם.
        </p>
        <p className="mb-2">
          לכל שאלה או בקשה בנושא פרטיות אפשר לפנות למפעיל האתר דרך עמודי הרשתות החברתיות
          המקושרים בתחתית האתר.
        </p>
        <p className="text-sm text-muted-foreground">
          מדיניות זו עשויה להתעדכן מעת לעת; שינויים יפורסמו בעמוד זה. עדכון אחרון:{' '}
          {LAST_UPDATED}.{' '}
          <Link href="/about" className="text-primary hover:underline">
            עוד על הנתונים והמתודולוגיה
          </Link>
        </p>
      </section>
    </article>
  );
}

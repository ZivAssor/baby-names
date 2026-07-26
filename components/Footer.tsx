import Link from 'next/link';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import CurrentYear from '@/components/CurrentYear';
import { GROUPS, GROUP_LABELS, groupPath, SITE_NAME } from '@/lib/constants';

const SOCIALS = [
  {
    label: 'פייסבוק',
    href: 'https://www.facebook.com/ziv.assor/',
    Icon: FaFacebookSquare,
    hover: 'hover:text-blue-800',
  },
  {
    label: 'אינסטגרם',
    href: 'https://www.instagram.com/ziv_assor/',
    Icon: FaInstagram,
    hover: 'hover:text-purple-500',
  },
  {
    label: 'לינקדאין',
    href: 'https://www.linkedin.com/in/ziv-assor-026012141/',
    Icon: FaLinkedin,
    hover: 'hover:text-blue-600',
  },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="mb-3 text-lg font-bold">{SITE_NAME}</p>
          <p className="text-sm text-gray-600">
            סטטיסטיקות על שמות פרטיים בישראל, על בסיס נתוני הלשכה המרכזית לסטטיסטיקה,
            1949–2024.
          </p>
        </div>
        <nav aria-label="קבוצות אוכלוסייה">
          <p className="mb-3 font-semibold">שמות לפי קבוצת אוכלוסייה</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {GROUPS.map((group) => (
              <li key={group}>
                <Link href={groupPath(group)} className="hover:text-blue-700 hover:underline">
                  שמות {GROUP_LABELS[group]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="מצאו שם">
          <p className="mb-3 font-semibold">מצאו שם</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>
              <Link href="/boys" className="hover:text-blue-700 hover:underline">
                שמות לבנים
              </Link>
            </li>
            <li>
              <Link href="/girls" className="hover:text-blue-700 hover:underline">
                שמות לבנות
              </Link>
            </li>
            <li>
              <Link href="/unisex" className="hover:text-blue-700 hover:underline">
                שמות יוניסקס
              </Link>
            </li>
            <li>
              <Link href="/rare" className="hover:text-blue-700 hover:underline">
                שמות נדירים
              </Link>
            </li>
            <li>
              <Link href="/years" className="hover:text-blue-700 hover:underline">
                השמות הפופולריים לפי שנה
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="ניווט">
          <p className="mb-3 font-semibold">ניווט</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>
              <Link href="/names" className="hover:text-blue-700 hover:underline">
                כל השמות לפי א״ב
              </Link>
            </li>
            <li>
              <Link href="/trending" className="hover:text-blue-700 hover:underline">
                מגמות — מזנקים ודועכים
              </Link>
            </li>
            <li>
              <Link href="/stories" className="hover:text-blue-700 hover:underline">
                סיפורי שמות
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-700 hover:underline">
                על הנתונים והמתודולוגיה
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-4 md:flex-row">
        <p className="text-sm text-gray-500">
          © <CurrentYear /> כל הזכויות שמורות.
        </p>
        <div className="flex gap-4 text-gray-700">
          {SOCIALS.map(({ label, href, Icon, hover }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`opacity-80 transition-opacity hover:opacity-100 ${hover}`}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

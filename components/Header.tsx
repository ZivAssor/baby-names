import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:justify-between">
      <Link href="/" className="text-2xl font-bold hover:text-blue-700">
        {SITE_NAME} <span aria-hidden>🇮🇱</span>
      </Link>
      <nav aria-label="ניווט ראשי" className="flex flex-wrap justify-center gap-4 text-gray-700">
        <Link href="/names" className="hover:text-blue-700 hover:underline">
          כל השמות
        </Link>
        <Link href="/trending" className="hover:text-blue-700 hover:underline">
          מגמות
        </Link>
        <Link href="/stories" className="hover:text-blue-700 hover:underline">
          סיפורי שמות
        </Link>
        <Link href="/about" className="hover:text-blue-700 hover:underline">
          על הנתונים
        </Link>
      </nav>
    </header>
  );
}

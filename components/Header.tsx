import Link from 'next/link';
import GlobalSearch from '@/components/GlobalSearch';
import { SITE_NAME } from '@/lib/constants';

const NAV = [
  { href: '/names', label: 'כל השמות' },
  { href: '/trending', label: 'מגמות' },
  { href: '/stories', label: 'סיפורי שמות' },
  { href: '/about', label: 'על הנתונים' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight hover:text-primary">
          {SITE_NAME} <span aria-hidden>🇮🇱</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label="ניווט ראשי" className="hidden gap-4 text-sm font-medium text-foreground/90 md:flex">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="transition-colors hover:text-primary">
                {label}
              </Link>
            ))}
          </nav>
          <GlobalSearch />
        </div>
      </div>
      <nav
        aria-label="ניווט ראשי (מובייל)"
        className="mx-auto flex w-full max-w-7xl gap-4 overflow-x-auto px-4 pb-2 text-sm font-medium text-foreground/90 md:hidden"
      >
        {NAV.map(({ href, label }) => (
          <Link key={href} href={href} className="whitespace-nowrap transition-colors hover:text-primary">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

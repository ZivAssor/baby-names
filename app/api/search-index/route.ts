import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/data';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(getSearchIndex(), {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex',
    },
  });
}

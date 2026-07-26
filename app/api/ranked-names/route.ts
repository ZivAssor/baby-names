import { NextRequest, NextResponse } from 'next/server';
import { FIRST_YEAR, GROUPS, LAST_YEAR, type Group } from '@/lib/constants';
import { rarestNames, topNames } from '@/lib/data';

const HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'X-Robots-Tag': 'noindex',
};

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const group = params.get('group') as Group | null;
  if (!group || !GROUPS.includes(group)) {
    return NextResponse.json({ error: 'invalid group' }, { status: 400 });
  }

  const start = Number(params.get('start'));
  const end = Number(params.get('end'));
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < FIRST_YEAR ||
    end > LAST_YEAR ||
    start > end
  ) {
    return NextResponse.json({ error: 'invalid year range' }, { status: 400 });
  }

  const order = params.get('order') ?? 'top';
  if (order !== 'top' && order !== 'bottom') {
    return NextResponse.json({ error: 'invalid order' }, { status: 400 });
  }

  const rank = order === 'top' ? topNames : rarestNames;
  return NextResponse.json(
    { m: rank(group, 'm', start, end), f: rank(group, 'f', start, end) },
    { headers: HEADERS },
  );
}

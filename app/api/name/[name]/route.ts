import { NextResponse } from 'next/server';
import { getNameDetail } from '@/lib/data';

const HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'X-Robots-Tag': 'noindex',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  let decoded: string;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    return NextResponse.json({ error: 'invalid name' }, { status: 400 });
  }

  const detail = getNameDetail(decoded.trim());
  if (!detail) {
    return NextResponse.json({ error: 'name not found' }, { status: 404 });
  }
  return NextResponse.json(detail, { headers: HEADERS });
}

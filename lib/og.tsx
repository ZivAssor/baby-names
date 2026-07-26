// Shared branding for generated Open Graph images (next/og + satori).
import { ImageResponse } from 'next/og';
import { SITE_NAME } from './constants';

export const OG_SIZE = { width: 1200, height: 630 };

async function loadFont(file: string): Promise<ArrayBuffer> {
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const buffer = await readFile(join(process.cwd(), 'assets', 'fonts', file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

// satori lays out text strictly LTR with no bidi reordering, so Hebrew comes out
// mirrored. Emulate an RTL line: reverse the word order, and reverse the
// characters of Hebrew words only (numbers and Latin stay readable).
const HEBREW = /[֐-׿]/;
function rtlLine(text: string): string {
  return text
    .split(' ')
    .reverse()
    .map((word) => (HEBREW.test(word) ? [...word].reverse().join('') : word))
    .join(' ');
}

export async function ogImage(title: string, subtitleParts: string[]): Promise<ImageResponse> {
  const [regular, bold] = await Promise.all([
    loadFont('Heebo-Regular.ttf'),
    loadFont('Heebo-Bold.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)',
          fontFamily: 'Heebo',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            borderRadius: 24,
            padding: '60px 90px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 84, fontWeight: 700, color: '#1e3a8a', textAlign: 'center' }}>
            {rtlLine(title)}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 14,
              marginTop: 28,
              maxWidth: 950,
            }}
          >
            {subtitleParts.map((part) => (
              <div
                key={part}
                style={{
                  fontSize: 32,
                  color: '#4b5563',
                  background: '#f3f4f6',
                  borderRadius: 999,
                  padding: '10px 26px',
                  whiteSpace: 'nowrap',
                }}
              >
                {rtlLine(part)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#1d4ed8', marginTop: 40 }}>
          {rtlLine(`${SITE_NAME} · babiesil.com`)}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Heebo', data: regular, weight: 400, style: 'normal' },
        { name: 'Heebo', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}

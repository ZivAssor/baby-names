import { ogImage, OG_SIZE } from '@/lib/og';
import { getStory } from '@/lib/stories';

export const alt = 'הסיפור מאחורי השם';
export const size = OG_SIZE;
export const contentType = 'image/png';

// Story titles are full sentences; at the OG headline size they would wrap,
// and satori's fake-RTL (lib/og.tsx#rtlLine) breaks reading order on wrapped
// lines. Keep the headline to the name and put the rest in single-line chips.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let story;
  try {
    story = getStory(decodeURIComponent(slug));
  } catch {
    story = undefined;
  }
  if (!story) {
    return ogImage('סיפורי שמות', ['כשהתרבות פוגשת את חדר הלידה']);
  }
  return ogImage(`השם ${story.name}`, [
    'הסיפור מאחורי השם',
    `${story.eventYear}`,
    'מנתוני הלמ״ס',
  ]);
}

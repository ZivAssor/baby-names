import { ogImage, OG_SIZE } from '@/lib/og';
import { STORIES } from '@/lib/stories';

export const alt = 'סיפורי שמות';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('סיפורי שמות', [
    `${STORIES.length} סיפורים אמיתיים מנתוני השמות`,
    'כשהתרבות פוגשת את חדר הלידה',
  ]);
}

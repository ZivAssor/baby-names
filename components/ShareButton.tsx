'use client';

import { useState } from 'react';
import { CheckIcon, LinkIcon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_URL } from '@/lib/constants';

interface ShareButtonProps {
  /** the message people send, without the URL (it is appended) */
  shareText: string;
  /** site-relative path to share */
  path: string;
}

/**
 * Mobile-first share: native share sheet where available (WhatsApp lives
 * there), wa.me fallback on desktop, plus a copy-link secondary. The shared
 * URL unfurls with the page's dynamic OG card.
 */
export default function ShareButton({ shareText, path }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${path}`;
  // UTM-tagged so shared visits classify as Organic Social in GA4 instead of
  // Direct (WhatsApp app opens carry no referrer). Two sources on purpose:
  // the native sheet's target app is unknowable, only wa.me is provably
  // WhatsApp. The copy-link URL stays clean - it gets pasted anywhere.
  const taggedUrl = (source: string) => `${url}?utm_source=${source}&utm_medium=social`;

  async function share() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: shareText, url: taggedUrl('share_sheet') });
        return;
      } catch {
        // user closed the sheet - nothing to do
        return;
      }
    }
    const waUrl = taggedUrl('whatsapp');
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${waUrl}`)}`,
      '_blank',
      'noopener',
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable - ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={share} className="gap-2">
        <Share2Icon className="h-4 w-4" aria-hidden />
        שתפו
      </Button>
      <Button variant="outline" onClick={copyLink} className="gap-2" aria-live="polite">
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" aria-hidden />
            הועתק!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" aria-hidden />
            העתקת קישור
          </>
        )}
      </Button>
    </div>
  );
}

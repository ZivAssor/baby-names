'use client';

// Static pages are prerendered at build time; render the year client-side so a
// page built in December still shows the right year in January.
// suppressHydrationWarning covers the one-render mismatch across the boundary.
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}

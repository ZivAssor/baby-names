'use client';

import { useRef, useState } from 'react';
import type { NameDetail } from '@/lib/data';

/**
 * Fetches /api/name/[name] with a monotonic request id so an earlier, slower
 * response can never overwrite a later selection (last request wins).
 */
export function useNameDetail(initial: NameDetail) {
  const [detail, setDetail] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestSeq = useRef(0);

  async function selectName(name: string) {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/name/${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error(`name detail ${res.status}`);
      const data = (await res.json()) as NameDetail;
      if (seq !== requestSeq.current) return; // a newer selection superseded this one
      setDetail(data);
    } catch {
      if (seq === requestSeq.current) setError(true);
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }

  return { detail, loading, error, selectName };
}

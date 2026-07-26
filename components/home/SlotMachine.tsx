'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { loadIndex, maskFor, type IndexEntry } from '@/lib/client-index';
import { namePath, type Group } from '@/lib/constants';

const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

type GenderFilter = 'all' | 'm' | 'f';

interface SlotMachineProps {
  group: Group;
}

export default function SlotMachine({ group }: SlotMachineProps) {
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [slots, setSlots] = useState<{ name: string; key: number }[]>([
    { name: '', key: 0 },
    { name: '', key: 1 },
    { name: '', key: 2 },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (index || loadFailed) return;
    let cancelled = false;
    loadIndex()
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [index, loadFailed]);

  // Clear all timers on unmount (the old site leaked these intervals)
  useEffect(() => {
    return () => {
      timers.current.forEach(clearInterval);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  function run() {
    if (!index) return;
    const mask = maskFor(group, genderFilter === 'all' ? undefined : genderFilter);
    const pool = index.filter((entry) => (entry[2] & mask) !== 0);
    if (pool.length === 0) return;

    setIsRunning(true);
    for (let i = 0; i < slots.length; i++) {
      timers.current[i] = setInterval(() => {
        setSlots((prev) => {
          const next = [...prev];
          const pick = pool[Math.floor(Math.random() * pool.length)][0];
          next[i] = { name: pick, key: Math.random() };
          return next;
        });
      }, 100);
    }
    stopTimer.current = setTimeout(() => {
      timers.current.forEach(clearInterval);
      timers.current = [];
      setIsRunning(false);
    }, 1000);
  }

  const filters: { value: GenderFilter; label: string }[] = [
    { value: 'all', label: 'הכל' },
    { value: 'm', label: 'בנים' },
    { value: 'f', label: 'בנות' },
  ];

  return (
    <section className="flex w-full flex-col items-center justify-center rounded-xl border border-border bg-card shadow-sm p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">רולטת השמות</h2>
      <p>מרגישים ברי מזל? 🍀</p>
      <p className="pb-4">נסו את רולטת השמות</p>
      <div className="mb-4 flex gap-2">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded border-2 border-border bg-card p-4"
          >
            <AnimatePresence>
              {slot.name && (
                <motion.div
                  key={slot.key}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute flex h-full w-full items-center justify-center"
                >
                  {isRunning ? (
                    <span>{slot.name}</span>
                  ) : (
                    <Link href={namePath(slot.name)} className="hover:text-primary hover:underline">
                      {slot.name}
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <fieldset className="mb-4 flex gap-4">
        <legend className="sr-only">סינון לפי מגדר</legend>
        {filters.map(({ value, label }) => (
          <label key={value} className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name={`slot-gender-${group}`}
              checked={genderFilter === value}
              onChange={() => setGenderFilter(value)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      {loadFailed && (
        <p className="mb-2 text-sm text-destructive">שגיאה בטעינת רשימת השמות</p>
      )}
      <button
        type="button"
        onClick={() => {
          if (loadFailed) setLoadFailed(false); // re-triggers the load effect
          else run();
        }}
        disabled={isRunning || (!index && !loadFailed)}
        className={`mt-2 rounded-lg px-4 py-2 ${
          isRunning || (!index && !loadFailed)
            ? 'cursor-not-allowed bg-muted-foreground/40 text-card'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {loadFailed ? 'נסו שוב' : index ? 'הפעלה' : 'טוען שמות...'}
      </button>
    </section>
  );
}

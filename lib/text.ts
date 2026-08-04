// Auto-generated Hebrew fact sentences for name pages. These render on the
// server so crawlers and AI assistants get citable factual text, not an empty
// JS shell.
import { FIRST_YEAR, GENDER_LABELS, GROUP_LABELS, LAST_YEAR } from './constants';
import type { NameDetail } from './data';
import { formatNumber } from './format';

export function genderCharacter(detail: NameDetail): string {
  const total = detail.totalM + detail.totalF;
  if (total === 0) return '';
  const mShare = (detail.totalM * 100) / total;
  if (mShare >= 95) return 'שם בנים מובהק';
  if (mShare <= 5) return 'שם בנות מובהק';
  if (mShare >= 60) return 'שם שניתן בעיקר לבנים';
  if (mShare <= 40) return 'שם שניתן בעיקר לבנות';
  return 'שם יוניסקס - ניתן לבנים ולבנות';
}

export function nameFacts(detail: NameDetail): string[] {
  const facts: string[] = [];
  const { name } = detail;

  facts.push(
    `${formatNumber(detail.totalAll)} תושבי ישראל רשומים כיום עם השם ${name}.`,
  );

  const total = detail.totalM + detail.totalF;
  if (detail.totalM > 0 && detail.totalF > 0 && total > 0) {
    const mShare = Math.round((detail.totalM * 100) / total);
    facts.push(
      `${name} הוא ${genderCharacter(detail)}: כ-${mShare}% מבעלי השם הם בנים (${formatNumber(
        detail.totalM,
      )}) וכ-${100 - mShare}% בנות (${formatNumber(detail.totalF)}).`,
    );
  } else if (detail.totalM > 0) {
    facts.push(`${name} הוא שם בנים.`);
  } else if (detail.totalF > 0) {
    facts.push(`${name} הוא שם בנות.`);
  }

  const groupNames = detail.groups.map((g) => GROUP_LABELS[g]);
  facts.push(
    detail.groups.length === 1
      ? `השם מופיע בנתוני הלמ״ס בקרב ${groupNames[0]} בלבד.`
      : `השם מופיע בנתוני הלמ״ס בקרב ${groupNames.join(', ')}.`,
  );

  if (detail.peakYear !== null && detail.peakCount > 0) {
    // When part of the peak-year data is suppressed, the number is a lower bound.
    const peakPhrase =
      detail.peakSuppressedSeries > 0
        ? `לפחות ${formatNumber(detail.peakCount)}`
        : formatNumber(detail.peakCount);
    facts.push(`שנת השיא של השם הייתה ${detail.peakYear}, עם ${peakPhrase} נולדים שקיבלו את השם.`);
  }

  if (detail.firstYear !== null) {
    facts.push(`השם מתועד בנתונים לראשונה אצל ילידי ${detail.firstYear}.`);
  }

  if (detail.latestCount > 0) {
    const latestPhrase =
      detail.latestSuppressedSeries > 0
        ? `לפחות ${formatNumber(detail.latestCount)}`
        : formatNumber(detail.latestCount);
    let latest = `בשנת ${LAST_YEAR} נולדו ${latestPhrase} תינוקות בשם ${name}`;
    if (detail.latestRank) {
      const { group, gender, rank } = detail.latestRank;
      latest += `, מה שהופך אותו לשם ה-${rank} בפופולריות בקרב ${
        GENDER_LABELS[gender]
      } ${GROUP_LABELS[group]}`;
    }
    facts.push(latest + '.');
  } else if (detail.latestSuppressedSeries > 0) {
    facts.push(`בשנת ${LAST_YEAR} נולדו פחות מ-5 תינוקות בשם ${name} בכל קבוצת אוכלוסייה.`);
  } else {
    facts.push(`בשנת ${LAST_YEAR} לא נרשמו נולדים עם השם ${name}.`);
  }

  return facts;
}

// Search-result title. The name leads: the queries these pages actually rank
// for are overwhelmingly the bare name (or "<name> שם"), and in an RTL SERP the
// first words are what the searcher scans and what Google bolds. The count is
// the answer they came for, so it goes in the title rather than only the body.
// `totalAll` is the CBS `t` column, which is never suppressed (its floor is 5),
// so it is safe to print as an exact number - unlike the yearly counts.
export function nameTitle(detail: NameDetail): string {
  return `${detail.name} - ${formatNumber(detail.totalAll)} אנשים בישראל נושאים את השם`;
}

export function nameMetaDescription(detail: NameDetail): string {
  const bits = [
    `${detail.name}: ${formatNumber(detail.totalAll)} תושבי ישראל נושאים את השם`,
  ];
  const character = genderCharacter(detail);
  if (character) bits.push(character);
  if (detail.peakYear !== null) bits.push(`שנת השיא ${detail.peakYear}`);
  bits.push(`גרפים ומגמות לפי שנה ומגדר, נתוני הלמ״ס ${FIRST_YEAR}-${LAST_YEAR}.`);
  return bits.join(' · ');
}

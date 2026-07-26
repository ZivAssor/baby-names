import type { Group, Gender } from './constants';

export interface RawNameSeries {
  /** the name */
  n: string;
  /** CBS all-time total — includes suppressed years and people born before 1949 */
  t: number;
  /** counts per year, index 0 = 1949; -1 means suppressed (a hidden 1–4) */
  c: number[];
}

export interface RawSeriesFile {
  group: Group;
  gender: Gender;
  firstYear: number;
  lastYear: number;
  suppressedSentinel: number;
  names: RawNameSeries[];
}

export interface RawAggregate {
  nameCount: number;
  totalSum: number;
  yearlyVisibleSum: number[];
  yearlySuppressedNames: number[];
}

export interface DirectoryEntry {
  name: string;
  totalAll: number;
  series: { group: Group; gender: Gender; total: number }[];
}

export type SeriesKey = `${Group}-${Gender}`;

export declare const seriesFiles: Record<SeriesKey, RawSeriesFile>;
export declare const aggregatesFile: {
  firstYear: number;
  lastYear: number;
  aggregates: Record<SeriesKey, RawAggregate>;
};
export declare const directory: DirectoryEntry[];
/** [name, totalAll, seriesMask] sorted by totalAll desc; mask bit order: jewish-f, jewish-m, muslim-f, muslim-m, christian-f, christian-m, druze-f, druze-m */
export declare const searchIndex: [string, number, number][];
export declare const meta: {
  source: string;
  sourceDescription: string;
  generatedAt: string;
  firstYear: number;
  lastYear: number;
  suppressedSentinel: number;
  suppressionNote: string;
  sheets: Record<SeriesKey, { nameCount: number; suppressedCells: number }>;
  uniqueNames: number;
};

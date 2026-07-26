// Server-only raw data loader. Deliberately plain JS so the TypeScript checker
// never tries to infer literal types for ~8MB of JSON; types live in load-data.d.ts.
// Static imports mean the bundler ships the data inside the server build —
// no runtime filesystem reads, no file-tracing configuration, works on Vercel.
import jewishF from '@/data/generated/series/jewish-f.json';
import jewishM from '@/data/generated/series/jewish-m.json';
import muslimF from '@/data/generated/series/muslim-f.json';
import muslimM from '@/data/generated/series/muslim-m.json';
import christianF from '@/data/generated/series/christian-f.json';
import christianM from '@/data/generated/series/christian-m.json';
import druzeF from '@/data/generated/series/druze-f.json';
import druzeM from '@/data/generated/series/druze-m.json';
import aggregatesFile from '@/data/generated/aggregates.json';
import directory from '@/data/generated/name-directory.json';
import searchIndex from '@/data/generated/search-index.json';
import meta from '@/data/generated/meta.json';

export const seriesFiles = {
  'jewish-f': jewishF,
  'jewish-m': jewishM,
  'muslim-f': muslimF,
  'muslim-m': muslimM,
  'christian-f': christianF,
  'christian-m': christianM,
  'druze-f': druzeF,
  'druze-m': druzeM,
};

export { aggregatesFile, directory, searchIndex, meta };

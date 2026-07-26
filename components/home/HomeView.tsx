import Link from 'next/link';
import DataInfoCard from '@/components/home/DataInfoCard';
import GenderSplitCard from '@/components/home/GenderSplitCard';
import GroupTabs from '@/components/home/GroupTabs';
import RankedNamesCard, { type RankedPair } from '@/components/home/RankedNamesCard';
import SlotMachine from '@/components/home/SlotMachine';
import StatsCards from '@/components/home/StatsCards';
import TrendCard from '@/components/home/TrendCard';
import { DEFAULT_RANGE, GROUP_LABELS, namePath, type Group } from '@/lib/constants';
import { defaultNameFor, getNameDetail, rarestNames, topNames } from '@/lib/data';

export default function HomeView({ group }: { group: Group }) {
  const { start, end } = DEFAULT_RANGE;
  const top: RankedPair = {
    m: topNames(group, 'm', start, end),
    f: topNames(group, 'f', start, end),
  };
  const bottom: RankedPair = {
    m: rarestNames(group, 'm', start, end),
    f: rarestNames(group, 'f', start, end),
  };
  const showcase = getNameDetail(defaultNameFor(group));
  if (!showcase) throw new Error(`default showcase name missing for group ${group}`);

  return (
    <>
      <div className="pt-8 pb-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {group === 'jewish' ? (
            <>איזה שם ניתן הכי הרבה בישראל?</>
          ) : (
            <>שמות {GROUP_LABELS[group]} בישראל</>
          )}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          כל השמות הפרטיים בישראל מ-1949 ועד היום, על בסיס הנתונים הרשמיים של הלשכה
          המרכזית לסטטיסטיקה - מגמות, השוואות וסיפורים.
        </p>
        <Link
          href={namePath(showcase.name)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
        >
          <span aria-hidden>✨</span>
          השם היומי: {showcase.name}
        </Link>
      </div>
      <GroupTabs active={group} />
      <StatsCards group={group} />
      <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2 lg:grid-cols-3">
        <RankedNamesCard mode="top" group={group} initial={top} initialStart={start} initialEnd={end} />
        <GenderSplitCard group={group} initial={showcase} />
        <SlotMachine group={group} />
      </div>
      <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        <RankedNamesCard mode="bottom" group={group} initial={bottom} initialStart={start} initialEnd={end} />
        <TrendCard group={group} initial={showcase} />
      </div>
      <div className="py-2">
        <DataInfoCard />
      </div>
    </>
  );
}

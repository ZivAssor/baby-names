import DataInfoCard from '@/components/home/DataInfoCard';
import GenderSplitCard from '@/components/home/GenderSplitCard';
import GroupTabs from '@/components/home/GroupTabs';
import RankedNamesCard, { type RankedPair } from '@/components/home/RankedNamesCard';
import SlotMachine from '@/components/home/SlotMachine';
import StatsCards from '@/components/home/StatsCards';
import TrendCard from '@/components/home/TrendCard';
import { DEFAULT_RANGE, GROUP_LABELS, SITE_NAME, type Group } from '@/lib/constants';
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
      <h1 className="pt-4 text-center text-2xl font-bold">
        {SITE_NAME} <span aria-hidden>🇮🇱</span>
        {group !== 'jewish' && (
          <span className="block pt-1 text-lg font-semibold text-gray-600">
            שמות {GROUP_LABELS[group]}
          </span>
        )}
      </h1>
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
